# Design System AquaTrack Web — Documento Único de Contexto para IA

> Este arquivo consolida toda a documentação do design system (`docs/design-system/`) em um único documento, pensado para ser fornecido como contexto a uma IA geradora de código/telas. Ele cobre: tema (tokens visuais), padrões de acessibilidade (WCAG), regra de showcase, e a especificação completa de cada um dos 28 componentes de `src/app/shared/components/`.

> Fonte: gerado a partir dos arquivos individuais em `docs/design-system/`. Qualquer atualização de componente, tema ou regra de acessibilidade deve ser refletida tanto nos arquivos individuais quanto neste documento consolidado.

## Sumário

1. Visão Geral e Convenções
2. Tema (Design Tokens)
3. Acessibilidade (WCAG)
4. Regra de Showcase
5. Especificação dos Componentes (28 componentes)

---

## 1. Visão Geral e Convenções

Documentação de referência do design system do AquaTrack (`aqua-track-web`), cobrindo todos os componentes desenvolvidos em `src/app/shared/components/` e o tema visual em `src/app/shared/theme/`.

**Propósito principal**: servir de contexto para geração de novas telas (por humanos ou IA) reutilizando os componentes já existentes, em vez de recriar padrões visuais/funcionais do zero. Antes de criar qualquer elemento de UI novo, consultar primeiro se já existe um componente equivalente aqui documentado.

### Como usar esta documentação

1. **Vai construir uma tela nova?** Comece por `theme.md` (tokens disponíveis) e pela lista de componentes abaixo para identificar quais já resolvem a necessidade.
2. **Vai usar um componente existente?** Abra o arquivo correspondente em `components/` — cada um documenta API completa (inputs/outputs/slots), regras visuais, regras de acionamento, acessibilidade, cenários de uso e onde já é usado no código real (para copiar um exemplo funcional).
3. **Vai criar um componente novo?** Depois de criá-lo, é **obrigatório**: (a) seguir os tokens de `theme.md`, (b) seguir os padrões de `accessibility.md`, (c) criar a página de showcase correspondente conforme `showcase-guidelines.md`, e (d) adicionar um novo arquivo `components/<nome>.md` a este diretório seguindo o mesmo formato dos demais.

### Componentes

| Componente                     | Categoria         | Doc                                                                          | Showcase                              |
| ------------------------------ | ----------------- | ---------------------------------------------------------------------------- | ------------------------------------- |
| Avatar                         | Identidade/Mídia  | [`components/avatar.md`](./components/avatar.md)                             | ✅ `/components/avatar`               |
| Badge                          | Feedback/Rótulo   | [`components/badge.md`](./components/badge.md)                               | ✅ `/components/badge`                |
| Button                         | Ação              | [`components/button.md`](./components/button.md)                             | ✅ `/components/button`               |
| Card Selection                 | Formulário        | [`components/card-selection.md`](./components/card-selection.md)             | ✅ `/components/card-selection`       |
| Chip                           | Feedback/Rótulo   | [`components/chip.md`](./components/chip.md)                                 | ✅ `/components/chip`                 |
| Code Block                     | Utilitário        | [`components/code-block.md`](./components/code-block.md)                     | ⚠️ pendente                           |
| Confirmation Dialog            | Overlay           | [`components/confirmation-dialog.md`](./components/confirmation-dialog.md)   | ⚠️ pendente                           |
| Dropdown Menu                  | Navegação/Overlay | [`components/dropdown-menu.md`](./components/dropdown-menu.md)               | ✅ `/components/dropdown-menu`        |
| Feedback Message (+ Container) | Feedback/Overlay  | [`components/feedback-message.md`](./components/feedback-message.md)         | ✅ `/components/feedback-message`     |
| Text Formfield                 | Formulário        | [`components/text-formfield.md`](./components/text-formfield.md)             | ✅ `/components/text-formfield`       |
| Search Formfield               | Formulário        | [`components/search-formfield.md`](./components/search-formfield.md)         | ✅ `/components/search-formfield`     |
| Textarea Formfield             | Formulário        | [`components/textarea-formfield.md`](./components/textarea-formfield.md)     | ✅ `/components/textarea-formfield`   |
| Select Formfield               | Formulário        | [`components/select-formfield.md`](./components/select-formfield.md)         | ✅ `/components/select-formfield`     |
| Datepicker Formfield           | Formulário        | [`components/datepicker-formfield.md`](./components/datepicker-formfield.md) | ✅ `/components/datepicker-formfield` |
| Info Card                      | Exibição de dados | [`components/info-card.md`](./components/info-card.md)                       | ✅ `/components/info-card`            |
| Info List                      | Exibição de dados | [`components/info-list.md`](./components/info-list.md)                       | ✅ `/components/info-list`            |
| Info List Item                 | Exibição de dados | [`components/info-list-item.md`](./components/info-list-item.md)             | ✅ `/components/info-list-item`       |
| Language Switcher              | Navegação         | [`components/language-switcher.md`](./components/language-switcher.md)       | ⚠️ pendente                           |
| Modal                          | Overlay           | [`components/modal.md`](./components/modal.md)                               | ✅ `/components/modal`                |
| Nav Menu                       | Navegação         | [`components/nav-menu.md`](./components/nav-menu.md)                         | ✅ `/components/menu`                 |
| Paginator                      | Exibição de dados | [`components/paginator.md`](./components/paginator.md)                       | ⚠️ pendente                           |
| Photo Upload                   | Formulário        | [`components/photo-upload.md`](./components/photo-upload.md)                 | ✅ `/components/photo-upload`         |
| Segmented Control              | Formulário        | [`components/segmented-control.md`](./components/segmented-control.md)       | ⚠️ pendente                           |
| Settings Card                  | Layout/Container  | [`components/settings-card.md`](./components/settings-card.md)               | ⚠️ pendente                           |
| Switch                         | Formulário        | [`components/switch.md`](./components/switch.md)                             | ⚠️ pendente                           |
| Tabs                           | Navegação         | [`components/tabs.md`](./components/tabs.md)                                 | ✅ `/components/tabs`                 |
| Table                          | Exibição de dados | [`components/table.md`](./components/table.md)                               | ✅ `/components/table`                |
| Toolbar                        | Navegação/Layout  | [`components/toolbar.md`](./components/toolbar.md)                           | ✅ `/components/toolbar`              |

✅ = possui showcase publicado e registrado em rota. ⚠️ = componente existe e está em uso (ou disponível), mas ainda não tem página de showcase — ver `showcase-guidelines.md` para o checklist de criação.

### Convenções gerais do design system (resumo)

- **Standalone Angular components**, `ChangeDetectionStrategy.OnPush` em 100% dos componentes.
- **Signals** (`input()`, `output()`, `computed()`, `signal()`) em vez de `@Input()`/`@Output()` decorators e `EventEmitter` manual.
- Prefixo de seletor `aq-` para a maioria dos componentes puros do design system; prefixo `app-` para componentes de composição/orquestração mais ligados à aplicação (`app-avatar`, `app-toolbar`, `app-nav-menu`, `app-dropdown-menu`, `app-language-switcher`).
- Inputs booleanos que colidem com atributos HTML nativos (`disabled`, `required`, `readonly`) são expostos com alias (`disabledState`, `requiredState`, `readonlyState`) para evitar conflito de nome com o atributo nativo do elemento host.
- Campos de formulário implementam `ControlValueAccessor` completo (exceto `segmented-control` e `switch`, que usam padrão `input`/`output` direto — ver nota em cada um).
- Overlays (dropdown-menu, select-formfield, datepicker-formfield, modal, confirmation-dialog) usam Angular CDK (`@angular/cdk/overlay` ou `@angular/cdk/dialog`), nunca posicionamento manual customizado.
- Todo componente colorido segue o padrão de tema "accent / accent-strong / accent-muted" descrito em `theme.md`.

---

## 2. Tema (Design Tokens) — AquaTrack Web

> Fonte: `src/app/shared/theme/` (`_tokens.scss`, `_root.scss`, `_mixins.scss`, `_reset.scss`, `_index.scss`)

Este documento descreve o sistema de tokens visuais da aplicação AquaTrack. Todos os componentes do design system consomem exclusivamente estes tokens — **nenhum componente deve usar valores de cor, espaçamento, tipografia, raio de borda ou sombra "soltos" (hard-coded) fora desta lista**, salvo casos pontuais já documentados como exceção (ver seção "Exceções conhecidas").

### Como o tema é consumido

- `_tokens.scss` define as variáveis Sass (`$aq-*`) — usadas dentro dos arquivos `.scss` dos componentes via `@use '../../theme' as theme;` e `theme.$aq-*`.
- `_root.scss` espelha os mesmos tokens como CSS Custom Properties (`--aq-*`) no seletor `:root`, para uso em runtime/inline styles quando necessário.
- `_mixins.scss` define mixins reutilizáveis, hoje contendo `aq-focus-ring` (anel de foco padrão).
- `_reset.scss` normaliza `box-sizing`, remove margin/padding padrão e herda a fonte em `button/input/textarea/select`.
- `_index.scss` reexporta `tokens` e `mixins` como ponto único de entrada (`@forward`).

Todo novo componente deve importar o tema com `@use '../../theme' as theme;` (ajustando a profundidade relativa) e usar as variáveis abaixo — nunca duplicar um valor de cor/espaçamento manualmente.

### Cores

#### Superfícies e fundo

| Token                      | Valor                   | Uso                                             |
| -------------------------- | ----------------------- | ----------------------------------------------- |
| `$aq-color-background`     | `#f3f7fb`               | Fundo geral da aplicação (fora de cards)        |
| `$aq-color-surface`        | `#fff`                  | Fundo de cards, inputs, modais, dropdowns       |
| `$aq-color-surface-muted`  | `#f8fbfd`               | Fundo de estados desabilitados/hover suave      |
| `$aq-color-surface-accent` | `rgb(35 192 232 / 12%)` | Fundo de opção selecionada (accent translúcido) |

#### Texto

| Token                      | Valor     | Uso                                           |
| -------------------------- | --------- | --------------------------------------------- |
| `$aq-color-text-primary`   | `#243041` | Títulos, labels, texto principal              |
| `$aq-color-text-secondary` | `#7f8a9d` | Texto de apoio, hints, subtítulos             |
| `$aq-color-text-tertiary`  | `#9ba7b8` | Texto de menor ênfase (ex.: chevrons neutros) |

#### Bordas

| Token                     | Valor     | Uso                                      |
| ------------------------- | --------- | ---------------------------------------- |
| `$aq-color-border`        | `#dfe7ef` | Borda padrão de inputs, cards, divisores |
| `$aq-color-border-strong` | `#c9d7e5` | Borda em hover/estado preenchido         |

#### Marca / ação

| Token                      | Valor     | Uso                                                      |
| -------------------------- | --------- | -------------------------------------------------------- |
| `$aq-color-primary`        | `#123f61` | Cor de marca principal (botões, ícones de destaque)      |
| `$aq-color-primary-strong` | `#0d3452` | Hover/active da cor primária                             |
| `$aq-color-accent`         | `#23c0e8` | Cor de destaque/interação (foco, seleção, links de ação) |
| `$aq-color-accent-strong`  | `#1d8aa8` | Hover/active da cor de destaque                          |

#### Semânticas (feedback/estado)

| Token                               | Valor                 | Uso                                                      |
| ----------------------------------- | --------------------- | -------------------------------------------------------- |
| `$aq-color-success` / `-strong`     | `#2d8a4e` / `#206138` | Sucesso, status "estável/normal"                         |
| `$aq-color-tertiary` / `-strong`    | `#5c6f8a` / `#475a73` | Cor neutra/terciária para badges, chips, botões          |
| `$aq-color-error` / `-strong`       | `#d93025` / `#b52c22` | Erro, validação inválida, ações destrutivas              |
| `$aq-color-warning` / `-strong`     | `#e6ac00` / `#c49200` | Atenção, avisos                                          |
| `$aq-color-information` / `-strong` | `#1a73e8` / `#1557b0` | Informação neutra (feedback padrão, badges informativos) |

> `$aq-color-information` e `$aq-color-information-strong` **não** são espelhados em `_root.scss` (ausentes das CSS vars `--aq-*`) — usar via Sass (`theme.$aq-color-information`).

#### Sombra

| Token              | Valor                                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `$aq-color-shadow` | `rgb(18 63 97 / 18%)`                                                                                                                                  |
| `$aq-shadow-card`  | `0 18px 42px -24px $aq-color-shadow, 0 20px 50px -32px rgb(36 48 65 / 28%)` — sombra padrão de cards, modais, painéis flutuantes (dropdowns, popovers) |

Além da sombra padrão de card, alguns componentes definem sombras locais para painéis flutuantes (ex.: `dropdown-menu__panel`: `0 4px 16px -4px rgb(18 63 97 / 12%), 0 20px 56px -20px rgb(36 48 65 / 22%)`). Ao criar um novo componente com painel flutuante (overlay/popover), reaproveitar `$aq-shadow-card` sempre que possível; só criar uma sombra customizada se houver necessidade visual comprovada.

### Tipografia

#### Famílias

| Token                     | Valor                                                              | Uso                                                                       |
| ------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `$aq-font-family-base`    | `'Aptos', 'Segoe UI', 'Trebuchet MS', sans-serif`                  | Texto padrão de toda a aplicação (labels, corpo, botões)                  |
| `$aq-font-family-heading` | `'Aptos Display', 'Aptos', 'Segoe UI', 'Trebuchet MS', sans-serif` | Títulos de destaque (ex.: título de modal, título de confirmation-dialog) |

#### Escala de tamanho

| Token              | Valor (rem)        | Uso típico                                              |
| ------------------ | ------------------ | ------------------------------------------------------- |
| `$aq-font-size-xs` | `0.75rem` (12px)   | Textos auxiliares muito pequenos, badges/chips pequenos |
| `$aq-font-size-sm` | `0.8125rem` (13px) | Labels de formfield, hints, mensagens de erro           |
| `$aq-font-size-md` | `0.875rem` (14px)  | Texto de corpo padrão, labels                           |
| `$aq-font-size-lg` | `1rem` (16px)      | Valor digitado em inputs, texto de destaque             |
| `$aq-font-size-xl` | `1.125rem` (18px)  | Títulos de card, títulos de opção em card-selection     |

#### Peso

| Token                      | Valor |
| -------------------------- | ----- |
| `$aq-font-weight-regular`  | `400` |
| `$aq-font-weight-medium`   | `500` |
| `$aq-font-weight-semibold` | `600` |
| `$aq-font-weight-bold`     | `700` |

#### Altura de linha

| Token                   | Valor | Uso                              |
| ----------------------- | ----- | -------------------------------- |
| `$aq-line-height-tight` | `1.2` | Títulos                          |
| `$aq-line-height-base`  | `1.4` | Texto de corpo, hints, mensagens |
| `$aq-line-height-loose` | `1.6` | Textos longos/descrições         |

### Espaçamento

Escala usada em `padding`, `margin` e `gap` de todos os componentes:

| Token           | Valor (rem/px)   |
| --------------- | ---------------- |
| `$aq-space-2xs` | `0.25rem` (4px)  |
| `$aq-space-xs`  | `0.5rem` (8px)   |
| `$aq-space-sm`  | `0.75rem` (12px) |
| `$aq-space-md`  | `1rem` (16px)    |
| `$aq-space-lg`  | `1.5rem` (24px)  |
| `$aq-space-xl`  | `2rem` (32px)    |
| `$aq-space-2xl` | `3rem` (48px)    |

### Raio de borda (`border-radius`)

| Token             | Valor            | Uso                                                          |
| ----------------- | ---------------- | ------------------------------------------------------------ |
| `$aq-radius-xs`   | `0.375rem` (6px) | Badge                                                        |
| `$aq-radius-sm`   | `0.75rem` (12px) | Feedback message, code-block                                 |
| `$aq-radius-md`   | `1rem` (16px)    | Inputs, cards, modais, dropdown panel, card-selection option |
| `$aq-radius-lg`   | `1.5rem` (24px)  | Superfícies grandes (raramente usado hoje)                   |
| `$aq-radius-pill` | `999px`          | Botões, chips, switch                                        |

### Tamanhos de componente

| Token                        | Valor     | Uso                                                      |
| ---------------------------- | --------- | -------------------------------------------------------- |
| `$aq-size-icon-container-sm` | `2rem`    | Container de ícone pequeno                               |
| `$aq-size-icon-container-md` | `2.5rem`  | Container de ícone médio (ex.: info-card, settings-card) |
| `$aq-size-icon-sm`           | `1rem`    | Ícone pequeno                                            |
| `$aq-size-icon-md`           | `1.25rem` | Ícone médio (ex.: ícone de feedback-message)             |

### Foco (acessibilidade visual)

Mixin `aq-focus-ring` (`_mixins.scss`), aplicado em todo elemento interativo focável via teclado:

```scss
@mixin aq-focus-ring {
  outline: none;
  border-color: $aq-color-accent;
  box-shadow:
    0 0 0 4px rgb(35 192 232 / 14%),
    0 10px 24px -18px rgb(35 192 232 / 60%);
}
```

Uso: `&:focus-visible { @include theme.aq-focus-ring; }`. Todo componente interativo novo (botão, campo, opção selecionável, item de menu) **deve** usar este mixin em `:focus-visible` em vez de recriar um anel de foco customizado, para manter consistência com WCAG 2.4.7 (Focus Visible).

### Reset global

`_reset.scss` aplica:

- `box-sizing: border-box` universal, `margin`/`padding` zerados.
- `html, body { height: 100% }`.
- `button, input, textarea, select { font: inherit }` — garante que controles de formulário herdem a tipografia do tema em vez da fonte nativa do navegador.

### Padrão de cor "accent + accent-strong + accent-muted"

A maioria dos componentes coloridos (badge, chip, button) segue o mesmo padrão de 3 variáveis CSS locais por cor, definidas no `:host`:

```scss
--_accent: <cor base>;
--_accent-strong: <cor hover/texto em fundo tinted>;
--_accent-muted: <cor base em baixa opacidade, para variante tinted/hover>;
```

Isso é então combinado com 3 variantes visuais (`filled`, `outlined`, `tinted`/`stroked`/`basic`) que trocam `background`/`border-color`/`color` usando essas 3 variáveis. **Novo componente com sistema de cores deve seguir este mesmo padrão** em vez de inventar uma nomenclatura nova — ver `button.component.scss`, `badge.component.scss` e `chip.component.scss` como referência canônica.

### Exceções conhecidas (fora do tema)

- `code-block` usa uma paleta fixa "dark" (`#0f0f1e`, `#16162a`, `#818cf8`, `#c8d3f5`) por representar um bloco de código com tema escuro proposital, independente do tema claro da aplicação. Isso é intencional e não deve ser generalizado para outros componentes.
- `dropdown-menu__item--destructive` e `language-switcher` usam uma cor vermelha pontual (`#e05257`) que não corresponde exatamente a `$aq-color-error` (`#d93025`). Ao criar novos itens destrutivos, preferir `$aq-color-error` para manter consistência, salvo decisão de design explícita em contrário.

---

## 3. Acessibilidade — AquaTrack Web Design System

Referência normativa: **WCAG 2.1 (nível AA)**. Este documento descreve os padrões de acessibilidade já implementados nos componentes existentes e as regras que todo componente novo deve seguir para manter o mesmo nível de conformidade. Os números entre parênteses (ex.: `1.3.1`) referem-se aos critérios de sucesso da WCAG.

> Estado atual do projeto: **não há plugin de lint de acessibilidade configurado** (`eslint-plugin-jsx-a11y`/`@angular-eslint` a11y rules não encontrados em `eslint.config.*`). A conformidade hoje depende de disciplina manual nos templates. Recomenda-se avaliar a adoção de um linter de acessibilidade para Angular como item de melhoria contínua.

