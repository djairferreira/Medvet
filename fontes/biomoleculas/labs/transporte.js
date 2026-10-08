const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;

/* ---------- 1) Cinética: difusão simples × facilitada ---------- */
(function(){
  const s=$('#trkSvg');if(!s)return;
  const cIn=$('#trkC'),pIn=$('#trkP'),out=$('#trkOut');
  const X0=78,X1=575,Y0=272,Y1=40,CMAX=30,JMAX=30;
  const px=c=>X0+(X1-X0)*c/CMAX,py=j=>Y0-(Y0-Y1)*Math.min(j,JMAX)/JMAX;
  const MODES={base:{v:10,km:5,n:'Músculo em repouso'},ins:{v:25,km:5,n:'Com insulina'},comp:{v:10,km:15,n:'Com inibidor competitivo'}};
  let mode='base';
  const f1=v=>v.toFixed(1).replace('.',',');const fac=(m,c)=>m.v*c/(m.km+c);
  const pl=['muito baixa','baixa','baixa','moderada','moderada','média','média','alta','alta','muito alta'];
  function curve(f,st){let d='';for(let i=0;i<=120;i++){const c=CMAX*i/120;d+=(i?'L':'M')+px(c).toFixed(1)+' '+py(f(c)).toFixed(1)}return E('path',Object.assign({d,fill:'none','stroke-width':4,'stroke-linecap':'round'},st),s)}
  function draw(){
    clear(s);const C=+cIn.value,P=+pIn.value,k=P*0.06,m=MODES[mode];
    $('#trkCv').textContent=C+' mM';$('#trkPv').textContent=pl[P-1];
    /* grade e eixos */
    for(let j=0;j<=JMAX;j+=10){E('line',{x1:X0,x2:X1,y1:py(j),y2:py(j),stroke:'var(--line)','stroke-width':1},s);T(s,X0-12,py(j)+6,String(j),{fs:18,a:'end',w:500,fill:'var(--muted)'})}
    for(let c=0;c<=CMAX;c+=10)T(s,px(c),Y0+26,String(c),{fs:18,w:500,fill:'var(--muted)'});
    E('line',{x1:X0,x2:X1,y1:Y0,y2:Y0,stroke:'var(--ink)','stroke-width':2},s);E('line',{x1:X0,x2:X0,y1:Y0,y2:Y1-10,stroke:'var(--ink)','stroke-width':2},s);
    T(s,(X0+X1)/2,Y0+52,'Concentração externa (mM)',{fs:18,w:600});
    T(s,22,(Y0+Y1)/2,'Fluxo',{fs:18,w:600,extra:{transform:`rotate(-90 22 ${(Y0+Y1)/2})`}});
    /* Vmax */
    E('line',{x1:X0,x2:X1,y1:py(m.v),y2:py(m.v),stroke:'var(--eosin)','stroke-width':1.5,'stroke-dasharray':'6 6'},s);
    T(s,X1-4,py(m.v)-8,'Vmáx',{fs:18,a:'end',fill:'var(--eosin)'});
    if(mode!=='base')curve(c=>fac(MODES.base,c),{stroke:'var(--muted)','stroke-dasharray':'4 7','stroke-width':3});
    curve(c=>k*c,{stroke:'var(--sky)'});
    const pf=curve(c=>fac(m,c),{stroke:'var(--eosin)'});
    if(!reduce){const L=pf.getTotalLength();pf.style.strokeDasharray=L;pf.style.strokeDashoffset=L;pf.getBoundingClientRect();pf.style.transition='stroke-dashoffset .7s ease';requestAnimationFrame(()=>pf.style.strokeDashoffset=0)}
    /* marcador */
    E('line',{x1:px(C),x2:px(C),y1:Y0,y2:Y1,stroke:'var(--ink)','stroke-width':1.5,'stroke-dasharray':'3 5'},s);
    const jf=fac(m,C),js=k*C;
    E('circle',{cx:px(C),cy:py(jf),r:8,fill:'var(--eosin)',stroke:'var(--panel)','stroke-width':2},s);
    E('circle',{cx:px(C),cy:py(js),r:8,fill:'var(--sky)',stroke:'var(--panel)','stroke-width':2},s);
    /* legenda */
    E('rect',{x:X0+14,y:Y1-4,width:22,height:6,rx:3,fill:'var(--eosin)'},s);T(s,X0+44,Y1+4,'Carreador',{fs:18,a:'start',fill:'var(--eosin)'});
    E('rect',{x:X0+164,y:Y1-4,width:22,height:6,rx:3,fill:'var(--sky)'},s);T(s,X0+194,Y1+4,'Difusão simples',{fs:18,a:'start',fill:'var(--sky)'});
    const sat=Math.round(100*C/(m.km+C));
    let msg=`<b>${m.n}.</b> A ${C} mM, o carreador transporta <b>${f1(jf)}</b> unidades/s (${sat}% da V<sub>máx</sub>) e a difusão simples, <b>${f1(js)}</b>. `;
    if(C===0)msg+='Sem gradiente, não há fluxo líquido em nenhum dos dois: ambos são passivos.';
    else if(sat>=80)msg+='O carreador está quase saturado: aumentar a concentração quase não muda o fluxo. A difusão simples, ao contrário, continua subindo em linha reta (lei de Fick).';
    else if(C<=m.km)msg+=`Abaixo do K<sub>m</sub> (${m.km} mM) o carreador responde quase em linha reta à concentração e é muito mais eficiente que a bicamada.`;
    else msg+='O carreador começa a dobrar a curva: cada aumento de concentração rende cada vez menos fluxo.';
    if(mode==='ins')msg+=' A insulina levou mais GLUT4 à membrana: a V<sub>máx</sub> subiu (mais portas), mas o K<sub>m</sub> não mudou (a afinidade de cada porta é a mesma).';
    if(mode==='comp')msg+=' O inibidor competitivo disputa o sítio: o K<sub>m</sub> aparente subiu (de 5 para 15 mM), mas com glicose suficiente a V<sub>máx</sub> ainda é atingida.';
    if(js>jf&&C>0)msg+=' Note: com permeabilidade alta e concentração alta, a difusão simples pode superar um carreador saturado.';
    out.innerHTML=msg;
  }
  cIn.addEventListener('input',draw);pIn.addEventListener('input',draw);
  choices('#trkBtns',k=>{mode=k;draw()});
})();

