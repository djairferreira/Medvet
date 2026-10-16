/* Animação GSAP: formação de um ósteon (remodelação do osso compacto). */
const {$,E,T}=window.BIO;
const svg=$('#ostSvg');
if(svg&&window.gsap){
  const g=window.gsap,cx=180,cy=200;
  const C=(r,a)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];
  /* osso antigo com lamelas intersticiais */
  const old=E('g',{},svg);
  E('rect',{x:20,y:40,width:320,height:320,rx:24,fill:'var(--bone-2)',stroke:'var(--ink)','stroke-width':2},old);
  [[80,95,45],[285,310,50],[280,100,40],[75,305,40]].forEach(([x,y,r])=>[r,r-12,r-24].forEach(rr=>E('circle',{cx:x,cy:y,r:rr,fill:'none',stroke:'var(--muted)','stroke-width':2,opacity:.6},old)));
  /* túnel aberto pelos osteoclastos */
  const hole=E('circle',{cx,cy,r:118,fill:'var(--panel)',stroke:'var(--ink)','stroke-width':2},svg);
  const ocl=E('g',{},svg);
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2,[x,y]=C(112,a);const c=E('g',{},ocl);
    E('ellipse',{cx:x,cy:y,rx:20,ry:12,fill:'var(--eosin)',transform:`rotate(${a*180/Math.PI+90} ${x} ${y})`},c);
    [-7,0,7].forEach(d=>{const[px,py]=[x+d*Math.cos(a+Math.PI/2),y+d*Math.sin(a+Math.PI/2)];E('circle',{cx:px,cy:py,r:2.6,fill:'var(--paper)'},c)});}
  /* vaso e nervo no centro */
  const ves=E('g',{},svg);E('circle',{cx:cx-6,cy,r:13,fill:'var(--bad)'},ves);E('circle',{cx:cx+13,cy:cy+8,r:6,fill:'var(--sky)'},ves);
  /* lamelas concêntricas depositadas de fora para dentro */
  const radii=[104,88,72,56,40],lam=radii.map(r=>E('circle',{cx,cy,r,fill:'none',stroke:'var(--amber)','stroke-width':7},svg));
  /* anel de osteoblastos que vai se fechando */
  const obl=E('g',{},svg);
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2,[x,y]=C(100,a);E('ellipse',{cx:x,cy:y,rx:8,ry:5,fill:'var(--ok)',transform:`rotate(${a*180/Math.PI+90} ${x} ${y})`},obl);}
  /* osteócitos aprisionados entre as lamelas */
  const ocy=[];[[96,.3],[96,2.4],[80,1.3],[80,4.1],[64,.9],[64,3.3],[48,2],[48,5]].forEach(([r,a])=>{const[x,y]=C(r,a);const o=E('g',{},svg);
    E('ellipse',{cx:x,cy:y,rx:6,ry:3.5,fill:'var(--ink)',transform:`rotate(${a*180/Math.PI+90} ${x} ${y})`},o);
    [-1,1].forEach(s=>{const[x2,y2]=C(r+s*10,a+s*.05);E('line',{x1:x,y1:y,x2,y2,stroke:'var(--ink)','stroke-width':1.2},o)});ocy.push(o);});
  const cem=E('circle',{cx,cy,r:118,fill:'none',stroke:'var(--ink)','stroke-width':3,'stroke-dasharray':'6 6'},svg);
  /* legenda */
  const items=[['var(--eosin)','Osteoclastos'],['var(--bad)','Vaso (+ nervo)'],['var(--ok)','Osteoblastos'],['var(--amber)','Lamelas novas'],['var(--ink)','Osteócitos'],['var(--muted)','Linha cimentante']];
  const leg=items.map((it,i)=>{const a=E('g',{},svg);E('rect',{x:370,y:58+i*50,width:24,height:24,rx:5,fill:it[0]},a);T(a,404,78+i*50,it[1],{a:'start',fs:19});return a;});
  const lens=lam.map(c=>{const n=2*Math.PI*+c.getAttribute('r')+8;c.style.strokeDasharray=n+' '+(n+40);return n});
  const tl=g.timeline({paused:true});
  tl.fromTo(old,{opacity:0},{opacity:1,duration:.6},0)
    .fromTo(ocl,{opacity:0,scale:.2,transformOrigin:'50% 50%'},{opacity:1,scale:1,duration:.6,ease:'back.out(1.5)'},.8)
    .fromTo(leg[0],{opacity:0,x:16},{opacity:1,x:0,duration:.3},.9)
    .fromTo(hole,{scale:0,transformOrigin:'50% 50%'},{scale:1,duration:1.2,ease:'power2.out'},1.2)
    .to(ocl,{opacity:0,duration:.5},2.6)
    .fromTo(ves,{opacity:0,scale:.3,transformOrigin:'50% 50%'},{opacity:1,scale:1,duration:.5,ease:'back.out(2)'},3)
    .fromTo(leg[1],{opacity:0,x:16},{opacity:1,x:0,duration:.3},3.1)
    .fromTo(obl,{opacity:0,scale:1.12,transformOrigin:'50% 50%'},{opacity:1,scale:1,duration:.5},3.8)
    .fromTo(leg[2],{opacity:0,x:16},{opacity:1,x:0,duration:.3},3.9)
    .fromTo(leg[3],{opacity:0,x:16},{opacity:1,x:0,duration:.3},4.6);
  lam.forEach((c,i)=>{const t0=4.6+i*.9;
    tl.fromTo(c,{strokeDashoffset:lens[i]},{strokeDashoffset:0,duration:.7,ease:'power1.inOut'},t0);
    if(i<lam.length-1)tl.to(obl,{scale:radii[i+1]/100*0.98,duration:.5,ease:'power1.inOut'},t0+.4);});
  tl.fromTo(ocy,{opacity:0,scale:0,transformOrigin:'50% 50%'},{opacity:1,scale:1,duration:.3,stagger:.25},5.2)
    .fromTo(leg[4],{opacity:0,x:16},{opacity:1,x:0,duration:.3},5.2)
    .to(obl,{opacity:0,duration:.4},9.1)
    .fromTo(cem,{opacity:0},{opacity:1,duration:.5},9.3)
    .fromTo(leg[5],{opacity:0,x:16},{opacity:1,x:0,duration:.3},9.3)
    .to({},{duration:.4},9.8);
  const steps=[[0,'<b>Ponto de partida.</b> Osso compacto antigo, com restos de ósteons velhos (lamelas intersticiais). Microlesões de fadiga avisam os osteócitos que aquele trecho precisa ser trocado.'],
    [.8,'<b>1. Cone de corte.</b> Um grupo de osteoclastos escava um túnel paralelo ao eixo do osso, avançando cerca de 40 µm por dia.'],
    [3,'<b>2. O vaso entra.</b> Atrás dos osteoclastos chega um capilar (com fibras nervosas): ele será o conteúdo do futuro canal de Havers.'],
    [3.8,'<b>3. Cone de fechamento.</b> Osteoblastos forram a parede do túnel e começam a depositar osteoide, que depois se mineraliza.'],
    [4.6,'<b>4. Lamelas concêntricas.</b> A matriz é depositada em camadas, de fora para dentro; o túnel se estreita a cada lamela, e as fibras colágenas mudam de direção entre lamelas vizinhas.'],
    [5.2,'<b>5. Osteócitos.</b> Alguns osteoblastos ficam presos na própria matriz, dentro de lacunas, e se comunicam por canalículos: viram osteócitos.'],
    [9.1,'<b>6. Ósteon pronto.</b> Sobra o canal de Havers com o vaso no centro. A linha cimentante marca o limite do túnel original; os restos do ósteon antigo viram lamelas intersticiais. O ciclo todo leva de 2 a 4 meses.']];
  const out=$('#ostOut'),rng=$('#ostRange');let last=-1;
  const upd=()=>{const t=tl.time();let k=0;steps.forEach((s,i)=>{if(t>=s[0])k=i});if(k!==last&&out){out.innerHTML=steps[k][1];last=k}
    if(rng&&document.activeElement!==rng)rng.value=Math.round(tl.progress()*1000)};
  tl.eventCallback('onUpdate',upd);
  const pb=$('#ostPlay'),pz=$('#ostPause'),rs=$('#ostReset');
  if(pb)pb.onclick=()=>{if(tl.progress()>=1)tl.progress(0);tl.play()};
  if(pz)pz.onclick=()=>tl.pause();
  if(rs)rs.onclick=()=>{tl.pause();tl.progress(0);upd()};
  if(rng)rng.oninput=()=>{tl.pause();tl.progress(rng.value/1000);upd()};
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){tl.progress(1);upd()}
  else{tl.progress(0);upd();
    if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){tl.play();io.disconnect()}},{threshold:.4});io.observe(svg)}}
}