### Princípios gerais aplicados

1. **HTML semântico antes de ARIA.** Usa-se `<fieldset>`/`<legend>` (card-selection), `<header>`/`<h1>`/`<h2>` (toolbar, modal, confirmation-dialog), `<nav>` (nav-menu), `<button>` nativo para qualquer elemento clicável (nunca `<div onclick>`).
2. **Todo controle interativo é operável por teclado.** Nenhum componente depende exclusivamente de mouse/ponteiro (WCAG 2.1.1 Keyboard).
3. **Todo elemento de foco visível usa o mesmo anel de foco** (`aq-focus-ring`, ver `theme.md`), garantindo indicador de foco consistente e com contraste suficiente (2.4.7 Focus Visible, 1.4.11 Non-text Contrast).
4. **Ícones decorativos são sempre `aria-hidden="true"`**; texto/label equivalente é fornecido separadamente (1.1.1 Non-text Content).
5. **Mensagens de erro e hints são associados ao campo via `aria-describedby`**, e o estado inválido é sinalizado com `aria-invalid="true"` (3.3.1 Error Identification, 4.1.2 Name, Role, Value).

### Padrões por categoria

#### 1. Labels e nomes acessíveis (1.1.1 / 1.3.1 / 4.1.2)

- Campos de formulário (`text-formfield`, `textarea-formfield`, `select-formfield`, `datepicker-formfield`) usam `<label [for]="inputId()">` associado por `id` gerado automaticamente quando não informado (`aq-<componente>-<n>`).
- Componentes sem `<label>` visível expõem `aria-label` obrigatório via input required (`switch.ariaLabel`, `segmented-control.ariaLabel`) — **nunca deixe um controle interativo sem nome acessível**; se não houver label visível, exija `ariaLabel` como input obrigatório no componente.
- `avatar` usa `role="img"` com `aria-label` (nome do usuário) e esconde as iniciais/ícone internos com `aria-hidden="true"`, evitando leitura duplicada.
- `card-selection` resolve `aria-labelledby` (para `<legend>`) ou `aria-label` (fallback) no `<fieldset>`.

#### 2. Estado de formulário (3.3.1 / 3.3.2 / 4.1.2)

Padrão replicado em todos os campos com `ControlValueAccessor` (text/textarea/select/datepicker-formfield, card-selection):

- `aria-required="true"` quando `required`.
- `aria-invalid="true"` quando o `FormControl` associado está `invalid && (touched || dirty)`.
- `aria-describedby` aponta para o `id` da mensagem de erro (`<id>-error`) quando há erro visível, ou para o hint (`<id>-hint`) caso contrário — nunca os dois ao mesmo tempo.
- A mensagem de erro é renderizada com `role="alert"`, garantindo anúncio automático por leitor de tela assim que aparece (4.1.3 Status Messages).
- Mapas de mensagem de erro (`FormfieldErrorMessages`) permitem customizar o texto por `ValidatorFn` (`required`, `email`, `minlength`, etc.), com fallback padrão em português.

Todo novo campo de formulário **deve** replicar esse contrato: `inputId`/`hintId`/`errorId` computados, `describedBy` computado, `aria-invalid`/`aria-required` refletindo o `NgControl`.

#### 3. Foco e navegação por teclado (2.1.1 / 2.1.2 / 2.4.3 / 2.4.7)

| Componente                     | Padrão de teclado                                                                                                                                                                                                                                                          |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `card-selection`               | `ArrowRight`/`ArrowDown` e `ArrowLeft`/`ArrowUp` navegam entre opções habilitadas (roving focus); `Home`/`End` vão para primeira/última opção; `Space`/`Enter` selecionam. Radiogroup nativo via `role` implícito de `<input type="radio">`.                               |
| `segmented-control`            | `role="radiogroup"` + `role="radio"` por opção, `aria-checked`, `tabindex` gerenciado (roving tabindex: só a opção selecionada tem `tabindex="0"`), `ArrowRight`/`ArrowLeft` alternam seleção circularmente.                                                               |
| `select-formfield`             | `role="combobox"` no trigger, `aria-expanded`, `aria-controls`, `aria-activedescendant` apontando para a opção focada; `ArrowDown`/`ArrowUp` navegam, `Enter`/`Space` selecionam, `Escape` fecha e devolve foco ao trigger.                                                |
| `dropdown-menu`                | `aria-haspopup="menu"`, `aria-expanded`; fecha ao clicar fora (`document:click`) e ao pressionar `Escape` (`keydown.escape`); itens com `role="menuitem"`.                                                                                                                 |
| `datepicker-formfield`         | Painel com `role="dialog"` `aria-modal="true"`; `Escape` fecha; navegação de mês/ano/dia via botões padrão (focáveis por Tab).                                                                                                                                             |
| `modal`                        | Usa `cdkTrapFocus` (`@angular/cdk/a11y`) com `cdkTrapFocusAutoCapture`, prendendo o foco dentro do modal enquanto aberto (2.4.3 Focus Order) e capturando o foco inicial automaticamente. Fecha com `Escape` (configurável via `closeOnEscape`) através do `ModalService`. |
| `confirmation-dialog`          | Aberto via `Dialog` do CDK (`@angular/cdk/dialog`), herdando gerenciamento de foco/trap do overlay do Angular CDK.                                                                                                                                                         |
| `photo-upload`                 | Área de drop tem `role="button"` `tabindex="0"` e responde a `Enter`/`Space` (`onKeydown`), além de clique — dropzones nunca devem depender só de drag-and-drop.                                                                                                           |
| `info-card` / `info-list-item` | Quando `clickable`, ganham `role="button"`, `tabindex="0"` e respondem a `Enter`/`Space`, além de clique de mouse.                                                                                                                                                         |

Regra para novos componentes: **qualquer padrão de interação (menu, combobox, radiogroup, dialog, tab, etc.) deve seguir o [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/)** correspondente — roles, atributos `aria-*` e teclas de atalho — replicando os exemplos acima como referência de implementação já validada no projeto.

#### 4. Live regions e mensagens de status (4.1.3)

- `feedback-message` define `role` dinamicamente: `alert` (com `aria-live="assertive"`) para `error`/`warning`; `status` (com `aria-live="polite"`) para `success`/`information`. Isso garante que alertas críticos interrompem o leitor de tela imediatamente, enquanto mensagens informativas aguardam uma pausa natural.
- `paginator` expõe o texto "X-Y de Z" com `aria-live="polite"` para anunciar mudança de página sem roubar o foco.
- `info-list` usa `aria-busy` no host durante carregamento.

#### 5. Conteúdo visualmente oculto mas acessível (1.3.1)

Padrão de "visually hidden" (clip-rect) usado para texto que deve existir apenas para leitores de tela, como o sufixo "obrigatório" em `card-selection__required-text`:

```scss
position: absolute;
width: 1px;
height: 1px;
padding: 0;
margin: -1px;
overflow: hidden;
clip: rect(0, 0, 0, 0);
white-space: nowrap;
border: 0;
```

Usar esta técnica (e não `display: none`/`visibility: hidden`, que removem o elemento da árvore de acessibilidade) sempre que for necessário texto "somente leitor de tela".

#### 6. Diálogos e modais (2.4.3 / 4.1.2)

- `modal` e `confirmation-dialog` são abertos via Angular CDK Dialog (`ModalService`/`ConfirmationDialogService`), o que garante automaticamente: `aria-modal="true"`, gerenciamento de overlay/backdrop, e devolução de foco ao elemento que abriu o diálogo quando fechado.
- `confirmation-dialog` usa `role="alertdialog"` quando `tone === 'danger'` (ação destrutiva) e `role="dialog"` no caso padrão — distinção importante porque `alertdialog` sinaliza ao leitor de tela que é necessário atenção imediata (ex.: exclusão de conta).
- Título e descrição do modal são amarrados via `aria-labelledby`/`aria-describedby` com IDs únicos por instância (`aq-modal-title-<n>`).

#### 7. Movimento e animação (2.3.3)

`card-selection` respeita `prefers-reduced-motion: reduce`, removendo a transição da seleção de card para usuários que configuraram redução de movimento no sistema operacional. **Todo componente com animação/transição decorativa deve implementar o mesmo media query.**

#### 8. Contraste de cor (1.4.3 / 1.4.11)

Os tokens de cor semântica (`$aq-color-error`, `$aq-color-warning`, etc.) foram escolhidos para atender contraste mínimo de 4.5:1 contra `$aq-color-surface` (`#fff`) em texto normal. Ao introduzir uma nova cor de token, validar contraste com uma ferramenta (ex.: WebAIM Contrast Checker) antes de adicionar ao `_tokens.scss`.

### Checklist para novos componentes

Ao criar um componente novo, verificar:

- [ ] Todo elemento interativo é um `<button>`, `<a>`, ou elemento nativo equivalente (ou tem `role` + `tabindex` + handlers de teclado corretos, caso não seja possível usar o elemento nativo).
- [ ] Existe nome acessível (texto visível, `aria-label` ou `aria-labelledby`) para cada controle.
- [ ] Ícones puramente decorativos têm `aria-hidden="true"`.
- [ ] Estados de erro/obrigatório usam `aria-invalid`, `aria-required`, `aria-describedby` + `role="alert"` na mensagem.
- [ ] Foco visível usa o mixin `aq-focus-ring`.
- [ ] Padrões de interação complexos (menu, combobox, dialog, radiogroup, tablist) seguem o WAI-ARIA APG correspondente.
- [ ] Animações respeitam `prefers-reduced-motion`.
- [ ] Cor não é o único meio de transmitir informação (ex.: badge de status combina cor + texto, nunca só cor).
- [ ] Testado com navegação exclusiva por teclado (Tab/Shift+Tab/Enter/Space/Esc/setas conforme o padrão).

---

## 4. Regra de Showcase — Obrigatoriedade e Padrão

### Regra

**Todo componente novo criado em `src/app/shared/components/` deve obrigatoriamente ganhar uma página de showcase correspondente em `src/app/features/components-showcase/`, registrada na navegação lateral e nas rotas, antes de ser considerado "pronto".** O showcase é a documentação viva do componente (exemplos renderizados + snippet de código) e é também a forma primária de QA visual do design system. Um componente sem showcase é considerado incompleto, mesmo que funcionalmente correto.

Isso vale tanto para componentes totalmente novos quanto para novas variantes/props relevantes adicionadas a um componente existente (o showcase deve ser atualizado para refletir a nova API).

### Checklist para publicar um novo showcase

1. Criar a pasta `src/app/features/components-showcase/pages/<nome-do-componente>/` com três arquivos:
   - `<nome>-showcase.component.ts`
   - `<nome>-showcase.component.html`
   - `<nome>-showcase.component.scss` (geralmente vazio ou mínimo — o layout compartilhado vive em `_showcase-page.scss`)
2. O componente TS é `standalone`, importa o componente do design system sendo documentado + `CodeBlockComponent` (para exibir os snippets de uso), e expõe como propriedades de classe as strings de exemplo de código (`codeTs`, `codeHtml`, etc.) usadas pelo `aq-code-block` no template.
3. O template HTML segue a estrutura padrão (ver "Anatomia de uma página de showcase" abaixo), reutilizando as classes utilitárias de `_showcase-page.scss` (`showcase__section`, `showcase__section-title`, `showcase__section-desc`, `showcase__group-title`, `showcase__props-table`, `showcase__row`, `showcase__card`, `showcase__usage`).
4. Registrar a rota filha em `src/app/app.routes.ts`, dentro do array `children` de `path: 'components'`, com `loadComponent` (lazy standalone) apontando para o novo componente.
5. Registrar a entrada correspondente em `sidebarItems` de `src/app/features/components-showcase/components-showcase.component.ts` (`id`, `label`, `icon` do Material Icons, `route: '/components/<rota>'`). Se o componente fizer parte de um agrupamento (como os formfields), adicionar como filho (`children`) do grupo correspondente em vez de criar um novo grupo.
6. Validar a página em `/components/<rota>` cobrindo: todas as variantes visuais, todos os tamanhos/cores relevantes, estado desabilitado, estado de erro (quando aplicável) e pelo menos um exemplo de código copiável.

### Anatomia de uma página de showcase (referência: `badge-showcase`)

```html
<section class="showcase__section">
  <h2 class="showcase__section-title">Nome do Componente</h2>
  <p class="showcase__section-desc">Descrição breve do propósito e quando usar.</p>

  <h3 class="showcase__group-title">Como usar</h3>
  <div class="showcase__usage">
    <aq-code-block language="typescript" [code]="codeTs" />
    <aq-code-block language="html" [code]="codeHtml" />
  </div>

  <h3 class="showcase__group-title">Propriedades</h3>
  <table class="showcase__props-table">
    <!-- colunas: Input | Tipo | Padrão | Descrição -->
  </table>

  <h3 class="showcase__group-title">Variantes</h3>
  <div class="showcase__row"><!-- exemplos ao vivo lado a lado --></div>
</section>
```

Seções recomendadas, na ordem: descrição → como usar (import + snippet) → tabela de propriedades (inputs/outputs) → variantes visuais → tamanhos → cores → estados (disabled/error/loading) → casos de uso reais quando relevante.

### Mapa atual: componente → showcase

| Componente (selector)               | Pasta em `shared/components`                       | Rota do showcase                   | Página de showcase                                              |
| ----------------------------------- | -------------------------------------------------- | ---------------------------------- | --------------------------------------------------------------- |
| `app-avatar`                        | `avatar/`                                          | `/components/avatar`               | `pages/avatar/avatar-showcase.component.ts`                     |
| `aq-badge`                          | `badge/`                                           | `/components/badge`                | `pages/badge/badge-showcase.component.ts`                       |
| `button[aqButton]` / `a[aqButton]`  | `button/`                                          | `/components/button`               | `pages/button/button-showcase.component.ts`                     |
| `aq-card-selection`                 | `card-selection/`                                  | `/components/card-selection`       | `pages/card-selection/card-selection-showcase.component.ts`     |
| `aq-chip`                           | `chip/`                                            | `/components/chip`                 | `pages/chip/chip-showcase.component.ts`                         |
| `app-dropdown-menu`                 | `dropdown-menu/`                                   | `/components/dropdown-menu`        | `pages/dropdown-menu/dropdown-menu-showcase.component.ts`       |
| `aq-feedback-message` (+ container) | `feedback-message/`, `feedback-message-container/` | `/components/feedback-message`     | `pages/feedback-message/feedback-message-showcase.component.ts` |
| `aq-text-formfield`                 | `formfields/text-formfield/`                       | `/components/text-formfield`       | `pages/formfields/text-formfield-showcase.component.ts`         |
| `aq-search-formfield`               | `formfields/search-formfield/`                     | `/components/search-formfield`     | `pages/formfields/search-formfield-showcase.component.ts`       |
| `aq-textarea-formfield`             | `formfields/textarea-formfield/`                   | `/components/textarea-formfield`   | `pages/formfields/textarea-formfield-showcase.component.ts`     |
| `aq-select-formfield`               | `formfields/select-formfield/`                     | `/components/select-formfield`     | `pages/formfields/select-formfield-showcase.component.ts`       |
| `aq-datepicker-formfield`           | `formfields/datepicker-formfield/`                 | `/components/datepicker-formfield` | `pages/formfields/datepicker-formfield-showcase.component.ts`   |
| `aq-info-card`                      | `info-card/`                                       | `/components/info-card`            | `pages/info-card/info-card-showcase.component.ts`               |
| `aq-info-list`                      | `info-list/`                                       | `/components/info-list`            | `pages/info-list/info-list-showcase.component.ts`               |
| `aq-info-list-item`                 | `info-list-item/`                                  | `/components/info-list-item`       | `pages/info-list-item/info-list-item-showcase.component.ts`     |
| `app-nav-menu`                      | `nav-menu/`                                        | `/components/menu`                 | `pages/nav-menu/nav-menu-showcase.component.ts`                 |
| `aq-modal`                          | `modal/`                                           | `/components/modal`                | `pages/modal/modal-showcase.component.ts`                       |
| `aq-photo-upload`                   | `photo-upload/`                                    | `/components/photo-upload`         | `pages/photo-upload/photo-upload-showcase.component.ts`         |
| `app-toolbar`                       | `toolbar/`                                         | `/components/toolbar`              | `pages/toolbar/toolbar-showcase.component.ts`                   |

#### Componentes sem showcase (pendência conhecida)

Os componentes abaixo já existem em `shared/components/` mas **não têm página de showcase nem rota registrada**. Ao criar telas novas com estes componentes, ou ao pegar qualquer tarefa que os toque, deve-se priorizar a criação do showcase correspondente seguindo o checklist acima:

| Componente (selector)    | Pasta                  |
| ------------------------ | ---------------------- |
| `aq-code-block`          | `code-block/`          |
| `aq-confirmation-dialog` | `confirmation-dialog/` |
| `app-language-switcher`  | `language-switcher/`   |
| `aq-paginator`           | `paginator/`           |
| `aq-segmented-control`   | `segmented-control/`   |
| `aq-settings-card`       | `settings-card/`       |
| `aq-switch`              | `switch/`              |

`code-block` é um caso especial: ele é usado _dentro_ de outros showcases (para exibir os próprios snippets de código), então sua "prova de uso" já existe implicitamente em toda página de showcase — ainda assim, recomenda-se uma página dedicada para documentar suas próprias props (`code`, `language`) de forma explícita.

---

## 5. Especificação dos Componentes

As subseções a seguir correspondem, uma a uma, aos arquivos de `docs/design-system/components/`, na mesma ordem da tabela de componentes do README.

---

## 5.1. Avatar

### Visão geral

Exibe a identidade visual de um usuário/entidade em três formatos: iniciais, imagem circular ou ícone. Usado tipicamente em toolbars, listas de usuário e menus de perfil.

### Localização

`src/app/shared/components/avatar/` — `avatar.component.ts` / `.html` / `.scss`, `avatar-color.type.ts`, `avatar-size.type.ts`, `avatar-variant.type.ts`.

### Seletor

`app-avatar` (standalone, sem módulo).

### API

#### Inputs

| Nome       | Tipo                                     | Padrão       | Descrição                                                               |
| ---------- | ---------------------------------------- | ------------ | ----------------------------------------------------------------------- |
| `variant`  | `'initials' \| 'circular' \| 'icon'`     | `'initials'` | Define o conteúdo exibido: texto (iniciais), `<img>` ou ícone Material. |
| `color`    | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'`  | Cor de fundo quando `variant` é `initials`/`icon`.                      |
| `size`     | `'small' \| 'normal' \| 'large'`         | `'normal'`   | Diâmetro do avatar: 2rem / 2.5rem / 3.5rem.                             |
| `initials` | `string`                                 | `''`         | Texto de iniciais; truncado para 3 caracteres e forçado a maiúsculas.   |
| `src`      | `string`                                 | `''`         | URL da imagem, usado quando `variant="circular"`.                       |
| `alt`      | `string`                                 | `''`         | Texto alternativo/`aria-label` do avatar.                               |
| `icon`     | `string`                                 | `''`         | Nome do ícone Material Icons, usado quando `variant="icon"`.            |

Não possui outputs nem slots de projeção de conteúdo.

### Regras visuais

- Formato sempre circular (`border-radius: 50%`), com `overflow: hidden`.
- Cor de fundo por `color`: `primary` → `$aq-color-primary`; `secondary` → `$aq-color-accent`; `tertiary` → `$aq-color-success` (todas com texto em `$aq-color-surface`). Quando `variant="circular"`, o fundo é neutro (`$aq-color-border`) pois a imagem cobre toda a área.
- Tamanho de fonte das iniciais/ícone escala junto com `size` (0.65rem/0.82rem/1.15rem para iniciais; 1.2rem/1.5rem/2.1rem para ícone).
- Imagem usa `object-fit: cover` para preencher o círculo sem distorção.

