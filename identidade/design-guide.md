# Identidade visual — Agência Focus

> Como a marca aparece em tudo que o MazyOS gera.
> As skills de conteúdo, carrossel e post leem esse arquivo antes de criar qualquer visual.
> Edite quando a marca evoluir.

---

## Cores

> HEX oficiais do brand board da Focus (confirmados pelo dono da marca).

**Paleta:**

| Cor | HEX | Uso |
|---|---|---|
| Branco | `#FFFFFF` | Texto principal sobre escuro |
| Roxo Focus | `#692ABF` | Destaque / CTA — protagonista |
| Roxo médio | `#4E208D` | Apoio, cards, variação |
| Roxo escuro | `#421F74` | Apoio, profundidade |
| Roxo profundo | `#150827` | Fundo escuro alternativo / cards |
| Preto Focus | `#161616` | Fundo principal (não é preto puro) |

**Degradê oficial:** `#3D1766` → `#4C1D83` → `#481B7B` → `#150824` (roxo profundo → quase-preto). Usar em fundos com profundidade, faixas e CTAs.

- **Fundo principal:** Preto Focus (`#161616`) com brilho roxo radial sutil + textura de estrelas (black overlay)
- **Cor proibida:** Tons pastéis, cores quentes (laranja/amarelo) — fogem da marca

---

## Tipografia

- **Títulos e destaques:** Montserrat (SemiBold / Bold)

- **Corpo, subtítulos e botões:** Montserrat (Regular / Medium)

- **Peso do título:** Bold para impacto; SemiBold para títulos de apoio

> Família única: Montserrat (pesos ExtraLight a Bold).

---

## Estilo geral

Dark e tecnológico. Fundo escuro com roxo neon como protagonista. Sensação premium e moderna — texturas geométricas, degradês de roxo, overlays escuros. Minimalista no traço (o logo é linha limpa), denso no clima.

---

## Estética de carrossel (padrão do designer)

> Referências reais do designer em `identidade/referencias/`. Todo carrossel deve seguir isso.

- **Fundo escuro full-bleed** (#0c0b11) com **textura sutil** — liquid marble em **baixa opacidade (~20%, blend screen)**. Textura NUNCA em 100% (fica feio). Glows de canto: roxo principal + **toque de teal/verde** (`#19E0C0`) como acento secundário sutil.
- **Slide de estatística/dado em fundo CLARO** (#F2EEE6) com a textura **geométrica/topográfica** em cinza claro (~16%, blend multiply) + texto escuro. É a exceção ao "marca vive no escuro" — usar só pra dado/número, como o designer faz.
- **Tipografia:** Montserrat **900, CAIXA-ALTA**, kerning apertado (-0.02em) nos títulos. Palavra-chave em **roxo claro** (`#9B5FE0`).
- **Devices de marcação (a assinatura do estilo):** círculo desenhado à mão (marcador) em volta da palavra-chave · sublinhado-marcador · texto **riscado** (line-through roxo). Usar com parcimônia, 1 por slide.
- **Recorrentes:** lobo só-símbolo em **contorno branco** (`logo-simbolo-branco.png`) no topo · **pílula vertical** de contorno (roxo ou teal) como acento · **"ARRASTA →"** em pílula no rodapé · CTA final com lockup completo + botão roxo.

---

## Elementos-chave

- Bordas: finas, geométricas, em roxo sobre fundo escuro
- Border-radius dos cards: suave (cantos levemente arredondados)
- Botões: roxo sólido ou contorno roxo sobre fundo escuro
- Sombras: glow/brilho roxo sutil; texturas "liquid" e "black overlay"

### Texturas (3 oficiais, vistas no brand board)

1. **Black overlay** (`identidade/textura-stars.png`) — papel preto amassado com respingos brancos (estrelas reais). Textura de fundo principal dos materiais escuros. **Preferir o arquivo real a simular estrelas em CSS** → usar como `background-image` dos slides escuros, com overlay escuro por cima pra preservar a legibilidade.
2. **Liquid texture** (`identidade/textura-liquid.png`) — textura líquida/ondulada escura, para fundos com mais profundidade.
3. **Elementos geométricos** (`identidade/textura-geometrica.png`) — padrão de linhas topográficas finas (mesma linguagem do traço do lobo).

> Os 3 arquivos vêm do Drive da marca. Se ainda não estiverem em `identidade/`, pedir pro dono soltar lá com esses nomes.

### Variações de logo (brand board)

- **Selo circular:** lobo no centro com "AGÊNCIA FOCUS • AGÊNCIA FOCUS •" girando ao redor (versão branca e versão sobre roxo)
- **Lockup horizontal:** lobo + "AGÉNCIA | FOCUS" deitado (versão sobre branco e sobre roxo)
- **Lockup vertical:** lobo + "FOCUS" embaixo (o `logo.png` / `logo-transp.png`)
- Todas existem em branco (sobre fundo escuro/roxo) e em roxo (sobre fundo claro)

---

## O que NUNCA fazer

- Fundo claro como base padrão (a marca vive no escuro)
- Misturar outra fonte que não Montserrat
- Roxo lavado/pastel — o roxo é vibrante e saturado
- Visual poluído; o logo precisa de respiro

---

## Logo

- **Símbolo:** lobo geométrico em linha (estilo origami/low-poly), olhos roxos — ícone da Focus
- **Lockup completo:** lobo + "FOCUS" embaixo, na fonte própria da marca (fonte do wordmark faz parte do logo — **não recriar "FOCUS" em texto**; usar sempre o arquivo)
- **Onde usar:** slide final do carrossel (CTA), header de propostas/PDFs, slides de apresentação
- **Tamanho sugerido:** largura entre 120-200px nos HTMLs

### Arquivos da marca (baixados do Drive → `identidade/`)

| Arquivo | O que é |
|---|---|
| `logo.png` | Lockup completo (lobo + FOCUS) sobre fundo escuro — usar em header/rodapé |
| `logo-simbolo.png` | Só o lobo (símbolo) sobre fundo escuro — ícone/acento |
| `focus-brandboard.png` | Brand board completo (Prancheta 1 da apresentação) |
| `focus-elementos-1.png` | Elemento "olho com estrela" (preto/transparente) — recolorir p/ roxo, ótimo p/ tema diagnóstico |
| `focus-elementos-2.png` | Estrela de 4 pontas em círculo (preto/transparente) — acento |
| `focus-elementos.png` | Ícone globo (preto/transparente) — acento "presença digital" |
| `focus-seta-diagonal.png` · `focus-estrela-*.png` | Setas e estrelas decorativas |

> Fonte completa (com o `.psd` editável, 1.1GB): pasta da marca no Google Drive. No PSD, a camada do logo é **"logo 1"** e a apresentação completa é a **Prancheta 1**. Os PNGs acima foram exportados de lá; recortes feitos do brand board têm o fundo escuro embutido (blendam em fundo #0A0A0A).

---

## Observações adicionais

Tipografia da marca-mãe usa o nome "FOCUS" em caixa alta sob o símbolo do lobo. Variações do logo incluem selo circular ("AGÊNCIA FOCUS") e lockup horizontal.
