const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;
/* Balança da proteína muscular */
{const s=$('#hpbSvg');if(s){const out=$('#hpbOut');
  const ids=['In','Gh','Co','T4','Ci','An'],nv=['muito baixo','baixo','normal','alto','muito alto'];
  const pres={pos:[3,2,1,2,0,0],jejum:[0,3,2,1,0,0],cush:[2,2,4,2,0,0],hiper:[2,2,2,4,0,0],sepse:[1,3,4,2,4,0],ract:[3,2,1,2,0,4]};
  const txt={pos:'Após a refeição, a <b>insulina</b> e a <b>leucina</b> ligam a mTOR e frenam a proteólise: balanço positivo.',
    jejum:'No jejum, a insulina cai e o glucagon e o cortisol sobem: o músculo cede alanina e glutamina para a gliconeogênese. O GH sobe, mas sem IGF-1 (desacoplamento).',
    cush:'No <b>hiperadrenocorticismo</b>, o cortisol ativa o proteassomo e a miostatina: atrofia muscular, abdômen pendular, pele fina.',
    hiper:'No <b>gato hipertireóideo</b>, o turnover acelera com predomínio da degradação: polifagia com perda muscular.',
    sepse:'Na <b>sepse</b>, citocinas + cortisol + resistência à insulina e ao GH: proteólise intensa que o jejum adaptado não explica (caquexia).',
    ract:'A <b>ractopamina</b> (β-agonista) aumenta a síntese e reduz a degradação via AMPc e calpastatina: mais carne magra na terminação.'};
  const v=k=>+$('#hpb'+k).value;
  const draw=(note)=>{clear(s);ids.forEach(k=>$('#hpb'+k+'V').textContent=nv[v(k)]);
    const syn=1+0.45*(v('In')-2)+0.35*(v('Gh')-2)-0.25*(v('Co')-1)+0.15*(v('T4')-2)-0.15*v('Ci')+0.35*v('An');
    const deg=1-0.35*(v('In')-2)+0.45*(v('Co')-1)+0.35*Math.max(0,v('T4')-2)-0.1*Math.max(0,2-v('T4'))+0.45*v('Ci')-0.2*v('An');
    const S=Math.max(0.2,syn),D=Math.max(0.2,deg),net=S-D,ang=Math.max(-14,Math.min(14,net*9));
    /* balança */
    const cx=300,cy=120;E('rect',{x:cx-8,y:cy,width:16,height:130,fill:'var(--muted)'},s);E('rect',{x:cx-70,y:248,width:140,height:14,rx:6,fill:'var(--muted)'},s);
    const g=E('g',{transform:`rotate(${-ang} ${cx} ${cy})`},s);
    E('rect',{x:cx-220,y:cy-5,width:440,height:10,rx:5,fill:'var(--ink)'},g);
    [[-200,S,'var(--ok)','Síntese'],[200,D,'var(--bad)','Degradação']].forEach(([dx,val,c,l])=>{
      const h=Math.min(90,val*40);E('line',{x1:cx+dx,y1:cy,x2:cx+dx,y2:cy+30,stroke:'var(--ink)','stroke-width':2},g);
      E('rect',{x:cx+dx-60,y:cy+30,width:120,height:10,rx:4,fill:'var(--ink)'},g);
      E('rect',{x:cx+dx-45,y:cy+30-h,width:90,height:h,rx:6,fill:c,opacity:.85},g);
      T(g,cx+dx,cy+68,l,{fs:20})});
    E('circle',{cx,cy,r:9,fill:'var(--hema)'},s);
    const st=net>0.15?['Balanço nitrogenado POSITIVO','var(--ok)']:net<-0.15?['Balanço nitrogenado NEGATIVO','var(--bad)']:['Equilíbrio','var(--amber)'];
    T(s,300,32,st[0],{fs:22,fill:st[1]});
    out.innerHTML=(note?note+'<br>':'')+`Síntese relativa <b>${S.toFixed(1).replace('.',',')}</b> · degradação relativa <b>${D.toFixed(1).replace('.',',')}</b>. `+
      (net<-0.15?'O músculo está cedendo aminoácidos: mais ureia na urina e perda de massa magra.':net>0.15?'O músculo acumula proteína: menos ureia excretada por grama de N ingerido.':'Síntese e degradação se compensam (adulto em manutenção).');};
  ids.forEach(k=>$('#hpb'+k).addEventListener('input',()=>{press($('#hpbBtns'),null);draw()}));
  choices('#hpbBtns',k=>{pres[k].forEach((x,i)=>$('#hpb'+ids[i]).value=x);draw(txt[k])});}}
