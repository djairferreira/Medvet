const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;

/* 1. Ossificação endocondral (deslizante + espécie) */
{const s=$('#loosSvg');if(s){
  const r=$('#loosR'),v=$('#loosV'),out=$('#loosOut');let grp='prec';
  const NOMES=['molde de cartilagem','colar ósseo','centro primário','centros secundários','fise ativa (jovem)','fise fechada (adulto)'];
  const TXT=[
    ['Molde de cartilagem hialina','O mesênquima condensado (Sox9) forma uma miniatura do osso em cartilagem, envolta pelo pericôndrio. Cresce por divisão dos condrócitos e por aposição.'],
    ['Colar ósseo e hipertrofia central','O pericôndrio do meio da diáfise vira periósteo e forma um colar de osso (intramembranoso). No centro, os condrócitos se hipertrofiam (colágeno X), calcificam a matriz e liberam VEGF.'],
    ['Centro primário e cavidade medular','O broto periosteal (vasos + osteoprogenitoras) invade a cartilagem calcificada. Osteoblastos depositam osso; osteoclastos abrem a cavidade medular, ocupada pela medula óssea. A ossificação avança para as duas extremidades.'],
    ['Centros secundários nas epífises','Vasos dos canais da cartilagem entram nas epífises e surgem os centros secundários. Entre eles e a diáfise sobra a placa de crescimento; na superfície, a cartilagem articular.'],
    ['Placa epifisária ativa','A fise (azul) empurra a epífise para longe: o osso cresce em comprimento. Na radiografia é uma linha escura (radiotransparente). É o ponto fraco do osso jovem: fraturas de Salter-Harris.'],
    ['Fise fechada','Na puberdade (estrógeno, andrógenos), a proliferação cessa e a fise vira osso: epífise e diáfise se soldam. Fim do crescimento em comprimento naquela extremidade. Na cartilagem articular a cartilagem permanece por toda a vida.']];
  const ESP={prec:'<b>Potro e bezerro (precociais)</b>: nascem já na etapa 4, com quase todos os centros secundários. Fises do potro: distal do 3º metacarpo fecha ~6–12 meses; distal do rádio ~2–3 anos. Bovino: distal do rádio ~3,5–4 anos.',
    alt:'<b>Filhote de cão e gato (altriciais)</b>: nascem na etapa 3, com diáfises ossificadas e epífises ainda de cartilagem; os centros secundários aparecem nas primeiras semanas. No cão a maioria das fises fecha entre 6 e 12 meses; no gato, até ~2 anos.'};
  const CART='var(--sky-soft)',CS='var(--sky)',OS='var(--eosin-soft)',OSS='var(--eosin)';
  const draw=()=>{const i=+r.value;clear(s);v.textContent=NOMES[i];
    const L=[300,330,370,420,470,500][i],cx=300,x0=cx-L/2,x1=cx+L/2,cy=150,h=48,eh=78;
    const born=grp==='prec'?3:2;
    /* corpo (diáfise) */
    E('rect',{x:x0+eh*0.6,y:cy-h/2,width:L-eh*1.2,height:h,fill:i>=1?OS:CART,stroke:i>=1?OSS:CS,'stroke-width':2},s);
    if(i===1)E('rect',{x:cx-50,y:cy-h/2+8,width:100,height:h-16,fill:CART},s);
    /* epífises */
    for(const ex of [x0+eh/2,x1-eh/2]){
      E('ellipse',{cx:ex,cy,rx:eh/2,ry:eh/2+6,fill:i>=5?OS:CART,stroke:i>=5?OSS:CS,'stroke-width':2},s);
      if(i>=3&&i<5)E('circle',{cx:ex,cy,r:i===3?16:28,fill:OS,stroke:OSS,'stroke-width':2},s);
      if(i>=3)E('path',{d:`M${ex+(ex<cx?-eh/2:eh/2)} ${cy-30} Q${ex+(ex<cx?-eh/2-8:eh/2+8)} ${cy} ${ex+(ex<cx?-eh/2:eh/2)} ${cy+30}`,fill:'none',stroke:CS,'stroke-width':7},s);}
    /* fises */
    if(i>=3&&i<=4)for(const fx of [x0+eh,x1-eh])E('rect',{x:fx-5,y:cy-h/2-6,width:10,height:h+12,fill:CART,stroke:CS,'stroke-width':2},s);
    if(i===5)for(const fx of [x0+eh,x1-eh])E('line',{x1:fx,y1:cy-h/2,x2:fx,y2:cy+h/2,stroke:OSS,'stroke-width':2,'stroke-dasharray':'4 4'},s);
    /* medula */
    if(i>=2){const mw=[0,0,90,L-260,L-260,L-250][i];E('rect',{x:cx-mw/2,y:cy-10,width:mw,height:20,rx:10,fill:'var(--bad-soft)',stroke:'var(--bad)'},s);
      E('path',{d:`M${cx} ${cy+h/2+40} L${cx} ${cy+10}`,stroke:'var(--bad)','stroke-width':4,fill:'none'},s);}
    /* rótulos */
    T(s,cx,40,'Diáfise',{fs:20});T(s,x0+eh/2,40,'Epífise',{fs:19});T(s,x1-eh/2,40,'Epífise',{fs:19});
    if(i>=2)T(s,cx+8,cy+h/2+66,'vasos / medula',{fs:18,fill:'var(--bad)'});
    if(i>=3&&i<=4)T(s,x1-eh,cy+h/2+40,'fise',{fs:18,fill:CS});
    E('rect',{x:20,y:286,width:22,height:22,fill:CART,stroke:CS},s);T(s,50,303,'cartilagem',{fs:18,a:'start'});
    E('rect',{x:200,y:286,width:22,height:22,fill:OS,stroke:OSS},s);T(s,230,303,'osso',{fs:18,a:'start'});
    if(i===born)T(s,580,303,'← nascimento',{fs:18,a:'end',fill:'var(--ok)',w:700});
    out.innerHTML=`<b>${TXT[i][0]}.</b> ${TXT[i][1]}<br><br>${ESP[grp]}${i===born?' <b style="color:var(--ok)">É assim que esse grupo nasce.</b>':''}`;};
  r.addEventListener('input',draw);choices('#loosBtns',k=>{grp=k;draw()});draw();}}

