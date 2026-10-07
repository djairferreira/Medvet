(function(){
'use strict';
const L=window.LIVRO;
const KEY=L.id+':';
const store={get(k,d){try{const v=localStorage.getItem(KEY+k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(KEY+k,JSON.stringify(v))}catch(e){}}};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const capName=id=>(L.caps.find(c=>c.id===id)||{}).nome||id;
window.LIVRO_UTIL={$,$$,shuffle,esc,store};

/* ---------- questão ---------- */
function renderQuestion(item,idx,onAnswer){
  const w=document.createElement('div'); w.className='q';
  const order=shuffle(item.o.map((t,i)=>({t,i})));
  w.innerHTML=`<p class="qt">${idx}. ${esc(item.q)}</p><div class="opts"></div><div class="exp" hidden></div>`;
  const opts=$('.opts',w), exp=$('.exp',w);
  order.forEach(({t,i})=>{const b=document.createElement('button');b.className='o';b.type='button';b.textContent=t;b.dataset.right=i===0?'1':'0';
    b.addEventListener('click',()=>{ if(w.dataset.done)return; w.dataset.done='1';
      const ok=i===0; b.classList.add(ok?'right':'wrong');
      $$('button.o',opts).forEach(x=>{x.disabled=true; if(x.dataset.right==='1')x.classList.add('right')});
      exp.hidden=false; exp.innerHTML=(ok?'<b>Certo.</b> ':'<b>Não.</b> Resposta: '+esc(item.o[0])+'. ')+esc(item.e);
      onAnswer&&onAnswer(ok);
    }); opts.appendChild(b)});
  return w;
}
/* sorteio sem repetição: cada questão só volta depois de todo o banco ter aparecido */
const qid=q=>{let h=0;const t=q.q;for(let i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))|0;return (h>>>0).toString(36)};
function draw(arr,n,key){const ids=new Set(arr.map(qid));let seen=store.get(key,[]).filter(x=>ids.has(x));const sset=new Set(seen);
  let pick=shuffle(arr.filter(q=>!sset.has(qid(q)))).slice(0,n);
  if(pick.length<n){const got=new Set(pick.map(qid));seen=[];pick=pick.concat(shuffle(arr.filter(q=>!got.has(qid(q)))).slice(0,n-pick.length))}
  seen=seen.concat(pick.map(qid));store.set(key,seen);return {pick,left:arr.length-new Set(seen).size}}
$$('.quiz[data-quiz]').forEach(box=>{
  const ch=box.dataset.quiz, n=+box.dataset.n||6;
  const all=L.Q.filter(x=>x.c===ch);
  const build=()=>{
    const {pick:pool,left}=draw(all,n,'vistas:'+ch);
    let right=0,done=0;
    box.innerHTML=`<div class="quiz-h"><h4>Teste o capítulo</h4><span class="score">0 / ${pool.length}</span></div><p class="quiz-info">Banco do capítulo: <b>${all.length}</b> questões · ${left>0?`<b>${left}</b> ainda não sorteadas nesta rodada`:'você viu todas; o próximo sorteio recomeça o ciclo'}</p>`;
    const sc=$('.score',box);
    pool.forEach((it,i)=>box.appendChild(renderQuestion(it,i+1,ok=>{done++;if(ok)right++;sc.textContent=`${right} / ${pool.length}`;
      if(done===pool.length){const r=document.createElement('div');r.style.marginTop='10px';r.innerHTML=`<button class="tbtn" type="button">Sortear outras questões</button>`;$('button',r).onclick=()=>{build();box.scrollIntoView({block:'start'})};box.appendChild(r)}})));
  };
  build();
});

/* ---------- simulado ---------- */
const simBtn=$('#simStart');
if(simBtn) simBtn.addEventListener('click',()=>{
  const box=$('#simBox'); const N=+simBtn.dataset.n||25;
  // sorteio equilibrado: ao menos 1 por capítulo antes de completar
  const ids=new Set(L.Q.map(qid));let seen=store.get('vistas:sim',[]).filter(x=>ids.has(x));if(L.Q.length-new Set(seen).size<N)seen=[];const sset=new Set(seen);
  const fresh=q=>!sset.has(qid(q));
  const byCap={}; L.Q.forEach(q=>{(byCap[q.c]=byCap[q.c]||[]).push(q)});
  let pool=[]; Object.values(byCap).forEach(arr=>{const f=arr.filter(fresh);pool.push(shuffle(f.length?f:arr)[0])});
  const rest=L.Q.filter(q=>!pool.includes(q)); pool=shuffle(pool.concat(shuffle(rest.filter(fresh)).concat(shuffle(rest.filter(q=>!fresh(q)))).slice(0,Math.max(0,N-pool.length)))).slice(0,N);
  store.set('vistas:sim',seen.concat(pool.map(qid)));
  box.innerHTML=''; const answers=new Array(pool.length).fill(null);
  const bar=document.createElement('div'); bar.className='sim-bar'; bar.innerHTML=`<span>Respondidas: <b class="mono" id="simCount">0 / ${pool.length}</b></span><button class="btn" type="button" id="simGo">Corrigir</button>`; box.appendChild(bar);
  const qs=document.createElement('div'); qs.className='quiz'; box.appendChild(qs);
  const upd=()=>{$('#simCount').textContent=`${answers.filter(a=>a!==null).length} / ${pool.length}`};
  pool.forEach((it,i)=>{
    const w=document.createElement('div'); w.className='q';
    w.innerHTML=`<p class="qt">${i+1}. ${esc(it.q)} <span class="chip">${esc(capName(it.c))}</span></p><div class="opts"></div><div class="exp" hidden></div>`;
    shuffle(it.o.map((t,k)=>({t,k}))).forEach(({t,k})=>{const b=document.createElement('button');b.type='button';b.className='o';b.textContent=t;b.dataset.k=k;
      b.onclick=()=>{if(w.dataset.locked)return;$$('button.o',w).forEach(x=>x.classList.remove('sel'));b.classList.add('sel');answers[i]=k;upd()};
      $('.opts',w).appendChild(b)});
    qs.appendChild(w);
  });
  $('#simGo').onclick=()=>{
    let right=0; const miss={};
    $$('.q',qs).forEach((w,i)=>{w.dataset.locked='1';const ok=answers[i]===0;if(ok)right++;else miss[pool[i].c]=(miss[pool[i].c]||0)+1;
      $$('button.o',w).forEach(b=>{b.disabled=true;b.classList.remove('sel');if(b.dataset.k==='0')b.classList.add('right');else if(+b.dataset.k===answers[i])b.classList.add('wrong')});
      const e=$('.exp',w);e.hidden=false;e.innerHTML=(ok?'<b>Certo.</b> ':(answers[i]===null?'<b>Em branco.</b> ':'<b>Errado.</b> ')+'Resposta: '+esc(pool[i].o[0])+'. ')+esc(pool[i].e)});
    const nota=right/pool.length*10, best=store.get('best',0); if(nota>best)store.set('best',nota);
    const hist=store.get('hist',[]); hist.push(+nota.toFixed(1)); store.set('hist',hist.slice(-10));
    const weak=Object.entries(miss).sort((a,b)=>b[1]-a[1]).map(([c,n])=>`<a href="#${c}">${esc(capName(c))}</a> (${n})`).join(', ');
    const r=document.createElement('div'); r.className='sim-result';
    r.innerHTML=`<div class="big">${nota.toFixed(1).replace('.',',')}</div><div><p><b>${right} de ${pool.length} acertos.</b> ${nota===10?'Nota máxima. Faça outro para confirmar que não foi sorte.':nota>=8?'Quase lá. Revise os capítulos abaixo e tente de novo.':'Volte aos capítulos com mais erros antes do próximo simulado.'}</p>${weak?`<p style="margin-top:6px">Revisar: ${weak}</p>`:''}<p class="mono" style="margin-top:6px;font-size:.8rem;color:var(--muted)">Últimas notas: ${hist.slice(-5).map(n=>String(n).replace('.',',')).join(' · ')} — melhor: ${Math.max(best,nota).toFixed(1).replace('.',',')}</p></div>`;
    bar.remove(); box.insertBefore(r,box.firstChild); r.scrollIntoView({behavior:'smooth',block:'start'});
  };
  box.scrollIntoView({behavior:'smooth',block:'start'});
});

/* ---------- flashcards ---------- */
const fc=$('#fc');
if(fc){
  const sel=$('#fcFilter');
  [...new Set(L.FC.map(x=>x[0]))].forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=capName(c);sel.appendChild(o)});
  let deck=[],pos=0;
  const show=()=>{fc.classList.remove('flip');if(!deck.length)return;const c=deck[pos];
    $('#fcTag').textContent=capName(c[0]);$('#fcQ').textContent=c[1];$('#fcA').textContent=c[2];$('#fcCount').textContent=`${pos+1} / ${deck.length}`};
  const load=()=>{const f=sel.value;deck=L.FC.filter(x=>f==='all'||x[0]===f);pos=0;show()};
  fc.addEventListener('click',()=>fc.classList.toggle('flip'));
  fc.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();fc.classList.toggle('flip')}});
  sel.addEventListener('change',load);
  $('#fcShuffle').addEventListener('click',()=>{deck=shuffle(deck);pos=0;show()});
  $('#fcRight').addEventListener('click',()=>{pos=(pos+1)%deck.length;show()});
  $('#fcPrev').addEventListener('click',()=>{pos=(pos-1+deck.length)%deck.length;show()});
  $('#fcWrong').addEventListener('click',()=>{const c=deck.splice(pos,1)[0];deck.push(c);if(pos>=deck.length)pos=0;show()});
  load();
}

