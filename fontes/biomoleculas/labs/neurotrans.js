const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;
const s=$('#ntxSvg');
if(s){
  const out=$('#ntxOut');
  // ex: excitação, in: inibição (0..10)
  const D={
    normal:{ex:5,in:5,st:'Equilíbrio',c:'var(--ok)',t:'O motoneurônio recebe glutamato (excitação) e é freado continuamente pela <b>glicina</b> e pelo <b>GABA</b> dos interneurônios. Ele dispara só quando o comando é forte o bastante.'},
    estr:{ex:5,in:1,st:'Convulsão tônica',c:'var(--bad)',t:'<b>Estricnina</b> bloqueia o receptor de <b>glicina</b> na medula. O freio some: qualquer som ou toque dispara todos os motoneurônios, flexores e extensores juntos. Extensão rígida, consciência preservada.'},
    tet:{ex:5,in:1.5,st:'Paralisia espástica',c:'var(--bad)',t:'A <b>toxina tetânica</b> sobe pelo axônio e cliva a sinaptobrevina dos interneurônios inibitórios: <b>glicina e GABA não são liberados</b>. Trismo, terceira pálpebra exposta, “cavalete”. A placa motora está normal.'},
    iverN:{ex:5,in:5.4,st:'Quase normal',c:'var(--ok)',t:'No cão sem a mutação, a <b>glicoproteína P</b> da barreira hematoencefálica expulsa a ivermectina: pouco fármaco chega aos receptores GABA-A do encéfalo. Na dose terapêutica, sem efeito clínico.'},
    iverM:{ex:5,in:9.5,st:'Depressão e coma',c:'var(--sky)',t:'No cão <b>MDR1 (ABCB1) mutado</b>, a glicoproteína P não funciona. A ivermectina entra no SNC e <b>potencializa o GABA-A</b>: excesso de inibição, com ataxia, midríase, cegueira, salivação, tremores e coma.'},
    bzd:{ex:5,in:7.5,st:'Sedação, sem convulsão',c:'var(--sky)',t:'O <b>diazepam</b> aumenta a frequência de abertura do canal de Cl⁻ do GABA-A, mas só quando há GABA. Reforça o freio: anticonvulsivante, sedativo, relaxante muscular.'},
    isq:{ex:9.5,in:5,st:'Excitotoxicidade',c:'var(--bad)',t:'Na <b>isquemia</b> falta ATP para recaptar o <b>glutamato</b>. Ele acumula, ativa NMDA sem parar e o Ca²⁺ que entra mata o neurônio. Convulsões e lesão permanente.'},
    ket:{ex:2.5,in:5,st:'Anestesia dissociativa',c:'var(--sky)',t:'A <b>cetamina</b> bloqueia o poro do receptor NMDA: corta parte do acelerador. Analgesia somática, olhos abertos, tônus aumentado (por isso é associada a um benzodiazepínico ou α2-agonista).'}
  };
  function draw(k){
    const d=D[k];clear(s);
    const cx=300,py=140,diff=Math.max(-8,Math.min(8,d.in-d.ex));
    const ang=diff*1.5; // graus: positivo = inibição pesa (lado direito desce)
    // base
    E('path',{d:`M${cx-40} 300 L${cx+40} 300 L${cx} ${py+6} Z`,fill:'var(--bone-2)',stroke:'var(--line)'},s);
    const g=E('g',{transform:`rotate(${ang} ${cx} ${py})`},s);
    E('line',{x1:cx-210,y1:py,x2:cx+210,y2:py,stroke:'var(--ink)','stroke-width':6},g);
    E('circle',{cx,cy:py,r:9,fill:'var(--ink)'},g);
    // pratos (cordas verticais apesar da rotação: desenhar em g e contra-rotacionar não é necessário para simplicidade)
    const pan=(x,v,col,lab)=>{
      E('line',{x1:x,y1:py,x2:x,y2:py+80,stroke:'var(--muted)','stroke-width':2},g);
      E('rect',{x:x-70,y:py+80,width:140,height:14,rx:6,fill:col},g);
      const n=Math.round(v);
      for(let i=0;i<n;i++){const r=Math.floor(i/4),c=i%4;E('circle',{cx:x-45+c*30,cy:py+68-r*22,r:10,fill:col,opacity:.85},g)}
      T(s,x<300?90:510,305,lab,{fs:20,fill:col});
    };
    pan(cx-170,d.ex,'var(--eosin)','Excitação');
    pan(cx+170,d.in,'var(--sky)','Inibição');
    T(s,cx,36,d.st,{fs:24,fill:d.c,w:700});
    out.innerHTML=`<b>${d.st}.</b> ${d.t}`;
  }
  choices('#ntxBtns',draw);
}
