# Playbook de Carrossel / Post estático — Focus

> Tudo que o dono (Micael) definiu sobre como os carrosséis/posts devem ser feitos.
> Consolidado a partir das decisões reais de uma sessão de design.
> **Ler isto + `design-guide.md` + `referencias/dna-criativo.md` antes de criar qualquer carrossel.** A skill `/carrossel` segue isso.
>
> ⚠️ **Antes de criar, abrir `referencias/dna-criativo.md`** (menu de técnicas + checklist anti-genérico). Regra-mãe: criatividade = CENA composta (IA + manipulação), não "foto crua + texto por cima". Variar de técnica entre slides.
>
> 🎬 **Sou o diretor de design (papel assumido jun/2026).** A régua é o banco curado e descrito em `referencias/capturas-2026-06-17/DESCRICOES.md` (14 perfis + 27 carrosséis). **Abrir + ver a seção 13 deste playbook antes de criar.** Responsável por tudo no visual, principalmente os prompts do ChatGPT.

---

## 1. Princípio nº 1 — O TEXTO É O REI

O texto é o elemento mais importante de todo carrossel/post estático. **Imagem e efeitos NUNCA podem competir com o texto nem chamar mais atenção que ele.** Toda decisão visual existe pra servir a mensagem:
- Foto sempre **recuada** (desfocada + escurecida) — atmosfera, não protagonista.
- Sempre um **scrim escuro forte atrás do texto** (sombra) pra garantir leitura e domínio.
- Efeito que rouba a atenção do texto = errado, refazer.

---

## 2. O que o dono GOSTA ✅

