# Select Formfield (`aq-select-formfield`)

## Visão geral

Campo de seleção customizado (single ou multiple) com painel dropdown renderizado via Angular CDK Overlay — não é um `<select>` nativo, o que permite ícones, subtítulos e estados de loading/vazio dentro das opções.

## Localização

`src/app/shared/components/formfields/select-formfield/` — componente + `select-formfield-change-event.model.ts`, `select-formfield-option.model.ts`.

## Seletor

`aq-select-formfield` (standalone, implementa `ControlValueAccessor`).

## API

### Inputs

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

### Outputs

| Nome              | Tipo                         | Quando dispara                                                                                              |
| ----------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `selectionChange` | `SelectFormfieldChangeEvent` | A cada seleção/deseleção — inclui `option`, `previousOption`, `selectedOptions`, `previousSelectedOptions`. |

## Regras visuais

- Trigger com mesma linguagem visual dos demais formfields (borda, raio, altura).
- Painel dropdown (`select-formfield__dropdown`) é anexado via `Overlay` do CDK, posicionado com `flexibleConnectedTo` (tenta abrir para baixo, cai para cima se não couber, com `withPush(true)`), largura igual à do trigger (`width: elementRef.offsetWidth`, `minWidth: 200`).
- Estado `loading`: exibe um ícone de ampulheta (`hourglass_top`) no lugar da lista.
- Estado vazio (`options.length === 0` e não loading): ícone `inbox` + texto "Nenhuma opcao disponivel".
- Opção selecionada exibe um ícone de check; opção com foco de teclado ganha destaque visual (`select-formfield__option--focused`).

## Regras de acionamento

- Clique no trigger (`toggleDropdown`) abre/fecha o painel — bloqueado se `disabled` ou `loading`.
- **Teclado no trigger fechado**: `Enter`/`Space` abrem o painel.
- **Teclado com painel aberto**: `ArrowDown`/`ArrowUp` movem o índice de foco (`focusedIndex`) entre opções habilitadas, com wrap-around; `Enter`/`Space` selecionam a opção focada; `Escape` fecha e devolve foco ao trigger.
- Ao abrir, se já houver uma opção selecionada (modo single), o foco inicial já aponta para ela.
- Em modo `multiple`, selecionar uma opção **não fecha** o painel (permite múltiplas seleções seguidas); em modo single, fecha automaticamente após selecionar.
- Overlay é descartado (`disposeOverlay`) ao fechar, destruir o componente (`ngOnDestroy`) ou perder o controle via `setDisabledState(true)`.
- `focusout` do wrapper (quando o foco realmente sai do componente) marca o campo como `touched`.

## Acessibilidade

- Trigger: `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls` (id do listbox), `aria-activedescendant` (id da opção com foco de teclado), `aria-invalid`, `aria-required`, `aria-describedby`.
- Painel: `role="listbox"`, `aria-label` (usa `placeholder()`), `aria-multiselectable` quando `multiple`.
- Cada opção: `role="option"`, `tabindex="-1"` (não navegável por Tab — só via setas, seguindo o padrão ARIA de listbox), `aria-selected`, `aria-disabled`.

## Cenários de uso

- Seleção de tamanho de página no `paginator` (uso interno).
- Seleção de país/categoria/plano em formulários com muitas opções ou opções com metadados visuais (ícone + subtítulo).

## Onde é usado

- Uso interno em `src/app/shared/components/paginator/paginator.component.html`.
- Uso direto em telas de feature ainda não encontrado além de referências em SCSS de `preferences-card` — ao adicionar seletores de opção única/múltipla em novos formulários, este é o componente indicado (preferir a `select-formfield` no lugar de um `<select>` nativo).

## Showcase

`/components/select-formfield` → `src/app/features/components-showcase/pages/formfields/select-formfield-showcase.component.ts`

## Dependências internas

`OverlayModule` (`@angular/cdk/overlay`).
