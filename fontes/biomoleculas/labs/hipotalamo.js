const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;
/* ===== Termostato hipotalâmico: efetores × temperatura central ===== */
(()=>{const s=$('#hySvg');if(!s)return;
  const sl=$('#hyTc'),lv=$('#hyTcV'),out=$('#hyOut');
  const f=v=>v.toFixed(1).replace('.',',');
  const C={
    normal:{sp:38.5,loss:1,cold:1,zone:0.3,shiv:1,txt:'Hipotálamo íntegro: ponto de ajuste em 38,5 °C e zona interlimiar estreita.'},
    febre:{sp:40.5,loss:1,cold:1,zone:0.3,shiv:1,txt:'A PGE₂ inibe os neurônios pré-ópticos sensíveis ao calor: o ponto de ajuste sobe para ~40,5 °C. Com 38,5 °C o animal “sente frio” e treme.'},
    lesao:{sp:38.5,loss:0.1,cold:1,zone:0.3,shiv:1,txt:'Sem a área pré-óptica, as respostas de perda de calor quase desaparecem: qualquer carga de calor vira hipertermia, e antipiréticos não ajudam.'},
    aneste:{sp:38.5,loss:0.6,cold:0.25,zone:2.5,shiv:0,txt:'Anestésicos alargam a zona interlimiar (o limiar de vasoconstrição cai 2–3 °C) e abolem o tremor: o paciente esfria sem reagir.'}};
  const EF=[['Vasodilatação cutânea','up',0,'var(--sky)'],['Sudorese / ofego','up',0.6,'var(--sky)'],['Vasoconstrição + piloereção','dn',0,'var(--hema)'],['Tremor','dn',0.8,'var(--hema)'],['Gordura parda / tireoide','dn',0.5,'var(--amber)']];
  let k='normal';
  const X0=60,X1=560,px=v=>X0+(X1-X0)*(v-35)/7;
  function draw(){const c=C[k],tc=+sl.value;lv.textContent=f(tc)+' °C';clear(s);
    /* escala */
    E('rect',{x:X0,y:40,width:X1-X0,height:22,rx:11,fill:'var(--line)'},s);
    E('rect',{x:px(c.sp-c.zone),y:40,width:px(c.sp+c.zone)-px(c.sp-c.zone),height:22,fill:'var(--ok-soft)'},s);
    for(let v=35;v<=42;v++)T(s,px(v),24,v+'',{fs:18,w:500,fill:'var(--muted)'});
    E('line',{x1:px(c.sp),y1:32,x2:px(c.sp),y2:72,stroke:'var(--ink)','stroke-width':3,'stroke-dasharray':'6 4'},s);
    E('circle',{cx:px(tc),cy:51,r:11,fill:'var(--bad)',stroke:'var(--paper)','stroke-width':3},s);
    T(s,Math.min(Math.max(px(c.sp),130),470),96,'ponto de ajuste '+f(c.sp)+' °C',{fs:18,w:600});
    /* efetores */
    const err=tc-c.sp,act=[];
    EF.forEach(([n,dir,th,col],i)=>{let a;
      if(dir==='up')a=Math.max(0,(err-c.zone-th))*c.loss/1.2;
      else{a=Math.max(0,(-err-c.zone-th))*c.cold/1.2;if(i===3)a*=c.shiv}
      a=Math.min(1,a);const y=125+i*40;
      T(s,X0,y+20,n,{fs:18,a:'start',w:500});
      E('rect',{x:330,y:y+4,width:230,height:22,rx:6,fill:'var(--line)'},s);
      E('rect',{x:330,y:y+4,width:Math.max(0,230*a),height:22,rx:6,fill:col},s);
      if(a>0.05)act.push(n.toLowerCase()+' ('+Math.round(a*100)+'%)')});
    let st;if(Math.abs(err)<=c.zone)st='Dentro da zona interlimiar: só comportamento e ajustes finos.';
    else st=(err>0?'Acima':'Abaixo')+' do ponto de ajuste em '+f(Math.abs(err))+' °C.';
    out.innerHTML='<b>'+st+'</b> Efetores ativos: '+(act.length?act.join(', '):'nenhum')+'.<br>'+c.txt}
  sl.addEventListener('input',draw);
  choices('#hyCond',v=>{k=v;draw()});
})();
