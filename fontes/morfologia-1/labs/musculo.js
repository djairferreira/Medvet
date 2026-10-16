/* Animação GSAP: ciclo das pontes cruzadas e encurtamento do sarcômero. */
const {$,E,T}=window.BIO;
const svg=$('#pcxSvg');
if(svg&&window.gsap){
  const g=window.gsap;
  E('rect',{x:0,y:0,width:600,height:340,fill:'var(--paper)'},svg);
  /* ---------- painel de cima: uma ponte cruzada ---------- */
  T(svg,20,30,'Filamento fino',{a:'start',fs:18,fill:'var(--muted)'});
  const actin=E('g',{},svg);
  for(let i=0;i<17;i++){E('circle',{cx:20+i*30,cy:78,r:15,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2},actin);}
  /* sítio de ligação da miosina (escuro) na actina sobre a cabeça */
  const site=E('circle',{cx:260,cy:78,r:9,fill:'var(--eosin)'},actin);
  const tropo=E('path',{d:'M0,80 Q75,62 150,80 T300,80 T450,80 T600,80',fill:'none',stroke:'var(--amber)','stroke-width':7,'stroke-linecap':'round'},actin);
  const tropoN=E('g',{},actin);
  E('circle',{cx:232,cy:60,r:9,fill:'var(--sky)'},tropoN);E('circle',{cx:246,cy:56,r:9,fill:'var(--sky)'},tropoN);E('circle',{cx:240,cy:70,r:9,fill:'var(--sky)'},tropoN);
  /* filamento grosso */
  E('rect',{x:20,y:166,width:560,height:22,rx:11,fill:'var(--hema-soft)',stroke:'var(--hema)','stroke-width':2},svg);
  T(svg,20,214,'Filamento grosso (miosina)',{a:'start',fs:18,fill:'var(--muted)'});
  T(svg,580,214,'linha M →',{a:'end',fs:18,fill:'var(--muted)'});
  /* cabeça de miosina: grupo externo (sobe/desce) e interno (gira) */
  const headY=E('g',{},svg),headR=E('g',{},headY);
  E('line',{x1:290,y1:170,x2:290,y2:128,stroke:'var(--hema)','stroke-width':8,'stroke-linecap':'round'},headR);
  E('ellipse',{cx:290,cy:114,rx:17,ry:22,fill:'var(--hema)'},headR);
  /* moléculas */
  const pill=(x,y,txt,col)=>{const p=E('g',{opacity:0},svg);E('rect',{x:x-28,y:y-15,width:56,height:28,rx:14,fill:col},p);T(p,x,y+6,txt,{fs:18,fill:'var(--paper)',w:800});return p};
  const ca=[pill(150,30,'Ca²⁺','var(--sky)'),pill(330,30,'Ca²⁺','var(--sky)')];
  const adp=pill(360,130,'ADP','var(--hema-2)'),pi=pill(360,98,'Pi','var(--hema-2)'),atp=pill(470,130,'ATP','var(--ok)');
  const arrow=E('path',{d:'M330,150 L400,150 M388,141 L402,150 L388,159',fill:'none',stroke:'var(--ok)','stroke-width':5,'stroke-linecap':'round',opacity:0},svg);
  /* ---------- painel de baixo: o sarcômero encurta ---------- */
  E('line',{x1:20,y1:236,x2:580,y2:236,stroke:'var(--line)','stroke-width':2},svg);
  const ys=[262,286,310];
  const L=E('g',{},svg),R=E('g',{},svg);
  E('line',{x1:80,y1:250,x2:80,y2:322,stroke:'var(--ink)','stroke-width':5},L);
  E('line',{x1:520,y1:250,x2:520,y2:322,stroke:'var(--ink)','stroke-width':5},R);
  ys.forEach(y=>{E('line',{x1:80,y1:y-6,x2:250,y2:y-6,stroke:'var(--eosin)','stroke-width':4},L);E('line',{x1:350,y1:y-6,x2:520,y2:y-6,stroke:'var(--eosin)','stroke-width':4},R);});
  ys.forEach(y=>{E('rect',{x:190,y:y-2,width:220,height:9,rx:4,fill:'var(--hema)'},svg);});
  E('line',{x1:300,y1:248,x2:300,y2:324,stroke:'var(--muted)','stroke-width':2,'stroke-dasharray':'4 4'},svg);
  T(L,80,336,'Z',{fs:18,w:800});T(R,520,336,'Z',{fs:18,w:800});T(svg,300,336,'M',{fs:18,w:800});
  const H=E('rect',{x:250,y:244,width:100,height:84,fill:'var(--sky)',opacity:.18},svg);

  const tl=g.timeline({paused:true});
  const SO='290 170';
  tl.set(headR,{rotation:-38,svgOrigin:SO},0).set(headY,{y:0},0).set(actin,{x:0},0)
    .fromTo(pi,{opacity:0},{opacity:1,duration:.3},0).fromTo(adp,{opacity:0},{opacity:1,duration:.3},0)
    /* 1. Ca2+ chega e a tropomiosina sai da frente */
    .fromTo(ca,{opacity:0,y:-20},{opacity:1,y:0,duration:.5,stagger:.12},1)
    .to(ca,{x:(i)=>i?130:84,y:28,duration:.6,ease:'power2.inOut'},1.6)
    .fromTo(tropo,{y:0},{y:-14,duration:.5},2.1).fromTo(tropoN,{y:0},{y:-10,duration:.5},2.1)
    /* 2. ligação: a cabeça encosta na actina */
    .fromTo(headY,{y:0},{y:-12,duration:.5,ease:'power2.out'},3)
    /* 3. golpe de força: Pi sai, cabeça gira, actina anda para a linha M */
    .to(pi,{opacity:0,x:40,duration:.4},4)
    .to(headR,{rotation:22,svgOrigin:SO,duration:.9,ease:'power2.inOut'},4.3)
    .to(actin,{x:40,duration:.9,ease:'power2.inOut'},4.3)
    .to(adp,{opacity:0,x:40,duration:.4},5.2)
    /* 4. ATP liga e solta a cabeça */
    .fromTo(atp,{opacity:0,x:60},{opacity:1,x:-110,duration:.6},6)
    .to(headY,{y:0,duration:.4},6.6)
    /* 5. hidrólise: reengatilha */
    .to(atp,{opacity:0,duration:.3},7.4)
    .to(headR,{rotation:-38,svgOrigin:SO,duration:.7,ease:'power2.inOut'},7.4)
    .fromTo(pi,{opacity:0,x:0},{opacity:1,x:0,duration:.3},7.8).fromTo(adp,{opacity:0,x:0},{opacity:1,x:0,duration:.3},7.8)
    /* 6. milhares de ciclos: o sarcômero encurta */
    .fromTo(arrow,{opacity:0},{opacity:1,duration:.3},8.6)
    .fromTo(L,{x:0},{x:46,duration:1.4,ease:'power1.inOut'},9).fromTo(R,{x:0},{x:-46,duration:1.4,ease:'power1.inOut'},9)
    .fromTo(H,{scaleX:1},{scaleX:.08,svgOrigin:'300 286',duration:1.4,ease:'power1.inOut'},9)
    .to({},{duration:.6},10.4);
  const steps=[[0,'<b>1. Repouso.</b> A cabeça de miosina já está “engatilhada” (com ADP + Pi), mas a <b>tropomiosina</b> (amarela) cobre o sítio de ligação da actina (ponto escuro). Sem Ca²⁺, nada acontece.'],
    [1,'<b>2. Chega o cálcio.</b> O retículo sarcoplasmático liberou Ca²⁺ (receptor de rianodina). O Ca²⁺ liga-se à <b>troponina C</b> (azul).'],
    [2.1,'<b>3. Sítio exposto.</b> A troponina muda de forma e arrasta a tropomiosina para o fundo do sulco: o sítio da actina fica livre.'],
    [3,'<b>4. Ponte cruzada.</b> A cabeça de miosina se prende à actina.'],
    [4,'<b>5. Golpe de força.</b> O Pi sai, a cabeça gira cerca de 45° e puxa o filamento fino em direção à <b>linha M</b> (≈10 nm). Depois sai o ADP.'],
    [6,'<b>6. ATP solta a cabeça.</b> Um novo ATP se liga à miosina e desfaz a ponte. Sem ATP a cabeça ficaria presa: é o <b>rigor mortis</b>.'],
    [7.4,'<b>7. Reengatilhar.</b> A miosina hidrolisa o ATP em ADP + Pi e volta à posição inicial, pronta para outro ciclo, agora um sítio adiante.'],
    [8.6,'<b>8. O sarcômero encurta.</b> Milhares de cabeças ciclando de forma assíncrona fazem os filamentos finos deslizarem: as <b>linhas Z se aproximam</b>, a <b>zona H</b> (azul) e as bandas I encurtam, e a banda A não muda.']];
  const out=$('#pcxOut'),rng=$('#pcxRange');let last=-1;
  const upd=()=>{const t=tl.time();let k=0;steps.forEach((s,i)=>{if(t>=s[0])k=i});if(k!==last&&out){out.innerHTML=steps[k][1];last=k}
    if(rng&&document.activeElement!==rng)rng.value=Math.round(tl.progress()*1000)};
  tl.eventCallback('onUpdate',upd);
  const pb=$('#pcxPlay'),pz=$('#pcxPause'),rs=$('#pcxReset');
  if(pb)pb.onclick=()=>{if(tl.progress()>=1)tl.progress(0);tl.play()};
  if(pz)pz.onclick=()=>tl.pause();
  if(rs)rs.onclick=()=>{tl.pause();tl.progress(0);upd()};
  if(rng)rng.oninput=()=>{tl.pause();tl.progress(rng.value/1000);upd()};
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){tl.progress(1);upd()}
  else{tl.progress(0);upd();
    if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){tl.play();io.disconnect()}},{threshold:.4});io.observe(svg)}}
}
