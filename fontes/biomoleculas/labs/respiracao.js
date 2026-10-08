const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;
const fmt=(v,d=0)=>v.toFixed(d).replace('.',',');

/* ===== 1. Curva de dissociação da hemoglobina ===== */
(()=>{const s=$('#hbSvg');if(!s)return;
  const SP={
    cao:{n:'Cão',p50:30,t:38.5,hb:15,dpg:0.12,nh:2.7,nota:'Hemácia rica em 2,3-DPG; Hb sensível a ele.'},
    equino:{n:'Equino',p50:24,t:37.8,hb:13,dpg:0.12,nh:2.7,nota:'P50 baixa (alta afinidade); no exercício o baço eleva o hematócrito.'},
    bovino:{n:'Bovino',p50:27,t:38.6,hb:11,dpg:0.02,nh:2.7,nota:'Pouco 2,3-DPG na hemácia; Hb pouco responsiva a ele. O feto tem hemoglobina fetal própria.'},
    gato:{n:'Gato',p50:36,t:38.5,hb:12,dpg:0.02,nh:2.6,nota:'Hb de afinidade intrinsecamente baixa e pouco sensível ao 2,3-DPG.'},
    ave:{n:'Galinha',p50:48,t:41.5,hb:9,dpg:0,nh:2.9,nota:'Nas aves o modulador é o inositol pentafosfato, não o 2,3-DPG (o controle de DPG não tem efeito).'}};
  const st={sp:'cao',ph:7.40,t:38.5,c:40,d:100,x:0,link:true,base:true,mb:false,fetal:false};
  const X0=70,X1=580,Y0=320,Y1=30,PMAX=120;
  const px=p=>X0+(X1-X0)*p/PMAX, py=v=>Y0-(Y0-Y1)*v/100;
  const hill=(p,p50,n)=>100*Math.pow(p,n)/(Math.pow(p,n)+Math.pow(p50,n));
  const ids={ph:'hbPh',t:'hbT',c:'hbC',d:'hbD',x:'hbX'};
  function p50now(){const k=SP[st.sp];let lg=Math.log10(k.p50)-0.48*(st.ph-7.4)+0.024*(st.t-k.t)+0.06*Math.log10(st.c/40)+k.dpg*(st.d-100)/100;
    let p=Math.pow(10,lg);if(st.x>0)p*=1-0.5*st.x/100;return p}
  function path(f,col,w,dash){let d='';for(let p=0;p<=PMAX;p+=1)d+=(p?'L':'M')+px(p).toFixed(1)+' '+py(f(p)).toFixed(1)+' ';
    return E('path',{d,fill:'none',stroke:col,'stroke-width':w,'stroke-dasharray':dash||null},s)}
  function sync(){const V={ph:fmt(st.ph,2),t:fmt(st.t,1)+' °C',c:st.c+' mmHg',d:st.d+'%',x:st.x+'%'};
    for(const k in ids){const i=$('#'+ids[k]);if(i)i.value=st[k];const o=$('#'+ids[k]+'V');if(o)o.textContent=V[k]}}
  function draw(){sync();clear(s);const k=SP[st.sp];
    for(let v=0;v<=100;v+=25){E('line',{x1:X0,y1:py(v),x2:X1,y2:py(v),stroke:'var(--line)'},s);T(s,X0-8,py(v)+6,v+'',{fs:18,a:'end',w:500,fill:'var(--muted)'})}
    for(let p=0;p<=PMAX;p+=20){E('line',{x1:px(p),y1:Y0,x2:px(p),y2:Y0+6,stroke:'var(--muted)'},s);T(s,px(p),Y0+26,p+'',{fs:18,w:500,fill:'var(--muted)'})}
    E('line',{x1:X0,y1:Y0,x2:X1,y2:Y0,stroke:'var(--ink)','stroke-width':1.5},s);E('line',{x1:X0,y1:Y0,x2:X0,y2:Y1,stroke:'var(--ink)','stroke-width':1.5},s);
    T(s,(X0+X1)/2,Y0+54,'PO₂ (mmHg)',{fs:18,w:600,fill:'var(--muted)'});
    T(s,22,py(50),'Saturação (%)',{fs:18,w:600,fill:'var(--muted)',extra:{transform:`rotate(-90 22 ${py(50)})`}});
    /* faixas tecido e pulmão */
    E('rect',{x:px(20),y:Y1,width:px(45)-px(20),height:Y0-Y1,fill:'var(--amber-soft)',opacity:.6},s);T(s,px(32.5),py(90),'tecidos',{fs:18,fill:'var(--amber)'});
    E('rect',{x:px(90),y:Y1,width:px(105)-px(90),height:Y0-Y1,fill:'var(--sky-soft)',opacity:.6},s);T(s,px(97.5),py(78),'pulmão',{fs:18,fill:'var(--sky)'});
    if(st.mb)path(p=>hill(p,2.8,1),'var(--eosin)',2.5,'7 5');
    if(st.fetal)path(p=>hill(p,k.p50*0.7,k.nh),'var(--ok)',2.5,'7 5');
    if(st.base)path(p=>hill(p,k.p50,k.nh),'var(--muted)',2,'4 5');
    const P=p50now(),f=1-st.x/100,cur=p=>hill(p,P,k.nh)*f;
    path(cur,'var(--hema)',4);
    /* P50 */
    if(f>0.5){const yy=py(50);E('line',{x1:X0,y1:yy,x2:px(P),y2:yy,stroke:'var(--hema-2)','stroke-dasharray':'3 4'},s);E('line',{x1:px(P),y1:yy,x2:px(P),y2:Y0,stroke:'var(--hema-2)','stroke-dasharray':'3 4'},s);
      T(s,px(P)+8,Y0-12,'P50 '+fmt(P,1),{fs:18,a:'start',fill:'var(--hema)'})}
    const sa=cur(100),sv=cur(40);
    [[100,sa],[40,sv]].forEach(([p,v])=>E('circle',{cx:px(p),cy:py(v),r:7,fill:'var(--hema)',stroke:'var(--paper)','stroke-width':2},s));
    T(s,px(100),py(sa)-14,fmt(sa,0)+'%',{fs:18,fill:'var(--hema)'});T(s,px(40)+10,py(sv)+26,fmt(sv,0)+'%',{fs:18,a:'start',fill:'var(--hema)'});
    const ca=1.34*k.hb*sa/100+0.003*100,cv=1.34*k.hb*sv/100+0.003*40,dP=P-k.p50;
    const dir=Math.abs(dP)<0.5?'praticamente na posição normal':dP>0?`deslocada para a <b>direita</b> (+${fmt(dP,1)} mmHg): afinidade menor, entrega mais fácil`:`deslocada para a <b>esquerda</b> (${fmt(dP,1)} mmHg): afinidade maior, a Hb segura o O₂`;
    let extra='';if(st.x>0)extra+=` <b>${st.x}% da Hb está bloqueada</b> (carboxi-Hb ou meta-Hb): o teto da curva baixa e a curva vai para a esquerda; a PaO₂ continua normal, mas o conteúdo de O₂ cai.`;
    if(st.d!==100&&k.dpg<0.05)extra+=` Nesta espécie o 2,3-DPG quase não muda a curva.`;
    $('#hbOut').innerHTML=`<b>${k.n}</b> · curva ${dir}. ${k.nota}${extra}<div class="re-kv"><span>P50 <b>${fmt(P,1)} mmHg</b></span><span>Saturação arterial (PO₂ 100) <b>${fmt(sa,0)}%</b></span><span>Saturação venosa (PO₂ 40) <b>${fmt(sv,0)}%</b></span><span>Conteúdo arterial <b>${fmt(ca,1)} mL/dL</b></span><span>O₂ entregue (a − v) <b>${fmt(ca-cv,1)} mL/dL</b></span></div>`}
  const hh=c=>Math.max(7,Math.min(7.7,6.1+Math.log10(24/(0.03*c))));
  for(const k in ids){const i=$('#'+ids[k]);if(!i)continue;i.addEventListener('input',()=>{st[k]=+i.value;if(k==='c'&&st.link)st.ph=Math.round(hh(st.c)*100)/100;if(k==='ph'&&st.link){st.link=false;const b=$('#hbRef [data-k="link"]');if(b)b.setAttribute('aria-pressed','false')}draw()})}
  const g=$('#hbRef');if(g)g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const k=b.dataset.k;st[k]=!st[k];b.setAttribute('aria-pressed',String(st[k]));if(k==='link'&&st.link)st.ph=Math.round(hh(st.c)*100)/100;draw()});
  let ready=false;
  choices('#hbSp',k=>{st.sp=k;st.t=SP[k].t;if(ready)draw()});
  const PRE={normal:{ph:7.40,c:40,d:100,x:0,dt:0},exerc:{ph:7.20,c:62,d:100,x:0,dt:2.5},alt:{ph:7.44,c:34,d:160,x:0,dt:0},estoc:{ph:7.40,c:40,d:10,x:0,dt:0},co:{ph:7.40,c:40,d:100,x:40,dt:0}};
  choices('#hbPreset',k=>{const p=PRE[k];Object.assign(st,{ph:p.ph,c:p.c,d:p.d,x:p.x,t:SP[st.sp].t+p.dt});draw()});
  ready=true;draw();
})();

