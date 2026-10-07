(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS='http://www.w3.org/2000/svg';
const press=(group,btn)=>$$('button',group).forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));
/* cria elemento SVG; fill/stroke vão para style para aceitar var(--x) */
function E(tag,a,p){const e=document.createElementNS(NS,tag);let st='';for(const k in a||{}){const v=a[k];if(v==null)continue;
  if(k==='fill'||k==='stroke'||k==='opacity'||k==='stroke-width'||k==='stroke-dasharray')st+=k+':'+v+';';else if(k==='text')e.textContent=v;else if(k!=='style')e.setAttribute(k,v);else if(!st)e.setAttribute(k,v)}
  if(st)e.setAttribute('style',st+(a&&a.style?a.style:''));if(p)p.appendChild(e);return e}
const T=(p,x,y,s,o={})=>E('text',Object.assign({x,y,'font-size':o.fs||19,'text-anchor':o.a||'middle','font-weight':o.w||600,fill:o.fill||'var(--ink)',text:s},o.extra||{}),p);
const anim=(el,attr,vals,dur,begin,extra={})=>{if(reduce)return;E('animate',Object.assign({attributeName:attr,values:vals,dur:dur+'s',begin:(begin||0)+'s',repeatCount:'indefinite'},extra),el)};
const clear=s=>{while(s.firstChild)s.removeChild(s.firstChild)};
const C={eco:'var(--sky)',meso:'var(--eosin)',endo:'var(--amber)',cris:'var(--hema-2)',mat:'var(--eosin)',pat:'var(--sky)',ok:'var(--ok)',ink:'var(--ink)',mut:'var(--muted)',line:'var(--line)',hema:'var(--hema)',bone:'var(--bone-2)',panel:'var(--panel)',paper:'var(--paper)'};

/* stepper genérico: prev/next + desenho por etapa */
function stepper(pre,steps,draw){const svg=$('#'+pre+'Svg');if(!svg)return;const out=$('#'+pre+'Out'),prev=$('#'+pre+'Prev'),next=$('#'+pre+'Next');let i=0;
  const go=n=>{i=Math.max(0,Math.min(steps.length-1,n));clear(svg);draw(svg,i);const s=steps[i];
    out.innerHTML=`<span class="mono" style="color:var(--muted)">${i+1} de ${steps.length}</span> · <b>${s[0]}</b><br>${s[1]}`;
    prev.disabled=i===0;next.textContent=i===steps.length-1?'Recomeçar ↺':'Próxima etapa →'};
  prev.addEventListener('click',()=>go(i-1));next.addEventListener('click',()=>go(i===steps.length-1?0:i+1));go(0)}

/* ===================== 1. TRANSPORTE ===================== */
(()=>{const svg=$('#trSvg');if(!svg)return;
  $$('text',svg).forEach(t=>t.setAttribute('font-size','18'));
  const bl=$('#trBilayer'),pr=$('#trProt'),mo=$('#trMol'),atp=$('#trAtp'),out=$('#trOut');
  const Y1=105,Y2=155;
  for(let x=10;x<600;x+=18){
    E('line',{x1:x,y1:Y1+8,x2:x,y2:128,stroke:C.bone,'stroke-width':2},bl);E('line',{x1:x,y1:132,x2:x,y2:Y2-8,stroke:C.bone,'stroke-width':2},bl);
    E('circle',{cx:x,cy:Y1+4,r:6,fill:'var(--hema-2)'},bl);E('circle',{cx:x,cy:Y2-4,r:6,fill:'var(--hema-2)'},bl)}
  const D={
    simples:['Difusão simples','Moléculas pequenas e apolares (O₂, CO₂, ureia em parte, hormônios esteroides, anestésicos inalatórios) passam <b>direto pela bicamada</b>, do lado mais concentrado para o menos concentrado. Não gasta ATP, não usa proteína e <b>não satura</b>: quanto maior o gradiente, maior o fluxo.'],
    canal:['Difusão facilitada por canal','Íons atravessam um <b>poro hidrofílico</b> formado por uma proteína, a favor do gradiente eletroquímico. É muito rápida e o canal pode abrir por voltagem, por ligante ou por estímulo mecânico. Ex.: canais de Na⁺ do potencial de ação, alvo dos anestésicos locais (lidocaína).'],
    carreador:['Difusão facilitada por carreador','A molécula se liga à proteína, que <b>muda de forma</b> e a libera do outro lado. A favor do gradiente, sem ATP, mas <b>satura</b> quando todos os carreadores estão ocupados. Ex.: GLUT, transportadores de glicose; o GLUT4 do músculo e do tecido adiposo depende da insulina.'],
    bomba:['Transporte ativo primário: bomba Na⁺/K⁺','A bomba usa a energia de <b>1 ATP</b> para levar <b>3 Na⁺ para fora</b> e <b>2 K⁺ para dentro</b>, contra os gradientes. Consome boa parte da energia da célula em repouso e mantém o potencial de membrana e o volume celular. Os digitálicos (digoxina) a inibem.'],
    secundario:['Transporte ativo secundário: Na⁺ e glicose','O <b>SGLT</b> usa o gradiente de Na⁺ (criado pela bomba) para puxar a glicose junto, mesmo contra o gradiente dela: <b>cotransporte (simporte)</b>. É por isso que soluções de reidratação oral para bezerros com diarreia têm <b>glicose e sódio juntos</b>: a glicose leva sódio, e a água acompanha.'],
    osmose:['Osmose','A <b>água</b> passa do lado com <b>menos soluto</b> para o lado com <b>mais soluto</b>, pela bicamada e sobretudo pelas <b>aquaporinas</b>. Aqui o citosol está hipertônico em relação ao meio: a célula ganha água. Em solução hipotônica, a hemácia incha e pode sofrer hemólise; em hipertônica, murcha (crenação).']};
  const mol=(x,y0,y1,col,r,dur,beg,lab)=>{const g=E('g',{},mo);const c=E('circle',{cx:x,cy:y0,r,fill:col,stroke:'var(--panel)','stroke-width':1.5},g);
    if(lab)T(g,x,y0+5,lab,{fs:13,fill:'#fff',w:700});
    if(!reduce){E('animateTransform',{attributeName:'transform',type:'translate',values:`0 0;0 ${y1-y0}`,dur:dur+'s',begin:beg+'s',repeatCount:'indefinite'},g);
      anim(g,'opacity','0;1;1;1;0',dur,beg)} else c.setAttribute('cy',(y0+y1)/2)};
  const dot=(x,y,col,r=7)=>E('circle',{cx:x,cy:y,r,fill:col,opacity:.85},mo);
  const prot=(type)=>{if(type==='canal'){E('rect',{x:270,y:92,width:22,height:76,rx:8,fill:'var(--sky)'},pr);E('rect',{x:308,y:92,width:22,height:76,rx:8,fill:'var(--sky)'},pr)}
    else if(type==='osmose'){E('rect',{x:274,y:92,width:18,height:76,rx:8,fill:'var(--sky)'},pr);E('rect',{x:308,y:92,width:18,height:76,rx:8,fill:'var(--sky)'},pr)}
    else if(type!=='simples'){const g=E('rect',{x:262,y:88,width:76,height:84,rx:26,fill:type==='bomba'?'var(--eosin)':'var(--sky)',opacity:.9},pr);
      if(!reduce)E('animate',{attributeName:'rx',values:'26;14;26',dur:'1.6s',repeatCount:'indefinite'},g)}};
  const draw=t=>{clear(pr);clear(mo);atp.setAttribute('opacity',t==='bomba'?1:0);prot(t);
    if(t==='simples'){for(let i=0;i<14;i++)dot(40+i*40,40+(i%3)*18,'var(--sky)',6);for(let i=0;i<4;i++)dot(70+i*140,200,'var(--sky)',6);
      [120,250,380,500].forEach((x,i)=>mol(x,50,215,'var(--sky)',7,2.6,i*.6))}
    if(t==='canal'){for(let i=0;i<12;i++)dot(40+i*48,40+(i%3)*18,'var(--amber)',8);[0,1,2].forEach(i=>mol(300,40,220,'var(--amber)',9,2.2,i*.73,'Na⁺'))}
    if(t==='carreador'){for(let i=0;i<10;i++)dot(50+i*55,42+(i%3)*18,'var(--ok)',8);[0,1].forEach(i=>mol(300,40,220,'var(--ok)',10,2.8,i*1.4,'G'))}
    if(t==='bomba'){for(let i=0;i<9;i++)dot(40+i*60,44+(i%2)*20,'var(--amber)',7);for(let i=0;i<9;i++)dot(60+i*60,200+(i%2)*20,'var(--sky)',7);
      [0,1,2].forEach(i=>mol(285+i*15,215,40,'var(--amber)',9,2.4,i*.25,'Na⁺'));[0,1].forEach(i=>mol(292+i*16,40,220,'var(--sky)',9,2.4,1.2+i*.25,'K⁺'))}
    if(t==='secundario'){for(let i=0;i<10;i++)dot(40+i*58,44+(i%2)*20,'var(--amber)',7);for(let i=0;i<8;i++)dot(60+i*70,205+(i%2)*16,'var(--ok)',8);
      [0,1].forEach(i=>{mol(285,40,220,'var(--amber)',9,2.6,i*1.3,'Na⁺');mol(316,40,220,'var(--ok)',10,2.6,i*1.3,'G')})}
    if(t==='osmose'){for(let i=0;i<5;i++)dot(80+i*110,45,'var(--eosin)',11);for(let i=0;i<12;i++)dot(40+i*48,195+(i%3)*16,'var(--eosin)',11);
      [0,1,2,3].forEach(i=>mol(300,40,220,'var(--sky)',6,2,i*.5));[0,1].forEach(i=>mol(140+i*300,40,220,'var(--sky)',6,3.4,i*1.7))}
    out.innerHTML=`<b>${D[t][0]}.</b> ${D[t][1]}`};
  const g=$('#trBtns');g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;press(g,b);draw(b.dataset.t)});draw('simples')})();

