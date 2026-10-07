(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const press=(group,btn)=>$$('button',group).forEach(b=>b.setAttribute('aria-pressed',b===btn));

/* ---------- laboratório de direções ---------- */
const lab=$('#dirLab');
if(lab){
  const T={
    cranial:['Cranial','Em direção à cabeça (no tronco e no pescoço).'],
    caudal:['Caudal','Em direção à cauda. Também usado na cabeça, em oposição a rostral.'],
    rostral:['Rostral','Só na cabeça: em direção ao focinho.'],
    dorsal:['Dorsal','No tronco: em direção ao dorso (costas).'],
    ventral:['Ventral','Em direção ao ventre (barriga), em oposição a dorsal.'],
    medial:['Medial','Mais perto do plano mediano do corpo.'],
    lateral:['Lateral','Mais longe do plano mediano, para fora.'],
    proximal:['Proximal','No membro: mais perto do tronco.'],
    distal:['Distal','No membro: mais longe do tronco, em direção ao casco ou à unha.'],
    mdorsal:['Dorsal (mão e pé)','Do carpo/tarso para baixo, a face da frente do membro se chama dorsal.'],
    palmar:['Palmar','Face de trás do membro torácico, do carpo para baixo.'],
    plantar:['Plantar','Face de trás do membro pélvico, do tarso para baixo.']
  };
  const P={smediano:['Plano sagital mediano','Divide o animal em duas metades iguais: os antímeros direito e esquerdo.'],sagital:['Plano sagital','Qualquer plano paralelo ao sagital mediano.'],pdorsal:['Plano dorsal (frontal)','Paralelo ao dorso; separa uma parte dorsal de uma ventral.'],transversal:['Plano transversal','Perpendicular ao eixo longo: corta o corpo ou o membro em fatias.']};
  const out=$('#dirOut'), qb=$('#dirQuiz'), tb=$('#dirBtns'), pb=$('#planeBtns');
  let quiz=false, target=null, score=[0,0];
  const clear=()=>{$$('.arw,.plane',lab).forEach(g=>g.classList.remove('on'));$$('button',tb).forEach(b=>b.setAttribute('aria-pressed','false'));$$('button',pb).forEach(b=>b.setAttribute('aria-pressed','false'))};
  const showT=t=>{$$('.arw[data-t="'+t+'"]',lab).forEach(g=>{g.classList.remove('on');void g.getBBox();g.classList.add('on')})};
  const ask=()=>{clear();const keys=Object.keys(T);let k;do{k=keys[Math.floor(Math.random()*keys.length)]}while(k===target);target=k;showT(k);
    out.innerHTML=`<b>Que direção é esta seta?</b> Toque no termo certo. <span class="mono" style="color:var(--muted)">Placar: ${score[0]}/${score[1]}</span>`};
  $$('button',tb).forEach(b=>b.addEventListener('click',()=>{const t=b.dataset.t;
    if(quiz){score[1]++;const ok=t===target;if(ok)score[0]++;
      out.innerHTML=(ok?`<b style="color:var(--ok)">Certo: ${T[t][0]}.</b> `:`<b style="color:var(--bad)">Não. Era ${T[target][0]}.</b> `)+T[target][1]+` <span class="mono" style="color:var(--muted)">Placar: ${score[0]}/${score[1]}</span>`;
      lab.classList.remove('quiz-mode');setTimeout(()=>{if(quiz){lab.classList.add('quiz-mode');ask()}},reduce?600:1600);return}
    clear();press(tb,b);showT(t);out.innerHTML=`<b>${T[t][0]}.</b> ${T[t][1]}`}));
  $$('button',pb).forEach(b=>b.addEventListener('click',()=>{if(quiz)return;clear();press(pb,b);const p=b.dataset.p;$$('.plane[data-t="'+p+'"]',lab).forEach(g=>g.classList.add('on'));out.innerHTML=`<b>${P[p][0]}.</b> ${P[p][1]}`}));
  qb.addEventListener('click',()=>{quiz=!quiz;qb.setAttribute('aria-pressed',quiz);qb.textContent=quiz?'Sair do teste':'Me teste';lab.classList.toggle('quiz-mode',quiz);
    if(quiz){score=[0,0];ask()}else{clear();out.innerHTML='<b>Toque em um termo ou em um plano.</b>'}});
}

/* ---------- fórmula vertebral ---------- */
const vf=$('#vfBtns');
if(vf){
  const D={equino:['Equino',[7,18,6,5,'15–21',18]],bovino:['Bovino',[7,13,6,5,'18–20',19]],ovino:['Ovino',[7,13,'6–7','4–5','16–24',20]],suino:['Suíno',[7,'14–15','6–7',4,'20–23',21]],cao:['Cão e gato',[7,13,7,3,'20–23',21]]};
  const num=v=>typeof v==='number'?v:+String(v).split('–').map(Number).reduce((a,b)=>a+b)/2;
  const tip={equino:'Campeão de torácicas: 18 (e 18 pares de costelas).',bovino:'Mesmo padrão do equino nas lombares e sacrais (L6 S5), mas só 13 torácicas.',ovino:'Como o bovino, com mais variação nas lombares, sacrais e caudais.',suino:'14–15 torácicas e 4 sacrais.',cao:'Fórmula 13-7-3: mais lombares e menos sacrais que os herbívoros.'};
  const bar=$('#vfBar'), out=$('#vfOut'), segs=$$('span',bar), lab=['C','T','L','S','Ca'];
  const set=k=>{const [n,v]=D[k];const vals=[v[0],v[1],v[2],v[3],v[4]];
    segs.forEach((s,i)=>{s.style.flexGrow=i===4?v[5]:num(vals[i]);s.innerHTML=`${vals[i]}<small>${lab[i]}</small>`});
    const total=vals.reduce((a,x)=>a+num(x),0);
    out.innerHTML=`<b>${n}: C${vals[0]} T${vals[1]} L${vals[2]} S${vals[3]} Ca${vals[4]}</b> · cerca de ${Math.round(total)} vértebras. ${tip[k]}`};
  $$('button',vf).forEach(b=>b.addEventListener('click',()=>{press(vf,b);set(b.dataset.sp)}));
  set('equino');
}

/* ---------- remodelação ---------- */
const remo=$('.remo');
if(remo){
  const oc=$('.oc',remo), ob=$('.ob',remo), pit=$('.pit',remo), fill=$('.fill',remo), out=$('#remoOut'), steps=$('#remoSteps'), play=$('#remoPlay');
  const S=[
    ['Repouso','A superfície está coberta por células de revestimento achatadas (osteoblastos inativos). Os osteócitos mantêm a matriz.',()=>{oc.style.transform='translateX(-330px)';oc.style.opacity=1;ob.style.opacity=0;ob.style.transform='translateY(-24px)';pit.style.transform='scaleY(0)';fill.style.transform='scaleY(0)'}],
    ['Reabsorção','O <b>osteoclasto</b> (gigante, multinucleado, vindo de monócitos) adere à superfície e dissolve a matriz, escavando a <b>lacuna de Howship</b>.',()=>{oc.style.transform='translateX(0)';oc.style.opacity=1;ob.style.opacity=0;pit.style.transform='scaleY(1)';fill.style.transform='scaleY(0)'}],
    ['Reversão','O osteoclasto se retira. Células chegam à cavidade e preparam a superfície; os <b>osteoblastos</b> se alinham na borda da lacuna.',()=>{oc.style.transform='translateX(330px)';oc.style.opacity=0;ob.style.opacity=1;ob.style.transform='translateY(0)';pit.style.transform='scaleY(1)';fill.style.transform='scaleY(0)'}],
    ['Formação','Os osteoblastos depositam <b>osteoide</b> (matriz ainda não mineralizada, em amarelo), que depois se mineraliza. Alguns ficam presos e viram osteócitos.',()=>{oc.style.opacity=0;ob.style.opacity=1;ob.style.transform='translateY(0)';pit.style.transform='scaleY(1)';fill.style.transform='scaleY(1)'}]
  ];
  let cur=0,timer=null;
  const go=i=>{cur=i;S[i][2]();out.innerHTML=`<b>${i+1}. ${S[i][0]}.</b> ${S[i][1]}`;$$('button',steps).forEach(b=>b.setAttribute('aria-pressed',+b.dataset.s===i))};
  $$('button',steps).forEach(b=>b.addEventListener('click',()=>{stop();go(+b.dataset.s)}));
  const stop=()=>{clearInterval(timer);timer=null;play.setAttribute('aria-pressed','false');play.textContent='▶ Reproduzir ciclo'};
  play.addEventListener('click',()=>{if(timer){stop();return}play.setAttribute('aria-pressed','true');play.textContent='❚❚ Pausar';go((cur+1)%4);timer=setInterval(()=>go((cur+1)%4),2600)});
  go(0);
}

/* ---------- ossificação endocondral ---------- */
const os=$('.ossi');
if(os){
  const T=[
    ['Molde de cartilagem','O esqueleto do embrião começa como um <b>molde de cartilagem hialina</b> com o formato do futuro osso, envolto por pericôndrio.'],
    ['Colar ósseo e calcificação','O pericôndrio da diáfise vira <b>periósteo</b> e forma um <b>colar ósseo</b> (por ossificação intramembranosa). No centro, os condrócitos <b>hipertrofiam</b>, a matriz calcifica e eles morrem.'],
    ['Centro primário','A <b>artéria nutrícia</b> invade o centro da diáfise trazendo células osteoprogenitoras: nasce o <b>centro primário de ossificação</b>.'],
    ['Cavidade medular','Os osteoclastos abrem a <b>cavidade medular</b> enquanto a ossificação avança em direção às duas epífises.'],
    ['Centros secundários','Vasos entram nas epífises e surgem os <b>centros secundários de ossificação</b>.'],
    ['Discos epifisários','Restam cartilagem apenas em dois lugares: a <b>cartilagem articular</b> e o <b>disco epifisário</b>, que faz o osso crescer em comprimento.'],
    ['Adulto','Quando o crescimento acaba, o disco é substituído por osso e sobra a <b>linha epifisária</b>. A cartilagem articular permanece por toda a vida.']
  ];
  const out=$('#ossiOut'); let i=0;
  const draw=()=>{$$('.lyr',os).forEach(g=>{const f=+g.dataset.from, t=g.dataset.to===undefined?99:+g.dataset.to;g.classList.toggle('hide',!(i>=f&&i<=t))});
    out.innerHTML=`<b>Etapa ${i+1} de ${T.length} · ${T[i][0]}.</b> ${T[i][1]}`;$('#ossiPrev').disabled=i===0;$('#ossiNext').textContent=i===T.length-1?'Recomeçar ↺':'Próxima etapa →'};
  $('#ossiNext').addEventListener('click',()=>{i=(i+1)%T.length;draw()});
  $('#ossiPrev').addEventListener('click',()=>{if(i>0){i--;draw()}});
  draw();
}

/* ---------- zonas do disco ---------- */
const zc=$('#zCol');
if(zc){
  const Z=[['1 · Zona de repouso','Cartilagem hialina comum, com condrócitos pequenos e espalhados. É a reserva de células, do lado da epífise.'],
    ['2 · Zona seriada (proliferação)','Os condrócitos se dividem rapidamente e se empilham em <b>colunas</b>, como moedas. É aqui que o osso “ganha comprimento”.'],
    ['3 · Zona hipertrófica','Os condrócitos param de se dividir e <b>aumentam muito de volume</b>, acumulando glicogênio.'],
    ['4 · Zona de cartilagem calcificada','A matriz entre as células se calcifica e os condrócitos <b>morrem</b>, deixando lacunas vazias.'],
    ['5 · Zona de ossificação','Vasos e osteoblastos invadem as lacunas e depositam <b>osso</b> sobre a cartilagem calcificada, do lado da diáfise.']];
  const info=$('#zInfo');
  const sel=r=>{$$('.zrow',zc).forEach(x=>{x.classList.toggle('on',x===r);x.setAttribute('aria-selected',x===r)});const z=Z[+r.dataset.z];info.innerHTML=`<h5>${z[0]}</h5><p>${z[1]}</p>`};
  $$('.zrow',zc).forEach(r=>{r.addEventListener('click',()=>sel(r));r.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();sel(r)}if(e.key==='ArrowDown'){e.preventDefault();(r.nextElementSibling||r).focus()}if(e.key==='ArrowUp'){e.preventDefault();(r.previousElementSibling||r).focus()}})});
  sel($('.zrow',zc));
}

