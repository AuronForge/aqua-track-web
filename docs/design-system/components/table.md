# Table

## Visao geral

Tabela generica do Design System para exibir dados estruturados em historicos, listagens
administrativas e telas operacionais. O componente e agnostico ao dominio: nao busca dados, nao
formata unidades, nao calcula status e nao conhece endpoints. O consumidor fornece registros,
colunas e templates quando precisar de conteudo especializado.

## Localizacao

`src/app/shared/components/table/`

Arquivos principais:

- `table.component.ts/html/scss`
- `table-cell.directive.ts`
- `table-column.model.ts`
- `table-sort.model.ts`
- `table-state.model.ts`
- `index.ts`

## Seletores

- `aq-table`
- `ng-template[aqTableCell]`

## Decisao arquitetural

A implementacao usa HTML semantico nativo (`table`, `thead`, `tbody`, `tr`, `th`, `td`) em vez de
Angular Material, porque o projeto nao adota Material como biblioteca de componentes. A tabela
mantem a API enxuta, tipada e controlada externamente: ordenacao, selecao, filtros e paginacao
podem ser locais ou remotos no componente consumidor.

## API

### Inputs

| Nome            | Tipo                                                  | Padrao                         | Descricao                                                                  |
| --------------- | ----------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------- |
| `rows`          | `readonly T[]`                                        | obrigatorio                    | Registros renderizados.                                                    |
| `columns`       | `readonly AqTableColumn<T>[]`                         | obrigatorio                    | Colunas visiveis, ordenacao, alinhamento, largura e prioridade responsiva. |
| `rowId`         | `keyof T \| (row, index) => string \| number \| null` | `null`                         | Identificador estavel para trackBy e selecao. Sem valor, usa o indice.     |
| `caption`       | `string`                                              | `''`                           | Caption semantico da tabela.                                               |
| `captionHidden` | `boolean`                                             | `true`                         | Mantem o caption apenas para leitores de tela.                             |
| `ariaLabel`     | `string`                                              | `''`                           | Nome acessivel alternativo quando nao houver caption.                      |
| `loading`       | `boolean`                                             | `false`                        | Exibe skeleton preservando a estrutura da tabela.                          |
| `loadingLabel`  | `string`                                              | `'Carregando dados da tabela'` | Texto anunciado em loading.                                                |
| `skeletonRows`  | `number`                                              | `5`                            | Quantidade de linhas skeleton.                                             |
| `emptyState`    | `AqTableState`                                        | titulo padrao                  | Estado vazio customizavel.                                                 |
| `errorState`    | `AqTableState \| null`                                | `null`                         | Estado de erro customizavel.                                               |
| `sort`          | `AqTableSort \| null`                                 | `null`                         | Ordenacao atual, controlada pelo consumidor.                               |
| `selectable`    | `boolean`                                             | `false`                        | Exibe coluna de selecao.                                                   |
| `selectionMode` | `'single' \| 'multiple'`                              | `'multiple'`                   | Define comportamento de checkbox.                                          |
| `selectedRows`  | `readonly T[]`                                        | `[]`                           | Selecao atual, controlada externamente.                                    |
| `rowClickable`  | `boolean`                                             | `false`                        | Torna linhas acionaveis por mouse, Enter e Space.                          |
| `rowAriaLabel`  | `(row, index) => string \| null`                      | `null`                         | Nome acessivel de linhas clicaveis.                                        |
| `density`       | `'comfortable' \| 'compact'`                          | `'comfortable'`                | Densidade visual das linhas.                                               |
| `stickyHeader`  | `boolean`                                             | `false`                        | Mantem cabecalho fixo dentro da area rolavel.                              |
| `showHeader`    | `boolean`                                             | `true`                         | Exibe ou oculta `thead`.                                                   |

### Outputs

