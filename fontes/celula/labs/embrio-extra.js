const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;

/* ---------- 1) Tipo de ovo -> tipo de clivagem (cap. 19) ---------- */
(function(){
  const s=$('#exOvoSvg');if(!s)return;const out=$('#exOvoOut');
  const Y='var(--amber-soft)',YS='var(--amber)',C='var(--hema-soft)',CS='var(--hema)',B='var(--sky-soft)';
  const cell=(x,y,r,f)=>E('circle',{cx:x,cy:y,r,fill:f||C,stroke:CS,'stroke-width':2},s);
  const nuc=(x,y)=>E('circle',{cx:x,cy:y,r:6,fill:'var(--hema)'},s);
  const ring=(cx,cy,R,n,r,f)=>{for(let i=0;i<n;i++){const a=i/n*2*Math.PI;cell(cx+R*Math.cos(a),cy+R*Math.sin(a),r,f)}};
  const D={
   our:{t:['Ovo isolécito','8 células iguais','Celoblástula'],
    txt:'<b>Ouriço-do-mar / anfioxo.</b> Ovo <b>oligolécito isolécito</b>: pouco vitelo, espalhado por igual. Clivagem <b>holoblástica igual</b> (radial), rápida e síncrona: 1ª e 2ª divisões meridionais, 3ª equatorial, 8 blastômeros do mesmo tamanho. Resultado: <b>celoblástula</b>, esfera oca regular.',
    d(){cell(100,120,70);for(let i=0;i<14;i++){const a=i*2.4,r=20+(i*13)%45;E('circle',{cx:100+r*Math.cos(a),cy:120+r*Math.sin(a),r:3,fill:YS},s)}nuc(100,120);
      [[275,95],[325,95],[275,145],[325,145]].forEach(p=>cell(p[0],p[1],25));
      ring(500,120,58,16,12);E('text',{x:500,y:127,'font-size':18,'text-anchor':'middle',fill:'var(--muted)',text:'blastocele'},s)}},
   anf:{t:['Ovo mesolécito','Holobl. desigual','Blástula desigual'],
    txt:'<b>Anfíbio.</b> Ovo <b>mesolécito telolécito</b>: vitelo moderado, concentrado no polo vegetal (embaixo). Clivagem <b>holoblástica desigual</b>: a 3ª divisão é latitudinal, acima do equador, gerando <b>micrômeros</b> no polo animal e <b>macrômeros</b> no polo vegetal. Blástula com blastocele deslocada para o polo animal.',
    d(){cell(100,120,70);E('path',{d:'M 30,128 A 70 70 0 0 0 170,128 Z',fill:Y,stroke:YS},s);nuc(100,85);
      cell(280,82,20);cell(320,82,20);cell(272,140,35,Y);cell(328,140,35,Y);
      for(let i=0;i<9;i++){const a=Math.PI+i/8*Math.PI;cell(500+58*Math.cos(a),110+50*Math.sin(a),11)}
      [[460,150],[500,160],[540,150],[480,118],[520,118]].forEach(p=>cell(p[0],p[1],20,Y));
      E('ellipse',{cx:500,cy:88,rx:32,ry:16,fill:B},s)}},
   ave:{t:['Ovo polilécito','Meroblást. discoidal','Discoblástula'],
    txt:'<b>Ave.</b> Ovo <b>polilécito telolécito</b>: a gema é quase só vitelo; núcleo e citoplasma ativo ficam no <b>disco germinativo</b>. Clivagem <b>meroblástica discoidal</b>: só o disco se divide, com sulcos que não fecham as células por baixo. Forma-se a <b>discoblástula</b> (blastoderma) sobre a <b>cavidade subgerminal</b>, com área pelúcida no centro e área opaca na borda.',
    d(){cell(100,120,70,Y);E('ellipse',{cx:100,cy:54,rx:24,ry:7,fill:'var(--hema)'},s);
      cell(300,120,70,Y);E('ellipse',{cx:300,cy:56,rx:40,ry:11,fill:C,stroke:CS},s);[285,300,315].forEach(x=>E('line',{x1:x,y1:46,x2:x,y2:66,stroke:CS,'stroke-width':2},s));
      E('path',{d:'M 430,200 Q 500,120 570,200 Z',fill:Y,stroke:YS},s);E('ellipse',{cx:500,cy:150,rx:46,ry:9,fill:B},s);
      for(let i=0;i<8;i++)cell(448+i*15,134,8)}},
   ins:{t:['Ovo centrolécito','Núcleos sem células','Periblástula'],
    txt:'<b>Inseto.</b> Ovo <b>centrolécito</b>: vitelo no centro, citoplasma numa camada periférica. Clivagem <b>meroblástica superficial</b>: os núcleos se dividem dentro do vitelo <b>sem citocinese</b> (sincício), migram para a periferia e só então ganham membranas, formando a <b>periblástula</b> (blastoderma celular) em volta do vitelo.',
    d(){const eg=(x)=>{E('ellipse',{cx:x,cy:120,rx:80,ry:50,fill:C,stroke:CS,'stroke-width':2},s);E('ellipse',{cx:x,cy:120,rx:66,ry:38,fill:Y,stroke:YS},s)};
      eg(100);nuc(100,120);eg(300);[[270,110],[300,128],[330,110],[290,100],[315,135],[280,135]].forEach(p=>nuc(p[0],p[1]));
      E('ellipse',{cx:500,cy:120,rx:80,ry:50,fill:Y,stroke:YS},s);for(let i=0;i<22;i++){const a=i/22*2*Math.PI;cell(500+72*Math.cos(a),120+43*Math.sin(a),8)}}},
   mam:{t:['Ovo quase alécito','Rotacional','Blastocisto'],
    txt:'<b>Mamífero.</b> Ovo <b>oligolécito</b> (quase sem vitelo, graças à placenta), dentro da zona pelúcida. Clivagem <b>holoblástica igual</b>, mas <b>rotacional</b> (na 2ª divisão um blastômero se divide no sentido meridional e o outro no equatorial), lenta e <b>assíncrona</b>. Resultado: <b>blastocisto</b>, com trofoblasto, massa celular interna e blastocele.',
    d(){const zp=x=>E('circle',{cx:x,cy:120,r:72,fill:'none',stroke:'var(--muted)','stroke-width':6},s);
      zp(100);cell(100,120,62);nuc(100,120);
      zp(300);cell(280,95,28);cell(280,150,28);cell(325,122,26);E('line',{x1:325,y1:96,x2:325,y2:148,stroke:CS,'stroke-width':2},s);
      zp(500);ring(500,120,58,18,10);[[480,82],[500,78],[520,82],[490,98],[510,98]].forEach(p=>cell(p[0],p[1],11,'var(--eosin-soft)'))}}
  };
  function draw(k){clear(s);const d=D[k];d.d();
    [[176,224],[376,424]].forEach(([a,b])=>{E('line',{x1:a,y1:120,x2:b,y2:120,stroke:'var(--muted)','stroke-width':3},s);E('path',{d:`M ${b-10},112 L ${b},120 L ${b-10},128`,fill:'none',stroke:'var(--muted)','stroke-width':3},s)});
    d.t.forEach((t,i)=>T(s,100+i*200,240,t,{fs:18}));out.innerHTML=d.txt}
  choices('#exOvoBtns',draw);
})();