- **Foto cinematográfica, MUDA e recuada** — leve desfoque + escurecida, com textura/grão por cima.
- Imagem **"fosca"/muted**, nunca forte/vívida/saturada.
- **Slide de dado/estatística em fundo claro** (#F2EEE6) com a textura topográfica bem sutil — é o exemplo certo de "textura usada como textura". (Esse slide ele aprovou; não mexer.)
- Estética do designer dele: **caixa-alta condensada (Montserrat 900)**, **rabisco à mão** na palavra-chave, **pílula vertical** de acento, **"ARRASTA →"** em pílula, lobo no topo.
- **Alto nível de complexidade**: textura sobre a foto, sombras, profundidade por foco — *desde que o texto continue dominando*.
- **Texturas da identidade SEMPRE presentes e APARENTES** (não escondidas). Pilha das 3: **liquid embaixo + overlay/stars + geométrica**, blendadas (soft-light/overlay). Mais aparente nos slides de design; presente também sobre as fotos. É identidade forte — o dono quer ver isso.
- **Prompts longos, completos e criativos** pro ChatGPT (sem economizar pra "ir rápido").

## 3. O que o dono NÃO GOSTA ❌ (reprovado, não repetir)

- **Fonte manuscrita / marker / script** — testado e reprovado. Só Montserrat.
- **Letra/palavra colorida em teal** — reprovado. Teal só como **glow sutil de canto**, nunca em texto.
- **Vinheta pesada / manchas pretas** na imagem — reprovado.
- **Textura como foto de fundo principal chapada** (ex.: liquid sozinho em tela cheia no blend screen, parecendo foto/swirl) — reprovado. A textura entra como **pilha blendada (soft-light/overlay)** — aparente e integrada à superfície, **nunca** como uma foto chapada que compete com o texto.
- **Mover o sujeito de lugar** ou **sombra dura/offset** embaixo do sujeito — reprovado.
- **Foto forte/vívida** competindo com o texto — reprovado.
- **Logo bugada**: halo/caixa de ruído em volta do lobo; logo pequena; quadro preto atrás do lobo em fundo claro; qualquer **sombra/glow por cima da logo**. Tudo isso é proibido.

---

## 4. Fluxo de trabalho (divisão de tarefas)

**O ChatGPT Plus do dono é o gerador de imagem.** O Claude NÃO gera imagem criativa.

1. **Claude** pensa o conceito e escreve **prompts completos** (imagem só, sem texto).
2. **Dono** gera no ChatGPT e salva em `C:\Users\Pichau\Pictures\GPT fotos\`.
3. **Claude** finaliza: encaixa a foto, aplica scrim + grão + identidade, escreve o texto (Montserrat, destaque roxo, rabisco), logo, pílulas, ARRASTA, e renderiza.

- Imagem = trabalho do ChatGPT (manipulação/grade pesada **assada na imagem**). Texto/identidade/acabamento = trabalho do Claude.
- Não usar API OpenAI (não disponível). `.env` existe sem chave.

**Peças variadas por slide (não "uma imagem e acabou"):** dentro de um mesmo slide eu posso pedir ao ChatGPT **vários elementos avulsos** pra eu compor o design: objeto recortado (em fundo liso, sem sombra, pra passar no `remove-bg.js`), elemento 3D, rabisco/traço, pedaço de textura, forma com glow, polaroid/card de referência, etc. Eu monto a colagem no HTML (camadas, oclusão do texto, sombras, profundidade). Esse é o caminho da criatividade alta que o dono quer (estilo @geisianedsgn/@giovana.psd). Pedir os elementos como **PNG fácil de recortar**: "single [objeto] centered on a flat plain light-grey background, no shadow, no text, product-cutout style".

---

## 5. Template de prompt pro ChatGPT (imagem)

Regras fixas: **retrato vertical 4:5 · 1 imagem por prompt · sem texto/letra/número/logo/marca/watermark · tom escuro low-key, muted, muito espaço negativo escuro pro texto · grade roxo Focus (+ leve teal) já assada · grão de filme**.

Estrutura: `[cena/sujeito] + [ângulo/lente] + [luz] + [clima] + [grade de cor Focus] + [onde fica o espaço negativo escuro pro texto] + [regra "no text/logo/watermark"]`.

**Exemplos usados (carrossel "negócio local não vende online"):** ver `prompts-usados` abaixo. Funcionaram bem na 2ª leva (mais completos).

---

## 6. Especificações técnicas

**Cores:** roxo `#692ABF` · roxo claro/destaque `#9B5FE0` · escuro base `#0b0a10`/`#161616` · claro `#F2EEE6` · teal `#19E0C0` (só glow sutil de canto, nunca em texto) · degradê `#3D1766 → #4C1D83 → #481B7B → #150824`.

**Tipografia:** **só Montserrat**. Título 900 CAIXA-ALTA, kerning apertado (~-0.025em). Destaque = peso + cor roxa. Eyebrow/kicker pequeno, uppercase, tracking aberto, roxo claro.

**Logo (arquivos em `identidade/`):**
- `logo-simbolo-branco.png` — lobo branco, pra fundo escuro.
- `logo-simbolo-roxo.png` — lobo roxo, pra fundo claro (NUNCA pôr quadro preto atrás).
- `logo-transp.png` — lockup completo (lobo + FOCUS). O dono **prefere o lobo-só** mesmo no CTA (o lockup renderiza "bugado"); usar `logo-simbolo-branco.png` no CTA também.
- Tamanho topo ~72px. Recorte limpo (threshold alto, sem halo). Nunca sombra por cima.
- **CTA:** roxo em massa (igual capa), lobo-só branco **centralizado e grande (~150px)** no topo do bloco (não no canto), título + corpo + `@focusprogress`. Sombra **preta** (não roxa/clara) atrás do texto. Sem botão.

**Texturas (`identidade/`) — usar como PILHA blendada (aparente, é identidade):**
Compor as 3 num mesmo layer com `background-blend-mode: soft-light, overlay, normal`:
`background-image: var(--geo), textura-stars, var(--liquid)` · `background-size: cover, 175%, cover`.
- Slides de **design** (escuros): pilha com `opacity:~.5; mix-blend-mode:soft-light` sobre o gradiente roxo — bem aparente.
- Slides de **foto**: mesma pilha com `opacity:~.34; mix-blend-mode:soft-light` por cima da foto — presente sem brigar com o texto.
- `textura-geometrica.png` também sozinha no slide claro de dado (~16%, multiply).
- ❌ Liquid sozinho em tela cheia no screen (vira "foto") — proibido.

**Slide com foto (receita):** `backdrop-filter: blur(~2px) brightness(.8)` no fundo (recua a foto, leve) + **pilha de texturas ~.34 soft-light** + **scrim escuro FORTE** (gradiente quase opaco no terço do texto) + `text-shadow` reforçado.

**Posição do texto (PADRÃO FIXO):** SEMPRE **centralizado e grande, no meio** (vertical e horizontal), igual ao slide claro/respiro e ao CTA. ❌ Nunca no topo. ❌ Não usar mais o layout canto-inferior-esquerdo (kicker pequeno + h2 + corpo encostado embaixo) como base.

**Barra de criatividade (regra dura — chega de "texto sobre foto crua"):** carrossel sem tratamento criativo = reprovado. Toda peça precisa de pelo menos um gesto de design real: **colagem/moodboard**, **tipo como arte** (textura dentro da letra, outline+fill, escala absurda), **extrusão 3D**, **mídia mista**, **recorte de sujeito composto sobre fundo desenhado** (oclusão). Imagem nunca entra **crua**: ou é **conceitual/manipulada** (dupla exposição, colagem dentro de silhueta, surreal) gerada assim no ChatGPT, ou é **sujeito recortado** composto por mim. Referência da régua: @geisianedsgn e @giovana.psd.

**As 3 texturas, SEMPRE distintas (não só liquid):** `liquid` = atmosfera/profundidade no fundo · `stars` = campo de estrelas/grão por cima e dentro de cards · `geometrica` = linework gráfico (faixa, divisor, dentro de letra/card). Usar as três no carrossel, com papéis diferentes. Só liquid = errado.

**Devices:** rabisco à mão (SVG roxo em volta da palavra), sublinhado-marcador, riscado — **1 por slide**, com parcimônia. Pílula vertical de acento + "ARRASTA →" em pílula no rodapé.

**Estrutura padrão (8 slides) — abordagem VENCEDORA (jun/2026):** quase todo slide tem **imagem conceitual própria** gerada no ChatGPT (cada uma com prompt separado e criativo), inclusive a **capa** (o dono exige a capa criativa). Exceções: 1 slide claro de respiro + 1 CTA em roxo em massa (esses dois são puro design). Texto sempre centralizado/no meio (ou meio-baixo quando o sujeito da imagem fica em cima). Imagem que vem em fundo claro (recorte) → passar no `remove-bg.js` e compor sobre fundo escuro (ex.: a cabeça-colagem). **Exemplar de referência: `marketing/conteudo/carrossel-referencias-criatividade-2026-06-17/` ("Ninguém cria do nada") — seguir esse nível.**

---

## 7. Referências (versionadas no repo)

- **Designer da Focus:** `identidade/referencias/` (`ref-post-apenas-comece.png`, `post-carrosel---Consistência_01..05.png`).
- **Inspiração externa (IG):** `identidade/referencias/inspiracao/` — @macroplaneta (foto + tipo), @cacaubelragocreative (editorial), @pinovaa (rabisco/pop de cor), @adarshdesign x2 (compositing cinematográfico, type integrado à foto).
- **Leva jun/2026 (curadoria do dono, ~40 refs):** `identidade/referencias/inspiracao-2026-06/` — índice completo em `REFERENCIAS.md` + grades capturadas. **Favoritos disparados: @geisianedsgn e @giovana.psd.** Ver seção 10 abaixo (técnicas destiladas).

> **Vídeos de roteiro ≠ carrossel.** O dono compartilhou reels no Direct da conta logada (`gestordaquebrada`) como referência de **roteiro pra VÍDEOS** — é uma trilha separada, não material de carrossel. Limitação: não dá pra transcrever o áudio falado dos reels por aqui.

---

## 8. Ferramentas de apoio (em `comercial/coletor/`)

`render.js` (8 slides → PNG 1080×1350) · `render-one.js` (1 slide) · `logo-branco.js` / `logo-roxo.js` (recorte limpo do lobo) · `logo-transparente.js` (lockup) · `remove-bg.js` (recorta sujeito de foto, modelo local) · `ref-posts.js` / `ref-carousel.js` (captura referência de IG).

---

## 9. Prompts que funcionaram (base reutilizável)

Tema "negócio local não vende online". Servem de molde — trocar a cena, manter o padrão (vertical 4:5, low-key, muted, espaço negativo, grade roxo/teal, grão, sem texto/logo).

**Capa (alguém procurando no celular à noite):**
> Vertical 4:5 cinematic photorealistic photograph. A lone young business-casual person stands on a quiet, rain-slicked city street at night, seen from a respectful distance at a slightly low, filmic angle. They look down at a smartphone, and the screen's cool glow is the only key light on their face and hands while everything around them falls into deep shadow. Behind them, out-of-focus street lamps and storefront lights melt into soft purple and violet bokeh, with a faint teal reflection on the wet asphalt. Light mist. Mood: lonely, quiet, cinematic. Color grade: low-key, desaturated, crushed blacks, dominant deep purple with subtle teal, gentle film grain and soft halation baked in. Composition: subject center-right in the middle band, large clean DARK negative space across the top and the entire bottom third for text. 35mm, shallow depth of field, premium editorial. No text, letters, numbers, logos, UI or watermark.

**Cena (over-the-shoulder, tela do celular):**
> Vertical 4:5 cinematic photorealistic photograph. Intimate extreme over-the-shoulder close-up of a person's hands cradling a smartphone in a dark room at night. The screen emits a soft, indistinct glow — fully blurred, no readable interface — casting cool light over the fingers and lower face, mostly in shadow and out of focus. Background dissolves into deep darkness with faint purple ambient light and a thin teal rim on the shoulder. Mood: intimate, hushed. Color grade: low-key, muted, deep purple shadows, fine film grain baked in. Composition: hands and phone upper-right, entire bottom half clean dark empty negative space for text. 50mm, shallow depth of field. No text, readable screen, logos or watermark.

**Onde vaza (loja fechada vs. concorrente aceso):**
> Vertical 4:5 cinematic photorealistic photograph. A moody night street scene told through contrast: foreground a small local shop is closed and dark — metal shutter down, lights off, quiet, melancholic. Further down the same block a competitor's storefront glows warm and inviting, spilling golden light onto the wet sidewalk with a couple of soft out-of-focus figures near it. Rainy night, reflections on wet asphalt, faint mist. Color grade: deep blue-purple night, low-key, muted; only warmth is the distant competitor light; subtle teal in shadows; film grain baked in. Composition: upper third (sky/building) clean DARK negative space for text. 28–35mm, atmospheric. No text, signage, brand names, logos or watermark.

**A virada (negócio vivo, acolhedor):**
> Vertical 4:5 cinematic photorealistic photograph. A warm, thriving small local business in the early evening, from the sidewalk: golden interior light spilling through a large window, two or three softly out-of-focus happy customers inside, tasteful decor and plants, welcoming premium atmosphere. Outside, dusk with purple-blue ambient sky and faint teal accents; wet pavement reflecting the warm glow. Mood: hopeful, alive. Color grade: cinematic, warm interior balanced against cool purple exterior, gently muted/low-key, film grain baked in. Composition: lower third (dark foreground sidewalk) clean negative space for text. 35mm, shallow depth of field. No text, signage, logos or watermark.

---

## 10. Técnicas criativas a roubar (estudo dos favoritos — jun/2026)

Destilado das grades de @geisianedsgn, @giovana.psd, @mazzeidesign_, @typosters e do post `DWWP_UtDYTO` (o que o dono mais elogiou). Detalhe em `referencias/inspiracao-2026-06/REFERENCIAS.md`. **Tudo traduzido pra paleta Focus — roxo + escuro + lobo + Montserrat. Texto continua sendo o rei.**

1. **Palavra-herói gigante.** Uma palavra/frase domina o slide em Montserrat 900 caixa-alta, escala enorme (até "estourar" a margem, cortando levemente nas bordas). O resto vira apoio pequeno. Esse é o gesto nº 1 dos favoritos. → Usar na capa e em 1-2 slides de virada.

2. **Tipo integrado à foto com PROFUNDIDADE (a "manipulação" que ele amou).** A letra não fica "colada por cima" — ela divide o espaço 3D com a cena. Receita técnica no nosso HTML:
   - Gerar a foto com um **elemento de primeiro plano** (sujeito, planta, objeto) e fundo escuro vazio.
   - Rodar `remove-bg.js` pra recortar esse primeiro plano.
   - Empilhar: **foto-fundo → texto → recorte do primeiro plano por cima**. O sujeito passa **na frente** de parte das letras = oclusão = profundidade real. (É o "THERE IS NO SECRET RECIPE" com a grama na frente das letras.)
   - Alternativa mais leve: texto com `mix-blend-mode` sobre a textura + leve `text-shadow` interno pra parecer "dentro" da superfície.

3. **Roxo com CORAGEM (lição da Giovana).** Ela usa magenta em peso, sem medo. Nosso equivalente: blocos de **roxo Focus saturado** (`#692ABF`) chapado como fundo de slide inteiro ou de faixa, palavra-herói preenchida de roxo. Parar de usar roxo só como glow tímido — pode ser massa de cor.

4. **Palavra-chave em 3D extrudado** (estilo "TEXTURAS" da Geisiane): letra com extrusão/profundidade na cor roxa. Fazer em CSS com camadas de `text-shadow` empilhadas em roxo escuro (`#421F74`/`#150827`) descendo na diagonal. Usar 1x por carrossel, na palavra mais importante.

5. **Slide "pôster de filme" (estilo mazzei):** retrato/cena escura com **luz dramática roxa** rasgando de um lado (rim light roxo), altíssimo contraste, palavra-herói embaixo. Pra slides de tensão/problema.

6. **Tipo experimental como gráfico (estilo typosters):** em 1 slide de respiro, deixar a tipografia ser o visual — palavra em ângulo, escala absurda, sobreposição com a do slide anterior, recorte. Sem foto. Cor chapada (escuro + roxo).

## 11. Rabiscos e texturas criativas (ampliar o repertório)

Hoje usamos só o círculo à mão. Ampliar o vocabulário de **devices desenhados** (SVG roxo `#9B5FE0`/`#692ABF`, traço de marcador, 1 por slide):
- **Seta à mão** curva apontando pra palavra-chave ou pro "arrasta".
- **Subir/grifar** com retângulo de marcador atrás de 1 palavra (não só circular).
- **Riscar** a palavra "errada" e escrever a certa à mão do lado (riscado roxo + nota manuscrita — mas a nota também em Montserrat, nunca fonte manuscrita).
- **Colchetes/parênteses** gigantes à mão emoldurando a frase.
- **Asterisco/estrela de 4 pontas** (já existe `focus-estrela-*.png`) como ponto de respiro.
- **Underline duplo** ou ziguezague sob a palavra-herói.

Texturas: além da pilha (liquid + stars + geométrica), testar **grão de papel mais forte** nos slides de design e **extrusão/sombra de bloco** atrás de cards de cor roxa, pra dar a densidade que a Geisiane tem.

## 12. Prompts criativos — leva 2 (molde estendido)

Mesmas regras fixas (vertical 4:5, low-key/muted, espaço negativo, grade roxo Focus + leve teal, grão, **sem texto/letra/logo/marca**) **+ agora pedir explicitamente um elemento de primeiro plano** quando a ideia for tipo-com-profundidade, pra possibilitar a oclusão no HTML.

**Molde "tipo com profundidade" (pra técnica nº 2):**
> Vertical 4:5 cinematic photorealistic photograph. [SUJEITO/OBJETO em primeiro plano nítido] positioned in the [lower/right] portion, set against a deep, almost-empty dark background with soft purple ambient light and gentle volumetric haze. Strong separation between the sharp foreground subject and the clean dark empty space behind it (that empty space is where large text will be placed and the foreground subject should partly overlap it). Low-key, desaturated, deep purple color grade with a faint teal rim light, fine film grain baked in. 35–50mm, shallow depth of field, premium editorial. No text, letters, numbers, logos or watermark.

**Molde "pôster de filme" (técnica nº 5):**
> Vertical 4:5 dramatic cinematic portrait-style photograph of [CENA], lit by a single hard purple rim light slicing from one side, the rest falling into deep crushed shadow. High contrast, moody, tense, movie-poster energy. Color grade: near-black background, saturated deep purple key accent, subtle teal in the shadows, heavy film grain baked in. Large clean dark negative space in the lower third for text. 50mm. No text, letters, logos or watermark.

**Molde "massa de cor roxa" (técnica nº 3 — quando quiser fundo roxo, não foto):**
> (Pode ser feito direto no HTML — fundo `#692ABF` chapado + pilha de texturas em soft-light + leve vinheta roxa escura nos cantos. Não precisa de foto do ChatGPT.)

---

## 13. PADRÃO DE DIREÇÃO — banco de referências (jun/2026)

> O Micael me nomeou **diretor de design** dos carrosséis. Sou responsável por tudo no
> visual — conceito, composição, acabamento e, principalmente, **os prompts do ChatGPT**.
> A régua é o banco que ele curou e eu descrevi slide a slide:
> **`identidade/referencias/capturas-2026-06-17/DESCRICOES.md`** (14 perfis + 27
> carrosséis). **Abrir esse arquivo antes de criar** — é o padrão a atingir.
> Tudo traduzido pra Focus: **roxo + escuro + lobo + Montserrat. Texto é o rei.**

### 13.1 A régua (quem estudar)
- **@geisianedsgn ⭐ (DNA-mãe):** cena composta surreal (objeto-símbolo montado),
  grunge, elemento gráfico atravessando os slides, palavra-herói, rim light, selo de
  autoria. Posts DXKC/DWl-/DWEyg/DVGq/DWXG/DZIH são o gabarito.
- **@gaia.psd:** colagem-moodboard + tipografia gigante + 1 cor-assinatura.
- **@luisfelipe.design / @yaojadzn:** prova de que **paleta fechada (roxo escuro)** =
  grade coesa e premium. Referência de cor mais próxima da Focus.

### 13.2 Sistema de TEXTURAS — RECEITA APROVADA (não inventar outra)
⚠️ **Correção (jun/2026, reprovado pelo Micael):** NÃO jogar a textura geométrica/
topográfica (grids) por cima das fotos — fica sujo e feio. A receita boa é a do
carrossel aprovado "Ninguém cria do nada".

**Slides com FOTO (receita exata, copiar do carrossel aprovado):**
- Pilha de textura: **plastic (overlay .06) + couro (overlay .06) + scratched
  (overlay .045) + fabric (soft-light .03)**. Baixa opacidade, integra sem sujar.
- **`.sombratxt`**: sombra radial escura e desfocada (blur ~18px) ATRÁS do bloco de
  texto. **É o que dá a profundidade/sombra que ele elogiou.** Não esquecer.
- **scrim** radial central + **grão** (svg noise overlay ~.6) + **vinheta** suave.
- Sem glow roxo grande por cima (lava a foto) e sem grids sobre a foto.

**Slide claro de DADO:** aí sim a geométrica entra, como papel topográfico
(multiply ~.12) + fabric (multiply ~.06). É a exceção aprovada.

**Conceitos do DWXG ainda válidos** (pra pedir como PNG avulso ao ChatGPT, não como
overlay solto): halftone sobre títulos, kraft de base, flow (gradiente desfocado)
como mancha de luz. Mas a base de todo slide de foto é a receita aprovada acima.

### 13.3 Moldes de ROTEIRO/ESTRUTURA (roubados dos favoritos)
- **Arco emocional (DXKC):** capa-tese → sintomas (lista) → dúvida em silêncio →
  "você só vê o resultado" → confissão pessoal → reframe/virada → CTA. Molde campeão
  pra tema de dor/mentalidade.
- **2 caixas — Mito × Real / Mentira × Verdade (DWl-):** template fixo, label em
  destaque + caixa âmbar (errado) vs caixa neutra (certo). Reaplicável a qualquer tema.
- **Carrossel de OFERTA (DX__x):** capa → dores em lista → promessa → o que aprende →
  quando → quanto → CTA. Pra quando a Focus vender serviço/mentoria.
- **"N técnicas/estilos pra copiar" (DZir2):** catálogo, 1 ideia por card, cor de fundo
  por seção. Conteúdo de autoridade.
- **Recap mensal estilo revista (DVJA):** masthead gigante sangrando + seções "all
  about X" + overlays de UI real + slide-respiro claro no fim. Bastidor/autoridade.

### 13.4 Sistema de SÉRIE (faz a grade virar marca)
- **Elemento gráfico recorrente** atravessando todos os slides (na Geisiane é arame
  farpado/correntes/galhos). **No nosso: um traço/fio roxo** (`#9B5FE0`) ou a estrela
  de 4 pontas, presente em todo slide.
- **Selo de autoria fixo** ("Brought to you by" → no nosso, lobo + `@focusprogress`
  discreto no topo).
- **Capa com template repetível numerado** (ex.: "Referência #01") cria reconhecimento
  imediato no feed (lição @rafafrancodesign).
- **Cena temática coesa** (um "mundo" do começo ao fim, ex. o gótico do DVGq) em vez de
  objetos desconexos — eleva muito a percepção.

### 13.5 Protocolo de PROMPT — minha responsabilidade nº 1
Regras fixas continuam (vertical 4:5 · 1 imagem · **sem texto/letra/número/logo/marca/
watermark** · low-key muted · espaço negativo escuro pro texto · grade roxo Focus +
leve teal · grão de filme). **Novos moldes destilados do banco:**

**A) Cena composta surreal (o DNA Geisiane — usar na maioria das capas):**
> Vertical 4:5 hyperreal composited scene, surreal art-direction. A single striking
> symbolic object — [OBJETO-SÍMBOLO ligado ao tema, ex.: a cracked porcelain mask / a
> bear trap / an astronaut overgrown with flowers / a marionette] — as the hero,
> dramatically lit and seamlessly montaged into a moody environment. Deep grunge
> textured background, volumetric haze, a hard rim light carving the object. Strong
> cast shadows so the object feels truly placed in the scene (not pasted). Color grade:
> low-key, desaturated, deep purple dominant with a faint teal rim, heavy film grain
> baked in. Composition: object to one side, large clean DARK negative space for text.
> 50mm, premium editorial. No text, letters, numbers, logos or watermark.