/* ===================== 2. FORQUILHA DE REPLICAÇÃO ===================== */
stepper('rep',[
 ['DNA parental','Duas fitas antiparalelas pareadas por pontes de hidrogênio. Cada uma servirá de molde para uma fita nova (replicação <b>semiconservativa</b>).'],
 ['Helicase e proteínas SSB','A <b>helicase</b> usa ATP para romper as pontes de hidrogênio e abrir a forquilha. As <b>SSB</b> (proteínas de ligação à fita simples) cobrem as fitas separadas e impedem que voltem a parear.'],
 ['Topoisomerase','À frente da forquilha o DNA fica supertorcido. A <b>topoisomerase</b> corta, deixa girar e religa, aliviando a tensão. Nas bactérias, a girase é alvo das <b>quinolonas</b> (enrofloxacino).'],
 ['Primase','A DNA polimerase não começa do zero: precisa de uma ponta 3′-OH. A <b>primase</b> sintetiza pequenos <b>iniciadores de RNA</b> (vermelho). Na fita líder basta um; na atrasada, um para cada fragmento.'],
 ['Fita líder','A <b>DNA polimerase</b> só adiciona nucleotídeos à ponta 3′ (síntese 5′→3′). Na fita líder, essa direção acompanha a abertura da forquilha: síntese <b>contínua</b>.'],
 ['Fita atrasada e fragmentos de Okazaki','No outro molde, a síntese 5′→3′ vai no sentido oposto ao da forquilha. A polimerase trabalha em trechos curtos, os <b>fragmentos de Okazaki</b>, recomeçando a cada novo iniciador.'],
 ['Remoção dos iniciadores e DNA ligase','Os iniciadores de RNA são removidos e os buracos preenchidos com DNA. A <b>DNA ligase</b> sela as ligações fosfodiéster entre os fragmentos. A polimerase ainda revisa o que fez (exonuclease 3′→5′).']
],(s,i)=>{
  const g=E('g',{},s),ink='var(--ink)',nw='var(--ok)',red='var(--eosin)';
  if(i===0){E('line',{x1:20,y1:110,x2:585,y2:110,stroke:ink,'stroke-width':5},g);E('line',{x1:20,y1:136,x2:585,y2:136,stroke:'var(--sky)','stroke-width':5},g);
    for(let x=30;x<585;x+=22)E('line',{x1:x,y1:113,x2:x,y2:133,stroke:C.bone,'stroke-width':2},g);
    T(g,20,95,'5′',{a:'start',fs:24});T(g,585,95,'3′',{a:'end',fs:24});T(g,20,168,'3′',{a:'start',fs:24});T(g,585,168,'5′',{a:'end',fs:24});return}
  E('polyline',{points:'585,110 380,110 330,60 20,60',fill:'none',stroke:ink,'stroke-width':5},g);
  E('polyline',{points:'585,136 380,136 330,186 20,186',fill:'none',stroke:'var(--sky)','stroke-width':5},g);
  for(let x=390;x<585;x+=22)E('line',{x1:x,y1:113,x2:x,y2:133,stroke:C.bone,'stroke-width':2},g);
  T(g,20,45,'5′',{a:'start',fs:24});T(g,20,222,'3′',{a:'start',fs:24});T(g,585,95,'3′',{a:'end',fs:24});T(g,585,166,'5′',{a:'end',fs:24});
  const hel=E('g',{},g);E('circle',{cx:372,cy:123,r:20,fill:'var(--amber)'},hel);T(hel,372,129,'H',{fill:'#fff',w:800});
  if(!reduce)E('animateTransform',{attributeName:'transform',type:'rotate',values:'0 372 123;360 372 123',dur:'3s',repeatCount:'indefinite'},hel);
  if(i===1)T(g,372,90,'Helicase',{fs:22});
  if(i<=2)for(let x=60;x<320;x+=40){E('circle',{cx:x,cy:66,r:5,fill:'var(--hema-2)'},g);E('circle',{cx:x,cy:180,r:5,fill:'var(--hema-2)'},g)}
  if(i===1)T(g,190,40,'SSB',{fs:22});
  if(i>=2){E('ellipse',{cx:500,cy:123,rx:16,ry:26,fill:'none',stroke:'var(--hema)','stroke-width':4},g);if(i===2)T(g,500,80,'Topoisomerase',{fs:22})}
  const lead=i>=4,lag=i>=5,lig=i>=6;
  if(i>=3){if(!lig){E('line',{x1:30,y1:76,x2:52,y2:76,stroke:red,'stroke-width':6},g);[120,220,318].forEach(x=>E('line',{x1:x-20,y1:170,x2:x,y2:170,stroke:red,'stroke-width':6},g))}
    if(i===3)T(g,180,130,'Iniciadores de RNA',{fs:22,fill:'var(--eosin)'})}
  if(lead){E('line',{x1:lig?30:52,y1:76,x2:300,y2:76,stroke:nw,'stroke-width':6},g);E('path',{d:'M300,68 L316,76 L300,84 Z',fill:nw},g);
    const p=E('g',{},g);E('circle',{cx:300,cy:76,r:14,fill:'var(--ok)',opacity:.35},p);if(i===4)T(g,200,108,'Fita líder (contínua)',{fs:22,fill:'var(--ok)'})}
  if(lag){[[30,100],[122,200],[222,298]].forEach(([a,b])=>{E('line',{x1:a,y1:170,x2:b,y2:170,stroke:nw,'stroke-width':6},g);E('path',{d:`M${a},162 L${a-14},170 L${a},178 Z`,fill:nw},g)});
    if(i===5)T(g,170,222,'Fragmentos de Okazaki',{fs:22,fill:'var(--ok)'})}
  if(lig){E('line',{x1:30,y1:170,x2:318,y2:170,stroke:nw,'stroke-width':6},g);
    [110,210].forEach(x=>E('circle',{cx:x,cy:170,r:8,fill:'var(--sky)'},g));T(g,170,222,'DNA ligase sela os fragmentos',{fs:22,fill:'var(--sky)'})}
});

/* ===================== 3. CÓDIGO GENÉTICO ===================== */
const CODE={};(()=>{const b='UCAG',aa='FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';let n=0;for(const x of b)for(const y of b)for(const z of b)CODE[x+y+z]=aa[n++]})();
const AA={A:['Ala','Alanina'],R:['Arg','Arginina'],N:['Asn','Asparagina'],D:['Asp','Aspartato'],C:['Cys','Cisteína'],Q:['Gln','Glutamina'],E:['Glu','Glutamato'],G:['Gly','Glicina'],H:['His','Histidina'],I:['Ile','Isoleucina'],L:['Leu','Leucina'],K:['Lys','Lisina'],M:['Met','Metionina'],F:['Phe','Fenilalanina'],P:['Pro','Prolina'],S:['Ser','Serina'],T:['Thr','Treonina'],W:['Trp','Triptofano'],Y:['Tyr','Tirosina'],V:['Val','Valina'],'*':['Fim','Parada']};
function translate(seq){const st=seq.indexOf('AUG');if(st<0)return{st:-1,cods:[],prot:[],stop:false};const cods=[],prot=[];let stop=false;
  for(let i=st;i+3<=seq.length;i+=3){const c=seq.substr(i,3),a=CODE[c];cods.push(c);prot.push(a);if(a==='*'){stop=true;break}}return{st,cods,prot,stop}}