/* 2. Dígitos por espécie */
{const s=$('#lodgSvg');if(s){const out=$('#lodgOut');
  /* f=funcional, r=rudimentar (curto, sem apoio), m=só metacarpo (tala), a=ausente; fu=fundido */
  const D={base:{st:['f','f','f','f','f'],t:'<b>Padrão pentadáctilo</b>: a placa da mão tem cinco raios digitais (I a V) em todas as espécies. A regressão segue sempre a ordem <b>I → V → II → IV</b>.'},
    cao:{st:['r','f','f','f','f'],t:'<b>Cão</b>: dígitos II a V apoiam; o I (ergô, “dedo de lobo”) tem só duas falanges e não toca o chão. No membro pélvico o I costuma faltar ou é vestigial (ergô duplo é polidactilia pré-axial).'},
    porco:{st:['a','r','f','f','r'],t:'<b>Suíno</b>: I desapareceu. III e IV são os dígitos principais; II e V são completos mas menores (paradígitos), tocam o chão só em piso mole.'},
    boi:{st:['a','r','f','f','r'],fu:true,t:'<b>Bovino</b>: apoia nos dígitos III e IV, com os metacarpos III e IV <b>fundidos</b> no osso do canhão. II e V são paradígitos rudimentares (pequenos cascos acessórios, falanges reduzidas ou ausentes); o V pode deixar um pequeno metacarpo vestigial.'},
    cavalo:{st:['a','m','f','m','a'],t:'<b>Equino</b>: só o dígito <b>III</b> é funcional (casco único). II e IV ficam como metacarpos rudimentares, sem falanges: os <b>ossos de tala</b> (metacarpos acessórios). I e V desapareceram.'}};
  const xs=[110,205,300,395,490],RN=['I','II','III','IV','V'];
  const draw=k=>{clear(s);const d=D[k];
    E('rect',{x:70,y:24,width:460,height:46,rx:14,fill:'var(--bone-2)',stroke:'var(--line)','stroke-width':2},s);T(s,300,55,'Carpo',{fs:19});
    d.st.forEach((st,i)=>{const x=xs[i];const ghost=st==='a';
      const fill=ghost?'none':(st==='f'?'var(--eosin-soft)':'var(--amber-soft)'),stroke=ghost?'var(--muted)':(st==='f'?'var(--eosin)':'var(--amber)');
      const dash=ghost?'6 6':null,op=ghost?0.6:1;
      const mcL=i===0?70:(st==='f'?120:(st==='m'?95:80));
      const dew=d.fu&&st==='r';
      if(!(d.fu&&(i===2||i===3))&&!dew)E('rect',{x:x-16,y:80,width:32,height:mcL,rx:10,fill,stroke,'stroke-width':2,'stroke-dasharray':dash,opacity:op},s);
      if(st==='m'){T(s,x,320,'tala',{fs:18,fill:'var(--amber)'});}
      else{const n=i===0?2:3,len=st==='f'?[44,34,30]:[22,18,16];let y=dew?210:84+mcL;
        for(let j=0;j<n;j++){if(st==='r'&&j===2&&k!=='cao'&&k!=='porco')break;
          E('rect',{x:x-14,y,width:28,height:len[j],rx:8,fill,stroke,'stroke-width':2,'stroke-dasharray':dash,opacity:op},s);y+=len[j]+4;}}
      T(s,x,352,RN[i],{fs:22,w:700,fill:ghost?'var(--muted)':'var(--ink)'});});
    if(d.fu){E('rect',{x:xs[2]-16,y:80,width:xs[3]-xs[2]+32,height:120,rx:12,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2},s);
      E('line',{x1:(xs[2]+xs[3])/2,y1:90,x2:(xs[2]+xs[3])/2,y2:190,stroke:'var(--eosin)','stroke-dasharray':'5 5'},s);T(s,(xs[2]+xs[3])/2,150,'canhão',{fs:18});}
    out.innerHTML=d.t+'<br><span style="color:var(--muted)">Vermelho: funcional · laranja: rudimentar · tracejado: ausente.</span>';};
  choices('#lodgBtns',draw);}}

