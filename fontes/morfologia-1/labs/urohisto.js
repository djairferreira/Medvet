const {$,reduce,E,T}=window.BIO;
const G=window.gsap;
/* controles comuns: ▶ ⏸ ↺ + scrub + rótulos de etapa */
function ctl(pre,tl,steps,svg){
  const out=$('#'+pre+'Out'),rng=$('#'+pre+'Range'),play=$('#'+pre+'Play'),pau=$('#'+pre+'Pause'),rst=$('#'+pre+'Reset');
  const upd=()=>{const t=tl.time();let s=steps[0];steps.forEach(x=>{if(t>=x[0]-.001)s=x});if(out)out.innerHTML=`<b>${s[1]}</b><br>${s[2]}`;if(rng)rng.value=Math.round(tl.progress()*1000)};
  tl.eventCallback('onUpdate',upd);
  if(play)play.addEventListener('click',()=>{if(tl.progress()>=1)tl.restart();else tl.play()});
  if(pau)pau.addEventListener('click',()=>tl.pause());
  if(rst)rst.addEventListener('click',()=>{tl.pause();tl.progress(0);upd()});
  if(rng)rng.addEventListener('input',()=>{tl.pause();tl.progress(rng.value/1000);upd()});
  if(reduce){tl.progress(1);upd();return}
  tl.progress(0);upd();
  const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting&&tl.progress()===0){tl.play();io.disconnect()}})},{threshold:.4});io.observe(svg);
}

