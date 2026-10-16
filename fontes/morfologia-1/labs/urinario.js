const {$,$$,reduce,press,E,T,clear,choices}=window.BIO;
const G=window.gsap;

/* ---------- 1. Seletor de espécie: tipo de rim ---------- */
(function(){
  const svg=$('#urnSvg'),out=$('#urnOut');if(!svg||!out)return;
  const BEAN='M0.3,-0.95 C-0.6,-1.05 -1,-0.5 -1,0 C-1,0.5 -0.6,1.05 0.3,0.95 C0.75,0.9 0.85,0.5 0.55,0.25 C0.4,0.1 0.4,-0.1 0.55,-0.25 C0.85,-0.5 0.75,-0.9 0.3,-0.95Z';
  const HEART='M0.1,-0.95 L0.9,-0.75 C0.85,-0.2 0.6,0.5 0.05,0.95 C-0.6,0.55 -0.95,0 -0.95,-0.55 C-0.6,-0.85 -0.3,-0.95 0.1,-0.95Z';
  const shape=(p,d,cx,cy,sx,sy,fill,stroke,sw)=>E('path',{d,transform:`translate(${cx},${cy}) scale(${sx},${sy})`,fill,stroke,'stroke-width':sw||3,'vector-effect':'non-scaling-stroke'},p);
  const line=(p,d,col,w)=>E('path',{d,fill:'none',stroke:col,'stroke-width':w||5,'stroke-linecap':'round'},p);
  function outer(g,k){ // vista externa, centro (150,150)
    if(k==='bov'){[[-55,-75],[0,-90],[55,-70],[-75,-20],[-20,-30],[40,-20],[-70,35],[-15,25],[45,35],[-45,85],[15,90]].forEach(([x,y])=>E('circle',{cx:150+x,cy:150+y,r:34,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':3},g));}
    else if(k==='mar'){for(let i=0;i<7;i++)for(let j=0;j<6;j++){const x=95+j*22+(i%2)*11,y=70+i*25;E('circle',{cx:x,cy:y,r:12,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2},g)}}
    else if(k==='ave'){[[-95,40],[-5,48],[95,52]].forEach(([y,h],i)=>E('ellipse',{cx:150,cy:150+y,rx:i===1?38:52,ry:h,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':3},g));}
    else if(k==='equ'){shape(g,HEART,150,150,110,110,'var(--eosin-soft)','var(--eosin)');}
    else if(k==='sui'){shape(g,BEAN,150,150,120,85,'var(--eosin-soft)','var(--eosin)');}
    else shape(g,BEAN,150,150,95,115,'var(--eosin-soft)','var(--eosin)');
  }
  function cut(g,k){ // corte, centro (450,150)
    const cx=450,cy=150;
    if(k==='cao'||k==='ovi'||k==='equ'){
      shape(g,BEAN,cx,cy,95,115,'var(--eosin-soft)','var(--eosin)');
      shape(g,'M0.4,-0.7 C-0.4,-0.75 -0.7,-0.35 -0.7,0 C-0.7,0.35 -0.4,0.75 0.4,0.7 L0.45,0.25 L0.45,-0.25Z',cx,cy,95,115,'var(--hema-soft)','var(--hema)',2);
      E('path',{d:`M${cx+30},${cy-35} C${cx+50},${cy-20} ${cx+50},${cy+20} ${cx+30},${cy+35} C${cx+40},${cy+10} ${cx+40},${cy-10} ${cx+30},${cy-35}Z`,fill:'var(--hema)'},g);
      E('path',{d:`M${cx+40},${cy-40} C${cx+75},${cy-30} ${cx+75},${cy+30} ${cx+40},${cy+40} L${cx+60},${cy+12} L${cx+130},${cy+12} L${cx+130},${cy-12} L${cx+60},${cy-12}Z`,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':3},g);
      if(k==='equ'){line(g,`M${cx+45},${cy-40} C${cx+20},${cy-75} ${cx-10},${cy-90} ${cx-30},${cy-95}`,'var(--amber)',6);line(g,`M${cx+45},${cy+40} C${cx+20},${cy+75} ${cx-10},${cy+90} ${cx-30},${cy+95}`,'var(--amber)',6)}
    }else if(k==='sui'){
      shape(g,BEAN,cx,cy,120,85,'var(--eosin-soft)','var(--eosin)');
      [[-80,-40],[-95,10],[-65,55],[-25,-65],[-20,68]].forEach(([x,y])=>{E('path',{d:`M${cx+x-14},${cy+y-14} L${cx+x+14},${cy+y+14} L${cx+15},${cy+y*0.25}Z`,fill:'var(--hema-soft)',stroke:'var(--hema)','stroke-width':2},g);line(g,`M${cx+15},${cy+y*0.25} L${cx+45},${cy+y*0.15}`,'var(--amber)',5)});
      E('path',{d:`M${cx+40},${cy-22} L${cx+80},${cy-10} L${cx+150},${cy-8} L${cx+150},${cy+8} L${cx+80},${cy+10} L${cx+40},${cy+22}Z`,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':3},g);
    }else if(k==='bov'){
      [[-55,-75],[0,-90],[55,-70],[-75,-20],[-20,-30],[-70,35],[-15,25],[-45,85],[15,90]].forEach(([x,y])=>{E('circle',{cx:cx-20+x,cy:cy+y,r:32,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':3},g);E('circle',{cx:cx-20+x,cy:cy+y,r:15,fill:'var(--hema-soft)',stroke:'var(--hema)','stroke-width':2},g);line(g,`M${cx-20+x},${cy+y} L${cx+60},${cy+(y<0?-15:15)}`,'var(--amber)',4)});
      line(g,`M${cx+60},${cy-15} L${cx+90},${cy} M${cx+60},${cy+15} L${cx+90},${cy} L${cx+140},${cy}`,'var(--amber)',8);
    }else if(k==='mar'){
      for(let i=0;i<7;i++)for(let j=0;j<5;j++){const x=cx-110+j*24+(i%2)*12,y=75+i*25;E('circle',{cx:x,cy:y,r:12,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2},g);E('circle',{cx:x,cy:y,r:5,fill:'var(--hema)'},g);line(g,`M${x+6},${y} L${cx+40},${cy}`,'var(--amber)',1.5)}
      line(g,`M${cx+40},${cy} L${cx+130},${cy}`,'var(--amber)',7);
    }else if(k==='ave'){
      [[-95,40],[-5,48],[95,52]].forEach(([y,h],i)=>{E('ellipse',{cx:cx-20,cy:cy+y,rx:i===1?38:52,ry:h,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':3},g);for(let n=-1;n<=1;n++)E('path',{d:`M${cx-30+n*14},${cy+y-10} l8,22 l-16,0Z`,fill:'var(--hema)'},g)});
      line(g,`M${cx+45},${cy-130} C${cx+35},${cy-40} ${cx+50},${cy+60} ${cx+40},${cy+150}`,'var(--amber)',6);
    }
  }
  const D={
    cao:['Unipiramidal liso','Cão e gato: rins em forma de feijão, superfície lisa; as pirâmides fundiram-se numa <b>crista renal</b> única que despeja urina numa pelve sem cálices, com recessos pélvicos. No gato, veias capsulares visíveis na superfície. Rim direito mais cranial (fica na impressão renal do fígado).'],
    equ:['Unipiramidal liso (rim direito em coração)','Equino: rim <b>direito em coração de baralho</b> (desenhado) e esquerdo em feijão. Crista renal curta na parte central; nos polos, os ductos coletores abrem-se em <b>recessos terminais</b> (âmbar). Glândulas mucosas da pelve tornam a urina normal viscosa e turva.'],
    ovi:['Unipiramidal liso','Ovino e caprino: feijão liso, crista renal e pelve com recessos, como no cão. O rim esquerdo é empurrado pelo rúmen para a direita e caudalmente.'],
    sui:['Multipiramidal liso','Suíno: superfície lisa, mas <b>várias pirâmides e papilas</b> separadas por colunas renais, cada papila num <b>cálice menor</b>; cálices maiores formam a pelve. Rins achatados, simétricos (L1–L4); o direito não toca o fígado.'],
    bov:['Multipiramidal lobado','Bovino: cerca de 20 <b>lobos</b> separados por fissuras na superfície; cada papila tem um cálice menor, e estes formam dois ductos coletores que se unem no ureter — <b>não há pelve</b>. Rim esquerdo pendente, palpável por via retal.'],
    mar:['Reniculado','Cetáceos, pinípedes, ursos e lontras: centenas de <b>rênculos</b>, cada um como um pequeno rim completo (córtex, medula, papila, cálice), reunidos em cacho. Grande área de superfície e capacidade de concentrar urina (ambiente marinho).'],
    ave:['Rim de ave (lobulado, sem pelve)','Aves: rins alongados em três divisões (cranial, média, caudal), encaixados no sinsacro. Muitos lóbulos com pequenos cones medulares (roxo); ramos do <b>ureter</b> recolhem a urina — sem pelve e sem bexiga. Ureteres abrem-se no urodeu; o nitrogênio sai como ácido úrico.']
  };
  choices('#urnBtns',k=>{
    clear(svg);
    const g1=E('g',{},svg),g2=E('g',{},svg);
    outer(g1,k);cut(g2,k);
    T(svg,150,292,'Vista externa',{fs:18,fill:'var(--muted)'});T(svg,450,292,'Corte',{fs:18,fill:'var(--muted)'});
    out.innerHTML=`<b>${D[k][0]}</b><br>${D[k][1]}`;
    if(G&&!reduce){G.fromTo([g1,g2],{opacity:0,scale:.92,transformOrigin:'50% 50%'},{opacity:1,scale:1,duration:.35,stagger:.08,ease:'power2.out'})}
  });
})();

/* ---------- 2. Animação: árvore arterial do rim ---------- */
(function(){
  const svg=$('#urvSvg'),out=$('#urvOut'),rng=$('#urvRange');if(!svg||!out||!rng||!G)return;
  // fundo: córtex e medula
  E('rect',{x:20,y:30,width:560,height:95,rx:14,fill:'var(--eosin-soft)'},svg);
  E('path',{d:'M20,125 L580,125 L580,262 L20,262Z',fill:'var(--panel)'},svg);
  E('path',{d:'M170,125 L430,125 L300,258Z',fill:'var(--hema-soft)',stroke:'var(--hema)','stroke-width':2},svg);
  E('path',{d:'M20,125 L120,125 L20,230Z M480,125 L580,125 L580,230Z',fill:'var(--hema-soft)',stroke:'var(--hema)','stroke-width':2},svg);
  T(svg,40,56,'Córtex',{fs:18,a:'start',fill:'var(--muted)'});T(svg,40,154,'Medula',{fs:18,a:'start',fill:'var(--muted)'});
  const P=(d,w)=>E('path',{d,fill:'none',stroke:'var(--bad)','stroke-width':w,'stroke-linecap':'round','stroke-linejoin':'round'},svg);
  const ren=P('M590,300 L300,300',10);
  const il=[P('M300,300 C210,290 150,220 145,125',7),P('M300,300 C390,290 450,220 455,125',7)];
  const arq=[P('M145,125 L40,125',6),P('M145,125 L290,125',6),P('M455,125 L310,125',6),P('M455,125 L560,125',6)];
  const xs=[70,130,200,260,340,400,470,530];
  const ilob=xs.map(x=>P(`M${x},125 L${x},42`,4));
  const glo=[];xs.forEach(x=>[60,95].forEach(y=>glo.push(E('circle',{cx:x+12,cy:y,r:9,fill:'var(--bad)',stroke:'var(--bad-soft)','stroke-width':2},svg))));
  const vr=[200,260,340,400].map(x=>E('path',{d:`M${x+12},104 L${x+12},235 Q${x+22},250 ${x+32},235 L${x+32},118`,fill:'none',stroke:'var(--sky)','stroke-width':4,'stroke-linecap':'round'},svg));
  const lab=[[440,292,'a. renal'],[200,250,'interlobar'],[22,150,'arqueada'],[150,24,'interlobular'],[470,24,'glomérulos'],[300,280,'vasa recta']].map(([x,y,s],i)=>T(svg,x,y,s,{fs:18,a:i===2?'start':'middle',fill:i===5?'var(--sky)':'var(--ink)'}));
  const dash=el=>{const L=el.getTotalLength();el.style.strokeDasharray=L;return L};
  const tl=G.timeline({paused:true});
  const draw=(els,t,dur)=>{els.forEach(e=>{const L=dash(e);tl.fromTo(e,{strokeDashoffset:L},{strokeDashoffset:0,duration:dur,ease:'power1.inOut'},t)})};
  tl.addLabel('s0',0);
  tl.fromTo(lab,{opacity:0},{opacity:0,duration:.01},0);
  draw([ren],0,.8);tl.fromTo(lab[0],{opacity:0},{opacity:1,duration:.3},.4);
  tl.addLabel('s1',.9);draw(il,.9,.9);tl.fromTo(lab[1],{opacity:0},{opacity:1,duration:.3},1.4);
  tl.addLabel('s2',1.9);draw(arq,1.9,.8);tl.fromTo(lab[2],{opacity:0},{opacity:1,duration:.3},2.3);
  tl.addLabel('s3',2.8);ilob.forEach((e,i)=>{const L=dash(e);tl.fromTo(e,{strokeDashoffset:L},{strokeDashoffset:0,duration:.6,ease:'power1.out'},2.8+i*.06)});tl.fromTo(lab[3],{opacity:0},{opacity:1,duration:.3},3.1);
  tl.addLabel('s4',3.7);tl.fromTo(glo,{scale:0,transformOrigin:'50% 50%'},{scale:1,duration:.4,stagger:.04,ease:'back.out(2)'},3.7);tl.fromTo(lab[4],{opacity:0},{opacity:1,duration:.3},3.9);
  tl.addLabel('s5',4.6);draw(vr,4.6,1);tl.fromTo(lab[5],{opacity:0},{opacity:1,duration:.3},5);
  tl.to({},{duration:.4},5.6);
  const steps=[[0,'Artéria renal','Ramo direto da aorta abdominal; entra pelo hilo e divide-se em ramos segmentares <b>terminais</b> (sem anastomoses).'],
    [.9,'Artérias interlobares','Sobem entre as pirâmides, pelas colunas renais, até a junção corticomedular.'],
    [1.9,'Artérias arqueadas','Curvam-se em arco sobre a base das pirâmides: marcam o <b>limite entre córtex e medula</b>.'],
    [2.8,'Artérias interlobulares','Partem em ângulo reto e sobem radialmente no córtex; delas saem as arteríolas aferentes.'],
    [3.7,'Glomérulos','Capilares entre arteríola aferente e eferente (<b>sistema porta arterial</b>): filtração sob pressão alta.'],
    [4.6,'Vasa recta','Eferentes dos néfrons <b>justamedulares</b> descem em alças na medula e mantêm o gradiente osmótico (contracorrente).']];
  const play=$('#urvPlay'),pau=$('#urvPause'),rst=$('#urvReset');
  const upd=()=>{const t=tl.time();let s=steps[0];steps.forEach(x=>{if(t>=x[0]-.001)s=x});out.innerHTML=`<b>${s[1]}</b><br>${s[2]}`;rng.value=Math.round(tl.progress()*1000)};
  tl.eventCallback('onUpdate',upd);
  if(play)play.addEventListener('click',()=>{if(tl.progress()>=1)tl.restart();else tl.play()});
  if(pau)pau.addEventListener('click',()=>tl.pause());
  if(rst)rst.addEventListener('click',()=>{tl.pause();tl.progress(0);upd()});
  rng.addEventListener('input',()=>{tl.pause();tl.progress(rng.value/1000);upd()});
  if(reduce){tl.progress(1);upd()}
  else{tl.progress(0);upd();
    const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting&&tl.progress()===0){tl.play();io.disconnect()}})},{threshold:.4});io.observe(svg)}
})();
