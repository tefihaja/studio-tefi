-- =====================================================================
--  Studio Tefi · installation Supabase (version 6.1)
--  À coller en entier dans Supabase → SQL Editor → New query → Run.
--  Le script peut être relancé sans risque : il ne supprime aucune donnée.
-- =====================================================================

-- 1. Comptes ---------------------------------------------------------------
--    Le tout premier compte créé devient « admin ».
--    Les suivants sont « en attente » jusqu'à ce que l'admin les valide dans l'appli.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  role        text not null default 'pending' check (role in ('admin','assistant','pending','blocked')),
  created_at  timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, email, role)
  values (new.id, new.email,
          case when exists (select 1 from public.profiles where role = 'admin') then 'pending' else 'admin' end)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Comptes déjà créés avant ce script
insert into public.profiles(id, email, role)
select u.id, u.email, 'pending' from auth.users u
on conflict (id) do nothing;
update public.profiles set role = 'admin'
where id = (select id from public.profiles order by created_at limit 1)
  and not exists (select 1 from public.profiles where role = 'admin');

-- 2. Données de l'appli ----------------------------------------------------
create table if not exists public.items (
  col         text not null,
  id          text not null,
  data        jsonb not null default '{}'::jsonb,
  deleted     boolean not null default false,
  updated_at  timestamptz not null default now(),
  updated_by  uuid default auth.uid(),
  primary key (col, id)
);
create index if not exists items_col_updated on public.items (col, updated_at desc);
-- Types d'éléments autorisés (mis à jour en 6.1 : déplacements, indisponibilités et projets)
alter table public.items drop constraint if exists items_col_check;
alter table public.items add constraint items_col_check check (col in ('contents','accounts','rdv','docs','media','deals','contacts','history','tasks','requests','trips','unavail','projects'));

create table if not exists public.app_settings (
  id          text primary key default 'main' check (id = 'main'),
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  uuid default auth.uid()
);

-- 3. Fonctions de contrôle -------------------------------------------------
create or replace function public.my_role()
returns text language sql stable security definer set search_path = public as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'none')
$$;

create or replace function public.is_member()
returns boolean language sql stable security definer set search_path = public as $$
  select public.my_role() in ('admin','assistant')
$$;

-- Autorisations de l'assistante : celles réglées dans l'appli, sinon les valeurs par défaut.
create or replace function public.perm(k text)
returns boolean language sql stable security definer set search_path = public as $$
  select case
    when public.my_role() = 'admin' then true
    when public.my_role() <> 'assistant' then false
    else coalesce(
      (select (data -> 'perms' ->> k)::boolean from public.app_settings where id = 'main'),
      ('{"projEdit":true,"projStatus":true,"projDelete":false,"projection":true,"budget":true,"calMove":true,
         "ideaDeleteOwn":true,"accounts":true,"stats":true,"rdv":true,"clients":true,"devis":true,"factures":true,
         "toCollect":true,"suivis":true,"payStatus":true,"entreprises":true,"prestaEdit":false,"collabs":true,
         "contacts":true,"history":false,"requests":true,"trips":true,"projets":true}'::jsonb ->> k)::boolean,
      false)
  end
$$;

create or replace function public.can_read(c text)
returns boolean language sql stable security definer set search_path = public as $$
  select case
    when not public.is_member() then false
    when public.my_role() = 'admin' then true
    when c in ('contents','accounts') then true
    when c = 'rdv'      then public.perm('rdv')
    when c = 'docs'     then public.perm('devis') or public.perm('factures') or public.perm('toCollect')
                             or public.perm('suivis') or public.perm('payStatus')
    when c = 'media'    then public.perm('projection')
    when c = 'deals'    then public.perm('collabs')
    when c = 'contacts' then public.perm('contacts')
    when c = 'history'  then public.perm('history')
    when c in ('tasks','requests') then true
    when c = 'trips'    then public.perm('trips')
    when c in ('unavail','projects') then true
    else false
  end
$$;

