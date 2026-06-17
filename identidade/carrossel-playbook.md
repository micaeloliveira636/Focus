# Playbook de Carrossel / Post estático — Focus

> Tudo que o dono (Micael) definiu sobre como os carrosséis/posts devem ser feitos.
> Consolidado a partir das decisões reais de uma sessão de design.
> **Ler isto + `design-guide.md` antes de criar qualquer carrossel.** A skill `/carrossel` segue isso.

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
- **Prompts longos, completos e criativos** pro ChatGPT (sem economizar pra "ir rápido").

## 3. O que o dono NÃO GOSTA ❌ (reprovado, não repetir)

- **Fonte manuscrita / marker / script** — testado e reprovado. Só Montserrat.
- **Letra/palavra colorida em teal** — reprovado. Teal só como **glow sutil de canto**, nunca em texto.
- **Vinheta pesada / manchas pretas** na imagem — reprovado.
- **Textura como foto de fundo principal** (ex.: liquid em tela cheia) — reprovado. Textura é **grão sutil** (~10–12%), quase imperceptível.
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
- `logo-transp.png` — lockup completo (lobo + FOCUS), pro CTA.
- Tamanho topo ~74px. Recorte limpo (threshold alto, sem halo). Nunca sombra por cima.

**Texturas (`identidade/`):**
- `textura-stars.png` — grão sutil sobre escuro (~10–12%, soft-light) e sobre foto. NUNCA em tela cheia visível.
- `textura-geometrica.png` — topográfica, no slide claro de dado (~16%, multiply).
- `textura-liquid.png` — NÃO usar como fundo de tela cheia (vira "foto", reprovado).

**Slide com foto (receita):** `backdrop-filter: blur(~3px) brightness(.78)` no fundo + grão stars ~12% soft-light + **scrim escuro forte** (gradiente quase opaco no terço do texto) + `text-shadow` reforçado.

**Devices:** rabisco à mão (SVG roxo em volta da palavra), sublinhado-marcador, riscado — **1 por slide**, com parcimônia. Pílula vertical de acento + "ARRASTA →" em pílula no rodapé.

**Estrutura padrão (8 slides):** 4 foto (1, 2, 4, 6) + 4 design (3, 5, 7, 8). Ritmo alternado foto/design pra dar respiro e o texto reinar. CTA (8) sempre limpo. `@focusprogress`.

---

## 7. Referências (versionadas no repo)

- **Designer da Focus:** `identidade/referencias/` (`ref-post-apenas-comece.png`, `post-carrosel---Consistência_01..05.png`).
- **Inspiração externa (IG):** `identidade/referencias/inspiracao/` — @macroplaneta (foto + tipo), @cacaubelragocreative (editorial), @pinovaa (rabisco/pop de cor), @adarshdesign x2 (compositing cinematográfico, type integrado à foto).

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