**B) Luz volumétrica dramática (clima/virada — do DVGq):**
> ...single key light source (moonlight / lightning / glowing embers) cutting through
> mist in dramatic volumetric god-rays, deep atmospheric shadows, cinematic dark-fantasy
> mood, deep purple grade with amber-to-purple accent, heavy grain. [+ regra negativa].

**C) Objeto retrô em DUOTONE roxo (do DKIK — "objeto isolado em cor chapada"):**
> single [objeto retrô: flip phone / CRT / camera] in a strong purple-and-magenta
> duotone, halftone grain, isolated on a flat plain background, product-cutout style,
> no shadow. No text/logo/watermark. → recortar e compor no HTML.

**D) Elementos avulsos pra colagem (estilo gaia.psd / Geisiane):** pedir cada peça
separada — objeto recortável, traço/scribble, card/polaroid, pedaço de textura — em
`single [X] centered on a flat plain light-grey background, no shadow, no text` pra
passar no `remove-bg.js` e eu montar a colagem (camadas + oclusão do texto + sombra).

> Princípio que amarra tudo: **imagem nunca entra crua.** Ou é cena composta/conceitual
> (molde A/B), ou objeto duotone (C), ou peças que EU colo (D). Variar a técnica entre
> os slides. Sempre auto-criticar antes de mostrar (não entrego o que eu mesmo acho
> fraco).

