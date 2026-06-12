---
name: prospectar
description: >
  Pesquisa negócios locais reais por nicho + cidade, roda as 5 etapas de qualificação da Focus
  (GMN, Instagram, TikTok, LinkedIn, Facebook Ads Library), filtra só quem tem problema visível
  de presença digital, monta a lista de prospects com brecha + gancho de abordagem e cria os cards
  no ClickUp (CRM Claude) prontos pra abordar.
  Use quando o usuário disser "prospectar", "achar clientes", "pesquisar prospects", "lista de
  prospecção", "garimpar negócios", "/prospectar", ou der um nicho + cidade pra buscar.
---

# /prospectar — Pesquisa e qualificação de prospects

Transforma a pesquisa semanal de cliente (o gargalo comercial da Focus) num comando.
Você dá nicho + cidade, eu pesquiso negócios reais, rodo as 5 etapas, filtro só quem
tem brecha e jogo os cards no ClickUp já analisados.

Processo-fonte completo: `_memoria/comercial.md`.

## Dependências

- **Método:** `_memoria/comercial.md` (regra principal, 5 etapas, decisão, nichos, regiões, meta)
- **Grade de regiões:** `comercial/grade-regioes.md` (micro-bairros por distrito — fonte dos termos de busca e do status de cobertura)
- **Tom de voz:** `_memoria/preferencias.md` (pro campo "gancho de abordagem")
- **Contexto:** `_memoria/empresa.md` (perfil de cliente ideal)
- **CRM:** ClickUp — lista **"CRM Claude"** (`list_id` `901327473668`, `workspace_id` `9010140178`, space COMERCIAL)
- **Busca:** WebSearch / WebFetch (Google Maps, perfis de Instagram, Facebook Ads Library)

---

## Como rodar

```
/prospectar estúdios de lash em Guarulhos
```

Ou só `/prospectar` — aí pergunto nicho + cidade. Se o usuário não disser
quantos, default = **10 negócios analisados** por leva (ele pode pedir mais
até bater a meta diária de 33).

Inputs opcionais que o usuário pode dar:
- **Quantos** analisar nessa leva
- **Fonte preferida** (Instagram, Google Maps, TikTok) — senão, varro as principais
- **Não criar cards** ("só me mostra a lista") — aí pula o Passo 5

---

## Workflow

### Passo 1 — Confirmar alvo

Travar **nicho + região**. Se vier vago ("estética em SP"), estreitar:
qual sub-nicho? Sugerir a partir dos nichos prioritários (`comercial.md`):
cílios/lash, salões, sobrancelhas, clínicas de estética, barbearias, restaurantes.

**Qualificar a região ANTES de descer no micro** (`comercial/grade-regioes.md`):
- Se o usuário der uma região **Tier A/B**, abrir os micro-bairros e varrer um a um (`<nicho> <micro-bairro>`) — é o que multiplica o resultado.
- Se der uma região **Tier C** (ex: "lash no Grajaú"), avisar que é baixa prioridade (renda baixa, ticket não fecha) e sugerir a Tier B/A mais próxima antes de gastar tempo lá.
- Se não disser onde, sugerir o próximo distrito `🔲` de **Tier B (sweet spot) primeiro**.
- Região nova fora da grade → qualificar pelos 3 filtros (renda, densidade comercial, brecha) e definir Tier antes de varrer.

Ao terminar, atualizar o status de cobertura do distrito na grade (🔲 → 🟡 → ✅ com nicho + mês).

### Passo 2 — Levantar candidatos

Buscar negócios reais do nicho na região (Google Maps / busca local /
Instagram). Coletar por empresa: nome, @ do Instagram, telefone/WhatsApp se
público, site se houver, bairro.

**Nunca inventar empresa, @ ou telefone.** Se não achei o dado, escrever
"não encontrado" — não preencher de cabeça.

### Passo 3 — Rodar as 5 etapas de qualificação

Pra cada candidato, checar e anotar os problemas:

1. **GMN (Google Meu Negócio):** tem fotos de qualidade? site linkado? Instagram vinculado? horário correto? responde avaliações?
2. **Instagram:** bio com proposta clara + link de contato? feed com post recente (<30 dias)? identidade visual? destaques organizados?
3. **TikTok:** tem conta? se tem, está ativa com vídeos regulares?
4. **Facebook Ads Library:** já anunciou? bem feito ou lixo? (anuncia mal = oportunidade; não anuncia = oportunidade **só se houver outra dor junto** — ver Passo 4)
5. **LinkedIn:** só checar se for B2B ou ticket alto (clínicas, coaches, consultores)

**Divisão de trabalho honesta — nunca inventar o que não dá pra ver:**

- ✅ **A skill verifica (público):** existência do negócio e do perfil, site sim/não, telefone, nota e nº de avaliações no GMN, tem Instagram/TikTok sim/não, e a **Biblioteca de Anúncios do Facebook** (anuncia? quantos? — é consultável publicamente).
- 👁️ **Marca `[verificar]` pro olho humano:** o que exige abrir o app e julgar — qualidade do feed, identidade visual, destaques, recência real dos posts. **Não afirmar isso de cabeça.** O card chega 90% pronto e o usuário bate o olho nos `[verificar]`.

Se um sinal não foi verificável, escrever `[verificar]` no card — nunca chutar.