(()=>{const inp=$('#codIn');if(!inp)return;const track=$('#codTrack'),out=$('#codOut'),play=$('#codPlay');let timer=null;
  const render=()=>{const raw=inp.value.toUpperCase().replace(/T/g,'U');const seq=raw.replace(/[^AUGC]/g,'');if(seq!==inp.value)inp.value=seq;
    const r=translate(seq);track.innerHTML='';
    if(r.st<0){track.innerHTML=`<span class="cod nt">${seq||'—'}</span>`;out.innerHTML='<b>Nenhum códon de início (AUG) encontrado.</b> Sem AUG, o ribossomo não sabe onde começar: nenhuma proteína é produzida.';return}
    if(r.st>0)track.insertAdjacentHTML('beforeend',`<span class="cod nt" title="Região 5′ não traduzida"><b>${seq.slice(0,r.st)}</b><i>5′ UTR</i></span>`);
    r.cods.forEach((c,k)=>{const a=r.prot[k];track.insertAdjacentHTML('beforeend',`<span class="cod${a==='*'?' stop':k===0?' start':''}"><b>${c}</b><i>${AA[a][0]}</i></span>`)});
    const rest=seq.slice(r.st+r.cods.length*3);if(rest)track.insertAdjacentHTML('beforeend',`<span class="cod nt"><b>${rest}</b><i>${r.stop?'3′ UTR':'sobra'}</i></span>`);
    const p=r.prot.filter(a=>a!=='*');
    out.innerHTML=`<b>Proteína (${p.length} aminoácido${p.length===1?'':'s'}):</b> <span class="mono">${p.map(a=>AA[a][0]).join('–')}</span><br>`+
      (r.stop?`Leitura do AUG (posição ${r.st+1}) até o códon de parada <b>${r.cods[r.cods.length-1]}</b>, que não codifica aminoácido: fatores de liberação encerram a tradução.`:'<b>Atenção:</b> não apareceu códon de parada na fase de leitura. Na célula, um mRNA sem parada é reconhecido e degradado.')+
      `<br><span style="color:var(--muted)">Por extenso: ${p.map(a=>AA[a][1]).join(', ')}.</span>`};
  const stopPlay=()=>{clearInterval(timer);timer=null;play.setAttribute('aria-pressed','false');play.textContent='▶ Animar ribossomo';$$('.cod',track).forEach(c=>c.classList.remove('on','dim'))};
  play.addEventListener('click',()=>{if(timer){stopPlay();return}render();const cs=$$('.cod:not(.nt)',track);if(!cs.length)return;let k=0;
    play.setAttribute('aria-pressed','true');play.textContent='■ Parar';cs.forEach(c=>c.classList.add('dim'));
    const tick=()=>{cs.forEach((c,j)=>{c.classList.toggle('on',j===k);c.classList.toggle('dim',j>k)});k++;if(k>cs.length){clearInterval(timer);timer=null;setTimeout(stopPlay,900)}};
    tick();timer=setInterval(tick,reduce?300:750)});
  inp.addEventListener('input',()=>{if(timer)stopPlay();render()});
  $$('[data-ex]').forEach(b=>b.addEventListener('click',()=>{stopPlay();inp.value=b.dataset.ex;render()}));
  $('#codRand').addEventListener('click',()=>{stopPlay();const n='AUGC';let s='GC'+'AUG';for(let i=0;i<15;i++)s+=n[Math.floor(Math.random()*4)];
    let c;do{c=['UAA','UAG','UGA'][Math.floor(Math.random()*3)]}while(false);s+=c+'GC';inp.value=s;render()});
  render()})();

/* ===================== 4. MUTAÇÃO ===================== */
(()=>{const box=$('#mutSeq');if(!box)return;const ORIG='AUGGCUAAAUUCGGAUGGCAUUAA';let seq=ORIG;const prot=$('#mutProt'),out=$('#mutOut');
  const NXT={A:'U',U:'G',G:'C',C:'A'};
  const render=(msg)=>{box.innerHTML='';for(let i=0;i<seq.length;i++){if(i&&i%3===0)box.insertAdjacentHTML('beforeend','<span class="gap" aria-hidden="true"></span>');
      const ch=seq[i],diff=seq.length===ORIG.length&&ch!==ORIG[i];box.insertAdjacentHTML('beforeend',`<button type="button" class="nt${diff?' diff':''}" data-i="${i}" aria-label="Posição ${i+1}: ${ch}">${ch}</button>`)}
    const a=translate(ORIG).prot,b=translate(seq).prot;prot.innerHTML='';
    const row=(lab,arr,cmp)=>`<div class="mp-row"><span class="mp-lab">${lab}</span>${arr.map((x,k)=>`<span class="aa${x==='*'?' stop':''}${cmp&&cmp[k]!==x?' chg':''}">${AA[x][0]}</span>`).join('')}</div>`;
    prot.innerHTML=row('Original',a)+row('Mutante',b,a);
    let tipo,txt;
    if(seq===ORIG){tipo='Sem mutação';txt='Sequência original: Met–Ala–Lys–Phe–Gly–Trp–His e parada.'}
    else if(seq.length!==ORIG.length){const d=seq.length-ORIG.length;tipo=d>0?'Inserção: mudança da fase de leitura':'Deleção: mudança da fase de leitura';
      txt=`${Math.abs(d)} nucleotídeo${Math.abs(d)>1?'s':''} ${d>0?'a mais':'a menos'}${Math.abs(d)%3===0?': como é múltiplo de 3, a fase se mantém e só se ganha ou perde aminoácido.':'. A partir do ponto da mutação, <b>todos os códons mudam</b>; geralmente surge uma parada precoce ou a proteína perde a função. Foi o que aconteceu no gene MDR1 dos collies (deleção de 4 pb).'}`}
    else{const ln=Math.min(a.length,b.length);let k=-1;for(let j=0;j<Math.max(a.length,b.length);j++)if(a[j]!==b[j]){k=j;break}
      if(k<0){tipo='Silenciosa';txt='A troca mudou o códon, mas não o aminoácido: o código é <b>degenerado</b>. Acontece sobretudo na 3ª base do códon.'}
      else if(b[k]==='*'){tipo='Sem sentido (nonsense)';txt=`O códon do aminoácido ${k+1} virou <b>parada</b>: a proteína sai truncada, com ${k} aminoácido${k===1?'':'s'}. Geralmente perde a função.`}
      else if(a[k]==='*'){tipo='Perda do códon de parada';txt='A parada virou aminoácido: o ribossomo continua lendo além do fim normal e a proteína sai alongada.'}
      else if(k===0){tipo='Perda do códon de início';txt='O AUG foi destruído; o ribossomo procura o próximo AUG, se houver.'}
      else{tipo='Troca de aminoácido (missense)';txt=`${AA[a[k]][1]} virou ${AA[b[k]][1]} na posição ${k+1}. O efeito depende de onde fica e da química do novo aminoácido: pode ser neutro ou devastador, como na HYPP do Quarto de Milha.`}}
    out.innerHTML=(msg?msg+'<br>':'')+`<b>${tipo}.</b> ${txt}`};
  box.addEventListener('click',e=>{const b=e.target.closest('button.nt');if(!b)return;const i=+b.dataset.i;seq=seq.slice(0,i)+NXT[seq[i]]+seq.slice(i+1);render()});
  const M={silenciosa:()=>{seq=ORIG.slice(0,5)+'C'+ORIG.slice(6);return 'GCU → GCC (3ª base do 2º códon).'},
    missense:()=>{seq=ORIG.slice(0,6)+'G'+ORIG.slice(7);return 'AAA → GAA (1ª base do 3º códon).'},
    nonsense:()=>{seq=ORIG.slice(0,17)+'A'+ORIG.slice(18);return 'UGG → UGA (3ª base do 6º códon).'},
    insercao:()=>{seq=ORIG.slice(0,7)+'G'+ORIG.slice(7);return 'Um G inserido após a 7ª base.'},
    delecao:()=>{seq=ORIG.slice(0,7)+ORIG.slice(8);return 'A 8ª base foi removida.'}};
  $('#mutBtns').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;render(M[b.dataset.m]())});
  $('#mutReset').addEventListener('click',()=>{seq=ORIG;render()});render()})();

