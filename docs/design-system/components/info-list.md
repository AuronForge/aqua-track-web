# Info List (`aq-info-list`)

## Visão geral

Lista paginada de `info-list-item`, com estados de carregamento e vazio embutidos e paginação integrada via `aq-paginator`. É o componente de composição de nível mais alto entre os três (`info-list` → `info-list-item` → `badge`).

## Localização

`src/app/shared/components/info-list/` — componente + `info-list-empty-state.model.ts`, `info-list-item-data.model.ts`, `info-list-page-change.model.ts`.

## Seletor

`aq-info-list` (standalone).

## API

### Inputs

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

### Outputs

| Nome         | Tipo                                             | Quando dispara                                                    |
| ------------ | ------------------------------------------------ | ----------------------------------------------------------------- |
| `pageChange` | `InfoListPageChange` (`{ pageIndex, pageSize }`) | Ao trocar de página ou de tamanho de página no paginador interno. |
| `itemClick`  | `InfoListItemData`                               | Ao clicar em um item (quando `clickable=true`).                   |

## Regras visuais

- Três estados mutuamente exclusivos: `loading` (ícone `sync` girando + texto), vazio (`isEmpty`: não loading e `items.length === 0`, exibe `emptyState`), ou lista renderizada (`<ul role="list">`).
- Paginador só é exibido (`showPaginator`) quando `paginated=true` **e** `totalItems > pageSize` — evita paginação desnecessária para listas curtas.
- Internacionalização: textos padrão de "vazio" e "carregando" vêm de `LanguageService.translation()` (chaves `listEmptyDefault`, `listLoadingDefault`), respeitando o idioma selecionado pelo usuário.

## Regras de acionamento

- `paginated=true`: o próprio componente fatia `items` localmente (`slice(start, start + pageSize)`) — não faz paginação server-side; para paginação server-side, o consumidor deve ouvir `pageChange` e recarregar `items` com os dados da página correta, mantendo `paginated=true` apenas para exibir a UI do paginador (ou implementar sua própria lógica).
- Clique em um item propaga o objeto completo do item (`InfoListItemData`) via `itemClick`, não apenas um índice.

## Acessibilidade

- `aria-busy` no host durante `loading`.
- Lista usa `role="list"` explícito na `<ul>`.
- Label de carregamento (`aria-label` no container de loading) também é anunciado por leitores de tela.
- Cada linha herda toda a acessibilidade de `info-list-item` (`role="button"` quando clicável, etc.).

## Cenários de uso

- Lista de aquários, medições, aplicações ou qualquer coleção de itens com valor de destaque, em qualquer tela que precise de paginação simples.

## Onde é usado

- `src/app/features/home/pages/home-page/home-page.component.html`

## Showcase

`/components/info-list` → `src/app/features/components-showcase/pages/info-list/info-list-showcase.component.ts`

## Dependências internas

`InfoListItemComponent`, `PaginatorComponent`, `LanguageService`.
