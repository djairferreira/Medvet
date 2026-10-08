const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;

/* ============ 1. Luta ou fuga × repouso e digestão ============ */
(()=>{const s=$('#naSvg');if(!s)return;const out=$('#naOut');
  const O=[ // órgão, [simpático efeito, receptor], [parassimpático efeito, receptor]
    ['Pupila',['Midríase','α1'],['Miose','M3']],
    ['Saliva',['Escassa, viscosa','α1'],['Abundante','M3']],
    ['Coração',['↑ FC e força','β1'],['↓ FC','M2']],
    ['Brônquios',['Dilatam','β2'],['Contraem + muco','M3']],
    ['Vasos da pele',['Contraem','α1'],null],
    ['Vasos musculares',['Dilatam','β2'],null],
    ['Intestino',['↓ motilidade','α2, β2'],['↑ motilidade','M3']],
    ['Esfíncteres GI',['Contraem','α1'],['Relaxam','M3']],
    ['Fígado',['Libera glicose','β2, α1'],['Guarda glicogênio','M']],
    ['Bexiga',['Retém urina','β3, α1'],['Esvazia','M3']],
    ['Pelo',['Piloereção','α1'],null],
    ['Medula adrenal',['Adrenalina','NN'],null]];
  const txt={simp:'<b>Luta ou fuga.</b> Descarga simpática difusa somada à adrenalina da medula adrenal: pupilas dilatadas (entra mais luz), coração rápido e forte, brônquios abertos, sangue desviado da pele e das vísceras para os músculos, glicose e ácidos graxos liberados, digestão e micção suspensas, pelos eriçados (o gato parece maior). É o cavalo assustado, o gato acuado, a zebra fugindo.',
    para:'<b>Repouso e digestão.</b> Predomínio vagal e sacral: pupilas contraídas, salivação abundante, frequência cardíaca baixa, peristaltismo e secreções digestivas ativos, esfíncteres relaxados, bexiga e reto esvaziando, glicose sendo guardada. Repare nos quadros vazios: a maioria dos vasos, o pelo e a medula adrenal <b>não têm inervação parassimpática</b>; ali o “efeito parassimpático” é só a queda do tônus simpático.'};
  const draw=k=>{clear(s);const col=k==='simp'?'var(--hema)':'var(--ok)',soft=k==='simp'?'var(--hema-soft)':'var(--ok-soft)';
    O.forEach((o,i)=>{const x=4+(i%3)*199,y=4+Math.floor(i/3)*104,e=k==='simp'?o[1]:o[2];
      E('rect',{x,y,width:193,height:98,rx:12,fill:e?soft:'var(--paper)',stroke:e?col:'var(--line)','stroke-width':e?2:1},s);
      T(s,x+12,y+28,o[0],{fs:18,a:'start',w:800,fill:'var(--ink)'});
      T(s,x+12,y+58,e?e[0]:'sem inervação',{fs:18,a:'start',w:e?700:500,fill:e?col:'var(--muted)'});
      if(e)T(s,x+12,y+86,'receptor '+e[1].replace('NN','nicotínico'),{fs:18,a:'start',w:500,fill:'var(--muted)'});
      if(o[0]==='Coração'&&!reduce){const c=E('circle',{cx:x+170,cy:y+26,r:9,fill:col},s);
        E('animate',{attributeName:'r',values:'7;12;7',dur:k==='simp'?'0.4s':'1.3s',repeatCount:'indefinite'},c)}});
    out.innerHTML=txt[k]};
  choices('#naBtns',draw);
})();

