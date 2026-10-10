const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;

/* ===== Lab 1: rotação do intestino médio ===== */
{
const steps=[
 ['Tubo reto','O intestino médio ainda é um tubo quase reto, preso ao dorso pelo mesentério dorsal. No ápice, o <b>ducto vitelino</b> o liga ao saco vitelino. A <b>artéria mesentérica cranial</b> (AMC) corre no mesentério até esse ápice.'],
 ['Alça primária','O tubo cresce mais rápido que o embrião e forma uma alça em grampo apontando para o umbigo. <b>Ramo cranial</b> (azul): futuro jejuno e íleo. <b>Ramo caudal</b> (âmbar): futuro ceco e cólon; surge o <b>broto cecal</b>. O eixo da alça é a AMC.'],
 ['Herniação + 90°','Sem espaço no abdome (fígado e mesonefro grandes), a alça entra no cordão umbilical: <b>herniação umbilical fisiológica</b>. Ali, gira <b>90° anti-horário</b> (vista ventral): o ramo cranial vai para a direita do embrião, o caudal para a esquerda.'],
 ['Alongamento no cordão','Dentro do cordão, o ramo cranial se alonga e forma as primeiras alças do jejuno. O ramo caudal cresce pouco. A rotação ainda está em 90°.'],
 ['Retorno + 180°','No início do período fetal, as alças voltam ao abdome — o intestino delgado primeiro, o ceco por último — e giram mais <b>180°</b>: total de <b>270°</b>. O ceco desce para a direita.'],
 ['Posição final','O duodeno passa <b>caudal</b> à AMC e o cólon transverso, <b>cranial</b>: dois "U" encaixados. O mesentério torcido em volta da artéria forma a <b>raiz do mesentério</b>. Falhas: onfalocele, má rotação, vólvulo, atresias.']
];
const herni=[0,0.3,1,1,0.15,0], ang=[0,0,90,90,270,270];
stepper('mrot',steps,(s,i)=>{
  /* painel lateral */
  T(s,150,26,'Vista lateral',{fs:20,w:700});
  E('path',{d:'M20 50 H280 V200 H190 V215 H110 V200 H20 Z',fill:'var(--panel)',stroke:'var(--line)','stroke-width':3},s);
  E('rect',{x:110,y:200,width:80,height:100,rx:10,fill:'var(--bone)',stroke:'var(--bone-2)','stroke-width':2,opacity:0.8},s);
  T(s,150,292,'cordão',{fs:18,fill:'var(--muted)'});
  E('line',{x1:20,y1:62,x2:280,y2:62,stroke:'var(--eosin)','stroke-width':6},s);
  const d=70+herni[i]*90+(i>0?40:0), apex=110+d*(i===0?0.3:1);
  E('line',{x1:150,y1:62,x2:150,y2:Math.min(apex,270),stroke:'var(--eosin)','stroke-width':3},s);
  const ap=Math.min(apex,270);
  if(i===0){E('path',{d:'M30 120 H270',fill:'none',stroke:'var(--sky)','stroke-width':12,'stroke-linecap':'round'},s);}
  else{
    E('path',{d:`M30 110 H110 C130 110 120 ${ap} 150 ${ap}`,fill:'none',stroke:'var(--sky)','stroke-width':12,'stroke-linecap':'round'},s);
    E('path',{d:`M150 ${ap} C180 ${ap} 170 110 190 110 H270`,fill:'none',stroke:'var(--amber)','stroke-width':12,'stroke-linecap':'round'},s);
    if(i===3){for(let k=0;k<3;k++)E('circle',{cx:120,cy:ap-20-k*22,r:9,fill:'none',stroke:'var(--sky)','stroke-width':6},s);}
    E('circle',{cx:174,cy:ap-36,r:7,fill:'var(--amber)'},s);
  }
  T(s,236,98,'AMC',{fs:18,fill:'var(--eosin)'});
  /* painel ventral */
  E('line',{x1:300,y1:40,x2:300,y2:320,stroke:'var(--line)','stroke-width':2},s);
  T(s,450,26,'Vista ventral',{fs:20,w:700});
  const cx=450,cy=170,R=78;
  E('circle',{cx,cy,r:R,fill:'none',stroke:'var(--line)','stroke-width':2,'stroke-dasharray':'4 5'},s);
  E('circle',{cx,cy,r:13,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':3},s);
  T(s,cx,cy+6,'A',{fs:18,fill:'var(--eosin)'});
  const arc=(a0,col,w)=>{const p=a=>[cx+R*Math.cos(a*Math.PI/180),cy+R*Math.sin(a*Math.PI/180)];const[x1,y1]=p(a0-32),[x2,y2]=p(a0+32);
    return E('path',{d:`M${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2}`,fill:'none',stroke:col,'stroke-width':w,'stroke-linecap':'round'},s)};
  const a=ang[i], cr=-90-a, cd=90-a; /* -90 = topo; anti-horário na tela = ângulo diminui */
  arc(cr,'var(--sky)',16); arc(cd,'var(--amber)',16);
  if(i>0){const r=cd*Math.PI/180;E('circle',{cx:cx+(R+18)*Math.cos(r+0.35),cy:cy+(R+18)*Math.sin(r+0.35),r:9,fill:'var(--amber)'},s);}
  const lab=(deg,txt,col)=>{const r=deg*Math.PI/180;T(s,cx+(R+44)*Math.cos(r),cy+(R+40)*Math.sin(r)+6,txt,{fs:18,fill:col})};
  lab(cr,'cranial','var(--sky)');lab(cd,'caudal','var(--amber)');
  T(s,cx,cy+48,a+'°',{fs:26,w:800});
  T(s,318,316,'← direita do embrião',{fs:18,a:'start',fill:'var(--muted)',w:500});
});
}

/* ===== Lab 2: proporções do estômago do bezerro ===== */
{
const s=$('#rumgSvg'), r=$('#rumgAge');
if(s&&r){
 const idades=['nascimento','4 semanas','8 semanas','12 semanas','6 meses','adulto'];
 /* % aproximados: rúmen, retículo, omaso, abomaso */
 const solido=[[25,5,10,60],[38,6,10,46],[55,6,9,30],[62,6,9,23],[72,5,9,14],[80,5,7,8]];
 const leite=[[25,5,10,60],[28,5,10,57],[31,5,10,54],[34,5,10,51],[45,5,10,40],[80,5,7,8]];
 const nomes=['Rúmen','Retículo','Omaso','Abomaso'], cor=['sky','ok','amber','eosin'];
 let dieta='solido';
 const txt={0:'Ao nascer o <b>abomaso</b> domina (≈60%). O bezerro funciona como monogástrico: o leite passa pela <b>goteira esofágica</b> direto ao abomaso.',
  1:'Com acesso a concentrado e água, começa a fermentação; o <b>butirato</b> e o propionato estimulam as papilas.',
  2:'Por volta de 8 semanas o rúmen-retículo já supera o abomaso: fase de transição, desmame possível se o consumo de concentrado for adequado.',
  3:'O rúmen-retículo já é cerca de dois terços do total.',
  4:'Proporções próximas às do adulto; a dieta de volumoso aumenta o volume e a musculatura.',
  5:'Adulto: rúmen ≈80%, retículo ≈5%, omaso ≈7%, abomaso ≈8% (valores aproximados de capacidade).'};
 const draw=()=>{const i=+r.value, v=(dieta==='leite'?leite:solido)[i];clear(s);
  $('#rumgIdade').textContent=idades[i];
  T(s,300,28,'Capacidade relativa (%)',{fs:20,w:700});
  let x=20;v.forEach((p,k)=>{const w=560*p/100;E('rect',{x,y:44,width:w,height:40,fill:`var(--${cor[k]}-soft)`,stroke:`var(--${cor[k]})`,'stroke-width':2},s);x+=w});
  v.forEach((p,k)=>{const cx=100+k*135, rad=12+Math.sqrt(p)*9;
    E('circle',{cx,cy:200,r:rad,fill:`var(--${cor[k]}-soft)`,stroke:`var(--${cor[k]})`,'stroke-width':3},s);
    T(s,cx,206,p+'%',{fs:20,w:800});T(s,cx,320,nomes[k],{fs:18,fill:`var(--${cor[k]})`})});
  $('#rumgOut').innerHTML=`<b>${idades[i]}</b> · ${txt[i]}`+(dieta==='leite'&&i>0&&i<5?' <br><b>Só leite:</b> sem alimento sólido não há ácidos graxos voláteis; o rúmen fica pequeno e com papilas curtas — o desenvolvimento depende da dieta, não só da idade.':'');};
 r.addEventListener('input',draw);
 choices('#rumgBtns',k=>{dieta=k;draw()});
}
}
