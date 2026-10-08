const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;
const osF=(v,d=1)=>v.toFixed(d).replace('.',',');

/* ---------- 1) Hemácia em soluções ---------- */
(function(){
  const s=$('#oshSvg');if(!s)return;const out=$('#oshOut');
  const D={
    iso:{n:'NaCl 0,9%',osm:308,ef:308,ton:'isotônica',st:'normal',agua:0,txt:'Na⁺ e Cl⁻ não atravessam livremente a membrana: são osmóis efetivos, na mesma concentração do LIC. Não há fluxo líquido de água e a hemácia mantém a forma de disco bicôncavo. É a referência para diluir sangue e lavar hemácias.'},
    h045:{n:'NaCl 0,45%',osm:154,ef:154,ton:'hipotônica',st:'incha',agua:1,txt:'Metade dos osmóis efetivos do plasma. A água entra, a hemácia perde a concavidade e vira uma esfera (esferócito). É por volta desta concentração que as hemácias mais frágeis começam a se romper no teste de fragilidade osmótica.'},
    agua:{n:'Água destilada',osm:0,ef:0,ton:'muito hipotônica',st:'lise',agua:2,txt:'Sem nenhum soluto fora, a água entra até a membrana romper: <b>hemólise</b>. A hemoglobina sai para o meio, que fica vermelho e transparente; sobra só a membrana vazia (“fantasma”). Por isso nunca se injeta água pura por via intravenosa.'},
    h3:{n:'NaCl 3%',osm:1026,ef:1026,ton:'hipertônica',st:'crena',agua:-1,txt:'Mais de três vezes a concentração de osmóis efetivos do plasma. A água sai, a hemácia murcha e a membrana forma espículas (<b>crenação</b>, equinócitos). Uso clínico: edema cerebral e hiponatremia grave, sempre lentamente.'},
    h75:{n:'NaCl 7,5%',osm:2566,ef:2566,ton:'muito hipertônica',st:'crena2',agua:-2,txt:'Cerca de 8 vezes a osmolaridade do plasma. A hemácia perde muita água. No animal, a solução é infundida em pequeno volume (4–5 mL/kg) e se dilui no plasma em segundos, puxando água do interstício e das células para o vaso: é a hipertônica da reanimação de bovinos e equinos.'},
    ureia:{n:'Ureia 300 mOsm/L',osm:300,ef:0,ton:'isosmótica, mas hipotônica',st:'lise',agua:2,txt:'A osmolalidade é igual à do plasma, mas a ureia <b>atravessa</b> a membrana (σ ≈ 0): entra na hemácia, a água vai atrás e a célula se rompe. Isosmótico não é o mesmo que isotônico: só osmóis efetivos contam para a tonicidade.'},
    glic:{n:'Glicose 5%',osm:278,ef:278,ton:'isosmótica no frasco; hipotônica no organismo',st:'incha1',agua:1,txt:'No frasco, ~278 mOsm/L. Mas a glicose entra nas células (GLUT1 na hemácia; GLUT4 com insulina) e é metabolizada: o que sobra é <b>água livre</b>, que se distribui por toda a água corporal e tende a fazer as células incharem. Serve para repor água, não para expandir volume.'}
  };
  function cell(g,st){
    if(st==='lise'){
      E('ellipse',{cx:0,cy:0,rx:120,ry:120,fill:'var(--eosin-soft)',opacity:.6},g);
      E('circle',{cx:0,cy:0,r:96,fill:'none',stroke:'var(--eosin)','stroke-width':3,'stroke-dasharray':'14 10'},g);
      [[-40,-30,0],[30,-40,40],[50,30,80],[-30,40,120]].forEach(([x,y,r])=>E('path',{d:`M${x-18} ${y} q18 -14 36 0 q-18 10 -36 0`,fill:'var(--eosin)',opacity:.7,transform:`rotate(${r} ${x} ${y})`},g));return}
    if(st==='crena'||st==='crena2'){
      const R=st==='crena'?72:58,n=st==='crena'?14:18,sp=st==='crena'?12:15;let d='';
      for(let i=0;i<=n*2;i++){const a=Math.PI*i/n,r=i%2?R:R+sp;d+=(i?'L':'M')+(r*Math.cos(a)).toFixed(1)+' '+(0.9*r*Math.sin(a)).toFixed(1)}
      E('path',{d:d+'Z',fill:'var(--eosin)',stroke:'var(--bad)','stroke-width':2,'stroke-linejoin':'round'},g);
      E('ellipse',{cx:0,cy:0,rx:R*0.45,ry:R*0.35,fill:'var(--eosin-soft)',opacity:.35},g);return}
    if(st==='incha'||st==='incha1'){const r=st==='incha'?100:90;
      E('circle',{cx:0,cy:0,r,fill:'var(--eosin)',stroke:'var(--bad)','stroke-width':2},g);
      E('circle',{cx:-r*0.3,cy:-r*0.3,r:r*0.22,fill:'var(--panel)',opacity:.25},g);return}
    E('ellipse',{cx:0,cy:0,rx:92,ry:84,fill:'var(--eosin)',stroke:'var(--bad)','stroke-width':2},g);
    E('ellipse',{cx:0,cy:0,rx:42,ry:36,fill:'var(--eosin-soft)',opacity:.55},g);
  }
  function arrows(n){const g=E('g',{},s);if(!n)return;
    const k=Math.abs(n),inw=n>0;
    [[0,-1],[1,0],[0,1],[-1,0],[.7,.7],[-.7,-.7],[.7,-.7],[-.7,.7]].slice(0,k===2?8:4).forEach(([dx,dy])=>{
      const r1=inw?172:118,r2=inw?126:164,x1=300+dx*r1,y1=180+dy*r1*.8,x2=300+dx*r2,y2=180+dy*r2*.8;
      E('line',{x1,y1,x2,y2,stroke:'var(--sky)','stroke-width':5,'stroke-linecap':'round'},g);
      const a=Math.atan2(y2-y1,x2-x1);E('path',{d:`M${x2} ${y2} L${x2-14*Math.cos(a-0.5)} ${y2-14*Math.sin(a-0.5)} L${x2-14*Math.cos(a+0.5)} ${y2-14*Math.sin(a+0.5)}Z`,fill:'var(--sky)'},g)});
  }
  function draw(k){
    const d=D[k];clear(s);
    E('rect',{x:8,y:8,width:584,height:344,rx:22,fill:'var(--sky-soft)'},s);
    T(s,300,44,d.n,{fs:22,w:800});
    arrows(d.agua);
    const g=E('g',{transform:'translate(300 180)'},s);cell(g,d.st);
    if(!reduce&&d.st!=='normal'){E('animateTransform',{attributeName:'transform',type:'scale',from:'0.85',to:'1',dur:'0.6s',additive:'sum',fill:'freeze'},g)}
    const lab={normal:'Disco bicôncavo: equilíbrio',incha:'Incha: esferócito',incha1:'Tende a inchar',lise:'Hemólise',crena:'Crenação',crena2:'Crenação intensa'}[d.st];
    T(s,300,336,lab,{fs:20,w:700,fill:d.st==='normal'?'var(--ok)':'var(--bad)'});
    const ag=d.agua>0?'a água <b>entra</b> na célula':d.agua<0?'a água <b>sai</b> da célula':'não há fluxo líquido de água';
    out.innerHTML=`<b>${d.n}</b><br>Osmolaridade: <b>${d.osm} mOsm/L</b> · osmóis efetivos: <b>${d.ef}</b> · tonicidade: <b>${d.ton}</b>.<br>Resultado: ${ag}.<br>${d.txt}`;
  }
  choices('#oshBtns',draw);
})();

