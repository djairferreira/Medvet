const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;

/* ===== Lab 1: ovo de galinha em incubação (dias 1–21) ===== */
(function(){
  const svg=$('#anovSvg');if(!svg)return;
  const rng=$('#anovDia'),txt=$('#anovDiaTxt'),out=$('#anovOut'),play=$('#anovPlay');
  const EGG=(l,r,ry)=>`M300 ${160-ry} A${l} ${ry} 0 0 0 300 ${160+ry} A${r} ${ry} 0 0 0 300 ${160-ry}Z`;
  const D={
    1:['Blastoderma e linha primitiva','Nas primeiras horas o blastoderma retoma o desenvolvimento; a linha primitiva aparece por volta de 16 a 18 h e começa a gastrulação (cap. 20). As ilhotas sanguíneas surgem na área opaca, que logo será a área vascular do saco vitelino.','Temperatura de 37,5 a 37,8 °C; viragem dos ovos começa.'],
    2:['Coração bate e pregas amnióticas','O coração começa a bater (cerca de 40 h) e a circulação vitelina se liga ao embrião. A prega amniótica cefálica cobre a cabeça; o seio terminal marca a borda da área vascular.','Ovoscopia ainda pouco informativa.'],
    3:['Âmnio fecha e surge o alantoide','As pregas se fundem sobre o dorso: o âmnio envolve o embrião e o córion (serosa) fica por fora. O alantoide aparece como divertículo do intestino posterior. O embrião gira e passa a deitar sobre o lado esquerdo.','A rede de vasos já pode ser vista na ovoscopia por operadores treinados.'],
    4:['Alantoide sai do corpo','O alantoide cresce no celoma extraembrionário, junto à cauda. Surgem os brotos dos membros; olho pigmentado visível.','Ovo fértil: “aranha” de vasos na ovoscopia.'],
    5:['Corioalantoide começa','O alantoide encosta na serosa e as duas membranas se fundem: nasce a membrana corioalantoide (CAM), que assume a troca gasosa.','Ovos claros (inférteis) podem ser retirados.'],
    6:['Saco vitelino envolve a gema','O saco vitelino já cobre quase toda a gema e absorve o vitelo pela parede. O âmnio tem músculo liso e se contrai, balançando o embrião.','Mortalidade embrionária precoce aparece como anel de sangue na ovoscopia.'],
    7:['CAM se espalha sob a casca','A CAM cresce por baixo da membrana interna da casca, levando vasos para perto dos poros.','Continue a viragem: ela ajuda a CAM a se espalhar e a envolver o albúmen.'],
    8:['Embrião ganha forma de ave','Bico e brotos de penas aparecem. A CAM cobre cerca de metade da casca.','—'],
    9:['CAM cobre a maior parte da casca','A troca gasosa pela CAM aumenta muito. É a fase usada para inocular vírus na CAM (9 a 12 dias).','—'],
    10:['Começa a retirada de cálcio','Células do epitélio coriônico da CAM passam a dissolver a face interna da casca; o cálcio vai ao esqueleto que se ossifica.','—'],
    11:['CAM fecha o saco do albúmen','A CAM envolve todo o conteúdo e fecha o albúmen restante num saco no polo agudo. A cavidade do alantoide acumula ácido úrico.','—'],
    12:['Albúmen comunica com o âmnio','Abre-se a comunicação entre o saco do albúmen e a cavidade amniótica: o albúmen passa ao líquido amniótico.','—'],
    13:['Albúmen é deglutido','O embrião deglute o líquido amniótico rico em albúmen (dias 13 a 16), sua principal fonte de proteína agora.','—'],
    14:['Embrião se alinha ao eixo maior','O embrião gira e fica ao longo do eixo maior do ovo, com a cabeça voltada para a câmara de ar (polo rombo).','Ovos incubados de ponta para cima favorecem malposição.'],
    15:['Retirada máxima de cálcio','O transporte de cálcio da casca é máximo entre os dias 15 e 18; a casca fica mais fina.','—'],
    16:['Albúmen quase acabou','O saco do albúmen está quase vazio; o embrião ocupa boa parte do ovo.','—'],
    17:['Cabeça sob a asa direita','O líquido amniótico diminui; a cabeça se posiciona sob a asa direita com o bico voltado para a câmara de ar.','—'],
    18:['Posição de eclosão','Fim da viragem. O embrião está em posição para bicar.','Transferir para o nascedouro; aumentar a umidade.'],
    19:['Bicagem interna e saco vitelino entra no abdome','O bico rompe a membrana interna e entra na câmara de ar: começa a respiração pulmonar. A sobra do saco vitelino é puxada para dentro do abdome.','Não abrir o nascedouro: queda de umidade prende o pinto à membrana.'],
    20:['Bicagem externa','O pinto quebra a casca (bicagem externa). A circulação da CAM diminui e a respiração passa a ser só pulmonar; o umbigo se fecha.','—'],
    21:['Eclosão','O pinto gira dentro da casca, corta-a em círculo e sai. Dentro da casca ficam a CAM seca e os cristais brancos de ácido úrico do alantoide. O vitelo residual sustenta o pintinho por 2 a 3 dias.','Umbigo mal cicatrizado favorece onfalite.']
  };
  function draw(d){
    clear(svg);
    const defs=E('defs',{},svg),cp=E('clipPath',{id:'anovClip'},defs);E('path',{d:EGG(212,242,132)},cp);
    const g=E('g',{'clip-path':'url(#anovClip)'},svg);
    E('path',{d:EGG(212,242,132),fill:d>=11?'var(--eosin-soft)':'var(--hema-soft)'},g);
    /* albúmen (saco) após dia 11 */
    if(d>=11){const ra=Math.max(0,70-(d-11)*10);if(ra>0)E('ellipse',{cx:480,cy:180,rx:ra,ry:ra*.8,fill:'var(--hema-soft)',stroke:'var(--hema-2)','stroke-width':2},g)}
    /* gema */
    let yr=d>=20?0:Math.max(22,100-d*4),ycx=300,ycy=185;
    if(yr){E('circle',{cx:ycx,cy:ycy,r:yr,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':2},g);
      const C=2*Math.PI*yr,cov=Math.min(1,d/6);
      E('circle',{cx:ycx,cy:ycy,r:yr,fill:'none',stroke:'var(--amber)','stroke-width':7,'stroke-dasharray':(cov*C)+' '+C,transform:`rotate(${-90-cov*180} ${ycx} ${ycy})`},g)}
    /* embrião */
    let L,ex,ey;
    if(d<=13){L=18+d*10;ex=ycx;ey=ycy-yr-L*.2-(d>=3?16:4)}else{L=150+(d-14)*16;ex=300+8;ey=150}
    const h=L*.4;
    /* alantoide até o dia 10 */
    if(d>=3&&d<=10){const r=[0,0,0,7,13,22,32,44,56,66,74][d];E('circle',{cx:ex+L/2+r*.4,cy:ey+4,r,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2.5},g)}
    /* âmnio */
    const m=d>=17?6:14;
    if(d>=3)E('ellipse',{cx:ex,cy:ey,rx:L/2+m,ry:h/2+m,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':3},g);
    else if(d===2)E('path',{d:`M${ex-L/2-10} ${ey+4} Q${ex-L/2} ${ey-h/2-14} ${ex-4} ${ey-h/2-12}`,fill:'none',stroke:'var(--sky)','stroke-width':3},g);
    E('ellipse',{cx:ex+L*.08,cy:ey,rx:L*.42,ry:h/2,fill:'var(--bone-2)',stroke:'var(--bone-ink)','stroke-width':2},g);
    E('circle',{cx:ex-L*.36,cy:ey-h*.08,r:h*.42,fill:'var(--bone-2)',stroke:'var(--bone-ink)','stroke-width':2},g);
    if(d>=20)E('circle',{cx:ex+L*.1,cy:ey+h*.15,r:14,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':2},g);
    /* câmara de ar */
    const xb=96+2.4*d;
    E('path',{d:`M0 0 L${xb} 0 Q${xb+16} 160 ${xb} 320 L0 320Z`,fill:'var(--paper)'},g);
    E('path',{d:`M${xb} 0 Q${xb+16} 160 ${xb} 320`,fill:'none',stroke:'var(--muted)','stroke-width':2,'stroke-dasharray':'6 4'},g);
    if(d>=19){const hx=ex-L*.36-h*.42;E('path',{d:`M${hx+2} ${ey-6} L${xb+4} ${ey-2} L${hx+2} ${ey+6}Z`,fill:'var(--amber)'},g)}
    /* CAM */
    if(d>=5){const c=Math.min(100,(d-4)/7*100);E('path',{d:EGG(206,236,126),fill:'none',stroke:'var(--eosin)','stroke-width':8,pathLength:100,'stroke-dasharray':`${c/2} ${100-c} ${c/2}`,opacity:d>=20?.35:1},g)}
    /* casca */
    E('path',{d:EGG(220,250,140),fill:'none',stroke:'var(--bone-2)','stroke-width':10},svg);
    if(d>=20)E('path',{d:d>=21?'M128 40 l14 14 l10 -12 l12 16 l12 -10 l8 18':'M120 60 l10 8 l8 -8 l8 10',fill:'none',stroke:'var(--ink)','stroke-width':4},svg);
    /* legenda */
    const LG=[['Embrião','var(--bone-2)'],['Âmnio','var(--sky)'],['Saco vitelino','var(--amber)'],['Alantoide e CAM','var(--eosin)'],['Albúmen','var(--hema-soft)'],['Câmara de ar','var(--paper)']];
    LG.forEach(([t,c],i)=>{const x=20+(i%3)*200,y=i<3?338:378;E('rect',{x,y:y-15,width:20,height:20,rx:4,fill:c,stroke:'var(--muted)','stroke-width':1},svg);T(svg,x+28,y+1,t,{a:'start',fs:19})});
    const [ti,tx,inc]=D[d];
    out.innerHTML=`<b>Dia ${d} · ${ti}</b><br>${tx}${inc!=='—'?`<br><span style="color:var(--muted)">Na incubadora:</span> ${inc}`:''}`;
    txt.textContent=d;
  }
  let d=1,tm=null;
  const go=n=>{d=Math.max(1,Math.min(21,n));rng.value=d;draw(d)};
  const stop=()=>{if(tm){clearInterval(tm);tm=null;play.textContent='Reproduzir'}};
  rng.addEventListener('input',()=>{stop();go(+rng.value)});
  $('#anovPrev').addEventListener('click',()=>{stop();go(d-1)});
  $('#anovNext').addEventListener('click',()=>{stop();go(d+1)});
  play.addEventListener('click',()=>{
    if(tm){stop();return}
    if(reduce){go(d>=21?1:d+1);return}
    if(d>=21)go(1);play.textContent='Pausar';
    tm=setInterval(()=>{if(d>=21){stop();return}go(d+1)},900)});
  go(1);
})();

/* ===== Lab 2: saco embrionário por espécie ===== */
(function(){
  const svg=$('#anplSvg');if(!svg)return;
  const out=$('#anplOut');let sp='porca',hi='tudo';
  const S={
    porca:{n:'Porca',gest:'114 dias',sac:'Tubo longo e fino, com pontas necróticas; vários conceptos nos dois cornos',forma:'Difusa incompleta (pregas e aréolas)',cam:'Epiteliocorial',
      amnio:'Encosta no córion na face dorsal (amniocórion). O leitão rompe as membranas e nasce sem âmnio, que sai depois com a placenta.',
      alant:'Grande, mas não envolve o âmnio por completo. Nas pontas, o alantocórion isquêmico vira apêndice necrótico.',
      vit:'Regride cedo; não forma placenta coriovitelínica relevante e não existe mais no parto.',
      plac:'Pregas finas em todo o córion, exceto nas pontas. Aréolas sobre as glândulas absorvem histotrofo, inclusive a uteroferrina (ferro). Sacos vizinhos se encostam sem anastomoses.',
      clin:'Ferro injetável nos primeiros dias; colostro logo ao nascer (sem IgG transplacentária). Fetos mortos após ~35 dias mumificam (parvovírus).'},
    egua:{n:'Égua',gest:'~340 dias',sac:'Ovoide, com dois apêndices nos cornos; um só concepto',forma:'Difusa completa (microcotilédones)',cam:'Epiteliocorial',
      amnio:'Totalmente envolvido pelo alantoide e livre do córion: o potro nasce dentro do âmnio, que deve ser retirado das narinas.',
      alant:'Envolve todo o âmnio. Líquido âmbar, 7 a 10 L no parto, com hipomanes flutuando.',
      vit:'Grande no início: placenta coriovitelínica (3ª a 14ª semana). No anel coriônico nascem as células que formam os cálices endometriais (eCG).',
      plac:'Microcotilédones em todo o córion, exceto na estrela cervical, diante da cérvix, onde a placenta rompe no parto e por onde entram as placentites ascendentes.',
      clin:'Gêmeos quase sempre fracassam: reduzir até o dia 16. Placenta vermelha é emergência. Retenção acima de 3 h: risco de laminite.'},
    vaca:{n:'Vaca',gest:'~280 dias',sac:'Bicorne e longo, sobretudo no corno gestante',forma:'Cotiledonária, placentomas convexos (75 a 120)',cam:'Sinepiteliocorial',
      amnio:'Encosta no córion dorsalmente (amniocórion). Bolsa amniótica é a “segunda bolsa” no parto; líquido mucoso lubrifica o canal.',
      alant:'Não envolve o âmnio todo. Líquido âmbar, 8 a 15 L; hidroalantoide é a hidropisia mais comum.',
      vit:'Atrofia muito cedo: não há placenta coriovitelínica.',
      plac:'Cotilédones encaixados nas carúnculas (placentomas em forma de cogumelo). Células binucleadas liberam lactogênio placentário e PAG.',
      clin:'Gêmeos de sexos diferentes: anastomoses → freemartin. Retenção de placenta acima de 12–24 h (hipocalcemia, Se/vit. E).'},
    ovelha:{n:'Ovelha e cabra',gest:'~150 dias',sac:'Bicorne; gêmeos frequentes',forma:'Cotiledonária, placentomas côncavos (cabra: disco)',cam:'Sinepiteliocorial (antes chamada sindesmocorial)',
      amnio:'Como na vaca: amniocórion dorsal, alantoâmnio incompleto.',
      alant:'Não envolve todo o âmnio; apêndices necróticos nas pontas.',
      vit:'Atrofia cedo, sem placenta coriovitelínica.',
      plac:'Carúnculas em forma de taça recebem os cotilédones. Na ovelha, a placenta produz progesterona suficiente após ~50 dias; a cabra depende do corpo lúteo até o fim.',
      clin:'Gêmeos com aderências superficiais, sem anastomoses: freemartin raro. Aborto enzoótico (Chlamydia) e Coxiella: zoonoses.'},
    cadela:{n:'Cadela',gest:'~63 dias',sac:'Barril; vários conceptos espaçados nos dois cornos (ampolas)',forma:'Zonária',cam:'Endoteliocorial, decídua',
      amnio:'Livre, totalmente envolvido pelo alantoide: o filhote pode nascer dentro do âmnio, que a mãe rompe e lambe.',
      alant:'Envolve todo o âmnio.',
      vit:'Persistente e alongado: placenta coriovitelínica importante no início; restos dentro do cordão.',
      plac:'Cinturão de vilosidades em labirinto no meio do saco. Nas bordas, hematomas marginais verdes (uteroverdina).',
      clin:'Secreção verde antes do 1º filhote sem nascimento em 2 a 4 h: distocia. Lóquio por semanas; sangramento acima de 6 semanas: subinvolução dos sítios placentários.'},
    gata:{n:'Gata',gest:'~63 a 65 dias',sac:'Barril; vários conceptos',forma:'Zonária',cam:'Endoteliocorial, decídua',
      amnio:'Livre, como na cadela: o filhote pode nascer dentro do âmnio.',
      alant:'Envolve todo o âmnio.',
      vit:'Persistente; placenta coriovitelínica no início.',
      plac:'Cinturão zonário; hematomas marginais pequenos e pardo-acastanhados.',
      clin:'Colostro nas primeiras horas. Gata tipo B com filhotes tipo A: isoeritrólise neonatal após a mamada.'}
  };
  const op=k=>hi==='tudo'||hi===k?1:.22;
  const shape={
    porca:'M15 175 C60 172 90 130 160 130 L440 130 C510 130 540 172 585 175 C540 178 510 220 440 220 L160 220 C90 220 60 178 15 175Z',
    vaca:'M20 175 C60 168 90 105 200 102 L400 102 C510 105 540 168 580 175 C540 182 510 245 400 248 L200 248 C90 245 60 182 20 175Z',
    egua:'M100 175 A200 120 0 0 1 500 175 A200 120 0 0 1 100 175Z',
    cadela:'M180 75 L420 75 Q480 75 480 135 L480 215 Q480 275 420 275 L180 275 Q120 275 120 215 L120 135 Q120 75 180 75Z'};
  shape.ovelha=shape.vaca;shape.gata=shape.cadela;
  function fetus(g,cx,cy,s){E('ellipse',{cx:cx+6*s,cy,rx:34*s,ry:16*s,fill:'var(--bone-2)',stroke:'var(--bone-ink)','stroke-width':2},g);E('circle',{cx:cx-30*s,cy:cy-6*s,r:14*s,fill:'var(--bone-2)',stroke:'var(--bone-ink)','stroke-width':2},g)}
  function draw(){
    clear(svg);const k=sp,P=shape[k];
    const gp=E('g',{opacity:op('plac')},svg),ga=E('g',{opacity:op('alant')},svg),gv=E('g',{opacity:op('vit')},svg),gm=E('g',{opacity:op('amnio')},svg),gn=E('g',{opacity:op('plac')},svg);
    const ch=E('path',{d:P,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':hi==='alant'?6:4},ga);
    let Lb=[];
    /* placenta */
    let len=0;try{len=ch.getTotalLength()}catch(e){}
    const pt=t=>{try{return ch.getPointAtLength(t*len)}catch(e){return {x:0,y:0}}};
    if(k==='porca'){for(let x=110;x<=490;x+=14){E('line',{x1:x,y1:124,x2:x,y2:131,stroke:'var(--sky)','stroke-width':3},gp);E('line',{x1:x,y1:219,x2:x,y2:226,stroke:'var(--sky)','stroke-width':3},gp)}
      [['M15 175 C40 174 60 165 85 150','l'],['M585 175 C560 174 540 165 515 150','r']].forEach(([d])=>E('path',{d,fill:'none',stroke:'var(--muted)','stroke-width':6,'stroke-dasharray':'4 4'},gn));
      Lb.push(['Apêndice necrótico',20,300,'start',[50,180]])}
    if(k==='egua'&&len){for(let i=0;i<90;i++){const t=i/90;const p=pt(t);if(p.x<150&&Math.abs(p.y-175)<70)continue;E('circle',{cx:p.x,cy:p.y,r:4,fill:'var(--sky)'},gp)}
      E('path',{d:'M100 160 L100 190 M88 168 L112 182 M88 182 L112 168',stroke:'var(--ok)','stroke-width':3,fill:'none'},gp);
      E('ellipse',{cx:400,cy:250,rx:16,ry:8,fill:'var(--bone)',stroke:'var(--bone-ink)','stroke-width':1.5},ga);
      Lb.push(['Estrela cervical',12,40,'start',[96,160]],['Hipomanes',590,322,'end',[410,256]])}
    if((k==='vaca'||k==='ovelha')){const xs=[130,190,250,350,410,470];
      xs.forEach(x=>{[[x,252,1],[x,98,-1]].forEach(([cx,cy,dir])=>{if(dir<0&&x>=230&&x<=370)return;
        if(k==='vaca'){E('circle',{cx,cy:cy+dir*8,r:13,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':3},gp)}
        else{E('path',{d:`M${cx-14} ${cy} Q${cx} ${cy+dir*30} ${cx+14} ${cy}`,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':3},gp)}})});
      [['M20 175 C40 173 58 166 75 152'],['M580 175 C560 173 542 166 525 152']].forEach(([d])=>E('path',{d,fill:'none',stroke:'var(--muted)','stroke-width':6,'stroke-dasharray':'4 4'},gn));
      Lb.push([k==='vaca'?'Placentoma convexo':'Placentoma côncavo',590,322,'end',[470,272]])}
    if(k==='cadela'||k==='gata'){E('rect',{x:250,y:75,width:100,height:200,fill:'var(--sky-soft)',opacity:.55},gp);
      E('rect',{x:250,y:64,width:100,height:14,rx:3,fill:'var(--sky)'},gp);E('rect',{x:250,y:272,width:100,height:14,rx:3,fill:'var(--sky)'},gp);
      const hc=k==='cadela'?'var(--ok)':'var(--bone-ink)',w=k==='cadela'?14:7;
      [236,350].forEach(x=>{const xx=x===236?250-w:350;E('rect',{x:xx,y:64,width:w,height:14,fill:hc},gp);E('rect',{x:xx,y:272,width:w,height:14,fill:hc},gp)});
      Lb.push(['Placenta zonária',300,40,'middle',null],[k==='cadela'?'Hematoma marginal verde':'Hematoma marginal pardo',590,322,'end',[358,286]])}
    /* saco vitelino */
    if(k==='egua')E('ellipse',{cx:345,cy:90,rx:20,ry:10,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':hi==='vit'?4:2},gv);
    else if(k==='cadela'||k==='gata')E('ellipse',{cx:300,cy:248,rx:120,ry:12,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':hi==='vit'?4:2},gv);
    else E('circle',{cx:k==='porca'?340:350,cy:k==='porca'?206:230,r:5,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':2},gv);
    /* âmnio + feto + cordão */
    const A={porca:[300,160,70,30,.6],vaca:[300,155,110,52,1],ovelha:[300,155,110,52,1],egua:[300,175,90,52,1],cadela:[300,165,85,48,.95],gata:[300,165,85,48,.95]}[k];
    const cord={porca:'M300 172 L300 220',vaca:'M300 190 L300 248',ovelha:'M300 190 L300 248',egua:'M310 150 C330 120 290 90 300 55',cadela:'M300 180 L300 240',gata:'M300 180 L300 240'}[k];
    E('ellipse',{cx:A[0],cy:A[1],rx:A[2],ry:A[3],fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':hi==='amnio'?6:3},gm);
    E('path',{d:cord,fill:'none',stroke:'var(--bone-ink)','stroke-width':4},svg);
    fetus(gm,A[0],A[1]+4,A[4]);
    /* rótulos */
    const all=[['Âmnio',A[0]-A[2]-8,A[1]-A[3]+4,'end',null],['Alantoide',k==='cadela'||k==='gata'?440:(k==='egua'?440:520),k==='egua'?120:(k==='porca'?170:180),'middle',null]].concat(Lb);
    if(k==='porca'){all[0]=['Âmnio',300,108,'middle',null];all[1]=['Alantoide',440,180,'middle',null]}
    if(k==='vaca'||k==='ovelha'){all[0]=['Âmnio',300,80,'middle',null];all[1]=['Alantoide',450,182,'middle',null]}
    if(k==='cadela'||k==='gata'){all[0]=['Âmnio',175,128,'middle',null];all[1]=['Alantoide',430,128,'middle',null]}
    if(k==='egua'){all[0]=['Âmnio',190,135,'middle',null]}
    all.forEach(([t,x,y,a,ln])=>{if(ln)E('line',{x1:a==='end'?x-(t.length*5):x+30,y1:y-14,x2:ln[0],y2:ln[1],stroke:'var(--muted)','stroke-width':1.5},svg);T(svg,x,y,t,{a,fs:19})});
    const s=S[k];
    const foco={tudo:`<b>Particularidade clínica:</b> ${s.clin}`,amnio:`<b>Âmnio:</b> ${s.amnio}`,alant:`<b>Alantoide:</b> ${s.alant}`,vit:`<b>Saco vitelino:</b> ${s.vit}`,plac:`<b>Placenta:</b> ${s.plac}`}[hi];
    out.innerHTML=`<b>${s.n}</b> · gestação ${s.gest}<br><span style="color:var(--muted)">Saco:</span> ${s.sac}<br><span style="color:var(--muted)">Placenta:</span> ${s.forma} · ${s.cam} (cap. 18)<br>${foco}`;
  }
  choices('#anplSp',v=>{sp=v;draw()});
  choices('#anplHi',v=>{hi=v;draw()});
})();
