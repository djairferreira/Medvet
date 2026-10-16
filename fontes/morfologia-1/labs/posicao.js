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
gsPlayer('poa',[
 [0,'<b>Estratificação, por fora.</b> A pele e a tela subcutânea envolvem todo o tronco.'],
 [1.0,'<b>Músculos e costelas.</b> A parede do tórax é feita de músculos e do esqueleto costal: mais camadas sobrepostas.'],
 [2.2,'<b>Paquímero dorsal.</b> A vértebra envolve o canal vertebral com a medula espinal: o tubo neural.'],
 [3.4,'<b>Paquímero ventral.</b> A cavidade torácica, forrada pela pleura (azul), abriga pulmões e coração: o tubo visceral.'],
 [4.8,'<b>Antimeria.</b> O plano mediano separa os antímeros direito e esquerdo. Por convenção, o corte é visto de caudal, e o lado direito do animal fica à esquerda da imagem. Note o coração desviado para a esquerda.'],
 [6.2,'<b>Metameria.</b> Este corte se repete a cada segmento torácico: uma vértebra, um par de costelas, um par de nervos espinhais.']
],(svg,tl)=>{
 const pop={transformOrigin:'50% 50%'};
 tl.fromTo('#poaSkin',{opacity:0,scale:1.15,...pop},{opacity:1,scale:1,duration:.8,ease:'power3.out'},0.1)
   .fromTo('#poaT5',{opacity:0},{opacity:1,duration:.3},0.6)
   .fromTo('#poaMus',{opacity:0,scale:1.12,...pop},{opacity:1,scale:1,duration:.8,ease:'power3.out'},1.0)
   .fromTo('#poaT6',{opacity:0},{opacity:1,duration:.3},1.4);
 svg.querySelectorAll('#poaRib path').forEach((p,i)=>{const L=p.getTotalLength();p.style.strokeDasharray=L;
   tl.fromTo(p,{strokeDashoffset:L},{strokeDashoffset:0,duration:.7,ease:'power2.out'},1.5+i*.15)});
 tl.fromTo('#poaVert',{opacity:0,y:-30},{opacity:1,y:0,duration:.6,ease:'back.out(1.6)'},2.2)
   .fromTo('#poaMed',{scale:0,...pop},{scale:1,duration:.5,ease:'back.out(2)'},2.7)
   .fromTo('#poaT1',{opacity:0},{opacity:1,duration:.3},2.8)
   .fromTo('#poaCav',{scale:0,opacity:0,...pop},{scale:1,opacity:1,duration:.7,ease:'power3.out'},3.4)
   .fromTo('#poaOrg ellipse',{scale:0,...pop},{scale:1,duration:.5,stagger:.1,ease:'back.out(1.7)'},3.8)
   .fromTo('#poaT2',{opacity:0},{opacity:1,duration:.3},4.1)
   .fromTo('#poaLine',{opacity:0,scaleY:0,transformOrigin:'50% 0%'},{opacity:1,scaleY:1,duration:.7,ease:'power2.out'},4.8)
   .fromTo(['#poaT3','#poaT3b','#poaT4','#poaT4b'],{opacity:0},{opacity:1,duration:.3,stagger:.08},5.3)
   .fromTo(['#poaT1','#poaT2','#poaT5','#poaT6'],{opacity:1},{opacity:.35,duration:.3,immediateRender:false},6.2)
   .fromTo(['#poaVert','#poaRib'],{scale:1,transformOrigin:'50% 50%'},{scale:1.06,duration:.3,yoyo:true,repeat:3,ease:'sine.inOut',immediateRender:false},6.3);
});
