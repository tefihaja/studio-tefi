# Studio Tefi

Planning éditorial, production, Projection, Business et facturation.

Fichiers du site :
- `index.html` : l'application
- `sw.js` : le mode hors connexion (à garder à côté de `index.html`)
- `versions/` : les anciennes versions archivées

Pour retrouver tes données sur tous tes appareils, active la synchro GitHub dans **Réglages** avec un jeton qui a la permission `gist`.

## Comptes en ligne (version 5.0, Supabase)

- `supabase-setup.sql` : à coller une seule fois dans Supabase → SQL Editor → Run. Il crée les tables, les comptes admin/assistante, les règles de sécurité et l'espace photos. Il peut être relancé sans perte de données.
- La clé écrite dans `index.html` est la clé **publique** (publishable). Ne jamais y mettre la clé « secret » / « service_role ».
- Le premier compte créé devient admin. Les suivants attendent ta validation dans Réglages → Comptes.