/* ---------- 2) Ciclo da Na+/K+-ATPase ---------- */
(function(){
  const s=$('#trnkSvg');if(!s)return;
  const steps=[
    ['E1: aberta para o citosol','A bomba está na conformação <b>E1</b>, com os sítios voltados para dentro e alta afinidade por Na⁺. Três <b>Na⁺</b> do citosol se ligam. O ATP se aproxima do domínio de ligação de nucleotídeo.'],
    ['Fosforilação e oclusão','O ATP transfere seu fosfato γ para um <b>aspartato</b> da subunidade α (por isso “ATPase do tipo P”). O ADP sai. Os três Na⁺ ficam <b>ocluídos</b>: presos, sem acesso a nenhum dos lados.'],
    ['E2-P: aberta para fora, Na⁺ liberado','A fosforilação faz a proteína mudar para <b>E2-P</b>, aberta para o LEC e com <b>baixa afinidade por Na⁺</b>. Os três Na⁺ saem, contra o gradiente (o LEC já tem cerca de 145 mEq/L). É nessa forma que a <b>ouabaína e a digoxina</b> se ligam e travam a bomba.'],
    ['Ligação de 2 K⁺','Na forma E2-P a afinidade por <b>K⁺</b> é alta. Dois K⁺ extracelulares se ligam aos sítios. (Hipocalemia diminui essa ligação e facilita a ligação do digitálico: por isso piora a intoxicação.)'],
    ['Desfosforilação','A ligação do K⁺ estimula a remoção do fosfato (sai <b>Pi</b>). Os dois K⁺ ficam ocluídos e a proteína volta para a conformação E1.'],
    ['E1: K⁺ liberado no citosol','Aberta para dentro, a bomba perde a afinidade por K⁺, que é liberado no citosol (já com cerca de 140 mEq/L). Saldo do ciclo: <b>3 Na⁺ para fora, 2 K⁺ para dentro, 1 ATP gasto</b> e uma carga positiva líquida exportada (bomba <b>eletrogênica</b>). Um novo ciclo começa; cada bomba completa até cerca de 100 ciclos por segundo.']
  ];
  const NA=[[272,198],[300,158],[328,198]],K=[[281,172],[319,172]];
  function ion(p,x,y,t,from){const g=E('g',{},p);E('circle',{cx:x,cy:y,r:17,fill:t==='Na'?'var(--eosin)':'var(--sky)',stroke:'var(--panel)','stroke-width':2},g);
    T(g,x,y+6,t,{fs:18,w:800,fill:'var(--panel)'});
    if(from&&!reduce){E('animateTransform',{attributeName:'transform',type:'translate',from:(from[0]-x)+' '+(from[1]-y),to:'0 0',dur:'0.9s',fill:'freeze'},g)}return g}
  function tag(p,x,y,txt,col,from){const g=E('g',{},p);E('rect',{x:x-32,y:y-17,width:64,height:32,rx:8,fill:col,stroke:'var(--panel)','stroke-width':2},g);T(g,x,y+6,txt,{fs:18,w:800,fill:'var(--panel)'});
    if(from&&!reduce)E('animateTransform',{attributeName:'transform',type:'translate',from:(from[0]-x)+' '+(from[1]-y),to:'0 0',dur:'0.9s',fill:'freeze'},g);return g}
  function draw(svg,i){
    E('rect',{x:0,y:0,width:600,height:118,fill:'var(--sky-soft)'},svg);
    E('rect',{x:0,y:232,width:600,height:108,fill:'var(--amber-soft)'},svg);
    T(svg,14,30,'LEC',{fs:20,a:'start',w:800,fill:'var(--sky)'});T(svg,14,330,'Citosol',{fs:20,a:'start',w:800,fill:'var(--amber)'});
    /* bicamada */
    for(let x=6;x<600;x+=16){if(x>206&&x<394)continue;E('circle',{cx:x,cy:126,r:7,fill:'var(--bone-2)'},svg);E('circle',{cx:x,cy:224,r:7,fill:'var(--bone-2)'},svg);
      E('line',{x1:x-2,x2:x-2,y1:133,y2:172,stroke:'var(--bone-2)','stroke-width':2},svg);E('line',{x1:x+2,x2:x+2,y1:178,y2:217,stroke:'var(--bone-2)','stroke-width':2},svg)}
    /* gradientes decorativos */
    [[440,40],[480,78],[520,48],[560,86],[420,90],[90,70],[150,48],[180,92],[60,96]].forEach(([x,y])=>E('circle',{cx:x,cy:y,r:7,fill:'var(--eosin)',opacity:.55},svg));
    [[440,270],[500,300],[540,260],[110,270],[160,300],[200,262],[570,300]].forEach(([x,y])=>E('circle',{cx:x,cy:y,r:7,fill:'var(--sky)',opacity:.55},svg));
    /* proteína */
    const open=(i===0||i===5)?'in':(i===2||i===3)?'out':'occ';
    E('rect',{x:222,y:96,width:156,height:160,rx:34,fill:'var(--hema-soft)',stroke:'var(--hema)','stroke-width':3},svg);
    let cav;
    if(open==='in')cav='M246 258 L260 146 Q300 124 340 146 L354 258 Z';
    else if(open==='out')cav='M246 94 L260 206 Q300 228 340 206 L354 94 Z';
    else cav='M244 182 Q300 112 356 182 Q300 236 244 182 Z';
    E('path',{d:cav,fill:'var(--paper)',stroke:'var(--hema)','stroke-width':2},svg);
    T(svg,300,286,i===0||i===5?'E1':'E2-P',{fs:20,w:800,fill:'var(--hema)'});
    if(i===4)svg.lastChild.textContent='E2 → E1';
    if(i===1)svg.lastChild.textContent='E1-P';
    /* fosfato na proteína */
    if(i>=1&&i<=3){E('circle',{cx:378,cy:222,r:15,fill:'var(--amber)',stroke:'var(--panel)','stroke-width':2},svg);T(svg,378,228,'P',{fs:18,w:800,fill:'var(--panel)'})}
    /* íons e nucleotídeos */
    if(i===0){NA.forEach(([x,y],k)=>ion(svg,x,y+12,'Na',[x-120+k*20,300]));tag(svg,440,282,'ATP','var(--amber)',[540,320])}
    if(i===1){NA.forEach(([x,y])=>ion(svg,x,y-2,'Na'));tag(svg,470,300,'ADP','var(--muted)',[400,240])}
    if(i===2){[[250,50],[300,38],[350,58]].forEach(([x,y],k)=>ion(svg,x,y,'Na',NA[k]));
      E('path',{d:'M300 150 L300 84',stroke:'var(--eosin)','stroke-width':4,fill:'none'},svg)}
    if(i===3){K.forEach(([x,y],k)=>ion(svg,x,y-30,'K',[x+150-k*40,50]))}
    if(i===4){K.forEach(([x,y])=>ion(svg,x,y,'K'));tag(svg,470,300,'Pi','var(--amber)',[378,222])}
    if(i===5){[[262,300],[338,300]].forEach(([x,y],k)=>ion(svg,x,y,'K',K[k]))}
    /* contador */
    const na=i>=2?3:0,k=i>=5?2:0,atp=i>=1?1:0;
    T(svg,586,30,`Na⁺ exportado: ${na}`,{fs:18,a:'end',fill:'var(--eosin)'});
    T(svg,586,330,`K⁺ importado: ${k} · ATP: ${atp}`,{fs:18,a:'end',fill:'var(--sky)'});
  }
  stepper('trnk',steps,draw);
})();

