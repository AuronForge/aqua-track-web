# Tema (Design Tokens) — AquaTrack Web

> Fonte: `src/app/shared/theme/` (`_tokens.scss`, `_root.scss`, `_mixins.scss`, `_reset.scss`, `_index.scss`)

Este documento descreve o sistema de tokens visuais da aplicação AquaTrack. Todos os componentes do design system consomem exclusivamente estes tokens — **nenhum componente deve usar valores de cor, espaçamento, tipografia, raio de borda ou sombra "soltos" (hard-coded) fora desta lista**, salvo casos pontuais já documentados como exceção (ver seção "Exceções conhecidas").

## Como o tema é consumido

- `_tokens.scss` define as variáveis Sass (`$aq-*`) — usadas dentro dos arquivos `.scss` dos componentes via `@use '../../theme' as theme;` e `theme.$aq-*`.
- `_root.scss` espelha os mesmos tokens como CSS Custom Properties (`--aq-*`) no seletor `:root`, para uso em runtime/inline styles quando necessário.
- `_mixins.scss` define mixins reutilizáveis, hoje contendo `aq-focus-ring` (anel de foco padrão).
- `_reset.scss` normaliza `box-sizing`, remove margin/padding padrão e herda a fonte em `button/input/textarea/select`.
- `_index.scss` reexporta `tokens` e `mixins` como ponto único de entrada (`@forward`).

Todo novo componente deve importar o tema com `@use '../../theme' as theme;` (ajustando a profundidade relativa) e usar as variáveis abaixo — nunca duplicar um valor de cor/espaçamento manualmente.

## Cores

### Superfícies e fundo

| Token                      | Valor                   | Uso                                             |
| -------------------------- | ----------------------- | ----------------------------------------------- |
| `$aq-color-background`     | `#f3f7fb`               | Fundo geral da aplicação (fora de cards)        |
| `$aq-color-surface`        | `#fff`                  | Fundo de cards, inputs, modais, dropdowns       |
| `$aq-color-surface-muted`  | `#f8fbfd`               | Fundo de estados desabilitados/hover suave      |
| `$aq-color-surface-accent` | `rgb(35 192 232 / 12%)` | Fundo de opção selecionada (accent translúcido) |

### Texto

| Token                      | Valor     | Uso                                           |
| -------------------------- | --------- | --------------------------------------------- |
| `$aq-color-text-primary`   | `#243041` | Títulos, labels, texto principal              |
| `$aq-color-text-secondary` | `#7f8a9d` | Texto de apoio, hints, subtítulos             |
| `$aq-color-text-tertiary`  | `#9ba7b8` | Texto de menor ênfase (ex.: chevrons neutros) |

### Bordas

| Token                     | Valor     | Uso                                      |
| ------------------------- | --------- | ---------------------------------------- |
| `$aq-color-border`        | `#dfe7ef` | Borda padrão de inputs, cards, divisores |
| `$aq-color-border-strong` | `#c9d7e5` | Borda em hover/estado preenchido         |

### Marca / ação

| Token                      | Valor     | Uso                                                      |
| -------------------------- | --------- | -------------------------------------------------------- |
| `$aq-color-primary`        | `#123f61` | Cor de marca principal (botões, ícones de destaque)      |
| `$aq-color-primary-strong` | `#0d3452` | Hover/active da cor primária                             |
| `$aq-color-accent`         | `#23c0e8` | Cor de destaque/interação (foco, seleção, links de ação) |
| `$aq-color-accent-strong`  | `#1d8aa8` | Hover/active da cor de destaque                          |

### Semânticas (feedback/estado)

| Token                               | Valor                 | Uso                                                      |
| ----------------------------------- | --------------------- | -------------------------------------------------------- |
| `$aq-color-success` / `-strong`     | `#2d8a4e` / `#206138` | Sucesso, status "estável/normal"                         |
| `$aq-color-tertiary` / `-strong`    | `#5c6f8a` / `#475a73` | Cor neutra/terciária para badges, chips, botões          |
| `$aq-color-error` / `-strong`       | `#d93025` / `#b52c22` | Erro, validação inválida, ações destrutivas              |
| `$aq-color-warning` / `-strong`     | `#e6ac00` / `#c49200` | Atenção, avisos                                          |
| `$aq-color-information` / `-strong` | `#1a73e8` / `#1557b0` | Informação neutra (feedback padrão, badges informativos) |

> `$aq-color-information` e `$aq-color-information-strong` **não** são espelhados em `_root.scss` (ausentes das CSS vars `--aq-*`) — usar via Sass (`theme.$aq-color-information`).

### Sombra

| Token              | Valor                                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `$aq-color-shadow` | `rgb(18 63 97 / 18%)`                                                                                                                                  |
| `$aq-shadow-card`  | `0 18px 42px -24px $aq-color-shadow, 0 20px 50px -32px rgb(36 48 65 / 28%)` — sombra padrão de cards, modais, painéis flutuantes (dropdowns, popovers) |