/* ---------- cálcio ---------- */
const ca=$('#caSlider');
if(ca){
  const out=$('#caOut'),T=$('#glT'),Pt=$('#glP'),tCT=$('#tCT'),tP=$('#tPTH');
  const upd=()=>{const v=+ca.value;let st;
    if(v<38)st='low';else if(v>62)st='high';else st='ok';
    const lo=st==='low',hi=st==='high';
    T.classList.toggle('dim',!hi);tCT.classList.toggle('dim',!hi);Pt.classList.toggle('dim',!lo);tP.classList.toggle('dim',!lo);
    $('#hCT').classList.toggle('on',hi);$('#fDown').classList.toggle('on',hi);$('#hPTH').classList.toggle('on',lo);$('#fUp').classList.toggle('on',lo);
    $('#caVal').textContent=lo?'Ca²⁺ BAIXO':hi?'Ca²⁺ ALTO':'Ca²⁺ normal';
    $('#mOC').style.width=(lo?85:hi?18:50)+'%';$('#mOB').style.width=(hi?80:lo?30:50)+'%';
    out.innerHTML=lo?'<b>Cálcio baixo.</b> As <b>células principais da paratireoide</b> liberam <b>PTH</b>. O PTH estimula os <b>osteoclastos</b> a reabsorver matriz, e o cálcio sai do osso para o sangue.'
      :hi?'<b>Cálcio alto.</b> As <b>células parafoliculares (C) da tireoide</b> liberam <b>calcitonina</b>. Ela inibe os osteoclastos, e o cálcio fica guardado na matriz óssea.'
      :'<b>Cálcio normal.</b> Formação e reabsorção estão em equilíbrio. Arraste para a esquerda (baixo) ou para a direita (alto) e veja qual glândula entra em ação.'};
  ca.addEventListener('input',upd);upd();
}

