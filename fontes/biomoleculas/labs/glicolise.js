const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;

/* ===== Laboratório 1: stepper da glicólise com contadores ===== */
(function(){
  if(!$('#glstSvg')) return;
  /* fase: 0 entrada, 1 investimento, 2 pagamento, 3 saldo; sub/pro: nomes curtos; cof: [texto, cor]; c: esqueleto (n de carbonos por grupo, fosfatos por grupo), x2: em dobro; cnt: [ATP gasto, ATP formado, NADH] acumulados; reg: irreversível/regulada */
  const S=[
    {f:0,enz:'Transportador GLUT',sub:'Glicose (sangue)',pro:'Glicose (citosol)',cof:['difusão facilitada, sem ATP','var(--muted)'],c:[[6,[]]],cnt:[0,0,0]},
    {f:1,enz:'1 · Hexoquinase',sub:'Glicose',pro:'Glicose-6-P',cof:['ATP → ADP','var(--eosin)'],c:[[6,[6]]],cnt:[1,0,0],reg:1},
    {f:1,enz:'2 · Fosfoglicose isomerase',sub:'Glicose-6-P',pro:'Frutose-6-P',cof:['aldose ⇄ cetose','var(--muted)'],c:[[6,[6]]],cnt:[1,0,0]},
    {f:1,enz:'3 · Fosfofrutoquinase-1',sub:'Frutose-6-P',pro:'Frutose-1,6-bisP',cof:['ATP → ADP','var(--eosin)'],c:[[6,[1,6]]],cnt:[2,0,0],reg:1},
    {f:1,enz:'4 · Aldolase',sub:'Frutose-1,6-bisP',pro:'DHAP + G3P',cof:['6 C → 3 C + 3 C','var(--muted)'],c:[[3,[1]],[3,[3]]],cnt:[2,0,0]},
    {f:1,enz:'5 · Triose-fosfato isomerase',sub:'DHAP',pro:'G3P (agora 2 G3P)',cof:['DHAP ⇄ G3P','var(--muted)'],c:[[3,[3]],[3,[3]]],cnt:[2,0,0]},
    {f:2,enz:'6 · G3P desidrogenase',sub:'2 × G3P',pro:'2 × 1,3-BPG',cof:['2 NAD⁺ + 2 Pi → 2 NADH','var(--sky)'],c:[[3,[1,3]],[3,[1,3]]],cnt:[2,0,2]},
    {f:2,enz:'7 · Fosfoglicerato-cinase',sub:'2 × 1,3-BPG',pro:'2 × 3-PG',cof:['2 ADP → 2 ATP','var(--ok)'],c:[[3,[3]],[3,[3]]],cnt:[2,2,2]},
    {f:2,enz:'8 · Fosfoglicerato mutase',sub:'2 × 3-PG',pro:'2 × 2-PG',cof:['fosfato: C3 → C2','var(--muted)'],c:[[3,[2]],[3,[2]]],cnt:[2,2,2]},
    {f:2,enz:'9 · Enolase',sub:'2 × 2-PG',pro:'2 × PEP',cof:['sai 2 H₂O · fluoreto inibe','var(--muted)'],c:[[3,[2]],[3,[2]]],cnt:[2,2,2]},
    {f:2,enz:'10 · Piruvato quinase',sub:'2 × PEP',pro:'2 × Piruvato',cof:['2 ADP → 2 ATP','var(--ok)'],c:[[3,[]],[3,[]]],cnt:[2,4,2],reg:1},
    {f:3,enz:'Saldo da glicólise',sub:'Glicose',pro:'2 Piruvato',cof:['4 ATP − 2 ATP = 2 ATP · 2 NADH','var(--ok)'],c:[[3,[]],[3,[]]],cnt:[2,4,2]}
  ];
  const FASE=['Entrada na célula','Fase de investimento','Fase de pagamento (tudo ×2)','Resultado final'];
  const FC=['var(--muted)','var(--eosin)','var(--ok)','var(--hema)'];
  const TX=[
    ['A glicose entra na célula','Pelo GLUT do tecido (GLUT1 na hemácia, GLUT4 no músculo com insulina, GLUT2 no fígado), por difusão facilitada, a favor do gradiente. Nenhum ATP é gasto ainda.'],
    ['Hexoquinase: o primeiro investimento','O fosfato do ATP vai para o C6. A glicose-6-fosfato tem carga e <b>fica presa</b> no citosol. Reação irreversível; a hexoquinase é inibida pelo próprio produto. No fígado, a glicoquinase faz o mesmo quando a glicemia está alta.'],
    ['Isomerização','A glicose-6-P (aldose, anel de 6) vira frutose-6-P (cetose, anel de 5). Isso deixa o C1 livre para receber um fosfato na próxima reação.'],
    ['PFK-1: o passo comprometido','Segundo ATP gasto. A frutose-1,6-bisfosfato só tem um destino: seguir na glicólise. Por isso a PFK-1 é o principal ponto de controle (freada por ATP e citrato, acelerada por AMP e frutose-2,6-bisfosfato).'],
    ['Aldolase: a quebra','A hexose com dois fosfatos se parte ao meio: <b>di-hidroxiacetona-fosfato (DHAP)</b> e <b>gliceraldeído-3-fosfato (G3P)</b>, cada uma com 3 carbonos e um fosfato.'],
    ['Triose-fosfato isomerase','A DHAP é convertida em G3P. Agora há <b>2 G3P por glicose</b>: daqui em diante, cada reação acontece duas vezes. Fim da fase de investimento, com 2 ATP gastos e nada recuperado ainda.'],
    ['GAPDH: a única oxidação','Cada G3P é oxidado; os elétrons vão para o NAD⁺ (<b>+2 NADH</b>), e a energia prende um <b>fosfato inorgânico</b> numa ligação de alta energia (1,3-bisfosfoglicerato). Sem NAD⁺ disponível, a glicólise para aqui.'],
    ['Primeira fosforilação no nível do substrato','O fosfato de alta energia do 1,3-BPG passa direto para o ADP: <b>+2 ATP</b>. Os 2 ATP investidos foram recuperados (saldo zero).'],
    ['Mutase','O fosfato muda do C3 para o C2 (3-fosfoglicerato → 2-fosfoglicerato).'],
    ['Enolase','Sai uma água e forma-se o <b>fosfoenolpiruvato (PEP)</b>, de energia muito alta. O fluoreto do tubo de tampa cinza inibe esta enzima e preserva a glicose da amostra.'],
    ['Piruvato quinase','Segunda fosforilação no nível do substrato: <b>+2 ATP</b>. Irreversível e regulada (ativada pela frutose-1,6-bisfosfato; no fígado, desligada pelo glucagon).'],
    ['Saldo','Glicose + 2 NAD⁺ + 2 ADP + 2 Pi → <b>2 piruvato + 2 NADH + 2 ATP</b> + 2 H₂O. Sem O₂, o piruvato vira lactato para devolver o NAD⁺; com O₂, vai para a mitocôndria (cap. 5).']
  ];
  function box(svg,x,txt,col){E('rect',{x,y:78,width:262,height:52,rx:12,fill:'var(--panel)',stroke:col,'stroke-width':2.5},svg);T(svg,x+131,111,txt,{fs:txt.length>17?18:20,w:700})}
  function stat(svg,x,lab,v,col){E('rect',{x,y:262,width:140,height:70,rx:12,fill:'var(--panel)',stroke:'var(--line)'},svg);T(svg,x+70,286,lab,{fs:18,fill:'var(--muted)'});T(svg,x+70,322,v,{fs:28,w:800,fill:col})}
  function draw(svg,i){
    const s=S[i];
    T(svg,10,28,FASE[s.f],{fs:20,a:'start',w:800,fill:FC[s.f]});
    if(i>=1&&i<=10)T(svg,590,28,'reação '+i+' de 10',{fs:18,a:'end',fill:'var(--muted)'});
    T(svg,300,62,s.enz+(s.reg?'  ⚑':''),{fs:22,w:800,fill:s.reg?'var(--eosin)':'var(--ink)'});
    box(svg,8,s.sub,'var(--line)');box(svg,330,s.pro,FC[s.f]);
    E('path',{d:'M274 104 h48 m-9 -8 l9 8 l-9 8',fill:'none',stroke:'var(--ink)','stroke-width':3},svg);
    T(svg,300,160,s.cof[0],{fs:19,w:700,fill:s.cof[1]});
    /* esqueleto de carbonos */
    const groups=s.c,r=15,dx=40,gw=g=>g[0]*dx,total=groups.reduce((a,g)=>a+gw(g),0)+(groups.length-1)*50;let x0=300-total/2+dx/2;
    groups.forEach(g=>{for(let k=0;k<g[0];k++){const x=x0+k*dx;if(k)E('line',{x1:x-dx+r,y1:226,x2:x-r,y2:226,stroke:'var(--ink)','stroke-width':2.5},svg);
        E('circle',{cx:x,cy:226,r,fill:'var(--hema-soft)',stroke:'var(--hema)','stroke-width':2},svg);T(svg,x,232,'C',{fs:18,w:700,fill:'var(--hema)'});
        if(g[1].includes(k+1)){E('line',{x1:x,y1:211,x2:x,y2:200,stroke:'var(--amber)','stroke-width':2.5},svg);E('circle',{cx:x,cy:188,r:13,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':2},svg);T(svg,x,194,'P',{fs:18,w:800,fill:'var(--amber)'})}}
      x0+=gw(g)+50});
    const c=s.cnt;
    stat(svg,8,'ATP gasto',c[0]?'−'+c[0]:'0','var(--eosin)');stat(svg,158,'ATP formado',c[1]?'+'+c[1]:'0','var(--ok)');
    stat(svg,308,'NADH',c[2]?'+'+c[2]:'0','var(--sky)');const sal=c[1]-c[0];stat(svg,458,'Saldo ATP',(sal>0?'+':sal<0?'−':'')+Math.abs(sal),sal<0?'var(--eosin)':sal>0?'var(--ok)':'var(--ink)');
    if(!reduce&&(i===1||i===3||i===6||i===7||i===10)){const hi=i===6?308:(i===7||i===10)?158:8;const r=E('rect',{x:hi,y:262,width:140,height:70,rx:12,fill:'none',stroke:'var(--amber)','stroke-width':3},svg);E('animate',{attributeName:'opacity',values:'0;1;0',dur:'1.2s',repeatCount:'3'},r)}
  }
  stepper('glst',TX,draw);
})();

/* ===== Laboratório 2: com ou sem oxigênio ===== */
(function(){
  const s=$('#gloxSvg'); if(!s) return;
  const out=$('#gloxOut'),rg=$('#gloxO2'),val=$('#gloxVal');
  let tipo='mus';
  function draw(){
    const o2=+rg.value,f=tipo==='hem'?0:o2/100;val.textContent=o2+'%';rg.disabled=tipo==='hem';
    const atp=2+28*f,glc=100/atp,lac=glc*2*(1-f);clear(s);
    /* via à esquerda */
    E('rect',{x:70,y:12,width:150,height:40,rx:10,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':2},s);T(s,145,39,'Glicose',{fs:20,w:700});
    E('line',{x1:145,y1:52,x2:145,y2:96,stroke:'var(--ink)','stroke-width':3},s);T(s,155,80,'+2 ATP',{fs:18,a:'start',fill:'var(--ok)',w:700});
    E('rect',{x:70,y:98,width:150,height:40,rx:10,fill:'var(--panel)',stroke:'var(--ink)','stroke-width':2},s);T(s,145,125,'2 Piruvato',{fs:20,w:700});
    const wl=2+14*(1-f),wa=2+14*f;
    E('path',{d:'M120 138 L60 200',fill:'none',stroke:'var(--eosin)','stroke-width':wl,opacity:(1-f)*0.85+0.15},s);
    E('path',{d:'M170 138 L230 200',fill:'none',stroke:'var(--ok)','stroke-width':wa,opacity:f*0.85+0.15},s);
    E('rect',{x:4,y:202,width:116,height:40,rx:10,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2,opacity:(1-f)*0.7+0.3},s);T(s,62,229,'Lactato',{fs:20,w:700,fill:'var(--eosin)'});
    E('rect',{x:160,y:202,width:136,height:40,rx:10,fill:'var(--ok-soft)',stroke:'var(--ok)','stroke-width':2,opacity:f*0.7+0.3},s);T(s,228,229,tipo==='hem'?'sem mitoc.':'Mitocôndria',{fs:19,w:700,fill:'var(--ok)'});
    T(s,62,270,'devolve NAD⁺',{fs:18,fill:'var(--muted)'});T(s,228,270,'CO₂ + H₂O',{fs:18,fill:'var(--muted)'});
    if(!reduce&&f<1){const c=E('circle',{r:6,fill:'var(--eosin)'},s);E('animateMotion',{path:'M120 138 L60 200',dur:'1.2s',repeatCount:'indefinite'},c)}
    if(!reduce&&f>0){const c=E('circle',{r:6,fill:'var(--ok)'},s);E('animateMotion',{path:'M170 138 L230 200',dur:'1.2s',repeatCount:'indefinite'},c)}
    /* barras à direita */
    const bars=[['ATP por glicose',atp,32,atp.toFixed(0),'var(--ok)'],['Glicoses para 100 ATP',glc,50,glc.toFixed(glc<10?1:0).replace('.',','),'var(--sky)'],['Lactato para 100 ATP',lac,100,lac.toFixed(0),'var(--eosin)']];
    bars.forEach((b,k)=>{const y=30+k*88;T(s,320,y,b[0],{fs:18,a:'start',w:700});
      E('rect',{x:320,y:y+12,width:230,height:30,rx:6,fill:'var(--panel)',stroke:'var(--line)'},s);
      E('rect',{x:320,y:y+12,width:Math.max(2,230*b[1]/b[2]),height:30,rx:6,fill:b[4]},s);
      T(s,592,y+35,b[3],{fs:20,a:'end',w:800})});
    let msg;
    if(tipo==='hem')msg='<b>Hemácia</b>: sem mitocôndria, todo piruvato vira <b>lactato</b>, mesmo com muito oxigênio ao redor. Rende só <b>2 ATP por glicose</b>, por isso ela consome glicose sem parar. O lactato vai para o fígado (ciclo de Cori).';
    else if(f>=0.9)msg='<b>Oxigênio suficiente</b>: o NADH devolve elétrons à cadeia respiratória, o NAD⁺ é regenerado na mitocôndria e o piruvato vira acetil-CoA. Cerca de <b>'+atp.toFixed(0)+' ATP por glicose</b> (cap. 5): pouca glicose gasta e quase nada de lactato.';
    else if(f>0.1)msg='<b>Oxigênio parcial</b> (exercício intenso, anemia, choque leve): parte do piruvato não cabe na mitocôndria e vira lactato. O rendimento médio cai para <b>'+atp.toFixed(0)+' ATP por glicose</b>, e o consumo de glicose e o lactato sobem.';
    else msg='<b>Sem oxigênio</b> (sprint máximo, isquemia, choque grave): só a glicólise, <b>2 ATP por glicose</b>. Para a mesma energia são necessárias cerca de <b>15 vezes mais glicose</b>, e cada glicose vira 2 lactatos. É o cenário da hiperlactatemia.';
    out.innerHTML=msg+'<br><span style="color:var(--muted)">Considerando ≈ 30 ATP por glicose na oxidação completa.</span>';
  }
  rg.addEventListener('input',draw);
  choices('#gloxBtns',k=>{tipo=k;draw()});
})();