**Verificação por print (rigor) — dois passos com armadilha:**
- **Link da bio:** ler o link REAL na bio do Instagram e seguir aquele. Nunca adivinhar a URL (chute de slug = 404 = dado falso). O destino mostra a estrutura real (site / linktree / só agendamento).
- **Biblioteca de Anúncios:** buscar **pelo @ do Instagram (nome de usuário), nunca pelo nome de exibição.** É o @ que acha a página certa e revela se anuncia. Nome solto traz ruído = chute. Com o @: ou aparece a página dela com anúncios, ou "Nenhum anúncio" = não anuncia.

### Passo 4 — Decidir e montar a lista

**Regra principal (de `comercial.md`): só entra quem tem problema visível.**
Se tem ao menos **1–2 problemas sérios** → entra. Se a presença está toda
bem feita → **descartar** (e dizer quantos descartei e por quê).

**"Não anuncia" sozinho NÃO qualifica.** Negócio estruturado e bombando (nota
alta, muitas avaliações, feed ativo, site, destaques) cujo único gap é não rodar
tráfego pago = **pular ou morno, nunca 🔥**. Tráfego escala quem já vende — não
conserta quem já vende bem sozinho. "Não anuncia" só vira brecha quando vem
junto de **outra dor real** (feed morto, sem site, sumido do Google, sem estrutura).

Montar a tabela só com os qualificados:

| Negócio | Nicho / Cidade | Contato | Plataformas que tem | Brecha (problemas) | Gancho de abordagem | Prioridade |
|---|---|---|---|---|---|---|

- **Brecha:** os problemas concretos achados nas 5 etapas, por plataforma.
- **Gancho:** a frase de entrada personalizada baseada na brecha. **Modelo:**
  se apresentar → mencionar o problema específico → perguntar se pode mostrar o
  que viu. Direto, sem pitch longo. Tom da Focus (`preferencias.md`): honesto,
  concreto, sem jargão de guru. Exemplos:
  - Sem site: *"vi que você ainda não tem site — isso custa bastante cliente no Google"*
  - Sem anúncio: *"vi que você ainda não anuncia — com o que vocês fazem dá pra escalar muito"*
  - Aberto 24h sem comunicar: *"vocês abrem 24h e ninguém sabe disso além de quem passa na rua"*
- **Canal de contato** (pelo mesmo lugar onde achou): Google Maps → WhatsApp ·
  Instagram → Direct · TikTok → Direct no TikTok · LinkedIn → Mensagem/InMail.
- **Prioridade:** 🔥 quente (muitos problemas + sinais de porte) / 🟡 morno.

### Passo 5 — Criar os cards no ClickUp

Pra cada prospect qualificado, criar uma task na lista **CRM Claude**
(`list_id` `901327473668`, `workspace_id` `9010140178`) com:

- **name:** nome da empresa
- **status:** `Análise feita` (a skill já fez a análise; o contato ainda não saiu)
- **priority:** `high` se 🔥, `normal` se 🟡
- **markdown_description:** seguir os campos obrigatórios da lista:

```markdown
**Nicho e cidade:** <nicho> — <cidade>
**Onde foi encontrada:** <Google Maps / Instagram / TikTok / LinkedIn>
**Presença digital mapeada:** <GMN / Instagram / TikTok / LinkedIn / site — o que tem>
**Problemas por plataforma:**
- GMN: ...
- Instagram: ...
- TikTok: ...
- Ads (Facebook Ads Library): ...
**Canal de contato sugerido:** <WhatsApp / Direct / LinkedIn / E-mail>
**Gancho de abordagem:** <frase no tom da Focus>
**Contato:** @ / telefone / site
```

Não preencher "Data do primeiro contato" — fica vazio até o contato sair de fato.

Antes de criar em massa, na **primeira vez de uma leva nova**, criar 1 card e
mostrar pro usuário pra ele validar o formato. Depois disso, criar o resto direto.

### Passo 6 — Entrega

Mostrar no chat:
- A tabela dos qualificados
- Quantos foram analisados / quantos entraram / quantos descartados (e o motivo dos descartes)
- Quantos cards criei no ClickUp + link da lista
- Onde está em relação à **meta diária** (33 analisadas, 11 contatos, ~1 reunião)

Fechar oferecendo o próximo passo: *"Quer que eu escreva as primeiras
abordagens com base nos ganchos?"*

---

## Regras

- **Só chama quem tem problema visível.** Presença bem feita = pular. Essa é a regra mãe.
- **Nunca inventar dados.** Empresa, @, telefone, problema — tudo verificado ou marcado como "não encontrado". Card no CRM com dado inventado é pior que card faltando.
- **Gancho no tom da Focus.** Honesto e concreto, aponta a dor real. Nada de "alavancar", "destravar", "vamos juntos". Se soar como vendedor, refazer.
- **Brecha específica > genérica.** "Feed parado desde março, sem link na bio" vale; "presença fraca" não diz nada.
- **Status certo no card:** `Análise feita`. O contato só vira `Contato feito` quando a mensagem realmente sair.
- **Validar formato na 1ª leva.** Um card de amostra antes de criar em série, pra não popular o CRM errado.
- **Pensar em porte.** Perfil ideal fatura ≥ R$50k/mês, médio/alto ticket (`empresa.md`). Negócio com brecha mas sem sinal nenhum de estrutura entra como 🟡, não 🔥.
