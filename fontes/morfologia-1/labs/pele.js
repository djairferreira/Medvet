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

gsPlayer('pea',[
 [0,'<b>Hipoderme.</b> Conjuntivo frouxo com adipócitos: isolamento térmico, reserva e mobilidade da pele. É o espaço das injeções subcutâneas.'],
 [1.0,'<b>Derme.</b> Conjuntivo papilar (frouxo) e reticular (denso não modelado), com vasos e nervos. A epiderme, avascular, depende dela.'],
 [2.0,'<b>Epiderme, de baixo para cima.</b> Estrato basal (mitoses) → espinhoso → granuloso → córneo. As células nascem embaixo e morrem cheias de queratina na superfície.'],
 [3.6,'<b>Folículo piloso.</b> A epiderme se invagina na derme; no fundo, o bulbo envolve a papila dérmica, que traz os vasos.'],
 [4.8,'<b>O pelo cresce.</b> As células do bulbo se multiplicam e se queratinizam, empurrando o pelo para fora (fase anágena).'],
 [6.0,'<b>Unidade pilossebácea.</b> Glândula sebácea (holócrina) no folículo, músculo eretor do pelo (liso, arrepia a pelagem) e, à esquerda, uma glândula sudorípara enovelada.']
],(svg,tl)=>{
 const o={transformOrigin:'50% 100%'};
 tl.fromTo('#peaHip',{opacity:0,y:40},{opacity:1,y:0,duration:.6,ease:'power3.out'},0.1)
   .fromTo('#peaL1',{opacity:0},{opacity:1,duration:.3},0.5)
   .fromTo('#peaDer',{opacity:0,y:40},{opacity:1,y:0,duration:.6,ease:'power3.out'},1.0)
   .fromTo('#peaL2',{opacity:0},{opacity:1,duration:.3},1.4)
   .fromTo([...svg.querySelectorAll('#peaEpi rect')],{opacity:0,y:20},{opacity:1,y:0,duration:.4,stagger:.3,ease:'power2.out'},2.0)
   .fromTo('#peaL3',{opacity:0},{opacity:1,duration:.3},2.9)
   .fromTo('#peaFol',{scaleY:0,opacity:0,transformOrigin:'50% 0%'},{scaleY:1,opacity:1,duration:.9,ease:'power2.inOut'},3.6)
   .fromTo(['#peaBul','#peaPap'],{scale:0,transformOrigin:'50% 50%'},{scale:1,duration:.4,ease:'back.out(2)',stagger:.12},4.3)
   .fromTo('#peaHair',{scaleY:0,...o},{scaleY:1,duration:1.1,ease:'power1.inOut'},4.8)
   .fromTo('#peaL4',{opacity:0},{opacity:1,duration:.3},5.6)
   .fromTo('#peaSeb',{scale:0,transformOrigin:'0% 50%'},{scale:1,duration:.4,ease:'back.out(2)'},6.0);
 [['#peaMus',6.3],['#peaSwe',6.5]].forEach(([id,t0])=>{const p=svg.querySelector(id),L=p.getTotalLength();p.style.strokeDasharray=L;
   tl.fromTo(p,{strokeDashoffset:L,opacity:0},{strokeDashoffset:0,opacity:1,duration:.7,ease:'power2.out'},t0)});
 tl.fromTo('#peaHair',{rotation:0,transformOrigin:'50% 100%'},{rotation:6,duration:.4,ease:'power2.out',immediateRender:false},7.1);
});
