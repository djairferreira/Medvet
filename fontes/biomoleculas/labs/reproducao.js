const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;

/* ===== 1. Ciclo estral da vaca ===== */
(()=>{const s=$('#ceSvg');if(!s)return;
  const g=(x,c,sd)=>Math.exp(-0.5*((x-c)/sd)**2),sm=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
  const st={ph:'estro',preg:false,on:{p4:true,e2:true,lh:true,fsh:true,pgf:true}};
  const H={
    p4:(x,p)=>x<3?0.05:x<9?0.05+0.95*sm((x-3)/6):(p||x<16)?1:x<18.5?1-0.95*sm((x-16)/2.5):0.05,
    e2:(x,p)=>0.08+0.22*g(x,4,1.2)+0.25*g(x,12,1.4)+(p?0.22*g(x,19,1.4):0)+g(x,-0.2,0.9)+(p?0:g(x,20.8,0.9)),
    lh:(x,p)=>0.05+0.95*g(x,0.3,0.25)+(p?0:0.95*g(x,21.3,0.25)),
    fsh:(x,p)=>0.15+0.5*g(x,0.3,0.3)+0.4*g(x,1.3,0.6)+0.35*g(x,9.5,1)+(p?0.3*g(x,18.5,1):0.5*g(x,21.3,0.3)),
    pgf:(x,p)=>p?0:[15.5,16.25,17,17.75].reduce((a,c)=>a+0.9*g(x,c,0.13),0)};
  const COL={p4:'var(--amber)',e2:'var(--eosin)',lh:'var(--sky)',fsh:'var(--ok)',pgf:'var(--hema)'};
  const LAB={p4:'P4',e2:'E2',lh:'LH',fsh:'FSH',pgf:'PGF'};
  const D0=-2,D1=22,X0=40,X1=585,Y0=255,Y1=50;const px=d=>X0+(X1-X0)*(d-D0)/(D1-D0),py=v=>Y0-(Y0-Y1)*Math.min(v,1.1)/1.1;
  const val=(k,d)=>d<0?H[k](d+21,false)*(k==='e2'||k==='lh'||k==='fsh'?0:1)+(k==='e2'||k==='lh'||k==='fsh'?H[k](d,st.preg):0):H[k](d,st.preg);
  const BANDS=()=>st.preg?[['pro',D0,0],['estro',0,0.75],['meta',0.75,4.5],['di',4.5,17],['gest',17,D1]]:[['pro',D0,0],['estro',0,0.75],['meta',0.75,4.5],['di',4.5,18],['pro',18,21],['estro',21,21.75],['meta',21.75,D1]];
  const BL={pro:'PRO',estro:'E',meta:'MET',di:'DIESTRO',gest:'GESTAÇÃO'};
  const TXT={
    pro:['Proestro (dias 18–20)','A <b>PGF₂α</b> do endométrio lisou o corpo lúteo: a <b>progesterona despenca</b>. Livres do freio, os pulsos de LH ficam frequentes e o folículo dominante da última onda cresce rápido, produzindo cada vez mais <b>estradiol</b>. Vulva começa a edemaciar, muco aumenta, a vaca fica inquieta e monta nas outras.'],
    estro:['Estro (dia 0, ~12–18 h)','<b>Estradiol no máximo</b>, sem progesterona: retroalimentação positiva no hipotálamo e <b>pico de LH</b> (com pico de FSH). A vaca <b>aceita a monta</b>, muco cristalino, vulva edemaciada. A ovulação ocorre ~24–32 h após o início do estro, já no metaestro. Inseminar da segunda metade do cio até pouco depois do fim (regra “manhã–tarde”).'],
    meta:['Metaestro (dias 1–4)','Ovulação (~dia 1) e formação do <b>corpo hemorrágico</b>; as células se luteinizam e a progesterona começa a subir. Um segundo pico de FSH recruta a <b>1ª onda folicular</b>. Pode haver sangramento vaginal discreto. Nesta fase o corpo lúteo ainda é <b>refratário à PGF₂α</b>.'],
    di:['Diestro (dias 5–17)','<b>Corpo lúteo maduro</b> e progesterona alta: pulsos de LH raros, nenhum folículo ovula. A 1ª onda tem um dominante que regride; FSH recruta a <b>2ª onda</b> (~dia 9–10). A partir do dia ~16, sem embrião, o endométrio libera <b>pulsos de PGF₂α</b> (alça com a ocitocina luteal) e começa a luteólise.'],
    gest:['Gestação (após o dia 16–17)','O embrião secretou <b>interferon-tau</b> entre os dias 14 e 17: o endométrio não expressa receptores de ocitocina, <b>não há pulsos de PGF₂α</b> e o corpo lúteo continua produzindo progesterona. Ondas foliculares continuam, mas nenhum folículo ovula. Não há novo cio aos 21 dias.']};
  function draw(){clear(s);
    BANDS().forEach(([k,a,b])=>{const sel=k===st.ph||(k==='gest'&&st.ph==='di'&&st.preg&&false);
      const r=E('rect',{x:px(a),y:Y1-10,width:px(b)-px(a),height:Y0-Y1+10,fill:sel?'var(--amber-soft)':'transparent',style:'cursor:pointer'},s);
      const bar=E('rect',{x:px(a)+1,y:Y0+10,width:Math.max(1,px(b)-px(a)-2),height:34,rx:6,fill:sel?'var(--hema)':'var(--bone-2)',opacity:sel?1:.55,style:'cursor:pointer'},s);
      const w=px(b)-px(a);if(w>22)T(s,(px(a)+px(b))/2,Y0+34,w>80?BL[k]:BL[k].slice(0,w>45?3:1),{fs:18,w:700,fill:sel?'var(--paper)':'var(--ink)'});
      [r,bar].forEach(el=>el.addEventListener('click',()=>{st.ph=k==='gest'?'gest':k;const b2=$(`#cePh [data-k="${k}"]`);if(b2)press($('#cePh'),b2);else press($('#cePh'),null);draw()}))});
    for(let d=0;d<=21;d+=3){E('line',{x1:px(d),y1:Y0,x2:px(d),y2:Y0+6,stroke:'var(--muted)'},s);T(s,px(d),Y0+68,'d'+d,{fs:18,w:500,fill:'var(--muted)'})}
    E('line',{x1:X0,y1:Y0,x2:X1,y2:Y0,stroke:'var(--ink)'},s);
    Object.keys(H).forEach(k=>{if(!st.on[k])return;let d='';for(let x=D0;x<=D1;x+=0.05)d+=(x===D0?'M':'L')+px(x).toFixed(1)+' '+py(val(k,x)).toFixed(1)+' ';
      E('path',{d,fill:'none',stroke:COL[k],'stroke-width':k==='p4'?4:3},s)});
    let lx=X0;Object.keys(H).forEach(k=>{if(!st.on[k])return;E('rect',{x:lx,y:14,width:18,height:6,rx:3,fill:COL[k]},s);T(s,lx+24,24,LAB[k],{fs:18,a:'start',w:700,fill:COL[k]});lx+=LAB[k].length*12+52});
    const t=TXT[st.ph];$('#ceOut').innerHTML=`<b>${t[0]}</b><br>${t[1]}`}
  choices('#cePh',k=>{st.ph=k;if(s.firstChild)draw()});
  choices('#cePreg',k=>{st.preg=k==='sim';if(!st.preg&&st.ph==='gest')st.ph='di';draw()});
  const hg=$('#ceH');if(hg)hg.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const k=b.dataset.k;st.on[k]=!st.on[k];b.setAttribute('aria-pressed',String(st.on[k]));draw()});
  draw();
})();

