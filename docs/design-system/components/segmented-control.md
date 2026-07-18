# Segmented Control (`aq-segmented-control`)

## Visão geral

Controle de seleção única entre um pequeno conjunto de opções mutuamente exclusivas, apresentado como um grupo de botões conectados (estilo "tabs"/"toggle group"). Alternativa mais leve ao `card-selection` para 2–5 opções curtas sem descrição/ícone.

## Localização

`src/app/shared/components/segmented-control/` — componente + `segmented-control-option.model.ts`.

## Seletor

`aq-segmented-control` (standalone).

## API

### Inputs

| Nome        | Tipo                       | Padrão  | Descrição                                               |
| ----------- | -------------------------- | ------- | ------------------------------------------------------- |
| `options`   | `SegmentedControlOption[]` | `[]`    | `{ value, label }`.                                     |
| `value`     | `string`                   | `''`    | Valor selecionado atualmente (controlado externamente). |
| `ariaLabel` | `string` (obrigatório)     | —       | Nome acessível do grupo (não há `<label>` visível).     |
| `disabled`  | `boolean`                  | `false` | Desabilita todas as opções.                             |

### Outputs

| Nome          | Tipo     | Quando dispara                              |
| ------------- | -------- | ------------------------------------------- |
| `valueChange` | `string` | Ao selecionar uma opção diferente da atual. |

**Nota**: este componente **não** implementa `ControlValueAccessor` — não é diretamente compatível com `formControlName`/`[formControl]`; integração com Reactive Forms requer um binding manual (`[value]` + `(valueChange)`) no componente pai, diferente de `card-selection`, `select-formfield`, etc.

## Regras visuais

- Grupo de botões conectados visualmente (`segmented-control__group`), cada opção como `<button>`.
- Opção selecionada recebe destaque visual (`segmented-control__option--selected`).

## Regras de acionamento

- Clique em uma opção (`select`) só emite `valueChange` se o `value` for diferente do atual e o grupo não estiver desabilitado (evita eventos redundantes).
- **Roving focus por teclado**: `ArrowRight`/`ArrowLeft` movem para a próxima/anterior opção **e já selecionam** (com wrap-around circular) — diferente do `card-selection` em modo `multiple`, aqui não há distinção entre "mover foco" e "selecionar" (comportamento de radiogroup nativo).
- `tabindex` gerenciado por roving tabindex: apenas a opção selecionada tem `tabindex="0"`; as demais têm `tabindex="-1"` (só alcançáveis via setas, não via Tab sequencial) — padrão ARIA correto para `radiogroup`.

## Acessibilidade

- Grupo: `role="radiogroup"`, `aria-label`.
- Cada opção: `role="radio"`, `aria-checked`.
- Segue integralmente o padrão WAI-ARIA APG "Radio Group".

## Cenários de uso

- Alternância entre unidades de medida (ex.: °C/°F), modos de visualização (lista/grade), ou qualquer escolha binária/ternária compacta — usado hoje para preferências de usuário.

## Onde é usado

- `src/app/features/profile/components/preferences-card/preferences-card.component.html`

## Showcase

**Não possui showcase** (ver `showcase-guidelines.md`, pendência conhecida).
