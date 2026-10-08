const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;
const fmt=(v,d=1)=>(v<0?'−':'')+Math.abs(v).toFixed(d).replace('.',',');
const sg=(v,d=0)=>(v>0?'+':'')+fmt(v,d);

/* ============ 1. Calculadora de Nernst e Goldman ============ */
(()=>{const s=$('#gokSvg');if(!s)return;
  const out=$('#gokOut'),Ko=$('#gokKo'),Nai=$('#gokNai'),P=$('#gokP');
  const Ki=140,Nao=145,Clo=110,Cli=10,PCl=0.45;
  const X=v=>40+(v+110)/(200)*520; // −110 … +90 mV
  const presets={normal:[4,12,0.04],hiper:[9,14,0.04],hipo:[2.2,12,0.04],isq:[10,45,0.04],pico:[4,12,20]};
  const draw=()=>{clear(s);
    const ko=+Ko.value,nai=+Nai.value,p=+P.value;
    $('#gokKoV').textContent=fmt(ko,1);$('#gokNaiV').textContent=nai;$('#gokPV').textContent=fmt(p,2);
    const EK=61.5*Math.log10(ko/Ki),ENa=61.5*Math.log10(Nao/nai);
    const Vm=61.5*Math.log10((ko+p*Nao+PCl*Cli)/(Ki+p*nai+PCl*Clo));
    // faixa de despolarização e de hiperpolarização
    E('rect',{x:X(-55),y:132,width:X(90)-X(-55),height:36,rx:6,fill:'var(--amber-soft)'},s);
    E('line',{x1:X(-110),y1:150,x2:X(90),y2:150,stroke:'var(--ink)','stroke-width':2},s);
    for(let v=-100;v<=80;v+=20){E('line',{x1:X(v),y1:142,x2:X(v),y2:158,stroke:'var(--muted)','stroke-width':1.5},s);
      if(v%40===-20||v===-100||v===60)T(s,X(v),186,(v>0?'+':v<0?'−':'')+Math.abs(v),{fs:18,w:500,fill:'var(--muted)'})}
    T(s,X(-55),40,'limiar',{fs:18,fill:'var(--amber)'});
    E('line',{x1:X(-55),y1:46,x2:X(-55),y2:150,stroke:'var(--amber)','stroke-width':2,'stroke-dasharray':'5 5'},s);
    const mk=(v,col,lab,yl)=>{const x=Math.max(X(-110),Math.min(X(90),X(v)));
      E('path',{d:`M${x} 146 l-9 -18 h18 z`,fill:col},s);E('line',{x1:x,y1:yl+6,x2:x,y2:128,stroke:col,'stroke-width':2},s);
      T(s,x,yl,lab,{fs:18,fill:col})};
    mk(EK,'var(--sky)','E K⁺ '+sg(EK),96);
    mk(ENa,'var(--eosin)','E Na⁺ '+sg(ENa),70);
    const xv=X(Vm);E('path',{d:`M${xv} 154 l-14 28 h28 z`,fill:'var(--hema)'},s);
    T(s,Math.max(90,Math.min(510,xv)),236,'Vm = '+sg(Vm)+' mV',{fs:26,w:800,fill:'var(--hema)'});
    T(s,300,280,'mV · lado de fora = 0',{fs:18,w:500,fill:'var(--muted)'});
    const dist=-55-Vm;
    let msg;
    if(p>1)msg='Com a permeabilidade ao Na⁺ muito maior que a ao K⁺ (como no <b>pico do potencial de ação</b>), o V<sub>m</sub> corre para perto do E<sub>Na</sub>. A membrana segue sempre o íon a que é mais permeável.';
    else if(Vm>-55)msg='O V<sub>m</sub> passou do limiar e ficou ali: despolarização <b>sustentada</b>. Os canais de Na⁺ se inativam (comporta <i>h</i> fechada) e a célula fica <b>inexcitável</b>, como no miocárdio do gato muito hipercalêmico ou no neurônio sem ATP.';
    else if(ko>5.5)msg='K⁺ extracelular alto reduz o gradiente de K⁺: o E<sub>K</sub> e o V<sub>m</sub> ficam <b>menos negativos</b>. A membrana se aproxima do limiar (só '+fmt(dist,0)+' mV de distância), mas a despolarização lenta inativa canais de Na⁺: no coração, condução lenta, bradicardia, onda T apiculada.';
    else if(ko<3.5)msg='K⁺ extracelular baixo aumenta o gradiente: o V<sub>m</sub> <b>hiperpolariza</b> e fica a '+fmt(dist,0)+' mV do limiar. Fica mais difícil disparar: fraqueza muscular (polimiopatia hipocalêmica do gato, vaca caída anoréxica).';
    else msg='Situação normal: P<sub>K</sub> domina, então o V<sub>m</sub> fica perto do E<sub>K</sub>, mas puxado um pouco para cima pelo pequeno vazamento de Na⁺. Distância até o limiar: cerca de '+fmt(dist,0)+' mV.';
    out.innerHTML=msg+`<div class="potencial-kv"><span>E<sub>K</sub> <b>${sg(EK)} mV</b></span><span>E<sub>Na</sub> <b>${sg(ENa)} mV</b></span><span>V<sub>m</sub> <b>${sg(Vm)} mV</b></span><span>Força sobre Na⁺ <b>${fmt(Vm-ENa,0)} mV</b></span></div>`};
  [Ko,Nai,P].forEach(i=>i.addEventListener('input',()=>{press($('#gokBtns'),null);draw()}));
  choices('#gokBtns',k=>{const v=presets[k];if(!v)return;Ko.value=v[0];Nai.value=v[1];P.value=v[2];draw()});
  const g=$('#gokBtns');if(g&&!g.querySelector('[data-k="pico"]')){const b=document.createElement('button');b.className='tbtn';b.type='button';b.dataset.k='pico';b.setAttribute('aria-pressed','false');b.textContent='Pico do potencial de ação';g.appendChild(b)}
})();