### Regras de acionamento

Componente puramente apresentacional — não possui interação própria (clique, foco, teclado). Qualquer comportamento clicável deve ser implementado pelo componente pai (ex.: `toolbar` o envolve em um `dropdown-menu` trigger).

### Acessibilidade

- Host `<div>` com `role="img"` e `aria-label` resolvido em cascata: `alt()` → `truncatedInitials()` → `'avatar'` (nunca fica sem nome acessível).
- Conteúdo interno (`span` de iniciais, `span` de ícone) é `aria-hidden="true"` para não duplicar a leitura do `aria-label` do host.
- Imagem (`variant="circular"`) usa `[alt]` próprio — se vazio, a imagem é tratada como decorativa por leitores de tela modernos, mas o `role="img"` do host garante o nome acessível de qualquer forma.

### Cenários de uso

- Avatar do usuário logado na toolbar (trigger do menu de conta).
- Cabeçalho do menu dropdown do usuário (versão `large`).
- Cards de listagem de usuários/membros (variante `initials` como fallback quando não há foto).

### Onde é usado

- `src/app/features/profile/components/profile-information-card/profile-information-card.component.html`
- `src/app/shared/components/toolbar/toolbar.component.html` (avatar do usuário + cabeçalho do menu)

### Showcase

`/components/avatar` → `src/app/features/components-showcase/pages/avatar/avatar-showcase.component.ts`

---

## 5.2. Badge

### Visão geral

Rótulo compacto e não interativo para exibir tags, status, planos ou classificações. Conteúdo totalmente livre via `ng-content` (texto, ícone Material, ou combinação).

### Localização

`src/app/shared/components/badge/` — `badge.component.ts` / `.html` / `.scss`, `badge-color.type.ts`, `badge-size.type.ts`, `badge-variant.type.ts`.

### Seletor

`aq-badge` (standalone).

### API

#### Inputs

| Nome       | Tipo                                                                                           | Padrão      | Descrição                                    |
| ---------- | ---------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------- |
| `variant`  | `'filled' \| 'outlined' \| 'tinted'`                                                           | `'filled'`  | Estilo visual (ver "Regras visuais").        |
| `color`    | `'primary' \| 'secondary' \| 'tertiary' \| 'success' \| 'error' \| 'warning' \| 'information'` | `'primary'` | Esquema de cor semântico.                    |
| `size`     | `'small' \| 'medium'`                                                                          | `'medium'`  | Altura 1.5rem / 2rem.                        |
| `disabled` | `boolean`                                                                                      | `false`     | Aplica `aria-disabled` e opacidade reduzida. |

#### Content projection

`<ng-content>` único (sem slots nomeados) — aceita texto e/ou `<span class="material-icons">`.

### Regras visuais

- Segue o padrão de tema "accent + accent-strong + accent-muted" (ver `theme.md`).
- `filled`: fundo = `--_accent`, texto = branco.
- `outlined`: fundo transparente, borda e texto = `--_accent`.
- `tinted`: fundo = `--_accent-muted` (translúcido), texto = `--_accent-strong`.
- `border-radius: $aq-radius-xs` (6px) — diferente de chip, que usa pill.
- `disabled` (`aria-disabled="true"`): `opacity: 0.4`, `cursor: not-allowed`, `pointer-events: none`.

### Regras de acionamento

Não interativo por padrão (`cursor: default`). Não emite eventos. Se usado como indicador clicável (ex.: filtro), o comportamento de clique deve ser adicionado pelo componente pai envolvendo o badge em um elemento clicável.

### Acessibilidade

- `aria-disabled` refletido quando `disabled=true`.
- Por ser apenas rótulo textual/ícone, herda a semântica do conteúdo projetado; se usado para transmitir status, garantir que o texto (não apenas a cor) comunique o significado (ver `accessibility.md`, item "Contraste de cor").

### Cenários de uso

- Selo de status dentro de `info-card` (`statusLabel`, cor mapeada a partir de `InfoCardStatus`).
- Selo de status/badge de item dentro de `info-list-item`.
- Indicadores de plano, categoria ou contagem em cards e listas.

### Onde é usado

- Internamente por `info-card` (`src/app/shared/components/info-card/info-card.component.html`) e `info-list-item` (`src/app/shared/components/info-list-item/info-list-item.component.html`).
- Nenhum uso direto (fora do design system) encontrado em `features/` no momento — uso hoje é majoritariamente via composição dentro de outros componentes.

### Showcase

`/components/badge` → `src/app/features/components-showcase/pages/badge/badge-showcase.component.ts`

---

## 5.3. Button

### Visão geral

Diretiva-componente aplicada diretamente a um elemento `<button>` ou `<a>` nativo (attribute selector), em vez de um wrapper de componente. Isso preserva toda a semântica e comportamento nativo do elemento (tipo de botão, navegação de link, foco, etc.) enquanto aplica a aparência do design system.

### Localização

`src/app/shared/components/button/` — `button.component.ts` / `.html` / `.scss`, `button-color.type.ts`, `button-size.type.ts`, `button-variant.type.ts`.

### Seletor

`button[aqButton], a[aqButton]` — usar como atributo: `<button aqButton>...</button>` ou `<a aqButton routerLink="...">...</a>`.

### API

#### Inputs

| Nome      | Tipo                                                                          | Padrão      | Descrição                             |
| --------- | ----------------------------------------------------------------------------- | ----------- | ------------------------------------- |
| `variant` | `'basic' \| 'stroked' \| 'flat' \| 'icon'`                                    | `'flat'`    | Estilo visual (ver "Regras visuais"). |
| `color`   | `'primary' \| 'secondary' \| 'tertiary' \| 'success' \| 'error' \| 'warning'` | `'primary'` | Esquema de cor semântico.             |
| `size`    | `'small' \| 'medium' \| 'large'`                                              | `'medium'`  | Altura 2rem / 2.5rem / 3rem.          |

Todos os demais atributos (`disabled`, `type`, `routerLink`, etc.) são os nativos do elemento host — o componente não os reimplementa.

#### Content projection

`<ng-content>` livre. Suporta SVG inline e `<span class="material-icons">` como filhos — ambos recebem estilo automático via `::ng-deep` (tamanho `1.25em`, `flex-shrink: 0`).

### Regras visuais

- `border-radius: $aq-radius-pill` (formato pílula) em todas as variantes exceto `icon` (circular, `border-radius: 50%`).
- Segue o padrão "accent + accent-hover + accent-muted" por cor.
- `flat`: fundo sólido `--_accent`, texto branco; hover escurece para `--_accent-hover`; active aplica `transform: scale(0.97)`.
- `stroked`: borda `--_accent`, fundo transparente; hover preenche com `--_accent-muted`.
- `basic`: sem borda, fundo transparente, padding horizontal reduzido; hover preenche com `--_accent-muted`.
- `icon`: circular, sem padding, `aspect-ratio: 1`, largura fixa por tamanho (2rem/2.5rem/3rem); active aplica `scale(0.9)`.
- Transições suaves (150ms) em background/border/color/shadow; feedback tátil via `transform: scale()` no `:active`.

### Regras de acionamento

- Estado `:disabled` (nativo) ou `[aria-disabled="true"]`: opacidade 0.4, `cursor: not-allowed`, `pointer-events: none` — bloqueia clique e foco por mouse, mas o elemento continua no DOM (não usar `hidden`).
- `:focus-visible` aplica `aq-focus-ring` (anel de foco do tema).
- Como é aplicado a `<button>`/`<a>` nativos, herda toda a semântica de clique/Enter/Space (button) ou navegação (link) sem código adicional.

### Acessibilidade

- Por ser um attribute selector sobre elemento nativo, o nome acessível vem do próprio conteúdo do botão (texto ou `aria-label` explícito no elemento host) — sempre garantir texto visível ou `aria-label` quando o conteúdo for só ícone (variante `icon`).
- Foco e ativação por teclado são nativos do `<button>`/`<a>`, sem necessidade de listeners customizados.

### Cenários de uso

- Ação primária de formulário (`flat` + `primary`).
- Ação secundária/cancelar (`stroked` + `tertiary`).
- Botão de ícone isolado (fechar modal, alternar visibilidade de senha) com `variant="icon"`.
- Botão destrutivo (`color="error"`) em fluxos de exclusão/cancelamento.
- Trigger de dropdown-menu (`variant="basic"` + `color="tertiary"`).

### Onde é usado

Amplamente usado em toda a aplicação — presente em `application-create-page`, `aquarium-create-page`, `home-page`, `measurement-create-page`, `account-security-card`, `change-password-modal`, `danger-zone-card`, `preferences-card`, `profile-information-card`, `delete-account-request-modal`, além de uso interno em `confirmation-dialog`, `modal` e `dropdown-menu`.

### Showcase

`/components/button` → `src/app/features/components-showcase/pages/button/button-showcase.component.ts`

---

## 5.4. Card Selection

### Visão geral

Grupo de seleção (single ou multiple) apresentado como cards em grade, funcionando como substituto visual de radio/checkbox nativos. Implementa `ControlValueAccessor`, integrando-se nativamente com Reactive Forms (`formControlName`/`[formControl]`).

### Localização

`src/app/shared/components/card-selection/` — componente + `card-selection-change.model.ts`, `card-selection-compare-with.type.ts`, `card-selection-content-context.model.ts`, `card-selection-content.directive.ts`, `card-selection-icon-position.type.ts`, `card-selection-option.model.ts`, `card-selection-value.type.ts`, `index.ts` (barrel).

### Seletor

`aq-card-selection` (standalone, genérico `<T>`).

### API

#### Inputs

| Nome                               | Tipo                                | Padrão      | Descrição                                                                                                               |
| ---------------------------------- | ----------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| `options`                          | `readonly CardSelectionOption<T>[]` | `[]`        | Lista de opções (`value`, `title`, `description?`, `iconName?`, `iconPosition?`, `disabled?`, `ariaLabel?`, `testId?`). |
| `label`                            | `string`                            | `''`        | Texto do `<legend>` do fieldset.                                                                                        |
| `ariaLabel`                        | `string`                            | `''`        | Fallback de nome acessível quando não há `label` visível.                                                               |
| `hint`                             | `string`                            | `''`        | Texto de apoio abaixo do legend.                                                                                        |
| `errorMessage`                     | `string`                            | `''`        | Mensagem de erro customizada (fallback).                                                                                |
| `errorMessages`                    | `FormfieldErrorMessages`            | `{}`        | Mapa `validatorKey → mensagem`.                                                                                         |
| `id`                               | `string`                            | gerado      | Id do grupo.                                                                                                            |
| `columns`                          | `number \| null`                    | `null`      | Número fixo de colunas do grid; `null` = `auto-fit` responsivo.                                                         |
| `multiple`                         | `boolean`                           | `false`     | Seleção múltipla (checkbox) vs. única (radio).                                                                          |
| `compareWith`                      | `CardSelectionCompareWith<T>`       | `Object.is` | Função de comparação para valores complexos (objetos).                                                                  |
| `required` (alias `requiredState`) | `boolean`                           | `false`     | Marca obrigatoriedade visual/`aria-required`.                                                                           |
| `disabled` (alias `disabledState`) | `boolean`                           | `false`     | Desabilita todo o grupo.                                                                                                |

#### Outputs

| Nome              | Tipo                     | Quando dispara                                                                                     |
| ----------------- | ------------------------ | -------------------------------------------------------------------------------------------------- |
| `selectionChange` | `CardSelectionChange<T>` | A cada seleção/deseleção confirmada pelo usuário (`{ value, option, selected, selectedOptions }`). |

#### Content projection avançada

`CardSelectionContentDirective` (`ng-template[aqCardSelectionContent]`) permite substituir totalmente o conteúdo padrão de cada card por um template customizado, recebendo o contexto `{ $implicit, option, index, selected, disabled }`. Se não for fornecido, usa o layout padrão (ícone + título + descrição).

### Regras visuais

- Grid responsivo: `repeat(var(--card-selection-columns, auto-fit), minmax(min(100%, 14.5rem), 1fr))`; em telas ≤720px colapsa para 1 coluna.
- Card não selecionado: borda `$aq-color-border`, fundo `$aq-color-surface`; hover troca para `$aq-color-border-strong` + `$aq-color-surface-muted`.
- Card selecionado: borda `$aq-color-accent`, fundo `$aq-color-surface-accent`, `box-shadow: inset 0 0 0 1px rgb(35 192 232 / 28%)`; ícone e título ficam `$aq-color-primary`.
- Card desabilitado: fundo `$aq-color-surface-muted`, `opacity: 0.72`.
- Estado inválido (`card-selection--invalid`): cards não selecionados ganham borda vermelha translúcida (`rgb(217 48 37 / 35%)`).
- Foco visível aplicado ao `<input>` real (visualmente oculto) via `:focus-visible + .card-selection__option-card` → `aq-focus-ring`.
- Respeita `prefers-reduced-motion: reduce` (remove transições do card).

### Regras de acionamento

- Cada opção é um `<input type="radio">` ou `type="checkbox"` (conforme `multiple`) visualmente oculto (clip-rect), com o `<label>` cobrindo o card inteiro — clique em qualquer parte do card ativa a opção.
- **Navegação por teclado (roving focus)**: `ArrowRight`/`ArrowDown` avança, `ArrowLeft`/`ArrowUp` volta (pulando opções desabilitadas, com wrap-around); `Home`/`End` vão para primeira/última opção habilitada; `Space`/`Enter` confirmam a seleção da opção focada.
- Em modo `multiple`, as setas apenas movem o foco (não selecionam automaticamente) — seleção requer `Space`/`Enter`/clique. Em modo single, as setas movem o foco **e** selecionam simultaneamente (comportamento nativo de radiogroup).
- `onFocusOut` só desmarca o estado `focused` quando o foco realmente sai do grupo inteiro (verifica `relatedTarget` contra o `currentTarget`), evitando piscar o estado ao navegar entre opções internas.
- Implementa `ControlValueAccessor` completo (`writeValue`, `registerOnChange`, `registerOnTouched`, `setDisabledState`) — funciona com `formControlName` sem código adicional.

### Acessibilidade

- `<fieldset>`/`<legend>` nativos; `aria-labelledby` aponta para o legend quando há `label`, senão `aria-label` usa o fallback `ariaLabel`.
- `aria-describedby` aponta para hint ou erro (nunca ambos).
- `aria-invalid`, `aria-required`, `aria-disabled` no fieldset.
- Marca de campo obrigatório (`*`) tem texto "obrigatório" em técnica visually-hidden para leitores de tela (ver `accessibility.md`).
- Mensagem de erro em `role="alert"`.
- Cada `<input>` recebe `aria-label` da opção (`option.ariaLabel`) quando fornecido.

### Cenários de uso

- Seleção de tipo de aquário/água na criação de aquário (`aquarium-create-page`).
- Qualquer escolha visualmente rica entre 2–6 opções mutuamente exclusivas (ou múltiplas) onde radio/checkbox tradicionais seriam pouco expressivos.

### Onde é usado

- `src/app/features/aquarium/pages/aquarium-create-page/aquarium-create-page.component.html`

### Showcase

`/components/card-selection` → `src/app/features/components-showcase/pages/card-selection/card-selection-showcase.component.ts`

### Dependências internas

Usa `FormfieldErrorMessages` (compartilhado com os demais formfields).

---

## 5.5. Chip

### Visão geral

Rótulo compacto similar ao badge, mas sempre em formato pílula e com um indicador de "dot" colorido à esquerda do conteúdo. Usado para categorização, filtros e marcação de status leve.

### Localização

`src/app/shared/components/chip/` — `chip.component.ts` / `.html` / `.scss`, `chip-color.type.ts`, `chip-size.type.ts`, `chip-variant.type.ts`.

### Seletor

`aq-chip` (standalone).

### API

#### Inputs

| Nome       | Tipo                                                                                           | Padrão      | Descrição                                                  |
| ---------- | ---------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------- |
| `color`    | `'primary' \| 'secondary' \| 'tertiary' \| 'success' \| 'warning' \| 'error' \| 'information'` | `'primary'` | Esquema de cor semântico.                                  |
| `size`     | `'small' \| 'medium'`                                                                          | `'small'`   | Altura 1.25rem / 1.75rem.                                  |
| `variant`  | `'filled' \| 'outlined' \| 'tinted'`                                                           | `'tinted'`  | Estilo visual (padrão diferente do badge, que é `filled`). |
| `disabled` | `boolean`                                                                                      | `false`     | Aplica `aria-disabled` e opacidade reduzida.               |

#### Content projection

`<ng-content>` — texto do chip, renderizado após o dot indicador (`.chip__dot`).

### Regras visuais

- `border-radius: $aq-radius-pill` (sempre pílula, diferente do badge que usa `radius-xs`).
- Dot indicador de 6px, cor muda conforme a variante: em `filled` o dot fica na cor "on-accent" (branco); em `outlined`/`tinted` o dot usa `--_accent`/`--_accent-strong`.
- Mesmo padrão "accent/accent-strong/accent-muted" do tema, com 7 cores (inclui `information`, que badge também tem, mas com paleta idêntica).
- `disabled`: opacidade 0.4, `pointer-events: none`.

### Regras de acionamento

Não interativo — sem eventos de clique próprios. Uso como filtro clicável requer wrapper externo com handler de clique.

### Acessibilidade

- `aria-disabled` refletido no host.
- Dot indicador é puramente decorativo (`aria-hidden="true"`); o significado semântico deve estar sempre no texto projetado, nunca só na cor do dot.

### Cenários de uso

- Tags de categoria/filtro em listagens.
- Indicadores de status leve em linhas de tabela ou cards, quando o badge é visualmente "pesado" demais para o contexto.

### Onde é usado

Nenhum uso direto encontrado em `features/` no momento — componente disponível no design system mas ainda não consumido fora do showcase. Ao adicionar filtros ou tags em novas telas, este é o componente indicado.

### Showcase

`/components/chip` → `src/app/features/components-showcase/pages/chip/chip-showcase.component.ts`

---

## 5.6. Code Block

### Visão geral

Exibe um trecho de código formatado com cabeçalho (linguagem + botão "Copiar"). Usado principalmente dentro das próprias páginas de showcase para exemplificar o uso de outros componentes, mas serve para qualquer necessidade de exibir código na aplicação.

### Localização

`src/app/shared/components/code-block/` — `code-block.component.ts` / `.html` / `.scss`.

### Seletor

`aq-code-block` (standalone).

### API

#### Inputs

| Nome       | Tipo                   | Padrão   | Descrição                                                                              |
| ---------- | ---------------------- | -------- | -------------------------------------------------------------------------------------- |
| `code`     | `string` (obrigatório) | —        | Conteúdo de código a ser exibido (`input.required`).                                   |
| `language` | `string`               | `'html'` | Rótulo da linguagem exibido no cabeçalho (não afeta syntax highlighting — é só texto). |

Sem outputs.

### Regras visuais

- Tema escuro fixo, independente do tema claro da aplicação (ver "Exceções conhecidas" em `theme.md`): fundo `#0f0f1e`, cabeçalho `#16162a`, texto de código `#c8d3f5`, label de linguagem `#818cf8`.
- Fonte monoespaçada (`Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace`) para o corpo do código; `white-space: pre` preserva formatação original.
- Botão "Copiar" muda de ícone/texto (`content_copy` → `check`, "Copiar" → "Copiado") por 2 segundos após o clique.

