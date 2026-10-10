const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;

/* ============ 1. Medula: placa alar × basal (nvm) ============ */
(()=>{const s=$('#nvmSvg');if(!s)return;const out=$('#nvmOut');let fase='emb',sel='asg';
  const COL={
    asg:{y:92,placa:'alar',c:'var(--sky)',n:'Aferente somática geral (ASG)',t:'Placa alar, porção mais dorsal. Recebe tato, dor, temperatura e propriocepção da pele, músculos e articulações, trazidos pela raiz dorsal. No adulto: <b>ápice do corno dorsal</b>.'},
    avg:{y:150,placa:'alar',c:'var(--ok)',n:'Aferente visceral geral (AVG)',t:'Placa alar, junto ao sulco limitante. Recebe a sensibilidade das vísceras (distensão, dor visceral). No adulto: <b>base do corno dorsal</b>.'},
    evg:{y:212,placa:'basal',c:'var(--amber)',n:'Eferente visceral geral (EVG)',t:'Placa basal, junto ao sulco limitante. Neurônios <b>pré-ganglionares autônomos</b>. No adulto forma o <b>corno lateral</b>: simpático de T1 a L3–L4 e parassimpático sacral (S1–S3). Não existe em toda a medula.'},
    es:{y:268,placa:'basal',c:'var(--eosin)',n:'Eferente somática (ES)',t:'Placa basal, porção ventral. <b>Motoneurônios</b> do músculo esquelético; axônios saem pela raiz ventral. No adulto: <b>corno ventral</b>, mais volumoso nas intumescências cervical e lombar (membros).'}};
  const draw=()=>{clear(s);const emb=fase==='emb';
    if(sel==='sinais'){
      E('rect',{x:120,y:4,width:360,height:14,rx:7,fill:'var(--sky-soft)',stroke:'var(--sky)'},s);T(s,300,48,emb?'':'',{fs:18});
    }
    // contorno
    if(emb)E('ellipse',{cx:300,cy:180,rx:92,ry:130,fill:'var(--panel)',stroke:'var(--muted)','stroke-width':3},s);
    else{E('ellipse',{cx:300,cy:180,rx:115,ry:110,fill:'var(--bone-2)',stroke:'var(--muted)','stroke-width':3},s);
      E('path',{d:'M300 170 C270 120 250 80 228 74 C215 90 230 130 262 160 C230 175 215 200 205 225 C220 280 260 285 300 220 C340 285 380 280 395 225 C385 200 370 175 338 160 C370 130 385 90 372 74 C350 80 330 120 300 170Z',fill:'var(--hema-soft)',stroke:'var(--hema)','stroke-width':2},s)}
    // luz/canal
    if(emb)E('path',{d:'M300 60 L308 175 L318 182 L308 190 L300 300 L292 190 L282 182 L292 175 Z',fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':2},s);
    else E('circle',{cx:300,cy:180,r:6,fill:'var(--sky)'},s);
    // colunas (ambos os lados)
    for(const k in COL){const c=COL[k],on=sel===k;
      const pos=emb?[[256,c.y],[344,c.y]]:k==='asg'?[[238,96],[362,96]]:k==='avg'?[[268,150],[332,150]]:k==='evg'?[[230,196],[370,196]]:[[250,250],[350,250]];
      for(const [x,y] of pos){const ci=E('circle',{cx:x,cy:y,r:on?20:15,fill:on?c.c:'var(--line)',stroke:'var(--panel)','stroke-width':2,style:'cursor:pointer'},s);
        ci.addEventListener('click',()=>{sel=k;press($('#nvmBtns'),$(`#nvmBtns [data-k="${k}"]`));draw()})}}
    // raízes e gânglio (lado direito)
    E('line',{x1:emb?380:405,y1:110,x2:478,y2:110,stroke:'var(--sky)','stroke-width':4},s);
    E('ellipse',{cx:500,cy:110,rx:24,ry:16,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':3},s);
    E('path',{d:`M${emb?370:390} 255 Q470 262 528 248`,fill:'none',stroke:'var(--eosin)','stroke-width':4},s);
    E('path',{d:'M522 110 Q545 180 530 250 L540 320',fill:'none',stroke:'var(--ink)','stroke-width':4},s);
    T(s,500,78,'gânglio',{fs:18,fill:'var(--sky)'});T(s,555,346,'nervo',{fs:18});
    T(s,470,150,'raiz dorsal',{fs:18,fill:'var(--muted)',w:500});T(s,450,290,'raiz ventral',{fs:18,fill:'var(--muted)',w:500});
    // rótulos esquerda
    if(emb){T(s,20,122,'Placa alar',{fs:19,a:'start',fill:'var(--sky)',w:700});T(s,20,188,'Sulco limitante',{fs:18,a:'start',fill:'var(--muted)'});
      T(s,20,248,'Placa basal',{fs:19,a:'start',fill:'var(--eosin)',w:700});
      E('line',{x1:160,y1:183,x2:280,y2:183,stroke:'var(--muted)','stroke-width':1.5,'stroke-dasharray':'4 4'},s);
      T(s,300,40,'teto',{fs:18,fill:'var(--muted)'});T(s,210,330,'assoalho',{fs:18,fill:'var(--muted)'});
      E('circle',{cx:300,cy:340,r:14,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':3},s);T(s,330,346,'notocorda',{fs:18,a:'start',fill:'var(--amber)'})}
    else{T(s,20,100,'Corno dorsal',{fs:19,a:'start',fill:'var(--sky)',w:700});T(s,20,200,'Corno lateral',{fs:19,a:'start',fill:'var(--amber)',w:700});
      T(s,20,270,'Corno ventral',{fs:19,a:'start',fill:'var(--eosin)',w:700});T(s,20,346,'substância branca por fora',{fs:18,a:'start',fill:'var(--muted)'})}
    if(sel==='sinais'){
      T(s,300,48+(emb?0:0)-8,'',{});
      E('path',{d:'M300 20 L300 62',stroke:'var(--sky)','stroke-width':6},s);T(s,420,46,'BMP ↓',{fs:20,fill:'var(--sky)',w:800});
      E('path',{d:'M300 326 L300 290',stroke:'var(--amber)','stroke-width':6},s);T(s,420,318,'Shh ↑',{fs:20,fill:'var(--amber)',w:800});
      out.innerHTML='<b>Dois gradientes opostos.</b> A <b>notocorda</b> e a <b>placa do assoalho</b> liberam <b>Shh</b> (alto embaixo): as células ventrais viram motoneurônios e precursores de oligodendrócitos. O <b>ectoderma</b> e a <b>placa do teto</b> liberam <b>BMP</b> e Wnt (alto em cima): as células dorsais viram interneurônios sensitivos. Cada célula lê a dose dos dois e liga seus fatores de transcrição (Pax, Nkx, Olig). Bloquear Shh (ciclopamina do <i>Veratrum</i>) desorganiza a parte ventral do tubo.';
    }else{const c=COL[sel];out.innerHTML=`<b>${c.n}</b> · placa ${c.placa}<br>${c.t}`}};
  choices('#nvmFase',k=>{fase=k;draw()});
  choices('#nvmBtns',k=>{sel=k;draw()});
})();

/* ============ 2. Vesículas encefálicas (nvv) ============ */
(()=>{const s=$('#nvvSvg');if(!s)return;const out=$('#nvvOut'),cb=$('#nvvCav');let st=0,cav=false;
  const P={
    pros:['Prosencéfalo','var(--hema)','Vesícula primária anterior. Divide-se em <b>telencéfalo</b> e <b>diencéfalo</b>. Cavidade: futuros ventrículos laterais e III ventrículo. Falha na sua divisão = <b>holoprosencefalia</b> (com ciclopia no <i>Veratrum</i>).'],
    mes:['Mesencéfalo','var(--ok)','Não se divide. Forma o <b>teto</b> (colículos rostrais: visão; caudais: audição), o <b>tegmento</b> (núcleos dos nervos III e IV) e os pedúnculos cerebrais. Cavidade: <b>aqueduto mesencefálico</b>, o ponto mais estreito (estenose → hidrocefalia).'],
    romb:['Rombencéfalo','var(--sky)','Vesícula primária posterior. Divide-se em <b>metencéfalo</b> e <b>mielencéfalo</b>. A flexura pontina abre seu teto e forma o <b>IV ventrículo</b>, em losango.'],
    tel:['Telencéfalo','var(--hema)','Duas vesículas laterais → <b>hemisférios cerebrais</b>: córtex (paleo-, arqui- e neocórtex), núcleos da base, bulbos olfatórios. Cavidade: <b>ventrículos laterais</b>.'],
    dien:['Diencéfalo','var(--eosin)','<b>Tálamo, hipotálamo, epitálamo/pineal, neuro-hipófise</b>; das paredes laterais saem as vesículas ópticas (retina). Cavidade: <b>III ventrículo</b>.'],
    met:['Metencéfalo','var(--sky)','<b>Ponte</b> (ventral) e <b>cerebelo</b> (dorsal, dos lábios rômbicos; camada granular externa alvo de parvovírus, BVDV e peste suína). Cavidade: parte rostral do <b>IV ventrículo</b>.'],
    miel:['Mielencéfalo','var(--amber)','<b>Bulbo</b> (medula oblonga): núcleos dos nervos VI a XII, centros respiratório e cardiovascular. Cavidade: parte caudal do <b>IV ventrículo</b>.'],
    med:['Medula espinal','var(--muted)','Parte caudal do tubo, de calibre uniforme. Cavidade: <b>canal central</b> (ependimário).']};
  const show=k=>{const p=P[k];out.innerHTML=`<b>${p[0]}</b><br>${p[2]}`};
  const part=(k,el)=>{el.style.cursor='pointer';el.addEventListener('click',()=>show(k))};
  const ell=(k,cx,cy,rx,ry,lab,ly)=>{const p=P[k];const g=E('g',{},s);E('ellipse',{cx,cy,rx,ry,fill:p[1].replace(')','-soft)').replace('--muted-soft','--bone-2'),stroke:p[1],'stroke-width':3},g);
    if(cav)E('ellipse',{cx,cy,rx:rx*.55,ry:Math.max(8,ry*.28),fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':2},g);
    if(lab)T(g,cx,ly,lab,{fs:18,fill:p[1],w:700});part(k,g);return g};
  const medula=(x1,y,lab,ly)=>{const g=E('g',{},s);E('rect',{x:x1,y:y-16,width:596-x1,height:32,rx:10,fill:'var(--bone-2)',stroke:'var(--muted)','stroke-width':3},g);
    if(cav)E('line',{x1:x1+6,y1:y,x2:592,y2:y,stroke:'var(--sky)','stroke-width':4},g);T(g,(x1+596)/2,ly,lab,{fs:18,fill:'var(--muted)',w:700});part('med',g)};
  const draw=()=>{clear(s);
    if(st===0){ell('pros',115,140,95,80,'Prosencéfalo',255);ell('mes',265,140,55,60,'Mesencéfalo',282);ell('romb',405,140,85,62,'Rombencéfalo',255);medula(488,140,'Medula',282)}
    else if(st===1){ell('tel',80,140,62,88,'Telencéfalo',255);ell('dien',185,140,44,58,'Diencéfalo',282);ell('mes',282,140,48,55,'Mesencéfalo',255);
      ell('met',380,140,48,58,'Metencéfalo',282);ell('miel',470,140,42,48,'Mielencéfalo',255);medula(510,140,'Medula',282)}
    else{ell('tel',190,120,160,92,'Hemisfério',110);
      const d=ell('dien',250,190,52,30,'',0);T(s,215,290,'Diencéfalo',{fs:18,fill:'var(--eosin)',w:700});
      ell('mes',330,192,36,26,'',0);T(s,296,262,'Mesencéfalo',{fs:18,fill:'var(--ok)',w:700});
      ell('met',420,128,62,52,'Cerebelo',134);ell('met',400,230,38,24,'',0);T(s,420,290,'Ponte',{fs:18,fill:'var(--sky)',w:700});
      ell('miel',465,226,34,20,'',0);T(s,515,262,'Bulbo',{fs:18,fill:'var(--amber)',w:700});medula(498,228,'Medula',202);
      if(cav){E('path',{d:'M372 196 L392 176 L412 200 Z',fill:'var(--sky)'},s)}}
    if(cav)T(s,300,30,st===2?'cavidades: ventrículos, aqueduto, canal':'cavidades (luz do tubo)',{fs:18,fill:'var(--sky)'});
    T(s,30,30,st===2?'':'◀ cranial',{fs:18,a:'start',fill:'var(--muted)',w:500})};
  choices('#nvvBtns',k=>{st=+k;draw();out.innerHTML=['<b>3 vesículas primárias.</b> Toque em cada uma para ver em que ela se transforma.','<b>5 vesículas secundárias.</b> Prosencéfalo → telencéfalo + diencéfalo; rombencéfalo → metencéfalo + mielencéfalo; o mesencéfalo não se divide. Toque em cada parte.','<b>Encéfalo adulto</b> (vista lateral esquemática, cores das vesículas de origem). O telencéfalo cresce e cobre diencéfalo e mesencéfalo. Toque em cada parte.'][st]});
  if(cb)cb.addEventListener('click',()=>{cav=!cav;cb.setAttribute('aria-pressed',String(cav));draw()});
})();

/* ============ 3. Formação do olho (nvo) ============ */
(()=>{if(!$('#nvoSvg'))return;
  const cup=(ro,ri,fill,stroke)=>{const a=50*Math.PI/180,c=Math.cos(a),sn=Math.sin(a);const X=r=>300+r*c,Y1=r=>165-r*sn,Y2=r=>165+r*sn;
    return {d:`M${X(ro)} ${Y1(ro)} A${ro} ${ro} 0 1 0 ${X(ro)} ${Y2(ro)} L${X(ri)} ${Y2(ri)} A${ri} ${ri} 0 1 1 ${X(ri)} ${Y1(ri)} Z`,fill,stroke,'stroke-width':2}};
  const steps=[
    ['Vesícula óptica','A parede do diencéfalo forma uma evaginação, a <b>vesícula óptica</b>, ligada ao encéfalo pelo <b>pedículo óptico</b>. Ela cresce até encostar no ectoderma superficial.'],
    ['Placoide do cristalino','Por indução da vesícula (Pax6 nos dois tecidos), o ectoderma que ela toca se espessa: <b>placoide do cristalino</b>. Sem vesícula óptica, não há cristalino.'],
    ['Cálice óptico e fosseta do cristalino','O placoide se invagina (fosseta) e a vesícula óptica se dobra junto: vira o <b>cálice óptico</b>, de parede dupla. Na face ventral, a dobra forma a <b>fissura coroidea</b>, por onde entra a artéria hialoide.'],
    ['Vesícula do cristalino','A fosseta se fecha e se destaca do ectoderma como <b>vesícula do cristalino</b>; o ectoderma se refaz por cima (futuro epitélio da córnea). A <b>artéria hialoide</b> corre pelo pedículo até o cristalino. Se a fissura não fechar: <b>coloboma</b>.'],
    ['Olho fetal','Fibras primárias enchem o cristalino. Parede externa do cálice → <b>epitélio pigmentar</b>; interna → <b>retina neural</b>. Axônios das células ganglionares percorrem o pedículo: <b>nervo óptico</b>. O mesênquima forma úvea, esclera e estroma da córnea; as <b>pálpebras</b> se fundem (em cães e gatos, até ~10–14 dias após o nascimento).']];
  stepper('nvo',steps,(s,i)=>{
    E('rect',{x:0,y:20,width:40,height:290,fill:'var(--hema-soft)',stroke:'var(--hema)','stroke-width':2},s);
    T(s,20,170,'',{});
    E('rect',{x:40,y:150,width:i>=4?175:170,height:30,fill:i>=4?'var(--amber-soft)':'var(--hema-soft)',stroke:i>=4?'var(--amber)':'var(--hema)','stroke-width':2},s);
    T(s,120,140,i>=4?'nervo óptico':'pedículo',{fs:18,fill:i>=4?'var(--amber)':'var(--hema)'});
    T(s,22,330,'',{});
    // ectoderma
    const ex=i<2?392:430;
    if(i<=1){E('rect',{x:ex,y:10,width:10,height:310,fill:'var(--sky)'},s);
      if(i===1)E('rect',{x:ex,y:115,width:26,height:100,rx:6,fill:'var(--sky)'},s);
      E('circle',{cx:300,cy:165,r:90,fill:'var(--hema-soft)',stroke:'var(--hema)','stroke-width':3},s);
      T(s,300,172,'vesícula',{fs:18,fill:'var(--hema)'});}
    else{
      if(i===2){E('path',{d:`M${ex} 10 L${ex} 110 Q${ex} 130 410 140 Q370 165 410 190 Q${ex} 200 ${ex} 220 L${ex} 320`,fill:'none',stroke:'var(--sky)','stroke-width':10},s)}
      else E('rect',{x:ex,y:10,width:10,height:310,fill:'var(--sky)'},s);
      if(i<4)E('path',cup(95,62,'var(--hema-soft)','var(--hema)'),s);
      else{E('path',cup(95,86,'var(--ink)','var(--ink)'),s);E('path',cup(86,62,'var(--hema-soft)','var(--hema)'),s)}
      if(i>=3)E('circle',{cx:370,cy:165,r:38,fill:i>=4?'var(--sky)':'var(--sky-soft)',stroke:'var(--sky)','stroke-width':3},s);
      if(i===3||i===4)E('path',{d:'M60 172 L240 172 Q300 178 336 170',fill:'none',stroke:'var(--bad)','stroke-width':3},s);
      if(i===3)T(s,150,205,'a. hialoide',{fs:18,fill:'var(--bad)'});
      if(i===2)T(s,488,170,'fosseta',{fs:18,fill:'var(--sky)'});
      if(i>=3)T(s,362,266,'cristalino',{fs:18,fill:'var(--sky)'});
      if(i>=4){E('path',{d:'M440 30 Q500 100 450 165',fill:'none',stroke:'var(--eosin)','stroke-width':10},s);E('path',{d:'M440 300 Q500 230 450 165',fill:'none',stroke:'var(--eosin)','stroke-width':10},s);
        T(s,535,120,'pálpebras',{fs:18,fill:'var(--eosin)'});T(s,535,145,'fundidas',{fs:18,fill:'var(--eosin)'});
        T(s,200,40,'epitélio pigmentar',{fs:18,fill:'var(--ink)'});T(s,215,300,'retina neural',{fs:18,fill:'var(--hema)'})}
      else T(s,215,300,'cálice óptico',{fs:18,fill:'var(--hema)'});
    }
    T(s,ex+5,i>=4?20:338,'',{});
    if(i<4)T(s,520,30,'ectoderma',{fs:18,fill:'var(--sky)'});
  });
})();