/* ---------- articulações ---------- */
const jp=$('#jPause');
if(jp){const j=$('#joints');jp.addEventListener('click',()=>{const p=j.classList.toggle('paused');jp.setAttribute('aria-pressed',p);jp.textContent=p?'▶ Animar':'❚❚ Pausar'});
  if(reduce){j.classList.add('paused');jp.textContent='▶ Animar'}}
const fx=$('#fxSlider');
if(fx){
  const limb=$('#limbB'),deg=$('#fxDeg'),out=$('#fxOut'),arc=$('#fxArc');let last=+fx.value;
  const upd=()=>{const a=+fx.value;const rot=180-a;limb.style.transform=`rotate(${rot}deg)`;deg.textContent=a+'°';
    const r=40,rad=rot*Math.PI/180;
    arc.setAttribute('d',a>=179?'':`M${210-r} 80 A${r} ${r} 0 0 0 ${(210+r*Math.cos(rad)).toFixed(1)} ${(80+r*Math.sin(rad)).toFixed(1)}`);
    const dir=a<last?'<b style="color:var(--eosin)">Flexão</b>: o ângulo entre os ossos está diminuindo.':a>last?'<b style="color:var(--hema)">Extensão</b>: o ângulo entre os ossos está aumentando.':'';
    if(dir)out.innerHTML=dir+(a<=70?' Articulação bem flexionada.':a>=175?' Articulação totalmente estendida.':'');last=a};
  fx.addEventListener('input',upd);upd();out.innerHTML='<b>Arraste para a esquerda</b> para fechar o ângulo (flexão) e para a direita para abrir (extensão).';
}

/* ---------- roteiro fotográfico de bancada ---------- */
$$('.roteiro[data-rot]').forEach(box=>{const R=(window.ROTEIRO||{})[box.dataset.rot];if(!R||!R.length)return;
  const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const opts=R.map((r,i)=>`<option value="${i}">${i+1}. ${esc(r.t)}${r.s?' · '+esc(r.s.replace(/ do antímero /,' · antímero ')):''}</option>`).join('');
  box.insertAdjacentHTML('beforeend',`<div class="rot-nav"><button class="tbtn" type="button" data-a="prev" aria-label="Peça anterior">←</button><select id="rs-${box.dataset.rot}" aria-label="Escolher a peça">${opts}</select><button class="tbtn" type="button" data-a="next" aria-label="Próxima peça">→</button></div>
  <div class="match-body"><figure class="fig rot-fig"><img alt="" loading="lazy"><figcaption></figcaption></figure><div class="mrows"></div></div>
  <div class="match-foot"><button class="btn" type="button" data-a="check">Corrigir</button><button class="tbtn" type="button" data-a="key" aria-pressed="false">Ver gabarito</button><button class="tbtn" type="button" data-a="reset">Limpar</button><span class="score" aria-live="polite"></span></div>`);
  const sel=$('select',box),img=$('.rot-fig img',box),cap=$('.rot-fig figcaption',box),rows=$('.mrows',box),kb=$('[data-a="key"]',box);let i=0;
  const load=n=>{i=(n+R.length)%R.length;sel.value=i;const r=R[i];img.src=r.img;img.alt=r.t+(r.s?', '+r.s:'');kb.setAttribute('aria-pressed','false');kb.textContent=r.key?'Ver gabarito':'Mostrar respostas';
    cap.textContent=(r.s?r.s+'. ':'')+(r.key?'Escolha o nome de cada número; o gabarito mostra a foto rotulada.':'Escolha o nome de cada número.');
    const names=[...new Set(r.items.map(x=>x[1]))];rows.innerHTML='';$('.score',box).textContent='';
    r.items.forEach(([nn,name])=>{const d=document.createElement('div');d.className='mr';d.dataset.ans=name;
      d.innerHTML=`<b>${esc(nn)}</b><select aria-label="Estrutura ${esc(nn)}"><option value="">— escolha —</option>${shuf(names).map(x=>`<option>${esc(x)}</option>`).join('')}</select>`;rows.appendChild(d)})};
  sel.addEventListener('change',()=>load(+sel.value));
  box.addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(!a)return;const act=a.dataset.a,r=R[i];
    if(act==='prev')return load(i-1);if(act==='next')return load(i+1);
    if(act==='key'){const on=a.getAttribute('aria-pressed')!=='true';a.setAttribute('aria-pressed',String(on));
      if(r.key){img.src=on?r.key:r.img;a.textContent=on?'Voltar à foto numerada':'Ver gabarito'}
      $$('.mr',rows).forEach(m=>{const s=$('select',m);$('.fix',m)?.remove();m.classList.remove('no');if(on){s.value=m.dataset.ans;m.classList.add('ok')}else{s.value='';m.classList.remove('ok')}});return}
    let ok=0;$$('.mr',rows).forEach(m=>{const s=$('select',m);$('.fix',m)?.remove();m.classList.remove('ok','no');
      if(act==='reset'){s.value='';return}
      if(s.value===m.dataset.ans){m.classList.add('ok');ok++}else{m.classList.add('no');const f=document.createElement('span');f.className='fix';f.textContent='→ '+m.dataset.ans;m.appendChild(f)}});
    if(act==='reset'){img.src=r.img;kb.setAttribute('aria-pressed','false');kb.textContent=r.key?'Ver gabarito':'Mostrar respostas'}
    $('.score',box).textContent=act==='check'?`${ok} de ${r.items.length} corretas`:''});
  load(0)});
})();

/* ===== Laboratórios das Unidades I, III e V ===== */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,NS='http://www.w3.org/2000/svg';
const press=(g,b)=>$$('button',g).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
function E(tag,a,p){const e=document.createElementNS(NS,tag);let st='';for(const k in a||{}){const v=a[k];if(v==null)continue;
  if(['fill','stroke','opacity','stroke-width','stroke-dasharray'].includes(k))st+=k+':'+v+';';else if(k==='text')e.textContent=v;else e.setAttribute(k,v)}
  if(st)e.setAttribute('style',st);if(p)p.appendChild(e);return e}