/* ============ 2. Fármaco → receptor → efeito ============ */
(()=>{const s=$('#farSvg');if(!s)return;const out=$('#farOut');
  const R=['N','M2','M3','α1','α2','β1','β2','β3'];
  // tipo: ag (agonista), an (antagonista), in (indireto: mais ACh)
  const D={
    atro:['Atropina','an',['M2','M3'],'↑ FC · midríase · seca secreções','Antagonista muscarínico (M1–M3). Usada na bradicardia vagal, como pré-anestésico para reduzir secreções e como <b>antídoto dos organofosforados</b> (bloqueia o “SLUD”, mas não as fasciculações, que são nicotínicas). Em equinos pode precipitar cólica (íleo).'],
    adre:['Adrenalina','ag',['α1','α2','β1','β2','β3'],'↑ FC e força · broncodilata · contrai vasos da pele','Agonista de todos os adrenérgicos. Na <b>parada cardiorrespiratória</b> (α1 eleva a pressão de perfusão coronariana) e no <b>choque anafilático</b> (β2 abre os brônquios; α1 reverte a vasodilatação). Risco de arritmias (β1).'],
    xila:['Xilazina','ag',['α2'],'sedação · analgesia · bradicardia','Agonista α2: freia a liberação de noradrenalina no SNC. Sedação, analgesia e relaxamento muscular; bradicardia, bloqueio AV, hiperglicemia, diurese e vômito em gatos. Bovinos são muito mais sensíveis que equinos. Revertida por ioimbina, tolazolina ou atipamezol.'],
    prop:['Propranolol','an',['β1','β2'],'↓ FC e força · pode contrair brônquios','Antagonista β não seletivo. Controla taquiarritmias e a taquicardia do hipertireoidismo felino. O bloqueio β2 pode causar <b>broncoconstrição</b>: evite em gatos asmáticos (prefira o atenolol, seletivo β1).'],
    salb:['Salbutamol','ag',['β2'],'broncodilatação','Agonista β2 de ação curta, por inalação com espaçador e máscara: resgate na <b>crise de asma felina</b>. Em dose alta, taquicardia e hipocalemia (β2 leva K⁺ para dentro das células).'],
    clen:['Clembuterol','ag',['β2'],'broncodilatação · relaxa o útero','Agonista β2 de ação longa. Broncodilatador na <b>asma equina</b> e tocolítico em vacas (facilita manobras obstétricas). Uso como promotor de crescimento é <b>proibido</b>: resíduos na carne intoxicam pessoas.'],
    neos:['Neostigmina','in',['N','M2','M3'],'mais ACh em todas as sinapses colinérgicas','Anticolinesterásico reversível: aumenta a ACh na placa motora (reverte bloqueadores neuromusculares), nos gânglios e nos órgãos (↑ motilidade, bradicardia). Associa-se atropina ou glicopirrolato para conter os efeitos muscarínicos.'],
    op:['Organofosforado','in',['N','M2','M3'],'SLUD · miose · fasciculações · convulsões','Inibe a acetilcolinesterase de forma praticamente irreversível: excesso de ACh. Muscarínico: salivação, lacrimejamento, urina, diarreia, miose, bradicardia, broncorreia. Nicotínico: fasciculações e paralisia. Tratamento: atropina, pralidoxima precoce, descontaminação.'],
    fen:['Fenilefrina','ag',['α1'],'vasoconstrição · midríase · bradicardia reflexa','Agonista α1 puro. Eleva a pressão (vasoconstrição) e o barorreflexo reduz a FC. Colírio para midríase e para localizar a lesão na síndrome de Horner. Também usada no deslocamento do cólon maior à esquerda (aprisionamento nefroesplênico) em equinos: contrai o baço.'],
    atip:['Atipamezol','an',['α2'],'reverte a sedação por α2-agonista','Antagonista α2 seletivo. Reverte dexmedetomidina e medetomidina em cães e gatos em poucos minutos (o animal acorda e a FC sobe). A ioimbina e a tolazolina fazem o mesmo, inclusive em ruminantes e equinos.']};
  const draw=k=>{clear(s);const d=D[k];const col=d[1]==='ag'?'var(--ok)':d[1]==='an'?'var(--bad)':'var(--amber)';
    E('rect',{x:170,y:10,width:260,height:52,rx:26,fill:col,opacity:.18},s);
    E('rect',{x:170,y:10,width:260,height:52,rx:26,fill:'none',stroke:col,'stroke-width':2},s);
    T(s,300,44,d[0],{fs:24,w:800,fill:'var(--ink)'});
    const tipo={ag:'agonista (+)',an:'antagonista (−)',in:'indireto: ↑ ACh'}[d[1]];
    T(s,300,90,tipo,{fs:18,w:700,fill:col});
    R.forEach((r,i)=>{const x=40+i*74,y=170,on=d[2].includes(r);
      if(on){const l=E('line',{x1:300,y1:98,x2:x,y2:y-30,stroke:col,'stroke-width':3,'stroke-dasharray':d[1]==='in'?'6 5':null},s);
        if(!reduce)E('animate',{attributeName:'stroke-dashoffset',from:'40',to:'0',dur:'0.8s',repeatCount:'indefinite'},l);
        if(!reduce&&d[1]!=='in')l.setAttribute('style',l.getAttribute('style')+'stroke-dasharray:8 6;')}
      E('circle',{cx:x,cy:y,r:28,fill:on?col:'var(--panel)',stroke:on?col:'var(--line)','stroke-width':2,opacity:on?0.9:1},s);
      T(s,x,y+7,r==='N'?'Nic':r,{fs:20,w:800,fill:on?'var(--panel)':'var(--muted)'});
      if(on&&d[1]==='an')E('path',{d:`M${x-16} ${y-16} L${x+16} ${y+16}`,stroke:'var(--panel)','stroke-width':4},s)});
    T(s,40,222,'colinérgicos',{fs:18,a:'start',w:500,fill:'var(--muted)'});T(s,560,222,'adrenérgicos',{fs:18,a:'end',w:500,fill:'var(--muted)'});
    const parts=d[3].split(' · ');let line1=parts.slice(0,2).join(' · '),line2=parts.slice(2).join(' · ');
    T(s,300,262,line1,{fs:19,w:700,fill:'var(--ink)'});if(line2)T(s,300,290,line2,{fs:19,w:700,fill:'var(--ink)'});
    out.innerHTML=`<b>${d[0]}</b> · ${tipo}. ${d[4]}`};
  choices('#farBtns',draw);
})();
