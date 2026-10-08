const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;
const br=(x,d=1)=>x.toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d});

/* ============ 1. Espiral da β-oxidação (box) ============ */
(()=>{const s=$('#boxSvg');if(!s)return;
  const out=$('#boxOut'),st=$('#boxStats'),prev=$('#boxPrev'),next=$('#boxNext'),cyc=$('#boxCyc'),end=$('#boxEnd');
  const FA={'4':{n:4,nome:'butirato (C4:0)',uns:false},'12':{n:12,nome:'laurato (C12:0)',uns:false},'16':{n:16,nome:'palmitato (C16:0)',uns:false},
    '18':{n:18,nome:'estearato (C18:0)',uns:false},'18:1':{n:18,nome:'oleato (C18:1 cis-Δ9)',uns:true}};
  let fa=FA['16'],steps=[],i=0;
  const build=()=>{steps=[{t:'act'},{t:'carn'}];const nc=fa.n/2-1;
    for(let c=1;c<=nc;c++)for(let r=1;r<=4;r++)steps.push({t:'r',c,r,iso:fa.uns&&c===4&&r===1,last:c===nc});
    steps.push({t:'end'})};
  const tally=k=>{let F=0,N=0,A=0;for(let j=0;j<=k;j++){const p=steps[j];if(p.t!=='r')continue;
      if(p.r===1&&!p.iso)F++;if(p.r===3)N++;if(p.r===4)A+=p.last?2:1}
    return{F,N,A,atp:1.5*F+2.5*N+10*A-2}};
  const X0=468,DX=24,Y0=92;
  const cx=k=>X0-(k-1)*DX,cy=k=>Y0+(k%2?12:-12);
  const draw=()=>{clear(s);const p=steps[i];const nc=fa.n/2-1;
    const done=p.t==='end'?nc:p.t==='r'?(p.r===4?p.c:p.c-1):0;
    const L=p.t==='end'?0:fa.n-2*done;
    const {A}=tally(i);
    // membrana mitocondrial (entrada)
    if(p.t==='carn'){E('line',{x1:540,y1:20,x2:540,y2:170,stroke:'var(--muted)','stroke-width':3,'stroke-dasharray':'8 6'},s);T(s,540,190,'membrana',{fs:18,fill:'var(--muted)',w:500})}
    if(L>0){
      // ligações
      for(let k=1;k<L;k++){E('line',{x1:cx(k),y1:cy(k),x2:cx(k+1),y2:cy(k+1),stroke:'var(--ink)','stroke-width':3},s)}
      // dupla cis do oleato (antes da isomerase)
      if(fa.uns){const pos=9-2*done;const isoDone=p.t==='r'&&(p.c>4||(p.c===4&&p.r>=1));
        if(!isoDone&&pos>=3&&pos<L){const a=pos,b=pos+1,ox=0,oy=7;E('line',{x1:cx(a)+ox,y1:cy(a)+oy,x2:cx(b)+ox,y2:cy(b)+oy,stroke:'var(--sky)','stroke-width':4},s);T(s,(cx(a)+cx(b))/2,150,'cis',{fs:18,fill:'var(--sky)'})}}
      // marcas da reação atual
      if(p.t==='r'&&p.r<4){
        if(p.r===1)E('line',{x1:cx(2),y1:cy(2)+7,x2:cx(3),y2:cy(3)+7,stroke:'var(--amber)','stroke-width':4},s);
        if(p.r===2){E('line',{x1:cx(3),y1:cy(3),x2:cx(3),y2:cy(3)+30,stroke:'var(--ink)','stroke-width':3},s);T(s,cx(3),cy(3)+52,'OH',{fs:18,fill:'var(--sky)',w:800})}
        if(p.r===3){E('line',{x1:cx(3)-4,y1:cy(3),x2:cx(3)-4,y2:cy(3)+30,stroke:'var(--eosin)','stroke-width':3},s);E('line',{x1:cx(3)+4,y1:cy(3),x2:cx(3)+4,y2:cy(3)+30,stroke:'var(--eosin)','stroke-width':3},s);T(s,cx(3),cy(3)+52,'O',{fs:20,fill:'var(--eosin)',w:800})}}
      // átomos
      for(let k=1;k<=L;k++){const hi=p.t==='r'&&(k===2||k===3);
        E('circle',{cx:cx(k),cy:cy(k),r:9,fill:hi?(k===3?'var(--eosin)':'var(--amber)'):'var(--hema-2)',stroke:'var(--panel)','stroke-width':2},s)}
      if(L>=3){T(s,cx(2),cy(2)-18,'α',{fs:18,fill:'var(--muted)'});T(s,cx(3),cy(3)-18,'β',{fs:18,fill:'var(--muted)'})}
      T(s,cx(L)-4,cy(L)-20,'ω',{fs:18,fill:'var(--muted)'});
      // grupo da ponta
      const lab=p.t==='carn'?'Carnitina':'S-CoA';
      E('line',{x1:cx(1),y1:cy(1),x2:492,y2:cy(1),stroke:'var(--ink)','stroke-width':3},s);
      E('rect',{x:492,y:cy(1)-18,width:p.t==='carn'?102:76,height:36,rx:10,fill:p.t==='carn'?'var(--sky-soft)':'var(--amber-soft)',stroke:p.t==='carn'?'var(--sky)':'var(--amber)','stroke-width':2},s);
      T(s,492+(p.t==='carn'?51:38),cy(1)+7,lab,{fs:18,w:800});
      T(s,24,40,'C'+L,{fs:22,a:'start',w:800,fill:'var(--hema)'});
    }else{T(s,300,100,'Toda a cadeia virou acetil-CoA',{fs:22,w:800,fill:'var(--hema)'})}
    // pilha de acetil-CoA
    T(s,24,214,'Acetil-CoA → ciclo de Krebs',{fs:18,a:'start',w:700});
    for(let k=0;k<A;k++){const x=24+k*62,y=232,g=E('g',{},s);
      E('rect',{x,y,width:54,height:40,rx:12,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':2},g);
      E('circle',{cx:x+16,cy:y+20,r:8,fill:'var(--amber)'},g);E('circle',{cx:x+38,cy:y+20,r:8,fill:'var(--amber)'},g);
      if(!reduce&&p.t==='r'&&p.r===4&&k>=A-(p.last?2:1)){const a=E('animateTransform',{attributeName:'transform',type:'translate',from:'0 -120',to:'0 0',dur:'0.5s',fill:'freeze'},g);a.beginElement&&a.beginElement()}}
  };
  const stat=(v,l)=>`<div class="stat"><b>${v}</b><span>${l}</span></div>`;
  const RX={1:['Acil-CoA desidrogenase','Retira 2 H dos carbonos α e β e cria uma dupla <i>trans</i>-Δ2. Os elétrons vão para o <b>FAD → FADH₂</b>, que os entrega à ubiquinona da cadeia respiratória (+1,5 ATP).'],
    2:['Enoil-CoA hidratase','Adiciona <b>água</b> à dupla ligação: o carbono β recebe uma hidroxila (L-3-hidroxiacil-CoA). Nenhuma coenzima é reduzida.'],
    3:['3-hidroxiacil-CoA desidrogenase','Oxida a hidroxila do carbono β a <b>cetona</b> (3-cetoacil-CoA). Os elétrons vão para o <b>NAD⁺ → NADH</b> (+2,5 ATP no complexo I).'],
    4:['β-cetotiolase (tiólise)','Uma CoA nova ataca o carbono β: sai <b>acetil-CoA</b> (C1 e C2) e sobra um acil-CoA com <b>2 carbonos a menos</b>, que recomeça a espiral.']};
  const go=n=>{i=Math.max(0,Math.min(steps.length-1,n));draw();const p=steps[i],t=tally(i),nc=fa.n/2-1;
    st.innerHTML=stat(t.F,'FADH₂')+stat(t.N,'NADH')+stat(t.A,'Acetil-CoA')+stat(br(t.atp),'ATP líquido');
    let h='';
    if(p.t==='act')h=`<b>Ativação</b> (citosol): a acil-CoA sintetase liga o ${fa.nome} à CoA, gastando 1 ATP → AMP + PPi. Custo: <b>2 ligações de alta energia (−2 ATP)</b>. A partir daqui, ${nc} volta${nc>1?'s':''} da espiral.`;
    if(p.t==='carn')h=`<b>Sistema da carnitina</b>: ${fa.n<=12?'cadeias curtas e médias entram na mitocôndria mesmo sem carnitina, mas a via é mostrada para comparação.':'a CPT-I troca a CoA pela <b>carnitina</b>, a translocase atravessa a membrana interna e a CPT-II devolve a CoA na matriz.'} A CPT-I é inibida pela <b>malonil-CoA</b>: no estado alimentado, a porta fica fechada.`;
    if(p.t==='r'){const r=p.iso?['Enoil-CoA isomerase','Após 3 voltas, a dupla <i>cis</i> original ficou entre C3 e C4 (cis-Δ3). A <b>isomerase</b> a move para <i>trans</i>-Δ2, que a hidratase reconhece. A acil-CoA desidrogenase é <b>pulada</b>: nesta volta <b>não se forma FADH₂</b> (−1,5 ATP).']:RX[p.r];
      h=`<span class="mono" style="color:var(--muted)">Volta ${p.c} de ${nc} · reação ${p.r} de 4</span><br><b>${r[0]}</b>: ${r[1]}${p.r===4&&p.last?' Na última volta, o fragmento de 4 C se parte em <b>dois</b> acetil-CoA.':''}`}
    if(p.t==='end'){const F=t.F,N=t.N,A=t.A;
      h=`<b>Saldo do ${fa.nome}</b>: ${nc} voltas<br>${F} FADH₂ × 1,5 = ${br(F*1.5)} · ${N} NADH × 2,5 = ${br(N*2.5)} · ${A} acetil-CoA × 10 = ${A*10} · ativação −2<br><b>Total = ${br(t.atp)} ATP</b> (${br(t.atp/fa.n)} ATP por carbono; glicose ≈ 5 por carbono).${fa.uns?' O oleato rende 1,5 ATP a menos que o estearato por causa da dupla ligação.':''}${fa.n===4?' O butirato é um ácido graxo volátil do rúmen; no epitélio ruminal, boa parte dele vira β-hidroxibutirato.':''}`}
    out.innerHTML=h;prev.disabled=i===0;next.textContent=i===steps.length-1?'Recomeçar ↺':'Próxima reação →'};
  prev.addEventListener('click',()=>go(i-1));
  next.addEventListener('click',()=>go(i===steps.length-1?0:i+1));
  cyc.addEventListener('click',()=>{let j=i+1;while(j<steps.length-1&&!(steps[j].t==='r'&&steps[j].r===4))j++;go(j)});
  end.addEventListener('click',()=>go(steps.length-1));
  choices('#boxBtns',k=>{fa=FA[k];build();go(0)});
})();

/* ============ 2. Balanço energético negativo da vaca (bev) ============ */
(()=>{const s=$('#bevSvg');if(!s)return;const out=$('#bevOut'),mi=$('#bevMilk'),di=$('#bevDmi');let mode='ok';
  const calc=()=>{const M=+mi.value,D=+di.value;$('#bevMilkV').textContent=M;$('#bevDmiV').textContent=br(D,1).replace(',0','');
    const g=mode==='gorda',pg=mode==='pg';
    const req=9.7+0.72*M,ing=D*1.65*(g?0.9:1),bal=ing-req,def=Math.max(0,-bal);
    const nefa=Math.min(2,0.15+0.055*def*(g?1.4:1));
    const bhb=Math.min(5,0.5+Math.max(0,nefa-0.4)*2.2*(pg?0.45:1));
    const liv=Math.min(20,0.8+Math.max(0,nefa-0.3)*6*(g?1.6:1));
    return{M,D,req,ing,bal,def,nefa,bhb,liv,g,pg}};
  const col=(v,a,b)=>v>=b?'var(--bad)':v>=a?'var(--amber)':'var(--ok)';
  const draw=()=>{const c=calc();clear(s);
    const H=v=>Math.min(190,v*190/55);
    [[c.ing,'Ingere','var(--ok)',40],[c.req,'Gasta','var(--eosin)',118]].forEach(([v,l,cl,x])=>{
      E('rect',{x,y:250-H(v),width:58,height:H(v),rx:8,fill:cl},s);T(s,x+29,242-H(v),br(v,0),{fs:20,w:800});T(s,x+29,280,l,{fs:18})});
    T(s,98,24,'Mcal/dia',{fs:18,fill:'var(--muted)',w:500});
    const G=[['AGNE',c.nefa,2,[0.4,0.7],'mEq/L',2],['BHB',c.bhb,4,[1.2,3.0],'mmol/L',1],['Fígado (TAG)',c.liv,15,[5,10],'%',1]];
    G.forEach(([l,v,max,th,u,d],k)=>{const y=40+k*82,x=220,w=360;
      T(s,x,y,l,{fs:18,a:'start',w:700});T(s,x+w,y,br(v,d)+' '+u,{fs:18,a:'end',w:800,fill:col(v,th[0],th[1])});
      E('rect',{x,y:y+12,width:w,height:20,rx:10,fill:'var(--line)'},s);
      E('rect',{x,y:y+12,width:Math.max(6,Math.min(1,v/max)*w),height:20,rx:10,fill:col(v,th[0],th[1])},s);
      th.forEach(t=>{const xx=x+t/max*w;E('line',{x1:xx,y1:y+6,x2:xx,y2:y+38,stroke:'var(--ink)','stroke-width':2,'stroke-dasharray':'4 3'},s)})});
    let dx;
    if(c.bal>=0)dx='<b>Balanço positivo.</b> A dieta cobre manutenção e produção; insulina adequada, pouca lipólise, AGNE e BHB basais.';
    else if(c.bhb>=3)dx='<b>Cetose clínica.</b> BHB acima de 3 mmol/L: inapetência, queda brusca de produção, hálito cetônico, possível forma nervosa. Tratar com glicose IV e propilenoglicol oral.';
    else if(c.bhb>=1.2)dx='<b>Cetose subclínica.</b> Sem sinais evidentes, mas com menos leite, mais risco de deslocamento de abomaso, metrite e falha reprodutiva.';
    else if(c.nefa>=0.7)dx='<b>BEN intenso.</b> A mobilização de gordura já está acima do desejável; a cetose está perto.';
    else dx='<b>BEN leve</b>, normal no início da lactação: o tecido adiposo compensa a diferença sem sobrecarregar o fígado.';
    out.innerHTML=`${dx}<br>Balanço: <b>${c.bal>=0?'+':'−'}${br(Math.abs(c.bal),1)} Mcal/dia</b>${c.def>0?` (≈ ${br(c.def/5,1)} kg de reservas corporais por dia)`:''}. Fígado: ${c.liv>=10?'<b>lipidose grave</b>':c.liv>=5?'<b>lipidose moderada</b>':c.liv>=2?'infiltração leve':'normal'}.`+
      (c.g?' <span style="color:var(--muted)">A vaca gorda come menos no pós-parto e mobiliza mais gordura (resistência à insulina): mais AGNE e mais gordura no fígado.</span>':'')+
      (c.pg?' <span style="color:var(--muted)">O propilenoglicol vira glicose no fígado, eleva a insulina e devolve oxaloacetato ao ciclo de Krebs: a cetogênese cai, mas o déficit energético continua.</span>':'')};
  mi.addEventListener('input',draw);di.addEventListener('input',draw);
  choices('#bevBtns',k=>{mode=k;draw()});
})();