/* ---------- legendas escondíveis ---------- */
$$('[data-legend]').forEach(b=>{const w=document.getElementById(b.dataset.legend); if(!w)return;
  b.addEventListener('click',()=>{const on=w.classList.toggle('hidden-legend');b.setAttribute('aria-pressed',on);b.textContent=on?'Mostrar legenda':'Esconder legenda e testar';$$('.legend li',w).forEach(li=>li.classList.remove('peek'))});
  $$('.legend li',w).forEach(li=>li.addEventListener('click',()=>li.classList.toggle('peek')));
});

/* ---------- identificação (numero → nome) ---------- */
$$('.match[data-match]').forEach(box=>{
  const d=L.MATCH[box.dataset.match]; if(!d)return;
  const names=d.items.map(x=>x[1]);
  box.innerHTML=`<div class="match-head"><div><span class="eyebrow">Identifique na peça</span><h4>${esc(d.title)}</h4></div></div>
  <div class="match-body"><figure class="fig dark"><img src="${d.img}" alt="${esc(d.title)}" loading="lazy"><figcaption>${esc(d.cap||'')}</figcaption></figure><div class="mrows"></div></div>
  <div class="match-foot"><button class="btn" type="button" data-a="check">Corrigir</button><button class="tbtn" type="button" data-a="show">Mostrar respostas</button><button class="tbtn" type="button" data-a="reset">Limpar</button><span class="score"></span></div>`;
  const rows=$('.mrows',box);
  d.items.forEach(([n,name])=>{const r=document.createElement('div');r.className='mr';r.dataset.ans=name;
    r.innerHTML=`<b>${esc(n)}</b><select aria-label="Estrutura ${esc(n)}"><option value="">— escolha —</option>${shuffle(names).map(x=>`<option>${esc(x)}</option>`).join('')}</select>`;rows.appendChild(r)});
  box.addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(!a)return;const act=a.dataset.a;let ok=0;
    $$('.mr',rows).forEach(r=>{const s=$('select',r);$('.fix',r)?.remove();r.classList.remove('ok','no');
      if(act==='reset'){s.value='';return}
      if(act==='show'){s.value=r.dataset.ans;r.classList.add('ok');return}
      if(s.value===r.dataset.ans){r.classList.add('ok');ok++}else{r.classList.add('no');const f=document.createElement('span');f.className='fix';f.textContent='→ '+r.dataset.ans;r.appendChild(f)}});
    $('.score',box).textContent=act==='check'?`${ok} de ${d.items.length} corretas`:'';
  });
});