### Regras de acionamento

- Clique no botão de copiar chama `navigator.clipboard.writeText(code())`; ao resolver a Promise, ativa o estado `copied` por 2000ms via `setTimeout` (limpo automaticamente em `DestroyRef.onDestroy` para evitar leak).
- Não há debounce — cliques repetidos apenas reiniciam o timeout de 2s.

### Acessibilidade

- O botão de copiar é um `<button type="button">` nativo, focável e acionável por teclado nativamente.
- **Ponto de atenção**: o botão não possui `aria-label` explícito além do texto visível ("Copiar"/"Copiado"), o que é suficiente, mas o `<pre><code>` não expõe nenhuma indicação sonora de que o conteúdo foi copiado além da mudança visual — recomenda-se avaliar um `aria-live="polite"` no futuro para anunciar "Copiado" a leitores de tela.

### Cenários de uso

- Documentação de uso de componentes nas páginas de showcase (`codeTs`/`codeHtml` como inputs).
- Exibição de payloads JSON, comandos ou snippets de configuração em qualquer tela.

### Onde é usado

Usado internamente por praticamente todas as páginas de `features/components-showcase/pages/*` para exibir os exemplos de código TypeScript/HTML de cada componente.

### Showcase

**Não possui showcase próprio** (ver `showcase-guidelines.md`, pendência conhecida). Recomenda-se criar `/components/code-block` documentando os inputs `code`/`language` isoladamente, apesar de o componente já ser exercitado indiretamente em toda página de showcase existente.

---

## 5.7. Confirmation Dialog

### Visão geral

Diálogo modal de confirmação de ação, aberto programaticamente (nunca via tag no template) através do `ConfirmationDialogService`. Suporta um modo de segurança extra ("digite a palavra X para confirmar") para ações destrutivas de alto risco.

### Localização

- Componente: `src/app/shared/components/confirmation-dialog/` — `confirmation-dialog.component.ts` / `.html` / `.scss`, `confirmation-dialog-data.model.ts`, `confirmation-dialog-result.type.ts`.
- Serviço: `src/app/shared/services/confirmation-dialog.service.ts`.

### Seletor

`aq-confirmation-dialog` — **não é usado diretamente no template**; é resolvido internamente pelo Angular CDK Dialog via `ConfirmationDialogService.confirm(data)`.

### API

#### `ConfirmationDialogService.confirm(data: ConfirmationDialogData): Observable<boolean>`

#### `ConfirmationDialogData`

| Campo               | Tipo                    | Descrição                                                                                                  |
| ------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| `title`             | `string`                | Título do diálogo.                                                                                         |
| `message`           | `string`                | Corpo da mensagem.                                                                                         |
| `confirmLabel`      | `string`                | Texto do botão de confirmação.                                                                             |
| `cancelLabel`       | `string`                | Texto do botão de cancelamento.                                                                            |
| `tone?`             | `'default' \| 'danger'` | `'danger'` aplica borda vermelha superior, botão de confirmação em `color="error"` e `role="alertdialog"`. |
| `confirmWord?`      | `string`                | Se definido, exige que o usuário digite exatamente esta palavra para habilitar o botão de confirmação.     |
| `confirmWordLabel?` | `string`                | Label do campo de confirmação por palavra.                                                                 |

Retorno: `Observable<boolean>` — `true` se confirmado, `false` se cancelado (incluindo fechamento por backdrop/escape, tratado pelo CDK Dialog).

### Regras visuais

- Largura `min(28rem, calc(100vw - 2rem))`, `border-radius: $aq-radius-md`, `box-shadow: $aq-shadow-card`.
- `tone="danger"`: `border-top: 4px solid $aq-color-error`.
- Botão de cancelar sempre `variant="stroked" color="tertiary"`; botão de confirmar usa `color="error"` se `tone="danger"`, senão `color="primary"`.
- Em telas ≤480px, os botões de ação empilham em coluna reversa (confirmar em cima) e ocupam 100% da largura.

### Regras de acionamento

- Se `confirmWord` for definido, o botão de confirmação (`isConfirmDisabled`) permanece desabilitado até o texto digitado no `aq-text-formfield` interno ser **exatamente igual** a `confirmWord` (case-sensitive, sem trim).
- `confirm()` fecha o dialog com `dialogRef.close(true)`; `cancel()` fecha com `dialogRef.close(false)`.
- Abertura/fechamento (backdrop, Escape) são gerenciados pelo Angular CDK Dialog — comportamento padrão do CDK, sem `closeOnBackdropClick`/`closeOnEscape` customizáveis como no `modal`.

### Acessibilidade

- `role="alertdialog"` quando `tone="danger"` (exige atenção imediata do usuário), `role="dialog"` no padrão.
- `aria-modal="true"`, `aria-labelledby`/`aria-describedby` apontando para título/mensagem.
- Campo de confirmação por palavra reaproveita `aq-text-formfield` com `hideErrorMessage="true"` (mensagem de erro nativa do campo é suprimida pois a validação aqui é binária — botão habilitado ou não).

### Cenários de uso

- Confirmação de exclusão de conta, aquário ou registro (com `tone="danger"` e, para exclusões irreversíveis de alto impacto, `confirmWord` pedindo que o usuário digite o nome do recurso ou "EXCLUIR").
- Confirmação de ações não destrutivas mas relevantes (ex.: sair sem salvar) com `tone="default"`.

### Onde é usado

Nenhum uso encontrado em `features/` no momento (nem via `ConfirmationDialogService` nem via tag). O padrão de exclusão de conta atual (`delete-account-request-modal`) usa `aq-modal`/`ModalService` diretamente em vez deste serviço — avaliar consolidação ao criar novos fluxos de confirmação destrutiva.

### Showcase

**Não possui showcase** (ver `showcase-guidelines.md`, pendência conhecida). Como é aberto via serviço, a página de showcase deve incluir um botão de exemplo que chama `ConfirmationDialogService.confirm(...)` e exibe o resultado, cobrindo `tone="default"`, `tone="danger"` e o fluxo com `confirmWord`.

### Dependências internas

`ButtonComponent`, `TextFormfieldComponent`.

---

## 5.8. Dropdown Menu

### Visão geral

Menu suspenso com trigger customizável (via slot) e lista de itens de ação. Usado, por exemplo, como menu do usuário na toolbar.

### Localização

`src/app/shared/components/dropdown-menu/` — componente + `dropdown-menu-item.model.ts`, `dropdown-menu-placement.type.ts`.

### Seletor

`app-dropdown-menu` (standalone).

### API

#### Inputs

| Nome          | Tipo                                                           | Padrão           | Descrição                                                             |
| ------------- | -------------------------------------------------------------- | ---------------- | --------------------------------------------------------------------- |
| `items`       | `DropdownMenuItem[]` (obrigatório)                             | —                | `{ id, label, icon?, isDestructive?, hasDividerBefore?, disabled? }`. |
| `placement`   | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Posição do painel relativa ao trigger.                                |
| `showChevron` | `boolean`                                                      | `true`           | Exibe/oculta o ícone de seta no trigger.                              |

#### Outputs

| Nome        | Tipo               | Quando dispara                                                       |
| ----------- | ------------------ | -------------------------------------------------------------------- |
| `itemClick` | `DropdownMenuItem` | Ao clicar em um item não desabilitado; fecha o menu automaticamente. |

#### Slots (content projection nomeada)

| Slot               | Uso                                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| `[slot='trigger']` | Conteúdo do botão que abre o menu (ex.: avatar + nome do usuário).                                   |
| `[slot='header']`  | Conteúdo fixo no topo do painel, acima da lista de itens (ex.: cabeçalho com avatar grande + plano). |

### Regras visuais

- Painel: `min-width: 15rem`, fundo `$aq-color-surface`, borda `$aq-color-border`, `border-radius: $aq-radius-md`, sombra customizada em duas camadas.
- Animação de entrada (`dm-enter-down`/`dm-enter-up`, 200ms `cubic-bezier(0.16, 1, 0.3, 1)`) conforme o painel abre para baixo ou para cima.
- Chevron rotaciona 180° quando aberto; para `placement` "top-\*", a rotação de repouso já é invertida (aponta para cima) e some ao abrir.
- Item `isDestructive`: texto/ícone em vermelho pontual (`#e05257`), hover com fundo vermelho translúcido.
- Item `disabled`: `opacity: 0.45`, `pointer-events: none`.
- `hasDividerBefore`: renderiza um separador (`<li role="separator">`) antes do item.

### Regras de acionamento

- Trigger é um `button[aqButton]` (`variant="basic" color="tertiary"`); clique alterna `isOpen` (`toggle()`, com `stopPropagation`).
- Fecha automaticamente ao: clicar fora do componente (`@HostListener('document:click')`, checa `contains`), pressionar `Escape` (`@HostListener('keydown.escape')`), ou clicar em um item habilitado.
- Item desabilitado (`item.disabled`) ignora o clique (early return antes de emitir `itemClick`).

### Acessibilidade

- Trigger: `aria-haspopup="menu"`, `aria-expanded` refletindo `isOpen()`.
- Painel: `role="menu"`, `aria-orientation="vertical"`.
- Itens: `role="menuitem"` dentro de `<li role="none">`; lista tem `role="presentation"`.
- Divisor: `role="separator"` + `aria-hidden="true"`.
- **Ponto de atenção**: não há navegação por setas (`ArrowDown`/`ArrowUp`) entre itens do menu nem `Home`/`End`, que é o comportamento esperado pelo padrão ARIA de menu (APG "Menu Button"). Hoje a navegação depende de `Tab` sequencial. Recomenda-se implementar roving focus com setas ao evoluir este componente.

### Cenários de uso

- Menu de conta do usuário na toolbar (perfil, configurações, sair).
- Qualquer menu de ações contextuais (ex.: ações de uma linha de tabela/card).

### Onde é usado

- `src/app/shared/components/toolbar/toolbar.component.html` (menu do usuário, com slots `trigger` e `header` preenchidos por `app-avatar`).

### Showcase

`/components/dropdown-menu` → `src/app/features/components-showcase/pages/dropdown-menu/dropdown-menu-showcase.component.ts`

### Dependências internas

`ButtonComponent` (trigger).

---

## 5.9. Feedback Message (+ Container)

### Visão geral

Sistema de notificações "toast" (mensagens temporárias flutuantes) da aplicação. Composto por dois componentes que trabalham juntos:

- `aq-feedback-message-container`: componente raiz, deve ser montado **uma única vez** no layout da aplicação (ex.: no layout autenticado). Escuta `FeedbackMessageService` e renderiza todas as mensagens ativas, calculando o empilhamento (stacking) automático de mensagens na mesma posição.
- `aq-feedback-message`: renderiza uma mensagem individual; normalmente não é usado diretamente — é instanciado pelo container.

Disparo de mensagens é feito exclusivamente via `FeedbackMessageService` (nunca colocando `<aq-feedback-message>` manualmente em uma tela).

### Localização

- `src/app/shared/components/feedback-message/` — componente + `feedback-message-*-position.type.ts`, `feedback-message-item.model.ts`, `feedback-message-payload.model.ts`, `feedback-message-type.type.ts`.
- `src/app/shared/components/feedback-message-container/` — componente container.
- `src/app/shared/services/feedback-message.service.ts`.

### Seletor

`aq-feedback-message-container` (montar uma vez no layout raiz) / `aq-feedback-message` (interno).

### API — `FeedbackMessageService`

| Método            | Assinatura                                  | Descrição                                       |
| ----------------- | ------------------------------------------- | ----------------------------------------------- |
| `show`            | `(message: FeedbackMessagePayload) => void` | Exibe uma mensagem com payload completo.        |
| `showSuccess`     | `(label: string, options?) => void`         | Atalho `type: 'success'`.                       |
| `showError`       | `(label: string, options?) => void`         | Atalho `type: 'error'`.                         |
| `showWarning`     | `(label: string, options?) => void`         | Atalho `type: 'warning'`.                       |
| `showInformation` | `(label: string, options?) => void`         | Atalho `type: 'information'`.                   |
| `dismiss`         | `(id: number) => void`                      | Remove uma mensagem específica antes do tempo.  |
| `clear`           | `() => void`                                | Remove todas as mensagens ativas imediatamente. |

#### `FeedbackMessagePayload`

| Campo                 | Tipo                                                 | Padrão          | Descrição                                                                                                       |
| --------------------- | ---------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------- |
| `label`               | `string` (obrigatório)                               | —               | Texto da mensagem.                                                                                              |
| `horizontalPosition?` | `'top' \| 'center' \| 'bottom'`                      | `'top'`         | Posição vertical na tela (nome do campo é "horizontal" por convenção do projeto, mas controla o eixo vertical). |
| `verticalPosition?`   | `'start' \| 'center' \| 'end'`                       | `'center'`      | Alinhamento horizontal (esquerda/centro/direita).                                                               |
| `type?`               | `'success' \| 'error' \| 'warning' \| 'information'` | `'information'` | Tipo semântico — define cor, ícone padrão e `role`/`aria-live`.                                                 |
| `displayDurationMs?`  | `number`                                             | `5000`          | Tempo até auto-dismiss; `0` desativa o auto-dismiss.                                                            |
| `hasIcon?`            | `boolean`                                            | `false`         | Exibe ícone.                                                                                                    |
| `iconName?`           | `string`                                             | `''`            | Ícone customizado; se vazio, usa o ícone padrão do `type`.                                                      |
| `iconPosition?`       | `'start' \| 'end'`                                   | `'start'`       | Posição do ícone relativo ao texto.                                                                             |

### Regras visuais

- Cada `type` mapeia para um par de cores do tema (`success`→verde, `error`→vermelho, `warning`→amarelo, `information`→azul), aplicado como faixa lateral esquerda de 6px em gradiente (`--_accent` → `--_accent-strong`).
- Ícone padrão por tipo: `success`→`check_circle`, `error`→`error`, `warning`→`warning`, `information`→`info`.
- Múltiplas mensagens na mesma posição (`horizontalPosition` + `verticalPosition`) empilham com deslocamento de 88px cada (`stackOffsetPx`), calculado pelo container via `stackIndex`.
- `pointer-events: none` no container e no host da mensagem — apenas a superfície visual (`.feedback-message__surface`) recebe `pointer-events: auto`, permitindo cliques "atravessarem" a área da tela ocupada pelo toast.
- Largura `min(100%, 30rem)`, com `max-inline-size` responsivo em telas ≤640px.

### Regras de acionamento

- `show()` gera um `id` incremental, aplica defaults, adiciona à lista reativa (`signal`) e agenda um `setTimeout` para `dismiss(id)` após `displayDurationMs` (se > 0).
- `dismiss(id)` cancela o timeout pendente (se houver) e remove a mensagem da lista.
- `clear()` cancela todos os timeouts e esvazia a lista.
- Sem interação de clique própria na mensagem (não há botão de fechar manual hoje) — dependem do timeout ou de `dismiss()`/`clear()` chamados programaticamente pelo consumidor.

### Acessibilidade

- `role` dinâmico por tipo: `alert` (erro/warning) vs. `status` (sucesso/informação); `aria-live` correspondente (`assertive` vs. `polite`) — ver `accessibility.md`, seção "Live regions".
- Ícones são `aria-hidden="true"`.

### Cenários de uso

- Confirmação de sucesso após salvar um formulário (`showSuccess`).
- Erro de submissão de formulário ou falha de API (`showError`).
- Avisos não bloqueantes (`showWarning`) e mensagens informativas gerais (`showInformation`).

### Onde é usado

- `FeedbackMessageService` é consumido em: `src/app/features/aquarium/pages/aquarium-create-page/aquarium-create-page.component.ts`, `src/app/features/profile/components/change-password-modal/change-password-modal.component.ts`, `src/app/features/profile/components/delete-account-request-modal/delete-account-request-modal.component.ts`, `src/app/features/profile/facades/profile.facade.ts`.
- O container (`aq-feedback-message-container`) deve estar montado no(s) layout(s) raiz da aplicação para que qualquer chamada ao serviço tenha efeito visual — confirmar presença ao adicionar novos layouts.

### Showcase

`/components/feedback-message` → `src/app/features/components-showcase/pages/feedback-message/feedback-message-showcase.component.ts` (documenta ambos: o container e o disparo via serviço).

**Atenção**: o container (`aq-feedback-message-container`) em si não tem entrada própria no mapa de showcase — está coberto pela mesma página que `feedback-message`, já que ambos formam um único sistema.

---

## 5.10. Text Formfield

### Visão geral

Campo de texto de propósito geral (texto, senha, e-mail, busca, telefone, URL), com suporte a prefixo/sufixo (texto, ícone, botões de ação) e integração completa com Reactive Forms.

### Localização

`src/app/shared/components/formfields/text-formfield/` — componente. Tipos compartilhados em `src/app/shared/components/formfields/`: `formfield-action.model.ts`, `formfield-error-messages.model.ts`, `formfield-icon-position.type.ts`, `formfield-input-type.type.ts`.

### Seletor

`aq-text-formfield` (standalone, implementa `ControlValueAccessor`).

### API

#### Inputs

| Nome                                    | Tipo                                                            | Padrão                      | Descrição                                                                                                                       |
| --------------------------------------- | --------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `label`                                 | `string`                                                        | `''`                        | Label visível (opcional — se vazio, não renderiza `<label>`).                                                                   |
| `placeholder`                           | `string`                                                        | `''`                        | Placeholder nativo.                                                                                                             |
| `hint`                                  | `string`                                                        | `''`                        | Texto de apoio abaixo do campo.                                                                                                 |
| `type`                                  | `'text' \| 'password' \| 'email' \| 'search' \| 'tel' \| 'url'` | `'text'`                    | Tipo nativo do `<input>`.                                                                                                       |
| `id` / `name` / `autocomplete`          | `string`                                                        | gerado / — / —              | Atributos nativos repassados.                                                                                                   |
| `readonly` (alias `readonlyState`)      | `boolean`                                                       | `false`                     | Somente leitura.                                                                                                                |
| `required` (alias `requiredState`)      | `boolean`                                                       | `false`                     | Obrigatório.                                                                                                                    |
| `disabled` (alias `disabledState`)      | `boolean`                                                       | `false`                     | Desabilitado.                                                                                                                   |
| `prefixText` / `suffixText`             | `string`                                                        | —                           | Texto fixo antes/depois do input (ex.: unidade de medida).                                                                      |
| `prefixIcon` / `suffixIcon`             | `string`                                                        | —                           | Ícone Material antes/depois.                                                                                                    |
| `prefixIconFamily` / `suffixIconFamily` | `string`                                                        | `'material-icons-outlined'` | Família do ícone.                                                                                                               |
| `passwordToggle`                        | `boolean`                                                       | `false`                     | Exibe botão de mostrar/ocultar senha (só tem efeito com `type="password"`).                                                     |
| `hideErrorMessage`                      | `boolean`                                                       | `false`                     | Suprime a renderização da mensagem de erro (útil quando o erro é exibido em outro lugar, ex.: dentro de `confirmation-dialog`). |
| `errorMessages`                         | `FormfieldErrorMessages`                                        | `{}`                        | Mapa `validatorKey → mensagem` customizada.                                                                                     |
| `actions`                               | `FormfieldAction[]`                                             | `[]`                        | Botões de ação extras dentro do campo (`{ id, icon, ariaLabel, position?, iconFamily?, disabled?, hidden? }`).                  |

#### Outputs

| Nome          | Tipo              | Quando dispara                              |
| ------------- | ----------------- | ------------------------------------------- |
| `actionClick` | `FormfieldAction` | Ao clicar em uma action (não desabilitada). |

#### Métodos públicos

