const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;
/* Famílias biossintéticas: precursor → aminoácidos */
{const s=$('#bsfSvg');if(s){const out=$('#bsfOut');
  const nodes={gli:[110,40,'Glicose'],pg:[110,120,'3-fosfoglicerato'],pep:[110,190,'PEP'],pir:[110,260,'Piruvato'],aco:[300,260,'Acetil-CoA'],oaa:[300,330,'Oxaloacetato'],akg:[490,260,'α-cetoglutarato'],e4p:[300,40,'Eritrose-4-P']};
  const fam={
    pg:{n:['pg'],aa:[['Serina','a'],['Glicina','a'],['Cisteína','c']],t:'<b>Família do 3-fosfoglicerato.</b> Oxidado e transaminado, vira <b>serina</b>; a serina doa um carbono ao tetra-hidrofolato e vira <b>glicina</b>. A <b>cisteína</b> usa o esqueleto da serina, mas o enxofre vem da <b>metionina</b> (essencial): por isso é condicionalmente essencial.'},
    pir:{n:['pir'],aa:[['Alanina','a'],['Valina','m'],['Leucina','m']],t:'<b>Família do piruvato.</b> Um passo de transaminação (ALT) dá <b>alanina</b>. Valina e leucina também nascem do piruvato, mas só em plantas e micro-organismos: para o animal são <b>essenciais</b>.'},
    oaa:{n:['oaa'],aa:[['Aspartato','a'],['Asparagina','a'],['Lisina','m'],['Metionina','m'],['Treonina','m']],t:'<b>Família do oxaloacetato.</b> Transaminação (AST) dá <b>aspartato</b>; a asparagina sintetase acrescenta o amino da glutamina. Lisina, metionina, treonina (e isoleucina) saem do aspartato só em bactérias e plantas: <b>essenciais</b> para os animais, mas produzidas pelos micro-organismos do rúmen.'},
    akg:{n:['akg'],aa:[['Glutamato','a'],['Glutamina','a'],['Prolina','a'],['Arginina','c']],t:'<b>Família do α-cetoglutarato.</b> GDH ou transaminação dão <b>glutamato</b>, a porta de entrada do nitrogênio; a glutamina sintetase forma <b>glutamina</b>. Do glutamato saem <b>prolina</b> e ornitina → citrulina → <b>arginina</b>. No gato, a enzima intestinal (P5C sintase) é fraca: arginina essencial.'},
    aro:{n:['pep','e4p'],aa:[['Fenilalanina','m'],['Triptofano','m'],['Tirosina','c']],t:'<b>Aromáticos (via do chiquimato).</b> PEP + eritrose-4-fosfato montam o anel aromático, mas essa via existe só em plantas e micro-organismos (alvo do glifosato). O animal só converte <b>fenilalanina → tirosina</b> (fenilalanina hidroxilase).'}};
  const cor={a:'var(--ok)',c:'var(--amber)',m:'var(--bad)'},lbl={a:'não essencial',c:'condicional',m:'essencial (só micro-organismo)'};
  const draw=k=>{clear(s);const F=fam[k];
    const L=(a,b,dash)=>E('line',{x1:nodes[a][0],y1:nodes[a][1],x2:nodes[b][0],y2:nodes[b][1],stroke:'var(--line)','stroke-width':3,'stroke-dasharray':dash||null},s);
    L('gli','pg');L('pg','pep');L('pep','pir');L('pir','aco');L('aco','akg');L('akg','oaa');L('oaa','aco');L('gli','e4p','6 6');
    T(s,470,345,'Krebs',{fs:18,fill:'var(--muted)'});
    for(const id in nodes){const [x,y,t]=nodes[id],on=F.n.includes(id);
      E('rect',{x:x-82,y:y-18,width:164,height:36,rx:18,fill:on?'var(--hema)':'var(--panel)',stroke:on?'var(--hema)':'var(--line)','stroke-width':2},s);
      T(s,x,y+6,t,{fs:18,fill:on?'var(--paper)':'var(--ink)'})}
    /* lista de aminoácidos à direita */
    const x0=420,y0=40;F.aa.forEach(([n,c],i)=>{const y=y0+i*40;
      const r=E('rect',{x:x0,y:y-16,width:170,height:32,rx:8,fill:cor[c],opacity:.9},s);
      T(s,x0+85,y+6,n,{fs:18,fill:'var(--paper)'});
      if(!reduce){E('animate',{attributeName:'opacity',from:0,to:.9,dur:'0.4s',begin:(i*0.12)+'s',fill:'freeze'},r)}});
    const src=nodes[F.n[0]];E('path',{d:`M${src[0]+82},${src[1]} C 360,${src[1]} 360,${y0} ${x0},${y0}`,fill:'none',stroke:'var(--hema)','stroke-width':3,'stroke-dasharray':'8 6'},s);
    out.innerHTML=F.t+'<br><span style="color:var(--ok)">■</span> não essencial · <span style="color:var(--amber)">■</span> condicionalmente essencial · <span style="color:var(--bad)">■</span> essencial (o animal não faz)';};
  choices('#bsfBtns',draw);}}