/* ---------- 3) Classificador de casos ---------- */
(function(){
  const box=$('#trqCase');if(!box)return;
  const N={simples:'difusão simples',canal:'difusão facilitada por canal',carreador:'difusão facilitada por carreador',primario:'transporte ativo primário',simporte:'ativo secundário por simporte',antiporte:'ativo secundário por antiporte',vesicular:'transporte vesicular'};
  const CASES=shuffle([
    ['O CO₂ produzido no músculo de um cavalo em galope passa da fibra muscular para o capilar.','simples','Gás pequeno e apolar atravessa a bicamada sem proteína, a favor do gradiente (lei de Fick).'],
    ['Após a refeição, a insulina leva GLUT4 à membrana do músculo e a glicose entra na fibra.','carreador','O GLUT4 é um uniporte: passivo, saturável e específico. A insulina só aumenta o número de carreadores.'],
    ['No enterócito de um bezerro tratado com soro oral, a glicose entra junto com dois íons Na⁺.','simporte','SGLT1: o Na⁺ desce o gradiente e arrasta a glicose no mesmo sentido.'],
    ['Na célula parietal do abomaso, H⁺ é secretado para o lúmen em troca de K⁺, com gasto de ATP.','primario','H⁺/K⁺-ATPase: a própria proteína hidrolisa ATP. É o alvo do omeprazol.'],
    ['No miocárdio de um cão, após a contração, 3 Na⁺ entram enquanto 1 Ca²⁺ sai da célula.','antiporte','Trocador Na⁺/Ca²⁺ (NCX): sentidos opostos, energia do gradiente de Na⁺.'],
    ['Um neutrófilo engloba uma bactéria opsonizada por IgG em um foco de mastite.','vesicular','Fagocitose: endocitose de partícula grande, com pseudópodes de actina.'],
    ['Na placa motora, a acetilcolina se liga ao receptor nicotínico e Na⁺ entra na fibra muscular.','canal','Canal dependente de ligante: poro aquoso, a favor do gradiente eletroquímico.'],
    ['No ducto coletor, sob ação do ADH, a água passa rapidamente do lúmen para a célula.','canal','Aquaporina 2: canal seletivo para água, inserido na membrana pelo ADH.'],
    ['Nas primeiras horas de vida, o enterócito do potro capta IgG do colostro e a entrega à linfa.','vesicular','Pinocitose e transcitose; termina com o fechamento intestinal, por volta de 24 h.'],
    ['No túbulo proximal, H⁺ é secretado para o lúmen enquanto Na⁺ é reabsorvido pela mesma proteína.','antiporte','Trocador Na⁺/H⁺ (NHE3): ativo secundário em sentidos opostos.'],
    ['No retículo sarcoplasmático, o Ca²⁺ é recolhido do citosol e o músculo relaxa.','primario','SERCA: Ca²⁺-ATPase que gasta 1 ATP para cada 2 Ca²⁺ bombeados.'],
    ['Na face basolateral do enterócito, a glicose sai da célula para o interstício.','carreador','GLUT2: difusão facilitada, a favor do gradiente que o SGLT1 criou.'],
    ['O isoflurano chega do alvéolo ao sangue e do sangue ao cérebro de um gato anestesiado.','simples','Anestésico inalatório muito lipossolúvel: cruza a bicamada diretamente.'],
    ['Os mastócitos de um cão com picada de inseto liberam histamina quando o Ca²⁺ intracelular sobe.','vesicular','Exocitose regulada dependente de Ca²⁺ e de proteínas SNARE.'],
    ['Na alça de Henle, Na⁺, K⁺ e 2 Cl⁻ entram juntos na célula (alvo da furosemida).','simporte','NKCC2: cotransporte no mesmo sentido movido pelo gradiente de Na⁺.']
  ]);
  const g=$('#trqBtns'),out=$('#trqOut'),sc=$('#trqScore');let i=0,ok=0,tot=0,done=false;
  function show(){const c=CASES[i%CASES.length];box.innerHTML=`<span class="mono" style="color:var(--muted)">Caso ${i%CASES.length+1} de ${CASES.length}</span><br>${c[0]}`;
    $$('button',g).forEach(b=>{b.classList.remove('ok','no');b.setAttribute('aria-pressed','false')});out.textContent='Escolha o tipo de transporte que descreve a situação acima.';done=false}
  g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||done)return;const c=CASES[i%CASES.length];done=true;tot++;press(g,b);
    if(b.dataset.k===c[1]){ok++;b.classList.add('ok');out.innerHTML=`<b>Certo: ${N[c[1]]}.</b> ${c[2]}`}
    else{b.classList.add('no');const r=g.querySelector(`[data-k="${c[1]}"]`);if(r)r.classList.add('ok');out.innerHTML=`<b>Não é ${N[b.dataset.k]}; é ${N[c[1]]}.</b> ${c[2]}`}
    sc.textContent=ok+' / '+tot});
  $('#trqNext').addEventListener('click',()=>{i++;show()});
  show();
})();