/* ---------- 2) Forças de Starling ---------- */
(function(){
  const s=$('#ossSvg');if(!s)return;const out=$('#ossOut');
  const I={Pa:$('#ossPa'),Pv:$('#ossPv'),Alb:$('#ossAlb'),Perm:$('#ossPerm'),L:$('#ossL')};
  const P={normal:[32,12,3.5,1,5],icc:[42,28,3.3,1,5],hipo:[32,12,1.2,1,5],infl:[34,14,3.3,7,5],linfa:[32,12,3.5,1,1]};
  let preset='normal';
  const pl=v=>['nula','muito baixa','baixa','baixa','moderada','moderada','média','alta','alta','muito alta','máxima'][v];
  function draw(){
    const Pa=+I.Pa.value,Pv=+I.Pv.value,Alb=+I.Alb.value,Pe=+I.Perm.value,L=+I.L.value;
    $('#ossPav').textContent=Pa+' mmHg';$('#ossPvv').textContent=Pv+' mmHg';$('#ossAlbv').textContent=osF(Alb)+' g/dL';$('#ossPermv').textContent=pl(Pe);$('#ossLv').textContent=pl(L);
    const pic=7*Alb+3,sig=Math.max(0.25,0.95-0.07*Pe),pii=5+1.2*Pe,kf=1+0.3*Pe,Pi=-2;
    const net=x=>(Pa+(Pv-Pa)*x)-Pi-sig*(pic-pii);
    let m=0;for(let i=0;i<=20;i++)m+=net(i/20)/21;
    const J=Math.max(0,kf*m),cap=2*L,ed=Math.max(0,J-cap);
    clear(s);
    const defs=E('defs',{},s),lg=E('linearGradient',{id:'ossGrad',x1:'0',x2:'1',y1:'0',y2:'0'},defs);
    E('stop',{offset:'0',style:'stop-color:var(--eosin)'},lg);E('stop',{offset:'1',style:'stop-color:var(--sky)'},lg);
    /* interstício */
    E('rect',{x:0,y:150,width:600,height:72,fill:'var(--amber-soft)'},s);
    T(s,16,214,'Interstício',{fs:18,a:'start',fill:'var(--amber)'});
    /* capilar */
    E('rect',{x:50,y:96,width:500,height:54,rx:27,fill:'url(#ossGrad)',opacity:.85},s);
    T(s,50,84,'Lado arterial',{fs:18,a:'start',fill:'var(--eosin)'});T(s,550,84,'Lado venoso',{fs:18,a:'end',fill:'var(--sky)'});
    T(s,300,130,'Capilar',{fs:20,w:800,fill:'var(--panel)'});
    /* setas */
    for(let i=0;i<6;i++){const x=i/5,v=net(x),px=80+i*88,len=Math.min(60,Math.abs(v)*2.2);if(len<4)continue;
      const down=v>0,y1=down?150:150+len+6,y2=down?150+len:154,col=down?'var(--eosin)':'var(--ok)';
      E('line',{x1:px,x2:px,y1,y2,stroke:col,'stroke-width':6,'stroke-linecap':'round'},s);
      const ty=down?y2+4:y2-8;E('path',{d:down?`M${px-9} ${y2-6} L${px+9} ${y2-6} L${px} ${ty+6}Z`:`M${px-9} ${y2+8} L${px+9} ${y2+8} L${px} ${y2-4}Z`,fill:col},s)}
    T(s,50,30,`Pressão efetiva: ${net(0)>0?'+':''}${osF(net(0),0)}`,{fs:18,a:'start',fill:'var(--eosin)'});
    T(s,550,30,`${net(1)>0?'+':''}${osF(net(1),0)} mmHg`,{fs:18,a:'end',fill:'var(--sky)'});
    T(s,50,56,`πc ${osF(pic,0)} · σ ${osF(sig,2)} · πi ${osF(pii,0)} mmHg`,{fs:18,a:'start',w:500,fill:'var(--muted)'});
    /* barras */
    const W=380,mx=Math.max(30,J,cap),bx=170;
    T(s,bx-12,258,'Filtrado',{fs:18,a:'end'});E('rect',{x:bx,y:242,width:W,height:22,rx:6,fill:'var(--line)'},s);
    E('rect',{x:bx,y:242,width:W*J/mx,height:22,rx:6,fill:'var(--eosin)'},s);
    T(s,bx-12,294,'Linfa drena',{fs:18,a:'end'});E('rect',{x:bx,y:278,width:W,height:22,rx:6,fill:'var(--line)'},s);
    E('rect',{x:bx,y:278,width:W*cap/mx,height:22,rx:6,fill:'var(--ok)'},s);
    T(s,300,330,ed>0?(ed>15?'EDEMA ACENTUADO':'EDEMA'):'Sem edema: a linfa dá conta',{fs:20,w:800,fill:ed>0?'var(--bad)':'var(--ok)'});
    let msg=`Filtração líquida estimada: <b>${osF(J)}</b> unidades; capacidade linfática: <b>${osF(cap)}</b>. `;
    const exp={normal:'No capilar normal, o lado arterial filtra e o lado venoso tende a reabsorver; o pequeno saldo volta pela linfa.',
      icc:'Na insuficiência cardíaca a pressão venosa sobe e é transmitida ao capilar: a filtração aumenta em todo o vaso e a reabsorção desaparece. Edema pulmonar (lado esquerdo) ou ascite e edema de barbela (lado direito).',
      hipo:'Com albumina baixa a pressão oncótica despenca: nada segura o líquido no vaso. Edema generalizado, transudato pobre em proteína (enteropatia ou nefropatia com perda de proteína, hemoncose, insuficiência hepática).',
      infl:'Na inflamação o endotélio abre fendas: Kf aumenta, σ cai e proteínas vão para o interstício (πi sobe). Forma-se exsudato rico em proteína: calor, rubor e tumor.',
      linfa:'As pressões estão normais, mas a linfa não drena o excesso filtrado. Proteínas se acumulam no interstício e o edema fica firme e localizado.'};
    if(preset)msg+=exp[preset];else msg+=ed>0?'O filtrado supera a drenagem linfática: forma-se edema. Que força você alterou?':'O sistema linfático ainda compensa a filtração.';
    out.innerHTML=msg;
  }
  function set(k){preset=k;const v=P[k];['Pa','Pv','Alb','Perm','L'].forEach((n,i)=>I[n].value=v[i]);draw()}
  Object.values(I).forEach(el=>el.addEventListener('input',()=>{preset=null;$$('#ossBtns button').forEach(b=>b.setAttribute('aria-pressed','false'));draw()}));
  choices('#ossBtns',set);
})();

