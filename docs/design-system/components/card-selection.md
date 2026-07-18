# Card Selection (`aq-card-selection`)

## Visão geral

Grupo de seleção (single ou multiple) apresentado como cards em grade, funcionando como substituto visual de radio/checkbox nativos. Implementa `ControlValueAccessor`, integrando-se nativamente com Reactive Forms (`formControlName`/`[formControl]`).

## Localização

`src/app/shared/components/card-selection/` — componente + `card-selection-change.model.ts`, `card-selection-compare-with.type.ts`, `card-selection-content-context.model.ts`, `card-selection-content.directive.ts`, `card-selection-icon-position.type.ts`, `card-selection-option.model.ts`, `card-selection-value.type.ts`, `index.ts` (barrel).

## Seletor

`aq-card-selection` (standalone, genérico `<T>`).

## API

### Inputs

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

### Outputs

| Nome              | Tipo                     | Quando dispara                                                                                     |
| ----------------- | ------------------------ | -------------------------------------------------------------------------------------------------- |
| `selectionChange` | `CardSelectionChange<T>` | A cada seleção/deseleção confirmada pelo usuário (`{ value, option, selected, selectedOptions }`). |

### Content projection avançada

`CardSelectionContentDirective` (`ng-template[aqCardSelectionContent]`) permite substituir totalmente o conteúdo padrão de cada card por um template customizado, recebendo o contexto `{ $implicit, option, index, selected, disabled }`. Se não for fornecido, usa o layout padrão (ícone + título + descrição).

## Regras visuais

- Grid responsivo: `repeat(var(--card-selection-columns, auto-fit), minmax(min(100%, 14.5rem), 1fr))`; em telas ≤720px colapsa para 1 coluna.
- Card não selecionado: borda `$aq-color-border`, fundo `$aq-color-surface`; hover troca para `$aq-color-border-strong` + `$aq-color-surface-muted`.
- Card selecionado: borda `$aq-color-accent`, fundo `$aq-color-surface-accent`, `box-shadow: inset 0 0 0 1px rgb(35 192 232 / 28%)`; ícone e título ficam `$aq-color-primary`.
- Card desabilitado: fundo `$aq-color-surface-muted`, `opacity: 0.72`.
- Estado inválido (`card-selection--invalid`): cards não selecionados ganham borda vermelha translúcida (`rgb(217 48 37 / 35%)`).
- Foco visível aplicado ao `<input>` real (visualmente oculto) via `:focus-visible + .card-selection__option-card` → `aq-focus-ring`.
- Respeita `prefers-reduced-motion: reduce` (remove transições do card).

## Regras de acionamento

- Cada opção é um `<input type="radio">` ou `type="checkbox"` (conforme `multiple`) visualmente oculto (clip-rect), com o `<label>` cobrindo o card inteiro — clique em qualquer parte do card ativa a opção.
- **Navegação por teclado (roving focus)**: `ArrowRight`/`ArrowDown` avança, `ArrowLeft`/`ArrowUp` volta (pulando opções desabilitadas, com wrap-around); `Home`/`End` vão para primeira/última opção habilitada; `Space`/`Enter` confirmam a seleção da opção focada.
- Em modo `multiple`, as setas apenas movem o foco (não selecionam automaticamente) — seleção requer `Space`/`Enter`/clique. Em modo single, as setas movem o foco **e** selecionam simultaneamente (comportamento nativo de radiogroup).
- `onFocusOut` só desmarca o estado `focused` quando o foco realmente sai do grupo inteiro (verifica `relatedTarget` contra o `currentTarget`), evitando piscar o estado ao navegar entre opções internas.
- Implementa `ControlValueAccessor` completo (`writeValue`, `registerOnChange`, `registerOnTouched`, `setDisabledState`) — funciona com `formControlName` sem código adicional.

## Acessibilidade

- `<fieldset>`/`<legend>` nativos; `aria-labelledby` aponta para o legend quando há `label`, senão `aria-label` usa o fallback `ariaLabel`.
- `aria-describedby` aponta para hint ou erro (nunca ambos).
- `aria-invalid`, `aria-required`, `aria-disabled` no fieldset.
- Marca de campo obrigatório (`*`) tem texto "obrigatório" em técnica visually-hidden para leitores de tela (ver `accessibility.md`).
- Mensagem de erro em `role="alert"`.
- Cada `<input>` recebe `aria-label` da opção (`option.ariaLabel`) quando fornecido.

## Cenários de uso

- Seleção de tipo de aquário/água na criação de aquário (`aquarium-create-page`).
- Qualquer escolha visualmente rica entre 2–6 opções mutuamente exclusivas (ou múltiplas) onde radio/checkbox tradicionais seriam pouco expressivos.

## Onde é usado

- `src/app/features/aquarium/pages/aquarium-create-page/aquarium-create-page.component.html`

## Showcase

`/components/card-selection` → `src/app/features/components-showcase/pages/card-selection/card-selection-showcase.component.ts`

## Dependências internas

Usa `FormfieldErrorMessages` (compartilhado com os demais formfields).
