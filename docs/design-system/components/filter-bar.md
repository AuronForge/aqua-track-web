# Filter Bar

Agrupa filtros de listagens no padrao visual do AquaTrack. O componente organiza os campos na linha superior e exibe, na linha inferior, o total de itens e a acao de limpar filtros.

## Uso

```html
<form
  aqFilterBar
  [formGroup]="filtersForm"
  caption="14 medicoes exibidas"
  columns="repeat(3, minmax(0, 1fr))"
  [clearDisabled]="!hasFilters()"
  (clearFilters)="clearFilters()"
>
  <aq-datepicker-formfield formControlName="date" label="Filtrar por data" />
  <aq-select-formfield formControlName="parameter" label="Filtrar por parametro" />
  <aq-select-formfield formControlName="status" label="Filtrar por status" />
</form>
```

## API

- `caption`: texto exibido no rodape, geralmente com o total filtrado.
- `columns`: template CSS das colunas de filtros. O padrao e `repeat(3, minmax(0, 1fr))`.
- `clearLabel`: texto do botao de limpeza. O padrao e `Limpar filtros`.
- `clearDisabled`: desabilita a acao de limpar filtros.
- `clearFilters`: evento emitido ao acionar o botao.

Os campos sao projetados por `ng-content`, entao qualquer formfield ou controle pode ser usado.