### 13.6 PIPELINE META AI (atualização jun/2026 — gerador preferido)
O **Meta AI** virou o gerador principal (mais cinematográfico que o ChatGPT). Fluxo:
1. Eu escrevo os prompts **completos** (regra embutida em CADA um, nunca em pedaços
   pro Micael juntar). Formato: **9:16** (não 4:5), porque a imagem é cortada pra 4:5
   com `cover` e **o corte remove a marca d'água "Meta AI"** do canto inferior. No
   prompt: "Tall vertical 9:16... center-cropped to 4:5, keep subject and dark negative
   space in the central 80%, leave the very bottom strip simple/empty so it can be
   cropped off."
2. **Prompt nível-referência = MUITO detalhe de direção de arte:** material específico
   (ex. mármore Carrara com veios), luz (rim/raking/god-ray volumétrico), partículas
   (poeira/embers), lente (35/50mm), look de filme (Cinestill 800T), "ultra-detailed,
   photoreal". Quanto mais específico, mais perto da Geisiane.
3. ❌ **Nada de "linha/fio/neon/streak" desenhado nem dentro da imagem** (reprovado). A
   coesão vem da **luz e do tom roxo**, não de um fio. Sempre incluir no prompt: "no
   glowing thread, wire, neon line, light streak or string of any kind."
