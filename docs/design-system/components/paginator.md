# Paginator (`aq-paginator`)

## Visao geral

Controle generico de paginacao para tabelas, listas, cards, grids e resultados de busca. Exibe o
intervalo atual e o total de itens, por exemplo `1-10 de 117 itens`. O componente e independente da
fonte de dados: nao busca dados, nao recorta arrays, nao conhece endpoints e nao depende de
`aq-table`.

## Localizacao

`src/app/shared/components/paginator/` - componente, estilos, testes e modelos publicos.

## Seletor

`aq-paginator` (standalone).

## Decisoes arquiteturais

- A API publica principal usa paginas iniciadas em 1 (`page`). Isso evita expor pagina 0 ao usuario.
- `totalPages` e sempre derivado de `totalItems` e `pageSize` com
  `Math.ceil(totalItems / pageSize)`.
- Quando `totalItems = 0`, o estado normalizado e `page = 0`, `totalPages = 0`, os controles ficam
  desabilitados e o intervalo exibido e "0 de 0 itens".
- O componente e controlado: o consumidor fornece `page`, `pageSize` e `totalItems`; o paginador
  emite `paginationChange`; o consumidor atualiza seu proprio estado.
- Ao alterar `pageSize`, o componente emite `page: 1` para evitar paginas inexistentes.
- `pageIndex` e `pageChange` continuam disponiveis apenas para compatibilidade com consumidores
  legados 0-based, como `aq-info-list`.

## API

### Inputs

| Nome                   | Tipo                         | Padrao                       | Descricao                                                    |
| ---------------------- | ---------------------------- | ---------------------------- | ------------------------------------------------------------ |
| `page`                 | `number \| null`             | `null`                       | Pagina atual 1-based. Quando ausente, usa `pageIndex + 1`.   |
| `pageIndex`            | `number`                     | `0`                          | API legada 0-based. Preferir `page`.                         |
| `pageSize`             | `number`                     | `10`                         | Itens por pagina. Valores invalidos caem para `10`.          |
| `pageSizeOptions`      | `readonly number[]`          | `[5, 10, 20]`                | Opcoes do seletor; invalidas/duplicadas sao normalizadas.    |
| `totalItems`           | `number`                     | obrigatorio                  | Total da colecao completa. Valores negativos viram `0`.      |
| `disabled`             | `boolean`                    | `false`                      | Desabilita todos os controles.                               |
| `loading`              | `boolean`                    | `false`                      | Desabilita controles, aplica `aria-busy` e preserva valores. |
| `showFirstLastButtons` | `boolean`                    | `true`                       | Exibe/oculta primeira e ultima pagina.                       |
| `showPageSizeSelector` | `boolean`                    | `true`                       | Exibe/oculta seletor de itens por pagina.                    |
| `pageSizeLabel`        | `string`                     | `'Itens por pagina:'`        | Label visual/acessivel do seletor.                           |
| `ariaLabel`            | `string`                     | `'Paginacao dos resultados'` | Nome acessivel da regiao `nav`.                              |
| `labels`               | `Partial<AqPaginatorLabels>` | `{}`                         | Textos concentrados para customizacao futura/i18n.           |

### Outputs

| Nome               | Tipo                                          | Quando dispara                                   |
| ------------------ | --------------------------------------------- | ------------------------------------------------ |
| `paginationChange` | `AqPaginationChange` (`{ page, pageSize }`)   | Navegacao ou alteracao de tamanho.               |
| `pageChange`       | `PaginatorChange` (`{ pageIndex, pageSize }`) | Compatibilidade legada 0-based. Preferir o novo. |

### Modelos

```ts
export interface AqPaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface AqPaginationChange {
  page: number;
  pageSize: number;
}
```

## Regras funcionais

- Primeira pagina emite `{ page: 1, pageSize }`.
- Pagina anterior emite `page - 1`, nunca menor que 1.
- Proxima pagina emite `page + 1`, nunca maior que `totalPages`.
- Ultima pagina emite `{ page: totalPages, pageSize }`.
- Clique em controles desabilitados, pagina atual ou estado vazio nao emite evento.
- `pageSizeOptions` remove duplicados, descarta valores `<= 0` e inclui automaticamente o
  `pageSize` atual quando ele nao estiver listado.
- Para APIs 0-based, o consumidor adapta: `page: event.page - 1`, `size: event.pageSize`.

## Uso local

```ts
readonly page = signal(1);
readonly pageSize = signal(10);
readonly allItems = signal(MOCK_ITEMS);

readonly visibleItems = computed(() => {
  const start = (this.page() - 1) * this.pageSize();
  return this.allItems().slice(start, start + this.pageSize());
});

onPaginationChange(event: AqPaginationChange): void {
  this.page.set(event.page);
  this.pageSize.set(event.pageSize);
}
```

## Uso remoto

```ts
onPaginationChange(event: AqPaginationChange): void {
  this.page.set(event.page);
  this.pageSize.set(event.pageSize);

  this.loadMeasurements({
    page: event.page - 1,
    size: event.pageSize,
  });
}
```

O total retornado pela API deve atualizar `totalItems`; o paginador continua sem conhecer o contrato
do backend.

## Acessibilidade

- Usa `nav` com `aria-label` configuravel.
- Informacoes de pagina e intervalo ficam em `aria-live="polite"`.
- Loading aplica `aria-busy` e desabilita temporariamente controles.
- Botoes usam `button` nativo, `disabled` real, foco visivel por token do tema e nomes acessiveis.
- Icones Material sao decorativos com `aria-hidden="true"`.
- O seletor reutiliza `aq-select-formfield`, preservando label, teclado e foco acessiveis.

## Responsividade

O layout usa flex-wrap em desktop/tablet e reorganiza seletor, status e controles em coluna no
mobile, mantendo primeira, anterior, proxima e ultima pagina acessiveis.

## Cenários de uso

- Tabelas: componha `aq-table` e `aq-paginator` no consumidor.
- Cards e grids: aplique a paginacao local/remota no container e renderize o paginador abaixo.
- Listas: use o mesmo evento `paginationChange`; o componente nao depende de estrutura de tabela.

## Showcase

`/components/paginator` ->
`src/app/features/components-showcase/pages/paginator/paginator-showcase.component.ts`

## Dependencias internas

`SelectFormfieldComponent`, `ReactiveFormsModule` e tokens do tema em `src/app/shared/theme/`.
