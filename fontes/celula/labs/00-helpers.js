/* Utilitários compartilhados pelos laboratórios do livro (window.BIO). */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,NS='http://www.w3.org/2000/svg';
const press=(g,b)=>$$('button',g).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
/* cria elemento SVG; fill/stroke/opacity vão para style para aceitar var(--x) */
function E(tag,a,p){const e=document.createElementNS(NS,tag);let st='';for(const k in a||{}){const v=a[k];if(v==null)continue;
  if(['fill','stroke','opacity','stroke-width','stroke-dasharray'].includes(k))st+=k+':'+v+';';else if(k==='text')e.textContent=v;else e.setAttribute(k,v)}
  if(st)e.setAttribute('style',st+(a&&a.style?a.style:''));if(p)p.appendChild(e);return e}
const T=(p,x,y,s,o={})=>E('text',Object.assign({x,y,'font-size':o.fs||20,'text-anchor':o.a||'middle','font-weight':o.w||600,fill:o.fill||'var(--ink)',text:s},o.extra||{}),p);
const clear=s=>{while(s.firstChild)s.removeChild(s.firstChild)};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
/* stepper: botões #<pre>Prev/#<pre>Next, svg #<pre>Svg, saída #<pre>Out; steps=[[título, html], ...]; draw(svg, i) */
function stepper(pre,steps,draw){const svg=$('#'+pre+'Svg');if(!svg)return;const out=$('#'+pre+'Out'),prev=$('#'+pre+'Prev'),next=$('#'+pre+'Next');let i=0;
  const go=n=>{i=Math.max(0,Math.min(steps.length-1,n));clear(svg);draw(svg,i);const s=steps[i];out.innerHTML=`<span class="mono" style="color:var(--muted)">${i+1} de ${steps.length}</span> · <b>${s[0]}</b><br>${s[1]}`;
    prev.disabled=i===0;next.textContent=i===steps.length-1?'Recomeçar ↺':'Próxima etapa →'};
  prev.addEventListener('click',()=>go(i-1));next.addEventListener('click',()=>go(i===steps.length-1?0:i+1));go(0)}
/* grupo de botões com data-k: chama fn(valor) ao clicar e marca aria-pressed */
function choices(groupSel,fn){const g=$(groupSel);if(!g)return;g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;press(g,b);fn(b.dataset.k,b)});const first=g.querySelector('button[aria-pressed="true"]')||g.querySelector('button');if(first){press(g,first);fn(first.dataset.k,first)}}
window.BIO={$,$$,reduce,press,E,T,clear,shuffle,stepper,choices};