/* ---------- montar a sequência ---------- */
$$('.order[data-order]').forEach(box=>{
  const d=L.ORDER[box.dataset.order]; if(!d)return;
  box.innerHTML=`<div class="match-head"><div><span class="eyebrow">Jogo</span><h4>${esc(d.title)}</h4></div><button class="tbtn" type="button" data-a="reset">Recomeçar</button></div><p style="margin:0;font-size:.94rem;color:var(--muted)">${esc(d.hint)}</p><div class="slots" aria-live="polite"></div><div class="pool"></div><p class="msg"></p>`;
  const slots=$('.slots',box),pool=$('.pool',box),msg=$('.msg',box);
  const start=()=>{slots.innerHTML='';pool.innerHTML='';msg.textContent='';msg.className='msg';
    shuffle(d.seq.map((t,i)=>({t,i}))).forEach(({t,i})=>{const b=document.createElement('button');b.type='button';b.className='pc';b.textContent=t;b.dataset.i=i;
      b.onclick=()=>{const next=slots.children.length;if(+b.dataset.i===next){slots.appendChild(b);b.onclick=null;
          if(slots.children.length===d.seq.length){msg.textContent='Sequência completa. '+(d.win||'');msg.className='msg win'}}
        else{b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');msg.textContent='Ainda não. Qual vem logo depois de '+(next?d.seq[next-1]:'o tronco')+'?'}};
      pool.appendChild(b)})};
  $('[data-a=reset]',box).onclick=start; start();
});

/* ---------- fim de capítulo: marcar como estudado sem voltar ao topo ---------- */
(()=>{const chs=$$('section.chapter').filter(s=>s.querySelector('.ch-head .done-btn'));
  chs.forEach((s,i)=>{const id=s.querySelector('.ch-head .done-btn').dataset.done;const col=s.querySelector('.col')||s;
    const nx=chs[i+1];const nt=nx?(nx.querySelector('.ch-head h2')||{}).textContent:'';
    const f=document.createElement('div');f.className='ch-end';
    f.innerHTML=`<div class="ch-end-txt"><b>Fim do capítulo.</b><span>Terminou de estudar? Marque aqui sem precisar voltar ao topo.</span></div>
      <div class="ch-end-acts"><button class="done-btn" type="button" data-done="${id}" aria-pressed="false">Marcar como estudado</button>${nx?`<a class="next-ch" href="#${nx.id}">Próximo: ${esc(nt)} →</a>`:''}</div>`;
    col.appendChild(f)})})();

/* ---------- progresso ---------- */
const caps=L.caps.filter(c=>c.track!==false).map(c=>c.id);
let done=store.get('done',{});
const ring=$('#ring');
function paint(){const n=caps.filter(c=>done[c]).length;
  $('#progTxt')&&($('#progTxt').textContent=`${n} de ${caps.length}`);
  $('#topProg')&&($('#topProg').textContent=Math.round(n/caps.length*100)+'%');
  ring&&ring.setAttribute('stroke-dashoffset',(119.4*(1-n/caps.length)).toFixed(1));
  $$('.done-btn').forEach(b=>{const on=!!done[b.dataset.done];b.setAttribute('aria-pressed',on);b.textContent=on?'✓ Estudado':'Marcar como estudado'});
  $$('.toc .chk[data-c]').forEach(s=>s.textContent=done[s.dataset.c]?'✓':'')}
$$('.done-btn').forEach(b=>b.addEventListener('click',()=>{done[b.dataset.done]=!done[b.dataset.done];store.set('done',done);paint()}));
paint();
let st=store.get('st',{});
const stTotal=$$('.station input').length;
const stPaint=()=>{const c=$('#stCount');if(c)c.textContent=`${Object.values(st).filter(Boolean).length} de ${stTotal}`};
$$('.station input').forEach(i=>{i.checked=!!st[i.dataset.k];i.addEventListener('change',()=>{st[i.dataset.k]=i.checked;store.set('st',st);stPaint()})});
stPaint();


/* ---------- tema claro / escuro ---------- */
(()=>{const H=document.documentElement,dk=matchMedia('(prefers-color-scheme: dark)');
  const cur=()=>H.dataset.theme||(dk.matches?'dark':'light');
  const ico={dark:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',light:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>'};
  const meta=document.querySelector('meta[name="theme-color"]');
  const btns=[];const paint=()=>{const t=cur();btns.forEach(b=>{b.innerHTML=t==='dark'?ico.light:ico.dark;b.setAttribute('aria-label',t==='dark'?'Usar tema claro':'Usar tema escuro');b.title=b.getAttribute('aria-label')});
    if(meta)meta.setAttribute('content',t==='dark'?'#0F1914':'#FFFFFF')};
  const mk=cls=>{const b=document.createElement('button');b.type='button';b.className='icon-btn theme-btn '+cls;b.addEventListener('click',()=>{const t=cur()==='dark'?'light':'dark';H.dataset.theme=t;try{localStorage.setItem('vdf-tema',t)}catch(_){}paint()});btns.push(b);return b};
  const tp=$('.topbar .tb-prog');if(tp){const w=document.createElement('span');w.className='tb-right';tp.replaceWith(w);w.append(tp,mk('tb-theme'))}
  const sh=$('.side-head');if(sh){const cl=$('.side-head .close');const w=document.createElement('div');w.className='side-acts';sh.insertBefore(w,cl);w.append(mk('side-theme'));if(cl)w.append(cl)}
  dk.addEventListener?.('change',paint);paint()})();

/* ---------- índice e gaveta ---------- */
const side=$('#side'),scrim=$('#scrim'),mb=$('#menuBtn'),cb=$('#closeBtn');
const mq=matchMedia('(max-width:960px)');
/* trava a página por trás da gaveta (no iOS overflow:hidden não basta) */
let lockY=0;
const lockBody=()=>{lockY=scrollY;const b=document.body.style;document.body.classList.add('lock');b.position='fixed';b.top=-lockY+'px';b.left='0';b.right='0';b.width='100%'};
const unlockBody=()=>{if(!document.body.classList.contains('lock'))return;const b=document.body.style;document.body.classList.remove('lock');b.position=b.top=b.left=b.right=b.width='';
  const h=document.documentElement,sb=h.style.scrollBehavior;h.style.scrollBehavior='auto';scrollTo(0,lockY);h.style.scrollBehavior=sb};
/* rola só o índice (nunca a página) até o capítulo atual */
let tocBusy=0;
const tocTo=(a,center,smooth)=>{if(!a)return;const sr=side.getBoundingClientRect(),r=a.getBoundingClientRect();
  if(!center&&r.top>=sr.top+60&&r.bottom<=sr.bottom-60)return;
  side.scrollTo({top:side.scrollTop+r.top-sr.top-(center?sr.height/2-r.height/2:80),behavior:smooth?'smooth':'auto'})};
['wheel','touchstart','pointerdown','scroll'].forEach(ev=>side.addEventListener(ev,()=>{tocBusy=Date.now()},{passive:true}));
function openNav(){lockBody();side.classList.add('open');scrim.classList.add('on');mb.setAttribute('aria-expanded','true');side.removeAttribute('aria-hidden');
  requestAnimationFrame(()=>tocTo($('.toc a.on'),true,false));setTimeout(()=>cb.focus({preventScroll:true}),50)}
function closeNav(focus){side.classList.remove('open');scrim.classList.remove('on');unlockBody();mb.setAttribute('aria-expanded','false');if(mq.matches)side.setAttribute('aria-hidden','true');if(focus)mb.focus({preventScroll:true})}
mb.addEventListener('click',()=>side.classList.contains('open')?closeNav(true):openNav());
cb.addEventListener('click',()=>closeNav(true));
scrim.addEventListener('click',()=>closeNav(true));
scrim.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&side.classList.contains('open'))closeNav(true)});
$$('.toc a').forEach(a=>a.addEventListener('click',e=>{if(!mq.matches)return;e.preventDefault();closeNav(false);
  const t=document.querySelector(a.getAttribute('href'));if(!t)return;
  const jump=()=>t.scrollIntoView({behavior:'instant',block:'start'});
  requestAnimationFrame(()=>{jump();setTimeout(jump,350);setTimeout(jump,900);try{history.replaceState(null,'',a.getAttribute('href'))}catch(_){}})}));
