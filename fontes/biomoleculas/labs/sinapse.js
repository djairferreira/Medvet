const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;

/* ============ Neurônio pós-sináptico: PEPS, PIPS e somação ============ */
(()=>{const s=$('#sinSvg');if(!s)return;
  const out=$('#sinOut');
  const REST=-70,THR=-55,TW=300,SPEED=12; // janela de 300 ms; 12 ms reais por ms simulado
  let ev=[],drug='nada',t0=0,anim=null,running=false,scen=null;
  const X=t=>62+t/TW*522,Y=v=>v>-40?178-(v+40)*0.4:178+(-40-v)/40*160; // −80…−40 detalhado
  const term={E1:[92,40],E2:[92,104],E3:[180,22],I:[236,128]};
  const par=k=>{let a=k==='I'?-5:6,tau=k==='I'?14:9;
    if(k==='I'&&drug==='bzd'){a*=2;tau*=1.5}
    if(k==='I'&&drug==='estr')a=0;
    if(k!=='I'&&drug==='ket')a*=0.6;return [a,tau]};
  const alpha=(t,tau)=>t<=0?0:(t/tau)*Math.exp(1-t/tau);
  function trace(tEnd){const pts=[],sp=[];let refr=-1;
    for(let t=0;t<=tEnd;t+=0.5){let v=REST;for(const e of ev){const [a,tau]=par(e.k);v+=a*alpha(t-e.t,tau)}
      if(t<refr){const f=(refr-t)/6;v=Math.min(v,REST-8*f);pts.push([t,v]);continue}
      if(v>=THR){sp.push(t);pts.push([t,THR],[t+0.3,30],[t+1.2,-75]);refr=t+6;continue}
      pts.push([t,v])}
    return {pts,sp}}
  function neuron(tc){
    // soma, dendritos, axônio
    E('path',{d:'M300 70 C250 40 200 45 120 40 M300 70 C240 95 190 100 120 104 M300 70 C260 40 220 30 196 22',fill:'none',stroke:'var(--sky)','stroke-width':7,'stroke-linecap':'round'},s);
    E('line',{x1:330,y1:70,x2:585,y2:70,stroke:'var(--sky)','stroke-width':7,'stroke-linecap':'round'},s);
    E('circle',{cx:300,cy:70,r:36,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':4},s);
    E('path',{d:'M334 58 L356 66 L356 74 L334 82 Z',fill:'var(--amber)'},s);
    T(s,384,56,'cone de implantação',{fs:18,a:'start',w:500,fill:'var(--muted)'});
    const spk=lastSpikes.some(t=>tc-t>=0&&tc-t<25);
    if(spk)E('circle',{cx:Math.min(585,356+(tc-lastSpikes.find(t=>tc-t>=0&&tc-t<25))*9),cy:70,r:9,fill:'var(--hema)'},s);
    for(const k in term){const [x,y]=term[k];const hot=ev.some(e=>tc-e.t>=0&&tc-e.t<12&&e.k===k);
      const col=k==='I'?'var(--bad)':'var(--ok)';
      E('circle',{cx:x,cy:y,r:hot?17:13,fill:hot?col:'var(--panel)',stroke:col,'stroke-width':3},s);
      T(s,x+(k==='I'?-30:-34),y+6,k,{fs:18,fill:col,a:'middle'})}
  }
  let lastSpikes=[];
  function frame(tc){clear(s);
    const r=trace(tc);lastSpikes=r.sp;neuron(tc);
    // eixos
    for(const v of [-40,-55,-70]){
      if(v===-55){E('line',{x1:62,y1:Y(v),x2:584,y2:Y(v),stroke:'var(--amber)','stroke-width':1.5,'stroke-dasharray':'6 5'},s);T(s,584,Y(v)-6,'limiar −55',{fs:18,a:'end',fill:'var(--amber)'});continue}
      E('line',{x1:62,y1:Y(v),x2:584,y2:Y(v),stroke:'var(--line)','stroke-width':1},s);
      T(s,56,Y(v)+6,'−'+Math.abs(v),{fs:18,a:'end',w:500,fill:'var(--muted)'})}
    T(s,584,352,TW+' ms',{fs:18,a:'end',w:500,fill:'var(--muted)'});T(s,62,352,'0',{fs:18,a:'start',w:500,fill:'var(--muted)'});
    for(const e of ev)E('line',{x1:X(e.t),y1:336,x2:X(e.t),y2:328,stroke:e.k==='I'?'var(--bad)':'var(--ok)','stroke-width':3},s);
    const d=r.pts.map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(Math.min(40,p[1])).toFixed(1)).join(' ');
    E('path',{d,fill:'none',stroke:'var(--hema)','stroke-width':3,'stroke-linejoin':'round'},s);
    if(running&&!reduce)E('line',{x1:X(tc),y1:150,x2:X(tc),y2:340,stroke:'var(--muted)','stroke-width':1,'stroke-dasharray':'3 4'},s);
    return r}
  const desc={um:'<b>Um PEPS isolado</b> despolariza só alguns mV e some em cerca de 30 ms. Sozinho, não chega ao limiar.',
    temp:'<b>Somação temporal.</b> A mesma sinapse (E1) disparou 4 vezes com intervalo de 5 ms; cada PEPS chegou antes de o anterior acabar e eles se empilharam.',
    lento:'<b>Mesmos 4 disparos, intervalo de 45 ms.</b> Cada PEPS desaparece antes do próximo: não há somação e o limiar não é atingido. A frequência importa.',
    esp:'<b>Somação espacial.</b> E1, E2 e E3 dispararam juntas; as correntes de três locais se somaram no cone de implantação.',
    ei:'<b>PEPS + PIPS.</b> As três excitatórias dispararam junto com a inibitória I: o PIPS é subtraído e a soma pode ficar abaixo do limiar.'};
  const drugTxt={nada:'',bzd:' <b>Diazepam</b> aumenta a corrente de Cl⁻ do GABA-A: o PIPS fica maior e mais longo. Sem GABA liberado (sem disparo de I), o diazepam quase não faz nada.',
    estr:' <b>Estricnina</b> bloqueia o receptor de glicina: o PIPS desaparece e os PEPS passam sem freio, como na intoxicação do cão.',
    ket:' <b>Cetamina</b> bloqueia o componente NMDA da resposta ao glutamato: os PEPS ficam menores e a somação fica mais difícil.'};
  function report(r){const vmax=Math.max(...r.pts.map(p=>p[1]));
    const head=scen?desc[scen]:'<b>Modo livre.</b> Toque em E1, E2, E3 ou I. Toques rápidos na mesma sinapse fazem somação temporal; sinapses diferentes ao mesmo tempo, somação espacial.';
    const res=r.sp.length?`<br><b style="color:var(--hema)">Disparou ${r.sp.length} potencial${r.sp.length>1?'is':''} de ação.</b>`:ev.length?`<br>Máximo atingido: ${vmax.toFixed(0).replace('-','−')} mV. <b>Sem potencial de ação.</b>`:'';
    out.innerHTML=head+drugTxt[drug]+res}
  function start(){cancelAnimationFrame(anim);t0=performance.now();running=true;
    if(reduce){running=false;report(frame(TW));return}
    const fr=now=>{const tc=Math.max(0,Math.min(TW,(now-t0)/SPEED));const r=frame(tc);
      if(tc<TW)anim=requestAnimationFrame(fr);else{running=false;report(frame(TW))}};
    anim=requestAnimationFrame(fr)}
  const nowT=()=>running?Math.max(0,Math.min(TW,(performance.now()-t0)/SPEED)):null;
  const g=$('#sinFire');if(g)g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(scen){ev=[];scen=null;press($('#sinPre'),null)}
    let t=nowT();
    if(t==null||t>TW-40){ // nova varredura
      if(reduce){const last=ev.length?ev[ev.length-1].t:30;t=ev.length?Math.min(TW-30,last+4):30;ev.push({t,k:b.dataset.k});report(frame(TW));return}
      ev=[{t:20,k:b.dataset.k}];start();return}
    ev.push({t:Math.max(t,1),k:b.dataset.k});report(frame(t))});
  const P={um:[[40,'E1']],temp:[[40,'E1'],[45,'E1'],[50,'E1'],[55,'E1']],lento:[[30,'E1'],[75,'E1'],[120,'E1'],[165,'E1']],
    esp:[[40,'E1'],[40,'E2'],[40,'E3']],ei:[[40,'E1'],[40,'E2'],[40,'E3'],[37,'I']]};
  const pre=$('#sinPre');if(pre)pre.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;press(pre,b);scen=b.dataset.k;
    ev=P[scen].map(([t,k])=>({t,k}));start()});
  choices('#sinDrug',k=>{drug=k;if(!running){if(ev.length)report(frame(TW));else{frame(0);report({pts:[[0,REST]],sp:[]})}}});
  const c=$('#sinClr');if(c)c.addEventListener('click',()=>{cancelAnimationFrame(anim);running=false;ev=[];scen=null;press($('#sinPre'),null);frame(0);report({pts:[[0,REST]],sp:[]})});
})();
