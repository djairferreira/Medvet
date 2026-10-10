const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;
const cvD=pts=>'M'+pts.map(p=>p.join(' ')).join(' L');

/* ============ 1. Circulação fetal (cfet) ============ */
(()=>{const s=$('#cfetSvg');if(!s)return;const out=$('#cfetOut'),anim=$('#cfetAnim');
  const C={oxy:'var(--eosin)',mix:'var(--amber)',poor:'var(--sky)'};
  const defs=E('defs',{},s);
  for(const k in C){const m=E('marker',{id:'cfetM'+k,viewBox:'0 0 10 10',refX:7,refY:5,markerWidth:13,markerHeight:13,markerUnits:'userSpaceOnUse',orient:'auto'},defs);E('path',{d:'M0,0 L10,5 L0,10 z',fill:C[k]},m)}
  const g=E('g',{},s);
  const V={
    vu:[[40,448],[40,402]], dv:[[40,402],[40,362]], fin:[[40,402],[70,402]], fout:[[120,380],[120,362]],
    vret:[[420,448],[420,362],[40,362]], vcc:[[40,362],[40,227],[58,227]], vcr:[[200,32],[110,32],[110,194]],
    tp:[[150,338],[150,346],[330,346],[330,123],[312,123]], vp:[[225,146],[225,194]],
    ao:[[310,300],[370,300],[370,72]], cab:[[370,72],[370,56]], aod:[[370,72],[560,72],[560,446]],
    da:[[330,123],[330,96],[558,96]], ua:[[380,470],[192,470]],
    adv:[[100,246],[100,282]], aev:[[270,246],[270,282]]
  };
  const box=(x,y,w,h,t,st,fs)=>{E('rect',{x,y,width:w,height:h,rx:10,fill:st[0],stroke:st[1],'stroke-width':2},g);T(g,x+w/2,y+h/2+(fs||19)*.35,t,{fs:fs||19})};
  const vessel=(k,col,w,o={})=>{let p=V[k];if(o.rev)p=p.slice().reverse();const d=cvD(p);
    if(col==='off'){E('path',{d,fill:'none',stroke:'var(--muted)','stroke-width':3,'stroke-dasharray':'6 7',opacity:.6},g);return}
    if(o.halo)E('path',{d,fill:'none',stroke:'var(--paper)','stroke-width':w+8},g);
    E('path',{d,fill:'none',stroke:C[col],'stroke-width':w,'stroke-linejoin':'round','marker-end':'url(#cfetM'+col+')'},g);
    if(!reduce){const f=E('path',{d,fill:'none',stroke:'var(--paper)','stroke-width':Math.max(1.5,w/3),'stroke-dasharray':'3 13',opacity:.8},g);
      E('animate',{attributeName:'stroke-dashoffset',from:16,to:0,dur:'0.9s',repeatCount:'indefinite'},f)}};
  const soft={oxy:['var(--eosin-soft)','var(--eosin)'],mix:['var(--amber-soft)','var(--amber)'],poor:['var(--sky-soft)','var(--sky)'],bad:['var(--bad-soft)','var(--bad)'],n:['var(--panel)','var(--line)']};
  const M={
    feto:{ch:{AD:'mix',AE:'mix',VD:'poor',VE:'mix'},pla:true,lung:'n',
      v:[['vu','oxy',6],['dv','oxy',6],['fin','oxy',3],['fout','mix',3],['vret','poor',5],['vcc','mix',7],['vcr','poor',5],['adv','poor',3],['aev','mix',4],['tp','poor',6],['vp','poor',2],['ao','mix',6,{halo:1}],['cab','mix',5],['aod','mix',6],['da','poor',6,{halo:1}],['ua','poor',5]],fo:'open',
      t:'<b>Feto.</b> O sangue oxigenado da placenta sobe pela <b>veia umbilical (VU)</b>; parte atravessa o fígado e parte pega o <b>ducto venoso (DV)</b> até a cava caudal. No átrio direito, a crista dividens manda a maior parte pelo <b>forame oval (FO)</b> ao átrio esquerdo → VE → aorta → <b>cabeça e coração</b> (o sangue mais oxigenado). O sangue da cava cranial vai ao VD e ao tronco pulmonar (TP); como os pulmões têm resistência altíssima, quase tudo passa pelo <b>ducto arterioso (DA)</b> para a aorta descendente e volta à placenta pelas <b>artérias umbilicais (AU)</b>.'},
    nasc:{ch:{AD:'poor',AE:'oxy',VD:'poor',VE:'oxy'},pla:false,lung:'oxy',
      v:[['vu','off'],['dv','off'],['fin','off'],['fout','poor',4],['vret','poor',5],['vcc','poor',7],['vcr','poor',5],['adv','poor',5],['aev','oxy',5],['tp','poor',7],['vp','oxy',7],['ao','oxy',7,{halo:1}],['cab','oxy',5],['aod','oxy',7],['da','off'],['ua','off']],fo:'closed',
      t:'<b>Nascimento.</b> O cordão é interrompido e o animal respira: a resistência pulmonar despenca e o VD manda todo o sangue aos pulmões. Mais sangue volta ao átrio esquerdo (pressão sobe) e menos ao direito: o septo primo encosta no secundo e o <b>forame oval fecha</b> (→ fossa oval). O O₂ contrai o <b>ducto arterioso</b> (→ ligamento arterioso). O <b>ducto venoso</b> fecha (→ ligamento venoso), a <b>veia umbilical</b> vira ligamento redondo do fígado e as <b>artérias umbilicais</b>, ligamentos redondos da bexiga. Agora as circulações pulmonar e sistêmica estão em série.'},
    pda:{ch:{AD:'poor',AE:'bad',VD:'poor',VE:'bad'},pla:false,lung:'bad',
      v:[['vu','off'],['dv','off'],['fin','off'],['fout','poor',4],['vret','poor',5],['vcc','poor',7],['vcr','poor',5],['adv','poor',5],['aev','oxy',8],['tp','mix',7],['vp','oxy',11],['ao','oxy',9,{halo:1}],['cab','oxy',5],['aod','oxy',6],['da','oxy',6,{halo:1,rev:1}],['ua','off']],fo:'closed',
      t:'<b>Ducto arterioso persistente (desvio esquerda→direita).</b> Depois do nascimento a pressão na aorta é maior que no tronco pulmonar, então o sangue <b>volta da aorta para o pulmão</b> pelo ducto, na sístole e na diástole: <b>sopro contínuo</b>. Os pulmões, o átrio e o ventrículo esquerdos recebem volume a mais (em vermelho de alerta) e dilatam; a pressão diastólica cai (pulso saltitante). Não há cianose. Comum em cadelas Poodle, Lulu, Maltês, Yorkshire; tratamento por oclusão com cateter ou ligadura.'},
    pdar:{ch:{AD:'poor',AE:'oxy',VD:'bad',VE:'oxy'},pla:false,lung:'n',
      v:[['vu','off'],['dv','off'],['fin','off'],['fout','poor',4],['vret','poor',5],['vcc','poor',7],['vcr','poor',5],['adv','poor',5],['aev','oxy',4],['tp','poor',8],['vp','oxy',3],['ao','oxy',6,{halo:1}],['cab','oxy',5],['aod','mix',7],['da','poor',6,{halo:1}],['ua','off']],fo:'closed',
      t:'<b>Ducto persistente reverso.</b> Num ducto grande, o excesso de fluxo lesa as arteríolas pulmonares e a pressão pulmonar passa a superar a da aorta: o desvio se inverte (direita→esquerda), como no feto. O sangue pobre em O₂ entra na aorta <b>depois</b> dos vasos da cabeça, então surge <b>cianose diferencial</b>: mucosa oral rosada, vulva/prepúcio azulados. Há policitemia e não há sopro. Fechar o ducto agora é contraindicado: ele virou a válvula de escape do VD.'},
    fop:{ch:{AD:'mix',AE:'oxy',VD:'mix',VE:'oxy'},pla:false,lung:'oxy',
      v:[['vu','off'],['dv','off'],['fin','off'],['fout','poor',4],['vret','poor',5],['vcc','poor',7],['vcr','poor',5],['adv','mix',6],['aev','oxy',5],['tp','mix',7],['vp','oxy',8],['ao','oxy',7,{halo:1}],['cab','oxy',5],['aod','oxy',7],['da','off'],['ua','off']],fo:'lr',
      t:'<b>Forame oval patente.</b> Os septos primo e secundo não se fundiram. Como a pressão é maior no átrio esquerdo, o septo primo costuma ficar fechado e o achado não tem importância. Num defeito do septo interatrial verdadeiro (aberturas alinhadas), sangue passa da <b>esquerda para a direita</b> e sobrecarrega o lado direito. Se a pressão pulmonar subir (hipóxia neonatal, estenose pulmonar), o fluxo pode inverter (direita→esquerda) e causar cianose.'}
  };
  let mode='feto';
  const draw=()=>{clear(g);const m=M[mode];
    box(200,10,260,44,'Cabeça e pescoço',soft.n);
    box(140,100,170,46,'Pulmões',soft[m.lung]);
    box(70,380,100,44,'Fígado',soft.n);
    box(20,448,170,44,m.pla?'Placenta':'(cordão cortado)',m.pla?soft.oxy:soft.n,m.pla?19:18);
    box(380,448,200,44,'Corpo e membros',soft.n);
    for(const [k,x,y,h] of [['AD',60,196,62],['AE',190,196,62],['VD',60,268,70],['VE',190,268,70]]){
      E('rect',{x,y,width:120,height:h,rx:12,fill:soft[m.ch[k]][0],stroke:soft[m.ch[k]][1],'stroke-width':m.ch[k]==='bad'?4:2.5},g);T(g,x+60,y+h/2+8,k,{fs:22,w:800})}
    m.v.forEach(([k,c,w,o])=>vessel(k,c,w,o||{}));
    // forame oval
    if(m.fo==='open'){E('path',{d:'M130 212 Q185 190 240 212',fill:'none',stroke:C.mix,'stroke-width':5,'marker-end':'url(#cfetMmix)'},g)}
    else if(m.fo==='lr'){E('path',{d:'M240 214 Q185 194 130 214',fill:'none',stroke:C.oxy,'stroke-width':3,'marker-end':'url(#cfetMoxy)'},g)}
    else{E('line',{x1:185,y1:200,x2:185,y2:254,stroke:'var(--ink)','stroke-width':3},g)}
    // rótulos curtos
    const L=(x,y,t,a)=>T(g,x,y,t,{fs:18,a:a||'start',w:700,fill:'var(--muted)'});
    L(48,430,'VU');L(48,392,'DV');L(48,300,'VCCd');L(118,90,'VCCr');L(337,250,'TP');L(378,250,'Ao');
    L(470,124,'DA','middle');L(285,462,'AU','middle');L(185,190,'FO','middle');L(232,180,'VP');
    out.innerHTML=m.t+'<br><span style="color:var(--muted);font-size:.88em">VU veia umbilical · DV ducto venoso · VCCd/VCCr veias cavas caudal/cranial · TP tronco pulmonar · Ao aorta · DA ducto arterioso · FO forame oval · VP veias pulmonares · AU artérias umbilicais</span>'};
  choices('#cfetBtns',k=>{mode=k;draw()});
  if(anim){if(reduce){anim.textContent='Fluxo estático';anim.disabled=true}
    let on=true;anim.addEventListener('click',()=>{on=!on;try{on?s.unpauseAnimations():s.pauseAnimations()}catch(e){}anim.textContent=on?'Pausar fluxo':'Animar fluxo';anim.setAttribute('aria-pressed',String(on))})}
})();