/* ---------- 2) Disco da galinha hora a hora (cap. 20) ---------- */
(function(){
  const s=$('#exGaSvg');if(!s)return;const out=$('#exGaOut'),r=$('#exGaR'),hl=$('#exGaH'),pb=$('#exGaPlay');
  const cx=230,top=45,bot=295,Lp=bot-top,yf=f=>bot-f*Lp;
  const node=h=>h<6?0:h<18?0.66*(h-6)/12:h<=22?0.66:h<=30?0.66-0.33*(h-22)/8:Math.max(0.06,0.33-0.27*(h-30)/20);
  const som=h=>h<23?0:Math.min(22,Math.round((h-23)/1.5)+1);
  function hh(h){if(h<6)return['Blastoderma bilaminar','Epiblasto e hipoblasto sobre a cavidade subgerminal; ainda sem eixo visível.'];
    if(h<12)return['Espessamento caudal','Células do epiblasto convergem para a borda caudal da área pelúcida: primeiro sinal do eixo.'];
    if(h<18)return['Linha primitiva em alongamento','A linha cresce em sentido cranial; na ponta surge o <b>nó de Hensen</b>. Células entram pelo sulco e formam endoderma e mesoderma.'];
    if(h<23)return['Linha completa e processo cefálico','A linha ocupa ~2/3 da área pelúcida. À frente do nó cresce o <b>processo cefálico</b> (notocorda); o mesoderma se expande.'];
    if(h<30)return['Início da regressão e dos somitos','O nó recua em sentido caudal deixando a notocorda atrás de si; surge a prega cefálica e o 1º par de <b>somitos</b> (~um par a cada 90 min).'];
    if(h<50)return['Regressão','Em ~30 h a linha já tem a metade do tamanho. A gastrulação termina de cranial para caudal enquanto os somitos se somam.'];
    return['Regressão completa','Por volta de 50 h a linha desapareceu; resta o broto da cauda. Fim da gastrulação.']}
  function draw(h){clear(s);
    E('ellipse',{cx,cy:170,rx:200,ry:160,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':2},s);
    E('ellipse',{cx,cy:170,rx:95,ry:128,fill:'var(--paper)',stroke:'var(--muted)','stroke-width':2},s);
    const n=node(h),yn=yf(n);
    if(h>=20){const ext=Math.min(1,(h-20)/6);E('path',{d:`M ${cx-45},${yf(0.92)} Q ${cx},${yf(0.92)-18*ext-6} ${cx+45},${yf(0.92)} L ${cx+30},${yf(0.7)} L ${cx-30},${yf(0.7)} Z`,fill:'var(--sky-soft)',stroke:'var(--sky)'},s)}
    if(h>=3){const f0=h<6?0.06*(h-3)/3:0;E('ellipse',{cx,cy:yf(0.05),rx:22,ry:12,fill:'var(--eosin-soft)',opacity:Math.min(1,h/6)},s)}
    if(h>=18){const head=Math.min(0.88,0.66+0.22*(h-18)/4);E('line',{x1:cx,y1:yf(head),x2:cx,y2:yn,stroke:'var(--ok)','stroke-width':5},s)}
    if(n>0.02){E('line',{x1:cx,y1:yf(0.02),x2:cx,y2:yn,stroke:'var(--eosin)','stroke-width':9,'stroke-linecap':'round'},s);E('circle',{cx,cy:yn,r:9,fill:'var(--hema)'},s)}
    const ns=som(h);for(let i=0;i<ns;i++){const y=yf(0.62)+i*7.5;if(y>yn-8)break;[-1,1].forEach(sg=>E('rect',{x:cx+sg*16-(sg<0?11:0),y,width:11,height:6,rx:2,fill:'var(--hema-soft)',stroke:'var(--hema)'},s))}
    const lab=[['Área opaca',40,[cx+190,110]],['Área pelúcida',80,[cx+92,140]]];
    if(n>0.02)lab.push(['Nó de Hensen',150,[cx+10,yn]],['Linha primitiva',190,[cx+6,(yn+yf(0.02))/2]]);
    if(h>=18)lab.push(['Notocorda',230,[cx+4,yf(0.8)]]);if(ns)lab.push([ns+' par'+(ns>1?'es':'')+' de somitos',270,[cx+28,yf(0.62)+5]]);
    lab.forEach(([t,y,p])=>{E('line',{x1:445,y1:y-6,x2:p[0],y2:p[1],stroke:'var(--muted)','stroke-width':1.5},s);T(s,450,y,t,{fs:18,a:'start'})});
    T(s,cx,22,'cranial',{fs:18,fill:'var(--muted)'});T(s,cx,334,'caudal',{fs:18,fill:'var(--muted)'});
    const [a,b]=hh(h);hl.textContent=h;out.innerHTML=`<b>${h} h · ${a}.</b> ${b}`}
  r.addEventListener('input',()=>draw(+r.value));
  let tm=null;pb.addEventListener('click',()=>{if(tm){clearInterval(tm);tm=null;pb.textContent='▶ Animar';return}
    if(reduce){r.value=+r.value>=52?0:Math.min(52,+r.value+6);draw(+r.value);return}
    if(+r.value>=52)r.value=0;pb.textContent='❚❚ Pausar';tm=setInterval(()=>{const v=+r.value+1;r.value=v;draw(v);if(v>=52){clearInterval(tm);tm=null;pb.textContent='▶ Animar'}},250)});
  draw(+r.value);
})();