/* ---------- 1. Caminho do filtrado pelo néfron ---------- */
(function(){
  const svg=$('#unfSvg');if(!svg||!G)return;
  E('rect',{x:0,y:0,width:600,height:200,fill:'var(--eosin-soft)'},svg);
  E('rect',{x:0,y:200,width:600,height:220,fill:'var(--panel)'},svg);
  T(svg,590,190,'córtex',{fs:18,a:'end',fill:'var(--muted)'});T(svg,590,225,'medula',{fs:18,a:'end',fill:'var(--muted)'});
  E('circle',{cx:105,cy:88,r:44,fill:'var(--paper)',stroke:'var(--hema)','stroke-width':4},svg);
  E('circle',{cx:105,cy:88,r:28,fill:'var(--bad-soft)',stroke:'var(--bad)','stroke-width':3},svg);
  E('path',{d:'M10,30 L80,70',fill:'none',stroke:'var(--bad)','stroke-width':10,'stroke-linecap':'round'},svg);
  const SEG=[
    ['M20,36 L105,88 L148,96','var(--bad)',6],
    ['M148,96 C200,70 225,130 188,142 C150,154 170,188 215,182 C250,177 250,195 250,215','var(--eosin)',13],
    ['M250,215 L250,365','var(--sky)',6],
    ['M250,365 C250,400 300,400 300,365 L300,325','var(--sky)',6],
    ['M300,325 L300,125 C300,82 232,70 176,60','var(--amber)',10],
    ['M176,60 C230,18 330,22 360,52 C390,82 405,50 440,50 L470,50','var(--ok)',10],
    ['M470,50 L470,402','var(--hema)',15]];
  const paths=SEG.map(([d,c,w])=>E('path',{d,fill:'none',stroke:c,'stroke-width':w,'stroke-linecap':'round','stroke-linejoin':'round',opacity:.35},svg));
  [[20,160,'Glomérulo','start'],[238,245,'TCP','end'],[238,310,'Ramo','end'],[238,332,'descendente','end'],[275,414,'Alça','middle'],[312,270,'Ramo grosso','start'],[312,292,'ascendente','start'],[395,118,'TCD','middle'],[485,250,'Ducto','start'],[485,272,'coletor','start']].forEach(([x,y,s,a])=>T(svg,x,y,s,{fs:18,a}));
  const drop=E('circle',{cx:0,cy:0,r:12,fill:'var(--sky)',stroke:'var(--paper)','stroke-width':3},svg);
  const L=paths.map(p=>p.getTotalLength());
  const pos={s:0,d:0};
  const place=()=>{const p=paths[pos.s].getPointAtLength(Math.min(pos.d,L[pos.s]));G.set(drop,{x:p.x,y:p.y})};
  const tl=G.timeline({paused:true});
  const steps=[];
  const SC=[1,.85,.62,.55,.55,.45,.3];
  const TXT=[
    ['1 · Glomérulo','O sangue da arteríola aferente é filtrado pela barreira glomerular. O filtrado é como plasma sem proteínas: <b>100% do volume, ~300 mOsm/kg</b>.'],
    ['2 · Túbulo contorcido proximal','A borda em escova e as mitocôndrias reabsorvem ~<b>65–70% do Na⁺ e da água</b>, toda a glicose e os aminoácidos, HCO₃⁻; secreta ácidos orgânicos e fármacos. Resta ~1/3, ainda isosmótico.'],
    ['3 · Ramo descendente','Epitélio pavimentoso permeável à água (aquaporina 1) e pouco ao soluto: a água sai para o interstício hipertônico e o filtrado <b>concentra-se</b> à medida que desce.'],
    ['4 · Curva da alça','Na ponta da alça (néfrons justamedulares, perto da papila) o filtrado atinge a osmolalidade máxima do interstício — até ~1.200 mOsm/kg no cão e mais no gato.'],
    ['5 · Ramo grosso ascendente','Impermeável à água, bombeia Na⁺-K⁺-2Cl⁻ (alvo da furosemida) para o interstício: o filtrado fica <b>diluído (~100 mOsm/kg)</b> e a medula fica concentrada. Volta ao próprio glomérulo: <b>mácula densa</b>.'],
    ['6 · Túbulo contorcido distal','Ajuste fino: Na⁺-Cl⁻ (tiazídicos), Ca²⁺ sob o PTH; início da ação da aldosterona. Resta ~10% do volume filtrado.'],
    ['7 · Ducto coletor','Com <b>ADH</b>, aquaporinas 2 entram na membrana das células principais e a água sai para a medula: urina concentrada, ~1% do filtrado. Sem ADH (diabetes insípido), a urina continua diluída.']];
  paths.forEach((p,i)=>{
    const t0=i*1.1;steps.push([t0,TXT[i][0],TXT[i][1]]);
    tl.fromTo(p,{opacity:.35},{opacity:1,duration:.25},t0);
    tl.fromTo(pos,{s:i,d:0},{s:i,d:L[i],duration:1,ease:'none',onUpdate:place,immediateRender:false},t0);
    tl.fromTo(drop,{scale:i?SC[i-1]:1},{scale:SC[i],duration:1,ease:'none',immediateRender:false},t0);
    if(i<paths.length-1)tl.to(p,{opacity:.6,duration:.2},t0+1);
  });
  tl.fromTo(drop,{fill:'var(--sky)'},{fill:'var(--amber)',duration:1,immediateRender:false},6.6);
  G.set(drop,{transformOrigin:'50% 50%'});place();
  ctl('unf',tl,steps,svg);
})();

