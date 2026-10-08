const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;

/* 1. Esquelético × liso: cascata do cálcio */
{const s=$('#lsSvg');if(s){const out=$('#lsOut'),prev=$('#lsPrev'),next=$('#lsNext');let tipo='esq',i=0;
  const C={
    esq:{cor:'var(--sky)',soft:'var(--sky-soft)',passos:[
      ['ACh → receptor nicotínico','Na placa motora, a acetilcolina abre o receptor nicotínico (canal iônico) e gera o potencial de placa, que dispara um potencial de ação. <i>Liso</i>: não há placa; varicosidades liberam transmissores à distância, e o mesmo transmissor pode contrair ou relaxar.'],
      ['Potencial de ação no túbulo T','O potencial de ação corre pelo sarcolema e mergulha nos túbulos T, chegando a todas as miofibrilas. <i>Liso</i>: sem túbulos T; cavéolas e células finas bastam.'],
      ['DHPR abre o RYR1 do RS','O sensor de voltagem (DHPR) abre mecanicamente o RYR1. Quase todo o cálcio vem do retículo; o cálcio de fora não é necessário.'],
      ['Ca²⁺ liga-se à troponina C','O cálcio sobe cerca de 100 vezes e liga-se à TnC, no filamento fino.'],
      ['Tropomiosina expõe a actina','A troponina muda de forma, a tropomiosina rola e os sítios da actina ficam livres. A regulação está no <b>filamento fino</b>.'],
      ['Pontes cruzadas rápidas','A miosina (sempre pronta, sem precisar de fosforilação) liga-se, faz o golpe de força e solta-se com ATP. Ciclos rápidos, alto gasto de ATP, força em milissegundos.'],
      ['SERCA recolhe o Ca²⁺: relaxa','Termina o estímulo, a SERCA bombeia o cálcio ao RS e a tropomiosina volta a cobrir a actina. Relaxamento em dezenas de milissegundos.']]},
    liso:{cor:'var(--eosin)',soft:'var(--eosin-soft)',passos:[
      ['Nervo, hormônio ou estiramento','Muitos gatilhos: noradrenalina (α1), acetilcolina (M3), ocitocina, histamina, angiotensina II, estiramento da parede, ondas lentas das células de Cajal.'],
      ['Ca²⁺ entra e o IP₃ libera do RS','O cálcio entra por canais tipo L, operados por receptor e por estiramento; receptores G<sub>q</sub> geram IP<sub>3</sub>, que libera cálcio do retículo. Sem cálcio extracelular, a contração falha (alvo do anlodipino).'],
      ['Ca²⁺ liga-se à calmodulina','Quatro Ca<sup>2+</sup> ligam-se à calmodulina, no citosol. Não há troponina.'],
      ['Ca²⁺-calmodulina ativa a MLCK','O complexo ativa a quinase da cadeia leve da miosina. O AMPc/PKA (agonistas β2, como o clembuterol) inibe a MLCK e relaxa.'],
      ['MLCK fosforila a miosina','A cadeia leve reguladora é fosforilada e a ATPase da miosina é ligada. A regulação está no <b>filamento grosso</b>.'],
      ['Pontes cruzadas lentas e trava','Ciclos lentos e econômicos. Mesmo com o cálcio caindo, as pontes desfosforiladas presas mantêm a força (mecanismo de trava): tônus por horas.'],
      ['MLCP desfosforila: relaxa','O cálcio sai (SERCA, bomba de membrana, trocador Na<sup>+</sup>/Ca<sup>2+</sup>) e a fosfatase da cadeia leve (MLCP) retira o fosfato. O GMPc (óxido nítrico, sildenafil) ativa a MLCP; a Rho-quinase a inibe. Relaxamento lento, em segundos.']]}};
  const draw=()=>{clear(s);const c=C[tipo],P=c.passos;
    T(s,300,26,tipo==='esq'?'Músculo esquelético':'Músculo liso',{fs:22,w:800,fill:c.cor});
    P.forEach((p,k)=>{const y=40+k*42,on=k===i,done=k<i;
      E('rect',{x:40,y,width:520,height:34,rx:10,fill:on?c.cor:done?c.soft:'var(--panel)',stroke:on||done?c.cor:'var(--line)','stroke-width':2},s);
      T(s,64,y+24,String(k+1),{a:'start',fs:18,w:800,fill:on?'var(--panel)':c.cor});
      T(s,92,y+24,p[0],{a:'start',fs:18,fill:on?'var(--panel)':'var(--ink)'});
      if(k<P.length-1)E('path',{d:`M300,${y+35} L300,${y+41}`,stroke:'var(--muted)','stroke-width':2},s)});
    if(!reduce){const r=$$('rect',s)[i];if(r&&r.animate)r.animate([{opacity:.4},{opacity:1}],{duration:400})}
    out.innerHTML=`<span class="mono" style="color:var(--muted)">${i+1} de ${P.length}</span> · <b>${P[i][0]}</b><br>${P[i][1]}`;
    prev.disabled=i===0;next.textContent=i===P.length-1?'Recomeçar ↺':'Próxima etapa →'};
  prev.addEventListener('click',()=>{i=Math.max(0,i-1);draw()});
  next.addEventListener('click',()=>{i=i===C[tipo].passos.length-1?0:i+1;draw()});
  choices('#lsBtns',k=>{tipo=k;draw()})}}