4. Micael gera e salva no **Downloads** (nome vem do prompt, NÃO mapeia direto): eu
   **abro cada imagem e identifico pelo conteúdo**, depois renomeio/encaixo em `pecas/`.
5. Sempre **backup** das versões anteriores (ex. `pecas/gpt-orig/`) antes de sobrescrever.

### 13.7 ESCOLHA DE GERADOR POR TIPO DE CENA (aprendizado A/B jun/2026)
Testado nos dois lados no "Ninguém cria do nada":
- **ChatGPT** ganha em **cenas limpas/minimalistas e fiéis à paleta roxa fria** (capa,
  pedestal vazio, fileira limpa, estante, parede). Mais espaço negativo, texto respira.
- **Meta AI** ganha em **cenas ricas de textura/drama** (desintegração em cubos,
  impasto da tela, "galpão" épico). Mais detalhe e profundidade.
- Regra: cena que precisa de **silêncio/espaço** → ChatGPT; cena que precisa de
  **riqueza/textura** → Meta. Decidir slide a slide e misturar.

### 13.8 GRADE FINAL — acabamento de coloração (ferramenta `render-final.js`)
Quando os slides vêm de fontes diferentes (GPT + Meta), passar um **grade unificado**
no fim pra ficar tudo na mesma coloração. Feito injetando camadas **por baixo do texto
(z-index 4, nunca tinge tipografia/logo)** na renderização:
- `.cena{ filter: saturate(.92) contrast(1.04) brightness(.97) }` (doma extremos).
- camada `mix-blend-mode:color` roxa **LEVE (~.14 opacity)** — harmoniza a temperatura.
  ⚠️ **Não exagerar**: .34 ficou "tudo muito roxo" / monocromático (reprovado). ~.14
  mantém o branco do mármore e as cores naturais. Esse é o valor certo.