-- 4. Garde-fous à l'écriture (assistante) -----------------------------------
create or replace function public.items_guard()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  r text := public.my_role();
  own_idea boolean;
  was_deleted boolean := coalesce(case when tg_op = 'UPDATE' then old.deleted end, true);
  ok boolean;
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  if r = 'admin' or auth.uid() is null then return new; end if;
  if r <> 'assistant' then raise exception 'Compte non validé' using errcode = '42501'; end if;

  own_idea := new.col = 'contents'
              and coalesce(new.data ->> 'author', '') = 'assistant'
              and coalesce(new.data ->> 'status', '') = 'idee'
              and coalesce(new.data ->> 'ideaState', '') <> 'validee';

  -- Seule l'admin signe les devis et factures (l'assistante peut seulement retirer une signature en modifiant le document)
  if new.col = 'docs' and coalesce(jsonb_typeof(new.data -> 'signed'), 'null') <> 'null'
     and (tg_op = 'INSERT' or (new.data -> 'signed') is distinct from (old.data -> 'signed')) then
    raise exception 'Seule l''admin peut signer un document' using errcode = '42501';
  end if;

  -- Seule l'admin valide les idées
  if new.col = 'contents' and coalesce(new.data ->> 'ideaState','') = 'validee'
     and (tg_op = 'INSERT' or coalesce(old.data ->> 'ideaState','') <> 'validee')
     and coalesce(new.data ->> 'status','') = 'idee' then
    raise exception 'Seule l''admin peut valider une idée' using errcode = '42501';
  end if;

  if new.col = 'history' then
    if tg_op = 'UPDATE' then raise exception 'Historique non modifiable' using errcode = '42501'; end if;
    return new;
  end if;

  if new.deleted and not was_deleted then
    ok := case new.col
      when 'contents' then public.perm('projDelete') or (own_idea and public.perm('ideaDeleteOwn'))
      when 'accounts' then public.perm('accounts')
      when 'rdv'      then public.perm('rdv')
      when 'docs'     then case when new.data ->> 'kind' = 'devis' then public.perm('devis') else public.perm('factures') end
      when 'media'    then public.perm('projection')
      when 'deals'    then public.perm('collabs')
      when 'contacts' then public.perm('contacts')
      when 'tasks'    then true
      when 'requests' then public.perm('requests')
      when 'trips'    then public.perm('trips')
      when 'unavail'  then coalesce(new.data ->> 'who','') = 'assistant'
      when 'projects' then public.perm('projets') and coalesce(new.data ->> 'createdBy','') = 'assistant'
      else false end;
  else
    ok := case new.col
      when 'contents' then own_idea or public.perm('projEdit') or public.perm('projStatus') or public.perm('calMove')
                           or public.perm('budget') or public.perm('stats') or public.perm('projection')
      when 'accounts' then public.perm('accounts')
      when 'rdv'      then public.perm('rdv')
      when 'docs'     then public.perm('devis') or public.perm('factures') or public.perm('payStatus') or public.perm('suivis')
      when 'media'    then public.perm('projection')
      when 'deals'    then public.perm('collabs')
      when 'contacts' then public.perm('contacts')
      when 'tasks'    then coalesce(new.data ->> 'owner','') <> 'admin' or coalesce(new.data ->> 'assignedBy','') = 'admin'
      when 'requests' then public.perm('requests')
      when 'trips'    then public.perm('trips')
      -- l'assistante ne fait que des demandes : jamais validées par elle-même, jamais sur les dates de Tefi
      when 'unavail'  then coalesce(new.data ->> 'who','') = 'assistant' and coalesce(new.data ->> 'status','') = 'pending'
                           and (tg_op = 'INSERT' or coalesce(old.data ->> 'who','') = 'assistant')
      when 'projects' then public.perm('projets')
      else false end;
  end if;
  if not ok then raise exception 'Action non autorisée pour l''assistante' using errcode = '42501'; end if;
  return new;
end $$;

drop trigger if exists items_guard on public.items;
create trigger items_guard before insert or update on public.items
  for each row execute function public.items_guard();

create or replace function public.settings_guard()
returns trigger language plpgsql security definer set search_path = public as $$
declare r text := public.my_role();
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  if r = 'admin' or auth.uid() is null then return new; end if;
  if r <> 'assistant' then raise exception 'Compte non validé' using errcode = '42501'; end if;
  if tg_op = 'INSERT' then raise exception 'Réglages initiaux réservés à l''admin' using errcode = '42501'; end if;
  -- Champs que l'assistante ne peut jamais changer
  if (new.data -> 'perms') is distinct from (old.data -> 'perms')
     or (new.data -> 'pinHash') is distinct from (old.data -> 'pinHash')
     or (new.data -> 'profiles') is distinct from (old.data -> 'profiles')
     or (new.data -> 'assistantName') is distinct from (old.data -> 'assistantName')
     or (new.data -> 'uiThemes') is distinct from (old.data -> 'uiThemes')
     or (new.data -> 'signature') is distinct from (old.data -> 'signature')
     or (new.data -> 'showAssistPlan') is distinct from (old.data -> 'showAssistPlan')
     or (new.data -> 'offPersoMax') is distinct from (old.data -> 'offPersoMax')
     or (new.data -> 'homeLayout' -> 'admin') is distinct from (old.data -> 'homeLayout' -> 'admin') then
    raise exception 'Réglage réservé à l''admin' using errcode = '42501';
  end if;
  if (new.data -> 'companies') is distinct from (old.data -> 'companies') and not public.perm('clients') then
    raise exception 'Gestion des clients non autorisée' using errcode = '42501';
  end if;
  if (new.data -> 'prestations') is distinct from (old.data -> 'prestations') and not public.perm('prestaEdit') then
    raise exception 'Catalogue de prestations non autorisé' using errcode = '42501';
  end if;
  return new;
