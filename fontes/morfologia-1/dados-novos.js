/* Conteúdo novo da edição 2 (Atlas, Apostila e aprofundamento). Formato: {c, q, o:[certa, ...erradas], e} */
var NOVAS_Q=[]; /* questões em questoes.js */
var NOVOS_FC=[
['posicao','Rostral × cranial','Rostral só na cabeça (em direção ao focinho); cranial no tronco e pescoço.'],
['posicao','Dorsal × palmar × plantar','Do carpo/tarso para baixo: frente = dorsal; trás = palmar (torácico) ou plantar (pélvico).'],
['posicao','Axial × abaxial','Dedos de ruminantes e suínos: axial = voltada para o eixo entre o 3º e o 4º dedo; abaxial = oposta.'],
['posicao','Os 4 planos','Sagital mediano, sagital, dorsal (frontal) e transversal.'],
['posicao','Os 3 eixos','Longitudinal (craniocaudal), sagital (dorsoventral) e laterolateral.'],
['esqueleto','Ossos alongados','Longos e achatados, sem canal medular: costelas, fíbula.'],
['esqueleto','Ossos pneumáticos','Com seios de ar: frontal, maxila, esfenoide, etmoide, temporal, palatino.'],
['esqueleto','Ossos sesamoides','Dentro de tendões, funcionam como roldana: patela, navicular, sesamoides proximais, fabelas.'],
['osseo','Fases da remodelação','Repouso → reabsorção (osteoclasto) → reversão → formação (osteoblasto).'],
['osseo','Centros de ossificação','Primário na diáfise; secundários nas epífises. Disco epifisário entre eles.'],
['tireoide','Cálcio baixo no sangue','Paratireoide libera PTH → osteoclastos reabsorvem → Ca sai do osso para o sangue.'],
['tireoide','Cálcio alto no sangue','Células C da tireoide liberam calcitonina → inibe osteoclastos → Ca fica no osso.'],
['cranio','Órbita fechada × aberta','Fechada por osso (processo zigomático do frontal) no equino e bovino; aberta (ligamento orbital) no cão, gato e suíno.'],
['cranio','Marcas do crânio bovino','Frontal gigante, processo cornual, crista intercornual, sem incisivos superiores.'],
['cranio','Marcas do crânio equino','Face longa, crista facial, forame infraorbitário, órbita fechada, processo jugular longo.'],
['cranio','Sutura coronal','Entre frontal e parietal (frontoparietal).'],
['cranio','Seios mais cobrados','Frontal (bovino: entra no corno) e maxilar (equino: raízes dos molares).'],
['cranio','Partes do hioide','Estilo-, epi-, cerato-, basi- e tíreo-hioide (+ timpano-hioide cartilaginoso).'],
['cranio','Sínfise mandibular','Ossifica no equino e suíno; fica fibrocartilaginosa no cão, gato e ruminantes.'],
['coluna','Os 3 forames do atlas','Vertebral lateral (arco dorsal), alar (cranial) e transverso (caudal).'],
['coluna','Atlas: ruminante × cão','Ruminante sem forame transverso; cão com incisura alar no lugar do forame alar.'],
['coluna','C7','Mais curta e larga; sem forame transverso; fóvea costal caudal para a 1ª costela.'],
['coluna','Cristas do sacro','Mediana (espinhosos), intermédia (articulares), lateral (transversos).'],
['coluna','Costelas: esternais, asternais, flutuantes','Tocam o esterno; unem-se à cartilagem anterior (arco costal); soltas.'],
['coluna','Partes da costela','Cabeça, colo, tubérculo, ângulo, corpo (sulco costal), cartilagem costal.'],
['toracico','Acrômio por espécie','Presente em carnívoros e ruminantes; ausente no equino e suíno.'],
['toracico','Carpo do bovino','Proximal: radial, intermédio, ulnar, acessório. Distal: II+III, IV. Total 6.'],
['toracico','Falange distal do equino','Face parietal, face solear, processo extensor, processos palmares, margem coronária, cartilagens ungulares.'],
['toracico','Nomes populares do dedo equino','Canela, boleto, quartela, coroa, casco (navicular).'],
['toracico','Úmero: cão × gato','Cão: forame supratroclear. Gato: forame supracondilar (medial).'],
['pelvico','Tarso por espécie','Equino 6 (I+II); bovino 5 (centroquartal, II+III); cão e suíno 7.'],
['pelvico','Diâmetros da pelve','Conjugado (promontório → sínfise), transverso, vertical.'],
['pelvico','Fíbula por espécie','Equino: incompleta, maléolo fundido à tíbia. Ruminante: cabeça fundida + osso maleolar. Cão, gato, suíno: completa.'],
['pelvico','Patela','Base proximal, ápice distal; sesamoide no tendão do quadríceps; desliza na tróclea.'],
['especies','5 perguntas de identificação','Terceiro trocânter? Metacarpo fundido? Escápula sem acrômio? Ulna até o meio? Fíbula completa?']
];

