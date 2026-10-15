const {$,$$,reduce,press,E,T,clear,shuffle,stepper,choices}=window.BIO;
const s=$('#mscSvg'),inp=$('#mscL');
if(s&&inp){
  const out=$('#mscOut'),val=$('#mscV');
  const GROSSO=1.6,FINO=1.0; // µm (comprimento do grosso e de cada fino)
  function draw(){
    const L=+inp.value/10; val.textContent=L.toFixed(1).replace('.',',')+' µm';
    clear(s);
    const cx=300,k=140; // px por µm
    const zL=cx-L/2*k,zR=cx+L/2*k;
    const yT=60,yB=170;
    // fundo banda A
    const aL=cx-GROSSO/2*k,aR=cx+GROSSO/2*k;
    E('rect',{x:aL,y:yT-14,width:aR-aL,height:yB-yT+28,rx:6,fill:'var(--eosin-soft)'},s);
    // linhas Z
    [zL,zR].forEach(x=>{E('line',{x1:x,y1:yT-24,x2:x,y2:yB+24,stroke:'var(--ink)','stroke-width':5},s)});
    // linha M
    E('line',{x1:cx,y1:yT-20,x2:cx,y2:yB+20,stroke:'var(--muted)','stroke-width':2,'stroke-dasharray':'5 4'},s);
    // filamentos
    const rows=[yT,yT+36,yT+73,yT+110];
    rows.forEach((y,i)=>{
      if(i%2===0){ // finos
        const fL=Math.min(zL+FINO*k,zR),fR=Math.max(zR-FINO*k,zL);
        E('line',{x1:zL,y1:y,x2:fL,y2:y,stroke:'var(--sky)','stroke-width':5},s);
        E('line',{x1:zR,y1:y,x2:fR,y2:y,stroke:'var(--sky)','stroke-width':5},s);
      }else{ // grosso com cabeças
        E('line',{x1:aL,y1:y,x2:aR,y2:y,stroke:'var(--hema)','stroke-width':11},s);
        for(let x=aL+10;x<aR-8;x+=18){ if(Math.abs(x-cx)<16)continue;
          const d=x<cx?-1:1; E('line',{x1:x,y1:y-5,x2:x+d*7,y2:y-14,stroke:'var(--hema)','stroke-width':3},s);
          E('line',{x1:x,y1:y+5,x2:x+d*7,y2:y+14,stroke:'var(--hema)','stroke-width':3},s);}
      }
    });
    // bandas
    const iW=Math.max(0,(L-GROSSO)/2), hW=Math.max(0,L-2*FINO);
    const ov=Math.max(0,Math.min(GROSSO,2*FINO)-Math.max(0,hW)) ; // aprox sobreposição total
    const by=230;
    E('line',{x1:aL,y1:by,x2:aR,y2:by,stroke:'var(--eosin)','stroke-width':3},s);T(s,cx,by+28,'Banda A',{fs:19,fill:'var(--eosin)'});
    if(iW>0.05){E('line',{x1:zL,y1:by,x2:aL,y2:by,stroke:'var(--sky)','stroke-width':3},s);T(s,(zL+aL)/2,by+28,'I',{fs:19,fill:'var(--sky)'});
      E('line',{x1:aR,y1:by,x2:zR,y2:by,stroke:'var(--sky)','stroke-width':3},s);T(s,(zR+aR)/2,by+28,'I',{fs:19,fill:'var(--sky)'});}
    if(hW>0.05){T(s,cx,30,'zona H',{fs:18,fill:'var(--muted)'});E('line',{x1:cx-hW/2*k,y1:38,x2:cx+hW/2*k,y2:38,stroke:'var(--muted)','stroke-width':3},s);}
    T(s,zL,yB+48,'Z',{fs:20});T(s,zR,yB+48,'Z',{fs:20});
    // força relativa (curva comprimento-tensão clássica)
    let f; if(L>=2.0&&L<=2.25)f=100; else if(L>2.25)f=Math.max(0,100*(3.65-L)/(3.65-2.25)); else f=Math.max(0,100-(2.0-L)*100/0.75);
    f=Math.round(f);
    const txt=L>=3.6?'Estirado demais: os filamentos finos nem alcançam a miosina; não há pontes possíveis. Só a <b>titina</b> resiste (tensão passiva alta).':
      L>2.25?'Estirado: há zona H larga e menos cabeças de miosina alcançam a actina.':
      L>=2.0?'Comprimento ótimo: sobreposição máxima entre actina e as cabeças de miosina.':
      L>1.7?'Curto: os filamentos finos se cruzam no centro e atrapalham as pontes.':
      'Muito curto: a miosina bate nas linhas Z e os finos se sobrepõem; força mínima.';
    out.innerHTML=`<b>Banda A</b>: ${GROSSO.toFixed(1).replace('.',',')} µm (constante) · <b>cada banda I</b>: ${iW.toFixed(2).replace('.',',')} µm · <b>zona H</b>: ${hW.toFixed(2).replace('.',',')} µm<br>Força ativa possível ≈ <b>${f}%</b> do máximo. ${txt}`;
  }
  inp.addEventListener('input',draw);draw();
}
