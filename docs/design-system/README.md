# Design System — AquaTrack Web

Documentação de referência do design system do AquaTrack (`aqua-track-web`), cobrindo todos os componentes desenvolvidos em `src/app/shared/components/` e o tema visual em `src/app/shared/theme/`.

**Propósito principal**: servir de contexto para geração de novas telas (por humanos ou IA) reutilizando os componentes já existentes, em vez de recriar padrões visuais/funcionais do zero. Antes de criar qualquer elemento de UI novo, consultar primeiro se já existe um componente equivalente aqui documentado.

## Como usar esta documentação

1. **Vai construir uma tela nova?** Comece por `theme.md` (tokens disponíveis) e pela lista de componentes abaixo para identificar quais já resolvem a necessidade.
2. **Vai usar um componente existente?** Abra o arquivo correspondente em `components/` — cada um documenta API completa (inputs/outputs/slots), regras visuais, regras de acionamento, acessibilidade, cenários de uso e onde já é usado no código real (para copiar um exemplo funcional).
3. **Vai criar um componente novo?** Depois de criá-lo, é **obrigatório**: (a) seguir os tokens de `theme.md`, (b) seguir os padrões de `accessibility.md`, (c) criar a página de showcase correspondente conforme `showcase-guidelines.md`, e (d) adicionar um novo arquivo `components/<nome>.md` a este diretório seguindo o mesmo formato dos demais.

## Índice

- [`theme.md`](./theme.md) — tokens de cor, tipografia, espaçamento, raio de borda, sombra, tamanhos de ícone e o mixin de foco.
- [`accessibility.md`](./accessibility.md) — padrões de acessibilidade aplicados (referência WCAG 2.1 AA) e checklist para novos componentes.
- [`showcase-guidelines.md`](./showcase-guidelines.md) — regra de obrigatoriedade de showcase, checklist de publicação e mapa componente → rota de showcase (incluindo pendências).
- `components/` — um arquivo por componente (ver tabela abaixo).

## Componentes

| Componente                     | Categoria         | Doc                                                                          | Showcase                              |
| ------------------------------ | ----------------- | ---------------------------------------------------------------------------- | ------------------------------------- |
| Avatar                         | Identidade/Mídia  | [`components/avatar.md`](./components/avatar.md)                             | ✅ `/components/avatar`               |
| Badge                          | Feedback/Rótulo   | [`components/badge.md`](./components/badge.md)                               | ✅ `/components/badge`                |
| Button                         | Ação              | [`components/button.md`](./components/button.md)                             | ✅ `/components/button`               |
| Card Selection                 | Formulário        | [`components/card-selection.md`](./components/card-selection.md)             | ✅ `/components/card-selection`       |
| Chip                           | Feedback/Rótulo   | [`components/chip.md`](./components/chip.md)                                 | ✅ `/components/chip`                 |
| Code Block                     | Utilitário        | [`components/code-block.md`](./components/code-block.md)                     | ⚠️ pendente                           |
| Confirmation Dialog            | Overlay           | [`components/confirmation-dialog.md`](./components/confirmation-dialog.md)   | ⚠️ pendente                           |
| Dropdown Menu                  | Navegação/Overlay | [`components/dropdown-menu.md`](./components/dropdown-menu.md)               | ✅ `/components/dropdown-menu`        |
| Feedback Message (+ Container) | Feedback/Overlay  | [`components/feedback-message.md`](./components/feedback-message.md)         | ✅ `/components/feedback-message`     |
| Text Formfield                 | Formulário        | [`components/text-formfield.md`](./components/text-formfield.md)             | ✅ `/components/text-formfield`       |
| Search Formfield               | Formulário        | [`components/search-formfield.md`](./components/search-formfield.md)         | ✅ `/components/search-formfield`     |
| Textarea Formfield             | Formulário        | [`components/textarea-formfield.md`](./components/textarea-formfield.md)     | ✅ `/components/textarea-formfield`   |
| Select Formfield               | Formulário        | [`components/select-formfield.md`](./components/select-formfield.md)         | ✅ `/components/select-formfield`     |
| Datepicker Formfield           | Formulário        | [`components/datepicker-formfield.md`](./components/datepicker-formfield.md) | ✅ `/components/datepicker-formfield` |
| Info Card                      | Exibição de dados | [`components/info-card.md`](./components/info-card.md)                       | ✅ `/components/info-card`            |
| Info List                      | Exibição de dados | [`components/info-list.md`](./components/info-list.md)                       | ✅ `/components/info-list`            |
| Info List Item                 | Exibição de dados | [`components/info-list-item.md`](./components/info-list-item.md)             | ✅ `/components/info-list-item`       |
| Language Switcher              | Navegação         | [`components/language-switcher.md`](./components/language-switcher.md)       | ⚠️ pendente                           |
| Modal                          | Overlay           | [`components/modal.md`](./components/modal.md)                               | ✅ `/components/modal`                |
| Nav Menu                       | Navegação         | [`components/nav-menu.md`](./components/nav-menu.md)                         | ✅ `/components/menu`                 |
| Paginator                      | Exibição de dados | [`components/paginator.md`](./components/paginator.md)                       | ⚠️ pendente                           |
| Photo Upload                   | Formulário        | [`components/photo-upload.md`](./components/photo-upload.md)                 | ✅ `/components/photo-upload`         |
| Segmented Control              | Formulário        | [`components/segmented-control.md`](./components/segmented-control.md)       | ⚠️ pendente                           |
| Settings Card                  | Layout/Container  | [`components/settings-card.md`](./components/settings-card.md)               | ⚠️ pendente                           |
| Switch                         | Formulário        | [`components/switch.md`](./components/switch.md)                             | ⚠️ pendente                           |
| Toolbar                        | Navegação/Layout  | [`components/toolbar.md`](./components/toolbar.md)                           | ✅ `/components/toolbar`              |

✅ = possui showcase publicado e registrado em rota. ⚠️ = componente existe e está em uso (ou disponível), mas ainda não tem página de showcase — ver `showcase-guidelines.md` para o checklist de criação.

## Convenções gerais do design system (resumo)

- **Standalone Angular components**, `ChangeDetectionStrategy.OnPush` em 100% dos componentes.
- **Signals** (`input()`, `output()`, `computed()`, `signal()`) em vez de `@Input()`/`@Output()` decorators e `EventEmitter` manual.
- Prefixo de seletor `aq-` para a maioria dos componentes puros do design system; prefixo `app-` para componentes de composição/orquestração mais ligados à aplicação (`app-avatar`, `app-toolbar`, `app-nav-menu`, `app-dropdown-menu`, `app-language-switcher`).
- Inputs booleanos que colidem com atributos HTML nativos (`disabled`, `required`, `readonly`) são expostos com alias (`disabledState`, `requiredState`, `readonlyState`) para evitar conflito de nome com o atributo nativo do elemento host.
- Campos de formulário implementam `ControlValueAccessor` completo (exceto `segmented-control` e `switch`, que usam padrão `input`/`output` direto — ver nota em cada um).
- Overlays (dropdown-menu, select-formfield, datepicker-formfield, modal, confirmation-dialog) usam Angular CDK (`@angular/cdk/overlay` ou `@angular/cdk/dialog`), nunca posicionamento manual customizado.
- Todo componente colorido segue o padrão de tema "accent / accent-strong / accent-muted" descrito em `theme.md`.
