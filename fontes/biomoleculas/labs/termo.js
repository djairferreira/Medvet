const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;
const fmt=(v,d=0)=>v.toFixed(d).replace('.',',');

/* ===== 1. Zona de termoneutralidade ===== */
(()=>{const s=$('#tzSvg');if(!s)return;
  const D={
    vaca:{n:'Vaca holandesa em lactação',tci:-5,tcs:24,tli:-30,thi:30,tb:38.6,k:2.2,obs:'Muito calor metabólico e de fermentação: tolera bem o frio, sofre com calor acima de ~24 °C (ITU > 68–72).'},
    zebu:{n:'Zebuíno (Nelore)',tci:5,tcs:32,tli:-15,thi:38,tb:38.8,k:2.4,obs:'Mais glândulas sudoríparas, pelame curto e claro, menor metabolismo: TCS bem mais alta que a do taurino.'},
    bez:{n:'Bezerro recém-nascido',tci:12,tcs:26,tli:-5,thi:33,tb:39,k:4,obs:'Gordura parda ajuda nas primeiras horas; bezerro molhado e com vento perde calor muito mais rápido.'},
    leitao:{n:'Leitão recém-nascido',tci:31,tcs:35,tli:20,thi:38,tb:39,k:9,obs:'Sem UCP1 funcional e quase sem gordura: depende de tremor e de fonte de calor (escamoteador).'},
    porca:{n:'Suíno em terminação',tci:14,tcs:23,tli:-5,thi:29,tb:39,k:3,obs:'Quase não sua: no calor reduz a ingestão e o ganho de peso; aspersão e piso frio ajudam.'},
    pinto:{n:'Pinto de 1 dia',tci:31,tcs:34,tli:22,thi:38,tb:40.5,k:9,obs:'Termorregulação imatura: a temperatura do pinteiro é reduzida cerca de 3 °C por semana.'},
    frango:{n:'Frango adulto (5–6 semanas)',tci:16,tcs:24,tli:0,thi:30,tb:41.5,k:3.5,obs:'Sem sudorese e com muita massa muscular: o calor é a maior causa de mortalidade em lotes pesados.'},
    ovelha:{n:'Ovelha lanada',tci:-3,tcs:28,tli:-25,thi:36,tb:39.2,k:2,obs:'A lã isola contra o frio e contra a radiação solar; perde calor principalmente pelo ofego.'},
    tosq:{n:'Ovelha recém-tosquiada',tci:20,tcs:32,tli:5,thi:38,tb:39.2,k:4,obs:'Perde o isolamento da lã: a TCI sobe muito. Tosquia antes de frente fria mata ovinos por hipotermia.'},
    cao:{n:'Cão adulto (pelame médio)',tci:18,tcs:30,tli:-5,thi:34,tb:38.6,k:3,obs:'Valores dependem muito da raça e da pelagem; braquicefálicos e obesos têm TCS mais baixa.'}};
  let sp='vaca',ta=20;const X0=60,X1=585,Y0=280,Y1=40,TMIN=-20,TMAX=45,HMAX=260;
  const px=t=>X0+(X1-X0)*(t-TMIN)/(TMAX-TMIN),py=h=>Y0-(Y0-Y1)*Math.min(h,HMAX)/HMAX;
  function H(d,t){if(t>=d.tci&&t<=d.tcs)return 100;
    if(t<d.tci){const peak=100+(d.tci-d.tli)*d.k;if(t>=d.tli)return 100+(d.tci-t)*d.k;return Math.max(30,peak-(d.tli-t)*d.k*2)}
    return 100+(t-d.tcs)*2.2+(t>d.thi?(t-d.thi)*4:0)}
  function Tb(d,t){if(t<d.tli)return d.tb-(d.tli-t)*0.45;if(t>d.thi)return d.tb+(t-d.thi)*0.4;return d.tb}
  function draw(){clear(s);const d=D[sp];
    const a=Math.max(TMIN,d.tci),b=Math.min(TMAX,d.tcs);
    if(d.tli>TMIN)E('rect',{x:X0,y:Y1,width:px(d.tli)-X0,height:Y0-Y1,fill:'var(--sky-soft)'},s);
    if(d.thi<TMAX)E('rect',{x:px(d.thi),y:Y1,width:X1-px(d.thi),height:Y0-Y1,fill:'var(--hema-soft)'},s);
    E('rect',{x:px(a),y:Y1,width:px(b)-px(a),height:Y0-Y1,fill:'var(--ok-soft)'},s);
    T(s,(px(a)+px(b))/2,Y1+24,'ZTN',{fs:20,w:800,fill:'var(--ok)'});
    for(let h=0;h<=250;h+=50){E('line',{x1:X0,y1:py(h),x2:X1,y2:py(h),stroke:'var(--line)'},s);T(s,X0-6,py(h)+6,h+'',{fs:18,a:'end',w:500,fill:'var(--muted)'})}
    for(let t=-20;t<=40;t+=10)T(s,px(t),Y0+26,t+'',{fs:18,w:500,fill:'var(--muted)'});
    E('line',{x1:X0,y1:Y0,x2:X1,y2:Y0,stroke:'var(--ink)'},s);
    T(s,(X0+X1)/2,Y0+52,'Temperatura ambiente (°C)',{fs:18,fill:'var(--muted)'});
    T(s,18,(Y0+Y1)/2,'Calor produzido (% basal)',{fs:18,fill:'var(--muted)',extra:{transform:`rotate(-90 18 ${(Y0+Y1)/2})`}});
    [[d.tci,'TCI'],[d.tcs,'TCS']].forEach(([t,l])=>{if(t<TMIN||t>TMAX)return;E('line',{x1:px(t),y1:Y1,x2:px(t),y2:Y0,stroke:'var(--ink)','stroke-dasharray':'5 5'},s);T(s,px(t),Y0-10,l,{fs:18,w:700})});
    let dd='';for(let t=TMIN;t<=TMAX;t+=0.5)dd+=(t===TMIN?'M':'L')+px(t).toFixed(1)+' '+py(H(d,t)).toFixed(1)+' ';
    E('path',{d:dd,fill:'none',stroke:'var(--hema)','stroke-width':4},s);
    const h=H(d,ta),tb=Tb(d,ta);
    E('line',{x1:px(ta),y1:Y1,x2:px(ta),y2:Y0,stroke:'var(--amber)','stroke-width':2},s);
    E('circle',{cx:px(ta),cy:py(h),r:9,fill:'var(--amber)',stroke:'var(--paper)','stroke-width':3},s);
    let z,zc,mec;
    if(ta<d.tli){z='Hipotermia';zc='var(--sky)';mec='A produção máxima de calor não compensa a perda. A temperatura corporal cai, o metabolismo desacelera (Q₁₀), o tremor cessa e o animal entra em torpor: risco de morte. Aquecer, secar, dar energia (colostro, glicose).'}
    else if(ta<d.tci){z='Estresse por frio';zc='var(--sky)';mec='Abaixo da TCI o isolamento já está no máximo, então a <b>produção de calor aumenta</b>: tremor, termogênese sem tremor (gordura parda nos neonatos que a têm), mais T₃/T₄ e catecolaminas, mais apetite. Mantêm-se vasoconstrição, piloereção, postura encolhida e agrupamento. Gasta-se alimento para gerar calor em vez de leite, carne ou ovos.'}
    else if(ta<=(d.tci+d.tcs)/2){z='ZTN (lado frio)';zc='var(--ok)';mec='Produção de calor mínima. Ajustes baratos: vasoconstrição cutânea moderada, piloereção, postura mais fechada, buscar abrigo do vento.'}
    else if(ta<=d.tcs){z='ZTN (lado quente)';zc='var(--ok)';mec='Produção de calor mínima. Vasodilatação cutânea, postura esticada, busca de sombra; a evaporação começa a subir.'}
    else if(ta<=d.thi){z='Estresse por calor';zc='var(--amber)';mec='Acima da TCS a perda de calor sensível não basta: <b>sudorese e/ou ofego</b>, mais consumo de água, menor ingestão de alimento e menor produção. A produção de calor sobe um pouco (trabalho respiratório). Sombra, aspersão e ventilação.'}
    else {z='Hipertermia';zc='var(--hema)';mec='A perda máxima de calor (evaporação no limite) é insuficiente: a temperatura corporal sobe, e o próprio aumento acelera o metabolismo (ciclo vicioso). Risco de insolação. Resfriamento físico imediato.'}
    $('#tzTaV').textContent=ta+' °C';
    $('#tzOut').innerHTML=`<b>${d.n}</b> · ZTN aproximada ${d.tci} a ${d.tcs} °C · ambiente ${ta} °C<br><span class="te-zone" style="background:${zc}">${z}</span> Calor produzido ≈ <b>${fmt(h,0)}%</b> do basal · temperatura corporal ≈ <b>${fmt(tb,1)} °C</b><br>${mec}<br><span style="color:var(--muted)">${d.obs} Valores aproximados: variam com pelagem, nutrição, vento, umidade e radiação.</span>`}
  const r=$('#tzTa');if(r)r.addEventListener('input',()=>{ta=+r.value;draw()});
  choices('#tzSp',k=>{sp=k;draw()});
})();

