#!/usr/bin/env python3
"""Monta um livro de estudo em um único HTML.
Uso: python3 fontes/build.py morfologia-1 "Morfologia 1"
Lê fontes/<pasta>/partes/*.html (em ordem), dados*.js, widgets.js e fontes/_base/,
embute as imagens de fontes/<pasta>/img/ e grava livros/<pasta>.html."""
import sys, os, re, base64, json, subprocess
ROOT=os.path.dirname(os.path.abspath(__file__))
pasta, titulo = sys.argv[1], sys.argv[2]
src=os.path.join(ROOT,pasta)
read=lambda p: open(p,encoding='utf-8').read()
body=''.join(read(os.path.join(src,'partes',f)) for f in sorted(os.listdir(os.path.join(src,'partes'))) if f.endswith('.html'))
js_dados=''.join(read(os.path.join(src,f)) for f in ['dados-novos.js','dados.js','questoes.js','roteiro.js'] if os.path.exists(os.path.join(src,f)))
js_w=read(os.path.join(src,'widgets.js')) if os.path.exists(os.path.join(src,'widgets.js')) else ''
css=read(os.path.join(ROOT,'_base','estilo.css'))+(read(os.path.join(src,'estilo.css')) if os.path.exists(os.path.join(src,'estilo.css')) else ''); app=read(os.path.join(ROOT,'_base','app.js'))
# contagens reais
info=json.loads(subprocess.check_output(['node','-e','global.window={};eval(require("fs").readFileSync(0,"utf8"));const L=window.LIVRO;console.log(JSON.stringify({q:L.Q.length,m:Object.keys(L.MATCH).length,o:Object.keys(L.ORDER).length,caps:L.caps.length}))'],input=js_dados.encode()))
nfig=len(set(re.findall(r'src="(img/[^"]+)"',body)) | set(re.findall(r'"(?:img|key)": ?"(img/[^"]+)"',js_dados)))
nlab=body.count('class="labbox')+info['m']+info['o']
for k,v in {'NCAP':info['caps'],'NFIG':nfig,'NLAB':nlab,'NQ':info['q']}.items(): body=body.replace('{{%s}}'%k,str(v))
cache={}
def uri(rel):
    if rel not in cache:
        p=os.path.join(src,rel); ext=rel.rsplit('.',1)[1].lower()
        mime={'jpg':'image/jpeg','jpeg':'image/jpeg','png':'image/png','webp':'image/webp'}[ext]
        cache[rel]='data:%s;base64,%s'%(mime,base64.b64encode(open(p,'rb').read()).decode())
    return cache[rel]
def marca(n):
    return 'data:image/png;base64,'+base64.b64encode(open(os.path.join(ROOT,'_base','marca',n),'rb').read()).decode()
L96,L480=marca('logo-96.png'),marca('logo-480.png')
import datetime
body=body.replace('{{ANO}}',str(datetime.date.today().year)).replace('{{LOGO96}}',L96).replace('{{LOGO480}}',L480)
body=re.sub(r'src="(img/[^"]+)"',lambda m:'src="%s"'%uri(m.group(1)),body)
js_dados=re.sub(r'"(img|key)": ?"(img/[^"]+)"',lambda m:'"%s":"%s"'%(m.group(1),uri(m.group(2))),js_dados)
assert 'img/' not in re.sub(r'data:[^"]+','',body+js_dados).replace('fontes/img',''), 'imagem não embutida'
html=f'''<!doctype html>
<!-- © Vet do Futuro (@vetdofuturoo). Todos os direitos reservados. Proibida a reprodução sem autorização. -->
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{titulo} · Vet do Futuro</title>
<link rel="icon" type="image/png" href="{L96}">
<meta name="theme-color" content="#FFFFFF">
<script>try{{var t=localStorage.getItem("vdf-tema");if(t)document.documentElement.dataset.theme=t}}catch(e){{}}</script>
<meta name="author" content="Vet do Futuro">
<meta name="copyright" content="© Vet do Futuro. Todos os direitos reservados.">
<meta name="description" content="Resumo interativo Vet do Futuro (@vetdofuturoo): {titulo}.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
{css}
</style>
</head>
<body>
{body}
<script>
{js_dados}
</script>
<script>
{app}
</script>
<script>
{js_w}
</script>
</body>
</html>
'''
out=os.path.join(os.path.dirname(ROOT),'livros',pasta+'.html')
open(out,'w',encoding='utf-8').write(html)
print(out, '%.1f MB'%(len(html)/1e6), 'figuras',nfig,'labs',nlab,'questões',info['q'])
