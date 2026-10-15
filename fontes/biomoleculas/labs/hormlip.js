const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;
/* ============ Balança hormonal (hlip) ============ */
(()=>{const s=$('#hlipSvg');if(!s)return;const out=$('#hlipOut');
  const H=['Insulina','Glucagon','Catecol.','Cortisol','GH'];
  const C={
    alim:{h:[90,20,20,25,25],m:[10,90,5],t:'<b>Estado alimentado.</b> Insulina alta derruba o AMPc (fosfodiesterase 3B): LHS desligada, ACC ativa, LPL do adiposo alta. A gordura da refeição e a sintetizada a partir de glicose (ou acetato, no ruminante) vão para o estoque. Malonil-CoA alta fecha a CPT-I: quase sem cetogênese.'},
    jejum:{h:[25,70,45,40,55],m:[65,10,40],t:'<b>Jejum de 24 h.</b> Insulina baixa e glucagon alto: a PKA ativa perilipina e LHS, os AGNE sobem e o fígado oxida mais ácidos graxos. A cetogênese aumenta moderadamente; o oxaloacetato ainda dá conta de boa parte do acetil-CoA.'},
    estresse:{h:[30,45,95,80,45],m:[80,10,25],t:'<b>Estresse agudo</b> (dor, transporte, exercício intenso). Catecolaminas via receptores β fazem a lipólise disparar em minutos; o cortisol amplifica (efeito permissivo) e causa resistência à insulina. Em pôneis obesos ou gatos obesos, um estresse que tira o apetite pode ser o gatilho de hiperlipemia ou lipidose.'},
    vaca:{h:[15,55,50,55,90],m:[90,5,75],t:'<b>Vaca uma semana pós-parto.</b> Homeorrese: insulina muito baixa, resistência à insulina, GH alto com pouco IGF-1, cortisol do parto. A mama consome a glicose. AGNE muito altos inundam o fígado: cetose (BHB ≥ 1,2 mmol/L é subclínica) e lipidose, porque a VLDL sai devagar.'},
    diab:{h:[3,90,60,60,50],m:[95,0,98],t:'<b>Diabetes mellitus descompensado</b> (cão ou gato). Sem insulina não há freio: lipólise máxima, ACC inibida, malonil-CoA ausente, CPT-I escancarada. O fígado produz corpos cetônicos acima da capacidade de uso: <b>cetoacidose diabética</b>. A LPL também cai, e os TAG sobem (lipemia).'},
    gato:{h:[20,50,70,70,45],m:[90,5,35],t:'<b>Gato obeso em anorexia.</b> Adiposo grande e resistente à insulina, insulina baixa e hormônios de estresse altos: lipólise intensa. O fígado felino oxida pouco e exporta VLDL mal (faltam aminoácidos), então o TAG se acumula: <b>lipidose hepática</b>. A solução é alimentar (sonda), que eleva a insulina.'}};
  const M=[['Lipólise','var(--amber)'],['Lipogênese','var(--ok)'],['Cetogênese','var(--bad)']];
  const draw=k=>{clear(s);const d=C[k];
    T(s,20,30,'Hormônios',{fs:20,a:'start',w:800});
    H.forEach((h,i)=>{const y=64+i*52,v=d.h[i];
      T(s,20,y+20,h,{fs:18,a:'start',w:600});
      E('rect',{x:120,y:y+4,width:150,height:20,rx:10,fill:'var(--line)'},s);
      const r=E('rect',{x:120,y:y+4,width:Math.max(4,1.5*v),height:20,rx:10,fill:i===0?'var(--sky)':'var(--eosin)'},s);
      if(!reduce){const a=E('animate',{attributeName:'width',from:4,to:Math.max(4,1.5*v),dur:'0.5s',fill:'freeze'},r);a.beginElement&&a.beginElement()}});
    T(s,330,30,'Resultado',{fs:20,a:'start',w:800});
    M.forEach((m,i)=>{const cx=375+i*88,cy=200,v=d.m[i],hgt=1.6*v;
      E('rect',{x:cx-24,y:60,width:48,height:160,rx:10,fill:'var(--paper)',stroke:'var(--line)','stroke-width':2},s);
      const r=E('rect',{x:cx-24,y:220-hgt,width:48,height:Math.max(2,hgt),rx:10,fill:m[1]},s);
      if(!reduce){const a=E('animate',{attributeName:'height',from:2,to:Math.max(2,hgt),dur:'0.5s',fill:'freeze'},r);a.beginElement&&a.beginElement();
        const b=E('animate',{attributeName:'y',from:218,to:220-hgt,dur:'0.5s',fill:'freeze'},r);b.beginElement&&b.beginElement()}
      T(s,cx,250,m[0].slice(0,5)+'.',{fs:18,w:700});T(s,cx,282,v+'%',{fs:20,w:800,fill:m[1]})});
    out.innerHTML=d.t+'<br><span style="color:var(--muted)">Escala relativa e didática (0 a 100), não são valores de laboratório. Azul = insulina (guardar); vermelho = hormônios que mobilizam gordura.</span>'};
  choices('#hlipBtns',draw);
})();
