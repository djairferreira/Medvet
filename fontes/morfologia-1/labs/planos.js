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
gsPlayer('pla',[
 [0,'<b>O tronco como uma caixa.</b> As faces da caixa são os planos de delimitação. A frente da caixa é o lado <b>cranial</b>.'],
 [1.2,'<b>Plano sagital mediano.</b> Único, passa no meio do animal e o divide em <b>antímeros</b> direito e esquerdo.'],
 [2.6,'<b>Plano sagital (paramediano).</b> Qualquer plano paralelo ao mediano; existem infinitos. Separa uma parte medial de uma lateral.'],
 [4.0,'<b>Plano dorsal.</b> Paralelo ao dorso (na medicina humana, “coronal”); separa uma parte dorsal de uma ventral.'],
 [5.4,'<b>Plano transversal.</b> Perpendicular ao eixo longo do corpo ou do membro; corta em fatias, separando cranial de caudal.'],
 [6.8,'<b>Os três eixos.</b> Longitudinal (cranial–caudal), sagital ou dorsoventral (dorsal–ventral) e laterolateral (direito–esquerdo). Cada eixo é perpendicular a um plano.']
],(svg,tl)=>{
 const q=s=>svg.querySelector(s);
 const box=svg.querySelectorAll('#plaBox path');
 box.forEach(p=>{const L=p.getTotalLength();p.style.strokeDasharray=p.getAttribute('stroke-dasharray')?'6 6':L});
 const solid=[...box].filter(p=>!p.getAttribute('stroke-dasharray'));
 solid.forEach(p=>{const L=p.getTotalLength();tl.fromTo(p,{strokeDashoffset:L},{strokeDashoffset:0,duration:.8,ease:'power2.out'},0.1)});
 tl.fromTo([...box].filter(p=>p.getAttribute('stroke-dasharray')),{opacity:0},{opacity:.5,duration:.4},0.6);
 const planes=[['#plaMed','#plaTMed',{x:-20,y:14}],['#plaSag','#plaTSag',{x:-20,y:14}],['#plaDor','#plaTDor',{x:0,y:-40}],['#plaTra','#plaTTra',{x:60,y:0}]];
 planes.forEach(([p,t,o],i)=>{const t0=1.2+i*1.4;
   tl.fromTo(p,{opacity:0,x:o.x,y:o.y},{opacity:.6,x:0,y:0,duration:.8,ease:'power3.out'},t0)
     .fromTo(t,{opacity:0,y:8},{opacity:1,y:0,duration:.4},t0)
     .fromTo(t,{opacity:1},{opacity:0,duration:.3,immediateRender:false},t0+1.2)
     .fromTo(p,{opacity:.6},{opacity:.18,duration:.4,immediateRender:false},t0+1.2)});
 tl.fromTo('#plaTEix',{opacity:0},{opacity:1,duration:.4},6.8);
 svg.querySelectorAll('#plaAx path').forEach((p,i)=>{const L=p.getTotalLength();p.style.strokeDasharray=L;
   tl.fromTo(p,{strokeDashoffset:L},{strokeDashoffset:0,duration:.7,ease:'power2.out'},6.9+i*.35)});
 tl.fromTo('#plaAxT text',{opacity:0},{opacity:1,duration:.3,stagger:.35},7.4);
});
