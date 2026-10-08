const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;
const fmt=(v,d)=>v.toFixed(d).replace('.',',');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

/* 1. Frações do cálcio plasmático: pH e albumina */
{const s=$('#obpSvg');if(s){const ph=$('#obpPh'),alb=$('#obpAlb'),out=$('#obpOut');
  const draw=()=>{clear(s);const p=+ph.value,a=+alb.value,fa=a/3;
    const ion=1.25-0.5*(p-7.4)*fa,bound=fa*(1+0.5*(p-7.4)),cx=0.25,tot=ion+bound+cx;
    $('#obpPhV').textContent=fmt(p,2);$('#obpAlbV').textContent=fmt(a,1)+' g/dL';
    const X0=30,W=540,sc=W/3.0,y=56,h=56;
    T(s,X0,36,'Cálcio total no plasma',{a:'start',fs:20});T(s,570,36,fmt(tot*4.008,1)+' mg/dL',{a:'end',fs:20,fill:'var(--eosin)'});
    E('rect',{x:X0,y,width:W,height:h,rx:8,fill:'var(--paper)',stroke:'var(--line)'},s);
    let x=X0;[[ion,'var(--eosin)','Ionizado'],[bound,'var(--sky)','Na albumina'],[cx,'var(--amber)','Complexado']].forEach(([v,c,l])=>{
      const w=v*sc;E('rect',{x,y,width:Math.max(0,w),height:h,fill:c,opacity:.85},s);x+=w});
    /* faixa normal do ionizado */
    const n1=X0+1.1*sc,n2=X0+1.4*sc;E('rect',{x:n1,y:y+h+8,width:n2-n1,height:10,rx:4,fill:'var(--ok)',opacity:.6},s);
    E('line',{x1:X0+ion*sc,y1:y-6,x2:X0+ion*sc,y2:y+h+22,stroke:'var(--ink)','stroke-width':2.5},s);
    T(s,(n1+n2)/2,y+h+42,'faixa normal do ionizado',{fs:18,fill:'var(--ok)'});
    const leg=[['var(--eosin)','Ionizado',ion],['var(--sky)','Albumina',bound],['var(--amber)','Complexado',cx]];
    leg.forEach(([c,l,v],i)=>{const lx=30+i*190;E('rect',{x:lx,y:176,width:20,height:20,rx:4,fill:c},s);T(s,lx+28,193,l+' '+fmt(v,2),{a:'start',fs:18})});
    T(s,30,222,'valores em mmol/L',{a:'start',fs:18,fill:'var(--muted)',w:500});
    let msg;const pct=Math.round(100*ion/tot);
    if(ion<1.1)msg='<b style="color:var(--bad)">Ionizado baixo</b>: risco de tremores e tetania (nervos hiperexcitáveis).';
    else if(ion>1.4)msg='<b style="color:var(--amber)">Ionizado alto</b>: a acidose deslocou cálcio da albumina para a forma livre.';
    else msg='<b style="color:var(--ok)">Ionizado na faixa normal.</b>';
    let ctx='';
    if(p<7.32)ctx=' Na <b>acidose</b>, H<sup>+</sup> ocupa os sítios negativos da albumina e solta cálcio.';
    else if(p>7.48)ctx=' Na <b>alcalose</b>, a albumina fica mais negativa e agarra cálcio: o total não muda, mas o ionizado cai.';
    if(a<2.2)ctx+=' Com <b>albumina baixa</b>, o cálcio total despenca, mas o ionizado quase não muda: é a <b>pseudo-hipocalcemia</b>. Meça o ionizado antes de tratar.';
    out.innerHTML=`Total <b>${fmt(tot*4.008,1)} mg/dL</b> (${fmt(tot,2)} mmol/L) · ionizado <b>${fmt(ion,2)} mmol/L</b> (${pct}% do total). ${msg}${ctx}`};
  ph.addEventListener('input',draw);alb.addEventListener('input',draw);draw()}}