Além da sombra padrão de card, alguns componentes definem sombras locais para painéis flutuantes (ex.: `dropdown-menu__panel`: `0 4px 16px -4px rgb(18 63 97 / 12%), 0 20px 56px -20px rgb(36 48 65 / 22%)`). Ao criar um novo componente com painel flutuante (overlay/popover), reaproveitar `$aq-shadow-card` sempre que possível; só criar uma sombra customizada se houver necessidade visual comprovada.

## Tipografia

### Famílias

| Token                     | Valor                                                              | Uso                                                                       |
| ------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `$aq-font-family-base`    | `'Aptos', 'Segoe UI', 'Trebuchet MS', sans-serif`                  | Texto padrão de toda a aplicação (labels, corpo, botões)                  |
| `$aq-font-family-heading` | `'Aptos Display', 'Aptos', 'Segoe UI', 'Trebuchet MS', sans-serif` | Títulos de destaque (ex.: título de modal, título de confirmation-dialog) |

### Escala de tamanho

| Token              | Valor (rem)        | Uso típico                                              |
| ------------------ | ------------------ | ------------------------------------------------------- |
| `$aq-font-size-xs` | `0.75rem` (12px)   | Textos auxiliares muito pequenos, badges/chips pequenos |
| `$aq-font-size-sm` | `0.8125rem` (13px) | Labels de formfield, hints, mensagens de erro           |
| `$aq-font-size-md` | `0.875rem` (14px)  | Texto de corpo padrão, labels                           |
| `$aq-font-size-lg` | `1rem` (16px)      | Valor digitado em inputs, texto de destaque             |
| `$aq-font-size-xl` | `1.125rem` (18px)  | Títulos de card, títulos de opção em card-selection     |

### Peso

| Token                      | Valor |
| -------------------------- | ----- |
| `$aq-font-weight-regular`  | `400` |
| `$aq-font-weight-medium`   | `500` |
| `$aq-font-weight-semibold` | `600` |
| `$aq-font-weight-bold`     | `700` |

### Altura de linha

| Token                   | Valor | Uso                              |
| ----------------------- | ----- | -------------------------------- |
| `$aq-line-height-tight` | `1.2` | Títulos                          |
| `$aq-line-height-base`  | `1.4` | Texto de corpo, hints, mensagens |
| `$aq-line-height-loose` | `1.6` | Textos longos/descrições         |

## Espaçamento

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

## Raio de borda (`border-radius`)

| Token             | Valor            | Uso                                                          |
| ----------------- | ---------------- | ------------------------------------------------------------ |
| `$aq-radius-xs`   | `0.375rem` (6px) | Badge                                                        |
| `$aq-radius-sm`   | `0.75rem` (12px) | Feedback message, code-block                                 |
| `$aq-radius-md`   | `1rem` (16px)    | Inputs, cards, modais, dropdown panel, card-selection option |
| `$aq-radius-lg`   | `1.5rem` (24px)  | Superfícies grandes (raramente usado hoje)                   |
| `$aq-radius-pill` | `999px`          | Botões, chips, switch                                        |

## Tamanhos de componente

| Token                        | Valor     | Uso                                                      |
| ---------------------------- | --------- | -------------------------------------------------------- |
| `$aq-size-icon-container-sm` | `2rem`    | Container de ícone pequeno                               |
| `$aq-size-icon-container-md` | `2.5rem`  | Container de ícone médio (ex.: info-card, settings-card) |
| `$aq-size-icon-sm`           | `1rem`    | Ícone pequeno                                            |
| `$aq-size-icon-md`           | `1.25rem` | Ícone médio (ex.: ícone de feedback-message)             |

## Foco (acessibilidade visual)

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

## Reset global

`_reset.scss` aplica:

- `box-sizing: border-box` universal, `margin`/`padding` zerados.
- `html, body { height: 100% }`.
- `button, input, textarea, select { font: inherit }` — garante que controles de formulário herdem a tipografia do tema em vez da fonte nativa do navegador.

## Padrão de cor "accent + accent-strong + accent-muted"

A maioria dos componentes coloridos (badge, chip, button) segue o mesmo padrão de 3 variáveis CSS locais por cor, definidas no `:host`:

```scss
--_accent: <cor base>;
--_accent-strong: <cor hover/texto em fundo tinted>;
--_accent-muted: <cor base em baixa opacidade, para variante tinted/hover>;
```

Isso é então combinado com 3 variantes visuais (`filled`, `outlined`, `tinted`/`stroked`/`basic`) que trocam `background`/`border-color`/`color` usando essas 3 variáveis. **Novo componente com sistema de cores deve seguir este mesmo padrão** em vez de inventar uma nomenclatura nova — ver `button.component.scss`, `badge.component.scss` e `chip.component.scss` como referência canônica.

## Exceções conhecidas (fora do tema)

- `code-block` usa uma paleta fixa "dark" (`#0f0f1e`, `#16162a`, `#818cf8`, `#c8d3f5`) por representar um bloco de código com tema escuro proposital, independente do tema claro da aplicação. Isso é intencional e não deve ser generalizado para outros componentes.
- `dropdown-menu__item--destructive` e `language-switcher` usam uma cor vermelha pontual (`#e05257`) que não corresponde exatamente a `$aq-color-error` (`#d93025`). Ao criar novos itens destrutivos, preferir `$aq-color-error` para manter consistência, salvo decisão de design explícita em contrário.