const T=(p,x,y,s,o={})=>E('text',Object.assign({x,y,'font-size':o.fs||20,'text-anchor':o.a||'middle','font-weight':o.w||600,fill:o.fill||'var(--ink)',text:s},o.extra||{}),p);
const clear=s=>{while(s.firstChild)s.removeChild(s.firstChild)};
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function stepper(pre,steps,draw){const svg=$('#'+pre+'Svg');if(!svg)return;const out=$('#'+pre+'Out'),prev=$('#'+pre+'Prev'),next=$('#'+pre+'Next');let i=0;
  const go=n=>{i=Math.max(0,Math.min(steps.length-1,n));clear(svg);draw(svg,i);const s=steps[i];out.innerHTML=`<span class="mono" style="color:var(--muted)">${i+1} de ${steps.length}</span> · <b>${s[0]}</b><br>${s[1]}`;
    prev.disabled=i===0;next.textContent=i===steps.length-1?'Recomeçar ↺':'Próxima etapa →'};
  prev.addEventListener('click',()=>go(i-1));next.addEventListener('click',()=>go(i===steps.length-1?0:i+1));go(0)}

/* 1. HE: basófilo ou acidófilo */
(()=>{const card=$('#heCard');if(!card)return;const out=$('#heOut');
  const D=[['Núcleo de qualquer célula','b','DNA com fosfatos (ácido) atrai a hematoxilina.'],['Nucléolo','b','Rico em RNA ribossômico.'],['Citoplasma do plasmócito','b','Muito RER: o RNA dos ribossomos é ácido.'],['Corpúsculos de Nissl do neurônio','b','RER e polirribossomos.'],['Matriz da cartilagem hialina','b','Proteoglicanos sulfatados (ácidos).'],['Grânulos de querato-hialina','b','Basófilos, no estrato granuloso.'],['Hemácias','a','Hemoglobina, proteína básica.'],['Fibras colágenas da derme','a','Proteína: rosa.'],['Citoplasma do hepatócito rico em mitocôndrias','a','Mitocôndrias são acidófilas.'],['Miofibrilas do músculo esquelético','a','Actina e miosina: rosa intenso.'],['Coloide da tireoide','a','Tireoglobulina, proteína.'],['Grânulos do eosinófilo','a','Proteínas básicas: o nome vem da eosina.'],['Estrato córneo (queratina)','a','Proteína: rosa.'],['Matriz óssea','a','Colágeno I mineralizado: rosa.'],['Grânulos de heparina do mastócito (azul de toluidina)','m','Mudam do azul para o roxo-avermelhado.'],['Gordura do adipócito','n','O lipídio é dissolvido pelo xilol: sobra um espaço vazio.'],['Glicogênio do hepatócito','n','Lavado no processamento; aparece com PAS.'],['Fibras reticulares','n','Precisam de prata para aparecer.'],['Fibras elásticas','n','Coram fracamente; orceína ou Verhoeff as evidenciam.']];
  const nome={b:'basófila',a:'acidófila',m:'metacromática',n:'não cora bem na HE'};let ord=shuf(D),k=0,ok=0,tot=0,lock=false;
  const show=()=>{const d=ord[k%ord.length];card.innerHTML=`<span class="mono">Estrutura ${tot+1}</span><b>${d[0]}</b>`;out.innerHTML=`Placar: ${ok} de ${tot}`;lock=false};
  $('#heBtns').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||lock)return;lock=true;const d=ord[k%ord.length];tot++;const r=b.dataset.r===d[1];if(r)ok++;
    card.classList.remove('ok','no');void card.offsetWidth;card.classList.add(r?'ok':'no');
    out.innerHTML=`${r?'<b style="color:var(--ok)">Certo.</b>':'<b style="color:var(--bad)">Errado.</b>'} É <b>${nome[d[1]]}</b>: ${d[2]} <span class="mono" style="color:var(--muted)">· Placar: ${ok} de ${tot}</span>`;
    setTimeout(()=>{k++;if(k%ord.length===0)ord=shuf(D);card.classList.remove('ok','no');card.innerHTML=`<span class="mono">Estrutura ${tot+1}</span><b>${ord[k%ord.length][0]}</b>`;lock=false},1600)});
  $('#heNew').addEventListener('click',()=>{k++;card.classList.remove('ok','no');show()});show()})();

/* 2. Regiões do exterior */
(()=>{const box=$('#exDots');if(!box)return;const out=$('#exOut'),qb=$('#exQuiz');
  const R=[['Cernelha','Região interescapular','Processos espinhosos de T3–T8 e bordas dorsais das escápulas',31,28],['Dorso','Região torácica dorsal','Vértebras torácicas',41,29],['Lombo','Região lombar','Vértebras lombares',53,31],['Garupa','Região sacral e glútea','Sacro e asa do ílio',62,28],['Pescoço (borda da crina)','Região cervical dorsal','Vértebras cervicais e ligamento nucal',24,21],['Espádua (paleta)','Região escapular','Escápula',32,42],['Peito','Região pré-esternal','Manúbrio do esterno e articulações do ombro',21,49],['Codilho','Região olecraniana','Olécrano da ulna',28,57],['“Joelho” (carpo)','Região cárpica','Carpo',33,71],['Canela','Região metacárpica','Metacarpo III',24,77],['Boleto','Articulação metacarpofalângica','MC III, falange proximal, sesamoides proximais',35,86],['Costado','Região costal','Costelas',47,45],['Ventre','Região abdominal ventral','Sem base óssea (linha alba)',46,62],['Flanco','Região abdominal lateral (fossa paralombar)','Sem base óssea',53,52],['Coxa','Região femoral','Fêmur',61,44],['Soldra (joelho)','Região genual','Patela e articulação femorotibiopatelar',64,56],['Perna','Região crural','Tíbia e fíbula',71,62],['Jarrete','Região társica','Tarso; ponta = tuberosidade do calcâneo',76,72],['Cabeça (fronte)','Região frontal','Osso frontal',14,16],['Chanfro','Região nasal','Ossos nasais',9,26]];
  let quiz=false,target=null,sc=[0,0];
  R.forEach((r,i)=>{const b=document.createElement('button');b.type='button';b.className='ex-dot';b.style.left=r[3]+'%';b.style.top=r[4]+'%';b.setAttribute('aria-label',r[0]);b.dataset.i=i;box.appendChild(b)});
  const ask=()=>{let t;do{t=Math.floor(Math.random()*R.length)}while(t===target);target=t;out.innerHTML=`<b>Desafio:</b> toque em <b>${R[t][0]}</b>. <span class="mono" style="color:var(--muted)">Placar ${sc[0]}/${sc[1]}</span>`};
  box.addEventListener('click',e=>{const b=e.target.closest('.ex-dot');if(!b)return;const i=+b.dataset.i,r=R[i];$$('.ex-dot',box).forEach(x=>x.classList.toggle('on',x===b));
    if(!quiz){out.innerHTML=`<b>${r[0]}</b> · ${r[1]}<br>Base: ${r[2]}.`;return}
    sc[1]++;if(i===target){sc[0]++;out.innerHTML=`<b style="color:var(--ok)">Isso!</b> ${r[0]} (${r[1]}).`}else out.innerHTML=`<b style="color:var(--bad)">Não.</b> Esse é ${r[0]}. ${R[target][0]} fica em outro ponto.`;setTimeout(ask,1500)});
  qb.addEventListener('click',()=>{quiz=!quiz;qb.setAttribute('aria-pressed',String(quiz));box.classList.toggle('quiz',quiz);qb.textContent=quiz?'Sair do desafio':'Modo desafio';sc=[0,0];quiz?ask():out.textContent='Toque num ponto para ver a região.'})})();