/* 2. Simulador do cálcio sanguíneo */
{const s=$('#obcSvg');if(s){const rg=$('#obcCa'),out=$('#obcOut'),g=$('#obcBtns');let cas='normal';
  const CASOS={
    normal:{ca:1.25,t:'Cálcio na faixa normal: PTH em nível basal, calcitriol basal e calcitonina baixa. O osso troca cálcio nos dois sentidos, o intestino absorve o necessário e o rim reabsorve quase todo o cálcio filtrado.'},
    vaca:{ca:0.72,boneK:.3,gutK:.35,t:'<b>Vaca nas primeiras 24 h pós-parto.</b> O colostro tirou cálcio mais rápido do que o sistema consegue repor. O PTH já está alto, mas osteoclastos e enterócitos levam 2 a 3 dias para responder (setas finas): hipocalcemia, paresia flácida, atonia de rúmen e útero. Tratar com borogluconato de cálcio IV lento.'},
    cadela:{ca:0.82,t:'<b>Cadela pequena com ninhada grande, 2ª semana de lactação.</b> A saída de cálcio no leite supera a entrada. PTH e calcitriol no máximo, mas não basta: o cálcio ionizado baixo deixa os nervos hiperexcitáveis (tetania, hipertermia). Gluconato de cálcio IV lento e afastar os filhotes.'},
    equino:{ca:1.17,pth:.92,cal:.55,gutK:.4,bone:.85,t:'<b>Equino comendo muito farelo de trigo</b> (muito fósforo, pouco cálcio). O fósforo prende cálcio e o intestino absorve pouco. O cálcio fica quase normal <b>às custas do osso</b>: PTH cronicamente alto, reabsorção contínua e troca por tecido fibroso nos ossos da face (“cara inchada”). Corrigir a relação Ca:P.'},
    renal:{ca:1.12,pth:.95,cal:.08,renK:.35,t:'<b>Gato com doença renal crônica.</b> O rim doente retém fosfato e produz pouco calcitriol (barra quase vazia), então o intestino absorve pouco cálcio e a paratireoide perde o freio do calcitriol. O PTH fica altíssimo e retira cálcio do osso. Dieta pobre em fósforo e quelantes de fosfato.'},
    rato:{ca:1.75,pth:.02,cal:1,bone:.5,t:'<b>Cão que comeu isca com colecalciferol.</b> Excesso de vitamina D vira calcitriol em excesso: o intestino absorve cálcio e fosfato ao máximo e o osso libera cálcio. PTH suprimido e calcitonina alta, mas não conseguem compensar. O produto Ca × P alto mineraliza rins e vasos: insuficiência renal aguda.'},
    solanum:{ca:1.55,pth:.02,cal:1,bone:.15,t:'<b>Bovino em pasto com <i>Solanum malacoxylon</i>.</b> A planta já traz calcitriol pronto, que não depende da 1α-hidroxilase e escapa do controle renal. Absorção intestinal alta e persistente, PTH desligado, calcitonina alta. Ao longo de meses: calcinose de aorta, tendões e pulmões, o “espichamento”.'}};
  const arrow=(x,y1,y2,f,lab)=>{/* f>0: tecido → sangue (sobe); f<0: sangue → tecido */
    const m=Math.abs(f),w=2+m*12,c=f>0?'var(--eosin)':'var(--sky)';if(m<.06){T(s,x,(y1+y2)/2+6,'≈ 0',{fs:18,fill:'var(--muted)'});return}
    const a=f>0?y2:y1,b=f>0?y1:y2,dir=f>0?-1:1;
    E('line',{x1:x,y1:a,x2:x,y2:b-dir*14,stroke:c,'stroke-width':w,'stroke-linecap':'round'},s);
    E('path',{d:`M${x-10-w/2},${b-dir*16} L${x+10+w/2},${b-dir*16} L${x},${b+dir*2} Z`,fill:c},s);
    T(s,x+24+w/2,(y1+y2)/2+7,lab,{a:'start',fs:18,fill:c});
    if(!reduce){for(let k=0;k<3;k++){const d=E('circle',{r:4,cx:x,cy:a,fill:'var(--panel)'},s);
      const an=E('animate',{attributeName:'cy',from:a,to:b,dur:(2.6-m*1.6).toFixed(2)+'s',begin:(k*0.7).toFixed(1)+'s',repeatCount:'indefinite'},d)}}};
  const meter=(x,lab,v,c)=>{T(s,x,30,lab,{fs:20});E('rect',{x:x-75,y:42,width:150,height:22,rx:11,fill:'var(--paper)',stroke:'var(--line)'},s);
    E('rect',{x:x-75,y:42,width:Math.max(6,150*v),height:22,rx:11,fill:c},s);
    const tx=v<.2?'baixo':v<.45?'basal':v<.75?'alto':'muito alto';T(s,x,88,tx,{fs:18,fill:'var(--muted)'})};
  const draw=()=>{clear(s);const C=CASOS[cas]||{},c=+rg.value;$('#obcV').textContent=fmt(c,2)+' mmol/L';
    const sd=clamp((1.25-c)/0.4,-1,1);
    let pth=sd>0?.35+.65*sd:.35*(1+sd);if(C.pth!=null)pth=C.pth;
    let cal=.3+.7*clamp((pth-.35)/.65,0,1);if(sd<0&&C.cal==null)cal=.3*(1+sd);if(C.cal!=null)cal=C.cal;
    let ct=sd<0?.15+.85*(-sd):.15*(1-sd);
    meter(100,'PTH',pth,'var(--eosin)');meter(300,'Calcitriol',cal,'var(--amber)');meter(500,'Calcitonina',ct,'var(--sky)');
    T(s,100,112,'paratireoide',{fs:18,fill:'var(--muted)',w:500});T(s,300,112,'rim (1α-hidroxilase)',{fs:18,fill:'var(--muted)',w:500});T(s,500,112,'tireoide (células C)',{fs:18,fill:'var(--muted)',w:500});
    /* sangue */
    const st=c<1.1?['var(--bad)','var(--bad-soft)','Hipocalcemia']:c>1.4?['var(--amber)','var(--amber-soft)','Hipercalcemia']:['var(--ok)','var(--ok-soft)','Normocalcemia'];
    E('rect',{x:20,y:132,width:560,height:64,rx:14,fill:st[1],stroke:st[0],'stroke-width':2},s);
    T(s,40,172,'Sangue',{a:'start',fs:22,w:800});T(s,300,173,'Ca²⁺ '+fmt(c,2)+' mmol/L',{fs:24,w:800,fill:st[0]});T(s,560,172,st[2],{a:'end',fs:18,fill:st[0]});
    /* fluxos */
    let bone=.7*pth+.35*cal-.75*ct-.2;if(C.bone!=null)bone=C.bone;bone*=C.boneK||1;
    let gut=.1+.8*cal;gut*=C.gutK||1;
    let ren=.85*pth-.6*ct;ren*=C.renK||1;
    const y1=200,y2=304;arrow(100,y1,y2,clamp(bone,-1,1),bone>0?'libera':'deposita');arrow(300,y1,y2,clamp(ren,-1,1),ren>0?'retém':'perde');arrow(500,y1,y2,clamp(gut,0,1),'absorve');
    [[100,'Osso'],[300,'Rim'],[500,'Intestino']].forEach(([x,l])=>{E('rect',{x:x-80,y:308,width:160,height:52,rx:12,fill:'var(--bone)',stroke:'var(--bone-2)'},s);T(s,x,342,l,{fs:22,w:800,fill:'var(--bone-ink)'})});
    T(s,300,392,'vermelho: para o sangue · azul: sai do sangue',{fs:18,fill:'var(--muted)',w:500});
    let txt=C.t;if(!txt){txt=c<1.1?'<b>Hipocalcemia.</b> O sensor de cálcio da paratireoide deixa de ser ativado e o PTH sobe em segundos. O PTH tira cálcio do osso (via RANKL dos osteoblastos), faz o rim reter cálcio e perder fosfato e manda o rim produzir calcitriol, que aumenta a absorção intestinal. A calcitonina cai.'
      :c>1.4?'<b>Hipercalcemia.</b> A calcitonina sobe e freia o osteoclasto diretamente; o PTH e o calcitriol caem, então o rim deixa escapar mais cálcio e o intestino absorve menos. O osso passa a depositar.'
      :'<b>Faixa normal.</b> Pequenas oscilações são corrigidas pelo PTH, que responde em segundos; o calcitriol ajusta a absorção em horas a dias.'}
    out.innerHTML=txt};
  rg.addEventListener('input',()=>{cas='livre';$$('button',g).forEach(b=>b.setAttribute('aria-pressed','false'));draw()});
  choices('#obcBtns',k=>{cas=k;rg.value=CASOS[k].ca;draw()})}}
