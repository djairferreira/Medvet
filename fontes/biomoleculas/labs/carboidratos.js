const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;

/* ===== Laboratório 1: classifique o carboidrato ===== */
(function(){
  const s=$('#cbclSvg'); if(!s) return;
  const out=$('#cbclOut'), g=$('#cbclBtns'), nx=$('#cbclNext');
  const COR={Glc:'var(--sky)',Gal:'var(--amber)',Fru:'var(--eosin)',Rib:'var(--hema-2)',NAc:'var(--bone-2)'};
  const SOFT={Glc:'var(--sky-soft)',Gal:'var(--amber-soft)',Fru:'var(--eosin-soft)',Rib:'var(--hema-soft)',NAc:'var(--panel)'};
  function poly(x,y,r,n,k,lab,fs){
    const pts=[];for(let i=0;i<n;i++){const a=-Math.PI/2+i*2*Math.PI/n;pts.push((x+r*Math.cos(a)).toFixed(1)+','+(y+r*Math.sin(a)).toFixed(1))}
    E('polygon',{points:pts.join(' '),fill:SOFT[k],stroke:COR[k],'stroke-width':3},s);
    if(lab!==false) T(s,x,y+7,lab||k,{fs:fs||20,w:700,fill:COR[k]});
  }
  const bond=(x1,y1,x2,y2,txt,ty)=>{E('line',{x1,y1,x2,y2,stroke:'var(--ink)','stroke-width':3},s);if(txt)T(s,(x1+x2)/2,ty,txt,{fs:18,fill:'var(--muted)'})};
  function chain(y,n,k,x0,dx,r,lab){for(let i=0;i<n;i++){const x=x0+i*dx;if(i)bond(x-dx+r,y,x-r,y);poly(x,y,r,6,k,lab===undefined?false:lab)}}
  const ITENS=[
    {n:'Glicose',c:'mono',d:()=>poly(300,140,48,6,'Glc','Glc',24),i:'<b>Aldo-hexose</b> (C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>), anel de 6 átomos (piranose). Principal açúcar do sangue e combustível da glicólise.'},
    {n:'Frutose',c:'mono',d:()=>poly(300,140,48,5,'Fru','Fru',24),i:'<b>Ceto-hexose</b>, mesma fórmula da glicose, anel de 5 átomos (furanose). Frutas, mel, metade da sacarose. Entra no enterócito por GLUT5.'},
    {n:'Galactose',c:'mono',d:()=>poly(300,140,48,6,'Gal','Gal',24),i:'<b>Aldo-hexose</b>, epímero da glicose no C4. Vem da lactose do leite; no fígado é convertida em glicose.'},
    {n:'Ribose',c:'mono',d:()=>poly(300,140,48,5,'Rib','Rib',24),i:'<b>Aldopentose</b> em anel de furanose. Faz parte do RNA, do ATP, do NAD⁺, do FAD e da coenzima A. É fabricada pela via das pentoses.'},
    {n:'Gliceraldeído',c:'mono',d:()=>{for(let i=0;i<3;i++){const x=220+i*80;if(i)bond(x-80+24,140,x-24,140);E('circle',{cx:x,cy:140,r:24,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':3},s);T(s,x,147,'C',{fs:22,w:700,fill:'var(--sky)'})}T(s,220,98,'CHO',{fs:20,fill:'var(--eosin)'})},i:'<b>Aldotriose</b>, o menor dos monossacarídeos (3 C). Tem um carbono quiral e é a referência para as séries D e L. O gliceraldeído-3-fosfato é intermediário da glicólise.'},
    {n:'Di-hidroxiacetona',c:'mono',d:()=>{for(let i=0;i<3;i++){const x=220+i*80;if(i)bond(x-80+24,140,x-24,140);E('circle',{cx:x,cy:140,r:24,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':3},s);T(s,x,147,'C',{fs:22,w:700,fill:'var(--eosin)'})}T(s,300,98,'C=O',{fs:20,fill:'var(--eosin)'})},i:'<b>Cetotriose</b> (3 C), sem carbono quiral. Na forma de di-hidroxiacetona-fosfato é produto da aldolase na glicólise e ponte para o glicerol.'},
    {n:'Maltose',c:'di',d:()=>{poly(210,140,44,6,'Glc','Glc',22);poly(390,140,44,6,'Glc','Glc',22);bond(254,140,346,140,'α(1→4)',122)},i:'Glicose + glicose em <b>α(1→4)</b>. Produto da amilase sobre o amido; hidrolisada pela maltase da borda em escova. Açúcar redutor.'},
    {n:'Lactose',c:'di',d:()=>{poly(210,140,44,6,'Gal','Gal',22);poly(390,140,44,6,'Glc','Glc',22);bond(254,140,346,140,'β(1→4)',122)},i:'Galactose + glicose em <b>β(1→4)</b>. Açúcar do leite; hidrolisada pela lactase, cuja atividade cai após o desmame na maioria das espécies.'},
    {n:'Sacarose',c:'di',d:()=>{poly(210,140,44,6,'Glc','Glc',22);poly(390,140,44,5,'Fru','Fru',22);bond(254,140,346,140,'α1→β2',122)},i:'Glicose + frutose ligadas pelos dois carbonos anoméricos (<b>α1→β2</b>), por isso <b>não é redutora</b>. Açúcar da cana e da beterraba; o bezerro recém-nascido quase não tem sacarase.'},
    {n:'Trealose',c:'di',d:()=>{poly(210,140,44,6,'Glc','Glc',22);poly(390,140,44,6,'Glc','Glc',22);bond(254,140,346,140,'α1↔α1',122)},i:'Glicose + glicose unidas pelos dois C1 (<b>α1↔α1</b>), não redutora. Açúcar de fungos e da hemolinfa dos insetos; hidrolisada pela trealase intestinal.'},
    {n:'Amilose',c:'poli',d:()=>{chain(140,8,'Glc',90,60,22);T(s,60,147,'…',{fs:26});T(s,560,147,'…',{fs:26});T(s,300,200,'α(1→4), sem ramos',{fs:20,fill:'var(--muted)'})},i:'Parte linear do <b>amido</b>: centenas a milhares de glicoses em <b>α(1→4)</b>, enrolada em hélice (azul com lugol). Digerida pela amilase.'},
    {n:'Amilopectina',c:'poli',d:()=>{chain(110,8,'Glc',90,60,22);chain(190,4,'Glc',330,60,22);bond(330,132,330,168);T(s,365,156,'α(1→6)',{fs:18,fill:'var(--muted)',a:'start'});T(s,60,117,'…',{fs:26})},i:'Parte ramificada do <b>amido</b> (70-80% dele): cadeias α(1→4) com ramos <b>α(1→6)</b> a cada 24-30 glicoses.'},
    {n:'Glicogênio',c:'poli',d:()=>{chain(80,8,'Glc',90,60,20);chain(150,6,'Glc',150,60,20);chain(220,4,'Glc',210,60,20);bond(150,100,150,130);bond(330,100,330,130);bond(210,170,210,200);bond(390,170,390,200)},i:'Reserva <b>animal</b> (fígado e músculo): α(1→4) com ramos <b>α(1→6)</b> a cada 8-12 glicoses. Muito ramificado: muitas pontas para quebra rápida.'},
    {n:'Celulose',c:'poli',d:()=>{for(let i=0;i<8;i++){const x=90+i*60,y=i%2?155:125;if(i)bond(x-60,i%2?125:155,x,y);poly(x,y,22,6,'Glc',false)}T(s,300,215,'β(1→4), cadeia reta',{fs:20,fill:'var(--muted)'})},i:'Glicoses em <b>β(1→4)</b>, cadeia reta que forma microfibrilas. Nenhum vertebrado tem celulase: só a microbiota do rúmen, do ceco e do cólon a fermenta.'},
    {n:'Quitina',c:'poli',d:()=>{for(let i=0;i<8;i++){const x=90+i*60,y=i%2?155:125;if(i)bond(x-60,i%2?125:155,x,y);poly(x,y,22,6,'NAc',false)}T(s,300,215,'N-acetilglicosamina em β(1→4)',{fs:20,fill:'var(--muted)'})},i:'Polímero de <b>N-acetilglicosamina</b> em β(1→4): exoesqueleto de insetos e crustáceos e parede de fungos. Contém nitrogênio.'}
  ];
  let ord=shuffle(ITENS),k=0,ok=0,tot=0,done=false;
  const NOME={mono:'monossacarídeo',di:'dissacarídeo',poli:'polissacarídeo'};
  function show(){
    const it=ord[k];done=false;clear(s);
    E('rect',{x:1,y:1,width:598,height:248,rx:14,fill:'var(--panel)',stroke:'var(--line)'},s);
    T(s,300,40,it.n,{fs:28,w:800});it.d();
    $$('button',g).forEach(b=>{b.setAttribute('aria-pressed','false');b.disabled=false});
    out.innerHTML=`Que tipo de carboidrato é <b>${it.n}</b>? Conte as unidades no desenho e escolha acima. <span class="mono" style="color:var(--muted)">Acertos: ${ok} de ${tot}</span>`;
  }
  g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||done)return;done=true;press(g,b);
    const it=ord[k],certo=b.dataset.k===it.c;tot++;if(certo)ok++;
    out.innerHTML=`<b style="color:var(${certo?'--ok':'--bad'})">${certo?'Correto':'Não'}:</b> ${it.n} é um <b>${NOME[it.c]}</b>. ${it.i} <span class="mono" style="color:var(--muted)">Acertos: ${ok} de ${tot}</span>`;});
  nx.addEventListener('click',()=>{k++;if(k>=ord.length){ord=shuffle(ITENS);k=0}show()});
  show();
})();

/* ===== Laboratório 2: para onde vai o carboidrato ===== */
(function(){
  const s=$('#cbesSvg'); if(!s) return;
  const out=$('#cbesOut');
  const SP={cao:{n:'Cão',c:[['Boca'],['Estômago'],['Delgado'],['Grosso']]},
    gato:{n:'Gato',c:[['Boca'],['Estômago'],['Delgado'],['Grosso']]},
    bez:{n:'Bezerro lactente',c:[['Rúmen'],['Abomaso'],['Delgado'],['Grosso']]},
    boi:{n:'Bovino adulto',c:[['Rúmen'],['Omaso'],['Abomaso'],['Delgado'],['Grosso']]},
    cav:{n:'Equino',c:[['Boca'],['Estômago'],['Delgado'],['Ceco e','cólon']]}};
  const FD={amido:'Amido',exc:'Amido em excesso',cel:'Celulose',lac:'Lactose'};
  /* m: marca por compartimento (0 nada, 1 enzimas do animal, 2 fermentação, 3 fermentação problemática); b: [glicose, fermentado, fezes] em % (ilustrativo) */
  const D={
    'cao-amido':{m:[0,0,1,2],b:[92,6,2],t:'A amilase pancreática e as dissacaridases do delgado transformam o amido cozido em <b>glicose</b>, absorvida por SGLT1 e GLUT2. A amilase salivar do cão é mínima. Uma pequena parte do amido resistente é fermentada no cólon.'},
    'cao-exc':{m:[0,0,1,3],b:[70,24,6],t:'Com muito amido de uma vez, ou amido cru, a digestão no delgado não dá conta. O excedente chega ao cólon e é fermentado: <b>gases, flatulência e fezes moles</b>. Cães se adaptam melhor que gatos, graças às cópias extras do gene da amilase.'},
    'cao-cel':{m:[0,0,0,2],b:[0,8,92],t:'O cão não tem celulase. A celulose passa intacta pelo delgado e só uma pequena fração é fermentada no cólon. Ela <b>dá volume ao bolo fecal</b> e é usada em rações de controle de peso.'},
    'cao-lac':{m:[0,0,1,3],b:[40,42,18],t:'O cão adulto é <b>hipolactásico</b>: parte da lactose é hidrolisada, o resto chega ao cólon, segura água e é fermentado. Resultado: <b>diarreia osmótica</b> e gases, proporcionais à quantidade de leite. O filhote lactente digere a lactose quase toda.'},
    'gato-amido':{m:[0,0,1,2],b:[85,12,3],t:'O gato não tem amilase salivar e tem pouca amilase pancreática, mas digere bem o amido <b>cozido</b> (extrusado) em quantidade moderada. A glicemia dele depende principalmente da <b>gliconeogênese</b> a partir de aminoácidos.'},
    'gato-exc':{m:[0,0,1,3],b:[55,35,10],t:'A capacidade de digestão é baixa e o fígado quase não tem <b>glicoquinase</b>: a glicose que entra fica mais tempo alta no sangue, e o amido não digerido fermenta no cólon. Dietas ricas em carboidrato e obesidade aumentam o risco de <b>diabetes</b> no gato.'},
    'gato-cel':{m:[0,0,0,2],b:[0,6,94],t:'Sem celulase e com intestino grosso curto, o gato fermenta muito pouco a celulose. Ela ajuda a <b>eliminar bolas de pelo</b> e dá saciedade em rações light.'},
    'gato-lac':{m:[0,0,1,3],b:[35,45,20],t:'Gato adulto tem pouca lactase. O pires de leite de vaca causa <b>diarreia osmótica</b> e gases em muitos gatos. Prefira leite sem lactose ou produtos para pets.'},
    'bez-amido':{m:[0,0,1,3],b:[25,45,30],t:'Nas primeiras semanas o bezerro tem <b>pouca amilase pancreática e pouca maltase</b>. Sucedâneo com amido barato não é digerido, fermenta no intestino e causa <b>diarreia nutricional</b>. A capacidade aumenta com a idade.'},
    'bez-exc':{m:[0,0,1,3],b:[12,53,35],t:'Ainda pior: amido em excesso no sucedâneo leva a diarreia, perda de peso e acidose. Concentrado sólido (ração inicial) é diferente: vai para o rúmen e ajuda o seu desenvolvimento.'},
    'bez-cel':{m:[2,0,0,2],b:[0,20,80],t:'O rúmen do bezerro ainda é pequeno e com poucas papilas, e a microbiota está se instalando. A fibra é mal aproveitada até o rúmen se desenvolver, o que depende da ingestão de concentrado (butirato estimula as papilas).'},
    'bez-lac':{m:[0,1,1,0],b:[97,3,0],t:'A sucção dispara o reflexo da <b>goteira esofágica</b>: o leite vai direto ao abomaso, sem passar pelo rúmen. A lactase do delgado, muito ativa no recém-nascido, libera <b>glicose e galactose</b>. Aqui o bezerro funciona como monogástrico.'},
    'boi-amido':{m:[2,0,0,1,2],b:[10,86,4],t:'A microbiota do rúmen fermenta quase todo o amido em <b>AGV</b>, com mais <b>propionato</b> que em dieta de forragem. Só uma fração escapa para o delgado e é absorvida como glicose. A glicemia depende da gliconeogênese hepática a partir do propionato.'},
    'boi-exc':{m:[3,0,0,1,2],b:[6,89,5],t:'Sobrecarga de grão: fermentação explosiva, multiplicação de <i>Streptococcus bovis</i> e lactobacilos, <b>ácido lático</b> acumulado e pH ruminal abaixo de 5. É a <b>acidose lática ruminal</b> (cap. 4), com desidratação, ruminite, laminite e abscessos hepáticos.'},
    'boi-cel':{m:[2,0,0,0,2],b:[0,60,40],t:'Bactérias celulolíticas (<i>Fibrobacter</i>, <i>Ruminococcus</i>), fungos e protozoários quebram a celulose. A glicose liberada é fermentada a <b>acetato</b> (principal), propionato e butirato, além de metano e CO<sub>2</sub>. A fração não digerida, protegida pela lignina, sai nas fezes.'},
    'boi-lac':{m:[3,0,0,0,0],b:[0,100,0],t:'No adulto, a lactose (soro de leite, por exemplo) cai no rúmen e é fermentada muito rapidamente. Em grande quantidade, sem adaptação, pode causar <b>acidose</b>, como o amido.'},
    'cav-amido':{m:[0,0,1,2],b:[65,30,5],t:'O cavalo digere o amido no delgado com amilase pancreática, mas a capacidade é limitada. Em porções pequenas (menos de cerca de 1 g de amido/kg de peso vivo por refeição), a maior parte vira <b>glicose</b>; o resto fermenta no ceco.'},
    'cav-exc':{m:[0,0,1,3],b:[35,60,5],t:'O amido “transborda” para o ceco: <b>ácido lático</b>, pH abaixo de 6, morte de bactérias Gram-negativas e liberação de <b>endotoxinas</b>. Risco de <b>cólica, diarreia e laminite</b> em 24 a 72 h. Ofereça concentrado em várias refeições pequenas.'},
    'cav-cel':{m:[0,0,0,2],b:[0,50,50],t:'A fibra passa pelo delgado e é fermentada no <b>ceco e no cólon</b>, que juntos têm mais de 100 litros. Os AGV absorvidos ali fornecem a maior parte da energia de um cavalo mantido a feno.'},
    'cav-lac':{m:[0,0,1,3],b:[30,55,15],t:'O potro tem muita lactase; o cavalo adulto, pouca. Leite ou soro em quantidade chegam ao intestino grosso e fermentam, com diarreia e risco de distúrbio cecal.'}
  };
  const MC=[['var(--panel)','var(--line)',''],['var(--sky-soft)','var(--sky)','enzimas'],['var(--amber-soft)','var(--amber)','fermenta'],['var(--bad-soft)','var(--bad)','excesso']];
  let sp='cao',fd='amido';
  function draw(){
    const d=D[sp+'-'+fd],c=SP[sp].c,n=c.length;clear(s);
    T(s,300,26,SP[sp].n+' · '+FD[fd],{fs:20,w:800});
    const gap=22,w=(580-gap*(n-1))/n;
    c.forEach((lab,i)=>{const x=10+i*(w+gap),mc=MC[d.m[i]];
      E('rect',{x,y:46,width:w,height:70,rx:12,fill:mc[0],stroke:mc[1],'stroke-width':d.m[i]?3:1.5},s);
      if(lab.length===1)T(s,x+w/2,88,lab[0],{fs:19,w:700});else{T(s,x+w/2,77,lab[0],{fs:19,w:700});T(s,x+w/2,100,lab[1],{fs:19,w:700})}
      if(mc[2])T(s,x+w/2,142,mc[2],{fs:18,fill:mc[1],w:700});
      if(i<n-1)E('path',{d:`M${x+w+5} 81 l12 0 m-5 -6 l6 6 l-6 6`,fill:'none',stroke:'var(--muted)','stroke-width':2.5},s);
      if(d.m[i]===3&&!reduce){const r=E('rect',{x:x-3,y:43,width:w+6,height:76,rx:14,fill:'none',stroke:'var(--bad)','stroke-width':2},s);E('animate',{attributeName:'opacity',values:'1;0.1;1',dur:'1.4s',repeatCount:'indefinite'},r)}
    });
    const cols=['var(--sky)','var(--amber)','var(--bone-2)'],labs=['glicose','fermentado','fezes'];let x=10;
    T(s,10,172,'Destino aproximado do carboidrato ingerido',{fs:18,a:'start',fill:'var(--muted)'});
    d.b.forEach((v,i)=>{if(!v)return;const w2=580*v/100;E('rect',{x,y:184,width:w2,height:40,fill:cols[i]},s);
      if(w2>=58)T(s,x+w2/2,211,v+'%',{fs:19,w:800,fill:i===2?'var(--ink)':'var(--paper)'});x+=w2});
    E('rect',{x:10,y:184,width:580,height:40,rx:2,fill:'none',stroke:'var(--line)'},s);
    labs.forEach((l,i)=>{const lx=10+i*200;E('rect',{x:lx,y:240,width:18,height:18,rx:3,fill:cols[i]},s);T(s,lx+26,256,['Glicose absorvida','Fermentado (AGV)','Fezes'][i],{fs:18,a:'start'})});
    const prod=d.b[0]>=d.b[1]?'principalmente <b>glicose</b>':'principalmente <b>AGV</b> (acetato, propionato, butirato) ou lactato';
    out.innerHTML=`<b>Absorvido:</b> ${prod}. ${d.t}<br><span style="color:var(--muted)">Porcentagens apenas ilustrativas, para comparar espécies.</span>`;
  }
  choices('#cbesSp',k=>{sp=k;draw()});
  choices('#cbesFd',k=>{fd=k;draw()});
})();