let tx=null;side.addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
side.addEventListener('touchend',e=>{if(tx!==null&&e.changedTouches[0].clientX-tx<-60)closeNav(false);tx=null},{passive:true});
const syncMq=()=>{if(mq.matches){if(!side.classList.contains('open'))side.setAttribute('aria-hidden','true')}else{side.removeAttribute('aria-hidden');closeNav(false)}};
mq.addEventListener?mq.addEventListener('change',syncMq):mq.addListener(syncMq); syncMq();

const links=$$('.toc a'); const secs=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
let curSec=null;
const spy=()=>{const lim=innerHeight*.35;let cur=secs[0];for(const x of secs){if(x.getBoundingClientRect().top<=lim)cur=x;else break}
  if(cur===curSec)return;curSec=cur;links.forEach(a=>{const on=a.getAttribute('href')==='#'+cur.id;a.classList.toggle('on',on);
    if(on){a.setAttribute('aria-current','location');if(!mq.matches&&Date.now()-tocBusy>2500)tocTo(a,false,true)}else a.removeAttribute('aria-current')})};
const io=new IntersectionObserver(spy,{rootMargin:'-30% 0px -65% 0px'});
secs.forEach(s=>io.observe(s));

/* ---------- barra de leitura e topo ---------- */
const rb=$('#readbar i'),tt=$('#toTop');let tick=false;
let lastY=0,hideT=null;
const onScroll=()=>{const h=document.documentElement;const y=h.scrollTop;const p=y/Math.max(1,h.scrollHeight-h.clientHeight);rb.style.transform=`scaleX(${Math.min(1,p)})`;
  const up=y<lastY-4;lastY=y;
  if(y>900&&up){tt.classList.add('on');clearTimeout(hideT);hideT=setTimeout(()=>tt.classList.remove('on'),1800)}
  else if(!up||y<=900){if(y<=900)tt.classList.remove('on')}
  tick=false};
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(()=>{onScroll();spy()})}},{passive:true}); onScroll();
tt.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

