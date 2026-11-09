// Diplomaten gegen Saboteure – Prototyp. Start: node server.js
const http=require('http'),fs=require('fs'),os=require('os'),cr=require('crypto');
const PORT=process.env.PORT||3000,P={};let G;
const CARDS=[
['Faschoda 1898','Britische und französische Truppen erreichen gleichzeitig dasselbe Fort im Sudan. Beide wollen die Region und drohen mit Krieg.','Bleiben und die Region fordern. Stärke zeigen, aber Krieg möglich.','Rückzug anbieten gegen Zugeständnisse woanders. Frieden, aber Gesichtsverlust.'],
['Juli-Krise 1914','Ein serbischer Attentäter erschießt den österreichischen Thronfolger. Österreich stellt Serbien ein hartes Ultimatum, Russland stützt Serbien.','Das Heer mobilmachen. Druck für Verhandlungen, aber die Gegner machen auch mobil.','Sofort Gespräche anbieten und die Truppen daheim lassen. Zeit gewinnen, aber die Verbündeten fühlen sich im Stich gelassen.'],
['München 1938','Deutschland fordert ein Grenzgebiet der Tschechoslowakei mit vielen Deutschsprachigen und droht sonst mit Krieg. Ihr beratet Großbritannien und Frankreich.','Das Gebiet überlassen. Frieden jetzt, aber der Forderer fordert vielleicht mehr.','Nein sagen und der Tschechoslowakei beistehen. Klare Grenze, aber Krieg wird wahrscheinlicher.'],
['Berlin-Blockade 1948','Die Sowjetunion sperrt alle Straßen und Bahnen nach West-Berlin. Über 2 Millionen Menschen bekommen kein Essen und keine Kohle mehr.','Luftbrücke. Flugzeuge liefern alles ohne Schuss, aber teuer und monatelang.','Konvoi mit Soldaten über die Straße. Schnell, aber ein Schuss kann Krieg auslösen.'],
['Suezkrise 1956','Ägypten verstaatlicht den Suezkanal, den bisher britische und französische Firmen betrieben. Er ist für deren Ölhandel wichtig. Ägypten sagt, die Einnahmen gehören dem eigenen Land.','Militärisch eingreifen. Der Handelsweg bleibt offen, aber Krieg droht.','Verhandeln und Ägypten den Kanal lassen, gegen Garantie freier Durchfahrt. Friedlich, aber Verlust von Einfluss und Einnahmen.'],
['Kubakrise 1962','Die USA entdecken, dass die Sowjetunion Atomraketen auf Kuba stationiert, nur etwa 150 km vor Florida. Die Berater sind uneins.','Seeblockade um Kuba, damit keine weiteren Raketen ankommen. Zeit zum Verhandeln, aber sowjetische Schiffe könnten durchbrechen wollen.','Luftangriff auf die Raketenstellungen. Zerstört sie vor Einsatzbereitschaft, aber es gäbe Tote und die Gefahr eines atomaren Gegenschlags.'],
['Iran 1979','Studenten besetzen die US-Botschaft in Teheran und nehmen über 50 Amerikaner als Geiseln. Sie fordern die Auslieferung des gestürzten Schahs, der in den USA behandelt wird.','Militärische Rettungsaktion. Schnell, aber riskant für die Geiseln.','Über Vermittler verhandeln und Sanktionen verhängen. Sicherer, aber es kann Monate dauern und wirkt schwach.'],
['Falklandinseln 1982','Argentinien besetzt die Falklandinseln, die zu Großbritannien gehören und auf denen etwa 1.800 Briten leben. Argentinien beansprucht sie ebenfalls.','Eine Kriegsflotte schicken. Entschlossenheit, aber Krieg.','Über UNO und USA verhandeln. Kein Krieg, aber die Inseln bleiben vielleicht argentinisch.'],
['Able Archer 1983','Die NATO hält ein großes Manöver ab, das einen Atomkrieg durchspielt. Die Sowjetunion fürchtet einen echten Angriff und macht ihre Atomwaffen bereit.','Das Manöver wie geplant fortsetzen. Man gibt nicht nach, aber die Gegenseite könnte zuerst schießen.','Das Manöver abbrechen und Gespräche anbieten. Beruhigt die Lage, wirkt aber nachgiebig.'],
['Kuwait 1990','Irak wirft Kuwait vor, zu viel Öl zu fördern und den Preis zu drücken, und verlangt Schuldenerlass. Irak zieht Truppen an der Grenze zusammen. Ihr beratet Kuwait.','Zugeständnisse machen (weniger Öl, Schulden erlassen). Frieden, aber Drohungen scheinen zu wirken.','Hart bleiben und Verbündete um Hilfe bitten. Eigene Unabhängigkeit, aber Krieg wird wahrscheinlicher.'],
['Hainan 2001','Ein US-Spionageflugzeug stößt mit einem chinesischen Kampfjet zusammen. Der chinesische Pilot stirbt, das US-Flugzeug landet auf der chinesischen Insel Hainan, und China hält die 24 Besatzungsmitglieder fest. Ihr beratet die USA.','Nichts zugeben und Druck machen. Stärke, aber die Besatzung bleibt länger.','Bedauern ausdrücken, ohne Schuld einzugestehen. Die Besatzung kommt wohl frei, aber Kritik zuhause.'],
['Nil-Staudamm','Äthiopien baut am Nil einen riesigen Staudamm für Strom für Millionen Menschen. Wird der See schnell gefüllt, bekommt Ägypten flussabwärts weniger Wasser und droht mit Gewalt. Ihr beratet Äthiopien.','Den See in wenigen Jahren füllen. Schnell Strom, aber Streit mit Ägypten.','Über zehn Jahre füllen und ein Abkommen schließen. Sicher, aber der Strom kommt später.']];
const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const reset=()=>{G={ph:'lobby',order:Object.keys(P),log:[],sol:0,esc:0,hist:[],idx:0,pres:null,card:null,bad:'A',team:[],votes:{},res:null,acc:false,vq:null,asker:null,asp:null,an:false,priv:{},notes:{},k4:false,back:null,nv:{},deck:[],win:null,why:''};for(const p of Object.values(P)){p.role=null;p.dead=false}};
reset();
const log=m=>G.log.push(m),nm=i=>P[i].name,al=()=>G.order.filter(i=>!P[i].dead),RN={D:'Diplomat',A:'Analyst',S:'Saboteur',T:'Tyrann'};
const win=(w,why)=>{G.ph='over';G.win=w;G.why=why;log(why)};
function round(){
  if(!G.deck.length)G.deck=shuf(CARDS.map((_,i)=>i));
  G.pres=G.order[G.idx];G.card=G.deck.shift();G.bad=Math.random()<.5?'A':'B';G.team=[];G.votes={};G.res=null;G.ph='team';
  G.priv={};for(const i of G.order){G.priv[i]=[];if(P[i].role=='S'||P[i].role=='T')G.priv[i].push('Eskalierende Option: '+G.bad)}
}
function start(){
  const n=G.order.length,s=[0,0,0,0,0,2,2,3,3,4,4][n];
  const roles=shuf(['T',...Array(s-1).fill('S'),'A',...Array(n-s-1).fill('D')]);
  G.order.forEach((i,k)=>{P[i].role=roles[k];G.notes[i]=[]});
  G.deck=shuf(CARDS.map((_,i)=>i));G.idx=Math.random()*n|0;
  log('Spiel gestartet. Vorsitz: '+nm(G.order[G.idx]));round();
}
function resolve(){
  const na=Object.values(G.votes).filter(c=>c=='A').length,ch=na>=2?'A':'B',esc=ch==G.bad;
  G.res={na,nb:3-na,ch,esc};esc?G.esc++:G.sol++;G.hist.push({t:CARDS[G.card][0],e:esc});
  log(CARDS[G.card][0]+': '+(esc?'eskaliert':'gelöst'));
  if(G.sol>=8)win('D','8 Krisen gelöst – die Diplomaten gewinnen!');
  else if(esc){if(!esc1('result'))G.ph='result'}
  else G.ph='result';
}
function esc1(back){
  if(G.esc>=8){win('S','8 Eskalationen – die Saboteure gewinnen!');return true}
  if(G.esc==4&&!G.k4){G.k4=true;G.back=back;G.ph='kill';log('Stufe 4: Der Vorsitz darf einen Spieler töten');return true}
  return false;
}
function convert(){
  const c={};
  for(const [i,t] of Object.entries(G.nv)){const a=P[i].role,b=P[t];
    if((a=='S'||a=='T')&&b&&!b.dead&&b.role!='S'&&b.role!='T')c[t]=(c[t]||0)+(a=='T'?1.5:1)}
  const e=Object.entries(c).sort((a,b)=>b[1]-a[1]);
  if(e.length){
    const t=e[0][0];P[t].role='S';
    for(const i of G.order){
      if(i==t)G.notes[i].push('Du wurdest von den Saboteuren umgedreht – du bist jetzt Saboteur!');
      else if(P[i].role=='S'||P[i].role=='T')G.notes[i].push(nm(t)+' ist jetzt einer von euch.');
    }
    if(G.back=='team')G.priv[t].push('Eskalierende Option: '+G.bad);
  }
  log('Die Nacht ist vorbei.');G.nv={};G.ph=G.back;
}
function atally(){
  const y=Object.values(G.votes).filter(Boolean).length,ok=y*2>al().length;
  if(G.vq=='hold'){if(ok){G.ph='apick';log('Anklage genehmigt')}else{G.acc=false;G.ph='team';log('Anklage abgelehnt')}return}
  if(!ok){G.ph='team';log('Die Mehrheit klagt '+nm(G.asp)+' nicht an');return}
  if(P[G.asp].role=='T')return win('D',nm(G.asp)+' war der Tyrann – die Diplomaten gewinnen!');
  G.esc++;G.hist.push({t:'Falsche Anklage',e:true});log(nm(G.asp)+' war nicht der Tyrann – Saboteure +1');
  if(esc1('team'))return;
  G.ph='team';
}
function act(p,a){
  const id=p.id,ph=G.ph,x=a.x,n=G.order.length,bad='Ungültige Aktion',host=G.order[0]==id;
  switch(a.t){
    case 'start':if(ph!='lobby'||!host)return bad;if(n<5)return 'Mindestens 5 Spieler nötig';start();break;
    case 'kick':if(ph!='lobby'||!host||x==id||!G.order.includes(x))return bad;G.order=G.order.filter(i=>i!=x);if(P[x].res)P[x].res.end();delete P[x];break;
    case 'new':if(ph!='lobby'&&host)reset();break;
    case 'team':{
      if(ph!='team'||id!=G.pres||!Array.isArray(x)||x.length!=3||new Set(x).size!=3||!x.every(i=>G.order.includes(i)&&!P[i].dead))return bad;
      G.team=x;
      log(nm(id)+' wählt das Team: '+x.map(nm).join(', '));G.ph='talk';break}
    case 'an':if(ph!='talk'||P[id].role!='A'||G.an)return bad;G.an=true;G.priv[id].push('Sicher: Option '+(G.bad=='A'?'B':'A')+' ist friedlich');break;
    case 'go':if(ph!='talk'||id!=G.pres)return bad;G.ph='vote';G.votes={};break;
    case 'cv':if(ph!='vote'||!G.team.includes(id)||id in G.votes||(x!='A'&&x!='B'))return bad;G.votes[id]=x;if(Object.keys(G.votes).length==3)resolve();break;
    case 'next':if(ph!='result'||id!=G.pres)return bad;do{G.idx=(G.idx+1)%n}while(P[G.order[G.idx]].dead);round();break;
    case 'acc':if(ph!='team'||G.acc||G.esc<3||P[id].dead)return bad;G.acc=true;G.asker=id;G.vq='hold';G.votes={};G.ph='avote';log(nm(id)+' beantragt eine Anklage');break;
    case 'av':if(ph!='avote'||P[id].dead||id in G.votes)return bad;G.votes[id]=!!x;if(Object.keys(G.votes).length==al().length)atally();break;
    case 'ap':if(ph!='apick'||id!=G.asker||x==id||!G.order.includes(x)||P[x].dead)return bad;G.asp=x;G.vq='accuse';G.votes={};G.ph='avote';log(nm(id)+' klagt '+nm(x)+' an – Abstimmung');break;
    case 'ki':{
      const t=P[x];
      if(ph!='kill'||id!=G.pres||!t||t.dead||x==id)return bad;
      t.dead=true;log(nm(x)+' wurde getötet und war: '+RN[t.role]);
      if(t.role=='T')win('D','Der Tyrann wurde getötet – die Diplomaten gewinnen!');
      else if(t.role=='S'){G.ph='night';G.nv={};log('Die Nacht bricht an …')}
      else G.ph=G.back;
      break}
    case 'nv':
      if(ph!='night'||P[id].dead||id in G.nv||!P[x]||P[x].dead||x==id)return bad;
      G.nv[id]=x;if(Object.keys(G.nv).length==al().length)convert();break;
    // TESTMODUS-BEGIN
    case 'bot':case 'fill':{
      if(ph!='lobby'||!host)return bad;
      const N=['Alex','Bea','Carl','Dana','Emil','Fay','Gero','Hana','Ivo','Jule'];
      let add=a.t=='bot'?1:Math.max(0,7-n);
      while(add-->0&&G.order.length<10){
        const name=N.find(k=>!G.order.some(i=>P[i].name==k)),b='b'+cr.randomBytes(5).toString('hex');
        P[b]={id:b,name,bot:true,role:null,res:null};G.order.push(b);
      }
      break}
    // TESTMODUS-END
    default:return bad;
  }
}
function view(id){
  const me=P[id],ph=G.ph,over=ph=='over',c=G.card!=null&&ph!='lobby'?CARDS[G.card]:null;
  return{ph,sol:G.sol,esc:G.esc,hist:G.hist,me:{id,name:me.name,role:me.role,host:G.order[0]==id},
    pl:G.order.map(i=>{const q=P[i];return{id:i,name:q.name,on:!!q.res||!!q.bot,bot:!!q.bot,dead:!!q.dead,
      role:(over||q.dead||i==id||(me.role=='S'&&(q.role=='S'||q.role=='T')))?q.role:null}}),
    pres:G.pres,card:c&&{t:c[0],s:c[1],a:c[2],b:c[3]},team:G.team,voted:Object.keys(ph=='night'?G.nv:G.votes),res:G.res,
    priv:(G.priv[id]||[]).concat(G.notes[id]||[]),acc:G.acc,asker:G.asker,asp:G.asp,vq:G.vq,an:G.an,win:G.win,why:G.why,log:G.log.slice(-40).reverse()};
}
// TESTMODUS-BEGIN
let bt=null;const sched=()=>{if(bt)return;bt=setTimeout(()=>{bt=null;if(botStep())bc()},+process.env.BOTMS||1300)};
function botStep(){
  const ph=G.ph,B=i=>i&&P[i]&&P[i].bot,pick=a=>a[Math.random()*a.length|0],go=(i,o)=>!act(P[i],o);
  if(ph=='team'&&B(G.pres))return go(G.pres,{t:'team',x:shuf(al()).slice(0,3)});
  if(ph=='talk'&&B(G.pres))return go(G.pres,{t:'go'});
  if(ph=='vote'){const b=G.team.find(i=>B(i)&&!(i in G.votes));
    if(b){const r=P[b].role;return go(b,{t:'cv',x:(r=='S'||r=='T')?G.bad:(Math.random()<.5?'A':'B')})}}
  if(ph=='result'&&B(G.pres))return go(G.pres,{t:'next'});
  if(ph=='avote'){const b=al().find(i=>B(i)&&!(i in G.votes));if(b)return go(b,{t:'av',x:G.vq=='hold'?true:Math.random()<.5})}
  if(ph=='kill'&&B(G.pres))return go(G.pres,{t:'ki',x:pick(al().filter(i=>i!=G.pres))});
  if(ph=='night'){const b=al().find(i=>B(i)&&!(i in G.nv));
    if(b){let t=al().filter(i=>i!=b);if(P[b].role=='S'||P[b].role=='T'){const d=t.filter(i=>P[i].role!='S'&&P[i].role!='T');if(d.length)t=d}return go(b,{t:'nv',x:pick(t)})}}
  return false;
}
// TESTMODUS-END
const bc=()=>{for(const p of Object.values(P))if(p.res)p.res.write('data: '+JSON.stringify(view(p.id))+'\n\n');sched()};
setInterval(()=>{for(const p of Object.values(P))if(p.res)p.res.write(':\n\n')},20000);
http.createServer((q,r)=>{
  const u=new URL(q.url,'http://x');
  if(u.pathname=='/events'){
    const p=P[u.searchParams.get('id')];
    if(!p){r.writeHead(404);return r.end()}
    r.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive','X-Accel-Buffering':'no'});
    p.res=r;r.write('retry: 2000\n\n');
    q.on('close',()=>{if(p.res===r){p.res=null;bc()}});
    bc();return;
  }
  if(u.pathname=='/api'&&q.method=='POST'){
    let b='';q.on('data',c=>b+=c);
    q.on('end',()=>{
      let a,out={};
      try{a=JSON.parse(b)}catch{a={}}
      if(a.t=='join'){
        const name=String(a.name||'').trim().slice(0,14);
        if(G.ph!='lobby')out.err='Das Spiel läuft bereits';
        else if(G.order.length>=10)out.err='Lobby voll (max. 10 Spieler)';
        else if(!name)out.err='Bitte Namen eingeben';
        else if(G.order.some(i=>P[i].name.toLowerCase()==name.toLowerCase()))out.err='Name schon vergeben';
        else{const id='p'+cr.randomBytes(6).toString('hex');P[id]={id,name,role:null,res:null};G.order.push(id);out.id=id;bc()}
      }else{
        const p=P[a.id];
        if(!p)out.err='Unbekannter Spieler – Seite neu laden';
        else{const e=act(p,a);if(e)out.err=e;bc()}
      }
      r.writeHead(200,{'Content-Type':'application/json'});r.end(JSON.stringify(out));
    });return;
  }
  if(u.pathname=='/bg.jpg'){r.writeHead(200,{'Content-Type':'image/jpeg','Cache-Control':'max-age=86400'});return r.end(fs.readFileSync(__dirname+'/bg.jpg'))}
  r.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
  r.end(fs.readFileSync(__dirname+'/index.html'));
}).listen(PORT,'0.0.0.0',()=>{
  console.log('Spiel läuft. Mitspieler öffnen im selben WLAN:');
  for(const l of Object.values(os.networkInterfaces()))for(const i of l)if(i.family=='IPv4'&&!i.internal)console.log('  http://'+i.address+':'+PORT);
});