/* 3. Camadas da pele */
(()=>{const s=$('#skSvg');if(!s)return;const out=$('#skOut');const parts={};
  const P=(k,el)=>{el.setAttribute('tabindex','0');el.setAttribute('role','button');el.style.cursor='pointer';(parts[k]=parts[k]||[]).push(el);return el};
  const TX={epi:['Epiderme','Epitélio estratificado pavimentoso queratinizado, sem vasos. Camadas: basal, espinhosa, granulosa, (lúcida) e córnea. Nos animais com pelo é fina.'],
    cor:['Estrato córneo','Células mortas cheias de queratina que descamam; barreira contra água e microrganismos.'],
    bas:['Estrato basal','Uma fileira de células sobre a membrana basal; mitoses renovam a epiderme. Contém melanócitos e células de Merkel.'],
    der:['Derme','Conjuntivo: papilar (frouxo, junto à epiderme) e reticular (denso não modelado). Vasos, nervos, folículos e glândulas.'],
    hip:['Hipoderme','Conjuntivo frouxo e tecido adiposo. Isolamento, reserva e mobilidade da pele. Local da injeção subcutânea.'],
    pelo:['Pelo e folículo','Haste de queratina produzida pelo bulbo, que envolve a papila dérmica com vasos. O folículo é uma invaginação da epiderme.'],
    seb:['Glândula sebácea','Alveolar, holócrina; abre no folículo e lubrifica o pelo.'],
    sud:['Glândula sudorípara apócrina','Tubulosa enovelada, abre no folículo. Muito desenvolvida no equino.'],
    ere:['Músculo eretor do pelo','Músculo liso que arrepia o pelo (frio, medo). Inervação simpática.'],
    vas:['Vasos da derme','A epiderme não tem vasos: é nutrida pelos capilares das papilas dérmicas. Vasodilatação dissipa calor.']};
  P('hip',E('rect',{x:0,y:250,width:420,height:90,fill:'var(--amber-soft)'},s));for(let i=0;i<9;i++)P('hip',E('ellipse',{cx:25+i*48,cy:296,rx:22,ry:16,fill:'none',stroke:'var(--amber)','stroke-width':2},s));
  P('der',E('rect',{x:0,y:84,width:420,height:166,fill:'var(--eosin-soft)'},s));
  P('epi',E('path',{d:'M0,40 L420,40 L420,84 '+Array.from({length:14},(_,i)=>`Q${405-i*30},${96} ${390-i*30},84`).join(' ')+' L0,84 Z',fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':1.5},s));
  P('cor',E('rect',{x:0,y:30,width:420,height:12,fill:'var(--bone-2)'},s));
  P('bas',E('path',{d:'M0,82 '+Array.from({length:14},(_,i)=>`Q${15+i*30},94 ${30+i*30},82`).join(' '),fill:'none',stroke:'var(--hema)','stroke-width':4},s));
  P('vas',E('path',{d:'M0,230 C80,200 120,250 200,225 S330,205 420,232',fill:'none',stroke:'var(--bad)','stroke-width':5},s));
  P('vas',E('path',{d:'M140,225 L150,110 M300,215 L310,110',fill:'none',stroke:'var(--bad)','stroke-width':2.5},s));
  P('pelo',E('path',{d:'M222,0 L222,240',stroke:'var(--ink)','stroke-width':5,fill:'none'},s));P('pelo',E('path',{d:'M206,84 L206,232 Q222,262 238,232 L238,84',fill:'none',stroke:'var(--sky)','stroke-width':3},s));
  P('pelo',E('ellipse',{cx:222,cy:240,rx:16,ry:12,fill:'var(--hema-2)'},s));
  P('seb',E('ellipse',{cx:262,cy:132,rx:22,ry:16,fill:'var(--amber)',opacity:.85},s));
  P('sud',E('path',{d:'M150,96 Q132,150 156,205 q12,14 -6,22 q-16,-6 -4,-18 q14,-6 4,-18',fill:'none',stroke:'var(--ok)','stroke-width':5},s));
  P('ere',E('path',{d:'M240,180 L330,92',stroke:'var(--eosin)','stroke-width':6,fill:'none','stroke-linecap':'round'},s));
  [['Epiderme',360,66],['Derme',380,180],['Hipoderme',360,330]].forEach(([t,x,y])=>T(s,x,y,t,{fs:17,extra:{'pointer-events':'none'}}));
  const sel=k=>{Object.entries(parts).forEach(([n,els])=>els.forEach(el=>{el.style.filter=n===k?'drop-shadow(0 0 4px var(--hema))':'none';el.style.opacity=n===k?1:''}));out.innerHTML=`<b>${TX[k][0]}.</b> ${TX[k][1]}`};
  Object.entries(parts).forEach(([k,els])=>els.forEach(el=>{el.addEventListener('click',ev=>{ev.stopPropagation();sel(k)});el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();sel(k)}})}))})();

/* 4. Glândula mamária por espécie */
(()=>{const s=$('#mmSvg');if(!s)return;const out=$('#mmOut');
  const D={vaca:{n:2,pos:['ing'],tx:'<b>Vaca</b>: 4 quartos independentes na região inguinal (úbere), 1 óstio por teto. Tetos supranumerários são comuns e devem ser removidos na bezerra.'},
    pequenos:{n:1,pos:['ing'],tx:'<b>Ovelha e cabra</b>: 2 mamas inguinais, 1 óstio por teto. Cabras leiteiras têm úbere grande e tetos longos.'},
    egua:{n:1,pos:['ing'],dupla:1,tx:'<b>Égua</b>: 2 mamas inguinais pequenas; cada teto tem <b>2 óstios</b> (dois complexos glandulares).'},
    porca:{n:7,pos:['tor','abd','ing'],tx:'<b>Porca</b>: 12 a 16 mamas (6–8 pares) do tórax à região inguinal, 2 óstios por teto. Cada leitão “escolhe” um teto e o defende; os craniais produzem mais leite.'},
    cadela:{n:5,pos:['tor','tor','abd','abd','ing'],tx:'<b>Cadela</b>: 10 mamas (5 pares): torácicas cranial e caudal, abdominais cranial e caudal e inguinal. As craniais drenam para o linfonodo axilar; as caudais, para o inguinal superficial.'},
    gata:{n:4,pos:['tor','tor','abd','abd'],tx:'<b>Gata</b>: 8 mamas (4 pares), torácicas e abdominais.'}};
  const go=k=>{clear(s);const d=D[k];E('path',{d:'M40,115 C40,40 120,25 300,25 C480,25 560,40 560,115 C560,190 480,205 300,205 C120,205 40,190 40,115 Z',fill:'var(--bone)',stroke:'var(--bone-2)','stroke-width':3},s);
    T(s,70,120,'Cranial',{fs:17,fill:'var(--muted)',a:'start'});T(s,530,120,'Caudal',{fs:17,fill:'var(--muted)',a:'end'});
    const x0=d.n>2?140:420,x1=d.n>2?480:470,step=d.n>1?(x1-x0)/(d.n-1):0;
    for(let i=0;i<d.n;i++){const x=d.n===1?445:x0+i*step;[78,152].forEach(y=>{const g=E('g',{},s);E('circle',{cx:x,cy:y,r:d.n>5?17:22,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2.5},g);
      E('circle',{cx:x,cy:y,r:6,fill:'var(--eosin)'},g);if(d.dupla){E('circle',{cx:x-4,cy:y,r:2,fill:'#fff'},g);E('circle',{cx:x+4,cy:y,r:2,fill:'#fff'},g)}
      if(!reduce)g.animate([{opacity:0,transform:'scale(.6)'},{opacity:1,transform:'none'}],{duration:350,delay:i*70,fill:'backwards'})})}
    E('line',{x1:80,y1:115,x2:520,y2:115,stroke:'var(--muted)','stroke-width':1.5,'stroke-dasharray':'6 6'},s);T(s,300,224,'Vista ventral · linha média tracejada',{fs:15,fill:'var(--muted)'});out.innerHTML=d.tx};
  const g=$('#mmBtns');g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;press(g,b);go(b.dataset.sp)});go('vaca')})();