- glow roxo central sutil + grão extra + vinheta mais funda (uniformes nos 8).
Reaproveitar `render-final.js` pra qualquer carrossel multi-fonte.

---

## 14. RECEITA NÍVEL-REFERÊNCIA — processo padrão de todo carrossel (jun/2026)

> Conversa-chave com o Micael. Isso aqui é o jeito de trabalhar, não uma dica solta.
> Vale pra TODO carrossel daqui pra frente, salvo quando ele pedir o contrário.

**Princípio:** criatividade aqui NÃO é inventar do nada nem repetir um molde único
("cena composta surreal + objeto-símbolo + grade roxo" no automático = uma nota só,
reprovado como preguiça). Criatividade é **recombinação dirigida**: garimpar o banco
`identidade/referencias/.../DESCRICOES.md` e **fundir peças de várias referências**
(o jeito da capa de uma, a textura de outra, a estrutura de uma terceira, a coragem de
cor de uma quarta) num combo que ninguém montou ainda pra aquele tema, traduzido pra
identidade Focus (roxo + escuro + lobo + Montserrat). O `DESCRICOES.md` é um **catálogo
de peças**: cada referência termina num "Roubar pra Focus" que é a técnica a tirar dali.

O processo tem **três tempos**, nessa ordem:

### 14.1 ETAPA 1 — DIREÇÃO CRIATIVA (antes de qualquer prompt)
1. Abrir o `DESCRICOES.md` e garimpar de propósito (não puxar do automático).
2. Montar o **combo**: pra esse tema, dizer de quais referências vem cada peça, por nome:
   capa (de quem), sistema de textura/luz (de quem), elemento recorrente da série (de
   quem), estrutura de roteiro (de quem), slide de respiro (de quem), acento de cor (de quem).
