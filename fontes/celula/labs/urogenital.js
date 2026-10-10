const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;

/* ===== Lab: três rins (stepper) ===== */
(function(){
  if(!$('#ugrnSvg')) return;
  const ST=[
    ['Mesoderma intermediário','Uma faixa contínua entre os somitos e o mesoderma lateral, do pescoço à cauda. Coberta pelo epitélio celômico, forma a <b>crista urogenital</b> de cada lado do mesentério dorsal.'],
    ['Pronefro (cervical)','7 a 8 pares de túbulos rudimentares na região cervical. Não funcionam nos domésticos e regridem logo, mas deixam o <b>ducto pronéfrico</b>, que cresce caudalmente em direção à cloaca.'],
    ['Mesonefro: o rim do embrião','Dezenas de túbulos em S com cápsula e glomérulo drenam no <b>ducto mesonéfrico (Wolff)</b>, que chega à cloaca. Filtra e reabsorve de verdade; é enorme no suíno, nos ruminantes e no equino.'],
    ['Broto uretérico','Perto da cloaca, o ducto mesonéfrico emite o <b>broto uretérico</b>, que cresce em direção ao <b>blastema metanéfrico</b> (mesoderma intermediário caudal). GDNF do blastema → RET no broto.'],
    ['Indução recíproca','O broto se ramifica (ureter, pelve, cálices, túbulos coletores) e cada ponta induz o blastema (Wnt9b) a formar néfrons. O metanefro produz urina na segunda metade da gestação.'],
    ['Regressão e ascensão','O mesonefro regride craniocaudalmente; seus restos participam da gônada e da adrenal, que se formam na face medial. O metanefro “sobe” para a região lombar e recebe artérias cada vez mais craniais.'],
    ['Destino do ducto de Wolff','No <b>macho</b>, túbulos mesonéfricos → ductos eferentes; ducto → epidídimo e ducto deferente (testosterona). Na <b>fêmea</b>, sem testosterona, ducto e túbulos regridem (restos: epoóforo, ducto de Gartner).']
  ];
  const Y=200;
  function tub(svg,x,on,col,glom){E('path',{d:`M${x} ${Y} C ${x} ${Y-30} ${x+14} ${Y-40} ${x+4} ${Y-62}`,fill:'none',stroke:col,'stroke-width':4,opacity:on},svg);
    if(glom)E('circle',{cx:x+4,cy:Y-70,r:8,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2,opacity:on},svg)}
  function draw(svg,i){
    T(svg,20,28,'cranial',{fs:18,a:'start',fill:'var(--muted)'});T(svg,580,28,'caudal',{fs:18,a:'end',fill:'var(--muted)'});
    for(let k=0;k<14;k++)E('rect',{x:30+k*38,y:44,width:28,height:24,rx:5,fill:'var(--bone)',stroke:'var(--line)'},svg);
    T(svg,300,92,'somitos',{fs:18,fill:'var(--muted)'});
    const asc=i>=5;
    E('rect',{x:24,y:110,width:530,height:110,rx:20,fill:'var(--sky-soft)',stroke:'var(--sky)',opacity:i===0?1:.35},svg);
    if(i===0){T(svg,290,170,'mesoderma intermediário',{fs:22,fill:'var(--sky)'});return}
    // pronefro
    const pOn=i===1?1:.25;for(let k=0;k<4;k++)tub(svg,40+k*22,pOn,'var(--muted)',0);
    T(svg,72,250,'pronefro',{fs:18,fill:i===1?'var(--ink)':'var(--muted)'});
    // ducto
    const dEnd=i===1?160:540;
    const male=i===6;
    E('line',{x1:40,y1:Y,x2:dEnd,y2:Y,stroke:'var(--hema)','stroke-width':6,opacity:i===6?1:.9},svg);
    if(i===1)E('path',{d:`M160 ${Y} l-12 -9 m12 9 l-12 9`,fill:'none',stroke:'var(--hema)','stroke-width':4},svg);
    // cloaca
    if(i>=2){E('circle',{cx:560,cy:Y+10,r:22,fill:'var(--ok-soft)',stroke:'var(--ok)','stroke-width':2.5},svg);T(svg,560,Y+60,'cloaca',{fs:18,fill:'var(--ok)'})}
    // mesonefro
    if(i>=2){const on=i===2||i===3||i===4?1:i===5?.35:.6;const n=i>=5?7:12;
      for(let k=0;k<n;k++)tub(svg,140+k*22,on,'var(--hema)',i<5);
      T(svg,265,250,i>=5?'mesonefro em regressão':'mesonefro',{fs:18,fill:'var(--hema)'})}
    // gonada/adrenal
    if(i>=5){E('ellipse',{cx:200,cy:150,rx:34,ry:16,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':2},svg);T(svg,200,128,i===6?'testículo':'gônada',{fs:18,fill:'var(--amber)'});
      E('ellipse',{cx:140,cy:150,rx:20,ry:13,fill:'var(--bone-2)',stroke:'var(--muted)'},svg);T(svg,120,128,'adrenal',{fs:18,fill:'var(--muted)'})}
    // broto e blastema
    if(i>=3){const bx=asc?400:480,by=asc?140:150;
      E('ellipse',{cx:bx,cy:by,rx:i>=4?52:40,ry:i>=4?36:28,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2.5},svg);
      E('path',{d:`M535 ${Y} C 520 ${Y-20} ${bx+30} ${by+30} ${bx+10} ${by+8}`,fill:'none',stroke:'var(--sky)','stroke-width':5},svg);
      if(i>=4){[[-30,-14],[-30,12],[-8,-24],[-8,24]].forEach(d=>E('line',{x1:bx+10,y1:by+8,x2:bx+d[0],y2:by+d[1],stroke:'var(--sky)','stroke-width':3},svg))}
      T(svg,bx,by-46,i>=4?'metanefro':'blastema',{fs:18,fill:'var(--eosin)'});
      T(svg,500,290,'ureter',{fs:18,fill:'var(--sky)'});
      if(asc&&!reduce){const g=svg.lastChild}
    }
    if(i===6){T(svg,300,316,'macho: epidídimo e ducto deferente',{fs:19,fill:'var(--hema)'})}
    else if(i>=2)T(svg,300,316,'ducto mesonéfrico (Wolff)',{fs:19,fill:'var(--hema)'});
    else T(svg,300,316,'ducto pronéfrico',{fs:19,fill:'var(--hema)'});
  }
  stepper('ugrn',ST,draw);
})();

/* ===== Lab: simulador de diferenciação sexual ===== */
(function(){
  const svg=$('#ugsxSvg');if(!svg)return;
  const out=$('#ugsxOut'),tog=$('#ugsxTog');
  const P={
    macho:{xy:1,sry:1,amh:1,t:1,ar:1,red:1},
    femea:{xy:0,sry:0,amh:1,t:1,ar:1,red:1},
    freemartin:{xy:0,sry:0,amh:1,t:1,ar:1,red:1,fm:1},
    pmds:{xy:1,sry:1,amh:0,t:1,ar:1,red:1},
    ais:{xy:1,sry:1,amh:1,t:1,ar:0,red:1},
    red:{xy:1,sry:1,amh:1,t:1,ar:1,red:0},
    xxsr:{xy:0,sry:1,amh:1,t:1,ar:1,red:1},
    xysry:{xy:1,sry:0,amh:1,t:1,ar:1,red:1}
  };
  const NOTE={
    macho:'SRY ativa SOX9 → testículo. AMH faz o ducto de Müller regredir; a testosterona mantém o ducto de Wolff; a DHT masculiniza seio urogenital e genitália externa.',
    femea:'Sem SRY, WNT4/RSPO1/FOXL2 mantêm o ovário. Sem AMH, o ducto de Müller forma tuba, útero e vagina cranial; sem testosterona, o ducto de Wolff regride; sem DHT, a genitália é feminina. Os botões de AMH, testosterona etc. não importam: não há testículo para produzi-los.',
    freemartin:'Bezerra XX gêmea de macho: pela anastomose placentária recebe AMH e andrógenos (e células XY) do irmão. Gônadas hipoplásicas, Müller parcialmente regredido (sem cérvix, vagina curta), genitália externa feminina com clitóris aumentado. Cerca de 90% das gêmeas de macho.',
    pmds:'Persistência do ducto de Müller (Schnauzer miniatura): o receptor de AMH não funciona. O macho tem testículos, Wolff e pênis normais, mas também útero e tubas; muitas vezes é criptorquídico.',
    ais:'Insensibilidade a andrógenos: testosterona é produzida mas não age. A AMH funciona (sem útero), o Wolff regride e a genitália externa é feminina, com vagina em fundo cego e testículos retidos.',
    red:'Sem 5α-redutase não há DHT: o Wolff se desenvolve (responde à própria testosterona), mas próstata e genitália externa ficam ambíguas: pênis pequeno, hipospádia, escroto bífido.',
    xxsr:'XX com via testicular ligada sem SRY: suínos XX sexo reverso, cães Cocker, cabras mochas homozigotas (PIS, perda de FOXL2). Formam testículo ou ovotéstis e se masculinizam em grau variável; são estéreis.',
    xysry:'XY com SRY ausente ou mutado: a gônada não vira testículo (gônada disgenética). Sem AMH e testosterona, o fenótipo é feminino. Descrito em éguas e cadelas.'
  };
  let s=Object.assign({},P.macho),cur='macho';
  const LAB={xy:v=>'Cromossomos: '+(v?'XY':'XX'),sry:v=>'SRY/SOX9: '+(v?'sim':'não'),amh:v=>'AMH: '+(v?'age':'não age'),t:v=>'Testosterona: '+(v?'sim':'não'),ar:v=>'Receptor andrógeno: '+(v?'ok':'defeito'),red:v=>'5α-redutase: '+(v?'ok':'falta')};
  function calc(){
    const fm=!!s.fm,testis=!!s.sry;
    const AMH=testis&&s.amh,TT=testis&&s.t,AND=TT&&s.ar,DHT=AND&&s.red;
    const gon=testis?(s.xy?'Testículo':'Testículo / ovotéstis (XX)'):(fm?'Ovário hipoplásico':(s.xy?'Gônada disgenética':'Ovário'));
    const muller=fm?.5:(AMH?0:1),wolff=fm?.5:(AND?1:0);
    const ext=fm?'f+':(DHT?'m':(AND?'amb':'f'));
    return {fm,testis,AMH,TT,AND,DHT,gon,muller,wolff,ext};
  }
  function chip(x,lab,on){E('rect',{x,y:332,width:132,height:38,rx:19,fill:on?'var(--ok-soft)':'var(--paper)',stroke:on?'var(--ok)':'var(--line)','stroke-width':2},svg);T(svg,x+66,358,lab,{fs:18,fill:on?'var(--ok)':'var(--muted)'})}
  function draw(){
    clear(svg);const r=calc();const cx=170;
    T(svg,cx,26,'Gônada e ductos',{fs:20});T(svg,480,26,'Genitália externa',{fs:20});
    E('line',{x1:350,y1:40,x2:350,y2:320,stroke:'var(--line)','stroke-width':2},svg);
    // gônadas
    const gc=r.testis?'var(--sky)':'var(--eosin)';
    [70,270].forEach(x=>{E('ellipse',{cx:x,cy:80,rx:r.fm?18:28,ry:r.fm?13:20,fill:r.testis?'var(--sky-soft)':'var(--eosin-soft)',stroke:gc,'stroke-width':2.5},svg)});
    T(svg,cx,86,r.gon,{fs:r.gon.length>18?18:19,fill:gc});
    // Wolff
    const wOp=r.wolff===1?1:r.wolff?.6:.3,wD=r.wolff?null:'6 6';
    [[70,-1],[270,1]].forEach(([x,sg])=>{
      E('path',{d:`M${x+sg*24} 96 C ${x+sg*30} 170 ${cx+sg*40} 230 ${cx+sg*12} 280`,fill:'none',stroke:'var(--sky)','stroke-width':r.wolff===1?7:3,'stroke-dasharray':wD,opacity:wOp},svg);
      if(r.wolff===1)E('ellipse',{cx:cx+sg*44,cy:250,rx:10,ry:16,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':2},svg);
    });
    // Müller
    const mOp=r.muller===1?1:r.muller?.6:.3,mD=r.muller?null:'6 6';
    [[70,-1],[270,1]].forEach(([x,sg])=>{
      E('path',{d:`M${x-sg*4} 112 C ${x-sg*4} 160 ${cx+sg*14} 180 ${cx+sg*8} 210`,fill:'none',stroke:'var(--eosin)','stroke-width':r.muller===1?8:3,'stroke-dasharray':mD,opacity:mOp},svg)});
    if(r.muller===1)E('rect',{x:cx-16,y:206,width:32,height:62,rx:12,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2.5},svg);
    else if(r.muller)E('rect',{x:cx-10,y:206,width:20,height:30,rx:8,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2,opacity:.7},svg);
    E('rect',{x:cx-34,y:276,width:68,height:22,rx:8,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':2},svg);
    T(svg,6,190,'Wolff',{fs:18,a:'start',fill:'var(--sky)'});T(svg,300,170,'Müller',{fs:18,a:'end',fill:'var(--eosin)'});
    T(svg,cx,318,'seio urogenital',{fs:18,fill:'var(--amber)'});
    // externa
    const X=480;
    if(r.ext==='m'){E('path',{d:`M${X-12} 90 L${X-12} 200 Q${X} 222 ${X+12} 200 L${X+12} 90 Z`,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':2.5},svg);
      E('ellipse',{cx:X,cy:250,rx:46,ry:30,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':2.5},svg);E('line',{x1:X,y1:222,x2:X,y2:278,stroke:'var(--sky)','stroke-width':2},svg);
      T(svg,X,306,'pênis + escroto',{fs:19,fill:'var(--sky)'})}
    else if(r.ext==='amb'){E('path',{d:`M${X-10} 120 L${X-10} 170 Q${X} 184 ${X+10} 170 L${X+10} 120 Z`,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':2.5},svg);
      E('ellipse',{cx:X-34,cy:240,rx:24,ry:28,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':2.5},svg);E('ellipse',{cx:X+34,cy:240,rx:24,ry:28,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':2.5},svg);
      T(svg,X,306,'ambígua, hipospádia',{fs:19,fill:'var(--amber)'})}
    else{E('path',{d:`M${X} 140 C ${X-40} 170 ${X-40} 240 ${X} 270 C ${X+40} 240 ${X+40} 170 ${X} 140 Z`,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2.5},svg);
      E('line',{x1:X,y1:160,x2:X,y2:255,stroke:'var(--eosin)','stroke-width':2.5},svg);
      E('circle',{cx:X,cy:268,r:r.ext==='f+'?11:5,fill:'var(--eosin)'},svg);
      T(svg,X,306,r.ext==='f+'?'vulva, clitóris grande':'vulva',{fs:19,fill:'var(--eosin)'})}
    chip(18,'SRY',r.testis);chip(162,'AMH',r.AMH||r.fm);chip(306,'Testost.',r.AND||r.fm);chip(450,'DHT',r.DHT);
    const W=r.wolff===1?'epidídimo, ducto deferente, glândula vesicular':r.wolff?'parcial':'regride';
    const M=r.muller===1?'tuba, útero, cérvix, vagina cranial':r.muller?'parcial: útero hipoplásico, sem cérvix':'regride';
    const E2={m:'masculina',amb:'ambígua',f:'feminina','f+':'feminina, clitóris aumentado'}[r.ext];
    out.innerHTML=`<b>${cur?$('[data-k="'+cur+'"]',$('#ugsxPre')).textContent:'Combinação livre'}</b> · ${s.xy?'XY':'XX'}<br>Gônada: <b>${r.gon}</b> · Wolff: <b>${W}</b> · Müller: <b>${M}</b> · Externa: <b>${E2}</b><br>${cur?NOTE[cur]:'Ajuste livre: lembre que AMH e testosterona só existem se houver testículo (SRY/SOX9 ligado).'}`;
    $$('button',tog).forEach(b=>{const k=b.dataset.t;b.textContent=LAB[k](s[k]);b.setAttribute('aria-pressed',String(!!s[k]))});
  }
  choices('#ugsxPre',k=>{s=Object.assign({},P[k]);cur=k;draw()});
  tog.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const k=b.dataset.t;s[k]=s[k]?0:1;delete s.fm;cur=null;press($('#ugsxPre'),null);draw()});
})();

/* ===== Lab: tipos de útero ===== */
(function(){
  const svg=$('#ugutSvg');if(!svg)return;
  const D={
    coelha:{n:'Útero duplo',h:150,b:0,c:2,curl:0,t:'Os ductos de Müller quase não se fundem: dois cornos independentes, cada um com sua <b>cérvix</b>, abrindo numa vagina única (em marsupiais, até a vagina é dupla). Coelha, rata, camundonga.'},
    porca:{n:'Bicorno, corpo curto',h:230,b:30,c:1,curl:1,t:'Cornos muito longos e enovelados (podem passar de 1 m), corpo de ~5 cm e cérvix longa sem fundo de saco, com pregas em saca-rolhas. Abriga ninhadas grandes.'},
    cadela:{n:'Bicorno, corpo curto',h:170,b:30,c:1,curl:0,t:'Cornos longos e retos em forma de V, corpo curto. Fetos alinhados em “contas de rosário” em cada corno.'},
    vaca:{n:'Bicorno (bipartido)',h:150,b:34,c:1,curl:2,t:'Cornos enrolados em espiral; caudalmente ficam unidos por ligamentos intercornuais e parecem um corpo maior (“corpo falso”), mas o corpo verdadeiro tem só 2–4 cm. Cérvix firme com anéis.'},
    egua:{n:'Bicorno com corpo grande',h:95,b:90,c:1,curl:0,t:'Fusão extensa: <b>corpo grande</b> (cerca de metade do útero) e cornos curtos, em forma de T. A placenta difusa ocupa corpo e cornos.'},
    primata:{n:'Útero simples',h:0,b:150,c:1,curl:0,t:'Fusão completa dos ductos de Müller: corpo único, sem cornos; as tubas saem direto do fundo. Primatas, incluindo o ser humano.'}
  };
  function draw(k){
    clear(svg);const d=D[k];const cx=300,top=60;
    T(svg,cx,34,d.n,{fs:22});
    const bTop=250-34-d.b; // body top
    // vagina
    E('rect',{x:cx-26,y:276,width:52,height:52,rx:10,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':2.5},svg);
    T(svg,cx+40,310,'vagina',{fs:18,a:'start',fill:'var(--amber)'});
    // cervix
    if(d.c===2){[-26,26].forEach(o=>E('rect',{x:cx+o-12,y:246,width:24,height:30,rx:6,fill:'var(--hema-soft)',stroke:'var(--hema)','stroke-width':2.5},svg))}
    else E('rect',{x:cx-20,y:246,width:40,height:30,rx:6,fill:'var(--hema-soft)',stroke:'var(--hema)','stroke-width':2.5},svg);
    T(svg,cx-48,268,d.c===2?'2 cérvices':'cérvix',{fs:18,a:'end',fill:'var(--hema)'});
    // body
    if(d.b){E('rect',{x:cx-34,y:bTop,width:68,height:d.b+2,rx:14,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2.5},svg);
      T(svg,cx+48,bTop+d.b/2+6,'corpo',{fs:18,a:'start',fill:'var(--eosin)'})}
    // horns
    const by=d.b?bTop+8:246;
    [-1,1].forEach(sg=>{
      const sx=cx+sg*(d.c===2?26:20);
      if(d.h){let path;
        if(d.curl===1)path=`M${sx} ${by} C ${sx+sg*60} ${by-30} ${sx+sg*20} ${by-90} ${sx+sg*110} ${by-80} S ${sx+sg*90} ${by-140} ${sx+sg*200} ${by-125} S ${sx+sg*170} ${by-80} ${sx+sg*250} ${by-95}`;
        else if(d.curl===2)path=`M${sx} ${by} C ${sx+sg*40} ${by-60} ${sx+sg*90} ${by-125} ${sx+sg*160} ${by-118} C ${sx+sg*210} ${by-110} ${sx+sg*200} ${by-70} ${sx+sg*160} ${by-70} C ${sx+sg*130} ${by-70} ${sx+sg*130} ${by-100} ${sx+sg*150} ${by-105}`;
        else path=`M${sx} ${by} L ${sx+sg*d.h*1.1} ${Math.max(by-d.h,70)}`;
        E('path',{d:path,fill:'none',stroke:'var(--eosin)','stroke-width':22,'stroke-linecap':'round',opacity:.85},svg);
        E('path',{d:path,fill:'none',stroke:'var(--eosin-soft)','stroke-width':14,'stroke-linecap':'round'},svg);
      }else{ // tubas no fundo
        E('path',{d:`M${cx+sg*30} ${bTop+10} C ${cx+sg*90} ${bTop-10} ${cx+sg*150} ${bTop+10} ${cx+sg*190} ${bTop-20}`,fill:'none',stroke:'var(--sky)','stroke-width':5},svg);
      }
    });
    if(d.h)T(svg,(k==='porca'||k==='vaca')?300:110,k==='egua'?150:((k==='porca'||k==='vaca')?110:70),'cornos',{fs:18,fill:'var(--eosin)'});
    else T(svg,500,bTop-34,'tubas',{fs:18,fill:'var(--sky)'});
    $('#ugutOut').innerHTML='<b>'+d.n+'</b><br>'+d.t;
  }
  choices('#ugutBtns',k=>draw(k));
})();