/* ===== 2. Fluxo de ar na ave (dois ciclos) ===== */
(()=>{if(!$('#avSvg'))return;
  const POS={fora:[40,62],traq:[150,62],caud:[500,200],pulm:[330,100],cran:[120,210]};
  const steps=[
    ['Visão geral','Pulmão rígido no centro (parabrônquios), sacos aéreos <b>craniais</b> à frente e <b>caudais</b> atrás. Os sacos são o fole; o pulmão não muda de volume. Acompanhe o lote de ar <b style="color:var(--amber)">A</b>.',{A:'fora'},[]],
    ['1ª inspiração','O esterno desce e todos os sacos se expandem. O lote A desce pela traqueia e pelo mesobrônquio e vai, em sua maior parte, para os <b>sacos aéreos caudais</b> (passa direto pela entrada dos ventrobrônquios, que funciona como válvula aerodinâmica).',{A:'caud'},[['traq','caud']]],
    ['1ª expiração','O esterno sobe e comprime os sacos. O ar dos sacos caudais é empurrado pelos dorsobrônquios para dentro dos <b>parabrônquios</b>, de caudal para cranial. É aqui que o lote A troca gases.',{A:'pulm'},[['caud','pulm']]],
    ['2ª inspiração','Os sacos se expandem de novo: o lote A sai do pulmão e vai para os <b>sacos craniais</b>. Ao mesmo tempo, um lote novo <b style="color:var(--sky)">B</b> entra e vai para os sacos caudais. No pulmão, o fluxo continua no mesmo sentido.',{A:'cran',B:'caud'},[['pulm','cran'],['traq','caud']]],
    ['2ª expiração','O lote A sai dos sacos craniais pela traqueia para o exterior, enquanto o lote B atravessa os parabrônquios. Resultado: <b>fluxo unidirecional e contínuo</b> no pulmão, nas duas fases, e cada lote precisa de <b>dois ciclos</b> completos.',{A:'fora',B:'pulm'},[['cran','fora'],['caud','pulm']]]];
  stepper('av',steps,(s,i)=>{
    E('ellipse',{cx:120,cy:210,rx:85,ry:55,fill:'var(--sky-soft)',stroke:'var(--sky)','stroke-width':2},s);T(s,120,284,'Sacos craniais',{fs:18});
    E('ellipse',{cx:500,cy:200,rx:88,ry:62,fill:'var(--amber-soft)',stroke:'var(--amber)','stroke-width':2},s);T(s,500,290,'Sacos caudais',{fs:18});
    E('rect',{x:230,y:60,width:200,height:85,rx:16,fill:'var(--hema-soft)',stroke:'var(--hema)','stroke-width':2},s);
    for(let y=75;y<140;y+=14)E('line',{x1:242,y1:y,x2:418,y2:y,stroke:'var(--hema-2)','stroke-width':2,opacity:.6},s);
    T(s,330,40,'Pulmão (parabrônquios)',{fs:18,fill:'var(--hema)'});
    E('path',{d:'M10 62 H200 Q215 62 215 80 V170 H430 Q470 170 470 190',fill:'none',stroke:'var(--muted)','stroke-width':5},s);
    T(s,90,40,'Traqueia',{fs:18,fill:'var(--muted)'});
    E('path',{d:'M425 170 V140',stroke:'var(--muted)','stroke-width':3,fill:'none'},s);E('path',{d:'M235 100 H200 V170',stroke:'var(--muted)','stroke-width':3,fill:'none'},s);
    E('path',{d:'M410 102 L260 102',stroke:'var(--hema)','stroke-width':3,fill:'none','marker-end':'url(#avArr)'},s);
    const df=E('defs',{},s),m=E('marker',{id:'avArr',viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:6,markerHeight:6,orient:'auto'},df);E('path',{d:'M0 0L10 5L0 10z',fill:'var(--ink)'},m);
    const st=steps[i];
    st[3].forEach(([a,b],j)=>{const [x1,y1]=POS[a],[x2,y2]=POS[b];const mx=(x1+x2)/2,my=Math.min(y1,y2)-30;
      const p=E('path',{d:`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`,fill:'none',stroke:j===0?'var(--amber)':'var(--sky)','stroke-width':4,'stroke-dasharray':'10 8','marker-end':'url(#avArr)'},s);
      if(!reduce)E('animate',{attributeName:'stroke-dashoffset',values:'36;0',dur:'0.9s',repeatCount:'indefinite'},p)});
    Object.entries(st[2]).forEach(([k,pos])=>{const [x,y]=POS[pos];const c=k==='A'?'var(--amber)':'var(--sky)';
      E('circle',{cx:x,cy:y,r:17,fill:c,stroke:'var(--paper)','stroke-width':3},s);T(s,x,y+7,k,{fs:20,w:800,fill:'var(--paper)'})});
  });
})();
