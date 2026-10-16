/* Animação GSAP: origem fixa, inserção móvel; bíceps (agonista) × tríceps (antagonista) na flexão do cotovelo. */
const {$,E,T}=window.BIO;
const svg=$('#alvSvg');
if(svg&&window.gsap){
  const g=window.gsap;
  E('rect',{x:0,y:0,width:600,height:360,fill:'var(--paper)'},svg);
  const EL={x:220,y:200},FL=150,TH0=70,TH1=-48;            /* cotovelo, comprimento do antebraço, ângulos (graus) */
  const OB={x:262,y:40},OT={x:184,y:44};                    /* origens: bíceps (tubérculo supraglenoidal) e tríceps */
  const IB={x:42,y:-13},IT={x:-26,y:0};                     /* inserções no referencial do antebraço */
  /* escápula e úmero fixos */
  const scap=E('path',{d:'M150,0 L292,0 L240,46 L200,46 Z',fill:'var(--bone-2)',stroke:'var(--ink)','stroke-width':2},svg);
  const scapHi=E('path',{d:'M150,0 L292,0 L240,46 L200,46 Z',fill:'var(--sky)',opacity:0},svg);
  E('rect',{x:208,y:34,width:24,height:172,rx:12,fill:'var(--bone-2)',stroke:'var(--ink)','stroke-width':2},svg);
  /* antebraço (gira no cotovelo) */
  const fore=E('g',{},svg);
  E('rect',{x:-34,y:-12,width:FL+34,height:24,rx:12,fill:'var(--bone-2)',stroke:'var(--ink)','stroke-width':2},fore);
  E('ellipse',{cx:FL+8,cy:0,rx:20,ry:14,fill:'var(--bone-2)',stroke:'var(--ink)','stroke-width':2},fore);
  /* músculo genérico desenhado no eixo x de 0 a 200 */
  const L0=200;
  const muscle=(col)=>{const m=E('g',{},svg);
    E('line',{x1:0,y1:0,x2:L0,y2:0,stroke:'var(--muted)','stroke-width':4,'stroke-linecap':'round'},m);
    E('ellipse',{cx:L0/2,cy:0,rx:70,ry:15,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2},m);
    const act=E('ellipse',{cx:L0/2,cy:0,rx:70,ry:15,fill:col,opacity:0},m);return [m,act]};
  const [tri,triA]=muscle('var(--sky)'),[bic,bicA]=muscle('var(--eosin)');
  E('circle',{cx:EL.x,cy:EL.y,r:7,fill:'var(--ink)'},svg);
  /* marcadores */
  const dotO=E('circle',{cx:OB.x,cy:OB.y,r:8,fill:'var(--amber)',opacity:0},svg);
  const lblO=T(svg,276,72,'Origem (fixa)',{a:'start',fs:18,fill:'var(--amber)',w:800});
  const insG=E('g',{opacity:0},svg);E('circle',{cx:0,cy:0,r:8,fill:'var(--ok)'},insG);T(insG,14,6,'Inserção (móvel)',{a:'start',fs:18,fill:'var(--ok)',w:800});
  const lev=E('g',{opacity:0},svg);
  T(lev,590,250,'Alavanca de 3ª classe',{a:'end',fs:18,w:800});
  T(lev,590,276,'F = fulcro (cotovelo)',{a:'end',fs:18,fill:'var(--muted)'});
  T(lev,590,300,'P = potência (inserção)',{a:'end',fs:18,fill:'var(--muted)'});
  T(lev,590,324,'R = resistência (pata)',{a:'end',fs:18,fill:'var(--muted)'});
  const tagB=T(svg,590,40,'Bíceps: agonista',{a:'end',fs:18,fill:'var(--eosin)',w:800});
  const tagT=T(svg,590,66,'Tríceps: antagonista',{a:'end',fs:18,fill:'var(--sky)',w:800});
  const tagF=T(svg,590,92,'Escápula: fixadores',{a:'end',fs:18,fill:'var(--muted)',w:800});
  const rad=d=>d*Math.PI/180;
  const P=(th,p)=>({x:EL.x+p.x*Math.cos(rad(th))-p.y*Math.sin(rad(th)),y:EL.y+p.x*Math.sin(rad(th))+p.y*Math.cos(rad(th))});
  const place=(m,o,i)=>{const dx=i.x-o.x,dy=i.y-o.y,d=Math.hypot(dx,dy),s=d/L0,a=Math.atan2(dy,dx)*180/Math.PI;
    m.setAttribute('transform',`translate(${o.x.toFixed(1)},${o.y.toFixed(1)}) rotate(${a.toFixed(2)}) scale(${s.toFixed(3)},${(1/Math.sqrt(s)).toFixed(3)})`)};
  const st={a:0};
  const draw=()=>{const th=TH0+(TH1-TH0)*st.a;
    fore.setAttribute('transform',`translate(${EL.x},${EL.y}) rotate(${th.toFixed(2)})`);
    const ib=P(th,IB);place(bic,OB,ib);place(tri,OT,P(th,IT));
    insG.setAttribute('transform',`translate(${ib.x.toFixed(1)},${ib.y.toFixed(1)})`)};
  draw();
  const tl=g.timeline({paused:true,onUpdate:()=>{}});
  tl.fromTo(dotO,{opacity:0},{opacity:1,duration:.4},0).fromTo(lblO,{opacity:0,x:12},{opacity:1,x:0,duration:.4},0.1)
    .fromTo(insG,{opacity:0},{opacity:1,duration:.4},0.6)
    .fromTo([tagB,tagT,tagF],{opacity:0,x:16},{opacity:1,x:0,duration:.35,stagger:.12},1.2)
    .fromTo(bicA,{opacity:0},{opacity:.85,duration:.4},2)
    .fromTo(st,{a:0},{a:1,duration:2.2,ease:'power2.inOut',onUpdate:draw},2.5)
    .fromTo(triA,{opacity:0},{opacity:.35,duration:.4},2.5)
    .fromTo(scapHi,{opacity:0},{opacity:.45,duration:.4},5.1)
    .fromTo(lev,{opacity:0,y:10},{opacity:1,y:0,duration:.5},6)
    .to({},{duration:.8},6.5);
  const steps=[[0,'<b>1. Origem.</b> O bíceps braquial nasce no <b>tubérculo supraglenoidal</b> da escápula: é o ponto <b>fixo</b> neste movimento.'],
    [0.6,'<b>2. Inserção.</b> O tendão distal se prende na <b>tuberosidade do rádio</b>, logo abaixo do cotovelo: é o ponto <b>móvel</b>.'],
    [1.2,'<b>3. Os papéis.</b> Na flexão do cotovelo, o bíceps é o <b>agonista</b>, o tríceps (atrás do braço, inserido no olécrano) é o <b>antagonista</b>, e os músculos da cintura escapular são <b>fixadores</b>.'],
    [2,'<b>4. O agonista contrai.</b> As pontes cruzadas encurtam os sarcômeros do ventre do bíceps, que engrossa (o volume se conserva).'],
    [2.5,'<b>5. A inserção vai até a origem.</b> O músculo só puxa: o rádio gira no cotovelo e a inserção se aproxima da origem; o ângulo diminui (<b>flexão</b>). O tríceps relaxa e <b>se alonga</b> (inibição recíproca).'],
    [5.1,'<b>6. Fixadores.</b> Sem a escápula estabilizada, o bíceps puxaria a escápula em vez do antebraço.'],
    [6,'<b>7. Alavanca de 3ª classe.</b> A potência (inserção) fica entre o fulcro e a resistência: pouca vantagem mecânica, mas um pequeno encurtamento produz um grande e rápido deslocamento da pata. Para estender, os papéis se invertem: o tríceps vira agonista.']];
  const out=$('#alvOut'),rng=$('#alvRange');let last=-1;
  const upd=()=>{const t=tl.time();let k=0;steps.forEach((s,i)=>{if(t>=s[0])k=i});if(k!==last&&out){out.innerHTML=steps[k][1];last=k}
    if(rng&&document.activeElement!==rng)rng.value=Math.round(tl.progress()*1000)};
  tl.eventCallback('onUpdate',upd);
  const pb=$('#alvPlay'),pz=$('#alvPause'),rs=$('#alvReset');
  if(pb)pb.onclick=()=>{if(tl.progress()>=1)tl.progress(0);tl.play()};
  if(pz)pz.onclick=()=>tl.pause();
  if(rs)rs.onclick=()=>{tl.pause();tl.progress(0);upd()};
  if(rng)rng.oninput=()=>{tl.pause();tl.progress(rng.value/1000);upd()};
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){tl.progress(1);upd()}
  else{tl.progress(0);upd();
    if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){tl.play();io.disconnect()}},{threshold:.4});io.observe(svg)}}
}
