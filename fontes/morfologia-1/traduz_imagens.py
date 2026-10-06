"""Traduz para o português os rótulos que vieram em inglês/espanhol nas figuras.
Lê de img-originais/ e grava em img/. Rodar: python3 fontes/morfologia-1/traduz_imagens.py"""
import os
from PIL import Image, ImageDraw, ImageFont
D=os.path.dirname(os.path.abspath(__file__))
F='/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
FR='/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
def load(n,up=1):
    im=Image.open(os.path.join(D,'img-originais',n)).convert('RGB')
    if up!=1: im=im.resize((im.width*up,im.height*up),Image.LANCZOS)
    return im
def save(im,n): im.save(os.path.join(D,'img',n),quality=86,optimize=True)
def box(d,xy,fill,up=1): d.rectangle([v*up for v in xy],fill=fill)
def txt(d,x,y,s,size,fill,up=1,font=F,anchor='la'):
    d.text((x*up,y*up),s,font=ImageFont.truetype(font,int(size*up)),fill=fill,anchor=anchor)
def pill(d,x,y,s,size,fg,bg,up=1,anchor='la'):
    f=ImageFont.truetype(F,int(size*up)); b=d.textbbox((x*up,y*up),s,font=f,anchor=anchor)
    d.rounded_rectangle([b[0]-5*up,b[1]-3*up,b[2]+5*up,b[3]+3*up],radius=4*up,fill=bg); d.text((x*up,y*up),s,font=f,fill=fg,anchor=anchor)
def yellow_off(n):
    im=load(n); ImageDraw.Draw(im).rectangle([0,0,26,26],fill=(0,0,0)); px=im.load()
    for y in range(min(60,im.height)):
        for x in range(min(60,im.width)):
            r,g,b=px[x,y]
            if r>180 and g>150 and b<110: px[x,y]=(0,0,0)
    save(im,n)

# coluna-disco (espanhol)
im=load('coluna-disco.jpg',2); d=ImageDraw.Draw(im); W=(250,250,250); K=(40,40,40); u=2
box(d,(168,16,262,72),W,u); txt(d,170,22,'Processo',19,K,u,FR); txt(d,170,46,'espinhoso',19,K,u,FR)
box(d,(296,0,460,20),W,u); txt(d,300,1,'Medula espinhal',19,K,u,FR)
box(d,(492,112,600,172),W,u); txt(d,494,118,'Processo',19,K,u,FR); txt(d,494,143,'articular',19,K,u,FR)
box(d,(492,206,600,262),W,u); txt(d,494,212,'Corpo',19,K,u,FR); txt(d,494,236,'vertebral',19,K,u,FR)
box(d,(294,458,460,483),W,u); txt(d,298,461,'Nervo espinhal',19,K,u,FR)
save(im,'coluna-disco.jpg')

# díploe (inglês)
im=load('diploe.jpg',2); d=ImageDraw.Draw(im); u=2; K=(30,30,30)
box(d,(585,94,652,138),W,u); txt(d,650,98,'Osso',18,K,u,FR,'ra'); txt(d,650,118,'compacto',18,K,u,FR,'ra')
box(d,(4,230,108,260),W,u); txt(d,104,236,'Periósteo',18,K,u,FR,'ra')
box(d,(520,284,652,338),W,u); txt(d,650,290,'Osso esponjoso',17,K,u,FR,'ra'); txt(d,650,312,'(díploe)',17,K,u,FR,'ra')
save(im,'diploe.jpg')

# lacuna de Howship (inglês)
im=load('howship.jpg',3); d=ImageDraw.Draw(im); u=3; B=(25,35,140); WW=(255,255,255)
box(d,(168,38,285,60),(247,226,226),u); pill(d,226,49,'Osteoclastos',15,B,WW,u,'mm')
box(d,(55,123,190,145),(232,170,180),u); pill(d,120,134,'Lacuna de Howship',13,B,WW,u,'mm')
save(im,'howship.jpg')

# osteoide (inglês)
im=load('osteoide-osteoblastos.jpg',3); d=ImageDraw.Draw(im); u=3
box(d,(276,42,416,72),(250,246,240),u); pill(d,345,57,'Osteoblastos',17,B,WW,u,'mm')
box(d,(168,186,262,218),(252,248,244),u); pill(d,215,202,'Osteoide',17,B,WW,u,'mm')
save(im,'osteoide-osteoblastos.jpg')

# intramembranosa: rótulos da lâmina em inglês
im=load('intramembranosa.jpg',3); d=ImageDraw.Draw(im); u=3; P=(255,255,255); BK=(60,20,60)
for y,s in [(219,'osteoprogenitoras'),(246,'pré-osteoblastos'),(268,'osteoblastos'),(294,'osteócitos')]:
    pill(d,340,y,s,9,BK,P,u,'mm')
save(im,'intramembranosa.jpg')

# irrigação: remove o painel com legendas em inglês
im=load('irrigacao.jpg'); im=im.crop((0,0,im.width,201)); im=im.resize((im.width*2,im.height*2),Image.LANCZOS); save(im,'irrigacao.jpg')

# metacarpo do atlas (espanhol)
im=load('at-15.jpg',2); d=ImageDraw.Draw(im); u=2; BL=(0,0,0); WH=(255,255,255)
box(d,(230,0,530,20),BL,u); txt(d,380,2,'OSSOS DO METACARPO',13,WH,u,F,'ma')
box(d,(120,10,280,48),BL,u); txt(d,195,18,'Vista dorsal',19,WH,u,FR,'ma')
box(d,(490,10,665,48),BL,u); txt(d,575,18,'Vista palmar',19,WH,u,FR,'ma')
box(d,(318,276,400,308),BL,u); txt(d,320,280,'Corpo',21,WH,u,FR)
box(d,(318,570,400,604),BL,u); txt(d,320,575,'Cabeça',21,WH,u,FR)
box(d,(0,650,330,670),BL,u); txt(d,4,653,'Metacarpos III e IV esquerdos de bovino.',11,WH,u,FR)
im=im.resize((im.width//2,im.height//2),Image.LANCZOS); save(im,'at-15.jpg')

# esterno do atlas
im=load('at-73.jpg',2); d=ImageDraw.Draw(im); u=2
box(d,(14,0,80,22),(0,0,0),u); txt(d,18,3,'Bovino',14,(255,255,255),u,FR)
im=im.resize((im.width//2,im.height//2),Image.LANCZOS); save(im,'at-73.jpg')

# Havers: remove botões da tela de onde a imagem foi copiada
im=load('havers-volkmann.jpg',2); d=ImageDraw.Draw(im); u=2
box(d,(0,8,32,46),(244,246,248),u); box(d,(340,4,511,46),(255,255,255),u); box(d,(0,432,50,459),(232,238,244),u)
im=im.resize((im.width//2,im.height//2),Image.LANCZOS); save(im,'havers-volkmann.jpg')

# remodelação: remove endereço de site no rodapé
im=load('ciclo-remodelacao.jpg'); save(im.crop((0,0,im.width,446)),'ciclo-remodelacao.jpg')

for n in ['at-04.jpg','at-57.jpg','at-72.jpg']: yellow_off(n)
print('ok')