/* ===================== 5. RODA DO CICLO ===================== */
(()=>{const s=$('#cicSvg');if(!s)return;const out=$('#cicOut'),play=$('#cicPlay');
  const F=[['G1',.40,'var(--sky)','Fase G1','A célula cresce, produz proteínas e organelas e “decide” se vai se dividir. É a fase de duração mais variável. No fim dela está o <b>ponto de restrição</b> (checagem G1/S): ambiente favorável, tamanho suficiente e DNA íntegro? Ciclina D e E com Cdk4/6 e Cdk2 liberam o fator E2F, que liga os genes da fase S.'],
    ['S',.30,'var(--ok)','Fase S','<b>Replicação do DNA</b> (2C → 4C) e duplicação do centrossomo. Novas histonas são produzidas. Cada cromossomo passa a ter duas cromátides-irmãs, unidas pela coesina. Ciclina A–Cdk2.'],
    ['G2',.18,'var(--amber)','Fase G2','Crescimento final e verificação: o DNA foi copiado por inteiro e sem dano? Este é o <b>ponto de checagem G2/M</b>. O complexo ciclina B–Cdk1 (fator promotor da mitose) se acumula e é ativado no fim de G2.'],
    ['M',.12,'var(--eosin)','Fase M','<b>Mitose</b> (prófase, prometafase, metáfase, anáfase, telófase) e <b>citocinese</b>. O <b>ponto de checagem do fuso</b> só libera a anáfase quando todos os cinetócoros estão presos ao fuso. Então o complexo promotor da anáfase destrói a securina (libera a separase) e a ciclina B.']];
  const cx=160,cy=160,R=120,r=70;let a0=-Math.PI/2;const segs=[];
  const pt=(a,rr)=>[cx+rr*Math.cos(a),cy+rr*Math.sin(a)];
  F.forEach((f,k)=>{const a1=a0+f[1]*2*Math.PI,lg=f[1]>.5?1:0,[x1,y1]=pt(a0,R),[x2,y2]=pt(a1,R),[x3,y3]=pt(a1,r),[x4,y4]=pt(a0,r);
    const p=E('path',{d:`M${x1},${y1} A${R},${R} 0 ${lg} 1 ${x2},${y2} L${x3},${y3} A${r},${r} 0 ${lg} 0 ${x4},${y4} Z`,fill:f[2],stroke:'var(--panel)','stroke-width':3,tabindex:0,role:'button','aria-label':f[3],style:`fill:${f[2]};stroke:var(--panel);stroke-width:3;cursor:pointer`},s);
    const am=(a0+a1)/2,[tx,ty]=pt(am,(R+r)/2);T(s,tx,ty+7,f[0],{fs:22,fill:'#fff',w:800,extra:{'pointer-events':'none'}});segs.push({p,a:am});
    E('line',{x1:pt(a1,r-6)[0],y1:pt(a1,r-6)[1],x2:pt(a1,R+8)[0],y2:pt(a1,R+8)[1],stroke:'var(--ink)','stroke-width':k===3?0:3},s);a0=a1});
  T(s,cx,cy-6,'Intérfase',{fs:16,fill:'var(--muted)'});T(s,cx,cy+16,'G1 + S + G2',{fs:15,fill:'var(--muted)'});
  E('circle',{cx:290,cy:40,r:22,fill:'none',stroke:'var(--muted)','stroke-width':2,'stroke-dasharray':'4 4'},s);T(s,290,46,'G0',{fs:16,fill:'var(--muted)'});
  const ptr=E('line',{x1:cx,y1:cy,x2:cx,y2:cy-R-12,stroke:'var(--ink)','stroke-width':4,'stroke-linecap':'round'},s);E('circle',{cx,cy,r:6,fill:'var(--ink)'},s);
  const sel=k=>{segs.forEach((g,j)=>g.p.style.opacity=j===k?1:.45);ptr.setAttribute('transform',`rotate(${segs[k].a*180/Math.PI+90} ${cx} ${cy})`);
    out.innerHTML=`<b>${F[k][3]}.</b> ${F[k][4]}`+(k===0?'<br><span style="color:var(--muted)">Células que saem do ciclo vão para <b>G0</b> (neurônios, cardiomiócitos); hepatócitos ficam em G0 mas podem voltar ao ciclo após uma lesão.</span>':'')};
  segs.forEach((g,k)=>{g.p.addEventListener('click',()=>sel(k));g.p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();sel(k)}})});
  let t=null,k=0;play.addEventListener('click',()=>{if(t){clearInterval(t);t=null;play.textContent='▶ Girar o ciclo';play.setAttribute('aria-pressed','false');return}
    play.textContent='■ Parar';play.setAttribute('aria-pressed','true');t=setInterval(()=>{k=(k+1)%4;sel(k)},2600);sel(k)});
  ptr.style.transition=reduce?'none':'transform .6s var(--ease)';sel(0)})();

/* ===================== cromossomos (mitose e meiose) ===================== */
/* cromossomo duplicado vertical: duas cromátides lado a lado; cores por cromátide; tip = cor da ponta (crossing) */
function chrom(p,x,y,len,c1,c2,o={}){const g=E('g',{},p),w=7,gap=o.single?0:9;
  const rod=(xx,col,tip)=>{E('rect',{x:xx-w/2,y:y-len/2,width:w,height:len,rx:3.5,fill:col},g);if(tip)E('rect',{x:xx-w/2,y:y+len/2-len*.38,width:w,height:len*.38,rx:3.5,fill:tip},g)};
  if(o.single)rod(x,c1,o.tip1);else{rod(x-gap/2,c1,o.tip1);rod(x+gap/2,c2||c1,o.tip2)}
  E('circle',{cx:x,cy:y-len*.12,r:o.single?3.5:5,fill:'var(--ink)'},g);return g}
const spindle=(p,px,py,pts)=>pts.forEach(([x,y])=>E('line',{x1:px,y1:py,x2:x,y2:y,stroke:'var(--muted)','stroke-width':1.6,opacity:.6},p));
const pole=(p,x,y)=>{E('circle',{cx:x,cy:y,r:7,fill:'var(--amber)'},p);for(let a=0;a<8;a++)E('line',{x1:x,y1:y,x2:x+14*Math.cos(a*Math.PI/4),y2:y+14*Math.sin(a*Math.PI/4),stroke:'var(--amber)','stroke-width':2},p)};
const cell=(p,cx,cy,rx,ry)=>E('ellipse',{cx,cy,rx,ry,fill:'var(--hema-soft)',stroke:'var(--hema)','stroke-width':3},p);
const nucleus=(p,cx,cy,r,dash)=>E('circle',{cx,cy,r,fill:dash?'none':'var(--panel)',stroke:'var(--hema-2)','stroke-width':2.5,'stroke-dasharray':dash?'8 7':null},p);
const M=C.mat,P=C.pat;