/* 5. Substância cinzenta e branca */
(()=>{const s=$('#sbSvg');if(!s)return;const out=$('#sbOut');const C='#8E8A86',W='#F4F1EA';
  const D={medula:'<b>Medula espinhal</b>: substância <b>cinzenta no centro</b>, em H (cornos dorsais sensitivos, ventrais motores, laterais autônomos de T1 a L3), com o canal central; <b>branca por fora</b>, em funículos dorsal, lateral e ventral.',
    cerebro:'<b>Cérebro</b>: <b>córtex cinzento por fora</b>, acompanhando giros e sulcos; <b>branca por dentro</b> (corpo caloso, cápsula interna) e <b>núcleos da base</b>, ilhas de cinzenta no interior.',
    cerebelo:'<b>Cerebelo</b>: córtex cinzento em <b>folhas</b>, com camadas molecular, de Purkinje e granular; a branca forma a “árvore da vida” no centro, com os núcleos cerebelares.'};
  const go=k=>{clear(s);
    if(k==='medula'){E('ellipse',{cx:300,cy:130,rx:150,ry:105,fill:W,stroke:'var(--muted)','stroke-width':2},s);
      E('path',{d:'M300,128 C268,128 250,92 222,52 C214,40 236,36 246,48 C266,74 282,100 300,104 C318,100 334,74 354,48 C364,36 386,40 378,52 C350,92 332,128 300,128 C332,128 360,160 378,206 C384,222 360,226 352,212 C336,180 318,156 300,154 C282,156 264,180 248,212 C240,226 216,222 222,206 C240,160 268,128 300,128 Z',fill:C},s);
      E('circle',{cx:300,cy:128,r:5,fill:'var(--panel)'},s);T(s,300,252,'Cinzenta: H central · branca: funículos por fora',{fs:18});}
    else if(k==='cerebro'){E('path',{d:'M110,200 C60,150 80,40 210,30 C260,25 340,25 390,30 C520,40 540,150 490,200 Z',fill:C},s);
      E('path',{d:'M140,190 C110,150 120,70 220,58 C270,54 330,54 380,58 C480,70 490,150 460,190 Z',fill:W},s);
      for(let i=0;i<7;i++)E('path',{d:`M${170+i*45},62 q10,30 0,50`,fill:'none',stroke:C,'stroke-width':10},s);
      E('ellipse',{cx:250,cy:150,rx:30,ry:20,fill:C},s);E('ellipse',{cx:350,cy:150,rx:30,ry:20,fill:C},s);T(s,300,232,'Córtex cinzento por fora · branca dentro · núcleos da base',{fs:17})}
    else{E('circle',{cx:300,cy:122,r:100,fill:C},s);const tr=(a,l)=>{const x=300+l*Math.cos(a),y=122+l*Math.sin(a);E('line',{x1:300,y1:150,x2:x,y2:y,stroke:W,'stroke-width':10,'stroke-linecap':'round'},s);
        [.35,.65].forEach(f=>{const bx=300+(x-300)*f,by=150+(y-150)*f;[a-.6,a+.6].forEach(b=>E('line',{x1:bx,y1:by,x2:bx+28*Math.cos(b),y2:by+28*Math.sin(b),stroke:W,'stroke-width':6,'stroke-linecap':'round'},s))})};
      [-2.6,-2.0,-1.57,-1.1,-.5].forEach(a=>tr(a,85));E('rect',{x:284,y:150,width:32,height:80,fill:W},s);T(s,300,250,'“Árvore da vida”: branca no centro do cerebelo',{fs:17})}
    out.innerHTML=D[k]};
  const g=$('#sbBtns');g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;press(g,b);go(b.dataset.o)});go('medula')})();

