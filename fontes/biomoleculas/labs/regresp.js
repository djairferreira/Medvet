const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;
/* ===== Escada mucociliar sob pressão ===== */
(()=>{const s=$('#depSvg');if(!s)return;
  const st={t:20,n:5,p:2,vir:false,tra:false};
  function calc(){let v=1;if(st.t<15)v*=1-(15-st.t)*0.02;v*=Math.max(.1,1-Math.max(0,st.n-10)/45);v*=1-0.04*st.p;if(st.vir)v*=0.35;
    let mac=1-0.05*st.p-(st.tra?0.35:0)-(st.vir?0.25:0);mac=Math.max(.1,mac);return {v:Math.max(.05,v),mac}}
  function draw(){clear(s);const {v,mac}=calc();const speed=10*v;
    /* lúmen e muco */
    E('rect',{x:20,y:52,width:560,height:50,rx:10,fill:'var(--amber-soft)',stroke:'var(--amber)'},s);
    T(s,300,84,'muco (gel) → faringe',{fs:18,fill:'var(--amber)',w:600});
    /* cílios e células */
    const lost=st.vir?0.45:0,stiff=Math.max(0,(st.n-20)/40);
    for(let k=0;k<14;k++){const x=40+k*40;E('rect',{x:x-18,y:160,width:36,height:70,rx:4,fill:'var(--sky-soft)',stroke:'var(--sky)'},s);
      E('circle',{cx:x,cy:200,r:8,fill:'var(--sky)'},s);
      if((k*7%10)/10<lost)continue;
      for(let c=-1;c<=1;c++){const l=E('line',{x1:x+c*9,y1:160,x2:x+c*9+(stiff>0.5?0:4),y2:160-48*(1-0.4*stiff),stroke:'var(--ink)','stroke-width':2.5},s);
        if(!reduce&&v>0.15){const a=E('animateTransform',{attributeName:'transform',type:'rotate',values:`-15 ${x+c*9} 160;20 ${x+c*9} 160;-15 ${x+c*9} 160`,dur:(0.5/v).toFixed(2)+'s',repeatCount:'indefinite'},l)}}}
    /* partículas e bactérias no muco */
    const nb=Math.round(2+(1-v)*14);
    for(let k=0;k<nb;k++){const x=40+(k*97)%520,y=72+(k*13)%24;const c=E('circle',{cx:x,cy:y,r:6,fill:k%3?'var(--hema)':'var(--muted)'},s);
      if(!reduce&&v>0.1){E('animate',{attributeName:'cx',values:`${x};${x+60}`,dur:(6/v).toFixed(1)+'s',repeatCount:'indefinite',additive:'replace'},c)}}
    T(s,300,268,'epitélio ciliado e células caliciformes',{fs:18,fill:'var(--muted)',w:500});
    T(s,140,30,'≈ '+speed.toFixed(1).replace('.',',')+' mm/min',{fs:20,fill:v<0.4?'var(--bad)':v<0.7?'var(--amber)':'var(--ok)'});
    T(s,450,30,'macrófagos '+Math.round(mac*100)+'%',{fs:20,fill:mac<0.5?'var(--bad)':mac<0.75?'var(--amber)':'var(--ok)'});
    const risk=(1-v)*0.55+(1-mac)*0.45;
    const nivel=risk>0.55?'<b style="color:var(--bad)">alto</b>':risk>0.3?'<b style="color:var(--amber)">moderado</b>':'<b style="color:var(--ok)">baixo</b>';
    let m=`Velocidade do muco ≈ ${speed.toFixed(1).replace('.',',')} mm/min (${Math.round(v*100)}% do normal); função dos macrófagos ${Math.round(mac*100)}%. Risco de pneumonia bacteriana: ${nivel}.`;
    const why=[];if(st.t<5)why.push('o ar frio e seco resfria a mucosa e torna a fase sol rasa');if(st.n>20)why.push('a amônia acima de 20–25 ppm causa ciliostase');
    if(st.p>5)why.push('a poeira satura os macrófagos alveolares');if(st.vir)why.push('o vírus destruiu células ciliadas');if(st.tra)why.push('o cortisol do transporte deprime neutrófilos e macrófagos');
    if(why.length)m+=' Por quê: '+why.join('; ')+'.';
    if(st.vir&&st.tra)m+=' Esta é a receita da <b>pneumonia do transporte</b> bovina por <i>Mannheimia haemolytica</i>.';
    $('#depOut').innerHTML=m;$('#depTV').textContent=st.t+' °C';$('#depNV').textContent=st.n+' ppm';$('#depPV').textContent=st.p}
  [['#depT','t'],['#depN','n'],['#depP','p']].forEach(([id,k])=>{const i=$(id);i.addEventListener('input',()=>{st[k]=+i.value;draw()})});
  const g=$('#depBtns');g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const k=b.dataset.k;st[k]=!st[k];b.setAttribute('aria-pressed',String(st[k]));draw()});
  draw();
})();
