const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;
const fmt=(v,d=1)=>(v<0?'−':'')+Math.abs(v).toFixed(d).replace('.',',');
const sg=(v,d=2)=>(v>0.005?'+':'')+fmt(v,d);

/* ============ 1. pH × carga do aminoácido ============ */
(()=>{const s=$('#priSvg');if(!s)return;
  const out=$('#priOut'),ph=$('#priPh'),phV=$('#priPhV');
  // grupos: [nome, pKa, tipo] tipo a = ácido (0 → −1), b = básico (+1 → 0)
  const AA={
    gly:{n:'Glicina',g:[['α-COOH',2.34,'a'],['α-NH₃⁺',9.60,'b']],nota:'Sem cadeia lateral ionizável: o pI é a média dos dois pKa.'},
    glu:{n:'Glutamato',g:[['α-COOH',2.19,'a'],['R: COOH',4.25,'a'],['α-NH₃⁺',9.67,'b']],nota:'A carboxila extra do R deixa o aminoácido negativo em pH 7,4; o pI é baixo (média dos dois pKa ácidos).'},
    lys:{n:'Lisina',g:[['α-COOH',2.18,'a'],['α-NH₃⁺',8.95,'b'],['R: NH₃⁺',10.53,'b']],nota:'O grupo amino extra deixa a lisina positiva em pH 7,4; o pI é alto. É onde a tripsina corta.'},
    his:{n:'Histidina',g:[['α-COOH',1.82,'a'],['R: imidazol',6.00,'b'],['α-NH₃⁺',9.17,'b']],nota:'O imidazol tem pKa ≈ 6, perto do pH do sangue: ganha e perde H⁺ com facilidade. É o segredo do poder tampão da hemoglobina.'}};
  let k='gly';
  const frac=(g,p)=>g[2]==='a'?-1/(1+Math.pow(10,g[1]-p)):1/(1+Math.pow(10,p-g[1]));
  const charge=(a,p)=>a.g.reduce((t,g)=>t+frac(g,p),0);
  const pI=a=>{let lo=0,hi=14;for(let i=0;i<60;i++){const m=(lo+hi)/2;charge(a,m)>0?lo=m:hi=m}return (lo+hi)/2};
  const X=p=>70+p/14*510, Y=c=>130-c*48;
  const draw=()=>{clear(s);const a=AA[k],p=+ph.value,c=charge(a,p),pi=pI(a);
    phV.textContent=fmt(p,1);
    // faixas positivo / negativo
    E('rect',{x:70,y:Y(2.2),width:510,height:Y(0)-Y(2.2),fill:'var(--sky-soft)',opacity:.6},s);
    E('rect',{x:70,y:Y(0),width:510,height:Y(-2.2)-Y(0),fill:'var(--eosin-soft)',opacity:.6},s);
    for(const v of [2,1,0,-1,-2]){E('line',{x1:70,y1:Y(v),x2:580,y2:Y(v),stroke:'var(--line)','stroke-width':v===0?2:1},s);T(s,52,Y(v)+6,(v>0?'+':v<0?'−':'')+Math.abs(v),{fs:18,w:500,fill:'var(--muted)'})}
    for(let v=0;v<=14;v+=2)T(s,X(v),262,String(v),{fs:18,w:500,fill:'var(--muted)'});
    T(s,325,292,'pH',{fs:18,fill:'var(--muted)'});
    // pH sangue
    E('line',{x1:X(7.4),y1:20,x2:X(7.4),y2:240,stroke:'var(--ok)','stroke-width':1.5,'stroke-dasharray':'3 5'},s);
    T(s,X(7.4)+6,36,'sangue',{fs:18,a:'start',w:500,fill:'var(--ok)'});
    // pI
    E('line',{x1:X(pi),y1:20,x2:X(pi),y2:240,stroke:'var(--amber)','stroke-width':2,'stroke-dasharray':'6 4'},s);
    T(s,X(pi)+(pi>10?-6:6),Y(0)-10,'pI '+fmt(pi,1),{fs:18,a:pi>10?'end':'start',fill:'var(--amber)'});
    // curva
    let d='';for(let q=0;q<=14.001;q+=0.1)d+=(q?'L':'M')+X(q).toFixed(1)+','+Y(charge(a,q)).toFixed(1);
    E('path',{d,fill:'none',stroke:'var(--hema)','stroke-width':3},s);
    E('circle',{cx:X(p),cy:Y(c),r:9,fill:'var(--eosin)',stroke:'var(--panel)','stroke-width':3},s);
    T(s,575,Y(2)+22,'carga +',{fs:18,a:'end',fill:'var(--sky)'});T(s,575,Y(-2)-8,'carga −',{fs:18,a:'end',fill:'var(--eosin)'});
    const grp=a.g.map(g=>{const f=frac(g,p),ion=Math.abs(f)>0.5;let lab;
      if(g[0].includes('COOH'))lab=ion?g[0].replace('COOH','COO⁻'):g[0];
      else if(g[0].includes('NH₃⁺'))lab=ion?g[0]:g[0].replace('NH₃⁺','NH₂');
      else lab=ion?'R: imidazol-H⁺':'R: imidazol';
      return `<span class="pr-grp ${f>0.5?'pos':f<-0.5?'neg':''}">${lab}</span>`}).join('');
    const mig=Math.abs(c)<0.05?'praticamente <b>não migra</b> (está no pI; tende a precipitar)':c>0?'migra para o <b>cátodo (polo −)</b>':'migra para o <b>ânodo (polo +)</b>';
    out.innerHTML=`<b>${a.n}</b> em pH ${fmt(p,1)}: carga líquida <b>${sg(c)}</b> · pI = <b>${fmt(pi,2)}</b><br>${grp}<br>Num campo elétrico, ${mig}. ${a.nota}`};
  ph.addEventListener('input',draw);
  choices('#priBtns',v=>{k=v;draw()});
})();