| Nome              | Tipo                  | Quando dispara                                                                        |
| ----------------- | --------------------- | ------------------------------------------------------------------------------------- |
| `sortChange`      | `AqTableSort \| null` | Ao acionar uma coluna ordenavel. O ciclo e ascendente, descendente, sem ordenacao.    |
| `rowClick`        | `T`                   | Ao acionar uma linha clicavel. Cliques em controles internos nao propagam para linha. |
| `selectionChange` | `readonly T[]`        | Ao selecionar uma linha ou todas as linhas visiveis.                                  |
| `retry`           | `void`                | Ao acionar a acao do estado de erro.                                                  |

## Configuracao de colunas

```ts
interface AqTableColumn<T> {
  key: string;
  header: string;
  property?: keyof T;
  value?: (row: T) => unknown;
  sortable?: boolean;
  align?: 'start' | 'center' | 'end';
  width?: string;
  minWidth?: string;
  ariaLabel?: string;
  priority?: 'primary' | 'secondary' | 'optional';
  hidden?: boolean;
}
```

`key` identifica a coluna e tambem liga a coluna ao template `aqTableCell`. Para leitura simples,
o componente usa `value`, depois `property`, depois `row[column.key]`.

## Templates de celulas

Use `ng-template aqTableCell="key"` para badges, icones, menus, data em duas linhas, valores com
unidade ou qualquer componente do Design System.

```html
<aq-table [rows]="measurements" [columns]="columns">
  <ng-template aqTableCell="status" let-row>
    <aq-badge size="small" variant="tinted" color="success">{{ row.statusLabel }}</aq-badge>
  </ng-template>

  <ng-template aqTableCell="date" let-row>
    <strong>{{ row.date }}</strong>
    <span>{{ row.time }}</span>
  </ng-template>
</aq-table>
```

O contexto do template contem `$implicit`, `row`, `column`, `value` e `index`.

## Ordenacao

Colunas com `sortable: true` renderizam um botao no cabecalho, atualizam `aria-sort` e emitem
`sortChange`. A tabela nao reordena os dados internamente. Isso permite ordenacao local, remota ou
controlada por API sem acoplar a tabela ao backend.

## Selecao

A selecao e opcional. Em `selectionMode="multiple"`, o cabecalho exibe checkbox para selecionar
todas as linhas visiveis e estado indeterminado. Em `single`, cada checkbox emite no maximo uma
linha selecionada. O consumidor controla `selectedRows`.

## Estados

- Loading: skeleton com `role="status"`, live region e `aria-busy` no host.
- Vazio: `emptyState` com titulo, descricao e icone opcional.
- Erro: `errorState` com titulo, descricao, icone e acao opcional de retry.
- Conteudo: renderiza cabecalho, linhas, templates, selecao e ordenacao.

## Responsividade

A estrategia padrao e rolagem horizontal controlada, com `min-width` para preservar legibilidade.
Colunas podem definir `priority`. Em larguras menores, colunas `optional` sao ocultadas primeiro e
colunas `secondary` depois. Colunas `primary` permanecem visiveis. Essa escolha evita comprimir todo
o conteudo ate ficar ilegivel.

## Acessibilidade

- Estrutura nativa de tabela com `scope="col"`.
- `caption` disponivel, visivel ou visualmente oculto.
- `aria-sort` em colunas ordenaveis.
- Cabecalhos ordenaveis usam botao nativo.
- Linhas clicaveis recebem `role="button"`, `tabindex="0"` e suporte a Enter/Space.
- Foco visivel usa o mixin `aq-focus-ring`.
- Loading, vazio e erro sao anunciaveis.
- Status, tendencias e icones devem receber texto ou `aria-label` no template consumidor.

## Quando usar

- Historicos de medicoes, aplicacoes, manutencoes e alimentacao.
- Listagens administrativas.
- Tabelas que exigem comparacao entre colunas.
- Dados tabulares com possivel ordenacao, selecao ou acoes.

## Quando nao usar

- Pequenas listas de resumo com poucas propriedades: use `aq-info-list`.
- Cards metricos ou indicadores: use `aq-info-card`.
- Layouts que nao possuem relacao tabular entre cabecalhos e celulas.

## Showcase

`/components/table` -> `src/app/features/components-showcase/pages/table/table-showcase.component.ts`
