# Switch (`aq-switch`)

## Visão geral

Alternador binário (toggle) estilo iOS/Material, para configurações on/off. Componente mínimo, sem integração nativa com `ControlValueAccessor` — trabalha por input/output direto.

## Localização

`src/app/shared/components/switch/` — componente único, sem models auxiliares.

## Seletor

`aq-switch` (standalone).

## API

### Inputs

| Nome        | Tipo                   | Padrão  | Descrição                                       |
| ----------- | ---------------------- | ------- | ----------------------------------------------- |
| `checked`   | `boolean`              | `false` | Estado atual (controlado externamente).         |
| `disabled`  | `boolean`              | `false` | Desabilita interação.                           |
| `ariaLabel` | `string` (obrigatório) | —       | Nome acessível (não há label visível embutido). |

### Outputs

| Nome            | Tipo      | Quando dispara                                         |
| --------------- | --------- | ------------------------------------------------------ |
| `checkedChange` | `boolean` | Ao clicar (alterna o valor oposto ao `checked` atual). |

**Nota**: assim como `segmented-control`, **não** implementa `ControlValueAccessor` — para uso com Reactive Forms, o componente pai deve fazer o binding manual (`[checked]="control.value"` + `(checkedChange)="control.setValue($event)"`).

## Regras visuais

- Trilho (`switch__track`) muda de aparência conforme `checked` (classe `switch__track--checked`); "thumb" (`switch__thumb`) desliza para a posição correspondente.
- Estado `disabled` segue o padrão nativo de `<button disabled>` (opacidade reduzida, sem interação).

## Regras de acionamento

- Todo o controle é um único `<button type="button" role="switch">` — clique (`toggle()`) emite `checkedChange` com o valor invertido; bloqueado se `disabled`.
- Ativação por teclado é nativa do elemento `<button>` (Enter/Space), sem necessidade de handler customizado.

## Acessibilidade

- `role="switch"`, `aria-checked` (reflete `checked()`), `aria-label` (obrigatório via input).
- "Thumb" interno é `aria-hidden="true"` (puramente visual).
- Segue o padrão WAI-ARIA APG "Switch".

## Cenários de uso

- Preferências on/off (notificações, modo escuro, unidades) na página de perfil.
- Ativação/desativação de uma opção dentro de um formulário de criação (ex.: alertas automáticos de aquário).

## Onde é usado

- `src/app/features/aquarium/pages/aquarium-create-page/aquarium-create-page.component.html`
- `src/app/features/profile/components/preferences-card/preferences-card.component.html`

## Showcase

**Não possui showcase** (ver `showcase-guidelines.md`, pendência conhecida), apesar de já estar em uso em duas telas de produção.