/* 3. Ressegmentação do esclerótomo (stepper) */
{const P=[
  ['Somitos e esclerótomos','Cada somito tem um esclerótomo (azul) ao lado do tubo neural e da notocorda. Os miótomos (vermelho) ficam alinhados aos somitos. As artérias intersegmentares passam entre eles.'],
  ['Metades cranial e caudal','Cada esclerótomo se divide: metade <b>cranial</b> frouxa (azul-claro) e <b>caudal</b> densa (azul-escuro). Os axônios dos nervos espinhais (amarelo) só crescem pela metade cranial.'],
  ['Ressegmentação','A metade caudal de um esclerótomo une-se à metade cranial do seguinte: forma-se o <b>corpo vertebral</b>, deslocado meio segmento. Os nervos ficam entre duas vértebras (forame intervertebral) e cada miótomo passa a ligar duas vértebras vizinhas.'],
  ['Disco intervertebral','A notocorda some dentro dos corpos e persiste entre eles como <b>núcleo pulposo</b>; o anel fibroso vem do esclerótomo. Falhas de metade do corpo vertebral dão <b>hemivértebras</b>.']];
  stepper('lors',P,(s,i)=>{const W=130,x0=40,yS=150,hS=80;
    T(s,24,30,'cranial ←',{fs:18,a:'start',fill:'var(--muted)'});T(s,580,30,'→ caudal',{fs:18,a:'end',fill:'var(--muted)'});
    E('rect',{x:20,y:50,width:560,height:30,rx:15,fill:'var(--hema-soft)',stroke:'var(--hema)'},s);T(s,300,72,'tubo neural',{fs:18});
    for(let k=0;k<4;k++){const x=x0+k*W;
      E('rect',{x:x+6,y:92,width:W-12,height:36,rx:8,fill:'var(--eosin-soft)',stroke:'var(--eosin)'},s);
      if(i<2)E('rect',{x:x+6,y:yS,width:W-12,height:hS,rx:8,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':2},s);
      if(i===1){E('rect',{x:x+W/2,y:yS,width:W/2-6,height:hS,fill:'var(--sky)',opacity:.55},s);}
      if(i>=1&&i<3||i===3)E('line',{x1:x+W*0.28,y1:80,x2:x+W*0.28,y2:i>=2?240:240,stroke:'var(--amber)','stroke-width':5},s);
      if(i===0)E('line',{x1:x,y1:yS,x2:x,y2:yS+hS+20,stroke:'var(--bad)','stroke-width':3},s);}
    if(i>=2){for(let k=0;k<3;k++){const x=x0+k*W+W/2+6;
        E('rect',{x,y:yS,width:W-12-(i===3?16:0),height:hS,rx:12,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':2},s);
        E('line',{x1:x+(W-12)/2,y1:yS,x2:x+(W-12)/2,y2:yS+hS,stroke:'var(--sky)','stroke-dasharray':'4 4'},s);
        T(s,x+(W-12)/2-(i===3?8:0),yS+hS+30,'V'+(k+1),{fs:19,w:700});}}
    if(i<3)E('line',{x1:20,y1:yS+hS/2,x2:580,y2:yS+hS/2,stroke:'var(--ok)','stroke-width':6},s);
    else for(let k=0;k<4;k++){const x=x0+k*W+W/2-8;E("ellipse",{cx:x,cy:yS+hS/2,rx:9,ry:16,fill:'var(--ok)'},s);}
    T(s,24,300,i<3?'verde: notocorda':'verde: núcleo pulposo',{fs:18,a:'start',fill:'var(--ok)'});
    T(s,580,300,'amarelo: nervo',{fs:18,a:'end',fill:'var(--amber)'});
    T(s,24,328,'vermelho: miótomo',{fs:18,a:'start',fill:'var(--eosin)'});
    if(i===0)T(s,580,328,'traço: artéria',{fs:18,a:'end',fill:'var(--bad)'});});}