/* Unidades I, III e V (plano de ensino 2026.2) */
(function(){const q=(c,t,o,e)=>NOVAS_Q.push({c,q:t,o,e}),f=(c,a,b)=>NOVOS_FC.push([c,a,b]);
f('tecidos','Os 4 tecidos fundamentais','Epitelial, conjuntivo, muscular e nervoso.');
f('tecidos','Basófilo × acidófilo','Basófilo: ácido, atrai hematoxilina (roxo): núcleo, RER. Acidófilo: atrai eosina (rosa): proteínas, mitocôndrias, colágeno, hemácias.');
f('tecidos','Merócrina, apócrina, holócrina','Exocitose; perde o ápice (gordura do leite); célula inteira (sebácea).');
f('tecidos','Etapas da lâmina','Fixação (formol 10%), desidratação (álcool), diafanização (xilol), inclusão (parafina), microtomia (3–5 µm), coloração.');
f('tecidos','Colorações especiais','PAS: glicogênio e fungos. Tricrômico: fibrose. Prata: reticulares. Sudan: lipídio. Toluidina: mastócito.');
f('posicao','Princípios de construção corpórea','Antimeria, metameria, paquimeria e estratificação.');
f('exterior','Nomes populares do membro do equino','Codilho = olécrano; “joelho” = carpo; canela = metacarpo; boleto = metacarpofalângica; quartela = falange proximal; soldra = joelho; jarrete = tarso.');
f('exterior','Fossa paralombar','Flanco sem base óssea: última costela, processos transversos lombares e tuberosidade coxal. Acesso ao rúmen.');
f('pele','Camadas da epiderme','Basal, espinhoso, granuloso, lúcido (só pele espessa), córneo.');
f('pele','Células da epiderme','Queratinócito, melanócito (crista neural), Langerhans (defesa), Merkel (tato).');
f('pele','Unidade pilossebácea','Folículo + glândula sebácea + sudorípara apócrina + músculo eretor do pelo.');
f('pele','Ciclo do pelo','Anágeno (cresce), catágeno (involui), telógeno (repouso).');
f('pele','Partes do casco equino','Muralha, perioplo, lâminas, sola, linha branca, ranilha, coxim digital.');
f('mamaria','Número de mamas','Vaca 4, égua 2, ovelha/cabra 2, porca 12–16, cadela 10, gata 8.');
f('mamaria','Caminho do leite','Alvéolo → ductos → cisterna da glândula → cisterna do teto → ducto papilar.');
f('mamaria','Vasos do úbere','Artéria pudenda externa; veia epigástrica superficial cranial (do leite); linfonodos mamários.');
f('snc','Glia do SNC e do SNP','SNC: astrócito, oligodendrócito, micróglia, ependimária. SNP: Schwann e satélite.');
f('snc','Cinzenta × branca','Cinzenta: corpos neuronais. Branca: axônios mielinizados. Encéfalo: cinzenta fora; medula: cinzenta dentro.');
f('snc','Meninges','Dura-máter (epidural fora), aracnoide (subaracnóideo com LCR), pia-máter.');
f('snp','Envoltórios do nervo','Epineuro (nervo), perineuro (fascículo), endoneuro (fibra).');
f('snp','12 nervos cranianos','Olfatório, óptico, oculomotor, troclear, trigêmeo, abducente, facial, vestibulococlear, glossofaríngeo, vago, acessório, hipoglosso.');
f('snp','Paralisias clássicas','Radial: não sustenta o membro torácico. Obturador: vaca abre os pélvicos pós-parto. Supraescapular: sweeny. Fibular: apoia o dorso do casco.');
f('snp','Simpático × parassimpático','Toracolombar, noradrenalina, luta ou fuga × craniossacral, acetilcolina, repouso e digestão.');
f('musculo','Componentes do músculo','Ventre, tendão, aponeurose, origem, inserção, fáscias.');
f('musculo','Agonista, antagonista, sinergista, fixador','Motor principal; ação oposta; ajuda; estabiliza.');
f('miohisto','Esquelético × cardíaco × liso','Estrias + núcleos periféricos; estrias + núcleo central + discos intercalares; sem estrias + fusiforme.');
f('miohisto','Envoltórios do músculo','Epimísio (músculo), perimísio (fascículo), endomísio (fibra).');
f('miohisto','Sarcômero na contração','Encurtam banda I e zona H; banda A não muda; linhas Z se aproximam.');
f('miohisto','Tipos de fibra','I lenta oxidativa (postura); IIA rápida oxidativa; IIB/IIX rápida glicolítica (carne branca).');
})();
