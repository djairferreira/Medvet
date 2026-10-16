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

gsPlayer('tia',[
 [0,'<b>Antes de corar.</b> O corte desparafinado é quase transparente. O núcleo tem fosfatos do DNA (cargas <b>−</b>); as proteínas do citoplasma têm grupos amina (cargas <b>+</b>).'],
 [0.9,'<b>Hematoxilina (complexo catiônico, +).</b> Atraída pelas cargas negativas, liga-se aos fosfatos do DNA e do RNA.'],
 [2.3,'<b>Núcleo basófilo.</b> O núcleo e o nucléolo ficam roxo-azulados. Citoplasma rico em RER também ficaria arroxeado.'],
 [3.1,'<b>Eosina (ânion, −).</b> Procura as cargas positivas das proteínas espalhadas pelo citoplasma.'],
 [4.5,'<b>Citoplasma acidófilo.</b> Resultado da HE: núcleo roxo, citoplasma rosa. Lipídios e glicogênio, dissolvidos no processamento, ficariam brancos.']
],(svg,tl)=>{
 const g=window.gsap,q=s=>svg.querySelectorAll(s);
 const H=q('#tiaH circle'),Eo=q('#tiaE circle');
 const ht=[[270,154],[320,194],[290,199],[335,154]],et=[[180,134],[410,129],[190,219],[410,224],[300,89],[300,262]];
 tl.fromTo('#tiaHl',{opacity:0},{opacity:1,duration:.4},0.4)
   .fromTo('#tiaEl',{opacity:0},{opacity:1,duration:.4},0.4);
 H.forEach((c,i)=>{const cx=+c.getAttribute('cx'),cy=+c.getAttribute('cy');
   tl.fromTo(c,{x:0,y:0,opacity:1},{x:ht[i][0]-cx,y:ht[i][1]-cy,duration:1.1,ease:'power2.inOut'},0.9+i*0.08)});
 tl.fromTo('#tiaNucC',{opacity:0},{opacity:.85,duration:.6},2.2)
   .fromTo('#tiaNcl',{opacity:0},{opacity:1,duration:.4},2.4)
   .fromTo(H,{opacity:1},{opacity:0,duration:.4},2.5)
   .fromTo('#tiaNeg',{opacity:1},{opacity:0,duration:.4},2.5);
 Eo.forEach((c,i)=>{const cx=+c.getAttribute('cx'),cy=+c.getAttribute('cy');
   tl.fromTo(c,{x:0,y:0,opacity:1},{x:et[i][0]-cx,y:et[i][1]-cy,duration:1.1,ease:'power2.inOut'},3.1+i*0.06)});
 tl.fromTo('#tiaCyto',{opacity:0},{opacity:.45,duration:.7},4.4)
   .fromTo(Eo,{opacity:1},{opacity:0,duration:.4},4.6)
   .fromTo('#tiaPos',{opacity:1},{opacity:0,duration:.4},4.6)
   .fromTo('#tiaNuc',{scale:1},{scale:1.04,transformOrigin:'50% 50%',duration:.3,yoyo:true,repeat:1},4.9)
   .fromTo('#tiaCap',{opacity:0,y:10},{opacity:1,y:0,duration:.5},5.1);
});
