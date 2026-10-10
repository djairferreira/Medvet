const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;

/* ===== Laboratório 1: dobramento do embrião (sagital × transversal) ===== */
(function(){
  const svg=$('#dbrSvg');if(!svg)return;
  const out=$('#dbrOut'),prev=$('#dbrPrev'),next=$('#dbrNext');
  let i=0,view='sag';
  const lerp=(a,b,t)=>a+(b-a)*t;
  /* tartaruga: percorre segmentos [comprimento, curvatura] a partir de p0 com rumo th */
  function turtle(x,y,th,segs){const P=[[x,y]];for(const [len,k] of segs){const n=Math.max(1,Math.ceil(len/4)),ds=len/n;for(let j=0;j<n;j++){th+=k*ds;x+=Math.cos(th)*ds;y+=Math.sin(th)*ds;P.push([x,y])}}return P}
  /* desloca uma polilinha pela normal "esquerda" do sentido de percurso (para cima quando anda para a direita) */
  function off(P,d){return P.map((p,j)=>{const a=P[Math.max(0,j-1)],b=P[Math.min(P.length-1,j+1)];let tx=b[0]-a[0],ty=b[1]-a[1];const L=Math.hypot(tx,ty)||1;tx/=L;ty/=L;return [p[0]+ty*d,p[1]-tx*d]})}
  const pl=P=>'M'+P.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L');
  function cr(P,closed){/* Catmull-Rom → Bézier */let d='M'+P[0][0].toFixed(1)+' '+P[0][1].toFixed(1);const n=P.length;
    for(let j=0;j<(closed?n:n-1);j++){const p0=P[closed?(j-1+n)%n:Math.max(0,j-1)],p1=P[j],p2=P[(j+1)%n],p3=P[closed?(j+2)%n:Math.min(n-1,j+2)];
      d+=` C${(p1[0]+(p2[0]-p0[0])/6).toFixed(1)} ${(p1[1]+(p2[1]-p0[1])/6).toFixed(1)} ${(p2[0]-(p3[0]-p1[0])/6).toFixed(1)} ${(p2[1]-(p3[1]-p1[1])/6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`}
    return d+(closed?'Z':'')}
  const path=(d,st,w,extra)=>E('path',Object.assign({d,fill:'none',stroke:st,'stroke-width':w,'stroke-linecap':'round','stroke-linejoin':'round'},extra||{}),svg);
  const lab=(x,y,s,o={})=>T(svg,x,y,s,Object.assign({fs:18},o));
  const legend=()=>{[['Ectoderma','var(--sky)',30],['Mesoderma','var(--eosin)',225],['Endoderma','var(--amber)',420]].forEach(([s,c,x])=>{E('rect',{x,y:336,width:18,height:12,rx:3,fill:c},svg);lab(x+26,348,s,{a:'start',fill:'var(--ink)'})})};

  const STEPS=[
    ['Disco trilaminar plano','O embrião é um disco de três folhetos sobre o saco vitelino, coberto pelo âmnio. As membranas <b>bucofaríngea</b> (cranial) e <b>cloacal</b> (caudal) são pontos sem mesoderma. Cranial à membrana bucofaríngea ficam a <b>área cardiogênica</b> e o <b>septo transverso</b>.','No transversal: placa neural no meio, notocorda, mesoderma paraxial, intermediário e lateral; a placa lateral já se abre em somatopleura (acima) e esplancnopleura (abaixo), com o celoma entre elas.'],
    ['Começa a dobra cefálica','O encéfalo cresce para a frente e a cabeça se curva ventralmente. A área cardiogênica e o septo transverso giram ~180°: o <b>coração</b> fica ventral ao futuro intestino anterior. Forma-se o <b>intestino anterior</b>, de fundo cego na membrana bucofaríngea.','No transversal: as pregas neurais sobem (sulco neural), os somitos aparecem e as bordas do disco começam a se curvar para baixo.'],
    ['Dobra caudal e dobras laterais','A cauda se curva: a <b>membrana cloacal</b> e o <b>alantoide</b> passam para a face ventral; forma-se o <b>intestino posterior</b>. Entre os dois, o <b>intestino médio</b> ainda abre amplamente para o saco vitelino.','No transversal: o tubo neural se fechou; a somatopleura desce de cada lado, a esplancnopleura começa a envolver o intestino. O celoma intraembrionário ainda se comunica com o extraembrionário.'],
    ['A comunicação se estreita','As bordas se aproximam na face ventral: a ligação entre intestino médio e saco vitelino fica reduzida ao <b>ducto vitelino</b>, que vai com o pedículo do alantoide para o <b>cordão umbilical</b>.','No transversal: as duas somatopleuras quase se tocam na linha média ventral; o intestino quase se fecha e fica suspenso pelo mesentério dorsal.'],
    ['Tubo dentro de tubo','Corpo fechado, exceto no <b>anel umbilical</b>. Ectoderma por fora, intestino (endoderma) por dentro, celoma entre os dois; âmnio envolvendo todo o embrião. Membranas bucofaríngea e cloacal no fundo do <b>estomodeu</b> e do <b>proctodeu</b>, prontas para se romper.','No transversal: parede ventral fechada (somatopleura), intestino fechado (esplancnopleura) preso pelo mesentério dorsal, celoma intraembrionário (futuras cavidades pleurais e peritoneal) entre eles. A ligação com o saco vitelino está em outro nível, no umbigo.']
  ];
  const F=[0,.38,.65,.85,1];

  function drawSag(k){
    const f=F[k],cx=300,cy=136;
    const kc=f*3.9/150,kk=f*3.6/110;
    const cran=turtle(cx,cy,Math.PI,[[70,0],[150,-kc]]),caud=turtle(cx,cy,0,[[70,0],[110,kk]]);
    const C=cran.slice().reverse().concat(caud.slice(1));
    const iMid=cran.length-1,sOf=s=>Math.round(iMid+s/4);/* s<0 cranial, s>0 caudal */
    const ecto=off(C,11),endo=off(C,-10),meso=off(C,-1),neur=off(C,5);
    const P=(arr,s)=>arr[Math.max(0,Math.min(arr.length-1,sOf(s)))];
    const xs=C.map(p=>p[0]),ys=C.map(p=>p[1]),minx=Math.min(...xs),maxx=Math.max(...xs),miny=Math.min(...ys);
    const eC=ecto[0],eK=ecto[ecto.length-1],nC=endo[0],nK=endo[endo.length-1];
    /* âmnio */
    const amn=cr([eC,[minx-34,miny-6],[cx,miny-62],[maxx+34,miny-6],eK]);
    E('path',{d:amn+' L'+eK[0]+' '+eK[1],fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':3,opacity:.9},svg);
    /* saco vitelino */
    const mx=(nC[0]+nK[0])/2,yb=Math.min(322,Math.max(nC[1],nK[1])+lerp(190,120,f));
    E('path',{d:cr([nC,[mx-lerp(190,95,f),yb-45],[mx,yb],[mx+lerp(190,95,f),yb-45],nK]),fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':4},svg);
    /* camadas */
    path(pl(ecto),'var(--sky)',5);
    path(pl(endo),'var(--amber)',5);
    const segM=(a,b)=>path(pl(meso.slice(sOf(a),sOf(b)+1)),'var(--eosin)',9);
    segM(-220,-158);segM(-142,132);segM(148,180);
    path(pl(neur.slice(sOf(-140),sOf(126)+1)),'var(--hema)',k?8:5);
    /* membranas */
    const mb=P(meso,-150),mc=P(meso,140);
    E('circle',{cx:mb[0],cy:mb[1],r:6,fill:'var(--paper)',stroke:'var(--ink)','stroke-width':2},svg);
    E('circle',{cx:mc[0],cy:mc[1],r:6,fill:'var(--paper)',stroke:'var(--ink)','stroke-width':2},svg);
    /* coração e septo transverso */
    const h=P(meso,-185),st=P(meso,-212);
    E('circle',{cx:h[0],cy:h[1],r:13,fill:'var(--eosin)',stroke:'var(--eosin)'},svg);
    E('circle',{cx:st[0],cy:st[1],r:7,fill:'var(--bone-2)',stroke:'var(--amber)','stroke-width':2},svg);
    /* alantoide */
    if(k>=1){const a=P(endo,165),b=P(endo,161);const tx=a[0]-b[0],ty=a[1]-b[1],L=Math.hypot(tx,ty)||1;const nx=-ty/L,ny=tx/L;const r=lerp(8,22,f);
      E('circle',{cx:a[0]-nx*(r+2),cy:a[1]-ny*(r+2),r,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':3},svg)}
    /* rótulos */
    lab(cx,miny-70,'Âmnio',{fill:'var(--sky)'});
    lab(mx,yb-30,'Saco vitelino',{fill:'var(--ink)'});
    if(k===0){lab(96,cy+64,'Coração',{fill:'var(--eosin)',a:'start'});lab(150,cy+38,'M. bucofaríngea',{a:'start',fill:'var(--ink)'});lab(450,cy+38,'M. cloacal',{fill:'var(--ink)'});lab(300,cy-20,'Placa neural',{fill:'var(--hema)'})}
    else{
      lab(cx,cy-24,'Tubo neural',{fill:'var(--hema)'});
      lab(h[0]-22,h[1]+6,'Coração',{fill:'var(--eosin)',a:'end'});
      const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
      if(k<=1)lab(cx,cy+40,'Intestino',{fill:'var(--amber)'});
      else{const fg=mid(P(endo,-110),P(endo,-200)),hg=mid(P(endo,95),P(endo,170));
        const lx=mx-150,rx=mx+150,ly=yb-80;
        const ax=h[0]-34,ay=h[1]-40;E('line',{x1:ax+4,y1:ay-5,x2:fg[0],y2:fg[1],stroke:'var(--muted)','stroke-width':1.5},svg);E('circle',{cx:fg[0],cy:fg[1],r:3,fill:'var(--ink)'},svg);
        E('line',{x1:rx-4,y1:ly+34,x2:hg[0],y2:hg[1],stroke:'var(--muted)','stroke-width':1.5},svg);E('circle',{cx:hg[0],cy:hg[1],r:3,fill:'var(--ink)'},svg);
        lab(ax,ay,'I. anterior',{a:'end',fill:'var(--ink)'});lab(rx,ly+52,'I. posterior',{a:'start',fill:'var(--ink)'});
        lab(cx,cy+(k>=3?40:56),'I. médio',{fill:'var(--ink)'})}
      if(k>=2){const al=P(endo,165);lab(al[0]+28,al[1]+30,'Alantoide',{a:'start',fill:'var(--amber)'})}
      if(k>=3)lab(mx,(nC[1]+nK[1])/2+36,'Ducto vitelino',{fill:'var(--ink)'});
    }
    legend();
  }

  function drawTra(k){
    const f=F[k],g=[0,.45,1,1,1][k],yT=lerp(119,52,g),cx=300;
    const mir=P=>P.map(p=>[600-p[0],p[1]]);
    const oR=turtle(396,124,0,[[18,0],[173,f*Math.PI/173],[100*f,0]]);
    const s0=[lerp(396,310,f),lerp(146,162,f)],al=lerp(193,72,f);
    const iR=turtle(s0[0],s0[1],0,[[al,f>0?Math.PI*f/al:0],[Math.max(.01,10*f),0]]);
    const ectoR=off(oR,5),smR=off(oR,-4),spR=off(iR,5),enR=off(iR,-5);
    const ectoL=mir(ectoR),smL=mir(smR),spL=mir(spR),enL=mir(enR);
    /* âmnio */
    if(k<4){const a=ectoL[ectoL.length-1],b=ectoR[ectoR.length-1];const xs=ectoR.map(p=>p[0]);const mxx=Math.min(592,Math.max(...xs)+28);
      E('path',{d:cr([a,[600-mxx,a[1]-12],[600-mxx+12,60],[cx,14],[mxx-12,60],[mxx,b[1]-12],b]),fill:'none',stroke:'var(--sky)','stroke-width':3,opacity:.8},svg)}
    else E('ellipse',{cx,cy:150,rx:190,ry:132,fill:'none',stroke:'var(--sky)','stroke-width':3,opacity:.8},svg);
    /* saco vitelino */
    if(k<4){const a=enR[enR.length-1],b=enL[enL.length-1];const yb=lerp(326,330,f);
      E('path',{d:cr([a,[cx+lerp(260,110,f),yb-30],[cx,yb],[cx-lerp(260,110,f),yb-30],b]),fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':4,opacity:.9},svg)}
    /* ectoderma dorsal + lateral */
    const dors=[];for(let x=204;x<=396;x+=4){const b=(1+Math.cos(Math.PI*(x-cx)/96))/2;dors.push([x,119-(119-yT)*b])}
    path(pl(ectoL.slice().reverse().concat(dors,ectoR)),'var(--sky)',6);
    path(pl(smR),'var(--eosin)',7);path(pl(smL),'var(--eosin)',7);
    path(pl(spR),'var(--eosin)',7);path(pl(spL),'var(--eosin)',7);
    path(pl(enL.slice().reverse().concat(enR)),'var(--amber)',6);
    /* estruturas axiais */
    const ys=lerp(134,104,g),hs=lerp(20,44,g);
    [cx-52,cx+52].forEach(x=>E('rect',{x:x-20,y:ys-hs/2,width:40,height:hs,rx:10,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2},svg));
    [cx-88,cx+88].forEach(x=>E('circle',{cx:x,cy:134,r:8,fill:'var(--bone-2)',stroke:'var(--eosin)','stroke-width':2},svg));
    E('circle',{cx,cy:lerp(134,128,g),r:7,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':2},svg);
    if(k===0)path('M270 119 L330 119','var(--hema)',9);
    else if(k===1)path(`M262 ${yT+14} Q272 ${yT+50} 300 ${yT+52} Q328 ${yT+50} 338 ${yT+14}`,'var(--hema)',8);
    else E('circle',{cx,cy:yT+34,r:21,fill:'var(--sky-soft)',stroke:'var(--hema)','stroke-width':7},svg);
    if(k>=2)[cx-16,cx+16].forEach(x=>E('circle',{cx:x,cy:146,r:6,fill:'var(--bad-soft)',stroke:'var(--bad)','stroke-width':2},svg));
    if(k>=3)path(`M300 150 L300 ${s0[1]}`,'var(--eosin)',5);
    /* rótulos */
    if(k===0){lab(cx,104,'Placa neural',{fill:'var(--hema)'});lab(500,108,'Somatopleura',{fill:'var(--ink)'});lab(500,186,'Esplancnopleura',{fill:'var(--ink)'});lab(100,180,'↑ celoma',{fill:'var(--muted)',a:'start'});lab(cx,262,'Saco vitelino',{fill:'var(--ink)'})}
    else if(k===1){lab(cx,40,'Sulco neural',{fill:'var(--hema)'});lab(cx,262,'Saco vitelino',{fill:'var(--ink)'});lab(510,96,'Somito',{fill:'var(--eosin)'})}
    else{
      if(k<4)lab(cx,lerp(300,316,f),'Saco vitelino',{fill:'var(--ink)'});
      lab(cx,yT-12,'Tubo neural',{fill:'var(--hema)'});
      if(k>=3)lab(368,s0[1]+52,'Intestino',{fill:'var(--amber)',a:'start'});else lab(cx,242,'Intestino médio',{fill:'var(--amber)'});
      lab(k>=3?205:450,k>=3?212:215,'Celoma',{fill:'var(--muted)'});
      if(k===4)lab(cx,316,'Parede ventral fechada',{fill:'var(--ink)'});
    }
    legend();
  }

  function go(n){i=(n+STEPS.length)%STEPS.length;clear(svg);(view==='sag'?drawSag:drawTra)(i);const s=STEPS[i];
    out.innerHTML=`<span class="mono" style="color:var(--muted)">${i+1} de ${STEPS.length}</span> · <b>${s[0]}</b><br>${s[1]}<br><span style="color:var(--muted)">${s[2]}</span>`;
    prev.disabled=i===0;next.textContent=i===STEPS.length-1?'Recomeçar ↺':'Próxima etapa →'}
  prev.addEventListener('click',()=>go(i-1));next.addEventListener('click',()=>go(i+1));
  choices('#dbrView',v=>{view=v;go(i)});
})();

/* ===== Laboratório 2: jogo "de qual folheto vem?" ===== */
(function(){
  const svg=$('#dfoSvg');if(!svg)return;
  const item=$('#dfoItem'),out=$('#dfoOut'),btns=$('#dfoBtns');
  const NOME={ecto:'Ectoderma',meso:'Mesoderma',endo:'Endoderma',cn:'Crista neural'};
  const COR={ecto:'var(--sky)',meso:'var(--eosin)',endo:'var(--amber)',cn:'var(--ok)'};
  const B=[
    ['Epiderme','ecto','Ectoderma superficial que ficou cobrindo o corpo.'],
    ['Estojo córneo do casco','ecto','Anexo da epiderme: queratina produzida pelo ectoderma.'],
    ['Pelos e penas','ecto','Anexos epidérmicos, induzidos pela derme abaixo.'],
    ['Glândula mamária (epitélio)','ecto','Glândula sudorípara modificada: brota da epiderme ao longo da crista mamária.'],
    ['Cristalino','ecto','Induzido no ectoderma superficial pela vesícula óptica.'],
    ['Esmalte dos dentes','ecto','Os ameloblastos vêm do ectoderma oral; a dentina é que vem da crista neural.'],
    ['Adeno-hipófise','ecto','Bolsa de Rathke, evaginação do teto do estomodeu (ectoderma oral).'],
    ['Retina','ecto','Neuroectoderma: o cálice óptico é uma evaginação do prosencéfalo.'],
    ['Medula espinhal','ecto','Neuroectoderma: parte caudal do tubo neural.'],
    ['Neuro-hipófise','ecto','Neuroectoderma: evaginação do assoalho do diencéfalo.'],
    ['Músculo esfíncter da pupila','ecto','Exceção famosa: músculo liso de origem neuroectodérmica (borda do cálice óptico).'],
    ['Epitélio da orelha interna','ecto','Vem do placoide ótico, um espessamento do ectoderma superficial.'],
    ['Vértebras','meso','Esclerótomo dos somitos (mesoderma paraxial).'],
    ['Músculos dos membros','meso','Mioblastos hipaxiais que migram dos somitos para o broto do membro.'],
    ['Derme do dorso','meso','Dermátomo dos somitos.'],
    ['Ossos dos membros','meso','Mesoderma lateral somático do broto do membro.'],
    ['Miocárdio','meso','Área cardiogênica do mesoderma esplâncnico.'],
    ['Hemácias e leucócitos','meso','Ilhotas sanguíneas do mesoderma esplâncnico (saco vitelino) e, depois, órgãos hematopoéticos.'],
    ['Baço','meso','Mesênquima do mesogástrio dorsal (mesoderma esplâncnico); não é endodérmico.'],
    ['Rim (néfrons)','meso','Mesoderma intermediário (blastema metanéfrico).'],
    ['Córtex da adrenal','meso','Epitélio celômico (mesoderma) junto à crista gonadal.'],
    ['Peritônio e pleura','meso','Mesotélio: epitélio de origem mesodérmica (placa lateral).'],
    ['Útero e oviduto','meso','Ductos paramesonéfricos (de Müller), do mesoderma intermediário.'],
    ['Células de Sertoli e de Leydig','meso','Componentes somáticos da gônada, do mesoderma intermediário/epitélio celômico.'],
    ['Endotélio dos vasos','meso','Angioblastos do mesoderma: o endotélio é um epitélio mesodérmico.'],
    ['Núcleo pulposo','meso','Resto da notocorda (mesoderma axial).'],
    ['Epitélio intestinal','endo','Endoderma do intestino primitivo.'],
    ['Hepatócitos','endo','Divertículo hepático do intestino anterior (endoderma).'],
    ['Ilhotas e ácinos do pâncreas','endo','Brotos pancreáticos dorsal e ventral do duodeno (endoderma).'],
    ['Epitélio dos alvéolos','endo','Divertículo respiratório do intestino anterior.'],
    ['Folículos da tireoide','endo','Divertículo do assoalho da faringe.'],
    ['Paratireoides','endo','Epitélio da 3ª e 4ª bolsas faríngeas.'],
    ['Timo (epitélio)','endo','3ª bolsa faríngea; os linfócitos chegam depois, vindos da medula óssea.'],
    ['Epitélio da bexiga','endo','Seio urogenital, parte da cloaca (intestino posterior).'],
    ['Epitélio do rúmen','endo','Apesar de estratificado e queratinizado, é endoderma do intestino anterior.'],
    ['Epitélio da tuba auditiva','endo','1ª bolsa faríngea.'],
    ['Próstata (epitélio)','endo','Brota do seio urogenital (endoderma), induzida pela di-hidrotestosterona.'],
    ['Melanócitos','cn','Migram da crista neural para a pele; falhas causam manchas brancas e surdez.'],
    ['Medula da adrenal','cn','Células cromafins: neurônios simpáticos modificados, da crista neural.'],
    ['Gânglios espinhais','cn','Crista neural do tronco, segmentada pelos somitos.'],
    ['Neurônios do plexo mioentérico','cn','Crista neural vagal e sacral; falha = aganglionose (potro overo letal).'],
    ['Células de Schwann','cn','Crista neural que acompanha os axônios periféricos.'],
    ['Dentina (odontoblastos)','cn','Ectomesênquima da crista neural da papila dentária.'],
    ['Mandíbula e ossos da face','cn','Ectomesênquima dos arcos faríngeos (crista neural cefálica).'],
    ['Gânglios simpáticos','cn','Crista neural do tronco.'],
    ['Pia-máter e aracnoide','cn','Leptomeninges do encéfalo derivam da crista neural.'],
    ['Septo aorticopulmonar','cn','Crista neural cardíaca; falha = tronco arterioso persistente.']
  ];
  const N=12;let deck=[],pos=0,ok=0,err=0,seq=0,best=0,got={ecto:0,meso:0,endo:0,cn:0},answered=false;
  function board(){clear(svg);const ks=['ecto','meso','endo','cn'];
    ks.forEach((k,j)=>{const x=20+j*145;E('rect',{x,y:12,width:130,height:150,rx:10,fill:'var(--paper)',stroke:COR[k],'stroke-width':2},svg);
      for(let t=0;t<got[k];t++){const r=Math.floor(t/4),c=t%4;E('circle',{cx:x+22+c*29,cy:142-r*28,r:11,fill:COR[k]},svg)}
      T(svg,x+65,190,NOME[k].replace('Crista neural','Crista'),{fs:18,fill:COR[k]})});
    T(svg,300,222,`Acertos ${ok} · Erros ${err} · Sequência ${seq} · Recorde ${best}`,{fs:18,fill:'var(--ink)'})}
  function show(){answered=false;$$('button',btns).forEach(b=>{b.disabled=false;b.setAttribute('aria-pressed','false')});
    if(pos>=deck.length){item.textContent='Fim de jogo!';const p=Math.round(100*ok/N);out.innerHTML=`<b>${ok} de ${N} (${p}%).</b> ${p>=80?'Excelente: você domina os folhetos.':p>=50?'Bom. Revise o quadro-resumo (22.7) e as pegadinhas.':'Revise o quadro-resumo (22.7) e jogue de novo.'}`;$$('button',btns).forEach(b=>b.disabled=true);board();return}
    item.textContent=deck[pos][0];out.innerHTML=`<span class="mono" style="color:var(--muted)">${pos+1} de ${N}</span> · De qual folheto vem esta estrutura?`;board()}
  function novo(){deck=shuffle(B).slice(0,N);pos=0;ok=0;err=0;seq=0;got={ecto:0,meso:0,endo:0,cn:0};show()}
  btns.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||answered||pos>=deck.length)return;answered=true;const [nm,k,ex]=deck[pos];
    $$('button',btns).forEach(x=>x.disabled=true);b.setAttribute('aria-pressed','true');
    if(b.dataset.k===k){ok++;seq++;best=Math.max(best,seq);got[k]++;out.innerHTML=`<b style="color:var(--ok)">Certo!</b> <b>${nm}</b> → ${NOME[k]}. ${ex}`}
    else{err++;seq=0;out.innerHTML=`<b style="color:var(--bad)">Não.</b> <b>${nm}</b> vem do <b>${NOME[k]}</b>, não do ${NOME[b.dataset.k]}. ${ex}`}
    board();pos++;setTimeout(()=>{if(pos<deck.length||pos===deck.length)nextBtnLabel()},0)});
  const nxt=$('#dfoNext');function nextBtnLabel(){nxt.textContent=answered?'Próxima →':'Pular →'}
  nxt.addEventListener('click',()=>{if(!answered){if(pos<deck.length){err++;seq=0;pos++}}show();nextBtnLabel()});
  $('#dfoNew').addEventListener('click',()=>{novo();nextBtnLabel()});
  novo();
})();
