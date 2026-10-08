const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;
const fmt=(v,d=1)=>(v<0?'−':'')+Math.abs(v).toFixed(d).replace('.',',');

/* ============ 1. Stepper do ciclo da ureia ============ */
(()=>{if(!$('#urcSvg'))return;
  const N={ // id: [x,y,rótulo,compartimento]
    inp:[110,268,'NH₄⁺ + HCO₃⁻'],cp:[110,334,'Carbamoil-P'],
    citm:[300,300,'Citrulina'],ornm:[500,300,'Ornitina'],
    cit:[300,190,'Citrulina'],asa:[300,72,'Argininossuccinato'],arg:[510,72,'Arginina'],orn:[510,190,'Ornitina'],
    asp:[120,132,'Aspartato'],fum:[420,26,'Fumarato'],ure:[555,132,'Ureia']};
  // setas: id: [x1,y1,x2,y2]
  const A={cps:[110,284,110,316],cp2:[160,326,236,306],otc:[460,300,356,300],tc:[300,282,300,208],
    ass:[300,172,300,92],asp:[176,132,296,132],asl:[400,72,464,72],fum:[420,72,420,44],
    arg:[510,90,510,172],ure:[510,132,530,132],to:[510,208,510,282]};
  const ENZ={cps:['CPS I',178,296],otc:['OTC',408,288],ass:['AS sintetase',312,160],asl:['AS liase',432,104],arg:['Arginase',500,150]};
  const steps=[
    ['Visão geral','O ciclo começa na <b>matriz mitocondrial</b> (faixa amarela) e termina no <b>citosol</b> do hepatócito periportal. A ornitina é regenerada a cada volta. Avance para acompanhar cada enzima e a conta de ligações fosfato de alta energia (~P).',[],[],0],
    ['1 · Carbamoil fosfato sintetase I (mitocôndria)','NH₄⁺ (vindo do glutamato pela GDH) + HCO₃⁻ + <b>2 ATP</b> → carbamoil fosfato. Etapa <b>limitante</b>: só funciona com o ativador <b>N-acetilglutamato</b>, cuja síntese é estimulada pela arginina. Entra o <b>1º nitrogênio</b> da ureia.',['inp','cp'],['cps'],2,'cps'],
    ['2 · Ornitina transcarbamoilase (mitocôndria)','Carbamoil fosfato + <b>ornitina</b> → <b>citrulina</b> + Pᵢ. A energia do carbamoil fosfato (ligação anidrido) é usada aqui, sem novo gasto de ATP.',['cp','ornm','citm'],['cp2','otc'],2,'otc'],
    ['3 · Transporte para o citosol','A <b>citrulina</b> sai da mitocôndria por um transportador da membrana interna que, em troca, traz ornitina para dentro.',['citm','cit'],['tc'],2],
    ['4 · Argininossuccinato sintetase (citosol)','Citrulina + <b>aspartato</b> + ATP → argininossuccinato + <b>AMP + PPᵢ</b>. O PPᵢ é hidrolisado: são <b>2 ~P</b> nesta etapa. O aspartato traz o <b>2º nitrogênio</b>. A deficiência desta enzima causa a <b>citrulinemia</b> de bezerros Holandeses.',['cit','asp','asa'],['ass','asp'],4,'ass'],
    ['5 · Argininossuccinato liase (citosol)','Argininossuccinato → <b>arginina + fumarato</b>. O fumarato vai para o ciclo de Krebs (fumarato → malato → oxaloacetato → aspartato, por transaminação): a “bicicleta de Krebs”, que devolve parte da energia como NADH.',['asa','arg','fum'],['asl','fum'],4,'asl'],
    ['6 · Arginase (citosol)','Arginina + H₂O → <b>ureia + ornitina</b>. A ureia vai pelo sangue até o rim (e, no ruminante, também para a saliva e o rúmen). A arginase está quase só no fígado: por isso só o fígado produz ureia.',['arg','ure','orn'],['arg','ure'],4,'arg'],
    ['7 · Ornitina volta e o ciclo recomeça','A ornitina entra de novo na mitocôndria. Saldo: <b>1 ureia</b> = 2 N (um do NH₄⁺, um do aspartato) + 1 C do HCO₃⁻, ao custo de <b>3 ATP e 4 ~P</b>. No <b>gato</b>, a ornitina depende da arginina da dieta: sem arginina, o ciclo para e a amônia sobe em poucas horas.',['orn','ornm'],['to'],4]];
  const pill=(s,k,on,dim)=>{const [x,y,l]=N[k],w=l.length*10.6+22;
    E('rect',{x:x-w/2,y:y-17,width:w,height:34,rx:17,fill:on?'var(--hema)':'var(--panel)',stroke:on?'var(--hema)':'var(--line)','stroke-width':2,opacity:dim?0.55:1},s);
    T(s,x,y+6,l,{fs:18,fill:on?'var(--panel)':'var(--ink)'})};
  const arrow=(s,k,on)=>{const [x1,y1,x2,y2]=A[k];
    const l=E('line',{x1,y1,x2,y2,stroke:on?'var(--eosin)':'var(--muted)','stroke-width':on?5:2.5,'marker-end':on?'url(#urcHon)':'url(#urcH)',opacity:on?1:0.6},s);
    if(on&&!reduce){l.setAttribute('stroke-dasharray','10 6');E('animate',{attributeName:'stroke-dashoffset',from:'32',to:'0',dur:'0.8s',repeatCount:'indefinite'},l)}};
  stepper('urc',steps.map(x=>[x[0],x[1]]),(s,i)=>{const st=steps[i];
    const defs=E('defs',{},s);
    for(const [id,c] of [['urcH','var(--muted)'],['urcHon','var(--eosin)']]){const m=E('marker',{id,viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:5,markerHeight:5,orient:'auto-start-reverse'},defs);E('path',{d:'M0,0 L10,5 L0,10 z',fill:c},m)}
    E('rect',{x:8,y:236,width:584,height:136,rx:18,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':1.5},s);
    T(s,584,364,'MITOCÔNDRIA',{fs:18,a:'end',fill:'var(--amber)'});
    T(s,16,30,'CITOSOL',{fs:18,a:'start',fill:'var(--muted)'});
    for(const k in A)arrow(s,k,st[3].includes(k));
    for(const k in N)pill(s,k,st[2].includes(k),i>0&&!st[2].includes(k));
    if(st[5]){const [l,x,y]=ENZ[st[5]];T(s,x,y,l,{fs:18,a:'start',w:800,fill:'var(--eosin)'})}
    E('rect',{x:16,y:184,width:150,height:36,rx:8,fill:'var(--paper)',stroke:'var(--line)'},s);
    T(s,91,209,'~P gastos: '+st[4],{fs:18,w:700,fill:st[4]?'var(--bad)':'var(--muted)'});
  });
})();

/* ============ 2. Nitrogênio no rúmen ============ */
(()=>{const s=$('#rnSvg');if(!s)return;
  const out=$('#rnOut'),Pb=$('#rnPb'),Pdr=$('#rnPdr'),Ur=$('#rnUr'),En=$('#rnEn'),Ad=$('#rnAd');
  const EN=['','muito baixa','baixa','média','alta','muito alta'];
  const pre={seca:[6,55,0,2,true],ok:[16,62,0.5,4,true],pdr:[19,75,0,3,true],tox:[12,60,2.5,2,false]};
  const draw=()=>{clear(s);
    const pb=+Pb.value,pdr=+Pdr.value,ur=+Ur.value,en=+En.value,ad=Ad.checked;
    $('#rnPbV').textContent=fmt(pb,1)+'% da MS';$('#rnPdrV').textContent=pdr+'% da PB';$('#rnUrV').textContent=fmt(ur,1)+'% da MS';$('#rnEnV').textContent=EN[en];
    const D=pb*pdr/100+ur*2.87;           // PB degradável equivalente (% MS)
    const cap=2.5+1.9*en;                 // capacidade microbiana de captar N (% MS equivalente)
    const r=D/cap, nh3=Math.max(1,16*r*r); // amônia ruminal (mg/dL)
    const mic=Math.min(D,cap)*(nh3<5?nh3/5:1);
    const mpg=Math.round(mic*20*10*0.85); // g de PB microbiana/dia (vaca de 20 kg MS)
    const mun=Math.max(4,5+4.5*Math.max(0,D-cap)+0.45*Math.max(0,pb-12)+(pb<9?-2:0));
    const pico=nh3+ur*42*(ad?0.35:1)*(6-en)/3;
    const risco=pico>80?2:pico>50?1:0;
    // ---- desenho ----
    // rúmen
    E('ellipse',{cx:150,cy:175,rx:130,ry:110,fill:'var(--paper)',stroke:'var(--ink)','stroke-width':2.5},s);
    const lvl=Math.min(1,nh3/90),top=285-lvl*215;
    const cp=E('clipPath',{id:'rnClip'},E('defs',{},s));E('ellipse',{cx:150,cy:175,rx:128,ry:108},cp);
    const col=nh3<5?'var(--sky)':nh3<=25?'var(--ok)':nh3<=50?'var(--amber)':'var(--bad)';
    E('rect',{x:20,y:top,width:260,height:290-top,fill:col,opacity:.28,'clip-path':'url(#rnClip)'},s);
    T(s,150,58,'RÚMEN',{fs:18,fill:'var(--muted)'});
    T(s,150,100,'NH₃ '+Math.round(nh3)+' mg/dL',{fs:22,w:800,fill:col});
    // micróbios
    const nm=Math.round(Math.min(18,mic*1.6));
    for(let i=0;i<nm;i++){const a=i*2.4,rr=24+(i%5)*13;const g=E('ellipse',{cx:150+Math.cos(a)*rr*1.6,cy:200+Math.sin(a)*rr*0.9,rx:9,ry:5,fill:'var(--hema)',opacity:.75,transform:`rotate(${(i*37)%180} ${150+Math.cos(a)*rr*1.6} ${200+Math.sin(a)*rr*0.9})`},s);
      if(!reduce)E('animateTransform',{attributeName:'transform',type:'rotate',additive:'sum',values:`0 0 0;8 0 0;0 0 0`,dur:(2+i%3)+'s',repeatCount:'indefinite'},g)}
    T(s,150,265,'micróbios',{fs:18,w:500,fill:'var(--hema)'});
    // fígado
    E('rect',{x:360,y:40,width:140,height:70,rx:30,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2},s);
    T(s,430,82,'Fígado',{fs:20,fill:'var(--ink)'});
    // setas
    const ar=(d,c,w)=>{E('path',{d,fill:'none',stroke:c,'stroke-width':w,'stroke-linecap':'round'},s)};
    const exc=Math.max(0,D-cap);
    ar('M270,120 C310,90 330,80 358,75','var(--bad)',2+Math.min(10,exc*2.2));
    T(s,318,128,'NH₃',{fs:18,fill:'var(--bad)'});
    // ureia sangue
    E('rect',{x:360,y:160,width:220,height:56,rx:12,fill:'var(--panel)',stroke:'var(--line)','stroke-width':2},s);
    T(s,470,195,'Ureia: '+fmt(mun,0)+' mg/dL N',{fs:18,fill:mun>16?'var(--bad)':mun<10?'var(--sky)':'var(--ok)'});
    ar('M430,112 L430,156','var(--muted)',3);
    // reciclagem via saliva
    ar('M360,200 C320,230 300,250 278,240','var(--sky)',3+(pb<10?5:1));
    T(s,322,270,'saliva',{fs:18,w:500,fill:'var(--sky)'});
    // saídas
    ar('M470,218 L470,252','var(--muted)',3);
    T(s,470,280,'urina e leite',{fs:18,w:500,fill:'var(--muted)'});
    // proteína microbiana para abomaso
    ar('M150,286 L150,312','var(--hema)',3+mic*0.6);
    T(s,150,334,'proteína microbiana: '+mpg+' g/dia',{fs:18,fill:'var(--hema)'});
    // risco
    const rc=['var(--ok)','var(--amber)','var(--bad)'][risco],rt=['baixo','moderado','ALTO'][risco];
    E('rect',{x:380,y:296,width:200,height:38,rx:19,fill:rc,opacity:.18},s);
    T(s,480,322,'Risco: '+rt,{fs:18,w:800,fill:rc});
    // texto
    let txt='';
    if(nh3<5)txt='Amônia ruminal <b>abaixo de 5 mg/dL</b>: falta N para as bactérias, a digestão da fibra cai e o consumo diminui. A reciclagem de ureia pela saliva está no máximo. Suplementar PDR ou ureia (com energia) melhora o aproveitamento do pasto.';
    else if(nh3<=25)txt='Amônia ruminal na <b>faixa adequada</b>: as bactérias captam quase todo o N que recebem e convertem em proteína microbiana. Ureia sanguínea e no leite em níveis normais.';
    else txt='<b>Sobra amônia</b>: há mais N degradável do que a energia fermentável permite capturar. O excesso é absorvido, vira ureia no fígado (gasto de energia) e sai na urina e no leite. Aumentar a energia fermentável ou reduzir a PDR/ureia.';
    if(risco===2)txt+=' <b>Pico de amônia após a refeição compatível com intoxicação</b>: '+(ad?'mesmo adaptado, a quantidade de ureia é excessiva para a energia disponível.':'animal não adaptado, com pouca energia: tremores, salivação, timpanismo e morte em poucas horas. Tratamento: vinagre e água fria por sonda.');
    else if(risco===1)txt+=' Pico pós-prandial de amônia elevado: atenção à mistura e ao fracionamento da ureia.';
    out.innerHTML=`PB degradável equivalente: <b>${fmt(D,1)}% da MS</b> · capacidade microbiana (energia): <b>${fmt(cap,1)}%</b> · pico pós-refeição ≈ <b>${Math.round(pico)} mg/dL</b><br>${txt}<br><span style="color:var(--muted);font-size:.88rem">Modelo didático simplificado (vaca de 20 kg de MS/dia); os números ilustram tendências, não servem para formular dietas.</span>`};
  [Pb,Pdr,Ur,En].forEach(i=>i.addEventListener('input',draw));Ad.addEventListener('change',draw);
  choices('#rnBtns',k=>{const p=pre[k];Pb.value=p[0];Pdr.value=p[1];Ur.value=p[2];En.value=p[3];Ad.checked=p[4];draw()});
})();
