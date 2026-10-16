/* Animação GSAP: regeneração de uma fibra esquelética por células satélites. */
const {$,E,T}=window.BIO;
const svg=$('#regSvg');
if(svg&&window.gsap){
  const g=window.gsap;
  E('rect',{x:0,y:0,width:600,height:300,fill:'var(--paper)'},svg);
  const Y0=110,H=80;
  const lam=E('rect',{x:30,y:Y0-8,width:540,height:H+16,rx:14,fill:'none',stroke:'var(--muted)','stroke-width':2.5,'stroke-dasharray':'8 6'},svg);
  T(svg,300,40,'Lâmina basal',{fs:18,fill:'var(--muted)',w:800});
  E('line',{x1:300,y1:48,x2:300,y2:Y0-10,stroke:'var(--muted)','stroke-width':2},svg);
  const seg=(x,w,p)=>{const s=E('g',{},p||svg);E('rect',{x,y:Y0,width:w,height:H,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2},s);
    for(let xx=x+8;xx<x+w;xx+=12)E('line',{x1:xx,y1:Y0+4,x2:xx,y2:Y0+H-4,stroke:'var(--eosin)','stroke-width':2,opacity:.45},s);return s};
  const nucE=(cx,cy,p,col)=>E('ellipse',{cx,cy,rx:15,ry:6,fill:col||'var(--hema)'},p);
  /* segmentos sadios com núcleos periféricos */
  const left=seg(40,180),right=seg(380,180);
  [70,130,190].forEach(x=>{nucE(x,Y0+8,left);nucE(x+30,Y0+H-8,left)});
  [410,470,530].forEach(x=>{nucE(x,Y0+8,right);nucE(x-30,Y0+H-8,right)});
  /* segmento do meio: sadio e versão necrótica */
  const mid=seg(220,160);nucE(260,Y0+8,mid);nucE(330,Y0+H-8,mid);
  const nec=E('g',{opacity:0},svg);
  [[232,120,26,16],[268,150,30,14],[300,126,22,18],[330,160,28,14],[356,132,20,16],[250,170,18,10]].forEach(r=>E('rect',{x:r[0],y:r[1],width:r[2],height:r[3],rx:5,fill:'var(--eosin)',opacity:.55},nec));
  /* células satélites */
  const sat=[E('ellipse',{cx:250,cy:Y0+3,rx:13,ry:6,fill:'var(--ok)'},svg),E('ellipse',{cx:350,cy:Y0+H-3,rx:13,ry:6,fill:'var(--ok)'},svg)];
  const satL=E('g',{},svg);T(satL,160,264,'Célula satélite',{fs:18,fill:'var(--ok)',w:800});E('line',{x1:200,y1:250,x2:345,y2:Y0+H+2,stroke:'var(--ok)','stroke-width':2},satL);
  /* macrófagos */
  const mac=[[255,140],[300,150],[345,140]].map(([x,y])=>{const m=E('g',{},svg);E('circle',{cx:x,cy:y,r:15,fill:'var(--amber)'},m);E('circle',{cx:x+4,cy:y-2,r:6,fill:'var(--hema-2)'},m);return m});
  /* mioblastos (filhos das satélites) */
  const myo=[[240,128],[270,168],[300,128],[330,168],[360,128],[285,148],[315,148]].map(([x,y])=>E('ellipse',{cx:x,cy:y,rx:13,ry:7,fill:'var(--ok)'},svg));
  /* miotubo novo */
  const tube=E('g',{},svg);
  E('rect',{x:220,y:Y0+6,width:160,height:H-12,rx:10,fill:'var(--eosin-soft)',stroke:'var(--ok)','stroke-width':2},tube);
  const cnuc=[245,275,305,335,360].map(x=>nucE(x,Y0+H/2,tube,'var(--hema)'));
  const stri=E('g',{},tube);for(let xx=228;xx<376;xx+=12)E('line',{x1:xx,y1:Y0+10,x2:xx,y2:Y0+H-10,stroke:'var(--eosin)','stroke-width':2,opacity:.45},stri);
  const tl=g.timeline({paused:true});
  tl.set(satL,{opacity:1},0).set(tube,{opacity:0},0).set(stri,{opacity:0},0).set(mac,{opacity:0},0).set(myo,{opacity:0},0)
    /* 1. lesão */
    .fromTo(mid,{opacity:1},{opacity:0,duration:.8},1).fromTo(nec,{opacity:0},{opacity:1,duration:.8},1).to(satL,{opacity:0,duration:.3},1)
    /* 2. macrófagos limpam */
    .fromTo(mac,{opacity:0,y:120},{opacity:1,y:0,duration:.7,stagger:.12,ease:'power2.out'},2.2)
    .to(nec,{opacity:0,duration:.8},3.2).to(mac,{opacity:0,y:120,duration:.6,stagger:.1,ease:'power2.in'},4)
    /* 3. satélites ativam e se dividem */
    .to(sat,{scale:1.5,transformOrigin:'50% 50%',duration:.4,yoyo:true,repeat:1},5)
    .fromTo(myo,{opacity:0,scale:.3,transformOrigin:'50% 50%'},{opacity:1,scale:1,duration:.4,stagger:.1},5.6)
    .to(sat,{opacity:0,duration:.3},5.6)
    /* 4. fusão em miotubo com núcleos centrais */
    .to(myo,{x:(i,el)=>300-(+el.getAttribute('cx')),y:(i,el)=>Y0+H/2-(+el.getAttribute('cy')),opacity:0,duration:.8,ease:'power2.in'},6.8)
    .fromTo(tube,{opacity:0,scaleX:.2,transformOrigin:'50% 50%'},{opacity:1,scaleX:1,duration:.8,ease:'power2.out'},7.2)
    /* 5. maturação: estrias aparecem e núcleos migram para a periferia */
    .fromTo(stri,{opacity:0},{opacity:1,duration:.6},8.6)
    .to(cnuc,{y:(i)=>i%2?H/2-8:-(H/2-8),duration:.8,stagger:.06,ease:'power2.inOut'},8.8)
    .to({},{duration:.6},9.9);
  const steps=[[0,'<b>1. Fibra normal.</b> Núcleos achatados na periferia; as <b>células satélites</b> (verdes) ficam quiescentes entre a lâmina basal e o sarcolema.'],
    [1,'<b>2. Lesão.</b> Um segmento da fibra necrosa (esforço, falta de selênio e vitamina E, trauma, toxina). A <b>lâmina basal</b> continua de pé: é o molde do reparo.'],
    [2.2,'<b>3. Fagocitose.</b> Macrófagos entram e removem os restos de sarcoplasma em 2 a 3 dias.'],
    [5,'<b>4. Ativação.</b> As células satélites saem da quiescência e sofrem <b>mitoses</b>, gerando mioblastos.'],
    [6.8,'<b>5. Fusão.</b> Os mioblastos se fundem num <b>miotubo</b> com núcleos <b>centrais</b> em fila: é o sinal de regeneração visto na lâmina.'],
    [8.6,'<b>6. Maturação.</b> Surgem as miofibrilas e as estrias, e os núcleos migram para a periferia. Se a lâmina basal ou a irrigação tivessem sido destruídas, o espaço seria preenchido por <b>cicatriz</b> de conjuntivo.']];
  const out=$('#regOut'),rng=$('#regRange');let last=-1;
  const upd=()=>{const t=tl.time();let k=0;steps.forEach((s,i)=>{if(t>=s[0])k=i});if(k!==last&&out){out.innerHTML=steps[k][1];last=k}
    if(rng&&document.activeElement!==rng)rng.value=Math.round(tl.progress()*1000)};
  tl.eventCallback('onUpdate',upd);
  const pb=$('#regPlay'),pz=$('#regPause'),rs=$('#regReset');
  if(pb)pb.onclick=()=>{if(tl.progress()>=1)tl.progress(0);tl.play()};
  if(pz)pz.onclick=()=>tl.pause();
  if(rs)rs.onclick=()=>{tl.pause();tl.progress(0);upd()};
  if(rng)rng.oninput=()=>{tl.pause();tl.progress(rng.value/1000);upd()};
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){tl.progress(1);upd()}
  else{tl.progress(0);upd();
    if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){tl.play();io.disconnect()}},{threshold:.4});io.observe(svg)}}
}