/* ===== 2. Febre × hipertermia ===== */
(()=>{if(!$('#fbSvg'))return;
  /* pontos (tempo 0..10) de ponto de ajuste e temperatura corporal por etapa */
  const SP=[[0,38.5],[2,38.5],[2.01,40.5],[6,40.5],[6.01,38.5],[10,38.5]];
  const TB=[[0,38.5],[2,38.5],[3.6,40.4],[6,40.5],[7.6,38.6],[10,38.5]];
  const HY=[[0,38.5],[2,38.5],[5,41],[7,42.2],[8,41.5],[10,39.5]];
  const steps=[
    ['Normotermia','Ponto de ajuste (tracejado) e temperatura corporal (linha cheia) coincidem em ~38,5 °C. O hipotálamo só faz ajustes pequenos.',2,0],
    ['Pirógenos sobem o ponto de ajuste','IL-1, IL-6 e TNF induzem COX-2 e PGE₂ no hipotálamo: o ponto de ajuste salta para ~40,5 °C. A temperatura real ainda é 38,5 °C, então o animal <b>sente frio</b>: vasoconstrição, piloereção, <b>calafrios</b>, extremidades frias, procura abrigo.',2.3,0],
    ['Subida e platô','Tremor e conservação de calor levam a temperatura até o novo ponto de ajuste. No platô os mecanismos se equilibram de novo, agora em 40,5 °C: apatia, anorexia, taquicardia, maior consumo de O₂.',6,0],
    ['Defervescência (“crise”)','A infecção é controlada ou um AINE bloqueia a síntese de PGE₂: o ponto de ajuste volta a 38,5 °C. Agora o corpo está <b>quente demais</b> para o hipotálamo: vasodilatação, sudorese, ofego, até a temperatura baixar.',10,0],
    ['Compare: hipertermia (insolação)','Linha vermelha: o ponto de ajuste <b>não muda</b>. Calor ambiental e retenção de calor superam a perda máxima; a temperatura passa de 41–42 °C, com todos os mecanismos de perda já no máximo. Antipiréticos não ajudam: é preciso <b>resfriamento físico</b> (água à temperatura ambiente + ventilação).',10,1]];
  const X0=70,X1=580,Y0=250,Y1=30,px=t=>X0+(X1-X0)*t/10,py=v=>Y0-(Y0-Y1)*(v-36.8)/6;
  const line=(s,pts,tm,col,w,dash)=>{let d='';pts.forEach(([t,v],i)=>{if(t>tm+1e-6)return;d+=(i?'L':'M')+px(t).toFixed(1)+' '+py(v).toFixed(1)+' '});
    const last=pts.filter(p=>p[0]<=tm+1e-6).pop(),nxt=pts.find(p=>p[0]>tm+1e-6);
    if(nxt&&last){const f=(tm-last[0])/(nxt[0]-last[0]);d+='L'+px(tm).toFixed(1)+' '+py(last[1]+f*(nxt[1]-last[1])).toFixed(1)}
    const p=E('path',{d,fill:'none',stroke:col,'stroke-width':w,'stroke-dasharray':dash||null},s);return p};
  stepper('fb',steps,(s,i)=>{const st=steps[i];
    for(let v=38;v<=42;v+=1){E('line',{x1:X0,y1:py(v),x2:X1,y2:py(v),stroke:'var(--line)'},s);T(s,X0-8,py(v)+6,v+' °C',{fs:18,a:'end',w:500,fill:'var(--muted)'})}
    E('line',{x1:X0,y1:Y0,x2:X1,y2:Y0,stroke:'var(--ink)'},s);T(s,(X0+X1)/2,Y0+34,'tempo →',{fs:18,fill:'var(--muted)'});
    if(st[3]===0){line(s,SP,st[2],'var(--sky)',3,'9 6');line(s,TB,st[2],'var(--hema)',4);
      T(s,X0+12,Y0-34,'— — ponto de ajuste',{fs:18,a:'start',fill:'var(--sky)'});T(s,X0+12,Y0-10,'—— temperatura corporal',{fs:18,a:'start',fill:'var(--hema)'})}
    else{line(s,[[0,38.5],[10,38.5]],10,'var(--sky)',3,'9 6');line(s,HY,10,'var(--bad)',4);line(s,TB,10,'var(--muted)',2,'3 5');
      T(s,X0+12,Y0-34,'—— hipertermia',{fs:18,a:'start',fill:'var(--bad)'});T(s,X0+12,Y0-10,'· · · febre (comparação)',{fs:18,a:'start',fill:'var(--muted)'})}
  });
})();