stepper('mit',[
 ['Intérfase (G2)','O DNA já foi replicado na fase S, mas a cromatina está descondensada e o envoltório nuclear, intacto. Dois centrossomos ao lado do núcleo. Aqui, 2n = 4: um par grande e um pequeno (vermelho = de origem materna, azul = paterna).'],
 ['Prófase','A cromatina se <b>condensa</b>: cada cromossomo aparece com <b>duas cromátides-irmãs</b> unidas no centrômero. O nucléolo some. Os centrossomos se afastam e começam a montar o fuso.'],
 ['Prometafase','O <b>envoltório nuclear se fragmenta</b> (fosforilação das laminas). Microtúbulos do fuso “pescam” os cromossomos pelos <b>cinetócoros</b>, um de cada lado.'],
 ['Metáfase','Os cromossomos se alinham na <b>placa metafásica</b>, cada cromátide-irmã ligada a um polo. Máxima condensação: é aqui que se faz o <b>cariótipo</b> (colchicina bloqueia a célula nesta fase). O ponto de checagem do fuso vigia a ligação.'],
 ['Anáfase','A <b>separase</b> corta a coesina e as cromátides-irmãs se separam, puxadas para polos opostos pelo encurtamento dos microtúbulos. A partir daqui cada cromátide é um cromossomo.'],
 ['Telófase e citocinese','Os cromossomos chegam aos polos e descondensam; o envoltório nuclear se refaz. Um <b>anel contrátil de actina e miosina</b> estrangula a célula. Resultado: <b>duas células diploides idênticas</b> entre si e à célula-mãe.']
],(s,i)=>{const g=E('g',{},s);
  if(i<5)cell(g,300,130,250,115);else{E('path',{d:'M300,40 C220,15 55,40 55,130 C55,220 220,245 300,220 C380,245 545,220 545,130 C545,40 380,15 300,40 Z',fill:'var(--hema-soft)',stroke:'var(--hema)','stroke-width':3},g);
    E('path',{d:'M300,40 Q285,130 300,220',fill:'none',stroke:'var(--hema)','stroke-width':2,'stroke-dasharray':'6 6'},g)}
  const set=[[M,40],[P,40],[M,24],[P,24]];
  if(i===0){nucleus(g,300,130,78);for(let k=0;k<9;k++)E('path',{d:`M${250+k*11},${90+(k%3)*25} q12,18 0,36 q-12,18 0,30`,fill:'none',stroke:k%2?P:M,'stroke-width':2.5,opacity:.8},g);
    pole(g,395,60);pole(g,410,72);return}
  if(i===1){nucleus(g,300,130,80);[[255,105],[335,100],[280,165],[345,160]].forEach(([x,y],k)=>chrom(g,x,y,set[k][1],set[k][0]));pole(g,170,130);pole(g,430,130);spindle(g,170,130,[[230,100],[230,160]]);spindle(g,430,130,[[370,100],[370,160]]);return}
  if(i===2){nucleus(g,300,130,82,true);const pts=[[260,95],[330,105],[285,165],[350,155]];pts.forEach(([x,y],k)=>chrom(g,x,y,set[k][1],set[k][0]));pole(g,90,130);pole(g,510,130);
    spindle(g,90,130,pts.map(([x,y])=>[x-5,y]));spindle(g,510,130,pts.map(([x,y])=>[x+5,y]));return}
  const ys=[55,105,160,205];
  if(i===3){ys.forEach((y,k)=>chrom(g,300,y,set[k][1],set[k][0]));pole(g,80,130);pole(g,520,130);spindle(g,80,130,ys.map(y=>[295,y]));spindle(g,520,130,ys.map(y=>[305,y]));
    E('line',{x1:300,y1:25,x2:300,y2:235,stroke:'var(--muted)','stroke-width':1.5,'stroke-dasharray':'5 6'},g);return}
  if(i===4){pole(g,80,130);pole(g,520,130);ys.forEach((y,k)=>{chrom(g,200,y,set[k][1],set[k][0],{single:1});chrom(g,400,y,set[k][1],set[k][0],{single:1})});
    spindle(g,80,130,ys.map(y=>[200,y]));spindle(g,520,130,ys.map(y=>[400,y]));return}
  [170,430].forEach(cx=>{nucleus(g,cx,130,62);[[cx-25,110],[cx+20,105],[cx-15,160],[cx+25,158]].forEach(([x,y],k)=>chrom(g,x,y,set[k][1]*.85,set[k][0],null,{single:1}))});
  T(g,300,252,'Anel contrátil',{fs:22,fill:'var(--hema)'})});

/* ===================== 6. MEIOSE ===================== */
stepper('mei',[
 ['Intérfase pré-meiótica','Uma única fase S replica o DNA (2C → 4C). A célula tem 2n = 4: um par grande e um pequeno; vermelho = homólogo materno, azul = paterno.'],
 ['Prófase I: sinapse e crossing-over','Os homólogos se <b>pareiam</b> (zigóteno) formando <b>bivalentes</b>. No paquíteno, cromátides não irmãs <b>trocam segmentos</b> (crossing-over): veja as pontas de cores trocadas. No diplóteno, os pontos de troca aparecem como <b>quiasmas</b>.'],
 ['Metáfase I','Os <b>bivalentes</b> se alinham na placa: um homólogo voltado para cada polo. A orientação de cada par é aleatória (<b>segregação independente</b>).'],
 ['Anáfase I','Os <b>homólogos se separam</b> e vão para polos opostos. As cromátides-irmãs <b>continuam juntas</b>. É aqui que o número cai de 2n para n: divisão <b>reducional</b>.'],
 ['Telófase I e citocinese','Duas células <b>haploides</b> (n = 2), cada cromossomo ainda com duas cromátides (2C). Segue a intercinese, <b>sem replicação</b>.'],
 ['Metáfase II','Em cada célula, os cromossomos se alinham individualmente na placa, como numa mitose. <b>O ovócito fica parado aqui</b> até a fecundação.'],
 ['Anáfase II','A separase corta a coesina do centrômero e as <b>cromátides-irmãs se separam</b>: divisão <b>equacional</b>.'],
 ['Telófase II: quatro células','<b>Quatro células haploides</b> (n, 1C), todas geneticamente diferentes por causa do crossing-over e da segregação independente. No macho, 4 espermátides; na fêmea, 1 ovócito e corpúsculos polares.']
],(s,i)=>{const g=E('g',{},s);
  if(i===0){cell(g,300,130,250,115);nucleus(g,300,130,80);for(let k=0;k<9;k++)E('path',{d:`M${250+k*11},${90+(k%3)*25} q12,18 0,36 q-12,18 0,30`,fill:'none',stroke:k%2?P:M,'stroke-width':2.5,opacity:.8},g);return}
  if(i===1){cell(g,300,130,250,115);nucleus(g,300,130,95);
    chrom(g,262,120,44,M,M,{tip2:P});chrom(g,286,120,44,P,P,{tip1:M});chrom(g,322,140,28,M,M,{tip2:P});chrom(g,346,140,28,P,P,{tip1:M});
    T(g,274,80,'Bivalente',{fs:22,fill:'var(--hema)'});return}
  if(i===2){cell(g,300,130,250,115);pole(g,80,130);pole(g,520,130);
    chrom(g,282,85,44,M,M,{tip2:P});chrom(g,318,85,44,P,P,{tip1:M});chrom(g,282,175,28,P,P,{tip2:M});chrom(g,318,175,28,M,M,{tip1:P});
    spindle(g,80,130,[[276,85],[276,175]]);spindle(g,520,130,[[324,85],[324,175]]);E('line',{x1:300,y1:25,x2:300,y2:235,stroke:'var(--muted)','stroke-width':1.5,'stroke-dasharray':'5 6'},g);return}
  if(i===3){cell(g,300,130,250,115);pole(g,80,130);pole(g,520,130);
    chrom(g,180,95,44,M,M,{tip2:P});chrom(g,180,170,28,P,P,{tip2:M});chrom(g,420,95,44,P,P,{tip1:M});chrom(g,420,170,28,M,M,{tip1:P});
    spindle(g,80,130,[[175,95],[175,170]]);spindle(g,520,130,[[425,95],[425,170]]);return}
  const L=[[M,M,{tip2:P}],[P,P,{tip2:M}]],R=[[P,P,{tip1:M}],[M,M,{tip1:P}]];
  if(i===4){[[150,L],[450,R]].forEach(([cx,c])=>{cell(g,cx,130,135,105);nucleus(g,cx,130,58);chrom(g,cx-18,120,44,...c[0]);chrom(g,cx+20,135,28,...c[1])});return}
  if(i===5||i===6){[[150,L],[450,R]].forEach(([cx,c])=>{cell(g,cx,130,135,105);pole(g,cx-105,130);pole(g,cx+105,130);
      if(i===5){chrom(g,cx,95,44,...c[0]);chrom(g,cx,170,28,...c[1]);spindle(g,cx-105,130,[[cx-5,95],[cx-5,170]]);spindle(g,cx+105,130,[[cx+5,95],[cx+5,170]])}
      else{const a=c[0],b=c[1];chrom(g,cx-50,95,44,a[0],null,{single:1,tip1:a[2].tip1});chrom(g,cx+50,95,44,a[1],null,{single:1,tip1:a[2].tip2});
        chrom(g,cx-50,170,28,b[0],null,{single:1,tip1:b[2].tip1});chrom(g,cx+50,170,28,b[1],null,{single:1,tip1:b[2].tip2});
        spindle(g,cx-105,130,[[cx-50,95],[cx-50,170]]);spindle(g,cx+105,130,[[cx+50,95],[cx+50,170]])}});return}
  const cs=[[80,L,0],[225,L,1],[375,R,0],[520,R,1]];
  cs.forEach(([cx,c,side])=>{cell(g,cx,130,66,92);nucleus(g,cx,130,44);const a=c[0],b=c[1],ta=side?a[2].tip2:a[2].tip1,tb=side?b[2].tip2:b[2].tip1;
    chrom(g,cx-12,122,40,side?a[1]:a[0],null,{single:1,tip1:ta});chrom(g,cx+14,138,26,side?b[1]:b[0],null,{single:1,tip1:tb})})});