/* 6. Arco reflexo patelar */
stepper('rf',[
 ['Estímulo','O martelo percute o <b>ligamento patelar</b> e estira o músculo <b>quadríceps femoral</b>.'],
 ['Receptor e via aferente','O <b>fuso muscular</b> detecta o estiramento. O impulso sobe pela fibra sensitiva do <b>nervo femoral</b>; o corpo do neurônio fica no <b>gânglio espinhal</b> (pseudounipolar).'],
 ['Centro: medula espinhal','A fibra entra pela <b>raiz dorsal</b> nos segmentos <b>L4–L6</b> do cão e faz <b>sinapse direta</b> com o motoneurônio do <b>corno ventral</b>: reflexo <b>monossináptico</b>.'],
 ['Via eferente','O axônio do motoneurônio sai pela <b>raiz ventral</b> e volta pelo nervo femoral.'],
 ['Resposta','O quadríceps contrai e o <b>joelho se estende</b>. Ao mesmo tempo, um interneurônio inibe os flexores.'],
 ['Interpretação clínica','Reflexo <b>ausente ou diminuído</b>: lesão no nervo femoral ou nos segmentos L4–L6 (neurônio motor inferior). <b>Aumentado</b>: lesão cranial a L4 (neurônio motor superior), que perdeu a inibição vinda do encéfalo.']
],(s,i)=>{const on=k=>i>=k,ac=(k,c)=>i===k?'var(--eosin)':on(k)?c:'var(--line)';
  E('ellipse',{cx:470,cy:110,rx:80,ry:70,fill:'var(--panel)',stroke:'var(--muted)','stroke-width':2},s);
  E('path',{d:'M470,72 C452,72 446,92 438,106 C432,118 452,122 458,112 L470,100 L482,112 C488,122 508,118 502,106 C494,92 488,72 470,72 Z',fill:'#9A958F'},s);
  E('path',{d:'M470,110 C455,112 445,130 440,150 C436,162 456,166 460,154 L470,128 L480,154 C484,166 504,162 500,150 C495,130 485,112 470,110 Z',fill:'#9A958F'},s);
  T(s,470,200,'Medula (L4–L6)',{fs:17});
  E('path',{d:'M60,90 C120,70 180,80 210,120 C220,140 200,180 160,200 C110,220 70,200 60,170 Z',fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':3},s);T(s,130,145,'Quadríceps',{fs:17});
  E('line',{x1:60,y1:230,x2:200,y2:230,stroke:'var(--ink)','stroke-width':6,'stroke-linecap':'round'},s);E('line',{x1:200,y1:230,x2:200,y2:205,stroke:'var(--ink)','stroke-width':4},s);
  if(i===0||i===4){const h=E('g',{},s);E('rect',{x:206,y:238,width:60,height:14,rx:5,fill:'var(--amber)'},h);E('rect',{x:230,y:252,width:10,height:16,fill:'var(--amber)'},h)}
  E('path',{d:'M180,120 C260,60 330,40 400,70',fill:'none',stroke:ac(1,'var(--sky)'),'stroke-width':5},s);
  E('circle',{cx:350,cy:52,r:12,fill:ac(1,'var(--sky)')},s);T(s,350,30,'Gânglio espinhal',{fs:16});
  E('path',{d:'M400,70 C430,85 445,95 462,108',fill:'none',stroke:ac(2,'var(--sky)'),'stroke-width':5},s);
  E('circle',{cx:478,cy:142,r:9,fill:ac(2,'var(--hema)')},s);
  E('path',{d:'M478,142 C430,190 330,210 200,170',fill:'none',stroke:ac(3,'var(--hema)'),'stroke-width':5},s);
  if(i>=1&&i<=3&&!reduce){const dot=E('circle',{r:8,fill:'var(--amber)'},s);const path=i===1?'M180,120 C260,60 330,40 400,70':i===2?'M400,70 C430,85 445,95 462,108':'M478,142 C430,190 330,210 200,170';
    E('animateMotion',{dur:'1.4s',repeatCount:'indefinite',path},dot)}
  if(i>=4){E('path',{d:'M200,205 L250,160',stroke:'var(--ok)','stroke-width':6,'stroke-linecap':'round'},s);T(s,280,150,'Extensão',{fs:17,fill:'var(--ok)'})}
});

/* 7. Disposição das fibras */
(()=>{const s=$('#mfSvg');if(!s)return;const out=$('#mfOut');let anim=null;
  const D={fusi:['Fusiforme (fibras paralelas)','Fibras longas paralelas ao tendão: grande <b>amplitude</b> e velocidade, menos força. Ex.: bíceps braquial.'],
    uni:['Unipenado','Fibras oblíquas de um lado do tendão: mais fibras por área, mais <b>força</b>. Ex.: extensor digital lateral.'],
    bi:['Bipenado','Fibras oblíquas dos dois lados do tendão central, como uma pena. Ex.: reto femoral.'],
    multi:['Multipenado','Vários tendões internos e muitas fibras curtas: <b>força máxima</b>, pouca amplitude. Ex.: deltoide, masseter, músculos do aparelho de sustentação do equino.'],
    plano:['Plano (laminar)','Lâmina larga com aponeurose. Ex.: oblíquos do abdome, grande dorsal.'],
    circ:['Circular (esfíncter)','Fibras em anel que fecham um orifício. Ex.: orbicular do olho e da boca, esfíncter anal externo.']};
  const go=k=>{clear(s);const g=E('g',{},s),m=E('g',{},g);
    if(k==='circ'){E('ellipse',{cx:300,cy:115,rx:120,ry:80,fill:'none',stroke:'var(--eosin)','stroke-width':40},m);for(let r=0;r<4;r++)E('ellipse',{cx:300,cy:115,rx:104+r*10,ry:64+r*10,fill:'none',stroke:'#fff','stroke-width':1,opacity:.6},m);
      if(!reduce)m.animate([{transform:'scale(1)'},{transform:'scale(.8)'},{transform:'scale(1)'}],{duration:2200,iterations:Infinity,easing:'ease-in-out'});m.style.transformOrigin='300px 115px'}
    else if(k==='plano'){E('path',{d:'M90,40 L420,40 L520,190 L90,190 Z',fill:'var(--eosin)'},m);for(let i=0;i<12;i++)E('line',{x1:100+i*28,y1:44,x2:150+i*30,y2:186,stroke:'#fff','stroke-width':1.5,opacity:.6},m);E('rect',{x:420,y:40,width:110,height:150,fill:'var(--bone-2)',opacity:.7},s);T(s,475,120,'Aponeurose',{fs:16})}
    else{E('rect',{x:30,y:108,width:70,height:14,rx:6,fill:'var(--bone-2)'},s);E('rect',{x:500,y:108,width:70,height:14,rx:6,fill:'var(--bone-2)'},s);
      if(k==='fusi'){E('ellipse',{cx:300,cy:115,rx:205,ry:60,fill:'var(--eosin)'},m);for(let i=-4;i<=4;i++)E('line',{x1:110,y1:115+i*11,x2:490,y2:115+i*11,stroke:'#fff','stroke-width':1.5,opacity:.6},m)}
      else{const tendoes=k==='multi'?[85,115,145]:[115];E('path',{d:'M100,115 C150,30 450,30 500,115 C450,200 150,200 100,115 Z',fill:'var(--eosin)'},m);
        tendoes.forEach(y=>E('line',{x1:100,y1:y,x2:500,y2:y,stroke:'var(--bone-2)','stroke-width':6},m));
        for(let i=0;i<14;i++){const x=150+i*24;tendoes.forEach((y,j)=>{if(k!=='bi'&&k!=='multi'){E('line',{x1:x,y1:y,x2:x+22,y2:y-42,stroke:'#fff','stroke-width':1.6,opacity:.75},m)}else{E('line',{x1:x,y1:y,x2:x+18,y2:y-(k==='multi'?24:44),stroke:'#fff','stroke-width':1.6,opacity:.75},m);E('line',{x1:x,y1:y,x2:x+18,y2:y+(k==='multi'?24:44),stroke:'#fff','stroke-width':1.6,opacity:.75},m)}})}}
      if(!reduce){m.style.transformOrigin='300px 115px';m.animate([{transform:'scaleX(1)'},{transform:k==='fusi'?'scaleX(.72) scaleY(1.25)':'scaleX(.88) scaleY(1.1)'},{transform:'scaleX(1)'}],{duration:2200,iterations:Infinity,easing:'ease-in-out'})}}
    out.innerHTML=`<b>${D[k][0]}.</b> ${D[k][1]}`};
  const g=$('#mfBtns');g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;press(g,b);go(b.dataset.t)});go('fusi')})();

