/* Animação GSAP: crescimento intersticial × aposicional da cartilagem (cap. 22) */
const {$,reduce,E,T}=window.BIO;
const svg=$('#crgSvg');
if(svg&&window.gsap){
  const gsap=window.gsap;
  E('path',{d:'M300 20 V330',stroke:'var(--line)','stroke-width':2,'stroke-dasharray':'6 6',fill:'none'},svg);
  T(svg,150,34,'Intersticial',{fs:22,w:800,fill:'var(--hema)'});
  T(svg,450,34,'Aposicional',{fs:22,w:800,fill:'var(--hema)'});
  T(svg,150,322,'de dentro para fora',{fs:18,fill:'var(--muted)'});
  T(svg,450,322,'pela superfície',{fs:18,fill:'var(--muted)'});
  const cell=(g,x,y,r)=>{const c=E('g',{},g);E('circle',{cx:x,cy:y,r:r+6,fill:'var(--paper)',stroke:'var(--sky)','stroke-width':1.5},c);E('circle',{cx:x,cy:y,r:r,fill:'var(--hema)'},c);return c};

  /* ---- painel esquerdo: bloco que cresce por dentro ---- */
  const L=E('g',{},svg);
  E('rect',{x:40,y:80,width:220,height:200,rx:20,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':2},L);
  [[72,112],[228,112],[72,248],[228,248]].forEach(p=>cell(L,p[0],p[1],7));
  const terr=E('ellipse',{cx:150,cy:180,rx:56,ry:52,fill:'none',stroke:'var(--hema)','stroke-width':3,opacity:0},L);
  const cs=[0,1,2,3].map(()=>cell(L,150,180,9));

  /* ---- painel direito: pericôndrio adiciona camadas ---- */
  const R=E('g',{},svg);
  E('rect',{x:340,y:140,width:220,height:150,rx:12,fill:'var(--sky-soft)'},R);
  [[380,190],[450,250],[520,195],[400,262],[505,258]].forEach(p=>cell(R,p[0],p[1],7));
  const nova=E('rect',{x:340,y:90,width:220,height:54,fill:'var(--sky-soft)'},R);
  const peri=E('g',{},R);
  E('rect',{x:340,y:100,width:220,height:20,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':1.5},peri);
  [352,392,432,472,512].forEach(x=>E('path',{d:`M${x} 110 h30`,stroke:'var(--eosin)','stroke-width':2,fill:'none'},peri));
  E('rect',{x:340,y:120,width:220,height:20,fill:'var(--paper)',stroke:'var(--eosin)','stroke-width':1},peri);
  const fus=[];
  [372,450,528].forEach(x=>{fus.push(E('ellipse',{cx:x,cy:130,rx:15,ry:4,fill:'var(--eosin)'},R))});
  const lac=[372,450,528].map(x=>E('circle',{cx:x,cy:118,r:13,fill:'var(--paper)',stroke:'var(--sky)','stroke-width':1.5,opacity:0},R));
  R.appendChild(peri);fus.forEach(f=>R.appendChild(f));
  const pLab=T(svg,450,88,'pericôndrio',{fs:18,fill:'var(--eosin)'});

  const tl=gsap.timeline({paused:true,defaults:{ease:'power2.inOut'}});
  /* estado inicial explícito */
  tl.fromTo(cs,{x:0,y:0,opacity:i=>i===0?1:0},{x:0,y:0,opacity:i=>i===0?1:0,duration:.01},0)
    .fromTo(nova,{scaleY:0,transformOrigin:'50% 100%'},{scaleY:0,transformOrigin:'50% 100%',duration:.01},0)
    /* 1ª divisão (esquerda) */
    .addLabel('d1',.4)
    .to(cs[1],{opacity:1,duration:.2},'d1')
    .to([cs[0],cs[2]],{y:-20,duration:.8},'d1')
    .to([cs[1],cs[3]],{y:20,duration:.8},'d1')
    /* 2ª divisão */
    .addLabel('d2',1.5)
    .to([cs[2],cs[3]],{opacity:1,duration:.2},'d2')
    .to([cs[0],cs[1]],{x:-20,duration:.8},'d2')
    .to([cs[2],cs[3]],{x:20,duration:.8},'d2')
    /* matriz nova separa as células e o bloco cresce */
    .addLabel('mat',2.6)
    .fromTo(terr,{opacity:0,scale:.6,transformOrigin:'50% 50%'},{opacity:.8,scale:1,transformOrigin:'50% 50%',duration:.8},'mat')
    .to([cs[0],cs[1]],{x:-30,duration:1},'mat')
    .to([cs[2],cs[3]],{x:30,duration:1},'mat')
    .to([cs[0],cs[2]],{y:-28,duration:1},'mat')
    .to([cs[1],cs[3]],{y:28,duration:1},'mat')
    .fromTo(L,{scale:1,svgOrigin:'150 180'},{scale:1.15,svgOrigin:'150 180',duration:1.2},'mat')
    /* aposicional (direita) */
    .addLabel('ap1',3.9)
    .fromTo(fus,{scaleY:1,transformOrigin:'50% 50%'},{scaleY:2.4,transformOrigin:'50% 50%',duration:.6,stagger:.1},'ap1')
    .addLabel('ap2',4.6)
    .to(peri,{y:-50,duration:1.2},'ap2')
    .fromTo(pLab,{opacity:1},{opacity:0,duration:.4},'ap2')
    .to(nova,{scaleY:1,duration:1.2},'ap2')
    .to(fus,{y:-12,scaleY:3,scaleX:.75,duration:1.2},'ap2')
    .addLabel('ap3',6)
    .to(lac,{opacity:1,duration:.5,stagger:.1},'ap3')
    .addLabel('fim',6.8);

  const steps=[
    [0,'Ponto de partida','À esquerda, um <b>condrócito</b> isolado numa lacuna, no meio da cartilagem. À direita, a superfície da peça, coberta pelo <b>pericôndrio</b>: camada fibrosa por fora e camada condrogênica (células fusiformes) por dentro.'],
    [.4,'Intersticial: a célula divide-se','O condrócito, ainda capaz de mitose, divide-se <b>dentro da própria lacuna</b>.'],
    [1.5,'Nasce o grupo isógeno','Nova divisão: 4 células vindas de uma só formam o <b>grupo isógeno</b>.'],
    [2.6,'A matriz empurra de dentro','Cada célula secreta matriz ao redor de si (a <b>matriz territorial</b>, mais basófila). A matriz nova afasta as células e a peça inteira <b>se expande por dentro</b>. Típico da cartilagem jovem e do <b>disco epifisário</b>.'],
    [3.9,'Aposicional: células do pericôndrio se diferenciam','As células da camada condrogênica deixam de ser fusiformes e tornam-se <b>condroblastos</b>, mais volumosos e basófilos.'],
    [4.6,'Nova camada na superfície','Os condroblastos secretam matriz <b>sob o pericôndrio</b>, que é empurrado para fora: a cartilagem ganha uma camada nova pela superfície, como os anéis de um tronco.'],
    [6,'Condroblastos viram condrócitos','Presos na matriz que fabricaram, os condroblastos ficam em <b>lacunas</b> e passam a ser condrócitos. Sem pericôndrio (cartilagem articular, fibrocartilagem) não há crescimento aposicional.']
  ];
  const out=$('#crgOut'),sc=$('#crgScrub'),bp=$('#crgPlay'),bz=$('#crgPause'),br=$('#crgReset');
  let last=-1;
  const upd=()=>{const t=tl.time();let k=0;steps.forEach((s,i)=>{if(t>=s[0]-1e-3)k=i});
    if(k!==last&&out){last=k;out.innerHTML=`<span class="mono" style="color:var(--muted)">${k+1} de ${steps.length}</span> · <b>${steps[k][1]}</b><br>${steps[k][2]}`}
    if(sc&&document.activeElement!==sc)sc.value=tl.progress()};
  tl.eventCallback('onUpdate',upd);
  if(bp)bp.addEventListener('click',()=>{if(tl.progress()>=1)tl.restart();else tl.play()});
  if(bz)bz.addEventListener('click',()=>tl.pause());
  if(br)br.addEventListener('click',()=>{tl.pause(0);upd()});
  if(sc)sc.addEventListener('input',()=>{tl.pause();tl.progress(+sc.value);upd()});
  if(reduce){tl.progress(1).pause();upd()}
  else{upd();if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();if(tl.progress()===0)tl.play()}},{threshold:.5});io.observe(svg)}}
}