/* ============ 2. Simulador de enzima ============ */
(()=>{const s=$('#enzSvg');if(!s)return;
  const out=$('#enzOut'),S=$('#enzS'),Tm=$('#enzT'),P=$('#enzP');
  const EN={tri:{n:'Tripsina',ph:8,loc:'intestino delgado'},pep:{n:'Pepsina',ph:2,loc:'estômago'}};
  let en='tri',inh='none';
  const fT=t=>{const g=Math.pow(2,(t-38)/10)/(1+Math.exp((t-48)/2.5));const g0=1/(1+Math.exp((38-48)/2.5));return g/g0};
  const fP=(p,o)=>Math.exp(-Math.pow(p-o,2)/(2*1.3*1.3));
  const X=x=>70+x/10*500, Y=v=>270-v*200; // v relativo (0..1.25)
  const draw=()=>{clear(s);const e=EN[en],sv=+S.value,t=+Tm.value,p=+P.value;
    $('#enzSV').textContent=fmt(sv,1)+' × Km';$('#enzTV').textContent=t+' °C';$('#enzPV').textContent=fmt(p,1);
    const fac=Math.min(fT(t),1.25)*fP(p,e.ph);
    const Km=inh==='comp'?3:1, Vm=(inh==='nonc'?1/3:1)*fac;
    const v=x=>Vm*x/(Km+x);
    // eixos
    E('line',{x1:70,y1:270,x2:580,y2:270,stroke:'var(--ink)','stroke-width':2},s);E('line',{x1:70,y1:270,x2:70,y2:20,stroke:'var(--ink)','stroke-width':2},s);
    for(let x=0;x<=10;x+=2)T(s,X(x),294,String(x),{fs:18,w:500,fill:'var(--muted)'});
    T(s,575,316,'[S] em múltiplos de Km',{fs:18,a:'end',w:500,fill:'var(--muted)'});
    T(s,22,150,'v',{fs:20,fill:'var(--muted)'});
    // Vmax de referência
    E('line',{x1:70,y1:Y(1),x2:580,y2:Y(1),stroke:'var(--muted)','stroke-width':1.5,'stroke-dasharray':'6 5'},s);
    T(s,78,Y(1)-8,'Vmax (ótimo, sem inibidor)',{fs:18,a:'start',w:500,fill:'var(--muted)'});
    // curva de referência
    let d0='';for(let x=0;x<=10.001;x+=0.1)d0+=(x?'L':'M')+X(x).toFixed(1)+','+Y(x/(1+x)).toFixed(1);
    E('path',{d:d0,fill:'none',stroke:'var(--line)','stroke-width':3,'stroke-dasharray':'2 6'},s);
    // curva atual
    let d='';for(let x=0;x<=10.001;x+=0.1)d+=(x?'L':'M')+X(x).toFixed(1)+','+Y(v(x)).toFixed(1);
    E('path',{d,fill:'none',stroke:'var(--hema)','stroke-width':3.5},s);
    // Km aparente
    if(Vm>0.05){E('line',{x1:X(Km),y1:Y(Vm/2),x2:X(Km),y2:270,stroke:'var(--amber)','stroke-width':2,'stroke-dasharray':'4 4'},s);
      E('line',{x1:70,y1:Y(Vm/2),x2:X(Km),y2:Y(Vm/2),stroke:'var(--amber)','stroke-width':2,'stroke-dasharray':'4 4'},s);
      T(s,X(Km)+6,262,'Km',{fs:18,a:'start',fill:'var(--amber)'})}
    const vv=v(sv);
    E('circle',{cx:X(sv),cy:Y(vv),r:9,fill:'var(--eosin)',stroke:'var(--panel)','stroke-width':3},s);
    const pct=Math.round(vv*100);
    let msg='';
    if(inh==='comp')msg='<b>Competitivo</b>: o inibidor disputa o sítio ativo. O <b>Km aparente triplicou</b>, mas com muito substrato a curva alcança a mesma Vmax. Ex.: etanol ou fomepizol × etilenoglicol na álcool desidrogenase.';
    else if(inh==='nonc')msg='<b>Não competitivo</b>: o inibidor deforma a enzima em outro sítio. A <b>Vmax caiu</b> a um terço e o Km não mudou; mais substrato não resolve. Ex.: chumbo e mercúrio ligados a grupos –SH.';
    else msg='Sem inibidor: curva hiperbólica de Michaelis-Menten. Em [S] = Km, a velocidade é metade da Vmax.';
    let cond='';
    if(t>=50)cond=' <b>Acima de ~45 °C a enzima desnatura</b>: a atividade despenca e não volta ao esfriar.';
    else if(t<25)cond=' Em temperatura baixa, as moléculas colidem menos: a reação é lenta, mas a enzima não é destruída (por isso se refrigeram as amostras).';
    if(Math.abs(p-e.ph)>2.5)cond+=` O pH ${fmt(p,1)} está longe do ótimo da ${e.n.toLowerCase()} (≈ ${e.ph}, ${e.loc}): as cargas do sítio ativo mudaram.`;
    out.innerHTML=`<b>${e.n}</b> · velocidade = <b>${pct}%</b> da Vmax de referência · Vmax aparente ${Math.round(Vm*100)}% · Km aparente ${Km} × Km<br>${msg}${cond}`};
  [S,Tm,P].forEach(i=>i.addEventListener('input',draw));
  choices('#enzEnz',v=>{en=v;P.value=EN[v].ph;draw()});
  choices('#enzInh',v=>{inh=v;draw()});
})();
