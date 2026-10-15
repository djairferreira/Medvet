const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;
/* Ciclo de remodelação (unidade multicelular básica) */
{const steps=[
 ['Quiescência','A superfície está coberta por <b>células de revestimento</b> achatadas. Os osteócitos, dentro da matriz, monitoram a carga e os microdanos.'],
 ['Ativação','Um microdano, a queda do cálcio ou o PTH fazem osteócitos e osteoblastos exporem <b>RANKL</b>. As células de revestimento se retraem; precursores monocíticos chegam pelo sangue e se fundem em <b>osteoclastos</b>.'],
 ['Reabsorção (2 a 3 semanas)','Os osteoclastos vedam a superfície, acidificam (H⁺-ATPase) e digerem o colágeno (catepsina K), escavando a <b>lacuna de Howship</b>. Cálcio e fosfato vão para o sangue.'],
 ['Reversão','Os osteoclastos morrem por apoptose; células mononucleares limpam a cavidade. <b>TGF-β e IGF</b> liberados da matriz digerida chamam os osteoblastos: é o <b>acoplamento</b>.'],
 ['Formação (cerca de 3 meses)','Osteoblastos depositam <b>osteoide</b> (faixa clara), que se mineraliza com a ajuda da fosfatase alcalina. Alguns ficam presos e viram <b>osteócitos</b>.'],
 ['De volta à quiescência','A cavidade foi preenchida com a mesma quantidade de osso. Se a formação ficar menor que a reabsorção em cada ciclo (idade, corticoides, desuso), o saldo negativo leva à <b>osteoporose</b>.']];
 stepper('rmd',steps,(s,i)=>{
  const Y=150;E('rect',{x:0,y:0,width:600,height:Y,fill:'var(--paper)'},s);T(s,20,30,'Medula',{a:'start',fs:18,fill:'var(--muted)'});
  /* osso com cavidade */
  const depth=[0,0,70,70,40,0][i],fill=[0,0,0,0,30,0][i];
  const path=`M0,${Y} L200,${Y} Q300,${Y+2*depth} 400,${Y} L600,${Y} L600,300 L0,300 Z`;
  E('path',{d:path,fill:'var(--bone-2)',stroke:'var(--line)','stroke-width':2},s);
  T(s,585,288,'Osso mineralizado',{a:'end',fs:18,fill:'var(--ink)'});
  if(i===4){E('path',{d:`M200,${Y} Q300,${Y+2*depth} 400,${Y} Z`,fill:'var(--amber-soft, var(--amber))',opacity:.6},s);T(s,300,Y+30,'osteoide',{fs:18})}
  /* osteócitos */
  [[90,230],[480,220],[300,265]].forEach(([x,y])=>{E('ellipse',{cx:x,cy:y,rx:14,ry:8,fill:'var(--sky)'},s);
    [[-30,-12],[30,10],[-20,18],[25,-14]].forEach(([dx,dy])=>E('line',{x1:x,y1:y,x2:x+dx,y2:y+dy,stroke:'var(--sky)','stroke-width':2},s))});
  if(i===4)E('ellipse',{cx:300,cy:Y+48,rx:12,ry:7,fill:'var(--sky)'},s);
  /* células de revestimento */
  if(i===0||i===5)for(let x=20;x<600;x+=70)E('rect',{x,y:Y-10,width:56,height:10,rx:5,fill:'var(--ok)'},s);
  if(i===1){for(let x=20;x<600;x+=70)if(x<170||x>420)E('rect',{x,y:Y-10,width:56,height:10,rx:5,fill:'var(--ok)'},s);
    [[250,70],[330,90]].forEach(([x,y])=>{const c=E('circle',{cx:x,cy:y,r:16,fill:'var(--eosin)'},s);if(!reduce)E('animate',{attributeName:'cy',from:y-40,to:y,dur:'1s',fill:'freeze'},c)});
    T(s,300,40,'RANKL ↑',{fs:20,fill:'var(--hema)'})}
  if(i===2){const g=E('g',{},s);E('ellipse',{cx:300,cy:Y+depth-20,rx:80,ry:30,fill:'var(--eosin)',opacity:.9},g);
    [270,300,330].forEach(x=>E('circle',{cx:x,cy:Y+depth-24,r:6,fill:'var(--paper)'},g));T(s,300,Y-40,'Osteoclasto: H⁺ + catepsina K',{fs:20,fill:'var(--hema)'});
    if(!reduce)E('animateTransform',{attributeName:'transform',type:'translate',values:'-6 0;6 0;-6 0',dur:'1.2s',repeatCount:'indefinite'},g)}
  if(i===3){[260,340].forEach(x=>E('circle',{cx:x,cy:Y+50,r:12,fill:'var(--muted)'},s));T(s,300,Y-40,'TGF-β e IGF liberados',{fs:20,fill:'var(--hema)'})}
  if(i===4){for(let k=0;k<5;k++){const x=215+k*42,y=Y+2*40*(1-Math.pow((x-300)/100,2))*0.5-28;E('rect',{x:x-15,y:y-14,width:30,height:24,rx:5,fill:'var(--ok)'},s)}T(s,300,Y-40,'Osteoblastos depositam osteoide',{fs:20,fill:'var(--ok)'})}
 });}
