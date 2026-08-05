# Paginator (`aq-paginator`)

## Visão geral

Controle de paginação com seletor de itens por página (via `aq-select-formfield`), indicador "X-Y de Z" e botões anterior/próximo. Usado internamente pelo `info-list`, mas reutilizável por qualquer lista paginada.

## Localização

`src/app/shared/components/paginator/` — componente + `paginator-change.model.ts`.

## Seletor

`aq-paginator` (standalone).

## API

### Inputs

| Nome              | Tipo                   | Padrão        | Descrição                                        |
| ----------------- | ---------------------- | ------------- | ------------------------------------------------ |
| `pageIndex`       | `number`               | `0`           | Página atual (0-based, controlada externamente). |
| `pageSize`        | `number`               | `10`          | Itens por página.                                |
| `pageSizeOptions` | `number[]`             | `[5, 10, 20]` | Opções do seletor de tamanho.                    |
| `totalItems`      | `number` (obrigatório) | —             | Total de itens da coleção completa.              |
| `disabled`        | `boolean`              | `false`       | Desabilita todos os controles.                   |

### Outputs

| Nome         | Tipo                                          | Quando dispara                                            |
| ------------ | --------------------------------------------- | --------------------------------------------------------- |
| `pageChange` | `PaginatorChange` (`{ pageIndex, pageSize }`) | Ao clicar anterior/próximo ou trocar o tamanho de página. |

## Regras visuais

- Layout: seletor de tamanho à esquerda/topo (`paginator__size`), navegação à direita/baixo (`paginator__nav`) com contador + botões.
- Botões anterior/próximo usam ícones `chevron_left`/`chevron_right` e ficam `disabled` nativamente quando não há página anterior/próxima.

## Regras de acionamento

- `hasPreviousPage` = `pageIndex > 0`; `hasNextPage` = `(pageIndex + 1) * pageSize < totalItems` — os botões usam o atributo `disabled` nativo do `<button>`, não apenas estilo, então não são focáveis/acionáveis via teclado quando desabilitados (comportamento nativo do HTML).
- Trocar o tamanho de página **sempre reseta para a página 0** (`pageChange.emit({ pageIndex: 0, pageSize: ... })`) — evita ficar em uma página inexistente após aumentar o tamanho.
- Sincronização reativa via `effect()`: o `FormControl` interno do seletor de tamanho é atualizado automaticamente sempre que `pageSize` (input) muda externamente, sem emitir evento de volta (`emitEvent: false`), evitando loop; o mesmo padrão habilita/desabilita o `FormControl` conforme o input `disabled`.
- Não gerencia estado de página internamente — é 100% controlado pelo componente pai via inputs (`pageIndex`, `pageSize`) + output (`pageChange`).

## Acessibilidade

- Contador de itens (`paginator__info`) tem `aria-live="polite"`, anunciando a mudança de intervalo sem interromper o usuário.
- Botões de navegação têm `aria-label` explícito ("Pagina anterior"/"Proxima pagina").
- O seletor de tamanho herda toda a acessibilidade do `aq-select-formfield` (label "Itens por pagina").

## Cenários de uso

- Paginação de qualquer lista/tabela de itens (usado hoje dentro do `info-list`).

## Onde é usado

- Uso interno em `src/app/shared/components/info-list/info-list.component.html`. Nenhum uso direto isolado em `features/` no momento.

## Showcase

**Não possui showcase próprio** (ver `showcase-guidelines.md`, pendência conhecida) — hoje só é exercitado indiretamente através do showcase de `info-list`.

## Dependências internas

`SelectFormfieldComponent`, `ReactiveFormsModule`.