/* 8. Qual tecido muscular? */
(()=>{const s=$('#mtSvg');if(!s)return;const out=$('#mtOut');let cur=null,lock=false,sc=[0,0];
  const draw=t=>{clear(s);E('rect',{x:0,y:0,width:600,height:220,fill:'#F7E6EC'},s);
    if(t==='esq'){[30,95,160].forEach(y=>{E('rect',{x:10,y,width:580,height:55,rx:6,fill:'#D98AA6'},s);for(let x=16;x<590;x+=9)E('line',{x1:x,y1:y+2,x2:x,y2:y+53,stroke:'#B05679','stroke-width':3,opacity:.7},s);
      for(let x=60;x<580;x+=110)E('ellipse',{cx:x+(y%2)*30,cy:y+5,rx:16,ry:5,fill:'#5B2A86'},s)})}
    else if(t==='card'){const cells=[[20,40,170],[200,30,150],[360,45,200],[40,120,190],[240,110,160],[410,125,170]];
      cells.forEach(([x,y,w],i)=>{E('path',{d:`M${x},${y} h${w} v45 h-${w*.4} l-20,30 h-20 l10,-30 h-${w*.6-30} z`,fill:'#D98AA6'},s);for(let k=x+6;k<x+w;k+=9)E('line',{x1:k,y1:y+2,x2:k,y2:y+43,stroke:'#B05679','stroke-width':2.5,opacity:.6},s);
        E('ellipse',{cx:x+w/2,cy:y+22,rx:12,ry:7,fill:'#5B2A86'},s);E('line',{x1:x+w,y1:y,x2:x+w,y2:y+45,stroke:'#3B1A50','stroke-width':4},s)})}
    else{for(let r=0;r<4;r++)for(let c=0;c<6;c++){const x=20+c*98+(r%2)*45,y=25+r*48;E('path',{d:`M${x},${y+18} Q${x+45},${y-4} ${x+95},${y+18} Q${x+45},${y+40} ${x},${y+18} Z`,fill:'#E2A3BA'},s);E('ellipse',{cx:x+48,cy:y+18,rx:13,ry:4,fill:'#5B2A86'},s)}}};
  const nome={esq:'estriado esquelético',card:'estriado cardíaco',liso:'liso'};
  const exp={esq:'Estrias transversais e vários núcleos achatados na periferia de fibras longas e paralelas.',card:'Estrias, núcleo central, células ramificadas unidas por discos intercalares (linhas escuras).',liso:'Sem estrias; células fusiformes com um núcleo central alongado, encaixadas umas nas outras.'};
  const nova=()=>{let t;do{t=['esq','card','liso'][Math.floor(Math.random()*3)]}while(t===cur&&Math.random()<.7);cur=t;draw(t);out.innerHTML=`Que tecido é este? <span class="mono" style="color:var(--muted)">Placar ${sc[0]}/${sc[1]}</span>`;lock=false};
  $('#mtBtns').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||lock)return;lock=true;sc[1]++;const ok=b.dataset.r===cur;if(ok)sc[0]++;
    out.innerHTML=`${ok?'<b style="color:var(--ok)">Certo.</b>':'<b style="color:var(--bad)">Não.</b>'} É <b>${nome[cur]}</b>: ${exp[cur]} <span class="mono" style="color:var(--muted)">Placar ${sc[0]}/${sc[1]}</span>`;setTimeout(nova,2200)});
  $('#mtNew').addEventListener('click',nova);nova()})();

/* 9. Sarcômero */
(()=>{const s=$('#scSvg');if(!s)return;const rg=$('#scRange'),out=$('#scOut'),pl=$('#scPlay');let t=null;
  const draw=p=>{clear(s);const f=p/100,half=200-f*70,cx=300,zl=cx-half,zr=cx+half,my=40;
    E('rect',{x:cx-110,y:46,width:220,height:128,fill:'var(--eosin-soft)'},s);
    for(let r=0;r<4;r++){const y=62+r*32;E('line',{x1:cx-100,y1:y,x2:cx-12,y2:y,stroke:'var(--eosin)','stroke-width':7},s);E('line',{x1:cx+12,y1:y,x2:cx+100,y2:y,stroke:'var(--eosin)','stroke-width':7},s);
      for(let k=0;k<6;k++){[-1,1].forEach(sd=>{const x=cx+sd*(22+k*14);E('line',{x1:x,y1:y,x2:x+sd*7,y2:y-7,stroke:'var(--eosin)','stroke-width':2},s)})}}
    for(let r=0;r<5;r++){const y=46+r*32;E('line',{x1:zl,y1:y,x2:zl+150,y2:y,stroke:'var(--sky)','stroke-width':3},s);E('line',{x1:zr,y1:y,x2:zr-150,y2:y,stroke:'var(--sky)','stroke-width':3},s)}
    [zl,zr].forEach(x=>E('line',{x1:x,y1:36,x2:x,y2:184,stroke:'var(--ink)','stroke-width':5},s));E('line',{x1:cx,y1:46,x2:cx,y2:174,stroke:'var(--muted)','stroke-width':2,'stroke-dasharray':'4 4'},s);
    T(s,zl,26,'Z',{fs:18});T(s,zr,26,'Z',{fs:18});T(s,cx,26,'M',{fs:18,fill:'var(--muted)'});
    const H=Math.max(0,2*(cx-(zl+150)));const br=(x1,x2,y,l,c)=>{if(x2-x1<4)return;E('line',{x1,y1:y,x2,y2:y,stroke:c,'stroke-width':2},s);E('line',{x1,y1:y-6,x2:x1,y2:y+6,stroke:c,'stroke-width':2},s);E('line',{x1:x2,y1:y-6,x2:x2,y2:y+6,stroke:c,'stroke-width':2},s);T(s,(x1+x2)/2,y+22,l,{fs:16,fill:c})};
    br(cx-110,cx+110,196,'Banda A','var(--eosin)');br(zl,cx-110,196,'I','var(--sky)');br(cx+110,zr,196,'I','var(--sky)');if(H>8)br(cx-H/2,cx+H/2,12,'H','var(--muted)');
    out.innerHTML=`Comprimento do sarcômero: <b>${(2.6-f*0.9).toFixed(1)} µm</b>. Banda I: <b>${Math.round(cx-110-zl)>4?'encurtando':'quase desaparecida'}</b>; zona H: <b>${H>8?'presente':'desaparecida'}</b>; banda A: <b>constante</b>. Os filamentos não encurtam: eles <b>deslizam</b> uns sobre os outros.`};
  rg.addEventListener('input',()=>draw(+rg.value));
  pl.addEventListener('click',()=>{if(t){clearInterval(t);t=null;pl.textContent='▶ Animar';pl.setAttribute('aria-pressed','false');return}let v=+rg.value,d=2;pl.textContent='■ Parar';pl.setAttribute('aria-pressed','true');
    t=setInterval(()=>{v+=d;if(v>=100||v<=0)d=-d;rg.value=v;draw(v)},reduce?120:30)});draw(0)})();
})();