| Método    | Descrição                                                       |
| --------- | --------------------------------------------------------------- |
| `focus()` | Foca programaticamente o input interno (no-op se desabilitado). |

### Regras visuais

- Container (`text-formfield__control`): borda `1.5px solid $aq-color-border`, `border-radius: $aq-radius-md`, altura mínima 3rem (2.875rem em ≤640px).
- Estado `focused`: aplica `aq-focus-ring` no container inteiro.
- Estado `filled` (valor não vazio): borda muda para `$aq-color-border-strong`.
- Estado `invalid`: borda `$aq-color-error` + `box-shadow: 0 0 0 4px rgb(217 48 37 / 10%)`.
- Estado `disabled`: fundo `$aq-color-surface-muted`, `opacity: 0.72`.
- Estado `readonly`: fundo sutil (`rgb(223 231 239 / 24%)`).
- Autofill do navegador é neutralizado visualmente (cor de texto/caret e fundo forçados via `-webkit-autofill` overrides) para não quebrar o tema.
- Contexto especial: dentro de `.login-card`, o label ganha peso 700 e tamanho maior (0.98rem) — override pontual via `:host-context`.

### Regras de acionamento

- Implementa `ControlValueAccessor` — funciona com `formControlName`/`[formControl]`/`ngModel`.
- `type="password"` + `passwordToggle=true`: adiciona botão de olho que alterna entre `password`/`text`, com `aria-label` dinâmico ("Mostrar senha"/"Ocultar senha").
- Mensagem de erro exibida apenas quando `control.invalid && (control.touched || control.dirty)` — nunca antes do usuário interagir.
- Mapa de erro com fallback embutido em português: `required`, `email`, `minlength`, `maxlength`, `pattern`; `errorMessages` do input tem prioridade sobre o fallback.
- `actions` (botões extra) são posicionadas via `position: 'prefix' | 'suffix'` (padrão `'suffix'`) e podem ser ocultadas individualmente (`hidden`) ou desabilitadas (`disabled`) sem removê-las do array.

### Acessibilidade

- `aria-invalid`, `aria-required`, `aria-describedby` (hint ou erro) no `<input>`.
- `<label for>` associado ao `id` do input (gerado automaticamente se não informado).
- Ícones decorativos e ícones de prefixo/sufixo são `aria-hidden="true"`; botões de ação exigem `ariaLabel` obrigatório no modelo `FormfieldAction`.
- Mensagem de erro em `role="alert"`.

### Cenários de uso

- Campos de e-mail/senha em login, cadastro e recuperação de senha.
- Campo de confirmação por palavra em `confirmation-dialog`.
- Qualquer campo de texto simples em formulários de criação/edição (aquário, medição, aplicação).

### Onde é usado

`aquarium-create-page`, `forgot-password`, `login`, `registration`, `change-password-modal`, `profile-information-card`, além do uso interno em `confirmation-dialog`.

### Showcase

`/components/text-formfield` → `src/app/features/components-showcase/pages/formfields/text-formfield-showcase.component.ts`

---

## 5.11. Textarea Formfield

### Visão geral

Campo de texto multilinha, irmão do `text-formfield` mas sem prefixo/sufixo/ações — voltado a descrições e comentários mais longos.

### Localização

`src/app/shared/components/formfields/textarea-formfield/` — componente. Tipos compartilhados em `formfields/formfield-error-messages.model.ts`.

### Seletor

`aq-textarea-formfield` (standalone, implementa `ControlValueAccessor`).

### API

#### Inputs

| Nome                               | Tipo                                             | Padrão         | Descrição                                                              |
| ---------------------------------- | ------------------------------------------------ | -------------- | ---------------------------------------------------------------------- |
| `label`                            | `string` (obrigatório)                           | —              | Label sempre exigido (diferente do `text-formfield`, onde é opcional). |
| `placeholder`                      | `string`                                         | `''`           | Placeholder nativo.                                                    |
| `hint`                             | `string`                                         | `''`           | Texto de apoio.                                                        |
| `id` / `name` / `autocomplete`     | `string`                                         | gerado / — / — | Atributos nativos.                                                     |
| `rows`                             | `number`                                         | `4`            | Altura inicial em linhas.                                              |
| `resize`                           | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'`   | Direção de redimensionamento permitida pelo usuário.                   |
| `readonly` (alias `readonlyState`) | `boolean`                                        | `false`        | Somente leitura.                                                       |
| `required` (alias `requiredState`) | `boolean`                                        | `false`        | Obrigatório.                                                           |
| `disabled` (alias `disabledState`) | `boolean`                                        | `false`        | Desabilitado.                                                          |
| `errorMessages`                    | `FormfieldErrorMessages`                         | `{}`           | Mapa de mensagens customizadas.                                        |

Sem outputs próprios além do contrato `ControlValueAccessor`.

### Regras visuais

- Container: `min-height: 7.5rem` (7rem em ≤640px), mesma borda/raio/tema do `text-formfield`.
- Mesmos estados visuais de `text-formfield` (`focused`, `filled`, `invalid`, `disabled`, `readonly`) com a mesma paleta.
- `isFilled` considera o valor "preenchido" apenas se houver conteúdo não-whitespace (`value().trim().length > 0`) — diferente do `text-formfield`, que considera qualquer `length > 0`.

### Regras de acionamento

- Implementa `ControlValueAccessor` completo.
- Fallback de mensagens de erro embutido: `required`, `minlength`, `maxlength`, `pattern` (mesmo conjunto do `text-formfield`, exceto `email`).
- Não possui `hideErrorMessage` (sempre exibe erro quando presente, diferente do `text-formfield`).

### Acessibilidade

- Mesmo padrão de `aria-invalid`/`aria-required`/`aria-describedby`/`role="alert"` dos demais formfields.
- `<label for>` sempre renderizado (não é opcional, já que `label` é `input.required`).

### Cenários de uso

- Campo de descrição/observações em formulários de criação (ex.: notas de medição, descrição de aplicação).
- Qualquer texto livre de múltiplas linhas.

### Onde é usado

- `src/app/features/aquarium/pages/aquarium-create-page/aquarium-create-page.component.html`

### Showcase

`/components/textarea-formfield` → `src/app/features/components-showcase/pages/formfields/textarea-formfield-showcase.component.ts`

---

## 5.12. Select Formfield

### Visão geral

Campo de seleção customizado (single ou multiple) com painel dropdown renderizado via Angular CDK Overlay — não é um `<select>` nativo, o que permite ícones, subtítulos e estados de loading/vazio dentro das opções.

### Localização

`src/app/shared/components/formfields/select-formfield/` — componente + `select-formfield-change-event.model.ts`, `select-formfield-option.model.ts`.

### Seletor

`aq-select-formfield` (standalone, implementa `ControlValueAccessor`).

### API

#### Inputs

| Nome                               | Tipo                      | Padrão                  | Descrição                                                                   |
| ---------------------------------- | ------------------------- | ----------------------- | --------------------------------------------------------------------------- |
| `label`                            | `string` (obrigatório)    | —                       | Label do campo.                                                             |
| `options`                          | `SelectFormfieldOption[]` | `[]`                    | `{ id, title, subtitle?, icon?, disabled? }`.                               |
| `multiple`                         | `boolean`                 | `false`                 | Seleção múltipla.                                                           |
| `placeholder`                      | `string`                  | `'Selecione uma opcao'` | Texto do trigger quando nada selecionado.                                   |
| `hint`                             | `string`                  | `''`                    | Texto de apoio.                                                             |
| `loading`                          | `boolean`                 | `false`                 | Exibe estado de carregamento no painel e bloqueia abertura.                 |
| `id`                               | `string`                  | gerado                  | Id do trigger.                                                              |
| `required` (alias `requiredState`) | `boolean`                 | `false`                 | Obrigatório.                                                                |
| `disabled` (alias `disabledState`) | `boolean`                 | `false`                 | Desabilitado.                                                               |
| `errorMessages`                    | `FormfieldErrorMessages`  | `{}`                    | Mapa de mensagens customizadas (fallback embutido cobre apenas `required`). |

#### Outputs

| Nome              | Tipo                         | Quando dispara                                                                                              |
| ----------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `selectionChange` | `SelectFormfieldChangeEvent` | A cada seleção/deseleção — inclui `option`, `previousOption`, `selectedOptions`, `previousSelectedOptions`. |

### Regras visuais

- Trigger com mesma linguagem visual dos demais formfields (borda, raio, altura).
- Painel dropdown (`select-formfield__dropdown`) é anexado via `Overlay` do CDK, posicionado com `flexibleConnectedTo` (tenta abrir para baixo, cai para cima se não couber, com `withPush(true)`), largura igual à do trigger (`width: elementRef.offsetWidth`, `minWidth: 200`).
- Estado `loading`: exibe um ícone de ampulheta (`hourglass_top`) no lugar da lista.
- Estado vazio (`options.length === 0` e não loading): ícone `inbox` + texto "Nenhuma opcao disponivel".
- Opção selecionada exibe um ícone de check; opção com foco de teclado ganha destaque visual (`select-formfield__option--focused`).

### Regras de acionamento

- Clique no trigger (`toggleDropdown`) abre/fecha o painel — bloqueado se `disabled` ou `loading`.
- **Teclado no trigger fechado**: `Enter`/`Space` abrem o painel.
- **Teclado com painel aberto**: `ArrowDown`/`ArrowUp` movem o índice de foco (`focusedIndex`) entre opções habilitadas, com wrap-around; `Enter`/`Space` selecionam a opção focada; `Escape` fecha e devolve foco ao trigger.
- Ao abrir, se já houver uma opção selecionada (modo single), o foco inicial já aponta para ela.
- Em modo `multiple`, selecionar uma opção **não fecha** o painel (permite múltiplas seleções seguidas); em modo single, fecha automaticamente após selecionar.
- Overlay é descartado (`disposeOverlay`) ao fechar, destruir o componente (`ngOnDestroy`) ou perder o controle via `setDisabledState(true)`.
- `focusout` do wrapper (quando o foco realmente sai do componente) marca o campo como `touched`.

### Acessibilidade

- Trigger: `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls` (id do listbox), `aria-activedescendant` (id da opção com foco de teclado), `aria-invalid`, `aria-required`, `aria-describedby`.
- Painel: `role="listbox"`, `aria-label` (usa `placeholder()`), `aria-multiselectable` quando `multiple`.
- Cada opção: `role="option"`, `tabindex="-1"` (não navegável por Tab — só via setas, seguindo o padrão ARIA de listbox), `aria-selected`, `aria-disabled`.

### Cenários de uso

- Seleção de tamanho de página no `paginator` (uso interno).
- Seleção de país/categoria/plano em formulários com muitas opções ou opções com metadados visuais (ícone + subtítulo).

### Onde é usado

- Uso interno em `src/app/shared/components/paginator/paginator.component.html`.
- Uso direto em telas de feature ainda não encontrado além de referências em SCSS de `preferences-card` — ao adicionar seletores de opção única/múltipla em novos formulários, este é o componente indicado (preferir a `select-formfield` no lugar de um `<select>` nativo).

### Showcase

`/components/select-formfield` → `src/app/features/components-showcase/pages/formfields/select-formfield-showcase.component.ts`

### Dependências internas

`OverlayModule` (`@angular/cdk/overlay`).

---

## 5.13. Datepicker Formfield

### Visão geral

Campo de seleção de data com calendário próprio (dias/meses/anos), renderizado em overlay via Angular CDK. Não depende de bibliotecas externas de data além da API nativa `Intl`/`Date`.

### Localização

`src/app/shared/components/formfields/datepicker-formfield/` — componente único (sem models próprios; usa `FormfieldErrorMessages` compartilhado).

### Seletor

`aq-datepicker-formfield` (standalone, implementa `ControlValueAccessor`).

### API

#### Inputs

| Nome                               | Tipo                     | Padrão                 | Descrição                                                                                    |
| ---------------------------------- | ------------------------ | ---------------------- | -------------------------------------------------------------------------------------------- |
| `label`                            | `string` (obrigatório)   | —                      | Label do campo.                                                                              |
| `placeholder`                      | `string`                 | `'Selecione uma data'` | Texto do trigger sem valor.                                                                  |
| `hint`                             | `string`                 | `''`                   | Texto de apoio.                                                                              |
| `id`                               | `string`                 | gerado                 | Id do trigger.                                                                               |
| `locale`                           | `string`                 | `'pt-BR'`              | Locale usado em `Intl.DateTimeFormat` para formatação de data, nomes de mês e dia da semana. |
| `required` (alias `requiredState`) | `boolean`                | `false`                | Obrigatório.                                                                                 |
| `disabled` (alias `disabledState`) | `boolean`                | `false`                | Desabilitado.                                                                                |
| `errorMessages`                    | `FormfieldErrorMessages` | `{}`                   | Mapa de mensagens (fallback embutido cobre apenas `required`).                               |

O valor de forms é uma **string ISO `YYYY-MM-DD`** (`writeValue`/`onChange` trabalham com este formato, não com `Date`).

Sem outputs próprios além do contrato `ControlValueAccessor`.

### Regras visuais

- Trigger com a mesma linguagem visual dos demais formfields (borda/raio/altura/estados), com ícone `calendar_month` à direita.
- Painel (`datepicker-formfield__panel`): `role="dialog"`, largura entre 280px e 360px (`DATEPICKER_PANEL_MIN_WIDTH`/`MAX_WIDTH`), posicionado via CDK Overlay com lógica de auto-flip (abre para cima se não houver espaço suficiente abaixo, com margem de viewport de 16px).
- Três modos de visualização internos (`ViewMode`): `days` (grade de 7 colunas com dias, incluindo dias do mês anterior/seguinte esmaecidos), `months` (grade de 12 meses), `years` (grade de 12 anos, em blocos de 12). O título central do cabeçalho (`navLabel`) é clicável e alterna entre os três modos (`days → months → years → days`).
- Dia atual (`isToday`) e dia selecionado (`isSelected`) recebem destaque visual próprio, independentes um do outro.

### Regras de acionamento

- Clique no trigger (`toggle`) abre/fecha o painel; bloqueado se `disabled`.
- `Escape` (`@HostListener('keydown.escape')`) fecha o painel quando aberto.
- `window:resize` reposiciona o overlay automaticamente enquanto aberto.
- Navegação de período: botões `‹`/`›` avançam/retrocedem um mês (`days`), um ano (`months`) ou 12 anos (`years`), conforme o `viewMode` atual.
- Selecionar um dia grava a data (convertida para ISO), fecha o painel e marca o campo como tocado. Selecionar um mês ou ano navega para o próximo nível de detalhe (`months` → volta para `days`; `years` → avança para `months`) em vez de fechar imediatamente.
- Ao clicar em um dia de outro mês (célula esmaecida), o `viewDate` também é ajustado para esse mês antes de confirmar a seleção.
- Overlay é descartado ao fechar/destruir/desabilitar, restaurando foco ao trigger quando apropriado (`disposeOverlay(restoreFocus)`).

### Acessibilidade

- Trigger: `aria-haspopup="dialog"`, `aria-expanded`, `aria-invalid`, `aria-required`, `aria-describedby`.
- Painel: `role="dialog"` `aria-modal="true"`.
- Botões de navegação de período têm `aria-label` explícito ("Periodo anterior"/"Proximo periodo").
- **Ponto de atenção**: a grade de dias/meses/anos não implementa navegação por setas do teclado (padrão ARIA "Date Picker Dialog" recomendaria `ArrowLeft/Right/Up/Down` movendo entre células) — hoje a navegação interna depende de `Tab` sequencial entre botões. Recomenda-se avaliar essa melhoria ao evoluir o componente.

### Cenários de uso

- Data de nascimento em cadastro/perfil.
- Data de recuperação de senha (token/expiração), data de criação de aquário, data de medição.

### Onde é usado

- `aquarium-create-page`, `forgot-password`, `registration`, `profile-information-card`.

### Showcase

`/components/datepicker-formfield` → `src/app/features/components-showcase/pages/formfields/datepicker-formfield-showcase.component.ts`

### Dependências internas

`OverlayModule` (`@angular/cdk/overlay`).

---

## 5.14. Info Card

### Visão geral

Card de resumo/status para exibir uma entidade (ex.: um aquário) com ícone, badge de status, título, subtítulo, métrica de destaque no título, métricas no rodapé e conteúdo livre projetado no meio.

### Localização

`src/app/shared/components/info-card/` — componente + `info-card-metric.model.ts`, `info-card-status.type.ts`.

### Seletor

`aq-info-card` (standalone).

### API

#### Inputs

| Nome                              | Tipo                                                 | Padrão                      | Descrição                                                                                                             |
| --------------------------------- | ---------------------------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `icon`                            | `string`                                             | `''`                        | Ícone Material exibido no canto superior.                                                                             |
| `iconFamily`                      | `string`                                             | `'material-icons-outlined'` | Família do ícone.                                                                                                     |
| `status`                          | `'stable' \| 'attention' \| 'critical' \| 'unknown'` | `'stable'`                  | Status semântico — só afeta cor de borda/acento (ver "Regras visuais"); precisa de `statusLabel` para exibir o badge. |
| `statusLabel`                     | `string`                                             | `''`                        | Texto do badge de status; se vazio, o badge não é renderizado.                                                        |
| `title`                           | `string` (obrigatório)                               | —                           | Título principal do card.                                                                                             |
| `subtitleLabel` / `subtitleValue` | `string`                                             | `''`                        | Par label/valor exibido abaixo do título (ex.: "Última medição" / "há 2 dias"), separados por `•`.                    |
| `metrics`                         | `InfoCardMetric[]`                                   | `[]`                        | Lista de métricas no rodapé (`{ label, value, icon?, iconClass? }`), separadas por um `<hr>`.                         |
| `titleMetric`                     | `InfoCardMetric \| null`                             | `null`                      | Métrica de destaque ao lado do título (ex.: variação percentual).                                                     |
| `clickable`                       | `boolean`                                            | `false`                     | Torna o card inteiro clicável/focável.                                                                                |
| `fillContainer`                   | `boolean`                                            | `false`                     | Faz o card ocupar 100% do container pai.                                                                              |
| `selected`                        | `boolean`                                            | `false`                     | Estado visual de selecionado.                                                                                         |
| `alignTop`                        | `boolean`                                            | `false`                     | Alinha o conteúdo ao topo em vez de centralizar.                                                                      |

#### Outputs

| Nome        | Tipo   | Quando dispara                                          |
| ----------- | ------ | ------------------------------------------------------- |
| `cardClick` | `void` | Ao clicar (ou `Enter`/`Space`) quando `clickable=true`. |

#### Content projection

`<ng-content>` livre, renderizado entre o cabeçalho (ícone/badge/título/subtítulo) e o rodapé de métricas — usado para gráficos, listas ou qualquer conteúdo adicional do card.

### Regras visuais

- `status` mapeia para cor de badge via `statusBadgeColor`: `stable`→`success`, `attention`→`warning`, `critical`→`error`, `unknown`→`secondary`.
- `clickable`: cursor pointer + leve elevação/realce ao passar o mouse (classe `info-card--interactive`).
- `selected`: destaque de borda/fundo (classe `info-card--selected`).
- `fillContainer`: `height: 100%`/`width: 100%` (classe `info-card--fill`), útil em grids de cards de mesma altura.
- Estrutura interna: `info-card__surface` > (`info-card__top` com header + body) + `<ng-content>` + `info-card__footer` (métricas, condicional).

### Regras de acionamento

- Quando `clickable=true`, o host ganha `role="button"`, `tabindex="0"` e responde a clique de mouse e `Enter`/`Space` (`preventDefault` + emite `cardClick`).
- Quando `clickable=false`, não há `role`/`tabindex` — o card é puramente informativo e não deve capturar foco.

