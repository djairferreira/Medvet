const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;

/* ============ 1. Simulador de glicemia (ggs) ============ */
(()=>{const s=$('#ggsSvg');if(!s)return;const out=$('#ggsOut');
  const SP={cao:{b:95,lo:70,hi:120,thr:200,nm:'Cão'},gato:{b:100,lo:70,hi:150,thr:270,nm:'Gato'},vaca:{b:60,lo:45,hi:75,thr:null,nm:'Vaca'}};
  const bump=(t,tp)=>(t/tp)*Math.exp(1-t/tp), sat=(t,k)=>1-Math.exp(-k*t);
  const SC={
    basal:{T:'6 h',f:(t,p)=>p.b+3*Math.sin(t*14),ins:.35,glu:.35,
      txt:p=>'<b>Estado basal (pós-absortivo).</b> Glicemia estável dentro da faixa normal. Insulina e glucagon em níveis intermediários: o fígado libera glicose na mesma velocidade em que os tecidos a consomem.',
      org:['Libera glicose lentamente (glicogenólise + gliconeogênese leve)','Usa ácidos graxos e um pouco de glicose','Lipólise basal; libera ácidos graxos']},
    refeicao:{T:'6 h',f:(t,p,k)=>p.b+({cao:45,gato:55,vaca:6})[k]*bump(t,({cao:.18,gato:.32,vaca:.4})[k]),ins:.9,glu:.12,
      txt:(p,k)=>k==='vaca'?'<b>Refeição no ruminante.</b> Quase nada sobe: o amido e a fibra são fermentados no rúmen a <b>ácidos graxos voláteis</b>, e pouca glicose chega ao intestino. A insulina sobe moderadamente (o propionato e os aminoácidos também a estimulam). A gliconeogênese a partir do propionato <b>continua ligada</b> mesmo após comer.'
        :k==='gato'?'<b>Refeição no gato.</b> O pico é mais lento e a volta ao normal demora mais que no cão: o fígado felino tem pouca glicocinase e a gliconeogênese a partir de aminoácidos não desliga. Por isso dietas ricas em carboidrato pioram o controle glicêmico de gatos obesos ou diabéticos.'
        :'<b>Refeição no cão.</b> A glicose absorvida eleva a glicemia; a célula β libera <b>insulina</b> e o glucagon cai. Os tecidos captam glicose, o fígado guarda glicogênio e a glicemia volta à faixa normal em 2 a 3 horas.',
      org:['Glicocinase ativa: <b>glicogênese</b> e lipogênese; gliconeogênese desligada','<b>GLUT4</b> na membrana: capta glicose e faz glicogênio','GLUT4 + lipoproteína lipase: <b>lipogênese</b>; lipólise inibida']},
    jejum:{T:'24 h',f:(t,p,k)=>p.b-({cao:15,gato:8,vaca:8})[k]*sat(t,4),ins:.15,glu:.7,
      txt:(p,k)=>'<b>Jejum de 24 horas.</b> A insulina cai e o <b>glucagon</b> sobe. Nas primeiras horas o fígado mantém a glicemia quebrando glicogênio; no fim do período o glicogênio hepático está quase esgotado e a <b>gliconeogênese</b> assume.'+(k==='gato'?' No gato a mudança é pequena: a gliconeogênese já estava ligada.':''),
      org:['<b>Glicogenólise</b> (glicose-6-fosfatase) e gliconeogênese crescente','Poupa glicose: oxida ácidos graxos; libera alanina e lactato','<b>Lipólise</b>: ácidos graxos e glicerol para o fígado']},
    jejumlongo:{T:'5 dias',f:(t,p,k)=>p.b-({cao:20,gato:14,vaca:22})[k]*sat(t,3),ins:.08,glu:.85,
      txt:(p,k)=>'<b>Jejum prolongado.</b> Glicogênio esgotado: toda a glicose vem da <b>gliconeogênese</b> (aminoácidos do músculo, glicerol, lactato). A lipólise é intensa e o fígado produz <b>corpos cetônicos</b>, que o cérebro passa a usar, poupando proteína muscular. O cortisol ajuda a manter a via.'+(k==='gato'?' <b>Risco:</b> o gato obeso em anorexia mobiliza mais gordura do que o fígado consegue exportar e desenvolve <b>lipidose hepática</b>.':k==='vaca'?' Na vaca em balanço energético negativo a glicemia cai e surgem cetonemia e <b>cetose</b> (cap. 8).':''),
      org:['<b>Gliconeogênese</b> máxima + <b>cetogênese</b>','Proteólise libera aminoácidos; usa ácidos graxos e corpos cetônicos','Lipólise intensa (glucagon, adrenalina, cortisol, GH)']},
    exercicio:{T:'2 h',f:(t,p)=>p.b+6*bump(t,.08)-12*t,ins:.12,glu:.6,
      txt:(p,k)=>'<b>Exercício prolongado.</b> A <b>adrenalina</b> sobe e a insulina cai. O músculo em contração leva o <b>GLUT4</b> à membrana <b>sem precisar de insulina</b> e quebra seu próprio glicogênio (Ca²⁺ e AMP ativam a fosforilase). O fígado acelera glicogenólise e gliconeogênese (lactato e alanina vindos do músculo: ciclos de Cori e glicose-alanina). Em esforço muito longo, a glicemia cai: é a hipoglicemia do cão de caça.',
      org:['Glicogenólise e <b>gliconeogênese</b> (lactato, alanina)','Glicogenólise local; GLUT4 por contração; oxida glicose e ácidos graxos','Lipólise pela adrenalina: ácidos graxos para o músculo']},
    estresse:{T:'60 min',f:(t,p,k)=>p.b+({cao:40,gato:170,vaca:30})[k]*sat(t,6),ins:.3,glu:.6,
      txt:(p,k)=>'<b>Estresse agudo</b> (contenção, transporte, dor, medo). Catecolaminas e cortisol elevam a glicemia: glicogenólise hepática, gliconeogênese e inibição da secreção de insulina pela adrenalina.'+(k==='gato'?' <b>No gato a resposta é enorme</b>: a glicemia passa do limiar renal e pode ser confundida com diabetes. A frutosamina normal desfaz a dúvida.':k==='vaca'?' Bovinos transportados ou em dor (por exemplo, deslocamento de abomaso) também mostram hiperglicemia.':''),
      org:['Glicogenólise (adrenalina) e gliconeogênese (cortisol)','Glicogenólise para uso próprio; menos captação (cortisol)','Lipólise; ácidos graxos no sangue']},
    diabetes:{T:'8 h',f:(t,p,k)=>(k==='vaca'?150:240)+({cao:130,gato:120,vaca:60})[k]*sat(t,5)-25*t,ins:.03,glu:.7,
      txt:(p,k)=>'<b>Refeição sem insulina (diabetes melito).</b> A glicose absorvida não entra no músculo nem no adiposo (sem GLUT4), e o fígado, sem o freio da insulina e com glucagon alto, <b>continua produzindo glicose</b>. A glicemia passa o <b>limiar renal</b>: glicosúria, poliúria osmótica e polidipsia. Lipólise sem controle gera corpos cetônicos e pode levar à <b>cetoacidose</b>.'+(k==='vaca'?' Diabetes é raro em bovinos; a simulação é só comparativa.':''),
      org:['Glicogenólise e gliconeogênese <b>sem freio</b>; cetogênese','Sem GLUT4: “fome no meio da abundância”; proteólise','Lipólise descontrolada; perda de peso']}};
  let sp='cao',sc='basal';
  const X0=70,X1=585,Y0=212,Y1=18,VMAX=420,y=v=>Y0-(Math.max(0,Math.min(VMAX,v))/VMAX)*(Y0-Y1);
  const draw=()=>{clear(s);const p=SP[sp],c=SC[sc];
    E('rect',{x:X0,y:y(p.hi),width:X1-X0,height:y(p.lo)-y(p.hi),fill:'var(--ok-soft)'},s);
    T(s,X1-6,p.hi<100?y(p.hi)-24:y(p.hi)-6,'faixa normal',{fs:18,a:'end',w:600,fill:'var(--ok)'});
    [100,200,300,400].forEach(v=>{E('line',{x1:X0,x2:X1,y1:y(v),y2:y(v),stroke:'var(--line)','stroke-width':1},s);T(s,X0-8,y(v)+6,String(v),{fs:18,a:'end',w:500,fill:'var(--muted)'})});
    E('line',{x1:X0,x2:X0,y1:Y1,y2:Y0,stroke:'var(--muted)','stroke-width':2},s);E('line',{x1:X0,x2:X1,y1:Y0,y2:Y0,stroke:'var(--muted)','stroke-width':2},s);
    if(p.thr){E('line',{x1:X0,x2:X1,y1:y(p.thr),y2:y(p.thr),stroke:'var(--bad)','stroke-width':2,'stroke-dasharray':'7 6'},s);
      T(s,X0+8,y(p.thr)-7,'limiar renal',{fs:18,a:'start',w:600,fill:'var(--bad)'})}
    T(s,X0,Y0+24,'0',{fs:18,w:500,fill:'var(--muted)'});T(s,X1,Y0+24,c.T,{fs:18,a:'end',w:600,fill:'var(--muted)'});
    T(s,(X0+X1)/2,Y0+24,'mg/dL × tempo',{fs:18,w:500,fill:'var(--muted)'});
    let d='',last=0;for(let i=0;i<=60;i++){const t=i/60,v=c.f(t,p,sp);last=v;d+=(i?'L':'M')+(X0+t*(X1-X0)).toFixed(1)+','+y(v).toFixed(1)}
    const path=E('path',{d,fill:'none',stroke:'var(--eosin)','stroke-width':4,'stroke-linejoin':'round',pathLength:1},s);
    if(!reduce){path.setAttribute('stroke-dasharray','1');E('animate',{attributeName:'stroke-dashoffset',from:1,to:0,dur:'1.2s',fill:'freeze'},path)}
    let ins=c.ins;if(sc==='refeicao'&&sp==='vaca')ins=.45;if(sc==='estresse'&&sp==='gato')ins=.25;
    [['Insulina',ins,'var(--sky)'],['Glucagon',c.glu,'var(--amber)']].forEach(([lab,v,col],j)=>{const yy=262+j*44;
      T(s,10,yy+20,lab,{fs:18,a:'start',w:700});
      E('rect',{x:120,y:yy,width:460,height:28,rx:14,fill:'var(--paper)',stroke:'var(--line)','stroke-width':1.5},s);
      const w=Math.max(8,460*v),r=E('rect',{x:120,y:yy,width:w,height:28,rx:14,fill:col},s);
      if(!reduce)E('animate',{attributeName:'width',from:8,to:w,dur:'.8s',fill:'freeze'},r)});
    const fim=Math.round(last);
    out.innerHTML=`<p style="margin:0 0 8px"><span class="mono" style="color:var(--muted)">${p.nm} · normal ${p.lo}–${p.hi} mg/dL · ao final: ~${fim} mg/dL</span><br>${c.txt(p,sp)}</p>
      <div class="gg-org"><div><b>Fígado</b><span>${c.org[0]}</span></div><div><b>Músculo</b><span>${c.org[1]}</span></div><div><b>Tecido adiposo</b><span>${c.org[2]}</span></div></div>`};
  choices('#ggsSp',k=>{sp=k;draw()});
  choices('#ggsBtns',k=>{sc=k;draw()});
})();

