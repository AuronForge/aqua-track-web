# Confirmation Dialog (`aq-confirmation-dialog`)

## Visão geral

Diálogo modal de confirmação de ação, aberto programaticamente (nunca via tag no template) através do `ConfirmationDialogService`. Suporta um modo de segurança extra ("digite a palavra X para confirmar") para ações destrutivas de alto risco.

## Localização

- Componente: `src/app/shared/components/confirmation-dialog/` — `confirmation-dialog.component.ts` / `.html` / `.scss`, `confirmation-dialog-data.model.ts`, `confirmation-dialog-result.type.ts`.
- Serviço: `src/app/shared/services/confirmation-dialog.service.ts`.

## Seletor

`aq-confirmation-dialog` — **não é usado diretamente no template**; é resolvido internamente pelo Angular CDK Dialog via `ConfirmationDialogService.confirm(data)`.

## API

### `ConfirmationDialogService.confirm(data: ConfirmationDialogData): Observable<boolean>`

### `ConfirmationDialogData`

| Campo               | Tipo                    | Descrição                                                                                                  |
| ------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| `title`             | `string`                | Título do diálogo.                                                                                         |
| `message`           | `string`                | Corpo da mensagem.                                                                                         |
| `confirmLabel`      | `string`                | Texto do botão de confirmação.                                                                             |
| `cancelLabel`       | `string`                | Texto do botão de cancelamento.                                                                            |
| `tone?`             | `'default' \| 'danger'` | `'danger'` aplica borda vermelha superior, botão de confirmação em `color="error"` e `role="alertdialog"`. |
| `confirmWord?`      | `string`                | Se definido, exige que o usuário digite exatamente esta palavra para habilitar o botão de confirmação.     |
| `confirmWordLabel?` | `string`                | Label do campo de confirmação por palavra.                                                                 |

Retorno: `Observable<boolean>` — `true` se confirmado, `false` se cancelado (incluindo fechamento por backdrop/escape, tratado pelo CDK Dialog).

## Regras visuais

- Largura `min(28rem, calc(100vw - 2rem))`, `border-radius: $aq-radius-md`, `box-shadow: $aq-shadow-card`.
- `tone="danger"`: `border-top: 4px solid $aq-color-error`.
- Botão de cancelar sempre `variant="stroked" color="tertiary"`; botão de confirmar usa `color="error"` se `tone="danger"`, senão `color="primary"`.
- Em telas ≤480px, os botões de ação empilham em coluna reversa (confirmar em cima) e ocupam 100% da largura.

## Regras de acionamento

- Se `confirmWord` for definido, o botão de confirmação (`isConfirmDisabled`) permanece desabilitado até o texto digitado no `aq-text-formfield` interno ser **exatamente igual** a `confirmWord` (case-sensitive, sem trim).
- `confirm()` fecha o dialog com `dialogRef.close(true)`; `cancel()` fecha com `dialogRef.close(false)`.
- Abertura/fechamento (backdrop, Escape) são gerenciados pelo Angular CDK Dialog — comportamento padrão do CDK, sem `closeOnBackdropClick`/`closeOnEscape` customizáveis como no `modal`.

## Acessibilidade

- `role="alertdialog"` quando `tone="danger"` (exige atenção imediata do usuário), `role="dialog"` no padrão.
- `aria-modal="true"`, `aria-labelledby`/`aria-describedby` apontando para título/mensagem.
- Campo de confirmação por palavra reaproveita `aq-text-formfield` com `hideErrorMessage="true"` (mensagem de erro nativa do campo é suprimida pois a validação aqui é binária — botão habilitado ou não).

## Cenários de uso

- Confirmação de exclusão de conta, aquário ou registro (com `tone="danger"` e, para exclusões irreversíveis de alto impacto, `confirmWord` pedindo que o usuário digite o nome do recurso ou "EXCLUIR").
- Confirmação de ações não destrutivas mas relevantes (ex.: sair sem salvar) com `tone="default"`.

## Onde é usado

Nenhum uso encontrado em `features/` no momento (nem via `ConfirmationDialogService` nem via tag). O padrão de exclusão de conta atual (`delete-account-request-modal`) usa `aq-modal`/`ModalService` diretamente em vez deste serviço — avaliar consolidação ao criar novos fluxos de confirmação destrutiva.

## Showcase

**Não possui showcase** (ver `showcase-guidelines.md`, pendência conhecida). Como é aberto via serviço, a página de showcase deve incluir um botão de exemplo que chama `ConfirmationDialogService.confirm(...)` e exibe o resultado, cobrindo `tone="default"`, `tone="danger"` e o fluxo com `confirmWord`.

## Dependências internas

`ButtonComponent`, `TextFormfieldComponent`.
