# Feedback Message + Feedback Message Container (`aq-feedback-message`, `aq-feedback-message-container`)

## Visão geral

Sistema de notificações "toast" (mensagens temporárias flutuantes) da aplicação. Composto por dois componentes que trabalham juntos:

- `aq-feedback-message-container`: componente raiz, deve ser montado **uma única vez** no layout da aplicação (ex.: no layout autenticado). Escuta `FeedbackMessageService` e renderiza todas as mensagens ativas, calculando o empilhamento (stacking) automático de mensagens na mesma posição.
- `aq-feedback-message`: renderiza uma mensagem individual; normalmente não é usado diretamente — é instanciado pelo container.

Disparo de mensagens é feito exclusivamente via `FeedbackMessageService` (nunca colocando `<aq-feedback-message>` manualmente em uma tela).

## Localização

- `src/app/shared/components/feedback-message/` — componente + `feedback-message-*-position.type.ts`, `feedback-message-item.model.ts`, `feedback-message-payload.model.ts`, `feedback-message-type.type.ts`.
- `src/app/shared/components/feedback-message-container/` — componente container.
- `src/app/shared/services/feedback-message.service.ts`.

## Seletor

`aq-feedback-message-container` (montar uma vez no layout raiz) / `aq-feedback-message` (interno).

## API — `FeedbackMessageService`

| Método            | Assinatura                                  | Descrição                                       |
| ----------------- | ------------------------------------------- | ----------------------------------------------- |
| `show`            | `(message: FeedbackMessagePayload) => void` | Exibe uma mensagem com payload completo.        |
| `showSuccess`     | `(label: string, options?) => void`         | Atalho `type: 'success'`.                       |
| `showError`       | `(label: string, options?) => void`         | Atalho `type: 'error'`.                         |
| `showWarning`     | `(label: string, options?) => void`         | Atalho `type: 'warning'`.                       |
| `showInformation` | `(label: string, options?) => void`         | Atalho `type: 'information'`.                   |
| `dismiss`         | `(id: number) => void`                      | Remove uma mensagem específica antes do tempo.  |
| `clear`           | `() => void`                                | Remove todas as mensagens ativas imediatamente. |

### `FeedbackMessagePayload`

| Campo                 | Tipo                                                 | Padrão          | Descrição                                                                                                       |
| --------------------- | ---------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------- |
| `label`               | `string` (obrigatório)                               | —               | Texto da mensagem.                                                                                              |
| `horizontalPosition?` | `'top' \| 'center' \| 'bottom'`                      | `'top'`         | Posição vertical na tela (nome do campo é "horizontal" por convenção do projeto, mas controla o eixo vertical). |
| `verticalPosition?`   | `'start' \| 'center' \| 'end'`                       | `'center'`      | Alinhamento horizontal (esquerda/centro/direita).                                                               |
| `type?`               | `'success' \| 'error' \| 'warning' \| 'information'` | `'information'` | Tipo semântico — define cor, ícone padrão e `role`/`aria-live`.                                                 |
| `displayDurationMs?`  | `number`                                             | `5000`          | Tempo até auto-dismiss; `0` desativa o auto-dismiss.                                                            |
| `hasIcon?`            | `boolean`                                            | `false`         | Exibe ícone.                                                                                                    |
| `iconName?`           | `string`                                             | `''`            | Ícone customizado; se vazio, usa o ícone padrão do `type`.                                                      |
| `iconPosition?`       | `'start' \| 'end'`                                   | `'start'`       | Posição do ícone relativo ao texto.                                                                             |

## Regras visuais

- Cada `type` mapeia para um par de cores do tema (`success`→verde, `error`→vermelho, `warning`→amarelo, `information`→azul), aplicado como faixa lateral esquerda de 6px em gradiente (`--_accent` → `--_accent-strong`).
- Ícone padrão por tipo: `success`→`check_circle`, `error`→`error`, `warning`→`warning`, `information`→`info`.
- Múltiplas mensagens na mesma posição (`horizontalPosition` + `verticalPosition`) empilham com deslocamento de 88px cada (`stackOffsetPx`), calculado pelo container via `stackIndex`.
- `pointer-events: none` no container e no host da mensagem — apenas a superfície visual (`.feedback-message__surface`) recebe `pointer-events: auto`, permitindo cliques "atravessarem" a área da tela ocupada pelo toast.
- Largura `min(100%, 30rem)`, com `max-inline-size` responsivo em telas ≤640px.

## Regras de acionamento

- `show()` gera um `id` incremental, aplica defaults, adiciona à lista reativa (`signal`) e agenda um `setTimeout` para `dismiss(id)` após `displayDurationMs` (se > 0).
- `dismiss(id)` cancela o timeout pendente (se houver) e remove a mensagem da lista.
- `clear()` cancela todos os timeouts e esvazia a lista.
- Sem interação de clique própria na mensagem (não há botão de fechar manual hoje) — dependem do timeout ou de `dismiss()`/`clear()` chamados programaticamente pelo consumidor.

## Acessibilidade

- `role` dinâmico por tipo: `alert` (erro/warning) vs. `status` (sucesso/informação); `aria-live` correspondente (`assertive` vs. `polite`) — ver `accessibility.md`, seção "Live regions".
- Ícones são `aria-hidden="true"`.

## Cenários de uso

- Confirmação de sucesso após salvar um formulário (`showSuccess`).
- Erro de submissão de formulário ou falha de API (`showError`).
- Avisos não bloqueantes (`showWarning`) e mensagens informativas gerais (`showInformation`).

## Onde é usado

- `FeedbackMessageService` é consumido em: `src/app/features/aquarium/pages/aquarium-create-page/aquarium-create-page.component.ts`, `src/app/features/profile/components/change-password-modal/change-password-modal.component.ts`, `src/app/features/profile/components/delete-account-request-modal/delete-account-request-modal.component.ts`, `src/app/features/profile/facades/profile.facade.ts`.
- O container (`aq-feedback-message-container`) deve estar montado no(s) layout(s) raiz da aplicação para que qualquer chamada ao serviço tenha efeito visual — confirmar presença ao adicionar novos layouts.

## Showcase

`/components/feedback-message` → `src/app/features/components-showcase/pages/feedback-message/feedback-message-showcase.component.ts` (documenta ambos: o container e o disparo via serviço).

**Atenção**: o container (`aq-feedback-message-container`) em si não tem entrada própria no mapa de showcase — está coberto pela mesma página que `feedback-message`, já que ambos formam um único sistema.