### Acessibilidade

- Ícone do cabeçalho é `aria-hidden="true"` (decorativo — o significado está no `title`/`statusLabel`).
- Divisor entre corpo e métricas (`<hr>`) é `aria-hidden="true"`.
- Badge de status usa `aq-badge` (`variant="outlined" size="small"`), herdando a semântica de texto+cor (nunca só cor) do badge.

### Cenários de uso

- Card de resumo de aquário na home (com métricas de temperatura, pH, etc. no rodapé).
- Qualquer entidade que precise de um resumo visual com status e métricas associadas.

### Onde é usado

- `src/app/features/home/pages/home-page/home-page.component.html`

### Showcase

`/components/info-card` → `src/app/features/components-showcase/pages/info-card/info-card-showcase.component.ts`

### Dependências internas

`BadgeComponent`.

---

## 5.15. Info List

### Visão geral

Lista paginada de `info-list-item`, com estados de carregamento e vazio embutidos e paginação integrada via `aq-paginator`. É o componente de composição de nível mais alto entre os três (`info-list` → `info-list-item` → `badge`).

### Localização

`src/app/shared/components/info-list/` — componente + `info-list-empty-state.model.ts`, `info-list-item-data.model.ts`, `info-list-page-change.model.ts`.

### Seletor

`aq-info-list` (standalone).

### API

#### Inputs

| Nome              | Tipo                               | Padrão        | Descrição                                                                                          |
| ----------------- | ---------------------------------- | ------------- | -------------------------------------------------------------------------------------------------- |
| `items`           | `InfoListItemData[]` (obrigatório) | —             | Dados de cada linha (`title, subtitle?, value, metadata?, badge?`).                                |
| `paginated`       | `boolean`                          | `true`        | Ativa paginação client-side (fatiamento local do array).                                           |
| `pageIndex`       | `number`                           | `0`           | Página atual (controlado externamente — o componente não gerencia estado próprio de página).       |
| `pageSize`        | `number`                           | `10`          | Itens por página.                                                                                  |
| `pageSizeOptions` | `number[]`                         | `[5, 10, 20]` | Opções do seletor de tamanho de página.                                                            |
| `loading`         | `boolean`                          | `false`       | Exibe estado de carregamento (ícone `sync` + label i18n).                                          |
| `disabled`        | `boolean`                          | `false`       | Desabilita interação da lista e do paginador.                                                      |
| `emptyState`      | `InfoListEmptyState \| null`       | `null`        | `{ title, description? }` customizado; se `null`, usa texto padrão traduzido (`listEmptyDefault`). |
| `clickable`       | `boolean`                          | `false`       | Propagado para cada `info-list-item`.                                                              |
| `equalSpacing`    | `boolean`                          | `false`       | Força espaçamento uniforme entre itens.                                                            |
| `flat`            | `boolean`                          | `false`       | Propagado para cada `info-list-item` (remove estilo de card individual).                           |

#### Outputs

| Nome         | Tipo                                             | Quando dispara                                                    |
| ------------ | ------------------------------------------------ | ----------------------------------------------------------------- |
| `pageChange` | `InfoListPageChange` (`{ pageIndex, pageSize }`) | Ao trocar de página ou de tamanho de página no paginador interno. |
| `itemClick`  | `InfoListItemData`                               | Ao clicar em um item (quando `clickable=true`).                   |

### Regras visuais

- Três estados mutuamente exclusivos: `loading` (ícone `sync` girando + texto), vazio (`isEmpty`: não loading e `items.length === 0`, exibe `emptyState`), ou lista renderizada (`<ul role="list">`).
- Paginador só é exibido (`showPaginator`) quando `paginated=true` **e** `totalItems > pageSize` — evita paginação desnecessária para listas curtas.
- Internacionalização: textos padrão de "vazio" e "carregando" vêm de `LanguageService.translation()` (chaves `listEmptyDefault`, `listLoadingDefault`), respeitando o idioma selecionado pelo usuário.

### Regras de acionamento

- `paginated=true`: o próprio componente fatia `items` localmente (`slice(start, start + pageSize)`) — não faz paginação server-side; para paginação server-side, o consumidor deve ouvir `pageChange` e recarregar `items` com os dados da página correta, mantendo `paginated=true` apenas para exibir a UI do paginador (ou implementar sua própria lógica).
- Clique em um item propaga o objeto completo do item (`InfoListItemData`) via `itemClick`, não apenas um índice.

### Acessibilidade

- `aria-busy` no host durante `loading`.
- Lista usa `role="list"` explícito na `<ul>`.
- Label de carregamento (`aria-label` no container de loading) também é anunciado por leitores de tela.
- Cada linha herda toda a acessibilidade de `info-list-item` (`role="button"` quando clicável, etc.).

### Cenários de uso

- Lista de aquários, medições, aplicações ou qualquer coleção de itens com valor de destaque, em qualquer tela que precise de paginação simples.

### Onde é usado

- `src/app/features/home/pages/home-page/home-page.component.html`

### Showcase

`/components/info-list` → `src/app/features/components-showcase/pages/info-list/info-list-showcase.component.ts`

### Dependências internas

`InfoListItemComponent`, `PaginatorComponent`, `LanguageService`.

---

## 5.16. Info List Item

### Visão geral

Linha de lista com título/subtítulo à esquerda e valor/metadado à direita, opcionalmente com badge de status. Normalmente usado dentro do `info-list`, mas pode ser usado isoladamente.

### Localização

`src/app/shared/components/info-list-item/` — componente + `info-list-item-badge.model.ts`, `info-list-item-status.type.ts`.

### Seletor

`aq-info-list-item` (standalone).

### API

#### Inputs

| Nome        | Tipo                        | Padrão  | Descrição                                                                  |
| ----------- | --------------------------- | ------- | -------------------------------------------------------------------------- |
| `title`     | `string` (obrigatório)      | —       | Título principal (esquerda).                                               |
| `subtitle`  | `string`                    | `''`    | Texto secundário abaixo do título.                                         |
| `value`     | `string` (obrigatório)      | —       | Valor principal (direita).                                                 |
| `metadata`  | `string`                    | `''`    | Texto auxiliar abaixo do valor.                                            |
| `badge`     | `InfoListItemBadge \| null` | `null`  | `{ label, status }`; status mapeia para cor.                               |
| `clickable` | `boolean`                   | `false` | Torna a linha clicável/focável.                                            |
| `disabled`  | `boolean`                   | `false` | Desabilita interação (só tem efeito visual/funcional se `clickable=true`). |
| `selected`  | `boolean`                   | `false` | Estado visual selecionado.                                                 |
| `flat`      | `boolean`                   | `false` | Variante sem elevação/borda de card (linha "plana").                       |

#### Outputs

| Nome        | Tipo   | Quando dispara                                                           |
| ----------- | ------ | ------------------------------------------------------------------------ |
| `itemClick` | `void` | Ao clicar (ou `Enter`/`Space`) quando `clickable=true` e não `disabled`. |

### Regras visuais

- Layout de duas colunas: `info-list-item__main` (título + badge + subtítulo) à esquerda, `info-list-item__aside` (valor + metadado) à direita.
- `badge.status` mapeia para cor: `normal`→`success`, `attention`→`warning`, `danger`→`error`, `neutral`→`tertiary` (badge renderizado com `variant="filled" size="small"`).
- `flat`: remove estilo de card, útil quando o container pai (ex.: `info-list`) já fornece a superfície visual.

### Regras de acionamento

- Quando `clickable=true` e `disabled=false`: `role="button"`, `tabindex="0"`, responde a clique e `Enter`/`Space`.
- Quando `disabled=true` (com `clickable=true`): `aria-disabled="true"`, `tabindex` removido (`null`), clique/teclado ignorados.

### Acessibilidade

- `aria-disabled` só é aplicado quando o item é clicável **e** desabilitado simultaneamente (item não-clicável nunca recebe esse atributo, pois não é um controle interativo).
- Badge herda a semântica texto+cor do `aq-badge`.

### Cenários de uso

- Linha de item em `info-list` (uso primário — ver `info-list.md`).
- Lista de transações, medições ou eventos com valor destacado à direita.

### Onde é usado

- Uso interno em `src/app/shared/components/info-list/info-list.component.html`.
- Nenhum uso direto isolado encontrado em `features/` — hoje é consumido exclusivamente através do `info-list`.

### Showcase

`/components/info-list-item` → `src/app/features/components-showcase/pages/info-list-item/info-list-item-showcase.component.ts`

### Dependências internas

`BadgeComponent`.

---

## 5.17. Language Switcher

### Visão geral

Seletor de idioma da aplicação (dropdown customizado), usado nas telas de autenticação e na toolbar do layout autenticado.

### Localização

`src/app/shared/components/language-switcher/` — componente. Depende de `src/app/shared/constants/language-options.constant.ts` (`LANGUAGE_OPTIONS`) e `src/app/shared/types/language-code.type.ts` (`LanguageCode`).

### Seletor

`app-language-switcher` (standalone).

### API

#### Inputs

| Nome               | Tipo                         | Padrão | Descrição                                                  |
| ------------------ | ---------------------------- | ------ | ---------------------------------------------------------- |
| `label`            | `string` (obrigatório)       | —      | Texto usado como `aria-label` do trigger e título do menu. |
| `selectedLanguage` | `LanguageCode` (obrigatório) | —      | Idioma atualmente selecionado (controlado externamente).   |

#### Outputs

| Nome             | Tipo           | Quando dispara                             |
| ---------------- | -------------- | ------------------------------------------ |
| `languageChange` | `LanguageCode` | Ao selecionar um idioma diferente no menu. |

### Regras visuais

- Trigger exibe um ícone de globo (`language-switcher__trigger-globe`, elemento decorativo via CSS, não ícone Material) + `triggerLabel` do idioma selecionado.
- Menu suspenso lista todos os `LANGUAGE_OPTIONS`, cada opção com `primaryLabel` (nome no idioma nativo) e `secondaryLabel` (nome traduzido/código); opção ativa exibe um check (`✓`) e destaque visual.

### Regras de acionamento

- Clique no trigger (`toggleMenu`, com `stopPropagation`) alterna `isMenuOpen`.
- Fecha automaticamente ao clicar fora do componente (`@HostListener('document:click')`).
- Selecionar um idioma emite `languageChange` e fecha o menu — **o componente não gerencia o idioma atual internamente**; cabe ao componente pai atualizar `selectedLanguage` (via `LanguageService` normalmente) em resposta ao evento.

### Acessibilidade

- Container: `aria-label` (mesmo texto do `label`).
- Trigger: `aria-expanded`, `aria-label`.
- **Ponto de atenção**: o menu não usa `role="menu"`/`role="menuitem"` nem fecha com `Escape` (diferente do `dropdown-menu`, que implementa ambos) — recomenda-se alinhar este componente ao mesmo padrão ARIA do `dropdown-menu` para consistência, incluindo suporte a `Escape`.

### Cenários de uso

- Seletor de idioma nas telas públicas de autenticação (login, cadastro, recuperação de senha).
- Seletor de idioma na toolbar do layout autenticado.

### Onde é usado

- `forgot-password`, `login`, `registration` (telas de autenticação, fora do layout autenticado).
- `src/app/shared/components/toolbar/toolbar.component.html` (dentro da toolbar do layout autenticado).

### Showcase

**Não possui showcase** (ver `showcase-guidelines.md`, pendência conhecida). Ao criar, cobrir: idioma selecionado, abertura/fechamento do menu e o evento `languageChange`.

---

## 5.18. Modal

### Visão geral

Diálogo modal genérico e altamente configurável, aberto programaticamente via `ModalService`. Suporta conteúdo por componente dinâmico (`NgComponentOutlet`) ou por template (`NgTemplateOutlet`), título/descrição com suporte a chave de tradução, e um footer de ações configurável.

### Localização

- Componente: `src/app/shared/components/modal/` — `modal.component.ts` / `.html` / `.scss`, `modal-action.model.ts`, `modal-close-result.model.ts`, `modal-component-data.model.ts`, `modal-config.model.ts`, `modal-i18n-labels.model.ts`, `modal-icon-position.type.ts`, `modal-size.type.ts`.
- Serviço: `src/app/shared/services/modal.service.ts`.
- Suporte: `src/app/shared/modal/modal-ref.ts` (`ModalRef`), `src/app/shared/modal/modal-data.token.ts` (`MODAL_DATA`, injetável dentro do conteúdo do modal).

### Seletor

`aq-modal` — **não é usado diretamente no template**; é resolvido internamente pelo Angular CDK Dialog via `ModalService.open(config)`.

### API

#### `ModalService.open(config: ModalConfig): ModalRef`

#### `ModalConfig`

| Campo                              | Tipo                                                           | Padrão     | Descrição                                                                     |
| ---------------------------------- | -------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------- |
| `title?` / `titleKey?`             | `string` / `keyof TranslationDictionary`                       | —          | Título literal ou chave de tradução (chave tem prioridade).                   |
| `description?` / `descriptionKey?` | `string` / `keyof TranslationDictionary`                       | —          | Descrição literal ou traduzida.                                               |
| `size`                             | `ModalSize` (`'small' \| 'medium' \| 'large' \| 'fullscreen'`) | `'medium'` | Tamanho do modal.                                                             |
| `role`                             | `'dialog' \| 'alertdialog'`                                    | `'dialog'` | Role ARIA.                                                                    |
| `showCloseButton`                  | `boolean`                                                      | `false`    | Exibe botão "X" no cabeçalho.                                                 |
| `closeOnBackdropClick`             | `boolean`                                                      | `true`     | Fecha ao clicar fora.                                                         |
| `closeOnEscape`                    | `boolean`                                                      | `true`     | Fecha com `Escape`.                                                           |
| `hasBackdrop`                      | `boolean`                                                      | `true`     | Exibe overlay escuro atrás do modal.                                          |
| `actions`                          | `ModalAction[]`                                                | `[]`       | Botões do footer.                                                             |
| `data?`                            | `unknown`                                                      | —          | Dados injetáveis via `MODAL_DATA` dentro do `contentComponent`.               |
| `contentComponent?`                | `Type<unknown>`                                                | —          | Componente dinâmico a renderizar no corpo.                                    |
| `contentComponentInputs?`          | `Record<string, unknown>`                                      | `{}`       | Inputs passados ao `contentComponent` via `NgComponentOutlet`.                |
| `contentTemplate?`                 | `TemplateRef<unknown>`                                         | —          | Alternativa a `contentComponent`: template inline.                            |
| `contentTemplateContext?`          | `Record<string, unknown>`                                      | `{}`       | Contexto extra mesclado ao contexto padrão (`$implicit`, `data`, `modalRef`). |
| `i18nLabels?`                      | `ModalI18nLabels`                                              | —          | Override do `aria-label` do botão fechar.                                     |

#### `ModalAction`

`{ id, label?, labelKey?, variant?, color?, disabled?, closeOnClick?, iconName?, iconPosition? }` — reaproveita `ButtonVariant`/`ButtonColor` do `button.component`.

#### `ModalRef`

Retornado por `ModalService.open()`. Expõe métodos/observables para fechar o modal e escutar cliques em ações/backdrop (consultar `src/app/shared/modal/modal-ref.ts` para a API completa).

### Regras visuais

- 4 tamanhos via classe `modal--<size>` e `modal__surface--<size>` (`small`/`medium`/`large`/`fullscreen`).
- Cabeçalho (`modal__header`) só é renderizado se houver título, descrição **ou** `showCloseButton` — modal pode não ter cabeçalho algum.
- Footer (`modal__footer`) só é renderizado se `actions.length > 0`.
- Botão fechar usa `aqButton` `variant="icon" color="tertiary"`.
- Botões de ação no footer usam `aqButton` com `variant`/`color` configuráveis por ação (padrão `flat`/`primary`), suportando ícone antes ou depois do label.

### Regras de acionamento

- Fechamento por 4 vias, todas resultando em `ModalCloseResult` com `reason` distinto: `'close-button'` (botão X), `'backdrop'` (clique fora, só se `closeOnBackdropClick`), `'escape'` (tecla Esc, só se `closeOnEscape`), `'action'` (clique em ação com `closeOnClick !== false`) — mais `'programmatic'` para fechamento via código.
- Cada `ModalAction` pode optar por **não** fechar o modal ao ser clicada (`closeOnClick: false`), útil para ações assíncronas (ex.: salvar) que só devem fechar o modal após sucesso — nesse caso, o consumidor escuta o clique via `ModalRef` e chama `modalRef.close(...)` manualmente quando apropriado.
- Foco é **preso dentro do modal** via `cdkTrapFocus` + `cdkTrapFocusAutoCapture="true"` (captura automática do primeiro elemento focável ao abrir) — usuário de teclado não consegue tabular para fora do modal enquanto ele está aberto.
- Título/descrição resolvidos por prioridade: chave de tradução (`titleKey`/`descriptionKey`) tem prioridade sobre o texto literal (`title`/`description`) quando ambos são informados.

### Acessibilidade

- `[attr.role]` = `config.role` (`dialog` ou `alertdialog`), `aria-modal="true"`.
- `aria-labelledby`/`aria-describedby` apontam para IDs únicos por instância (`aq-modal-title-<n>`/`aq-modal-description-<n>`), só quando título/descrição existem.
- Foco preso (CDK `cdkTrapFocus`) — ver acima.
- Botão fechar tem `aria-label` resolvido (customizável via `i18nLabels`, com fallback traduzido `t().modalCloseLabel`).

### Cenários de uso

- Alteração de senha (`change-password-modal`), solicitação de exclusão de conta (`delete-account-request-modal`) — ambos via `ModalService` na `profile.facade.ts`.
- Qualquer fluxo que precise de um formulário, confirmação complexa ou conteúdo rico sobreposto à tela atual.

### Onde é usado

- `ModalService` é injetado e usado em `src/app/features/profile/facades/profile.facade.ts` (abre `change-password-modal` e `delete-account-request-modal` como `contentComponent`).

### Showcase

`/components/modal` → `src/app/features/components-showcase/pages/modal/modal-showcase.component.ts` (há também `modal-showcase-dynamic-content.component.ts` como exemplo de `contentComponent` dinâmico).

### Dependências internas

`ButtonComponent`, `CdkTrapFocus` (`@angular/cdk/a11y`), `LanguageService`.

---

## 5.19. Nav Menu

### Visão geral

Menu de navegação lateral (sidebar) colapsável, com suporte a grupos expansíveis (dois níveis), controle de visibilidade por papel de usuário (`roles`) e por plano (`allowedPlans`). Usado como navegação principal do layout autenticado e como navegação lateral da área de showcase de componentes.

### Localização

`src/app/shared/components/nav-menu/` — componente + `nav-menu-item.model.ts`.

### Seletor

`app-nav-menu` (standalone).

### API

#### Inputs

| Nome                            | Tipo                          | Padrão                    | Descrição                                                                                                 |
| ------------------------------- | ----------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------- |
| `items`                         | `NavMenuItem[]` (obrigatório) | —                         | Árvore de itens (`{ id, label, icon, route?, exact?, roles?, allowedPlans?, displayRoute?, children? }`). |
| `userRoles`                     | `string[]`                    | `[]`                      | Papéis do usuário atual, usados para filtrar itens com `roles` definido.                                  |
| `userPlan`                      | `string \| null \| undefined` | `null`                    | Plano do usuário atual, usado para filtrar itens com `allowedPlans` definido.                             |
| `collapseLabel` / `expandLabel` | `string`                      | `'Collapse'` / `'Expand'` | Textos/aria-labels do botão de colapsar (devem ser passados traduzidos pelo consumidor).                  |
| `homeAriaLabel`                 | `string`                      | `'Go to home page'`       | `aria-label` do link de marca/logo.                                                                       |

