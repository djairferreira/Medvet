const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;

/* ============ 1. Ciclo de Krebs passo a passo (krc) ============ */
(()=>{const s=$('#krcSvg');if(!s)return;
  const CX=300,CY=195,R=130,rad=a=>a*Math.PI/180;
  const P=(a,r=R)=>[CX+r*Math.cos(rad(a)),CY+r*Math.sin(rad(a))];
  const NOS=['citrato','isocitrato','α-cetoglutarato','succinil-CoA','succinato','fumarato','malato','oxaloacetato'];
  const ang=j=>-67.5+45*j;               // ângulo do nó j
  const CARB=['6C','6C','5C','4C','4C','4C','4C','4C'];
  const SAI={3:['NADH','CO₂'],4:['NADH','CO₂'],5:['GTP'],6:['FADH₂'],8:['NADH']};
  const KEYS=['NADH','FADH₂','GTP','CO₂'];
  const steps=[
    ['Entrada: acetil-CoA','A <b>piruvato desidrogenase</b> já transformou o piruvato em <b>acetil-CoA</b> (2C), liberando 1 CO₂ e 1 NADH (fora da conta do ciclo). O acetil-CoA vai se juntar ao <b>oxaloacetato</b> (4C), que está esperando no fim da roda.'],
    ['1. Citrato sintase','Acetil-CoA (2C) + oxaloacetato (4C) → <b>citrato</b> (6C) + CoA. Reação <b>irreversível</b> e regulada: citrato, succinil-CoA, NADH e ATP a freiam.'],
    ['2. Aconitase','Citrato → <b>isocitrato</b> (passando por cis-aconitato). Só reposiciona a hidroxila para permitir a oxidação seguinte. É a enzima bloqueada pelo <b>fluorocitrato</b> (intoxicação por <i>Palicourea</i> e pelo raticida 1080).'],
    ['3. Isocitrato desidrogenase','Isocitrato → <b>α-cetoglutarato</b> (5C). Sai o <b>1º CO₂</b> e forma-se o <b>1º NADH</b>. É o principal ponto de controle: ADP e Ca²⁺ aceleram; ATP e NADH freiam.'],
    ['4. α-cetoglutarato desidrogenase','α-cetoglutarato → <b>succinil-CoA</b> (4C). Sai o <b>2º CO₂</b> e o <b>2º NADH</b>. Complexo gêmeo da PDH: usa TPP (B1), lipoato, CoA, FAD e NAD⁺. Por isso a falta de tiamina trava o ciclo aqui também.'],
    ['5. Succinil-CoA sintetase','Succinil-CoA → <b>succinato</b>. A energia da ligação tioéster forma <b>1 GTP</b> (ou ATP): fosforilação no nível do substrato, o único “ATP direto” do ciclo.'],
    ['6. Succinato desidrogenase','Succinato → <b>fumarato</b>, com formação de <b>FADH₂</b>. A enzima fica presa na membrana interna e é o próprio <b>complexo II</b> da cadeia respiratória. O malonato a inibe por competição.'],
    ['7. Fumarase','Fumarato + H₂O → <b>malato</b>. Hidratação simples, sem produção de transportadores.'],
    ['8. Malato desidrogenase','Malato → <b>oxaloacetato</b>, com o <b>3º NADH</b>. O oxaloacetato regenerado pode receber outro acetil-CoA. A roda está pronta para nova volta.'],
    ['Balanço da volta','Por acetil-CoA: <b>3 NADH, 1 FADH₂, 1 GTP e 2 CO₂</b>. Na cadeia: 3 × 2,5 + 1 × 1,5 + 1 = <b>10 ATP</b>. Por glicose são <b>duas voltas</b>: 6 NADH, 2 FADH₂, 2 GTP, 4 CO₂, cerca de 20 ATP só a partir do ciclo.']];
  const arc=(g,a1,a2,col,w)=>{const [x1,y1]=P(a1),[x2,y2]=P(a2);
    return E('path',{d:`M${x1.toFixed(1)},${y1.toFixed(1)} A${R},${R} 0 0 1 ${x2.toFixed(1)},${y2.toFixed(1)}`,fill:'none',stroke:col,'stroke-width':w,'stroke-linecap':'round'},g)};
  stepper('krc',steps,(svg,i)=>{
    const done=i===9?8:i;               // reações concluídas
    E('circle',{cx:CX,cy:CY,r:R,fill:'none',stroke:'var(--line)','stroke-width':10},svg);
    for(let k=1;k<=done;k++){const cur=(k===i);const p=arc(svg,-112.5+45*(k-1)+4,-112.5+45*k-4,cur?'var(--eosin)':'var(--sky)',cur?12:9);
      if(cur&&!reduce){p.setAttribute('stroke-dasharray','200');E('animate',{attributeName:'stroke-dashoffset',from:200,to:0,dur:'.7s',fill:'freeze'},p)}}
    /* acetil-CoA entrando */
    const acOn=i<=1||i===9;
    T(svg,CX,26,'acetil-CoA (2C)',{fs:19,fill:acOn?'var(--eosin)':'var(--muted)'});
    E('path',{d:`M${CX},36 L${CX},${CY-R-8}`,stroke:acOn?'var(--eosin)':'var(--line)','stroke-width':3,fill:'none'},svg);
    E('path',{d:`M${CX-6},${CY-R-16} L${CX},${CY-R-6} L${CX+6},${CY-R-16}`,stroke:acOn?'var(--eosin)':'var(--line)','stroke-width':3,fill:'none'},svg);
    /* nós */
    NOS.forEach((n,j)=>{const a=ang(j),[x,y]=P(a),c=Math.cos(rad(a));const cur=(i>=1&&i<=8&&j===i-1)||(i===0&&j===7);
      E('circle',{cx:x,cy:y,r:cur?13:10,fill:cur?'var(--eosin)':'var(--panel)',stroke:cur?'var(--eosin)':'var(--hema)','stroke-width':3},svg);
      const [lx,ly]=P(a,R+22);const anc=c>.2?'start':c<-.2?'end':'middle';
      T(svg,lx,ly+6,n,{fs:j===2?18:19,a:anc,w:cur?800:600,fill:cur?'var(--eosin)':'var(--ink)'})});
    /* centro: carbonos */
    const cTxt=i===0?'2C + 4C':i===9?'× 2 por glicose':CARB[i-1];
    const out=SAI[i]||[];
    T(svg,CX,CY+(i===9?6:out.length?-8:10),cTxt,{fs:i===9?22:30,w:800,fill:'var(--hema)'});
    if(i>=1&&i<=8&&!out.length)T(svg,CX,CY+38,'no intermediário',{fs:18,w:500,fill:'var(--muted)'});
    /* produtos da etapa (dentro do anel, em linha) */
    if(out.length){out.forEach((o,k)=>{const bx=CX+(k-(out.length-1)/2)*90,by=CY+30;
      E('rect',{x:bx-40,y:by-14,width:80,height:28,rx:14,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':2},svg);
      const t=T(svg,bx,by+6,'+'+o,{fs:18,w:800,fill:'var(--ink)'});
      if(!reduce){E('animate',{attributeName:'opacity',from:0,to:1,dur:'.5s',fill:'freeze'},t)}})}
    /* contadores cumulativos */
    const cnt={NADH:0,'FADH₂':0,GTP:0,'CO₂':0};for(let k=1;k<=done;k++)(SAI[k]||[]).forEach(o=>cnt[o]++);
    KEYS.forEach((k,j)=>{const x=20+j*143,y=380;const hit=(SAI[i]||[]).includes(k);
      E('rect',{x,y,width:130,height:62,rx:12,fill:hit?'var(--amber-soft)':'var(--panel)',stroke:hit?'var(--amber)':'var(--line)','stroke-width':2},svg);
      T(svg,x+65,y+24,k,{fs:18,w:600,fill:'var(--muted)'});
      T(svg,x+65,y+53,i===9?cnt[k]+' (×2 = '+cnt[k]*2+')':String(cnt[k]),{fs:i===9?19:26,w:800,fill:'var(--ink)'})});
  });
})();

/* ============ 2. Simulador da cadeia respiratória (krr) ============ */
(()=>{const s=$('#krrSvg');if(!s)return;const out=$('#krrOut');
  const C={
    normal:{e:.7,g:.75,atp:.85,o2:.7,heat:.3,blk:null,leak:null,t:'<b>Mitocôndria acoplada.</b> NADH e FADH₂ entregam elétrons; os complexos <b>I, III e IV</b> bombeiam H⁺ para o espaço intermembranas e o O₂ recebe os elétrons no fim, formando água. Os prótons voltam pela <b>ATP sintase</b>, que fabrica ATP. Consumo de O₂ e síntese de ATP andam juntos (controle respiratório).'},
    cianeto:{e:0,g:.05,atp:.05,o2:0,heat:.08,blk:'IV',leak:null,t:'<b>Cianeto, monóxido de carbono ou H₂S</b> bloqueiam o <b>complexo IV</b>. Os elétrons param, a cadeia toda fica reduzida, nada é bombeado e o gradiente se desfaz. O O₂ chega à célula mas <b>não é usado</b>: o sangue venoso fica vermelho-vivo. Só resta a glicólise anaeróbica (lactato), insuficiente para cérebro e coração. Morte em minutos em bovinos que comem rebrota de sorgo.'},
    rotenona:{e:.3,g:.35,atp:.3,o2:.3,heat:.12,blk:'I',leak:null,t:'<b>Rotenona</b> (piscicida) bloqueia o <b>complexo I</b>: o NADH não consegue entregar elétrons. O FADH₂ ainda entra pelo <b>complexo II</b> e pela ubiquinona, então sobra um fluxo pequeno, que bombeia menos prótons (só em III e IV). ATP e consumo de O₂ caem bastante, mas não zeram.'},
    oligo:{e:.08,g:1,atp:0,o2:.08,heat:.05,blk:'ATP',leak:null,t:'<b>Oligomicina</b> trava a <b>ATP sintase</b>. Os prótons não têm por onde voltar, o gradiente sobe ao máximo e os complexos não conseguem bombear contra ele: o transporte de elétrons e o consumo de O₂ <b>caem quase a zero</b>, mesmo sem nenhum inibidor na cadeia. É a prova experimental do acoplamento.'},
    dnp:{e:1,g:.12,atp:.12,o2:1,heat:1,blk:null,leak:'DNP',t:'<b>Desacoplador (2,4-dinitrofenol, salicilato em dose tóxica, bromethalin).</b> A molécula carrega H⁺ de volta através da bicamada, fora da ATP sintase. O gradiente desaba, os complexos trabalham no máximo e o <b>consumo de O₂ dispara</b>, mas quase não se faz ATP: a energia vira <b>calor</b>. Resultado clínico: hipertermia, taquipneia, acidose. Gatos intoxicados por aspirina ficam hipertérmicos por isso.'},
    ucp:{e:.95,g:.3,atp:.3,o2:.95,heat:.9,blk:null,leak:'UCP1',t:'<b>Gordura parda: desacoplamento fisiológico.</b> A noradrenalina liberada no frio ativa a lipólise; os ácidos graxos ativam a <b>UCP1 (termogenina)</b>, um canal de prótons. O gradiente é gasto como <b>calor</b> (termogênese sem tremor). Cordeiros, bezerros e cabritos nascem com gordura parda; leitões não têm UCP1 funcional e dependem do tremor e de fonte de calor externa.'},
    hipoxia:{e:.15,g:.2,atp:.2,o2:.15,heat:.08,blk:'O2',leak:null,t:'<b>Hipóxia</b> (altitude, anemia grave, choque, pneumonia). Falta o aceptor final: o fluxo de elétrons é limitado pela pouca oferta de O₂ e o ATP cai. O NADH se acumula, o ciclo de Krebs desacelera e a célula desvia o piruvato para <b>lactato</b>. O lactato sanguíneo elevado é marcador de má perfusão em cães e equinos com cólica.'}};
  const X={I:65,II:145,Q:195,III:255,c:320,IV:380,ATP:510,leak:446};
  const draw=k=>{clear(s);const c=C[k];
    T(s,300,24,'Espaço intermembranas',{fs:18,w:600,fill:'var(--muted)'});
    T(s,300,252,'Matriz',{fs:18,w:600,fill:'var(--muted)'});
    /* bicamada */
    E('rect',{x:0,y:98,width:600,height:64,fill:'var(--bone)'},s);
    for(let x=6;x<600;x+=14){E('circle',{cx:x,cy:100,r:6,fill:'var(--bone-2)'},s);E('circle',{cx:x,cy:160,r:6,fill:'var(--bone-2)'},s)}
    /* prótons no espaço intermembranas, proporcionais ao gradiente */
    const n=Math.round(3+c.g*26);for(let j=0;j<n;j++){const x=18+((j*97)%560),y=40+((j*37)%44);E('circle',{cx:x,cy:y,r:6,fill:'var(--sky)',opacity:.85},s)}
    /* via de elétrons */
    const pth=`M${X.I},204 L${X.I},130 L${X.Q},128 L${X.III},130 L${X.c},82 L${X.IV},130 L${X.IV},204`;
    const ep=E('path',{d:pth,fill:'none',stroke:c.e>0?'var(--eosin)':'var(--line)','stroke-width':c.e>.5?4:2.5,'stroke-dasharray':'8 7',opacity:c.e>0?.95:.6},s);
    if(c.blk==='I'){E('path',{d:`M${X.II},204 L${X.II},140 L${X.Q},128`,fill:'none',stroke:'var(--eosin)','stroke-width':3,'stroke-dasharray':'8 7'},s)}
    if(c.e>0&&!reduce){E('animate',{attributeName:'stroke-dashoffset',from:60,to:0,dur:(1.6-c.e)+'s',repeatCount:'indefinite'},ep)}
    /* complexos */
    const box=(x,w,y1,y2,lab,col,soft)=>{E('rect',{x:x-w/2,y:y1,width:w,height:y2-y1,rx:12,fill:soft,stroke:col,'stroke-width':2.5},s);T(s,x,(y1+y2)/2+8,lab,{fs:22,w:800,fill:col})};
    box(X.I,62,74,186,'I','var(--sky)','var(--sky-soft)');
    box(X.II,46,120,196,'II','var(--sky)','var(--sky-soft)');
    E('circle',{cx:X.Q,cy:128,r:15,fill:'var(--amber)'},s);T(s,X.Q,134,'Q',{fs:18,w:800,fill:'var(--panel)'});
    box(X.III,62,74,186,'III','var(--sky)','var(--sky-soft)');
    E('circle',{cx:X.c,cy:82,r:15,fill:'var(--eosin)'},s);T(s,X.c,88,'c',{fs:20,w:800,fill:'var(--panel)'});
    box(X.IV,62,74,186,'IV','var(--sky)','var(--sky-soft)');
    /* ATP sintase */
    E('rect',{x:X.ATP-26,y:92,width:52,height:76,rx:10,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2.5},s);
    E('rect',{x:X.ATP-6,y:168,width:12,height:22,fill:'var(--eosin)'},s);
    E('ellipse',{cx:X.ATP,cy:210,rx:42,ry:22,fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':2.5},s);
    T(s,X.ATP,216,'F₁',{fs:18,w:800,fill:'var(--eosin)'});T(s,X.ATP,136,'F₀',{fs:18,w:800,fill:'var(--eosin)'});
    /* substratos */
    T(s,X.I,228,'NADH',{fs:18,w:700});T(s,X.II+15,228,'FADH₂',{fs:18,w:700});
    const o2c=c.blk==='O2'?'var(--bad)':'var(--ink)';T(s,X.IV,226,'O₂ → H₂O',{fs:18,w:700,fill:o2c});
    T(s,592,214,'ATP',{fs:19,w:800,a:'end',fill:c.atp>.2?'var(--ok)':'var(--muted)'});
    /* bloqueios */
    const xMark=(x,y)=>{E('circle',{cx:x,cy:y,r:20,fill:'var(--bad-soft)',stroke:'var(--bad)','stroke-width':3},s);
      E('path',{d:`M${x-9},${y-9} L${x+9},${y+9} M${x+9},${y-9} L${x-9},${y+9}`,stroke:'var(--bad)','stroke-width':4,fill:'none'},s)};
    if(c.blk==='I')xMark(X.I,58);if(c.blk==='IV')xMark(X.IV,58);if(c.blk==='ATP')xMark(X.ATP,62);
    /* vazamento */
    if(c.leak){E('rect',{x:X.leak-16,y:96,width:32,height:68,rx:10,fill:c.leak==='UCP1'?'var(--amber-soft)':'var(--bad-soft)',stroke:c.leak==='UCP1'?'var(--amber)':'var(--bad)','stroke-width':2.5},s);
      T(s,X.leak,88,c.leak,{fs:18,w:800,fill:c.leak==='UCP1'?'var(--amber)':'var(--bad)'})}
    /* prótons em movimento */
    const mv=(x,y0,y1,dur,beg)=>{const p=E('circle',{cx:x,cy:y0,r:6.5,fill:'var(--sky)',stroke:'var(--panel)','stroke-width':1.5},s);
      if(reduce){p.setAttribute('cy',(y0+y1)/2);return}
      E('animate',{attributeName:'cy',values:`${y0};${y1}`,dur:dur+'s',begin:beg+'s',repeatCount:'indefinite'},p);
      E('animate',{attributeName:'opacity',values:'0;1;1;0',dur:dur+'s',begin:beg+'s',repeatCount:'indefinite'},p)};
    const pump=[];if(c.e>0){if(c.blk!=='I')pump.push(X.I);pump.push(X.III,X.IV)}
    const sp=c.e>0?(2.6-1.4*c.e):0;
    pump.forEach((x,j)=>{mv(x+14,175,50,sp,j*.4);if(c.e>.5)mv(x-14,175,50,sp,j*.4+sp/2)});
    if(c.atp>.1)[0,1].forEach(j=>mv(X.ATP,50,195,2.4-1.2*c.atp,j*1.1));
    if(c.leak)[0,1,2].forEach(j=>mv(X.leak,50,190,1.1,j*.37));
    /* medidores */
    const M=[['Gradiente H⁺',c.g,'var(--sky)'],['Síntese de ATP',c.atp,'var(--ok)'],['Consumo de O₂',c.o2,'var(--hema-2)'],['Calor',c.heat,'var(--bad)']];
    M.forEach(([lab,v,col],j)=>{const y=284+j*36;T(s,10,y+18,lab,{fs:18,a:'start',w:600});
      E('rect',{x:178,y,width:410,height:24,rx:12,fill:'var(--paper)',stroke:'var(--line)','stroke-width':1.5},s);
      const w=Math.max(6,410*v);const r=E('rect',{x:178,y,width:w,height:24,rx:12,fill:col},s);
      if(!reduce)E('animate',{attributeName:'width',from:6,to:w,dur:'.7s',fill:'freeze'},r)});
    out.innerHTML=c.t};
  choices('#krrBtns',k=>draw(k));
})();