/* ============ 2. Simulador do potencial de ação (Hodgkin-Huxley) ============ */
(()=>{const s=$('#paSvg');if(!s)return;
  const out=$('#paOut'),inI=$('#paI'),inK=$('#paK'),inB=$('#paB'),inD=$('#paD'),go=$('#paGo');
  const TMAX=20,dt=0.005,PW=0.5,phi=3,T0=2;
  const am=V=>{const x=V+40;return Math.abs(x)<1e-6?1:0.1*x/(1-Math.exp(-x/10))},bm=V=>4*Math.exp(-(V+65)/18),
    ah=V=>0.07*Math.exp(-(V+65)/20),bh=V=>1/(1+Math.exp(-(V+35)/10)),
    an=V=>{const x=V+55;return Math.abs(x)<1e-6?0.1:0.01*x/(1-Math.exp(-x/10))},bn=V=>0.125*Math.exp(-(V+65)/80);
  function sim(I,Ko,blk,d2){
    const gNa=120*(1-blk),gK=36,gL=0.3,ENa=50,EK=-77+26.7*Math.log(Ko/4),EL=-54.4+13.35*Math.log(Ko/4);
    let V=-65,m=am(V)/(am(V)+bm(V)),h=ah(V)/(ah(V)+bh(V)),n=an(V)/(an(V)+bn(V));
    const step=Ie=>{const INa=gNa*m*m*m*h*(V-ENa),IK=gK*n**4*(V-EK),IL=gL*(V-EL);V+=dt*(Ie-INa-IK-IL);
      m+=phi*dt*(am(V)*(1-m)-bm(V)*m);h+=phi*dt*(ah(V)*(1-h)-bh(V)*h);n+=phi*dt*(an(V)*(1-n)-bn(V)*n);
      if(V>80)V=80;if(V<-120)V=-120};
    for(let t=0;t<200;t+=dt)step(0);
    const r=[];const every=4;let k=0;
    for(let t=0;t<TMAX;t+=dt){const on=(t>=T0&&t<T0+PW)||(d2>0&&t>=T0+d2&&t<T0+d2+PW);step(on?I:0);
      if(k++%every===0)r.push({t,V,m,h,n,on})}
    return {r,EK};
  }
  const X=t=>66+t/TMAX*520,Y=v=>12+(60-v)/160*196; // +60 … −100 mV
  let data=null,anim=null,cur=0;
  const layer={};
  function base(){clear(s);
    for(const v of [40,0,-40,-80]){E('line',{x1:66,y1:Y(v),x2:586,y2:Y(v),stroke:'var(--line)','stroke-width':1},s);
      T(s,58,Y(v)+6,(v>0?'+':v<0?'−':'')+Math.abs(v),{fs:18,a:'end',w:500,fill:'var(--muted)'})}
    for(const t of [0,5,10,15,20])T(s,X(t),234,t+(t===20?' ms':''),{fs:18,w:500,fill:'var(--muted)',a:t===20?'end':'middle'});
    E('line',{x1:66,y1:Y(-58),x2:586,y2:Y(-58),stroke:'var(--amber)','stroke-width':1.5,'stroke-dasharray':'6 5'},s);
    T(s,584,Y(-58)-6,'limiar ≈',{fs:18,a:'end',fill:'var(--amber)'});
    layer.stim=E('g',{},s);layer.path=E('path',{fill:'none',stroke:'var(--hema)','stroke-width':3,'stroke-linejoin':'round'},s);
    layer.cur=E('g',{},s);
    // canais
    E('rect',{x:0,y:270,width:600,height:44,fill:'var(--bone-2)',opacity:.55},s);
    T(s,14,262,'fora',{fs:18,a:'start',w:500,fill:'var(--muted)'});T(s,14,334,'dentro',{fs:18,a:'start',w:500,fill:'var(--muted)'});
    layer.na=E('g',{},s);layer.k=E('g',{},s);
  }
  function chan(g,cx,title,col,gates){clear(g);
    T(g,cx,262,title,{fs:18,fill:col});
    E('rect',{x:cx-34,y:268,width:24,height:48,rx:7,fill:col,opacity:.9},g);E('rect',{x:cx+10,y:268,width:24,height:48,rx:7,fill:col,opacity:.9},g);
    gates(g)}
  function update(i){if(!data)return;const p=data.r[Math.max(0,Math.min(data.r.length-1,i))];cur=i;
    clear(layer.cur);const x=X(p.t),y=Y(p.V);
    E('line',{x1:x,y1:12,x2:x,y2:208,stroke:'var(--muted)','stroke-width':1,'stroke-dasharray':'3 4'},layer.cur);
    E('circle',{cx:x,cy:y,r:7,fill:'var(--hema)',stroke:'var(--panel)','stroke-width':2},layer.cur);
    const pNa=p.m**3*p.h,pK=p.n**4;
    const naState=pNa>0.04?'aberto':p.h<0.3?'inativado':'fechado';
    const kState=pK>0.12?'aberto':'fechado';
    const cNa='var(--eosin)',cK='var(--sky)';
    chan(layer.na,190,'Canal de Na⁺',cNa,g=>{
      // comporta m (fora) gira para abrir
      const ang=-80*Math.min(1,p.m**3*1.6);
      E('rect',{x:190-12,y:266,width:24,height:7,rx:3,fill:'var(--ink)',transform:`rotate(${ang} 178 269)`},g);
      // comporta h (dentro) bola que tampa
      const plug=1-p.h; const by=322+ (1-plug)*16, bx=190-6+(1-plug)*26;
      E('line',{x1:190+34,y1:316,x2:bx,y2:by,stroke:'var(--ink)','stroke-width':2},g);
      E('circle',{cx:bx,cy:by,r:8,fill:'var(--ink)'},g);
      if(naState==='aberto'){E('path',{d:'M190 240 v62 m-8 -10 l8 10 l8 -10',fill:'none',stroke:cNa,'stroke-width':3},g)}
      T(g,300,300,'',{});
    });
    chan(layer.k,430,'Canal de K⁺',cK,g=>{
      const op=Math.min(1,pK*4);
      E('rect',{x:430-12,y:312,width:24,height:7,rx:3,fill:'var(--ink)',transform:`rotate(${70*op} 418 315)`},g);
      if(kState==='aberto')E('path',{d:'M430 330 v-70 m-8 10 l8 -10 l8 10',fill:'none',stroke:cK,'stroke-width':3},g)});
    const lbl={aberto:'aberto',inativado:'inativado',fechado:'fechado'};
    E('text',{x:256,y:300,'font-size':18,'text-anchor':'start','font-weight':700,fill:cNa,text:lbl[naState]},layer.na);
    E('text',{x:498,y:300,'font-size':18,'text-anchor':'start','font-weight':700,fill:cK,text:lbl[kState]},layer.k);
    return {p,naState,kState};
  }
  function phase(i){const r=data.r,p=r[i];if(p.t<T0)return 'repouso';
    const prev=r[Math.max(0,i-3)];const dv=p.V-prev.V;
    if(p.V>-40&&dv>0)return 'despolarização (fase ascendente)';
    if(p.V>-40&&dv<=0)return 'repolarização';
    if(p.V<-68)return 'hiperpolarização pós-potencial';
    if(p.on)return 'estímulo sendo aplicado';
    return dv>0.05?'despolarização':'retorno ao repouso'}
  function run(){cancelAnimationFrame(anim);
    const I=+inI.value,Ko=+inK.value,blk=+inB.value/100,d2=+inD.value;
    data=sim(I,Ko,blk,d2);base();
    for(const t0 of d2>0?[T0,T0+d2]:[T0])E('rect',{x:X(t0),y:200,width:Math.max(4,X(t0+PW)-X(t0)),height:8,fill:'var(--amber)'},layer.stim);
    const d=data.r.map((p,i)=>(i?'L':'M')+X(p.t).toFixed(1)+' '+Y(p.V).toFixed(1)).join(' ');
    layer.path.setAttribute('d',d);
    let spikes=0,peak=-200;for(let i=1;i<data.r.length;i++){if(data.r[i-1].V<0&&data.r[i].V>=0)spikes++;peak=Math.max(peak,data.r[i].V)}
    const rest=data.r[0].V,stim1=data.r.filter(p=>p.t<T0+1.2&&p.t>=T0);
    const pre=data.r.filter(p=>p.t<T0);let spont=0;for(let i=1;i<pre.length;i++)if(pre[i-1].V<0&&pre[i].V>=0)spont++;
    let msg;
    if(spont||(spikes>(d2>0?2:1)))msg='<b>Disparos espontâneos.</b> Com K⁺ extracelular moderadamente alto, o repouso sobe e a membrana dispara sozinha: fase de <b>hiperexcitabilidade</b> da hipercalemia (fasciculações, arritmias).';
    else if(Ko>=8.5&&spikes===0)msg='<b>Bloqueio por despolarização.</b> Repouso em cerca de '+fmt(rest,0)+' mV: os canais de Na⁺ ficaram <b>inativados</b> e nem estímulos fortes geram potencial de ação. É o coração do gato com obstrução uretral grave: bradicardia e risco de assistolia.';
    else if(spikes===0&&blk>0.5)msg='<b>Condução bloqueada.</b> Com '+inB.value+'% dos canais de Na⁺ bloqueados, a corrente de Na⁺ não vence a de K⁺ e não há retroalimentação positiva: é o efeito da lidocaína (ou da tetrodotoxina).';
    else if(spikes===0)msg='<b>Abaixo do limiar.</b> Só um potencial graduado: a membrana despolariza um pouco durante o estímulo e volta ao repouso. Aumente a intensidade (o limiar fica perto de 12 a 15 µA/cm² neste modelo).';
    else if(d2>0&&spikes===1)msg='<b>Período refratário.</b> O 2º estímulo veio '+fmt(d2,1)+' ms depois do primeiro e <b>não</b> gerou novo potencial de ação. Abaixo de cerca de 2 a 3 ms os canais de Na⁺ ainda estão inativados (refratário <b>absoluto</b>); um pouco depois, só um estímulo mais forte dispara (refratário <b>relativo</b>).';
    else if(d2>0)msg='<b>Dois potenciais de ação.</b> O intervalo de '+fmt(d2,1)+' ms foi suficiente para recuperar canais de Na⁺. Repare que, perto do fim do período refratário relativo, o 2º pico pode sair um pouco menor.';
    else msg='<b>Potencial de ação.</b> Pico de '+sg(peak,0)+' mV. Aumente o estímulo e veja que a amplitude quase não muda: <b>tudo ou nada</b>. '+(blk>0?'Com bloqueio parcial dos canais de Na⁺ o limiar sobe e o pico fica menor.':'');
    if(Ko!==4&&Ko<3.5&&spikes===0)msg='<b>Hipocalemia.</b> O repouso ficou em '+fmt(rest,0)+' mV, mais longe do limiar: o mesmo estímulo agora não dispara. Fraqueza muscular.';
    const base_=msg+`<div class="potencial-kv"><span>Repouso <b>${fmt(rest,1)} mV</b></span><span>E<sub>K</sub> <b>${fmt(data.EK,0)} mV</b></span><span>Pico <b>${sg(peak,0)} mV</b></span></div>`;
    out.innerHTML=base_+'<div id="paPh" class="mono" style="margin-top:6px;color:var(--muted)"></div>';
    const ph=$('#paPh');
    const show=i=>{const st=update(i);if(ph&&st)ph.textContent=`t = ${fmt(st.p.t,1)} ms · ${fmt(st.p.V,0)} mV · ${phase(i)} · Na⁺: ${st.naState}, K⁺: ${st.kState}`};
    if(reduce){let im=0;data.r.forEach((p,i)=>{if(p.V>data.r[im].V)im=i});show(im);return}
    const len=layer.path.getTotalLength?layer.path.getTotalLength():0;
    layer.path.style.strokeDasharray=len;layer.path.style.strokeDashoffset=len;
    const dur=3200,t0=performance.now();
    const fr=now=>{const f=Math.min(1,(now-t0)/dur);const i=Math.round(f*(data.r.length-1));
      // revela o traçado até o tempo atual
      const xx=X(data.r[i].t);clipRect.setAttribute('width',Math.max(0,xx));show(i);
      if(f<1)anim=requestAnimationFrame(fr)};
    layer.path.style.strokeDasharray='';layer.path.style.strokeDashoffset='';
    const defs=E('defs',{},s),cp=E('clipPath',{id:'paClip'},defs);const clipRect=E('rect',{x:0,y:0,width:0,height:240},cp);
    layer.path.setAttribute('clip-path','url(#paClip)');
    anim=requestAnimationFrame(fr)}
  const lab=()=>{$('#paIV').textContent=fmt(+inI.value,1);$('#paKV').textContent=fmt(+inK.value,1);$('#paBV').textContent=inB.value;
    $('#paDV').textContent=+inD.value>0?fmt(+inD.value,1)+' ms':'desligado'};
  inI.max=60;inI.step=1;if(+inI.value===8)inI.value=25;
  [inI,inK,inB,inD].forEach(i=>{i.addEventListener('input',lab);i.addEventListener('change',run)});
  go.addEventListener('click',run);
  // inspecionar com o dedo/mouse
  s.addEventListener('pointermove',e=>{if(!data)return;const r=s.getBoundingClientRect();const x=(e.clientX-r.left)/r.width*600;
    if(x<66||x>586)return;cancelAnimationFrame(anim);const cr=s.querySelector('#paClip rect');if(cr)cr.setAttribute('width',600);
    const t=(x-66)/520*TMAX;const i=Math.round(t/TMAX*(data.r.length-1));const st=update(i);const ph=$('#paPh');if(ph&&st)ph.textContent=`t = ${fmt(st.p.t,1)} ms · ${fmt(st.p.V,0)} mV · ${phase(i)} · Na⁺: ${st.naState}, K⁺: ${st.kState}`});
  lab();run();
})();