Sem outputs — navegação é feita via `routerLink` nativo, não por eventos emitidos.

### Regras de filtragem de itens (`NavMenuItem`)

- `displayRoute: false` remove o item completamente (nem ele nem seus filhos aparecem).
- `roles`: se definido e não vazio, o item só aparece se ao menos um papel do usuário estiver na lista.
- `allowedPlans`: se definido e não vazio, o item só aparece se `userPlan` estiver na lista.
- Itens com filhos: um item pai só aparece se tiver **ao menos um filho visível** após aplicar os filtros recursivamente (ou se ele próprio tiver uma `route` válida, no caso de não ter filhos).
- Essa resolução (`toVisibleItem`) é recursiva e recalculada via `computed` a cada mudança de `items`/`userRoles`/`userPlan`.

### Regras visuais

- Estado colapsado (`collapsed`, toggle interno via botão no rodapé): esconde labels de texto, mantém apenas ícones; usa `title` (tooltip nativo) como fallback de identificação quando colapsado.
- Grupos com filhos (`nav-menu__group-trigger`) exibem uma seta que gira ao expandir/colapsar (`nav-menu__group-trigger--expanded`).
- Item ativo (rota atual) é destacado via `routerLinkActive` (`nav-menu__link--active`/`nav-menu__sublink--active`), com `routerLinkActiveOptions: { exact: item.exact ?? false }` configurável por item.

### Regras de acionamento

- Clique no botão de rodapé (`toggleCollapse`) alterna o estado colapsado/expandido de todo o menu.
- Clique no cabeçalho de um grupo com filhos (`toggleGroup`) expande/colapsa aquele grupo especificamente — **não tem efeito se o menu estiver colapsado** (grupos ficam sempre fechados visualmente nesse estado).
- Estado de expansão de cada grupo é individual (`expandedGroups: Record<string, boolean>`), com padrão **expandido** (`?? true`) até o usuário colapsar manualmente.

### Acessibilidade

- Link de marca/logo: `aria-label` (`homeAriaLabel`).
- Botão de colapsar: `aria-label` dinâmico (`collapsed() ? expandLabel() : collapseLabel()`).
- Trigger de grupo: `aria-expanded` (só aplicado quando o menu não está colapsado — `collapsed() ? null : isGroupExpanded(item)`).
- **Ponto de atenção**: o menu não usa `<nav>` com `role="navigation"` explícito além do elemento `<nav>` nativo (que já tem essa semântica implícita) — ok por padrão HTML5, mas se houver mais de uma navegação na página, considerar `aria-label` no próprio `<nav>` para diferenciá-las.

### Cenários de uso

- Navegação principal do layout autenticado (`authenticated-layout`).
- Navegação lateral da área de showcase de componentes (`components-showcase`), sem uso de `roles`/`allowedPlans`.

### Onde é usado

- `src/app/layouts/authenticated-layout/authenticated-layout.component.html`
- `src/app/features/components-showcase/components-showcase.component.html` (via `sidebarItems`, ver `showcase-guidelines.md`)

### Showcase

`/components/menu` → `src/app/features/components-showcase/pages/nav-menu/nav-menu-showcase.component.ts`

---

## 5.20. Paginator

### Visão geral

Controle de paginação com seletor de itens por página (via `aq-select-formfield`), indicador "X-Y de Z" e botões anterior/próximo. Usado internamente pelo `info-list`, mas reutilizável por qualquer lista paginada.

### Localização

`src/app/shared/components/paginator/` — componente + `paginator-change.model.ts`.

### Seletor

`aq-paginator` (standalone).

### API

#### Inputs

| Nome              | Tipo                   | Padrão        | Descrição                                        |
| ----------------- | ---------------------- | ------------- | ------------------------------------------------ |
| `pageIndex`       | `number`               | `0`           | Página atual (0-based, controlada externamente). |
| `pageSize`        | `number`               | `10`          | Itens por página.                                |
| `pageSizeOptions` | `number[]`             | `[5, 10, 20]` | Opções do seletor de tamanho.                    |
| `totalItems`      | `number` (obrigatório) | —             | Total de itens da coleção completa.              |
| `disabled`        | `boolean`              | `false`       | Desabilita todos os controles.                   |

#### Outputs

| Nome         | Tipo                                          | Quando dispara                                            |
| ------------ | --------------------------------------------- | --------------------------------------------------------- |
| `pageChange` | `PaginatorChange` (`{ pageIndex, pageSize }`) | Ao clicar anterior/próximo ou trocar o tamanho de página. |

### Regras visuais

- Layout: seletor de tamanho à esquerda/topo (`paginator__size`), navegação à direita/baixo (`paginator__nav`) com contador + botões.
- Botões anterior/próximo usam ícones `chevron_left`/`chevron_right` e ficam `disabled` nativamente quando não há página anterior/próxima.

### Regras de acionamento

- `hasPreviousPage` = `pageIndex > 0`; `hasNextPage` = `(pageIndex + 1) * pageSize < totalItems` — os botões usam o atributo `disabled` nativo do `<button>`, não apenas estilo, então não são focáveis/acionáveis via teclado quando desabilitados (comportamento nativo do HTML).
- Trocar o tamanho de página **sempre reseta para a página 0** (`pageChange.emit({ pageIndex: 0, pageSize: ... })`) — evita ficar em uma página inexistente após aumentar o tamanho.
- Sincronização reativa via `effect()`: o `FormControl` interno do seletor de tamanho é atualizado automaticamente sempre que `pageSize` (input) muda externamente, sem emitir evento de volta (`emitEvent: false`), evitando loop; o mesmo padrão habilita/desabilita o `FormControl` conforme o input `disabled`.
- Não gerencia estado de página internamente — é 100% controlado pelo componente pai via inputs (`pageIndex`, `pageSize`) + output (`pageChange`).

### Acessibilidade

- Contador de itens (`paginator__info`) tem `aria-live="polite"`, anunciando a mudança de intervalo sem interromper o usuário.
- Botões de navegação têm `aria-label` explícito ("Pagina anterior"/"Proxima pagina").
- O seletor de tamanho herda toda a acessibilidade do `aq-select-formfield` (label "Itens por pagina").

### Cenários de uso

- Paginação de qualquer lista/tabela de itens (usado hoje dentro do `info-list`).

### Onde é usado

- Uso interno em `src/app/shared/components/info-list/info-list.component.html`. Nenhum uso direto isolado em `features/` no momento.

### Showcase

**Não possui showcase próprio** (ver `showcase-guidelines.md`, pendência conhecida) — hoje só é exercitado indiretamente através do showcase de `info-list`.

### Dependências internas

`SelectFormfieldComponent`, `ReactiveFormsModule`.

---

## 5.21. Photo Upload

### Visão geral

Dropzone de upload de imagem única, com suporte a clique (seletor de arquivo nativo), arrastar-e-soltar (drag-and-drop), validação de tipo/tamanho e pré-visualização opcional.

### Localização

`src/app/shared/components/photo-upload/` — componente + `photo-upload-rejection.model.ts`.

### Seletor

`aq-photo-upload` (standalone).

### API

#### Inputs

| Nome                                    | Tipo             | Padrão                              | Descrição                                                                                                               |
| --------------------------------------- | ---------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `label`                                 | `string`         | `'Drop your image here, or'`        | Texto principal (idealmente sobrescrito e traduzido pelo consumidor).                                                   |
| `browseLabel`                           | `string`         | `'browse'`                          | Texto do link/ação de navegar arquivos, exibido em destaque dentro do `label`.                                          |
| `hint`                                  | `string`         | auto-gerado                         | Texto de apoio; se não informado, gera automaticamente "Supports: X (Max YMB)" a partir de `accept`/`maxFileSizeBytes`. |
| `accept`                                | `string`         | `'image/jpeg,image/png,image/webp'` | Lista de tipos/mimes/extensões aceitos (atributo `accept` nativo + validação própria).                                  |
| `maxFileSizeBytes`                      | `number`         | `5 * 1024 * 1024` (5MB)             | Tamanho máximo do arquivo.                                                                                              |
| `fieldName`                             | `string`         | `'file'`                            | Nome do campo usado ao montar o `FormData` emitido.                                                                     |
| `icon`                                  | `string`         | `'image'`                           | Ícone Material exibido na dropzone.                                                                                     |
| `previewUrl`                            | `string \| null` | `null`                              | URL de preview controlada externamente (ex.: imagem já salva no servidor).                                              |
| `errorMessage`                          | `string \| null` | `null`                              | Erro controlado externamente (ex.: erro retornado pela API após upload).                                                |
| `invalidTypeMessage` / `maxSizeMessage` | `string`         | auto-gerado                         | Mensagens customizadas para os dois tipos de rejeição local.                                                            |
| `showPreview`                           | `boolean`        | `false`                             | Ativa geração de preview local (via `URL.createObjectURL`) do arquivo selecionado.                                      |
| `disabled` (alias `disabledState`)      | `boolean`        | `false`                             | Desabilita clique/drag/drop.                                                                                            |

#### Outputs

| Nome               | Tipo                                                                                     | Quando dispara                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `fileSelected`     | `File`                                                                                   | Arquivo válido selecionado (clique ou drop).                                          |
| `formDataSelected` | `FormData`                                                                               | Mesmo momento de `fileSelected`, já empacotado em `FormData` com a chave `fieldName`. |
| `fileRejected`     | `PhotoUploadRejection` (`{ reason: 'invalid-type' \| 'file-too-large', file, message }`) | Arquivo inválido (tipo ou tamanho).                                                   |

### Regras visuais

- Estado `dragging`: destaque visual enquanto um arquivo é arrastado sobre a área.
- Estado `disabled`: bloqueia interação visual e funcionalmente.
- Estado `invalid` (`resolvedError`): combina erro local (validação) com `errorMessage` externo (API) — local tem prioridade se ambos existirem simultaneamente.
- Estado `with-preview`: quando há uma URL de preview resolvida (local ou externa), exibe a imagem ao lado/abaixo da dropzone.
- Nome do arquivo selecionado é exibido como confirmação textual (`selectedFileName`).

### Regras de acionamento

- Clique na dropzone inteira (`openFilePicker`) abre o seletor de arquivo nativo do sistema operacional (bloqueado se `disabled`).
- `Enter`/`Space` com a dropzone focada também abrem o seletor (`onKeydown`), já que a dropzone é `role="button"` `tabindex="0"`.
- Drag-and-drop: `dragover` (previne comportamento padrão + ativa estado `dragging`), `dragleave` (desativa), `drop` (processa o primeiro arquivo do `DataTransfer`, previne comportamento padrão).
- Validação em duas etapas, na ordem: (1) tipo aceito — compara contra `accept` normalizando tokens (extensão `.ext`, mime exato, ou `group/*`); (2) tamanho máximo. Falha em qualquer etapa emite `fileRejected` com a razão específica e **não** emite `fileSelected`/`formDataSelected`.
- Sucesso: atualiza nome do arquivo, gera preview (se `showPreview=true` e `URL.createObjectURL` disponível), emite `fileSelected` e `formDataSelected` simultaneamente.
- Input de arquivo nativo tem seu `value` resetado após cada seleção (`input.value = ''`), permitindo selecionar o mesmo arquivo duas vezes seguidas e ainda disparar o evento `change`.
- `URL.createObjectURL`/`revokeObjectURL` são gerenciados com cuidado para evitar vazamento de memória: a URL anterior é sempre revogada antes de criar uma nova, e também no `DestroyRef.onDestroy`.

### Acessibilidade

- Dropzone: `role="button"`, `tabindex="0"`, `aria-disabled`, `aria-describedby` (aponta para hint + erro, quando presente).
- Mensagem de erro em `role="alert"`.
- Input de arquivo real é `hidden` (mas continua no DOM e acessível programaticamente via clique simulado) — a interação do usuário passa pela dropzone, não pelo input nativo diretamente.
- Imagem de preview usa `alt=""` (decorativa — o nome do arquivo já está disponível como texto separado).

### Cenários de uso

- Foto de perfil do usuário.
- Foto de capa/identificação de um aquário na tela de criação.

### Onde é usado

- `src/app/features/aquarium/pages/aquarium-create-page/aquarium-create-page.component.html`

### Showcase

`/components/photo-upload` → `src/app/features/components-showcase/pages/photo-upload/photo-upload-showcase.component.ts`

---

## 5.22. Segmented Control

### Visão geral

Controle de seleção única entre um pequeno conjunto de opções mutuamente exclusivas, apresentado como um grupo de botões conectados (estilo "tabs"/"toggle group"). Alternativa mais leve ao `card-selection` para 2–5 opções curtas sem descrição/ícone.

### Localização

`src/app/shared/components/segmented-control/` — componente + `segmented-control-option.model.ts`.

### Seletor

`aq-segmented-control` (standalone).

### API

#### Inputs

| Nome        | Tipo                       | Padrão  | Descrição                                               |
| ----------- | -------------------------- | ------- | ------------------------------------------------------- |
| `options`   | `SegmentedControlOption[]` | `[]`    | `{ value, label }`.                                     |
| `value`     | `string`                   | `''`    | Valor selecionado atualmente (controlado externamente). |
| `ariaLabel` | `string` (obrigatório)     | —       | Nome acessível do grupo (não há `<label>` visível).     |
| `disabled`  | `boolean`                  | `false` | Desabilita todas as opções.                             |

#### Outputs

| Nome          | Tipo     | Quando dispara                              |
| ------------- | -------- | ------------------------------------------- |
| `valueChange` | `string` | Ao selecionar uma opção diferente da atual. |

**Nota**: este componente **não** implementa `ControlValueAccessor` — não é diretamente compatível com `formControlName`/`[formControl]`; integração com Reactive Forms requer um binding manual (`[value]` + `(valueChange)`) no componente pai, diferente de `card-selection`, `select-formfield`, etc.

### Regras visuais

- Grupo de botões conectados visualmente (`segmented-control__group`), cada opção como `<button>`.
- Opção selecionada recebe destaque visual (`segmented-control__option--selected`).

### Regras de acionamento

- Clique em uma opção (`select`) só emite `valueChange` se o `value` for diferente do atual e o grupo não estiver desabilitado (evita eventos redundantes).
- **Roving focus por teclado**: `ArrowRight`/`ArrowLeft` movem para a próxima/anterior opção **e já selecionam** (com wrap-around circular) — diferente do `card-selection` em modo `multiple`, aqui não há distinção entre "mover foco" e "selecionar" (comportamento de radiogroup nativo).
- `tabindex` gerenciado por roving tabindex: apenas a opção selecionada tem `tabindex="0"`; as demais têm `tabindex="-1"` (só alcançáveis via setas, não via Tab sequencial) — padrão ARIA correto para `radiogroup`.

### Acessibilidade

- Grupo: `role="radiogroup"`, `aria-label`.
- Cada opção: `role="radio"`, `aria-checked`.
- Segue integralmente o padrão WAI-ARIA APG "Radio Group".

### Cenários de uso

- Alternância entre unidades de medida (ex.: °C/°F), modos de visualização (lista/grade), ou qualquer escolha binária/ternária compacta — usado hoje para preferências de usuário.

### Onde é usado

- `src/app/features/profile/components/preferences-card/preferences-card.component.html`

### Showcase

**Não possui showcase** (ver `showcase-guidelines.md`, pendência conhecida).

---

## 5.23. Settings Card

### Visão geral

Container de card para seções de configuração (ex.: página de perfil), com cabeçalho (ícone + título + subtítulo), corpo de conteúdo livre e rodapé de ações opcional.

### Localização

`src/app/shared/components/settings-card/` — componente + `settings-card-tone.type.ts`.

### Seletor

`aq-settings-card` (standalone).

### API

#### Inputs

| Nome       | Tipo                    | Padrão      | Descrição                                                                           |
| ---------- | ----------------------- | ----------- | ----------------------------------------------------------------------------------- |
| `icon`     | `string`                | `''`        | Ícone Material do cabeçalho (opcional).                                             |
| `title`    | `string` (obrigatório)  | —           | Título da seção.                                                                    |
| `subtitle` | `string`                | `''`        | Texto de apoio abaixo do título.                                                    |
| `tone`     | `'default' \| 'danger'` | `'default'` | `'danger'` sinaliza visualmente uma seção sensível/destrutiva (ex.: zona de risco). |

#### Content projection (slots)

| Slot                   | Uso                                                           |
| ---------------------- | ------------------------------------------------------------- |
| (default, sem seletor) | Corpo do card — qualquer conteúdo (formulário, texto, lista). |
| `[slot=actions]`       | Rodapé de ações (ex.: botões salvar/cancelar/excluir).        |

### Regras visuais

- `tone="danger"` aplica estilo de destaque de risco (classe `settings-card--danger`) — usado para seções como exclusão de conta.
- Estrutura: `settings-card__surface` > `settings-card__header` (ícone + heading) + `settings-card__body` (conteúdo projetado) + `settings-card__actions` (slot de ações).

### Regras de acionamento

Componente puramente estrutural/apresentacional — não emite eventos nem gerencia estado próprio. Toda interatividade vem do conteúdo projetado.

### Acessibilidade

- Ícone do cabeçalho é `aria-hidden="true"`.
- Título/subtítulo são texto simples (`<p>`) — se a hierarquia de heading da página exigir, o consumidor deve avaliar se `title` deveria ser semanticamente um `<h2>`/`<h3>` (hoje não é).

### Cenários de uso

- Seção "Segurança da conta" (`account-security-card`), "Zona de perigo" (`danger-zone-card`, `tone="danger"`), "Preferências" (`preferences-card`), "Informações do perfil" (`profile-information-card`) — todas as seções da página de perfil usam este componente como container padrão.

### Onde é usado

- `src/app/features/profile/components/account-security-card/account-security-card.component.html`
- `src/app/features/profile/components/danger-zone-card/danger-zone-card.component.html`
- `src/app/features/profile/components/preferences-card/preferences-card.component.html`
- `src/app/features/profile/components/profile-information-card/profile-information-card.component.html`

### Showcase

**Não possui showcase** (ver `showcase-guidelines.md`, pendência conhecida) — apesar de já ser o container padrão de 4 seções em produção.

---

## 5.24. Switch

### Visão geral

Alternador binário (toggle) estilo iOS/Material, para configurações on/off. Componente mínimo, sem integração nativa com `ControlValueAccessor` — trabalha por input/output direto.

### Localização

`src/app/shared/components/switch/` — componente único, sem models auxiliares.

### Seletor

`aq-switch` (standalone).

### API

#### Inputs

| Nome        | Tipo                   | Padrão  | Descrição                                       |
| ----------- | ---------------------- | ------- | ----------------------------------------------- |
| `checked`   | `boolean`              | `false` | Estado atual (controlado externamente).         |
| `disabled`  | `boolean`              | `false` | Desabilita interação.                           |
| `ariaLabel` | `string` (obrigatório) | —       | Nome acessível (não há label visível embutido). |

#### Outputs

| Nome            | Tipo      | Quando dispara                                         |
| --------------- | --------- | ------------------------------------------------------ |
| `checkedChange` | `boolean` | Ao clicar (alterna o valor oposto ao `checked` atual). |

**Nota**: assim como `segmented-control`, **não** implementa `ControlValueAccessor` — para uso com Reactive Forms, o componente pai deve fazer o binding manual (`[checked]="control.value"` + `(checkedChange)="control.setValue($event)"`).

### Regras visuais

- Trilho (`switch__track`) muda de aparência conforme `checked` (classe `switch__track--checked`); "thumb" (`switch__thumb`) desliza para a posição correspondente.
- Estado `disabled` segue o padrão nativo de `<button disabled>` (opacidade reduzida, sem interação).

