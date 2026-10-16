/* Animação GSAP: folículo tireoidiano produzindo e liberando T3/T4. */
const {$,E,T}=window.BIO;
const svg=$('#folSvg');
if(svg&&window.gsap){
  const g=window.gsap;
  /* cenário: coloide em cima, células foliculares no meio, capilar embaixo */
  const scene=E('g',{},svg);
  E('rect',{x:20,y:14,width:560,height:118,rx:24,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2},scene);
  T(scene,40,46,'Coloide (lúmen do folículo)',{a:'start',fs:19,fill:'var(--eosin)'});
  [[30,190],[210,190],[390,180]].forEach(([x,w],i)=>{
    E('rect',{x,y:140,width:w-6,height:140,rx:14,fill:i===1?'var(--panel)':'var(--hema-soft)',stroke:'var(--ink)','stroke-width':2},scene);});
  E('ellipse',{cx:300,cy:250,rx:44,ry:22,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':2},scene);
  T(scene,120,218,'Célula',{fs:18,fill:'var(--muted)'});T(scene,120,240,'folicular',{fs:18,fill:'var(--muted)'});
  T(scene,480,218,'Apical ↑',{fs:18,fill:'var(--muted)'});T(scene,480,240,'Basal ↓',{fs:18,fill:'var(--muted)'});
  E('rect',{x:20,y:308,width:560,height:76,rx:30,fill:'var(--bad-soft)',stroke:'var(--bad)','stroke-width':2},scene);
  T(scene,40,374,'Capilar fenestrado',{a:'start',fs:19,fill:'var(--bad)'});
  [[90,340],[150,352],[520,336]].forEach(([x,y])=>E('ellipse',{cx:x,cy:y,rx:14,ry:8,fill:'var(--bad)',opacity:.5},scene));
  /* atores */
  const iod=[270,300,330].map(x=>{const a=E('g',{},svg);E('circle',{cx:x,cy:345,r:12,fill:'var(--sky)'},a);T(a,x,352,'I',{fs:18,fill:'var(--paper)',w:800});return a;});
  const tg=E('g',{},svg);E('rect',{x:252,y:196,width:96,height:34,rx:17,fill:'var(--amber)',stroke:'var(--ink)','stroke-width':1.5},tg);
  T(tg,300,220,'Tg',{fs:19,w:800,fill:'var(--ink)'});
  const tgT=T(svg,300,104,'T3·T4',{fs:18,w:800,fill:'var(--ink)'});
  const tsh=E('g',{},svg);E('rect',{x:410,y:330,width:76,height:32,rx:8,fill:'var(--eosin)'},tsh);T(tsh,448,353,'TSH',{fs:19,w:800,fill:'var(--paper)'});
  const drop=E('g',{},svg);E('circle',{cx:300,cy:96,r:24,fill:'var(--eosin)',opacity:.75},drop);
  const lyso=E('circle',{cx:350,cy:186,r:13,fill:'var(--ok)'},svg);
  const hor=[['T4',-50],['T4',0],['T3',50]].map(([s,dx])=>{const a=E('g',{},svg);E('circle',{cx:300+dx,cy:200,r:17,fill:'var(--ok)',stroke:'var(--ink)','stroke-width':1.2},a);T(a,300+dx,207,s,{fs:18,w:800,fill:'var(--paper)'});return a;});
  const tl=g.timeline({paused:true});
  tl.fromTo(scene,{opacity:0},{opacity:1,duration:.8},0)
    .fromTo(iod,{opacity:0,y:0},{opacity:1,y:0,duration:.3,stagger:.1},1)
    .to(iod,{y:-140,duration:1,ease:'power2.inOut',stagger:.12},1.3)
    .fromTo(tg,{opacity:0,y:0,scale:.5,transformOrigin:'50% 50%'},{opacity:1,y:0,scale:1,duration:.5,ease:'back.out(1.7)'},2.6)
    .to(tg,{y:-118,duration:1,ease:'power2.inOut'},3.1)
    .to(iod,{y:-232,x:(i)=>[-20,0,20][i],duration:.8,ease:'power1.inOut',stagger:.08},4.2)
    .to(iod,{opacity:0,scale:.3,transformOrigin:'50% 50%',duration:.3},5)
    .fromTo(tgT,{opacity:0},{opacity:1,duration:.4},5.1)
    .to(tg,{opacity:0,duration:.4},5.1)
    .fromTo(tsh,{opacity:0,y:0},{opacity:1,y:0,duration:.3},5.6)
    .to(tsh,{y:-46,duration:.7,ease:'power2.out'},5.8)
    .fromTo(drop,{opacity:0,y:0,scale:.4,transformOrigin:'50% 50%'},{opacity:1,y:0,scale:1,duration:.4},6.7)
    .to(tgT,{opacity:0,duration:.3},6.8)
    .to(drop,{y:96,duration:1,ease:'power2.inOut'},7)
    .fromTo(lyso,{opacity:0,scale:0,transformOrigin:'50% 50%'},{opacity:1,scale:1,duration:.4,ease:'back.out(2)'},7.6)
    .to(lyso,{x:-50,y:6,duration:.5},8)
    .to([drop,lyso],{opacity:0,duration:.3},8.5)
    .fromTo(hor,{opacity:0,y:0,scale:.4,transformOrigin:'50% 50%'},{opacity:1,y:0,scale:1,duration:.4,stagger:.08},8.6)
    .to(hor,{y:142,duration:1.1,ease:'power2.in',stagger:.12},9.1)
    .to(hor,{x:170,duration:1,ease:'none'},10.4)
    .to(tsh,{opacity:.35,duration:.4},10.4);
  const steps=[[0,'<b>O cenário.</b> Coloide no lúmen (em cima), células foliculares cúbicas (meio) e o capilar fenestrado do lado basal (embaixo).'],
    [1,'<b>1. Captação de iodeto.</b> O simportador Na⁺/I⁻ na membrana basal concentra o iodeto do sangue dentro da célula.'],
    [2.6,'<b>2. Tireoglobulina.</b> RER e Golgi produzem a tireoglobulina (Tg), exocitada pelo polo apical para o coloide.'],
    [4.2,'<b>3. Iodação.</b> Na borda apical, a peroxidase (TPO) liga o iodo às tirosinas da Tg; o acoplamento forma T4 e T3, que ficam guardados no coloide.'],
    [5.6,'<b>4. Sinal do TSH.</b> O TSH da adeno-hipófise chega pelo sangue e se liga ao receptor da membrana basal.'],
    [6.7,'<b>5. Endocitose.</b> A célula engole uma gota de coloide; o lisossomo se funde a ela e digere a tireoglobulina.'],
    [8.6,'<b>6. Liberação.</b> T4 (cerca de 90%) e T3 livres saem pela base para o capilar. Nos tecidos, o T4 é convertido no T3, mais ativo.']];
  const out=$('#folOut'),rng=$('#folRange');let last=-1;
  const upd=()=>{const t=tl.time();let k=0;steps.forEach((s,i)=>{if(t>=s[0])k=i});if(k!==last&&out){out.innerHTML=steps[k][1];last=k}
    if(rng&&document.activeElement!==rng)rng.value=Math.round(tl.progress()*1000)};
  tl.eventCallback('onUpdate',upd);
  const pb=$('#folPlay'),pz=$('#folPause'),rs=$('#folReset');
  if(pb)pb.onclick=()=>{if(tl.progress()>=1)tl.progress(0);tl.play()};
  if(pz)pz.onclick=()=>tl.pause();
  if(rs)rs.onclick=()=>{tl.pause();tl.progress(0);upd()};
  if(rng)rng.oninput=()=>{tl.pause();tl.progress(rng.value/1000);upd()};
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){tl.progress(1);upd()}
  else{tl.progress(0);upd();
    if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){tl.play();io.disconnect()}},{threshold:.4});io.observe(svg)}}
}
