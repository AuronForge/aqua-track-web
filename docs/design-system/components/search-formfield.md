# Search Formfield (`aq-search-formfield`)

## Visao geral

Campo de busca especializado do AquaTrack para filtros textuais, buscas explicitas por formulario e
fluxos reativos baseados em `valueChanges`, com `ControlValueAccessor`, loading, limpeza e
acessibilidade AA.

## Localizacao

`src/app/shared/components/formfields/search-formfield/` — componente, teste e barrel local.

## Seletor

`aq-search-formfield` (standalone, implementa `ControlValueAccessor`).

## Decisao arquitetural

Implementado como componente proprio, semanticamente especializado em busca. A equipe reaproveita
tipos, tokens, padroes de erro e contratos de acessibilidade dos formfields existentes, mas evita
compor diretamente outro `ControlValueAccessor`, o que reduziria a clareza do fluxo com `NgControl`,
`disabled`, `touched`, foco e mensagens de erro.

## API

### Inputs

| Nome                               | Tipo                     | Padrao               | Descricao                                              |
| ---------------------------------- | ------------------------ | -------------------- | ------------------------------------------------------ |
| `label`                            | `string`                 | `''`                 | Label visual opcional.                                 |
| `ariaLabel`                        | `string`                 | traducao interna     | Nome acessivel quando nao houver label visual.         |
| `placeholder`                      | `string`                 | `''`                 | Placeholder contextualizado.                           |
| `hint`                             | `string`                 | `''`                 | Texto auxiliar enquanto nao houver erro visivel.       |
| `id` / `name`                      | `string`                 | gerado / `undefined` | Atributos nativos repassados ao input.                 |
| `autocomplete`                     | `string`                 | `'off'`              | Politica de autocomplete do navegador.                 |
| `showClearButton`                  | `boolean`                | `true`               | Controla a acao de limpar.                             |
| `loading`                          | `boolean`                | `false`              | Exibe spinner e `aria-busy` sem apagar o valor.        |
| `loadingLabel`                     | `string`                 | traducao interna     | Texto acessivel anunciado quando loading entra.        |
| `clearAriaLabel`                   | `string`                 | traducao interna     | Nome acessivel do botao de limpar.                     |
| `readonly` (alias `readonlyState`) | `boolean`                | `false`              | Mantem o valor visivel sem permitir edicao ou limpeza. |
| `required` (alias `requiredState`) | `boolean`                | `false`              | Reflete obrigatoriedade nativa e `aria-required`.      |
| `disabled` (alias `disabledState`) | `boolean`                | `false`              | Desabilita input e acoes internas.                     |
| `hideErrorMessage`                 | `boolean`                | `false`              | Oculta a mensagem visual de erro quando necessario.    |
| `errorMessages`                    | `FormfieldErrorMessages` | `{}`                 | Mapa de mensagens por chave de validacao.              |

### Outputs

| Nome      | Tipo   | Quando dispara                                                       |
| --------- | ------ | -------------------------------------------------------------------- |
| `cleared` | `void` | Quando o usuario limpa explicitamente o campo por botao ou `Escape`. |

### Metodos publicos

| Metodo    | Descricao                                                                      |
| --------- | ------------------------------------------------------------------------------ |
| `focus()` | Foca programaticamente o input interno quando o componente estiver habilitado. |

### Valor de forms

O contrato de forms sempre trabalha com `string`. `null` e `undefined` sao normalizados para `''`
em `writeValue`.

## Reactive Forms

- Implementa `writeValue`, `registerOnChange`, `registerOnTouched` e `setDisabledState`.
- Funciona com `formControlName` e `[formControl]`.
- O estado interno nao substitui o `FormControl`; ele apenas reflete o valor atual para a view.
- `Escape` e o botao de limpar propagam `''` pelo contrato de forms.

## Regras visuais e estados

- Usa a mesma linguagem visual dos demais formfields: borda `1.5px`, `radius` medio, tipografia do
  tema e `aq-focus-ring`.
- Estados suportados: vazio, preenchido, focused, invalid, disabled, readonly e loading.
- O spinner de loading ocupa a area de sufixo e respeita `prefers-reduced-motion: reduce`.
- O valor atual e preservado durante loading.

## Comportamento de limpeza

- O botao aparece somente quando `showClearButton`, existe valor e o campo nao esta `disabled` nem
  `readonly`.
- O botao e sempre `<button type="button">`.
- Ao limpar: o valor vira `''`, `onChange` e `onTouched` sao disparados, o output `cleared` e
  emitido e o foco volta ao input.
- `Escape` limpa apenas quando houver valor; se o campo estiver vazio, o evento continua a propagar
  para o container externo.

## Teclado e acessibilidade

- Label visual associada por `for/id` quando `label` estiver presente.
- Sem label visual, o input recebe `aria-label`.
- `aria-describedby` aponta para o hint ou para o erro visivel.
- `aria-invalid`, `aria-required` e `aria-busy` refletem o estado atual.
- Erro visual em `role="alert"`.
- Loading acessivel com live region `polite`.
- Icones decorativos usam `aria-hidden="true"`.
- O botao de limpar possui nome acessivel e funciona por teclado por ser um botao nativo.

## Responsabilidades do componente

Inclui:

- apresentacao do campo de busca;
- CVA e Reactive Forms;
- limpeza;
- loading;
- feedback visual e acessivel;
- foco programatico.

Fora do escopo:

- debounce;
- chamadas HTTP;
- endpoints;
- resultados;
- autocomplete;
- sugestoes;
- cache;
- regras de negocio.

## Exemplos de uso

Busca explicita:

```html
<form [formGroup]="form" (ngSubmit)="search()">
  <aq-search-formfield
    formControlName="query"
    label="Buscar aquarios"
    placeholder="Buscar aquarios por nome"
  />
</form>
```

Busca reativa:

```html
<aq-search-formfield
  [formControl]="searchControl"
  ariaLabel="Buscar especies"
  placeholder="Buscar especies"
/>
```

```ts
readonly searchControl = new FormControl('', { nonNullable: true });
```

## Showcase

`/components/search-formfield` →
`src/app/features/components-showcase/pages/formfields/search-formfield-showcase.component.ts`

## Dependencias internas

- `LanguageService`
- `FormfieldErrorMessages`
- tokens e mixins de `src/app/shared/theme/`
