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
const exaSeq=[
 ['cb','Cabeça','<b>Cabeça.</b> Crânio (frontal, parietal, temporal) e face (nasal, orbitária, oral, bucal, mandibular, massetérica). Na cabeça, os termos são rostral e caudal.'],
 ['pc','Pescoço','<b>Pescoço.</b> Regiões dorsal (crina), lateral com o <b>sulco jugular</b> e ventral (traqueal). Local de coleta de sangue e de injeção intramuscular.'],
 ['to','Tórax','<b>Tronco: tórax.</b> Cernelha, dorso, costado, peito e região esternal. Apoiado nas vértebras torácicas, nas costelas e no esterno.'],
 ['ab','Abdome','<b>Tronco: abdome.</b> Lombo, flancos (fossa paralombar), ventre, regiões umbilical e inguinal. Quase sem esqueleto ventral: paredes musculares.'],
 ['pe','Pelve','<b>Tronco: pelve.</b> Garupa (sacro e ílio), tuberosidades coxal e isquiática, regiões perineal e anal.'],
 ['mt','Membros torácicos','<b>Membros torácicos.</b> Ombro, braço, antebraço, carpo, metacarpo e dedos; unem-se ao tronco só por músculos (sinsarcose).'],
 ['mp','Membros pélvicos','<b>Membros pélvicos.</b> Quadril, coxa, joelho (soldra), perna, tarso (jarrete), metatarso e dedos; unidos ao tronco pela articulação sacroilíaca.'],
 ['ca','Cauda','<b>Cauda.</b> Vértebras caudais; a face ventral da base da cauda é local de venopunção (veia coccígea) em bovinos.']];
gsPlayer('exa',[[0,'<b>Quadrúpede em posição anatômica.</b> O corpo se divide em cabeça, pescoço, tronco, membros e cauda.']].concat(exaSeq.map((x,i)=>[0.8+i*1.1,x[2]])).concat([[0.8+exaSeq.length*1.1,'<b>Mapa completo.</b> Cada parte se subdivide em regiões nomeadas pela base óssea ou articular: é o vocabulário da ficha clínica.']]),(svg,tl)=>{
 const all=svg.querySelectorAll('.exaR'),lbl=svg.querySelector('#exaLbl');
 tl.fromTo(all,{opacity:.15},{opacity:.15,duration:.01},0);
 exaSeq.forEach(([r],i)=>{const els=svg.querySelectorAll('.exaR[data-r="'+r+'"]'),t0=0.8+i*1.1;
   tl.fromTo(els,{opacity:.15,scale:1,transformOrigin:'50% 50%'},{opacity:1,scale:1.06,duration:.4,ease:'power2.out',immediateRender:false},t0)
     .fromTo(els,{scale:1.06},{scale:1,opacity:.55,duration:.4,ease:'power2.in',immediateRender:false},t0+.7)});
 const tf=0.8+exaSeq.length*1.1;
 tl.fromTo(all,{opacity:.55},{opacity:1,duration:.5,stagger:.04,immediateRender:false},tf);
 return t=>{let s='Posição anatômica';exaSeq.forEach((x,i)=>{if(t>=0.8+i*1.1-1e-3)s=x[1]});if(t>=tf-1e-3)s='Mapa completo';if(lbl.textContent!==s)lbl.textContent=s};
});