3. **Apresentar o combo pro Micael ANTES de executar** ("vou fundir o elemento X da ref A,
   a textura Y da ref B, a estrutura Z da ref C"). Ele aprova ou ajusta. Variar a mistura
   entre carrosséis — não repetir o mesmo combo.

### 14.2 ETAPA 2 — PROMPTS NÍVEL-REFERÊNCIA (detalhe é obrigatório)
A direção criativa só acontece se entrar no prompt **com nome e sobrenome**. Não adianta
decidir "parede arranhada + rim light da Geisiane" e escrever "fundo escuro com luz roxa".
Cada prompt carrega TODAS estas camadas (checklist):
- **Sujeito + movimento roubado** da referência escolhida (ex.: "composto estilo moodboard
  recortado da @gaia.psd").
- **Material específico** (mármore Carrara com veios, concreto descascado, latão escovado,
  papel envelhecido). Metade do realismo está aqui.
- **Luz nomeada** (rim light rasante / raking key caindo em sombra / god-ray volumétrico),
  nunca só "dramática".
- **Partículas e atmosfera** (poeira suspensa, embers, névoa volumétrica, halation).
- **Lente e filme** (35/50mm, profundidade rasa, look Cinestill 800T, grão embutido).
- **Texturas da série** que escolhi roubar do banco pra esse carrossel.
- **Composição + espaço negativo** (onde o sujeito senta, onde fica o vazio escuro pro
  texto) + formato **9:16 cortado pra 4:5** (tira a marca d'água).
- **Regras negativas** sempre: nada de fio/linha/neon/streak, nada de texto/letra/número/
  logo/marca d'água.
Quanto mais específico, mais perto da referência. Foi a diferença entre o batch fraco e o
batch nível-referência do "Ninguém cria do nada".

### 14.3 ETAPA 3 — EXECUÇÃO
- A/B **GPT vs Meta por cena** e escolha slide a slide (régua da 13.7: silêncio/espaço →
  GPT; riqueza/textura → Meta).
- **Grade final unificado** (13.8) quando misturar fontes.
- **Texto é o rei** (seção 1) e auto-crítica honesta antes de mostrar (não entrego o que eu
  mesmo acho fraco).
- ⚠️ Conferir a **fonte certa das fotos** antes de comparar (fotos GPT podem cair em
  `C:\Users\Pichau\Pictures\GPT fotos` OU no Downloads, nome `ChatGPT Image ...`; pegar o
  batch mais recente por hora; Meta vem no Downloads como `tall-vertical-916-*.jpeg`). Não
  assumir pasta nem batch.

### 14.4 CALIBRAÇÃO — não defaultar pro cinematográfico (aprendizado jun/2026)
⚠️ Vício recorrente meu: encher TODO prompt de "cinematic, Cinestill 800T, volumetric haze,
50mm, photoreal, deep purple cinematic grade". Isso é **uma nota só**, e o banco do Micael
NÃO é majoritariamente cinematográfico. Quem carrega as referências é **tipografia + sistema
gráfico + colagem + cor chapada + destaques** (marca-texto, caixa, scribble), não atmosfera
de filme.
- Cinematográfico-photoreal de verdade = só @mazzeidesign_ e @luisfelipe.design (e mesmo
  esses mais "pôster" que cena pesada). O resto (giovana, typosters, gaia, yoloartv, influxo,
  monocromáticos BR, UI Gradient, recap, marcas.design) é **gráfico/editorial/colagem/flat**.
- Geisiane é **composição/colagem editorial** (recorte montado + moldura + palavra-herói +
  grão), não "filme photoreal".
- **Regra:** o cinematográfico é EXCEÇÃO, pra 1 slide-clímax, não a régua dos 8. Deixar
  **tipo e layout carregarem**. Imagem muitas vezes = objeto único, duotone retrô, colagem de
  recortes, arte clássica em moldura, ou cor chapada flat. Variar a técnica entre slides
  (molde D da 13.5: peças que EU colo). Mesmo vício-raiz dos fios de luz: quando quero "nível
  referência", o reflexo preguiçoso corre pra atmosfera em vez de contenção gráfica + tipo
  forte. Resistir a isso.

### 14.5 IMAGEM-MASTER FATIADA — continuidade real entre slides (virada jun/2026)
Ideia do Micael, e é o jeito certo de fazer carrossel com **continuidade** (elemento que sai
de um slide e entra no outro, estilo @mazzeidesign_). Em vez de gerar uma imagem por slide e
torcer pra emenda bater (fica FALSO, os pixels não continuam):
1. Pedir pro ChatGPT **UMA imagem panorâmica larga só** (a cena inteira), com os assuntos
   distribuídos e o elemento conector (jato/luz/partículas) atravessando, e **áreas escuras
   reservadas pro texto** em cada terço. Pedir a maior largura/resolução possível.
2. **Fatiar em painéis 4:5 adjacentes** com `sharp` (`.extract` + `.resize(1080,1350)`).
   Ferramenta: `slice-test.mjs` (na pasta do carrossel de oferta). Um master ~2.2:1 rende
   **3 fatias 4:5** (não 2); cada terço = 1 slide. Continuidade fica **perfeita e sem emenda**
   (é a mesma imagem cortada) e luz/textura/coloração são idênticas de graça.
3. Carrossel de 8 = uns **3 masters contínuos** (cada um vira ~3 fatias). Dentro do master,
   continuidade perfeita; entre masters, corte normal.
4. Tipografia trabalhada POR CIMA (`type-test.html` é o gabarito): peso misto dentro do
   Montserrat (italic + 900 + tamanhos), palavra-chave tratada (riscado / bloco / cor),
   **acento puxado de uma cor da própria imagem** (ex.: âmbar das partículas) pra tipo e cena
   conversarem, scrim direcional pra legibilidade, mobília fixa (lobo, pílula, bolinhas).
5. ⚠️ Resolução: fatiar reduz o px por slide (618x773 -> upscale 1.75x pra 1080x1350). O grão
   disfarça, aguenta IG; se quiser nitidez, gerar masters maiores.
