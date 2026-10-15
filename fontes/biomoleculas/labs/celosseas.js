const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;
/* Eixo RANKL/OPG */
{const s=$('#rkoSvg');if(s){const out=$('#rkoOut');
  const ids=['Pth','Est','Car','Inf','Gc'],nv=['muito baixo','baixo','normal','alto','muito alto'];
  const pres={normal:[2,2,2,0,0,0],hpt:[4,2,2,0,0,0],cort:[2,2,2,0,4,0],desuso:[2,2,0,0,0,0],perio:[2,2,2,4,0,0],bisf:[4,2,2,0,0,1]};
  const txt={normal:'Adulto saudável: reabsorção e formação acopladas.',hpt:'<b>PTH alto contínuo</b> (hiperparatireoidismo secundário nutricional ou renal): RANKL ↑, OPG ↓, reabsorção intensa, osso substituído por tecido fibroso.',
    cort:'<b>Glicocorticoides</b>: RANKL ↑, OPG ↓ e, principalmente, osteoblastos inibidos e em apoptose. Formação despenca: osteoporose.',
    desuso:'<b>Imobilização</b>: sem carga, o osteócito libera mais esclerostina e RANKL. Perda óssea em semanas.',
    perio:'<b>Periodontite</b>: bactérias e células inflamatórias produzem IL-1, IL-6, TNF e RANKL: o osso alveolar é reabsorvido e o dente amolece.',
    bisf:'<b>Bisfosfonato</b>: o RANKL continua alto, mas o osteoclasto que reabsorve osso com bisfosfonato entra em apoptose. Reabsorção cai.'};
  const v=k=>+$('#rko'+k).value;
  const draw=note=>{clear(s);ids.forEach(k=>$('#rko'+k+'V').textContent=nv[v(k)]);const bis=$('#rkoBis').checked;
    const rankl=Math.max(.2,1+.35*(v('Pth')-2)-.2*(v('Est')-2)-.25*(v('Car')-2)+.35*v('Inf')+.2*v('Gc'));
    const opg=Math.max(.2,1-.2*(v('Pth')-2)+.25*(v('Est')-2)+.1*(v('Car')-2)-.15*v('Gc'));
    const ratio=rankl/opg;let res=Math.min(3,ratio);if(bis)res*=.35;
    let form=Math.max(.15,(bis?Math.min(1,.5+.5*res):1*(.6+.4*Math.min(2,res)))+.2*(v('Car')-2)-.25*v('Gc')+.05*(v('Est')-2));
    const bal=form-res;
    /* osteoblasto */
    E('rect',{x:30,y:40,width:170,height:70,rx:30,fill:'var(--ok)',opacity:.85},s);T(s,115,82,'Osteoblasto',{fs:20,fill:'var(--paper)'});
    /* RANKL e OPG */
    const nR=Math.round(Math.min(8,rankl*3)),nO=Math.round(Math.min(8,opg*3));
    for(let k=0;k<nR;k++)E('circle',{cx:230+k*22,cy:60,r:8,fill:'var(--hema)'},s);
    for(let k=0;k<nO;k++)E('rect',{x:222+k*22,y:84,width:16,height:16,rx:3,fill:'var(--sky)'},s);
    T(s,230,30,'● RANKL',{a:'start',fs:18,fill:'var(--hema)'});T(s,350,30,'■ OPG (isca)',{a:'start',fs:18,fill:'var(--sky)'});
    /* pré-osteoclasto */
    const oc=Math.min(1,res/2);E('ellipse',{cx:500,cy:75,rx:60+oc*30,ry:34+oc*10,fill:'var(--eosin)',opacity:.35+.6*oc},s);T(s,500,82,'Osteoclasto',{fs:18,fill:'var(--ink)'});
    /* barras */
    const bar=(y,l,val,c)=>{T(s,30,y+22,l,{a:'start',fs:18});E('rect',{x:200,y,width:360,height:28,rx:6,fill:'var(--panel)',stroke:'var(--line)'},s);
      E('rect',{x:200,y,width:Math.min(360,val*120),height:28,rx:6,fill:c},s)};
    bar(150,'Reabsorção',res,'var(--eosin)');bar(195,'Formação',form,'var(--ok)');
    const st=bal<-.25?['Massa óssea caindo','var(--bad)']:bal>.25?['Massa óssea subindo','var(--ok)']:['Massa óssea estável','var(--amber)'];
    T(s,300,280,st[0]+' · RANKL/OPG = '+ratio.toFixed(1).replace('.',','),{fs:22,fill:st[1]});
    out.innerHTML=(note?note+'<br>':'')+`Razão RANKL/OPG <b>${ratio.toFixed(1).replace('.',',')}</b>. `+(bal<-.25?'Reabsorção maior que formação: osteopenia/osteoporose se persistir.':bal>.25?'Formação maior que reabsorção: ganho de massa (crescimento, treino).':'Reabsorção e formação acopladas.');};
  ids.forEach(k=>$('#rko'+k).addEventListener('input',()=>{press($('#rkoBtns'),null);draw()}));
  $('#rkoBis').addEventListener('change',()=>{press($('#rkoBtns'),null);draw()});
  choices('#rkoBtns',k=>{pres[k].slice(0,5).forEach((x,i)=>$('#rko'+ids[i]).value=x);$('#rkoBis').checked=!!pres[k][5];draw(txt[k])});}}