end $$;

drop trigger if exists settings_guard on public.app_settings;
create trigger settings_guard before insert or update on public.app_settings
  for each row execute function public.settings_guard();

-- Personne ne change son propre rôle ; seule l'admin gère les comptes
create or replace function public.profiles_guard()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and public.my_role() <> 'admin' then
    raise exception 'Réservé à l''admin' using errcode = '42501';
  end if;
  if old.role = 'admin' and new.role <> 'admin'
     and (select count(*) from public.profiles where role = 'admin') <= 1 then
    raise exception 'Il faut garder au moins un compte admin' using errcode = '42501';
  end if;
  return new;
end $$;

drop trigger if exists profiles_guard on public.profiles;
create trigger profiles_guard before update on public.profiles
  for each row execute function public.profiles_guard();

-- 5. Règles d'accès (RLS) --------------------------------------------------
alter table public.profiles     enable row level security;
alter table public.items        enable row level security;
alter table public.app_settings enable row level security;

drop policy if exists profiles_read  on public.profiles;
drop policy if exists profiles_admin on public.profiles;
create policy profiles_read  on public.profiles for select to authenticated
  using (id = auth.uid() or public.my_role() = 'admin');
create policy profiles_admin on public.profiles for update to authenticated
  using (public.my_role() = 'admin') with check (public.my_role() = 'admin');

drop policy if exists items_read   on public.items;
drop policy if exists items_insert on public.items;
drop policy if exists items_update on public.items;
drop policy if exists items_delete on public.items;
create policy items_read   on public.items for select to authenticated using (
  public.can_read(col)
  and not (col = 'tasks' and coalesce((data ->> 'private')::boolean, false) and coalesce(data ->> 'ownerUid','') <> auth.uid()::text));
create policy items_insert on public.items for insert to authenticated with check (public.is_member() and (col = 'history' or public.can_read(col)));
create policy items_update on public.items for update to authenticated using (public.can_read(col)) with check (public.can_read(col));
create policy items_delete on public.items for delete to authenticated using (public.my_role() = 'admin');

drop policy if exists settings_read   on public.app_settings;
drop policy if exists settings_insert on public.app_settings;
drop policy if exists settings_update on public.app_settings;
create policy settings_read   on public.app_settings for select to authenticated using (public.is_member());
create policy settings_insert on public.app_settings for insert to authenticated with check (public.is_member());
create policy settings_update on public.app_settings for update to authenticated using (public.is_member()) with check (public.is_member());

grant select, insert, update, delete on public.items, public.app_settings to authenticated;
grant select, update on public.profiles to authenticated;
revoke all on public.items, public.app_settings, public.profiles from anon;

-- 6. Photos (espace de stockage privé) -------------------------------------
insert into storage.buckets (id, name, public)
values ('photos', 'photos', false)
on conflict (id) do nothing;

drop policy if exists "studio photos read"   on storage.objects;
drop policy if exists "studio photos add"    on storage.objects;
drop policy if exists "studio photos change" on storage.objects;
drop policy if exists "studio photos remove" on storage.objects;
-- admin/  : signature et cachets, lisibles par l'admin seulement
-- signed/ : PDF signés, lisibles par l'équipe mais créés par l'admin seulement
create policy "studio photos read"   on storage.objects for select to authenticated
  using (bucket_id = 'photos' and public.is_member() and (name not like 'admin/%' or public.my_role() = 'admin'));
create policy "studio photos add"    on storage.objects for insert to authenticated
  with check (bucket_id = 'photos' and public.is_member() and ((name not like 'admin/%' and name not like 'signed/%') or public.my_role() = 'admin'));
create policy "studio photos change" on storage.objects for update to authenticated
  using (bucket_id = 'photos' and public.is_member() and ((name not like 'admin/%' and name not like 'signed/%') or public.my_role() = 'admin'))
  with check (bucket_id = 'photos' and public.is_member() and ((name not like 'admin/%' and name not like 'signed/%') or public.my_role() = 'admin'));
create policy "studio photos remove" on storage.objects for delete to authenticated
  using (bucket_id = 'photos' and public.my_role() = 'admin');

-- 7. Mise à jour en direct sur tous les appareils --------------------------
do $$
begin
  begin alter publication supabase_realtime add table public.items;        exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.app_settings; exception when duplicate_object then null; end;
end $$;

-- Terminé. Le résultat attendu est « Success. No rows returned ».