/* ============ 2. Classificador: vira glicose ou não? (ggq) ============ */
(()=>{const s=$('#ggqSvg');if(!s)return;const out=$('#ggqOut'),g=$('#ggqBtns'),rs=$('#ggqReset');
  const IT=[['Lactato',1,'Vira piruvato (lactato desidrogenase) e depois glicose: ciclo de Cori.'],
    ['Alanina',1,'Transaminada a piruvato: ciclo glicose-alanina.'],
    ['Glicerol',1,'Glicerol-cinase hepática → glicerol-3-fosfato → di-hidroxiacetona-fosfato.'],
    ['Propionato',1,'Propionil-CoA → metilmalonil-CoA → succinil-CoA (biotina e B12). Principal fonte de glicose do ruminante.'],
    ['Glutamina',1,'Vira glutamato e α-cetoglutarato, que percorre o ciclo até oxaloacetato.'],
    ['Aspartato',1,'Transaminado diretamente a oxaloacetato.'],
    ['Acetato',0,'Só gera acetil-CoA, que não dá ganho líquido de oxaloacetato: cada acetil que entra no ciclo de Krebs equivale a dois CO₂ que saem.'],
    ['Butirato',0,'Ácido graxo de cadeia par: gera acetil-CoA (e corpos cetônicos no epitélio ruminal).'],
    ['Ácido palmítico',0,'Ácido graxo de 16 carbonos: β-oxidação só produz acetil-CoA.'],
    ['Leucina',0,'Aminoácido exclusivamente cetogênico: gera acetil-CoA e acetoacetato.'],
    ['Lisina',0,'Exclusivamente cetogênico, como a leucina.'],
    ['Acetil-CoA',0,'A piruvato desidrogenase é irreversível; mamíferos não têm o ciclo do glioxilato.']];
  let fila,idx,feitos,ok;
  const reset=()=>{fila=shuffle(IT);idx=0;feitos=[];ok=0;draw();ask()};
  const ask=(msg='')=>{if(idx<fila.length){out.innerHTML=(msg?msg+'<br>':'')+`<span class="mono" style="color:var(--muted)">${idx+1} de ${fila.length}</span> · Substância: <b>${fila[idx][0]}</b>. Ela pode virar glicose no fígado de um mamífero?`}
    else out.innerHTML=(msg?msg+'<br>':'')+`<b>Fim: ${ok} de ${fila.length} acertos.</b> Regra geral: gera glicose o que chega a piruvato, oxaloacetato ou outro intermediário do ciclo de Krebs com mais de dois carbonos “sobrando”; o que só gera acetil-CoA não gera. Clique em Embaralhar para repetir.`};
  const draw=()=>{clear(s);[[15,'Gera glicose','var(--ok)'],[310,'Não gera glicose','var(--bad)']].forEach(([x,lab,col])=>{
      E('rect',{x,y:12,width:275,height:262,rx:14,fill:'var(--panel)',stroke:col,'stroke-width':2},s);T(s,x+137,42,lab,{fs:20,w:800,fill:col})});
    const n=[0,0];feitos.forEach(([nm,cor,acertou])=>{const col=cor?0:1,x=(col?310:15)+20,yy=80+n[col]*32;n[col]++;
      const t=T(s,x,yy,(acertou?'✓ ':'✗ ')+nm,{fs:19,a:'start',w:700,fill:acertou?'var(--ok)':'var(--bad)'});
      if(!reduce)E('animate',{attributeName:'opacity',from:0,to:1,dur:'.4s',fill:'freeze'},t)});
    T(s,300,310,idx<fila.length?'Agora: '+fila[idx][0]:'Placar: '+ok+' de '+fila.length,{fs:22,w:800,fill:'var(--eosin)'})};
  g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||idx>=fila.length)return;
    const it=fila[idx],resp=b.dataset.k==='sim'?1:0,acertou=resp===it[1];if(acertou)ok++;
    feitos.push([it[0],it[1],acertou]);idx++;draw();
    ask(`${acertou?'<b style="color:var(--ok)">Certo.</b>':'<b style="color:var(--bad)">Errado.</b>'} ${it[0]}: ${it[2]}`)});
  rs&&rs.addEventListener('click',reset);reset();
})();
