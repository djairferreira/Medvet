const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;

/* ============ 1. Lipoproteínas: densidade × composição (lpd) ============ */
(()=>{const s=$('#lpdSvg');if(!s)return;const out=$('#lpdOut');
  const D={
    qm:{n:'Quilomícron',y:52,r:74,c:[85,5,8,2],dens:'&lt; 0,95 g/mL',diam:'75 a 1.200 nm',apo:'B-48 (estrutural), C-II (ativa a LPL), E (captação do remanescente)',
      txt:'Formado no <b>enterócito</b> com a gordura da dieta; sai pela <b>linfa</b>. É o mais leve: na ultracentrífuga (e até num tubo deixado na geladeira) <b>flutua</b> no topo. A LPL esvazia seu TAG em minutos a poucas horas; o remanescente vai ao fígado.',
      sp:'Em jejum de 12 h não deve haver quilomícrons no plasma de cães e gatos. Sua persistência sugere coleta pós-prandial, deficiência de LPL (gato) ou hipertrigliceridemia primária.'},
    vldl:{n:'VLDL',y:96,r:56,c:[55,20,17,8],dens:'0,95 a 1,006 g/mL',diam:'30 a 80 nm',apo:'B-100, C-II, E',
      txt:'Exporta do <b>fígado</b> o TAG sintetizado ali (a partir de glicose em excesso ou de ácidos graxos que chegaram do tecido adiposo). Também é atacada pela LPL e vira IDL.',
      sp:'É a lipoproteína que sobe no diabetes, no hiperadrenocorticismo, no Schnauzer miniatura e na hiperlipemia dos pôneis. O fígado bovino a produz devagar: daí a lipidose hepática no pós-parto.'},
    idl:{n:'IDL',y:136,r:42,c:[30,32,22,16],dens:'1,006 a 1,019 g/mL',diam:'25 a 35 nm',apo:'B-100, E',
      txt:'Remanescente da VLDL, já com metade do TAG retirado. Parte é captada pelo fígado (via apo E); parte perde mais TAG pela lipase hepática e vira LDL.',
      sp:'Partícula de transição: dura pouco no plasma e raramente é medida na rotina.'},
    ldl:{n:'LDL',y:176,r:32,c:[8,50,21,21],dens:'1,019 a 1,063 g/mL',diam:'18 a 25 nm',apo:'B-100 (uma molécula por partícula)',
      txt:'O que sobra quando quase todo o TAG saiu: um núcleo de <b>ésteres de colesterol</b>. Entra nas células pelo <b>receptor de LDL</b>, que reconhece a apo B-100; dentro, o colesterol inibe a síntese própria (HMG-CoA redutase).',
      sp:'Em humanos e suínos carrega a maior parte do colesterol (“animais LDL”). Em cães, gatos, equinos e bovinos é minoritária; no hipotireoidismo canino, a falta de receptores de LDL faz o colesterol subir.'},
    hdl:{n:'HDL',y:236,r:18,c:[4,19,27,50],dens:'1,063 a 1,21 g/mL',diam:'5 a 12 nm',apo:'A-I (ativa a LCAT), C e E (doadas a quilomícrons e VLDL)',
      txt:'A menor e mais densa: metade é proteína. Faz o <b>transporte reverso do colesterol</b>, levando-o dos tecidos ao fígado; também funciona como “estoque” de apo C-II e apo E para as outras lipoproteínas.',
      sp:'Cães, gatos, equinos e bovinos são <b>“animais HDL”</b>: sem CETP ativa, a maior parte do colesterol plasmático fica na HDL. Por isso resistem à aterosclerose.'}};
  const ORD=['qm','vldl','idl','ldl','hdl'],NM={qm:'QM',vldl:'VLDL',idl:'IDL',ldl:'LDL',hdl:'HDL'};
  const COMP=[['TAG','var(--amber)'],['Colesterol','var(--eosin)'],['Fosfolip.','var(--sky)'],['Proteína','var(--hema-2)']];
  const draw=k=>{clear(s);const d=D[k];
    // tubo
    E('rect',{x:34,y:24,width:58,height:258,rx:22,fill:'var(--paper)',stroke:'var(--muted)','stroke-width':2},s);
    ORD.forEach(o=>{const on=o===k;const b=E('rect',{x:38,y:D[o].y-7,width:50,height:14,rx:4,fill:on?'var(--eosin)':'var(--bone-2)',opacity:on?1:.55,class:'lpd-band'},s);
      T(s,104,D[o].y+7,NM[o],{fs:18,a:'start',w:on?800:500,fill:on?'var(--eosin)':'var(--muted)'})});
    // partícula
    const cx=256,cy=150,r=d.r,core=r*0.78;
    const g=E('g',{},s);
    E('circle',{cx,cy,r,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':3},g);
    const tg=d.c[0],ce=d.c[1],fr=tg/(tg+ce);
    E('circle',{cx,cy,r:core,fill:'var(--eosin)'},g);
    if(fr>0.02){const a=2*Math.PI*fr,x=cx+core*Math.sin(a),y=cy-core*Math.cos(a);
      E('path',{d:fr>=0.999?`M${cx} ${cy-core}A${core} ${core} 0 1 1 ${cx-0.01} ${cy-core}Z`:`M${cx} ${cy}L${cx} ${cy-core}A${core} ${core} 0 ${fr>0.5?1:0} 1 ${x} ${y}Z`,fill:'var(--amber)'},g)}
    const na=Math.max(1,Math.round(d.c[3]/6)+1);
    for(let i=0;i<na;i++){const a=i/na*2*Math.PI+0.4;E('circle',{cx:cx+r*Math.cos(a),cy:cy+r*Math.sin(a),r:Math.max(5,Math.min(10,r*0.16)),fill:'var(--hema-2)',stroke:'var(--panel)','stroke-width':1.5},g)}
    if(!reduce){const an=E('animate',{attributeName:'opacity',from:0,to:1,dur:'0.45s',fill:'freeze'},g);an.beginElement&&an.beginElement()}
    T(s,cx,282,d.n,{fs:20,w:800});
    // barras
    T(s,352,34,'Composição (% massa)',{fs:18,a:'start',w:700});
    COMP.forEach((c,i)=>{const y=70+i*56,v=d.c[i];
      T(s,352,y+6,c[0],{fs:18,a:'start',w:600});
      E('rect',{x:352,y:y+14,width:220,height:16,rx:8,fill:'var(--line)'},s);
      const w=Math.max(3,2.2*v);E('rect',{x:352,y:y+14,width:w,height:16,rx:8,fill:c[1]},s);
      T(s,572,y+6,v+'%',{fs:18,a:'end',w:800,fill:c[1]})});
    out.innerHTML=`<b>${d.n}</b> · densidade ${d.dens} · diâmetro ${d.diam}<br><b>Apolipoproteínas:</b> ${d.apo}<br>${d.txt}<br><span style="color:var(--muted)">No tubo: quanto mais alto, mais leve (mais lipídio). Na veterinária:</span> ${d.sp}`};
  choices('#lpdBtns',draw);
})();

/* ============ 2. Teste da refrigeração do soro (lmt) ============ */
(()=>{const s=$('#lmtSvg');if(!s)return;const out=$('#lmtOut');
  const C={
    normal:{a:'clear',b:'clear',t:'Soro <b>límpido</b> antes e depois da geladeira. TAG dentro da referência (cerca de 50 a 150 mg/dL no cão). Amostra ideal para bioquímica.'},
    pos:{a:'milk',b:'cream',t:'Soro leitoso na coleta; após 12 h a 4 °C formou-se uma <b>camada cremosa no topo</b> e o soro de baixo ficou límpido. Isso indica <b>quilomícrons</b>, as partículas mais leves, que flutuam. Causa mais comum: o animal comeu antes da coleta. Repita com jejum de 12 h.'},
    vldl:{a:'turbid',b:'turbid',t:'Soro turvo que <b>continua uniformemente turvo</b> na geladeira, sem creme. Partículas menores e mais densas, as <b>VLDL</b>, não flutuam. Típico de hipertrigliceridemia secundária (diabetes mellitus, hiperadrenocorticismo, hipotireoidismo): o fígado exporta VLDL e a LPL, sem insulina, não dá conta de removê-la.'},
    misto:{a:'milk',b:'mixed',t:'Creme no topo <b>e</b> soro turvo embaixo: excesso de <b>quilomícrons e VLDL</b> juntos, mesmo em jejum. É o padrão da hipertrigliceridemia primária do <b>Schnauzer miniatura</b>, com TAG às vezes acima de 1.000 mg/dL e risco de pancreatite.'}};
  const tube=(x,kind,lab)=>{const top=40,h=220,w=74;
    E('rect',{x,y:top,width:w,height:h,rx:14,fill:'var(--paper)',stroke:'var(--lip-glass)','stroke-width':3},s);
    E('rect',{x:x+3,y:top+140,width:w-6,height:h-143,rx:11,fill:'var(--lip-blood)'},s);
    const py=top+30,ph=110;
    if(kind==='clear')E('rect',{x:x+3,y:py,width:w-6,height:ph,fill:'var(--lip-plasma)',opacity:.75},s);
    if(kind==='milk')E('rect',{x:x+3,y:py,width:w-6,height:ph,fill:'var(--lip-milk)',opacity:.95},s);
    if(kind==='turbid'){E('rect',{x:x+3,y:py,width:w-6,height:ph,fill:'var(--lip-plasma)',opacity:.75},s);E('rect',{x:x+3,y:py,width:w-6,height:ph,fill:'var(--lip-milk)',opacity:.7},s)}
    if(kind==='cream'||kind==='mixed'){E('rect',{x:x+3,y:py+22,width:w-6,height:ph-22,fill:'var(--lip-plasma)',opacity:.75},s);
      if(kind==='mixed')E('rect',{x:x+3,y:py+22,width:w-6,height:ph-22,fill:'var(--lip-milk)',opacity:.6},s);
      const cr=E('rect',{x:x+3,y:py,width:w-6,height:22,fill:'var(--lip-milk)'},s);
      if(!reduce){const a=E('animate',{attributeName:'height',from:0,to:22,dur:'0.8s',fill:'freeze'},cr);a.beginElement&&a.beginElement()}
      T(s,x+w+10,py+17,'creme',{fs:18,a:'start',fill:'var(--muted)'})}
    T(s,x+w/2,top+h+30,lab,{fs:18,w:700})};
  const draw=k=>{clear(s);tube(110,C[k].a,'Na coleta');tube(370,C[k].b,'12 h a 4 °C');
    E('path',{d:'M215 150 h120',stroke:'var(--muted)','stroke-width':3,fill:'none','marker-end':''},s);
    E('path',{d:'M325 140 l12 10 l-12 10',stroke:'var(--muted)','stroke-width':3,fill:'none'},s);
    T(s,275,138,'geladeira',{fs:18,fill:'var(--muted)',w:500});
    out.innerHTML=C[k].t};
  choices('#lmtBtns',draw);
})();
