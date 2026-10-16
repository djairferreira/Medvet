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
gsPlayer('maa',[
 [0,'<b>Leite retido nos alvéolos.</b> Antes do estímulo, só o leite das cisternas pode ser retirado; a maior parte está nos alvéolos.'],
 [0.6,'<b>Estímulo do teto.</b> Sucção do bezerro, preparo e ordenha ativam receptores do teto; o impulso sobe por nervos sensitivos até o hipotálamo.'],
 [2.0,'<b>Liberação de ocitocina.</b> A neuro-hipófise lança ocitocina no sangue; ela chega ao úbere em menos de 1 minuto.'],
 [3.4,'<b>Contração mioepitelial.</b> A ocitocina contrai as células mioepiteliais que abraçam cada alvéolo, espremendo o leite.'],
 [4.4,'<b>Descida do leite.</b> O leite desce pelos ductos até as cisternas da glândula e do teto. A janela de ação dura poucos minutos: ordenhe logo.'],
 [5.8,'<b>Inibição.</b> Medo e dor liberam adrenalina, que contrai vasos e bloqueia a ocitocina: manejo calmo dá mais leite.']
],(svg,tl)=>{
 const n=svg.querySelector('#maaNer'),L=n.getTotalLength();n.style.strokeDasharray=L;
 const alv=[...svg.querySelectorAll('#maaAlv circle')],ox=[...svg.querySelectorAll('#maaOx circle')],mk=[...svg.querySelectorAll('#maaMilk circle')];
 tl.fromTo('#maaSuc',{opacity:0,y:8},{opacity:1,y:0,duration:.3},0.6)
   .fromTo(n,{strokeDashoffset:L},{strokeDashoffset:0,duration:1.2,ease:'power1.inOut'},0.7)
   .fromTo('#maaNerT',{opacity:0},{opacity:1,duration:.3},1.2)
   .fromTo('#maaHip',{scale:1,transformOrigin:'50% 50%'},{scale:1.5,duration:.25,yoyo:true,repeat:1},1.9);
 ox.forEach((c,i)=>{const a=alv[i],dx=+a.getAttribute('cx')-128,dy=+a.getAttribute('cy')-100;
   tl.fromTo(c,{x:0,y:0,opacity:0},{opacity:1,duration:.15},2.0+i*.08)
     .fromTo(c,{x:0,y:0},{x:dx,y:dy,duration:1.1,ease:'power2.inOut',immediateRender:false},2.1+i*.08)
     .fromTo(c,{opacity:1},{opacity:0,duration:.2,immediateRender:false},3.4+i*.05)});
 tl.fromTo('#maaOxT',{opacity:0},{opacity:1,duration:.3},2.2)
   .fromTo(alv,{scale:1,transformOrigin:'50% 50%'},{scale:.72,duration:.35,stagger:.05,ease:'power2.in'},3.4)
   .fromTo(alv,{scale:.72},{scale:1,duration:.5,stagger:.05,ease:'power2.out',immediateRender:false},4.6);
 mk.forEach((c,i)=>{const dx=401-+c.getAttribute('cx'),dy=244-+c.getAttribute('cy');
   tl.fromTo(c,{x:0,y:0,opacity:1},{x:dx,y:dy,duration:.7,ease:'power2.in'},4.4+i*.07)
     .fromTo(c,{y:dy},{y:dy+66,duration:.5,ease:'power1.in',immediateRender:false},5.1+i*.07)});
 tl.fromTo('#maaCis',{scale:1,transformOrigin:'50% 50%'},{scale:1.15,duration:.3,yoyo:true,repeat:1},5.0)
   .fromTo(['#maaNer','#maaNerT','#maaOxT'],{opacity:1},{opacity:.3,duration:.4,immediateRender:false},5.8);
});