/* ===== 2. Comparador de ciclos ===== */
(()=>{const s=$('#csSvg');if(!s)return;
  const M=['J','F','M','A','M','J','J','A','S','O','N','D'];
  const S={
    vaca:{n:'Vaca',un:'dias',seg:[['Proestro',3,'pro'],['Estro',0.75,'est'],['Metaestro',3.5,'lut'],['Diestro',13.75,'lut']],ov:4.2,mes:'all',tipo:'Poliéstrica contínua',txt:'Ciclo de 21 dias (18–24), 2 a 3 ondas foliculares. Estro curto (12–18 h; zebuínas ~10 h, muitas vezes à noite). Ovulação 24–32 h após o início do estro, depois que o cio acabou. Luteólise local por PGF₂α (dia 16–18). Gestação ~283 dias.'},
    egua:{n:'Égua',un:'dias',seg:[['Estro',6,'est'],['Diestro',15,'lut']],ov:5,mes:[9,10,11,12,1,2],tipo:'Poliéstrica estacional de dias longos',txt:'Cicla na primavera e no verão (no Brasil, aproximadamente de setembro a fevereiro). Estro longo (5–7 dias) com ovulação 24–48 h antes do fim, pela fossa de ovulação; o folículo ovulatório chega a 35–45 mm (hCG ou deslorelina induzem a ovulação). Luteólise por PGF₂α sistêmica. Gestação ~340 dias; eCG dos cálices endometriais (dias 40–120).'},
    ovelha:{n:'Ovelha',un:'dias',seg:[['Proestro',2,'pro'],['Estro',1.25,'est'],['Metaestro',2.5,'lut'],['Diestro',11.25,'lut']],ov:3.1,mes:[3,4,5,6,7],tipo:'Poliéstrica estacional de dias curtos',txt:'Ciclo de 17 dias; estro de 24–36 h; ovulação perto do fim do estro. A melatonina das noites longas estimula o GnRH (outono e inverno). O efeito macho e implantes de melatonina/progestágeno + eCG induzem cio fora da estação. Placenta assume a progesterona a partir de ~50 dias. Gestação ~150 dias.'},
    cabra:{n:'Cabra',un:'dias',seg:[['Proestro',2,'pro'],['Estro',1.5,'est'],['Metaestro',3,'lut'],['Diestro',14.5,'lut']],ov:3.4,mes:[3,4,5,6,7,8],tipo:'Poliéstrica estacional de dias curtos',txt:'Ciclo de ~21 dias; estro de 24–48 h. Estacionalidade forte em raças de clima temperado; perto do Equador (Nordeste) muitas cabras ciclam quase o ano todo. Corpo lúteo necessário durante toda a gestação (~150 dias): PGF₂α causa aborto a qualquer momento.'},
    porca:{n:'Porca',un:'dias',seg:[['Proestro',2,'pro'],['Estro',2.5,'est'],['Metaestro',2,'lut'],['Diestro',14.5,'lut']],ov:3.6,mes:'all',tipo:'Poliéstrica contínua',txt:'Ciclo de 21 dias; estro de 48–72 h (reflexo de imobilidade com pressão no dorso, na presença do macho); ovulação ~36–44 h após o início do estro, com 15–25 oócitos. Anestro na lactação; cio 4–7 dias após o desmame. Reconhecimento por estrógenos do concepto (dias 11–12). Gestação ~114 dias.'},
    cadela:{n:'Cadela',un:'dias',seg:[['Proestro',9,'pro'],['Estro',9,'est'],['Diestro',60,'lut'],['Anestro',120,'an']],ov:11,mes:'all',tipo:'Monoéstrica, não estacional',txt:'Proestro ~9 dias com sangramento; estro ~9 dias. A progesterona sobe antes da ovulação; ovulação ~2 dias após o pico de LH, de oócitos primários que amadurecem mais 2–3 dias. Diestro de ~2 meses igual com ou sem gestação (pseudogestação comum). Anestro de vários meses. Gestação ~63 dias após a ovulação.'},
    gata:{n:'Gata (sem cópula)',un:'dias',seg:[['Proestro',1,'pro'],['Estro',7,'est'],['Interestro',10,'an']],ov:null,mes:[8,9,10,11,12,1,2,3],tipo:'Poliéstrica estacional de dias longos, ovulação induzida',txt:'Sem cópula, ondas foliculares a cada 14–21 dias (estro de 5–8 dias e interestro) durante a estação de dias longos; gatas mantidas sob luz artificial podem ciclar o ano todo. A cópula (várias, de preferência) dispara o pico de LH e a ovulação 24–36 h depois. Ovulação sem concepção → pseudogestação de 5–6 semanas. Gestação ~63–65 dias.'},
    coelha:{n:'Coelha e camelídeos',un:'dias',seg:[['Receptiva (ondas foliculares contínuas)',14,'est']],ov:null,mes:'all',tipo:'Ovulação induzida pela cópula',txt:'Não têm ciclo estral regular: ondas foliculares se sucedem e a fêmea fica receptiva a maior parte do tempo. A cópula induz o pico de LH e a ovulação ~10–13 h depois (coelha) ou ~24–48 h (lhama e alpaca, cujo sêmen tem fator indutor de ovulação). Coelha: gestação ~31 dias; cópula estéril causa pseudogestação de ~16–17 dias.'}};
  const COL={pro:'var(--sky)',est:'var(--eosin)',lut:'var(--amber)',an:'var(--bone-2)'};
  choices('#csSp',k=>{clear(s);const d=S[k],tot=d.seg.reduce((a,x)=>a+x[1],0),X0=20,X1=580,sx=v=>X0+(X1-X0)*v/tot;
    T(s,X0,30,d.tipo,{fs:18,a:'start',w:700});
    let acc=0;d.seg.forEach(([n,l,c])=>{const a=sx(acc),b=sx(acc+l);E('rect',{x:a,y:50,width:Math.max(2,b-a-2),height:46,rx:6,fill:COL[c]},s);
      const w=b-a;const lab=w>n.length*10+10?n:w>40?n.slice(0,3):'';if(lab)T(s,(a+b)/2,80,lab,{fs:18,fill:c==='an'?'var(--ink)':'var(--paper)'});acc+=l});
    if(d.ov!=null){const x=sx(d.ov);E('path',{d:`M${x} 100 l-9 16 h18 z`,fill:'var(--hema)'},s);T(s,Math.min(Math.max(x,70),530),136,'ovulação',{fs:18,fill:'var(--hema)'})}
    else T(s,300,136,'ovulação só após a cópula',{fs:18,fill:'var(--hema)'});
    T(s,X1,30,'ciclo ≈ '+(k==='cadela'?'6–7 meses':Math.round(tot)+' dias'),{fs:18,a:'end',w:600,fill:'var(--muted)'});
    T(s,X0,172,'Época reprodutiva (Hemisfério Sul):',{fs:18,a:'start',w:600,fill:'var(--muted)'});
    const w=(X1-X0)/12;M.forEach((m,i)=>{const on=d.mes==='all'||d.mes.includes(i+1);E('rect',{x:X0+i*w+2,y:186,width:w-4,height:40,rx:6,fill:on?'var(--ok)':'var(--line)'},s);T(s,X0+i*w+w/2,213,m,{fs:18,fill:on?'var(--paper)':'var(--muted)'})});
    $('#csOut').innerHTML=`<b>${d.n}</b> · ${d.tipo}<br>${d.txt}`});
})();