### Regras de acionamento

- Todo o controle é um único `<button type="button" role="switch">` — clique (`toggle()`) emite `checkedChange` com o valor invertido; bloqueado se `disabled`.
- Ativação por teclado é nativa do elemento `<button>` (Enter/Space), sem necessidade de handler customizado.

### Acessibilidade

- `role="switch"`, `aria-checked` (reflete `checked()`), `aria-label` (obrigatório via input).
- "Thumb" interno é `aria-hidden="true"` (puramente visual).
- Segue o padrão WAI-ARIA APG "Switch".

### Cenários de uso

- Preferências on/off (notificações, modo escuro, unidades) na página de perfil.
- Ativação/desativação de uma opção dentro de um formulário de criação (ex.: alertas automáticos de aquário).

### Onde é usado

- `src/app/features/aquarium/pages/aquarium-create-page/aquarium-create-page.component.html`
- `src/app/features/profile/components/preferences-card/preferences-card.component.html`

### Showcase

**Não possui showcase** (ver `showcase-guidelines.md`, pendência conhecida), apesar de já estar em uso em duas telas de produção.

---

## 5.25. Tabs

### Visão geral

Navegação local entre seções relacionadas de uma mesma página. Usa `aq-tabs` como container e
`aq-tab` para cada item/painel projetado, com visual alinhado aos protótipos de detalhe de aquário:
fundo transparente, tabs à esquerda, indicador inferior na ativa e divisor horizontal no conjunto.

### Localização

`src/app/shared/components/tabs/` — componentes `TabsComponent`, `TabComponent` e barrel local.

### Seletores

- `aq-tabs`
- `aq-tab`

### Decisão arquitetural

Implementação própria sobre HTML nativo, sem Angular Material. O projeto não possui Angular Material
como dependência direta; a implementação própria mantém a API pública enxuta, evita expor tipos
internos de terceiros e cobre explicitamente WAI-ARIA, teclado e overflow horizontal.

### API

#### Inputs de `aq-tabs`

| Nome          | Tipo     | Padrão   | Descrição                        |
| ------------- | -------- | -------- | -------------------------------- |
| `activeTabId` | `string` | `''`     | Identificador da tab ativa.      |
| `ariaLabel`   | `string` | `Seções` | Nome acessível do grupo de tabs. |

#### Outputs de `aq-tabs`

| Nome              | Tipo     | Quando dispara                                      |
| ----------------- | -------- | --------------------------------------------------- |
| `activeTabChange` | `string` | Quando o usuário seleciona uma tab habilitada nova. |

#### Inputs de `aq-tab`

| Nome       | Tipo      | Padrão  | Descrição                            |
| ---------- | --------- | ------- | ------------------------------------ |
| `id`       | `string`  | —       | Identificador estável e obrigatório. |
| `label`    | `string`  | —       | Texto exibido no cabeçalho.          |
| `disabled` | `boolean` | `false` | Impede seleção e navegação por seta. |

### Content projection

O conteúdo padrão de cada `aq-tab` é renderizado como painel associado. Somente o painel selecionado
é apresentado ao usuário.

### Regras visuais

- Tabs horizontais à esquerda, sem aparência de botão/pill.
- Texto ativo com maior destaque e indicador inferior.
- Texto inativo com contraste secundário.
- Linha divisória sob todo o conjunto.
- Estados: padrão, hover, selected, focus-visible, disabled e pressed via `:active`.
- Overflow horizontal em telas menores, sem quebrar tabs em múltiplas linhas.

### Regras de acionamento

- `activeTabId` válido seleciona a tab correspondente.
- Valor vazio, inexistente, removido ou desabilitado cai para a primeira tab habilitada.
- Tabs desabilitadas não emitem evento e são ignoradas pela navegação por teclado.
- A ativação por setas é automática: mover o foco também seleciona a tab.

### Acessibilidade

- `role="tablist"` no cabeçalho.
- `role="tab"`, `aria-selected`, `aria-controls`, `aria-disabled` e roving `tabindex` nas tabs.
- `role="tabpanel"` com `aria-labelledby` no painel ativo.
- Teclado: `ArrowRight`, `ArrowLeft`, `Home`, `End`, `Enter` e `Space`.

### Cenários de uso

- Seções locais como visão geral, medições e aplicações.
- Áreas de configuração, histórico, anexos ou qualquer conteúdo relacionado em uma página.

### Quando não usar

- Para filtros compactos de formulário, use `aq-segmented-control`.
- Para navegação global/lateral, use `app-nav-menu`.
- Para navegação por rota, componha a integração no consumidor; o componente base não depende do
  Router.

### Showcase

`/components/tabs` → `src/app/features/components-showcase/pages/tabs/tabs-showcase.component.ts`

---

## 5.26. Toolbar

### Visão geral

Cabeçalho fixo do layout autenticado: marca/logo, título/subtítulo da página atual, seletor de idioma e menu do usuário (com avatar). É um componente de composição — combina `avatar`, `dropdown-menu` e `language-switcher`.

### Localização

`src/app/shared/components/toolbar/` — componente único, sem models próprios (reutiliza tipos de `avatar`, `dropdown-menu` e `language-code.type.ts`).

### Seletor

`app-toolbar` (standalone).

### API

#### Inputs

| Nome                    | Tipo                               | Padrão              | Descrição                                                                               |
| ----------------------- | ---------------------------------- | ------------------- | --------------------------------------------------------------------------------------- |
| `showBrand`             | `boolean`                          | `true`              | Exibe/oculta o bloco de logo + nome "AquaTrack".                                        |
| `pageTitle`             | `string` (obrigatório)             | —                   | Título da página atual.                                                                 |
| `pageSubtitle`          | `string`                           | `''`                | Subtítulo opcional abaixo do título.                                                    |
| `userName`              | `string` (obrigatório)             | —                   | Nome do usuário logado.                                                                 |
| `userEmail`             | `string` (obrigatório)             | —                   | E-mail do usuário logado.                                                               |
| `userInitials`          | `string` (obrigatório)             | —                   | Iniciais para o avatar (fallback sem foto).                                             |
| `userAvatarUrl`         | `string \| null`                   | `null`              | URL da foto do usuário; se presente, o avatar usa `variant="circular"` automaticamente. |
| `userAvatarColor`       | `AvatarColor`                      | `'primary'`         | Cor de fundo do avatar quando sem foto.                                                 |
| `userPlan`              | `string`                           | `''`                | Nome do plano do usuário, exibido como badge no cabeçalho do menu (se não vazio).       |
| `selectedLanguage`      | `LanguageCode` (obrigatório)       | —                   | Idioma atualmente selecionado.                                                          |
| `languageSelectorLabel` | `string`                           | `'Select language'` | `aria-label` repassado ao `language-switcher`.                                          |
| `userMenuItems`         | `DropdownMenuItem[]` (obrigatório) | —                   | Itens do menu do usuário (perfil, configurações, sair).                                 |

#### Outputs

| Nome                | Tipo               | Quando dispara                            |
| ------------------- | ------------------ | ----------------------------------------- |
| `languageChange`    | `LanguageCode`     | Repassado do `language-switcher` interno. |
| `userMenuItemClick` | `DropdownMenuItem` | Repassado do `dropdown-menu` interno.     |

### Regras visuais

- Três regiões: `toolbar__brand` (opcional), `toolbar__page-info` (título/subtítulo, sempre presente), `toolbar__actions` (idioma + menu de usuário).
- `userAvatarVariant()` decide automaticamente entre `circular` (se `userAvatarUrl` presente) e `initials` — o consumidor não precisa calcular isso manualmente.
- Cabeçalho do menu do usuário exibe avatar em tamanho `large`, nome e badge de plano (se `userPlan` não vazio).

### Regras de acionamento

Componente de composição puro — toda a lógica de interação (abrir menu, trocar idioma) vive nos componentes filhos (`dropdown-menu`, `language-switcher`); o `toolbar` apenas repassa os eventos (`languageChange`, `userMenuItemClick`) para o consumidor final decidir a ação (ex.: navegar para `/profile`, fazer logout, chamar `LanguageService`).

### Acessibilidade

- `<header role="banner">` — landmark de página.
- `<h1>` para `pageTitle` — atenção: como é `<h1>`, deve ser o único `<h1>` da página; se a página filha também renderizar um `<h1>` próprio, isso quebra a hierarquia de headings (WCAG 1.3.1) e deve ser revisado.
- Logo/marca tem `alt=""` na imagem (decorativa, nome já está no texto adjacente) e o container é `aria-hidden="true"`.
- Herda toda a acessibilidade de `avatar`, `dropdown-menu` e `language-switcher` internamente.

### Cenários de uso

- Cabeçalho fixo de toda tela autenticada da aplicação (montado uma vez no `authenticated-layout`, com `pageTitle`/`pageSubtitle` variando por rota).

### Onde é usado

- `src/app/layouts/authenticated-layout/authenticated-layout.component.html`

### Showcase

`/components/toolbar` → `src/app/features/components-showcase/pages/toolbar/toolbar-showcase.component.ts`

### Dependências internas

`AvatarComponent`, `DropdownMenuComponent`, `LanguageSwitcherComponent`.

---

## 5.27. Search Formfield

### Visão geral

Campo de busca especializado do AquaTrack para filtros textuais, buscas explícitas por formulário
e fluxos reativos baseados em `valueChanges`, com `ControlValueAccessor`, loading, limpeza e
acessibilidade AA.

### Localização

`src/app/shared/components/formfields/search-formfield/` — componente, teste e barrel local.

### Seletor

`aq-search-formfield` (standalone, implementa `ControlValueAccessor`).

### Decisão arquitetural

Implementado como componente próprio, semanticamente especializado em busca. O componente reutiliza
tipos, tokens, padrões de erro e contratos de acessibilidade dos formfields existentes, mas evita
compor diretamente outro `ControlValueAccessor`, reduzindo risco com `NgControl`, `disabled`,
`touched`, foco e mensagens de erro.

### API

#### Inputs

| Nome                               | Tipo                     | Padrão               | Descrição                                              |
| ---------------------------------- | ------------------------ | -------------------- | ------------------------------------------------------ |
| `label`                            | `string`                 | `''`                 | Label visual opcional.                                 |
| `ariaLabel`                        | `string`                 | tradução interna     | Nome acessível quando não houver label visual.         |
| `placeholder`                      | `string`                 | `''`                 | Placeholder contextualizado.                           |
| `hint`                             | `string`                 | `''`                 | Texto auxiliar enquanto não houver erro visível.       |
| `id` / `name`                      | `string`                 | gerado / `undefined` | Atributos nativos repassados ao input.                 |
| `autocomplete`                     | `string`                 | `'off'`              | Política de autocomplete do navegador.                 |
| `showClearButton`                  | `boolean`                | `true`               | Controla a ação de limpar.                             |
| `loading`                          | `boolean`                | `false`              | Exibe spinner e `aria-busy` sem apagar o valor.        |
| `loadingLabel`                     | `string`                 | tradução interna     | Texto acessível anunciado quando loading entra.        |
| `clearAriaLabel`                   | `string`                 | tradução interna     | Nome acessível do botão de limpar.                     |
| `readonly` (alias `readonlyState`) | `boolean`                | `false`              | Mantém o valor visível sem permitir edição ou limpeza. |
| `required` (alias `requiredState`) | `boolean`                | `false`              | Reflete obrigatoriedade nativa e `aria-required`.      |
| `disabled` (alias `disabledState`) | `boolean`                | `false`              | Desabilita input e ações internas.                     |
| `hideErrorMessage`                 | `boolean`                | `false`              | Oculta a mensagem visual de erro quando necessário.    |
| `errorMessages`                    | `FormfieldErrorMessages` | `{}`                 | Mapa de mensagens por chave de validação.              |

#### Outputs

| Nome      | Tipo   | Quando dispara                                                       |
| --------- | ------ | -------------------------------------------------------------------- |
| `cleared` | `void` | Quando o usuário limpa explicitamente o campo por botão ou `Escape`. |

#### Métodos públicos

| Método    | Descrição                                                                      |
| --------- | ------------------------------------------------------------------------------ |
| `focus()` | Foca programaticamente o input interno quando o componente estiver habilitado. |

#### Valor de forms

O contrato de forms sempre trabalha com `string`. `null` e `undefined` são normalizados para `''`
em `writeValue`.

### Regras visuais

- Usa a mesma linguagem visual dos demais formfields: borda `1.5px`, `radius` médio, tipografia do
  tema e `aq-focus-ring`.
- Estados suportados: vazio, preenchido, focused, invalid, disabled, readonly e loading.
- O spinner de loading ocupa a área de sufixo e respeita `prefers-reduced-motion: reduce`.
- O valor atual é preservado durante loading.

### Regras de acionamento

- Implementa `ControlValueAccessor` completo, funcionando com `formControlName` e `[formControl]`.
- O botão de limpar aparece apenas quando `showClearButton`, existe valor e o campo não está
  `disabled` nem `readonly`.
- Ao limpar: o valor vira `''`, `onChange` e `onTouched` são disparados, o output `cleared` é
  emitido e o foco volta ao input.
- `Escape` limpa apenas quando houver valor; se o campo estiver vazio, o evento continua a propagar
  para o container externo.
- `Enter` não é interceptado, preservando o `ngSubmit` nativo do formulário.

### Acessibilidade

- Label visual associada por `for/id` quando `label` estiver presente.
- Sem label visual, o input recebe `aria-label`.
- `aria-describedby` aponta para o hint ou para o erro visível.
- `aria-invalid`, `aria-required` e `aria-busy` refletem o estado atual.
- Erro visual em `role="alert"`.
- Loading acessível com live region `polite`.
- Ícones decorativos usam `aria-hidden="true"`.
- O botão de limpar possui nome acessível e funciona por teclado por ser um botão nativo.

### Cenários de uso

- Busca textual em listas, cards, cabeçalhos de tabela e barras de filtro.
- Busca explícita por formulário com `ngSubmit`.
- Busca reativa por `FormControl.valueChanges`.

### Onde é usado

- `src/app/features/components-showcase/pages/formfields/search-formfield-showcase.component.html`

### Showcase

`/components/search-formfield` →
`src/app/features/components-showcase/pages/formfields/search-formfield-showcase.component.ts`

### Dependências internas

`LanguageService`, `FormfieldErrorMessages` e tokens do tema em `src/app/shared/theme/`.

---

## 5.28. Table

### Visão geral

Tabela genérica do Design System para exibir dados estruturados em históricos, listagens
administrativas e telas operacionais. O componente é agnóstico ao domínio: não busca dados, não
formata unidades, não calcula status e não conhece endpoints. O consumidor fornece registros,
colunas e templates quando precisar de conteúdo especializado.

### Localização

`src/app/shared/components/table/` — componente, diretiva de célula e modelos auxiliares.

### Seletores

- `aq-table`
- `ng-template[aqTableCell]`

### Decisão arquitetural

Usa HTML semântico nativo (`table`, `thead`, `tbody`, `tr`, `th`, `td`) em vez de Angular Material,
porque o projeto não adota Material como biblioteca de componentes. Ordenação, seleção, filtros e
paginação são controlados pelo consumidor, permitindo uso local ou remoto sem acoplamento com API.

### API

#### Inputs

| Nome            | Tipo                                                  | Padrão                         | Descrição                                                         |
| --------------- | ----------------------------------------------------- | ------------------------------ | ----------------------------------------------------------------- |
| `rows`          | `readonly T[]`                                        | obrigatório                    | Registros renderizados.                                           |
| `columns`       | `readonly AqTableColumn<T>[]`                         | obrigatório                    | Colunas, alinhamento, largura, ordenação e prioridade responsiva. |
| `rowId`         | `keyof T \| (row, index) => string \| number \| null` | `null`                         | Identificador estável para trackBy e seleção.                     |
| `caption`       | `string`                                              | `''`                           | Caption semântico da tabela.                                      |
| `captionHidden` | `boolean`                                             | `true`                         | Mantém o caption apenas para leitores de tela.                    |
| `ariaLabel`     | `string`                                              | `''`                           | Nome acessível alternativo quando não houver caption.             |
| `loading`       | `boolean`                                             | `false`                        | Exibe skeleton preservando a estrutura da tabela.                 |
| `loadingLabel`  | `string`                                              | `'Carregando dados da tabela'` | Texto anunciado em loading.                                       |
| `skeletonRows`  | `number`                                              | `5`                            | Quantidade de linhas skeleton.                                    |
| `emptyState`    | `AqTableState`                                        | título padrão                  | Estado vazio customizável.                                        |
| `errorState`    | `AqTableState \| null`                                | `null`                         | Estado de erro customizável.                                      |
| `sort`          | `AqTableSort \| null`                                 | `null`                         | Ordenação atual, controlada externamente.                         |
| `selectable`    | `boolean`                                             | `false`                        | Exibe coluna de seleção.                                          |
| `selectionMode` | `'single' \| 'multiple'`                              | `'multiple'`                   | Define seleção única ou múltipla.                                 |
| `selectedRows`  | `readonly T[]`                                        | `[]`                           | Seleção atual, controlada externamente.                           |
| `rowClickable`  | `boolean`                                             | `false`                        | Torna linhas acionáveis por mouse, Enter e Space.                 |
| `rowAriaLabel`  | `(row, index) => string \| null`                      | `null`                         | Nome acessível de linhas clicáveis.                               |
| `density`       | `'comfortable' \| 'compact'`                          | `'comfortable'`                | Densidade visual das linhas.                                      |
| `stickyHeader`  | `boolean`                                             | `false`                        | Mantém cabeçalho fixo dentro da área rolável.                     |
| `showHeader`    | `boolean`                                             | `true`                         | Exibe ou oculta `thead`.                                          |

#### Outputs

| Nome              | Tipo                  | Quando dispara                                       |
| ----------------- | --------------------- | ---------------------------------------------------- |
| `sortChange`      | `AqTableSort \| null` | Ao acionar uma coluna ordenável.                     |
| `rowClick`        | `T`                   | Ao acionar uma linha clicável.                       |
| `selectionChange` | `readonly T[]`        | Ao selecionar uma linha ou todas as linhas visíveis. |
| `retry`           | `void`                | Ao acionar a ação do estado de erro.                 |

### Templates de células

Use `ng-template aqTableCell="key"` para badges, ícones, menus, data em duas linhas, valores com
unidade ou componentes do Design System. O contexto do template contém `$implicit`, `row`, `column`,
`value` e `index`.

### Ordenação

Colunas com `sortable: true` renderizam botão no cabeçalho, atualizam `aria-sort` e emitem
`sortChange`. O ciclo é ascendente, descendente e sem ordenação. A tabela não reordena os dados
internamente.

### Seleção

A seleção é opcional. Em `multiple`, o cabeçalho exibe checkbox para selecionar todas as linhas
visíveis e estado indeterminado. Em `single`, cada checkbox emite no máximo uma linha selecionada.

### Estados

Loading usa skeleton e `aria-busy`; vazio e erro recebem título, descrição e ícone opcional; erro
pode emitir `retry`.

### Responsividade

A estratégia padrão é rolagem horizontal com largura mínima. Colunas `optional` são ocultadas antes
das `secondary` em telas menores; colunas `primary` permanecem visíveis.

### Acessibilidade

Estrutura nativa de tabela, `scope="col"`, caption visível ou oculto, `aria-sort`, botões nativos no
cabeçalho ordenável, foco visível e linhas clicáveis com `role="button"`, `tabindex="0"` e
Enter/Space. Status e tendências devem ter texto ou `aria-label` no template consumidor.

### Showcase

`/components/table` → `src/app/features/components-showcase/pages/table/table-showcase.component.ts`