/* ============ 2. Do tubo ao coração (cora) ============ */
(()=>{if(!$('#coraSvg'))return;
  const seg={SV:['var(--amber-soft)','var(--amber)'],A:['var(--sky-soft)','var(--sky)'],V:['var(--eosin-soft)','var(--eosin)'],B:['var(--hema-soft)','var(--hema-2)'],TA:['var(--ok-soft)','var(--ok)']};
  const lab=(s,x,y,t,a,c)=>T(s,x,y,t,{fs:18,a:a||'middle',w:700,fill:c||'var(--ink)'});
  const lead=(s,x1,y1,x2,y2)=>E('line',{x1,y1,x2,y2,stroke:'var(--muted)','stroke-width':1.5},s);
  const heart=(s,st)=>{ // st: 4 cushions+primo ; 5 secundo ; 6 final
    E('path',{d:'M120 92 Q120 70 142 70 L458 70 Q480 70 480 92 L480 190 Q470 280 300 322 Q130 280 120 190 Z',fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':3},s);
    E('line',{x1:122,y1:170,x2:478,y2:170,stroke:'var(--eosin)','stroke-width':1.5,'stroke-dasharray':'5 6'},s);
    // coxins
    E('ellipse',{cx:300,cy:162,rx:34,ry:12,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':2},s);
    E('ellipse',{cx:300,cy:180,rx:34,ry:12,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':2},s);
    // septo primo
    if(st===4)E('line',{x1:300,y1:70,x2:300,y2:122,stroke:'var(--eosin)','stroke-width':4},s);
    else{E('line',{x1:300,y1:70,x2:300,y2:84,stroke:'var(--eosin)','stroke-width':4},s);E('line',{x1:300,y1:108,x2:300,y2:150,stroke:'var(--eosin)','stroke-width':4},s)}
    if(st>=5)E('line',{x1:284,y1:70,x2:284,y2:122,stroke:'var(--hema-2)','stroke-width':10,'stroke-linecap':'round'},s);
    // septo IV
    const top=st===4?240:200;E('path',{d:`M300 320 L300 ${top}`,stroke:'var(--hema)','stroke-width':12,'stroke-linecap':'round'},s);
    if(st===6)E('line',{x1:300,y1:194,x2:300,y2:202,stroke:'var(--amber)','stroke-width':8},s);
    // grandes vasos
    if(st>=5){E('path',{d:'M250 70 C250 40 350 40 360 12',fill:'none',stroke:'var(--sky)','stroke-width':12},s);
      E('path',{d:'M350 70 C350 40 250 40 240 12',fill:'none',stroke:'var(--paper)','stroke-width':18},s);
      E('path',{d:'M350 70 C350 40 250 40 240 12',fill:'none',stroke:'var(--eosin)','stroke-width':12},s)}
    if(st===6){for(const x of [210,390]){E('path',{d:`M${x-34} 170 L${x-14} 205 M${x+34} 170 L${x+14} 205`,stroke:'var(--ink)','stroke-width':3},s)}}
    T(s,210,130,'AD',{fs:22,w:800});T(s,390,130,'AE',{fs:22,w:800});T(s,215,260,st===6?'VD':'',{fs:22,w:800});T(s,385,260,st===6?'VE':'',{fs:22,w:800})};
  const steps=[
    ['Crescente cardiogênico','No disco embrionário, células do mesoderma esplâncnico se reúnem em forma de ferradura <b>cranial à placa neural</b>. O coração começa, portanto, fora e à frente do corpo; o dobramento cefálico o levará para ventral e para o tórax.'],
    ['Dois tubos endocárdicos se fundem','O mesoderma cardiogênico forma dois tubos endoteliais. O dobramento lateral os aproxima ventralmente ao intestino anterior e eles se fundem na linha média (~8–9 somitos). Endotélio → endocárdio; mesoderma em volta → miocárdio; geleia cardíaca entre os dois.'],
    ['Tubo cardíaco reto','Dilatações de caudal para cranial: <b>seio venoso, átrio, ventrículo, bulbo e tronco arterioso</b>. O tubo já bate (pinto ~29–33 h; mamíferos ~3ª semana), empurrando o sangue das veias para os arcos aórticos.'],
    ['Alça cardíaca','O tubo cresce mais que a cavidade pericárdica e se dobra: a parte bulboventricular vai para a direita e ventral; átrio e seio venoso sobem para dorsal e cranial. Surge a forma com <b>base</b> e <b>ápice</b>.'],
    ['Coxins, septo primo e septo interventricular','Os <b>coxins endocárdicos</b> dividem o canal AV em orifícios direito e esquerdo. O <b>septo primo</b> desce do teto deixando o <b>óstio primo</b>; o <b>septo interventricular muscular</b> sobe do ápice deixando o <b>forame interventricular</b>.'],
    ['Óstio secundo, septo secundo e septo espiral','O septo primo se funde aos coxins (fecha o óstio primo), mas abre o <b>óstio secundo</b> no alto. À direita cresce o <b>septo secundo</b>, grosso e incompleto, deixando o <b>forame oval</b>. Na saída, as cristas bulbares e troncais formam o <b>septo aorticopulmonar espiral</b>: aorta (vermelho) e tronco pulmonar (azul) se enrolam.'],
    ['Coração de quatro câmaras','A <b>parte membranosa</b> (amarelo) fecha o forame interventricular (cão: ~dia 32). Formam-se as valvas <b>tricúspide</b> e <b>mitral</b> (dos coxins, com cordas e papilares) e as semilunares. O forame oval continua aberto como válvula até o nascimento.']];
  stepper('cora',steps,(s,i)=>{
    if(i===0){E('ellipse',{cx:300,cy:180,rx:260,ry:140,fill:'var(--bone)',stroke:'var(--bone-2)','stroke-width':2},s);
      E('path',{d:'M270 120 Q300 100 330 120 L322 300 L278 300 Z',fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':2},s);
      E('path',{d:'M150 140 Q160 60 300 52 Q440 60 450 140 L420 140 Q410 85 300 82 Q190 85 180 140 Z',fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2.5},s);
      lab(s,300,230,'placa neural');lab(s,300,30,'crescente cardiogênico','middle','var(--eosin)');lab(s,90,330,'cranial ↑','start','var(--muted)')}
    else if(i===1){E('circle',{cx:300,cy:110,r:44,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':2},s);lab(s,300,116,'intestino');
      for(const x of [170,430]){E('circle',{cx:x,cy:240,r:40,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':3},s)}
      E('path',{d:'M220 240 L268 240',stroke:'var(--ink)','stroke-width':3,'marker-end':''},s);E('path',{d:'M380 240 L332 240',stroke:'var(--ink)','stroke-width':3},s);
      E('circle',{cx:300,cy:240,r:22,fill:'none',stroke:'var(--eosin)','stroke-width':2,'stroke-dasharray':'5 5'},s);
      lab(s,170,310,'tubo endocárdico');lab(s,430,310,'tubo endocárdico');lab(s,300,190,'fusão')}
    else if(i===2){const P=[['SV',30,110,'Seio venoso'],['A',140,110,'Átrio'],['V',250,130,'Ventrículo'],['B',390,100,'Bulbo'],['TA',500,90,'Tronco art.']];
      P.forEach(([k,x,w,t],j)=>{const h=k==='V'?96:70;E('rect',{x,y:175-h/2,width:w-(j<4?10:0)>100?w-10:w-10,height:h,rx:22,fill:seg[k][0],stroke:seg[k][1],'stroke-width':3},s);lab(s,x+(w-10)/2,j%2?250:110,t)});
      E('path',{d:'M50 300 L560 300',stroke:'var(--ink)','stroke-width':2,'marker-end':''},s);E('path',{d:'M548 292 L564 300 L548 308 Z',fill:'var(--ink)'},s);lab(s,300,330,'sentido do sangue','middle','var(--muted)')}
    else if(i===3){E('path',{d:'M420 20 L420 70 Q420 110 400 140 Q370 200 380 250 Q390 300 300 300 Q200 300 210 230 Q220 170 230 130 Q240 90 200 80 Q160 70 130 110',fill:'none',stroke:'var(--line)','stroke-width':34,'stroke-linecap':'round'},s);
      const blob=(k,cx,cy,rx,ry)=>E('ellipse',{cx,cy,rx,ry,fill:seg[k][0],stroke:seg[k][1],'stroke-width':3},s);
      blob('TA',420,50,24,32);blob('B',385,215,40,62);blob('V',260,260,62,52);blob('A',210,100,50,34);blob('SV',130,120,34,24);
      lab(s,455,55,'tronco arterioso','start');lab(s,435,225,'bulbo','start');lab(s,260,340,'ventrículo');lab(s,215,40,'átrio');lab(s,30,175,'seio venoso','start');
      lab(s,560,300,'ápice →','end','var(--muted)')}
    else{heart(s,i);
      if(i===4){lab(s,20,110,'septo primo','start');lead(s,120,104,298,100);lab(s,20,150,'óstio primo','start');lead(s,118,144,298,138);
        lab(s,580,200,'coxins','end');lead(s,486,195,336,172);lab(s,20,250,'septo IV','start');lead(s,100,256,294,270);lab(s,580,250,'forame IV','end');lead(s,486,246,304,222)}
      if(i===5){lab(s,20,100,'septo secundo','start');lead(s,140,96,278,96);lab(s,580,98,'óstio secundo','end');lead(s,466,94,304,96);lab(s,20,150,'forame oval','start');lead(s,128,144,284,140);
        lab(s,40,30,'tronco pulmonar','start','var(--sky)');lab(s,560,30,'aorta','end','var(--eosin)')}
      if(i===6){lab(s,20,150,'tricúspide','start');lead(s,110,156,180,180);lab(s,580,150,'mitral','end');lead(s,500,156,420,180);
        lab(s,580,240,'parte membranosa','end');lead(s,430,232,306,198);lab(s,20,100,'forame oval','start')}}
  });
})();

/* ============ 3. Arcos aórticos (arco) ============ */
(()=>{const s=$('#arcoSvg');if(!s)return;const out=$('#arcoOut');
  const Y={1:70,2:120,3:170,4:225,6:285},XR=150,XL=450,XC=300;
  // segmentos: [x1,y1,x2,y2]
  const S={
    A1R:[XC,70,XR,70],A1L:[XC,70,XL,70],A2R:[XC,120,XR,120],A2L:[XC,120,XL,120],A3R:[XC,170,XR,170],A3L:[XC,170,XL,170],
    A4R:[XC,225,XR,225],A4L:[XC,225,XL,225],A6Rp:[XC,285,225,285],A6Rd:[225,285,XR,285],A6Lp:[XC,285,375,285],A6Ld:[375,285,XL,285],
    DRt:[XR,50,XR,170],DLt:[XL,50,XL,170],DR34:[XR,170,XR,225],DL34:[XL,170,XL,225],DR46:[XR,225,XR,285],DL46:[XL,225,XL,285],
    DR6f:[XR,285,XR,345,XC,385],DL6f:[XL,285,XL,345,XC,385],Ddesc:[XC,385,XC,410],
    S13:[XC,70,XC,170],S34:[XC,170,XC,225],S46:[XC,225,XC,285],S6h:[XC,285,XC,330]};
  const col={car:'var(--sky)',ao:'var(--eosin)',sub:'var(--amber)',pul:'var(--hema-2)',da:'var(--ok)',n:'var(--ink)'};
  const base={A1R:0,A1L:0,A2R:0,A2L:0,DR34:0,DL34:0,A3R:'car',A3L:'car',DRt:'car',DLt:'car',S13:'car',S34:'ao',S46:'ao',S6h:'pul',A6Rp:'pul',A6Lp:'pul',Ddesc:'ao'};
  const MODES={
    emb:{seg:Object.fromEntries(Object.keys(S).map(k=>[k,'n'])),lab:[],
      t:'<b>Embrião.</b> Os arcos aparecem de cranial para caudal, ligando o saco aórtico (centro) às duas aortas dorsais, cada um dentro de um arco faríngeo. Nunca estão todos presentes ao mesmo tempo: quando o 4º e o 6º se formam, o 1º e o 2º já regrediram. O <b>5º</b> não se forma (ou é rudimentar) em mamíferos e aves. Escolha uma espécie para ver o que persiste.'},
    mam:{seg:Object.assign({},base,{A4L:'ao',A4R:'sub',DR46:'sub',DR6f:0,DL46:'ao',DL6f:'ao',A6Rd:0,A6Ld:'da'}),
      lab:[[140,175,'carótida','end'],[460,175,'carótida','start'],[460,230,'arco aórtico','start'],[140,230,'subclávia D','end'],[140,290,'a. pulmonar','end'],[460,290,'ducto art.','start']],
      t:'<b>Mamífero.</b> 3º par → <span style="color:var(--sky)"><b>carótidas</b></span>. 4º <b>esquerdo</b> → <span style="color:var(--eosin)"><b>arco da aorta</b></span>, que continua na aorta dorsal esquerda. 4º direito → início da <span style="color:var(--amber)"><b>subclávia direita</b></span>; a aorta dorsal direita caudal a ela regride. 6º par → <span style="color:var(--hema-2)"><b>artérias pulmonares</b></span>; só a parte distal <b>esquerda</b> persiste como <span style="color:var(--ok)"><b>ducto arterioso</b></span> (→ ligamento arterioso). Tracejado = regride. O esôfago passa à direita do arco aórtico, livre.'},
    ave:{seg:Object.assign({},base,{A4R:'ao',A4L:0,DR46:'ao',DR6f:'ao',DL46:0,DL6f:0,A6Rd:'da',A6Ld:'da'}),
      lab:[[140,175,'carótida','end'],[460,175,'carótida','start'],[140,230,'arco aórtico','end'],[140,290,'ducto D','end'],[460,290,'ducto E','start']],
      t:'<b>Ave.</b> Espelho do mamífero: o 4º arco <b>direito</b> forma o <span style="color:var(--eosin)"><b>arco da aorta</b></span>, e a aorta dorsal esquerda caudal regride. Os dois 6º arcos mantêm a parte distal: as aves têm <span style="color:var(--ok)"><b>dois ductos arteriosos</b></span>, que levam o sangue do tronco pulmonar à aorta até a respiração pulmonar começar (bicagem interna) e fecham após a eclosão.'},
    paad:{seg:Object.assign({},base,{A4R:'ao',A4L:'sub',DR46:'ao',DR6f:'ao',DL46:0,DL6f:'ao',A6Rd:0,A6Ld:'da'}),ring:true,
      lab:[[140,230,'arco aórtico','end'],[460,230,'subclávia E','start'],[460,290,'lig. art.','start']],
      t:'<b>Arco aórtico direito persistente (cão).</b> O 4º arco <b>direito</b> vira o arco da aorta, como na ave, mas o ducto arterioso continua do lado <b>esquerdo</b> (6º esquerdo). Aorta à direita + ligamento arterioso à esquerda + base do tronco pulmonar fecham um <b>anel</b> (contorno grosso) em volta do <b>esôfago</b> e da traqueia. Ao desmame, o alimento sólido para no anel: regurgitação e megaesôfago cranial ao coração. Correção: secção do ligamento arterioso.'}};
  const draw=k=>{clear(s);const m=MODES[k];
    T(s,XR,32,'direita',{fs:18,fill:'var(--muted)'});T(s,XL,32,'esquerda',{fs:18,fill:'var(--muted)'});
    if(m.ring)E('ellipse',{cx:XC,cy:255,rx:26,ry:20,fill:'var(--bone)',stroke:'var(--bone-2)','stroke-width':2},s);
    for(const id in S){const c=m.seg[id],p=S[id],d='M'+p[0]+' '+p[1]+' L'+p.slice(2).join(' ');
      if(c===0||c===undefined&&k!=='emb'){E('path',{d,fill:'none',stroke:'var(--muted)','stroke-width':3,'stroke-dasharray':'5 7',opacity:.55},s);continue}
      const ring=m.ring&&['A4R','DR46','DR6f','DL6f','A6Ld','S46','A6Lp'].includes(id);
      E('path',{d,fill:'none',stroke:col[c]||col.n,'stroke-width':ring?13:(k==='emb'?6:9),'stroke-linecap':'round','stroke-linejoin':'round'},s)}
    E('line',{x1:XC-12,y1:Y[4]+30,x2:XC+12,y2:Y[4]+30,stroke:'var(--muted)','stroke-width':2,'stroke-dasharray':'3 4'},s);
    if(k==='emb')T(s,XC+40,Y[4]+36,'5º?',{fs:18,a:'start',fill:'var(--muted)'});
    for(const n of [1,2,3,4,6])T(s,225,Y[n]-10,n+'º',{fs:18,w:800,fill:'var(--muted)'});
    E('circle',{cx:XC,cy:342,r:18,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2},s);
    T(s,XC+28,348,'coração',{fs:18,a:'start'});T(s,XC+12,405,'aorta descendente',{fs:18,a:'start'});
    if(m.ring)T(s,XC,262,'E',{fs:18,w:800,fill:'var(--bone-ink)'});
    m.lab.forEach(([x,y,t,a])=>T(s,x,y,t,{fs:18,a,w:700}));
    out.innerHTML=m.t};
  choices('#arcoBtns',draw);
})();
