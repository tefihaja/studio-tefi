(function(){
"use strict";
const MORPH_TPL=document.createElement('template');
function morphCompatible(o,n){
if(o.nodeType!==n.nodeType)return false;
if(o.nodeType!==1)return true;
if(o.nodeName!==n.nodeName)return false;
const A=o.attributes,B=n.attributes;if(A.length!==B.length)return false;
for(let i=0;i<A.length;i++){if(A[i].name!==B[i].name)return false;}
if(o.id!==n.id)return false;
if(o.nodeName==='INPUT'&&o.type!==n.type)return false;
return true;
}
function morphNode(o,n){
const A=o.attributes,B=n.attributes;
for(let i=0;i<B.length;i++){if(A[i].value!==B[i].value)o.setAttribute(B[i].name,B[i].value);}
const tag=o.nodeName,focused=o===document.activeElement;
if(tag==='INPUT'){
if(!focused){if(o.type==='checkbox'||o.type==='radio'){const c=n.hasAttribute('checked');if(o.checked!==c)o.checked=c;}
else if(o.type!=='file'){const v=n.getAttribute('value')||'';if(o.value!==v)o.value=v;}}
return;}
if(tag==='TEXTAREA'){const v=n.value;if(o.defaultValue!==v)o.defaultValue=v;if(!focused&&o.value!==v)o.value=v;return;}
morphChildren(o,n);
if(tag==='SELECT'&&!focused){if(o.selectedIndex!==n.selectedIndex)o.selectedIndex=n.selectedIndex;}
}
function morphChildren(o,n){
let oc=o.firstChild,nc=n.firstChild;
while(nc){const nnext=nc.nextSibling;
if(!oc){o.appendChild(nc);}
else if(morphCompatible(oc,nc)){if(oc.nodeType===1)morphNode(oc,nc);else if(oc.nodeValue!==nc.nodeValue)oc.nodeValue=nc.nodeValue;oc=oc.nextSibling;}
else{const onext=oc.nextSibling;o.replaceChild(nc,oc);oc=onext;}
nc=nnext;}
while(oc){const x=oc.nextSibling;o.removeChild(oc);oc=x;}
}
function morph(el,html){if(el.__mh===html&&el.firstChild)return;MORPH_TPL.innerHTML=html;morphChildren(el,MORPH_TPL.content);MORPH_TPL.innerHTML='';el.__mh=html;}
['input','change','toggle'].forEach(t=>document.addEventListener(t,e=>{let n=e.target;while(n){if(n.__mh)n.__mh=null;n=n.parentNode;}},true));
let DV=0;const MEMO=new Map();
function touch(){DV++;}
function memo(key,fn){const e=MEMO.get(key);if(e&&e.dv===DV)return e.v;const v=fn();if(MEMO.size>300)MEMO.clear();MEMO.set(key,{dv:DV,v});return v;}
let renderHidden=false;
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&renderHidden){renderHidden=false;scheduleRender();}});
const APP_VERSION='6.0.2';
const VERSIONS=[
{v:'6.0.2',date:'2026-10-17',items:['Page d\'accueil : vidéo de bienvenue pour l\'assistante']},
{v:'6.0.1',date:'2026-10-16',items:['Correction (comptes en ligne) : les actions de l\'assistante ne sont plus refusées à cause de l\'historique']},
{v:'6.0',date:'2026-10-16',items:['Optimisation complète : l\'écran ne met à jour que ce qui change, les calculs sont mémorisés, rien ne tourne quand l\'onglet est caché (jusqu\'à 10× plus rapide avec beaucoup de données)','Données plus légères : l\'historique ne garde que ce qui a changé, logos rangés dans l\'espace de stockage, sauvegardes groupées','Version GitHub découpée en fichiers gardés en mémoire par le navigateur','Résumés différents pour l\'admin et l\'assistante, personnalisables (ordre et blocs affichés) : À traiter, rendez-vous du mois, projets du mois, le mois en chiffres, point de la semaine','Priorités des rendez-vous (Facultatif → Impératif) : calendrier, filtre, rappels plus tôt pour les impératifs','Plans de travail de l\'assistante : tâches Urgent → Facultatif, étapes, répétitions, rappels, modèles, tâches privées et tâches automatiques ; visibles chez l\'admin seulement quand elle le décide','Demandes à Tefi : signature, statut de facture, rushs, publication, dépense, question ; fil de discussion, « Relancer Tefi » après 24 h, fermeture automatique','Cloche « À traiter » avec notifications, et bouton « Traiter » qui t\'emmène au bon endroit','Signature dessinée ou importée, cachet par entreprise, « Demander la signature » et « Signer » : PDF signé figé, signature retirée si le document change']},
{v:'5.1.1',date:'2026-10-16',items:['Correction : le devis ou la facture se ferme de nouveau avec la croix et s\'enregistre correctement (admin et assistante)','Les champs chiffrés à 0 se sélectionnent au clic : plus de « 010 » dans la remise ou la TVA']},
{v:'5.1',date:'2026-10-16',items:['Menu latéral réductible : icônes seules ou menu complet, mémorisé sur chaque appareil','Couleurs de l\'interface : 8 assemblages + couleur perso, choisis par l\'admin pour sa vue et pour celle de l\'assistante','Entreprises et clients en liste compacte : la fiche complète s\'ouvre avec « Modifier »','Réseaux : résumé de chaque compte et style de contenu (thématiques + ton), comptes suggérés dans la fiche d\'un contenu','Version GitHub : page d\'accueil avec « Se connecter » et « Pas de compte ? Inscris-toi »','Version GitHub : un compte différent par onglet pour tester, déconnexion limitée à l\'appareil']},
{v:'5.0',date:'2026-10-16',items:['Version GitHub : vrais comptes en ligne (Supabase) avec e-mail et mot de passe, pour toi et ton assistante','Sécurité côté serveur : les autorisations de l\'assistante sont vérifiées par la base, plus seulement par l\'écran','Mise à jour en direct sur tous les appareils, et changements gardés en attente hors connexion','Photos rangées dans un espace de stockage privé','Réglages → Comptes : valider ou couper l\'accès d\'un compte','Reprise en un clic des données et photos de l\'ancienne version']},
{v:'4.0',date:'2026-10-16',items:[
"Nouvel onglet Projection : rushs à télécharger, versions à valider (liens vidéo, photos déposées ou liens), lecteur intégré, retours minutés ou repères sur photo, cases à cocher, rapport de corrections en PDF, validation → « Prêt à publier »",
"Synchro GitHub fiable à deux : fusion élément par élément, plus de modification perdue, sauvegarde automatique chaque semaine",
"Résumé : « Aujourd'hui » / « Mes tâches du jour », alertes cliquables, objectifs du mois",
"Projets : checklist, modèles de projet, discussion, budget et dépenses avec bénéfice, versions et factures liées",
"Calendrier : jours fériés malgaches, export vers Google Agenda ou iPhone, rappels",
"Réseaux : statistiques par publication, performances par compte, format, thématique, jour et heure, abonnés, kit média en PDF",
"Business : partenariats, contacts, factures récurrentes, message de relance prêt à envoyer (WhatsApp), reçu de paiement en PDF",
"Recherche globale et mode hors connexion sur le site GitHub"
]},
{v:'3.4',date:'2026-10-16',items:[
"Onglet Suivis : acomptes et paiements en montant ou en pourcentage (ex. 40 %), reste à payer et barre de créance par client",
"Badges « À relancer », « Relancer en urgence », « Relancé le… » et compte à rebours : « 15 jours restants pour payer », « 2 jours de retard »",
"Acompte demandé sur les devis et factures, acomptes reçus et reste à payer sur le PDF",
"Nouvelles devises personnalisables (Mes entreprises → Devises)",
"Les paiements saisis par l'assistante attendent ta validation"
]},
{v:'3.3',date:'2026-10-16',items:[
"Chaque onglet garde sa propre vue : actualiser ne fait plus passer d'admin à assistante (ou l'inverse)",
"La vue admin n'est plus retenue par défaut : un nouvel onglet redemande le code PIN, sauf si tu coches « Garder la vue admin 30 jours »",
"Deux onglets ouverts sur le même appareil se mettent à jour entre eux automatiquement"
]},
{v:'3.2',date:'2026-10-16',items:[
"« Boîtes » devient « Clients », avec une fiche complète : contact, téléphone, e-mail, NIF, STAT, RCS, adresse, pays",
"Autorisations de l'assistante : interrupteurs dans Réglages pour chaque fonction",
"L'assistante peut faire devis, factures et PDF, voit l'argent à réclamer (sans le chiffre d'affaires) et « Les entreprises » en lecture seule",
"Ses changements de statut (payée, annulée, accepté, refusé) attendent ta validation dans « À valider »"
]},
{v:'3.1',date:'2026-10-16',items:[
"Facturation dans Business : profils de tes entreprises (nom, téléphone, mail, NIF, STAT, RCS, adresse, pays, logo, coordonnées de paiement)",
'Devis et factures : prestations, quantités, remise, TVA, devise (Ariary, euro, dollar), numérotation automatique, montant en toutes lettres',
'Export PDF des devis et factures, transformation d\'un devis en facture, suivi « payée / en retard »',
'Catalogue de prestations, infos de facturation des boîtes clientes, revenus par client',
'Un projet peut être relié à une boîte (client)'
]},
{v:'3.0',date:'2026-10-16',items:[
'Deux vues : Admin (protégée par code PIN) et Assistante, avec sa propre couleur',
"Circuit des idées : l'assistante propose (comptes visés, liens de référence), l'admin valide, renvoie « à retravailler » ou refuse avec un commentaire",
'Les idées validées passent en écriture en un clic, avec leurs comptes déjà ajoutés',
'Onglet Business : rendez-vous pro ou perso, boîtes avec leurs couleurs, et rendez-vous affichés dans le calendrier',
'Liens vers tes comptes et bouton « Préparer la publication » (copie la légende et ouvre Meta Business Suite, TikTok Studio…)',
"L'historique indique qui a fait chaque modification"
]},
{v:'2.2',date:'2026-10-16',items:[
"Chaque diffusion se choisit en deux temps : d'abord la distribution (réseaux, TV, cinéma…), puis le compte, la chaîne ou la salle",
"Une diffusion peut rester « à préciser » (ex. Cinéma, salle pas encore choisie)",
"Ajout de compte : choix de la distribution avant la plateforme",
"Synchro GitHub : récupération automatique toutes les minutes quand l'appli est ouverte"
]},
{v:'2.1',date:'2026-10-16',items:[
"Plusieurs tournages par contenu, chacun d'un jour ou sur plusieurs jours (du… au…), avec son lieu et une note",
'Nouvelle étape « En production » entre Écriture et Tournage',
'Types de distribution : réseaux sociaux, TV, cinéma, streaming, festival — et indication « Uniquement réseaux » sur chaque contenu'
]},
{v:'2.0',date:'2026-10-16',items:[
"Onglet Réseaux : plateformes et comptes au même endroit, et ajout rapide d'un compte dès l'accueil",
'Nature du compte : perso ou pro (filtrable partout)',
'Thématiques de contenu (sport, lifestyle, cinématique…) en plus du format',
"Résumé cliquable : chaque élément s'ouvre en aperçu pour changer la date, marquer publié, modifier ou supprimer",
'Historique des modifications avec restauration et bouton Annuler après une suppression',
'Synchronisation GitHub pour la version hébergée sur GitHub Pages'
]},
{v:'1.0',date:'2026-10-16',items:[
'Contenus typés, diffusion sur plusieurs comptes, script en scènes',
'Calendrier mois, semaine et liste avec glisser-déposer',
'Tableau de production, banque d\'idées, export et import'
]}
];
const STATUSES=[
{id:'idee',label:'Idée',c:'#8A8FA3'},{id:'ecriture',label:'Écriture',c:'#5B6CFF'},{id:'production',label:'En production',c:'#9B4DCA'},
{id:'tournage',label:'Tournage',c:'#E0533D'},{id:'montage',label:'Montage',c:'#C98C00'},
{id:'pret',label:'Prêt',c:'#14A37F'},{id:'publie',label:'Publié',c:'#5D6472'}
];
const NATURES=[{id:'perso',label:'Perso'},{id:'pro',label:'Pro'}];
const DEFAULT_SETTINGS={
types:[
{id:'skit',label:'Skit',color:'#E4572E'},{id:'court',label:'Court métrage',color:'#7B2CBF'},
{id:'concept',label:'Concept',color:'#0F7B6C'},{id:'podcast',label:'Podcast',color:'#B5651D'},
{id:'vlog',label:'Vlog',color:'#2E86AB'},{id:'tuto',label:'Tutoriel',color:'#3A7D44'},
{id:'interview',label:'Interview',color:'#9C3D54'},{id:'coulisses',label:'Coulisses',color:'#6C757D'},
{id:'trend',label:'Trend / Challenge',color:'#D81E5B'},{id:'live',label:'Live',color:'#C1121F'},
{id:'carrousel',label:'Carrousel photo',color:'#5465FF'},{id:'story',label:'Story',color:'#E08E0B'},
{id:'reel',label:'Reel',color:'#8338EC'},{id:'promo',label:'Annonce / Promo',color:'#2B9348'}
],
themes:[
{id:'sport',label:'Sport'},{id:'lifestyle',label:'Lifestyle'},{id:'cinematique',label:'Cinématique'},
{id:'humour',label:'Humour'},{id:'food',label:'Food'},{id:'voyage',label:'Voyage'},
{id:'mode',label:'Mode / Beauté'},{id:'musique',label:'Musique'},{id:'tech',label:'Tech'},
{id:'education',label:'Éducation'},{id:'business',label:'Business'},{id:'culture',label:'Culture malgache'},
{id:'famille',label:'Famille'},{id:'motivation',label:'Motivation'}
],
platforms:[
{id:'facebook',label:'Facebook',color:'#1877F2',channel:'social'},
{id:'tiktok',label:'TikTok',color:'#00A3A3',channel:'social'},
{id:'instagram',label:'Instagram',color:'#D62976',channel:'social'}
],
companies:[],
persoColor:'#E08E0B',
channels:[
{id:'social',label:'Réseaux sociaux'},{id:'tv',label:'TV'},{id:'cinema',label:'Cinéma'},
{id:'streaming',label:'Streaming / VOD'},{id:'festival',label:'Festival'}
]
};
const MONTHS=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const MSHORT=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
const DAYS=['lun','mar','mer','jeu','ven','sam','dim'];
const DAYS_LONG=['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
const LS_ROLE='studio-tefi-role-v1';
const LS_DATA='studio-tefi-data-v1',LS_UI='studio-tefi-ui-v1',LS_GIST='studio-tefi-gist-v1';
const HMAX_CLOUD=300,HMAX_LOCAL=150;
const SV='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
const ICON={
left:SV+'<path d="M15 6l-6 6 6 6"/></svg>',right:SV+'<path d="M9 6l6 6-6 6"/></svg>',
x:SV+'<path d="M6 6l12 12M18 6L6 18"/></svg>',plus:SV+'<path d="M12 5v14M5 12h14"/></svg>',
search:SV+'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
arrow:SV+'<path d="M5 12h14M13 6l6 6-6 6"/></svg>',
copy:SV+'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>',
check:SV+'<path d="M5 12l5 5 9-10"/></svg>',
edit:SV+'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/></svg>',
trash:SV+'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
undo:SV+'<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/></svg>'
};
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const pad=n=>String(n).padStart(2,'0');
const ds=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const pd=s=>{const a=String(s).split('-').map(Number);return new Date(a[0],a[1]-1,a[2]);};
const addDays=(s,n)=>{const d=pd(s);d.setDate(d.getDate()+n);return ds(d);};
const today=()=>ds(new Date());
const dow=s=>(pd(s).getDay()+6)%7;
const weekStart=s=>addDays(s,-dow(s));
const diffDays=(a,b)=>Math.round((pd(a)-pd(b))/864e5);
const fmtDay=s=>{const d=pd(s);return DAYS_LONG[dow(s)]+' '+d.getDate()+' '+MONTHS[d.getMonth()];};
const fmtShort=s=>{const d=pd(s);return d.getDate()+' '+MSHORT[d.getMonth()];};
const fmtStamp=t=>{const d=new Date(t);return d.getDate()+' '+MSHORT[d.getMonth()]+' · '+pad(d.getHours())+':'+pad(d.getMinutes());};
const rel=s=>{const n=diffDays(s,today());if(n===0)return"aujourd'hui";if(n===1)return'demain';if(n===-1)return'hier';return n>0?'dans '+n+' j':'il y a '+(-n)+' j';};
const clone=o=>o==null?o:JSON.parse(JSON.stringify(o));
const isValidDate=s=>/^\d{4}-\d{2}-\d{2}$/.test(s||'');
const plural=(n,a,b)=>n+' '+(n>1?(b||a+'s'):a);
function lsGet(k){try{return JSON.parse(localStorage.getItem(k)||'null');}catch(e){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}}
const toMap=a=>{const m={};(a||[]).forEach(x=>{if(x&&x.id)m[x.id]=x;});return m;};
const savedUI=lsGet(LS_UI)||{};
const S={contents:{},accounts:{},rdv:{},docs:{},media:{},deals:{},contacts:{},tasks:{},requests:{},deleted:{},settings:null,history:[],mode:'pending',loaded:false,
ui:Object.assign({calMode:'month',cursor:today(),selDay:today(),showProd:true,listMode:'board',search:'',ideaType:'concept',homeSel:'upcoming',showRdv:true,bizTab:'rdv',rdvFilter:''},savedUI)};
S.ui.view='home';S.ui.cursor=today();S.ui.selDay=today();
S.ui.filters=Object.assign({channel:'',platform:'',account:'',nature:'',type:'',theme:'',status:''},savedUI.filters||{});
const VIEW_IDS=['home','networks','calendar','contents','ideas','projection','business','settings','more','search','plans'];
let hashView=null;if(location.hash){const h=location.hash.slice(1);if(VIEW_IDS.includes(h))hashView=h;}
if(hashView)S.ui.view=hashView;
const saveUI=()=>{const u=Object.assign({},S.ui);delete u.view;lsSet(LS_UI,u);};
function settings(){const st=S.settings||{};return Object.assign({},st,{currencies:st.currencies||[],perms:st.perms||{},types:st.types||DEFAULT_SETTINGS.types,themes:st.themes||DEFAULT_SETTINGS.themes,platforms:(st.platforms||DEFAULT_SETTINGS.platforms).map(p=>p.channel?p:Object.assign({},p,{channel:'social'})),channels:st.channels||DEFAULT_SETTINGS.channels,companies:st.companies||[],profiles:st.profiles||[],prestations:st.prestations||[],persoColor:st.persoColor||DEFAULT_SETTINGS.persoColor,pinHash:st.pinHash||'',assistantName:st.assistantName||''});}
const typeOf=id=>settings().types.find(t=>t.id===id)||{id:'',label:'Sans format',color:'#8A8FA3'};
const themeOf=id=>settings().themes.find(t=>t.id===id);
const platOf=id=>settings().platforms.find(p=>p.id===id)||{id:'',label:'Plateforme ?',color:'#8A8FA3',channel:'social'};
const chanOf=id=>settings().channels.find(c=>c.id===id)||{id:id||'',label:'Autre'};
const isSocial=pid=>(platOf(pid).channel||'social')==='social';
function pubChannel(p){const a=S.accounts[p.accountId];return a?(platOf(a.platform).channel||'social'):(p.channel||'');}
function distOf(c){const out=[];(c.publications||[]).forEach(p=>{const ch=pubChannel(p);if(ch&&!out.includes(ch))out.push(ch);});return out;}
const pendingLabel=p=>p&&p.channel?chanOf(p.channel).label+' · à préciser':'Compte à choisir';
function distLabel(c){const d=distOf(c);if(!d.length)return'';if(d.length===1&&d[0]==='social')return'Uniquement réseaux';return d.map(id=>chanOf(id).label).join(' + ');}
const distPill=c=>{const l=distLabel(c);return l?'<span class="pill plain" title="Distribution">'+esc(l)+'</span>':'';};
const shootEnd=s=>isValidDate(s.end)&&s.end>=s.start?s.end:s.start;
function fmtShoot(s){if(!isValidDate(s.start))return'Date à fixer';const e=shootEnd(s);if(e===s.start)return fmtShort(s.start);const n=diffDays(e,s.start)+1;return'du '+fmtShort(s.start)+' au '+fmtShort(e)+' ('+n+' j)';}
const statusOf=id=>STATUSES.find(s=>s.id===id)||STATUSES[0];
const accounts=()=>{const order=settings().platforms.map(p=>p.id);return Object.values(S.accounts).sort((a,b)=>(order.indexOf(a.platform)-order.indexOf(b.platform))||String(a.handle).localeCompare(b.handle));};
const contents=()=>Object.values(S.contents);
const accLabel=a=>a?a.handle:'Sans compte';
const accColor=a=>a?platOf(a.platform).color:'#8A8FA3';
const titleOf=c=>c&&c.title&&c.title.trim()?c.title:'Sans titre';
const natBadge=a=>!a?'':a.nature==='pro'?'<span class="nat pro">Pro</span>':a.nature==='perso'?'<span class="nat">Perso</span>':'<span class="nat unset" title="Nature à préciser dans Réseaux">?</span>';
function normContent(c){c=Object.assign({title:'',type:'',themes:[],status:'ecriture',publications:[],shoots:null,editDate:'',duration:'',cast:'',gear:'',scenes:[],caption:'',hashtags:'',notes:''},c);
if(!Array.isArray(c.shoots)){c.shoots=(isValidDate(c.shootDate)||c.location)?[{id:'s0',start:isValidDate(c.shootDate)?c.shootDate:'',end:'',location:c.location||'',note:''}]:[];}
delete c.shootDate;delete c.location;
if(!Array.isArray(c.checklist))c.checklist=[];if(!Array.isArray(c.comments))c.comments=[];if(!Array.isArray(c.expenses))c.expenses=[];
if(!Array.isArray(c.links))c.links=[];if(!Array.isArray(c.targets))c.targets=[];if(!c.author)c.author='admin';if(c.status==='idee'&&!c.ideaState)c.ideaState='validee';
if(!Array.isArray(c.themes))c.themes=[];if(!Array.isArray(c.publications))c.publications=[];if(!Array.isArray(c.scenes))c.scenes=[];return c;}
let DB=null;
const wq=new Map();
function enqueue(key,job){const e=wq.get(key)||{busy:false,next:null};e.next=job;wq.set(key,e);if(!e.busy)pump(e);}
async function pump(e){e.busy=true;while(e.next){const j=e.next;e.next=null;try{await j();}catch(err){writeError(err);}}e.busy=false;}
function writeError(err){
const code=err&&err.code;
if(code==='invalid_argument')toast("Modification refusée : tu n'as pas le droit d'écrire ici.");
else if(code==='quota_exceeded')toast("Espace plein : supprime d'anciens contenus pour continuer.");
else if(code==='unavailable')toast('Connexion instable, réessaie dans un instant.');
else toast('Enregistrement impossible ('+(code||'erreur')+').');
}
const COLS={contents:'c',accounts:'a',rdv:'r',docs:'d',media:'m',deals:'p',contacts:'k',tasks:'t',requests:'q'};
function pruneTombs(){const lim=Date.now()-60*864e5;Object.keys(S.deleted).forEach(k=>{if(S.deleted[k]<lim)delete S.deleted[k];});}
function localPayload(){pruneTombs();const o={settings:S.settings,history:S.history.slice(0,HMAX_LOCAL),deleted:S.deleted};Object.keys(COLS).forEach(c=>{o[c]=S[c];});return o;}
function persistLocal(){if(S.mode!=='local')return;clearTimeout(plT);plT=setTimeout(persistLocalNow,250);Sync.schedulePush();}
const Store={
save(col,obj){touch();const x=clone(obj);x.updatedAt=Date.now();S[col][x.id]=col==='contents'?normContent(x):x;delete S.deleted[col+':'+x.id];
if(S.mode==='cloud')enqueue(COLS[col]+':'+x.id,()=>DB.collection(col).doc(x.id).set(clone(S[col][x.id])));else if(S.mode==='supa')Supa.put(col,x.id,S[col][x.id],false);else persistLocal();scheduleRender();},
del(col,id){touch();const was=S[col][id];delete S[col][id];S.deleted[col+':'+id]=Date.now();
if(S.mode==='cloud')enqueue(COLS[col]+':'+id,()=>DB.collection(col).doc(id).delete());else if(S.mode==='supa')Supa.put(col,id,was,true);else persistLocal();scheduleRender();},
saveContent(c){this.save('contents',c);},deleteContent(id){this.del('contents',id);},
saveAccount(a){this.save('accounts',a);},deleteAccount(id){this.del('accounts',id);},
saveRdv(x){this.save('rdv',x);},deleteRdv(id){this.del('rdv',id);},
saveSettings(s){touch();S.settings=clone(s);S.settings.updatedAt=Date.now();
if(S.mode==='cloud')enqueue('settings',()=>DB.doc('settings/main').set(clone(S.settings)));else if(S.mode==='supa')Supa.setSettings(S.settings);else persistLocal();scheduleRender();},
addHistory(e){touch();
S.history=[e].concat(S.history.filter(x=>x.id!==e.id));
if(S.mode==='cloud'){
enqueue('h:'+e.id,()=>DB.collection('history').doc(e.id).set(e));
const extra=S.history.slice(HMAX_CLOUD);S.history=S.history.slice(0,HMAX_CLOUD);
extra.forEach(x=>enqueue('h:'+x.id,()=>DB.collection('history').doc(x.id).delete()));
}else if(S.mode==='supa'){Supa.hist(e);S.history=S.history.slice(0,HMAX_CLOUD);}
else{S.history=S.history.slice(0,HMAX_LOCAL);persistLocal();}
}
};
function logChange(kind,action,refId,label,summary,before){
if(action==='update'&&before){const pt=histPatch(before,histCurrent(kind,refId));if(pt&&pt.__patch&&pt.n>0)before=pt;else before=clone(before);}
Store.addHistory({id:'h'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),at:Date.now(),kind,action,refId:refId||'',label:label||'',summary:summary||'',by:ROLE==='assistant'?roleName('assistant'):'Admin',before:before?(before.__patch?before:clone(before)):null});
}
async function startStore(){
if(Supa.enabled()&&await Supa.start()){renderSync();scheduleRender();return;}
let db=null;
if(window.claude&&typeof window.claude.use==='function'){try{db=await window.claude.use('db');}catch(e){db=null;}}
if(db){
DB=db;S.mode='cloud';
const n=Object.keys(COLS).length+2;let got=0;const ready=()=>{if(++got===n){S.loaded=true;afterLoad();}};
setTimeout(()=>{if(!S.loaded){S.loaded=true;afterLoad();scheduleRender();}},6000);
const onErr=e=>{if(e&&e.code!=='revoked')toast('Synchronisation interrompue. Recharge la page.');};
Object.keys(COLS).forEach(col=>{let first=true;db.collection(col).onSnapshot(snap=>{const o={};snap.docs.forEach(d=>{const x=Object.assign({},clone(d.data()),{id:d.id});o[d.id]=col==='contents'?normContent(x):x;});S[col]=o;if(first){first=false;ready();}scheduleRender();},onErr);});
let fs=true;db.doc('settings/main').onSnapshot(snap=>{S.settings=snap.exists?clone(snap.data()):null;if(fs){fs=false;ready();}scheduleRender();},onErr);
let fh=true;db.collection('history').orderBy('at','desc').limit(HMAX_CLOUD).onSnapshot(snap=>{S.history=snap.docs.map(d=>Object.assign({},clone(d.data()),{id:d.id}));if(fh){fh=false;ready();}scheduleRender();},onErr);
}else{
S.mode='local';
applyLocal(lsGet(LS_DATA)||{});
S.loaded=true;afterLoad();
Sync.init();
}
renderSync();scheduleRender();
}
function applyLocal(d){touch();
Object.keys(COLS).forEach(col=>{const m=Array.isArray(d[col])?toMap(d[col]):(d[col]||{});S[col]={};Object.values(m).forEach(x=>{if(x&&x.id)S[col][x.id]=col==='contents'?normContent(x):x;});});
S.settings=d.settings||null;S.history=Array.isArray(d.history)?d.history:[];S.deleted=d.deleted||{};
}
function mergeRemote(d){touch();
const tomb=Object.assign({},d.deleted||{});Object.keys(S.deleted||{}).forEach(k=>{if(!tomb[k]||tomb[k]<S.deleted[k])tomb[k]=S.deleted[k];});
Object.keys(COLS).forEach(col=>{
const L=S[col]||{},R=Array.isArray(d[col])?toMap(d[col]):(d[col]||{});const out={};
new Set(Object.keys(L).concat(Object.keys(R))).forEach(id=>{const a=L[id],b=R[id];const w=!a?b:!b?a:((b.updatedAt||0)>(a.updatedAt||0)?b:a);
const t=tomb[col+':'+id];if(!w||(t&&t>=(w.updatedAt||0)))return;out[id]=col==='contents'?normContent(w):w;});
S[col]=out;});
if(d.settings&&(!S.settings||(d.settings.updatedAt||0)>(S.settings.updatedAt||0)))S.settings=d.settings;
const hm={};(S.history||[]).concat(d.history||[]).forEach(h=>{if(h&&h.id)hm[h.id]=h;});S.history=Object.values(hm).sort((a,b)=>b.at-a.at).slice(0,HMAX_LOCAL);
S.deleted=tomb;
}
function isoWeek(){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+3-(d.getDay()+6)%7);const w1=new Date(d.getFullYear(),0,4);return d.getFullYear()+'-S'+String(1+Math.round(((d-w1)/864e5-3+(w1.getDay()+6)%7)/7)).padStart(2,'0');}
function afterLoad(){if(!hashView&&!Object.keys(S.accounts).length){S.ui.view='networks';}}
function renderSync(){
const el=$('#sync');
if(S.mode==='cloud'){el.className='sync cloud';el.innerHTML='<i></i><span>Synchronisé sur tous tes appareils · v'+APP_VERSION+'</span>';}
else if(S.mode==='supa'){el.className='sync '+(['offline','error'].includes(Supa.state)?'local':'cloud');el.innerHTML='<i></i><span>'+esc(ROLE?Supa.label():'Compte en ligne')+' · v'+APP_VERSION+'</span>';}
else if(S.mode==='local'){
if(Sync.cfg&&Sync.cfg.gistId){el.className='sync '+(Sync.state==='error'?'local':'cloud');el.innerHTML='<i></i><span>'+esc(Sync.label())+' · v'+APP_VERSION+'</span>';}
else{el.className='sync local';el.innerHTML='<i></i><span>Enregistré sur cet appareil seulement. Active la synchro GitHub dans Réglages. · v'+APP_VERSION+'</span>';}
}
}
const GIST_FILE='studio-tefi.json';
const Sync={
cfg:null,state:'off',pushT:null,dirty:false,lastAt:0,files:{},pendingFiles:{},busy:false,
label(){return this.state==='pushing'?'Envoi vers GitHub…':this.state==='pulling'?'Récupération depuis GitHub…':this.state==='error'?'Synchro GitHub en erreur':this.lastAt?'Synchronisé avec GitHub à '+pad(new Date(this.lastAt).getHours())+':'+pad(new Date(this.lastAt).getMinutes()):'Synchro GitHub active';},
init(){this.cfg=lsGet(LS_GIST);if(this.cfg&&this.cfg.token&&this.cfg.gistId){this.pull();}
document.addEventListener('visibilitychange',()=>{if(!this.cfg||!this.cfg.gistId)return;if(document.visibilityState==='visible'){if(!this.dirty)this.pull();}else if(this.dirty)this.push();});
setInterval(()=>{if(document.visibilityState==='visible'&&this.cfg&&this.cfg.gistId&&!this.dirty&&!draft&&!this.busy)this.pull();},60000);},
headers(){return{'Authorization':'Bearer '+this.cfg.token,'Accept':'application/vnd.github+json','Content-Type':'application/json'};},
payload(){const o={app:'studio-tefi',version:2,savedAt:new Date().toISOString(),settings:S.settings,history:S.history.slice(0,100),deleted:S.deleted};Object.keys(COLS).forEach(c=>{o[c]=Object.values(S[c]);});return JSON.stringify(o);},
set(state){this.state=state;renderSync();if(['settings','more'].includes(S.ui.view))scheduleRender();},
async fetchRemote(){
const r=await fetch('https://api.github.com/gists/'+encodeURIComponent(this.cfg.gistId),{headers:this.headers(),cache:'no-store'});
if(!r.ok)throw new Error(r.status===401?'Jeton GitHub refusé':r.status===404?'Espace de synchro introuvable':'GitHub a répondu '+r.status);
const g=await r.json();this.files={};Object.keys(g.files||{}).forEach(k=>{this.files[k]=g.files[k].raw_url;});
const f=g.files&&g.files[GIST_FILE];if(!f)throw new Error('Fichier de données absent');
let text=f.content;if(f.truncated&&f.raw_url){text=await(await fetch(f.raw_url,{cache:'no-store'})).text();}
const d=JSON.parse(text);if(d.app!=='studio-tefi')throw new Error('Données inconnues');return d;
},
async pull(){
if(!this.cfg||!this.cfg.gistId||this.busy)return;this.busy=true;this.set('pulling');
try{const d=await this.fetchRemote();mergeRemote(d);lsSet(LS_DATA,localPayload());this.lastAt=Date.now();this.set('ok');scheduleRender();}
catch(e){this.err=e.message||String(e);this.set('error');}
this.busy=false;
},
schedulePush(){if(!this.cfg||!this.cfg.gistId)return;this.dirty=true;clearTimeout(this.pushT);this.pushT=setTimeout(()=>this.push(),1500);},
async push(){
if(!this.cfg||!this.cfg.gistId)return;if(this.busy){this.schedulePush();return;}clearTimeout(this.pushT);this.busy=true;this.set('pushing');
try{
const d=await this.fetchRemote();this.dirty=false;mergeRemote(d);lsSet(LS_DATA,localPayload());
const files={[GIST_FILE]:{content:this.payload()}};
Object.keys(this.pendingFiles).forEach(k=>{files[k]=this.pendingFiles[k]===null?(this.files[k]?null:undefined):{content:this.pendingFiles[k]};if(files[k]===undefined)delete files[k];});
const wk=isoWeek();if(this.cfg.lastBackup!==wk){files['sauvegarde-'+wk+'.json']={content:this.payload()};
const olds=Object.keys(this.files).filter(k=>k.startsWith('sauvegarde-')).sort();olds.slice(0,Math.max(0,olds.length-3)).forEach(k=>{files[k]=null;});}
const r=await fetch('https://api.github.com/gists/'+encodeURIComponent(this.cfg.gistId),{method:'PATCH',headers:this.headers(),body:JSON.stringify({files})});
if(!r.ok)throw new Error(r.status===401?'Jeton GitHub refusé':'GitHub a répondu '+r.status);
const g=await r.json();this.files={};Object.keys(g.files||{}).forEach(k=>{this.files[k]=g.files[k].raw_url;});
Object.keys(files).forEach(k=>{delete this.pendingFiles[k];});
if(this.cfg.lastBackup!==wk){this.cfg.lastBackup=wk;lsSet(LS_GIST,this.cfg);}
this.lastAt=Date.now();this.set('ok');scheduleRender();
}catch(e){this.err=e.message||String(e);this.dirty=true;this.set('error');}
this.busy=false;if(this.dirty&&this.state==='ok')this.schedulePush();
},
async create(token){
this.cfg={token};
try{const r=await fetch('https://api.github.com/gists',{method:'POST',headers:this.headers(),body:JSON.stringify({description:'Studio Tefi — données (ne pas supprimer)',public:false,files:{[GIST_FILE]:{content:this.payload()}}})});
if(!r.ok)throw new Error(r.status===401?'Jeton GitHub refusé : vérifie qu\'il a la permission « gist »':'GitHub a répondu '+r.status);
const g=await r.json();this.cfg={token,gistId:g.id};lsSet(LS_GIST,this.cfg);this.lastAt=Date.now();this.set('ok');toast('Synchro GitHub activée');
}catch(e){this.cfg=null;toast(e.message||'Échec de la création');this.set('off');}
},
async connect(token,gistId){this.cfg={token,gistId};this.dirty=false;await this.pull();
if(this.state==='ok'){lsSet(LS_GIST,this.cfg);toast('Appareil connecté : planning récupéré et fusionné');}else{toast(this.err||'Connexion impossible');this.cfg=null;this.set('off');}},
disconnect(){try{localStorage.removeItem(LS_GIST);}catch(e){}this.cfg=null;this.set('off');toast('Synchro GitHub désactivée sur cet appareil');}
};
function filtersActive(){const f=S.ui.filters;return Object.keys(f).some(k=>f[k]);}
function passAcc(a,p){const f=S.ui.filters;
if(f.channel&&(a?(platOf(a.platform).channel||'social'):(p&&p.channel))!==f.channel)return false;
if(f.account&&(!a||a.id!==f.account))return false;if(f.platform&&(!a||a.platform!==f.platform))return false;
if(f.nature&&(!a||(a.nature||'')!==f.nature))return false;return true;}
function passContent(c){const f=S.ui.filters;if(f.type&&c.type!==f.type)return false;if(f.status&&c.status!==f.status)return false;
if(f.theme&&!(c.themes||[]).includes(f.theme))return false;
if(f.channel||f.account||f.platform||f.nature)return(c.publications||[]).some(p=>passAcc(S.accounts[p.accountId],p));return true;}
function events(opt){
opt=Object.assign({filtered:true,prod:S.ui.showProd},opt||{});
const key='ev|'+ROLE+'|'+JSON.stringify(opt)+'|'+(opt.filtered?JSON.stringify(S.ui.filters):'')+'|'+S.ui.showRdv+'|'+(S.ui.rdvPrio||'');
return memo(key,()=>eventsRaw(opt)).slice();
}
function eventsRaw(opt){
const out=[];
for(const c of contents()){
if(opt.filtered&&!passContent(c))continue;
if(c.status==='idee')continue;
for(const p of(c.publications||[])){
if(!isValidDate(p.date))continue;const a=S.accounts[p.accountId];
if(opt.filtered&&!passAcc(a,p))continue;
out.push({kind:'pub',date:p.date,time:p.time||'',c,p,a});
}
if(opt.prod){
(c.shoots||[]).forEach(s=>{if(!isValidDate(s.start))return;const n=Math.min(diffDays(shootEnd(s),s.start)+1,120);for(let i=0;i<n;i++)out.push({kind:'shoot',date:addDays(s.start,i),time:'',c,s,di:i,dn:n});});
if(isValidDate(c.editDate))out.push({kind:'edit',date:c.editDate,time:'',c});
}
}
if(opt.rdv!==false&&(opt.rdv||S.ui.showRdv)&&!(opt.filtered&&filtersActive())&&can('rdv')){
const rp=opt.filtered&&S.ui.rdvPrio?prioRank(S.ui.rdvPrio):0;
Object.values(S.rdv).forEach(x=>{if(isValidDate(x.date)&&(!rp||prioRank(x.priority)>=rp))out.push({kind:'rdv',date:x.date,time:x.start||'',r:x});});
}
out.sort((x,y)=>x.date<y.date?-1:x.date>y.date?1:(x.time||'99')<(y.time||'99')?-1:1);
return out;
}
const isLate=e=>e.kind==='pub'&&e.p&&!e.p.done&&e.date<today();
function byDate(evs){const m={};evs.forEach(e=>{(m[e.date]=m[e.date]||[]).push(e);});return m;}
function evColor(e){return e.kind==='rdv'?rdvColor(e.r):e.kind==='pub'?accColor(e.a):typeOf(e.c.type).color;}
function evChip(e){
if(e.kind==='rdv')return'<button class="ev rdv'+(e.r.priority&&e.r.priority!=='p2'?' '+e.r.priority:'')+'" style="--c:'+rdvColor(e.r)+'" draggable="true" data-drag="ev:rdv:'+esc(e.r.id)+'::'+e.date+'" data-act="rdv-open" data-id="'+esc(e.r.id)+'" title="'+esc('RDV · '+rdvWho(e.r)+' · '+e.r.title)+'">'+(e.r.start?'<span class="t">'+esc(e.r.start)+'</span>':'')+'<span class="n">'+esc(e.r.title||'Rendez-vous')+'</span></button>';
const k=e.kind;const cls='ev'+(k!=='pub'?' prod':'')+(k==='pub'&&e.p.done?' done':'')+(isLate(e)?' late':'');
const lead=k==='shoot'?'Tournage'+(e.dn>1?' '+(e.di+1)+'/'+e.dn:''):k==='edit'?'Montage':(e.time||'');
const drag=k+':'+e.c.id+':'+(k==='pub'?e.p.id:k==='shoot'?e.s.id:'')+':'+e.date;
const tip=(k==='pub'?accLabel(e.a)+' · ':lead+(k==='shoot'&&e.s.location?' · '+e.s.location:'')+' · ')+titleOf(e.c);
return'<button class="'+cls+'" style="--c:'+evColor(e)+'" draggable="true" data-drag="ev:'+esc(drag)+'" data-act="peek" data-id="'+esc(e.c.id)+'" title="'+esc(tip)+'">'+
(lead?'<span class="t">'+esc(lead)+'</span>':'')+'<span class="n">'+esc(titleOf(e.c))+'</span></button>';
}
function themePills(c){return(c.themes||[]).map(id=>themeOf(id)).filter(Boolean).map(t=>'<span class="pill plain">'+esc(t.label)+'</span>').join('');}
function rowActions(c,p){
return'<div class="row-acts">'+(p&&!p.done?'<button class="icon-btn sm need-projStatus" data-act="mark-done" data-id="'+esc(c.id)+'" data-pid="'+esc(p.id)+'" title="Marquer publié" aria-label="Marquer publié">'+ICON.check+'</button>':'')+
'<button class="icon-btn sm need-projEdit" data-act="open" data-id="'+esc(c.id)+'" title="Modifier" aria-label="Modifier">'+ICON.edit+'</button>'+
(can('projDelete')?'<button class="icon-btn sm danger" data-act="del-content" data-id="'+esc(c.id)+'" data-confirm="Supprimer ?" title="Supprimer le contenu" aria-label="Supprimer le contenu">'+ICON.trash+'</button>':'')+'</div>';
}
function evRow(e,opts){
if(e.kind==='rdv')return rdvRow(e.r,opts);
opts=opts||{};const c=e.c;const t=typeOf(c.type);const late=isLate(e);
let kindTag;
if(e.kind==='pub')kindTag='<span class="pill" style="--c:'+accColor(e.a)+'"><span class="dot" style="--c:'+accColor(e.a)+'"></span>'+esc(e.a?platOf(e.a.platform).label+' · '+e.a.handle:pendingLabel(e.p))+'</span>';
else if(e.kind==='shoot')kindTag='<span class="pill" style="--c:#E0533D">Tournage'+(e.dn>1?' · jour '+(e.di+1)+'/'+e.dn:'')+'</span>'+(e.s.location?'<span>📍 '+esc(e.s.location)+'</span>':'');
else kindTag='<span class="pill plain">Montage</span>';
const when=opts.showDate?'<div class="when'+(late?' late':'')+'"><b>'+pd(e.date).getDate()+'</b><span class="mono muted">'+MSHORT[pd(e.date).getMonth()]+'</span></div>':'';
return'<div class="row">'+when+'<button class="row-main" data-act="peek" data-id="'+esc(c.id)+'"><b>'+esc(titleOf(c))+'</b><span class="row-meta">'+kindTag+
'<span class="pill" style="--c:'+t.color+'">'+esc(t.label)+'</span>'+(e.time?'<span class="mono">'+esc(e.time)+'</span>':'')+
(e.kind==='pub'&&e.p.done?'<span class="pill" style="--c:var(--ok)">Publié</span>':'')+
(late?'<span style="color:var(--late);font-weight:600">En retard · '+rel(e.date)+'</span>':(opts.showRel?'<span>'+rel(e.date)+'</span>':''))+'</span></button>'+
rowActions(c,e.kind==='pub'?e.p:null)+'</div>';
}
function contentRow(c){
const t=typeOf(c.type),s=statusOf(c.status),np=nextPub(c);
return'<div class="row"><button class="row-main" data-act="peek" data-id="'+esc(c.id)+'"><b>'+esc(titleOf(c))+'</b><span class="row-meta"><span class="pill" style="--c:'+s.c+'">'+s.label+'</span><span class="pill" style="--c:'+t.color+'">'+esc(t.label)+'</span>'+
(np&&isValidDate(np.date)?'<span>'+esc(accLabel(S.accounts[np.accountId]))+' · '+fmtShort(np.date)+'</span>':'<span>Pas encore planifié</span>')+'</span></button>'+rowActions(c,null)+'</div>';
}
function filterBar(extra){
const f=S.ui.filters,st=settings();
const opt=(v,l,sel)=>'<option value="'+esc(v)+'"'+(sel===v?' selected':'')+'>'+esc(l)+'</option>';
const sel=(k,label,opts)=>'<select class="inp'+(f[k]?' on':'')+'" id="f-'+k+'" data-filter="'+k+'" aria-label="'+label+'">'+opts+'</select>';
let h='<div class="filters" role="group" aria-label="Filtres">';
h+=sel('channel','Distribution',opt('','Toutes distributions',f.channel)+st.channels.map(c=>opt(c.id,c.id==='social'?'Uniquement réseaux':c.label,f.channel)).join(''));
h+=sel('platform','Plateforme',opt('','Toutes plateformes',f.platform)+st.platforms.map(p=>opt(p.id,p.label,f.platform)).join(''));
h+=sel('account','Compte',opt('','Tous les comptes',f.account)+st.platforms.map(p=>{const as=accounts().filter(a=>a.platform===p.id);return as.length?'<optgroup label="'+esc(p.label)+'">'+as.map(a=>opt(a.id,a.handle,f.account)).join('')+'</optgroup>':'';}).join(''));
h+=sel('nature','Nature du compte',opt('','Perso et pro',f.nature)+NATURES.map(n=>opt(n.id,'Comptes '+n.label.toLowerCase(),f.nature)).join(''));
h+=sel('type','Format',opt('','Tous les formats',f.type)+st.types.map(t=>opt(t.id,t.label,f.type)).join(''));
h+=sel('theme','Thématique',opt('','Toutes thématiques',f.theme)+st.themes.map(t=>opt(t.id,t.label,f.theme)).join(''));
h+=sel('status','Statut',opt('','Tous les statuts',f.status)+STATUSES.map(s=>opt(s.id,s.label,f.status)).join(''));
if(filtersActive())h+='<button class="btn ghost small" data-act="reset-filters">'+ICON.x+'Effacer</button>';
return h+(extra||'')+'</div>';
}
function platOptions(ch){return settings().platforms.filter(p=>p.channel===ch).map(p=>'<option value="'+esc(p.id)+'">'+esc(p.label)+'</option>').join('');}
function accQuickForm(idp){
const st=settings();
const chs=st.channels.filter(ch=>st.platforms.some(p=>p.channel===ch.id));const ch0=chs[0]?chs[0].id:'social';
return'<form class="quick-acc need-accounts" data-form="acc"><select class="inp" id="'+idp+'-chan" data-k="chan" aria-label="Distribution">'+chs.map(ch=>'<option value="'+esc(ch.id)+'">'+esc(ch.label)+'</option>').join('')+'</select>'+
'<select class="inp" id="'+idp+'-plat" data-k="plat" aria-label="Plateforme">'+platOptions(ch0)+'</select>'+
'<input class="inp" id="'+idp+'-handle" data-k="handle" placeholder="@compte, chaîne ou salle" autocomplete="off" autocapitalize="off" aria-label="Nom du compte">'+
'<select class="inp" id="'+idp+'-nat" data-k="nat" aria-label="Nature du compte">'+NATURES.map(n=>'<option value="'+n.id+'">'+n.label+'</option>').join('')+'</select>'+
'<button class="btn primary" type="submit">'+ICON.plus+'Ajouter</button></form>';
}
function homeList(sel){
const t=today(),ws=weekStart(t),we=addDays(ws,6);
const all=events({filtered:false,prod:false,rdv:false});const allR=events({filtered:false,prod:false,rdv:true});
const cs=contents();
if(sel==='week')return{title:'Cette semaine',items:events({filtered:false,prod:true,rdv:true}).filter(e=>e.date>=ws&&e.date<=we),kind:'ev',empty:'Rien de prévu cette semaine.'};
if(sel==='late')return{title:'En retard',items:all.filter(isLate),kind:'ev',empty:'Aucune publication en retard.'};
if(sel==='prod')return{title:'En cours',items:cs.filter(c=>['ecriture','production','tournage','montage','pret'].includes(c.status)).sort((a,b)=>STATUSES.findIndex(s=>s.id===a.status)-STATUSES.findIndex(s=>s.id===b.status)),kind:'c',empty:'Aucun contenu en cours.'};
if(sel==='ideas')return{title:isAdmin()?'Propositions à traiter':'Mes idées à retravailler',items:ideasToHandle(),kind:'c',empty:isAdmin()?'Aucune proposition en attente.':'Rien à retravailler.'};
if(sel&&sel.startsWith('day:')){const d=sel.slice(4);return{title:fmtDay(d),items:events({filtered:false,prod:true,rdv:true}).filter(e=>e.date===d),kind:'ev',empty:'Rien de prévu ce jour-là.',day:d};}
return{title:'À venir · 14 jours',items:allR.filter(e=>e.date>=t&&e.date<=addDays(t,13)&&(e.kind==='rdv'||!e.p.done)),kind:'ev',empty:'Rien de planifié. Ajoute une diffusion à un contenu pour la voir ici.'};
}
function viewHome(){
const t=today(),ws=weekStart(t),we=addDays(ws,6);
const all=events({filtered:false,prod:false,rdv:false});
const allProd=events({filtered:false,prod:true,rdv:true});
const cs=contents();const accs=accounts();
const n={upcoming:homeList('upcoming').items.length,week:homeList('week').items.length,late:all.filter(isLate).length,
prod:cs.filter(c=>['ecriture','production','tournage','montage','pret'].includes(c.status)).length,ideas:ideasToHandle().length};
const sel=S.ui.homeSel||'upcoming';
let h='<div class="wrap"><div class="head"><div><span class="label">'+esc(fmtDay(t))+'</span><h1>Ton planning</h1></div>'+
'<div class="card-f"><button class="icon-btn" data-nav="search" aria-label="Rechercher" title="Rechercher">'+ICON.search+'</button><button class="btn small ghost" data-act="home-edit" aria-pressed="'+!!S.ui.homeEdit+'">Personnaliser</button><button class="btn primary need-projEdit" data-act="new">'+ICON.plus+'Nouveau contenu</button></div></div>';
if(S.ui.homeEdit)h+=homeEditPanel();
const B={};
B.today=()=>homeTop();
B.networks=()=>{let h='';
h+='<section class="panel"><div class="panel-h"><h2>Mes réseaux</h2><button class="btn ghost small" data-nav="networks">Gérer'+ICON.arrow+'</button></div>';
h+=accs.length?'<div class="netbar">'+accs.map(a=>'<button class="acc-chip" data-act="filter-account" data-id="'+esc(a.id)+'" title="Voir le planning de '+esc(a.handle)+'"><span class="dot" style="--c:'+accColor(a)+'"></span><span class="muted">'+esc(platOf(a.platform).label)+'</span><span class="h">'+esc(a.handle)+'</span>'+natBadge(a)+'</button>').join('')+'</div>'
:'<p class="muted" style="margin:0">Ajoute tes comptes pour commencer : choisis la plateforme, écris le nom du compte et sa nature.</p>';
h+=accQuickForm('qa')+'</section>';
return h;};
B.planning=()=>{let h='';
const tile=(id,label,num,sub,alert)=>'<button class="stat'+(alert&&num?' alert':'')+'" data-act="home-sel" data-sel="'+id+'" aria-pressed="'+(sel===id)+'"><span class="label">'+label+'</span><strong>'+num+'</strong><span class="muted">'+sub+'</span></button>';
h+='<div class="stats">'+tile('upcoming','À venir',n.upcoming,'publications et RDV')+tile('week','Cette semaine',n.week,'publications et tournages')+tile('late','En retard',n.late,'non publiées',true)+tile('prod','En cours',n.prod,'écriture → prêt')+(isAdmin()?tile('ideas','Propositions',n.ideas,'idées à traiter',true):tile('ideas','Mes idées',n.ideas,'à retravailler',true))+'</div>';
const bd=byDate(allProd);
h+='<section class="panel"><div class="panel-h"><h2>Semaine du '+fmtShort(ws)+' au '+fmtShort(we)+'</h2><button class="btn ghost small" data-act="goto-cal">Calendrier'+ICON.arrow+'</button></div><div class="strip">';
for(let i=0;i<7;i++){const day=addDays(ws,i);const evs=bd[day]||[];
h+='<button class="'+(day===t?'is-today':'')+'" data-act="home-sel" data-sel="day:'+day+'" aria-pressed="'+(sel==='day:'+day)+'" aria-label="'+esc(fmtDay(day))+', '+evs.length+' élément(s)"><span class="label">'+DAYS[i]+'</span><span class="d">'+pd(day).getDate()+'</span><span class="dots">'+
evs.slice(0,6).map(e=>'<span class="dot" style="--c:'+(e.kind==='pub'?evColor(e):'var(--muted)')+'"></span>').join('')+'</span></button>';}
h+='</div></section>';
const L=homeList(sel);
h+='<section class="panel" id="home-detail"><div class="panel-h"><h2 style="text-transform:'+(L.day?'capitalize':'none')+'">'+esc(L.title)+'</h2><div class="row-acts"><span class="mono muted">'+L.items.length+'</span>'+(L.day?'<button class="btn small" data-act="new" data-date="'+L.day+'">'+ICON.plus+'Planifier</button>':'')+'</div></div>';
h+=L.items.length?'<div class="rows">'+L.items.slice(0,30).map(x=>L.kind==='ev'?evRow(x,{showDate:!L.day,showRel:sel==='upcoming'}):contentRow(x)).join('')+'</div>'+(L.items.length>30?'<p class="hint">30 premiers éléments affichés.</p>':'')
:'<div class="empty"><b>Rien ici</b>'+esc(L.empty)+'</div>';
h+='<p class="hint" style="margin:10px 0 0">Touche un élément pour voir le détail, changer la date, le marquer publié ou le supprimer.</p></section>';
return h;};
B.goals=()=>goalsPanel();
B.production=()=>{let h='';
h+='<div class="grid-2">';
const counts=STATUSES.map(s=>({s,n:cs.filter(c=>c.status===s.id).length}));const total=cs.length||1;
h+='<section class="panel"><div class="panel-h"><h2>Production</h2><span class="mono muted">'+plural(cs.length,'contenu')+'</span></div>'+
'<div class="pipe">'+counts.filter(x=>x.n).map(x=>'<i style="--c:'+x.s.c+';flex:'+x.n/total+'"></i>').join('')+'</div>'+
'<div class="legend">'+counts.map(x=>'<span><span class="dot" style="--c:'+x.s.c+'"></span>'+x.s.label+' <b class="mono">'+x.n+'</b></span>').join('')+'</div></section>';
const d=new Date();const mStart=ds(new Date(d.getFullYear(),d.getMonth(),1)),mEnd=ds(new Date(d.getFullYear(),d.getMonth()+1,0));
h+='<section class="panel"><div class="panel-h"><h2>Par compte</h2></div>';
h+=accs.length?'<div>'+accs.map(a=>{
const pubs=all.filter(e=>e.a&&e.a.id===a.id);const next=pubs.find(e=>e.date>=t&&!e.p.done);
const doneM=pubs.filter(e=>e.p.done&&e.date>=mStart&&e.date<=mEnd).length;const up=pubs.filter(e=>e.date>=t&&!e.p.done).length;
return'<div class="acc-row"><button class="acc-name row-main" style="flex-direction:row;align-items:center" data-act="filter-account" data-id="'+esc(a.id)+'"><span class="dot" style="--c:'+accColor(a)+'"></span><span>'+esc(a.handle)+'</span>'+natBadge(a)+'<span class="muted" style="font-weight:400;font-size:13px">'+(next?'prochain '+fmtShort(next.date):'')+'</span></button>'+
'<div class="kv"><b>'+up+'</b>à venir</div><div class="kv"><b>'+doneM+'</b>publiés ce mois</div></div>';}).join('')+'</div>'
:'<div class="empty"><b>Aucun compte</b>Ajoute-les dans « Mes réseaux » ci-dessus.</div>';
h+='</section></div>';return h;};
B.inbox=()=>blkInbox();B.mytasks=()=>blkMyTasks();B.myreq=()=>blkMyReq();B.rdvmonth=()=>blkRdvMonth();B.projmonth=()=>blkProjMonth();B.figures=()=>blkFigures();B.week=()=>blkWeek();B.assistplan=()=>blkAssistPlan();
const LY=homeLayout();LY.order.forEach(id=>{if(LY.hidden.includes(id)||!blockAvail(id)||!B[id])return;h+=B[id]();});
return h+'</div>';
}
function platCard(p,accs){
const st=settings();const as=accs.filter(a=>a.platform===p.id);const social=p.channel==='social';
return'<section class="panel plat-card"><div class="set-item"><input type="color" class="swatch" id="pc-'+esc(p.id)+'" value="'+esc(p.color)+'" data-plat-color="'+esc(p.id)+'" aria-label="Couleur de '+esc(p.label)+'">'+
'<input class="inp" id="pl-'+esc(p.id)+'" value="'+esc(p.label)+'" data-plat-label="'+esc(p.id)+'" aria-label="Nom de la plateforme" style="font-weight:700"'+(isAdmin()?'':' disabled')+'>'+
'<button class="icon-btn danger admin-only" data-act="plat-del" data-id="'+esc(p.id)+'" data-confirm="Supprimer ?" aria-label="Supprimer '+esc(p.label)+'">'+ICON.trash+'</button></div>'+
'<label class="field admin-only"><span>Type de distribution</span><select class="inp" id="pch-'+esc(p.id)+'" data-plat-channel="'+esc(p.id)+'">'+st.channels.map(c=>'<option value="'+esc(c.id)+'"'+(c.id===p.channel?' selected':'')+'>'+esc(c.label)+'</option>').join('')+'</select></label>'+
'<span class="label">'+(social?'Comptes':'Chaînes, salles ou émissions')+'</span>'+
(as.length?as.map(a=>{const used=contents().reduce((n,c)=>n+(c.publications||[]).filter(x=>x.accountId===a.id).length,0);
return'<div class="acc-line"><input class="inp" id="acc-'+esc(a.id)+'" value="'+esc(a.handle)+'" data-acc-handle="'+esc(a.id)+'" aria-label="Nom">'+
'<div class="seg sm" role="group" aria-label="Nature">'+NATURES.map(nt=>'<button data-act="acc-nature" data-id="'+esc(a.id)+'" data-n="'+nt.id+'" aria-pressed="'+(a.nature===nt.id)+'">'+nt.label+'</button>').join('')+'</div>'+
(social?'<input class="inp mono foll" type="number" min="0" id="af-'+esc(a.id)+'" data-acc-followers="'+esc(a.id)+'" value="'+esc(a.followers||'')+'" placeholder="Abonnés" title="Nombre d\'abonnés" aria-label="Abonnés">':'')+'<span class="mono muted used">'+plural(used,'diffusion')+'</span>'+(accUrl(a)?'<a class="icon-btn sm" href="'+esc(accUrl(a))+'" target="_blank" rel="noopener" title="Ouvrir le profil" aria-label="Ouvrir '+esc(a.handle)+'">'+ICON.arrow+'</a>':'')+
'<button class="icon-btn sm danger" data-act="acc-del" data-id="'+esc(a.id)+'" data-confirm="Supprimer ?" aria-label="Supprimer '+esc(a.handle)+'">'+ICON.trash+'</button></div>';}).join('')
:'<span class="hint">Rien pour l\'instant. Ajoute-en avec le formulaire du haut.</span>')+'</section>';
}
function viewNetworks(){
const st=settings();const accs=accounts();
let h='<div class="wrap"><div class="head"><div><span class="label">Réseaux &amp; distribution</span><h1>Où tu diffuses</h1><p class="muted">Réseaux sociaux, TV, cinéma… Chaque plateforme appartient à un type de distribution, et contient tes comptes, chaînes ou salles.</p></div></div>';
h+=accSummaryPanel();
h+='<section class="panel"><div class="panel-h"><h2>Ajouter un compte</h2></div>'+accQuickForm('na').replace('class="quick-acc"','class="quick-acc" style="margin-top:0"')+'</section>'+perfPanel()+mediaKitPanel();
st.channels.forEach(ch=>{const ps=st.platforms.filter(p=>p.channel===ch.id);
h+='<div class="chan"><div class="chan-h"><h2>'+esc(ch.label)+'</h2><span class="mono muted">'+plural(ps.length,'plateforme')+'</span></div>';
h+=ps.length?'<div class="grid-2">'+ps.map(p=>platCard(p,accs)).join('')+'</div>':'<p class="hint" style="margin:0">Aucune plateforme '+esc(ch.label)+'. '+(ch.id==='tv'?'Ex. : TVM, Kolo TV, Viva TV.':ch.id==='cinema'?'Ex. : Canal Olympia, Ciné Rex.':ch.id==='streaming'?'Ex. : YouTube, Netflix.':'')+'</p>';
h+='</div>';});
h+='<div class="grid-2 admin-only"><section class="panel plat-card"><h3>Ajouter une plateforme</h3><p class="hint" style="margin:0">Une chaîne TV, un cinéma, YouTube, un festival… Pour la TV et le cinéma, une entrée du même nom est créée pour que tu puisses la choisir tout de suite dans tes diffusions.</p>'+
'<form class="add-form" style="margin-top:0" data-form="plat"><input class="inp" id="plat-new" placeholder="Nom (ex. TVM)" autocomplete="off"><select class="inp" id="plat-new-ch" aria-label="Type de distribution">'+st.channels.map(c=>'<option value="'+esc(c.id)+'">'+esc(c.label)+'</option>').join('')+'</select><input type="color" class="swatch" id="plat-new-color" value="#3D5A80" aria-label="Couleur"><button class="btn" type="submit">'+ICON.plus+'Ajouter</button></form></section>';
h+='<section class="panel plat-card"><h3>Types de distribution</h3><div class="set-list">'+st.channels.map(c=>'<div class="set-item"><input class="inp" id="ch-'+esc(c.id)+'" value="'+esc(c.label)+'" data-chan-label="'+esc(c.id)+'" aria-label="Nom du type">'+(c.id==='social'?'':'<button class="icon-btn sm danger" data-act="chan-del" data-id="'+esc(c.id)+'" data-confirm="✓" aria-label="Supprimer '+esc(c.label)+'">'+ICON.x+'</button>')+'</div>').join('')+
'</div><form class="add-form" data-form="chan"><input class="inp" id="chan-new" placeholder="Ex. Radio, Affichage" autocomplete="off"><button class="btn" type="submit">'+ICON.plus+'Ajouter</button></form></section></div>';
if(accs.length)h+='<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" data-act="new">'+ICON.plus+'Créer un contenu</button><button class="btn" data-nav="home">Aller au résumé</button></div>';
return h+'</div>';
}
function viewCalendar(){
const u=S.ui,t=today();const cur=u.cursor;const cd=pd(cur);
let title;
if(u.calMode==='week'){const ws=weekStart(cur),we=addDays(ws,6);title=fmtShort(ws)+' – '+fmtShort(we)+' '+pd(we).getFullYear();}
else title=MONTHS[cd.getMonth()]+' '+cd.getFullYear();
let h='<div class="wrap"><div class="head"><div><span class="label">Calendrier</span><h1>Planning de diffusion</h1></div><button class="btn primary" data-act="new" data-date="'+esc(u.selDay)+'">'+ICON.plus+'Planifier</button></div>';
h+='<div class="cal-bar"><div class="cal-nav"><button class="icon-btn" data-act="cal-prev" aria-label="Précédent">'+ICON.left+'</button><button class="icon-btn" data-act="cal-next" aria-label="Suivant">'+ICON.right+'</button><span class="cal-title">'+esc(title)+'</span><button class="btn small" data-act="cal-today">Aujourd\'hui</button></div>'+
'<div class="seg" role="group" aria-label="Vue">'+[['month','Mois'],['week','Semaine'],['list','Liste']].map(m=>'<button data-act="cal-mode" data-mode="'+m[0]+'" aria-pressed="'+(u.calMode===m[0])+'">'+m[1]+'</button>').join('')+'</div></div>';
h+=filterBar('<label class="toggle"><input type="checkbox" id="show-prod" data-act-change="toggle-prod"'+(u.showProd?' checked':'')+'>Tournage &amp; montage</label><label class="toggle"><input type="checkbox" id="show-rdv" data-act-change="toggle-rdv"'+(u.showRdv?' checked':'')+'>Rendez-vous</label>'+(u.showRdv&&can('rdv')?'<select class="inp sm-sel" id="f-rprio" aria-label="Priorité des rendez-vous"><option value="">Toutes priorités</option>'+PRIOS.slice(0,3).map(p=>'<option value="'+p.id+'"'+(u.rdvPrio===p.id?' selected':'')+'>'+(p.id==='p4'?'Impératifs':p.rdv+' et plus')+'</option>').join('')+'</select>':'')+'<button class="btn small" data-act="ics" title="Fichier .ics pour Google Agenda ou l\'agenda de l\'iPhone">Exporter vers mon agenda</button>');
const evs=events();const bd=byDate(evs);
if(u.calMode==='month'){
const first=new Date(cd.getFullYear(),cd.getMonth(),1);const start=weekStart(ds(first));
const last=ds(new Date(cd.getFullYear(),cd.getMonth()+1,0));const end=addDays(weekStart(last),6);
h+='<div class="month">'+DAYS.map(x=>'<div class="dow">'+x+'</div>').join('');
for(let day=start;day<=end;day=addDays(day,1)){
const out=pd(day).getMonth()!==cd.getMonth();const list=bd[day]||[];
h+='<div class="day'+(out?' out':'')+(day===t?' today':'')+(day===u.selDay?' sel':'')+'" data-act="sel-day" data-date="'+day+'" data-drop="'+day+'"><span class="num">'+pd(day).getDate()+'</span>'+(holidayOf(day)?'<span class="hol" title="'+esc(holidayOf(day))+'">'+esc(holidayOf(day))+'</span>':'')+
list.slice(0,4).map(evChip).join('')+(list.length>4?'<span class="more">+'+(list.length-4)+'</span>':'')+'</div>';
}
h+='</div>';
const sel=bd[u.selDay]||[];
h+='<section class="panel daypanel"><div class="panel-h"><h2 style="text-transform:capitalize">'+esc(fmtDay(u.selDay))+(holidayOf(u.selDay)?' <span class="pill" style="--c:#2B9348;text-transform:none">'+esc(holidayOf(u.selDay))+'</span>':'')+'</h2><div class="row-acts"><button class="btn small" data-act="rdv-new" data-date="'+esc(u.selDay)+'">'+ICON.plus+'RDV</button><button class="btn small" data-act="new" data-date="'+esc(u.selDay)+'">'+ICON.plus+'Contenu</button></div></div>'+
(sel.length?'<div class="rows">'+sel.map(e=>evRow(e)).join('')+'</div>':'<div class="empty"><b>Journée libre</b>Rien de prévu ce jour-là.</div>')+
'<p class="hint" style="margin:10px 0 0">Sur ordinateur, glisse un élément vers un autre jour pour changer sa date.</p></section>';
}else if(u.calMode==='week'){
const ws=weekStart(cur);
h+='<div class="week">';
for(let i=0;i<7;i++){const day=addDays(ws,i);const list=bd[day]||[];
h+='<div class="wcol'+(day===t?' today':'')+'" data-drop="'+day+'"><div class="wcol-h"><span class="label">'+DAYS_LONG[i]+'</span><b>'+pd(day).getDate()+'</b></div>'+
list.map(evChip).join('')+'<button class="btn ghost small" data-act="new" data-date="'+day+'" aria-label="Planifier le '+esc(fmtDay(day))+'">'+ICON.plus+'</button></div>';}
h+='</div>';
}else{
const ms=ds(new Date(cd.getFullYear(),cd.getMonth(),1)),me=ds(new Date(cd.getFullYear(),cd.getMonth()+1,0));
const days=Object.keys(bd).filter(x=>x>=ms&&x<=me).sort();
h+=days.length?'<div class="agenda">'+days.map(day=>'<div class="agenda-day"><div class="agenda-date"><b>'+pd(day).getDate()+'</b><span class="label">'+DAYS[dow(day)]+'</span></div><div class="panel" style="padding:6px 14px"><div class="rows">'+bd[day].map(e=>evRow(e)).join('')+'</div></div></div>').join('')+'</div>'
:'<div class="empty"><b>Aucune publication ce mois-ci</b>'+(filtersActive()?'Essaie d\'effacer les filtres.':'Planifie un contenu pour remplir ton mois.')+'</div>';
}
return h+'</div>';
}
function nextPub(c){const t=today();const ps=(c.publications||[]).filter(p=>isValidDate(p.date)).sort((a,b)=>a.date<b.date?-1:1);return ps.find(p=>!p.done&&p.date>=t)||ps.find(p=>!p.done)||ps[ps.length-1];}
function accChips(c,max){
max=max||3;const ps=(c.publications||[]);if(!ps.length)return'<span class="chip-acc">Pas encore planifié</span>';
return ps.slice(0,max).map(p=>{const a=S.accounts[p.accountId];const late=!p.done&&isValidDate(p.date)&&p.date<today();
return'<span class="chip-acc'+(late?' late':'')+'"><span class="dot" style="--c:'+accColor(a)+'"></span>'+esc(accLabel(a))+(isValidDate(p.date)?' · '+fmtShort(p.date):'')+(p.done?' ✓':'')+'</span>';}).join('')+(ps.length>max?'<span class="chip-acc">+'+(ps.length-max)+'</span>':'');
}
function matchSearch(c){const q=S.ui.search.trim().toLowerCase();if(!q)return true;
return[c.title,c.notes,c.caption,c.hashtags,c.cast,(c.shoots||[]).map(s=>s.location+' '+s.note).join(' '),(c.themes||[]).map(id=>(themeOf(id)||{}).label).join(' '),(c.scenes||[]).map(s=>s.heading+' '+s.body).join(' ')].join(' ').toLowerCase().includes(q);}
function viewContents(){
const u=S.ui;const list=contents().filter(c=>passContent(c)&&matchSearch(c)).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));
let h='<div class="wrap"><div class="head"><div><span class="label">Contenus</span><h1>Production</h1><p class="muted">Chaque contenu avance d\'une étape à l\'autre jusqu\'à sa publication.</p></div><button class="btn primary" data-act="new" data-status="ecriture">'+ICON.plus+'Nouveau contenu</button></div>';
h+='<div class="cal-bar"><div class="search">'+ICON.search+'<input class="inp" id="search" type="search" placeholder="Rechercher titre, script, hashtag…" value="'+esc(u.search)+'" data-input="search"></div>'+
'<div class="seg" role="group" aria-label="Affichage">'+[['board','Tableau'],['list','Liste']].map(m=>'<button data-act="list-mode" data-mode="'+m[0]+'" aria-pressed="'+(u.listMode===m[0])+'">'+m[1]+'</button>').join('')+'</div></div>';
h+=filterBar();
if(!contents().length){return h+'<div class="empty"><b>Aucun contenu pour l\'instant</b>Crée ton premier skit, podcast ou concept.<br><button class="btn primary" data-act="new" data-status="ecriture">Créer un contenu</button></div></div>';}
if(u.listMode==='board'){
const cols=STATUSES.filter(s=>s.id!=='idee'||u.filters.status==='idee');
const ideasN=list.filter(c=>c.status==='idee').length;
h+='<div class="board" id="board">'+cols.map(s=>{const cs=list.filter(c=>c.status===s.id);
return'<div class="col" data-drop-status="'+s.id+'"><div class="col-h"><span class="dot" style="--c:'+s.c+'"></span>'+s.label+'<span class="mono">'+cs.length+'</span></div>'+
cs.map(card).join('')+(cs.length?'':'<p class="hint" style="margin:6px 4px">Glisse un contenu ici ou utilise la flèche d\'une carte.</p>')+'</div>';}).join('')+'</div>';
if(ideasN&&u.filters.status!=='idee')h+='<p class="hint" style="margin:0">'+plural(ideasN,'idée')+' en attente dans <button class="btn ghost small" data-nav="ideas">la banque d\'idées</button></p>';
}else{
h+=list.length?'<div class="table-wrap"><table><thead><tr><th>Titre</th><th>Format</th><th>Thématiques</th><th>Statut</th><th>Distribution</th><th>Diffusion</th><th>Prochaine date</th></tr></thead><tbody>'+
list.map(c=>{const t=typeOf(c.type),s=statusOf(c.status),np=nextPub(c);
return'<tr data-act="open" data-id="'+esc(c.id)+'"><td><b>'+esc(titleOf(c))+'</b></td><td><span class="pill" style="--c:'+t.color+'">'+esc(t.label)+'</span></td><td><div class="card-f">'+(themePills(c)||'<span class="muted">—</span>')+'</div></td><td><span class="pill" style="--c:'+s.c+'">'+s.label+'</span></td><td>'+(distLabel(c)?esc(distLabel(c)):'<span class="muted">—</span>')+'</td><td><div class="card-f">'+accChips(c,2)+'</div></td><td class="mono">'+(np&&isValidDate(np.date)?fmtShort(np.date)+(np.time?' · '+esc(np.time):''):'—')+'</td></tr>';}).join('')+'</tbody></table></div>'
:'<div class="empty"><b>Aucun résultat</b>Change ta recherche ou tes filtres.</div>';
}
return h+'</div>';
}
function nextShootLabel(c){const t=today();const s=(c.shoots||[]).filter(x=>isValidDate(x.start)&&shootEnd(x)>=t).sort((a,b)=>a.start<b.start?-1:1)[0];return s?'Tournage '+fmtShoot(s)+((c.shoots||[]).length>1?' · '+c.shoots.length+' sessions':''):'';}
function card(c){
const t=typeOf(c.type);const i=STATUSES.findIndex(s=>s.id===c.status);const nx=STATUSES[i+1];
return'<div class="card" data-act="open" data-id="'+esc(c.id)+'" draggable="true" data-drag="card:'+esc(c.id)+'">'+
'<div class="card-b"><span class="pill" style="--c:'+t.color+'">'+esc(t.label)+'</span>'+(c.duration?'<span class="mono muted">'+esc(c.duration)+'</span>':'')+'</div>'+
'<div class="card-t">'+esc(titleOf(c))+'</div>'+(distLabel(c)?'<div class="card-f">'+distPill(c)+'</div>':'')+((c.themes||[]).length?'<div class="card-f">'+themePills(c)+'</div>':'')+'<div class="card-f">'+accChips(c)+'</div>'+
(nx?'<div class="card-b"><span class="hint">'+(['ecriture','production','tournage'].includes(c.status)?nextShootLabel(c):'')+'</span><button class="btn small ghost" data-act="advance" data-id="'+esc(c.id)+'" title="Passer à : '+nx.label+'">'+nx.label+ICON.arrow+'</button></div>':'')+'</div>';
}
const IDEA_STATES={proposee:{label:'En attente',c:'#5B6CFF'},atravailler:{label:'À retravailler',c:'#C98C00'},validee:{label:'Validée',c:'#14A37F'},refusee:{label:'Refusée',c:'#D2402C'}};
let reviewing=null;
const allIdeas=()=>contents().filter(c=>c.status==='idee').sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
function ideasToHandle(){return isAdmin()?allIdeas().filter(c=>c.ideaState==='proposee'):allIdeas().filter(c=>c.author==='assistant'&&c.ideaState==='atravailler');}
function canEditIdea(c){return isAdmin()||(c.author==='assistant'&&['proposee','atravailler'].includes(c.ideaState));}
function canDeleteIdea(c){return isAdmin()||c.author==='assistant';}
function normUrl(u){u=String(u||'').trim();if(!u)return'';return/^https?:\/\//i.test(u)?u:'https://'+u;}
function linkInfo(u){let h='';try{h=new URL(normUrl(u)).hostname.replace(/^www\.|^m\./,'');}catch(e){return{label:'Lien',ok:false};}
const m=[['tiktok.com','TikTok'],['youtube.com','YouTube'],['youtu.be','YouTube'],['instagram.com','Instagram'],['facebook.com','Facebook'],['fb.watch','Facebook'],['x.com','X'],['twitter.com','X'],['pinterest.','Pinterest'],['vimeo.com','Vimeo'],['threads.net','Threads'],['snapchat.com','Snapchat']].find(x=>h.includes(x[0]));
return{label:m?m[1]:h,ok:true};}
function linksHtml(c){const ls=(c.links||[]).filter(l=>l.url&&l.url.trim());if(!ls.length)return'';
return'<div class="links">'+ls.map(l=>{const i=linkInfo(l.url);return'<a class="link-chip" href="'+esc(normUrl(l.url))+'" target="_blank" rel="noopener" title="'+esc(l.url)+'">↗ '+esc(i.label)+'</a>';}).join('')+'</div>';}
function targetChips(c){return(c.targets||[]).map(id=>{const a=S.accounts[id];return a?'<span class="chip-acc"><span class="dot" style="--c:'+accColor(a)+'"></span>'+esc(platOf(a.platform).label)+' · '+esc(a.handle)+'</span>':'';}).join('');}
function ideaCard(c){
const t=typeOf(c.type);const st=IDEA_STATES[c.ideaState]||IDEA_STATES.validee;
let h='<div class="idea'+(c.ideaState==='proposee'&&isAdmin()?' proposee':'')+'">';
h+='<div class="card-b"><div class="card-f"><span class="pill" style="--c:'+t.color+'">'+esc(t.label)+'</span>'+themePills(c)+'</div><span class="pill" style="--c:'+st.c+'">'+st.label+'</span></div>';
h+='<b class="card-t">'+esc(titleOf(c))+'</b>';
h+='<span class="by">'+(c.author==='assistant'?'Proposée par '+esc(c.authorName||roleName('assistant')):'Idée de l\'admin')+(c.createdAt?' · '+fmtStamp(c.createdAt):'')+'</span>';
if(c.notes)h+='<p>'+esc(c.notes)+'</p>';
if((c.targets||[]).length)h+='<div class="card-f">'+targetChips(c)+'</div>';
h+=linksHtml(c);
if(c.review&&c.review.comment&&['atravailler','refusee'].includes(c.ideaState))h+='<div class="review '+c.ideaState+'"><b>'+(c.ideaState==='refusee'?'Refusée parce que':'À retravailler')+'</b>'+esc(c.review.comment)+'</div>';
if(reviewing&&reviewing.id===c.id){
h+='<form class="field" data-form="review" data-id="'+esc(c.id)+'" data-kind="'+reviewing.kind+'"><span>'+(reviewing.kind==='refusee'?'Pourquoi tu refuses ?':'Qu\'est-ce qu\'il faut retravailler ?')+'</span><textarea class="inp" id="rv-'+esc(c.id)+'" rows="2" placeholder="'+(reviewing.kind==='refusee'?'Ex. : trop proche du skit de mars':'Ex. : trouve une chute plus forte')+'"></textarea><div class="card-b"><button type="button" class="btn small ghost" data-act="idea-review-cancel">Annuler</button><button class="btn small primary" type="submit">Envoyer</button></div></form>';
}
const acts=[];
if(isAdmin()){
if(c.ideaState!=='validee')acts.push('<button class="btn small primary" data-act="idea-validate" data-id="'+esc(c.id)+'">'+ICON.check+'Valider</button>');
if(c.ideaState==='proposee'){acts.push('<button class="btn small" data-act="idea-review" data-kind="atravailler" data-id="'+esc(c.id)+'">À retravailler</button>');acts.push('<button class="btn small danger" data-act="idea-review" data-kind="refusee" data-id="'+esc(c.id)+'">Refuser</button>');}
if(c.ideaState==='validee')acts.push('<button class="btn small primary" data-act="idea-promote" data-id="'+esc(c.id)+'">En écriture'+ICON.arrow+'</button>');
}
acts.push('<button class="btn small ghost" data-act="idea-open" data-id="'+esc(c.id)+'">'+(canEditIdea(c)?(c.ideaState==='atravailler'&&!isAdmin()?'Retravailler':'Modifier'):'Voir')+'</button>');
if(canDeleteIdea(c))acts.push('<button class="icon-btn sm danger" data-act="idea-del" data-id="'+esc(c.id)+'" data-confirm="Supprimer ?" aria-label="Supprimer l\'idée">'+ICON.trash+'</button>');
h+='<div class="card-f" style="margin-top:auto">'+acts.join('')+'</div></div>';
return h;
}
function ideaSection(title,list,empty,hint,fold){
if(fold)return list.length?'<details class="fold" id="fold-'+esc(title.replace(/\W+/g,''))+'"><summary>'+esc(title)+' ('+list.length+')</summary><div class="idea-cols" style="margin-top:10px">'+list.map(ideaCard).join('')+'</div></details>':'';
return'<section class="chan"><div class="chan-h"><h2>'+esc(title)+'</h2><span class="mono muted">'+list.length+'</span>'+(hint?'<span class="hint">'+esc(hint)+'</span>':'')+'</div>'+
(list.length?'<div class="idea-cols">'+list.map(ideaCard).join('')+'</div>':'<div class="empty" style="padding:16px">'+esc(empty)+'</div>')+'</section>';
}
function viewIdeas(){
const all=allIdeas();const admin=isAdmin();
let h='<div class="wrap"><div class="head"><div><span class="label">Banque d\'idées</span><h1>'+(admin?'Idées':'Proposer des idées')+'</h1><p class="muted">'+(admin?'Valide les propositions, renvoie-les à retravailler ou refuse-les avec un mot. Les idées validées passent ensuite en écriture.':'Propose tes idées avec les comptes visés et des liens de référence. L\'admin les valide ou te les renvoie avec un commentaire.')+'</p></div>'+
'<button class="btn primary" data-act="idea-new">'+ICON.plus+(admin?'Idée détaillée':'Proposition détaillée')+'</button></div>';
h+='<form class="quick" data-form="idea"><input class="inp" id="qi" placeholder="Ex. : skit sur les taxi-be aux heures de pointe" autocomplete="off" aria-label="Nouvelle idée">'+
'<select class="inp" id="qi-type" aria-label="Format">'+settings().types.map(t=>'<option value="'+esc(t.id)+'"'+(t.id===S.ui.ideaType?' selected':'')+'>'+esc(t.label)+'</option>').join('')+'</select>'+
'<button class="btn" type="submit">'+ICON.plus+(admin?'Ajouter':'Proposer')+'</button></form>';
if(admin){
h+=ideaSection('À traiter',all.filter(c=>c.ideaState==='proposee'),'Aucune proposition en attente.','Proposées par '+roleName('assistant'));
h+=ideaSection('Validées',all.filter(c=>c.ideaState==='validee'),'Aucune idée validée pour l\'instant.','Prêtes à passer en écriture');
h+=ideaSection('Renvoyées à retravailler',all.filter(c=>c.ideaState==='atravailler'),'Rien en cours de reprise.','');
h+=ideaSection('Refusées',all.filter(c=>c.ideaState==='refusee'),'','',true);
}else{
const mine=all.filter(c=>c.author==='assistant');
h+=ideaSection('À retravailler',mine.filter(c=>c.ideaState==='atravailler'),'Rien à retravailler pour l\'instant.','Lis le commentaire, modifie et renvoie');
h+=ideaSection('En attente de validation',mine.filter(c=>c.ideaState==='proposee'),'Aucune proposition en attente.','');
h+=ideaSection('Idées validées',all.filter(c=>c.ideaState==='validee'),'Aucune idée validée pour l\'instant.','Toutes les idées retenues');
h+=ideaSection('Mes idées refusées',mine.filter(c=>c.ideaState==='refusee'),'','',true);
}
return h+'</div>';
}
let ideaDraft=null,ideaRO=false;
function newIdea(){const c=newContent({status:'idee',title:''});c.author=ROLE;c.authorName=roleName(ROLE);c.ideaState=isAdmin()?'validee':'proposee';c.links=[{id:uid(),url:''}];c.targets=[];return c;}
function openIdea(id){const c=id&&S.contents[id];ideaDraft=c?normContent(clone(c)):newIdea();if(!ideaDraft.links.length&&(!c||canEditIdea(c)))ideaDraft.links.push({id:uid(),url:''});
ideaRO=c?!canEditIdea(c):false;renderIdea();$('#idea').hidden=false;document.body.classList.add('locked');if(!c){const t=$('#if-title');if(t)t.focus();}}
function closeIdea(){ideaDraft=null;$('#idea').hidden=true;if(!draft&&!peekId&&$('#rdvm').hidden)document.body.classList.remove('locked');}
function renderIdea(){
const c=ideaDraft;if(!c)return;const st=settings();const isNew=!S.contents[c.id];const dis=ideaRO?' disabled':'';
const panel=$('#idea-panel');const sc=panel.scrollTop;
let h='<div class="peek-h"><div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:6px"><span class="label">'+(isNew?(isAdmin()?'Nouvelle idée':'Nouvelle proposition'):(IDEA_STATES[c.ideaState]||{}).label||'Idée')+(c.author==='assistant'?' · par '+esc(c.authorName||roleName('assistant')):'')+'</span>'+
'<input class="title-inp" style="font-size:22px" id="if-title" data-if="title" value="'+esc(c.title)+'" placeholder="Titre de l\'idée" aria-label="Titre"'+dis+'></div><button class="icon-btn" data-act="idea-close" aria-label="Fermer">'+ICON.x+'</button></div><div class="peek-b">';
if(c.review&&c.review.comment&&['atravailler','refusee'].includes(c.ideaState))h+='<div class="review '+c.ideaState+'"><b>'+(c.ideaState==='refusee'?'Refusée parce que':'À retravailler')+'</b>'+esc(c.review.comment)+'</div>';
h+='<label class="field"><span>Description</span><textarea class="inp" id="if-notes" data-if="notes" rows="4" placeholder="Le concept, la chute, le ton…"'+dis+'>'+esc(c.notes)+'</textarea></label>';
h+='<label class="field"><span>Format</span><select class="inp" id="if-type" data-if="type"'+dis+'>'+st.types.map(t=>'<option value="'+esc(t.id)+'"'+(t.id===c.type?' selected':'')+'>'+esc(t.label)+'</option>').join('')+'</select></label>';
h+='<div class="field"><span>Thématiques</span><div class="chip-pick">'+st.themes.map(t=>'<button type="button" data-act="idea-theme" data-t="'+esc(t.id)+'" aria-pressed="'+c.themes.includes(t.id)+'"'+dis+'>'+esc(t.label)+'</button>').join('')+'</div></div>';
const accs=accounts();
h+='<div class="field"><span>Proposée pour quels comptes ?</span>'+(accs.length?'<div class="chip-pick">'+accs.map(a=>'<button type="button" data-act="idea-target" data-a="'+esc(a.id)+'" aria-pressed="'+c.targets.includes(a.id)+'"'+dis+'><span class="dot" style="--c:'+accColor(a)+'"></span>'+esc(platOf(a.platform).label)+' · '+esc(a.handle)+'</button>').join('')+'</div>':'<span class="hint">Aucun compte enregistré dans Réseaux.</span>')+'</div>';
h+='<div class="field"><span>Liens de référence</span>';
if(ideaRO)h+=linksHtml(c)||'<span class="hint">Aucun lien.</span>';
else h+=c.links.map(l=>{const i=linkInfo(l.url);return'<div class="link-line"><input class="inp" id="il-'+esc(l.id)+'" data-lf="'+esc(l.id)+'" value="'+esc(l.url)+'" placeholder="Colle un lien TikTok, YouTube, Instagram…" inputmode="url" autocapitalize="off">'+(l.url&&i.ok?'<a class="link-chip" href="'+esc(normUrl(l.url))+'" target="_blank" rel="noopener">↗ '+esc(i.label)+'</a>':'')+'<button type="button" class="icon-btn sm" data-act="idea-dellink" data-lid="'+esc(l.id)+'" aria-label="Retirer ce lien">'+ICON.x+'</button></div>';}).join('')+
'<button type="button" class="btn small" data-act="idea-addlink" style="align-self:flex-start">'+ICON.plus+'Ajouter un lien</button>';
h+='</div></div>';
const saveLabel=isAdmin()?'Enregistrer':(c.ideaState==='atravailler'?'Renvoyer à l\'admin':(isNew?'Proposer':'Enregistrer'));
h+='<div class="peek-f">'+(ideaRO?'<button class="btn" data-act="idea-close">Fermer</button>':'<button class="btn primary" data-act="idea-save">'+ICON.check+saveLabel+'</button><button class="btn" data-act="idea-close">Annuler</button>')+'</div>';
panel.innerHTML=h;panel.scrollTop=sc;
}
$('#idea-panel').addEventListener('input',e=>{if(!ideaDraft||ideaRO)return;const el=e.target;
if(el.dataset.if)ideaDraft[el.dataset.if]=el.value;
else if(el.dataset.lf){const l=ideaDraft.links.find(x=>x.id===el.dataset.lf);if(l)l.url=el.value;}});
$('#idea-panel').addEventListener('change',e=>{if(e.target.dataset.lf&&ideaDraft){renderIdea();}});
$('#idea').addEventListener('click',e=>{if(e.target.id==='idea')closeIdea();});
function saveIdea(){
const c=clone(ideaDraft);if(!c.title.trim()){toast('Donne un titre à l\'idée.');const t=$('#if-title');if(t)t.focus();return;}
c.links=c.links.filter(l=>l.url&&l.url.trim()).map(l=>({id:l.id,url:normUrl(l.url)}));
const before=S.contents[c.id];
if(!isAdmin()&&c.ideaState==='atravailler'){c.ideaState='proposee';c.review=Object.assign({},c.review||{},{resubmittedAt:Date.now()});}
Store.saveContent(c);
if(!before)logChange('content','create',c.id,titleOf(c),isAdmin()?'Idée ajoutée':'Idée proposée',null);
else logChange('content','update',c.id,titleOf(c),before.ideaState!==c.ideaState?'Idée renvoyée pour validation':'Idée modifiée',before);
toast(!before?(isAdmin()?'Idée ajoutée aux validées':'Idée proposée à l\'admin'):(before.ideaState!==c.ideaState?'Idée renvoyée à l\'admin':'Idée enregistrée'));
closeIdea();
}
function promoteIdea(id){
if(!isAdmin()){toast('Réservé à la vue admin.');return;}
const c0=S.contents[id];if(!c0)return;
updateContent(id,c=>{c.status='ecriture';c.ideaState='validee';(c.targets||[]).forEach(aid=>{const a=S.accounts[aid];if(a&&!c.publications.some(p=>p.accountId===aid))c.publications.push({id:uid(),channel:platOf(a.platform).channel||'social',accountId:aid,date:'',time:'',done:false});});},'Idée passée en écriture');
toast('« '+titleOf(c0)+' » est en écriture');
}
const ACT_LABEL={create:'Création',update:'Modification',delete:'Suppression',restore:'Restauration'};
const ACT_ICON={create:'+',update:'✎',delete:'×',restore:'↺'};
const KIND_LABEL={content:'Contenu',account:'Compte',settings:'Réglages',rdv:'Rendez-vous',doc:'Devis / facture',media:'Projection',deal:'Partenariat',contact:'Contact',task:'Tâche',request:'Demande'};
function histRow(e){
const canRestore=!!e.before&&isAdmin();
return'<div class="hist-row"><span class="hist-ic '+esc(e.action)+'" aria-hidden="true">'+(ACT_ICON[e.action]||'•')+'</span><div style="min-width:0"><b>'+esc(e.label||KIND_LABEL[e.kind]||'')+'</b><div class="row-meta"><span>'+(ACT_LABEL[e.action]||e.action)+' · '+esc(KIND_LABEL[e.kind]||'')+'</span><span class="mono">'+fmtStamp(e.at)+'</span>'+(e.by?'<span>par '+esc(e.by)+'</span>':'')+(e.summary?'<span>'+esc(e.summary)+'</span>':'')+'</div></div>'+
(canRestore?'<button class="btn small" data-act="restore" data-hid="'+esc(e.id)+'" data-confirm="Restaurer ?" title="Remettre l\'état d\'avant ce changement">'+ICON.undo+'Restaurer</button>':'<span></span>')+'</div>';
}
function viewSettings(){
const st=settings();
let h='<div class="wrap"><div class="head"><div><span class="label">Réglages</span><h1>Réglages</h1></div><span class="pill plain">Version '+APP_VERSION+'</span></div>';
h+='<div class="grid-2">';
h+='<section class="panel"><div class="panel-h"><h2>Formats</h2><span class="mono muted">'+st.types.length+'</span></div><p class="hint" style="margin:-4px 0 12px">La forme du contenu : skit, podcast, court métrage…</p><div class="set-list">'+
st.types.map(t=>'<div class="set-item"><input type="color" class="swatch" id="tc-'+esc(t.id)+'" value="'+esc(t.color)+'" data-type-color="'+esc(t.id)+'" aria-label="Couleur"><input class="inp" id="tl-'+esc(t.id)+'" value="'+esc(t.label)+'" data-type-label="'+esc(t.id)+'" aria-label="Nom du format"><button class="icon-btn sm danger" data-act="type-del" data-id="'+esc(t.id)+'" data-confirm="✓" aria-label="Supprimer '+esc(t.label)+'">'+ICON.x+'</button></div>').join('')+
'</div><form class="add-form" data-form="type"><input class="inp" id="type-new" placeholder="Nouveau format (ex. Unboxing)" autocomplete="off"><button class="btn" type="submit">'+ICON.plus+'Ajouter</button></form></section>';
h+='<section class="panel"><div class="panel-h"><h2>Thématiques</h2><span class="mono muted">'+st.themes.length+'</span></div><p class="hint" style="margin:-4px 0 12px">Le sujet du contenu : sport, lifestyle, cinématique… Un contenu peut en avoir plusieurs.</p><div class="set-list">'+
st.themes.map(t=>'<div class="set-item"><input class="inp" id="th-'+esc(t.id)+'" value="'+esc(t.label)+'" data-theme-label="'+esc(t.id)+'" aria-label="Nom de la thématique"><button class="icon-btn sm danger" data-act="theme-del" data-id="'+esc(t.id)+'" data-confirm="✓" aria-label="Supprimer '+esc(t.label)+'">'+ICON.x+'</button></div>').join('')+
'</div><form class="add-form" data-form="theme"><input class="inp" id="theme-new" placeholder="Nouvelle thématique (ex. Gaming)" autocomplete="off"><button class="btn" type="submit">'+ICON.plus+'Ajouter</button></form></section>';
h+='</div>';
h+=uiThemePanel();
h+=signaturePanel();
h+='<section class="panel"><div class="panel-h"><h2>Plan de travail de '+esc(roleName('assistant'))+'</h2></div><label class="perm"><span>Afficher son plan de travail dans ma vue (sauf ses tâches privées)</span><input type="checkbox" class="switch" id="plan-show-sw" data-plan-sw="1"'+(settings().showAssistPlan?' checked':'')+'></label></section>';
h+='<section class="panel"><div class="panel-h"><h2>Vues &amp; accès</h2></div><div class="f-grid">'+
'<label class="field"><span>Prénom de l\'assistante</span><input class="inp" id="asst-name" value="'+esc(st.assistantName)+'" placeholder="Assistante" data-asst-name="1"></label>'+
(S.mode==='supa'?'</div>':'<form class="field" data-form="pin" style="grid-column:span 2"><span>Changer le code PIN admin</span><div class="link-line"><input class="inp pin" id="pin-new" type="password" inputmode="numeric" autocomplete="new-password" placeholder="••••" aria-label="Nouveau code PIN"><button class="btn" type="submit">Enregistrer</button></div></form></div>')+
'<p class="hint" style="margin:10px 0 0">La vue assistante ne peut pas supprimer de projet, valider des idées, toucher aux plateformes, aux formats, aux boîtes ni à ces réglages. Le code PIN protège l\'interface, pas les données : partage ton jeton GitHub seulement avec une personne de confiance.</p></section>';
h+=permsPanel();
h+=templatesPanel();
h+=goalsSettings();
h+='<section class="panel"><div class="panel-h"><h2>Rappels</h2></div>'+notifBox()+'</section>';
h+='<section class="panel"><div class="panel-h"><h2>Synchronisation &amp; sauvegarde</h2></div>';
if(S.mode==='supa'){h+=Supa.panel()+'<hr style="border:0;border-top:1px solid var(--line);margin:14px 0">';}
else if(S.mode==='cloud'){
h+='<p class="muted" style="margin:0 0 12px">Tes données sont synchronisées automatiquement entre ton téléphone, ta tablette et ton ordinateur. L\'export te donne une copie de sécurité en plus, que tu peux importer dans la version GitHub.</p>';
}else{
const c=Sync.cfg;
h+='<div class="sync-box">';
if(c&&c.gistId){
h+='<p style="margin:0"><b>'+esc(Sync.label())+'</b>'+(Sync.state==='error'&&Sync.err?' · <span style="color:var(--late)">'+esc(Sync.err)+'</span>':'')+'</p>'+
'<p class="muted" style="margin:0">Identifiant de synchro à copier sur tes autres appareils : <span class="code" id="gist-id">'+esc(c.gistId)+'</span></p>'+
'<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-act="gist-copy">'+ICON.copy+'Copier l\'identifiant</button><button class="btn" data-act="gist-push">Envoyer maintenant</button><button class="btn" data-act="gist-pull">Récupérer maintenant</button><button class="btn danger" data-act="gist-off" data-confirm="Désactiver ?">Désactiver</button></div>';
}else{
h+='<p class="muted" style="margin:0">Sans synchro, ton planning reste dans ce navigateur. Pour le retrouver sur tous tes appareils, colle ici un jeton GitHub (permission « gist »).</p>'+
'<form class="add-form" data-form="gist" style="margin-top:0"><input class="inp" id="gist-token" type="password" placeholder="Jeton GitHub (ghp_…)" autocomplete="off"><input class="inp" id="gist-idin" placeholder="Identifiant de synchro (sur un 2e appareil)" autocomplete="off"><button class="btn primary" type="submit">Activer</button></form>'+
'<p class="hint" style="margin:0">Premier appareil : laisse l\'identifiant vide, un espace privé sera créé sur ton compte GitHub. Appareils suivants : colle le même jeton et l\'identifiant affiché sur le premier. Les données de l\'appareil seront alors remplacées par celles de GitHub.</p>';
}
h+='</div><hr style="border:0;border-top:1px solid var(--line);margin:14px 0">';
}
h+='<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-act="export">Exporter (.json)</button><button class="btn" data-act="import">Importer un fichier</button></div></section>';
const hs=S.history.slice(0,S.ui.histAll?HMAX_CLOUD:25);
h+='<section class="panel"><div class="panel-h"><h2>Historique des modifications</h2><span class="mono muted">'+S.history.length+'</span></div>'+
'<p class="hint" style="margin:-4px 0 10px">Chaque création, modification ou suppression est notée. « Restaurer » remet l\'élément tel qu\'il était juste avant ce changement.</p>'+
(hs.length?'<div class="hist">'+hs.map(histRow).join('')+'</div>'+(S.history.length>hs.length?'<button class="btn ghost small" data-act="hist-all">Voir tout l\'historique</button>':'')
:'<div class="empty"><b>Aucune modification enregistrée</b>Tes prochains changements apparaîtront ici.</div>')+'</section>';
h+='<section class="panel"><div class="panel-h"><h2>Versions du site</h2></div>'+VERSIONS.map(v=>'<div class="ver"><b>Version '+esc(v.v)+'</b> <span class="mono muted">'+fmtShort(v.date)+' '+pd(v.date).getFullYear()+'</span>'+(v.v===APP_VERSION?' <span class="pill" style="--c:var(--ok)">Actuelle</span>':'')+'<ul>'+v.items.map(i=>'<li>'+esc(i)+'</li>').join('')+'</ul></div>').join('')+'</section>';
return h+'</div>';
}
const SS_ROLE='studio-tefi-role-tab';
function ssGet(k){try{return sessionStorage.getItem(k);}catch(e){return null;}}
function ssSet(k,v){try{if(v)sessionStorage.setItem(k,v);else sessionStorage.removeItem(k);}catch(e){}}
let ROLE=ssGet(SS_ROLE)||'';
if(!ROLE){const rem=lsGet(LS_ROLE);if(rem==='assistant')ROLE='assistant';else if(rem&&rem.role==='admin'&&rem.until>Date.now())ROLE='admin';}
if(ROLE!=='admin'&&ROLE!=='assistant')ROLE='';
let gateStep='choose';
const isAdmin=()=>ROLE==='admin';
function roleName(r){return r==='assistant'?(settings().assistantName||'Assistante'):'Admin';}
async function hashPin(pin){const txt='studio-tefi:'+pin;
try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(txt));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('');}
catch(e){let h=5381;for(const ch of txt)h=((h<<5)+h+ch.charCodeAt(0))|0;return'w'+(h>>>0).toString(16);}}
function setRole(r,remember){ROLE=r;ssSet(SS_ROLE,r);if(r==='assistant')lsSet(LS_ROLE,'assistant');else if(r==='admin')lsSet(LS_ROLE,remember?{role:'admin',until:Date.now()+30*864e5}:null);gateStep='choose';if(r!=='admin'&&S.ui.view==='settings')S.ui.view='home';render();window.scrollTo(0,0);if(r)toast(r==='admin'?'Vue admin ouverte':'Vue '+roleName('assistant')+' ouverte');}
function viewGate(){
if(S.mode==='supa')return Supa.gate();
let h='<div class="gate"><div class="gate-brand"><div class="brand-mark">T</div><div><h1>Studio Tefi</h1><span class="muted">Qui utilise l\'appli sur cet appareil ?</span></div></div>';
if(gateStep==='choose'){
h+='<div class="gate-choices"><button class="gate-choice" data-act="gate-admin" style="--c:#4636D9"><i></i><b>Admin</b><span class="muted">Accès complet. Protégé par ton code PIN.</span></button>'+
'<button class="gate-choice" data-act="gate-assistant" style="--c:#2E7D5B"><i></i><b>'+esc(roleName('assistant'))+'</b><span class="muted">Propose des idées, gère le planning, les projets et les rendez-vous.</span></button></div>';
}else{
const has=!!settings().pinHash;
h+='<form class="panel" data-form="gate-pin" style="display:flex;flex-direction:column;gap:12px"><h2>'+(has?'Code PIN admin':'Crée ton code PIN admin')+'</h2>'+
'<p class="muted" style="margin:0">'+(has?'Entre ton code pour ouvrir la vue admin.':'Choisis un code d\'au moins 4 chiffres. Il sera demandé à chaque passage en vue admin, sur tous tes appareils synchronisés.')+'</p>'+
'<input class="inp pin" id="gate-pin" type="password" inputmode="numeric" autocomplete="off" placeholder="••••" aria-label="Code PIN">'+
(has?'':'<input class="inp pin" id="gate-pin2" type="password" inputmode="numeric" autocomplete="off" placeholder="Confirmer" aria-label="Confirmer le code PIN">')+
'<label class="toggle"><input type="checkbox" id="gate-remember">Garder la vue admin 30 jours sur cet appareil (seulement s\'il est à toi)</label>'+
'<div class="card-b"><button type="button" class="btn ghost" data-act="gate-back">Retour</button><button class="btn primary" type="submit">Ouvrir la vue admin</button></div></form>';
}
if(S.mode==='local'&&!(Sync.cfg&&Sync.cfg.gistId))h+='<p class="hint">Nouvel appareil ? Choisis ta vue, puis ouvre « Plus » (ou le bas du menu) → Synchronisation pour retrouver le planning.</p>';
return h+'</div>';
}
function syncBox(){
if(S.mode==='supa')return Supa.panel();
if(S.mode==='cloud')return'<p class="muted" style="margin:0">Données synchronisées automatiquement sur tous les appareils connectés à ce lien.</p>';
const c=Sync.cfg;
if(c&&c.gistId)return'<div class="sync-box"><p style="margin:0"><b>'+esc(Sync.label())+'</b>'+(Sync.state==='error'&&Sync.err?' · <span style="color:var(--late)">'+esc(Sync.err)+'</span>':'')+'</p>'+
'<p class="muted" style="margin:0">Identifiant de synchro : <span class="code" id="gist-id">'+esc(c.gistId)+'</span></p>'+
'<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-act="gist-copy">'+ICON.copy+'Copier l\'identifiant</button><button class="btn" data-act="gist-pull">Récupérer maintenant</button><button class="btn danger" data-act="gist-off" data-confirm="Désactiver ?">Désactiver</button></div></div>';
return'<div class="sync-box"><p class="muted" style="margin:0">Colle le jeton GitHub et l\'identifiant de synchro que l\'admin t\'a donnés.</p>'+
'<form class="add-form" data-form="gist" style="margin-top:0"><input class="inp" id="gist-token" type="password" placeholder="Jeton GitHub (ghp_…)" autocomplete="off"><input class="inp" id="gist-idin" placeholder="Identifiant de synchro" autocomplete="off"><button class="btn primary" type="submit">Activer</button></form></div>';
}
function viewMore(){
let h='<div class="wrap"><div class="head"><div><span class="label">Plus</span><h1>Menu</h1></div><span class="pill plain">Version '+APP_VERSION+'</span></div>';
h+='<div class="more-list"><button class="btn" data-nav="search">Rechercher</button><button class="btn" data-nav="ideas">Idées'+(ideasToHandle().length?' · '+ideasToHandle().length:'')+'</button><button class="btn" data-nav="networks">Réseaux &amp; distribution</button>'+(ROLE==='assistant'||(isAdmin()&&settings().showAssistPlan)?'<button class="btn" data-nav="plans">'+(isAdmin()?'Plan de '+esc(roleName('assistant')):'Plans de travail')+'</button>':'')+'<button class="btn" data-act="inbox-open">'+(isAdmin()?'À traiter':'Nouveautés')+(bellCount()?' · '+bellCount():'')+'</button>'+(isAdmin()?'<button class="btn" data-nav="settings">Réglages, historique et versions</button>':'')+
'<button class="btn" data-act="switch-role">'+(S.mode==='supa'?'Se déconnecter · '+esc(roleName(ROLE)):'Changer de vue · actuellement '+esc(roleName(ROLE)))+'</button></div>';
h+='<section class="panel"><div class="panel-h"><h2>Synchronisation</h2></div>'+syncBox()+'</section>';
h+='<section class="panel"><div class="panel-h"><h2>Rappels</h2></div>'+notifBox()+'</section>';
if(!isAdmin()&&can('history'))h+=historyPanel();
return h+'</div>';
}
function accUrl(a){if(!a)return'';if(a.url)return a.url;const h=String(a.handle||'').replace(/^@/,'');if(!h||!isSocial(a.platform))return'';
const k=(a.platform+' '+platOf(a.platform).label).toLowerCase();
if(k.includes('instagram'))return'https://www.instagram.com/'+encodeURIComponent(h)+'/';
if(k.includes('tiktok'))return'https://www.tiktok.com/@'+encodeURIComponent(h);
if(k.includes('facebook'))return'https://www.facebook.com/'+encodeURIComponent(h);
if(k.includes('youtube'))return'https://www.youtube.com/@'+encodeURIComponent(h);
return'';}
function composerUrl(a){if(!a)return'';const k=(a.platform+' '+platOf(a.platform).label).toLowerCase();
if(k.includes('facebook')||k.includes('instagram'))return'https://business.facebook.com/latest/composer';
if(k.includes('tiktok'))return'https://www.tiktok.com/tiktokstudio/upload';
if(k.includes('youtube'))return'https://studio.youtube.com';
return accUrl(a);}
function prepLink(a,c,p){const u=composerUrl(a);if(!u||p.done)return'';
return'<a class="icon-btn sm" style="margin-left:auto" href="'+esc(u)+'" target="_blank" rel="noopener" data-act="prep-pub" data-id="'+esc(c.id)+'" title="Préparer la publication : copie la légende et ouvre l\'outil de publication" aria-label="Préparer la publication">'+ICON.arrow+'</a>';}
const companies=()=>settings().companies;
const compOf=id=>companies().find(k=>k.id===id);
function rdvColor(x){if(x.kind==='perso')return settings().persoColor;const c=compOf(x.companyId);return c?c.color:'#3D5A80';}
function rdvWho(x){if(x.kind==='perso')return'Perso';const c=compOf(x.companyId);return c?c.label:'Pro';}
function rdvRow(x,opts){opts=opts||{};const col=rdvColor(x);
const when=opts.showDate?'<div class="when"><b>'+pd(x.date).getDate()+'</b><span class="mono muted">'+MSHORT[pd(x.date).getMonth()]+'</span></div>':'';
return'<div class="row rdv-row">'+when+'<button class="row-main" data-act="rdv-open" data-id="'+esc(x.id)+'"><b>'+esc(x.title||'Rendez-vous')+'</b><span class="row-meta"><span class="pill" style="--c:'+col+'"><span class="dot" style="--c:'+col+'"></span>RDV · '+esc(rdvWho(x))+'</span>'+
(x.start?'<span class="rdv-time">'+esc(x.start)+(x.end?'–'+esc(x.end):'')+'</span>':'')+prioPill(x.priority,'rdv')+(x.location?'<span>📍 '+esc(x.location)+'</span>':'')+(x.contact?'<span>avec '+esc(x.contact)+'</span>':'')+(opts.showRel?'<span>'+rel(x.date)+'</span>':'')+'</span></button>'+
'<div class="row-acts"><button class="icon-btn sm" data-act="rdv-open" data-id="'+esc(x.id)+'" aria-label="Modifier">'+ICON.edit+'</button><button class="icon-btn sm danger" data-act="rdv-del" data-id="'+esc(x.id)+'" data-confirm="Supprimer ?" aria-label="Supprimer le rendez-vous">'+ICON.trash+'</button></div></div>';}
function rdvPass(x){const f=S.ui.rdvFilter;if(!f)return true;if(f==='perso')return x.kind==='perso';if(f==='pro')return x.kind!=='perso';return x.kind!=='perso'&&x.companyId===f;}
let rdvDraft=null;
function openRdv(id,preset){preset=preset||{};
rdvDraft=id&&S.rdv[id]?clone(S.rdv[id]):{id:'r'+uid(),title:'',date:preset.date||today(),start:'',end:'',kind:preset.comp?'pro':'pro',companyId:preset.comp||(companies()[0]||{}).id||'',location:'',link:'',contact:'',notes:'',createdBy:roleName(ROLE),createdAt:Date.now()};
renderRdv();$('#rdvm').hidden=false;document.body.classList.add('locked');if(!id){const t=$('#rf-title');if(t)t.focus();}}
function closeRdv(){rdvDraft=null;$('#rdvm').hidden=true;if(!draft&&!peekId&&$('#idea').hidden)document.body.classList.remove('locked');}
function renderRdv(){
const x=rdvDraft;if(!x)return;const isNew=!S.rdv[x.id];const col=rdvColor(x);
let h='<div class="peek-h"><div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:6px"><span class="label"><span class="dot" style="--c:'+col+'"></span> '+(isNew?'Nouveau rendez-vous':'Rendez-vous')+'</span><input class="title-inp" style="font-size:22px" id="rf-title" data-rf="title" value="'+esc(x.title)+'" placeholder="Objet du rendez-vous" aria-label="Objet"></div><button class="icon-btn" data-act="rdv-close" aria-label="Fermer">'+ICON.x+'</button></div><div class="peek-b">';
h+='<div class="field"><span>Priorité</span>'+prioPick(x.priority||'p2','rdv-prio','rdv')+'</div>';
h+='<div class="seg kind-seg" role="group" aria-label="Type">'+[['pro','Pro'],['perso','Perso']].map(k=>'<button type="button" data-act="rdv-kind" data-k="'+k[0]+'" aria-pressed="'+(x.kind===k[0])+'">'+k[1]+'</button>').join('')+'</div>';
if(x.kind==='pro')h+='<label class="field"><span>Pour quel client ?</span><select class="inp" id="rf-comp" data-rf="companyId"><option value="">Sans client précis</option>'+companies().map(c=>'<option value="'+esc(c.id)+'"'+(c.id===x.companyId?' selected':'')+'>'+esc(c.label)+'</option>').join('')+'</select>'+(companies().length?'':'<span class="hint">'+(isAdmin()?'Ajoute tes clients dans Business → Clients.':'Aucun client enregistré.')+'</span>')+'</label>';
h+='<div class="f-grid"><label class="field"><span>Date</span><input class="inp" type="date" id="rf-date" data-rf="date" value="'+esc(x.date)+'"></label><label class="field"><span>Début</span><input class="inp" type="time" id="rf-start" data-rf="start" value="'+esc(x.start)+'"></label><label class="field"><span>Fin</span><input class="inp" type="time" id="rf-end" data-rf="end" value="'+esc(x.end)+'"></label></div>';
h+='<div class="f-grid"><label class="field"><span>Lieu</span><input class="inp" id="rf-loc" data-rf="location" value="'+esc(x.location)+'" placeholder="Adresse ou « Visio »"></label><label class="field"><span>Avec qui</span><input class="inp" id="rf-contact" data-rf="contact" value="'+esc(x.contact)+'" placeholder="Nom, rôle"></label><label class="field"><span>Lien visio</span><input class="inp" id="rf-link" data-rf="link" value="'+esc(x.link)+'" placeholder="meet.google.com/…" inputmode="url" autocapitalize="off"></label></div>';
if(x.link)h+='<a class="link-chip" href="'+esc(normUrl(x.link))+'" target="_blank" rel="noopener" style="align-self:flex-start">↗ Ouvrir le lien</a>';
h+='<label class="field"><span>Notes</span><textarea class="inp" id="rf-notes" data-rf="notes" rows="3" placeholder="Ordre du jour, documents à apporter…">'+esc(x.notes)+'</textarea></label>';
if(!isNew&&x.createdBy)h+='<span class="hint">Ajouté par '+esc(x.createdBy)+'</span>';
h+='</div><div class="peek-f"><button class="btn primary" data-act="rdv-save">'+ICON.check+'Enregistrer</button><button class="btn" data-act="rdv-close">Annuler</button>'+(isNew?'':'<button class="btn danger" data-act="rdv-del" data-id="'+esc(x.id)+'" data-confirm="Supprimer ?">'+ICON.trash+'Supprimer</button>')+'</div>';
$('#rdv-panel').innerHTML=h;
}
$('#rdv-panel').addEventListener('input',e=>{if(!rdvDraft)return;const el=e.target;if(el.dataset.rf)rdvDraft[el.dataset.rf]=el.value;});
$('#rdv-panel').addEventListener('change',e=>{if(!rdvDraft)return;if(e.target.dataset.rf==='companyId'){rdvDraft.companyId=e.target.value;renderRdv();}});
$('#rdvm').addEventListener('click',e=>{if(e.target.id==='rdvm')closeRdv();});
function saveRdv(){
const x=clone(rdvDraft);if(!isValidDate(x.date)){toast('Choisis une date.');return;}
if(!x.title.trim())x.title=x.kind==='perso'?'Rendez-vous perso':(compOf(x.companyId)?'RDV '+compOf(x.companyId).label:'Rendez-vous pro');
if(x.kind==='perso')x.companyId='';
const before=S.rdv[x.id];Store.saveRdv(x);
logChange('rdv',before?'update':'create',x.id,x.title,(before?'Rendez-vous modifié':'Rendez-vous ajouté')+' · '+fmtShort(x.date)+(x.start?' '+x.start:''),before||null);
toast(before?'Rendez-vous enregistré':'Rendez-vous ajouté au '+fmtDay(x.date));closeRdv();
}
function deleteRdv(id){const before=S.rdv[id];if(!before)return;Store.deleteRdv(id);logChange('rdv','delete',id,before.title,'Rendez-vous supprimé',before);
if(rdvDraft&&rdvDraft.id===id)closeRdv();
toast('Rendez-vous supprimé',()=>{Store.saveRdv(before);logChange('rdv','restore',id,before.title,'Suppression annulée',null);});}
function handleV3Click(a,el,e){
const id=el.dataset.id;
switch(a){
case'nav-toggle':lsSet(LS_NAVMINI,!lsGet(LS_NAVMINI));applyNavMini();return true;
case'home-edit':S.ui.homeEdit=!S.ui.homeEdit;render();return true;
case'home-move':{const L=homeLayout();const id=el.dataset.b,d=+el.dataset.d;const i=L.order.indexOf(id);const vis=L.order.filter(x=>HOME_BLOCKS[x]&&HOME_BLOCKS[x].roles.includes(ROLE));const vi=vis.indexOf(id);const other=vis[vi+d];if(i<0||!other)return true;const j=L.order.indexOf(other);L.order[i]=other;L.order[j]=id;saveHomeLayout(L);return true;}
case'rdv-range':S.ui.rdvRange=el.dataset.r;saveUI();render();return true;
case'rdv-prio':if(rdvDraft){rdvDraft.priority=el.dataset.p;renderRdv();}return true;
case'fold':{const k=el.dataset.key;if(OPEN[k])delete OPEN[k];else OPEN[k]=true;render();return true;}
case'ui-theme':updateSettings(s=>{s.uiThemes=Object.assign({},s.uiThemes||{});s.uiThemes[el.dataset.who]=el.dataset.t;},'Couleurs de l\'interface modifiées');return true;
case'acc-style':{const acc=S.accounts[id];if(!acc)return true;const t=el.dataset.t;const cur=(acc.styles||[]).slice();const i=cur.indexOf(t);if(i>=0)cur.splice(i,1);else cur.push(t);updateAccount(id,{styles:cur});return true;}
}
if(S.mode==='supa'){if(Supa.click(a,el))return true;if(a==='switch-role'){if(confirm('Se déconnecter de Studio Tefi sur cet appareil ?'))Supa.signOut();return true;}}
switch(a){
case'gate-admin':gateStep='pin';render();return true;
case'gate-assistant':setRole('assistant');return true;
case'gate-back':gateStep='choose';render();return true;
case'switch-role':if(draft)closeEditor();if(peekId)closePeek();closeIdea();closeRdv();ROLE='';ssSet(SS_ROLE,'');lsSet(LS_ROLE,null);gateStep='choose';render();window.scrollTo(0,0);return true;
case'idea-new':openIdea(null);return true;
case'idea-open':e.stopPropagation();openIdea(id);return true;
case'idea-close':closeIdea();return true;
case'idea-save':saveIdea();return true;
case'idea-theme':if(ideaRO)return true;{const t=el.dataset.t;ideaDraft.themes=ideaDraft.themes.includes(t)?ideaDraft.themes.filter(x=>x!==t):ideaDraft.themes.concat([t]);renderIdea();}return true;
case'idea-target':if(ideaRO)return true;{const t=el.dataset.a;ideaDraft.targets=ideaDraft.targets.includes(t)?ideaDraft.targets.filter(x=>x!==t):ideaDraft.targets.concat([t]);renderIdea();}return true;
case'idea-addlink':ideaDraft.links.push({id:uid(),url:''});renderIdea();{const l=ideaDraft.links[ideaDraft.links.length-1];const i=document.getElementById('il-'+l.id);if(i)i.focus();}return true;
case'idea-dellink':ideaDraft.links=ideaDraft.links.filter(l=>l.id!==el.dataset.lid);renderIdea();return true;
case'idea-validate':updateContent(id,c=>{c.ideaState='validee';},'Idée validée');toast('Idée validée');return true;
case'idea-review':reviewing={id,kind:el.dataset.kind};render();{const t=document.getElementById('rv-'+id);if(t)t.focus();}return true;
case'idea-review-cancel':reviewing=null;render();return true;
case'idea-promote':promoteIdea(id);return true;
case'idea-del':{const c=S.contents[id];if(!c)return true;if(!canDeleteIdea(c)){toast('Tu peux supprimer seulement tes propres idées.');return true;}deleteContent(id);}return true;
case'rdv-new':openRdv(null,{date:el.dataset.date,comp:el.dataset.comp});return true;
case'rdv-open':e.stopPropagation();openRdv(id);return true;
case'rdv-close':closeRdv();return true;
case'rdv-save':saveRdv();return true;
case'rdv-del':e.stopPropagation();deleteRdv(id);return true;
case'rdv-kind':rdvDraft.kind=el.dataset.k;renderRdv();return true;
case'biz-tab':S.ui.bizTab=el.dataset.tab;saveUI();render();return true;
case'comp-filter':S.ui.bizTab='rdv';S.ui.rdvFilter=id;saveUI();render();return true;
case'comp-del':{if(Object.values(S.rdv).some(x=>x.companyId===id)){toast('Des rendez-vous utilisent ce client. Change-les d\'abord.');render();return true;}
const lbl=(compOf(id)||{}).label||'';updateSettings(s=>{s.companies=s.companies.filter(c=>c.id!==id);},'Client « '+lbl+' » supprimé');}return true;
case'prep-pub':{const c=S.contents[id];if(c){const txt=[c.caption,c.hashtags].filter(Boolean).join('\n\n');if(txt&&navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(()=>toast('Légende copiée : colle-la dans ta publication'),()=>{});}}return true;
}
return false;
}
function handleV3Submit(k,f){
if(S.mode==='supa'&&Supa.submit(k))return true;
if(k==='gate-pin'){(async()=>{
const v=($('#gate-pin').value||'').trim();const has=!!settings().pinHash;
if(!/^\d{4,}$/.test(v)){toast('Le code doit contenir au moins 4 chiffres.');return;}
if(has){const rem=!!($('#gate-remember')&&$('#gate-remember').checked);if(await hashPin(v)===settings().pinHash)setRole('admin',rem);else{toast('Code incorrect.');$('#gate-pin').value='';$('#gate-pin').focus();}}
else{const v2=($('#gate-pin2').value||'').trim();if(v!==v2){toast('Les deux codes ne correspondent pas.');return;}
const rem=!!($('#gate-remember')&&$('#gate-remember').checked);const hsh=await hashPin(v);ROLE='admin';updateSettings(s=>{s.pinHash=hsh;},'Code PIN admin créé');setRole('admin',rem);}
})();return true;}
if(k==='pin'){if(!isAdmin())return true;(async()=>{const v=($('#pin-new').value||'').trim();if(!/^\d{4,}$/.test(v)){toast('Le code doit contenir au moins 4 chiffres.');return;}
const hsh=await hashPin(v);updateSettings(s=>{s.pinHash=hsh;},'Code PIN admin modifié');$('#pin-new').value='';toast('Nouveau code PIN enregistré');})();return true;}
if(k==='review'){const id=f.dataset.id,kind=f.dataset.kind;const txt=($('#rv-'+id).value||'').trim();if(!txt){toast('Ajoute un mot d\'explication.');return true;}
updateContent(id,c=>{c.ideaState=kind;c.review={comment:txt,at:Date.now(),by:'Admin'};},(kind==='refusee'?'Idée refusée : ':'À retravailler : ')+txt);
reviewing=null;toast(kind==='refusee'?'Idée refusée':'Idée renvoyée à '+roleName('assistant'));return true;}
if(k==='comp'){if(!can('clients'))return true;const v=$('#comp-new').value.trim();if(!v)return true;const col=$('#comp-new-color').value;
updateSettings(s=>{s.companies=(s.companies||[]).concat([{id:'k'+uid(),label:v,color:col,country:'Madagascar'}]);},'Client ajouté : '+v);$('#comp-new').value='';toast('Client « '+v+' » ajouté : complète sa fiche');return true;}
return false;
}
const HELV_W=[278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584,761,556,556,222,556,333,1000,556,556,333,1000,667,333,1000,556,611,556,556,222,222,333,333,350,556,1000,333,1000,500,333,944,556,500,667,278,333,556,556,556,556,260,556,333,737,370,556,584,333,737,333,400,584,333,333,333,556,537,278,333,333,365,556,834,834,834,611,667,667,667,667,667,667,1000,722,667,667,667,667,278,278,278,278,722,722,778,778,778,778,778,584,778,722,722,722,722,667,667,611,556,556,556,556,556,556,889,500,556,556,556,556,278,278,278,278,556,556,556,556,556,556,556,584,611,556,556,556,556,500,556,500];
const HELVB_W=[278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584,761,556,556,278,556,500,1000,556,556,333,1000,667,333,1000,556,611,556,556,278,278,500,500,350,556,1000,333,1000,556,333,944,556,500,667,278,333,556,556,556,556,280,556,333,737,370,556,584,333,737,333,400,584,333,333,333,611,556,278,333,333,365,556,834,834,834,611,722,722,722,722,722,722,1000,722,667,667,667,667,278,278,278,278,722,722,778,778,778,778,778,584,778,722,722,722,722,667,667,611,556,556,556,556,556,556,889,556,556,556,556,556,278,278,278,278,611,611,611,611,611,611,611,584,611,611,611,611,611,556,611,556];
const CP1252X={0x20AC:0x80,0x201A:0x82,0x0192:0x83,0x201E:0x84,0x2026:0x85,0x2020:0x86,0x2021:0x87,0x02C6:0x88,0x2030:0x89,0x0160:0x8A,0x2039:0x8B,0x0152:0x8C,0x017D:0x8E,0x2018:0x91,0x2019:0x92,0x201C:0x93,0x201D:0x94,0x2022:0x95,0x2013:0x96,0x2014:0x97,0x02DC:0x98,0x2122:0x99,0x0161:0x9A,0x203A:0x9B,0x0153:0x9C,0x017E:0x9E,0x0178:0x9F};
function cp1252(s){let o='';for(const ch of String(s==null?'':s)){let c=ch.codePointAt(0);if(c===0x202F||c===0xA0||c===9)c=32;
if(c===10||c===13){o+=' ';continue;}if(c>=32&&c<127||(c>=0xA0&&c<=0xFF))o+=String.fromCharCode(c);else if(CP1252X[c])o+=String.fromCharCode(CP1252X[c]);else o+='?';}return o;}
class MiniPDF{
constructor(){this.k=72/25.4;this.pages=[];this.images=[];this.newPage();}
newPage(){this.cur=[];this.pages.push(this.cur);}
Y(y){return((297-y)*this.k).toFixed(2);}
X(x){return(x*this.k).toFixed(2);}
rgb(c){c=String(c||'#000').replace('#','');if(c.length===3)c=c.split('').map(x=>x+x).join('');const n=parseInt(c,16);return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255].map(v=>v.toFixed(3)).join(' ');}
width(t,font,size){const w=font==='F2'?HELVB_W:HELV_W;const s=cp1252(t);let a=0;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);a+=(c>=32&&c<=255?w[c-32]:556);}return a/1000*size/this.k;}
text(t,x,y,o){o=o||{};const f=o.font||'F1',sz=o.size||10;const s=cp1252(t);let xx=x;if(o.align==='right')xx=x-this.width(t,f,sz);else if(o.align==='center')xx=x-this.width(t,f,sz)/2;
const e=s.replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
this.cur.push('BT /'+f+' '+sz+' Tf '+this.rgb(o.color||'#1d1c25')+' rg '+this.X(xx)+' '+this.Y(y)+' Td ('+e+') Tj ET');}
rect(x,y,w,h,fill,stroke){let s='';if(fill)s+=this.rgb(fill)+' rg ';if(stroke)s+=this.rgb(stroke)+' RG 0.3 w ';s+=this.X(x)+' '+((297-y-h)*this.k).toFixed(2)+' '+(w*this.k).toFixed(2)+' '+(h*this.k).toFixed(2)+' re '+(fill&&stroke?'B':fill?'f':'S');this.cur.push(s);}
line(x1,y1,x2,y2,c,w){this.cur.push(this.rgb(c||'#ccc')+' RG '+((w||0.3)*this.k/2.83).toFixed(2)+' w '+this.X(x1)+' '+this.Y(y1)+' m '+this.X(x2)+' '+this.Y(y2)+' l S');}
addJpeg(dataUrl,pw,ph){const b=atob(String(dataUrl).split(',')[1]||'');this.images.push({data:b,w:pw,h:ph});return'Im'+this.images.length;}
image(name,x,y,w,h){this.cur.push('q '+(w*this.k).toFixed(2)+' 0 0 '+(h*this.k).toFixed(2)+' '+this.X(x)+' '+((297-y-h)*this.k).toFixed(2)+' cm /'+name+' Do Q');}
wrap(t,maxW,font,size){const out=[];String(t==null?'':t).split(/\n/).forEach(par=>{const words=par.split(/ +/);let line='';
words.forEach(w=>{const test=line?line+' '+w:w;if(this.width(test,font,size)<=maxW||!line)line=test;else{out.push(line);line=w;}
while(this.width(line,font,size)>maxW&&line.length>1){let i=line.length;while(i>1&&this.width(line.slice(0,i),font,size)>maxW)i--;out.push(line.slice(0,i));line=line.slice(i);}});
out.push(line);});return out;}
output(){
const objs=[];const add=s=>{objs.push(s);return objs.length;};
add('<< /Type /Catalog /Pages 2 0 R >>');add('PAGES');
const fonts=[['F1','Helvetica'],['F2','Helvetica-Bold'],['F3','Helvetica-Oblique']].map(f=>[f[0],add('<< /Type /Font /Subtype /Type1 /BaseFont /'+f[1]+' /Encoding /WinAnsiEncoding >>')]);
const ims=this.images.map((im,i)=>['Im'+(i+1),add('<< /Type /XObject /Subtype /Image /Width '+im.w+' /Height '+im.h+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+im.data.length+' >>\nstream\n'+im.data+'\nendstream')]);
const res='<< /Font << '+fonts.map(f=>'/'+f[0]+' '+f[1]+' 0 R').join(' ')+' >>'+(ims.length?' /XObject << '+ims.map(i=>'/'+i[0]+' '+i[1]+' 0 R').join(' ')+' >>':'')+' >>';
const kids=[];
this.pages.forEach(pg=>{const c=pg.join('\n');const cid=add('<< /Length '+c.length+' >>\nstream\n'+c+'\nendstream');kids.push(add('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources '+res+' /Contents '+cid+' 0 R >>'));});
objs[1]='<< /Type /Pages /Kids ['+kids.map(k=>k+' 0 R').join(' ')+'] /Count '+kids.length+' >>';
let out='%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';const offs=[];
objs.forEach((o,i)=>{offs.push(out.length);out+=(i+1)+' 0 obj\n'+o+'\nendobj\n';});
const x=out.length;out+='xref\n0 '+(objs.length+1)+'\n0000000000 65535 f \n'+offs.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('');
out+='trailer\n<< /Size '+(objs.length+1)+' /Root 1 0 R >>\nstartxref\n'+x+'\n%%EOF';
const bytes=new Uint8Array(out.length);for(let i=0;i<out.length;i++)bytes[i]=out.charCodeAt(i)&255;
return new Blob([bytes],{type:'application/pdf'});
}
}
const BILL_TABS=['fac','dev','suivi','presta','prof'];
const CURRENCIES={MGA:{label:'Ariary (Ar)',sym:'Ar',dec:0,word:'ariary',sub:''},EUR:{label:'Euro (€)',sym:'€',dec:2,word:'euro',sub:'centime'},USD:{label:'Dollar US ($)',sym:'$',dec:2,word:'dollar',sub:'cent'}};
const UNITS=['forfait','jour','demi-journée','heure','vidéo','post','épisode','mois','unité'];
const DOC_STATUS={devis:[['brouillon','Brouillon','#8A8FA3'],['envoye','Envoyé','#5B6CFF'],['accepte','Accepté','#14A37F'],['refuse','Refusé','#D2402C']],
facture:[['brouillon','Brouillon','#8A8FA3'],['envoyee','Envoyée','#5B6CFF'],['payee','Payée','#14A37F'],['annulee','Annulée','#5D6472']]};
const profiles=()=>settings().profiles;const prestations=()=>settings().prestations;
const profOf=id=>profiles().find(p=>p.id===id);
const docs=()=>Object.values(S.docs);
function money(n,cur){const c=CURRENCIES[cur]||CURRENCIES.MGA;n=+n||0;const neg=n<0;n=Math.abs(n);let[i,d]=n.toFixed(c.dec).split('.');i=i.replace(/\B(?=(\d{3})+(?!\d))/g,' ');const s=(neg?'-':'')+i+(d?','+d:'');return cur==='USD'?'$ '+s:s+' '+c.sym;}
function docTotals(d){const sub=(d.lines||[]).reduce((t,l)=>t+(+l.qty||0)*(+l.price||0),0);const disc=sub*(+d.discount||0)/100;const base=sub-disc;const tax=base*(+d.taxRate||0)/100;return{sub,disc,base,tax,total:base+tax};}
function docState(d){if(d.kind==='facture'&&d.status==='envoyee'&&isValidDate(d.dueDate)&&d.dueDate<today())return['retard','En retard','#D2402C'];const L=DOC_STATUS[d.kind]||DOC_STATUS.facture;return L.find(x=>x[0]===d.status)||L[0];}
function nextNumber(kind,profileId,date){const p=profOf(profileId)||{};const pre=(kind==='devis'?(p.prefixD||'DEV'):(p.prefixF||'FAC'))+'-'+String(date||today()).slice(0,4)+'-';let max=0;
docs().forEach(d=>{if(d.kind===kind&&d.profileId===profileId&&String(d.number||'').startsWith(pre)){const n=parseInt(String(d.number).slice(pre.length),10);if(n>max)max=n;}});return pre+String(max+1).padStart(3,'0');}
function partySnap(x){return x?{name:x.label||x.name||'',activity:x.activity||'',phone:x.phone||'',email:x.email||'',nif:x.nif||'',stat:x.stat||'',rcs:x.rcs||'',address:x.address||'',country:x.country||'',contact:x.contact||'',payment:x.payment||'',color:x.color||''}:null;}
const fmtFr=s=>isValidDate(s)?s.slice(8,10)+'/'+s.slice(5,7)+'/'+s.slice(0,4):'';
function frWords(n){n=Math.floor(Math.abs(n));if(n===0)return'zéro';
const U=['','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf'];
const T=['','dix','vingt','trente','quarante','cinquante','soixante','soixante','quatre-vingt','quatre-vingt'];
const b100=n=>{if(n<20)return U[n];const t=Math.floor(n/10),u=n%10;if(t===7||t===9)return T[t]+(t===7&&u===1?' et ':'-')+U[10+u];if(u===0)return T[t]+(t===8?'s':'');if(u===1&&t<8)return T[t]+' et un';return T[t]+'-'+U[u];};
const b1000=n=>{const c=Math.floor(n/100),r=n%100;let s='';if(c)s=(c>1?U[c]+' cent':'cent')+(c>1&&r===0?'s':'');if(r)s+=(s?' ':'')+b100(r);return s;};
let s='';for(const[v,w]of[[1e9,'milliard'],[1e6,'million'],[1000,'mille']]){const q=Math.floor(n/v);if(q){if(w==='mille')s+=(q===1?'mille':b1000(q).replace(/(cent|vingt)s$/,'$1')+' mille')+' ';else s+=b1000(q)+' '+w+(q>1?'s':'')+' ';n%=v;}}
if(n)s+=b1000(n);return s.trim();}
function amountWords(total,cur){const c=CURRENCIES[cur]||CURRENCIES.MGA;const ent=Math.floor(Math.abs(total)+1e-9);let s=frWords(ent)+' '+c.word+(ent>1&&cur!=='MGA'?'s':'');
if(c.dec){const cents=Math.round((Math.abs(total)-ent)*100);if(cents)s+=' et '+frWords(cents)+' '+c.sub+(cents>1?'s':'');}return s.charAt(0).toUpperCase()+s.slice(1);}
function sumBy(list,f){const m={};list.forEach(d=>{const c=d.currency||'MGA';m[c]=(m[c]||0)+f(d);});const ks=Object.keys(m).filter(k=>Math.abs(m[k])>0.0001);return ks.length?ks.map(k=>money(m[k],k)).join(' + '):money(0,'MGA');}
const PROF_FIELDS=[['name','Nom de l\'entreprise *'],['activity','Activité'],['phone','Téléphone'],['email','E-mail'],['nif','NIF'],['stat','STAT'],['rcs','RCS'],['address','Adresse'],['country','Pays']];
function viewProfiles(){
let h='<p class="muted" style="margin:0">Les entreprises qui émettent tes devis et factures. Remplis-les une fois : leurs infos sont reprises automatiquement sur chaque document.</p>';
h+='<div class="comp-list">'+profiles().map(p=>{const used=docs().filter(d=>d.profileId===p.id).length;if(!OPEN['prof:'+p.id])return profMini(p,used);
return'<section class="panel comp-card"><div class="set-item"><input type="color" class="swatch" id="pfc-'+esc(p.id)+'" value="'+esc(p.color||'#4636D9')+'" data-prof="color" data-id="'+esc(p.id)+'" aria-label="Couleur des documents"><h2 style="flex:1">'+esc(p.name||'Sans nom')+'</h2>'+foldBtn('prof:'+p.id)+
'<button class="icon-btn danger" data-act="prof-del" data-id="'+esc(p.id)+'" data-confirm="Supprimer ?" aria-label="Supprimer ce profil"'+(used?' disabled title="Utilisé par '+used+' document(s)"':'')+'>'+ICON.trash+'</button></div>'+
'<div class="f-grid">'+PROF_FIELDS.map(f=>'<label class="field'+(f[0]==='address'?' wide':'')+'"><span>'+f[1]+'</span><input class="inp" id="pf-'+f[0]+'-'+esc(p.id)+'" value="'+esc(p[f[0]]||'')+'" data-prof="'+f[0]+'" data-id="'+esc(p.id)+'"></label>').join('')+'</div>'+
'<details class="fold" id="pfd-'+esc(p.id)+'"><summary style="font-size:15px">Facturation, logo et mentions</summary><div class="f-grid" style="margin-top:10px">'+
'<label class="field"><span>Préfixe factures</span><input class="inp" id="pf-pf-'+esc(p.id)+'" value="'+esc(p.prefixF||'FAC')+'" data-prof="prefixF" data-id="'+esc(p.id)+'"></label>'+
'<label class="field"><span>Préfixe devis</span><input class="inp" id="pf-pd-'+esc(p.id)+'" value="'+esc(p.prefixD||'DEV')+'" data-prof="prefixD" data-id="'+esc(p.id)+'"></label>'+
'<label class="field"><span>Devise par défaut</span><select class="inp" id="pf-cur-'+esc(p.id)+'" data-prof="currency" data-id="'+esc(p.id)+'">'+Object.keys(CURRENCIES).map(k=>'<option value="'+k+'"'+((p.currency||'MGA')===k?' selected':'')+'>'+CURRENCIES[k].label+'</option>').join('')+'</select></label>'+
'<label class="field"><span>TVA par défaut (%)</span><input class="inp" type="number" min="0" step="0.1" id="pf-tva-'+esc(p.id)+'" value="'+esc(p.taxRate||0)+'" data-prof="taxRate" data-id="'+esc(p.id)+'"></label>'+
'<label class="field wide"><span>Coordonnées de paiement (banque, RIB, Mobile Money…)</span><textarea class="inp" rows="2" id="pf-pay-'+esc(p.id)+'" data-prof="payment" data-id="'+esc(p.id)+'">'+esc(p.payment||'')+'</textarea></label>'+
'<label class="field wide"><span>Mentions par défaut sur les factures</span><textarea class="inp" rows="2" id="pf-in-'+esc(p.id)+'" data-prof="invoiceNotes" data-id="'+esc(p.id)+'" placeholder="Ex. : Paiement à 15 jours par virement.">'+esc(p.invoiceNotes||'')+'</textarea></label>'+
'<label class="field wide"><span>Mentions par défaut sur les devis</span><textarea class="inp" rows="2" id="pf-qn-'+esc(p.id)+'" data-prof="quoteNotes" data-id="'+esc(p.id)+'" placeholder="Ex. : Devis valable 30 jours. Acompte de 50 % à la signature.">'+esc(p.quoteNotes||'')+'</textarea></label>'+
'<div class="field wide"><span>Logo</span><div class="set-item">'+(logoSrc(p)?'<img src="'+esc(logoSrc(p))+'" alt="Logo" style="height:44px;width:auto;border:1px solid var(--line);border-radius:6px;background:#fff;padding:3px">':'<span class="hint">Aucun logo</span>')+
'<label class="btn small" style="cursor:pointer">Choisir une image<input type="file" accept="image/*" data-prof-logo="'+esc(p.id)+'" hidden></label>'+(p.logo||p.logoRef?'<button class="btn small ghost" data-act="prof-nologo" data-id="'+esc(p.id)+'">Retirer</button>':'')+'</div></div>'+
stampField(p)+'</div></details>'+
'<div class="card-f"><button class="btn small" data-act="doc-new" data-kind="facture" data-prof="'+esc(p.id)+'">'+ICON.plus+'Facture</button><button class="btn small" data-act="doc-new" data-kind="devis" data-prof="'+esc(p.id)+'">'+ICON.plus+'Devis</button><span class="hint">'+plural(used,'document')+'</span></div></section>';}).join('')+'</div>';
h+='<section class="panel"><h3>'+(profiles().length?'Ajouter une autre entreprise':'Crée le profil de ton entreprise')+'</h3><form class="add-form" data-form="prof"><input class="inp" id="prof-new" placeholder="Nom de l\'entreprise" autocomplete="off"><button class="btn primary" type="submit">'+ICON.plus+'Créer le profil</button></form><p class="hint" style="margin:8px 0 0">Tu complètes ensuite le numéro, le mail, le NIF, le STAT, le RCS, l\'adresse et le pays.</p></section>';
return h;
}
let docDraft=null,docOrig=null;
function newDoc(kind,preset){preset=preset||{};const p=profOf(preset.profileId)||profiles()[0];const date=today();
return{id:'d'+uid(),kind,profileId:p.id,number:nextNumber(kind,p.id,date),date,dueDate:addDays(date,kind==='devis'?30:15),companyId:preset.companyId||'',clientSnap:null,profileSnap:null,subject:'',
lines:[{id:uid(),label:'',qty:1,unit:'forfait',price:0}],discount:0,depositPct:0,taxRate:+p.taxRate||0,currency:p.currency||'MGA',notes:kind==='devis'?(p.quoteNotes||''):(p.invoiceNotes||''),status:'brouillon',contentId:'',createdAt:Date.now()};}
function openDoc(id,preset){
if(!profiles().length){if(isAdmin()){go('business',{bizTab:'prof'});toast('Crée d\'abord le profil de ton entreprise.');}else toast('L\'admin doit d\'abord créer le profil de son entreprise.');return;}
docDraft=id&&S.docs[id]?clone(S.docs[id]):newDoc(preset&&preset.kind||'facture',preset);docOrig=id&&S.docs[id]?clone(S.docs[id]):null;
renderDoc();$('#docsheet').hidden=false;document.body.classList.add('locked');
}
function closeDoc(save){if(save!==false&&docDraft)saveDoc(true);docDraft=null;docOrig=null;$('#docsheet').hidden=true;if(!draft&&!peekId)document.body.classList.remove('locked');}
function saveDoc(silent){
let d=clone(docDraft);if(!d)return null;
const isNew=!S.docs[d.id];const blank=!d.lines.some(l=>l.label.trim()||+l.price)&&!d.companyId&&!d.subject;
if(isNew&&blank)return null;
if(d.status==='brouillon'||!d.profileSnap){const p=profOf(d.profileId);d.profileSnap=partySnap(p?Object.assign({},p,{label:p.name}):null);}
if(d.status==='brouillon'||!d.clientSnap){d.clientSnap=partySnap(compOf(d.companyId));}
if(!isNew&&docOrig&&JSON.stringify(Object.assign({},d,{updatedAt:0}))===JSON.stringify(Object.assign({},docOrig,{updatedAt:0})))return d;
if(d.signed&&d.signed.hash!==docHash(d)){d.signed=null;setTimeout(()=>toast('Le contenu a changé : la signature a été retirée. Il faudra signer à nouveau.'),0);}
Store.save('docs',d);d=clone(S.docs[d.id]);
logChange('doc',isNew?'create':'update',d.id,(d.kind==='devis'?'Devis ':'Facture ')+d.number,isNew?'Créé · '+money(docTotals(d).total,d.currency):'Modifié · '+money(docTotals(d).total,d.currency),isNew?null:docOrig);
docOrig=clone(d);docDraft=clone(d);scheduleRender();if(!silent)toast((d.kind==='devis'?'Devis ':'Facture ')+d.number+' enregistré'+(d.kind==='facture'?'e':''));return d;
}
function deleteDoc(id){const before=S.docs[id];if(!before)return;Store.del('docs',id);
logChange('doc','delete',id,(before.kind==='devis'?'Devis ':'Facture ')+before.number,'Supprimé',before);
if(docDraft&&docDraft.id===id){docDraft=null;$('#docsheet').hidden=true;document.body.classList.remove('locked');}
scheduleRender();toast((before.kind==='devis'?'Devis ':'Facture ')+before.number+' supprimé'+(before.kind==='facture'?'e':''),()=>{Store.save('docs',before);logChange('doc','restore',id,before.number,'Suppression annulée',null);scheduleRender();});}
function saveDocDirect(d){Store.save('docs',d);}
function renderDoc(){
const d=docDraft;if(!d)return;const isDev=d.kind==='devis';const st=docState(d);docStatusShown=d.status;const panel=$('#doc-panel');const bodyEl=panel.querySelector('.sheet-body');const sc=bodyEl?bodyEl.scrollTop:0;
const opt=(v,l,sel)=>'<option value="'+esc(v)+'"'+(sel===v?' selected':'')+'>'+esc(l)+'</option>';
let h='<div class="sheet-top"><button class="icon-btn" data-act="doc-close" aria-label="Fermer">'+ICON.x+'</button><span class="saved"><span class="pill" style="--c:'+st[2]+'">'+st[1]+'</span>'+pendingPill(d)+'</span>'+
sigPill(d)+(S.docs[d.id]&&isAdmin()&&!sigValid(d)?'<button class="btn small" data-act="doc-sign" data-id="'+esc(d.id)+'" data-confirm="Confirmer la signature">✍ Signer</button>':'')+(S.docs[d.id]&&!isAdmin()&&can('requests')&&!sigValid(d)&&!d.sigRequested?'<button class="btn small" data-act="doc-sigreq" data-id="'+esc(d.id)+'">Demander la signature</button>':'')+'<button class="btn small" data-act="doc-pdf" data-id="'+esc(d.id)+'">Exporter en PDF</button><button class="btn small primary" data-act="doc-save">Enregistrer</button></div><div class="sheet-body">'+(sigValid(d)?'<div class="sig-banner">✓ Signé par '+esc(d.signed.by||'Tefi')+' le '+fmtStamp(d.signed.at)+'. Le PDF signé est figé : si tu modifies le contenu, la signature sera retirée.</div>':'');
h+='<div class="ed-sec"><span class="label">'+(isDev?'Devis':'Facture')+'</span><input class="title-inp mono" style="font-family:var(--f-mono);font-size:24px" id="dc-number" data-df="number" value="'+esc(d.number)+'" aria-label="Numéro">'+
'<div class="f-grid"><label class="field"><span>Émetteur</span><select class="inp" id="dc-prof" data-df="profileId">'+profiles().map(p=>opt(p.id,p.name,d.profileId)).join('')+'</select></label>'+
'<label class="field"><span>Client</span><select class="inp" id="dc-client" data-df="companyId">'+opt('','Choisir un client…',d.companyId)+companies().map(c=>opt(c.id,c.label,d.companyId)).join('')+'</select></label>'+
'<label class="field"><span>Statut</span><select class="inp" id="dc-status" data-df="status"'+(!isAdmin()&&!can('payStatus')?' disabled':'')+'>'+DOC_STATUS[d.kind].map(s=>opt(s[0],s[1],d.status)).join('')+'</select></label>'+
'<label class="field"><span>Date</span><input class="inp" type="date" id="dc-date" data-df="date" value="'+esc(d.date)+'"></label>'+
'<label class="field"><span>'+(isDev?'Valable jusqu\'au':'Échéance de paiement')+'</span><input class="inp" type="date" id="dc-due" data-df="dueDate" value="'+esc(d.dueDate)+'"></label>'+
'<label class="field"><span>Devise</span><select class="inp" id="dc-cur" data-df="currency">'+Object.keys(CURRENCIES).map(k=>opt(k,CURRENCIES[k].label,d.currency)).join('')+'</select></label>'+recurringField(d)+
'<label class="field wide"><span>Objet</span><input class="inp" id="dc-subject" data-df="subject" value="'+esc(d.subject)+'" placeholder="Ex. : Campagne Instagram de novembre"></label>'+
'<label class="field wide"><span>Projet lié (facultatif)</span><select class="inp" id="dc-content" data-df="contentId">'+opt('','Aucun',d.contentId)+contents().filter(c=>c.status!=='idee').map(c=>opt(c.id,titleOf(c),d.contentId)).join('')+'</select></label></div>';
const cl=compOf(d.companyId);if(cl&&!(cl.address||cl.nif))h+='<p class="hint" style="margin:0">Les infos de facturation de '+esc(cl.label)+' sont vides : complète-les dans Business → Clients.</p>';
if(!companies().length)h+='<p class="hint" style="margin:0">Ajoute tes clients dans Business → Clients.</p>';
h+='</div>';
h+='<div class="ed-sec"><div class="ed-sec-h"><h2>Prestations</h2></div><div class="doc-lines"><div class="dl dl-h"><span>Désignation</span><span>Qté</span><span>Unité</span><span>Prix unitaire</span><span style="text-align:right">Total</span><span></span></div>'+
d.lines.map(l=>'<div class="dl"><textarea class="inp" rows="1" id="dl-l-'+esc(l.id)+'" data-dl="label" data-lid="'+esc(l.id)+'" placeholder="Désignation de la prestation" aria-label="Désignation">'+esc(l.label)+'</textarea>'+
'<input class="inp mono" type="number" min="0" step="any" id="dl-q-'+esc(l.id)+'" data-dl="qty" data-lid="'+esc(l.id)+'" value="'+esc(l.qty)+'" aria-label="Quantité">'+
'<select class="inp" id="dl-u-'+esc(l.id)+'" data-dl="unit" data-lid="'+esc(l.id)+'" aria-label="Unité">'+UNITS.concat(UNITS.includes(l.unit)?[]:[l.unit]).map(u=>'<option'+(u===l.unit?' selected':'')+'>'+esc(u)+'</option>').join('')+'</select>'+
'<input class="inp mono" type="number" min="0" step="any" id="dl-p-'+esc(l.id)+'" data-dl="price" data-lid="'+esc(l.id)+'" value="'+esc(l.price)+'" aria-label="Prix unitaire">'+
'<span class="mono dl-tot" id="dlt-'+esc(l.id)+'">'+esc(money((+l.qty||0)*(+l.price||0),d.currency))+'</span>'+
'<button class="icon-btn sm" data-act="doc-delline" data-lid="'+esc(l.id)+'" aria-label="Retirer la ligne">'+ICON.x+'</button></div>').join('')+'</div>'+
'<div class="card-f"><select class="inp" id="dc-addpresta" data-addpresta="1" style="width:auto;max-width:100%" aria-label="Ajouter une prestation du catalogue"><option value="">+ Ajouter depuis le catalogue…</option>'+prestations().map(x=>'<option value="'+esc(x.id)+'">'+esc(x.label)+' · '+esc(money(x.price,x.currency||'MGA'))+'</option>').join('')+'</select><button class="btn small" data-act="doc-addline">'+ICON.plus+'Ligne libre</button></div></div>';
const t=docTotals(d);
h+='<div class="ed-sec"><div class="ed-sec-h"><h2>Total</h2></div><div class="f-grid"><label class="field"><span>Remise (%)</span><input class="inp" type="number" min="0" max="100" step="any" id="dc-disc" data-df="discount" value="'+esc(d.discount)+'"></label><label class="field"><span>TVA (%)</span><input class="inp" type="number" min="0" step="any" id="dc-tax" data-df="taxRate" value="'+esc(d.taxRate)+'"></label><label class="field"><span>Acompte demandé (%)</span><input class="inp" type="number" min="0" max="100" step="any" id="dc-dep" data-df="depositPct" value="'+esc(d.depositPct||0)+'" placeholder="ex. 40"></label></div>'+
'<div class="totals" id="doc-totals">'+totalsHtml(d,t)+'</div></div>';
h+='<div class="ed-sec"><div class="ed-sec-h"><h2>Mentions &amp; conditions</h2></div><textarea class="inp" rows="3" id="dc-notes" data-df="notes" placeholder="Conditions de paiement, acompte, validité…">'+esc(d.notes)+'</textarea>'+
(profOf(d.profileId)&&profOf(d.profileId).payment?'<p class="hint" style="margin:0">Les coordonnées de paiement de ton profil seront ajoutées sur le PDF.</p>':'')+'</div>';
if(!isDev&&S.docs[d.id]){const sd=S.docs[d.id];h+='<div class="ed-sec"><div class="ed-sec-h"><h2>Paiements reçus</h2>'+(can('suivis')?'<button class="btn small" data-act="goto-suivi">Gérer dans Suivis'+ICON.arrow+'</button>':'')+'</div>'+
progressBar(docPaid(sd),docTotals(sd).total)+'<div class="creance-txt"><span>Payé <b class="mono">'+esc(money(docPaid(sd),sd.currency))+'</b></span><span>Reste <b class="mono">'+esc(money(docRemaining(sd),sd.currency))+'</b></span>'+followPills(sd)+'</div>'+(paymentsList(sd)||'<p class="hint" style="margin:0">Aucun acompte ni paiement enregistré.</p>')+'</div>';}
h+='<div class="ed-foot">'+(isDev?'<button class="btn" data-act="doc-tofac">'+ICON.arrow+'Transformer en facture</button>':'')+
(!isDev&&d.status!=='payee'?'<button class="btn" data-act="doc-paid">'+ICON.check+(isAdmin()?'Marquer payée':'Signaler comme payée')+'</button>':'')+
'<button class="btn" data-act="doc-dup">'+ICON.copy+'Dupliquer</button>'+(S.docs[d.id]?'<button class="btn danger" data-act="doc-del" data-id="'+esc(d.id)+'" data-confirm="Supprimer définitivement ?">'+ICON.trash+'Supprimer</button>':'')+'</div>';
h+='</div>';morph(panel,h);panel.querySelectorAll('textarea[data-dl]').forEach(t=>{t.style.height='auto';t.style.height=Math.max(40,t.scrollHeight+2)+'px';});const nb=panel.querySelector('.sheet-body');if(nb)nb.scrollTop=sc;
}
function totalsHtml(d,t){return'<div><span>Sous-total</span><b>'+esc(money(t.sub,d.currency))+'</b></div>'+(+d.discount?'<div><span>Remise '+esc(d.discount)+' %</span><b>− '+esc(money(t.disc,d.currency))+'</b></div>':'')+
(+d.taxRate?'<div><span>TVA '+esc(d.taxRate)+' %</span><b>'+esc(money(t.tax,d.currency))+'</b></div>':'')+'<div class="grand"><span>Total'+(+d.taxRate?' TTC':'')+'</span><b>'+esc(money(t.total,d.currency))+'</b></div>'+(+d.depositPct?'<div><span>Acompte demandé '+esc(d.depositPct)+' %</span><b>'+esc(money(t.total*d.depositPct/100,d.currency))+'</b></div>':'')+'<p class="hint" style="margin:6px 0 0">'+esc(amountWords(t.total,d.currency))+'</p>';}
function refreshDocTotals(){const d=docDraft;if(!d)return;d.lines.forEach(l=>{const el=document.getElementById('dlt-'+l.id);if(el)el.textContent=money((+l.qty||0)*(+l.price||0),d.currency);});const tt=$('#doc-totals');if(tt)tt.innerHTML=totalsHtml(d,docTotals(d));}
$('#doc-panel').addEventListener('input',e=>{if(!docDraft)return;const el=e.target;
if(el.dataset.df){let v=el.value;if(['discount','taxRate','depositPct'].includes(el.dataset.df))v=parseFloat(v)||0;docDraft[el.dataset.df]=v;refreshDocTotals();}
else if(el.dataset.dl){const l=docDraft.lines.find(x=>x.id===el.dataset.lid);if(!l)return;l[el.dataset.dl]=['qty','price'].includes(el.dataset.dl)?(parseFloat(el.value)||0):el.value;refreshDocTotals();
if(el.tagName==='TEXTAREA'){el.style.height='auto';el.style.height=el.scrollHeight+'px';}}});
$('#doc-panel').addEventListener('change',e=>{if(!docDraft)return;const el=e.target;
if(el.dataset.rec){const rc=Object.assign({freq:'',next:''},docDraft.recurring||{});rc[el.dataset.rec]=el.value;if(el.dataset.rec==='freq'){rc.next=el.value?addMonths(docDraft.date||today(),el.value==='quarterly'?3:el.value==='yearly'?12:1):'';}docDraft.recurring=rc.freq?rc:null;renderDoc();return;}
if(el.dataset.addpresta&&el.value){const x=prestations().find(p=>p.id===el.value);if(x){const empty=docDraft.lines.length===1&&!docDraft.lines[0].label&&!+docDraft.lines[0].price;
const line={id:uid(),label:x.label+(x.desc?'\n'+x.desc:''),qty:1,unit:x.unit||'forfait',price:+x.price||0};if(empty)docDraft.lines=[line];else docDraft.lines.push(line);
if(x.currency&&x.currency!==docDraft.currency&&!S.docs[docDraft.id]&&empty)docDraft.currency=x.currency;}renderDoc();return;}
if(el.dataset.df==='profileId'){const p=profOf(el.value);if(p&&!S.docs[docDraft.id]){docDraft.number=nextNumber(docDraft.kind,p.id,docDraft.date);docDraft.currency=p.currency||docDraft.currency;docDraft.taxRate=+p.taxRate||0;docDraft.notes=docDraft.kind==='devis'?(p.quoteNotes||docDraft.notes):(p.invoiceNotes||docDraft.notes);}renderDoc();}
else if(el.dataset.df==='status'){const to=el.value;
if(!isAdmin()&&needsValidation(docDraft.kind,to)){docDraft.status=docStatusShown;if(can('payStatus')){requestDocStatus(docDraft,to);saveDoc(true);}else toast(DENIED);}
else{if(isAdmin())docDraft.pendingStatus=null;if(to==='payee')docDraft.paidAt=today();}
renderDoc();}
else if(['currency','companyId'].includes(el.dataset.df))renderDoc();});
$('#docsheet').addEventListener('click',e=>{if(e.target.id==='docsheet')closeDoc();});
async function exportDocPdf(id){
syncCurrencies();
const d=(docDraft&&docDraft.id===id)?(saveDoc(true)||docDraft):S.docs[id];if(!d){toast('Enregistre d\'abord le document.');return;}
try{
if(sigValid(d)){const b=await signedPdfBlob(d);if(b){await saveBlob(b,(d.kind==='devis'?'Devis-':'Facture-')+String(d.number).replace(/[^\w.-]+/g,'_')+'-signe.pdf');return;}}
const out=await buildDocPdf(d,null);await saveBlob(out.blob,out.filename);
}catch(err){console.error(err);toast('La création du PDF a échoué.');}
}
async function buildDocPdf(d,sig){
const prof=await withLogo(profOf(d.profileId)||{});const P=d.profileSnap||partySnap(Object.assign({},prof,{label:prof.name}))||{};const C=d.clientSnap||partySnap(compOf(d.companyId))||{};
const acc=prof.color||'#4636D9';const pdf=new MiniPDF();const M=16,W=210,R=W-M;const isDev=d.kind==='devis';const grey='#6b6a78';
let y=16;
if(prof.logo&&prof.logoW){const lh=18,lw=Math.min(45,lh*prof.logoW/prof.logoH);const nm=pdf.addJpeg(prof.logo,prof.logoW,prof.logoH);pdf.image(nm,M,y,lw,lw*prof.logoH/prof.logoW);y+=lw*prof.logoH/prof.logoW+5;}
else y+=4;
pdf.text(P.name||'',M,y,{font:'F2',size:14});y+=5.5;
const info=[P.activity,P.address,P.country,P.phone?'Tél. : '+P.phone:'',P.email?'E-mail : '+P.email:'',[P.nif?'NIF : '+P.nif:'',P.stat?'STAT : '+P.stat:''].filter(Boolean).join('   '),P.rcs?'RCS : '+P.rcs:''].filter(Boolean);
info.forEach(t=>{pdf.wrap(t,95,'F1',9).forEach(l=>{pdf.text(l,M,y,{size:9,color:grey});y+=4.2;});});
let ry=24;pdf.text(isDev?'DEVIS':'FACTURE',R,ry,{font:'F2',size:22,color:acc,align:'right'});ry+=8;
pdf.text('N° '+d.number,R,ry,{font:'F2',size:10.5,align:'right'});ry+=5;
pdf.text('Date : '+fmtFr(d.date),R,ry,{size:9.5,align:'right',color:grey});ry+=4.6;
if(isValidDate(d.dueDate)){pdf.text((isDev?'Valable jusqu\'au : ':'Échéance : ')+fmtFr(d.dueDate),R,ry,{size:9.5,align:'right',color:grey});ry+=4.6;}
y=Math.max(y,ry)+6;
const bx=W/2+2,bw=R-bx;const cl=[C.contact?'À l\'attention de '+C.contact:'',C.address,C.country,C.phone?'Tél. : '+C.phone:'',C.email?'E-mail : '+C.email:'',[C.nif?'NIF : '+C.nif:'',C.stat?'STAT : '+C.stat:''].filter(Boolean).join('   '),C.rcs?'RCS : '+C.rcs:''].filter(Boolean);
const clLines=[];cl.forEach(t=>pdf.wrap(t,bw-8,'F1',9).forEach(l=>clLines.push(l)));
const bh=12+clLines.length*4.2+(C.name?0:0);
pdf.rect(bx,y,bw,bh,'#f4f4f8');pdf.text(isDev?'CLIENT':'FACTURÉ À',bx+4,y+5.5,{font:'F2',size:8,color:grey});
pdf.text(C.name||'—',bx+4,y+10.5,{font:'F2',size:11});let cy=y+15;clLines.forEach(l=>{pdf.text(l,bx+4,cy,{size:9,color:grey});cy+=4.2;});
if(d.subject){pdf.text('OBJET',M,y+5.5,{font:'F2',size:8,color:grey});let sy=y+10.5;pdf.wrap(d.subject,W/2-M-6,'F2',10.5).forEach(l=>{pdf.text(l,M,sy,{font:'F2',size:10.5});sy+=5;});}
y+=bh+9;
const cols={qty:122,unit:126,pu:168,tot:R-2};const descW=101;
const header=()=>{pdf.rect(M,y,R-M,8,acc);pdf.text('Désignation',M+3,y+5.4,{font:'F2',size:9,color:'#ffffff'});pdf.text('Qté',cols.qty,y+5.4,{font:'F2',size:9,color:'#ffffff',align:'right'});pdf.text('Unité',cols.unit,y+5.4,{font:'F2',size:9,color:'#ffffff'});pdf.text('Prix unitaire',cols.pu,y+5.4,{font:'F2',size:9,color:'#ffffff',align:'right'});pdf.text('Total',cols.tot,y+5.4,{font:'F2',size:9,color:'#ffffff',align:'right'});y+=8;};
header();
d.lines.filter(l=>l.label.trim()||+l.price).forEach((l,i)=>{
const parts=String(l.label).split('\n');const first=pdf.wrap(parts[0],descW,'F2',9.5);const rest=parts.slice(1).join('\n');const more=rest?pdf.wrap(rest,descW,'F1',8.5):[];
const h=4+first.length*4.4+more.length*3.9+2.5;
if(y+h>265){pdf.newPage();y=18;header();}
if(i%2)pdf.rect(M,y,R-M,h,'#f7f7fa');
let ly=y+5;first.forEach(t=>{pdf.text(t,M+3,ly,{font:'F2',size:9.5});ly+=4.4;});more.forEach(t=>{pdf.text(t,M+3,ly,{size:8.5,color:grey});ly+=3.9;});
const qs=String(+l.qty||0).replace('.',',');pdf.text(qs,cols.qty,y+5,{size:9.5,align:'right'});pdf.text(l.unit||'',cols.unit,y+5,{size:9,color:grey});
pdf.text(money(l.price,d.currency),cols.pu,y+5,{size:9.5,align:'right'});pdf.text(money((+l.qty||0)*(+l.price||0),d.currency),cols.tot,y+5,{font:'F2',size:9.5,align:'right'});
y+=h;pdf.line(M,y,R,y,'#e2e2ea',0.3);});
const t=docTotals(d);const rows=[['Sous-total',money(t.sub,d.currency)]];if(+d.discount)rows.push(['Remise '+d.discount+' %','- '+money(t.disc,d.currency)]);if(+d.taxRate){rows.push(['Total HT',money(t.base,d.currency)]);rows.push(['TVA '+d.taxRate+' %',money(t.tax,d.currency)]);}
if(y+14+rows.length*6>270){pdf.newPage();y=18;}
y+=6;rows.forEach(r=>{pdf.text(r[0],136,y,{size:9.5,color:grey});pdf.text(r[1],R,y,{size:9.5,align:'right'});y+=6;});
pdf.rect(130,y-3.5,R-130,10,acc);pdf.text(+d.taxRate?'TOTAL TTC':'TOTAL',134,y+3,{font:'F2',size:10.5,color:'#ffffff'});pdf.text(money(t.total,d.currency),R-3,y+3,{font:'F2',size:11.5,color:'#ffffff',align:'right'});y+=14;
if(+d.depositPct){pdf.text('Acompte demandé ('+String(d.depositPct).replace('.',',')+' %)',R-62,y,{size:9.5,color:grey,align:'right'});pdf.text(money(t.total*d.depositPct/100,d.currency),R,y,{font:'F2',size:9.5,align:'right'});y+=6;}
const vp=(d.payments||[]).filter(p=>!p.pending);
if(!isDev&&vp.length){vp.forEach(p=>{if(y>272){pdf.newPage();y=18;}pdf.text((p.kind==='acompte'?'Acompte reçu':p.kind==='solde'?'Solde reçu':'Paiement reçu')+' le '+fmtFr(p.date)+(p.pct?' ('+String(p.pct).replace('.',',')+' %)':''),R-62,y,{size:9.5,color:grey,align:'right'});pdf.text('- '+money(payAmount(d,p),d.currency),R,y,{size:9.5,align:'right'});y+=6;});
const rest=Math.max(0,t.total-docPaid(d));pdf.rect(130,y-3.5,R-130,9,'#f4f4f8');pdf.text('RESTE À PAYER',134,y+2.5,{font:'F2',size:10});pdf.text(money(rest,d.currency),R-3,y+2.5,{font:'F2',size:10.5,align:'right'});y+=13;}
const words=(isDev?'Arrêté le présent devis à la somme de : ':'Arrêtée la présente facture à la somme de : ')+amountWords(t.total,d.currency)+'.';
pdf.wrap(words,R-M,'F3',9).forEach(l=>{if(y>275){pdf.newPage();y=18;}pdf.text(l,M,y,{font:'F3',size:9});y+=4.4;});y+=4;
const block=(title,txt)=>{if(!txt||!String(txt).trim())return;const ls=pdf.wrap(txt,R-M,'F1',9);if(y+6+ls.length*4.3>280){pdf.newPage();y=18;}pdf.text(title,M,y,{font:'F2',size:8,color:grey});y+=4.6;ls.forEach(l=>{pdf.text(l,M,y,{size:9});y+=4.3;});y+=3;};
block('MENTIONS & CONDITIONS',d.notes);block('PAIEMENT',P.payment||prof.payment);
if(isDev){if(y+22>282){pdf.newPage();y=18;}y+=2;pdf.text('Bon pour accord (date, signature et cachet du client) :',M,y,{size:9,color:grey});pdf.rect(M,y+3,80,20,null,'#c9c9d4');}
if(sig&&sig.img){const bw=58;const ih=Math.min(24,bw*sig.img.h/sig.img.w);const iw=ih*sig.img.w/sig.img.h;if(y+ih+18>282){pdf.newPage();y=18;}y+=6;
pdf.text('Pour '+(P.name||''),R,y,{size:8.5,color:grey,align:'right'});y+=2.5;
if(sig.stamp){const sh=Math.min(26,ih+4),sw=sh*sig.stamp.w/sig.stamp.h;const ns=pdf.addJpeg(sig.stamp.data,sig.stamp.w,sig.stamp.h);pdf.image(ns,R-iw-sw-4,y,sw,sh);}
const ni=pdf.addJpeg(sig.img.data,sig.img.w,sig.img.h);pdf.image(ni,R-iw,y,iw,ih);y+=Math.max(ih,sig.stamp?Math.min(26,ih+4):0)+4;
pdf.text((sig.name||'Tefi')+' · signé le '+new Date(sig.at||Date.now()).toLocaleDateString('fr-FR'),R,y,{size:8.5,align:'right'});y+=6;}
const n=pdf.pages.length;const foot=[P.name,P.nif?'NIF '+P.nif:'',P.stat?'STAT '+P.stat:'',P.rcs?'RCS '+P.rcs:''].filter(Boolean).join(' · ');
pdf.pages.forEach((pg,i)=>{pdf.cur=pg;pdf.line(M,285,R,285,'#e2e2ea',0.3);pdf.text(foot,M,290,{size:7.5,color:grey});pdf.text('Page '+(i+1)+'/'+n,R,290,{size:7.5,color:grey,align:'right'});});
const blob=pdf.output();const filename=(isDev?'Devis-':'Facture-')+String(d.number).replace(/[^\w.-]+/g,'_')+'.pdf';
return{blob,filename};
}
function loadLogo(pid,file){
if(!file)return;if(!/^image\//.test(file.type)){toast('Choisis une image (PNG ou JPG).');return;}
const fr=new FileReader();fr.onload=()=>{const img=new Image();img.onload=()=>{const max=400;let w=img.naturalWidth,h=img.naturalHeight;const r=Math.min(1,max/Math.max(w,h));w=Math.round(w*r);h=Math.round(h*r);
const cv=document.createElement('canvas');cv.width=w;cv.height=h;const cx=cv.getContext('2d');cx.fillStyle='#ffffff';cx.fillRect(0,0,w,h);cx.drawImage(img,0,0,w,h);
const url=cv.toDataURL('image/jpeg',0.85);if(url.length>120000){toast('Logo trop lourd, choisis une image plus simple.');return;}
if(S.mode==='supa'){cv.toBlob(async b=>{try{const r=await Supa.upload('logo-'+pid+'-'+Date.now().toString(36),b);LOGO_DATA[r.ref]=url;updateSettings(s=>{const p=(s.profiles||[]).find(x=>x.id===pid);if(p){p.logoRef=r.ref;delete p.logo;p.logoW=w;p.logoH=h;}},'Logo du profil mis à jour');toast('Logo enregistré');}catch(e){toast('Envoi du logo impossible : '+errMsg(e));}},'image/jpeg',0.85);return;}
updateSettings(s=>{const p=(s.profiles||[]).find(x=>x.id===pid);if(p){p.logo=url;p.logoW=w;p.logoH=h;}},'Logo du profil mis à jour');toast('Logo enregistré');};
img.onerror=()=>toast('Image illisible.');img.src=fr.result;};fr.readAsDataURL(file);
}
const PERMS=[
['Projets',[['projEdit','Créer et modifier les projets',true],['projStatus','Changer le statut des projets',true],['projDelete','Supprimer des projets',false],['projection','Utiliser Projection (rushs, versions, retours)',true],['budget','Voir et saisir le budget et les dépenses des projets',true],['calMove','Changer les dates (calendrier, glisser-déposer)',true]]],
['Idées',[['ideaDeleteOwn','Supprimer ses propres idées',true]]],
['Réseaux',[['accounts','Gérer les comptes des réseaux',true],['stats','Saisir et voir les statistiques des publications',true]]],
['Business',[['rdv','Voir et gérer les rendez-vous',true],['clients','Gérer les clients',true],['devis','Créer, modifier et exporter les devis',true],['factures','Créer, modifier et exporter les factures',true],
['toCollect','Voir l\'argent à réclamer',true],['suivis','Suivre les paiements : acomptes, reste à payer, relances',true],['payStatus','Changer le statut des paiements (avec ta validation)',true],['entreprises','Voir le résumé de tes entreprises',true],['prestaEdit','Modifier le catalogue de prestations',false],['collabs','Gérer les partenariats',true],['contacts','Gérer les contacts',true]]],
['Plans & demandes',[['requests','Envoyer des demandes à l\'admin (signature, rushs, questions…)',true]]],
['Autre',[['history','Voir l\'historique des modifications',false]]]
];
const PERM_DEFAULTS={};PERMS.forEach(g=>g[1].forEach(p=>{PERM_DEFAULTS[p[0]]=p[2];}));
function can(k){if(isAdmin())return true;const pm=(S.settings&&S.settings.perms)||{};return k in pm?!!pm[k]:!!PERM_DEFAULTS[k];}
(function(){const st=document.createElement('style');st.textContent=Object.keys(PERM_DEFAULTS).map(k=>'body.deny-'+k+' .need-'+k).join(',')+'{display:none!important}';document.head.appendChild(st);})();
function applyPermClasses(){Object.keys(PERM_DEFAULTS).forEach(k=>document.body.classList.toggle('deny-'+k,!can(k)));}
const DENIED='Cette action n\'est pas autorisée dans la vue assistante.';
const ACT_PERM={'del-content':'projDelete','ed-delete':'projDelete','new':'projEdit','open':'projEdit','peek-edit':'projEdit','peek-dup':'projEdit','ed-dup':'projEdit','ed-addpub':'projEdit','ed-delpub':'projEdit',
'ed-addshoot':'projEdit','ed-delshoot':'projEdit','ed-addscene':'projEdit','ed-delscene':'projEdit','ed-theme':'projEdit','peek-delpub':'projEdit',
'advance':'projStatus','mark-done':'projStatus','ed-status':'projStatus','acc-del':'accounts','acc-nature':'accounts',
'rdv-new':'rdv','rdv-save':'rdv','rdv-del':'rdv','comp-del':'clients','comp-filter':'rdv','rdv-prio':'rdv','acc-style':'accounts','ed-addpub-acc':'projEdit'};
const ADMIN_ONLY=['restore','type-del','theme-del','plat-del','chan-del','idea-validate','idea-review','idea-promote','export','import','doc-approve','doc-reject','ui-theme'];
function actAllowed(a,el){
if(isAdmin())return true;
if(ADMIN_ONLY.includes(a)){toast('Réservé à la vue admin.');return false;}
if(a==='idea-del'&&!can('ideaDeleteOwn')){toast(DENIED);return false;}
const k=ACT_PERM[a];if(k&&!can(k)){toast(DENIED);return false;}
return true;
}
function permsPanel(){
const pm=(S.settings&&S.settings.perms)||{};
return'<section class="panel"><div class="panel-h"><h2>Autorisations de '+esc(roleName('assistant'))+'</h2></div><p class="hint" style="margin:-4px 0 12px">Active ou coupe chaque fonction pour la vue assistante. Le changement s\'applique dès sa prochaine synchronisation.</p>'+
PERMS.map(g=>'<div class="perm-group"><span class="label">'+esc(g[0])+'</span>'+g[1].map(p=>{const on=p[0]in pm?!!pm[p[0]]:p[2];
return'<label class="perm"><span>'+esc(p[1])+'</span><input type="checkbox" class="switch" id="perm-'+p[0]+'" data-perm="'+p[0]+'"'+(on?' checked':'')+'></label>';}).join('')+'</div>').join('')+
'<p class="hint" style="margin:10px 0 0">Toujours réservé à toi : modifier tes entreprises, voir le chiffre d\'affaires, valider les idées et les paiements, les réglages et le code PIN.</p></section>';
}
const NEEDS_OK={facture:['payee','annulee'],devis:['accepte','refuse']};
const needsValidation=(kind,to)=>(NEEDS_OK[kind]||[]).includes(to);
const statusLabel=(kind,to)=>((DOC_STATUS[kind]||[]).find(x=>x[0]===to)||[0,to])[1];
let docStatusShown='';
function requestDocStatus(d,to){d.pendingStatus={to,by:roleName(ROLE),at:Date.now()};toast('Demande envoyée : l\'admin doit valider « '+statusLabel(d.kind,to)+' »');}
function pendingDocs(kind){return docs().filter(d=>d.pendingStatus&&(!kind||d.kind===kind));}
function approveDoc(id,ok){
const d=S.docs[id];if(!d||!d.pendingStatus)return;const before=clone(d);const x=clone(d);const to=x.pendingStatus.to;
if(ok){x.status=to;if(to==='payee')x.paidAt=today();}x.lastDecision={to,ok,at:Date.now()};x.pendingStatus=null;x.updatedAt=Date.now();saveDocDirect(x);
logChange('doc','update',id,(x.kind==='devis'?'Devis ':'Facture ')+x.number,(ok?'Validé : ':'Refusé : ')+statusLabel(x.kind,to),before);
if(docDraft&&docDraft.id===id){docDraft=clone(x);docOrig=clone(x);renderDoc();}
toast((ok?'Validé : ':'Refusé : ')+x.number+' → '+statusLabel(x.kind,to));
}
function pendingPill(d){if(d.pendingStatus)return'<span class="pill" style="--c:#C98C00">→ '+esc(statusLabel(d.kind,d.pendingStatus.to))+' · à valider</span>';
if(!isAdmin()&&d.lastDecision&&!d.lastDecision.ok&&Date.now()-d.lastDecision.at<14*864e5)return'<span class="pill" style="--c:#D2402C">« '+esc(statusLabel(d.kind,d.lastDecision.to))+' » refusé</span>';return'';}
function bizTabs(){return[['rdv','Rendez-vous',can('rdv')],['comp','Clients',true],['collab','Partenariats',can('collabs')],['contacts','Contacts',can('contacts')],['fac','Factures',can('factures')],['dev','Devis',can('devis')],['suivi','Suivis',can('suivis')],['presta','Prestations',true],['prof',isAdmin()?'Mes entreprises':'Les entreprises',can('entreprises')]].filter(t=>t[2]);}
function viewBusiness(){
const u=S.ui;const tabs=bizTabs();if(!tabs.some(t=>t[0]===u.bizTab))u.bizTab=tabs[0][0];
let h='<div class="wrap"><div class="head"><div><span class="label">Business</span><h1>Business</h1><p class="muted">Rendez-vous, clients, devis et factures. Les rendez-vous apparaissent aussi dans le calendrier.</p></div>'+
(u.bizTab==='rdv'?'<button class="btn primary" data-act="rdv-new">'+ICON.plus+'Nouveau rendez-vous</button>':'')+'</div>';
h+='<div class="seg" role="group" aria-label="Section">'+tabs.map(m=>'<button data-act="biz-tab" data-tab="'+m[0]+'" aria-pressed="'+(u.bizTab===m[0])+'">'+m[1]+(m[0]==='fac'&&isAdmin()&&pendingDocs('facture').length?' · '+pendingDocs('facture').length:'')+(m[0]==='dev'&&isAdmin()&&pendingDocs('devis').length?' · '+pendingDocs('devis').length:'')+'</button>').join('')+'</div>';
if(BILL_TABS.includes(u.bizTab))h+=billingTab(u.bizTab);
else if(u.bizTab==='collab')h+=viewCollabs();
else if(u.bizTab==='contacts')h+=viewContacts();
else if(u.bizTab==='comp')h+=viewClients();
else h+=viewRdvList();
return h+'</div>';
}
function viewRdvList(){
const u=S.ui;const t=today();const all=Object.values(S.rdv).filter(x=>isValidDate(x.date)).sort((a,b)=>(a.date+(a.start||'99'))<(b.date+(b.start||'99'))?-1:1);
let h='<div class="filters"><select class="inp'+(u.rdvFilter?' on':'')+'" id="rdv-filter" data-rdv-filter="1" aria-label="Filtrer les rendez-vous"><option value="">Tous les rendez-vous</option><option value="pro"'+(u.rdvFilter==='pro'?' selected':'')+'>Pro (tous les clients)</option><option value="perso"'+(u.rdvFilter==='perso'?' selected':'')+'>Perso</option>'+
companies().map(c=>'<option value="'+esc(c.id)+'"'+(u.rdvFilter===c.id?' selected':'')+'>'+esc(c.label)+'</option>').join('')+'</select>'+
'<span class="legend" style="margin:0"><span><span class="dot" style="--c:'+settings().persoColor+'"></span>Perso</span>'+companies().map(c=>'<span><span class="dot" style="--c:'+c.color+'"></span>'+esc(c.label)+'</span>').join('')+'</span></div>';
const up=all.filter(x=>x.date>=t&&rdvPass(x));const past=all.filter(x=>x.date<t&&rdvPass(x)).reverse().slice(0,60);
const bd={};up.forEach(x=>{(bd[x.date]=bd[x.date]||[]).push(x);});
h+=up.length?'<div class="agenda">'+Object.keys(bd).map(day=>'<div class="agenda-day"><div class="agenda-date"><b>'+pd(day).getDate()+'</b><span class="label">'+DAYS[dow(day)]+' · '+MSHORT[pd(day).getMonth()]+'</span></div><div class="panel" style="padding:6px 14px"><div class="rows">'+bd[day].map(x=>rdvRow(x,{showRel:true})).join('')+'</div></div></div>').join('')+'</div>'
:'<div class="empty"><b>Aucun rendez-vous à venir</b>Ajoute ton prochain rendez-vous, pro ou perso.<br><button class="btn primary" data-act="rdv-new">Nouveau rendez-vous</button></div>';
if(past.length)h+='<details class="fold" id="rdv-past"><summary>Rendez-vous passés ('+past.length+')</summary><div class="panel" style="padding:6px 14px;margin-top:10px"><div class="rows">'+past.map(x=>rdvRow(x,{showDate:true})).join('')+'</div></div></details>';
return h;
}
const CLIENT_FIELDS=[['contact','Contact'],['phone','Téléphone'],['email','E-mail'],['nif','NIF'],['stat','STAT'],['rcs','RCS'],['address','Adresse'],['country','Pays']];
function viewClients(){
const ed=can('clients');const t=today();const all=Object.values(S.rdv);
let h='<p class="muted" style="margin:0">Tes clients servent partout : rendez-vous pro, projets, devis et factures. Leurs infos sont reprises automatiquement sur les documents.</p>';
if(ed)h+='<section class="panel"><h3>Ajouter un client</h3><form class="add-form" data-form="comp"><input class="inp" id="comp-new" placeholder="Nom du client (ex. Orange Madagascar)" autocomplete="off"><input type="color" class="swatch" id="comp-new-color" value="#3D5A80" aria-label="Couleur"><button class="btn primary" type="submit">'+ICON.plus+'Ajouter</button></form></section>';
if(!companies().length)return h+'<div class="empty"><b>Aucun client pour l\'instant</b>'+(ed?'Ajoute ton premier client ci-dessus.':'Aucun client enregistré.')+'</div>';
h+='<div class="comp-list">'+companies().map(c=>{const mine=all.filter(x=>x.kind!=='perso'&&x.companyId===c.id);const next=mine.filter(x=>x.date>=t).sort((a,b)=>a.date<b.date?-1:1)[0];
const pj=contents().filter(x=>x.companyId===c.id).length;const nd=docs().filter(d=>d.companyId===c.id).length;const dis=ed?'':' disabled';if(!OPEN['cl:'+c.id])return clientMini(c,next,pj,nd,ed);
return'<section class="panel comp-card"><div class="set-item"><input type="color" class="swatch" id="cc-'+esc(c.id)+'" value="'+esc(c.color)+'" data-comp-color="'+esc(c.id)+'" aria-label="Couleur"'+dis+'>'+
'<input class="inp" id="cl-'+esc(c.id)+'" value="'+esc(c.label)+'" data-comp-label="'+esc(c.id)+'" aria-label="Nom du client" style="font-weight:700"'+dis+'>'+
foldBtn('cl:'+c.id)+(ed?'<button class="icon-btn danger" data-act="comp-del" data-id="'+esc(c.id)+'" data-confirm="Supprimer ?" aria-label="Supprimer '+esc(c.label)+'">'+ICON.trash+'</button>':'')+'</div>'+
'<div class="f-grid">'+CLIENT_FIELDS.map(f=>'<label class="field'+(f[0]==='address'?' wide':'')+'"><span>'+f[1]+'</span><input class="inp" id="cf-'+f[0]+'-'+esc(c.id)+'" value="'+esc(c[f[0]]||'')+'" data-compf="'+f[0]+'" data-id="'+esc(c.id)+'"'+dis+'></label>').join('')+'</div>'+
'<div class="kvs"><div><span class="label">Prochain RDV</span><b>'+(next?esc(fmtShort(next.date))+(next.start?' · '+esc(next.start):''):'—')+'</b></div><div><span class="label">Projets</span><b>'+pj+'</b></div><div><span class="label">Devis et factures</span><b>'+nd+'</b></div></div>'+
'<div class="card-f">'+(can('rdv')?'<button class="btn small" data-act="rdv-new" data-comp="'+esc(c.id)+'">'+ICON.plus+'RDV</button>':'')+(can('devis')?'<button class="btn small" data-act="doc-new" data-kind="devis" data-comp="'+esc(c.id)+'">'+ICON.plus+'Devis</button>':'')+
(can('factures')?'<button class="btn small" data-act="doc-new" data-kind="facture" data-comp="'+esc(c.id)+'">'+ICON.plus+'Facture</button>':'')+(can('rdv')?'<button class="btn small ghost" data-act="comp-filter" data-id="'+esc(c.id)+'">Ses rendez-vous</button>':'')+'</div></section>';}).join('')+'</div>';
if(isAdmin())h+='<section class="panel comp-card"><h3>Rendez-vous perso</h3><div class="set-item"><input type="color" class="swatch" id="perso-color" value="'+esc(settings().persoColor)+'" data-perso-color="1" aria-label="Couleur des rendez-vous perso"><span class="muted">Couleur des rendez-vous perso dans le calendrier</span></div></section>';
return h;
}
function docRow(d){const st=docState(d);const t=docTotals(d);const cl=d.clientSnap&&d.clientSnap.name||(compOf(d.companyId)||{}).label||'Sans client';
return'<tr data-act="doc-open" data-id="'+esc(d.id)+'"><td class="mono"><b>'+esc(d.number)+'</b></td><td>'+esc(cl)+(d.subject?'<div class="hint">'+esc(d.subject)+'</div>':'')+'</td><td class="mono">'+fmtShort(d.date)+'</td><td class="mono">'+(isValidDate(d.dueDate)?fmtShort(d.dueDate):'—')+'</td><td class="mono" style="text-align:right;white-space:nowrap"><b>'+esc(money(t.total,d.currency))+'</b>'+(d.kind==='facture'&&docPaid(d)>0&&docRemaining(d)>0?'<div class="hint">reste '+esc(money(docRemaining(d),d.currency))+'</div>':'')+'</td><td><div class="card-f"><span class="pill" style="--c:'+st[2]+'">'+st[1]+'</span>'+pendingPill(d)+followPills(d)+sigPill(d)+'</div></td>'+
'<td><div class="row-acts"><button class="btn small" data-act="doc-pdf" data-id="'+esc(d.id)+'" title="Exporter en PDF">PDF</button></div></td></tr>';}
function pendingPanel(kind){
const L=pendingDocs(kind);if(!isAdmin()||!L.length)return'';
return'<section class="panel" style="border-color:#C98C00"><div class="panel-h"><h2>À valider</h2><span class="mono muted">'+L.length+'</span></div><div class="rows">'+L.map(d=>{const cl=d.clientSnap&&d.clientSnap.name||(compOf(d.companyId)||{}).label||'Sans client';
return'<div class="row"><button class="row-main" data-act="doc-open" data-id="'+esc(d.id)+'"><b>'+esc(d.number)+' · '+esc(cl)+'</b><span class="row-meta"><span>'+esc(d.pendingStatus.by||'Assistante')+' demande : <b>'+esc(statusLabel(d.kind,d.pendingStatus.to))+'</b></span><span class="mono">'+esc(money(docTotals(d).total,d.currency))+'</span><span>'+fmtStamp(d.pendingStatus.at)+'</span></span></button>'+
'<div class="row-acts"><button class="btn small primary" data-act="doc-approve" data-id="'+esc(d.id)+'">'+ICON.check+'Valider</button><button class="btn small danger" data-act="doc-reject" data-id="'+esc(d.id)+'">Refuser</button></div></div>';}).join('')+'</div></section>';
}
function billingTab(tab){
if(tab==='suivi')return viewSuivis();
if(tab==='prof')return isAdmin()?viewProfiles()+currenciesPanel():viewEntreprises();
if(tab==='presta')return viewPrestations();
if(!profiles().length)return isAdmin()?'<div class="empty"><b>Commence par le profil de ton entreprise</b>Nom, téléphone, mail, NIF, STAT, RCS, adresse et pays : tu les remplis une fois, ils apparaissent ensuite sur tous tes devis et factures.<br><button class="btn primary" data-act="biz-tab" data-tab="prof">Créer mon profil d\'entreprise</button></div>'
:'<div class="empty"><b>Aucune entreprise configurée</b>L\'admin doit d\'abord créer le profil de son entreprise.</div>';
const kind=tab==='dev'?'devis':'facture';const f=S.ui.docFilter||{};
let list=docs().filter(d=>d.kind===kind).sort((a,b)=>(b.date+b.number)>(a.date+a.number)?1:-1);
if(f.status)list=list.filter(d=>docState(d)[0]===f.status);if(f.profile)list=list.filter(d=>d.profileId===f.profile);if(f.client)list=list.filter(d=>d.companyId===f.client);
let h=pendingPanel(kind);
if(kind==='facture'){
const all=docs().filter(d=>d.kind==='facture'&&d.status!=='annulee'&&d.status!=='brouillon');const t=today();const ms=t.slice(0,7);
const open=all.filter(d=>d.status==='envoyee');const late=open.filter(d=>docState(d)[0]==='retard');
if(isAdmin()){
const month=all.filter(d=>String(d.date).slice(0,7)===ms);const paidM=all.filter(d=>d.status==='payee'&&String(d.paidAt||d.date).slice(0,7)===ms);
h+='<div class="stats" style="grid-template-columns:repeat(4,minmax(0,1fr))"><div class="stat"><span class="label">Facturé ce mois</span><strong style="font-size:20px">'+esc(sumBy(month,d=>docTotals(d).total))+'</strong><span class="muted">'+plural(month.length,'facture')+'</span></div>'+
'<div class="stat"><span class="label">Encaissé ce mois</span><strong style="font-size:20px;color:var(--ok)">'+esc(cashIn(ms))+'</strong><span class="muted">'+plural(paidM.length,'facture')+' payée'+(paidM.length>1?'s':'')+'</span></div>'+
'<div class="stat"><span class="label">À encaisser</span><strong style="font-size:20px">'+esc(sumBy(open,d=>docRemaining(d)))+'</strong><span class="muted">'+plural(open.length,'facture')+' envoyée'+(open.length>1?'s':'')+'</span></div>'+
'<div class="stat'+(late.length?' alert':'')+'"><span class="label">En retard</span><strong style="font-size:20px">'+esc(sumBy(late,d=>docRemaining(d)))+'</strong><span class="muted">'+plural(late.length,'facture')+'</span></div></div>';
}else if(can('toCollect')){
h+='<section class="panel"><div class="panel-h"><h2>Argent à réclamer</h2><span class="mono" style="font-weight:700">'+esc(sumBy(open,d=>docRemaining(d)))+'</span></div>'+
(open.length?'<div class="rows">'+open.sort((a,b)=>(a.dueDate||'')<(b.dueDate||'')?-1:1).map(d=>{const st=docState(d);const cl=d.clientSnap&&d.clientSnap.name||(compOf(d.companyId)||{}).label||'Sans client';
return'<div class="row"><button class="row-main" data-act="doc-open" data-id="'+esc(d.id)+'"><b>'+esc(cl)+' · '+esc(d.number)+'</b><span class="row-meta"><span class="pill" style="--c:'+st[2]+'">'+st[1]+'</span>'+pendingPill(d)+followPills(d)+'<span>Échéance '+(isValidDate(d.dueDate)?fmtShort(d.dueDate):'—')+'</span>'+(d.clientSnap&&d.clientSnap.contact?'<span>Contact : '+esc(d.clientSnap.contact)+'</span>':'')+'</span></button><span class="mono" style="font-weight:700;white-space:nowrap">'+esc(money(docRemaining(d),d.currency))+'</span></div>';}).join('')+'</div>'
:'<div class="empty" style="padding:14px">Rien à réclamer : toutes les factures envoyées sont payées.</div>')+'</section>';
}
}
const opt=(v,l,sel)=>'<option value="'+esc(v)+'"'+(sel===v?' selected':'')+'>'+esc(l)+'</option>';
const sts=(DOC_STATUS[kind]).concat(kind==='facture'?[['retard','En retard']]:[]);
h+='<div class="cal-bar"><div class="filters">'+
'<select class="inp'+(f.status?' on':'')+'" id="df-status" data-docf="status" aria-label="Statut">'+opt('','Tous les statuts',f.status)+sts.map(s=>opt(s[0],s[1],f.status)).join('')+'</select>'+
(profiles().length>1?'<select class="inp'+(f.profile?' on':'')+'" id="df-profile" data-docf="profile" aria-label="Entreprise">'+opt('','Toutes les entreprises',f.profile)+profiles().map(p=>opt(p.id,p.name,f.profile)).join('')+'</select>':'')+
'<select class="inp'+(f.client?' on':'')+'" id="df-client" data-docf="client" aria-label="Client">'+opt('','Tous les clients',f.client)+companies().map(c=>opt(c.id,c.label,f.client)).join('')+'</select></div>'+
'<button class="btn primary" data-act="doc-new" data-kind="'+kind+'">'+ICON.plus+(kind==='devis'?'Nouveau devis':'Nouvelle facture')+'</button></div>';
h+=list.length?'<div class="table-wrap"><table><thead><tr><th>N°</th><th>Client</th><th>Date</th><th>'+(kind==='devis'?'Validité':'Échéance')+'</th><th style="text-align:right">Montant</th><th>Statut</th><th></th></tr></thead><tbody>'+list.map(docRow).join('')+'</tbody></table></div>'
:'<div class="empty"><b>'+(kind==='devis'?'Aucun devis':'Aucune facture')+'</b>'+(Object.values(f).some(Boolean)?'Change les filtres.':'Crée le premier : les prestations, la TVA et le total se calculent tout seuls.')+'</div>';
if(kind==='facture'&&isAdmin()){
const yr=today().slice(0,4);const inv=docs().filter(d=>d.kind==='facture'&&d.status!=='annulee'&&d.status!=='brouillon'&&String(d.date).startsWith(yr));
const per={};inv.forEach(d=>{const k=d.companyId||'_';(per[k]=per[k]||[]).push(d);});const keys=Object.keys(per);
if(keys.length)h+='<section class="panel"><div class="panel-h"><h2>Revenus '+yr+' par client</h2></div><div>'+keys.map(k=>{const c=compOf(k);const L=per[k];
return'<div class="acc-row"><span class="acc-name"><span class="dot" style="--c:'+(c?c.color:'#8A8FA3')+'"></span><span>'+esc(c?c.label:'Sans client')+'</span></span><div class="kv"><b>'+esc(sumBy(L,d=>docTotals(d).total))+'</b>facturé</div><div class="kv"><b>'+esc(sumBy(L,d=>docPaid(d)))+'</b>encaissé</div></div>';}).join('')+'</div></section>';
}
return h;
}
function viewEntreprises(){
if(!profiles().length)return'<div class="empty"><b>Aucune entreprise</b>L\'admin n\'a pas encore créé de profil d\'entreprise.</div>';
return'<p class="muted" style="margin:0">Les entreprises qui émettent les devis et factures. Tu peux les choisir comme émetteur, sans les modifier.</p><div class="grid-2">'+profiles().map(p=>{
const rows=[['Activité',p.activity],['Téléphone',p.phone],['E-mail',p.email],['NIF',p.nif],['STAT',p.stat],['RCS',p.rcs],['Adresse',p.address],['Pays',p.country]].filter(x=>x[1]);
const nd=docs().filter(d=>d.profileId===p.id);
return'<section class="panel comp-card"><div class="set-item">'+(logoSrc(p)?'<img src="'+esc(logoSrc(p))+'" alt="" style="height:36px;width:auto;border-radius:6px;background:#fff;border:1px solid var(--line);padding:2px">':'<span class="dot" style="--c:'+esc(p.color||'#4636D9')+';width:12px;height:12px"></span>')+'<h2>'+esc(p.name)+'</h2></div>'+
'<div class="kvs">'+rows.map(r=>'<div><span class="label">'+r[0]+'</span><b>'+esc(r[1])+'</b></div>').join('')+'</div>'+
'<div class="card-f">'+(can('devis')?'<button class="btn small" data-act="doc-new" data-kind="devis" data-prof="'+esc(p.id)+'">'+ICON.plus+'Devis</button>':'')+(can('factures')?'<button class="btn small" data-act="doc-new" data-kind="facture" data-prof="'+esc(p.id)+'">'+ICON.plus+'Facture</button>':'')+'<span class="hint">'+plural(nd.filter(d=>d.kind==='devis').length,'devis','devis')+' · '+plural(nd.filter(d=>d.kind==='facture').length,'facture')+'</span></div></section>';}).join('')+'</div>';
}
function viewPrestations(){
const ed=can('prestaEdit');
let h='<p class="muted" style="margin:0">Le catalogue de prestations. Tu les ajoutes en un clic dans les devis et factures, et le prix reste modifiable sur chaque document.</p>';
if(!ed)return h+(prestations().length?'<div class="table-wrap"><table style="min-width:520px"><thead><tr><th>Prestation</th><th>Unité</th><th style="text-align:right">Prix</th></tr></thead><tbody>'+prestations().map(x=>'<tr style="cursor:default"><td><b>'+esc(x.label)+'</b>'+(x.desc?'<div class="hint">'+esc(x.desc)+'</div>':'')+'</td><td>'+esc(x.unit)+'</td><td class="mono" style="text-align:right">'+esc(money(x.price,x.currency||'MGA'))+'</td></tr>').join('')+'</tbody></table></div>'
:'<div class="empty"><b>Aucune prestation</b>Le catalogue est vide.</div>');
h+=prestations().length?'<div class="table-wrap"><table style="min-width:620px"><thead><tr><th>Prestation</th><th>Unité</th><th style="text-align:right">Prix</th><th>Devise</th><th></th></tr></thead><tbody>'+prestations().map(x=>'<tr style="cursor:default">'+
'<td><input class="inp" id="ps-l-'+esc(x.id)+'" value="'+esc(x.label)+'" data-presta="label" data-id="'+esc(x.id)+'" aria-label="Nom"><input class="inp" style="margin-top:6px;font-size:13px" id="ps-d-'+esc(x.id)+'" value="'+esc(x.desc||'')+'" data-presta="desc" data-id="'+esc(x.id)+'" placeholder="Détail (facultatif)" aria-label="Détail"></td>'+
'<td><select class="inp" id="ps-u-'+esc(x.id)+'" data-presta="unit" data-id="'+esc(x.id)+'" aria-label="Unité">'+UNITS.concat(UNITS.includes(x.unit)?[]:[x.unit]).map(u=>'<option'+(u===x.unit?' selected':'')+'>'+esc(u)+'</option>').join('')+'</select></td>'+
'<td><input class="inp mono" style="text-align:right" type="number" min="0" step="any" id="ps-p-'+esc(x.id)+'" value="'+esc(x.price)+'" data-presta="price" data-id="'+esc(x.id)+'" aria-label="Prix"></td>'+
'<td><select class="inp" id="ps-c-'+esc(x.id)+'" data-presta="currency" data-id="'+esc(x.id)+'" aria-label="Devise">'+Object.keys(CURRENCIES).map(k=>'<option value="'+k+'"'+((x.currency||'MGA')===k?' selected':'')+'>'+k+'</option>').join('')+'</select></td>'+
'<td><button class="icon-btn sm danger" data-act="presta-del" data-id="'+esc(x.id)+'" data-confirm="✓" aria-label="Supprimer">'+ICON.trash+'</button></td></tr>').join('')+'</tbody></table></div>'
:'<div class="empty"><b>Aucune prestation</b>Ex. : Réalisation d\'un skit, Post sponsorisé Instagram, Journée de tournage, Montage vidéo.</div>';
h+='<section class="panel"><h3>Ajouter une prestation</h3><form class="add-form" data-form="presta"><input class="inp" id="presta-new" placeholder="Ex. : Post sponsorisé Instagram" autocomplete="off"><select class="inp" id="presta-unit" aria-label="Unité">'+UNITS.map(u=>'<option>'+u+'</option>').join('')+'</select><input class="inp mono" type="number" min="0" step="any" id="presta-price" placeholder="Prix" style="max-width:150px"><select class="inp" id="presta-cur" aria-label="Devise">'+Object.keys(CURRENCIES).map(k=>'<option value="'+k+'">'+k+'</option>').join('')+'</select><button class="btn primary" type="submit">'+ICON.plus+'Ajouter</button></form></section>';
return h;
}
function docPerm(kind){return kind==='devis'?'devis':'factures';}
function handleBillingClick(a,el,e){
if(!a.startsWith('doc-')&&!a.startsWith('prof-')&&!a.startsWith('presta-'))return false;
const id=el.dataset.id;
if(a.startsWith('prof-')&&!isAdmin()){toast('Réservé à la vue admin.');return true;}
if(a.startsWith('presta-')&&!can('prestaEdit')){toast(DENIED);return true;}
if((a==='doc-approve'||a==='doc-reject')&&!isAdmin()){toast('Réservé à la vue admin.');return true;}
const kindOf=()=>a==='doc-new'?(el.dataset.kind||'facture'):((S.docs[id]||docDraft||{}).kind||'facture');
if(a.startsWith('doc-')&&!['doc-approve','doc-reject','doc-close'].includes(a)&&!can(docPerm(kindOf()))){toast(DENIED);return true;}
switch(a){
case'doc-approve':e.stopPropagation();approveDoc(id,true);return true;
case'doc-reject':e.stopPropagation();approveDoc(id,false);return true;
case'doc-new':openDoc(null,{kind:el.dataset.kind,profileId:el.dataset.prof,companyId:el.dataset.comp});return true;
case'doc-open':openDoc(id);return true;
case'doc-close':closeDoc();return true;
case'doc-save':{const r=saveDoc(false);if(!r)toast('Ajoute au moins une prestation ou un client.');}return true;
case'doc-pdf':e.stopPropagation();exportDocPdf(id);return true;
case'doc-addline':docDraft.lines.push({id:uid(),label:'',qty:1,unit:'forfait',price:0});renderDoc();{const l=docDraft.lines[docDraft.lines.length-1];const t=document.getElementById('dl-l-'+l.id);if(t)t.focus();}return true;
case'doc-delline':docDraft.lines=docDraft.lines.filter(l=>l.id!==el.dataset.lid);if(!docDraft.lines.length)docDraft.lines.push({id:uid(),label:'',qty:1,unit:'forfait',price:0});renderDoc();return true;
case'doc-paid':if(!isAdmin()){if(!can('payStatus')){toast(DENIED);return true;}requestDocStatus(docDraft,'payee');saveDoc(true);renderDoc();return true;}
docDraft.status='payee';docDraft.paidAt=today();docDraft.pendingStatus=null;saveDoc(true);renderDoc();toast('Facture marquée payée');return true;
case'doc-dup':{saveDoc(true);const c=clone(docDraft);c.id='d'+uid();c.date=today();c.number=nextNumber(c.kind,c.profileId,c.date);c.dueDate=addDays(c.date,c.kind==='devis'?30:15);c.status='brouillon';c.paidAt='';c.pendingStatus=null;c.lastDecision=null;c.payments=[];c.followUp='';c.reminders=[];c.profileSnap=null;c.clientSnap=null;c.createdAt=Date.now();c.lines=c.lines.map(l=>Object.assign({},l,{id:uid()}));
docDraft=c;docOrig=null;saveDoc(true);renderDoc();toast('Copie créée : '+c.number);}return true;
case'doc-tofac':{if(!can('factures')){toast(DENIED);return true;}const src=saveDoc(true)||docDraft;const f=clone(src);f.id='d'+uid();f.kind='facture';f.date=today();f.number=nextNumber('facture',f.profileId,f.date);f.dueDate=addDays(f.date,15);f.status='brouillon';f.fromQuote=src.number;f.paidAt='';f.pendingStatus=null;f.lastDecision=null;f.payments=[];f.followUp='';f.reminders=[];f.profileSnap=null;f.clientSnap=null;
const p=profOf(f.profileId);f.notes=(p&&p.invoiceNotes)||'';f.notes=(f.notes?f.notes+'\n':'')+'Selon devis n° '+src.number+'.';f.createdAt=Date.now();f.lines=f.lines.map(l=>Object.assign({},l,{id:uid()}));
if(src.status!=='accepte'&&S.docs[src.id]){const q=clone(S.docs[src.id]);if(isAdmin()){q.status='accepte';q.pendingStatus=null;}else if(can('payStatus'))q.pendingStatus={to:'accepte',by:roleName(ROLE),at:Date.now()};saveDocDirect(q);}
docDraft=f;docOrig=null;saveDoc(true);renderDoc();toast('Facture '+f.number+' créée depuis le devis'+(!isAdmin()?' (acceptation du devis à valider par l\'admin)':''));}return true;
case'doc-del':{e.stopPropagation();const d=S.docs[id];if(!isAdmin()&&d&&d.status!=='brouillon'){toast('Tu peux supprimer seulement les brouillons.');return true;}deleteDoc(id);}return true;
case'prof-del':if(!isAdmin()){toast('Réservé à la vue admin.');return true;}{if(docs().some(d=>d.profileId===id)){toast('Ce profil est utilisé par des documents.');return true;}const lbl=(profOf(id)||{}).name||'';updateSettings(s=>{s.profiles=(s.profiles||[]).filter(p=>p.id!==id);},'Profil « '+lbl+' » supprimé');}return true;
case'prof-nologo':if(!isAdmin())return true;updateSettings(s=>{const p=(s.profiles||[]).find(x=>x.id===id);if(p){delete p.logo;delete p.logoRef;delete p.logoW;delete p.logoH;}},'Logo retiré');return true;
case'presta-del':{const lbl=(prestations().find(x=>x.id===id)||{}).label||'';updateSettings(s=>{s.prestations=(s.prestations||[]).filter(x=>x.id!==id);},'Prestation « '+lbl+' » supprimée');}return true;
}
return false;
}
function handleBillingSubmit(k){
if(!['prof','presta'].includes(k))return false;
if(k==='prof'){if(!isAdmin())return true;const v=$('#prof-new').value.trim();if(!v){toast('Écris le nom de l\'entreprise.');return true;}
updateSettings(s=>{s.profiles=(s.profiles||[]).concat([{id:'p'+uid(),name:v,country:'Madagascar',currency:'MGA',taxRate:0,prefixF:'FAC',prefixD:'DEV',color:'#4636D9'}]);},'Profil d\'entreprise créé : '+v);$('#prof-new').value='';toast('Profil « '+v+' » créé : complète ses infos');}
if(k==='presta'){if(!can('prestaEdit'))return true;const v=$('#presta-new').value.trim();if(!v){toast('Écris le nom de la prestation.');return true;}const price=parseFloat($('#presta-price').value)||0;const unit=$('#presta-unit').value;const cur=$('#presta-cur').value;
updateSettings(s=>{s.prestations=(s.prestations||[]).concat([{id:'s'+uid(),label:v,desc:'',unit,price,currency:cur}]);},'Prestation ajoutée : '+v);$('#presta-new').value='';$('#presta-price').value='';toast('Prestation ajoutée');}
return true;
}
function handleBillingChange(el){
if(el.dataset.perm){if(!isAdmin())return true;const k=el.dataset.perm,v=el.checked;updateSettings(s=>{s.perms=Object.assign({},s.perms||{},{[k]:v});},'Autorisation « '+((PERMS.flatMap(g=>g[1]).find(p=>p[0]===k)||[0,k])[1])+' » '+(v?'activée':'coupée'));return true;}
if(el.dataset.prof&&el.dataset.id){if(!isAdmin())return true;const f=el.dataset.prof,id=el.dataset.id;let v=el.value;if(f==='taxRate')v=parseFloat(v)||0;else if(f!=='color')v=String(v).trim();
if(f==='name'&&!v){render();return true;}updateSettings(s=>{const p=(s.profiles||[]).find(x=>x.id===id);if(p)p[f]=v;},'Profil '+((profOf(id)||{}).name||'')+' : '+f);return true;}
if(el.dataset.profLogo){if(!isAdmin())return true;loadLogo(el.dataset.profLogo,el.files&&el.files[0]);el.value='';return true;}
if(el.dataset.presta&&el.dataset.id){if(!can('prestaEdit'))return true;const f=el.dataset.presta,id=el.dataset.id;let v=el.value;if(f==='price')v=parseFloat(v)||0;else if(f==='label'&&!v.trim()){render();return true;}
updateSettings(s=>{const x=(s.prestations||[]).find(p=>p.id===id);if(x)x[f]=v;},'Prestation modifiée');return true;}
if(el.dataset.compf&&el.dataset.id){if(!can('clients')){render();return true;}const f=el.dataset.compf,id=el.dataset.id;const v=el.value.trim();updateSettings(s=>{const c=(s.companies||[]).find(x=>x.id===id);if(c)c[f]=v;},'Client '+((compOf(id)||{}).label||'')+' : '+f);return true;}
if(el.dataset.compLabel||el.dataset.compColor){if(!can('clients')){render();return true;}const cid=el.dataset.compLabel||el.dataset.compColor;const v=el.value.trim();if(el.dataset.compLabel&&!v){render();return true;}
updateSettings(s=>{const c=s.companies.find(x=>x.id===cid);if(c){if(el.dataset.compLabel)c.label=v;else c.color=el.value;}},el.dataset.compLabel?'Client renommé : '+v:'Couleur du client');return true;}
if(el.dataset.docf){S.ui.docFilter=Object.assign({},S.ui.docFilter||{},{[el.dataset.docf]:el.value});saveUI();render();return true;}
return false;
}
function historyPanel(){const hs=S.history.slice(0,S.ui.histAll?HMAX_CLOUD:25);
return'<section class="panel"><div class="panel-h"><h2>Historique des modifications</h2><span class="mono muted">'+S.history.length+'</span></div>'+(hs.length?'<div class="hist">'+hs.map(histRow).join('')+'</div>'+(S.history.length>hs.length?'<button class="btn ghost small" data-act="hist-all">Voir tout l\'historique</button>':''):'<div class="empty"><b>Aucune modification enregistrée</b></div>')+'</section>';}
const BASE_CUR=['MGA','EUR','USD'];
function syncCurrencies(){Object.keys(CURRENCIES).forEach(k=>{if(!BASE_CUR.includes(k))delete CURRENCIES[k];});
(settings().currencies||[]).forEach(c=>{if(c&&c.code&&!BASE_CUR.includes(c.code))CURRENCIES[c.code]={label:c.label||c.code,sym:c.sym||c.code,dec:+c.dec||0,word:c.word||c.code,sub:c.sub||'',custom:true};});}
function currenciesPanel(){
const cs=settings().currencies||[];
return'<section class="panel"><div class="panel-h"><h2>Devises</h2></div><p class="hint" style="margin:-4px 0 10px">Ariary, euro et dollar sont déjà là. Ajoute d\'autres devises pour tes devis, factures et prestations.</p>'+
(cs.length?'<div class="rows">'+cs.map(c=>'<div class="row"><div class="row-main" style="cursor:default"><b>'+esc(c.code)+' · '+esc(c.label||c.code)+'</b><span class="row-meta"><span>Symbole '+esc(c.sym||c.code)+'</span><span>'+(+c.dec?'2 décimales':'Sans décimales')+'</span><span>Ex. : '+esc(money(1234567.5,c.code))+'</span></span></div><button class="icon-btn sm danger" data-act="cur-del" data-id="'+esc(c.code)+'" data-confirm="✓" aria-label="Supprimer la devise">'+ICON.trash+'</button></div>').join('')+'</div>':'')+
'<form class="add-form" data-form="cur"><input class="inp" id="cur-code" placeholder="Code (ex. XOF)" maxlength="5" style="max-width:120px;text-transform:uppercase" autocomplete="off"><input class="inp" id="cur-label" placeholder="Nom (ex. Franc CFA)" autocomplete="off"><input class="inp" id="cur-sym" placeholder="Symbole (ex. FCFA)" style="max-width:130px" autocomplete="off">'+
'<select class="inp" id="cur-dec" aria-label="Décimales" style="max-width:150px"><option value="0">Sans décimales</option><option value="2">2 décimales</option></select><input class="inp" id="cur-word" placeholder="En lettres (ex. franc CFA)" autocomplete="off"><button class="btn primary" type="submit">'+ICON.plus+'Ajouter</button></form></section>';
}
function payAmount(d,p){return p.pct?docTotals(d).total*(+p.pct)/100:(+p.amount||0);}
function docPaid(d){if(d.kind!=='facture'||d.status==='annulee')return 0;const t=docTotals(d).total;
const ps=(d.payments||[]).filter(p=>!p.pending);if(!ps.length)return d.status==='payee'?t:0;return Math.min(t,ps.reduce((a,p)=>a+payAmount(d,p),0));}
function docRemaining(d){if(d.kind!=='facture'||d.status==='annulee'||d.status==='payee')return 0;return Math.max(0,docTotals(d).total-docPaid(d));}
function paidPct(d){const t=docTotals(d).total;return t>0?Math.round(docPaid(d)/t*100):0;}
function dueInfo(d){
if(d.kind!=='facture'||!isValidDate(d.dueDate)||['payee','annulee','brouillon'].includes(d.status)||docRemaining(d)<=0)return null;
const n=diffDays(d.dueDate,today());
if(n<0)return{n,label:plural(-n,'jour')+' de retard',c:'#D2402C'};
if(n===0)return{n,label:'Échéance aujourd\'hui',c:'#E0533D'};
return{n,label:plural(n,'jour')+' restant'+(n>1?'s':'')+' pour payer',c:n<=2?'#E0533D':n<=7?'#C98C00':'#5B6CFF'};
}
const FOLLOW={relancer:['À relancer','#C98C00'],urgent:['Relancer en urgence','#D2402C']};
function followPills(d){let h='';const di=dueInfo(d);if(di)h+='<span class="pill" style="--c:'+di.c+'">'+esc(di.label)+'</span>';
if(d.followUp&&FOLLOW[d.followUp])h+='<span class="pill" style="--c:'+FOLLOW[d.followUp][1]+'">'+(d.followUp==='urgent'?'⚑ ':'')+FOLLOW[d.followUp][0]+'</span>';
const rs=d.reminders||[];if(rs.length)h+='<span class="pill plain">Relancé '+(rs.length>1?rs.length+' fois · ':'')+'le '+esc(fmtShort(ds(new Date(rs[rs.length-1].at))))+'</span>';
const pp=paidPct(d);if(d.kind==='facture'&&pp>0&&pp<100&&d.status!=='payee')h+='<span class="pill" style="--c:#14A37F">Payé à '+pp+' %</span>';
if((d.payments||[]).some(p=>p.pending))h+='<span class="pill" style="--c:#C98C00">Paiement à valider</span>';
return h;}
function progressBar(paid,total){const pct=total>0?Math.min(100,Math.round(paid/total*100)):0;return'<div class="pbar" role="img" aria-label="Payé à '+pct+' %"><i style="width:'+pct+'%"></i></div>';}
function cashIn(ms){const m={};docs().forEach(d=>{if(d.kind!=='facture'||d.status==='annulee')return;const c=d.currency||'MGA';const ps=(d.payments||[]).filter(p=>!p.pending);
if(ps.length)ps.forEach(p=>{if(String(p.date).slice(0,7)===ms)m[c]=(m[c]||0)+payAmount(d,p);});else if(d.status==='payee'&&String(d.paidAt||d.date).slice(0,7)===ms)m[c]=(m[c]||0)+docTotals(d).total;});
const ks=Object.keys(m).filter(k=>m[k]>0.0001);return ks.length?ks.map(k=>money(m[k],k)).join(' + '):money(0,'MGA');}
let payingId=null;
function payForm(d){
const t=docTotals(d).total;
return'<form class="payform" data-form="pay" data-id="'+esc(d.id)+'"><div class="f-grid">'+
'<label class="field"><span>Type</span><select class="inp" id="pay-kind"><option value="acompte">Acompte / avance</option><option value="paiement">Paiement</option><option value="solde">Solde</option></select></label>'+
'<label class="field"><span>Saisir en</span><select class="inp" id="pay-mode"><option value="pct">Pourcentage du total</option><option value="amount">Montant</option></select></label>'+
'<label class="field"><span>Valeur</span><input class="inp mono" type="number" min="0" step="any" id="pay-val" placeholder="ex. 40"></label>'+
'<label class="field"><span>Date de réception</span><input class="inp" type="date" id="pay-date" value="'+today()+'"></label>'+
'<label class="field wide"><span>Note (moyen de paiement, référence…)</span><input class="inp" id="pay-note" placeholder="Ex. : virement BNI, MVola…"></label></div>'+
'<p class="hint" style="margin:6px 0 0">Total de la facture : '+esc(money(t,d.currency))+' · reste : '+esc(money(docRemaining(d),d.currency))+'. Le bouton « Tout le reste » remplit le solde.'+(isAdmin()?'':' Ton paiement sera validé par l\'admin.')+'</p>'+
'<div class="card-f"><button type="button" class="btn small ghost" data-act="pay-cancel">Annuler</button><button type="button" class="btn small" data-act="pay-rest" data-id="'+esc(d.id)+'">Tout le reste</button><button class="btn small primary" type="submit">'+ICON.check+'Enregistrer le paiement</button></div></form>';
}
function paymentsList(d){const ps=d.payments||[];if(!ps.length)return'';
return'<div class="paylist">'+ps.map(p=>'<div class="payrow'+(p.pending?' pending':'')+'"><span class="mono">'+esc(fmtShort(p.date))+'</span><span>'+esc(p.kind==='acompte'?'Acompte':p.kind==='solde'?'Solde':'Paiement')+(p.pct?' '+esc(p.pct)+' %':'')+(p.note?' · '+esc(p.note):'')+(p.pending?' · <b>à valider</b>':'')+'</span><b class="mono">'+esc(money(payAmount(d,p),d.currency))+'</b>'+
(isAdmin()&&p.pending?'<button class="btn small primary" data-act="pay-approve" data-id="'+esc(d.id)+'" data-pid="'+esc(p.id)+'">Valider</button><button class="btn small danger" data-act="pay-reject" data-id="'+esc(d.id)+'" data-pid="'+esc(p.id)+'">Refuser</button>':'')+
(!p.pending?'<button class="btn small ghost" data-act="receipt" data-id="'+esc(d.id)+'" data-pid="'+esc(p.id)+'">Reçu PDF</button>':'')+(isAdmin()||p.pending?'<button class="icon-btn sm danger" data-act="pay-del" data-id="'+esc(d.id)+'" data-pid="'+esc(p.id)+'" data-confirm="✓" aria-label="Supprimer ce paiement">'+ICON.x+'</button>':'')+'</div>').join('')+'</div>';}
function suiviRow(d){
const t=docTotals(d).total,paid=docPaid(d),rest=docRemaining(d);
let h='<div class="suivi"><div class="suivi-h"><button class="row-main" data-act="doc-open" data-id="'+esc(d.id)+'"><b>'+esc(d.number)+(d.subject?' · '+esc(d.subject):'')+'</b><span class="row-meta"><span class="mono">'+esc(fmtShort(d.date))+'</span>'+followPills(d)+'</span></button>'+
'<div class="suivi-amt"><b class="mono">'+esc(money(rest,d.currency))+'</b><span class="hint">reste sur '+esc(money(t,d.currency))+'</span></div></div>'+progressBar(paid,t)+paymentsList(d);
if(payingId===d.id)h+=payForm(d);
else h+='<div class="card-f"><button class="btn small primary" data-act="pay-open" data-id="'+esc(d.id)+'">'+ICON.plus+'Acompte / paiement</button>'+
'<button class="btn small'+(d.followUp==='relancer'?' on':'')+'" data-act="fu-set" data-v="'+(d.followUp==='relancer'?'':'relancer')+'" data-id="'+esc(d.id)+'">À relancer</button>'+
'<button class="btn small danger'+(d.followUp==='urgent'?' on':'')+'" data-act="fu-set" data-v="'+(d.followUp==='urgent'?'':'urgent')+'" data-id="'+esc(d.id)+'">Urgent</button>'+
'<button class="btn small" data-act="msg-open" data-id="'+esc(d.id)+'">Message de relance</button><button class="btn small ghost" data-act="fu-done" data-id="'+esc(d.id)+'">'+ICON.check+'Relancé aujourd\'hui</button><button class="btn small ghost" data-act="doc-pdf" data-id="'+esc(d.id)+'">PDF</button></div>';
return h+'</div>';
}
function viewSuivis(){
const f=S.ui.suiviFilter||{};
const inv=docs().filter(d=>d.kind==='facture'&&!['annulee','brouillon'].includes(d.status));
const open=inv.filter(d=>docRemaining(d)>0);const late=open.filter(d=>(dueInfo(d)||{}).n<0);
const toFollow=open.filter(d=>d.followUp==='relancer'),urgent=open.filter(d=>d.followUp==='urgent');
const pend=inv.filter(d=>(d.payments||[]).some(p=>p.pending));
let h='<p class="muted" style="margin:0">Le suivi des paiements de tes clients : acomptes reçus, reste à payer, échéances et relances.</p>';
h+='<div class="stats" style="grid-template-columns:repeat(4,minmax(0,1fr))">'+
'<div class="stat"><span class="label">Reste à encaisser</span><strong style="font-size:20px">'+esc(sumBy(open,d=>docRemaining(d)))+'</strong><span class="muted">'+plural(open.length,'facture')+'</span></div>'+
'<div class="stat'+(late.length?' alert':'')+'"><span class="label">En retard</span><strong style="font-size:20px">'+esc(sumBy(late,d=>docRemaining(d)))+'</strong><span class="muted">'+plural(late.length,'facture')+'</span></div>'+
'<button class="stat" data-act="suivi-f" data-k="show" data-v="relancer"><span class="label">À relancer</span><strong>'+toFollow.length+'</strong><span class="muted">factures marquées</span></button>'+
'<button class="stat'+(urgent.length?' alert':'')+'" data-act="suivi-f" data-k="show" data-v="urgent"><span class="label">Urgent</span><strong>'+urgent.length+'</strong><span class="muted">à relancer en urgence</span></button></div>';
if(isAdmin()&&pend.length)h+='<section class="panel" style="border-color:#C98C00"><div class="panel-h"><h2>Paiements à valider</h2><span class="mono muted">'+pend.reduce((a,d)=>a+(d.payments||[]).filter(p=>p.pending).length,0)+'</span></div>'+
pend.map(d=>'<div style="margin-bottom:8px"><b>'+esc(d.number)+' · '+esc((d.clientSnap&&d.clientSnap.name)||(compOf(d.companyId)||{}).label||'Sans client')+'</b>'+paymentsList({...d,payments:(d.payments||[]).filter(p=>p.pending)})+'</div>').join('')+'</section>';
const opt=(v,l,sel)=>'<option value="'+esc(v)+'"'+(sel===v?' selected':'')+'>'+esc(l)+'</option>';
h+='<div class="filters"><select class="inp'+(f.client?' on':'')+'" id="sf-client" data-suivif="client" aria-label="Client">'+opt('','Tous les clients',f.client)+companies().map(c=>opt(c.id,c.label,f.client)).join('')+'</select>'+
'<select class="inp'+(f.show?' on':'')+'" id="sf-show" data-suivif="show" aria-label="Afficher">'+opt('','Factures à encaisser',f.show)+opt('late','En retard',f.show)+opt('relancer','À relancer',f.show)+opt('urgent','Urgent',f.show)+opt('all','Tout, y compris soldées',f.show)+'</select>'+
(f.client||f.show?'<button class="btn ghost small" data-act="suivi-f" data-k="reset">'+ICON.x+'Effacer</button>':'')+'</div>';
let list=f.show==='all'?inv:open;
if(f.show==='late')list=late;if(f.show==='relancer')list=toFollow;if(f.show==='urgent')list=urgent;
if(f.client)list=list.filter(d=>d.companyId===f.client);
const groups={};list.forEach(d=>{const k=d.companyId||'_';(groups[k]=groups[k]||[]).push(d);});
const keys=Object.keys(groups).sort((a,b)=>{const ra=groups[a].reduce((s,d)=>s+docRemaining(d),0),rb=groups[b].reduce((s,d)=>s+docRemaining(d),0);return rb-ra;});
if(!keys.length)return h+'<div class="empty"><b>Rien à suivre</b>'+(f.show||f.client?'Aucune facture ne correspond à ce filtre.':'Toutes les factures envoyées sont réglées.')+'</div>';
h+=keys.map(k=>{const c=compOf(k);const L=groups[k].sort((a,b)=>(a.dueDate||'9')<(b.dueDate||'9')?-1:1);
const byCur={};L.forEach(d=>{const cu=d.currency||'MGA';byCur[cu]=byCur[cu]||{t:0,p:0};byCur[cu].t+=docTotals(d).total;byCur[cu].p+=docPaid(d);});
return'<section class="panel suivi-client"><div class="panel-h"><h2><span class="dot" style="--c:'+(c?c.color:'#8A8FA3')+';width:11px;height:11px"></span> '+esc(c?c.label:'Sans client')+'</h2><span class="hint">'+plural(L.length,'facture')+'</span></div>'+
Object.keys(byCur).map(cu=>{const x=byCur[cu];return'<div class="creance"><div class="creance-txt"><span>Payé <b class="mono">'+esc(money(x.p,cu))+'</b></span><span>Créance <b class="mono" style="color:'+(x.t-x.p>0?'var(--late)':'var(--ok)')+'">'+esc(money(Math.max(0,x.t-x.p),cu))+'</b></span><span class="muted">sur '+esc(money(x.t,cu))+'</span></div>'+progressBar(x.p,x.t)+'</div>';}).join('')+
'<div class="suivi-list">'+L.map(suiviRow).join('')+'</div></section>';}).join('');
return h;
}
function updateDocLog(id,mut,summary){const before=S.docs[id];if(!before)return null;const x=clone(before);mut(x);x.updatedAt=Date.now();saveDocDirect(x);
logChange('doc','update',id,(x.kind==='devis'?'Devis ':'Facture ')+x.number,summary,before);if(docDraft&&docDraft.id===id){docDraft=clone(x);docOrig=clone(x);renderDoc();}return x;}
function settleIfPaid(x){if(x.kind==='facture'&&x.status!=='payee'&&docTotals(x).total>0&&docTotals(x).total-docPaid(x)<=0.005){x.status='payee';x.paidAt=today();x.pendingStatus=null;return true;}return false;}
function handleSuiviClick(a,el){
if(a==='goto-suivi'){closeDoc();S.ui.bizTab='suivi';saveUI();render();return true;}
if(!['pay-open','pay-cancel','pay-rest','pay-del','pay-approve','pay-reject','fu-set','fu-done','suivi-f','cur-del'].includes(a))return false;
const id=el.dataset.id;
if(a==='cur-del'){if(!isAdmin()){toast('Réservé à la vue admin.');return true;}if(docs().some(d=>d.currency===id)||prestations().some(p=>p.currency===id)){toast('Cette devise est utilisée par des documents ou prestations.');return true;}
updateSettings(s=>{s.currencies=(s.currencies||[]).filter(c=>c.code!==id);},'Devise '+id+' supprimée');return true;}
if(a==='suivi-f'){if(el.dataset.k==='reset')S.ui.suiviFilter={};else S.ui.suiviFilter=Object.assign({},S.ui.suiviFilter||{},{[el.dataset.k]:el.dataset.v});saveUI();render();return true;}
if((a==='pay-approve'||a==='pay-reject')&&!isAdmin()){toast('Réservé à la vue admin.');return true;}
if(!can('suivis')){toast(DENIED);return true;}
switch(a){
case'pay-open':payingId=id;render();{const v=$('#pay-val');if(v)v.focus();}return true;
case'pay-cancel':payingId=null;render();return true;
case'pay-rest':{const d=S.docs[id];if(!d)return true;$('#pay-mode').value='amount';$('#pay-val').value=String(Math.round(docRemaining(d)*100)/100);$('#pay-kind').value='solde';}return true;
case'pay-del':{const d=S.docs[id];const p=d&&(d.payments||[]).find(x=>x.id===el.dataset.pid);if(!p)return true;if(!isAdmin()&&!p.pending){toast('Seul l\'admin peut supprimer un paiement validé.');return true;}
updateDocLog(id,x=>{x.payments=(x.payments||[]).filter(q=>q.id!==p.id);if(x.status==='payee'&&docRemaining(Object.assign({},x,{status:'envoyee'}))>0&&isAdmin())x.status='envoyee';},'Paiement supprimé · '+money(payAmount(d,p),d.currency));toast('Paiement supprimé');}return true;
case'pay-approve':case'pay-reject':{const ok=a==='pay-approve';const d=S.docs[id];const p=d&&(d.payments||[]).find(x=>x.id===el.dataset.pid);if(!p)return true;let settled=false;
updateDocLog(id,x=>{if(ok){const q=x.payments.find(y=>y.id===p.id);q.pending=false;q.validatedAt=Date.now();settled=settleIfPaid(x);}else x.payments=x.payments.filter(y=>y.id!==p.id);},(ok?'Paiement validé · ':'Paiement refusé · ')+money(payAmount(d,p),d.currency));
toast(ok?(settled?'Paiement validé : facture soldée':'Paiement validé'):'Paiement refusé');}return true;
case'fu-set':{const v=el.dataset.v;updateDocLog(id,x=>{x.followUp=v;x.followBy=roleName(ROLE);x.followAt=Date.now();},v?'Marquée « '+FOLLOW[v][0]+' »':'Relance retirée');toast(v?'Marquée « '+FOLLOW[v][0]+' »':'Badge retiré');}return true;
case'fu-done':updateDocLog(id,x=>{x.reminders=(x.reminders||[]).concat([{at:Date.now(),by:roleName(ROLE)}]);x.followUp='';},'Client relancé');toast('Relance notée pour aujourd\'hui');return true;
}
return false;
}
function handleSuiviSubmit(k,f){
if(k==='cur'){if(!isAdmin())return true;const code=($('#cur-code').value||'').trim().toUpperCase().replace(/[^A-Z]/g,'');if(code.length<2){toast('Écris un code de devise (ex. XOF).');return true;}
if(CURRENCIES[code]){toast('Cette devise existe déjà.');return true;}
const c={code,label:$('#cur-label').value.trim()||code,sym:$('#cur-sym').value.trim()||code,dec:+$('#cur-dec').value||0,word:$('#cur-word').value.trim()||($('#cur-label').value.trim()||code).toLowerCase(),sub:+$('#cur-dec').value?'centime':''};
updateSettings(s=>{s.currencies=(s.currencies||[]).concat([c]);},'Devise ajoutée : '+code);toast('Devise '+code+' ajoutée');return true;}
if(k!=='pay')return false;
if(!can('suivis')){toast(DENIED);return true;}
const id=f.dataset.id;const d=S.docs[id];if(!d)return true;
const mode=$('#pay-mode').value,val=parseFloat($('#pay-val').value);if(!(val>0)){toast('Indique un montant ou un pourcentage.');return true;}
if(mode==='pct'&&val>100){toast('Le pourcentage ne peut pas dépasser 100.');return true;}
const p={id:'y'+uid(),kind:$('#pay-kind').value,date:$('#pay-date').value||today(),note:$('#pay-note').value.trim(),by:roleName(ROLE),at:Date.now(),pending:!isAdmin()};
if(mode==='pct')p.pct=val;else p.amount=val;
let settled=false;
updateDocLog(id,x=>{x.payments=(x.payments||[]).concat([p]);if(isAdmin())settled=settleIfPaid(x);},(p.kind==='acompte'?'Acompte':'Paiement')+' reçu · '+money(payAmount(d,p),d.currency)+(p.pct?' ('+p.pct+' %)':'')+(p.pending?' · à valider':''));
payingId=null;toast(p.pending?'Paiement enregistré : en attente de validation':(settled?'Paiement enregistré : facture soldée':'Paiement enregistré'));render();return true;
}
const MSTATUS={attente:['En attente de retour','#5B6CFF'],corriger:['À corriger','#C98C00'],valide:['Validé','#14A37F'],remplacee:['Remplacée','#8A8FA3'],dispo:['À récupérer','#5B6CFF'],recupere:['Récupéré','#14A37F']};
const medias=()=>Object.values(S.media||{});
function fmtTC(t){if(t==null||isNaN(t))return'';t=Math.max(0,Math.floor(t));const h=Math.floor(t/3600),m=Math.floor(t%3600/60),s=t%60;return(h?h+':'+pad(m):m)+':'+pad(s);}
function parseTC(v){v=String(v||'').trim();if(!v)return null;const p=v.split(':').map(x=>parseInt(x,10));if(p.some(isNaN))return null;return p.reduce((a,x)=>a*60+x,0);}
function videoEmbed(url){
if(S.mode==='cloud')return null;const u=normUrl(url);let h='';try{h=new URL(u).hostname.replace(/^www\./,'');}catch(e){return null;}
if(h.endsWith('dropbox.com')){const x=new URL(u);x.searchParams.delete('dl');x.searchParams.set('raw','1');return{type:'video',src:x.toString()};}
if(h==='dl.dropboxusercontent.com')return{type:'video',src:u};
let m=u.match(/drive\.google\.com\/file\/d\/([^/?#]+)/)||u.match(/drive\.google\.com\/open\?id=([^&#]+)/);if(m)return{type:'iframe',src:'https://drive.google.com/file/d/'+m[1]+'/preview'};
m=u.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);if(m)return{type:'iframe',src:'https://www.youtube.com/embed/'+m[1]};
m=u.match(/vimeo\.com\/(\d+)/);if(m)return{type:'iframe',src:'https://player.vimeo.com/video/'+m[1]};
if(/\.(mp4|mov|webm|m4v)(\?|$)/i.test(u))return{type:'video',src:u};
return null;
}
function idbOpen(){return new Promise((res,rej)=>{try{const r=indexedDB.open('studio-tefi-media',1);r.onupgradeneeded=()=>r.result.createObjectStore('m');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);}catch(e){rej(e);}});}
async function idbPut(k,v){const db=await idbOpen();return new Promise((res,rej)=>{const t=db.transaction('m','readwrite');t.objectStore('m').put(v,k);t.oncomplete=()=>res();t.onerror=()=>rej(t.error);});}
async function idbGet(k){const db=await idbOpen();return new Promise((res,rej)=>{const t=db.transaction('m','readonly');const q=t.objectStore('m').get(k);q.onsuccess=()=>res(q.result||'');q.onerror=()=>rej(q.error);});}
const blobToDataUrl=b=>new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.onerror=()=>rej(fr.error);fr.readAsDataURL(b);});
function compressImage(file,max){return new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>{const img=new Image();img.onload=()=>{let w=img.naturalWidth,h=img.naturalHeight;const r=Math.min(1,(max||2000)/Math.max(w,h));w=Math.round(w*r);h=Math.round(h*r);
const cv=document.createElement('canvas');cv.width=w;cv.height=h;const cx=cv.getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,w,h);cx.drawImage(img,0,0,w,h);cv.toBlob(b=>b?res({blob:b,w,h}):rej(new Error('compression')),'image/jpeg',0.85);};img.onerror=()=>rej(new Error('image illisible'));img.src=fr.result;};fr.onerror=()=>rej(fr.error);fr.readAsDataURL(file);});}
const MediaStore={cache:{},loading:{},
async put(id,blob){
if(S.mode==='cloud'){let as=null;try{as=await window.claude.use('assets');}catch(e){as=null;}if(as){const r=await as.upload(blob);return{store:'asset',ref:r.url,aid:r.id};}}
if(S.mode==='supa')return await Supa.upload(id,blob);
const dataUrl=await blobToDataUrl(blob);
if(S.mode==='local'&&Sync.cfg&&Sync.cfg.gistId){const name='photo-'+id+'.txt';Sync.pendingFiles[name]=dataUrl;this.cache['g:'+name]=dataUrl;Sync.schedulePush();return{store:'gist',ref:name};}
await idbPut(id,dataUrl);this.cache['i:'+id]=dataUrl;return{store:'idb',ref:id};
},
url(p){if(!p)return'';if(p.store==='asset')return p.ref;if(p.store==='supa')return S.mode==='supa'?Supa.photoUrl(p.ref):'';const key=(p.store==='gist'?'g:':'i:')+p.ref;if(this.cache[key])return this.cache[key];
if(!this.loading[key]){this.loading[key]=true;(async()=>{try{if(p.store==='gist'){const u=Sync.files[p.ref];if(!u){this.loading[key]=false;return;}this.cache[key]=await(await fetch(u,{cache:'force-cache'})).text();}else this.cache[key]=await idbGet(p.ref);if(this.cache[key])scheduleRender();}catch(e){this.loading[key]=false;}})();}
return'';}
};
function mediaThumb(m){
if(m.mtype==='photo'){const u=m.photo?MediaStore.url(m.photo):'';return u?'<img src="'+esc(u)+'" alt="" loading="lazy">':'<span class="pj-ic">'+(m.photo?'Chargement…':'Photo')+'</span>';}
const i=linkInfo(m.url||'');return'<span class="pj-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3z"/></svg>'+esc(i.ok?i.label:'Vidéo')+'</span>';
}
function mediaCard(m){
const c=S.contents[m.contentId];const st=MSTATUS[m.status]||MSTATUS.attente;const cm=m.comments||[];const done=cm.filter(x=>x.done).length;
return'<button class="pj-card" data-act="pj-open" data-id="'+esc(m.id)+'"><div class="pj-thumb">'+mediaThumb(m)+(m.kind==='version'?'<span class="pj-v">V'+(m.version||1)+'</span>':'')+'</div>'+
'<div class="pj-body"><b>'+esc(m.title||(c?titleOf(c):'Sans titre'))+'</b><span class="hint">'+(c?esc(titleOf(c)):'Sans projet')+' · '+esc(m.createdBy||'')+' · '+fmtStamp(m.createdAt||Date.now())+'</span>'+
'<div class="card-f"><span class="pill" style="--c:'+st[1]+'">'+st[0]+'</span>'+(cm.length?'<span class="pill plain">'+done+'/'+cm.length+' retours traités</span>':'')+'</div></div></button>';
}
function viewProjection(){
if(!can('projection'))return'<div class="wrap"><div class="empty"><b>Accès coupé</b>L\'admin a désactivé Projection pour cette vue.</div></div>';
const u=S.ui;const tab=u.pjTab||'attente';const f=u.pjProject||'';
let all=medias();if(f)all=all.filter(m=>m.contentId===f);
const lists={attente:all.filter(m=>m.kind==='version'&&m.status==='attente'),corriger:all.filter(m=>m.kind==='version'&&m.status==='corriger'),rush:all.filter(m=>m.kind==='rush'),valide:all.filter(m=>m.kind==='version'&&['valide','remplacee'].includes(m.status))};
const L=(lists[tab]||[]).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
let h='<div class="wrap"><div class="head"><div><span class="label">Projection</span><h1>Projection</h1><p class="muted">Les rushs à récupérer, les versions à valider et tes retours, projet par projet.</p></div>'+
'<div class="card-f"><button class="btn" data-act="pj-new" data-kind="rush">'+ICON.plus+'Partager des rushs</button><button class="btn primary" data-act="pj-new" data-kind="version">'+ICON.plus+'Proposer une version</button></div></div>';
h+='<div class="cal-bar"><div class="seg" role="group" aria-label="Section">'+[['attente','À valider'],['corriger','À corriger'],['rush','Rushs'],['valide','Validées']].map(t=>'<button data-act="pj-tab" data-tab="'+t[0]+'" aria-pressed="'+(tab===t[0])+'">'+t[1]+(lists[t[0]].length&&t[0]!=='valide'?' · '+lists[t[0]].length:'')+'</button>').join('')+'</div>'+
'<select class="inp'+(f?' on':'')+'" id="pj-project" data-pjf="1" aria-label="Projet" style="width:auto;max-width:100%"><option value="">Tous les projets</option>'+contents().filter(c=>c.status!=='idee').map(c=>'<option value="'+esc(c.id)+'"'+(c.id===f?' selected':'')+'>'+esc(titleOf(c))+'</option>').join('')+'</select></div>';
const empty={attente:'Aucune version en attente de retour.',corriger:'Rien à corriger pour l\'instant.',rush:'Aucun rush partagé. Colle un lien Google Drive, Dropbox ou WeTransfer.',valide:'Aucune version validée.'};
h+=L.length?'<div class="pj-grid">'+L.map(mediaCard).join('')+'</div>':'<div class="empty"><b>Rien ici</b>'+esc(empty[tab])+'</div>';
if(S.mode==='cloud')h+='<p class="hint" style="margin:0">Sur ce lien, les vidéos s\'ouvrent dans un nouvel onglet : la lecture intégrée et les retours minutés automatiques fonctionnent sur ton site GitHub. Ici, tu tapes le minutage toi-même.</p>';
return h+'</div>';
}
let pjId=null,pjForm=null,pjPin=null;
function openPj(id){pjId=id;pjForm=null;pjPin=null;renderPj();$('#projm').hidden=false;document.body.classList.add('locked');}
function openPjForm(kind,preset){preset=preset||{};pjId=null;pjPin=null;
const parent=preset.parentId?S.media[preset.parentId]:null;
pjForm={kind,mtype:'video',title:parent?parent.title:'',contentId:preset.contentId||(parent&&parent.contentId)||S.ui.pjProject||'',url:'',notes:'',parentId:parent?(parent.parentId||parent.id):'',files:[]};
renderPj();$('#projm').hidden=false;document.body.classList.add('locked');}
function closePj(){const v=$('#pj-video');if(v)try{v.pause();}catch(e){}pjId=null;pjForm=null;pjPin=null;$('#projm').hidden=true;if(!draft&&!peekId)document.body.classList.remove('locked');}
function renderPj(){
const panel=$('#pj-panel');
if(pjForm){const f=pjForm;const isR=f.kind==='rush';
let h='<div class="peek-h"><div style="flex:1"><span class="label">'+(isR?'Partager des rushs':(f.parentId?'Nouvelle version':'Proposer une version'))+'</span><h2>'+(isR?'Rushs à télécharger':'Version à valider')+'</h2></div><button class="icon-btn" data-act="pj-close" aria-label="Fermer">'+ICON.x+'</button></div><div class="peek-b">';
h+='<div class="seg" role="group" aria-label="Type">'+[['video','Vidéo (lien)'],['photo','Photos']].map(t=>'<button type="button" data-act="pj-mtype" data-v="'+t[0]+'" aria-pressed="'+(f.mtype===t[0])+'">'+t[1]+'</button>').join('')+'</div>';
h+='<label class="field"><span>Projet</span><select class="inp" id="pjf-content" data-pjform="contentId"><option value="">Aucun projet</option>'+contents().filter(c=>c.status!=='idee').map(c=>'<option value="'+esc(c.id)+'"'+(c.id===f.contentId?' selected':'')+'>'+esc(titleOf(c))+'</option>').join('')+'</select></label>';
h+='<label class="field"><span>Titre</span><input class="inp" id="pjf-title" data-pjform="title" value="'+esc(f.title)+'" placeholder="'+(isR?'Ex. : Rushs jour 1 · Analakely':'Ex. : Montage skit taxi-be')+'"></label>';
if(f.mtype==='video')h+='<label class="field"><span>Lien de la vidéo</span><input class="inp" id="pjf-url" data-pjform="url" value="'+esc(f.url)+'" placeholder="Lien Dropbox, Google Drive, WeTransfer, YouTube non répertorié…" inputmode="url" autocapitalize="off"></label>'+
'<p class="hint" style="margin:0">Dropbox : lecture intégrée avec retours minutés automatiques. Google Drive et YouTube : lecture intégrée, minutage à taper. WeTransfer : téléchargement seulement (lien valable 7 jours).</p>';
else h+='<div class="field"><span>Photos (compressées automatiquement)</span><label class="btn" style="align-self:flex-start;cursor:pointer">'+ICON.plus+'Choisir des photos<input type="file" accept="image/*" multiple id="pjf-files" hidden></label><span class="hint" id="pjf-count">'+(f.files.length?plural(f.files.length,'photo')+' prête'+(f.files.length>1?'s':''):'Aucune photo choisie')+'</span>'+
'<span class="hint">Ou colle plutôt un lien :</span><input class="inp" id="pjf-url" data-pjform="url" value="'+esc(f.url)+'" placeholder="Lien Google Drive, Dropbox…" inputmode="url" autocapitalize="off"></div>';
h+='<label class="field"><span>Notes</span><textarea class="inp" id="pjf-notes" data-pjform="notes" rows="2" placeholder="'+(isR?'Ce qu\'il y a dedans, ce qu\'il faut garder…':'Ce que tu as changé dans cette version…')+'">'+esc(f.notes)+'</textarea></label>';
h+='</div><div class="peek-f"><button class="btn primary" data-act="pj-save">'+ICON.check+(isR?'Partager':'Envoyer pour validation')+'</button><button class="btn" data-act="pj-close">Annuler</button></div>';
panel.innerHTML=h;return;}
const m=S.media[pjId];if(!m){closePj();return;}
const c=S.contents[m.contentId];const st=MSTATUS[m.status]||MSTATUS.attente;const cm=(m.comments||[]).slice().sort((a,b)=>(a.t==null?1e9:a.t)-(b.t==null?1e9:b.t));
const vScroll=panel.querySelector('.pj-side');const sc=vScroll?vScroll.scrollTop:0;const keepVideo=$('#pj-video');const vt=keepVideo?keepVideo.currentTime:0;const playing=keepVideo&&!keepVideo.paused;
let h='<div class="peek-h"><div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:6px"><div class="card-f"><span class="pill" style="--c:'+st[1]+'">'+st[0]+'</span>'+(m.kind==='version'?'<span class="pill plain">Version '+(m.version||1)+'</span>':'<span class="pill plain">Rushs</span>')+(c?'<button class="pill plain" data-act="peek" data-id="'+esc(c.id)+'" style="border:0;cursor:pointer">'+esc(titleOf(c))+'</button>':'')+'</div><h2>'+esc(m.title||'Sans titre')+'</h2><span class="hint">Par '+esc(m.createdBy||'')+' · '+fmtStamp(m.createdAt||Date.now())+'</span></div><button class="icon-btn" data-act="pj-close" aria-label="Fermer">'+ICON.x+'</button></div>';
h+='<div class="pj-view"><div class="pj-stage">';
if(m.mtype==='photo'&&m.photo){const u=MediaStore.url(m.photo);h+='<div class="pj-photo" id="pj-photo">'+(u?'<img src="'+esc(u)+'" alt="'+esc(m.title||'')+'" draggable="false">':'<div class="pj-ph">Chargement de la photo…</div>')+
cm.filter(x=>x.x!=null).map((x,i)=>'<span class="pin'+(x.done?' done':'')+'" style="left:'+x.x+'%;top:'+x.y+'%">'+(cm.indexOf(x)+1)+'</span>').join('')+(pjPin?'<span class="pin new" style="left:'+pjPin.x+'%;top:'+pjPin.y+'%">+</span>':'')+'</div><p class="hint" style="margin:6px 0 0">Touche la photo pour placer un repère, puis écris ton retour.</p>';}
else{const em=m.url?videoEmbed(m.url):null;
if(em&&em.type==='video')h+='<video id="pj-video" src="'+esc(em.src)+'" controls playsinline preload="metadata"></video>';
else if(em&&em.type==='iframe')h+='<div class="pj-frame"><iframe src="'+esc(em.src)+'" allow="autoplay; fullscreen" allowfullscreen title="Lecteur"></iframe></div>';
else h+='<div class="pj-ph">'+(m.url?'Lecture intégrée impossible pour ce lien.':'Aucun lien.')+'</div>';}
if(m.url)h+='<div class="card-f" style="margin-top:8px"><a class="btn small" href="'+esc(normUrl(m.url))+'" target="_blank" rel="noopener">'+ICON.arrow+(m.kind==='rush'?'Télécharger les rushs':'Ouvrir / télécharger')+'</a><span class="hint">'+esc(linkInfo(m.url).label)+'</span></div>';
if(m.notes)h+='<p style="margin:8px 0 0;white-space:pre-wrap">'+esc(m.notes)+'</p>';
h+='</div><div class="pj-side">';
if(m.kind==='rush'){
h+='<div class="review" style="background:var(--surface-2)"><b>Rushs</b>'+(m.status==='recupere'?'Récupérés'+(m.gotBy?' par '+esc(m.gotBy):''):'À télécharger pour le montage.')+'</div>'+
'<button class="btn" data-act="pj-got" data-id="'+esc(m.id)+'">'+ICON.check+(m.status==='recupere'?'Marquer à récupérer':'J\'ai récupéré les rushs')+'</button>';
}else{
const isVideo=m.mtype!=='photo';const auto=!!$('#pj-video')||(isVideo&&videoEmbed(m.url||'')&&videoEmbed(m.url).type==='video');
h+='<form class="pj-compose" data-form="pjc" data-id="'+esc(m.id)+'"><span class="label">Ajouter un retour</span>'+
(isVideo?(auto?'<span class="hint" id="pj-tc-auto">Minutage pris automatiquement à la position de la vidéo</span>':'<input class="inp mono" id="pj-tc" placeholder="Minutage, ex. 0:42" style="max-width:160px" aria-label="Minutage">'):'<span class="hint">'+(pjPin?'Repère placé sur la photo':'Optionnel : touche la photo pour placer un repère')+'</span>')+
'<textarea class="inp" id="pj-text" rows="2" placeholder="Ex. : coupe plus tôt, monte la musique, recadre…"></textarea><button class="btn small primary" type="submit" style="align-self:flex-start">'+ICON.plus+'Ajouter le retour</button></form>';
h+='<div class="pj-comments"><div class="panel-h" style="margin:0"><h3>Retours</h3><span class="mono muted">'+cm.filter(x=>x.done).length+'/'+cm.length+' traités</span></div>'+
(cm.length?cm.map((x,i)=>'<div class="pj-c'+(x.done?' done':'')+'"><label class="pj-chk"><input type="checkbox" data-pjdone="'+esc(x.id)+'"'+(x.done?' checked':'')+' aria-label="Retour traité"></label><div style="flex:1;min-width:0">'+
(x.t!=null?'<button class="tc" data-act="pj-seek" data-t="'+x.t+'">'+fmtTC(x.t)+'</button> ':'')+(x.x!=null?'<span class="tc">Repère '+(cm.indexOf(x)+1)+'</span> ':'')+'<span class="pj-ct">'+esc(x.text)+'</span><div class="hint">'+esc(x.by||'')+' · '+fmtStamp(x.at)+'</div></div>'+
((isAdmin()||x.by===roleName(ROLE))?'<button class="icon-btn sm" data-act="pj-cdel" data-cid="'+esc(x.id)+'" data-confirm="✓" aria-label="Supprimer ce retour">'+ICON.x+'</button>':'')+'</div>').join(''):'<p class="hint" style="margin:0">Aucun retour pour l\'instant.</p>')+'</div>';
}
h+='</div></div><div class="peek-f">';
if(m.kind==='version'){
if(isAdmin()&&m.status!=='valide')h+='<button class="btn primary" data-act="pj-validate" data-id="'+esc(m.id)+'">'+ICON.check+'Valider</button>';
if(isAdmin()&&m.status==='attente')h+='<button class="btn" data-act="pj-fix" data-id="'+esc(m.id)+'">Demander des corrections</button>';
if(['corriger','attente'].includes(m.status))h+='<button class="btn" data-act="pj-newver" data-id="'+esc(m.id)+'">'+ICON.plus+'Nouvelle version</button>';
h+='<button class="btn" data-act="pj-report" data-id="'+esc(m.id)+'">Rapport PDF</button><button class="btn ghost" data-act="pj-copy" data-id="'+esc(m.id)+'">'+ICON.copy+'Copier le rapport</button>';
}
if(isAdmin()||m.byRole===ROLE)h+='<button class="btn danger" data-act="pj-del" data-id="'+esc(m.id)+'" data-confirm="Supprimer ?">'+ICON.trash+'</button>';
h+='</div>';
morph(panel,h);const ns=panel.querySelector('.pj-side');if(ns)ns.scrollTop=sc;
const nv=$('#pj-video');if(nv&&vt){nv.addEventListener('loadedmetadata',()=>{nv.currentTime=vt;if(playing)nv.play().catch(()=>{});},{once:true});}
}
function pjReportText(m){const c=S.contents[m.contentId];const cm=(m.comments||[]).slice().sort((a,b)=>(a.t==null?1e9:a.t)-(b.t==null?1e9:b.t));
return'Rapport de corrections — '+(c&&titleOf(c)!==m.title?titleOf(c)+' — ':'')+(m.title||'')+' — V'+(m.version||1)+'\n'+fmtDay(today())+'\n\n'+(cm.length?cm.map((x,i)=>(i+1)+'. '+(x.done?'[fait] ':'[à faire] ')+(x.t!=null?'['+fmtTC(x.t)+'] ':'')+(x.x!=null?'[repère '+(cm.indexOf(x)+1)+'] ':'')+x.text).join('\n'):'Aucun retour.')+(m.url?'\n\nLien : '+normUrl(m.url):'');}
async function pjReportPdf(m){
const c=S.contents[m.contentId];const pdf=new MiniPDF();const M=16,R=194,grey='#6b6a78';let y=22;
pdf.text('RAPPORT DE CORRECTIONS',M,y,{font:'F2',size:16,color:'#4636D9'});y+=8;
pdf.text((c&&titleOf(c)!==m.title?titleOf(c)+' · ':'')+(m.title||'')+' · Version '+(m.version||1),M,y,{font:'F2',size:11});y+=6;
pdf.text('Édité le '+fmtFr(today())+' · statut : '+(MSTATUS[m.status]||MSTATUS.attente)[0],M,y,{size:9,color:grey});y+=5;
if(m.url){pdf.wrap('Lien : '+normUrl(m.url),R-M,'F1',8.5).forEach(l=>{pdf.text(l,M,y,{size:8.5,color:grey});y+=4;});}
y+=4;pdf.line(M,y,R,y,'#e2e2ea',0.3);y+=7;
const cm=(m.comments||[]).slice().sort((a,b)=>(a.t==null?1e9:a.t)-(b.t==null?1e9:b.t));
if(!cm.length){pdf.text('Aucun retour.',M,y,{size:10});}
cm.forEach((x,i)=>{const lines=pdf.wrap(x.text,R-M-30,'F1',10);const hgt=lines.length*4.8+6;if(y+hgt>280){pdf.newPage();y=20;}
pdf.rect(M,y-3.6,4.2,4.2,x.done?'#14A37F':null,'#9a98aa');if(x.done)pdf.text('v',M+0.9,y-0.1,{font:'F2',size:8,color:'#ffffff'});
pdf.text(x.t!=null?fmtTC(x.t):(x.x!=null?'Repère '+(cm.indexOf(x)+1):'#'+(i+1)),M+7,y,{font:'F2',size:10,color:x.done?grey:'#1d1c25'});
lines.forEach((l,k)=>{pdf.text(l,M+30,y+k*4.8,{size:10,color:x.done?grey:'#1d1c25'});});
y+=lines.length*4.8;pdf.text((x.done?'Traité · ':'À faire · ')+(x.by||'')+' · '+fmtStamp(x.at),M+30,y,{size:8,color:grey});y+=7;});
const n=pdf.pages.length;pdf.pages.forEach((pg,i)=>{pdf.cur=pg;pdf.text('Studio Tefi · Projection',M,290,{size:7.5,color:grey});pdf.text('Page '+(i+1)+'/'+n,R,290,{size:7.5,color:grey,align:'right'});});
await saveBlob(pdf.output(),'Corrections-'+String((c?titleOf(c):m.title)||'video').replace(/[^\w.-]+/g,'_').slice(0,40)+'-V'+(m.version||1)+'.pdf');
}
async function saveBlob(blob,filename){
let dl=null;if(window.claude&&typeof window.claude.use==='function'){try{dl=await window.claude.use('downloads');}catch(e){dl=null;}}
if(dl){try{await dl.save({filename,data:blob});toast('Fichier exporté : '+filename);}catch(e){if(!e||e.code!=='declined')toast('Export impossible ('+((e&&e.code)||'erreur')+').');}return;}
const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast('Fichier exporté : '+filename);
}
function updateMedia(id,mut,summary){const before=S.media[id];if(!before)return;const x=clone(before);mut(x);Store.save('media',x);if(summary)logChange('media','update',id,x.title||'Média',summary,before);}
async function savePjForm(){
const f=pjForm;const isR=f.kind==='rush';
if(f.mtype==='video'&&!f.url.trim()){toast('Colle le lien de la vidéo.');return;}
if(f.mtype==='photo'&&!f.files.length&&!f.url.trim()){toast('Choisis des photos ou colle un lien.');return;}
const base={kind:f.kind,mtype:f.mtype,contentId:f.contentId,notes:f.notes.trim(),comments:[],createdBy:roleName(ROLE),byRole:ROLE,createdAt:Date.now(),status:isR?'dispo':'attente'};
let version=1,parentId='';
if(!isR){parentId=f.parentId||'';if(parentId){const fam=medias().filter(x=>x.id===parentId||x.parentId===parentId);version=Math.max(0,...fam.map(x=>x.version||1))+1;fam.forEach(x=>{if(['attente','corriger'].includes(x.status))updateMedia(x.id,y=>{y.status='remplacee';});});}}
const title=f.title.trim()||(S.contents[f.contentId]?titleOf(S.contents[f.contentId]):(isR?'Rushs':'Version'));
const items=[];
if(f.mtype==='photo'&&f.files.length){toast('Compression des photos…');
for(let i=0;i<f.files.length;i++){const id='m'+uid();try{const r=await compressImage(f.files[i],2000);const ref=await MediaStore.put(id,r.blob);ref.w=r.w;ref.h=r.h;
items.push(Object.assign({},base,{id,title:f.files.length>1?title+' ('+(i+1)+')':title,photo:ref,url:f.url.trim(),version,parentId:parentId||''}));}catch(e){toast('Une photo n\'a pas pu être lue.');}}}
else items.push(Object.assign({},base,{id:'m'+uid(),title,url:normUrl(f.url),version,parentId:parentId||''}));
items.forEach(x=>{if(!x.parentId)x.parentId='';Store.save('media',x);logChange('media','create',x.id,x.title,isR?'Rushs partagés':'Version '+x.version+' envoyée pour validation',null);});
const c=S.contents[f.contentId];if(c&&!isR&&['ecriture','production','tournage'].includes(c.status)&&can('projStatus'))updateContent(c.id,x=>{x.status='montage';},'Statut → Montage (version envoyée)');
closePj();toast(isR?'Rushs partagés':'Version envoyée pour validation');S.ui.pjTab=isR?'rush':'attente';if(S.ui.view==='projection')render();
}
function handlePjClick(a,el,e){
if(!a.startsWith('pj-'))return false;
if(!can('projection')){toast(DENIED);return true;}
const id=el.dataset.id;
switch(a){
case'pj-tab':S.ui.pjTab=el.dataset.tab;saveUI();render();return true;
case'pj-new':openPjForm(el.dataset.kind,{contentId:el.dataset.content});return true;
case'pj-open':e.stopPropagation();openPj(id);return true;
case'pj-close':closePj();return true;
case'pj-mtype':pjForm.mtype=el.dataset.v;renderPj();return true;
case'pj-save':savePjForm();return true;
case'pj-seek':{const v=$('#pj-video');if(v){v.currentTime=+el.dataset.t;v.play().catch(()=>{});}else toast('Va à '+fmtTC(+el.dataset.t)+' dans le lecteur.');}return true;
case'pj-got':updateMedia(id,x=>{x.status=x.status==='recupere'?'dispo':'recupere';x.gotBy=roleName(ROLE);},'Rushs '+(S.media[id].status==='recupere'?'à récupérer':'récupérés'));renderPj();return true;
case'pj-validate':{if(!isAdmin()){toast('Réservé à la vue admin.');return true;}const m=S.media[id];updateMedia(id,x=>{x.status='valide';x.validatedAt=Date.now();},'Version '+(m.version||1)+' validée');
const c=S.contents[m.contentId];if(c)updateContent(c.id,x=>{if(!['pret','publie'].includes(x.status))x.status='pret';x.finalMediaId=id;if(m.url)x.finalLink=m.url;},'Version validée : prêt à publier');
toast(c?'Validé : « '+titleOf(c)+' » est prêt à publier':'Version validée');renderPj();return true;}
case'pj-fix':if(!isAdmin()){toast('Réservé à la vue admin.');return true;}updateMedia(id,x=>{x.status='corriger';},'Corrections demandées');toast('Envoyé en corrections à '+roleName('assistant'));renderPj();return true;
case'pj-newver':openPjForm('version',{parentId:id});return true;
case'pj-report':pjReportPdf(S.media[id]);return true;
case'pj-copy':copyText(pjReportText(S.media[id]),'Rapport copié');return true;
case'pj-del':{const m=S.media[id];if(!m)return true;if(!isAdmin()&&m.byRole!==ROLE){toast('Tu peux supprimer seulement ce que tu as déposé.');return true;}
Store.del('media',id);logChange('media','delete',id,m.title||'Média','Supprimé',m);if(m.photo&&m.photo.store==='gist'){Sync.pendingFiles[m.photo.ref]=null;Sync.schedulePush();}closePj();toast('Supprimé');}return true;
case'pj-cdel':updateMedia(pjId,x=>{x.comments=(x.comments||[]).filter(c=>c.id!==el.dataset.cid);});renderPj();return true;
}
return false;
}
$('#pj-panel').addEventListener('input',e=>{const el=e.target;if(pjForm&&el.dataset.pjform)pjForm[el.dataset.pjform]=el.value;});
$('#pj-panel').addEventListener('change',e=>{const el=e.target;
if(el.id==='pjf-files'&&pjForm){pjForm.files=Array.from(el.files||[]).filter(f=>/^image\//.test(f.type));const big=pjForm.files.filter(f=>f.size>30*1048576);if(big.length){toast('Photo trop lourde (plus de 30 Mo) : elle sera ignorée.');pjForm.files=pjForm.files.filter(f=>f.size<=30*1048576);}const c=$('#pjf-count');if(c)c.textContent=pjForm.files.length?plural(pjForm.files.length,'photo')+' prête'+(pjForm.files.length>1?'s':''):'Aucune photo choisie';}
else if(pjForm&&el.dataset.pjform)pjForm[el.dataset.pjform]=el.value;
else if(el.dataset.pjdone&&pjId){const cid=el.dataset.pjdone;updateMedia(pjId,x=>{const c=(x.comments||[]).find(k=>k.id===cid);if(c){c.done=el.checked;c.doneBy=roleName(ROLE);}});renderPj();}});
$('#pj-panel').addEventListener('click',e=>{const ph=e.target.closest('#pj-photo');if(!ph||!pjId||e.target.closest('button'))return;const img=ph.querySelector('img');if(!img)return;const r=img.getBoundingClientRect();
pjPin={x:Math.round((e.clientX-r.left)/r.width*1000)/10,y:Math.round((e.clientY-r.top)/r.height*1000)/10};renderPj();const t=$('#pj-text');if(t)t.focus();});
$('#projm').addEventListener('click',e=>{if(e.target.id==='projm')closePj();});
function handlePjSubmit(k,f){
if(k!=='pjc')return false;if(!can('projection'))return true;
const id=f.dataset.id;const txt=($('#pj-text').value||'').trim();if(!txt){toast('Écris ton retour.');return true;}
let t=null;const v=$('#pj-video');if(v)t=Math.floor(v.currentTime||0);else{const tc=$('#pj-tc');if(tc&&tc.value.trim()){t=parseTC(tc.value);if(t==null){toast('Minutage invalide : écris par exemple 0:42');return true;}}}
const c={id:'c'+uid(),text:txt,t,by:roleName(ROLE),at:Date.now(),done:false};if(pjPin){c.x=pjPin.x;c.y=pjPin.y;}
updateMedia(id,x=>{x.comments=(x.comments||[]).concat([c]);});pjPin=null;renderPj();const ta=$('#pj-text');if(ta)ta.focus();toast('Retour ajouté'+(t!=null?' à '+fmtTC(t):''));return true;
}
function mediaForContent(id){return medias().filter(m=>m.contentId===id).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));}
const DEFAULT_CHECK=['Script validé','Lieu réservé','Acteurs confirmés','Matériel prêt','Musique trouvée','Miniature faite','Légende et hashtags écrits'];
function checkBar(list){const n=list.length,d=list.filter(x=>x.done).length;return n?'<div class="ck-bar"><div class="pbar ok"><i style="width:'+Math.round(d/n*100)+'%"></i></div><span class="mono muted">'+d+'/'+n+'</span></div>':'';}
const templates=()=>settings().templates||[];
function linkedDocs(cid){return docs().filter(d=>d.contentId===cid).sort((a,b)=>(b.date||'')>(a.date||'')?1:-1);}
function sameCur(list){const cs=new Set(list.map(x=>x.currency||'MGA'));return cs.size<=1;}
function editorTop(c){
if(S.contents[c.id]||!templates().length)return'';
return'<label class="field"><span>Partir d\'un modèle</span><select class="inp" id="ed-tpl" data-tplapply="1"><option value="">Aucun modèle</option>'+templates().map(t=>'<option value="'+esc(t.id)+'">'+esc(t.name)+'</option>').join('')+'</select></label>';
}
function editorExtras(c){
let h='';
h+='<div class="ed-sec"><div class="ed-sec-h"><h2>Checklist</h2>'+(c.checklist.length?'':'<button class="btn small" data-act="ed-ck-tpl">Checklist type</button>')+'</div>'+checkBar(c.checklist)+
'<div class="ck-list">'+c.checklist.map(x=>'<div class="ck'+(x.done?' done':'')+'"><input type="checkbox" class="ck-box" data-ckdone="'+esc(x.id)+'"'+(x.done?' checked':'')+' aria-label="Fait"><input class="inp ck-txt" id="ck-'+esc(x.id)+'" data-ck="'+esc(x.id)+'" value="'+esc(x.text)+'" aria-label="Tâche"><button class="icon-btn sm" data-act="ed-ck-del" data-cid="'+esc(x.id)+'" aria-label="Retirer">'+ICON.x+'</button></div>').join('')+'</div>'+
'<div class="link-line"><input class="inp" id="ed-ck-new" placeholder="Ajouter une tâche (Entrée pour valider)" autocomplete="off"><button class="btn small" data-act="ed-ck-add">'+ICON.plus+'Ajouter</button></div></div>';
if(can('budget')){
const cur=(c.budget&&c.budget.currency)||'MGA';const spent=c.expenses.reduce((a,x)=>a+(+x.amount||0),0);const bud=+((c.budget&&c.budget.amount)||0);
h+='<div class="ed-sec"><div class="ed-sec-h"><h2>Budget &amp; dépenses</h2></div><div class="f-grid"><label class="field"><span>Budget prévu</span><input class="inp mono" type="number" min="0" step="any" id="ed-bud" data-bud="amount" value="'+esc(bud||'')+'" placeholder="0"></label>'+
'<label class="field"><span>Devise</span><select class="inp" id="ed-budcur" data-bud="currency">'+Object.keys(CURRENCIES).map(k=>'<option value="'+k+'"'+(k===cur?' selected':'')+'>'+k+'</option>').join('')+'</select></label></div>'+
(bud?checkBarMoney(spent,bud,cur):'')+
'<div class="ck-list">'+c.expenses.map(x=>'<div class="ck"><input class="inp ck-txt" id="ex-l-'+esc(x.id)+'" data-ex="label" data-xid="'+esc(x.id)+'" value="'+esc(x.label)+'" placeholder="Dépense (location, cachet, transport…)"><input class="inp mono" style="max-width:140px" type="number" min="0" step="any" id="ex-a-'+esc(x.id)+'" data-ex="amount" data-xid="'+esc(x.id)+'" value="'+esc(x.amount)+'" aria-label="Montant"><button class="icon-btn sm" data-act="ed-ex-del" data-xid="'+esc(x.id)+'" aria-label="Retirer">'+ICON.x+'</button></div>').join('')+'</div>'+
'<div class="card-f"><button class="btn small" data-act="ed-ex-add">'+ICON.plus+'Ajouter une dépense</button><span class="mono muted">Total dépensé : '+esc(money(spent,cur))+'</span></div>';
if(isAdmin()&&S.contents[c.id]){const ld=linkedDocs(c.id).filter(d=>d.kind==='facture'&&d.status!=='annulee');
if(ld.length){const inv=ld.reduce((a,d)=>a+docTotals(d).total,0),paid=ld.reduce((a,d)=>a+docPaid(d),0);const dc=ld[0].currency||'MGA';
h+=sameCur(ld)&&dc===cur?'<div class="profit"><span>Facturé <b class="mono">'+esc(money(inv,cur))+'</b></span><span>Encaissé <b class="mono">'+esc(money(paid,cur))+'</b></span><span>Bénéfice <b class="mono" style="color:'+(inv-spent>=0?'var(--ok)':'var(--late)')+'">'+esc(money(inv-spent,cur))+'</b></span></div>'
:'<p class="hint" style="margin:0">Factures liées dans une autre devise : bénéfice non calculé.</p>';}}
h+='</div>';
}
if(S.contents[c.id]){
const md=mediaForContent(c.id);const ld=linkedDocs(c.id).filter(d=>can(d.kind==='devis'?'devis':'factures'));
if(md.length||ld.length||can('projection')){
h+='<div class="ed-sec"><div class="ed-sec-h"><h2>Liés à ce projet</h2>'+(can('projection')?'<button class="btn small" data-act="pj-new" data-kind="version" data-content="'+esc(c.id)+'">'+ICON.plus+'Version</button>':'')+'</div>'+
(md.length?'<div class="rows">'+md.slice(0,8).map(m=>{const st=MSTATUS[m.status]||MSTATUS.attente;return'<div class="row"><button class="row-main" data-act="pj-open" data-id="'+esc(m.id)+'"><b>'+(m.kind==='rush'?'Rushs · ':'V'+(m.version||1)+' · ')+esc(m.title||'')+'</b><span class="row-meta"><span class="pill" style="--c:'+st[1]+'">'+st[0]+'</span>'+((m.comments||[]).length?'<span>'+(m.comments||[]).filter(x=>x.done).length+'/'+(m.comments||[]).length+' retours</span>':'')+'</span></button></div>';}).join('')+'</div>':'')+
(ld.length?'<div class="rows">'+ld.map(d=>{const st=docState(d);return'<div class="row"><button class="row-main" data-act="doc-open" data-id="'+esc(d.id)+'"><b>'+(d.kind==='devis'?'Devis ':'Facture ')+esc(d.number)+'</b><span class="row-meta"><span class="pill" style="--c:'+st[2]+'">'+st[1]+'</span><span class="mono">'+esc(money(docTotals(d).total,d.currency))+'</span>'+(d.kind==='facture'?followPills(d):'')+'</span></button></div>';}).join('')+'</div>':'')+
(!md.length&&!ld.length?'<p class="hint" style="margin:0">Aucune version, aucun rush ni document lié pour l\'instant.</p>':'')+'</div>';
}
}
h+='<div class="ed-sec"><div class="ed-sec-h"><h2>Discussion</h2><span class="mono muted">'+c.comments.length+'</span></div>'+discussionHtml(c,'ed')+'</div>';
return h;
}
function checkBarMoney(spent,bud,cur){const pct=bud>0?Math.min(100,Math.round(spent/bud*100)):0;return'<div class="ck-bar"><div class="pbar'+(spent>bud?' over':' ok')+'"><i style="width:'+pct+'%"></i></div><span class="mono muted">'+esc(money(spent,cur))+' / '+esc(money(bud,cur))+'</span></div>';}
function discussionHtml(c,ctx){
return'<div class="disc">'+(c.comments.length?c.comments.slice(-30).map(x=>'<div class="msg'+(x.by===roleName(ROLE)?' me':'')+'"><div class="hint">'+esc(x.by||'')+' · '+fmtStamp(x.at)+'</div><div class="msg-t">'+esc(x.text)+'</div></div>').join(''):'<p class="hint" style="margin:0">Pas encore de message. Écris ici plutôt que sur WhatsApp : tout reste attaché au projet.</p>')+'</div>'+
'<form class="link-line" data-form="'+ctx+'-msg" data-id="'+esc(c.id)+'"><input class="inp" id="'+ctx+'-msg" placeholder="Écrire un message…" autocomplete="off"><button class="btn small primary" type="submit">Envoyer</button></form>';
}
function peekExtras(c){
let h='';
if(c.checklist.length)h+='<div class="ed-sec"><div class="ed-sec-h"><h3>Checklist</h3></div>'+checkBar(c.checklist)+'<div class="ck-list">'+c.checklist.map(x=>'<label class="ck'+(x.done?' done':'')+'"><input type="checkbox" class="ck-box" data-pkck="'+esc(x.id)+'"'+(x.done?' checked':'')+(can('projEdit')?'':' disabled')+'><span>'+esc(x.text)+'</span></label>').join('')+'</div></div>';
const md=mediaForContent(c.id);if(md.length)h+='<div class="ed-sec"><div class="ed-sec-h"><h3>Projection</h3></div><div class="card-f">'+md.slice(0,6).map(m=>{const st=MSTATUS[m.status]||MSTATUS.attente;return'<button class="pill" style="--c:'+st[1]+';border:0;cursor:pointer" data-act="pj-open" data-id="'+esc(m.id)+'">'+(m.kind==='rush'?'Rushs':'V'+(m.version||1))+' · '+st[0]+'</button>';}).join('')+'</div></div>';
if(c.finalLink)h+='<a class="link-chip" href="'+esc(normUrl(c.finalLink))+'" target="_blank" rel="noopener" style="align-self:flex-start">↗ Version finale validée</a>';
const ld=linkedDocs(c.id).filter(d=>can(d.kind==='devis'?'devis':'factures'));if(ld.length)h+='<div class="ed-sec"><div class="ed-sec-h"><h3>Devis et factures</h3></div><div class="card-f">'+ld.map(d=>{const st=docState(d);return'<button class="pill" style="--c:'+st[2]+';border:0;cursor:pointer" data-act="doc-open" data-id="'+esc(d.id)+'">'+esc(d.number)+' · '+st[1]+(d.kind==='facture'&&paidPct(d)>0&&paidPct(d)<100?' · '+paidPct(d)+' %':'')+'</button>';}).join('')+'</div></div>';
h+='<div class="ed-sec"><div class="ed-sec-h"><h3>Discussion</h3><span class="mono muted">'+c.comments.length+'</span></div>'+discussionHtml(c,'pk')+'</div>';
return h;
}
function applyTemplate(tid){const t=templates().find(x=>x.id===tid);if(!t||!draft)return;const d=t.data||{};
['type','duration','gear','cast','caption','hashtags','notes'].forEach(k=>{if(d[k]!=null&&d[k]!=='')draft[k]=d[k];});
if(Array.isArray(d.themes))draft.themes=d.themes.slice();
if(Array.isArray(d.checklist))draft.checklist=d.checklist.map(x=>({id:uid(),text:x,done:false}));
if(Array.isArray(d.scenes)&&d.scenes.length)draft.scenes=d.scenes.map(x=>({id:uid(),heading:x.heading||'',body:x.body||''}));
scheduleSave();renderEditor();toast('Modèle « '+t.name+' » appliqué');}
function handleProjClick(a,el){
if(!a.startsWith('ed-ck')&&!a.startsWith('ed-ex')&&a!=='ed-tpl-save'&&a!=='tpl-del')return false;
if(a==='tpl-del'){if(!isAdmin())return true;const id=el.dataset.id;const n=(templates().find(t=>t.id===id)||{}).name||'';updateSettings(s=>{s.templates=(s.templates||[]).filter(t=>t.id!==id);},'Modèle « '+n+' » supprimé');return true;}
if(!draft)return true;
switch(a){
case'ed-ck-tpl':draft.checklist=draft.checklist.concat(DEFAULT_CHECK.map(t=>({id:uid(),text:t,done:false})));scheduleSave();renderEditor();return true;
case'ed-ck-add':{const i=$('#ed-ck-new');const v=(i&&i.value||'').trim();if(!v)return true;draft.checklist.push({id:uid(),text:v,done:false});scheduleSave();renderEditor();const n=$('#ed-ck-new');if(n)n.focus();}return true;
case'ed-ck-del':draft.checklist=draft.checklist.filter(x=>x.id!==el.dataset.cid);scheduleSave();renderEditor();return true;
case'ed-ex-add':draft.expenses.push({id:uid(),label:'',amount:0});if(!draft.budget)draft.budget={amount:0,currency:'MGA'};scheduleSave();renderEditor();{const l=draft.expenses[draft.expenses.length-1];const t=document.getElementById('ex-l-'+l.id);if(t)t.focus();}return true;
case'ed-ex-del':draft.expenses=draft.expenses.filter(x=>x.id!==el.dataset.xid);scheduleSave();renderEditor();return true;
case'ed-tpl-save':{const name=titleOf(draft)+' (modèle)';const data={type:draft.type,themes:draft.themes,duration:draft.duration,gear:draft.gear,cast:draft.cast,caption:draft.caption,hashtags:draft.hashtags,notes:draft.notes,checklist:draft.checklist.map(x=>x.text),scenes:draft.scenes.map(x=>({heading:x.heading,body:x.body}))};
updateSettings(s=>{s.templates=(s.templates||[]).concat([{id:'tp'+uid(),name,data,createdAt:Date.now()}]);},'Modèle créé : '+name);toast('Modèle « '+name+' » enregistré');}return true;
}
return false;
}
$('#sheet-panel').addEventListener('input',e=>{if(!draft)return;const el=e.target;
if(el.dataset.ck){const x=draft.checklist.find(k=>k.id===el.dataset.ck);if(x){x.text=el.value;scheduleSave();}}
else if(el.dataset.ex){const x=draft.expenses.find(k=>k.id===el.dataset.xid);if(x){x[el.dataset.ex]=el.dataset.ex==='amount'?(parseFloat(el.value)||0):el.value;scheduleSave();}}
else if(el.dataset.bud){draft.budget=Object.assign({amount:0,currency:'MGA'},draft.budget||{});draft.budget[el.dataset.bud]=el.dataset.bud==='amount'?(parseFloat(el.value)||0):el.value;scheduleSave();}});
$('#sheet-panel').addEventListener('change',e=>{if(!draft)return;const el=e.target;
if(el.dataset.ckdone){const x=draft.checklist.find(k=>k.id===el.dataset.ckdone);if(x){x.done=el.checked;scheduleSave();renderEditor();}}
else if(el.dataset.tplapply&&el.value)applyTemplate(el.value);});
$('#sheet-panel').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='ed-ck-new'){e.preventDefault();handleProjClick('ed-ck-add',e.target);}});
$('#peek-panel').addEventListener('change',e=>{const el=e.target;if(!el.dataset.pkck||!peekId)return;if(!can('projEdit')){toast(DENIED);renderPeek();return;}
const cid=el.dataset.pkck;updateContent(peekId,c=>{const x=c.checklist.find(k=>k.id===cid);if(x)x.done=el.checked;},'Checklist : '+(el.checked?'fait':'à faire'));});
function handleMsgSubmit(k,f){
if(k!=='ed-msg'&&k!=='pk-msg')return false;const inp=$('#'+k);const v=(inp&&inp.value||'').trim();if(!v)return true;
const m={id:uid(),by:roleName(ROLE),at:Date.now(),text:v};
if(k==='ed-msg'&&draft){draft.comments=draft.comments.concat([m]);flushSave();pending=true;flushSave();renderEditor();const n=$('#ed-msg');if(n)n.focus();}
else if(k==='pk-msg'&&peekId){updateContent(peekId,c=>{c.comments=(c.comments||[]).concat([m]);},'Message : '+v.slice(0,60));const n=$('#pk-msg');if(n){n.value='';n.focus();}}
return true;
}
function templatesPanel(){const T=templates();
return'<section class="panel"><div class="panel-h"><h2>Modèles de projet</h2><span class="mono muted">'+T.length+'</span></div>'+
(T.length?'<div class="rows">'+T.map(t=>'<div class="row"><div class="row-main" style="cursor:default"><b>'+esc(t.name)+'</b><span class="row-meta"><span>'+esc(typeOf((t.data||{}).type).label)+'</span><span>'+plural(((t.data||{}).checklist||[]).length,'tâche')+'</span></span></div><button class="icon-btn sm danger" data-act="tpl-del" data-id="'+esc(t.id)+'" data-confirm="✓" aria-label="Supprimer le modèle">'+ICON.x+'</button></div>').join('')+'</div>'
:'<p class="hint" style="margin:0">Ouvre un projet bien rempli et clique sur « Enregistrer comme modèle » en bas de sa fiche.</p>')+'</section>';}
function shootsOn(day){const out=[];contents().forEach(c=>(c.shoots||[]).forEach(s=>{if(isValidDate(s.start)&&s.start<=day&&shootEnd(s)>=day)out.push({c,s});}));return out;}
function todayItems(){
const t=today();const it=[];
if(can('projEdit')||true){
contents().forEach(c=>(c.publications||[]).forEach(p=>{if(p.date===t&&!p.done){const a=S.accounts[p.accountId];it.push({ic:'pub',time:p.time||'',label:'Publier « '+titleOf(c)+' »',sub:(a?platOf(a.platform).label+' · '+a.handle:pendingLabel(p)),act:'peek',id:c.id});}}));
shootsOn(t).forEach(x=>it.push({ic:'shoot',time:'',label:'Tournage « '+titleOf(x.c)+' »',sub:(x.s.location?'📍 '+x.s.location:'Lieu à définir')+(x.c.cast?' · '+x.c.cast:''),act:'peek',id:x.c.id}));
contents().forEach(c=>{if(c.editDate===t)it.push({ic:'edit',time:'',label:'Montage « '+titleOf(c)+' »',sub:'Date de montage',act:'peek',id:c.id});});
}
if(can('rdv'))Object.values(S.rdv).forEach(x=>{if(x.date===t)it.push({ic:'rdv',time:x.start||'',label:x.title||'Rendez-vous',sub:rdvWho(x)+(x.location?' · '+x.location:''),act:'rdv-open',id:x.id});});
if(can('suivis')||isAdmin())docs().forEach(d=>{const di=dueInfo(d);if(di&&(di.n<=0||d.followUp==='urgent'))it.push({ic:'money',time:'',label:(d.followUp==='urgent'?'Relancer en urgence ':'Relancer ')+((d.clientSnap&&d.clientSnap.name)||(compOf(d.companyId)||{}).label||'')+' · '+d.number,sub:di.label+' · reste '+money(docRemaining(d),d.currency),act:'doc-open',id:d.id});});
if(can('projection')){
if(isAdmin())medias().filter(m=>m.kind==='version'&&m.status==='attente').forEach(m=>it.push({ic:'pj',time:'',label:'Valider « '+(m.title||'')+' » V'+(m.version||1),sub:'Envoyée par '+(m.createdBy||''),act:'pj-open',id:m.id}));
else medias().filter(m=>(m.kind==='version'&&m.status==='corriger')||(m.kind==='rush'&&m.status==='dispo'&&m.byRole!==ROLE)).forEach(m=>it.push({ic:'pj',time:'',label:(m.kind==='rush'?'Récupérer les rushs « ':'Corriger « ')+(m.title||'')+' »',sub:m.kind==='rush'?'Partagés par '+(m.createdBy||''):((m.comments||[]).filter(x=>!x.done).length+' retour(s) à traiter'),act:'pj-open',id:m.id}));
}
return it.sort((a,b)=>(a.time||'99')<(b.time||'99')?-1:1);
}
const TODAY_IC={pub:['Publication','#5B6CFF'],shoot:['Tournage','#E0533D'],edit:['Montage','#C98C00'],rdv:['RDV','#2B9348'],money:['Paiement','#D2402C'],pj:['Projection','#9B4DCA']};
function alertsList(){
const A=[];const t=today();
const latePubs=events({filtered:false,prod:false,rdv:false}).filter(isLate).length;if(latePubs)A.push([latePubs+' publication'+(latePubs>1?'s':'')+' en retard','home-sel','late','#D2402C']);
const ih=ideasToHandle().length;if(ih)A.push([isAdmin()?ih+' proposition'+(ih>1?'s':'')+' d\'idée à traiter':ih+' idée'+(ih>1?'s':'')+' à retravailler','nav','ideas','#5B6CFF']);
if(isAdmin()){const pp=docs().reduce((a,d)=>a+(d.payments||[]).filter(p=>p.pending).length,0);if(pp)A.push([pp+' paiement'+(pp>1?'s':'')+' à valider','biz','suivi','#C98C00']);
const ps=pendingDocs().length;if(ps)A.push([ps+' statut'+(ps>1?'s':'')+' de facture à valider','biz','fac','#C98C00']);
const pv=medias().filter(m=>m.kind==='version'&&m.status==='attente').length;if(pv)A.push([pv+' version'+(pv>1?'s':'')+' à valider','nav','projection','#9B4DCA']);}
else if(can('projection')){const pc=medias().filter(m=>m.kind==='version'&&m.status==='corriger').length;if(pc)A.push([pc+' version'+(pc>1?'s':'')+' à corriger','nav','projection','#C98C00']);}
if(can('suivis')){const ld=docs().filter(d=>(dueInfo(d)||{}).n<0).length;if(ld)A.push([ld+' facture'+(ld>1?'s':'')+' en retard de paiement','biz','suivi','#D2402C']);}
if(can('collabs')){const ce=Object.values(S.deals).filter(d=>isValidDate(d.contractEnd)&&d.contractEnd>=t&&diffDays(d.contractEnd,t)<=30).length;if(ce)A.push([ce+' contrat'+(ce>1?'s':'')+' se termine'+(ce>1?'nt':'')+' dans moins de 30 jours','biz','collab','#C98C00']);}
return A;
}
function goalsPanel(){
const g=settings().goals||{};if(!Object.values(g).some(v=>+v>0))return isAdmin()?'<section class="panel"><div class="panel-h"><h2>Objectifs du mois</h2><button class="btn ghost small" data-nav="settings">Fixer mes objectifs</button></div><p class="hint" style="margin:0">Fixe un nombre de publications, de partenariats ou un montant à encaisser : leur progression s\'affichera ici.</p></section>':'';
const t=today();const ms=t.slice(0,7);const rows=[];
if(+g.pubs){const n=contents().reduce((a,c)=>a+(c.publications||[]).filter(p=>p.done&&String(p.date).slice(0,7)===ms).length,0);rows.push(['Publications',n,+g.pubs,String(n)]);}
if(+g.collabs){const n=Object.values(S.deals).filter(d=>String(d.signedAt||'').slice(0,7)===ms).length;rows.push(['Partenariats signés',n,+g.collabs,String(n)]);}
if(+g.rdv){const n=Object.values(S.rdv).filter(x=>x.kind!=='perso'&&String(x.date).slice(0,7)===ms&&x.date<=t).length;rows.push(['Rendez-vous pro',n,+g.rdv,String(n)]);}
if(+g.cash&&isAdmin()){let n=0;docs().forEach(d=>{if(d.kind!=='facture'||d.status==='annulee'||(d.currency||'MGA')!=='MGA')return;const ps=(d.payments||[]).filter(p=>!p.pending);if(ps.length)ps.forEach(p=>{if(String(p.date).slice(0,7)===ms)n+=payAmount(d,p);});else if(d.status==='payee'&&String(d.paidAt||d.date).slice(0,7)===ms)n+=docTotals(d).total;});rows.push(['Encaissé (Ar)',n,+g.cash,money(n,'MGA')+' / '+money(+g.cash,'MGA')]);}
if(!rows.length)return'';
return'<section class="panel"><div class="panel-h"><h2>Objectifs de '+MONTHS[pd(t).getMonth()]+'</h2>'+(isAdmin()?'<button class="btn ghost small" data-nav="settings">Modifier</button>':'')+'</div><div class="goals">'+rows.map(r=>{const pct=Math.min(100,Math.round(r[1]/r[2]*100));return'<div class="goal"><div class="creance-txt"><b>'+esc(r[0])+'</b><span class="mono">'+esc(r[3].includes('/')?r[3]:r[3]+' / '+r[2])+'</span><span class="pill" style="--c:'+(pct>=100?'#14A37F':'#5B6CFF')+'">'+pct+' %</span></div><div class="pbar ok"><i style="width:'+pct+'%"></i></div></div>';}).join('')+'</div></section>';
}
function goalsSettings(){const g=settings().goals||{};
return'<section class="panel"><div class="panel-h"><h2>Objectifs du mois</h2></div><div class="f-grid">'+[['pubs','Publications'],['collabs','Partenariats signés'],['rdv','Rendez-vous pro'],['cash','Montant encaissé (Ar)']].map(x=>'<label class="field"><span>'+x[1]+'</span><input class="inp mono" type="number" min="0" step="any" id="goal-'+x[0]+'" data-goal="'+x[0]+'" value="'+esc(g[x[0]]||'')+'" placeholder="0 = pas d\'objectif"></label>').join('')+'</div><p class="hint" style="margin:8px 0 0">L\'assistante voit les objectifs, sauf le montant encaissé.</p></section>';}
function homeTop(){
const it=todayItems();const A=alertsList();
let h='<section class="panel today"><div class="panel-h"><h2>Aujourd\'hui</h2><span class="mono muted">'+it.length+'</span></div>';
h+=it.length?'<div class="rows">'+it.slice(0,12).map(x=>{const ic=TODAY_IC[x.ic];return'<div class="row"><button class="row-main" data-act="'+x.act+'" data-id="'+esc(x.id)+'"><b>'+esc(x.label)+'</b><span class="row-meta"><span class="pill" style="--c:'+ic[1]+'">'+ic[0]+'</span>'+(x.time?'<span class="mono">'+esc(x.time)+'</span>':'')+'<span>'+esc(x.sub)+'</span></span></button></div>';}).join('')+'</div>'
:'<p class="muted" style="margin:0">Rien de prévu aujourd\'hui. Profites-en pour avancer une idée ou un script.</p>';
h+='</section>';
if(A.length)h+='<div class="alerts">'+A.map(x=>'<button class="alert" style="--c:'+x[3]+'" data-act="alert-go" data-k="'+x[1]+'" data-v="'+x[2]+'"><span class="dot" style="--c:'+x[3]+'"></span>'+esc(x[0])+'</button>').join('')+'</div>';
return h;
}
function easter(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;return ds(new Date(y,mo-1,da));}
const HOL_CACHE={};
function mgHolidays(y){if(HOL_CACHE[y])return HOL_CACHE[y];const o={};[['01-01','Nouvel An'],['03-08','Journée de la femme'],['03-29','Commémoration 1947'],['05-01','Fête du Travail'],['06-26','Fête de l\'Indépendance'],['08-15','Assomption'],['11-01','Toussaint'],['12-25','Noël']].forEach(x=>{o[y+'-'+x[0]]=x[1];});
const e=easter(y);o[addDays(e,1)]='Lundi de Pâques';o[addDays(e,39)]='Ascension';o[addDays(e,50)]='Lundi de Pentecôte';return HOL_CACHE[y]=o;}
const holidayOf=d=>mgHolidays(+String(d).slice(0,4))[d]||'';
function icsEsc(s){return String(s||'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n');}
function exportIcs(){
const now=new Date();const stamp=now.toISOString().replace(/[-:]/g,'').replace(/\.\d+Z$/,'Z');const from=addDays(today(),-31),to=addDays(today(),180);
const L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Studio Tefi//FR','CALSCALE:GREGORIAN','X-WR-CALNAME:Studio Tefi'];
const ev=(uidv,date,time,dur,title,desc,loc)=>{L.push('BEGIN:VEVENT','UID:'+uidv+'@studio-tefi','DTSTAMP:'+stamp);
if(time){const st=date.replace(/-/g,'')+'T'+time.replace(':','')+'00';const end=new Date(pd(date).getTime());const[hh,mm]=time.split(':').map(Number);end.setHours(hh,mm+dur);L.push('DTSTART:'+st,'DTEND:'+ds(end).replace(/-/g,'')+'T'+pad(end.getHours())+pad(end.getMinutes())+'00');}
else L.push('DTSTART;VALUE=DATE:'+date.replace(/-/g,''),'DTEND;VALUE=DATE:'+addDays(date,1).replace(/-/g,''));
L.push('SUMMARY:'+icsEsc(title));if(desc)L.push('DESCRIPTION:'+icsEsc(desc));if(loc)L.push('LOCATION:'+icsEsc(loc));L.push('END:VEVENT');};
events({filtered:false,prod:true,rdv:true}).forEach(e=>{if(e.date<from||e.date>to)return;
if(e.kind==='pub')ev('p-'+e.p.id,e.date,e.time,15,'Publier : '+titleOf(e.c)+(e.a?' ('+e.a.handle+')':''),typeOf(e.c.type).label,'');
else if(e.kind==='shoot')ev('s-'+e.s.id+'-'+e.date,e.date,'',0,'Tournage : '+titleOf(e.c)+(e.dn>1?' (jour '+(e.di+1)+'/'+e.dn+')':''),e.c.cast||'',e.s.location||'');
else if(e.kind==='edit')ev('e-'+e.c.id,e.date,'',0,'Montage : '+titleOf(e.c),'','');
else if(e.kind==='rdv'){const x=e.r;let dur=60;if(x.start&&x.end){const[a1,b1]=x.start.split(':').map(Number),[a2,b2]=x.end.split(':').map(Number);dur=Math.max(15,(a2*60+b2)-(a1*60+b1));}ev('r-'+x.id,x.date,x.start||'',dur,(x.kind==='perso'?'RDV perso : ':'RDV '+rdvWho(x)+' : ')+(x.title||''),[x.contact,x.notes,x.link].filter(Boolean).join('\n'),x.location||'');}});
L.push('END:VCALENDAR');
saveBlob(new Blob([L.join('\r\n')],{type:'text/calendar'}),'studio-tefi-planning.ics');
}
const LS_REM='studio-tefi-reminded-v1';
function checkReminders(){
if(!S.loaded||!ROLE)return;const sent=lsGet(LS_REM)||{};const now=new Date();const t=today();const tm=addDays(t,1);const out=[];
const hm=now.getHours()*60+now.getMinutes();
shootsOn(tm).forEach(x=>{const k='shoot:'+x.s.id+':'+tm;if(!sent[k]&&now.getHours()>=17)out.push([k,'Demain : tournage « '+titleOf(x.c)+' »'+(x.s.location?' à '+x.s.location:'')]);});
contents().forEach(c=>(c.publications||[]).forEach(p=>{if(p.date===t&&!p.done&&p.time){const[h,m]=p.time.split(':').map(Number);const d=h*60+m-hm;const k='pub:'+p.id+':'+t;if(d<=60&&d>=-30&&!sent[k])out.push([k,'Publication à '+p.time+' : « '+titleOf(c)+' »']);}}));
if(can('rdv'))Object.values(S.rdv).forEach(x=>{const imp=x.priority==='p4';
if(imp&&x.date===tm&&now.getHours()>=17){const k='rdvv:'+x.id+':'+tm;if(!sent[k])out.push([k,'Demain, impératif : '+(x.title||'Rendez-vous')+(x.start?' à '+x.start:'')]);}
if(x.date===t&&x.start){const[h,m]=x.start.split(':').map(Number);const d=h*60+m-hm;const k='rdv:'+x.id+':'+t;if(d<=(imp?120:60)&&d>=0&&!sent[k])out.push([k,(imp?'Impératif · ':'')+'Rendez-vous à '+x.start+' : '+(x.title||'')]);}});
tasksVisible().forEach(x=>{if(!x.remind||x.status==='done'||x.date!==t)return;const[h,m]=(x.time||'09:00').split(':').map(Number);const d=h*60+m-hm;const k='task:'+x.id+':'+t;if(d<=0&&d>=-90&&!sent[k])out.push([k,'Rappel : '+(x.title||'tâche')]);});
if(can('suivis'))docs().forEach(d=>{const di=dueInfo(d);const k='due:'+d.id+':'+t;if(di&&di.n===0&&!sent[k])out.push([k,'Échéance aujourd\'hui : '+d.number+' · '+money(docRemaining(d),d.currency)]);});
if(!out.length)return;
out.forEach(([k,msg])=>{sent[k]=Date.now();try{if('Notification'in window&&Notification.permission==='granted')new Notification('Studio Tefi',{body:msg});}catch(e){}});
toast(out.length===1?out[0][1]:out[0][1]+' (+'+(out.length-1)+' autre'+(out.length>2?'s':'')+')');
Object.keys(sent).forEach(k=>{if(sent[k]<Date.now()-7*864e5)delete sent[k];});lsSet(LS_REM,sent);
}
function notifBox(){
if(S.mode==='cloud'||!('Notification'in window))return'<p class="hint" style="margin:0">Les rappels s\'affichent dans l\'appli à l\'ouverture. Les notifications du téléphone fonctionnent sur ton site GitHub ajouté à l\'écran d\'accueil.</p>';
const p=Notification.permission;return'<div class="card-f"><span>'+(p==='granted'?'Notifications activées sur cet appareil.':p==='denied'?'Notifications bloquées dans les réglages du navigateur.':'Reçois un rappel la veille d\'un tournage, avant une publication ou un rendez-vous.')+'</span>'+(p==='default'?'<button class="btn small primary" data-act="notif-on">Activer les rappels</button>':'')+'</div><p class="hint" style="margin:6px 0 0">Les rappels arrivent quand l\'appli est ouverte ou en arrière-plan sur l\'appareil.</p>';
}
let statsEdit=null;
const fmtK=n=>{n=+n||0;return n>=1e6?(Math.round(n/1e5)/10+' M').replace('.',','):n>=1e4?Math.round(n/1e3)+' k':n>=1e3?(Math.round(n/100)/10+' k').replace('.',','):String(n);};
function pubStatsHtml(c,p){
if(!isValidDate(p.date)||p.date>today()||!can('stats'))return'';
const s=p.stats;
if(statsEdit===p.id)return'<form class="stats-form" data-form="pstats" data-cid="'+esc(c.id)+'" data-pid="'+esc(p.id)+'">'+[['views','Vues'],['likes','J\'aime'],['comments','Commentaires'],['shares','Partages'],['saves','Enregistrements']].map(x=>'<label class="field"><span>'+x[1]+'</span><input class="inp mono" type="number" min="0" id="st-'+x[0]+'" value="'+esc(s&&s[x[0]]!=null?s[x[0]]:'')+'"></label>').join('')+'<div class="card-f" style="grid-column:1 / -1"><button type="button" class="btn small ghost" data-act="pstats-cancel">Annuler</button><button class="btn small primary" type="submit">Enregistrer</button></div></form>';
return'<div class="pstats">'+(s?'<span class="pill plain">'+fmtK(s.views)+' vues</span><span class="pill plain">'+fmtK(s.likes)+' j\'aime</span>'+(s.comments?'<span class="pill plain">'+fmtK(s.comments)+' comm.</span>':'')+(s.shares?'<span class="pill plain">'+fmtK(s.shares)+' partages</span>':'')+'<span class="hint">relevé le '+fmtShort(ds(new Date(s.at)))+'</span>':'<span class="hint">Pas encore de statistiques.</span>')+'<button class="btn small ghost" data-act="pstats-open" data-pid="'+esc(p.id)+'">'+(s?'Mettre à jour':'Ajouter les stats')+'</button></div>';
}
function statRows(days){
const from=days?addDays(today(),-days):'0000';const out=[];
contents().forEach(c=>(c.publications||[]).forEach(p=>{if(p.stats&&+p.stats.views>=0&&p.date>=from&&p.date<=today())out.push({c,p,a:S.accounts[p.accountId],s:p.stats});}));return out;}
function perfPanel(){
if(!can('stats'))return'';const days=+S.ui.perfDays||90;const R=statRows(days);
let h='<section class="panel"><div class="panel-h"><h2>Performances</h2><select class="inp" id="perf-days" data-perfdays="1" style="width:auto" aria-label="Période">'+[[30,'30 derniers jours'],[90,'90 derniers jours'],[365,'12 derniers mois'],[0,'Depuis le début']].map(x=>'<option value="'+x[0]+'"'+(x[0]===days?' selected':'')+'>'+x[1]+'</option>').join('')+'</select></div>';
if(!R.length)return h+'<p class="hint" style="margin:0">Ajoute les statistiques de tes publications (vues, j\'aime…) depuis l\'aperçu d\'un contenu publié : les meilleurs formats, thématiques et jours apparaîtront ici.</p></section>';
const eng=x=>(+x.s.likes||0)+(+x.s.comments||0)+(+x.s.shares||0)+(+x.s.saves||0);
const views=R.reduce((a,x)=>a+(+x.s.views||0),0);const engT=R.reduce((a,x)=>a+eng(x),0);
h+='<div class="stats" style="grid-template-columns:repeat(3,minmax(0,1fr))"><div class="stat"><span class="label">Vues</span><strong>'+fmtK(views)+'</strong><span class="muted">'+plural(R.length,'publication')+'</span></div><div class="stat"><span class="label">Moyenne</span><strong>'+fmtK(Math.round(views/R.length))+'</strong><span class="muted">vues par publication</span></div><div class="stat"><span class="label">Engagement</span><strong>'+(views?(Math.round(engT/views*1000)/10).toString().replace('.',','):'0')+' %</strong><span class="muted">interactions / vues</span></div></div>';
const best=(keyFn,labelFn)=>{const m={};R.forEach(x=>{const k=keyFn(x);if(k==null)return;(m[k]=m[k]||[]).push(+x.s.views||0);});const L=Object.keys(m).map(k=>[labelFn(k),m[k].reduce((a,b)=>a+b,0)/m[k].length,m[k].length]).sort((a,b)=>b[1]-a[1]);return L;};
const blk=(title,L)=>L.length?'<div><span class="label">'+title+'</span>'+L.slice(0,4).map((x,i)=>'<div class="perf-row"><span>'+(i===0?'★ ':'')+esc(x[0])+'</span><span class="mono">'+fmtK(Math.round(x[1]))+' <span class="muted">('+x[2]+')</span></span></div>').join('')+'</div>':'';
h+='<p class="hint" style="margin:10px 0 6px">Moyenne de vues par publication (nombre de publications entre parenthèses).</p><div class="perf-grid">'+
blk('Par compte',best(x=>x.a?x.a.id:null,k=>{const a=S.accounts[k];return a?a.handle+' ('+platOf(a.platform).label+')':'?';}))+
blk('Par format',best(x=>x.c.type,k=>typeOf(k).label))+
blk('Par thématique',(()=>{const m={};R.forEach(x=>(x.c.themes||[]).forEach(t=>{(m[t]=m[t]||[]).push(+x.s.views||0);}));return Object.keys(m).map(k=>[(themeOf(k)||{label:k}).label,m[k].reduce((a,b)=>a+b,0)/m[k].length,m[k].length]).sort((a,b)=>b[1]-a[1]);})())+
blk('Par jour de publication',best(x=>dow(x.p.date),k=>DAYS_LONG[k]))+
blk('Par heure',best(x=>x.p.time?x.p.time.slice(0,2)+' h':null,k=>k))+'</div>';
const top=R.slice().sort((a,b)=>(+b.s.views||0)-(+a.s.views||0)).slice(0,5);
h+='<div style="margin-top:12px"><span class="label">Top publications</span><div class="rows">'+top.map(x=>'<div class="row"><button class="row-main" data-act="peek" data-id="'+esc(x.c.id)+'"><b>'+esc(titleOf(x.c))+'</b><span class="row-meta"><span>'+esc(x.a?x.a.handle:'')+'</span><span>'+fmtShort(x.p.date)+'</span><span class="mono">'+fmtK(x.s.views)+' vues</span><span class="mono">'+fmtK(eng(x))+' interactions</span></span></button></div>').join('')+'</div></div>';
return h+'</section>';
}
function mediaKitPanel(){
if(!isAdmin())return'';const k=settings().mediaKit||{};
return'<section class="panel"><div class="panel-h"><h2>Kit média</h2><button class="btn primary small" data-act="mk-pdf">Générer le PDF</button></div><p class="hint" style="margin:-4px 0 10px">Une présentation à envoyer aux marques : ta bio, tes comptes et leurs abonnés, tes meilleurs contenus et les clients avec qui tu as travaillé.</p>'+
'<div class="f-grid">'+[['name','Nom affiché','Tefi'],['tagline','Accroche','Créateur de skits et de courts métrages'],['city','Ville','Antananarivo'],['email','E-mail',''],['phone','Téléphone','']].map(x=>'<label class="field"><span>'+x[1]+'</span><input class="inp" id="mk-'+x[0]+'" data-mk="'+x[0]+'" value="'+esc(k[x[0]]||'')+'" placeholder="'+esc(x[2])+'"></label>').join('')+
'<label class="field wide"><span>Bio</span><textarea class="inp" rows="3" id="mk-bio" data-mk="bio" placeholder="Qui tu es, ton style, ton audience…">'+esc(k.bio||'')+'</textarea></label></div><p class="hint" style="margin:8px 0 0">Renseigne le nombre d\'abonnés de chaque compte dans les cartes ci-dessous.</p></section>';
}
async function mediaKitPdf(){
const k=settings().mediaKit||{};const pdf=new MiniPDF();const M=18,R=192,acc='#4636D9',grey='#6b6a78';let y=30;
pdf.rect(0,0,210,58,acc);pdf.text(k.name||'Studio Tefi',M,y,{font:'F2',size:26,color:'#ffffff'});y+=9;
if(k.tagline)pdf.text(k.tagline,M,y,{size:12,color:'#ffffff'});y+=7;pdf.text([k.city,k.email,k.phone].filter(Boolean).join('  ·  '),M,y,{size:9.5,color:'#e7e4ff'});
y=72;
if(k.bio){pdf.text('À PROPOS',M,y,{font:'F2',size:9,color:grey});y+=6;pdf.wrap(k.bio,R-M,'F1',10.5).forEach(l=>{pdf.text(l,M,y,{size:10.5});y+=5.2;});y+=6;}
const accs=accounts().filter(a=>isSocial(a.platform));const tot=accs.reduce((s,a)=>s+(+a.followers||0),0);
pdf.text('AUDIENCE',M,y,{font:'F2',size:9,color:grey});y+=4;
const cw=(R-M-8)/3;let x=M;let cnt=0;
accs.forEach(a=>{if(cnt&&cnt%3===0){x=M;y+=26;}pdf.rect(x,y,cw,22,'#f4f4f8');pdf.text(fmtK(a.followers||0),x+5,y+10,{font:'F2',size:16,color:accColor(a)});pdf.text(platOf(a.platform).label+' · '+a.handle,x+5,y+17,{size:8.5,color:grey});x+=cw+4;cnt++;});
y+=30;if(tot){pdf.text('Audience totale : '+fmtK(tot)+' abonnés',M,y,{font:'F2',size:11});y+=9;}
const R2=statRows(90);if(R2.length){const v=R2.reduce((a,x)=>a+(+x.s.views||0),0);const e=R2.reduce((a,x)=>a+(+x.s.likes||0)+(+x.s.comments||0)+(+x.s.shares||0)+(+x.s.saves||0),0);
pdf.text('SUR LES 90 DERNIERS JOURS',M,y,{font:'F2',size:9,color:grey});y+=6;pdf.text(fmtK(v)+' vues  ·  '+fmtK(Math.round(v/R2.length))+' vues en moyenne  ·  '+(v?(Math.round(e/v*1000)/10).toString().replace('.',','):'0')+' % d\'engagement',M,y,{size:10.5});y+=10;
pdf.text('CONTENUS LES PLUS VUS',M,y,{font:'F2',size:9,color:grey});y+=6;
R2.slice().sort((a,b)=>(+b.s.views||0)-(+a.s.views||0)).slice(0,5).forEach(x=>{pdf.text(titleOf(x.c),M,y,{font:'F2',size:10});pdf.text(fmtK(x.s.views)+' vues · '+(x.a?x.a.handle:''),R,y,{size:9.5,color:grey,align:'right'});y+=6;});y+=6;}
const fm={};contents().forEach(c=>{if(c.status==='publie'){fm[c.type]=(fm[c.type]||0)+1;}});const fl=Object.keys(fm).sort((a,b)=>fm[b]-fm[a]).slice(0,6).map(t=>typeOf(t).label);
if(fl.length){pdf.text('FORMATS',M,y,{font:'F2',size:9,color:grey});y+=6;pdf.text(fl.join('  ·  '),M,y,{size:10.5});y+=10;}
const cl=companies().map(c=>c.label);if(cl.length){if(y>255){pdf.newPage();y=24;}pdf.text('ILS M\'ONT FAIT CONFIANCE',M,y,{font:'F2',size:9,color:grey});y+=6;pdf.wrap(cl.join('  ·  '),R-M,'F2',11).forEach(l=>{pdf.text(l,M,y,{font:'F2',size:11});y+=6;});}
pdf.pages.forEach(pg=>{pdf.cur=pg;pdf.text('Kit média · '+fmtFr(today()),M,288,{size:7.5,color:grey});});
await saveBlob(pdf.output(),'Kit-media-'+String(k.name||'Tefi').replace(/[^\w.-]+/g,'_')+'.pdf');
}
function handleM4Click(a,el){
switch(a){
case'alert-go':{const k=el.dataset.k,v=el.dataset.v;if(k==='nav')go(v);else if(k==='biz'){S.ui.bizTab=v;if(v==='suivi')S.ui.suiviFilter={show:'late'};go('business');}else if(k==='home-sel'){S.ui.homeSel=v;render();const p=$('#home-detail');if(p)p.scrollIntoView({behavior:'smooth'});}}return true;
case'ics':exportIcs();return true;
case'notif-on':try{Notification.requestPermission().then(()=>render());}catch(e){toast('Notifications indisponibles sur ce navigateur.');}return true;
case'pstats-open':statsEdit=el.dataset.pid;renderPeek();{const i=$('#st-views');if(i)i.focus();}return true;
case'pstats-cancel':statsEdit=null;renderPeek();return true;
case'mk-pdf':mediaKitPdf();return true;
}
return false;
}
function handleM4Submit(k,f){
if(k!=='pstats')return false;if(!can('stats')){toast(DENIED);return true;}
const st={at:Date.now()};['views','likes','comments','shares','saves'].forEach(x=>{const v=$('#st-'+x).value;st[x]=v===''?0:Math.max(0,parseInt(v,10)||0);});
const pid=f.dataset.pid;updateContent(f.dataset.cid,c=>{const p=c.publications.find(x=>x.id===pid);if(p)p.stats=st;},'Statistiques : '+fmtK(st.views)+' vues');statsEdit=null;toast('Statistiques enregistrées');return true;
}
function handleM4Change(el){
if(el.dataset.goal){if(!isAdmin())return true;const k=el.dataset.goal;const v=parseFloat(el.value)||0;updateSettings(s=>{s.goals=Object.assign({},s.goals||{},{[k]:v});},'Objectif modifié');return true;}
if(el.dataset.mk){if(!isAdmin())return true;const k=el.dataset.mk;const v=el.value.trim();updateSettings(s=>{s.mediaKit=Object.assign({},s.mediaKit||{},{[k]:v});},'Kit média modifié');return true;}
if(el.dataset.accFollowers){if(!can('accounts')){render();return true;}const a=S.accounts[el.dataset.accFollowers];if(a)updateAccount(a.id,{followers:Math.max(0,parseInt(el.value,10)||0)},'Abonnés : '+fmtK(parseInt(el.value,10)||0));return true;}
if(el.dataset.perfdays){S.ui.perfDays=+el.value;saveUI();render();return true;}
return false;
}
function addMonths(d,n){const x=pd(d);const day=x.getDate();x.setDate(1);x.setMonth(x.getMonth()+n);const last=new Date(x.getFullYear(),x.getMonth()+1,0).getDate();x.setDate(Math.min(day,last));return ds(x);}
function runRecurring(){
if(!S.loaded||!ROLE||!can('factures'))return;const t=today();let n=0;
docs().forEach(src=>{const rc=src.recurring;if(src.kind!=='facture'||!rc||!rc.freq||!isValidDate(rc.next))return;let guard=0;
while(rc.next<=t&&guard++<12){const id='rec-'+src.id+'-'+rc.next;
if(!S.docs[id]){const gap=isValidDate(src.dueDate)&&isValidDate(src.date)?diffDays(src.dueDate,src.date):15;
const c=clone(src);Object.assign(c,{id,date:rc.next,dueDate:addDays(rc.next,gap),number:nextNumber('facture',src.profileId,rc.next),status:'brouillon',payments:[],followUp:'',reminders:[],pendingStatus:null,lastDecision:null,paidAt:'',profileSnap:null,clientSnap:null,recurring:null,recurringFrom:src.id,createdAt:Date.now()});
c.lines=c.lines.map(l=>Object.assign({},l,{id:uid()}));Store.save('docs',c);logChange('doc','create',id,'Facture '+c.number,'Facture récurrente préparée (brouillon)',null);n++;}
rc.next=addMonths(rc.next,rc.freq==='quarterly'?3:rc.freq==='yearly'?12:1);}
if(guard)Store.save('docs',Object.assign(clone(src),{recurring:Object.assign({},rc)}));});
if(n)toast(plural(n,'facture récurrente préparée','factures récurrentes préparées')+' en brouillon');
}
function recurringField(d){if(d.kind!=='facture')return'';const rc=d.recurring||{};
return'<label class="field"><span>Récurrence</span><select class="inp" id="dc-rec" data-rec="freq"><option value="">Aucune</option>'+[['monthly','Chaque mois'],['quarterly','Chaque trimestre'],['yearly','Chaque année']].map(x=>'<option value="'+x[0]+'"'+(rc.freq===x[0]?' selected':'')+'>'+x[1]+'</option>').join('')+'</select></label>'+
(rc.freq?'<label class="field"><span>Prochaine facture le</span><input class="inp" type="date" id="dc-recnext" data-rec="next" value="'+esc(rc.next||addMonths(d.date||today(),rc.freq==='quarterly'?3:rc.freq==='yearly'?12:1))+'"></label>':'');}
let msgDocId=null,msgTone='';
function relanceText(d,tone){
const P=d.profileSnap||partySnap(Object.assign({},profOf(d.profileId)||{},{label:(profOf(d.profileId)||{}).name}))||{};const C=d.clientSnap||partySnap(compOf(d.companyId))||{};
const di=dueInfo(d);const late=di&&di.n<0?plural(-di.n,'jour')+' de retard':'';const T=docTotals(d).total;
const v={contact:C.contact?C.contact.split(',')[0]:'',num:d.number,date:fmtFr(d.date),total:money(T,d.currency),due:fmtFr(d.dueDate),rest:money(docRemaining(d),d.currency),late,name:P.name||'',payment:(P.payment||(profOf(d.profileId)||{}).payment)?'Coordonnées de paiement :\n'+(P.payment||(profOf(d.profileId)||{}).payment):''};
const hello='Bonjour'+(v.contact?' '+v.contact:'')+',\n\n';
let b;
if(tone==='douce')b=hello+'J\'espère que vous allez bien. Je me permets de vous rappeler que la facture n° '+v.num+' du '+v.date+', d\'un montant de '+v.total+', arrive à échéance le '+v.due+'. Le reste à régler est de '+v.rest+'.\n\n'+(v.payment?v.payment+'\n\n':'')+'Merci d\'avance et belle journée,\n'+v.name;
else if(tone==='ferme')b=hello+'Sauf erreur de notre part, la facture n° '+v.num+' du '+v.date+' ('+v.total+') n\'a pas encore été entièrement réglée. L\'échéance était fixée au '+v.due+(v.late?' ('+v.late+')':'')+'. Le montant restant dû est de '+v.rest+'.\n\nPourriez-vous nous indiquer la date de règlement prévue ?\n\n'+(v.payment?v.payment+'\n\n':'')+'Cordialement,\n'+v.name;
else b=hello+'Malgré nos précédentes relances, la facture n° '+v.num+' ('+v.total+') reste impayée à ce jour'+(v.late?', avec '+v.late:'')+'. Nous vous remercions de procéder au règlement de '+v.rest+' dans les plus brefs délais, au plus tard sous 48 heures.\n\n'+(v.payment?v.payment+'\n\n':'')+'Sans retour de votre part, nous serons contraints d\'envisager d\'autres démarches.\n\nCordialement,\n'+v.name;
return b;
}
function openMsg(id){const d=S.docs[id];if(!d)return;msgDocId=id;const di=dueInfo(d);msgTone=d.followUp==='urgent'||(di&&di.n<-15)?'urgente':(di&&di.n<0?'ferme':'douce');renderMsg();$('#msgm').hidden=false;document.body.classList.add('locked');}
function closeMsg(){msgDocId=null;$('#msgm').hidden=true;if(!draft&&!peekId)document.body.classList.remove('locked');}
function renderMsg(){const d=S.docs[msgDocId];if(!d)return;const C=d.clientSnap||partySnap(compOf(d.companyId))||{};const txt=relanceText(d,msgTone);const phone=String(C.phone||'').replace(/[^\d+]/g,'').replace(/^\+/,'');
$('#msg-panel').innerHTML='<div class="peek-h"><div style="flex:1"><span class="label">Message de relance</span><h2>'+esc(d.number)+' · '+esc(C.name||'Client')+'</h2></div><button class="icon-btn" data-act="msg-close" aria-label="Fermer">'+ICON.x+'</button></div><div class="peek-b">'+
'<div class="seg" role="group" aria-label="Ton">'+[['douce','Rappel courtois'],['ferme','Relance ferme'],['urgente','Relance urgente']].map(t=>'<button type="button" data-act="msg-tone" data-v="'+t[0]+'" aria-pressed="'+(msgTone===t[0])+'">'+t[1]+'</button>').join('')+'</div>'+
'<textarea class="inp" id="msg-text" rows="12">'+esc(txt)+'</textarea><p class="hint" style="margin:0">Tu peux modifier le texte avant de l\'envoyer.'+(C.email?' E-mail du client : <span class="code">'+esc(C.email)+'</span>':'')+(C.phone?' · Téléphone : <span class="code">'+esc(C.phone)+'</span>':'')+'</p></div>'+
'<div class="peek-f"><button class="btn primary" data-act="msg-copy">'+ICON.copy+'Copier le message</button><a class="btn" id="msg-wa" href="https://wa.me/'+esc(phone)+'?text='+encodeURIComponent(txt)+'" target="_blank" rel="noopener">WhatsApp</a><button class="btn" data-act="fu-done" data-id="'+esc(d.id)+'">'+ICON.check+'Noter la relance</button></div>';}
async function receiptPdf(docId,payId){
const d=S.docs[docId];if(!d)return;const ps=(d.payments||[]).filter(p=>!p.pending);const idx=ps.findIndex(p=>p.id===payId);const p=ps[idx];if(!p)return;
const prof=await withLogo(profOf(d.profileId)||{});const P=d.profileSnap||partySnap(Object.assign({},prof,{label:prof.name}))||{};const C=d.clientSnap||partySnap(compOf(d.companyId))||{};
const amt=payAmount(d,p);const T=docTotals(d).total;const cum=ps.slice(0,idx+1).reduce((a,x)=>a+payAmount(d,x),0);const rest=Math.max(0,T-cum);
const pdf=new MiniPDF();const M=18,R=192,acc=prof.color||'#4636D9',grey='#6b6a78';let y=24;
if(prof.logo&&prof.logoW){const lw=Math.min(40,16*prof.logoW/prof.logoH);const nm=pdf.addJpeg(prof.logo,prof.logoW,prof.logoH);pdf.image(nm,M,y-6,lw,lw*prof.logoH/prof.logoW);y+=lw*prof.logoH/prof.logoW;}
pdf.text(P.name||'',M,y,{font:'F2',size:13});y+=5;[P.address,P.country,P.phone?'Tél. : '+P.phone:'',[P.nif?'NIF : '+P.nif:'',P.stat?'STAT : '+P.stat:''].filter(Boolean).join('   ')].filter(Boolean).forEach(t=>{pdf.text(t,M,y,{size:8.5,color:grey});y+=4;});
pdf.text('REÇU DE PAIEMENT',R,26,{font:'F2',size:18,color:acc,align:'right'});pdf.text('N° R-'+d.number+'-'+(idx+1),R,33,{font:'F2',size:10,align:'right'});pdf.text('Date : '+fmtFr(p.date),R,38,{size:9.5,color:grey,align:'right'});
y=Math.max(y,46)+8;pdf.line(M,y,R,y,'#e2e2ea',0.3);y+=10;
const row=(l,v,b)=>{pdf.text(l,M,y,{size:10,color:grey});pdf.wrap(v,R-M-55,b?'F2':'F1',b?12:10.5).forEach((t,i)=>{pdf.text(t,M+55,y+i*5.5,{font:b?'F2':'F1',size:b?12:10.5});y+=i?5.5:0;});y+=9;};
row('Reçu de',C.name||'—');row('Montant reçu',money(amt,d.currency),true);
pdf.wrap('Soit '+amountWords(amt,d.currency).toLowerCase()+'.',R-M-55,'F3',9.5).forEach(t=>{pdf.text(t,M+55,y-4,{font:'F3',size:9.5});y+=5;});y+=4;
row('Au titre de',(p.kind==='acompte'?'Acompte':p.kind==='solde'?'Solde':'Paiement')+(p.pct?' de '+String(p.pct).replace('.',',')+' %':'')+' sur la facture n° '+d.number+' du '+fmtFr(d.date)+(d.subject?' — '+d.subject:''));
if(p.note)row('Moyen / référence',p.note);
row('Total de la facture',money(T,d.currency));row('Déjà réglé (ce paiement inclus)',money(cum,d.currency));
pdf.rect(M,y-5,R-M,11,rest>0?'#f4f4f8':acc);pdf.text(rest>0?'Reste à payer':'Facture entièrement réglée',M+4,y+2,{font:'F2',size:11,color:rest>0?'#1d1c25':'#ffffff'});pdf.text(money(rest,d.currency),R-4,y+2,{font:'F2',size:12,align:'right',color:rest>0?'#1d1c25':'#ffffff'});y+=22;
pdf.text('Fait le '+fmtFr(today())+', pour '+(P.name||''),M,y,{size:9.5,color:grey});pdf.text('Signature et cachet',R-60,y,{size:9.5,color:grey});pdf.rect(R-60,y+3,60,24,null,'#c9c9d4');
pdf.text([P.name,P.nif?'NIF '+P.nif:'',P.stat?'STAT '+P.stat:'',P.rcs?'RCS '+P.rcs:''].filter(Boolean).join(' · '),M,290,{size:7.5,color:grey});
await saveBlob(pdf.output(),'Recu-'+String(d.number).replace(/[^\w.-]+/g,'_')+'-'+(idx+1)+'.pdf');
}
const STAGES=[['contact','Premier contact','#8A8FA3'],['nego','Négociation','#5B6CFF'],['signe','Signé','#14A37F'],['prod','En production','#9B4DCA'],['livre','Livré','#C98C00'],['paye','Payé','#2B9348'],['perdu','Perdu','#D2402C']];
const stageOf=id=>STAGES.find(s=>s[0]===id)||STAGES[0];
const deals=()=>Object.values(S.deals||{});const contactsL=()=>Object.values(S.contacts||{});
let formKind=null,formDraft=null;
function viewCollabs(){
const ed=can('collabs');const L=deals();const t=today();
let h='<div class="cal-bar"><p class="muted" style="margin:0">Le suivi de tes partenariats avec les marques, du premier contact au paiement.</p>'+(ed?'<button class="btn primary" data-act="form-new" data-kind="deal">'+ICON.plus+'Nouveau partenariat</button>':'')+'</div>';
const open=L.filter(d=>!['paye','perdu'].includes(d.stage));
if(open.length){const by={};open.forEach(d=>{const c=d.currency||'MGA';by[c]=(by[c]||0)+(+d.amount||0);});h+='<p class="hint" style="margin:0">En cours : '+plural(open.length,'partenariat')+(isAdmin()?' · '+Object.keys(by).map(k=>money(by[k],k)).join(' + '):'')+'</p>';}
if(!L.length)return h+'<div class="empty"><b>Aucun partenariat</b>Ajoute une marque avec qui tu discutes : tu suivras chaque étape jusqu\'au paiement.</div>';
h+='<div class="board">'+STAGES.map(s=>{const cs=L.filter(d=>d.stage===s[0]).sort((a,b)=>(a.deadline||'9')<(b.deadline||'9')?-1:1);
return'<div class="col"><div class="col-h"><span class="dot" style="--c:'+s[2]+'"></span>'+s[1]+'<span class="mono">'+cs.length+'</span></div>'+cs.map(d=>{const c=compOf(d.companyId);const i=STAGES.findIndex(x=>x[0]===d.stage);const nx=STAGES[i+1]&&STAGES[i+1][0]!=='perdu'?STAGES[i+1]:null;
const ce=isValidDate(d.contractEnd)?diffDays(d.contractEnd,t):null;
return'<div class="card" data-act="form-open" data-kind="deal" data-id="'+esc(d.id)+'"><div class="card-t">'+esc(d.title||'Partenariat')+'</div><div class="card-f">'+(c?'<span class="chip-acc"><span class="dot" style="--c:'+c.color+'"></span>'+esc(c.label)+'</span>':'')+(+d.amount?'<span class="chip-acc mono">'+esc(money(d.amount,d.currency||'MGA'))+'</span>':'')+'</div>'+
(isValidDate(d.deadline)?'<span class="hint">Livraison '+fmtShort(d.deadline)+' ('+rel(d.deadline)+')</span>':'')+(ce!=null&&ce>=0&&ce<=30?'<span class="pill" style="--c:#C98C00">Contrat : fin dans '+plural(ce,'jour')+'</span>':'')+
(nx&&ed?'<div class="card-b"><span></span><button class="btn small ghost" data-act="deal-next" data-id="'+esc(d.id)+'">'+nx[1]+ICON.arrow+'</button></div>':'')+'</div>';}).join('')+'</div>';}).join('')+'</div>';
return h;
}
function viewContacts(){
const ed=can('contacts');const q=(S.ui.contactQ||'').toLowerCase();let L=contactsL().sort((a,b)=>String(a.name).localeCompare(b.name));
if(q)L=L.filter(c=>[c.name,c.role,c.phone,c.email,(compOf(c.companyId)||{}).label,c.notes].join(' ').toLowerCase().includes(q));
let h='<div class="cal-bar"><div class="search">'+ICON.search+'<input class="inp" id="contact-q" type="search" placeholder="Chercher un contact…" value="'+esc(S.ui.contactQ||'')+'" data-input="contactq"></div>'+(ed?'<button class="btn primary" data-act="form-new" data-kind="contact">'+ICON.plus+'Nouveau contact</button>':'')+'</div>';
if(!L.length)return h+'<div class="empty"><b>'+(q?'Aucun résultat':'Aucun contact')+'</b>'+(q?'':'Ajoute les personnes avec qui tu travailles : marques, agences, acteurs, techniciens…')+'</div>';
h+='<div class="grid-2">'+L.map(c=>{const k=compOf(c.companyId);return'<section class="panel comp-card"><div class="card-b"><div><h3>'+esc(c.name)+'</h3><span class="hint">'+esc([c.role,k?k.label:''].filter(Boolean).join(' · '))+'</span></div>'+(ed?'<button class="icon-btn sm" data-act="form-open" data-kind="contact" data-id="'+esc(c.id)+'" aria-label="Modifier">'+ICON.edit+'</button>':'')+'</div>'+
'<div class="kvs">'+(c.phone?'<div><span class="label">Téléphone</span><b><span class="code">'+esc(c.phone)+'</span></b></div>':'')+(c.email?'<div><span class="label">E-mail</span><b><span class="code">'+esc(c.email)+'</span></b></div>':'')+'<div><span class="label">Dernier échange</span><b>'+(isValidDate(c.lastContact)?fmtShort(c.lastContact)+' ('+rel(c.lastContact)+')':'—')+'</b></div></div>'+(c.notes?'<p class="hint" style="margin:0;white-space:pre-wrap">'+esc(c.notes)+'</p>':'')+
'<div class="card-f">'+(c.phone?'<button class="btn small" data-act="ct-copy" data-v="'+esc(c.phone)+'">'+ICON.copy+'Numéro</button><a class="btn small" href="https://wa.me/'+esc(String(c.phone).replace(/[^\d]/g,''))+'" target="_blank" rel="noopener">WhatsApp</a>':'')+(c.email?'<button class="btn small" data-act="ct-copy" data-v="'+esc(c.email)+'">'+ICON.copy+'E-mail</button>':'')+(ed?'<button class="btn small ghost" data-act="ct-today" data-id="'+esc(c.id)+'">'+ICON.check+'Contacté aujourd\'hui</button>':'')+'</div></section>';}).join('')+'</div>';
return h;
}
const FORMS={
deal:{col:'deals',kind:'deal',title:'Partenariat',perm:'collabs',blank:()=>({id:'pa'+uid(),title:'',companyId:'',stage:'contact',amount:0,currency:'MGA',deadline:'',contractStart:'',contractEnd:'',exclusivity:'',deliverables:'',contentId:'',contactId:'',notes:''}),
fields:d=>[['title','Titre','text','Ex. : Campagne Instagram novembre'],['companyId','Client / marque','client'],['stage','Étape','stage'],['amount','Montant','number'],['currency','Devise','currency'],['deadline','Date de livraison','date'],['contractStart','Début du contrat','date'],['contractEnd','Fin du contrat','date'],['contentId','Projet lié','content'],['contactId','Contact','contact'],['deliverables','Livrables','textarea','Ex. : 2 reels + 3 stories'],['exclusivity','Exclusivité','text','Ex. : pas d\'opérateur concurrent pendant 3 mois'],['notes','Notes','textarea','']]},
contact:{col:'contacts',kind:'contact',title:'Contact',perm:'contacts',blank:()=>({id:'ct'+uid(),name:'',role:'',companyId:'',phone:'',email:'',lastContact:'',notes:''}),
fields:d=>[['name','Nom','text','Prénom et nom'],['role','Rôle','text','Ex. : Responsable marketing'],['companyId','Client / boîte','client'],['phone','Téléphone','text','+261 …'],['email','E-mail','text',''],['lastContact','Dernier échange','date'],['notes','Notes','textarea','']]}
};
function openForm(kind,id){const F=FORMS[kind];formKind=kind;formDraft=id&&S[F.col][id]?clone(S[F.col][id]):F.blank();renderForm();$('#formm').hidden=false;document.body.classList.add('locked');}
function closeForm(){formKind=null;formDraft=null;$('#formm').hidden=true;if(!draft&&!peekId)document.body.classList.remove('locked');}
function renderForm(){const F=FORMS[formKind];const d=formDraft;const isNew=!S[F.col][d.id];const opt=(v,l,sel)=>'<option value="'+esc(v)+'"'+(sel===v?' selected':'')+'>'+esc(l)+'</option>';
let h='<div class="peek-h"><div style="flex:1"><span class="label">'+(isNew?'Nouveau ':'')+F.title.toLowerCase()+'</span><h2>'+esc(d.title||d.name||F.title)+'</h2></div><button class="icon-btn" data-act="form-close" aria-label="Fermer">'+ICON.x+'</button></div><div class="peek-b"><div class="f-grid">';
F.fields(d).forEach(f=>{const[k,l,t,ph]=f;const v=d[k]==null?'':d[k];const wide=['textarea'].includes(t)||k==='title'||k==='name'?' wide':'';
let inp;if(t==='textarea')inp='<textarea class="inp" rows="2" id="ff-'+k+'" data-ff="'+k+'" placeholder="'+esc(ph||'')+'">'+esc(v)+'</textarea>';
else if(t==='client')inp='<select class="inp" id="ff-'+k+'" data-ff="'+k+'">'+opt('','Aucun',v)+companies().map(c=>opt(c.id,c.label,v)).join('')+'</select>';
else if(t==='stage')inp='<select class="inp" id="ff-'+k+'" data-ff="'+k+'">'+STAGES.map(s=>opt(s[0],s[1],v)).join('')+'</select>';
else if(t==='currency')inp='<select class="inp" id="ff-'+k+'" data-ff="'+k+'">'+Object.keys(CURRENCIES).map(c=>opt(c,c,v||'MGA')).join('')+'</select>';
else if(t==='content')inp='<select class="inp" id="ff-'+k+'" data-ff="'+k+'">'+opt('','Aucun',v)+contents().filter(c=>c.status!=='idee').map(c=>opt(c.id,titleOf(c),v)).join('')+'</select>';
else if(t==='contact')inp='<select class="inp" id="ff-'+k+'" data-ff="'+k+'">'+opt('','Aucun',v)+contactsL().map(c=>opt(c.id,c.name,v)).join('')+'</select>';
else inp='<input class="inp'+(t==='number'?' mono':'')+'" type="'+(t==='number'?'number':t==='date'?'date':'text')+'" id="ff-'+k+'" data-ff="'+k+'" value="'+esc(v)+'" placeholder="'+esc(ph||'')+'"'+(t==='number'?' min="0" step="any"':'')+'>';
h+='<label class="field'+wide+'"><span>'+l+'</span>'+inp+'</label>';});
h+='</div></div><div class="peek-f"><button class="btn primary" data-act="form-save">'+ICON.check+'Enregistrer</button><button class="btn" data-act="form-close">Annuler</button>'+(isNew?'':'<button class="btn danger" data-act="form-del" data-confirm="Supprimer ?">'+ICON.trash+'Supprimer</button>')+'</div>';
$('#form-panel').innerHTML=h;}
$('#form-panel').addEventListener('input',e=>{const el=e.target;if(formDraft&&el.dataset.ff)formDraft[el.dataset.ff]=el.type==='number'?(parseFloat(el.value)||0):el.value;});
$('#formm').addEventListener('click',e=>{if(e.target.id==='formm')closeForm();});
$('#msgm').addEventListener('click',e=>{if(e.target.id==='msgm')closeMsg();});
$('#msg-panel').addEventListener('input',e=>{if(e.target.id==='msg-text'){const a=$('#msg-wa');if(a){const u=new URL(a.href);u.searchParams.set('text',e.target.value);a.href=u.toString();}}});
function saveForm(){const F=FORMS[formKind];const d=clone(formDraft);if(!(d.title||d.name||'').trim()){toast('Donne un '+(formKind==='deal'?'titre':'nom')+'.');return;}
const before=S[F.col][d.id];if(formKind==='deal'&&['signe','prod','livre','paye'].includes(d.stage)&&!d.signedAt)d.signedAt=today();
Store.save(F.col,d);logChange(F.kind,before?'update':'create',d.id,d.title||d.name,before?F.title+' modifié':F.title+' ajouté',before||null);toast(F.title+' enregistré');closeForm();}
function handleM5Click(a,el,e){
const id=el.dataset.id;
switch(a){
case'form-new':{const F=FORMS[el.dataset.kind];if(!can(F.perm)){toast(DENIED);return true;}openForm(el.dataset.kind,null);}return true;
case'form-open':{const F=FORMS[el.dataset.kind];if(!can(F.perm)){toast(DENIED);return true;}e.stopPropagation();openForm(el.dataset.kind,id);}return true;
case'form-close':closeForm();return true;
case'form-save':saveForm();return true;
case'form-del':{const F=FORMS[formKind];const d=S[F.col][formDraft.id];if(d){Store.del(F.col,d.id);logChange(F.kind,'delete',d.id,d.title||d.name,F.title+' supprimé',d);toast(F.title+' supprimé',()=>{Store.save(F.col,d);});}closeForm();}return true;
case'deal-next':{e.stopPropagation();if(!can('collabs')){toast(DENIED);return true;}const d=S.deals[id];if(!d)return true;const i=STAGES.findIndex(s=>s[0]===d.stage);const nx=STAGES[i+1];if(!nx)return true;
const x=clone(d);x.stage=nx[0];if(['signe','prod','livre','paye'].includes(x.stage)&&!x.signedAt)x.signedAt=today();Store.save('deals',x);logChange('deal','update',id,x.title,'Étape → '+nx[1],d);toast('« '+x.title+' » → '+nx[1]);}return true;
case'ct-copy':copyText(el.dataset.v,'Copié');return true;
case'ct-today':{const c=S.contacts[id];if(c){Store.save('contacts',Object.assign(clone(c),{lastContact:today()}));toast('Échange noté');}}return true;
case'msg-open':e.stopPropagation();if(!can('suivis')){toast(DENIED);return true;}openMsg(id);return true;
case'msg-close':closeMsg();return true;
case'msg-tone':msgTone=el.dataset.v;renderMsg();return true;
case'msg-copy':copyText($('#msg-text').value,'Message copié : colle-le dans WhatsApp ou ton e-mail',$('#msg-text'));return true;
case'receipt':e.stopPropagation();receiptPdf(id,el.dataset.pid);return true;
}
return false;
}
function viewSearch(){
const q=(S.ui.globalQ||'').trim();const ql=q.toLowerCase();const m=x=>String(x||'').toLowerCase().includes(ql);
let h='<div class="wrap"><div class="head"><div><span class="label">Recherche</span><h1>Rechercher</h1></div></div><div class="search" style="max-width:none">'+ICON.search+'<input class="inp" id="global-q" type="search" placeholder="Projet, idée, client, facture, contact…" value="'+esc(q)+'" data-input="globalq" autofocus></div>';
if(q.length<2)return h+'<p class="hint">Tape au moins 2 lettres.</p></div>';
const G=[];
const cs=contents().filter(c=>m(c.title)||m(c.notes)||m(c.caption)||m(c.hashtags)||(c.scenes||[]).some(s=>m(s.body)||m(s.heading))||(c.shoots||[]).some(s=>m(s.location)));
if(cs.length)G.push(['Projets et idées',cs.slice(0,12).map(c=>['peek',c.id,titleOf(c),statusOf(c.status).label+' · '+typeOf(c.type).label])]);
const cl=companies().filter(c=>m(c.label)||m(c.contact)||m(c.nif)||m(c.email));if(cl.length)G.push(['Clients',cl.map(c=>['go-client',c.id,c.label,[c.contact,c.phone].filter(Boolean).join(' · ')])]);
if(can('contacts')){const ct=contactsL().filter(c=>m(c.name)||m(c.role)||m(c.phone)||m(c.email));if(ct.length)G.push(['Contacts',ct.map(c=>['form-open:contact',c.id,c.name,[c.role,c.phone].filter(Boolean).join(' · ')])]);}
const dd=docs().filter(d=>can(d.kind==='devis'?'devis':'factures')&&(m(d.number)||m(d.subject)||m(d.clientSnap&&d.clientSnap.name)||m((compOf(d.companyId)||{}).label)||(d.lines||[]).some(l=>m(l.label))));
if(dd.length)G.push(['Devis et factures',dd.slice(0,12).map(d=>['doc-open',d.id,(d.kind==='devis'?'Devis ':'Facture ')+d.number,((d.clientSnap&&d.clientSnap.name)||'')+' · '+money(docTotals(d).total,d.currency)])]);
if(can('collabs')){const dl=deals().filter(d=>m(d.title)||m(d.notes)||m(d.deliverables));if(dl.length)G.push(['Partenariats',dl.map(d=>['form-open:deal',d.id,d.title,stageOf(d.stage)[1]])]);}
if(can('rdv')){const rv=Object.values(S.rdv).filter(x=>m(x.title)||m(x.contact)||m(x.location)||m(x.notes));if(rv.length)G.push(['Rendez-vous',rv.slice(0,10).map(x=>['rdv-open',x.id,x.title||'Rendez-vous',fmtShort(x.date)+(x.start?' · '+x.start:'')])]);}
if(can('projection')){const md=medias().filter(x=>m(x.title)||m(x.notes)||(x.comments||[]).some(c=>m(c.text)));if(md.length)G.push(['Projection',md.slice(0,10).map(x=>['pj-open',x.id,x.title||'Média',(x.kind==='rush'?'Rushs':'V'+(x.version||1))+' · '+(MSTATUS[x.status]||MSTATUS.attente)[0]])]);}
const acs=accounts().filter(a=>m(a.handle));if(acs.length)G.push(['Comptes',acs.map(a=>['filter-account',a.id,a.handle,platOf(a.platform).label])]);
if(!G.length)return h+'<div class="empty"><b>Aucun résultat</b>pour « '+esc(q)+' ».</div></div>';
h+=G.map(g=>'<section class="panel"><div class="panel-h"><h2>'+g[0]+'</h2><span class="mono muted">'+g[1].length+'</span></div><div class="rows">'+g[1].map(r=>{const[act,kind]=r[0].split(':');return'<div class="row"><button class="row-main" data-act="'+act+'"'+(kind?' data-kind="'+kind+'"':'')+' data-id="'+esc(r[1])+'"><b>'+esc(r[2])+'</b><span class="row-meta"><span>'+esc(r[3]||'')+'</span></span></button></div>';}).join('')+'</div></section>').join('');
return h+'</div>';
}
const SUPA_CFG=window.STUDIO_SUPA||null;
const LS_SUPA_OUT='studio-tefi-supa-outbox',LS_SUPA_CACHE='studio-tefi-supa-cache',SS_SOLO='studio-tefi-tab-solo';
const SUPA_ROLES={admin:'Admin',assistant:'Assistante',pending:'En attente',blocked:'Bloqué'};
const Supa={
sb:null,user:null,profile:null,step:'loading',err:'',info:'',state:'off',out:{},flushT:null,busy:false,ch:null,lastAt:0,lastFetch:0,empty:false,profiles:null,cacheT:null,retryT:null,
solo:ssGet(SS_SOLO)||'',
outKey(){return LS_SUPA_OUT+':'+(this.user&&this.user.id);},cacheKey(){return LS_SUPA_CACHE+':'+(this.user&&this.user.id);},
enabled(){return!!(SUPA_CFG&&SUPA_CFG.url&&SUPA_CFG.key&&!(window.claude&&window.claude.use));},
label(){return(this.solo?'Onglet séparé · ':'')+this.labelCore();},
labelCore(){return this.state==='offline'?'Hors ligne : tes changements partiront au retour du réseau':this.state==='sending'?'Enregistrement…':this.state==='error'?'Synchro en erreur':this.lastAt?'Synchronisé à '+pad(new Date(this.lastAt).getHours())+':'+pad(new Date(this.lastAt).getMinutes()):'Synchronisé en direct';},
setState(s){this.state=s;renderSync();},
async loadLib(){
if(window.supabase&&window.supabase.createClient)return true;
const urls=(SUPA_CFG.lib||[]);
for(const u of urls){const ok=await new Promise(res=>{const s=document.createElement('script');s.src=u;s.onload=()=>res(true);s.onerror=()=>res(false);document.head.appendChild(s);});if(ok&&window.supabase&&window.supabase.createClient)return true;}
return false;
},
async start(){
if(!(await this.loadLib()))return false;
const auth={persistSession:true,autoRefreshToken:true,detectSessionInUrl:!this.solo,storageKey:this.solo||'studio-tefi-auth'};
if(this.solo)auth.storage={getItem:k=>{try{return sessionStorage.getItem(k);}catch(e){return null;}},setItem:(k,v)=>{try{sessionStorage.setItem(k,v);}catch(e){}},removeItem:k=>{try{sessionStorage.removeItem(k);}catch(e){}}};
try{this.sb=window.supabase.createClient(SUPA_CFG.url,SUPA_CFG.key,{auth});}catch(e){return false;}
S.mode='supa';ROLE='';S.loaded=true;this.out={};
if(/type=recovery/.test(location.hash))this.step='recover';
this.sb.auth.onAuthStateChange((ev,session)=>{setTimeout(()=>{
if(ev==='PASSWORD_RECOVERY'){this.step='recover';render();return;}
if(ev==='SIGNED_OUT'){this.reset();return;}
if(session&&session.user&&(!this.user||this.user.id!==session.user.id)&&this.step!=='recover')this.onSession(session);
},0);});
let session=null;try{const r=await this.sb.auth.getSession();session=r.data&&r.data.session;}catch(e){}
if(session&&this.step!=='recover')await this.onSession(session);else if(this.step!=='recover'){this.step=this.solo?'login':'landing';render();}
window.addEventListener('online',()=>{this.flush();this.refresh();});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&ROLE&&Date.now()-this.lastFetch>60000)this.refresh();else if(document.visibilityState==='hidden')this.flush();});
return true;
},
reset(){touch();this.user=null;this.profile=null;this.profiles=null;ROLE='';if(this.ch){try{this.sb.removeChannel(this.ch);}catch(e){}this.ch=null;}
Object.keys(COLS).forEach(c=>{S[c]={};});S.settings=null;S.history=[];this.step='login';this.setState('off');render();},
async onSession(session){
this.user=session.user;this.step='loading';this.out=lsGet(this.outKey())||{};render();
let p=null,err=null;
try{const r=await this.sb.from('profiles').select('*').eq('id',this.user.id).maybeSingle();p=r.data;err=r.error;}catch(e){err=e;}
const cache=lsGet(this.cacheKey());
if(err&&!p){
if(cache&&cache.uid===this.user.id&&cache.role&&isNetErr(err)){p={id:this.user.id,email:this.user.email,role:cache.role};this.setState('offline');}
else{this.step='error';this.err=/profiles|relation|schema/i.test(errMsg(err))?'La base n\'est pas encore installée : lance le script supabase-setup.sql dans Supabase.':'Connexion impossible : '+errMsg(err);render();return;}
}
if(!p){this.step='error';this.err='Profil introuvable. Lance (ou relance) le script supabase-setup.sql dans Supabase, puis reconnecte-toi.';render();return;}
this.profile=p;
if(!['admin','assistant'].includes(p.role)){this.step=p.role==='blocked'?'blocked':'pending';render();return;}
ROLE=p.role;this.step='in';
if(cache&&cache.uid===this.user.id&&cache.data){applyLocal(cache.data);this.applyOut();}
afterLoad();render();
await this.refresh(true);
this.listen();this.flush();
},
async fetchAll(){
const rows=[];let from=0;const N=1000;
for(;;){const r=await this.sb.from('items').select('col,id,data,deleted,updated_at').neq('col','history').eq('deleted',false).order('col').order('id').range(from,from+N-1);
if(r.error)throw r.error;rows.push(...r.data);if(r.data.length<N)break;from+=N;}
const hr=await this.sb.from('items').select('id,data').eq('col','history').order('updated_at',{ascending:false}).limit(HMAX_CLOUD);
const st=await this.sb.from('app_settings').select('data').eq('id','main').maybeSingle();
if(st.error)throw st.error;
return{rows,hist:hr.error?[]:hr.data,settings:st.data?st.data.data:null};
},
async refresh(first){
if(!this.sb||!ROLE)return;
try{const d=await this.fetchAll();this.lastFetch=Date.now();
Object.keys(COLS).forEach(c=>{S[c]={};});
d.rows.forEach(r=>{if(!COLS[r.col])return;const x=Object.assign({},r.data,{id:r.id});S[r.col][r.id]=r.col==='contents'?normContent(x):x;});
S.settings=d.settings;S.history=d.hist.map(h=>Object.assign({},h.data,{id:h.id})).sort((a,b)=>(b.at||0)-(a.at||0));
this.empty=!d.rows.length&&!d.settings;
this.applyOut();this.lastAt=Date.now();if(this.state!=='sending')this.setState('ok');this.saveCache();
if(first){afterLoad();setTimeout(migrateLogos,1500);}scheduleRender();
}catch(e){this.setState(isNetErr(e)?'offline':'error');this.err=errMsg(e);if(!isNetErr(e))toast('Synchro : '+this.err);}
},
applyOut(){Object.values(this.out).forEach(o=>{
if(o.settings){S.settings=o.settings;return;}
if(o.col==='history'){if(!S.history.some(h=>h.id===o.id))S.history.unshift(o.data);return;}
if(!COLS[o.col])return;if(o.deleted)delete S[o.col][o.id];else S[o.col][o.id]=o.col==='contents'?normContent(clone(o.data)):clone(o.data);});},
listen(){
if(this.ch)return;
this.ch=this.sb.channel('studio-tefi')
.on('postgres_changes',{event:'*',schema:'public',table:'items'},p=>this.onRow(p))
.on('postgres_changes',{event:'*',schema:'public',table:'app_settings'},p=>{if(p.new&&p.new.data&&!this.out.settings){S.settings=p.new.data;this.lastAt=Date.now();renderSync();this.saveCache();scheduleRender();}})
.subscribe(status=>{if(status==='SUBSCRIBED'){if(this.wasDown){this.wasDown=false;this.refresh();}}else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'||status==='CLOSED'){this.wasDown=true;}});
},
onRow(p){
const r=p.eventType==='DELETE'?p.old:p.new;if(!r||!r.col||!r.id)return;
const key=r.col+':'+r.id;if(this.out[key])return;
if(r.col==='history'){if(p.eventType!=='DELETE'&&r.data&&!S.history.some(h=>h.id===r.id)){S.history.unshift(Object.assign({},r.data,{id:r.id}));S.history=S.history.slice(0,HMAX_CLOUD);}}
else if(!COLS[r.col])return;
else if(p.eventType==='DELETE'||r.deleted)delete S[r.col][r.id];
else{const x=Object.assign({},r.data,{id:r.id});S[r.col][r.id]=r.col==='contents'?normContent(x):x;}
this.lastAt=Date.now();renderSync();this.saveCache();scheduleRender();
},
saveCache(){clearTimeout(this.cacheT);this.cacheT=setTimeout(()=>{if(this.user&&ROLE)lsSet(this.cacheKey(),{uid:this.user.id,role:ROLE,data:localPayload()});},1500);},
queue(key,o){this.out[key]=o;lsSet(this.outKey(),this.out);this.saveCache();clearTimeout(this.flushT);this.flushT=setTimeout(()=>this.flush(),400);},
put(col,id,data,deleted){this.queue(col+':'+id,{col,id,data:clone(data||{}),deleted:!!deleted});},
hist(e){this.queue('history:'+e.id,{col:'history',id:e.id,data:clone(e)});},
setSettings(s){this.queue('settings',{settings:clone(s)});},
async send(list){
const items=list.filter(o=>o.col&&o.col!=='history').map(o=>({col:o.col,id:o.id,data:o.data,deleted:o.deleted}));
const hist=list.filter(o=>o.col==='history').map(o=>({col:'history',id:o.id,data:o.data}));
const st=list.find(o=>o.settings);
if(st){const r=await this.sb.from('app_settings').upsert({id:'main',data:st.settings},{onConflict:'id'});if(r.error)throw r.error;}
for(let i=0;i<items.length;i+=400){const r=await this.sb.from('items').upsert(items.slice(i,i+400),{onConflict:'col,id'});if(r.error)throw r.error;}
if(hist.length){let r=await this.sb.from('items').insert(hist);if(r.error&&r.error.code==='23505'){for(const h of hist){r=await this.sb.from('items').insert(h);if(r.error&&r.error.code!=='23505')throw r.error;}}else if(r.error)throw r.error;}
},
async flush(){
if(!this.sb||!ROLE||this.busy)return;const keys=Object.keys(this.out);if(!keys.length)return;
clearTimeout(this.flushT);clearTimeout(this.retryT);this.busy=true;this.setState('sending');
const snap={};keys.forEach(k=>{snap[k]=this.out[k];});
const done=k=>{if(this.out[k]===snap[k])delete this.out[k];};
try{await this.send(keys.map(k=>snap[k]));keys.forEach(done);this.lastAt=Date.now();this.setState('ok');}
catch(e){
if(isNetErr(e)){this.setState('offline');this.retryT=setTimeout(()=>this.flush(),15000);}
else{
let refused=0,msg=errMsg(e);
for(const k of keys){try{await this.send([snap[k]]);done(k);}catch(e2){if(isNetErr(e2)){this.setState('offline');break;}refused++;msg=errMsg(e2);done(k);}}
if(refused){toast(/row-level security/.test(msg)?'Refusé par la sécurité du compte. Si ça continue, relance le script supabase-setup.sql dans Supabase.':'Refusé par la sécurité du compte : '+msg);this.refresh();}
if(this.state!=='offline')this.setState('ok');
}
}
lsSet(this.outKey(),this.out);this.busy=false;
if(Object.keys(this.out).length&&this.state==='ok'){this.flushT=setTimeout(()=>this.flush(),400);}
},
urls:{},
async upload(id,blob){const path=id+'.jpg';const r=await this.sb.storage.from('photos').upload(path,blob,{contentType:'image/jpeg',upsert:true});if(r.error)throw r.error;return{store:'supa',ref:path};},
photoUrl(ref){const c=this.urls[ref];if(c&&c.u&&c.exp>Date.now())return c.u;
if(!c||!c.loading){this.urls[ref]={loading:true};(async()=>{try{const r=await this.sb.storage.from('photos').createSignedUrl(ref,6*3600);if(r.error)throw r.error;this.urls[ref]={u:r.data.signedUrl,exp:Date.now()+5*3600e3};scheduleRender();}catch(e){setTimeout(()=>{delete this.urls[ref];},30000);}})();}
return'';},
async signIn(email,pw){this.info='';const r=await this.sb.auth.signInWithPassword({email,password:pw});if(r.error){this.err=authMsg(r.error);render();}},
async signUp(email,pw){const r=await this.sb.auth.signUp({email,password:pw,options:{emailRedirectTo:location.origin+location.pathname}});
if(r.error){this.err=authMsg(r.error);render();return;}
if(!r.data.session){this.step='sent';this.info=email;render();}},
async forgot(email){const r=await this.sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});
if(r.error){this.err=authMsg(r.error);render();return;}this.step='sentreset';this.info=email;render();},
async newPassword(pw){const r=await this.sb.auth.updateUser({password:pw});if(r.error){this.err=authMsg(r.error);render();return;}
history.replaceState(null,'',location.pathname);toast('Nouveau mot de passe enregistré');this.step='loading';const s=await this.sb.auth.getSession();if(s.data.session)this.onSession(s.data.session);else{this.step='login';render();}},
async signOut(){await this.flush();const ck=this.cacheKey();try{await this.sb.auth.signOut({scope:'local'});}catch(e){}try{localStorage.removeItem(ck);}catch(e){}this.reset();},
async tabSolo(){await this.flush();ssSet(SS_SOLO,'studio-tefi-auth-tab-'+Date.now().toString(36));location.reload();},
async tabMain(){await this.flush();try{await this.sb.auth.signOut({scope:'local'});}catch(e){}ssSet(SS_SOLO,'');location.reload();},
async loadProfiles(){const r=await this.sb.from('profiles').select('*').order('created_at');if(!r.error){this.profiles=r.data;scheduleRender();}else toast('Comptes : '+errMsg(r.error));},
async setProfileRole(id,role){const r=await this.sb.from('profiles').update({role}).eq('id',id);if(r.error)toast(errMsg(r.error));else toast('Compte mis à jour');this.loadProfiles();},
async importLocal(){
const d=lsGet(LS_DATA);if(!d){toast('Aucune donnée trouvée sur cet appareil. Utilise « Importer un fichier ».');return;}
const payload=Object.assign({app:'studio-tefi'},d);Object.keys(COLS).forEach(c=>{payload[c]=Object.values(d[c]||{});});
toast('Import en cours…');
await this.migratePhotos(payload.media||[]);
if(d.settings&&typeof d.settings==='object'&&!Array.isArray(d.settings.types))Store.saveSettings(d.settings);
importData(JSON.stringify(payload));
(d.history||[]).slice(0,HMAX_CLOUD).forEach(h=>{if(h&&h.id)this.hist(h);});
this.empty=false;await this.flush();
},
async migratePhotos(list){
let files=null;const gist=lsGet(LS_GIST);
for(const m of list){const p=m&&m.photo;if(!p||p.store==='supa'||p.store==='asset')continue;
try{let du='';
if(p.store==='idb')du=await idbGet(p.ref);
else if(p.store==='gist'&&gist&&gist.token&&gist.gistId){if(!files){Sync.cfg=gist;await Sync.fetchRemote();files=Sync.files;Sync.cfg=null;}if(files[p.ref])du=await(await fetch(files[p.ref])).text();}
if(!du)continue;const blob=await(await fetch(du)).blob();const np=await this.upload(m.id,blob);m.photo=Object.assign({},p,np);
}catch(e){}}
},
gate(){
const st=this.step,e=this.err?'<p class="supa-err">'+esc(this.err)+'</p>':'';
if(st==='landing')return landingHtml();
let h='<div class="gate"><div class="gate-brand"><div class="brand-mark">T</div><div><h1>Studio Tefi</h1><span class="muted">'+(st==='signup'?'Créer ton compte':st==='forgot'?'Mot de passe oublié':st==='recover'?'Nouveau mot de passe':'Connexion')+'</span></div></div>';
const em='<input class="inp" id="sb-email" type="email" autocomplete="email" placeholder="Adresse e-mail" aria-label="Adresse e-mail" required>';
if(st==='loading')h+='<section class="panel"><p class="muted" style="margin:0">Connexion en cours…</p></section>';
else if(st==='login')h+='<form class="panel supa-form" data-form="sb-login"><h2>Se connecter</h2>'+e+em+'<input class="inp" id="sb-pw" type="password" autocomplete="current-password" placeholder="Mot de passe" aria-label="Mot de passe" required><button class="btn primary" type="submit">Se connecter</button>'+
'<div class="supa-links"><button type="button" class="btn ghost small" data-act="sb-step" data-step="signup">Pas de compte ? Inscris-toi</button><button type="button" class="btn ghost small" data-act="sb-step" data-step="forgot">Mot de passe oublié</button></div></form>';
else if(st==='signup')h+='<form class="panel supa-form" data-form="sb-signup"><h2>Créer mon compte</h2><p class="muted" style="margin:0">Le tout premier compte devient l\'admin. Les suivants attendent ta validation.</p>'+e+em+
'<input class="inp" id="sb-pw" type="password" autocomplete="new-password" placeholder="Mot de passe (8 caractères minimum)" aria-label="Mot de passe" minlength="8" required><input class="inp" id="sb-pw2" type="password" autocomplete="new-password" placeholder="Confirmer le mot de passe" aria-label="Confirmer le mot de passe" required>'+
'<button class="btn primary" type="submit">Créer mon compte</button><div class="supa-links"><button type="button" class="btn ghost small" data-act="sb-step" data-step="login">J\'ai déjà un compte</button></div></form>';
else if(st==='forgot')h+='<form class="panel supa-form" data-form="sb-forgot"><h2>Mot de passe oublié</h2><p class="muted" style="margin:0">Tu vas recevoir un lien par e-mail pour en choisir un nouveau.</p>'+e+em+
'<button class="btn primary" type="submit">Envoyer le lien</button><div class="supa-links"><button type="button" class="btn ghost small" data-act="sb-step" data-step="login">Retour</button></div></form>';
else if(st==='recover')h+='<form class="panel supa-form" data-form="sb-recover"><h2>Choisis un nouveau mot de passe</h2>'+e+
'<input class="inp" id="sb-pw" type="password" autocomplete="new-password" placeholder="Nouveau mot de passe" aria-label="Nouveau mot de passe" minlength="8" required><button class="btn primary" type="submit">Enregistrer</button></form>';
else if(st==='sent'||st==='sentreset')h+='<section class="panel supa-form"><h2>Regarde tes e-mails</h2><p style="margin:0">Un lien a été envoyé à <b>'+esc(this.info)+'</b>. '+(st==='sent'?'Clique dessus pour confirmer ton compte : tu reviendras ici, connectée.':'Clique dessus pour choisir un nouveau mot de passe.')+'</p><p class="hint" style="margin:0">Rien reçu ? Regarde dans les spams.</p><div class="supa-links"><button class="btn ghost small" data-act="sb-step" data-step="login">Retour à la connexion</button></div></section>';
else if(st==='pending'||st==='blocked')h+='<section class="panel supa-form"><h2>'+(st==='pending'?'Compte en attente':'Accès coupé')+'</h2><p style="margin:0">'+(st==='pending'?'Ton compte <b>'+esc(this.user&&this.user.email||'')+'</b> est bien créé. L\'admin doit maintenant le valider dans Réglages → Comptes.':'L\'admin a coupé l\'accès de ce compte.')+'</p>'+
'<div class="supa-links"><button class="btn" data-act="sb-recheck">Vérifier à nouveau</button><button class="btn ghost" data-act="sb-out">Se déconnecter</button></div></section>';
else if(st==='error')h+='<section class="panel supa-form"><h2>Petit souci</h2><p class="supa-err">'+esc(this.err)+'</p><div class="supa-links"><button class="btn" data-act="sb-recheck">Réessayer</button><button class="btn ghost" data-act="sb-out">Se déconnecter</button></div></section>';
if(this.solo)h+='<p class="hint" style="margin:0">Onglet séparé : le compte connecté ici n\'affecte pas tes autres onglets. Fermer l\'onglet le déconnecte. <button class="btn ghost small" data-act="sb-tab-main">Revenir au compte principal</button></p>';
else if(['login','signup','forgot'].includes(st))h+='<button class="btn ghost small" style="align-self:center" data-act="sb-step" data-step="landing">← Retour à l\'accueil</button>';
return h+'</div>';
},
banner(){
if(!isAdmin()||!this.empty)return'';
const hasLocal=!!lsGet(LS_DATA);
return'<section class="panel supa-banner"><div><b>Ton compte en ligne est vide.</b><p class="muted" style="margin:4px 0 0">'+(hasLocal?'Ton planning de l\'ancienne version est encore sur cet appareil : récupère-le en un clic, photos comprises.':'Importe ta sauvegarde (.json) exportée depuis l\'ancienne version.')+'</p></div>'+
'<div class="supa-links">'+(hasLocal?'<button class="btn primary" data-act="sb-import-local">Récupérer les données de cet appareil</button>':'')+'<button class="btn" data-act="import">Importer un fichier</button><button class="btn ghost small" data-act="sb-dismiss">Plus tard</button></div></section>';
},
panel(){
const p=this.profile||{};
let h='<div class="sync-box"><p style="margin:0">Connectée : <b>'+esc(p.email||(this.user&&this.user.email)||'')+'</b> · '+esc(SUPA_ROLES[p.role]||'')+'</p>'+
'<p style="margin:0"><b>'+esc(this.label())+'</b>'+(Object.keys(this.out).length?' · <span class="muted">'+plural(Object.keys(this.out).length,'changement')+' en attente</span>':'')+'</p>'+
'<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-act="sb-refresh">Actualiser</button>'+(isAdmin()?'<button class="btn" data-act="sb-import-local">Récupérer les données de cet appareil</button>':'')+'<button class="btn danger" data-act="sb-out" data-confirm="Confirmer la déconnexion">Se déconnecter</button></div>'+
(this.solo?'<p class="hint" style="margin:0">Cet onglet est séparé : son compte n\'affecte pas tes autres onglets.</p><div><button class="btn" data-act="sb-tab-main">Revenir au compte principal</button></div>'
:'<p class="hint" style="margin:0">Pour tester avec un autre compte (ex. ton compte assistante de test), ouvre un nouvel onglet puis :</p><div><button class="btn" data-act="sb-tab-solo">Se connecter avec un autre compte dans cet onglet</button></div>')+'</div>';
if(isAdmin()){
if(!this.profiles){this.profiles=[];this.loadProfiles();}
h+='<hr style="border:0;border-top:1px solid var(--line);margin:14px 0"><span class="label">Comptes</span><p class="hint" style="margin:4px 0 10px">Ton assistante crée son compte depuis la page de connexion, puis tu la passes en « Assistante » ici.</p><div class="supa-accounts">'+
this.profiles.map(x=>'<div class="supa-acc"><span>'+esc(x.email||'')+(x.id===(this.user&&this.user.id)?' <span class="muted">(toi)</span>':'')+'</span>'+
(x.id===(this.user&&this.user.id)?'<span class="pill plain">Admin</span>':'<select class="inp" data-sbrole="'+esc(x.id)+'" aria-label="Rôle de '+esc(x.email||'')+'">'+Object.keys(SUPA_ROLES).map(k=>'<option value="'+k+'"'+(x.role===k?' selected':'')+'>'+SUPA_ROLES[k]+'</option>').join('')+'</select>')+'</div>').join('')+'</div>';
}
return h;
},
click(a,el){
switch(a){
case'sb-step':this.step=el.dataset.step;this.err='';render();return true;
case'sb-out':this.signOut();return true;
case'sb-recheck':this.err='';if(this.user)this.sb.auth.getSession().then(r=>{if(r.data.session)this.onSession(r.data.session);else{this.step='login';render();}});else{this.step='login';render();}return true;
case'sb-refresh':this.flush().then(()=>this.refresh());toast('Actualisation…');return true;
case'sb-import-local':this.importLocal();return true;
case'sb-dismiss':this.empty=false;render();return true;
case'sb-tab-solo':this.tabSolo();return true;
case'sb-tab-main':this.tabMain();return true;
}
return false;
},
submit(k){
const v=id=>(($('#'+id)||{}).value||'').trim();this.err='';
if(k==='sb-login'){this.signIn(v('sb-email'),$('#sb-pw').value);return true;}
if(k==='sb-signup'){if($('#sb-pw').value!==$('#sb-pw2').value){this.err='Les deux mots de passe ne sont pas identiques.';render();return true;}this.signUp(v('sb-email'),$('#sb-pw').value);return true;}
if(k==='sb-forgot'){this.forgot(v('sb-email'));return true;}
if(k==='sb-recover'){this.newPassword($('#sb-pw').value);return true;}
return false;
}
};
function errMsg(e){return(e&&(e.message||e.error_description||e.msg))||String(e||'erreur');}
function isNetErr(e){const m=errMsg(e);return!navigator.onLine||/Failed to fetch|NetworkError|Load failed|network|fetch/i.test(m)&&!(e&&e.code&&/^[0-9A-Z]{5}$/.test(e.code));}
function authMsg(e){const m=errMsg(e);
if(/Invalid login credentials/i.test(m))return'E-mail ou mot de passe incorrect.';
if(/Email not confirmed/i.test(m))return'Confirme d\'abord ton adresse avec le lien reçu par e-mail.';
if(/already registered|already been registered/i.test(m))return'Un compte existe déjà avec cette adresse : connecte-toi.';
if(/at least|weak|short/i.test(m))return'Mot de passe trop court ou trop simple (8 caractères minimum).';
if(/rate limit|too many/i.test(m))return'Trop d\'essais : attends quelques minutes.';
if(isNetErr(e))return'Pas de connexion internet.';
return m;}
const UI_THEMES=[
{id:'studio',label:'Studio',l:['#F5F5FA','#FFFFFF','#ECECF3','#DDDDE7','#4636D9','#FFFFFF','#E7E4FF'],d:['#0E0E14','#17161F','#211F2C','#2E2C3B','#9389FF','#0E0E14','#25214A']},
{id:'jardin',label:'Jardin',l:['#F1F6F2','#FFFFFF','#E5EEE8','#D3E0D8','#2E7D5B','#FFFFFF','#DAEFE3'],d:['#0B120F','#131C18','#1A2620','#283832','#5FCB9C','#0B1410','#163428']},
{id:'terracotta',label:'Terracotta',l:['#F8F3EE','#FFFFFF','#F0E7DF','#E4D6CA','#B4491F','#FFFFFF','#F8E1D6'],d:['#14100D','#1E1814','#29211C','#3A2E27','#F08A5D','#170D08','#3A2219']},
{id:'ocean',label:'Océan',l:['#F1F6F8','#FFFFFF','#E3EDF1','#D0E0E6','#0E7490','#FFFFFF','#D5EEF4'],d:['#0B1215','#121B20','#1A262C','#27363E','#4CC3DD','#061418','#123039']},
{id:'prune',label:'Prune',l:['#F7F2F7','#FFFFFF','#EEE5EE','#E0D2E0','#8E3B8A','#FFFFFF','#F3DDF1'],d:['#120D12','#1B151B','#261D26','#372A37','#D88AD3','#150A14','#3A2238']},
{id:'vanille',label:'Vanille',l:['#F8F5EC','#FFFFFF','#EFEADB','#E2DAC4','#8F6100','#FFFFFF','#F6EBCB'],d:['#13110B','#1C1912','#27231A','#3A3426','#E6B655','#151005','#3A3018']},
{id:'rose',label:'Rose poudré',l:['#F9F2F4','#FFFFFF','#F1E5E9','#E5D3D9','#B8325E','#FFFFFF','#F8DCE5'],d:['#140D10','#1E1519','#2A1D23','#3D2A32','#F07FA3','#1A0A10','#40202D']},
{id:'nuit',label:'Nuit',dark:true,l:['#0E0E14','#17161F','#211F2C','#2E2C3B','#9389FF','#0E0E14','#25214A'],d:['#0E0E14','#17161F','#211F2C','#2E2C3B','#9389FF','#0E0E14','#25214A']}
];
const UI_DEFAULT={admin:'studio',assistant:'jardin'};
function hexLum(h){const m=/^#?([0-9a-f]{6})$/i.exec(h||'');if(!m)return 0;const n=parseInt(m[1],16);const c=[n>>16&255,n>>8&255,n&255].map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);});return.2126*c[0]+.7152*c[1]+.0722*c[2];}
function uiThemeOf(who){const u=settings().uiThemes||{};const id=u[who]||UI_DEFAULT[who];
if(id==='custom'){const a=/^#[0-9a-f]{6}$/i.test((u.custom||{})[who]||'')?u.custom[who]:'#4636D9';const fg=hexLum(a)>.4?'#111111':'#FFFFFF';
return{id:'custom',label:'Couleur perso',accent:a,
l:['color-mix(in srgb,'+a+' 4%,#F7F7FA)','#FFFFFF','color-mix(in srgb,'+a+' 8%,#EEEEF3)','color-mix(in srgb,'+a+' 14%,#DDDDE7)',a,fg,'color-mix(in srgb,'+a+' 16%,#FFFFFF)'],
d:['color-mix(in srgb,'+a+' 6%,#0E0E14)','color-mix(in srgb,'+a+' 6%,#17161F)','color-mix(in srgb,'+a+' 9%,#211F2C)','color-mix(in srgb,'+a+' 14%,#2E2C3B)','color-mix(in srgb,'+a+' 70%,#FFFFFF)','#0E0E14','color-mix(in srgb,'+a+' 28%,#0E0E14)']};}
return UI_THEMES.find(t=>t.id===id)||UI_THEMES.find(t=>t.id===UI_DEFAULT[who]);}
function themeVars(v,dark){return'--bg:'+v[0]+';--surface:'+v[1]+';--surface-2:'+v[2]+';--line:'+v[3]+';--accent:'+v[4]+';--accent-fg:'+v[5]+';--accent-soft:'+v[6]+';'+
(dark?'--fg:#ECEBF4;--muted:#9C9AAE;--late:#FF6E5A;--ok:#33C79F;--warn:#F0B429;--shadow:0 1px 2px rgba(0,0,0,.4),0 8px 24px rgba(0,0,0,.3);color-scheme:dark;':'');}
let uiThemeCss='';
function applyUiTheme(){
let css='';
['admin','assistant'].forEach(who=>{const t=uiThemeOf(who);const sel='body[data-role="'+who+'"].th-on';
if(t.dark){css+=':root '+sel+','+':root:not([data-theme="light"]) '+sel+'.th-on,:root[data-theme="dark"] '+sel+'.th-on{'+themeVars(t.d,true)+'}';}
else{css+=':root '+sel+'{'+themeVars(t.l,false)+'}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) '+sel+'.th-on{'+themeVars(t.d,false)+'}}:root[data-theme="dark"] '+sel+'.th-on{'+themeVars(t.d,false)+'}';}
css+=sel+' .brand-mark,'+sel+' .nav-new,'+sel+' .fab{background:var(--accent);color:var(--accent-fg)}';});
if(css!==uiThemeCss){uiThemeCss=css;let el=document.getElementById('ui-theme');if(!el){el=document.createElement('style');el.id='ui-theme';document.head.appendChild(el);}el.textContent=css;}
document.body.classList.add('th-on');
}
function uiThemePanel(){
const u=settings().uiThemes||{};
const row=(who,title)=>{const cur=u[who]||UI_DEFAULT[who];const cc=(u.custom||{})[who]||'#C2416B';
return'<div class="th-row"><span class="label">'+esc(title)+'</span><div class="th-grid">'+UI_THEMES.map(t=>
'<button type="button" class="th-sw" data-act="ui-theme" data-who="'+who+'" data-t="'+t.id+'" aria-pressed="'+(cur===t.id)+'" style="--sb:'+t.l[0]+';--sa:'+t.l[4]+';--ss:'+t.l[6]+';--sd:'+t.d[0]+'"><span class="th-prev"><i></i><i></i><i></i></span>'+esc(t.label)+'</button>').join('')+
'<label class="th-sw th-custom" aria-pressed="'+(cur==='custom')+'" style="--sa:'+esc(cc)+'"><span class="th-prev"><input type="color" value="'+esc(cc)+'" data-ui-custom="'+who+'" aria-label="Couleur perso"></span>Couleur perso</label></div></div>';};
return'<section class="panel"><div class="panel-h"><h2>Couleurs de l\'interface</h2></div><p class="hint" style="margin:-4px 0 12px">Choisis l\'assemblage de couleurs de chaque vue. Il s\'applique sur tous les appareils. Chaque thème a sa version sombre quand l\'appareil est en mode nuit.</p>'+
row('admin','Ta vue (admin)')+row('assistant','Vue de '+roleName('assistant'))+'</section>';
}
const LS_NAVMINI='studio-tefi-nav-mini';
function applyNavMini(){document.body.classList.toggle('nav-mini',!!lsGet(LS_NAVMINI));const b=$('#nav-toggle');if(b){const on=!!lsGet(LS_NAVMINI);b.setAttribute('aria-label',on?'Afficher le menu':'Réduire le menu');b.title=on?'Afficher le menu':'Réduire le menu';}
document.querySelectorAll('#nav .nav-btn').forEach(x=>{const t=(x.textContent||'').replace(/\s+/g,' ').replace(/\d+$/,'').trim();if(t)x.title=t;});}
const OPEN={};
function miniRow(key,color,name,meta,acts,editLabel){
return'<section class="panel mini-row"><span class="dot" style="--c:'+esc(color||'#8A8FA3')+'"></span><div class="mini-main"><b>'+esc(name)+'</b>'+(meta?'<span class="hint">'+esc(meta)+'</span>':'')+'</div>'+
'<div class="mini-acts">'+acts+'<button class="btn small" data-act="fold" data-key="'+esc(key)+'">'+ICON_EDIT+esc(editLabel)+'</button></div></section>';}
const ICON_EDIT='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>';
const foldBtn=key=>'<button class="btn small ghost" data-act="fold" data-key="'+esc(key)+'">Réduire</button>';
function profMini(p,used){const meta=[p.activity,p.country,p.nif?'NIF '+p.nif:'',p.email].filter(Boolean).join(' · ');
return miniRow('prof:'+p.id,p.color||'#4636D9',p.name||'Sans nom',meta+(meta?' · ':'')+plural(used,'document'),
'<button class="btn small" data-act="doc-new" data-kind="facture" data-prof="'+esc(p.id)+'">'+ICON.plus+'Facture</button><button class="btn small" data-act="doc-new" data-kind="devis" data-prof="'+esc(p.id)+'">'+ICON.plus+'Devis</button>','Modifier');}
function clientMini(c,next,pj,nd,ed){const meta=[c.contact,c.country,c.email,next?'RDV '+fmtShort(next.date):'',nd?plural(nd,'document'):''].filter(Boolean).join(' · ');
return miniRow('cl:'+c.id,c.color,c.label||'Sans nom',meta,
(can('devis')?'<button class="btn small" data-act="doc-new" data-kind="devis" data-comp="'+esc(c.id)+'">'+ICON.plus+'Devis</button>':'')+(can('factures')?'<button class="btn small" data-act="doc-new" data-kind="facture" data-comp="'+esc(c.id)+'">'+ICON.plus+'Facture</button>':''),ed?'Modifier':'Voir la fiche');}
function accStats(a){const t=today();let prep=0,pub=0,next=null;
contents().forEach(c=>(c.publications||[]).forEach(p=>{if(p.accountId!==a.id)return;
if(p.done||c.status==='publie')pub++;else{prep++;if(isValidDate(p.date)&&p.date>=t&&(!next||p.date<next.date))next={date:p.date,time:p.time,title:titleOf(c)};}}));
return{prep,pub,next};}
function accSummaryPanel(){
const accs=accounts();if(!accs.length)return'';const st=settings();const ed=can('accounts');
return'<section class="panel"><div class="panel-h"><h2>Résumé des comptes</h2><span class="mono muted">'+accs.length+'</span></div><div class="acc-sum">'+accs.map(a=>{const s=accStats(a);const pl=platOf(a.platform);const styles=(a.styles||[]).map(id=>themeOf(id)).filter(Boolean);
const open=OPEN['acc:'+a.id];
let h='<div class="acc-card"><div class="acc-card-h"><span class="dot" style="--c:'+esc(pl.color)+'"></span><div class="mini-main"><b>'+esc(a.handle)+'</b><span class="hint">'+esc(pl.label)+'</span></div>'+natBadge(a)+'</div>'+
'<div class="acc-nums"><div><b>'+s.prep+'</b><span>en préparation</span></div><div><b>'+s.pub+'</b><span>publiés</span></div><div><b>'+(a.followers?esc(compactNum(a.followers)):'—')+'</b><span>abonnés</span></div></div>'+
'<p class="acc-next">'+(s.next?'Prochaine : <b>'+esc(fmtShort(s.next.date))+(s.next.time?' · '+esc(s.next.time):'')+'</b> · '+esc(s.next.title):'<span class="muted">Aucune publication prévue</span>')+'</p>'+
'<div class="card-f">'+(styles.length?styles.map(t=>'<span class="pill plain">'+esc(t.label)+'</span>').join(''):'<span class="hint">Style non défini</span>')+'</div>'+(a.tone?'<p class="acc-tone">« '+esc(a.tone)+' »</p>':'');
if(open&&ed){h+='<div class="acc-style"><span class="label">Style de contenu</span><div class="chip-pick">'+st.themes.map(t=>'<button type="button" data-act="acc-style" data-id="'+esc(a.id)+'" data-t="'+esc(t.id)+'" aria-pressed="'+(a.styles||[]).includes(t.id)+'">'+esc(t.label)+'</button>').join('')+'</div>'+
'<label class="field"><span>Ton et ligne éditoriale</span><input class="inp" id="acc-tone-'+esc(a.id)+'" data-acc-tone="'+esc(a.id)+'" value="'+esc(a.tone||'')+'" placeholder="Ex. : fun, face caméra, vidéos courtes"></label>'+
'<div class="card-f"><button class="btn small" data-act="fold" data-key="acc:'+esc(a.id)+'">Terminé</button><span class="hint">Les thématiques se gèrent dans Réglages.</span></div></div>';}
else if(ed)h+='<div class="card-f"><button class="btn small ghost" data-act="fold" data-key="acc:'+esc(a.id)+'">'+ICON_EDIT+'Définir le style</button></div>';
return h+'</div>';}).join('')+'</div></section>';
}
function compactNum(n){n=+n||0;return n>=1e6?(n/1e6).toFixed(1).replace('.0','').replace('.',',')+' M':n>=1e4?Math.round(n/1e3)+' k':n>=1e3?(n/1e3).toFixed(1).replace('.0','').replace('.',',')+' k':String(n);}
function matchingAccounts(c){const th=c.themes||[];if(!th.length)return[];const used=new Set((c.publications||[]).map(p=>p.accountId));
return accounts().filter(a=>(a.styles||[]).some(id=>th.includes(id))&&!used.has(a.id));}
function suggestAccHtml(c){const m=matchingAccounts(c);if(!m.length)return'';
return'<div class="acc-suggest"><span class="hint">Comptes qui correspondent aux thématiques :</span>'+m.map(a=>'<button class="btn small" data-act="ed-addpub-acc" data-acc="'+esc(a.id)+'">'+ICON.plus+esc(a.handle)+'</button>').join('')+'</div>';}
function landingHtml(){
const ic=p=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>';
const feats=[
[ic('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),'Planning & calendrier','Toutes les publications, les tournages et les rendez-vous au même endroit, au jour, à la semaine ou au mois.'],
[ic('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3z"/>'),'Projets & tournages','Chaque contenu suit son chemin : écriture, production, tournage, montage, validation des versions, publication.'],
[ic('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>'),'Idées & validation','L\'assistante propose des idées avec ses références, Tefi les valide, les refuse ou les renvoie à retravailler.'],
[ic('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>'),'Business','Rendez-vous, clients, devis, factures et suivi des paiements, avec des documents prêts à envoyer en PDF.']];
return'<div class="land"><header class="land-top"><div class="brand"><div class="brand-mark">T</div><b>Studio Tefi</b></div><button class="btn" data-act="sb-step" data-step="login">Se connecter</button></header>'+
'<section class="land-hero"><span class="label">Espace de travail privé</span><h1>Le studio de production de Tefi</h1>'+
'<p>Studio Tefi est un outil créé spécialement pour Tefi et son travail d\'assistanat. Il réunit au même endroit les idées, les projets, les tournages, le planning des publications et le suivi business, sur téléphone, tablette et ordinateur.</p>'+
'<div class="land-cta"><button class="btn primary" data-act="sb-step" data-step="login">Se connecter</button><button class="btn" data-act="sb-step" data-step="signup">Pas de compte ? Inscris-toi</button></div></section>'+
'<section class="land-video"><h2>Bienvenue dans l\'équipe</h2><p>Commence par cette courte vidéo : elle te présente le studio et tout ce qu\'il faut savoir pour bien démarrer.</p>'+'<div class="land-frame"><iframe src="https://www.youtube-nocookie.com/embed/CqvTFbzrXEs?rel=0&modestbranding=1" title="Vidéo de bienvenue Studio Tefi" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></section>'+
'<section class="land-feats">'+feats.map(f=>'<div class="land-feat"><span class="land-ic">'+f[0]+'</span><h3>'+esc(f[1])+'</h3><p>'+esc(f[2])+'</p></div>').join('')+'</section>'+
'<section class="land-steps"><h2>Comment rejoindre l\'espace</h2><ol><li><b>Crée ton compte</b><span>avec ton adresse e-mail et un mot de passe.</span></li><li><b>Tefi valide ton accès</b><span>chaque compte est vérifié avant d\'ouvrir l\'espace.</span></li><li><b>Retrouve tout, partout</b><span>le planning se met à jour en direct sur tous tes appareils.</span></li></ol></section>'+
'<footer class="land-foot"><span class="dot" style="--c:var(--ok)"></span>Accès privé, sur invitation. Les comptes sont validés par Tefi.</footer></div>';
}
const HIST_COL={content:'contents',account:'accounts',media:'media',deal:'deals',contact:'contacts',doc:'docs',rdv:'rdv',task:'tasks',request:'requests'};
function histCurrent(kind,refId){if(kind==='settings')return clone(settings());const c=HIST_COL[kind];return c&&S[c]?S[c][refId]||null:null;}
function histPatch(before,after){
if(!before||!after)return before;
const set={},del=[];let n=0;
Object.keys(before).forEach(k=>{if(k!=='updatedAt'&&JSON.stringify(before[k])!==JSON.stringify(after[k])){set[k]=before[k];n++;}});
Object.keys(after).forEach(k=>{if(!(k in before)&&k!=='updatedAt'){del.push(k);n++;}});
return{__patch:1,set,del,n};
}
function histUnpatch(e){const p=e.before;if(!p||!p.__patch)return p;const cur=histCurrent(e.kind,e.refId);if(!cur)return null;
const full=Object.assign(clone(cur),clone(p.set));(p.del||[]).forEach(k=>{delete full[k];});return full;}
const LOGO_DATA={};
function logoSrc(p){if(!p)return'';if(p.logo)return p.logo;if(p.logoRef&&S.mode==='supa')return Supa.photoUrl(p.logoRef);return'';}
async function withLogo(p){if(!p||p.logo||!p.logoRef||S.mode!=='supa')return p;
try{if(!LOGO_DATA[p.logoRef]){const r=await Supa.sb.storage.from('photos').download(p.logoRef);if(r.error)throw r.error;LOGO_DATA[p.logoRef]=await blobToDataUrl(r.data);}
return Object.assign({},p,{logo:LOGO_DATA[p.logoRef]});}catch(e){return p;}}
async function migrateLogos(){
if(S.mode!=='supa'||!isAdmin())return;const ps=(settings().profiles||[]).filter(p=>p.logo&&!p.logoRef);if(!ps.length)return;
const done={};for(const p of ps){try{const blob=await(await fetch(p.logo)).blob();const r=await Supa.upload('logo-'+p.id+'-'+Date.now().toString(36),blob);done[p.id]=r.ref;LOGO_DATA[r.ref]=p.logo;}catch(e){}}
if(Object.keys(done).length)updateSettings(s=>{(s.profiles||[]).forEach(p=>{if(done[p.id]){p.logoRef=done[p.id];delete p.logo;}});},'Logos rangés dans l\'espace de stockage');
}
let plT=null;
function persistLocalNow(){clearTimeout(plT);plT=null;if(S.mode!=='local')return;if(!lsSet(LS_DATA,localPayload()))toast("Stockage du navigateur plein : exporte une sauvegarde.");}
window.addEventListener('pagehide',()=>{if(plT)persistLocalNow();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&plT)persistLocalNow();});
const PRIOS=[{id:'p4',task:'Urgent',rdv:'Impératif',c:'#D2402C'},{id:'p3',task:'Important',rdv:'Important',c:'#E07B00'},{id:'p2',task:'Normal',rdv:'Normal',c:'#3D7BD9'},{id:'p1',task:'Facultatif',rdv:'Facultatif',c:'#8A8FA3'}];
const prioOf=id=>PRIOS.find(p=>p.id===id)||PRIOS[2];
const prioRank=id=>({p4:4,p3:3,p2:2,p1:1})[id]||2;
function prioPill(id,kind,always){if(!always&&(id||'p2')==='p2')return'';const p=prioOf(id);return'<span class="pill prio" style="--c:'+p.c+'"><span class="dot" style="--c:'+p.c+'"></span>'+esc(kind==='rdv'?p.rdv:p.task)+'</span>';}
function prioPick(cur,act,kind,attrs){cur=cur||'p2';
return'<div class="prio-pick" role="group" aria-label="Priorité">'+PRIOS.map(p=>'<button type="button" data-act="'+act+'" data-p="'+p.id+'"'+(attrs||'')+' aria-pressed="'+(cur===p.id)+'" style="--c:'+p.c+'"><span class="dot" style="--c:'+p.c+'"></span>'+esc(kind==='rdv'?p.rdv:p.task)+'</button>').join('')+'</div>';}
const HOME_BLOCKS={
inbox:{label:'À traiter',roles:['admin']},
today:{label:'Aujourd\'hui et alertes',roles:['admin','assistant']},
mytasks:{label:'Mes tâches',roles:['assistant']},
myreq:{label:'Mes demandes à Tefi',roles:['assistant']},
rdvmonth:{label:'Rendez-vous du mois',roles:['admin','assistant'],need:'rdv'},
projmonth:{label:'Projets du mois',roles:['admin','assistant']},
figures:{label:'Le mois en chiffres',roles:['admin','assistant']},
week:{label:'Point de la semaine',roles:['admin']},
assistplan:{label:'Plan de travail de l\'assistante',roles:['admin'],when:()=>!!settings().showAssistPlan},
planning:{label:'Planning : à venir, semaine, détail',roles:['admin','assistant']},
goals:{label:'Objectifs du mois',roles:['admin','assistant']},
production:{label:'Production et comptes',roles:['admin','assistant']},
networks:{label:'Mes réseaux',roles:['admin','assistant']}
};
const HOME_DEFAULT={admin:['inbox','today','rdvmonth','projmonth','figures','week','assistplan','planning','goals','production','networks'],
assistant:['today','mytasks','myreq','rdvmonth','projmonth','figures','planning','goals','production','networks']};
function homeLayout(role){role=role||ROLE;const L=((settings().homeLayout||{})[role])||{};const def=HOME_DEFAULT[role]||HOME_DEFAULT.admin;
const order=(L.order||[]).filter(id=>def.includes(id));def.forEach(id=>{if(!order.includes(id))order.push(id);});
return{order,hidden:(L.hidden||[]).filter(id=>def.includes(id))};}
function blockAvail(id){const b=HOME_BLOCKS[id];if(!b||!b.roles.includes(ROLE))return false;if(b.need&&!can(b.need))return false;if(b.when&&!b.when())return false;return true;}
function saveHomeLayout(L){const st=clone(S.settings||settings());st.homeLayout=Object.assign({},st.homeLayout||{});st.homeLayout[ROLE]=L;Store.saveSettings(st);}
function homeEditPanel(){
const L=homeLayout();const ids=L.order.filter(id=>HOME_BLOCKS[id]&&HOME_BLOCKS[id].roles.includes(ROLE));
return'<section class="panel home-edit"><div class="panel-h"><h2>Personnaliser mon résumé</h2><button class="btn small primary" data-act="home-edit">Terminé</button></div>'+
'<p class="hint" style="margin:-4px 0 10px">Monte, descends ou masque chaque bloc. Ton choix est gardé sur tous tes appareils.</p><div class="home-edit-list">'+
ids.map((id,i)=>{const on=!L.hidden.includes(id);const avail=blockAvail(id);
return'<div class="home-edit-row'+(on?'':' off')+'"><span>'+esc(HOME_BLOCKS[id].label)+(avail?'':' <span class="hint">(indisponible pour l\'instant)</span>')+'</span>'+
'<div class="row-acts"><button class="icon-btn sm" data-act="home-move" data-b="'+id+'" data-d="-1" aria-label="Monter"'+(i===0?' disabled':'')+'>↑</button><button class="icon-btn sm" data-act="home-move" data-b="'+id+'" data-d="1" aria-label="Descendre"'+(i===ids.length-1?' disabled':'')+'>↓</button>'+
'<label class="toggle"><input type="checkbox" data-home-vis="'+id+'"'+(on?' checked':'')+'>Afficher</label></div></div>';}).join('')+'</div></section>';
}
function monthBounds(){const d=pd(today());return[ds(new Date(d.getFullYear(),d.getMonth(),1)),ds(new Date(d.getFullYear(),d.getMonth()+1,0))];}
function blkRdvMonth(){
const t=today();const range=S.ui.rdvRange||'month';const end=range==='30'?addDays(t,30):monthBounds()[1];
const L=Object.values(S.rdv).filter(x=>isValidDate(x.date)&&x.date>=t&&x.date<=end).sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:(a.start||'99')<(b.start||'99')?-1:1);
const imp=L.filter(x=>x.priority==='p4').length;
let h='<section class="panel"><div class="panel-h"><h2>Rendez-vous '+(range==='30'?'des 30 prochains jours':'du mois')+'</h2><div class="row-acts">'+(imp?prioPill('p4','rdv',true).replace('Impératif',imp+' impératif'+(imp>1?'s':'')):'')+
'<div class="seg sm" role="group" aria-label="Période"><button data-act="rdv-range" data-r="month" aria-pressed="'+(range!=='30')+'">Ce mois</button><button data-act="rdv-range" data-r="30" aria-pressed="'+(range==='30')+'">30 jours</button></div></div></div>';
if(!L.length)return h+'<div class="empty"><b>Aucun rendez-vous</b>'+(can('rdv')?'Rien de prévu sur cette période.':'')+'</div></section>';
let wk='';h+='<div class="rows">';
L.forEach(x=>{const w=weekStart(x.date);if(w!==wk){wk=w;h+='<div class="week-sep">'+(w<=t&&t<=addDays(w,6)?'Cette semaine':'Semaine du '+fmtShort(w))+'</div>';}
h+='<div class="'+(x.priority==='p4'?'rdv-imp':'')+'">'+rdvRow(x,{showDate:true,showRel:true})+'</div>';});
return h+'</div></section>';
}
function projMonthList(){
const[a,b]=monthBounds();const inM=s=>isValidDate(s)&&s>=a&&s<=b;
return contents().filter(c=>c.status!=='idee'&&((c.publications||[]).some(p=>inM(p.date))||(c.shoots||[]).some(s=>inM(s.start)||inM(shootEnd(s)))||inM(c.editDate)));
}
function nextStepOf(c){const t=today();const it=[];(c.shoots||[]).forEach(s=>{if(isValidDate(s.start)&&shootEnd(s)>=t)it.push([s.start,'Tournage']);});
if(isValidDate(c.editDate)&&c.editDate>=t)it.push([c.editDate,'Montage']);(c.publications||[]).forEach(p=>{if(isValidDate(p.date)&&!p.done&&p.date>=t)it.push([p.date,'Publication']);});
it.sort((x,y)=>x[0]<y[0]?-1:1);return it[0]||null;}
function blkProjMonth(){
const L=projMonthList();const order=STATUSES.map(s=>s.id);const steps=['ecriture','production','tournage','montage','pret','publie'];
L.sort((x,y)=>order.indexOf(x.status)-order.indexOf(y.status));
let h='<section class="panel"><div class="panel-h"><h2>Projets du mois</h2><span class="mono muted">'+L.length+'</span></div>';
if(!L.length)return h+'<div class="empty"><b>Aucun projet ce mois-ci</b>Planifie un tournage, un montage ou une publication pour le voir ici.</div></section>';
h+='<div class="rows">'+L.map(c=>{const s=statusOf(c.status);const i=Math.max(0,steps.indexOf(c.status));const pct=Math.round((i+1)/steps.length*100);const nx=nextStepOf(c);
return'<div class="row"><button class="row-main" data-act="peek" data-id="'+esc(c.id)+'"><b>'+esc(titleOf(c))+'</b><span class="row-meta"><span class="pill" style="--c:'+s.c+'">'+s.label+'</span>'+(nx?'<span>'+esc(nx[1])+' · '+esc(fmtShort(nx[0]))+'</span>':'<span class="muted">Rien de prévu après</span>')+'</span>'+
'<span class="prog" aria-label="Avancement '+pct+' %"><i style="width:'+pct+'%;--c:'+s.c+'"></i></span></button></div>';}).join('')+'</div></section>';
return h;
}
function blkFigures(){
const[a,b]=monthBounds();const inM=s=>isValidDate(s)&&s>=a&&s<=b;let pubP=0,pubD=0,shoot=0;
contents().forEach(c=>{(c.publications||[]).forEach(p=>{if(inM(p.date)){if(p.done)pubD++;else pubP++;}});(c.shoots||[]).forEach(s=>{if(!isValidDate(s.start))return;for(let d=s.start;d<=shootEnd(s);d=addDays(d,1)){if(inM(d))shoot++;if(d>b)break;}});});
const rdvN=can('rdv')?Object.values(S.rdv).filter(x=>inM(x.date)).length:null;
const money=isAdmin()||can('toCollect');const unpaid=docs().filter(d=>d.kind==='facture'&&!['payee','annulee','brouillon'].includes(d.status)&&docRemaining(d)>0);
const late=unpaid.filter(d=>(dueInfo(d)||{}).n<0).length;
const byCur={};unpaid.forEach(d=>{byCur[d.currency||'MGA']=(byCur[d.currency||'MGA']||0)+docRemaining(d);});
const tile=(l,v,s,cls)=>'<div class="stat'+(cls?' '+cls:'')+'"><span class="label">'+l+'</span><strong>'+v+'</strong><span class="muted">'+s+'</span></div>';
let h='<section class="panel"><div class="panel-h"><h2>Le mois en chiffres</h2><span class="muted">'+esc(MONTHS[pd(today()).getMonth()])+'</span></div><div class="stats figs">'+
tile('Publications',pubP,'prévues · '+pubD+' publiée'+(pubD>1?'s':''))+tile('Tournages',shoot,'jour'+(shoot>1?'s':'')+' de tournage')+(rdvN!=null?tile('Rendez-vous',rdvN,'ce mois-ci'):'')+
(money?tile('À encaisser',Object.keys(byCur).length?Object.keys(byCur).map(k=>esc(money_(byCur[k],k))).join('<br>'):'0','sur '+plural(unpaid.length,'facture')):'')+
((isAdmin()||can('suivis'))?tile('En retard',late,'facture'+(late>1?'s':'')+' impayée'+(late>1?'s':''),late?'alert':''):'')+'</div></section>';
return h;
}
const money_=(v,c)=>money(v,c);
function blkWeek(){
const t=today();const ws=weekStart(t);const we=addDays(ws,6);const wsTs=pd(ws).getTime();
const showPlan=!!settings().showAssistPlan;
const hist=(S.history||[]).filter(h=>h.at>=wsTs&&h.by&&h.by!=='Admin').length;
const reqs=requestsOpen().length;
let tiles='';
if(showPlan){const T=tasksVisible().filter(x=>x.owner!=='admin'||x.assignedBy);const done=T.filter(x=>x.status==='done'&&x.doneAt>=wsTs).length;const late=T.filter(x=>x.status!=='done'&&isValidDate(x.date)&&x.date<t).length;
tiles+='<div class="stat"><span class="label">Tâches terminées</span><strong>'+done+'</strong><span class="muted">cette semaine</span></div><div class="stat'+(late?' alert':'')+'"><span class="label">En retard</span><strong>'+late+'</strong><span class="muted">dans son plan</span></div>';}
tiles+='<div class="stat'+(reqs?' alert':'')+'"><span class="label">Demandes</span><strong>'+reqs+'</strong><span class="muted">t\'attendent</span></div><div class="stat"><span class="label">Modifications</span><strong>'+hist+'</strong><span class="muted">faites par '+esc(roleName('assistant'))+'</span></div>';
return'<section class="panel"><div class="panel-h"><h2>Point de la semaine</h2><span class="muted">du '+fmtShort(ws)+' au '+fmtShort(we)+'</span></div><div class="stats figs">'+tiles+'</div>'+
(showPlan?'':'<p class="hint" style="margin:10px 0 0">Le plan de travail de '+esc(roleName('assistant'))+' est masqué. <button class="btn ghost small" data-act="plan-show">L\'afficher</button></p>')+'</section>';
}
const TASK_TEMPLATES_DEFAULT=[
{id:'tpl-tournage',name:'Nouveau tournage',steps:['Repérer le lieu','Demander les autorisations','Préparer le matériel et charger les batteries','Prévenir l\'équipe et les acteurs','Sauvegarder les rushs']},
{id:'tpl-publication',name:'Publication',steps:['Exporter la vidéo finale','Écrire la légende et les hashtags','Programmer la publication','Relever les statistiques à J+2']},
{id:'tpl-facture',name:'Facture à envoyer',steps:['Vérifier les infos du client','Demander la signature à Tefi','Envoyer au client','Noter la date de relance']}];
const taskTemplates=()=>{const t=settings().taskTemplates;return Array.isArray(t)?t:TASK_TEMPLATES_DEFAULT;};
const REPEATS=[['','Pas de répétition'],['daily','Chaque jour'],['weekly','Chaque semaine'],['monthly','Chaque mois']];
const TASK_ST=[['todo','À faire'],['doing','En cours'],['done','Fait']];
const tasksAll=()=>Object.values(S.tasks||{});
function tasksVisible(){
if(ROLE==='assistant')return tasksAll().filter(x=>!x.dismissed&&(x.owner!=='admin'||!x.private));
if(isAdmin()&&settings().showAssistPlan)return tasksAll().filter(x=>!x.dismissed&&!(x.private&&x.owner!=='admin'));
return[];
}
const taskSort=(a,b)=>(prioRank(b.priority)-prioRank(a.priority))||String(a.date||'9999').localeCompare(String(b.date||'9999'))||String(a.time||'99').localeCompare(String(b.time||'99'))||((a.createdAt||0)-(b.createdAt||0));
function taskGroups(list){
const t=today();const we=addDays(weekStart(t),6);const G={late:[],today:[],week:[],later:[],done:[]};
list.forEach(x=>{if(x.status==='done')G.done.push(x);else if(isValidDate(x.date)&&x.date<t)G.late.push(x);else if(x.date===t)G.today.push(x);else if(isValidDate(x.date)&&x.date<=we)G.week.push(x);else G.later.push(x);});
['late','today','week','later'].forEach(k=>G[k].sort(taskSort));G.done.sort((a,b)=>(b.doneAt||0)-(a.doneAt||0));return G;
}
function linkInfoOf(l){if(!l||!l.id)return null;
if(l.kind==='content'){const c=S.contents[l.id];return c?{label:titleOf(c),act:'peek'}:null;}
if(l.kind==='doc'){const d=S.docs[l.id];return d?{label:(d.kind==='devis'?'Devis ':'Facture ')+d.number,act:'doc-open'}:null;}
if(l.kind==='rdv'){const r=S.rdv[l.id];return r?{label:'RDV · '+(r.title||''),act:'rdv-open'}:null;}
if(l.kind==='media'){const m=S.media[l.id];return m?{label:(m.title||'Média')+(m.version?' V'+m.version:''),act:'pj-open'}:null;}
return null;}
function linkChip(l){const i=linkInfoOf(l);return i?'<button class="link-chip sm" data-act="'+i.act+'" data-id="'+esc(l.id)+'">↗ '+esc(i.label)+'</button>':'';}
function taskDue(x){if(!isValidDate(x.date))return'<span class="muted">Sans date</span>';const t=today();const late=x.status!=='done'&&x.date<t;
return'<span class="'+(late?'late-txt':'')+'">'+(x.date===t?'Aujourd\'hui':x.date===addDays(t,1)?'Demain':fmtShort(x.date))+(x.time?' · '+esc(x.time):'')+(late?' · en retard':'')+'</span>';}
function taskCard(x){
const st=x.steps||[];const nd=st.filter(s=>s.done).length;
return'<div class="task '+(x.priority||'p2')+(x.status==='done'?' isdone':'')+'"><button class="task-ck" data-act="task-done" data-id="'+esc(x.id)+'" aria-pressed="'+(x.status==='done')+'" aria-label="'+(x.status==='done'?'Remettre à faire':'Marquer fait')+'">'+ICON.check+'</button>'+
'<div class="task-body"><button class="task-main" data-act="task-open" data-id="'+esc(x.id)+'"><b>'+esc(x.title||'Sans titre')+'</b></button><span class="row-meta">'+prioPill(x.priority,'task')+taskDue(x)+
(x.status==='doing'?'<span class="pill plain">En cours</span>':'')+(st.length?'<span class="mono">'+nd+'/'+st.length+' étapes</span>':'')+(x.repeat?'<span title="Se répète">↻ '+esc((REPEATS.find(r=>r[0]===x.repeat)||[0,''])[1].toLowerCase())+'</span>':'')+
(x.remind?'<span title="Rappel">⏰</span>':'')+(x.private?'<span title="Tâche privée">🔒 privée</span>':'')+(x.assignedBy==='admin'&&x.owner!=='admin'?'<span class="pill" style="--c:var(--accent)">Ajoutée par Tefi</span>':'')+(x.auto?'<span class="pill plain">Auto</span>':'')+
linkChip(x.link)+'</span></div></div>';
}
function quickTaskForm(){return'<form class="add-form task-quick" data-form="task-quick"><input class="inp" id="tq-title" placeholder="Nouvelle tâche (ex. Appeler le loueur de matériel)" autocomplete="off">'+
'<select class="inp" id="tq-when" aria-label="Quand"><option value="today">Aujourd\'hui</option><option value="tomorrow">Demain</option><option value="week">Cette semaine</option><option value="later">Plus tard</option></select>'+
'<select class="inp" id="tq-prio" aria-label="Priorité">'+PRIOS.map(p=>'<option value="'+p.id+'"'+(p.id==='p2'?' selected':'')+'>'+p.task+'</option>').join('')+'</select><button class="btn primary" type="submit">'+ICON.plus+'Ajouter</button></form>';}
function viewPlans(){
const asAdmin=isAdmin();const name=roleName('assistant');
if(asAdmin&&!settings().showAssistPlan)return'<div class="wrap"><div class="empty"><b>Plan masqué</b>Le plan de travail de '+esc(name)+' n\'est pas affiché. <button class="btn small" data-act="plan-show">L\'afficher</button></div></div>';
const list=tasksVisible();const G=taskGroups(list);
let h='<div class="wrap"><div class="head"><div><span class="label">'+(asAdmin?'Plan de travail de '+esc(name):'Plans de travail')+'</span><h1>'+(asAdmin?'Ce que '+esc(name)+' a à faire':'Ce que j\'ai à faire')+'</h1>'+
(asAdmin?'<p class="muted">Tu vois ses tâches, sauf celles qu\'elle a marquées privées. Tu peux lui en ajouter.</p>':'<p class="muted">Tes tâches, tes rappels et tes demandes à Tefi.</p>')+'</div>'+
'<div class="card-f">'+(asAdmin?'<button class="btn ghost small" data-act="plan-hide">Masquer ce plan</button>':'<button class="btn" data-act="req-new">'+ICON.plus+'Demander à Tefi</button>')+
'<select class="inp tpl-pick" id="tpl-pick" data-tpl-pick="1" aria-label="Créer depuis un modèle"><option value="">Depuis un modèle…</option>'+taskTemplates().map(t=>'<option value="'+esc(t.id)+'">'+esc(t.name)+'</option>').join('')+'</select>'+
'<button class="btn primary" data-act="task-new">'+ICON.plus+(asAdmin?'Tâche pour '+esc(name):'Tâche')+'</button></div></div>';
h+='<section class="panel">'+quickTaskForm()+'</section>';
const col=(k,title,empty,cls)=>'<section class="panel task-col'+(cls?' '+cls:'')+'"><div class="panel-h"><h2>'+title+'</h2><span class="mono muted">'+G[k].length+'</span></div>'+(G[k].length?'<div class="tasks">'+G[k].map(taskCard).join('')+'</div>':'<p class="hint" style="margin:0">'+empty+'</p>')+'</section>';
h+='<div class="task-board">'+(G.late.length?col('late','En retard','','late'):'')+col('today','Aujourd\'hui','Rien pour aujourd\'hui.')+col('week','Cette semaine','Rien d\'autre cette semaine.')+col('later','Plus tard','Rien de prévu plus tard.')+'</div>';
h+='<details class="fold panel" id="tasks-done"><summary>Fait <span class="mono muted">'+G.done.length+'</span></summary>'+(G.done.length?'<div class="tasks" style="margin-top:10px">'+G.done.slice(0,30).map(taskCard).join('')+'</div>':'<p class="hint">Aucune tâche terminée.</p>')+'</details>';
if(!asAdmin)h+=myRequestsPanel(true);
h+='<details class="fold panel" id="tpl-manage"><summary>Modèles de plans</summary><p class="hint">Un modèle crée une tâche avec toutes ses étapes d\'un coup. Pour en ajouter un, ouvre une tâche avec des étapes et choisis « Enregistrer comme modèle ».</p><div class="set-list">'+
taskTemplates().map(t=>'<div class="set-item"><span style="flex:1"><b>'+esc(t.name)+'</b> <span class="hint">'+plural(t.steps.length,'étape')+'</span></span><button class="icon-btn sm danger" data-act="tpl-del" data-id="'+esc(t.id)+'" data-confirm="✓" aria-label="Supprimer le modèle '+esc(t.name)+'">'+ICON.x+'</button></div>').join('')+'</div></details>';
return h+'</div>';
}
function blkMyTasks(){
const G=taskGroups(tasksVisible());const L=G.late.concat(G.today);
return'<section class="panel"><div class="panel-h"><h2>Mes tâches</h2><button class="btn ghost small" data-nav="plans">Plan de travail'+ICON.arrow+'</button></div>'+
(L.length?'<div class="tasks">'+L.slice(0,10).map(taskCard).join('')+'</div>':'<p class="muted" style="margin:0">Rien en retard ni pour aujourd\'hui. '+(G.week.length?plural(G.week.length,'tâche')+' cette semaine.':'')+'</p>')+quickTaskForm().replace('data-form="task-quick"','data-form="task-quick" style="margin-top:12px"')+'</section>';
}
function blkAssistPlan(){
const G=taskGroups(tasksVisible());const L=G.late.concat(G.today);const name=roleName('assistant');
return'<section class="panel"><div class="panel-h"><h2>Plan de '+esc(name)+'</h2><button class="btn ghost small" data-nav="plans">Voir tout'+ICON.arrow+'</button></div>'+
'<div class="kvs"><div><span class="label">En retard</span><b>'+G.late.length+'</b></div><div><span class="label">Aujourd\'hui</span><b>'+G.today.length+'</b></div><div><span class="label">Cette semaine</span><b>'+G.week.length+'</b></div></div>'+
(L.length?'<div class="tasks" style="margin-top:10px">'+L.slice(0,6).map(taskCard).join('')+'</div>':'')+'</section>';
}
let taskDraft=null;
function newTask(preset){return Object.assign({id:'t'+uid(),title:'',notes:'',date:today(),time:'',priority:'p2',status:'todo',link:null,steps:[],repeat:'',remind:false,private:false,
owner:ROLE,ownerUid:S.mode==='supa'&&Supa.user?Supa.user.id:'',assignedBy:isAdmin()?'admin':'',createdAt:Date.now()},preset||{});}
function saveTask(x,summary){const before=S.tasks[x.id]||null;Store.save('tasks',x);logChange('task',before?'update':'create',x.id,x.title||'Tâche',summary||(before?'Tâche modifiée':'Tâche ajoutée'),before);}
function openTask(id,preset){taskDraft=id&&S.tasks[id]?clone(S.tasks[id]):newTask(preset);renderTask();$('#taskm').hidden=false;document.body.classList.add('locked');const t=$('#tk-title');if(t&&!id)t.focus();}
function closeTask(){taskDraft=null;$('#taskm').hidden=true;if(!draft&&!peekId&&$('#idea').hidden&&$('#rdvm').hidden)document.body.classList.remove('locked');}
function canEditTask(x){if(isAdmin())return x.owner==='admin'||x.assignedBy==='admin'||!S.tasks[x.id];return x.owner!=='admin'||x.assignedBy==='admin';}
function linkSelect(l){const k=(l&&l.kind)||'';const id=(l&&l.id)||'';
const opts={content:contents().filter(c=>c.status!=='idee').map(c=>[c.id,titleOf(c)]),doc:(can('devis')||can('factures')||isAdmin())?docs().map(d=>[d.id,(d.kind==='devis'?'Devis ':'Facture ')+d.number]):[],rdv:can('rdv')?Object.values(S.rdv).map(r=>[r.id,(r.title||'RDV')+' · '+fmtShort(r.date)]):[],media:can('projection')?medias().map(m=>[m.id,(m.title||'Média')+(m.version?' V'+m.version:'')]):[]};
return'<div class="link-line"><select class="inp" id="tk-lk" data-tk-lk="kind" aria-label="Type de lien"><option value="">Aucun lien</option>'+[['content','Projet'],['doc','Devis ou facture'],['rdv','Rendez-vous'],['media','Projection']].filter(o=>opts[o[0]].length).map(o=>'<option value="'+o[0]+'"'+(k===o[0]?' selected':'')+'>'+o[1]+'</option>').join('')+'</select>'+
(k?'<select class="inp" id="tk-li" data-tk-lk="id" aria-label="Élément lié"><option value="">Choisir…</option>'+(opts[k]||[]).map(o=>'<option value="'+esc(o[0])+'"'+(o[0]===id?' selected':'')+'>'+esc(o[1])+'</option>').join('')+'</select>':'')+'</div>';}
function renderTask(){
const x=taskDraft;if(!x)return;const isNew=!S.tasks[x.id];const ed=canEditTask(x);const dis=ed?'':' disabled';const mine=x.owner===ROLE;
let h='<div class="peek-h"><div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:6px"><span class="label">'+(isNew?'Nouvelle tâche':'Tâche')+(x.auto?' · créée automatiquement':'')+(x.assignedBy==='admin'&&x.owner!=='admin'?' · ajoutée par Tefi':'')+'</span>'+
'<input class="title-inp" style="font-size:22px" id="tk-title" data-tk="title" value="'+esc(x.title)+'" placeholder="Que faut-il faire ?" aria-label="Titre"'+dis+'></div><button class="icon-btn" data-act="task-close" aria-label="Fermer">'+ICON.x+'</button></div><div class="peek-b">';
h+='<div class="seg" role="group" aria-label="Statut">'+TASK_ST.map(s=>'<button type="button" data-act="tk-status" data-s="'+s[0]+'" aria-pressed="'+(x.status===s[0])+'">'+s[1]+'</button>').join('')+'</div>';
h+='<div class="field"><span>Priorité</span>'+prioPick(x.priority,'tk-prio','task')+'</div>';
h+='<div class="f-grid"><label class="field"><span>Date</span><input class="inp" type="date" id="tk-date" data-tk="date" value="'+esc(x.date||'')+'"'+dis+'></label><label class="field"><span>Heure</span><input class="inp" type="time" id="tk-time" data-tk="time" value="'+esc(x.time||'')+'"'+dis+'></label>'+
'<label class="field"><span>Répétition</span><select class="inp" id="tk-rep" data-tk="repeat"'+dis+'>'+REPEATS.map(r=>'<option value="'+r[0]+'"'+(x.repeat===r[0]?' selected':'')+'>'+r[1]+'</option>').join('')+'</select></label></div>';
h+='<div class="card-f"><label class="toggle"><input type="checkbox" id="tk-remind" data-tk-ck="remind"'+(x.remind?' checked':'')+dis+'>Me le rappeler'+(x.time?' à '+esc(x.time):' (à 9 h)')+'</label>'+
(mine?'<label class="toggle"><input type="checkbox" id="tk-private" data-tk-ck="private"'+(x.private?' checked':'')+'>Tâche privée'+(ROLE==='assistant'?' (Tefi ne la voit pas)':'')+'</label>':'')+'</div>';
h+='<div class="field"><span>Lié à</span>'+linkSelect(x.link)+(x.link&&x.link.id?'<div style="margin-top:6px">'+linkChip(x.link)+'</div>':'')+'</div>';
const st=x.steps||[];
h+='<div class="field"><span>Étapes '+(st.length?'<b class="mono">'+st.filter(s=>s.done).length+'/'+st.length+'</b>':'')+'</span><div class="steps">'+st.map(s=>'<div class="step"><label class="toggle"><input type="checkbox" data-tk-step="'+esc(s.id)+'"'+(s.done?' checked':'')+'><span>'+esc(s.label)+'</span></label>'+(ed?'<button class="icon-btn sm" data-act="tk-step-del" data-sid="'+esc(s.id)+'" aria-label="Retirer l\'étape">'+ICON.x+'</button>':'')+'</div>').join('')+'</div>'+
(ed?'<form class="add-form" data-form="tk-step" style="margin-top:6px"><input class="inp" id="tk-step-new" placeholder="Ajouter une étape" autocomplete="off"><button class="btn small" type="submit">'+ICON.plus+'Étape</button></form>':'')+'</div>';
h+='<label class="field"><span>Notes</span><textarea class="inp" rows="3" id="tk-notes" data-tk="notes" placeholder="Détails, numéros, liens…"'+dis+'>'+esc(x.notes||'')+'</textarea></label>';
h+='</div><div class="peek-f"><button class="btn primary" data-act="task-save">'+ICON.check+'Enregistrer</button><button class="btn" data-act="task-close">Annuler</button>'+
(st.length?'<button class="btn ghost" data-act="tpl-from-task">Enregistrer comme modèle</button>':'')+(ROLE==='assistant'&&!isNew?'<button class="btn ghost" data-act="req-from-task">Demander à Tefi</button>':'')+
(!isNew&&ed?'<button class="btn danger" data-act="task-del" data-id="'+esc(x.id)+'" data-confirm="Supprimer ?">'+ICON.trash+'Supprimer</button>':'')+'</div>';
morph($('#task-panel'),h);
}
function setTaskDone(id,done){
const x=clone(S.tasks[id]);if(!x)return;x.status=done?'done':'todo';x.doneAt=done?Date.now():null;saveTask(x,done?'Tâche terminée':'Tâche remise à faire');
if(done&&x.repeat&&isValidDate(x.date)){const nd=x.repeat==='daily'?addDays(x.date,1):x.repeat==='weekly'?addDays(x.date,7):addMonths(x.date,1);const base=x.repeatBase||x.id;const nid='rp-'+base+'-'+nd;
if(!S.tasks[nid]){const n=Object.assign(clone(x),{id:nid,repeatBase:base,date:nd,status:'todo',doneAt:null,createdAt:Date.now(),steps:(x.steps||[]).map(s=>Object.assign({},s,{done:false}))});saveTask(n,'Prochaine répétition');toast('Fait. Prochaine fois : '+fmtShort(nd));return;}}
if(done)toast('Tâche terminée');
}
function handleTaskClick(a,el){
const id=el.dataset.id;
switch(a){
case'task-new':openTask(null);return true;
case'task-open':openTask(id);return true;
case'task-close':closeTask();return true;
case'task-done':{const x=S.tasks[id];if(!x)return true;if(!canEditTask(x)&&!(ROLE==='assistant')){toast(DENIED);return true;}setTaskDone(id,x.status!=='done');return true;}
case'tk-status':if(taskDraft){taskDraft.status=el.dataset.s;renderTask();}return true;
case'tk-prio':if(taskDraft){taskDraft.priority=el.dataset.p;renderTask();}return true;
case'tk-step-del':if(taskDraft){taskDraft.steps=(taskDraft.steps||[]).filter(s=>s.id!==el.dataset.sid);renderTask();}return true;
case'task-save':{const x=clone(taskDraft);if(!x.title.trim()){toast('Donne un titre à la tâche.');return true;}const was=S.tasks[x.id];
const becameDone=x.status==='done'&&(!was||was.status!=='done');if(x.status==='done'&&!x.doneAt)x.doneAt=Date.now();if(x.status!=='done')x.doneAt=null;
if(becameDone&&x.repeat){x.status='todo';saveTask(x);setTaskDone(x.id,true);}else saveTask(x);closeTask();if(!was)toast('Tâche ajoutée');return true;}
case'task-del':{const x=S.tasks[id];if(!x)return true;if(x.auto){Store.save('tasks',Object.assign(clone(x),{dismissed:true,status:'done'}));}else{Store.del('tasks',id);logChange('task','delete',id,x.title,'Tâche supprimée',x);}closeTask();toast('Tâche supprimée');return true;}
case'tpl-from-task':{const x=taskDraft;if(!x||!(x.steps||[]).length)return true;const tpl={id:'tpl'+uid(),name:x.title||'Modèle',steps:x.steps.map(s=>s.label)};
const st=clone(S.settings||settings());st.taskTemplates=taskTemplates().concat([tpl]);Store.saveSettings(st);toast('Modèle « '+tpl.name+' » enregistré');return true;}
case'tpl-del':{const st=clone(S.settings||settings());st.taskTemplates=taskTemplates().filter(t=>t.id!==id);Store.saveSettings(st);return true;}
case'plan-show':if(!isAdmin())return true;updateSettings(s=>{s.showAssistPlan=true;},'Plan de travail de l\'assistante affiché');return true;
case'plan-hide':if(!isAdmin())return true;updateSettings(s=>{s.showAssistPlan=false;},'Plan de travail de l\'assistante masqué');if(S.ui.view==='plans')go('home');return true;
}
return false;
}
function handleTaskSubmit(k){
if(k==='task-quick'){const t=($('#tq-title').value||'').trim();if(!t){toast('Écris la tâche.');return true;}const w=$('#tq-when').value;const d=today();
const date=w==='today'?d:w==='tomorrow'?addDays(d,1):w==='week'?addDays(weekStart(d),4)<d?d:addDays(weekStart(d),4):'';
saveTask(newTask({title:t,date,priority:$('#tq-prio').value}));$('#tq-title').value='';toast('Tâche ajoutée');return true;}
if(k==='tk-step'&&taskDraft){const v=($('#tk-step-new').value||'').trim();if(!v)return true;taskDraft.steps=(taskDraft.steps||[]).concat([{id:uid(),label:v,done:false}]);renderTask();const i=$('#tk-step-new');if(i)i.focus();return true;}
return false;
}
function taskPanelEvents(){
const P=$('#task-panel');
P.addEventListener('input',e=>{const el=e.target;if(taskDraft&&el.dataset.tk)taskDraft[el.dataset.tk]=el.value;});
P.addEventListener('change',e=>{const el=e.target;if(!taskDraft)return;
if(el.dataset.tk==='repeat'||el.dataset.tk==='time'||el.dataset.tk==='date'){taskDraft[el.dataset.tk]=el.value;renderTask();}
if(el.dataset.tkCk){taskDraft[el.dataset.tkCk]=el.checked;}
if(el.dataset.tkStep){const s=(taskDraft.steps||[]).find(z=>z.id===el.dataset.tkStep);if(s)s.done=el.checked;renderTask();}
if(el.dataset.tkLk==='kind'){taskDraft.link=el.value?{kind:el.value,id:''}:null;renderTask();}
if(el.dataset.tkLk==='id'&&taskDraft.link){taskDraft.link.id=el.value;renderTask();}});
$('#taskm').addEventListener('click',e=>{if(e.target.id==='taskm')closeTask();});
}
function useTemplate(id){const t=taskTemplates().find(x=>x.id===id);if(!t)return;openTask(null,{title:t.name,steps:t.steps.map(l=>({id:uid(),label:l,done:false}))});}
function autoTasks(){
if(ROLE!=='assistant'||!S.loaded)return;
const want={};
if(can('projection'))medias().forEach(m=>{if(m.kind==='version'&&m.status==='corriger'){want['auto-corr-'+m.id+'-'+(m.version||1)]={title:'Corriger « '+(m.title||'Version')+' » V'+(m.version||1),link:{kind:'media',id:m.id},priority:'p3'};}});
if(can('suivis'))docs().forEach(d=>{const di=dueInfo(d);if(d.kind==='facture'&&di&&di.n<0&&docRemaining(d)>0){want['auto-rel-'+d.id]={title:'Relancer '+((d.clientSnap&&d.clientSnap.name)||(compOf(d.companyId)||{}).label||'le client')+' · '+d.number,link:{kind:'doc',id:d.id},priority:d.followUp==='urgent'?'p4':'p3'};}});
Object.keys(want).forEach(id=>{if(!S.tasks[id])Store.save('tasks',newTask(Object.assign({id,auto:true,owner:'assistant',assignedBy:''},want[id])));});
tasksAll().forEach(x=>{if(x.auto&&x.status!=='done'&&!want[x.id]&&(x.id.startsWith('auto-corr-')||x.id.startsWith('auto-rel-')))Store.save('tasks',Object.assign(clone(x),{status:'done',doneAt:Date.now()}));});
}
const REQ_TYPES=[
{id:'signature',label:'Signature d\'un devis ou d\'une facture',short:'Signature',link:'doc'},
{id:'statut',label:'Changement de statut d\'une facture',short:'Statut de facture',link:'doc'},
{id:'rush',label:'Rushs ou fichiers manquants',short:'Rushs',link:'content'},
{id:'publication',label:'Validation d\'une publication',short:'Publication',link:'content'},
{id:'depense',label:'Dépense ou matériel',short:'Dépense',link:'content'},
{id:'question',label:'Question',short:'Question',link:'content'},
{id:'autre',label:'Autre demande',short:'Autre',link:'content'}];
const reqTypeOf=id=>REQ_TYPES.find(t=>t.id===id)||REQ_TYPES[6];
const REQ_ST={envoyee:['Envoyée','#3D7BD9'],vue:['Vue par Tefi','#7C5CD6'],encours:['En cours','#E07B00'],traitee:['Traitée','#118A6B'],refusee:['Refusée','#D2402C']};
const reqStPill=r=>{const s=REQ_ST[r.status]||REQ_ST.envoyee;return'<span class="pill" style="--c:'+s[1]+'">'+s[0]+'</span>';};
const requestsAll=()=>Object.values(S.requests||{});
const requestsOpen=()=>requestsAll().filter(r=>['envoyee','vue','encours'].includes(r.status));
const reqLastRelance=r=>Math.max(r.createdAt||0,...(r.relances||[]));
const reqCanRelance=r=>['envoyee','vue','encours'].includes(r.status)&&Date.now()-reqLastRelance(r)>=24*3600e3;
function reqTitle(r){if(r.title&&r.title.trim())return r.title;const i=linkInfoOf(r.link);return reqTypeOf(r.type).short+(i?' · '+i.label:'');}
function reqUnreadForAuthor(r){const seen=r.authorSeenAt||0;return(r.statusAt||0)>seen&&r.statusBy==='admin'||(r.thread||[]).some(m=>m.role==='admin'&&m.at>seen);}
let reqDraft=null,reqViewId=null;
function newRequest(preset){return Object.assign({id:'q'+uid(),type:'question',title:'',message:'',link:null,urgency:'p2',needBy:'',status:'envoyee',statusAt:Date.now(),statusBy:'assistant',thread:[],relances:[],by:roleName(ROLE),byRole:ROLE,createdAt:Date.now()},preset||{});}
function saveRequest(r,summary){const before=S.requests[r.id]||null;Store.save('requests',r);logChange('request',before?'update':'create',r.id,reqTitle(r),summary||(before?'Demande mise à jour':'Demande envoyée'),before);}
function openReqForm(preset){if(ROLE!=='assistant'&&!isAdmin())return;if(!can('requests')){toast(DENIED);return;}reqDraft=newRequest(preset);reqViewId=null;renderReq();$('#reqm').hidden=false;document.body.classList.add('locked');}
function openReq(id){const r=S.requests[id];if(!r)return;reqDraft=null;reqViewId=id;
if(isAdmin()&&r.status==='envoyee'){const x=clone(r);x.status='vue';x.seenAt=Date.now();x.statusAt=Date.now();x.statusBy='admin';Store.save('requests',x);}
if(r.byRole===ROLE&&reqUnreadForAuthor(r)){Store.save('requests',Object.assign(clone(r),{authorSeenAt:Date.now()}));}
renderReq();$('#reqm').hidden=false;document.body.classList.add('locked');}
function closeReq(){reqDraft=null;reqViewId=null;$('#reqm').hidden=true;if(!draft&&!peekId&&$('#idea').hidden&&$('#rdvm').hidden&&$('#taskm').hidden)document.body.classList.remove('locked');}
function reqLinkSelect(r){const t=reqTypeOf(r.type);const id=(r.link&&r.link.id)||'';
const list=t.link==='doc'?docs().map(d=>[d.id,(d.kind==='devis'?'Devis ':'Facture ')+d.number+(d.clientSnap&&d.clientSnap.name?' · '+d.clientSnap.name:'')]):contents().filter(c=>c.status!=='idee').map(c=>[c.id,titleOf(c)]);
return'<label class="field"><span>'+(t.link==='doc'?'Quel document ?':'Quel projet ?')+(['signature','statut','rush','publication'].includes(r.type)?'':' (facultatif)')+'</span><select class="inp" id="rq-link" data-rq-link="'+t.link+'"><option value="">Choisir…</option>'+list.map(o=>'<option value="'+esc(o[0])+'"'+(o[0]===id?' selected':'')+'>'+esc(o[1])+'</option>').join('')+'</select></label>';}
function renderReq(){
const P=$('#req-panel');let h='';
if(reqDraft){const r=reqDraft;
h='<div class="peek-h"><div style="flex:1"><span class="label">Nouvelle demande</span><h2 style="margin:4px 0 0">Demander à Tefi</h2></div><button class="icon-btn" data-act="req-close" aria-label="Fermer">'+ICON.x+'</button></div><div class="peek-b">'+
'<label class="field"><span>Type de demande</span><select class="inp" id="rq-type" data-rq="type">'+REQ_TYPES.map(t=>'<option value="'+t.id+'"'+(r.type===t.id?' selected':'')+'>'+esc(t.label)+'</option>').join('')+'</select></label>'+reqLinkSelect(r)+
'<label class="field"><span>Titre (facultatif)</span><input class="inp" id="rq-title" data-rq="title" value="'+esc(r.title)+'" placeholder="'+esc(reqTitle(Object.assign({},r,{title:''})))+'"></label>'+
'<label class="field"><span>Ton message</span><textarea class="inp" rows="4" id="rq-msg" data-rq="message" placeholder="Explique ce qu\'il te faut et pourquoi.">'+esc(r.message)+'</textarea></label>'+
'<div class="field"><span>Urgence</span>'+prioPick(r.urgency,'rq-urg','task')+'</div>'+
'<label class="field"><span>J\'en ai besoin pour le (facultatif)</span><input class="inp" type="date" id="rq-need" data-rq="needBy" value="'+esc(r.needBy)+'"></label>'+
'</div><div class="peek-f"><button class="btn primary" data-act="req-send">Envoyer à Tefi</button><button class="btn" data-act="req-close">Annuler</button></div>';
}else if(reqViewId&&S.requests[reqViewId]){const r=S.requests[reqViewId];const t=reqTypeOf(r.type);const open=['envoyee','vue','encours'].includes(r.status);const mine=r.byRole===ROLE;
h='<div class="peek-h"><div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:6px"><span class="label">'+esc(t.short)+' · demandé par '+esc(r.by||roleName('assistant'))+' · '+fmtStamp(r.createdAt)+'</span><h2 style="margin:0">'+esc(reqTitle(r))+'</h2>'+
'<div class="card-f">'+reqStPill(r)+prioPill(r.urgency,'task',true)+(r.needBy?'<span>Pour le <b>'+esc(fmtShort(r.needBy))+'</b></span>':'')+((r.relances||[]).length?'<span class="pill" style="--c:#D2402C">Relancée '+r.relances.length+'×</span>':'')+'</div></div><button class="icon-btn" data-act="req-close" aria-label="Fermer">'+ICON.x+'</button></div><div class="peek-b">';
if(r.link&&linkInfoOf(r.link))h+='<div>'+linkChip(r.link)+'</div>';
if(r.message)h+='<p style="margin:0;white-space:pre-wrap">'+esc(r.message)+'</p>';
h+='<div class="thread">'+(r.thread||[]).map(m=>'<div class="msg '+(m.role==='admin'?'from-admin':'from-asst')+'"><span class="hint">'+esc(m.by)+' · '+fmtStamp(m.at)+'</span><p>'+esc(m.text)+'</p></div>').join('')+'</div>';
h+='<form class="add-form" data-form="req-reply"><textarea class="inp" rows="2" id="rq-reply" placeholder="'+(isAdmin()?'Répondre à '+esc(r.by||roleName('assistant')):'Ajouter un message')+'"></textarea><button class="btn" type="submit">Envoyer</button></form>';
h+='</div><div class="peek-f">';
if(isAdmin()){if(open)h+='<button class="btn primary" data-act="req-treat" data-id="'+esc(r.id)+'">Traiter</button>'+(r.status!=='encours'?'<button class="btn" data-act="req-status" data-s="encours">En cours</button>':'')+'<button class="btn" data-act="req-status" data-s="traitee">Marquer traitée</button><button class="btn danger" data-act="req-status" data-s="refusee">Refuser</button>';
else h+='<button class="btn" data-act="req-status" data-s="encours">Rouvrir</button>';}
else if(mine){if(open)h+='<button class="btn primary" data-act="req-relance" data-id="'+esc(r.id)+'"'+(reqCanRelance(r)?'':' disabled')+'>Relancer Tefi</button>'+(reqCanRelance(r)?'':'<span class="hint">Relance possible '+(Date.now()-reqLastRelance(r)<24*3600e3?'dans '+Math.ceil((24*3600e3-(Date.now()-reqLastRelance(r)))/3600e3)+' h':'bientôt')+'</span>')+
'<button class="btn danger" data-act="req-cancel" data-id="'+esc(r.id)+'" data-confirm="Annuler la demande ?">Annuler la demande</button>';}
h+='</div>';
}
morph(P,h);
}
function myRequestsPanel(full){
const L=requestsAll().filter(r=>r.byRole===ROLE).sort((a,b)=>(['envoyee','vue','encours'].includes(b.status)-['envoyee','vue','encours'].includes(a.status))||(b.createdAt-a.createdAt));
const shown=full?L.slice(0,30):L.filter(r=>['envoyee','vue','encours'].includes(r.status)||reqUnreadForAuthor(r)).slice(0,6);
return'<section class="panel"><div class="panel-h"><h2>Mes demandes à Tefi</h2><button class="btn small" data-act="req-new">'+ICON.plus+'Demander</button></div>'+
(shown.length?'<div class="rows">'+shown.map(r=>'<div class="row"><button class="row-main" data-act="req-open" data-id="'+esc(r.id)+'"><b>'+(reqUnreadForAuthor(r)?'<span class="dot" style="--c:var(--late)"></span> ':'')+esc(reqTitle(r))+'</b><span class="row-meta">'+reqStPill(r)+prioPill(r.urgency,'task')+'<span>'+fmtStamp(r.createdAt)+'</span>'+((r.relances||[]).length?'<span>relancée '+r.relances.length+'×</span>':'')+'</span></button>'+
(reqCanRelance(r)?'<div class="row-acts"><button class="btn small" data-act="req-relance" data-id="'+esc(r.id)+'">Relancer</button></div>':'')+'</div>').join('')+'</div>':'<p class="muted" style="margin:0">Aucune demande en cours.</p>')+'</section>';
}
function blkMyReq(){return can('requests')?myRequestsPanel(false):'';}
function inboxItems(){
if(!isAdmin())return[];const it=[];const ua=roleName('assistant');
requestsOpen().forEach(r=>it.push({key:'req:'+r.id+':'+(r.relances||[]).length,kind:'req',id:r.id,label:ua+' vous demande : '+reqTitle(r),sub:reqTypeOf(r.type).short+((r.relances||[]).length?' · relancée '+r.relances.length+'×':'')+(r.needBy?' · pour le '+fmtShort(r.needBy):''),prio:r.urgency,at:reqLastRelance(r),status:r.status}));
docs().forEach(d=>{if(d.sigRequested&&!d.signed&&!requestsOpen().some(r=>r.type==='signature'&&r.link&&r.link.id===d.id))it.push({key:'sig:'+d.id,kind:'sig',id:d.id,label:'Signer '+(d.kind==='devis'?'le devis ':'la facture ')+d.number,sub:'Demandé par '+(d.sigRequested.by||ua),prio:'p3',at:d.sigRequested.at||0});});
ideasToHandle().forEach(c=>it.push({key:'idea:'+c.id,kind:'idea',id:c.id,label:'Idée proposée : '+titleOf(c),sub:'Par '+(c.authorName||ua),prio:'p2',at:c.updatedAt||0}));
medias().filter(m=>m.kind==='version'&&m.status==='attente').forEach(m=>it.push({key:'ver:'+m.id,kind:'ver',id:m.id,label:'Valider « '+(m.title||'')+' » V'+(m.version||1),sub:'Envoyée par '+(m.createdBy||ua),prio:'p3',at:m.createdAt||0}));
pendingDocs().forEach(d=>it.push({key:'st:'+d.id,kind:'st',id:d.id,label:'Statut à valider : '+d.number,sub:(d.pendingStatus.by||ua)+' demande « '+statusLabel(d.kind,d.pendingStatus.to)+' »',prio:'p3',at:d.pendingStatus.at||0}));
docs().forEach(d=>(d.payments||[]).filter(p=>p.pending).forEach(p=>it.push({key:'pay:'+d.id+':'+p.id,kind:'pay',id:d.id,label:'Paiement à valider : '+d.number,sub:'Saisi par '+ua,prio:'p2',at:p.at||0})));
return it.sort((a,b)=>(prioRank(b.prio)-prioRank(a.prio))||((b.at||0)-(a.at||0)));
}
function inboxRow(x){const p=prioOf(x.prio);
return'<div class="row inbox-row"><span class="dot" style="--c:'+p.c+'"></span><button class="row-main" data-act="inbox-open-item" data-k="'+x.kind+'" data-id="'+esc(x.id)+'"><b>'+esc(x.label)+'</b><span class="row-meta">'+prioPill(x.prio,'task')+'<span>'+esc(x.sub)+'</span>'+(x.status==='envoyee'?'<span class="pill" style="--c:#3D7BD9">Nouvelle</span>':'')+'</span></button>'+
'<div class="row-acts"><button class="btn small primary" data-act="inbox-treat" data-k="'+x.kind+'" data-id="'+esc(x.id)+'">Traiter</button></div></div>';}
function blkInbox(){const L=inboxItems();
return'<section class="panel inbox-blk"><div class="panel-h"><h2>À traiter</h2><div class="row-acts"><span class="mono muted">'+L.length+'</span>'+(L.length>6?'<button class="btn ghost small" data-act="inbox-open">Tout voir'+ICON.arrow+'</button>':'')+'</div></div>'+
(L.length?'<div class="rows">'+L.slice(0,6).map(inboxRow).join('')+'</div>':'<p class="muted" style="margin:0">Rien n\'attend ta décision. 👌</p>')+'</section>';}
function asstNews(){if(ROLE!=='assistant')return[];const seen=lsGet('studio-tefi-seen-tasks')||{};
return requestsAll().filter(r=>r.byRole==='assistant'&&reqUnreadForAuthor(r)).map(r=>({kind:'reqnews',id:r.id,label:'Tefi a répondu : '+reqTitle(r),sub:(REQ_ST[r.status]||[''])[0]}))
.concat(tasksAll().filter(x=>x.assignedBy==='admin'&&x.owner!=='assistant'&&x.status!=='done'&&!seen[x.id]).map(x=>({kind:'tasknew',id:x.id,label:'Nouvelle tâche de Tefi : '+x.title,sub:isValidDate(x.date)?'Pour le '+fmtShort(x.date):''})));}
function bellCount(){return isAdmin()?inboxItems().length:asstNews().length;}
function renderInbox(){
let h='<div class="peek-h"><div style="flex:1"><span class="label">'+(isAdmin()?'À traiter':'Nouveautés')+'</span><h2 style="margin:4px 0 0">'+(isAdmin()?esc(roleName('assistant'))+' et toi':'Ce que Tefi t\'a envoyé')+'</h2></div><button class="icon-btn" data-act="inbox-close" aria-label="Fermer">'+ICON.x+'</button></div><div class="peek-b">';
if(isAdmin()){const L=inboxItems();h+=L.length?'<div class="rows">'+L.map(inboxRow).join('')+'</div>':'<div class="empty"><b>Tout est à jour</b>Rien n\'attend ta décision.</div>';}
else{const N=asstNews();h+=N.length?'<div class="rows">'+N.map(x=>'<div class="row"><button class="row-main" data-act="'+(x.kind==='reqnews'?'req-open':'task-open')+'" data-id="'+esc(x.id)+'"><b>'+esc(x.label)+'</b><span class="row-meta"><span>'+esc(x.sub)+'</span></span></button></div>').join('')+'</div>':'<div class="empty"><b>Rien de nouveau</b>Les réponses de Tefi apparaîtront ici.</div>';
h+=myRequestsPanel(false);}
morph($('#inbox-panel'),h+'</div>');
}
function openInbox(){renderInbox();$('#inboxm').hidden=false;document.body.classList.add('locked');
if(ROLE==='assistant'){const seen=lsGet('studio-tefi-seen-tasks')||{};tasksAll().forEach(x=>{if(x.assignedBy==='admin')seen[x.id]=1;});lsSet('studio-tefi-seen-tasks',seen);}}
function closeInbox(){$('#inboxm').hidden=true;if(!draft&&!peekId)document.body.classList.remove('locked');}
function treatItem(kind,id){
closeInbox();
if(kind==='req'){const r=S.requests[id];if(!r)return;if(['envoyee','vue'].includes(r.status)){Store.save('requests',Object.assign(clone(r),{status:'encours',statusAt:Date.now(),statusBy:'admin',seenAt:r.seenAt||Date.now()}));}
closeReq();const l=r.link||{};
if((r.type==='signature'||r.type==='statut')&&l.id&&S.docs[l.id]){openDoc(l.id);toast(r.type==='signature'?'Vérifie le document puis clique sur « Signer ».':'Change le statut ou valide la demande.');return;}
if(r.type==='rush'&&l.id){go('projection');openPjForm('rush',{contentId:l.id});toast('Ajoute le lien des rushs : la demande se fermera toute seule.');return;}
if((r.type==='publication'||r.type==='depense')&&l.id&&S.contents[l.id]){openEditor(l.id);setTimeout(()=>{const sec=[...document.querySelectorAll('#sheet-panel .ed-sec h2')].find(x=>/Diffusion|Budget/.test(x.textContent)&&(r.type==='publication'?/Diffusion/:/Budget/).test(x.textContent));if(sec)sec.scrollIntoView({block:'start'});},150);return;}
openReq(id);setTimeout(()=>{const t=$('#rq-reply');if(t)t.focus();},50);return;}
if(kind==='sig'||kind==='st'){openDoc(id);return;}
if(kind==='pay'){go('business',{bizTab:'suivi'});return;}
if(kind==='idea'){go('ideas');return;}
if(kind==='ver'){go('projection');openPj(id);return;}
}
function handleReqClick(a,el){
const id=el.dataset.id;
switch(a){
case'req-new':openReqForm({});return true;
case'req-from-task':{const x=taskDraft;closeTask();openReqForm({type:x&&x.link&&x.link.kind==='doc'?'signature':'question',title:x?x.title:'',link:x&&x.link&&['content','doc'].includes(x.link.kind)?x.link:null});return true;}
case'req-ctx':openReqForm({type:el.dataset.type||'question',link:el.dataset.lid?{kind:el.dataset.lk,id:el.dataset.lid}:null});return true;
case'req-open':openReq(id);return true;
case'req-close':closeReq();return true;
case'rq-urg':if(reqDraft){reqDraft.urgency=el.dataset.p;renderReq();}return true;
case'req-send':{const r=clone(reqDraft);const t=reqTypeOf(r.type);if(['signature','statut','rush','publication'].includes(r.type)&&!(r.link&&r.link.id)){toast(t.link==='doc'?'Choisis le document concerné.':'Choisis le projet concerné.');return true;}
if(!r.message.trim()&&!r.title.trim()){toast('Écris un petit message pour Tefi.');return true;}
saveRequest(r);if(r.type==='signature'&&r.link&&S.docs[r.link.id]){const d=clone(S.docs[r.link.id]);d.sigRequested={at:Date.now(),by:roleName(ROLE)};saveDocDirect(d);}
closeReq();toast('Demande envoyée à Tefi');return true;}
case'req-relance':{const r=S.requests[id];if(!r||!reqCanRelance(r)){toast('Tu pourras relancer 24 h après ton dernier envoi.');return true;}
const x=clone(r);x.relances=(x.relances||[]).concat([Date.now()]);if(prioRank(x.urgency)<4&&x.relances.length>=2)x.urgency=PRIOS[4-Math.min(4,prioRank(x.urgency)+1)].id;saveRequest(x,'Relance n°'+x.relances.length);toast('Tefi est relancée');if(reqViewId)renderReq();return true;}
case'req-cancel':{const r=S.requests[id];if(!r)return true;Store.del('requests',id);logChange('request','delete',id,reqTitle(r),'Demande annulée',r);closeReq();toast('Demande annulée');return true;}
case'req-status':{if(!isAdmin())return true;const r=S.requests[reqViewId];if(!r)return true;const s=el.dataset.s;const txt=($('#rq-reply')&&$('#rq-reply').value||'').trim();
if(s==='refusee'&&!txt){toast('Écris d\'abord pourquoi dans la réponse.');const t=$('#rq-reply');if(t)t.focus();return true;}
const x=clone(r);x.status=s;x.statusAt=Date.now();x.statusBy='admin';if(txt)x.thread=(x.thread||[]).concat([{id:uid(),by:'Tefi',role:'admin',at:Date.now(),text:txt}]);if(['traitee','refusee'].includes(s))x.closedAt=Date.now();
saveRequest(x,'Demande : '+REQ_ST[s][0]);renderReq();toast('Demande '+REQ_ST[s][0].toLowerCase());return true;}
case'req-treat':treatItem('req',id);return true;
case'inbox-open':openInbox();return true;
case'inbox-close':closeInbox();return true;
case'inbox-treat':treatItem(el.dataset.k,id);return true;
case'inbox-open-item':if(el.dataset.k==='req'){closeInbox();openReq(id);}else treatItem(el.dataset.k,id);return true;
}
return false;
}
function handleReqSubmit(k){
if(k==='req-reply'){const r=S.requests[reqViewId];const t=($('#rq-reply').value||'').trim();if(!r||!t)return true;const x=clone(r);
x.thread=(x.thread||[]).concat([{id:uid(),by:isAdmin()?'Tefi':roleName(ROLE),role:isAdmin()?'admin':'assistant',at:Date.now(),text:t}]);
if(isAdmin()&&x.status==='envoyee'){x.status='vue';x.statusAt=Date.now();x.statusBy='admin';}if(!isAdmin())x.authorSeenAt=Date.now();
saveRequest(x,'Message ajouté');$('#rq-reply').value='';renderReq();return true;}
return false;
}
function reqPanelEvents(){
const P=$('#req-panel');
P.addEventListener('input',e=>{const el=e.target;if(reqDraft&&el.dataset.rq&&el.dataset.rq!=='type')reqDraft[el.dataset.rq]=el.value;});
P.addEventListener('change',e=>{const el=e.target;if(!reqDraft)return;if(el.dataset.rq==='type'){reqDraft.type=el.value;const t=reqTypeOf(el.value);if(reqDraft.link&&reqDraft.link.kind!==t.link)reqDraft.link=null;renderReq();}
if(el.dataset.rqLink){reqDraft.link=el.value?{kind:el.dataset.rqLink,id:el.value}:null;renderReq();}});
$('#reqm').addEventListener('click',e=>{if(e.target.id==='reqm')closeReq();});
$('#inboxm').addEventListener('click',e=>{if(e.target.id==='inboxm')closeInbox();});
}
function autoCloseRequests(){
if(!isAdmin())return;
requestsOpen().forEach(r=>{const l=r.link||{};let done=false,why='';
if(r.type==='signature'&&l.id&&S.docs[l.id]&&S.docs[l.id].signed&&(S.docs[l.id].signed.at||0)>=(r.createdAt||0)){done=true;why='Document signé';}
if(r.type==='statut'&&l.id&&S.docs[l.id]){const d=S.docs[l.id];if(d.lastDecision&&d.lastDecision.at>(r.createdAt||0)&&!d.pendingStatus){done=true;why='Statut traité';}}
if(r.type==='rush'&&l.id&&medias().some(m=>m.kind==='rush'&&m.contentId===l.id&&(m.createdAt||0)>(r.createdAt||0))){done=true;why='Rushs ajoutés';}
if(done){const x=clone(r);x.status='traitee';x.statusAt=Date.now();x.statusBy='admin';x.closedAt=Date.now();x.closedAuto=why;x.thread=(x.thread||[]).concat([{id:uid(),by:'Studio Tefi',role:'admin',at:Date.now(),text:why+' : demande fermée automatiquement.'}]);saveRequest(x,'Fermée automatiquement · '+why);}});
}
let notifKnown=null,watchT=null;
function watchData(){clearTimeout(watchT);watchT=setTimeout(()=>{if(!S.loaded||!ROLE)return;
try{autoCloseRequests();autoTasks();}catch(e){console.error(e);}
const keys=isAdmin()?inboxItems().filter(x=>x.kind==='req'||x.kind==='sig').map(x=>[x.key,x.label]):asstNews().map(x=>[x.kind+':'+x.id+':'+((S.requests[x.id]||{}).thread||[]).length,x.label]);
if(notifKnown===null||notifKnown.role!==ROLE){notifKnown={role:ROLE,set:new Set(keys.map(k=>k[0]))};return;}
const fresh=keys.filter(k=>!notifKnown.set.has(k[0]));keys.forEach(k=>notifKnown.set.add(k[0]));
if(fresh.length){toast(fresh[0][1]+(fresh.length>1?' (+'+(fresh.length-1)+')':''));try{if('Notification'in window&&Notification.permission==='granted'&&S.mode!=='cloud')new Notification('Studio Tefi',{body:fresh[0][1]});}catch(e){}}
},700);}
function renderBell(){const b=$('#bell');if(!b)return;if(!ROLE){b.hidden=true;return;}b.hidden=false;const n=bellCount();const c=$('#bell-n');c.textContent=n?String(n):'';b.classList.toggle('has',!!n);
b.setAttribute('aria-label',(isAdmin()?'À traiter':'Nouveautés')+(n?' · '+n:''));b.title=isAdmin()?'À traiter':'Nouveautés';}
function docHash(d){const o={k:d.kind,n:d.number,p:d.profileId,c:d.companyId,cs:d.clientSnap?d.clientSnap.name:'',dt:d.date,du:d.dueDate,cur:d.currency,di:+d.discount||0,tx:+d.taxRate||0,dp:+d.depositPct||0,s:d.subject||'',
l:(d.lines||[]).map(l=>[l.label,+l.qty||0,l.unit||'',+l.price||0]),no:d.notes||''};
const s=JSON.stringify(o);let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return(h>>>0).toString(16)+'-'+s.length;}
const sigValid=d=>!!(d&&d.signed&&d.signed.hash===docHash(d));
function sigPill(d){if(sigValid(d))return'<span class="pill" style="--c:var(--ok)">✓ Signé</span>';if(d.sigRequested&&!d.signed)return'<span class="pill" style="--c:#C98C00">Signature demandée</span>';return'';}
const SIG_DATA={};
async function imgData(o){if(!o)return null;if(o.data)return o;if(o.ref&&S.mode==='supa'){if(!SIG_DATA[o.ref]){const r=await Supa.sb.storage.from('photos').download(o.ref);if(r.error)throw r.error;SIG_DATA[o.ref]=await blobToDataUrl(r.data);}return Object.assign({},o,{data:SIG_DATA[o.ref]});}return null;}
function imgSrc(o){if(!o)return'';if(o.data)return o.data;if(o.ref&&S.mode==='supa'){if(SIG_DATA[o.ref])return SIG_DATA[o.ref];imgData(o).then(()=>scheduleRender()).catch(()=>{});}return'';}
async function storeSigImage(name,blob,dataUrl,w,h){
if(S.mode==='supa'){const path='admin/'+name+'-'+Date.now().toString(36)+'.jpg';const r=await Supa.sb.storage.from('photos').upload(path,blob,{contentType:'image/jpeg',upsert:true});if(r.error)throw r.error;SIG_DATA[path]=dataUrl;return{ref:path,w,h,at:Date.now()};}
return{data:dataUrl,w,h,at:Date.now()};}
function canvasToJpeg(cv,trim){
let x0=0,y0=0,x1=cv.width,y1=cv.height;
if(trim){const ctx=cv.getContext('2d');const px=ctx.getImageData(0,0,cv.width,cv.height).data;x0=cv.width;y0=cv.height;x1=0;y1=0;
for(let y=0;y<cv.height;y+=2)for(let x=0;x<cv.width;x+=2){const i=(y*cv.width+x)*4;if(px[i+3]>20&&(px[i]<200||px[i+1]<200||px[i+2]<200)){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}}
if(x1<=x0||y1<=y0)return null;x0=Math.max(0,x0-12);y0=Math.max(0,y0-12);x1=Math.min(cv.width,x1+12);y1=Math.min(cv.height,y1+12);}
const w=x1-x0,h=y1-y0;const o=document.createElement('canvas');o.width=w;o.height=h;const c=o.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,w,h);c.drawImage(cv,x0,y0,w,h,0,0,w,h);
return new Promise(res=>o.toBlob(b=>res({blob:b,data:o.toDataURL('image/jpeg',0.92),w,h}),'image/jpeg',0.92));}
function signaturePanel(){
const sg=settings().signature;const src=imgSrc(sg);
return'<section class="panel" id="sig-panel"><div class="panel-h"><h2>Ma signature</h2></div><p class="hint" style="margin:-4px 0 12px">Elle s\'ajoute sur un devis ou une facture quand tu cliques sur « Signer ». '+(S.mode==='supa'?'Elle est rangée dans un dossier que seul ton compte peut lire.':'')+'</p>'+
(src?'<div class="sig-prev"><img src="'+esc(src)+'" alt="Ta signature"></div>':'<p class="muted">Aucune signature enregistrée.</p>')+
'<div class="sig-pad"><canvas id="sig-canvas" width="900" height="300" aria-label="Zone de signature : signe avec le doigt, le stylet ou la souris"></canvas><span class="hint">Signe ici avec ton doigt, ton stylet ou la souris</span></div>'+
'<div class="card-f"><button class="btn primary" data-act="sig-save">'+ICON.check+'Enregistrer cette signature</button><button class="btn" data-act="sig-clear">Effacer</button>'+
'<label class="btn" style="cursor:pointer">Importer une image<input type="file" accept="image/*" data-sig-file="1" hidden></label>'+(sg?'<button class="btn danger" data-act="sig-del" data-confirm="Supprimer ?">Supprimer</button>':'')+'</div></section>';
}
function initSigPad(){const cv=$('#sig-canvas');if(!cv||cv.__ok)return;cv.__ok=true;const ctx=cv.getContext('2d');ctx.lineWidth=5;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#111';
let last=null;const pos=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*cv.width/r.width,(e.clientY-r.top)*cv.height/r.height];};
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);last=pos(e);e.preventDefault();});
cv.addEventListener('pointermove',e=>{if(!last)return;const p=pos(e);ctx.beginPath();ctx.moveTo(last[0],last[1]);ctx.lineTo(p[0],p[1]);ctx.stroke();last=p;e.preventDefault();});
const up=()=>{last=null;};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);}
function stampField(p){const src=imgSrc(p.stamp);
return'<div class="field wide"><span>Cachet de l\'entreprise (tampon)</span><div class="set-item">'+(src?'<img src="'+esc(src)+'" alt="Cachet" style="height:52px;width:auto;border:1px solid var(--line);border-radius:6px;background:#fff;padding:3px">':'<span class="hint">Aucun cachet</span>')+
'<label class="btn small" style="cursor:pointer">Choisir une image<input type="file" accept="image/*" data-prof-stamp="'+esc(p.id)+'" hidden></label>'+(p.stamp?'<button class="btn small ghost" data-act="prof-nostamp" data-id="'+esc(p.id)+'">Retirer</button>':'')+'</div><span class="hint">Il s\'ajoute à côté de ta signature sur les documents de cette entreprise.</span></div>';}
async function loadImageFile(file,max){const r=await compressImage(file,max||700);const data=await blobToDataUrl(r.blob);return{blob:r.blob,data,w:r.w,h:r.h};}
async function signDoc(id){
if(!isAdmin()){toast('Seule Tefi peut signer.');return;}
const sg=settings().signature;if(!sg){toast('Enregistre d\'abord ta signature dans Réglages.');closeDoc(false);go('settings');setTimeout(()=>{const p=$('#sig-panel');if(p)p.scrollIntoView({block:'center'});},200);return;}
if(docDraft&&docDraft.id===id)saveDoc(true);const d=S.docs[id];if(!d){toast('Enregistre d\'abord le document.');return;}
try{toast('Signature en cours…');
const prof=profOf(d.profileId)||{};const img=await imgData(sg);const stamp=prof.stamp?await imgData(prof.stamp):null;
const at=Date.now();const out=await buildDocPdf(d,{img,stamp,name:'Tefi',at});let file=null;
if(S.mode==='supa'){const path='signed/'+d.id+'-'+at.toString(36)+'.pdf';const r=await Supa.sb.storage.from('photos').upload(path,out.blob,{contentType:'application/pdf',upsert:true});if(r.error)throw r.error;file={store:'supa',ref:path};}
const x=clone(S.docs[id]);const before=clone(x);x.signed={at,by:'Tefi',hash:docHash(x),file,stamp:!!stamp};x.sigRequested=null;saveDocDirect(x);
logChange('doc','update',id,(x.kind==='devis'?'Devis ':'Facture ')+x.number,'Signé par Tefi',before);
if(docDraft&&docDraft.id===id){docDraft=clone(x);docOrig=clone(x);renderDoc();}
toast((x.kind==='devis'?'Devis ':'Facture ')+x.number+' signé'+(x.kind==='facture'?'e':''));
}catch(e){console.error(e);toast('Signature impossible : '+errMsg(e));}
}
async function signedPdfBlob(d){
if(d.signed&&d.signed.file&&d.signed.file.store==='supa'&&S.mode==='supa'){const r=await Supa.sb.storage.from('photos').download(d.signed.file.ref);if(r.error)throw r.error;return r.data;}
const sg=settings().signature;const img=await imgData(sg);if(!img)return null;const prof=profOf(d.profileId)||{};const stamp=d.signed.stamp&&prof.stamp?await imgData(prof.stamp):null;
return(await buildDocPdf(d,{img,stamp,name:d.signed.by||'Tefi',at:d.signed.at})).blob;}
async function saveBlob(blob,filename){
let dl=null;if(window.claude&&typeof window.claude.use==='function'){try{dl=await window.claude.use('downloads');}catch(e){dl=null;}}
if(dl){try{await dl.save({filename,data:blob});toast('PDF exporté : '+filename);}catch(e){if(!e||e.code!=='declined')toast('Export impossible ('+((e&&e.code)||'erreur')+').');}return;}
const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast('PDF exporté : '+filename);}
function handleSigClick(a,el){
switch(a){
case'sig-clear':{const cv=$('#sig-canvas');if(cv)cv.getContext('2d').clearRect(0,0,cv.width,cv.height);return true;}
case'sig-save':{if(!isAdmin())return true;const cv=$('#sig-canvas');if(!cv)return true;(async()=>{const r=await canvasToJpeg(cv,true);if(!r){toast('Signe d\'abord dans le cadre.');return;}
try{const o=await storeSigImage('signature',r.blob,r.data,r.w,r.h);updateSettings(s=>{s.signature=o;},'Signature enregistrée');cv.getContext('2d').clearRect(0,0,cv.width,cv.height);toast('Signature enregistrée');}catch(e){toast('Enregistrement impossible : '+errMsg(e));}})();return true;}
case'sig-del':if(!isAdmin())return true;updateSettings(s=>{delete s.signature;},'Signature supprimée');return true;
case'prof-nostamp':if(!isAdmin())return true;updateSettings(s=>{const p=(s.profiles||[]).find(x=>x.id===el.dataset.id);if(p)delete p.stamp;},'Cachet retiré');return true;
case'doc-sign':signDoc(el.dataset.id);return true;
case'doc-sigreq':{const d=docDraft&&docDraft.id===el.dataset.id?(saveDoc(true)||docDraft):S.docs[el.dataset.id];if(!d){toast('Enregistre d\'abord le document.');return true;}
openReqForm({type:'signature',link:{kind:'doc',id:d.id}});return true;}
}
return false;
}
async function handleSigChange(el){
if(el.dataset.sigFile&&isAdmin()){const f=el.files&&el.files[0];el.value='';if(!f)return true;try{const r=await loadImageFile(f,900);const o=await storeSigImage('signature',r.blob,r.data,r.w,r.h);updateSettings(s=>{s.signature=o;},'Signature importée');toast('Signature enregistrée');}catch(e){toast('Image illisible.');}return true;}
if(el.dataset.profStamp&&isAdmin()){const pid=el.dataset.profStamp;const f=el.files&&el.files[0];el.value='';if(!f)return true;try{const r=await loadImageFile(f,500);const o=await storeSigImage('stamp-'+pid,r.blob,r.data,r.w,r.h);updateSettings(s=>{const p=(s.profiles||[]).find(x=>x.id===pid);if(p)p.stamp=o;},'Cachet enregistré');toast('Cachet enregistré');}catch(e){toast('Image illisible.');}return true;}
return false;
}
const VIEWS={home:viewHome,networks:viewNetworks,calendar:viewCalendar,contents:viewContents,ideas:viewIdeas,projection:viewProjection,plans:viewPlans,search:viewSearch,business:viewBusiness,settings:viewSettings,more:viewMore};
let rq=false;
function scheduleRender(){touch();if(document.hidden){renderHidden=true;return;}if(rq)return;rq=true;requestAnimationFrame(()=>{rq=false;render();});}
function render(){
const main=$('#main');
if(S.mode==='pending'||!S.loaded)return;
syncCurrencies();
const ae=document.activeElement;let fid=null,s0=null,s1=null;
if(ae&&ae.id&&main.contains(ae)){fid=ae.id;try{s0=ae.selectionStart;s1=ae.selectionEnd;}catch(e){}}
const kept={};main.querySelectorAll('form input[id]').forEach(i=>{if(i.value&&i.type!=='color')kept[i.id]=i.value;});
const board=$('#board');const bl=board?board.scrollLeft:0;
document.body.dataset.role=ROLE||'none';applyUiTheme();
if(!ROLE){document.body.classList.add('gated');main.innerHTML=viewGate();const pi=$('#gate-pin');if(pi)pi.focus();return;}
document.body.classList.remove('gated');applyPermClasses();
if(!isAdmin()&&S.ui.view==='settings')S.ui.view='home';
if(S.ui.view==='plans'&&!(ROLE==='assistant'||(isAdmin()&&settings().showAssistPlan)))S.ui.view='home';
const openD=[...main.querySelectorAll('details[id][open]')].map(x=>x.id);
morph(main,(ROLE==='assistant'?'<div class="rolebar"><span>Vue assistante · '+esc(roleName('assistant'))+'</span><button data-act="switch-role">'+(S.mode==='supa'?'Se déconnecter':'Changer de vue')+'</button></div>':'')+(S.mode==='supa'?Supa.banner():'')+VIEWS[S.ui.view]());
openD.forEach(i=>{const d=document.getElementById(i);if(d)d.open=true;});
Object.keys(kept).forEach(k=>{const el=document.getElementById(k);if(el&&!el.value)el.value=kept[k];});
if(fid){const el=document.getElementById(fid);if(el){el.focus({preventScroll:true});try{if(s0!=null)el.setSelectionRange(s0,s1);}catch(e){}}}
const nb=$('#board');if(nb)nb.scrollLeft=bl;
document.querySelectorAll('.nav-btn[data-nav]').forEach(b=>{if(b.dataset.nav===S.ui.view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
const cs=contents();$('#cnt-contents').textContent=cs.filter(c=>c.status!=='idee').length||'';$('#cnt-ideas').textContent=ideasToHandle().length||'';$('#cnt-pj').textContent=(can('projection')?(isAdmin()?medias().filter(m=>m.kind==='version'&&m.status==='attente').length:medias().filter(m=>(m.kind==='version'&&m.status==='corriger')||(m.kind==='rush'&&m.status==='dispo'&&m.byRole!==ROLE)).length):0)||'';$('#cnt-biz').textContent=((can('rdv')?Object.values(S.rdv).filter(x=>x.date>=today()&&x.date<=addDays(today(),6)).length:0)+(isAdmin()?pendingDocs().length:0))||'';
$('#role-btn').innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg><span>Vue <b>'+esc(roleName(ROLE))+'</b> · '+(S.mode==='supa'?'se déconnecter':'changer')+'</span>';$('#cnt-acc').textContent=Object.keys(S.accounts).length||'';
{const np=$('#nav-plans');const showP=ROLE==='assistant'||(isAdmin()&&!!settings().showAssistPlan);np.hidden=!showP;np.querySelector('.nav-plans-l').textContent=isAdmin()?'Plan de '+roleName('assistant'):'Plans de travail';
if(showP){const G=taskGroups(tasksVisible());$('#cnt-plans').textContent=(G.late.length+G.today.length)||'';}}
renderBell();if(S.ui.view==='settings')initSigPad();watchData();
if(taskDraft&&!$('#taskm').hidden&&!$('#task-panel').contains(document.activeElement))renderTask();
if(reqViewId&&!$('#reqm').hidden&&!$('#req-panel').contains(document.activeElement))renderReq();
if(!$('#inboxm').hidden)renderInbox();
if(peekId)renderPeek();
if(ideaDraft&&!$('#idea').hidden&&!$('#idea-panel').contains(document.activeElement))renderIdea();
if(pjId&&!$('#projm').hidden){const mm=S.media[pjId];const sig=mm?JSON.stringify([mm.status,mm.comments,mm.photo&&MediaStore.url(mm.photo).length]):'';if(sig!==window.__pjSig&&!$('#pj-panel').contains(document.activeElement)){window.__pjSig=sig;renderPj();}}
}
function go(view,extra){if(view==='settings'&&!isAdmin()){toast('Réservé à la vue admin.');return;}if(peekId)closePeek();S.ui.view=view;Object.assign(S.ui,extra||{});saveUI();render();window.scrollTo(0,0);}
let toastT,toastUndo=null;
function toast(msg,undo){const t=$('#toast');toastUndo=undo||null;t.innerHTML='<span>'+esc(msg)+'</span>'+(undo?'<button data-act="toast-undo">Annuler</button>':'');t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{t.hidden=true;toastUndo=null;},undo?6000:2800);}
function newContent(preset){
preset=preset||{};
const accs=accounts();const f=S.ui.filters;
const accId=preset.date?(f.account||(f.platform?(accs.find(a=>a.platform===f.platform)||{}).id:'')||(accs[0]||{}).id||''):'';
return normContent({id:uid(),title:preset.title||'',type:preset.type||(f.type||'skit'),themes:f.theme?[f.theme]:[],status:preset.status||'ecriture',
publications:preset.date?[{id:uid(),accountId:accId,date:preset.date,time:'',done:false}]:[],
scenes:[{id:uid(),heading:'Scène 1',body:''}],createdAt:Date.now()});
}
const strip=c=>{const x=clone(c);if(x)delete x.updatedAt;return JSON.stringify(x);};
function diffSummary(b,a){
const p=[];const J=JSON.stringify;
if(b.title!==a.title)p.push('Titre');
if(b.type!==a.type)p.push('Format : '+typeOf(b.type).label+' → '+typeOf(a.type).label);
if(J(b.themes||[])!==J(a.themes||[]))p.push('Thématiques');
if(b.status!==a.status)p.push('Statut : '+statusOf(b.status).label+' → '+statusOf(a.status).label);
if(J(b.publications)!==J(a.publications))p.push('Diffusion');
if(J(b.scenes)!==J(a.scenes))p.push('Script');
if(b.caption!==a.caption||b.hashtags!==a.hashtags)p.push('Légende');
if(J(b.shoots||[])!==J(a.shoots||[]))p.push('Tournages');
if(['editDate','cast','gear','duration','companyId'].some(k=>b[k]!==a[k]))p.push('Production');
if(b.notes!==a.notes)p.push('Notes');
if(J(b.checklist||[])!==J(a.checklist||[]))p.push('Checklist');
if(J(b.comments||[])!==J(a.comments||[]))p.push('Discussion');
if(J(b.expenses||[])!==J(a.expenses||[])||J(b.budget||null)!==J(a.budget||null))p.push('Budget');
return p.join(' · ')||'Modification';
}
function updateContent(id,mut,summary){
const before=S.contents[id];if(!before)return;const c=clone(before);mut(c);
if(strip(c)===strip(before))return;
Store.saveContent(c);logChange('content','update',id,titleOf(c),summary||diffSummary(before,c),before);
}
function syncStatusFromPubs(c){const ps=c.publications||[];if(ps.length&&ps.every(p=>p.done))c.status='publie';else if(c.status==='publie'&&ps.some(p=>!p.done))c.status='pret';}
function advance(id){const c=S.contents[id];if(!c)return;if(c.status==='idee'){promoteIdea(id);return;}const i=STATUSES.findIndex(s=>s.id===c.status);const nx=STATUSES[i+1];if(!nx)return;
updateContent(id,x=>{x.status=nx.id;if(nx.id==='publie')x.publications.forEach(p=>{p.done=true;});});toast('« '+titleOf(c)+' » → '+nx.label);}
function markDone(id,pid,val){if(!can('projStatus')){toast(DENIED);return;}updateContent(id,c=>{const p=c.publications.find(x=>x.id===pid);if(p)p.done=val!==false;syncStatusFromPubs(c);});if(val!==false)toast('Marqué comme publié');}
function moveEvent(spec,date){
if(spec.startsWith('rdv:')?!can('rdv'):!can('calMove')){toast(DENIED);render();return;}
const[kind,cid,xid,from]=spec.split(':');
if(kind==='rdv'){const x=S.rdv[cid];if(!x||x.date===date)return;const before=clone(x);Store.saveRdv(Object.assign(clone(x),{date}));logChange('rdv','update',cid,x.title,'Date → '+fmtShort(date),before);toast('Rendez-vous déplacé au '+fmtDay(date));return;}
if(kind==='shoot'){const delta=diffDays(date,from);if(!delta)return;
updateContent(cid,c=>{const s=c.shoots.find(x=>x.id===xid);if(!s)return;s.start=addDays(s.start,delta);if(isValidDate(s.end))s.end=addDays(s.end,delta);},'Tournage décalé de '+(delta>0?'+':'')+delta+' j');return;}
updateContent(cid,c=>{if(kind==='pub'){const p=c.publications.find(x=>x.id===xid);if(p)p.date=date;}else if(kind==='edit')c.editDate=date;},
(kind==='pub'?'Date de publication':'Date de montage')+' → '+fmtShort(date));
}
function setStatus(id,status){if(!can('projStatus')){toast(DENIED);render();return;}updateContent(id,c=>{c.status=status;if(status==='publie')c.publications.forEach(p=>{p.done=true;});});}
function deleteContent(id){
const before=S.contents[id];if(!before)return;
Store.deleteContent(id);logChange('content','delete',id,titleOf(before),'Contenu supprimé',before);
if(peekId===id)closePeek();
toast('« '+titleOf(before)+' » supprimé',()=>{Store.saveContent(before);logChange('content','restore',id,titleOf(before),'Suppression annulée',null);toast('Contenu restauré');});
}
function addAccount(pl,handle,nat){
const h=normHandle(handle,pl);if(!h){toast('Écris le nom du compte.');return false;}
if(accounts().some(a=>a.platform===pl&&a.handle.toLowerCase()===h.toLowerCase())){toast('Ce compte existe déjà.');return false;}
const a={id:uid(),platform:pl,handle:h,nature:nat||'perso',createdAt:Date.now()};
Store.saveAccount(a);logChange('account','create',a.id,h,platOf(pl).label+' · '+(nat==='pro'?'Pro':'Perso'),null);
toast(h+' ajouté sur '+platOf(pl).label);return true;
}
function updateAccount(id,patch,summary){const before=S.accounts[id];if(!before)return;const a=Object.assign(clone(before),patch);Store.saveAccount(a);logChange('account','update',id,a.handle,summary,before);}
function deleteAccount(id){const before=S.accounts[id];if(!before)return;Store.deleteAccount(id);if(S.ui.filters.account===id){S.ui.filters.account='';saveUI();}
logChange('account','delete',id,before.handle,'Compte supprimé',before);
toast(before.handle+' supprimé',()=>{Store.saveAccount(before);logChange('account','restore',id,before.handle,'Suppression annulée',null);});}
function updateSettings(mut,summary){const before=clone(settings());const s=clone(before);mut(s);Store.saveSettings(s);logChange('settings','update','settings','Réglages',summary,before);}
function restore(hid){
let e=S.history.find(x=>x.id===hid);if(!e||!e.before)return;
if(e.before.__patch){const B=histUnpatch(e);if(!B){toast('Cet élément n\'existe plus : restaure d\'abord sa suppression.');return;}e=Object.assign({},e,{before:B});}
if(e.kind==='content'){const cur=S.contents[e.refId]||null;Store.saveContent(e.before);if(draft&&draft.id===e.refId){clearTimeout(saveT);pending=false;draft=normContent(clone(e.before));editorOrig=clone(e.before);setTimeout(renderEditor,0);}logChange('content','restore',e.refId,titleOf(e.before),'Retour à la version du '+fmtStamp(e.at),cur);}
else if(e.kind==='account'){const cur=S.accounts[e.refId]||null;Store.saveAccount(e.before);logChange('account','restore',e.refId,e.before.handle,'Retour à la version du '+fmtStamp(e.at),cur);}
else if(e.kind==='media'){const cur=S.media[e.refId]||null;Store.save('media',e.before);logChange('media','restore',e.refId,e.before.title||'Média','Retour à la version du '+fmtStamp(e.at),cur);}
else if(e.kind==='deal'){const cur=S.deals[e.refId]||null;Store.save('deals',e.before);logChange('deal','restore',e.refId,e.before.title||'Partenariat','Retour à la version du '+fmtStamp(e.at),cur);}
else if(e.kind==='contact'){const cur=S.contacts[e.refId]||null;Store.save('contacts',e.before);logChange('contact','restore',e.refId,e.before.name||'Contact','Retour à la version du '+fmtStamp(e.at),cur);}
else if(e.kind==='doc'){const cur=S.docs[e.refId]||null;saveDocDirect(e.before);logChange('doc','restore',e.refId,e.before.number,'Retour à la version du '+fmtStamp(e.at),cur);}
else if(e.kind==='rdv'){const cur=S.rdv[e.refId]||null;Store.saveRdv(e.before);logChange('rdv','restore',e.refId,e.before.title,'Retour à la version du '+fmtStamp(e.at),cur);}
else if(e.kind==='task'){const cur=S.tasks[e.refId]||null;Store.save('tasks',e.before);logChange('task','restore',e.refId,e.before.title||'Tâche','Retour à la version du '+fmtStamp(e.at),cur);}
else if(e.kind==='request'){const cur=S.requests[e.refId]||null;Store.save('requests',e.before);logChange('request','restore',e.refId,reqTitle(e.before),'Retour à la version du '+fmtStamp(e.at),cur);}
else if(e.kind==='settings'){const cur=clone(settings());Store.saveSettings(e.before);logChange('settings','restore','settings','Réglages','Retour à la version du '+fmtStamp(e.at),cur);}
toast('Version restaurée');
}
async function exportData(){
const data=JSON.stringify({app:'studio-tefi',version:1,exportedAt:new Date().toISOString(),settings:S.settings||DEFAULT_SETTINGS,accounts:Object.values(S.accounts),rdv:Object.values(S.rdv),docs:Object.values(S.docs),media:Object.values(S.media),deals:Object.values(S.deals),contacts:Object.values(S.contacts),tasks:Object.values(S.tasks),requests:Object.values(S.requests),contents:Object.values(S.contents)},null,2);
const filename='studio-tefi-sauvegarde-'+today()+'.json';
let dl=null;
if(window.claude&&typeof window.claude.use==='function'){try{dl=await window.claude.use('downloads');}catch(e){dl=null;}}
if(dl){try{await dl.save({filename,data});toast('Sauvegarde exportée');}catch(e){if(!e||e.code!=='declined')toast('Export impossible ('+((e&&e.code)||'erreur')+').');}return;}
try{const b=new Blob([data],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),2000);toast('Sauvegarde exportée');}
catch(e){toast("Export impossible depuis ce navigateur.");}
}
function importData(text){
let d;try{d=JSON.parse(text);}catch(e){toast("Ce fichier n'est pas une sauvegarde valide.");return;}
if(!d||d.app!=='studio-tefi'){toast("Ce fichier ne vient pas de Studio Tefi.");return;}
if(d.settings&&Array.isArray(d.settings.types))Store.saveSettings(d.settings);
(d.accounts||[]).forEach(a=>{if(a&&a.id)Store.saveAccount(a);});
(d.contents||[]).forEach(c=>{if(c&&c.id)Store.saveContent(normContent(c));});
(d.rdv||[]).forEach(x=>{if(x&&x.id)Store.saveRdv(x);});
(d.docs||[]).forEach(x=>{if(x&&x.id)saveDocDirect(x);});
['media','deals','contacts','tasks','requests'].forEach(c=>(d[c]||[]).forEach(x=>{if(x&&x.id)Store.save(c,x);}));
logChange('settings','update','import','Import de sauvegarde',plural((d.contents||[]).length,'contenu')+', '+plural((d.accounts||[]).length,'compte'),null);
toast('Import terminé : '+plural((d.contents||[]).length,'contenu')+', '+plural((d.accounts||[]).length,'compte'));
}
function normHandle(v,pid){if(pid&&!isSocial(pid))return String(v||'').trim().replace(/\s+/g,' ');v=String(v||'').trim().replace(/\s+/g,'');if(!v)return'';return v.startsWith('@')?v:'@'+v;}
let peekId=null;
function openPeek(id){if(!S.contents[id])return;peekId=id;renderPeek();$('#peek').hidden=false;document.body.classList.add('locked');const b=$('#peek-panel [data-act=peek-close]');if(b)b.focus({preventScroll:true});}
function closePeek(){peekId=null;$('#peek').hidden=true;if(!draft)document.body.classList.remove('locked');}
function renderPeek(){
const c=S.contents[peekId];if(!c){closePeek();return;}
const panel=$('#peek-panel');const st=panel.scrollTop;const ae=document.activeElement;const fid=ae&&ae.id&&panel.contains(ae)?ae.id:null;
const t=typeOf(c.type);
let h='<div class="peek-h"><div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:8px"><div class="card-f"><span class="pill" style="--c:'+t.color+'">'+esc(t.label)+'</span>'+distPill(c)+themePills(c)+'</div><h2>'+esc(titleOf(c))+'</h2></div><button class="icon-btn" data-act="peek-close" aria-label="Fermer">'+ICON.x+'</button></div>';
h+='<div class="peek-b">';
h+='<label class="field"><span>Statut</span><select class="inp" id="pk-status" data-pk="status" style="max-width:220px">'+STATUSES.map(s=>'<option value="'+s.id+'"'+(s.id===c.status?' selected':'')+'>'+s.label+'</option>').join('')+'</select></label>';
h+='<div class="ed-sec"><div class="ed-sec-h"><h3>Diffusion</h3><span class="mono muted">'+c.publications.length+'</span></div>';
h+=c.publications.length?c.publications.map(p=>{const a=S.accounts[p.accountId];const late=!p.done&&isValidDate(p.date)&&p.date<today();
return'<div class="ppub'+(late?' late':'')+'"><div class="acc"><span class="dot" style="--c:'+accColor(a)+'"></span><span class="h">'+(a?esc(platOf(a.platform).label)+' · '+esc(a.handle):esc(pendingLabel(p)))+'</span>'+natBadge(a)+prepLink(a,c,p)+'</div>'+
'<input class="inp" type="date" id="pk-d-'+esc(p.id)+'" data-ppf="date" data-pid="'+esc(p.id)+'" value="'+esc(p.date)+'" aria-label="Date">'+
'<input class="inp" type="time" id="pk-t-'+esc(p.id)+'" data-ppf="time" data-pid="'+esc(p.id)+'" value="'+esc(p.time)+'" aria-label="Heure">'+
'<label class="pub-done"><input type="checkbox" id="pk-c-'+esc(p.id)+'" data-ppf="done" data-pid="'+esc(p.id)+'"'+(p.done?' checked':'')+'>Publié</label>'+
'<button class="icon-btn sm danger" data-act="peek-delpub" data-pid="'+esc(p.id)+'" data-confirm="Retirer ?" aria-label="Retirer cette diffusion">'+ICON.trash+'</button></div>'+pubStatsHtml(c,p);}).join('')
:'<p class="hint" style="margin:0">Pas encore planifié.</p>';
h+='</div>';
if(c.shoots.length)h+='<div class="ed-sec"><div class="ed-sec-h"><h3>Tournages</h3><span class="mono muted">'+c.shoots.length+'</span></div><div class="rows">'+c.shoots.map(s=>'<div class="row"><div class="row-main" style="cursor:default"><b>'+esc(fmtShoot(s))+'</b><span class="row-meta">'+(s.location?'<span>📍 '+esc(s.location)+'</span>':'<span>Lieu à définir</span>')+(s.note?'<span>'+esc(s.note)+'</span>':'')+'</span></div></div>').join('')+'</div></div>';
const kv=[['Client',compOf(c.companyId)?compOf(c.companyId).label:''],['Montage',isValidDate(c.editDate)?fmtDay(c.editDate):''],['Durée',c.duration],['Participants',c.cast],['Matériel',c.gear]].filter(x=>x[1]);
if(kv.length)h+='<div class="ed-sec"><div class="ed-sec-h"><h3>Production</h3></div><div class="kvs">'+kv.map(x=>'<div><span class="label">'+x[0]+'</span><b>'+esc(x[1])+'</b></div>').join('')+'</div></div>';
const script=(c.scenes||[]).filter(s=>s.body.trim()).map(s=>s.heading.toUpperCase()+'\n'+s.body).join('\n\n');
if(script)h+='<div class="ed-sec"><div class="ed-sec-h"><h3>Script</h3></div><pre class="script-ex">'+esc(script.length>900?script.slice(0,900)+'…':script)+'</pre></div>';
if(c.caption||c.hashtags)h+='<div class="ed-sec"><div class="ed-sec-h"><h3>Légende</h3><button class="btn small" data-act="peek-copy">'+ICON.copy+'Copier</button></div><p style="margin:0;white-space:pre-wrap;overflow-wrap:anywhere">'+esc(c.caption)+(c.hashtags?'\n<span style="color:var(--accent)">'+esc(c.hashtags)+'</span>':'')+'</p></div>';
if(c.notes)h+='<div class="ed-sec"><div class="ed-sec-h"><h3>Notes</h3></div><p style="margin:0;white-space:pre-wrap;overflow-wrap:anywhere">'+esc(c.notes)+'</p></div>';
h+=peekExtras(c);
const hist=S.history.filter(e=>e.kind==='content'&&e.refId===c.id).slice(0,4);
if(hist.length)h+='<div class="ed-sec"><div class="ed-sec-h"><h3>Dernières modifications</h3></div><div class="hist">'+hist.map(histRow).join('')+'</div></div>';
h+='</div><div class="peek-f"><button class="btn primary need-projEdit" data-act="peek-edit">'+ICON.edit+'Modifier</button><button class="btn need-projEdit" data-act="peek-dup">'+ICON.copy+'Dupliquer</button>'+(ROLE==='assistant'&&can('requests')?'<button class="btn" data-act="req-ctx" data-type="question" data-lk="content" data-lid="'+esc(c.id)+'">Demander à Tefi</button>':'')+(can('projDelete')?'<button class="btn danger" data-act="del-content" data-id="'+esc(c.id)+'" data-confirm="Supprimer le contenu ?">'+ICON.trash+'Supprimer</button>':'')+'</div>';
morph(panel,h);panel.scrollTop=st;if(fid){const el=document.getElementById(fid);if(el)el.focus({preventScroll:true});}
}
$('#peek-panel').addEventListener('change',e=>{
const el=e.target;if(!peekId)return;const id=peekId;
if((el.dataset.pk==='status'||el.dataset.ppf==='done')&&!can('projStatus')){toast(DENIED);renderPeek();return;}
if((el.dataset.ppf==='date'||el.dataset.ppf==='time')&&!can('calMove')){toast(DENIED);renderPeek();return;}
if(el.dataset.pk==='status')setStatus(id,el.value);
else if(el.dataset.ppf==='done')markDone(id,el.dataset.pid,el.checked);
else if(el.dataset.ppf==='date'&&isValidDate(el.value))updateContent(id,c=>{const p=c.publications.find(x=>x.id===el.dataset.pid);if(p)p.date=el.value;},'Date de publication → '+fmtShort(el.value));
else if(el.dataset.ppf==='time')updateContent(id,c=>{const p=c.publications.find(x=>x.id===el.dataset.pid);if(p)p.time=el.value;},'Heure → '+(el.value||'aucune'));
});
$('#peek').addEventListener('click',e=>{if(e.target.id==='peek')closePeek();});
let draft=null,saveT=null,pending=false,editorOrig=null;
function isBlank(c){return!c.title.trim()&&!c.publications.length&&!c.notes.trim()&&!c.scenes.some(s=>s.body.trim())&&!c.caption.trim();}
function openEditor(id,preset){
if(peekId){peekId=null;$('#peek').hidden=true;}
editorOrig=id&&S.contents[id]?clone(S.contents[id]):null;
draft=editorOrig?normContent(clone(editorOrig)):newContent(preset);
renderEditor();$('#sheet').hidden=false;document.body.classList.add('locked');
if(!id){const ti=$('#ed-title');if(ti)ti.focus();}
}
function commitEditorLog(){
if(!draft)return;const saved=S.contents[draft.id];if(!saved)return;
if(!editorOrig){logChange('content','create',draft.id,titleOf(saved),'Contenu créé',null);editorOrig=clone(saved);return;}
if(strip(saved)!==strip(editorOrig)){logChange('content','update',draft.id,titleOf(saved),diffSummary(editorOrig,saved),editorOrig);editorOrig=clone(saved);}
}
function closeEditor(){flushSave();commitEditorLog();draft=null;editorOrig=null;$('#sheet').hidden=true;document.body.classList.remove('locked');}
function scheduleSave(){pending=true;updateSaved();clearTimeout(saveT);saveT=setTimeout(flushSave,650);}
function flushSave(){clearTimeout(saveT);if(!draft||!pending)return;pending=false;if(isBlank(draft)&&!S.contents[draft.id]){updateSaved();return;}Store.saveContent(draft);updateSaved();}
function updateSaved(){const el=$('#ed-saved');if(!el||!draft)return;el.className='saved'+(pending?' pending':'');el.innerHTML='<i></i>'+(pending?'Modification…':(S.contents[draft.id]?'Enregistré':'Brouillon'));}
function chanSelect(p){
const st=settings();const ch=pubChannel(p);
return'<select class="inp" data-pf="channel" data-pid="'+esc(p.id)+'" id="pch-'+esc(p.id)+'" aria-label="Distribution">'+st.channels.map(c=>'<option value="'+esc(c.id)+'"'+(c.id===ch?' selected':'')+'>'+esc(c.label)+'</option>').join('')+'</select>';
}
function accSelect(p){
const st=settings();const ch=pubChannel(p)||'social';const social=ch==='social';
const pls=st.platforms.filter(pl=>pl.channel===ch);
const groups=pls.map(pl=>{const as=accounts().filter(a=>a.platform===pl.id);return as.length?'<optgroup label="'+esc(pl.label)+'">'+as.map(a=>'<option value="'+esc(a.id)+'"'+(a.id===p.accountId?' selected':'')+'>'+esc(a.handle)+(a.nature?' ('+(a.nature==='pro'?'pro':'perso')+')':'')+'</option>').join('')+'</optgroup>':'';}).join('');
return'<select class="inp" data-pf="accountId" data-pid="'+esc(p.id)+'" id="pa-'+esc(p.id)+'" aria-label="Compte"><option value="">'+(groups?(social?'Choisir un compte…':'À préciser'):'Rien dans '+esc(chanOf(ch).label)+' · ajoute-le dans Réseaux')+'</option>'+groups+
(p.accountId&&!S.accounts[p.accountId]?'<option value="'+esc(p.accountId)+'" selected>Compte supprimé</option>':'')+'</select>';
}
function renderEditor(){
const c=draft;if(!c)return;
const body=$('#sheet-panel .sheet-body');const st=body?body.scrollTop:0;
const ae=document.activeElement;let fid=null;if(ae&&ae.id&&$('#sheet-panel').contains(ae))fid=ae.id;
const S2=settings();const types=S2.types;
let h='<div class="sheet-top"><button class="icon-btn" data-act="ed-close" aria-label="Fermer">'+ICON.x+'</button><span class="saved" id="ed-saved"></span>'+
'<button class="btn small" data-act="ed-copy" title="Copier la légende et les hashtags">'+ICON.copy+'Légende</button><button class="btn small primary" data-act="ed-close">Terminé</button></div>';
h+='<div class="sheet-body">'+editorTop(c);
h+='<div class="ed-sec"><input class="title-inp" id="ed-title" data-f="title" value="'+esc(c.title)+'" placeholder="Titre du contenu" aria-label="Titre">'+
'<div class="f-grid"><label class="field"><span>Format</span><select class="inp" id="ed-type" data-f="type">'+types.map(t=>'<option value="'+esc(t.id)+'"'+(t.id===c.type?' selected':'')+'>'+esc(t.label)+'</option>').join('')+(types.some(t=>t.id===c.type)?'':'<option value="'+esc(c.type)+'" selected>Sans format</option>')+'</select></label>'+
'<label class="field"><span>Durée</span><input class="inp" id="ed-duration" data-f="duration" value="'+esc(c.duration)+'" placeholder="ex. 60 s, 12 min"></label></div>'+
'<div class="field"><span>Thématiques</span><div class="theme-pick">'+S2.themes.map(t=>'<button type="button" data-act="ed-theme" data-t="'+esc(t.id)+'" aria-pressed="'+c.themes.includes(t.id)+'">'+esc(t.label)+'</button>').join('')+'</div></div>'+
'<div class="field"><span>Statut</span><div class="status-pick">'+STATUSES.map(s=>'<button type="button" data-act="ed-status" data-s="'+s.id+'" style="--c:'+s.c+'" aria-pressed="'+(c.status===s.id)+'"><span class="dot" style="--c:'+s.c+'"></span>'+s.label+'</button>').join('')+'</div></div></div>';
h+='<div class="ed-sec"><div class="ed-sec-h"><h2>Diffusion'+(distLabel(c)?' <span class="pill plain" style="vertical-align:middle">'+esc(distLabel(c))+'</span>':'')+'</h2><button class="btn small" data-act="ed-addpub">'+ICON.plus+'Ajouter une diffusion</button></div>'+suggestAccHtml(c);
if(!accounts().length)h+='<p class="hint" style="margin:0">Aucun compte enregistré. <button class="btn ghost small" data-act="ed-goto-networks">Ajouter tes comptes</button></p>';
h+=c.publications.length?c.publications.map(p=>'<div class="pub'+(p.done?' isdone':'')+'"><div class="pub-acc">'+chanSelect(p)+accSelect(p)+'</div>'+
'<input class="inp" type="date" id="pd-'+esc(p.id)+'" data-pf="date" data-pid="'+esc(p.id)+'" value="'+esc(p.date)+'" aria-label="Date de publication">'+
'<input class="inp" type="time" id="pt-'+esc(p.id)+'" data-pf="time" data-pid="'+esc(p.id)+'" value="'+esc(p.time)+'" aria-label="Heure">'+
'<label class="pub-done"><input type="checkbox" id="pc-'+esc(p.id)+'" data-pf="done" data-pid="'+esc(p.id)+'"'+(p.done?' checked':'')+'>Publié</label>'+
'<button class="icon-btn" data-act="ed-delpub" data-pid="'+esc(p.id)+'" aria-label="Retirer cette diffusion">'+ICON.x+'</button></div>').join('')
:'<p class="hint" style="margin:0">Pas encore planifié. Ajoute une plateforme pour choisir le compte et la date. Un même contenu peut partir sur plusieurs comptes à des dates différentes.</p>';
h+='</div>';
h+='<div class="ed-sec"><div class="ed-sec-h"><h2>Tournages</h2><button class="btn small" data-act="ed-addshoot">'+ICON.plus+'Ajouter un tournage</button></div>'+
(c.shoots.length?c.shoots.map((s,i)=>'<div class="shoot"><label class="field sh-start"><span>'+(c.shoots.length>1?'Session '+(i+1)+' · du':'Du')+'</span><input class="inp" type="date" id="ss-'+esc(s.id)+'" data-shf="start" data-shid="'+esc(s.id)+'" value="'+esc(s.start)+'"></label>'+
'<label class="field sh-end"><span>Au (si plusieurs jours)</span><input class="inp" type="date" id="se-'+esc(s.id)+'" data-shf="end" data-shid="'+esc(s.id)+'" value="'+esc(s.end)+'" min="'+esc(s.start)+'"></label>'+
'<label class="field sh-loc"><span>Lieu</span><input class="inp" id="sl-'+esc(s.id)+'" data-shf="location" data-shid="'+esc(s.id)+'" value="'+esc(s.location)+'" placeholder="ex. Analakely"></label>'+
'<button class="icon-btn sh-x" data-act="ed-delshoot" data-shid="'+esc(s.id)+'" data-confirm="✓" aria-label="Supprimer ce tournage">'+ICON.x+'</button>'+
'<label class="field sh-note"><span>Note</span><input class="inp" id="sn-'+esc(s.id)+'" data-shf="note" data-shid="'+esc(s.id)+'" value="'+esc(s.note)+'" placeholder="Scènes tournées, équipe, horaires…"></label>'+
'<span class="hint sh-sum" id="sum-'+esc(s.id)+'">'+esc(fmtShoot(s))+'</span></div>').join('')
:'<p class="hint" style="margin:0">Aucun tournage prévu. Ajoute une session d\'un jour, ou de plusieurs jours avec « Au ». Tu peux en ajouter autant que nécessaire, chacune avec son lieu.</p>')+'</div>';
h+='<div class="ed-sec"><div class="ed-sec-h"><h2>Production</h2></div><div class="f-grid">'+
'<label class="field"><span>Client</span><select class="inp" id="ed-comp" data-f="companyId"><option value="">Aucun (contenu perso)</option>'+companies().map(k=>'<option value="'+esc(k.id)+'"'+(k.id===c.companyId?' selected':'')+'>'+esc(k.label)+'</option>').join('')+'</select></label>'+
'<label class="field"><span>Date de montage</span><input class="inp" type="date" id="ed-edit" data-f="editDate" value="'+esc(c.editDate)+'"></label>'+
'<label class="field wide"><span>Acteurs / participants</span><input class="inp" id="ed-cast" data-f="cast" value="'+esc(c.cast)+'" placeholder="Noms séparés par des virgules"></label>'+
'<label class="field wide"><span>Matériel nécessaire</span><textarea class="inp" id="ed-gear" data-f="gear" rows="2" placeholder="Caméra, micro-cravate, perche, costume…">'+esc(c.gear)+'</textarea></label></div></div>';
h+='<div class="ed-sec"><div class="ed-sec-h"><h2>Script</h2><button class="btn small" data-act="ed-addscene">'+ICON.plus+'Scène</button></div>'+
c.scenes.map((s,i)=>'<div class="scene"><div class="scene-h"><input id="sh-'+esc(s.id)+'" data-sf="heading" data-sid="'+esc(s.id)+'" value="'+esc(s.heading)+'" aria-label="Titre de la scène '+(i+1)+'" placeholder="Scène '+(i+1)+' · lieu, moment">'+
(c.scenes.length>1?'<button class="icon-btn sm" data-act="ed-delscene" data-sid="'+esc(s.id)+'" data-confirm="✓" aria-label="Supprimer la scène">'+ICON.x+'</button>':'')+'</div>'+
'<textarea id="sb-'+esc(s.id)+'" data-sf="body" data-sid="'+esc(s.id)+'" placeholder="Action, dialogues, plans…\n\nTEFI\nSalut tout le monde !">'+esc(s.body)+'</textarea></div>').join('')+'</div>';
const tags=(c.hashtags.match(/#[^\s#]+/g)||[]).length;
h+='<div class="ed-sec"><div class="ed-sec-h"><h2>Légende &amp; hashtags</h2></div>'+
'<label class="field"><span>Légende / description</span><textarea class="inp" id="ed-caption" data-f="caption" rows="4" placeholder="Le texte qui accompagnera la publication">'+esc(c.caption)+'</textarea></label>'+
'<label class="field"><span>Hashtags <span class="mono" id="ed-tagcount">· '+tags+'</span></span><input class="inp" id="ed-tags" data-f="hashtags" value="'+esc(c.hashtags)+'" placeholder="#madagascar #skit #humour"></label></div>';
h+='<div class="ed-sec"><div class="ed-sec-h"><h2>Notes</h2></div><textarea class="inp" id="ed-notes" data-f="notes" rows="4" placeholder="Idées, références, retours…">'+esc(c.notes)+'</textarea></div>';
h+=editorExtras(c);
const hist=S.history.filter(e=>e.kind==='content'&&e.refId===c.id).slice(0,10);
h+='<div class="ed-sec"><div class="ed-sec-h"><h2>Historique de ce contenu</h2></div>'+(hist.length?'<div class="hist">'+hist.map(histRow).join('')+'</div>':'<p class="hint" style="margin:0">Les versions précédentes apparaîtront ici après tes modifications.</p>')+'</div>';
h+='<div class="ed-foot"><button class="btn" data-act="ed-dup">'+ICON.copy+'Dupliquer</button><button class="btn" data-act="ed-tpl-save">Enregistrer comme modèle</button>'+(S.contents[c.id]&&can('projDelete')?'<button class="btn danger" data-act="ed-delete" data-confirm="Supprimer définitivement ?">'+ICON.trash+'Supprimer</button>':'')+'</div>';
h+='</div>';
morph($('#sheet-panel'),h);updateSaved();
const nb=$('#sheet-panel .sheet-body');if(nb)nb.scrollTop=st;
if(fid){const el=document.getElementById(fid);if(el)el.focus({preventScroll:true});}
}
$('#sheet-panel').addEventListener('input',e=>{
if(!draft)return;const el=e.target;
if(el.dataset.f){draft[el.dataset.f]=el.value;
if(el.dataset.f==='hashtags'){const n=$('#ed-tagcount');if(n)n.textContent='· '+((el.value.match(/#[^\s#]+/g)||[]).length);}
scheduleSave();}
else if(el.dataset.pf&&el.dataset.pf!=='done'&&el.dataset.pf!=='channel'&&el.dataset.pf!=='accountId'){const p=draft.publications.find(x=>x.id===el.dataset.pid);if(p){p[el.dataset.pf]=el.value;scheduleSave();}}
else if(el.dataset.sf){const s=draft.scenes.find(x=>x.id===el.dataset.sid);if(s){s[el.dataset.sf]=el.value;scheduleSave();}}
else if(el.dataset.shf){const s=draft.shoots.find(x=>x.id===el.dataset.shid);if(s){s[el.dataset.shf]=el.value;
if(el.dataset.shf==='start'){const en=document.getElementById('se-'+s.id);if(en)en.min=el.value;}
const sm=document.getElementById('sum-'+s.id);if(sm)sm.textContent=fmtShoot(s);scheduleSave();}}
});
$('#sheet-panel').addEventListener('change',e=>{
if(!draft)return;const el=e.target;
if(el.dataset.pf==='done'){const p=draft.publications.find(x=>x.id===el.dataset.pid);if(p){p.done=el.checked;syncStatusFromPubs(draft);scheduleSave();renderEditor();}}
else if(el.dataset.f==='type'){draft.type=el.value;scheduleSave();}
else if(el.dataset.pf==='accountId'){const p=draft.publications.find(x=>x.id===el.dataset.pid);if(p){p.accountId=el.value;const a=S.accounts[el.value];if(a)p.channel=platOf(a.platform).channel||'social';scheduleSave();renderEditor();}}
else if(el.dataset.pf==='channel'){const p=draft.publications.find(x=>x.id===el.dataset.pid);if(p){p.channel=el.value;const a=S.accounts[p.accountId];if(a&&(platOf(a.platform).channel||'social')!==el.value)p.accountId='';scheduleSave();renderEditor();}}
});
$('#sheet').addEventListener('click',e=>{if(e.target.id==='sheet')closeEditor();});
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(draft)closeEditor();else if(peekId)closePeek();else if(!$('#idea').hidden)closeIdea();else if(!$('#rdvm').hidden)closeRdv();else if(!$('#projm').hidden)closePj();else if(!$('#formm').hidden)closeForm();else if(!$('#msgm').hidden)closeMsg();else if(!$('#docsheet').hidden)closeDoc();else if(!$('#taskm').hidden)closeTask();else if(!$('#reqm').hidden)closeReq();else if(!$('#inboxm').hidden)closeInbox();});
taskPanelEvents();reqPanelEvents();
function arm(btn){
if(btn.dataset.armed==='1')return true;
btn.dataset.armed='1';btn.dataset.orig=btn.innerHTML;btn.textContent=btn.dataset.confirm;
setTimeout(()=>{if(btn.isConnected&&btn.dataset.armed==='1'){btn.dataset.armed='';btn.innerHTML=btn.dataset.orig;}},3500);
return false;
}
document.addEventListener('click',e=>{
const nav=e.target.closest('[data-nav]');
if(nav&&!e.target.closest('[data-act]')){if(peekId)closePeek();go(nav.dataset.nav);return;}
const el=e.target.closest('[data-act]');if(!el)return;
if(el.dataset.confirm&&!arm(el)){e.stopPropagation();e.preventDefault();return;}
const a=el.dataset.act,id=el.dataset.id;
if(a==='go-client'){S.ui.bizTab='comp';go('business');return;}
if(handleM5Click(a,el,e))return;
if(handleM4Click(a,el))return;
if(handleProjClick(a,el))return;
if(handlePjClick(a,el,e))return;
if(handleSuiviClick(a,el))return;
if(handleBillingClick(a,el,e))return;
if(handleTaskClick(a,el))return;
if(handleReqClick(a,el))return;
if(handleSigClick(a,el))return;
if(!actAllowed(a,el))return;
if(handleV3Click(a,el,e))return;
switch(a){
case'new':openEditor(null,{date:el.dataset.date,status:el.dataset.status});break;
case'open':e.stopPropagation();openEditor(id);break;
case'peek':openPeek(id);break;
case'del-content':e.stopPropagation();deleteContent(id);break;
case'advance':e.stopPropagation();advance(id);break;
case'mark-done':e.stopPropagation();markDone(id,el.dataset.pid,true);break;
case'home-sel':S.ui.homeSel=el.dataset.sel;saveUI();render();{const p=$('#home-detail');if(p&&window.innerWidth<900)p.scrollIntoView({behavior:'smooth',block:'start'});}break;
case'goto-cal':go('calendar',{calMode:'month',cursor:today(),selDay:today()});break;
case'filter-account':S.ui.filters={channel:'',platform:'',account:id,nature:'',type:'',theme:'',status:''};go('calendar',{calMode:'list'});break;
case'reset-filters':S.ui.filters={channel:'',platform:'',account:'',nature:'',type:'',theme:'',status:''};saveUI();render();break;
case'cal-prev':case'cal-next':{const dir=a==='cal-next'?1:-1;const u=S.ui;
if(u.calMode==='week'){u.cursor=addDays(u.cursor,7*dir);u.selDay=weekStart(u.cursor);}
else{const d=pd(u.cursor);const n=new Date(d.getFullYear(),d.getMonth()+dir,1);u.cursor=ds(n);const t=today();u.selDay=(pd(t).getMonth()===n.getMonth()&&pd(t).getFullYear()===n.getFullYear())?t:ds(n);}
saveUI();render();break;}
case'cal-today':S.ui.cursor=today();S.ui.selDay=today();saveUI();render();break;
case'cal-mode':S.ui.calMode=el.dataset.mode;saveUI();render();break;
case'sel-day':S.ui.selDay=el.dataset.date;{const d=pd(el.dataset.date),c=pd(S.ui.cursor);if(d.getMonth()!==c.getMonth()||d.getFullYear()!==c.getFullYear())S.ui.cursor=el.dataset.date;}saveUI();render();break;
case'list-mode':S.ui.listMode=el.dataset.mode;saveUI();render();break;
case'acc-del':deleteAccount(id);break;
case'acc-nature':{const acc=S.accounts[id];if(acc&&acc.nature!==el.dataset.n)updateAccount(id,{nature:el.dataset.n},'Nature → '+(el.dataset.n==='pro'?'Pro':'Perso'));break;}
case'type-del':{const used=contents().filter(c=>c.type===id).length;if(used){toast(plural(used,'contenu')+' utilise'+(used>1?'nt':'')+' ce format. Change-les d\'abord.');render();break;}
const lbl=typeOf(id).label;updateSettings(s=>{s.types=s.types.filter(t=>t.id!==id);},'Format « '+lbl+' » supprimé');break;}
case'chan-del':{if(settings().platforms.some(p=>p.channel===id)){toast('Déplace d\'abord les plateformes de ce type.');render();break;}
const lbl=chanOf(id).label;updateSettings(s=>{s.channels=s.channels.filter(c=>c.id!==id);},'Distribution « '+lbl+' » supprimée');break;}
case'theme-del':{const lbl=(themeOf(id)||{}).label||'';updateSettings(s=>{s.themes=s.themes.filter(t=>t.id!==id);},'Thématique « '+lbl+' » supprimée');break;}
case'plat-del':{if(accounts().some(x=>x.platform===id)){toast('Supprime d\'abord les comptes de cette plateforme.');render();break;}
const lbl=platOf(id).label;updateSettings(s=>{s.platforms=s.platforms.filter(p=>p.id!==id);},'Plateforme « '+lbl+' » supprimée');break;}
case'restore':restore(el.dataset.hid);break;
case'hist-all':S.ui.histAll=true;render();break;
case'toast-undo':{const f=toastUndo;toastUndo=null;$('#toast').hidden=true;if(f)f();break;}
case'export':exportData();break;
case'import':$('#import-file').click();break;
case'gist-copy':copyText(Sync.cfg&&Sync.cfg.gistId||'','Identifiant copié',$('#gist-id'));break;
case'gist-push':Sync.push();break;
case'gist-pull':Sync.dirty=false;Sync.pull();break;
case'gist-off':Sync.disconnect();render();break;
case'peek-close':closePeek();break;
case'peek-edit':openEditor(peekId);break;
case'peek-dup':{const src=S.contents[peekId];if(!src)break;const c=dupOf(src);Store.saveContent(c);logChange('content','create',c.id,titleOf(c),'Copie de « '+titleOf(src)+' »',null);peekId=c.id;renderPeek();toast('Copie créée');break;}
case'peek-delpub':{const pid=el.dataset.pid;updateContent(peekId,c=>{c.publications=c.publications.filter(p=>p.id!==pid);},'Diffusion retirée');toast('Diffusion retirée');break;}
case'peek-copy':{const c=S.contents[peekId];if(c)copyText([c.caption,c.hashtags].filter(Boolean).join('\n\n'),'Légende copiée');break;}
case'ed-close':closeEditor();break;
case'ed-goto-networks':closeEditor();go('networks');break;
case'ed-status':draft.status=el.dataset.s;if(draft.status==='publie')draft.publications.forEach(p=>{p.done=true;});scheduleSave();renderEditor();break;
case'ed-theme':{const t=el.dataset.t;draft.themes=draft.themes.includes(t)?draft.themes.filter(x=>x!==t):draft.themes.concat([t]);scheduleSave();renderEditor();break;}
case'ed-addpub-acc':{const a=S.accounts[el.dataset.acc];if(!a||!draft)break;const last=draft.publications[draft.publications.length-1];
draft.publications.push({id:uid(),channel:platOf(a.platform).channel||'social',accountId:a.id,date:last?last.date:today(),time:last?last.time:'',done:false});if(draft.status==='idee')draft.status='ecriture';scheduleSave();renderEditor();break;}
case'ed-addpub':{const last=draft.publications[draft.publications.length-1];const f=S.ui.filters;
draft.publications.push({id:uid(),channel:last?(pubChannel(last)||'social'):(f.channel||'social'),accountId:f.account||'',date:last?last.date:today(),time:last?last.time:'',done:false});
if(draft.status==='idee')draft.status='ecriture';scheduleSave();renderEditor();break;}
case'ed-addshoot':{const last=draft.shoots[draft.shoots.length-1];const st=last&&isValidDate(last.start)?addDays(shootEnd(last),1):today();
draft.shoots.push({id:'s'+uid(),start:st,end:'',location:last?last.location:'',note:''});scheduleSave();renderEditor();break;}
case'ed-delshoot':draft.shoots=draft.shoots.filter(s=>s.id!==el.dataset.shid);scheduleSave();renderEditor();break;
case'ed-delpub':draft.publications=draft.publications.filter(p=>p.id!==el.dataset.pid);scheduleSave();renderEditor();break;
case'ed-addscene':draft.scenes.push({id:uid(),heading:'Scène '+(draft.scenes.length+1),body:''});scheduleSave();renderEditor();
{const s=draft.scenes[draft.scenes.length-1];const t=document.getElementById('sb-'+s.id);if(t)t.focus();}break;
case'ed-delscene':draft.scenes=draft.scenes.filter(s=>s.id!==el.dataset.sid);scheduleSave();renderEditor();break;
case'ed-dup':{flushSave();commitEditorLog();const src=draft;const c=dupOf(src);Store.saveContent(c);logChange('content','create',c.id,titleOf(c),'Copie de « '+titleOf(src)+' »',null);
draft=normContent(clone(c));editorOrig=clone(c);renderEditor();toast('Copie créée');break;}
case'ed-delete':{const did=draft.id;flushSave();pending=false;draft=null;editorOrig=null;$('#sheet').hidden=true;document.body.classList.remove('locked');deleteContent(did);break;}
case'ed-copy':copyText([draft.caption,draft.hashtags].filter(Boolean).join('\n\n'),'Légende et hashtags copiés',$('#ed-caption'));break;
}
});
function dupOf(src){const c=clone(src);c.id=uid();c.title=titleOf(src)+' (copie)';c.createdAt=Date.now();c.publications=c.publications.map(p=>Object.assign({},p,{id:uid(),done:false}));if(c.status==='publie')c.status='pret';return c;}
function copyText(txt,ok,fallbackEl){
if(!txt){toast('Rien à copier.');return;}
const p=navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(txt):Promise.reject();
p.then(()=>toast(ok),()=>{if(fallbackEl){if(fallbackEl.select){fallbackEl.focus();fallbackEl.select();}else{const r=document.createRange();r.selectNodeContents(fallbackEl);const s=getSelection();s.removeAllRanges();s.addRange(r);}}toast('Copie bloquée : sélectionne le texte et copie-le à la main.');});
}
document.addEventListener('change',e=>{
{const el=e.target;if(el.dataset&&(el.dataset.sigFile||el.dataset.profStamp)){handleSigChange(el);return;}
if(el.dataset&&el.dataset.homeVis){const L=homeLayout();const id=el.dataset.homeVis;L.hidden=el.checked?L.hidden.filter(x=>x!==id):L.hidden.concat([id]);saveHomeLayout(L);return;}
if(el.dataset&&el.dataset.tplPick){const v=el.value;el.value='';if(v)useTemplate(v);return;}
if(el.dataset&&el.dataset.planSw&&isAdmin()){updateSettings(s=>{s.showAssistPlan=el.checked;},el.checked?'Plan de travail affiché':'Plan de travail masqué');return;}
if(el.id==='f-rprio'){S.ui.rdvPrio=el.value;saveUI();render();return;}}
if(e.target.dataset&&e.target.dataset.uiCustom&&isAdmin()){const who=e.target.dataset.uiCustom,v=e.target.value;updateSettings(s=>{s.uiThemes=Object.assign({},s.uiThemes||{});s.uiThemes.custom=Object.assign({},s.uiThemes.custom||{});s.uiThemes.custom[who]=v;s.uiThemes[who]='custom';},'Couleur perso de l\'interface');return;}
if(e.target.dataset&&e.target.dataset.accTone){if(!can('accounts')){toast(DENIED);return;}const acc=S.accounts[e.target.dataset.accTone];if(acc&&(acc.tone||'')!==e.target.value.trim())updateAccount(acc.id,{tone:e.target.value.trim()});return;}
if(e.target.dataset&&e.target.dataset.sbrole&&S.mode==='supa'&&isAdmin()){Supa.setProfileRole(e.target.dataset.sbrole,e.target.value);return;}
const el=e.target;if(!$('#main').contains(el))return;
if(handleM4Change(el))return;
if(el.dataset.pjf){S.ui.pjProject=el.value;saveUI();render();return;}
if(el.dataset.suivif){S.ui.suiviFilter=Object.assign({},S.ui.suiviFilter||{},{[el.dataset.suivif]:el.value});saveUI();render();return;}
if(handleBillingChange(el))return;
if(el.dataset.k==='chan'){const f=el.closest('form');const ps=f&&f.querySelector('[data-k="plat"]');if(ps)ps.innerHTML=platOptions(el.value);return;}
if(el.dataset.filter){S.ui.filters[el.dataset.filter]=el.value;saveUI();render();}
else if(el.dataset.actChange==='toggle-prod'){S.ui.showProd=el.checked;saveUI();render();}
else if(el.dataset.actChange==='toggle-rdv'){S.ui.showRdv=el.checked;saveUI();render();}
else if(el.dataset.asstName){if(!isAdmin())return;const v=el.value.trim();updateSettings(s=>{s.assistantName=v;},'Prénom de l\'assistante : '+(v||'Assistante'));}
else if(el.dataset.compLabel||el.dataset.compColor){if(!isAdmin())return render();const cid=el.dataset.compLabel||el.dataset.compColor;const v=el.value.trim();if(el.dataset.compLabel&&!v)return render();
updateSettings(s=>{const c=s.companies.find(x=>x.id===cid);if(c){if(el.dataset.compLabel)c.label=v;else c.color=el.value;}},el.dataset.compLabel?'Boîte renommée : '+v:'Couleur de la boîte');}
else if(el.dataset.persoColor){if(!isAdmin())return render();updateSettings(s=>{s.persoColor=el.value;},'Couleur des RDV perso');}
else if(el.dataset.rdvFilter!==undefined&&el.id==='rdv-filter'){S.ui.rdvFilter=el.value;saveUI();render();}
else if(el.id==='qi-type'){S.ui.ideaType=el.value;saveUI();}
else if(el.dataset.accHandle&&!can('accounts')){render();}
else if(el.dataset.accHandle){const a=S.accounts[el.dataset.accHandle];const v=normHandle(el.value,a&&a.platform);if(a&&v&&v!==a.handle)updateAccount(a.id,{handle:v},'Nom : '+a.handle+' → '+v);else render();}
else if(el.dataset.typeLabel||el.dataset.typeColor){const tid=el.dataset.typeLabel||el.dataset.typeColor;const v=el.value.trim();if(el.dataset.typeLabel&&!v)return render();
updateSettings(s=>{const t=s.types.find(x=>x.id===tid);if(t){if(el.dataset.typeLabel)t.label=v;else t.color=el.value;}},el.dataset.typeLabel?'Format renommé : '+v:'Couleur du format '+typeOf(tid).label);}
else if((el.dataset.platChannel||el.dataset.platLabel||el.dataset.platColor||el.dataset.chanLabel||el.dataset.typeLabel||el.dataset.typeColor||el.dataset.themeLabel)&&!isAdmin()){render();}
else if(el.dataset.platChannel){const pid=el.dataset.platChannel;const v=el.value;updateSettings(s=>{const p=s.platforms.find(x=>x.id===pid);if(p)p.channel=v;},platOf(pid).label+' → '+chanOf(v).label);}
else if(el.dataset.chanLabel){const cid=el.dataset.chanLabel;const v=el.value.trim();if(!v)return render();updateSettings(s=>{const c=s.channels.find(x=>x.id===cid);if(c)c.label=v;},'Distribution renommée : '+v);}
else if(el.dataset.themeLabel){const tid=el.dataset.themeLabel;const v=el.value.trim();if(!v)return render();
updateSettings(s=>{const t=s.themes.find(x=>x.id===tid);if(t)t.label=v;},'Thématique renommée : '+v);}
else if(el.dataset.platLabel||el.dataset.platColor){const pid=el.dataset.platLabel||el.dataset.platColor;const v=el.value.trim();if(el.dataset.platLabel&&!v)return render();
updateSettings(s=>{const p=s.platforms.find(x=>x.id===pid);if(p){if(el.dataset.platLabel)p.label=v;else p.color=el.value;}},el.dataset.platLabel?'Plateforme renommée : '+v:'Couleur de '+platOf(pid).label);}
});
let searchT;
document.addEventListener('input',e=>{const t=e.target;if(!t||!t.dataset)return;if(t.dataset.input==='globalq'){S.ui.globalQ=t.value;clearTimeout(searchT);searchT=setTimeout(render,200);}else if(t.dataset.input==='contactq'){S.ui.contactQ=t.value;clearTimeout(searchT);searchT=setTimeout(render,200);}});
document.addEventListener('input',e=>{if(e.target.dataset&&e.target.dataset.input==='search'){S.ui.search=e.target.value;clearTimeout(searchT);searchT=setTimeout(()=>{saveUI();render();},180);}});
document.addEventListener('submit',e=>{
e.preventDefault();const f=e.target;const k=f.dataset.form;
if(handleTaskSubmit(k))return;
if(handleReqSubmit(k))return;
if(handleV3Submit(k,f))return;
if(handleM4Submit(k,f))return;
if(handleMsgSubmit(k,f))return;
if(handlePjSubmit(k,f))return;
if(handleSuiviSubmit(k,f))return;
if(handleBillingSubmit(k))return;
const q=n=>f.querySelector('[data-k="'+n+'"]');
if(k==='idea'){const v=$('#qi').value.trim();if(!v)return;const c=newContent({title:v,type:$('#qi-type').value,status:'idee'});c.scenes=[{id:uid(),heading:'Scène 1',body:''}];
c.author=ROLE;c.authorName=roleName(ROLE);c.ideaState=isAdmin()?'validee':'proposee';
Store.saveContent(c);logChange('content','create',c.id,v,isAdmin()?'Idée ajoutée':'Idée proposée',null);$('#qi').value='';toast(isAdmin()?'Idée ajoutée aux validées':'Idée proposée');}
else if(k==='acc'){if(!can('accounts')){toast(DENIED);return;}if(addAccount(q('plat').value,q('handle').value,q('nat').value)){q('handle').value='';}}
else if(k==='type'){const v=$('#type-new').value.trim();if(!v)return;const pal=['#E4572E','#7B2CBF','#0F7B6C','#2E86AB','#D81E5B','#5465FF','#2B9348','#B5651D'];
updateSettings(s=>{s.types.push({id:'t'+uid(),label:v,color:pal[s.types.length%pal.length]});},'Format ajouté : '+v);$('#type-new').value='';toast('Format « '+v+' » ajouté');}
else if(k==='theme'){const v=$('#theme-new').value.trim();if(!v)return;updateSettings(s=>{s.themes.push({id:'th'+uid(),label:v});},'Thématique ajoutée : '+v);$('#theme-new').value='';toast('Thématique « '+v+' » ajoutée');}
else if(k==='plat'){const v=$('#plat-new').value.trim();if(!v)return;const col=$('#plat-new-color').value;const ch=$('#plat-new-ch').value;const pid='p'+uid();
updateSettings(s=>{s.platforms.push({id:pid,label:v,color:col,channel:ch});},'Plateforme ajoutée : '+v+' ('+chanOf(ch).label+')');$('#plat-new').value='';
if(ch==='tv'||ch==='cinema'){const a={id:uid(),platform:pid,handle:v,nature:'pro',createdAt:Date.now()};Store.saveAccount(a);}
toast('« '+v+' » ajouté dans '+chanOf(ch).label);}
else if(k==='chan'){const v=$('#chan-new').value.trim();if(!v)return;updateSettings(s=>{s.channels.push({id:'ch'+uid(),label:v});},'Distribution ajoutée : '+v);$('#chan-new').value='';toast('« '+v+' » ajouté');}
else if(k==='gist'){const tok=$('#gist-token').value.trim();const gid=$('#gist-idin').value.trim();if(!tok){toast('Colle ton jeton GitHub.');return;}
toast('Connexion à GitHub…');if(gid)Sync.connect(tok,gid).then(render);else Sync.create(tok).then(render);}
});
$('#import-file').addEventListener('change',e=>{const file=e.target.files&&e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>importData(String(r.result));r.readAsText(file);e.target.value='';});
let dragSpec=null;
document.addEventListener('dragstart',e=>{const el=e.target.closest&&e.target.closest('[data-drag]');if(!el)return;dragSpec=el.dataset.drag;try{e.dataTransfer.setData('text/plain',dragSpec);e.dataTransfer.effectAllowed='move';}catch(x){}});
document.addEventListener('dragend',()=>{dragSpec=null;document.querySelectorAll('.drop').forEach(x=>x.classList.remove('drop'));});
function dropTarget(e){if(!dragSpec)return null;if(dragSpec.startsWith('ev:'))return e.target.closest('[data-drop]');if(dragSpec.startsWith('card:'))return e.target.closest('[data-drop-status]');return null;}
document.addEventListener('dragover',e=>{const t=dropTarget(e);if(!t)return;e.preventDefault();document.querySelectorAll('.drop').forEach(x=>{if(x!==t)x.classList.remove('drop');});t.classList.add('drop');});
document.addEventListener('drop',e=>{const t=dropTarget(e);if(!t)return;e.preventDefault();const spec=dragSpec;dragSpec=null;t.classList.remove('drop');
if(spec.startsWith('ev:'))moveEvent(spec.slice(3),t.dataset.drop);else setStatus(spec.slice(5),t.dataset.dropStatus);});
let ptrDown=false;const deferredR=new Set();
document.addEventListener('pointerdown',()=>{ptrDown=true;},true);
const releasePtr=()=>{if(!ptrDown)return;ptrDown=false;setTimeout(()=>{const fs=[...deferredR];deferredR.clear();fs.forEach(f=>f());},0);};
document.addEventListener('pointerup',releasePtr,true);document.addEventListener('pointercancel',releasePtr,true);
function guard(fn){return function(){if(ptrDown){deferredR.add(fn);return;}return fn.apply(this,arguments);};}
render=guard(render);renderEditor=guard(renderEditor);renderDoc=guard(renderDoc);renderPeek=guard(renderPeek);renderIdea=guard(renderIdea);renderRdv=guard(renderRdv);renderPj=guard(renderPj);
setInterval(checkReminders,5*60000);setTimeout(checkReminders,4000);setTimeout(runRecurring,2500);setInterval(runRecurring,3600000);
if('serviceWorker'in navigator&&location.protocol==='https:'&&!(window.claude&&window.claude.use)){window.addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{});});}
window.addEventListener('storage',e=>{
if(e.key===LS_DATA&&S.mode==='local'&&e.newValue){try{const d=JSON.parse(e.newValue);if(plT)mergeRemote(d);else applyLocal(d);scheduleRender();}catch(x){}}
if(e.key===LS_GIST){Sync.cfg=lsGet(LS_GIST);renderSync();}
});
document.addEventListener('focusin',e=>{const t=e.target;if(t&&t.tagName==='INPUT'&&t.type==='number'&&(t.value==='0'||t.value===''))setTimeout(()=>{try{t.select();}catch(x){}},0);});
applyNavMini();
startStore();
})();