/* ============ 3. Corrida de impulsos ============ */
(()=>{const s=$('#cdzSvg');if(!s)return;
  const out=$('#cdzOut');let sel='amie',anim=null;
  const L=40,R=570,rows={amie:66,mie:156,desm:246};
  const nodes=[];for(let x=L;x<=R;x+=53)nodes.push(x);
  const info={
    amie:['Amielínico (fibra C)','0,5 a 2 m/s','Canais de Na⁺ em toda a membrana: cada trecho precisa disparar, um depois do outro. A onda de despolarização avança devagar e de forma <b>contínua</b>. São as fibras da dor lenta (em queimação) e as pós-ganglionares autonômicas.'],
    mie:['Mielínico (fibra Aα)','70 a 120 m/s','A mielina isola os internodos e os canais de Na⁺ ficam concentrados nos <b>nodos de Ranvier</b>. O potencial de ação é regenerado só nos nodos e parece <b>saltar</b> de um para o outro: condução saltatória, rápida e econômica. Motoneurônios e fibras de propriocepção.'],
    desm:['Desmielinizado','lento ou bloqueado','No trecho sem mielina a corrente vaza pelo internodo, que tem poucos canais de Na⁺. O impulso <b>atrasa</b> e pode <b>parar</b>. É o que ocorre na polirradiculoneurite do cão, na doença de Marek das aves e nas lesões da cinomose.']};
  const draw=(tt)=>{clear(s);
    for(const k in rows){const y=rows[k],on=k===sel;
      T(s,L,y-28,info[k][0]+' · '+info[k][1],{fs:18,a:'start',fill:on?'var(--hema)':'var(--muted)',w:on?700:600});
      E('line',{x1:L,y1:y,x2:R,y2:y,stroke:'var(--sky)','stroke-width':on?6:4,'stroke-linecap':'round'},s);
      if(k!=='amie')for(let i=0;i<nodes.length-1;i++){const x0=nodes[i]+5,x1=nodes[i+1]-5;
        if(k==='desm'&&i>=4&&i<=6){E('rect',{x:x0,y:y-12,width:x1-x0,height:24,rx:10,fill:'none',stroke:'var(--muted)','stroke-width':1.5,'stroke-dasharray':'4 4'},s);continue}
        E('rect',{x:x0,y:y-12,width:x1-x0,height:24,rx:10,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':1.5},s)}
      const x=pos(k,tt);
      if(x!=null){E('rect',{x:Math.max(L,x-60),y:y-5,width:Math.min(60,x-L),height:10,rx:5,fill:'var(--hema-soft)'},s);
        E('circle',{cx:x,cy:y,r:on?11:9,fill:'var(--hema)',stroke:'var(--panel)','stroke-width':2},s)}}
  };
  // tt em segundos de animação
  function pos(k,tt){
    if(k==='amie')return Math.min(R,L+(R-L)*tt/5.0);
    if(k==='mie'){const i=Math.min(nodes.length-1,Math.floor(tt/0.06));return nodes[i]}
    // desmielinizado: salta até o nodo 4, atravessa devagar o trecho lesado e falha no meio dele
    const tj=4*0.06;if(tt<tj)return nodes[Math.floor(tt/0.06)];
    const slow=nodes[4]+(tt-tj)*35;const stop=nodes[6]-10;return Math.min(slow,stop)}
  const play=()=>{cancelAnimationFrame(anim);
    if(reduce){draw(0.9);return}
    const t0=performance.now();const fr=now=>{const tt=(now-t0)/1000;draw(tt);if(tt<5.2)anim=requestAnimationFrame(fr)};anim=requestAnimationFrame(fr)};
  choices('#cdzBtns',k=>{sel=k;const d=info[k];out.innerHTML=`<b>${d[0]}</b> · velocidade típica ${d[1]}.<br>${d[2]}`;if(reduce)draw(0.9);else play()});
  const b=$('#cdzGo');if(b)b.addEventListener('click',play);
})();
