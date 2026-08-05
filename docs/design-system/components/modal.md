# Modal (`aq-modal`)

## Visão geral

Diálogo modal genérico e altamente configurável, aberto programaticamente via `ModalService`. Suporta conteúdo por componente dinâmico (`NgComponentOutlet`) ou por template (`NgTemplateOutlet`), título/descrição com suporte a chave de tradução, e um footer de ações configurável.

## Localização

- Componente: `src/app/shared/components/modal/` — `modal.component.ts` / `.html` / `.scss`, `modal-action.model.ts`, `modal-close-result.model.ts`, `modal-component-data.model.ts`, `modal-config.model.ts`, `modal-i18n-labels.model.ts`, `modal-icon-position.type.ts`, `modal-size.type.ts`.
- Serviço: `src/app/shared/services/modal.service.ts`.
- Suporte: `src/app/shared/modal/modal-ref.ts` (`ModalRef`), `src/app/shared/modal/modal-data.token.ts` (`MODAL_DATA`, injetável dentro do conteúdo do modal).

## Seletor

`aq-modal` — **não é usado diretamente no template**; é resolvido internamente pelo Angular CDK Dialog via `ModalService.open(config)`.

## API

### `ModalService.open(config: ModalConfig): ModalRef`

### `ModalConfig`

| Campo                              | Tipo                                                           | Padrão     | Descrição                                                                     |
| ---------------------------------- | -------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------- |
| `title?` / `titleKey?`             | `string` / `keyof TranslationDictionary`                       | —          | Título literal ou chave de tradução (chave tem prioridade).                   |
| `description?` / `descriptionKey?` | `string` / `keyof TranslationDictionary`                       | —          | Descrição literal ou traduzida.                                               |
| `size`                             | `ModalSize` (`'small' \| 'medium' \| 'large' \| 'fullscreen'`) | `'medium'` | Tamanho do modal.                                                             |
| `role`                             | `'dialog' \| 'alertdialog'`                                    | `'dialog'` | Role ARIA.                                                                    |
| `showCloseButton`                  | `boolean`                                                      | `false`    | Exibe botão "X" no cabeçalho.                                                 |
| `closeOnBackdropClick`             | `boolean`                                                      | `true`     | Fecha ao clicar fora.                                                         |
| `closeOnEscape`                    | `boolean`                                                      | `true`     | Fecha com `Escape`.                                                           |
| `hasBackdrop`                      | `boolean`                                                      | `true`     | Exibe overlay escuro atrás do modal.                                          |
| `actions`                          | `ModalAction[]`                                                | `[]`       | Botões do footer.                                                             |
| `data?`                            | `unknown`                                                      | —          | Dados injetáveis via `MODAL_DATA` dentro do `contentComponent`.               |
| `contentComponent?`                | `Type<unknown>`                                                | —          | Componente dinâmico a renderizar no corpo.                                    |
| `contentComponentInputs?`          | `Record<string, unknown>`                                      | `{}`       | Inputs passados ao `contentComponent` via `NgComponentOutlet`.                |
| `contentTemplate?`                 | `TemplateRef<unknown>`                                         | —          | Alternativa a `contentComponent`: template inline.                            |
| `contentTemplateContext?`          | `Record<string, unknown>`                                      | `{}`       | Contexto extra mesclado ao contexto padrão (`$implicit`, `data`, `modalRef`). |
| `i18nLabels?`                      | `ModalI18nLabels`                                              | —          | Override do `aria-label` do botão fechar.                                     |

### `ModalAction`

`{ id, label?, labelKey?, variant?, color?, disabled?, closeOnClick?, iconName?, iconPosition? }` — reaproveita `ButtonVariant`/`ButtonColor` do `button.component`.

### `ModalRef`

Retornado por `ModalService.open()`. Expõe métodos/observables para fechar o modal e escutar cliques em ações/backdrop (consultar `src/app/shared/modal/modal-ref.ts` para a API completa).

## Regras visuais

- 4 tamanhos via classe `modal--<size>` e `modal__surface--<size>` (`small`/`medium`/`large`/`fullscreen`).
- Cabeçalho (`modal__header`) só é renderizado se houver título, descrição **ou** `showCloseButton` — modal pode não ter cabeçalho algum.
- Footer (`modal__footer`) só é renderizado se `actions.length > 0`.
- Botão fechar usa `aqButton` `variant="icon" color="tertiary"`.
- Botões de ação no footer usam `aqButton` com `variant`/`color` configuráveis por ação (padrão `flat`/`primary`), suportando ícone antes ou depois do label.

## Regras de acionamento

- Fechamento por 4 vias, todas resultando em `ModalCloseResult` com `reason` distinto: `'close-button'` (botão X), `'backdrop'` (clique fora, só se `closeOnBackdropClick`), `'escape'` (tecla Esc, só se `closeOnEscape`), `'action'` (clique em ação com `closeOnClick !== false`) — mais `'programmatic'` para fechamento via código.
- Cada `ModalAction` pode optar por **não** fechar o modal ao ser clicada (`closeOnClick: false`), útil para ações assíncronas (ex.: salvar) que só devem fechar o modal após sucesso — nesse caso, o consumidor escuta o clique via `ModalRef` e chama `modalRef.close(...)` manualmente quando apropriado.
- Foco é **preso dentro do modal** via `cdkTrapFocus` + `cdkTrapFocusAutoCapture="true"` (captura automática do primeiro elemento focável ao abrir) — usuário de teclado não consegue tabular para fora do modal enquanto ele está aberto.
- Título/descrição resolvidos por prioridade: chave de tradução (`titleKey`/`descriptionKey`) tem prioridade sobre o texto literal (`title`/`description`) quando ambos são informados.

## Acessibilidade

- `[attr.role]` = `config.role` (`dialog` ou `alertdialog`), `aria-modal="true"`.
- `aria-labelledby`/`aria-describedby` apontam para IDs únicos por instância (`aq-modal-title-<n>`/`aq-modal-description-<n>`), só quando título/descrição existem.
- Foco preso (CDK `cdkTrapFocus`) — ver acima.
- Botão fechar tem `aria-label` resolvido (customizável via `i18nLabels`, com fallback traduzido `t().modalCloseLabel`).

## Cenários de uso

- Alteração de senha (`change-password-modal`), solicitação de exclusão de conta (`delete-account-request-modal`) — ambos via `ModalService` na `profile.facade.ts`.
- Qualquer fluxo que precise de um formulário, confirmação complexa ou conteúdo rico sobreposto à tela atual.

## Onde é usado

- `ModalService` é injetado e usado em `src/app/features/profile/facades/profile.facade.ts` (abre `change-password-modal` e `delete-account-request-modal` como `contentComponent`).

## Showcase

`/components/modal` → `src/app/features/components-showcase/pages/modal/modal-showcase.component.ts` (há também `modal-showcase-dynamic-content.component.ts` como exemplo de `contentComponent` dinâmico).

## Dependências internas

`ButtonComponent`, `CdkTrapFocus` (`@angular/cdk/a11y`), `LanguageService`.
