// Diplomat – Prototyp. Start: node server.js
const http=require('http'),fs=require('fs'),os=require('os'),cr=require('crypto');
const PORT=process.env.PORT||3000,P={},NEED=1;let G,EV=0;
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
['Nil-Staudamm','Äthiopien baut am Nil einen riesigen Staudamm für Strom für Millionen Menschen. Wird der See schnell gefüllt, bekommt Ägypten flussabwärts weniger Wasser und droht mit Gewalt. Ihr beratet Äthiopien.','Den See in wenigen Jahren füllen. Schnell Strom, aber Streit mit Ägypten.','Über zehn Jahre füllen und ein Abkommen schließen. Sicher, aber der Strom kommt später.'],
// neue Karten: [2]=friedlicher Weg, [3]=Eskalation
['Sechstagekrieg 1967','Ägypten schickt Truppen an die Grenze zu Israel und sperrt die Straße von Tiran, Israels einzigen Seeweg zum Roten Meer. Israel nennt die Sperrung einen Kriegsgrund. Ihr beratet Israel.','Verhandeln und die Großmächte bitten, den Seeweg zu öffnen. Kein Schuss, aber Ägypten kann weiter aufrüsten.','Zuerst angreifen und dem Gegner den Vorteil nehmen. Der Krieg beginnt dann aber sicher.'],
['Jom-Kippur-Krieg 1973','Ägypten und Syrien greifen Israel an. Die Sowjetunion droht, Truppen zu schicken, und die USA setzen ihre Atomstreitkräfte in erhöhte Alarmbereitschaft. Ihr beratet die USA.','Geheim mit der Sowjetunion verhandeln und einen Waffenstillstand vorschlagen. Die Lage beruhigt sich, aber Verbündete fühlen sich übergangen.','Die Alarmbereitschaft weiter erhöhen und Truppen verlegen. Entschlossen, aber ein Missverständnis könnte einen Atomkrieg auslösen.'],
['Beagle-Konflikt 1978','Argentinien und Chile streiten um drei kleine Inseln im Süden. Ein Schiedsgericht hat sie Chile zugesprochen, Argentinien erkennt das nicht an und bringt Truppen in Stellung. Ihr beratet Argentinien.','Einen Vermittler wie den Papst einladen und neu verhandeln. Kein Krieg, aber die Inseln gehen vielleicht verloren.','Die Inseln besetzen und Truppen schicken. Der Anspruch wird durchgesetzt, aber ein Krieg mit Chile droht.'],
['Taiwanstraße 1996','China übt mit Raketen in den Gewässern direkt vor Taiwan, kurz vor einer Wahl dort. Die USA überlegen, wie sie reagieren. Ihr beratet die USA.','Gespräche mit China anbieten und die Flotte nur in Bereitschaft halten. Ruhe bleibt, aber es wirkt vielleicht schwach.','Zwei Flugzeugträger in die Meerenge schicken. Ein starkes Signal, aber ein Zwischenfall könnte Krieg auslösen.'],
['Kargil 1999','Indien und Pakistan, beide mit Atomwaffen, kämpfen in den Bergen von Kaschmir. Indien will besetzte Höhen zurückerobern. Ihr beratet Indien.','Die Kämpfe auf das eigene Gebiet begrenzen und die Grenze nicht überschreiten. Der Krieg bleibt klein, aber die Rückeroberung dauert länger.','Die Armee über die Grenze nach Pakistan schicken. Schneller Druck, aber ein Atomkrieg wird möglich.'],
['Indien und Pakistan 2001','Nach einem Anschlag auf das indische Parlament macht Indien Pakistan verantwortlich. Beide Länder bringen Hunderttausende Soldaten an die Grenze. Ihr beratet Indien.','Diplomatischen Druck aufbauen, Botschafter abziehen und die Truppen halten. Kein Schuss, aber die Wut im Land wächst.','Einen Vergeltungsschlag auf Stellungen in Pakistan starten. Zeigt Stärke, aber Pakistan würde zurückschlagen.'],
['Südchinesisches Meer','Mehrere Länder streiten um Inseln und Fischgründe. Ein Land baut auf einem Riff eine Insel mit Landebahn, ein anderes schickt seine Küstenwache hin. Ihr beratet das zweite Land.','Die Küstenwache zurückziehen und vor Gericht oder in Verhandlungen klagen. Sicher, aber die Insel bleibt gebaut.','Schiffe schicken, die den Bau blockieren. Stärke, aber ein Zusammenstoß ist möglich.'],
['Mauerbau 1961','Die DDR riegelt Ost-Berlin mit Stacheldraht und Soldaten ab und teilt die Stadt. Kurz danach stehen sich Panzer aus Ost und West an einem Grenzübergang gegenüber. Ihr beratet die Westmächte.','Protestieren, aber die Sektorengrenze akzeptieren. Kein Krieg, aber die Teilung wird dauerhaft.','Die Absperrungen gewaltsam öffnen. Entschlossen, aber ein Schuss kann einen Krieg zwischen den Großmächten auslösen.'],
['Prager Frühling 1968','Die Tschechoslowakei will einen freieren Sozialismus. Die Sowjetunion und ihre Verbündeten drohen mit Truppen. Ihr beratet die Regierung in Prag.','Verhandeln und das Tempo der Reformen drosseln. Ein Einmarsch wird unwahrscheinlicher, aber die Freiheiten werden kleiner.','Die Reformen unverändert fortsetzen und die Armee in Bereitschaft versetzen. Stolz, aber ein Einmarsch wird wahrscheinlicher.'],
['Dorschkrieg (Island)','Island weitet seine Fischereigrenze aus. Britische Fischer fahren trotzdem in das Gebiet, und isländische Küstenwachschiffe schneiden ihre Netze durch. Ihr beratet Großbritannien.','Die Fischer zurückholen und ein Abkommen über Fangquoten aushandeln. Kein Konflikt, aber die Fischer verlieren Fanggebiete.','Kriegsschiffe zum Schutz der Fischer schicken. Die Fischer sind sicher, aber Zusammenstöße mit isländischen Booten drohen.'],
['Mekong-Staudämme','Ein Land am Oberlauf des Mekong baut große Staudämme. Länder flussabwärts bekommen weniger Wasser für Reisfelder und Fische und drohen mit Gegenmaßnahmen. Ihr beratet das Land am Oberlauf.','Die Wassermenge mit den Ländern flussabwärts abstimmen und Daten teilen. Frieden, aber weniger Strom.','Die Dämme nach eigenem Bedarf betreiben. Mehr Strom, aber die Nachbarn fühlen sich bedroht.'],
['Arktis','Das Eis in der Arktis schmilzt, neue Seewege und Rohstoffe werden frei. Mehrere Länder erheben Anspruch auf dieselben Meeresgebiete und schicken Schiffe. Ihr beratet eines davon.','Ein gemeinsames Abkommen über Seewege und Rohstoffe verhandeln. Sicher, aber man teilt den Gewinn.','Den Anspruch mit Marineschiffen sichern. Mehr Kontrolle, aber ein Wettrüsten beginnt.']];
const PA='BBAABABBBABB'+'AAAAAAAAAAAA';CARDS.forEach((c,i)=>{if(PA[i]=='B'){const t=c[2];c[2]=c[3];c[3]=t}}); // [2]=friedlicher Weg, [3]=Eskalation
const freeAv=()=>{const t=new Set(Object.values(P).map(p=>p.av)),f=[...Array(12).keys()].filter(i=>!t.has(i));return f.length?f[Math.random()*f.length|0]:0};
const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const reset=()=>{G={ph:'lobby',order:Object.keys(P),log:[],sol:0,esc:0,hist:[],idx:0,pres:null,card:null,team:[],votes:{},res:null,acc:false,vq:null,asker:null,asp:null,rej:0,lv:null,opts:[],notes:{},k4:false,back:null,nv:{},deck:[],win:null,why:'',last:null};for(const p of Object.values(P)){p.role=null;p.dead=false;p.conv=false}};
reset();
const log=m=>G.log.push(m),nm=i=>P[i].name,al=()=>G.order.filter(i=>!P[i].dead),RN={D:'Diplomat',A:'Analyst',S:'Spion',T:'Tyrann'};
const addH=(t,e)=>{G.hist.push({t,e});EV++;G.last={t,e}};
const win=(w,why)=>{G.ph='over';G.win=w;G.why=why;log(why)};
function round(){
  if(!G.deck.length)G.deck=shuf(CARDS.map((_,i)=>i));
  G.pres=G.order[G.idx];G.card=G.deck.shift();G.team=[];G.votes={};G.res=null;G.rej=0;G.lv=null;G.ph='team';
  const c=CARDS[G.card];G.opts=shuf([{k:'P',x:c[2]},{k:'E',x:c[3]}]);
}
function start(){
  const n=G.order.length,s=[0,0,0,0,0,2,2,3,3,4,4][n];
  const roles=shuf(['T',...Array(s-1).fill('S'),'A',...Array(n-s-1).fill('D')]);
  G.order.forEach((i,k)=>{P[i].role=roles[k];G.notes[i]=[]});
  G.deck=shuf(CARDS.map((_,i)=>i));G.idx=Math.random()*n|0;
  log('Spiel gestartet. Vorstandschef: '+nm(G.order[G.idx]));round();
}
function endDip(){
  if(al().some(i=>P[i].role=='A')){G.ph='guess';G.nv={};log('8 Krisen gelöst! Die Spione haben eine letzte Chance: Sie dürfen den Analysten erraten.')}
  else win('D','8 Krisen gelöst – die Diplomaten gewinnen!');
}
function resolve(){
  const ne=Object.values(G.votes).filter(c=>c=='E').length,esc=ne>=NEED;
  G.res={ne,np:3-ne,esc};esc?G.esc++:G.sol++;addH(CARDS[G.card][0],esc);
  log(CARDS[G.card][0]+': '+(esc?'eskaliert ('+ne+' Eskalationsstimme'+(ne>1?'n':'')+')':'gelöst'));
  if(G.sol>=8)endDip();
  else if(esc){if(!esc1('result'))G.ph='result'}
  else G.ph='result';
}
function nextChair(){do{G.idx=(G.idx+1)%G.order.length}while(P[G.order[G.idx]].dead);G.pres=G.order[G.idx]}
function ttally(){
  const v=Object.entries(G.votes),y=v.filter(e=>e[1]).length,ok=y*2>v.length;
  G.lv=v.map(([i,b])=>[nm(i),b]);
  log('Vorstandswahl: '+y+' Ja / '+(v.length-y)+' Nein – '+(ok?'angenommen':'abgelehnt'));
  G.votes={};
  if(ok){G.rej=0;G.ph='vote';return}
  G.rej++;
  if(G.rej>=3){
    G.rej=0;G.esc++;addH(CARDS[G.card][0]+' (keine Koalition)',true);
    G.res={forced:true,esc:true};log('Dreimal keine Vorstandskoalition – die Spione bekommen einen Punkt');
    if(!esc1('result'))G.ph='result';
  }else{nextChair();G.team=[];G.ph='team'}
}
function gtally(){
  const c={};
  for(const [i,t] of Object.entries(G.nv)){const a=P[i].role;if(a=='S'||a=='T')c[t]=(c[t]||0)+(a=='T'?1.5:1)}
  const e=Object.entries(c).sort((a,b)=>b[1]-a[1]),t=e.length?e[0][0]:null;
  if(t&&P[t].role=='A')win('S',nm(t)+' war der Analyst – die Spione haben ihn enttarnt und gewinnen doch noch!');
  else win('D',(t?nm(t)+' war nicht der Analyst – ':'')+'8 Krisen gelöst, die Diplomaten gewinnen!');
}
function esc1(back){
  if(G.esc>=8){win('S','8 Eskalationen – die Spione gewinnen!');return true}
  if(G.esc==5&&!G.k4){G.k4=true;G.back=back;G.ph='kill';log('Stufe 5: Direkte Hinrichtung – der Vorstandschef darf einen Spieler hinrichten');return true}
  return false;
}
function offerStart(){
  const c=al().filter(i=>P[i].role=='D');
  if(!c.length){G.ph=G.back;return}
  G.offer={to:c[Math.random()*c.length|0],st:'wait',n:(G.offer?G.offer.n:0)+1};
  G.ph='offer';log('Ein Spion wurde hingerichtet. Eine geheime Nachricht wird zugestellt …');
  const n=G.offer.n;setTimeout(()=>{if(G.ph=='offer'&&G.offer&&G.offer.n==n){offerEnd(false);bc()}},180000);
}
function offerEnd(yes){
  const o=G.offer,t=o.to,nt=(i,m)=>G.notes[i]&&G.notes[i].push(m);
  if(yes){
    P[t].role='S';P[t].conv=true;
    nt(t,'Du hast das Angebot angenommen und bist jetzt Spion. Deine Mitstreiter: '+G.order.filter(i=>i!=t&&!P[i].dead&&(P[i].role=='S'||P[i].role=='T')).map(nm).join(', ')+'.');
    for(const i of G.order)if(i!=t&&(P[i].role=='S'||P[i].role=='T'))nt(i,nm(t)+' hat das Angebot angenommen und ist jetzt Spion.');
  }else for(const i of G.order)if(P[i].role=='S'||P[i].role=='T')nt(i,'Das Angebot wurde abgelehnt. Es bleibt bei euch.');
  log('Die Nachricht wurde zugestellt.');G.offer=null;G.ph=G.back;
}
function atally(){
  const y=Object.values(G.votes).filter(Boolean).length,ok=y*2>al().length;
  if(G.vq=='hold'){if(ok){G.ph='apick';log('Anklage genehmigt')}else{G.acc=false;G.ph='team';log('Anklage abgelehnt')}return}
  if(!ok){G.ph='team';log('Die Mehrheit klagt '+nm(G.asp)+' nicht an');return}
  if(P[G.asp].role=='T')return win('D',nm(G.asp)+' war der Tyrann – die Diplomaten gewinnen!');
  G.esc++;addH('Falsche Anklage',true);log(nm(G.asp)+' war nicht der Tyrann – Spione +1');
  if(esc1('team'))return;
  G.ph='team';
}
function act(p,a){
  const id=p.id,ph=G.ph,x=a.x,n=G.order.length,bad='Ungültige Aktion',host=G.order[0]==id;
  switch(a.t){
    case 'start':if(ph!='lobby'||!host)return bad;if(n<5)return 'Mindestens 5 Spieler nötig';start();break;
    case 'kick':if(ph!='lobby'||!host||x==id||!G.order.includes(x))return bad;G.order=G.order.filter(i=>i!=x);if(P[x].res)P[x].res.end();delete P[x];break;
    case 'avatar':if(ph!='lobby')return 'Im Spiel kann der Avatar nicht mehr gewechselt werden';if(!Number.isInteger(x)||x<0||x>11||Object.values(P).some(q=>q.id!=id&&q.av===x))return 'Dieser Avatar ist schon vergeben';p.av=x;break;
    case 'new':if(ph!='lobby'&&host)reset();break;
    case 'team':{
      if(ph!='team'||id!=G.pres||!Array.isArray(x)||x.length!=2||new Set(x).size!=2||!x.every(i=>i!=id&&G.order.includes(i)&&!P[i].dead))return bad;
      G.team=[id,...x];G.votes={};G.ph='tvote';
      log(nm(id)+' schlägt den Vorstand vor: '+G.team.map(nm).join(', '));break}
    case 'tv':if(ph!='tvote'||P[id].dead||G.team.includes(id)||id in G.votes)return bad;G.votes[id]=!!x;if(Object.keys(G.votes).length==al().filter(i=>!G.team.includes(i)).length)ttally();break;
    case 'cv':
      if(ph!='vote'||!G.team.includes(id)||id in G.votes||(x!='P'&&x!='E'))return bad;
      if(x=='E'&&(P[id].role=='D'||P[id].role=='A'))return 'Als Diplomat musst du friedlich wählen';
      G.votes[id]=x;if(Object.keys(G.votes).length==3)resolve();break;
    case 'next':if(ph!='result'||id!=G.pres)return bad;do{G.idx=(G.idx+1)%n}while(P[G.order[G.idx]].dead);round();break;
    case 'acc':if(ph!='team'||G.acc||G.esc<3||P[id].dead)return bad;G.acc=true;G.asker=id;G.vq='hold';G.votes={};G.ph='avote';log(nm(id)+' beantragt eine Anklage');break;
    case 'av':if(ph!='avote'||P[id].dead||id in G.votes)return bad;G.votes[id]=!!x;if(Object.keys(G.votes).length==al().length)atally();break;
    case 'ap':if(ph!='apick'||id!=G.asker||x==id||!G.order.includes(x)||P[x].dead)return bad;G.asp=x;G.vq='accuse';G.votes={};G.ph='avote';log(nm(id)+' klagt '+nm(x)+' an – Abstimmung');break;
    case 'ki':{
      const t=P[x];
      if(ph!='kill'||id!=G.pres||!t||t.dead||x==id)return bad;
      t.dead=true;log(nm(x)+' wurde hingerichtet und war: '+RN[t.role]);
      if(t.role=='T')win('D','Der Tyrann wurde hingerichtet – die Diplomaten gewinnen!');
      else if(t.role=='S')offerStart();
      else G.ph=G.back;
      break}
    case 'nv':
      if(ph!='guess'||P[id].dead||id in G.nv||!P[x]||P[x].dead||x==id)return bad;
      G.nv[id]=x;if(Object.keys(G.nv).length==al().length)gtally();break;
    case 'op':if(ph!='offer'||!G.offer||G.offer.to!=id||G.offer.st!='wait')return bad;G.offer.st='open';break;
    case 'oa':if(ph!='offer'||!G.offer||G.offer.to!=id||G.offer.st!='open')return bad;offerEnd(!!x);break;
    // TESTMODUS-BEGIN
    case 'bot':case 'fill':{
      if(ph!='lobby'||!host)return bad;
      const N=['Alex','Bea','Carl','Dana','Emil','Fay','Gero','Hana','Ivo','Jule'];
      let add=a.t=='bot'?1:Math.max(0,7-n);
      while(add-->0&&G.order.length<10){
        const name=N.find(k=>!G.order.some(i=>P[i].name==k)),b='b'+cr.randomBytes(5).toString('hex');
        P[b]={id:b,name,bot:true,role:null,res:null,av:freeAv()};G.order.push(b);
      }
      break}
    // TESTMODUS-END
    default:return bad;
  }
}
function view(id){
  const me=P[id],ph=G.ph,over=ph=='over',c=G.card!=null&&ph!='lobby'?CARDS[G.card]:null;
  return{ph,sol:G.sol,esc:G.esc,hist:G.hist,ev:EV,last:G.last,me:{id,name:me.name,av:me.av,role:me.role,alive:!me.dead,host:G.order[0]==id},
    pl:G.order.map(i=>{const q=P[i];return{id:i,name:q.name,av:q.av,on:!!q.res||!!q.bot,bot:!!q.bot,dead:!!q.dead,
      role:(over||q.dead||i==id||(me.role=='S'&&(q.role=='S'||q.role=='T'))||(me.role=='A'&&q.role=='S'&&!q.conv))?q.role:null}}),
    pres:G.pres,card:c&&{t:c[0],s:c[1],o:G.opts},team:G.team,offer:ph=='offer'&&G.offer?{mine:G.offer.to==id,st:G.offer.st}:null,voted:Object.keys(ph=='guess'?G.nv:G.votes),res:G.res,rej:G.rej,vn:al().filter(i=>!G.team.includes(i)).length,lv:G.lv,
    priv:G.notes[id]||[],acc:G.acc,asker:G.asker,asp:G.asp,vq:G.vq,win:G.win,why:G.why,log:G.log.slice(-40).reverse()};
}
// TESTMODUS-BEGIN
let bt=null;const sched=()=>{if(bt)return;bt=setTimeout(()=>{bt=null;if(botStep())bc()},+process.env.BOTMS||1300)};
function botStep(){
  const ph=G.ph,B=i=>i&&P[i]&&P[i].bot,pick=a=>a[Math.random()*a.length|0],go=(i,o)=>!act(P[i],o);
  if(ph=='team'&&B(G.pres))return go(G.pres,{t:'team',x:shuf(al().filter(i=>i!=G.pres)).slice(0,2)});
  if(ph=='tvote'){const b=al().find(i=>B(i)&&!G.team.includes(i)&&!(i in G.votes));if(b)return go(b,{t:'tv',x:Math.random()<.7})}
  if(ph=='vote'){const b=G.team.find(i=>B(i)&&!(i in G.votes));
    if(b){const r=P[b].role;return go(b,{t:'cv',x:((r=='S'||r=='T')&&Math.random()<.6)?'E':'P'})}}
  if(ph=='result'&&B(G.pres))return go(G.pres,{t:'next'});
  if(ph=='avote'){const b=al().find(i=>B(i)&&!(i in G.votes));if(b)return go(b,{t:'av',x:G.vq=='hold'?true:Math.random()<.5})}
  if(ph=='kill'&&B(G.pres))return go(G.pres,{t:'ki',x:pick(al().filter(i=>i!=G.pres))});
  if(ph=='offer'&&G.offer&&B(G.offer.to))return go(G.offer.to,G.offer.st=='wait'?{t:'op'}:{t:'oa',x:Math.random()<.5});
  if(ph=='guess'){const b=al().find(i=>B(i)&&!(i in G.nv));
    if(b){let t=al().filter(i=>i!=b);return go(b,{t:'nv',x:pick(t)})}}
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
        else{const id='p'+cr.randomBytes(6).toString('hex');P[id]={id,name,role:null,res:null,av:freeAv()};G.order.push(id);out.id=id;bc()}
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
