const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;
/* ===== Intensidade de exercício: cavalo × cão ===== */
(()=>{const s=$('#exfSvg');if(!s)return;
  const f=(v,d=0)=>v.toFixed(d).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.');
  const st={sp:'cavalo',i:0,opt:'nada'};
  const M={
    cavalo:{ve:[70,1800],vo:[4,180],la:[1,30],pa:[60,100],fc:[30,240],ht:[30,70],thr:.62},
    cao:{ve:[5,130],vo:[6,160],la:[1,14],pa:[60,100],fc:[60,320],ht:[30,70],thr:.66}};
  function calc(){const i=st.i/100,sp=st.sp,h=st.opt==='calor',fu=st.opt==='furo'&&sp==='cavalo';const m=M[sp];
    const thr=m.thr-(h?.08:0);let r={};
    if(sp==='cavalo'){r.ve=70+1650*Math.pow(i,1.15);r.vo=4+176*i;r.fc=35+205*i+(h?12*i:0);
      r.ht=38+24*Math.min(1,i/0.45)+(fu?2*i:0);r.pa=95-32*Math.pow(Math.max(0,(i-0.4)/0.6),1.3)+(h?-2*i:0);r.pc=40+18*Math.pow(Math.max(0,(i-0.5)/0.5),1.2)}
    else{r.ve=5+95*i+(h?30*i:0);r.vo=6+144*i;r.fc=90+200*i+(h?15*i:0);r.ht=46+14*Math.min(1,i/0.45);r.pa=95-4*i;r.pc=40-(i>thr?8*(i-thr)/(1-thr):0)-(h?3*i:0)}
    const top=m.la[1]-1;r.la=1+0.4*i+(i>thr?top*Math.pow((i-thr)/(1-thr),2):0)+(h&&i>thr?1.5:0);r.la=Math.min(r.la,m.la[1]);
    return r}
  function draw(){clear(s);const r=calc(),m=M[st.sp];
    const rows=[['Ventilação','ve',v=>f(v)+' L/min','var(--sky)'],['V̇O₂','vo',v=>f(v)+' mL/kg/min','var(--ok)'],['Lactato','la',v=>f(v,1)+' mmol/L','var(--amber)'],
      ['PaO₂','pa',v=>f(v)+' mmHg',null],['Freq. card.','fc',v=>f(v)+' bpm','var(--hema)'],['Hematócrito','ht',v=>f(v)+'%','var(--eosin)']];
    const X0=150,X1=430;
    rows.forEach((row,k)=>{const y=22+k*52,[lo,hi]=m[row[1]],v=r[row[1]];const w=Math.max(3,(X1-X0)*Math.min(1,(v-lo)/(hi-lo)));
      let col=row[3];if(row[1]==='pa')col=v<75?'var(--bad)':v<85?'var(--amber)':'var(--ok)';
      T(s,X0-10,y+26,row[0],{fs:18,a:'end'});
      E('rect',{x:X0,y:y+6,width:X1-X0,height:28,rx:6,fill:'var(--panel)',stroke:'var(--line)'},s);
      E('rect',{x:X0,y:y+6,width:w,height:28,rx:6,fill:col},s);
      T(s,X1+8,y+26,row[2](v),{fs:18,a:'start',w:500})});
    const i=st.i/100,thr=M[st.sp].thr-(st.opt==='calor'?.08:0);
    E('line',{x1:X0+(X1-X0)*thr,y1:6,x2:X0+(X1-X0)*thr,y2:330,stroke:'var(--muted)','stroke-dasharray':'4 5'},s);
    T(s,X0+(X1-X0)*thr,334,'limiar',{fs:18,fill:'var(--muted)',w:500});
    let msg=`<b>${st.sp==='cavalo'?'Cavalo PSI':'Cão atlético'} a ${st.i}% do V̇O₂máx.</b> PaCO₂ ≈ ${f(r.pc)} mmHg. `;
    if(i<0.05)msg+='Repouso: gases arteriais normais, hematócrito basal.';
    else if(i<thr)msg+='Abaixo do limiar de lactato: hiperpneia proporcional ao CO₂ produzido; a PaCO₂ e a PaO₂ quase não mudam. '+(st.sp==='cavalo'?'O baço já contraiu e o hematócrito subiu (autotransfusão).':'O cão pode respirar desacoplado do passo e ofegar para perder calor.');
    else msg+='Acima do limiar: o lactato sobe exponencialmente. '+(st.sp==='cavalo'?'No galope a respiração fica presa à passada (1:1): a PaCO₂ sobe e a PaO₂ cai (hipoxemia induzida pelo exercício por limitação de difusão e hipoventilação relativa).':'O H⁺ estimula os corpos carotídeos e a ventilação cresce mais que o CO₂: a PaCO₂ cai (compensação respiratória). A PaO₂ se mantém, ao contrário do cavalo.');
    if(st.opt==='furo')msg+=st.sp==='cavalo'?' <b>Furosemida:</b> reduz a volemia e as pressões vasculares pulmonares; a hipoxemia quase não muda, mas o risco de HPIE '+(i>0.7?'cai de alto para moderado.':'fica baixo nessa intensidade.'):' (A furosemida pré-corrida é uma prática do cavalo; no cão não se aplica.)';
    else if(st.sp==='cavalo'&&i>0.7)msg+=' <b>Risco de HPIE alto:</b> pressão na artéria pulmonar acima de 90 mmHg e pressão alveolar muito negativa.';
    if(st.opt==='calor')msg+=st.sp==='cao'?' <b>Calor úmido:</b> o ofego evapora pouco, a ventilação sobe sem resfriar e a temperatura caminha para a hipertermia por esforço.':' <b>Calor úmido:</b> FC mais alta para a mesma velocidade e limiar mais precoce; o suor evapora mal.';
    $('#exfOut').innerHTML=msg;$('#exfIV').textContent=st.i+'%'}
  const sl=$('#exfI');sl.addEventListener('input',()=>{st.i=+sl.value;draw()});
  choices('#exfSp',k=>{st.sp=k;draw()});choices('#exfOpt',k=>{st.opt=k;draw()});
})();
