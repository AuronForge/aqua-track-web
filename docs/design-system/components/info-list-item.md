# Info List Item (`aq-info-list-item`)

## Visão geral

Linha de lista com título/subtítulo à esquerda e valor/metadado à direita, opcionalmente com badge de status. Normalmente usado dentro do `info-list`, mas pode ser usado isoladamente.

## Localização

`src/app/shared/components/info-list-item/` — componente + `info-list-item-badge.model.ts`, `info-list-item-status.type.ts`.

## Seletor

`aq-info-list-item` (standalone).

## API

### Inputs

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

### Outputs

| Nome        | Tipo   | Quando dispara                                                           |
| ----------- | ------ | ------------------------------------------------------------------------ |
| `itemClick` | `void` | Ao clicar (ou `Enter`/`Space`) quando `clickable=true` e não `disabled`. |

## Regras visuais

- Layout de duas colunas: `info-list-item__main` (título + badge + subtítulo) à esquerda, `info-list-item__aside` (valor + metadado) à direita.
- `badge.status` mapeia para cor: `normal`→`success`, `attention`→`warning`, `danger`→`error`, `neutral`→`tertiary` (badge renderizado com `variant="filled" size="small"`).
- `flat`: remove estilo de card, útil quando o container pai (ex.: `info-list`) já fornece a superfície visual.

## Regras de acionamento

- Quando `clickable=true` e `disabled=false`: `role="button"`, `tabindex="0"`, responde a clique e `Enter`/`Space`.
- Quando `disabled=true` (com `clickable=true`): `aria-disabled="true"`, `tabindex` removido (`null`), clique/teclado ignorados.

## Acessibilidade

- `aria-disabled` só é aplicado quando o item é clicável **e** desabilitado simultaneamente (item não-clicável nunca recebe esse atributo, pois não é um controle interativo).
- Badge herda a semântica texto+cor do `aq-badge`.

## Cenários de uso

- Linha de item em `info-list` (uso primário — ver `info-list.md`).
- Lista de transações, medições ou eventos com valor destacado à direita.

## Onde é usado

- Uso interno em `src/app/shared/components/info-list/info-list.component.html`.
- Nenhum uso direto isolado encontrado em `features/` — hoje é consumido exclusivamente através do `info-list`.

## Showcase

`/components/info-list-item` → `src/app/features/components-showcase/pages/info-list-item/info-list-item-showcase.component.ts`

## Dependências internas

`BadgeComponent`.