/* ---------- números da capa ---------- */
$$('[data-count]').forEach(el=>{const to=+el.dataset.count;const t0=performance.now();el.textContent=to;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const step=t=>{const k=Math.min(1,(t-t0)/1200);el.textContent=Math.round(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step)});

/* ---------- tabelas viram cartões no celular ---------- */
$$('.tbl table').forEach(t=>{if(t.querySelector('[rowspan],[colspan]'))return;const hs=$$('thead th',t).map(th=>th.textContent.trim());if(hs.length<3)return;
  t.classList.add('stack');$$('tbody tr',t).forEach(tr=>$$('td',tr).forEach((td,i)=>td.setAttribute('data-label',hs[i]||'')))});

/* ---------- Instagram da Vet do Futuro ---------- */
const IG_URL='https://www.instagram.com/vetdofuturoo/';
function openIG(src){
  const d=document.createElement('div');d.className='igdlg';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-labelledby','igT');
  d.innerHTML=`<div class="box"><img alt="Logo Vet do Futuro"><h3 id="igT">Vet do Futuro</h3><span class="handle">@vetdofuturoo</span><p>Este resumo foi criado pela Vet do Futuro. Siga no Instagram para receber os próximos livros, dicas de prova e novidades.</p><div class="acts"><a href="${IG_URL}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>Abrir o Instagram</a><button type="button">Continuar estudando</button></div></div>`;
  $('img',d).src=src||($('.brand-mark')||{}).src||'';
  const close=()=>{d.remove();document.body.classList.remove('lock');document.removeEventListener('keydown',k)};
  const k=e=>{if(e.key==='Escape')close()};
  d.addEventListener('click',e=>{if(e.target===d||e.target.closest('.acts button'))close();if(e.target.closest('.acts a'))setTimeout(close,300)});
  document.addEventListener('keydown',k);document.body.appendChild(d);document.body.classList.add('lock');$('.acts a',d).focus();
}
$$('[data-ig]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();if(side.classList.contains('open'))closeNav(false);openIG(document.querySelector('.book-foot img')?.src)}));

/* ---------- lightbox ---------- */
let lastFocus=null;
document.addEventListener('click',e=>{const img=e.target.closest('.fig img, .cover-img img');if(!img)return;
  lastFocus=img;const cap=img.closest('figure')?.querySelector('figcaption')?.textContent||img.alt;
  const lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');
  lb.innerHTML=`<button class="icon-btn" type="button" aria-label="Fechar imagem"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button><img alt=""><p></p>`;
  $('img',lb).src=img.currentSrc||img.src;$('img',lb).alt=img.alt;$('p',lb).textContent=cap;
  const close=()=>{lb.remove();document.body.classList.remove('lock');document.removeEventListener('keydown',k);lastFocus&&lastFocus.focus?.()};
  const k=ev=>{if(ev.key==='Escape')close()};
  lb.addEventListener('click',ev=>{if(ev.target===lb||ev.target.closest('.icon-btn'))close()});
  document.addEventListener('keydown',k);document.body.appendChild(lb);document.body.classList.add('lock');$('.icon-btn',lb).focus();
});
})();
