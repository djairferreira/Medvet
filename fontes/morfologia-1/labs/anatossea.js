/* Animação GSAP: organização interna do osso longo (compacto, trabéculas, medula). */
const {$,E,T}=window.BIO;
const svg=$('#trabSvg');
if(svg&&window.gsap){
  const g=window.gsap;
  const G=E('g',{transform:'translate(30,50)'},svg);
  /* contorno de um osso longo vertical (fêmur simplificado) */
  const outline='M120,40 Q200,0 280,40 Q292,90 248,140 L240,270 Q292,320 280,370 Q200,410 120,370 Q108,320 160,270 L152,140 Q108,90 120,40 Z';
  const bg=E('path',{d:outline,fill:'var(--panel)',stroke:'none'},G);
  /* medula: vermelha (epífises e canal) e amarela (canal no adulto) */
  const redEpi=[E('path',{d:'M132,48 Q200,14 268,48 Q276,90 236,130 L164,130 Q124,90 132,48 Z',fill:'var(--bad)',opacity:0},G),
    E('path',{d:'M132,362 Q200,396 268,362 Q276,320 236,280 L164,280 Q124,320 132,362 Z',fill:'var(--bad)',opacity:0},G)];
  const redCanal=E('rect',{x:176,y:130,width:48,height:150,rx:10,fill:'var(--bad)',opacity:0},G);
  const yelCanal=E('rect',{x:176,y:130,width:48,height:150,rx:10,fill:'var(--amber)',opacity:0},G);
  /* córtex compacto da diáfise */
  const cortex=[E('path',{d:'M152,120 L176,124 L176,286 L160,290 Z',fill:'var(--bone-2)',stroke:'var(--ink)','stroke-width':1.5},G),
    E('path',{d:'M248,120 L224,124 L224,286 L240,290 Z',fill:'var(--bone-2)',stroke:'var(--ink)','stroke-width':1.5},G)];
  /* trabéculas: compressão (leque vertical) e tração (arcos), nas duas epífises */
  const comp=[],tens=[];
  const mir=d=>d.replace(/(\d+),(\d+)/g,(m,x,y)=>x+','+(410-y));
  ['M140,52 Q160,95 160,135','M165,34 Q178,90 172,135','M200,28 L200,128','M235,34 Q222,90 228,135','M260,52 Q240,95 240,135'].forEach(d=>{
    comp.push(E('path',{d,fill:'none',stroke:'var(--amber)','stroke-width':4,'stroke-linecap':'round'},G));
    comp.push(E('path',{d:mir(d),fill:'none',stroke:'var(--amber)','stroke-width':4,'stroke-linecap':'round'},G));});
  ['M128,70 Q200,40 272,70','M138,96 Q200,66 262,96','M152,120 Q200,96 248,120'].forEach(d=>{
    tens.push(E('path',{d,fill:'none',stroke:'var(--sky)','stroke-width':4,'stroke-linecap':'round'},G));
    tens.push(E('path',{d:mir(d),fill:'none',stroke:'var(--sky)','stroke-width':4,'stroke-linecap':'round'},G));});
  const line=E('path',{d:outline,fill:'none',stroke:'var(--ink)','stroke-width':3,'stroke-linejoin':'round'},G);
  /* setas de carga */
  const load=E('g',{opacity:0},G);
  [170,200,230].forEach(x=>{E('path',{d:`M${x},-34 L${x},-6 M${x-7},-14 L${x},-4 L${x+7},-14`,fill:'none',stroke:'var(--eosin)','stroke-width':4,'stroke-linecap':'round'},load);});
  /* legenda */
  const L=E('g',{},svg),items=[['var(--bone-2)','Osso compacto'],['var(--eosin)','Carga do peso'],['var(--amber)','Trab. de compressão'],['var(--sky)','Trab. de tração'],['var(--bad)','Medula vermelha'],['var(--amber)','Medula amarela']];
  const leg=items.map((it,i)=>{const gg=E('g',{opacity:0},L);E('rect',{x:338,y:100+i*52,width:24,height:24,rx:5,fill:it[0],stroke:'var(--ink)','stroke-width':1},gg);
    T(gg,372,120+i*52,it[1],{a:'start',fs:19});return gg;});
  const tagE=T(svg,140,110,'Epífise',{fs:18,fill:'var(--muted)',a:'end'}),tagD=T(svg,150,255,'Diáfise',{fs:18,fill:'var(--muted)',a:'end'});
  /* preparar traço (medido) */
  const dash=p=>{const n=p.getTotalLength()+6;p.style.strokeDasharray=n+' '+(n+40);p.style.strokeDashoffset=n;return n};
  const nl=dash(line);[...comp,...tens].forEach(dash);
  const tl=g.timeline({paused:true});
  tl.addLabel('s0',0).fromTo(line,{strokeDashoffset:nl},{strokeDashoffset:0,duration:1.4,ease:'power2.inOut'},0)
    .fromTo([tagE,tagD],{opacity:0},{opacity:1,duration:.4},1)
    .addLabel('s1',1.5).fromTo(cortex,{opacity:0,scale:.6,transformOrigin:'50% 50%'},{opacity:1,scale:1,duration:.7,ease:'back.out(1.6)',stagger:.12},1.5).fromTo(leg[0],{opacity:0,x:16},{opacity:1,x:0,duration:.4},1.6)
    .addLabel('s2',2.6).fromTo(load,{opacity:0,y:-18},{opacity:1,y:0,duration:.6,ease:'power2.out'},2.6).fromTo(leg[1],{opacity:0,x:16},{opacity:1,x:0,duration:.4},2.7)
    .addLabel('s3',3.5).fromTo(comp,{strokeDashoffset:(i,t)=>t.getTotalLength()+6,opacity:0},{strokeDashoffset:0,opacity:1,duration:.9,ease:'power1.out',stagger:.08},3.5).fromTo(leg[2],{opacity:0,x:16},{opacity:1,x:0,duration:.4},3.6)
    .addLabel('s4',5).fromTo(tens,{strokeDashoffset:(i,t)=>t.getTotalLength()+6,opacity:0},{strokeDashoffset:0,opacity:1,duration:.8,ease:'power1.out',stagger:.1},5).fromTo(leg[3],{opacity:0,x:16},{opacity:1,x:0,duration:.4},5.1)
    .addLabel('s5',6.4).fromTo([...redEpi,redCanal],{opacity:0},{opacity:.45,duration:.8,stagger:.15},6.4).fromTo(leg[4],{opacity:0,x:16},{opacity:1,x:0,duration:.4},6.5)
    .addLabel('s6',7.8).fromTo(redCanal,{opacity:.45},{opacity:0,duration:1,immediateRender:false},7.8).fromTo(yelCanal,{opacity:0},{opacity:.6,duration:1},7.8).fromTo(leg[5],{opacity:0,x:16},{opacity:1,x:0,duration:.4},7.9)
    .to({},{duration:.4},8.8);
  const steps=[[0,'<b>1. O molde.</b> Um osso longo tem epífises (pontas) largas e uma diáfise (corpo) estreita.'],
    [1.5,'<b>2. Casca compacta.</b> Na diáfise, o osso compacto forma um tubo grosso (cheio de ósteons): resiste à flexão e à torção com pouco material.'],
    [2.6,'<b>3. A carga chega.</b> O peso do corpo entra pela superfície articular da epífise e precisa ser levado até a cortical da diáfise.'],
    [3.5,'<b>4. Trabéculas de compressão.</b> Traves em leque descem da superfície articular até a cortical, exatamente ao longo das linhas de compressão.'],
    [5,'<b>5. Trabéculas de tração.</b> Arcos cruzam as de compressão quase em ângulo reto e seguram a epífise contra a tração. É a lei de Wolff: o osso se constrói onde há carga.'],
    [6.4,'<b>6. Medula vermelha.</b> No jovem, os espaços entre as trabéculas e o canal medular estão cheios de medula hematopoética.'],
    [7.8,'<b>7. Adulto.</b> A medula do canal da diáfise vira <b>amarela</b> (gordura); a vermelha fica no esponjoso das epífises.']];
  const out=$('#trabOut'),rng=$('#trabRange');let last=-1;
  const upd=()=>{const t=tl.time();let k=0;steps.forEach((s,i)=>{if(t>=s[0])k=i});if(k!==last&&out){out.innerHTML=steps[k][1];last=k}
    if(rng&&document.activeElement!==rng)rng.value=Math.round(tl.progress()*1000)};
  tl.eventCallback('onUpdate',upd);
  const pb=$('#trabPlay'),pz=$('#trabPause'),rs=$('#trabReset');
  if(pb)pb.onclick=()=>{if(tl.progress()>=1)tl.progress(0);tl.play()};
  if(pz)pz.onclick=()=>tl.pause();
  if(rs)rs.onclick=()=>{tl.pause();tl.progress(0);upd()};
  if(rng)rng.oninput=()=>{tl.pause();tl.progress(rng.value/1000);upd()};
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){tl.progress(1);upd()}
  else{tl.progress(0);upd();
    if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){tl.play();io.disconnect()}},{threshold:.4});io.observe(svg)}}
}