/* ===================== 7. PUNNETT ===================== */
(()=>{const P1=$('#punP');if(!P1)return;const P2=$('#punM'),tipo=$('#punTipo'),grid=$('#punGrid'),out=$('#punOut');
  const gam=g=>{if(g.length===2)return[g[0],g[1]];const a=[g[0],g[1]],b=[g[2],g[3]],r=[];a.forEach(x=>b.forEach(y=>r.push(x+y)));return r};
  const norm=s=>{let r='';for(let k=0;k<s.length;k+=2){const p=[s[k],s[k+1]].sort((x,y)=>(x===x.toUpperCase()?0:1)-(y===y.toUpperCase()?0:1));r+=p.join('')}return r};
  const comb=(x,y)=>{let s='';for(let k=0;k<x.length;k++)s+=x[k]+y[k];return norm(s)};
  const fen=(gt,inc)=>{const parts=[];for(let k=0;k<gt.length;k+=2){const L=gt[k].toUpperCase(),n=[gt[k],gt[k+1]].filter(c=>c===L).length;
      parts.push(inc?(n===2?L+L:n===1?L+L.toLowerCase()+' (intermediário)':L.toLowerCase()+L.toLowerCase()):(n?L+'_':L.toLowerCase()+L.toLowerCase()))}return parts.join(' ')};
  const gcd=(a,b)=>b?gcd(b,a%b):a;
  const ratio=m=>{const v=[...m.values()],d=v.reduce(gcd);return[...m.entries()].map(([k,n])=>`<b>${n/d}</b> ${k}`).join(' : ')};
  const pal=['var(--hema)','var(--sky)','var(--eosin)','var(--amber)','var(--hema-2)','var(--ok)','var(--bone-ink)','var(--muted)','var(--bad)'];
  const run=()=>{const a=P1.value,b=P2.value,inc=tipo.value==='inc';
    if(a.length!==b.length){grid.innerHTML='';out.innerHTML='<b>Escolha dois genótipos com o mesmo número de genes</b> (os dois com um gene, como Aa, ou os dois com dois genes, como AaBb).';return}
    const ga=gam(a),gb=gam(b),cnt=new Map(),fc=new Map(),col=new Map();let html=`<table class="pun"><thead><tr><th scope="col">♂ \\ ♀</th>${gb.map(x=>`<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>`;
    ga.forEach(x=>{html+=`<tr><th scope="row">${x}</th>`;gb.forEach(y=>{const gt=comb(x,y),f=fen(gt,inc);cnt.set(gt,(cnt.get(gt)||0)+1);fc.set(f,(fc.get(f)||0)+1);if(!col.has(f))col.set(f,pal[col.size%pal.length]);
      html+=`<td style="--c:${col.get(f)}">${gt}</td>`});html+='</tr>'});html+='</tbody></table>';
    grid.innerHTML=html;grid.style.setProperty('--n',gb.length);
    const tot=ga.length*gb.length;
    out.innerHTML=`<b>Cruzamento ${a} × ${b}</b> (${tot} combinações de gametas)<br>Proporção genotípica: ${ratio(cnt)}<br>Proporção fenotípica: ${ratio(fc)}`+
      (a.length===2?`<br><span style="color:var(--muted)">Exemplo bovino: A = pelagem preta (dominante), a = vermelha.${inc?' Na dominância incompleta o heterozigoto é intermediário, como o palomino (alazão × cremelo) nos equinos.':''}</span>`:
      `<br><span style="color:var(--muted)">Exemplo bovino: A = preta, a = vermelha; B = mocho (sem chifres, dominante), b = com chifres.</span>`)};
  [P1,P2,tipo].forEach(e=>e.addEventListener('change',run));run()})();

/* ===================== 8. FECUNDAÇÃO ===================== */
stepper('fec',[
 ['Ovócito em metáfase II','O ovócito ovulado está parado em <b>metáfase II</b>, já com o <b>1º corpúsculo polar</b>. Envolvem-no a <b>zona pelúcida</b> (glicoproteínas) e as células do <b>cumulus</b> (corona radiata). Sob a membrana estão os <b>grânulos corticais</b>.'],
 ['Passagem pelo cumulus','O espermatozoide <b>capacitado</b>, com batimento hiperativado, atravessa as células do cumulus com ajuda da <b>hialuronidase</b> da superfície da cabeça.'],
 ['Ligação à zona e reação acrossômica','A cabeça se liga à <b>zona pelúcida</b> (reconhecimento espécie-específico). A ligação dispara a <b>reação acrossômica</b>: a membrana acrossômica externa se funde à plasmática e libera as enzimas.'],
 ['Penetração da zona pelúcida','A <b>acrosina</b> e o batimento vigoroso abrem um túnel oblíquo na zona. O espermatozoide chega ao <b>espaço perivitelino</b>.'],
 ['Fusão e ondas de cálcio','A membrana da região equatorial se funde à do ovócito (Izumo–Juno). A <b>fosfolipase C zeta</b> trazida pelo espermatozoide gera IP₃ e <b>ondas de Ca²⁺</b> percorrem o ovócito: é a <b>ativação</b>.'],
 ['Reação cortical e 2º corpúsculo polar','Os grânulos corticais fazem exocitose: a zona endurece e não aceita outros espermatozoides (<b>bloqueio da polispermia</b>). O ovócito termina a meiose II e libera o <b>2º corpúsculo polar</b>.'],
 ['Pró-núcleos','O núcleo do espermatozoide descondensa (protaminas trocadas por histonas) e forma o <b>pró-núcleo masculino</b>; o material materno forma o <b>feminino</b>. Ambos replicam o DNA e migram para o centro, guiados pelo áster do centrossomo paterno.'],
 ['Singamia: nasce o zigoto','Os envoltórios dos pró-núcleos se desfazem e os cromossomos se reúnem na <b>primeira metáfase</b>. O <b>zigoto</b> é diploide (2n) e o sexo já está definido pelo espermatozoide (X ou Y). Segue a primeira clivagem.']
],(s,i)=>{const g=E('g',{},s),cx=300,cy=130,ro=72;
  E('circle',{cx,cy,r:94,fill:'none',stroke:i>=5?'var(--hema-2)':'var(--bone-2)','stroke-width':i>=5?17:14,opacity:.9},g);
  if(i<=1)for(let k=0;k<22;k++){const a=k/22*2*Math.PI+(k%2)*.1,rr=116+(k%3)*9;if(i===1&&a>Math.PI*.85&&a<Math.PI*1.25)continue;E('circle',{cx:cx+rr*Math.cos(a),cy:cy+rr*Math.sin(a),r:8,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':1.5},g)}
  E('circle',{cx,cy,r:ro,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2.5},g);
  if(i<5)for(let k=0;k<24;k++){const a=k/24*2*Math.PI;E('circle',{cx:cx+(ro-7)*Math.cos(a),cy:cy+(ro-7)*Math.sin(a),r:3,fill:'var(--eosin)'},g)}
  else for(let k=0;k<24;k++){const a=k/24*2*Math.PI;E('circle',{cx:cx+(ro+6)*Math.cos(a),cy:cy+(ro+6)*Math.sin(a),r:2,fill:'var(--eosin)',opacity:.6},g)}
  E('circle',{cx:cx+18,cy:cy-ro-7,r:6,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':1.5},g);
  if(i>=5)E('circle',{cx:cx-18,cy:cy-ro-7,r:6,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':1.5},g);
  if(i<5){[-12,0,12].forEach(d=>E('rect',{x:cx+d-3,y:cy-14,width:6,height:28,rx:3,fill:'var(--ink)'},g))}
  const sperm=(x,y,ang,acro,tail=true)=>{const sg=E('g',{transform:`translate(${x},${y}) rotate(${ang})`},g);
    if(tail){const tl=E('path',{d:'M14,0 q20,-10 40,0 t40,0 t30,0',fill:'none',stroke:'var(--sky)','stroke-width':2.5},sg);if(!reduce)E('animate',{attributeName:'d',values:'M14,0 q20,-10 40,0 t40,0 t30,0;M14,0 q20,10 40,0 t40,0 t30,0;M14,0 q20,-10 40,0 t40,0 t30,0',dur:'.6s',repeatCount:'indefinite'},tl)}
    E('ellipse',{cx:0,cy:0,rx:14,ry:8,fill:'var(--sky)'},sg);if(acro)E('path',{d:'M-14,0 A14,8 0 0 1 2,-7.8 L2,7.8 A14,8 0 0 1 -14,0',fill:'var(--amber)'},sg);return sg};
  if(i===0){sperm(70,40,25,1);sperm(80,215,-30,1);T(g,cx,254,'Cumulus · zona · ovócito',{fs:22,fill:'var(--muted)'})}
  if(i===1){const sg=sperm(170,130,0,1);if(!reduce)E('animateTransform',{attributeName:'transform',type:'translate',values:'170 130;196 130;170 130',dur:'1.6s',repeatCount:'indefinite',additive:'replace'},sg);T(g,150,245,'Hialuronidase',{fs:22,fill:'var(--amber)'})}
  if(i===2){sperm(195,130,0,0);for(let k=0;k<6;k++)E('circle',{cx:190-k*3,cy:124+k*2.5,r:2.5,fill:'var(--amber)'},g);T(g,150,245,'Reação acrossômica',{fs:22,fill:'var(--amber)'})}
  if(i===3){E('path',{d:'M206,130 L222,130',stroke:'var(--panel)','stroke-width':8},g);sperm(222,130,0,0);T(g,150,245,'Acrosina abre a zona',{fs:22,fill:'var(--amber)'})}
  if(i===4){sperm(232,130,0,0,false);[0,1,2].forEach(k=>{const c=E('circle',{cx:232,cy:130,r:10,fill:'none',stroke:'var(--amber)','stroke-width':3},g);
      if(!reduce){E('animate',{attributeName:'r',values:'10;80',dur:'2.4s',begin:k*.8+'s',repeatCount:'indefinite'},c);E('animate',{attributeName:'opacity',values:'1;0',dur:'2.4s',begin:k*.8+'s',repeatCount:'indefinite'},c)}else c.setAttribute('r',30+k*20)});
    T(g,cx,252,'Ondas de Ca²⁺',{fs:22,fill:'var(--amber)'})}
  if(i===5){E('ellipse',{cx:250,cy:130,rx:10,ry:7,fill:'var(--sky)'},g);[-8,4].forEach(d=>E('rect',{x:cx+d-3,y:cy-12,width:6,height:24,rx:3,fill:'var(--ink)'},g));
    for(let k=0;k<4;k++)sperm(30+k*25,30+k*55,10-k*8,0);T(g,cx,252,'Zona endurecida: bloqueio da polispermia',{fs:22,fill:'var(--hema-2)'})}
  if(i===6){[[270,'var(--sky)','♂'],[330,'var(--eosin)','♀']].forEach(([x,c,l])=>{E('circle',{cx:x,cy,r:22,fill:'var(--panel)',stroke:c,'stroke-width':3},g);T(g,x,cy+7,l,{fs:20,fill:c})});
    for(let k=0;k<8;k++){const a=k/8*2*Math.PI;E('line',{x1:270,y1:cy,x2:270+40*Math.cos(a),y2:cy+40*Math.sin(a),stroke:'var(--amber)','stroke-width':1.2,opacity:.6},g)}
    T(g,cx,252,'Pró-núcleo masculino e feminino',{fs:22,fill:'var(--muted)'})}
  if(i===7){[[-18,M],[-6,P],[6,M],[18,P]].forEach(([d,c])=>E('rect',{x:cx+d-3,y:cy-16,width:6,height:32,rx:3,fill:c},g));E('line',{x1:cx-60,y1:cy,x2:cx-24,y2:cy,stroke:'var(--muted)'},g);E('line',{x1:cx+24,y1:cy,x2:cx+60,y2:cy,stroke:'var(--muted)'},g);
    T(g,cx,252,'Zigoto 2n: primeira metáfase',{fs:22,fill:'var(--hema)'})}
});

/* ===================== 9. PLACENTAS ===================== */
(()=>{const sh=$('#plShape');if(!sh)return;const ly=$('#plLayers'),out=$('#plOut');
  const S={porca:{nome:'Porca',forma:'difusa',barr:'epiteliocorial',n:3,tx:'Placenta <b>difusa</b>: pregas e aréolas em quase todo o córion alongado. <b>Epiteliocorial</b>: as seis camadas estão presentes; mãe e feto apenas se encostam. Leitão nasce <b>sem imunoglobulinas</b>: o colostro nas primeiras horas é vital. As aréolas absorvem a secreção das glândulas uterinas (histotrofo), rica em ferro (uteroferrina).'},
    egua:{nome:'Égua',forma:'difusa',barr:'epiteliocorial',n:3,micro:1,tx:'Placenta <b>difusa com microcotilédones</b> distribuídos por todo o córion. <b>Epiteliocorial</b>: potro nasce sem anticorpos e depende do colostro; falha na transferência de imunidade passiva é causa importante de septicemia neonatal (dose de IgG sérica ao redor de 12–24 h). Os cálices endometriais produzem eCG.'},
    vaca:{nome:'Ruminantes',forma:'cotiledonaria',barr:'sinepiteliocorial',n:3,tx:'Placenta <b>cotiledonária</b>: contato só nos <b>placentomas</b> (cotilédone fetal + carúncula materna). <b>Sinepiteliocorial</b>: células binucleadas do trofoblasto migram e se fundem ao epitélio uterino, formando células híbridas; elas secretam lactogênio placentário e glicoproteínas associadas à gestação (PAG), base de testes de gestação no sangue e no leite. Bezerro e cordeiro dependem 100% do colostro.'},
    cadela:{nome:'Carnívoros',forma:'zonaria',barr:'endoteliocorial',n:1,tx:'Placenta <b>zonária</b>: uma faixa ao redor do concepto, com <b>hematomas marginais</b> (pigmento verde, por isso a secreção verde no parto). <b>Endoteliocorial</b>: o epitélio e o conjuntivo uterinos desaparecem; o trofoblasto encosta no endotélio materno. Passa uma pequena fração de IgG (5–10%); o colostro ainda é essencial.'},
    primata:{nome:'Primatas e roedores',forma:'discoide',barr:'hemocorial',n:0,tx:'Placenta <b>discoide</b>. <b>Hemocorial</b>: o trofoblasto invade e fica banhado diretamente pelo sangue materno. A IgG materna passa ao feto ainda na gestação; o recém-nascido humano nasce com anticorpos maternos.'}};
  const drawShape=d=>{clear(sh);T(sh,130,24,'Forma: '+{difusa:'difusa',cotiledonaria:'cotiledonária',zonaria:'zonária',discoide:'discoide'}[d.forma],{fs:16});
    const long=d.forma==='difusa'||d.forma==='cotiledonaria';const rx=long?110:72,ry=long?45:60;
    E('ellipse',{cx:130,cy:112,rx,ry,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2.5},sh);
    E('ellipse',{cx:130,cy:112,rx:14,ry:22,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':2},sh);
    if(d.forma==='difusa'){for(let k=0;k<44;k++){const a=k/44*2*Math.PI,x=130+rx*Math.cos(a),y=112+ry*Math.sin(a);d.micro?E('circle',{cx:x,cy:y,r:3.2,fill:'var(--hema)'},sh):E('line',{x1:x,y1:y,x2:130+(rx+8)*Math.cos(a),y2:112+(ry+8)*Math.sin(a),stroke:'var(--hema)','stroke-width':2.5},sh)}}
    if(d.forma==='cotiledonaria'){for(let k=0;k<14;k++){const a=k/14*2*Math.PI+.2;E('circle',{cx:130+rx*Math.cos(a),cy:112+ry*Math.sin(a),r:8,fill:'var(--hema)',stroke:'var(--panel)','stroke-width':2},sh)}}
    if(d.forma==='zonaria'){E('rect',{x:108,y:112-ry-4,width:44,height:ry*2+8,rx:8,fill:'var(--hema)',opacity:.85},sh);E('rect',{x:108,y:112-ry-4,width:6,height:ry*2+8,fill:'var(--ok)'},sh);E('rect',{x:146,y:112-ry-4,width:6,height:ry*2+8,fill:'var(--ok)'},sh)}
    if(d.forma==='discoide'){E('ellipse',{cx:130,cy:112-ry+4,rx:40,ry:14,fill:'var(--hema)'},sh)}
    T(sh,130,190,'Escuro: área de troca',{fs:14,fill:'var(--muted)'})};
  const drawLayers=d=>{clear(ly);T(ly,130,20,'Barreira: '+d.barr,{fs:16});const rows=[['Endotélio materno','m',3],['Conjuntivo materno','m',2],['Epitélio uterino','m',1],['Epitélio coriônico','f',0],['Conjuntivo fetal','f',0],['Endotélio fetal','f',0]];
    E('rect',{x:10,y:30,width:240,height:14,rx:4,fill:'var(--eosin)'},ly);T(ly,130,41,'Sangue materno',{fs:11,fill:'#fff'});
    rows.forEach(([n,s,need],k)=>{const y=50+k*21,on=s==='f'||d.n>=need;const sy=d.forma==='cotiledonaria'&&n==='Epitélio uterino';
      E('rect',{x:20,y,width:220,height:17,rx:5,fill:on?(s==='m'?'var(--eosin-soft)':'var(--sky-soft)'):'none',stroke:on?(s==='m'?'var(--eosin)':'var(--sky)'):'var(--muted)','stroke-width':1.5,'stroke-dasharray':on?null:'4 4'},ly);
      T(ly,130,y+13,n+(sy?' (sincício)':'')+(on?'':' — ausente'),{fs:12,fill:on?'var(--ink)':'var(--muted)',w:on?600:400})});
    E('rect',{x:10,y:178,width:240,height:14,rx:4,fill:'var(--sky)'},ly);T(ly,130,189,'Sangue fetal',{fs:11,fill:'#fff'})};
  const go=k=>{const d=S[k];drawShape(d);drawLayers(d);out.innerHTML=`<b>${d.nome}.</b> ${d.tx}`};
  const g=$('#plBtns');g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;press(g,b);go(b.dataset.sp)});go('porca')})();

/* ===================== 10. CRONOLOGIA ===================== */
(()=>{const s=$('#crSvg');if(!s)return;const out=$('#crOut');
  const D={vaca:{max:20,ev:[['2 células',1,1.5],['8–16 células',3,3.5],['Chega ao útero',4,5],['Mórula',5,6],['Blastocisto',7,8],['Eclosão',9,11],['IFN-τ',15,17]],tx:'<b>Vaca.</b> Coleta para transferência de embriões por volta do dia 7 (mórula compacta a blastocisto). O concepto se alonga após a eclosão e, entre os dias 15 e 17, o <b>interferon-tau</b> salva o corpo lúteo. Fixação a partir do dia ~19–20; gestação de cerca de 280 dias.'},
    ovelha:{max:20,ev:[['2 células',1,1.5],['Chega ao útero',3,4],['Mórula',4,5],['Blastocisto',6,7],['Eclosão',7,8],['IFN-τ',12,14]],tx:'<b>Ovelha.</b> Sequência semelhante à da vaca, alguns dias mais cedo; o sinal de reconhecimento (interferon-tau) aparece nos dias 12–14. Gestação de cerca de 150 dias.'},
    porca:{max:20,ev:[['2 células',.6,1],['4 células',1.5,2],['Chega ao útero',2,2.5],['Blastocisto',5,6],['Eclosão',6,7],['Estrógeno',11,12]],tx:'<b>Porca.</b> O embrião chega ao útero muito cedo, com 4 células. Após a eclosão, os conceptos migram pelos cornos e se espaçam; nos dias 11–12 alongam-se até cerca de 1 m e liberam <b>estrógeno</b>, o sinal de reconhecimento. Gestação de cerca de 114 dias (3 meses, 3 semanas e 3 dias).'},
    egua:{max:20,ev:[['2 células',1,1.5],['Chega ao útero',5.5,6.5],['Blastocisto',6,7],['Eclosão',7,8],['Migração',6,17],['Fixação',16,17]],tx:'<b>Égua.</b> Só embriões que produzem <b>PGE2</b> passam pelo istmo, por volta do dia 6. A cápsula mantém a vesícula esférica enquanto ela <b>migra</b> pelo útero até a fixação, perto do dia 16, normalmente na base de um corno. Gestação de cerca de 340 dias.'},
    cadela:{max:22,ev:[['Ovócito I → II',0,3],['Fecundação',2,4],['Chega ao útero',8,10],['Blastocisto',9,12],['Eclosão',12,14],['Implantação',17,20]],tx:'<b>Cadela.</b> A ovulação libera <b>ovócitos primários</b>, que amadurecem no oviduto em 2–3 dias. Os embriões passam cerca de uma semana no oviduto e se implantam por volta dos dias 17–20. Gestação de cerca de 63 dias contados da ovulação.'}};
  const go=k=>{const d=D[k],pc=v=>(v/d.max*100).toFixed(2)+'%';let h='';
    d.ev.forEach(([n,a,b],j)=>{h+=`<div class="cr-row"><span class="cr-lab">${n}</span><span class="cr-track"><i class="${j===d.ev.length-1?'last':''}" style="left:${pc(a)};width:max(10px,${pc(b-a)});animation-delay:${j*90}ms"></i><em style="left:${pc(a)}">${a===b?a:String(a).replace('.',',')+'–'+String(b).replace('.',',')} d</em></span></div>`});
    let ax='';for(let v=0;v<=d.max;v+=4)ax+=`<span style="left:${pc(v)}">${v}</span>`;
    s.innerHTML=h+`<div class="cr-row cr-axis"><span class="cr-lab">Dia</span><span class="cr-track">${ax}</span></div>`;
    out.innerHTML=d.tx};
  const g=$('#crBtns');g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;press(g,b);go(b.dataset.sp)});go('vaca')})();

/* ===================== 11. FOLHETOS ===================== */
(()=>{const s=$('#foSvg');if(!s)return;const out=$('#foOut');const G={};const grp=k=>G[k]||(G[k]=E('g',{'data-g':k},s));
  E('ellipse',{cx:300,cy:125,rx:250,ry:100,fill:'var(--panel)',stroke:'none'},s);
  E('ellipse',{cx:300,cy:125,rx:250,ry:100,fill:'none',stroke:C.eco,'stroke-width':9},grp('ecto'));
  E('circle',{cx:300,cy:62,r:27,fill:C.eco,opacity:.85},grp('ecto'));E('circle',{cx:300,cy:62,r:8,fill:'var(--panel)'},grp('ecto'));
  [[255,46],[345,46],[248,74],[352,74]].forEach(([x,y])=>E('circle',{cx:x,cy:y,r:7,fill:C.cris},grp('crista')));
  E('circle',{cx:300,cy:112,r:11,fill:C.meso},grp('meso'));
  [170,370].forEach(x=>E('rect',{x,y:62,width:60,height:50,rx:16,fill:C.meso,opacity:.8},grp('meso')));
  [168,432].forEach(x=>E('circle',{cx:x,cy:132,r:12,fill:C.meso,opacity:.65},grp('meso')));
  [185,415].forEach(x=>E('ellipse',{cx:x,cy:175,rx:62,ry:24,fill:'var(--paper)',stroke:C.meso,'stroke-width':7},grp('meso')));
  E('circle',{cx:300,cy:178,r:24,fill:'none',stroke:C.endo,'stroke-width':9},grp('endo'));
  const L={ecto:[[140,34,'Tubo neural'],[470,34,'Epiderme']],meso:[[200,46,'Somito'],[300,148,'Notocorda'],[118,132,'Interm.'],[185,214,'Placa lateral']],endo:[[300,234,'Intestino']],crista:[[300,24,'Crista neural']]};
  const lab=E('g',{},s);
  const TX={ecto:'<b>Ectoderma.</b> <i>Superficial</i>: epiderme, pelos, cascos, cornos, unhas, glândulas sebáceas, sudoríparas e <b>mamárias</b>, cristalino, esmalte dos dentes, epitélio da boca e do ânus, adeno-hipófise. <i>Neuroectoderma</i> (tubo neural): encéfalo, medula espinhal, retina, neuro-hipófise.',
    meso:'<b>Mesoderma.</b> <i>Notocorda</i> → núcleo pulposo. <i>Paraxial</i> (somitos) → vértebras, costelas, músculos esqueléticos, derme do dorso. <i>Intermediário</i> → rins, gônadas e ductos genitais. <i>Placa lateral</i> (dividida pelo celoma) → parede do corpo, ossos dos membros, coração, vasos, sangue, músculo liso das vísceras, serosas (pleura, peritônio), baço, córtex da adrenal.',
    endo:'<b>Endoderma.</b> Epitélio de todo o tubo digestório, fígado, pâncreas, vesícula biliar, epitélio da traqueia, brônquios e alvéolos, tireoide, paratireoides, timo, tonsilas, epitélio da bexiga e da uretra.',
    crista:'<b>Crista neural</b> (“quarto folheto”, origem ectodérmica). Gânglios sensitivos e autônomos, células de Schwann, <b>melanócitos</b>, <b>medula da adrenal</b>, ossos e cartilagens da face, odontoblastos (dentina), septo do tronco arterioso do coração. Falhas: síndrome do potro branco letal, surdez ligada à pelagem branca.'};
  const go=k=>{Object.entries(G).forEach(([n,g])=>{g.style.opacity=n===k?1:.18;g.style.transition='opacity .35s'});clear(lab);
    (L[k]||[]).forEach(([x,y,t])=>{const w=t.length*13.5+18;E('rect',{x:x-w/2,y:y-23,width:w,height:31,rx:8,fill:'var(--panel)',stroke:'var(--line)'},lab);T(lab,x,y,t,{fs:24})});out.innerHTML=TX[k]};
  const g=$('#foBtns');g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;press(g,b);go(b.dataset.f)});go('ecto')})();
})();
