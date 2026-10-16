/* Animação GSAP: sinapse química (cap. 18) */
const {$,reduce,E,T}=window.BIO;
const svg=$('#sinSvg');
if(svg&&window.gsap){
  const gsap=window.gsap;
  /* célula pós-sináptica */
  E('rect',{x:345,y:40,width:245,height:250,rx:22,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2},svg);
  T(svg,470,276,'Pós-sináptica',{fs:20});
  /* axônio e botão terminal */
  E('path',{d:'M0 165 H150',stroke:'var(--line)','stroke-width':22,fill:'none','stroke-linecap':'round'},svg);
  E('ellipse',{cx:220,cy:165,rx:85,ry:98,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':2},svg);
  const imp=E('path',{d:'M0 165 H150',stroke:'var(--eosin)','stroke-width':10,fill:'none','stroke-linecap':'round','stroke-dasharray':'150','stroke-dashoffset':'150'},svg);
  T(svg,70,140,'Axônio',{fs:20});
  T(svg,220,296,'Botão terminal',{fs:20});
  T(svg,325,30,'Fenda',{fs:20,fill:'var(--muted)'});
  /* canais de Ca2+ na membrana e íons */
  [[180,70],[262,78]].forEach(p=>E('rect',{x:p[0]-7,y:p[1]-9,width:14,height:18,rx:4,fill:'var(--ok)'},svg));
  const ca=E('g',{},svg);
  [[170,40],[190,34],[252,46],[272,40],[230,30]].forEach(p=>E('circle',{cx:p[0],cy:p[1],r:6,fill:'var(--ok)'},ca));
  const caT=T(svg,110,48,'Ca²⁺',{fs:20,fill:'var(--ok)'});
  /* vesículas */
  const ves=[[180,130],[215,112],[170,180],[220,170],[200,222],[245,140]];
  const vg=ves.map(p=>{const g=E('g',{},svg);E('circle',{cx:p[0],cy:p[1],r:14,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':2},g);
    E('circle',{cx:p[0]-4,cy:p[1]-3,r:3,fill:'var(--amber)'},g);E('circle',{cx:p[0]+4,cy:p[1]+3,r:3,fill:'var(--amber)'},g);return g});
  const vy=[120,140,160,180,200,220];
  /* receptores */
  [115,145,185,215].forEach(y=>E('rect',{x:345,y:y-10,width:12,height:20,rx:3,fill:'var(--muted)'},svg));
  const rec=[115,145,185,215].map(y=>E('rect',{x:345,y:y-10,width:12,height:20,rx:3,fill:'var(--ok)',opacity:0},svg));
  /* neurotransmissor */
  const nt=E('g',{},svg);const ntEnd=[];
  for(let i=0;i<12;i++){const y0=122+i*8.5;E('circle',{cx:296,cy:y0,r:4.5,fill:'var(--amber)'},nt);ntEnd.push([40+(i%3)*4,[115,145,185,215][i%4]-y0])}
  /* resposta pós-sináptica */
  const post=E('path',{d:'M362 165 H580',stroke:'var(--eosin)','stroke-width':10,fill:'none','stroke-linecap':'round','stroke-dasharray':'218','stroke-dashoffset':'218'},svg);

  const tl=gsap.timeline({paused:true,defaults:{ease:'power2.inOut'}});
  tl.fromTo(imp,{strokeDashoffset:150},{strokeDashoffset:0,duration:1,ease:'none'},0)
    .addLabel('ca',1.1)
    .fromTo(ca.children,{y:0,opacity:0},{y:52,opacity:1,duration:.9,stagger:.08,ease:'power1.out'},'ca')
    .fromTo(caT,{opacity:0},{opacity:1,duration:.3},'ca')
    .addLabel('ves',2.2);
  vg.forEach((g,i)=>tl.fromTo(g,{x:0,y:0},{x:278-ves[i][0],y:vy[i]-ves[i][1],duration:.9},'ves+='+(i*.06)));
  tl.addLabel('lib',3.5)
    .to(vg,{opacity:.25,duration:.4},'lib')
    .fromTo(nt.children,{x:0,y:0,opacity:0},{x:i=>ntEnd[i][0],y:i=>ntEnd[i][1],opacity:1,duration:.9,stagger:.05,ease:'power1.out'},'lib')
    .addLabel('rec',4.8)
    .fromTo(rec,{opacity:0},{opacity:1,duration:.4,stagger:.08},'rec')
    .fromTo(post,{strokeDashoffset:218},{strokeDashoffset:0,duration:1,ease:'none'},'rec+=.3')
    .addLabel('fim',6.3)
    .to(nt.children,{opacity:0,duration:.6,stagger:.03},'fim')
    .to(rec,{opacity:0,duration:.4},'fim+=.4')
    .to(ca.children,{opacity:0,duration:.4},'fim')
    .to(post,{opacity:0,duration:.6},'fim+=.4');

  const steps=[
    [0,'Chega o potencial de ação','A despolarização percorre o <b>axônio</b> (vermelho) até o <b>botão terminal</b>.'],
    [1.1,'Canais de Ca²⁺ abrem','A despolarização abre <b>canais de Ca²⁺ dependentes de voltagem</b> (verde) e o cálcio entra no botão.'],
    [2.2,'Vesículas se deslocam','O Ca²⁺ ativa proteínas que levam as <b>vesículas sinápticas</b> (cheias de neurotransmissor) a se ancorar na membrana pré-sináptica.'],
    [3.5,'Exocitose','As vesículas se fundem com a membrana e liberam o <b>neurotransmissor</b> na <b>fenda sináptica</b> (cerca de 20 a 40 nm). Ele difunde até a membrana pós-sináptica.'],
    [4.8,'Receptores ativados','O neurotransmissor liga-se aos <b>receptores</b>. Abrem-se canais iônicos: entra Na⁺ e surge um <b>potencial pós-sináptico excitatório</b> (vermelho na célula seguinte). Se o transmissor for inibitório (GABA, glicina), entra Cl⁻ e a célula fica mais difícil de excitar.'],
    [6.3,'Fim do sinal','O transmissor é removido: <b>degradado</b> na fenda (a acetilcolinesterase quebra a acetilcolina) ou <b>recaptado</b> pelo botão e pelos astrócitos. Os receptores fecham e a sinapse está pronta para o próximo impulso.']
  ];
  const out=$('#sinOut'),sc=$('#sinScrub'),bp=$('#sinPlay'),bz=$('#sinPause'),br=$('#sinReset');
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