/* 2. Contrai ou relaxa? */
{const s=$('#lqSvg');if(s){const out=$('#lqOut'),g=$('#lqBtns');
  const CASOS=[
    ['Ocitocina','miométrio a termo','c','Receptor de ocitocina → G<sub>q</sub> → IP<sub>3</sub> e Ca<sup>2+</sup>; também estimula PGF<sub>2α</sub>. Base das contrações do parto.'],
    ['Clembuterol','miométrio da vaca','r','Agonista β2 → AMPc → PKA inibe a MLCK: tocolítico usado em manobras obstétricas.'],
    ['Adrenalina','músculo liso bronquial','r','β2 → AMPc: broncodilatação (por isso é usada na anafilaxia).'],
    ['Histamina','músculo liso bronquial','c','H1 → G<sub>q</sub> → IP<sub>3</sub>: broncoespasmo na alergia e na anafilaxia.'],
    ['Acetilcolina','músculo liso intestinal','c','M3 → G<sub>q</sub>: aumenta a motilidade (parassimpático = “descansar e digerir”).'],
    ['Nitroglicerina','arteríola','r','Doador de NO → guanilato ciclase → GMPc → PKG ativa a MLCP: vasodilatação.'],
    ['Noradrenalina','arteríola da pele','c','α1 → G<sub>q</sub> → IP<sub>3</sub> e Rho-quinase: vasoconstrição.'],
    ['Anlodipino','arteríola de gato hipertenso','r','Bloqueia canais de Ca<sup>2+</sup> tipo L: menos cálcio extracelular entra e o vaso dilata.'],
    ['Butilescopolamina','intestino de equino com cólica espasmódica','r','Antimuscarínico: bloqueia o M3 e reduz o espasmo intestinal.'],
    ['PGF₂α','miométrio','c','Receptor FP → G<sub>q</sub>: contrai o útero (parto, piometra aberta, involução).'],
    ['Sildenafil','artéria pulmonar de cão','r','Inibe a PDE5, o GMPc dura mais e o vaso relaxa: tratamento da hipertensão pulmonar.'],
    ['Alcaloides do ergot','artérias das extremidades','c','Vasoconstrição prolongada (α e serotonina): gangrena de cauda, orelhas e cascos.'],
    ['Atropina','músculo constritor da pupila','r','Bloqueia o M3 do esfíncter da íris: midríase.'],
    ['Betanecol','detrusor da bexiga','c','Agonista muscarínico M3: ajuda a esvaziar a bexiga atônica.'],
    ['Prazosina','músculo liso da uretra','r','Bloqueia o α1: a uretra relaxa e a urina passa (gatos após obstrução).'],
    ['Hipocalcemia','útero da vaca no parto','r','Sem cálcio extracelular, o liso uterino perde força: inércia uterina, retenção de placenta.']];
  let fila=shuffle(CASOS),cur=null,lock=false,sc=[0,0],cell;
  const base=()=>{clear(s);cell=E('g',{style:'transform-box:fill-box;transform-origin:center'},s);
    E('path',{d:'M60,100 Q300,40 540,100 Q300,160 60,100 Z',fill:'var(--eosin-soft)',stroke:'var(--eosin)','stroke-width':3},cell);
    E('ellipse',{cx:300,cy:100,rx:34,ry:14,fill:'var(--hema-soft)',stroke:'var(--hema-2)','stroke-width':2},cell);
    [[150,85,240,115],[360,85,450,115],[150,115,240,85],[360,115,450,85]].forEach(([a,b,c,d])=>E('line',{x1:a,y1:b,x2:c,y2:d,stroke:'var(--eosin)','stroke-width':4},cell));
    [[150,85],[240,115],[360,85],[450,115],[150,115],[240,85],[360,115],[450,85]].forEach(([x,y])=>E('circle',{cx:x,cy:y,r:6,fill:'var(--bone-ink)'},cell));
    T(s,300,190,cur?cur[0]+' → '+cur[1]:'',{fs:18,fill:'var(--muted)'})};
  const nova=()=>{if(!fila.length)fila=shuffle(CASOS);cur=fila.pop();lock=false;base();
    out.innerHTML=`<b>${cur[0]}</b> agindo em <b>${cur[1]}</b>: contrai ou relaxa? <span class="mono" style="color:var(--muted)">Placar ${sc[0]}/${sc[1]}</span>`};
  g.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||lock||!cur)return;lock=true;sc[1]++;const ok=b.dataset.r===cur[2];if(ok)sc[0]++;
    const kf=cur[2]==='c'?[{transform:'scale(1,1)'},{transform:'scale(.72,1.35)'}]:[{transform:'scale(.85,1.15)'},{transform:'scale(1.05,.9)'}];
    if(cell&&cell.animate)cell.animate(kf,{duration:reduce?1:900,fill:'forwards',easing:'ease-in-out'});
    out.innerHTML=`${ok?'<b style="color:var(--ok)">Certo.</b>':'<b style="color:var(--bad)">Não.</b>'} ${cur[0]} <b>${cur[2]==='c'?'contrai':'relaxa'}</b> ${cur[1]}. ${cur[3]} <span class="mono" style="color:var(--muted)">Placar ${sc[0]}/${sc[1]}</span>`});
  $('#lqNew').addEventListener('click',nova);nova()}}
