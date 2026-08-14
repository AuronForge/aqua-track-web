# Alert (`aq-alert`)

## Visao geral

Componente de alerta inline para mensagens contextuais persistentes dentro do fluxo da interface.
Use para orientacoes, dicas, avisos, confirmacoes, erros de secao e estados que precisam permanecer
visiveis enquanto forem relevantes.

`aq-alert` nao e toast, snackbar nem feedback message. Ele nao flutua, nao possui temporizador e nao
desaparece automaticamente. Quando `dismissible` estiver ativo, o componente apenas emite
`dismissed`; o consumidor decide se remove o alerta do DOM.

## Localizacao

- `src/app/shared/components/alert/alert.component.ts`
- `src/app/shared/components/alert/alert.component.html`
- `src/app/shared/components/alert/alert.component.scss`
- `src/app/shared/components/alert/alert-variant.type.ts`

## Seletor

`aq-alert`

## API

| Campo         | Tipo                                                       | Padrao            | Descricao                                              |
| ------------- | ---------------------------------------------------------- | ----------------- | ------------------------------------------------------ |
| `variant`     | `'info' \| 'success' \| 'warning' \| 'error' \| 'neutral'` | `'info'`          | Define tom visual, icone padrao e semantica acessivel. |
| `title`       | `string \| undefined`                                      | `undefined`       | Titulo opcional exibido antes do conteudo.             |
| `icon`        | `string \| undefined`                                      | icone da variante | Nome do Material Icon usado no lugar do padrao.        |
| `showIcon`    | `boolean`                                                  | `true`            | Exibe ou oculta o icone decorativo.                    |
| `dismissible` | `boolean`                                                  | `false`           | Exibe botao de fechar.                                 |
| `ariaLabel`   | `string \| undefined`                                      | `undefined`       | Nome acessivel opcional para o host.                   |
| `dismissed`   | `output<void>`                                             | -                 | Emitido ao acionar o botao de fechar.                  |

## Variantes

- `info`: dicas, informacoes complementares e orientacoes. Usa o tom azul do prototipo.
- `success`: confirmacoes e resultados positivos.
- `warning`: atencao, riscos, dados incompletos ou condicoes que podem causar problemas.
- `error`: falhas, impedimentos e erros que exigem correcao.
- `neutral`: informacoes auxiliares sem significado positivo ou negativo.

Icones padrao: `info`, `check_circle`, `warning`, `error` e `notes`.

## Conteudo Projetado

O conteudo principal e projetado no corpo do componente. Acoes podem ser projetadas com o atributo
`aqAlertAction`, sem diretiva adicional:

```html
<aq-alert variant="warning" title="Parametros fora da faixa recomendada">
  Revise as ultimas medicoes antes de adicionar novos habitantes.

  <button aqButton aqAlertAction type="button" variant="stroked" color="warning">
    Ver medicoes
  </button>
</aq-alert>
```

## Exemplos

```html
<aq-alert variant="info" title="Dica de cuidado">
  Pesquise as necessidades especificas da especie antes de adiciona-la ao aquario.
</aq-alert>

<aq-alert variant="success" title="Medicao registrada">
  Os parametros do aquario foram atualizados com sucesso.
</aq-alert>

<aq-alert variant="neutral">
  A proxima atualizacao das medicoes ocorrera em alguns minutos.
</aq-alert>

<aq-alert
  variant="info"
  title="Novo recurso disponivel"
  [dismissible]="true"
  (dismissed)="hideAlert()"
>
  Agora voce pode acompanhar o historico completo das medicoes.
</aq-alert>
```

## Acessibilidade

- `warning` e `error` usam `role="alert"` com `aria-live="assertive"`.
- `info`, `success` e `neutral` usam `role="status"` com `aria-live="polite"`.
- Icones usam `aria-hidden="true"`; o texto deve comunicar a semantica sem depender apenas da cor.
- O botao de fechar tem nome acessivel `Fechar alerta`, foco visivel pelo componente `aqButton` e
  funciona por teclado.

## Responsividade

O alerta ocupa a largura disponivel, quebra textos longos com `overflow-wrap`, mantem icone e
conteudo alinhados ao topo e permite que acoes quebrem para linhas separadas em containers
estreitos.

## Quando Usar

- Mensagens relacionadas ao conteudo atual.
- Orientacoes que precisam permanecer visiveis.
- Validacoes gerais de formulario.
- Avisos associados a uma secao.
- Informacoes sobre o estado de uma funcionalidade.

## Quando Nao Usar

- Notificacoes temporarias e globais.
- Confirmacoes rapidas apos acoes.
- Feedback imediato e transitorio provocado por interacao.
- Mensagens com desaparecimento automatico.
- Dialogos que exigem decisao obrigatoria.

Nesses casos, use feedback message, toast/snackbar, modal ou confirmation dialog conforme o fluxo.

## Showcase

`/components/alert` cobre variantes, titulo opcional, texto simples, acoes, icone customizado, sem
icone, alerta dispensavel, texto longo e container estreito.
