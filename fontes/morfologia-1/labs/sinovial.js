/* Animação GSAP: flexão e extensão de uma articulação sinovial (cap. 21) */
const {$,reduce,E,T}=window.BIO;
const svg=$('#snvSvg');
if(svg&&window.gsap){
  const gsap=window.gsap,C='300 150';
  /* cavidade e líquido (atrás do côndilo) */
  E('circle',{cx:300,cy:150,r:72,fill:'var(--sky-soft)'},svg);
  /* cápsula: duas paredes (fibrosa + sinovial) que acompanham metade do giro */
  const cap=E('g',{},svg);
  E('path',{d:'M241 92 A84 84 0 0 0 232 205',fill:'none',stroke:'var(--eosin)','stroke-width':7,'stroke-linecap':'round'},cap);
  E('path',{d:'M359 92 A84 84 0 0 1 368 205',fill:'none',stroke:'var(--eosin)','stroke-width':7,'stroke-linecap':'round'},cap);
  E('path',{d:'M248 98 A76 76 0 0 0 240 200',fill:'none',stroke:'var(--hema)','stroke-width':3,'stroke-dasharray':'6 5'},cap);
  E('path',{d:'M352 98 A76 76 0 0 1 360 200',fill:'none',stroke:'var(--hema)','stroke-width':3,'stroke-dasharray':'6 5'},cap);
  /* gotas de líquido na cavidade */
  const drops=E('g',{},svg);
  for(let i=0;i<9;i++){const a=(25+i*16.25)*Math.PI/180;E('circle',{cx:(300+62*Math.cos(a)).toFixed(1),cy:(150+62*Math.sin(a)).toFixed(1),r:4.5,fill:'var(--sky)'},drops)}
  /* osso distal (gira) */
  const dist=E('g',{},svg);
  E('path',{d:'M216 170 L228.8 170 A74 74 0 0 0 371.2 170 L384 170 L384 240 L332 240 L332 350 L268 350 L268 240 L216 240 Z',fill:'var(--bone)',stroke:'var(--bone-ink)','stroke-width':2},dist);
  E('path',{d:'M232 172 A70 70 0 0 0 368 172',fill:'none',stroke:'var(--sky)','stroke-width':8},dist);
  /* osso proximal (fixo) com côndilo e cartilagem */
  E('rect',{x:266,y:-10,width:68,height:150,fill:'var(--bone)',stroke:'var(--bone-ink)','stroke-width':2},svg);
  E('circle',{cx:300,cy:150,r:47,fill:'var(--bone)',stroke:'var(--bone-ink)','stroke-width':2},svg);
  E('rect',{x:268,y:96,width:64,height:40,fill:'var(--bone)'},svg);
  const cartP=E('path',{d:'M248 150 A52 52 0 0 0 352 150',fill:'none',stroke:'var(--sky)','stroke-width':9},svg);
  /* "choro" da cartilagem: gotículas que saem e voltam na zona de carga */
  const weep=E('g',{},svg);
  const wp=[[-26,48],[-12,52],[2,53],[16,51],[30,46]];
  wp.forEach(p=>E('circle',{cx:300+p[0],cy:150+p[1],r:5,fill:'var(--eosin)'},weep));
  /* rótulos */
  const lab=E('g',{},svg);
  E('path',{d:'M110 66 L228 124',stroke:'var(--muted)','stroke-width':1.5,fill:'none'},lab);
  T(lab,20,60,'Cápsula',{a:'start',fs:20});
  E('path',{d:'M480 48 L352 156',stroke:'var(--muted)','stroke-width':1.5,fill:'none'},lab);
  T(lab,580,40,'Cartilagem articular',{a:'end',fs:20});
  E('path',{d:'M150 296 L246 196',stroke:'var(--muted)','stroke-width':1.5,fill:'none'},lab);
  T(lab,20,318,'Líquido sinovial',{a:'start',fs:20});
  const ang=T(svg,580,110,'180°',{a:'end',fs:30,w:800,fill:'var(--hema)'});
  const angObj={v:180};

  const tl=gsap.timeline({paused:true,defaults:{ease:'power2.inOut'}});
  tl.fromTo(lab,{opacity:0},{opacity:1,duration:.6},0)
    .fromTo(cartP,{opacity:.35},{opacity:1,duration:.5,ease:'power1.out'},.2)
    .addLabel('flexao',1)
    .fromTo(dist,{rotation:0,svgOrigin:C},{rotation:-65,svgOrigin:C,duration:1.6},'flexao')
    .fromTo(cap,{rotation:0,svgOrigin:C},{rotation:-32,svgOrigin:C,duration:1.6},'flexao')
    .fromTo(drops,{rotation:0,svgOrigin:C},{rotation:45,svgOrigin:C,duration:1.6},'flexao')
    .fromTo(angObj,{v:180},{v:115,duration:1.6,onUpdate:()=>{ang.textContent=Math.round(angObj.v)+'°'}},'flexao')
    .addLabel('carga',2.8)
    .fromTo(weep.children,{y:0,opacity:0},{y:12,opacity:1,duration:.7,stagger:.08,ease:'power1.out'},'carga')
    .addLabel('extensao',3.9)
    .to(dist,{rotation:0,svgOrigin:C,duration:1.6},'extensao')
    .to(cap,{rotation:0,svgOrigin:C,duration:1.6},'extensao')
    .to(drops,{rotation:0,svgOrigin:C,duration:1.6},'extensao')
    .to(angObj,{v:180,duration:1.6,onUpdate:()=>{ang.textContent=Math.round(angObj.v)+'°'}},'extensao')
    .to(weep.children,{y:-6,opacity:0,duration:.8,stagger:.06,ease:'power1.in'},'extensao+=.4')
    .addLabel('fim',5.6)
    .to(cartP,{opacity:1,duration:.3},'fim');

  const steps=[
    [0,'Repouso','O côndilo do osso proximal encaixa na cavidade do distal. As duas superfícies são recobertas por <b>cartilagem hialina</b> (azul) e separadas só por um filme de <b>líquido sinovial</b>. A <b>cápsula</b> (membrana fibrosa por fora, sinovial tracejada por dentro) fecha a cavidade.'],
    [1,'Flexão','O osso distal gira em torno do eixo da articulação e o ângulo <b>diminui</b>. A cápsula do lado da flexão afrouxa e forma pregas; a do lado oposto é esticada. O líquido é empurrado da zona comprimida para a zona aliviada.'],
    [2.8,'Carga e lubrificação','Na zona de contato, a cartilagem comprimida <b>expulsa água</b> (pontos vermelhos) para a superfície: o filme de líquido, a lubricina e o hialuronano mantêm as superfícies sem contato direto.'],
    [3.9,'Extensão','O ângulo <b>aumenta</b> de volta a 180°. A cartilagem aliviada <b>reabsorve líquido</b> novo, rico em oxigênio e glicose: é assim, por embebição, que o condrócito sem vasos se nutre.'],
    [5.6,'Resumo','Movimento alternado = bomba de nutrição da cartilagem. Imobilização longa empobrece a cartilagem; movimento controlado a mantém.']
  ];
  const out=$('#snvOut'),sc=$('#snvScrub'),bp=$('#snvPlay'),bz=$('#snvPause'),br=$('#snvReset');
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
