const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;

/* 1. Da placa motora à contração (stepper) */
{const PASSOS=[
  ['Potencial de ação chega ao terminal','O impulso desce pelo axônio mielinizado do motoneurônio α até o botão sináptico. <i>Na clínica</i>: lesões do nervo (avulsão do plexo braquial, compressão medular) interrompem aqui e o músculo atrofia.'],
  ['Canais de Ca²⁺ abrem e o cálcio entra','A despolarização abre canais de Ca<sup>2+</sup> dependentes de voltagem nas zonas ativas. Sem cálcio extracelular suficiente, menos vesículas se fundem: por isso a <b>vaca com hipocalcemia</b> fica flácida. Aminoglicosídeos e excesso de Mg<sup>2+</sup> também atrapalham este passo.'],
  ['Exocitose da acetilcolina','O Ca<sup>2+</sup> ativa a sinaptotagmina e o complexo SNARE funde as vesículas à membrana, liberando centenas de quanta de ACh na fenda. <i>Alvo da toxina botulínica</i>, que cliva as SNARE: paralisia flácida.'],
  ['ACh abre o receptor nicotínico: potencial de placa','Duas ACh ligam-se a cada receptor nicotínico (canal de cátions). Entra Na<sup>+</sup> e a placa despolariza (potencial de placa motora). <i>Alvos</i>: bloqueadores competitivos (atracúrio, rocurônio) ocupam o receptor; na <b>miastenia grave</b>, anticorpos destroem os receptores.'],
  ['Acetilcolinesterase encerra o sinal','A AChE da fenda hidrolisa a ACh em acetato e colina em cerca de 1 ms; a colina volta ao terminal para nova síntese. <i>Alvo</i> de organofosforados e carbamatos (intoxicação) e da neostigmina/piridostigmina (tratamento da miastenia).'],
  ['Potencial de ação percorre o sarcolema e os túbulos T','O potencial de placa supera o limiar e abre canais de Na<sup>+</sup> (Na<sub>v</sub>1.4) da membrana vizinha. O potencial de ação corre pela fibra e mergulha nos túbulos T. <i>Na HYPP</i> dos Quarto de Milha, esse canal está alterado.'],
  ['DHPR puxa o RYR1: o retículo libera Ca²⁺','O receptor de di-hidropiridina (sensor de voltagem do túbulo T) muda de forma e abre mecanicamente o receptor de rianodina (RYR1) do RS. O Ca<sup>2+</sup> sobe cerca de 100 vezes no citosol. <i>Hipertermia maligna</i>: RYR1 mutado libera cálcio sem controle; o dantroleno bloqueia.'],
  ['Ca²⁺ na troponina C: pontes cruzadas e contração','O cálcio liga-se à TnC, a tropomiosina sai de cima dos sítios da actina, as cabeças de miosina se ligam e fazem o golpe de força. Os filamentos deslizam e o sarcômero encurta.'],
  ['Relaxamento: a SERCA recolhe o cálcio','Sem novos impulsos, a SERCA bombeia o Ca<sup>2+</sup> de volta ao RS (1 ATP para 2 Ca<sup>2+</sup>). A tropomiosina volta a cobrir a actina e as cabeças, recarregadas com ATP, não religam. Relaxar também gasta ATP.']];
  const ca=(p,x,y)=>{E('circle',{cx:x,cy:y,r:7,fill:'var(--amber)'},p)};
  const flow=(p,x1,y1,x2,y2,c,w)=>{const l=E('line',{x1,y1,x2,y2,stroke:c,'stroke-width':w||4,'stroke-linecap':'round','stroke-dasharray':'10 8'},p);
    if(!reduce)E('animate',{attributeName:'stroke-dashoffset',from:36,to:0,dur:'0.8s',repeatCount:'indefinite'},l);return l};
  stepper('mcp',PASSOS,(s,i)=>{
    /* músculo */
    E('rect',{x:0,y:140,width:600,height:200,fill:'var(--eosin-soft)'},s);
    E('line',{x1:0,y1:140,x2:600,y2:140,stroke:'var(--eosin)','stroke-width':4},s);
    /* túbulo T */
    E('rect',{x:320,y:138,width:22,height:122,fill:'var(--paper)',stroke:'var(--eosin)','stroke-width':3},s);
    T(s,331,286,'Túbulo T',{fs:18,fill:'var(--eosin)'});
    /* RS */
    E('rect',{x:372,y:168,width:212,height:54,rx:24,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':2},s);
    T(s,520,202,'RS',{fs:20,fill:'var(--amber)',w:800});
    E('rect',{x:342,y:186,width:14,height:18,fill:'var(--sky)'},s);E('rect',{x:358,y:186,width:14,height:18,fill:i===6?'var(--bad)':'var(--amber)'},s);
    T(s,312,206,'DHPR',{a:'end',fs:18,fill:'var(--sky)'});
    /* filamentos */
    const shift=i===7?-22:0;
    E('line',{x1:380+shift,y1:262,x2:590,y2:262,stroke:'var(--sky)','stroke-width':7},s);
    E('line',{x1:380+shift,y1:i>=7&&i<8?268:262,x2:590,y2:i>=7&&i<8?268:262,stroke:'var(--amber)','stroke-width':3},s);
    for(let x=395;x<590;x+=48)E('circle',{cx:x+shift,cy:262,r:6,fill:i===7?'var(--amber)':'var(--panel)',stroke:'var(--sky)','stroke-width':2},s);
    E('rect',{x:400,y:308,width:180,height:14,rx:7,fill:'var(--eosin)'},s);
    for(let x=420;x<580;x+=40){if(i===7){E('line',{x1:x,y1:308,x2:x-12,y2:268,stroke:'var(--eosin)','stroke-width':4},s);E('circle',{cx:x-12,cy:272,r:7,fill:'var(--eosin)'},s)}
      else{E('line',{x1:x,y1:308,x2:x+8,y2:288,stroke:'var(--eosin)','stroke-width':4},s);E('circle',{cx:x+10,cy:286,r:7,fill:'var(--eosin)'},s)}}
    T(s,385,250,'Actina',{a:'start',fs:18,fill:'var(--sky)'});T(s,390,336,'Miosina',{a:'end',fs:18,fill:'var(--eosin)'});
    /* terminal */
    E('rect',{x:135,y:0,width:40,height:40,fill:'var(--bone-2)'},s);
    E('path',{d:'M60,60 Q60,30 100,30 L210,30 Q250,30 250,60 L250,104 Q250,112 240,112 L70,112 Q60,112 60,104 Z',fill:'var(--bone)',stroke:'var(--bone-ink)','stroke-width':2},s);
    T(s,155,56,'Terminal',{fs:18,fill:'var(--bone-ink)'});
    const ves=[[90,88],[125,96],[185,96],[220,88],[155,84]];
    ves.forEach(([x,y],k)=>{const open=i>=2&&i<=3&&k<4;const vy=open?108:y;E('circle',{cx:x,cy:vy,r:11,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':2},s);if(!open)E('circle',{cx:x,cy:vy,r:3,fill:'var(--ok)'},s)});
    T(s,265,128,'fenda',{a:'start',fs:18,fill:'var(--muted)'});
    const rec=[85,125,185,225];rec.forEach(x=>E('rect',{x:x-6,y:134,width:12,height:14,rx:3,fill:i===3?'var(--ok)':'var(--hema-2)'},s));
    T(s,595,132,'Sarcolema',{a:'end',fs:18,fill:'var(--eosin)'});
    /* destaques */
    if(i===0){flow(s,155,0,155,40,'var(--amber)',6);T(s,185,22,'potencial de ação',{a:'start',fs:18,fill:'var(--amber)'})}
    if(i===1){[[62,100],[248,100]].forEach(([x,y])=>{E('rect',{x:x-6,y:y-12,width:12,height:24,fill:'var(--amber)'},s)});ca(s,40,95);ca(s,40,120);ca(s,270,90);ca(s,72,78);ca(s,238,76);T(s,290,74,'Ca²⁺ entra',{a:'start',fs:18,fill:'var(--amber)'})}
    if(i===2||i===3){for(let k=0;k<14;k++)E('circle',{cx:75+k*12,cy:124+(k%3)*4,r:3.5,fill:'var(--ok)'},s);T(s,290,74,i===2?'ACh liberada':'',{a:'start',fs:18,fill:'var(--ok)'})}
    if(i===3){rec.forEach(x=>{flow(s,x,150,x,186,'var(--ok)',3)});T(s,30,215,'Na⁺ entra:',{a:'start',fs:18,fill:'var(--ok)'});T(s,30,238,'potencial de placa',{a:'start',fs:18,fill:'var(--ok)'})}
    if(i===4){for(let k=0;k<8;k++){E('circle',{cx:80+k*22,cy:126,r:3,fill:'var(--muted)'},s);E('circle',{cx:88+k*22,cy:126,r:2.5,fill:'var(--amber)'},s)}
      T(s,30,200,'AChE: acetato + colina',{a:'start',fs:18,fill:'var(--bad)'});flow(s,240,124,240,104,'var(--muted)',3)}
    if(i===5){flow(s,250,152,600,152,'var(--eosin)',4);flow(s,250,152,0,152,'var(--eosin)',4);flow(s,331,150,331,258,'var(--eosin)',4);T(s,30,200,'PA no sarcolema',{a:'start',fs:18,fill:'var(--eosin)'})}
    if(i===6){[[400,236],[440,240],[500,236],[540,240],[470,244]].forEach(([x,y])=>ca(s,x,y));flow(s,470,222,470,250,'var(--amber)',4);T(s,30,200,'DHPR abre RYR1',{a:'start',fs:18,fill:'var(--bad)'})}
    if(i===7){T(s,30,200,'Ca²⁺ na troponina',{a:'start',fs:18,fill:'var(--amber)'});flow(s,440,250,380,250,'var(--sky)',3);T(s,30,226,'actina desliza',{a:'start',fs:18,fill:'var(--sky)'})}
    if(i===8){[[420,236],[480,240],[540,236]].forEach(([x,y])=>ca(s,x,y));flow(s,480,250,480,224,'var(--amber)',4);T(s,30,200,'SERCA + ATP',{a:'start',fs:18,fill:'var(--ok)'});T(s,30,226,'Ca²⁺ volta ao RS',{a:'start',fs:18,fill:'var(--ok)'})}
  })}

/* 2. Ciclo das pontes cruzadas */
{const PASSOS=[
  ['Repouso: sítios cobertos','Cálcio baixo no citosol. A tropomiosina (faixa âmbar) cobre os sítios da actina. A cabeça da miosina já está <b>engatilhada</b>, com ADP + P<sub>i</sub> presos, mas não tem onde se ligar.'],
  ['Ca²⁺ liga-se à troponina C','O cálcio liberado pelo RS liga-se à TnC; a troponina muda de forma e a tropomiosina rola para o fundo do sulco. Os <b>sítios de ligação</b> (pontos verdes) ficam expostos.'],
  ['Formação da ponte cruzada','A cabeça engatilhada liga-se ao sítio exposto da actina. Ainda segura ADP + P<sub>i</sub>.'],
  ['Golpe de força','A saída do P<sub>i</sub> faz a cabeça girar cerca de 45°, puxando o filamento fino uns <b>10 nm</b> em direção à linha M. Repare no sarcômero acima: as linhas Z se aproximaram.'],
  ['ADP sai: estado de rigor','A cabeça fica presa à actina, sem nucleotídeo. Se o ATP acabar, o ciclo para aqui: é o <b>rigor mortis</b>.'],
  ['ATP liga-se e solta a cabeça','A ligação de um novo ATP reduz a afinidade da miosina pela actina e a cabeça <b>se desprende</b>. O ATP serve para soltar, não para ligar.'],
  ['Hidrólise reengatilha a cabeça','A ATPase da miosina hidrolisa o ATP em ADP + P<sub>i</sub>, e a energia levanta a cabeça de volta. Se ainda houver cálcio, o ciclo se repete (cada cabeça cicla várias vezes por segundo, de forma assíncrona). Se o cálcio for recolhido pela SERCA, volta-se ao repouso.']];
  const B=[300,300];
  stepper('mcb',PASSOS,(s,i)=>{
    const short=i>=3?1:0;
    /* sarcômero em miniatura */
    const half=short?150:180,cx=300;
    E('rect',{x:cx-90,y:40,width:180,height:44,rx:6,fill:'var(--eosin-soft)'},s);
    for(let r=0;r<3;r++){const y=48+r*14;E('line',{x1:cx-half,y1:y+7,x2:cx-half+150,y2:y+7,stroke:'var(--sky)','stroke-width':3},s);E('line',{x1:cx+half,y1:y+7,x2:cx+half-150,y2:y+7,stroke:'var(--sky)','stroke-width':3},s)}
    for(let r=0;r<3;r++)E('line',{x1:cx-85,y1:48+r*14,x2:cx+85,y2:48+r*14,stroke:'var(--eosin)','stroke-width':5},s);
    [cx-half,cx+half].forEach(x=>E('line',{x1:x,y1:30,x2:x,y2:94,stroke:'var(--ink)','stroke-width':5},s));
    T(s,cx-half,22,'Z',{fs:18});T(s,cx+half,22,'Z',{fs:18});T(s,cx,22,'M',{fs:18,fill:'var(--muted)'});
    T(s,560,70,short?'2,0 µm':'2,4 µm',{a:'end',fs:18,fill:'var(--muted)'});
    E('line',{x1:20,y1:112,x2:580,y2:112,stroke:'var(--line)','stroke-width':2,'stroke-dasharray':'4 6'},s);
    /* detalhe: actina */
    const off=i>=3?40:0,ay=170,ca=i>=1&&i<=6&&i!==0;
    for(let k=0;k<19;k++){const x=40+k*30+off;if(x>590)continue;E('circle',{cx:x,cy:ay,r:13,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':2},s)}
    const sites=[160,250,340];sites.forEach(x0=>E('circle',{cx:x0+off,cy:ay+12,r:5,fill:ca?'var(--ok)':'var(--muted)'},s));
    E('line',{x1:40+off,y1:ca?ay-10:ay+10,x2:580,y2:ca?ay-10:ay+10,stroke:'var(--amber)','stroke-width':ca?3:8,opacity:.9},s);
    if(ca){E('circle',{cx:205+off,cy:ay-20,r:8,fill:'var(--amber)'},s);T(s,222+off,ay-24,'Ca²⁺',{a:'start',fs:18,fill:'var(--amber)'})}
    T(s,30,140,'Actina',{a:'start',fs:18,fill:'var(--sky)'});T(s,585,140,'Tropomiosina',{a:'end',fs:18,fill:'var(--amber)'});
    /* miosina */
    E('rect',{x:110,y:300,width:450,height:18,rx:9,fill:'var(--eosin)'},s);T(s,20,315,'Miosina',{a:'start',fs:18,fill:'var(--eosin)'});
    T(s,560,296,'linha M →',{a:'end',fs:18,fill:'var(--muted)'});
    const bound=i>=2&&i<=4,stroke=i>=3&&i<=5;
    const hx=stroke?340:255,hy=bound?194:222;
    E('path',{d:`M${B[0]},${B[1]} Q${(B[0]+hx)/2},${hy+60} ${hx},${hy+14}`,fill:'none',stroke:'var(--eosin)','stroke-width':8,'stroke-linecap':'round'},s);
    const h=E('ellipse',{cx:hx,cy:hy,rx:28,ry:16,fill:'var(--eosin)',transform:`rotate(${stroke?35:-35} ${hx} ${hy})`},s);
    const nuc={0:'ADP + Pi',1:'ADP + Pi',2:'ADP + Pi',3:'ADP',4:'—',5:'ATP',6:'ADP + Pi'}[i];
    T(s,hx+(stroke?44:-44),hy+40,nuc,{a:stroke?'start':'end',fs:18,fill:'var(--ink)',w:800});
    if(i===3){T(s,465,268,'Pi sai',{a:'start',fs:18,fill:'var(--amber)'});E('line',{x1:160,y1:200,x2:200,y2:200,stroke:'var(--sky)','stroke-width':3},s);E('path',{d:'M200,193 L212,200 L200,207 Z',fill:'var(--sky)'},s);T(s,150,206,'10 nm',{a:'end',fs:18,fill:'var(--sky)'})}
    if(i===4)T(s,465,268,'rigor',{a:'start',fs:18,fill:'var(--bad)'});
    if(i===5)T(s,465,268,'solta',{a:'start',fs:18,fill:'var(--ok)'});
    if(i===6)T(s,465,268,'reengatilhada',{a:'start',fs:18,fill:'var(--ok)'});
  })}

/* 3. Abalo, somação e tétano */
{const s=$('#mctSvg');if(s){const rg=$('#mctF'),out=$('#mctOut');const tau=25,TM=600;
  const tw=t=>t<0?0:(t/tau)*Math.exp(1-t/tau);
  const draw=()=>{clear(s);const f=+rg.value,per=1000/f;$('#mctV').textContent=f+' Hz';
    const X=t=>50+t/TM*530,Y=v=>210-v*170;
    E('line',{x1:50,y1:210,x2:582,y2:210,stroke:'var(--line)','stroke-width':2},s);E('line',{x1:50,y1:30,x2:50,y2:210,stroke:'var(--line)','stroke-width':2},s);
    E('line',{x1:50,y1:Y(1),x2:582,y2:Y(1),stroke:'var(--muted)','stroke-width':1,'stroke-dasharray':'4 6'},s);
    T(s,56,26,'Força',{a:'start',fs:18,fill:'var(--muted)'});T(s,580,Y(1)-6,'máximo',{a:'end',fs:18,fill:'var(--muted)'});T(s,580,252,'tempo: 600 ms',{a:'end',fs:18,fill:'var(--muted)'});
    const st=[];for(let t=0;t<TM-10;t+=per)st.push(t);
    st.forEach(t=>E('line',{x1:X(t),y1:216,x2:X(t),y2:232,stroke:'var(--eosin)','stroke-width':2},s));
    let d='',mx=0,mnLate=1,mxLate=0;for(let t=0;t<=TM;t+=2){let S=0;st.forEach(t0=>S+=tw(t-t0));const v=1-Math.exp(-0.3*S);mx=Math.max(mx,v);
      if(t>TM*0.6){mnLate=Math.min(mnLate,v);mxLate=Math.max(mxLate,v)}d+=(t?'L':'M')+X(t).toFixed(1)+','+Y(v).toFixed(1)}
    const p=E('path',{d,fill:'none',stroke:'var(--hema)','stroke-width':3.5,'stroke-linejoin':'round'},s);
    if(!reduce){const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;p.animate([{strokeDashoffset:L},{strokeDashoffset:0}],{duration:700,fill:'forwards'})}
    let k;if(per>=140)k='<b>Abalos isolados.</b> Cada estímulo libera cálcio, que é recolhido antes do próximo: o músculo relaxa por completo entre as contrações. Um abalo isolado atinge só cerca de um quarto da força máxima.';
    else if(per>=50)k='<b>Somação.</b> O novo estímulo chega antes do relaxamento completo; o cálcio permanece mais tempo no citosol e as forças se somam, em degraus.';
    else if(mxLate-mnLate>0.03)k='<b>Tétano incompleto.</b> As contrações quase se fundem, mas ainda se vê uma ondulação a cada estímulo.';
    else k='<b>Tétano completo (fusionado).</b> O cálcio fica alto o tempo todo e todas as pontes disponíveis ciclam: força máxima e lisa. É assim que o músculo trabalha numa contração voluntária forte (não confunda com a doença tétano).';
    out.innerHTML=`${f} estímulos por segundo, um a cada ${Math.round(per)} ms · pico de força ${Math.round(mx*100)}% do máximo. ${k}`};
  rg.addEventListener('input',draw);draw()}}
