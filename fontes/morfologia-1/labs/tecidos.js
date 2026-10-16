const {$}=window.BIO;
/* Player de animação GSAP: uma timeline pausada controlada pelo leitor (▶ ⏸ ↺ e scrub). */
function gsPlayer(pre,steps,build){
  const svg=$('#'+pre+'Svg');if(!svg||!window.gsap)return;
  const tl=window.gsap.timeline({paused:true});const tick=build(svg,tl);
  const out=$('#'+pre+'Out'),rng=$('#'+pre+'Rng'),play=$('#'+pre+'Play'),pause=$('#'+pre+'Pause'),rst=$('#'+pre+'Reset');
  let last=-1;
  const lab=()=>{const t=tl.time();if(typeof tick==='function')tick(t);let k=0;steps.forEach((s,i)=>{if(t>=s[0]-1e-3)k=i});
    if(out&&k!==last){last=k;out.innerHTML=`<span class="mono" style="color:var(--muted)">Etapa ${k+1} de ${steps.length}</span> · ${steps[k][1]}`}
    if(rng&&document.activeElement!==rng)rng.value=tl.progress().toFixed(3)};
  tl.eventCallback('onUpdate',lab);
  if(play)play.addEventListener('click',()=>{if(tl.progress()>=1)tl.restart();else tl.play()});
  if(pause)pause.addEventListener('click',()=>tl.pause());
  if(rst)rst.addEventListener('click',()=>{tl.pause(0);lab()});
  if(rng)rng.addEventListener('input',()=>{tl.pause();tl.progress(+rng.value);lab()});
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){tl.progress(1);lab();return}
  tl.progress(0);lab();
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){io.disconnect();if(tl.progress()===0)tl.play()}})},{threshold:.5});io.observe(svg)}
}
gsPlayer(pre,steps,build){
  const svg=$('#'+pre+'Svg');if(!svg||!window.gsap)return;
  const tl=window.gsap.timeline({paused:true});build(svg,tl);
  const out=$('#'+pre+'Out'),rng=$('#'+pre+'Rng'),play=$('#'+pre+'Play'),pause=$('#'+pre+'Pause'),rst=$('#'+pre+'Reset');
  let last=-1;
  const lab=()=>{const t=tl.time();let k=0;steps.forEach((s,i)=>{if(t>=s[0]-1e-3)k=i});
    if(out&&k!==last){last=k;out.innerHTML=`<span class="mono" style="color:var(--muted)">Etapa ${k+1} de ${steps.length}</span> · ${steps[k][1]}`}
    if(rng&&document.activeElement!==rng)rng.value=tl.progress().toFixed(3)};
  tl.eventCallback('onUpdate',lab);
  if(play)play.addEventListener('click',()=>{if(tl.progress()>=1)tl.restart();else tl.play()});
  if(pause)pause.addEventListener('click',()=>tl.pause());
  if(rst)rst.addEventListener('click',()=>{tl.pause(0);lab()});
  if(rng)rng.addEventListener('input',()=>{tl.pause();tl.progress(+rng.value);lab()});
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){tl.progress(1);lab();return}
  tl.progress(0);lab();
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){io.disconnect();if(tl.progress()===0)tl.play()}})},{threshold:.5});io.observe(svg)}
}
gsPlayer('teca',[
 [0,'<b>Simples pavimentoso.</b> Uma camada de células achatadas, núcleo achatado. Ideal para trocas: endotélio, mesotélio, alvéolos.'],
 [1.6,'<b>Simples cúbico.</b> Altura igual à largura, núcleo redondo e central: túbulos renais, folículos da tireoide, ductos.'],
 [3.2,'<b>Simples cilíndrico.</b> Células altas, núcleo ovoide: intestino, estômago, útero. Absorção e secreção.'],
 [4.8,'<b>Estratificado pavimentoso.</b> A camada basal produz células que sobem e se achatam. O nome vem da forma da camada <b>superficial</b>: epiderme, esôfago, vagina.'],
 [6.6,'<b>Regra de ouro.</b> Conte as camadas (simples ou estratificado) e olhe a forma das células da superfície. Todo epitélio repousa sobre a lâmina basal e é avascular.']
],(svg,tl)=>{
 const {E,T}=window.BIO,row=svg.querySelector('#tecaRow'),st=svg.querySelector('#tecaStrat'),lbl=svg.querySelector('#tecaLbl');
 const W=67.5,cells=[];
 for(let i=0;i<8;i++){const g=E('g',{},row);E('rect',{x:30+i*W,y:163,width:W,height:67,fill:'var(--hema-soft)',stroke:'var(--hema)','stroke-width':2,'vector-effect':'non-scaling-stroke'},g);
   E('ellipse',{cx:30+i*W+W/2,cy:196,rx:15,ry:15,fill:'var(--hema)'},g);cells.push(g)}
 const layers=[];
 [[118,45,0],[73,45,0],[60,13,1],[49,11,1]].forEach(([y,h,flat],L)=>{const g=E('g',{},st);
   for(let i=0;i<8;i++){const off=L%2?W/2:0;const x=30+i*W+off;const w=Math.min(W,570-x);if(w<8)continue;
     E('rect',{x,y,width:w,height:h,fill:flat?'var(--eosin-soft)':'var(--hema-soft)',stroke:flat?'var(--eosin)':'var(--hema)','stroke-width':2},g);
     if(w>30)E('ellipse',{cx:x+w/2,cy:y+h/2,rx:flat?18:12,ry:flat?Math.max(2,h/4):12,fill:flat?'var(--eosin)':'var(--hema)'},g)}
   if(L%2){const w=W/2;E('rect',{x:30,y,width:w,height:h,fill:flat?'var(--eosin-soft)':'var(--hema-soft)',stroke:flat?'var(--eosin)':'var(--hema)','stroke-width':2},g)}
   layers.push(g)});
 const g=window.gsap;
 const names=['Simples pavimentoso','Simples cúbico','Simples cilíndrico','Estratificado pavimentoso'];
 tl.fromTo(cells,{scaleY:.3,transformOrigin:'50% 100%'},{scaleY:.3,duration:.01},0)
   .fromTo(layers,{opacity:0,y:-40},{opacity:0,y:-40,duration:.01},0)
   
   .fromTo(cells,{scaleY:.3},{scaleY:1,duration:1,ease:'power2.inOut',stagger:.04,immediateRender:false},1.6)
   .fromTo(cells,{scaleY:1},{scaleY:2.1,duration:1,ease:'power2.inOut',stagger:.04,immediateRender:false},3.2)
   .fromTo(cells,{scaleY:2.1},{scaleY:1,duration:.8,ease:'power2.inOut',immediateRender:false},4.8);
 layers.forEach((l,i)=>tl.fromTo(l,{opacity:0,y:-40},{opacity:1,y:0,duration:.6,ease:'power2.out',immediateRender:false},5.3+i*.3));
 tl.fromTo(lbl,{scale:1,transformOrigin:'50% 50%'},{scale:1.08,duration:.3,yoyo:true,repeat:1},6.6);
 return t=>{const n=t<1.6?0:t<3.2?1:t<4.8?2:3;if(lbl.textContent!==names[n])lbl.textContent=names[n]};
});
