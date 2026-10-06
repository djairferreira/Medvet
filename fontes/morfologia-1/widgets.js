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
})();
