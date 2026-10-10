const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;

/* ============ 1. Aparelho faríngeo (fa) ============ */
(()=>{const s=$('#faSvg');if(!s)return;const out=$('#faOut');
  const ARC=[['a1',36,100,'I · mandibular'],['a2',126,186,'II · hioide'],['a3',212,264,'III'],['a4',290,334,'IV'],['a6',360,396,'VI']];
  const BOL=[['b1',100,126],['b2',186,212],['b3',264,290],['b4',334,360]];
  const ex=y=>230+(y-24)*40/376, W=600, TIP=150;
  const R=(t,v)=>`<span class="fa-row"><b>${t}:</b> ${v}</span>`;
  const D={
    a1:['Arco I (mandibular)',R('Esqueleto','cartilagem de Meckel → martelo e bigorna; molde da mandíbula (osso intramembranoso ao redor). Proeminência maxilar: maxila, zigomático, parte do temporal')+R('Músculos','mastigadores (masseter, temporal, pterigóideos), milo-hióideo, digástrico rostral, tensor do tímpano, tensor do véu palatino')+R('Nervo','trigêmeo (V), ramos maxilar e mandibular')+R('Artéria','1º arco aórtico: regride (resta parte da a. maxilar)')+R('Falha','agnatia e otocefalia (cordeiros); braquignatia')],
    a2:['Arco II (hioide)',R('Esqueleto','cartilagem de Reichert → estribo, estilo-hioide, epi-hioide, cerato-hioide, parte do basi-hioide')+R('Músculos','expressão facial (mímicos, auriculares, bucinador), estapédio, estilo-hióideo, digástrico caudal')+R('Nervo','facial (VII)')+R('Artéria','2º arco aórtico: regride')+R('Detalhe','cresce caudalmente e cobre os sulcos 2 a 4 (seio cervical)')],
    a3:['Arco III',R('Esqueleto','tíreo-hioide e restante do basi-hioide')+R('Músculo','estilofaríngeo caudal')+R('Nervo','glossofaríngeo (IX)')+R('Artéria','carótida comum e início da carótida interna')+R('Língua','forma, com o IV, a eminência hipobranquial (raiz da língua)')],
    a4:['Arco IV',R('Esqueleto','cartilagem tireóidea (e cuneiformes) da laringe')+R('Músculos','constritores da faringe, cricotireóideo, levantador do véu palatino')+R('Nervo','vago (X), ramo laríngeo cranial')+R('Artéria','esquerdo: arco da aorta (mamíferos); direito: início da subclávia direita. Nas aves, o direito forma a aorta')+R('Na clínica','persistência do arco aórtico direito: anel vascular e megaesôfago no filhote')],
    a6:['Arco VI',R('Esqueleto','cricoide, aritenoides, corniculadas')+R('Músculos','intrínsecos da laringe (exceto cricotireóideo)')+R('Nervo','vago (X), laríngeo recorrente')+R('Artéria','artérias pulmonares; à esquerda, o ducto arterioso')+R('Na clínica','hemiplegia laríngea esquerda do equino; ducto arterioso persistente no cão')],
    b1:['1ª bolsa',R('Derivados','cavidade timpânica (orelha média) e tuba auditiva')+R('Equino','divertículo da tuba: bolsa gutural (timpanismo em potros, micose)')+R('Com o 1º sulco','membrana timpânica')],
    b2:['2ª bolsa',R('Derivados','fossa e epitélio da tonsila palatina; o tecido linfoide chega depois')+R('Espécies','o suíno não tem tonsila palatina típica (tem tonsila do véu palatino)')+R('Na clínica','restos da 2ª bolsa: fístula branquial abrindo na fossa tonsilar')],
    b3:['3ª bolsa',R('Dorsal','paratireoide III (externa)')+R('Ventral','timo')+R('Migração','o timo desce para o tórax e arrasta a paratireoide III, que termina caudal à IV')],
    b4:['4ª bolsa',R('Dorsal','paratireoide IV (interna), junto à tireoide')+R('Caudal','corpo ultimobranquial → células C (calcitonina) da tireoide')+R('Ventral','pequena contribuição ao timo em algumas espécies')],
    su:['Sulcos e membranas',R('1º sulco','meato acústico externo')+R('1ª membrana','membrana timpânica (ectoderma, mesênquima e endoderma)')+R('2º a 4º sulcos','cobertos pelo arco II → seio cervical, que desaparece')+R('Falha','cisto ou fístula branquial na face lateral do pescoço; no equino, cisto dentígero temporal')]};
  const els={};
  const lumen=()=>{let d=`M${ex(24)},24`;
    BOL.forEach(([,a,b])=>{d+=` L${ex(a).toFixed(1)},${a} L${TIP+13},${a} A13,13 0 0 0 ${TIP+13},${b} L${ex(b).toFixed(1)},${b}`});
    d+=` L${ex(400).toFixed(1)},400 L${(W-ex(400)).toFixed(1)},400`;
    BOL.slice().reverse().forEach(([,a,b])=>{d+=` L${(W-ex(b)).toFixed(1)},${b} L${W-TIP-13},${b} A13,13 0 0 0 ${W-TIP-13},${a} L${(W-ex(a)).toFixed(1)},${a}`});
    return d+` L${W-ex(24)},24 Z`};
  // arcos
  ARC.forEach(([k,a,b,nome])=>{const g=E('g',{'data-k':k},s);const m=(a+b)/2;
    els[k]=[E('rect',{x:56,y:a,width:ex(b)+14-56,height:b-a,rx:14,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2},g),
            E('rect',{x:W-ex(b)-14,y:a,width:ex(b)+14-56,height:b-a,rx:14,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2},g)];
    E('rect',{x:70,y:m-6,width:58,height:12,rx:6,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':2},g);
    E('circle',{cx:146,cy:m,r:7,fill:'var(--amber)'},g);
    E('circle',{cx:176,cy:m,r:10,fill:'var(--bad-soft)',stroke:'var(--bad)','stroke-width':2.5},g);
    T(g,455,m+7,nome,{fs:20})});
  // sulcos (fora)
  const sul=E('g',{},s);
  BOL.forEach(([,a,b])=>{const m=(a+b)/2;
    E('path',{d:`M56,${a+2} L118,${m} L56,${b-2}`,fill:'var(--paper)',stroke:'var(--muted)','stroke-width':2.5},sul);
    E('path',{d:`M${W-56},${a+2} L${W-118},${m} L${W-56},${b-2}`,fill:'var(--paper)',stroke:'var(--muted)','stroke-width':2.5},sul)});
  E('path',{d:lumen(),fill:'var(--ok-soft)',stroke:'var(--ok)','stroke-width':3},s);
  T(s,300,70,'faringe',{fs:20});T(s,300,424,'↓ esôfago e laringe',{fs:18,fill:'var(--muted)'});
  const mem=E('g',{},s);
  BOL.forEach(([,a,b])=>{const m=(a+b)/2;[[118,TIP],[W-TIP,W-118]].forEach(([x1,x2])=>E('rect',{x:x1,y:m-4,width:x2-x1,height:8,rx:3,fill:'var(--ink)'},mem))});
  BOL.forEach(([k,a,b],i)=>{const g=E('g',{'data-k':k},s);const m=(a+b)/2;
    els[k]=[E('rect',{x:TIP,y:a+2,width:ex(b)-TIP,height:b-a-4,rx:10,fill:'transparent'},g),E('rect',{x:W-ex(b),y:a+2,width:ex(b)-TIP,height:b-a-4,rx:10,fill:'transparent'},g)];
    T(g,W-TIP-14,m+6,(i+1)+'ª bolsa',{fs:18,a:'end'})});
  const btns=$('#faBtns');
  s.addEventListener('click',e=>{const g=e.target.closest('[data-k]');if(!g)return;const b=btns.querySelector(`[data-k="${g.dataset.k}"]`);if(b)b.click()});
  choices('#faBtns',k=>{
    for(const kk in els)els[kk].forEach(r=>{const arco=kk[0]==='a',on=kk===k;
      r.style.fill=arco?(on?'var(--amber-soft)':'var(--eosin-soft)'):(on?'var(--amber)':'transparent');
      r.style.stroke=arco?(on?'var(--amber)':'var(--eosin)'):'none';r.style.strokeWidth=on?4:2;if(!arco)r.style.opacity=on?.55:1});
    mem.style.opacity=k==='su'?1:0;sul.querySelectorAll('path').forEach(p=>{p.style.stroke=k==='su'?'var(--amber)':'var(--muted)';p.style.strokeWidth=k==='su'?4:2.5});
    const d=D[k];out.innerHTML=`<b>${d[0]}</b>${d[1]}`});
})();

/* ============ 2. Formação do diafragma (dia) ============ */
(()=>{const s=$('#diaSvg');if(!s)return;
  const CX=300,CY=190,R=140,Y0=205,dx=Math.sqrt(R*R-15*15),MX=26,my=CY-Math.sqrt(R*R-MX*MX);
  const L=(CX-dx).toFixed(1),Rr=(CX+dx).toFixed(1);
  const steps=[
    ['Septo transverso e canais abertos','O <b>septo transverso</b> (azul) já ocupa a parte ventral, entre o coração e o fígado, e é atravessado pela veia cava caudal (VCC). Dorsalmente, de cada lado do mesentério do esôfago, ficam os <b>canais pleuroperitoneais</b>, ainda abertos: por eles a cavidade pleural continua ligada à peritoneal, e é para dentro deles que os pulmões crescem.'],
    ['Pregas pleuroperitoneais crescem','Das paredes dorsolaterais, perto dos mesonefros, crescem as <b>pregas (membranas) pleuroperitoneais</b> (laranja). Elas avançam medialmente e estreitam os canais.'],
    ['O canal direito fecha antes','As pregas se fundem com o septo transverso e com o mesentério do esôfago. O canal <b>direito</b> fecha primeiro; o <b>esquerdo</b>, maior, fecha por último. Por isso o lado esquerdo é o sítio típico da hérnia diafragmática congênita dorsolateral.'],
    ['Mesentério do esôfago → pilares','O <b>mesentério dorsal do esôfago</b> (verde) forma a parte mediana dorsal do diafragma. Mioblastos que o invadem formam os <b>pilares</b>, que abraçam o esôfago (hiato esofágico) e passam dorsalmente à aorta (hiato aórtico).'],
    ['Músculo: parede do corpo e somitos cervicais','A expansão das cavidades pleurais escava a <b>parede do corpo</b>, que contribui com a faixa muscular periférica (vermelho). Os mioblastos da cúpula vêm de somitos <b>cervicais C5–C7</b>, de onde o septo começou: trazem o <b>nervo frênico</b>, que fica longo porque o diafragma desce depois até o limite entre tórax e abdome.'],
    ['Diafragma completo','Quatro componentes: <b>septo transverso</b> → centro tendíneo; <b>membranas pleuroperitoneais</b> → partes dorsolaterais; <b>mesentério do esôfago</b> → pilares; <b>parede do corpo</b> → periferia muscular. Inervação motora: frênico (C5–C7).'],
    ['Defeito 1: hérnia diafragmática congênita','O canal pleuroperitoneal (em geral o <b>esquerdo</b>) não fecha. Quando o intestino volta do cordão umbilical, alças, estômago ou baço sobem para o tórax e comprimem o pulmão, que fica <b>hipoplásico</b>. Rara nos domésticos; a maioria das hérnias diafragmáticas de cães e gatos é traumática.'],
    ['Defeito 2: hérnia peritônio-pericárdica','Falha na parte <b>ventral</b> do septo transverso: o peritônio fica aberto para o <b>saco pericárdico</b>, e fígado, vesícula, omento ou alças ficam junto ao coração. É a hérnia congênita mais comum em <b>cães e gatos</b> (Persa, Maine Coon, Weimaraner), muitas vezes com hérnia umbilical e defeitos do esterno.']];
  const arcPath=(x1,y1,x2,y2,large)=>`M${x1},${y1} A${R},${R} 0 ${large} 1 ${x2},${y2}`;
  const lbl=(x,y,a,b,anchor,lx,ly)=>{T(s,x,y,a,{fs:18,a:anchor});if(b)T(s,x,y+22,b,{fs:18,a:anchor});
    E('line',{x1:anchor==='start'?x+2:x-2,y1:y+(b?30:8),x2:lx,y2:ly,stroke:'var(--muted)','stroke-width':1.5},s)};
  const draw=(svg,i)=>{
    E('circle',{cx:CX,cy:CY,r:149,fill:'none',stroke:'var(--line)','stroke-width':18},s);
    const pp=i>=1?'var(--amber-soft)':'var(--panel)';
    E('path',{d:arcPath(L,Y0,CX-MX,my.toFixed(1),0)+` L${CX-MX},${Y0} Z`,fill:pp,stroke:i>=1?'var(--amber)':'var(--line)','stroke-width':2},s);
    E('path',{d:arcPath(CX+MX,my.toFixed(1),Rr,Y0,0)+` L${CX+MX},${Y0} Z`,fill:pp,stroke:i>=1?'var(--amber)':'var(--line)','stroke-width':2},s);
    E('path',{d:arcPath(Rr,Y0,L,Y0,0)+' Z',fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':2},s);
    E('rect',{x:CX-MX,y:my+2,width:2*MX,height:Y0-my-2,fill:i>=3?'var(--ok-soft)':'var(--panel)',stroke:i>=3?'var(--ok)':'var(--line)','stroke-width':2},s);
    if(i>=4)E('circle',{cx:CX,cy:CY,r:131,fill:'none',stroke:'var(--bad)','stroke-width':18,opacity:.45},s);
    // furos
    const hole=[[1,1],[.55,.55],[.22,0],[0,0],[0,0],[0,0],[.7,0],[0,0]][i];
    [[CX-76,hole[0]],[CX+76,hole[1]]].forEach(([x,f])=>{if(f<=0)return;
      E('ellipse',{cx:x,cy:140,rx:42*f,ry:52*f,fill:'var(--paper)',stroke:'var(--ink)','stroke-width':2,'stroke-dasharray':'6 4'},s);
      if(f>.5&&i<6)T(s,x,146,'canal',{fs:18})});
    if(i===1)[[CX-130,CX-108],[CX+130,CX+108]].forEach(([a,b])=>{E('line',{x1:a,y1:150,x2:b,y2:150,stroke:'var(--amber)','stroke-width':4},s);
      E('path',{d:`M${b},143 L${b+(b>a?10:-10)},150 L${b},157 Z`,fill:'var(--amber)'},s)});
    // estruturas
    E('circle',{cx:CX,cy:my+24,r:15,fill:'var(--bad-soft)',stroke:'var(--bad)','stroke-width':2},s);T(s,CX,my+30,'Ao',{fs:18});
    E('circle',{cx:CX,cy:150,r:17,fill:'var(--paper)',stroke:'var(--ink)','stroke-width':2},s);T(s,CX,156,'E',{fs:18});
    E('circle',{cx:CX+52,cy:250,r:15,fill:'var(--paper)',stroke:'var(--sky)','stroke-width':2},s);T(s,CX+52,256,'VC',{fs:18});
    T(s,CX,22,'dorsal',{fs:18,fill:'var(--muted)'});T(s,CX,366,'ventral',{fs:18,fill:'var(--muted)'});
    T(s,22,196,'E',{fs:20,fill:'var(--muted)'});T(s,578,196,'D',{fs:20,fill:'var(--muted)'});
    // hérnias
    if(i===6)[[CX-86,120],[CX-66,148],[CX-88,160]].forEach(([x,y])=>E('circle',{cx:x,cy:y,r:11,fill:'var(--hema-soft)',stroke:'var(--hema)','stroke-width':2},s));
    if(i===7){E('ellipse',{cx:CX-20,cy:300,rx:34,ry:20,fill:'var(--paper)',stroke:'var(--ink)','stroke-width':2,'stroke-dasharray':'6 4'},s);
      [[CX-36,298],[CX-8,302]].forEach(([x,y])=>E('circle',{cx:x,cy:y,r:10,fill:'var(--hema-soft)',stroke:'var(--hema)','stroke-width':2},s))}
    // rótulos laterais
    lbl(8,44,i>=1?'Prega pleuro-':'Canal pleuro-','peritoneal','start',CX-76,i>=1?110:95);
    lbl(592,44,'Mesentério','do esôfago','end',CX+MX-4,110);
    lbl(8,320,i===7?'Defeito':'Septo',i===7?'ventral':'transverso','start',i===7?CX-50:CX-60,i===7?300:260);
    if(i>=4)lbl(592,320,'Parede e','frênico C5–C7','end',CX+118,CY+70);
    if(i===6)lbl(8,250,'Alças','no tórax','start',CX-92,170);
  };
  stepper('dia',steps,draw);
})();