/* ---------- 3) Distribuição de fluidos e cálculo ---------- */
(function(){
  const s=$('#osfSvg');if(!s)return;const out=$('#osfOut');
  const sp=$('#osfSp'),dIn=$('#osfD'),vIn=$('#osfV');
  const SP={bez:{n:'bezerro',kg:40,act:.75,man:90},cao:{n:'cão',kg:20,act:.6,man:55},gato:{n:'gato',kg:4,act:.6,man:50},vaca:{n:'vaca',kg:550,act:.6,man:50},cav:{n:'cavalo',kg:450,act:.6,man:55}};
  const FN={nacl:'NaCl 0,9% / Ringer com lactato',glic:'Glicose 5%',hip:'NaCl 7,5%',col:'Coloide'};
  let f='nacl';
  const L=v=>Math.abs(v)>=10?osF(v,0)+' L':Math.abs(v)>=1?osF(v,1)+' L':osF(v*1000,0)+' mL';
  function draw(){
    const a=SP[sp.value],D=+dIn.value,vk=+vIn.value,V=vk*a.kg/1000;
    $('#osfDv').textContent=D+'%';$('#osfVv').textContent=vk+' mL/kg ('+L(V)+')';
    const ACT=a.kg*a.act,LIC=ACT*2/3;let pl=0,it=0,ic=0;
    if(f==='nacl'){pl=V/4;it=3*V/4}
    else if(f==='glic'){pl=V/12;it=V/4;ic=2*V/3}
    else if(f==='col'){pl=0.9*V;it=0.1*V}
    else{const no=(ACT*290+V*2400)/(ACT+V),dl=LIC*290/no-LIC;ic=dl;pl=(V-dl)/4;it=3*(V-dl)/4}
    clear(s);
    const rows=[['Plasma',pl,'var(--eosin)'],['Interstício',it,'var(--amber)'],['Células (LIC)',ic,'var(--sky)']];
    const mx=Math.max(0.001,...rows.map(r=>Math.abs(r[1]))),X0=360,W=200;
    T(s,300,30,FN[f]+': onde o volume fica após equilibrar',{fs:18,w:700});
    E('line',{x1:X0,x2:X0,y1:46,y2:250,stroke:'var(--ink)','stroke-width':2},s);
    rows.forEach(([n,v,c],i)=>{const y=62+i*64,w=W*Math.abs(v)/mx;
      T(s,20,y+30,n,{fs:20,a:'start'});
      E('rect',{x:v>=0?X0:X0-w,y,width:Math.max(w,0.5),height:40,rx:6,fill:c,opacity:v>=0?1:.45},s);
      const lbl=(v>0?'+':v<0?'−':'')+L(Math.abs(v));
      const tx=v>=0?Math.min(X0+w+8,590):X0-w-8,an=v>=0?(X0+w+8>520?'end':'start'):'end';
      T(s,an==='end'&&v>=0?X0+w-8:tx,y+28,lbl,{fs:18,a:an,w:800,fill:an==='end'&&v>=0?'var(--panel)':'var(--ink)'})});
    T(s,X0,282,'← perde · ganha →',{fs:18,w:500,fill:'var(--muted)'});
    const def=a.kg*D/100,man=a.kg*a.man/1000;
    let msg=`<b>${a.n[0].toUpperCase()+a.n.slice(1)} de ${a.kg} kg</b> (água corporal ≈ ${L(ACT)}).<br>Déficit: ${a.kg} × ${D}% = <b>${L(def)}</b> · manutenção (${a.man} mL/kg/dia): <b>${L(man)}</b> · total nas primeiras 24 h (sem perdas contínuas): <b>${L(def+man)}</b>.<br>`;
    if(f==='nacl')msg+=`Do bolus de ${L(V)}, só cerca de <b>1/4 (${L(pl)})</b> permanece no plasma; o resto vai ao interstício, porque Na⁺ e Cl⁻ atravessam livremente o capilar mas não a membrana celular.`;
    if(f==='glic')msg+=`A glicose é captada e metabolizada: sobra água livre, que se distribui por toda a água corporal. Apenas <b>~1/12 (${L(pl)})</b> fica no plasma e 2/3 entram nas células. Ótima para repor água livre na hipernatremia, inútil para tratar choque.`;
    if(f==='col')msg+=`As moléculas grandes ficam no vaso (σ alto): <b>~90% (${L(pl)})</b> permanece no plasma e ainda sustenta a pressão oncótica. Se a permeabilidade estiver aumentada (sepse, inflamação), o coloide escapa e esse benefício se perde.`;
    if(f==='hip'){msg+=`Os ${L(V)} de NaCl 7,5% puxam cerca de <b>${L(-ic)}</b> de água das células para o LEC. No equilíbrio o plasma ganha ${L(pl)} (${osF(pl/Math.max(V,1e-6),1)}× o volume infundido); no pico, nos primeiros minutos, a expansão plasmática chega a 3–4× o volume, à custa sobretudo do interstício. `;
      msg+=vk>5?'<b>Atenção:</b> a dose usual é de 4–5 mL/kg; volumes maiores causam hipernatremia e hemólise.':'Dose dentro do usual (4–5 mL/kg em 4–5 minutos). Em seguida, ofereça água ou faça cristaloide isotônico para repor o déficit.'}
    out.innerHTML=msg;
  }
  sp.addEventListener('change',draw);dIn.addEventListener('input',draw);vIn.addEventListener('input',draw);
  choices('#osfBtns',k=>{f=k;if(k==='hip'&&+vIn.value>10)vIn.value=4;if(k!=='hip'&&+vIn.value<10)vIn.value=20;draw()});
})();