/* ---------- 2. Urotélio relaxado × distendido ---------- */
(function(){
  const svg=$('#uutSvg');if(!svg||!G)return;
  E('rect',{x:0,y:0,width:600,height:70,fill:'var(--sky-soft)'},svg);
  T(svg,20,40,'Lúmen (urina)',{fs:18,a:'start',fill:'var(--muted)'});
  E('rect',{x:0,y:296,width:600,height:34,fill:'var(--eosin-soft)'},svg);
  E('path',{d:'M0,296 L600,296',stroke:'var(--ink)','stroke-width':3},svg);
  T(svg,20,322,'Membrana basal · lâmina própria',{fs:18,a:'start',fill:'var(--muted)'});
  const tl=G.timeline({paused:true});
  const cell=(cx,cy,rx,ry,fill,stroke)=>{const g=E('g',{},svg);E('ellipse',{cx:0,cy:0,rx,ry,fill,stroke,'stroke-width':2},g);E('circle',{cx:0,cy:0,r:Math.min(rx,ry)*.38,fill:'var(--hema)'},g);G.set(g,{x:cx,y:cy});return g};
  const basal=[],mid=[],umb=[],ves=[],pl=[];
  for(let i=0;i<15;i++)basal.push(cell(20+i*40,278,19,15,'var(--hema-soft)','var(--hema)'));
  [[240,0],[205,20],[170,0]].forEach(([y,off])=>{for(let i=0;i<14;i++)mid.push([cell(30+off+i*40,y,17,20,'var(--hema-soft)','var(--hema)'),y])});
  for(let i=0;i<5;i++){const cx=60+i*120;const g=E('g',{},svg);
    E('path',{d:'M-58,22 L-58,-6 C-58,-40 58,-40 58,-6 L58,22Z',fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':3},g);
    E('circle',{cx:-16,cy:2,r:9,fill:'var(--hema)'},g);E('circle',{cx:16,cy:2,r:9,fill:'var(--hema)'},g);
    const v=E('g',{},g);[[-34,-12],[0,-20],[34,-12],[-30,12],[30,12]].forEach(([x,y])=>E('ellipse',{cx:x,cy:y,rx:8,ry:3,fill:'var(--amber)'},v));ves.push(v);
    const p=E('path',{d:'M-56,-14 C-50,-34 50,-34 56,-14',fill:'none',stroke:'var(--amber)','stroke-width':6,'stroke-linecap':'round'},g);pl.push(p);
    G.set(g,{x:cx,y:125});umb.push(g)}
  // estados explícitos: relaxado (0) → distendido (1)
  tl.fromTo(umb,{y:125,scaleX:1,scaleY:1},{y:228,scaleX:1.05,scaleY:.45,duration:2,ease:'power1.inOut'},0);
  tl.fromTo(mid.filter(m=>m[1]===170).map(m=>m[0]),{y:170,scaleY:1,opacity:1},{y:255,scaleY:.45,opacity:0,duration:1.6,ease:'power1.inOut'},0);
  tl.fromTo(mid.filter(m=>m[1]===205).map(m=>m[0]),{y:205,scaleY:1,scaleX:1},{y:255,scaleY:.5,scaleX:1.2,duration:1.8,ease:'power1.inOut'},0);
  tl.fromTo(mid.filter(m=>m[1]===240).map(m=>m[0]),{y:240,scaleY:1,opacity:1},{y:262,scaleY:.45,opacity:0,duration:1.8,ease:'power1.inOut'},0);
  tl.fromTo(basal,{y:278,scaleY:1},{y:284,scaleY:.7,duration:2,ease:'power1.inOut'},0);
  tl.fromTo(ves,{opacity:1},{opacity:0,duration:1.2,stagger:.05},.4);
  tl.fromTo(pl,{opacity:.25},{opacity:1,duration:1.2,stagger:.05},.4);
  [...basal,...mid.map(m=>m[0]),...umb].forEach(g=>G.set(g,{transformOrigin:'50% 50%'}));
  const steps=[[0,'Bexiga vazia (relaxada)','Urotélio alto, com <b>5–7 camadas</b>: células basais pequenas, intermediárias em pera e <b>células em guarda-chuva</b> em cúpula, muitas binucleadas. As placas de uroplaquina estão guardadas em <b>vesículas fusiformes</b> (âmbar) no citoplasma.'],
    [.7,'Enchendo','As células deslizam umas sobre as outras e achatam-se; as vesículas fundem-se com a membrana apical e acrescentam placas: a superfície cresce sem rasgar.'],
    [1.6,'Bexiga cheia (distendida)','Só <b>2–3 camadas</b>; células em guarda-chuva largas e achatadas, quase pavimentosas, com a membrana apical coberta de <b>placas</b>. As junções de oclusão mantêm a barreira urina-sangue impermeável.']];
  ctl('uut',tl,steps,svg);
})();
