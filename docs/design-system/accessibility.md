# Acessibilidade — AquaTrack Web Design System

Referência normativa: **WCAG 2.1 (nível AA)**. Este documento descreve os padrões de acessibilidade já implementados nos componentes existentes e as regras que todo componente novo deve seguir para manter o mesmo nível de conformidade. Os números entre parênteses (ex.: `1.3.1`) referem-se aos critérios de sucesso da WCAG.

> Estado atual do projeto: **não há plugin de lint de acessibilidade configurado** (`eslint-plugin-jsx-a11y`/`@angular-eslint` a11y rules não encontrados em `eslint.config.*`). A conformidade hoje depende de disciplina manual nos templates. Recomenda-se avaliar a adoção de um linter de acessibilidade para Angular como item de melhoria contínua.

## Princípios gerais aplicados

1. **HTML semântico antes de ARIA.** Usa-se `<fieldset>`/`<legend>` (card-selection), `<header>`/`<h1>`/`<h2>` (toolbar, modal, confirmation-dialog), `<nav>` (nav-menu), `<button>` nativo para qualquer elemento clicável (nunca `<div onclick>`).
2. **Todo controle interativo é operável por teclado.** Nenhum componente depende exclusivamente de mouse/ponteiro (WCAG 2.1.1 Keyboard).
3. **Todo elemento de foco visível usa o mesmo anel de foco** (`aq-focus-ring`, ver `theme.md`), garantindo indicador de foco consistente e com contraste suficiente (2.4.7 Focus Visible, 1.4.11 Non-text Contrast).
4. **Ícones decorativos são sempre `aria-hidden="true"`**; texto/label equivalente é fornecido separadamente (1.1.1 Non-text Content).
5. **Mensagens de erro e hints são associados ao campo via `aria-describedby`**, e o estado inválido é sinalizado com `aria-invalid="true"` (3.3.1 Error Identification, 4.1.2 Name, Role, Value).

## Padrões por categoria

### 1. Labels e nomes acessíveis (1.1.1 / 1.3.1 / 4.1.2)

- Campos de formulário (`text-formfield`, `textarea-formfield`, `select-formfield`, `datepicker-formfield`) usam `<label [for]="inputId()">` associado por `id` gerado automaticamente quando não informado (`aq-<componente>-<n>`).
- Componentes sem `<label>` visível expõem `aria-label` obrigatório via input required (`switch.ariaLabel`, `segmented-control.ariaLabel`) — **nunca deixe um controle interativo sem nome acessível**; se não houver label visível, exija `ariaLabel` como input obrigatório no componente.
- `avatar` usa `role="img"` com `aria-label` (nome do usuário) e esconde as iniciais/ícone internos com `aria-hidden="true"`, evitando leitura duplicada.
- `card-selection` resolve `aria-labelledby` (para `<legend>`) ou `aria-label` (fallback) no `<fieldset>`.

### 2. Estado de formulário (3.3.1 / 3.3.2 / 4.1.2)

Padrão replicado em todos os campos com `ControlValueAccessor` (text/textarea/select/datepicker-formfield, card-selection):

- `aria-required="true"` quando `required`.
- `aria-invalid="true"` quando o `FormControl` associado está `invalid && (touched || dirty)`.
- `aria-describedby` aponta para o `id` da mensagem de erro (`<id>-error`) quando há erro visível, ou para o hint (`<id>-hint`) caso contrário — nunca os dois ao mesmo tempo.
- A mensagem de erro é renderizada com `role="alert"`, garantindo anúncio automático por leitor de tela assim que aparece (4.1.3 Status Messages).
- Mapas de mensagem de erro (`FormfieldErrorMessages`) permitem customizar o texto por `ValidatorFn` (`required`, `email`, `minlength`, etc.), com fallback padrão em português.

Todo novo campo de formulário **deve** replicar esse contrato: `inputId`/`hintId`/`errorId` computados, `describedBy` computado, `aria-invalid`/`aria-required` refletindo o `NgControl`.

### 3. Foco e navegação por teclado (2.1.1 / 2.1.2 / 2.4.3 / 2.4.7)

| Componente                     | Padrão de teclado                                                                                                                                                                                                                                                          |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `card-selection`               | `ArrowRight`/`ArrowDown` e `ArrowLeft`/`ArrowUp` navegam entre opções habilitadas (roving focus); `Home`/`End` vão para primeira/última opção; `Space`/`Enter` selecionam. Radiogroup nativo via `role` implícito de `<input type="radio">`.                               |
| `segmented-control`            | `role="radiogroup"` + `role="radio"` por opção, `aria-checked`, `tabindex` gerenciado (roving tabindex: só a opção selecionada tem `tabindex="0"`), `ArrowRight`/`ArrowLeft` alternam seleção circularmente.                                                               |
| `select-formfield`             | `role="combobox"` no trigger, `aria-expanded`, `aria-controls`, `aria-activedescendant` apontando para a opção focada; `ArrowDown`/`ArrowUp` navegam, `Enter`/`Space` selecionam, `Escape` fecha e devolve foco ao trigger.                                                |
| `dropdown-menu`                | `aria-haspopup="menu"`, `aria-expanded`; fecha ao clicar fora (`document:click`) e ao pressionar `Escape` (`keydown.escape`); itens com `role="menuitem"`.                                                                                                                 |
| `datepicker-formfield`         | Painel com `role="dialog"` `aria-modal="true"`; `Escape` fecha; navegação de mês/ano/dia via botões padrão (focáveis por Tab).                                                                                                                                             |
| `modal`                        | Usa `cdkTrapFocus` (`@angular/cdk/a11y`) com `cdkTrapFocusAutoCapture`, prendendo o foco dentro do modal enquanto aberto (2.4.3 Focus Order) e capturando o foco inicial automaticamente. Fecha com `Escape` (configurável via `closeOnEscape`) através do `ModalService`. |
| `confirmation-dialog`          | Aberto via `Dialog` do CDK (`@angular/cdk/dialog`), herdando gerenciamento de foco/trap do overlay do Angular CDK.                                                                                                                                                         |
| `photo-upload`                 | Área de drop tem `role="button"` `tabindex="0"` e responde a `Enter`/`Space` (`onKeydown`), além de clique — dropzones nunca devem depender só de drag-and-drop.                                                                                                           |
| `info-card` / `info-list-item` | Quando `clickable`, ganham `role="button"`, `tabindex="0"` e respondem a `Enter`/`Space`, além de clique de mouse.                                                                                                                                                         |

Regra para novos componentes: **qualquer padrão de interação (menu, combobox, radiogroup, dialog, tab, etc.) deve seguir o [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/)** correspondente — roles, atributos `aria-*` e teclas de atalho — replicando os exemplos acima como referência de implementação já validada no projeto.

### 4. Live regions e mensagens de status (4.1.3)

- `feedback-message` define `role` dinamicamente: `alert` (com `aria-live="assertive"`) para `error`/`warning`; `status` (com `aria-live="polite"`) para `success`/`information`. Isso garante que alertas críticos interrompem o leitor de tela imediatamente, enquanto mensagens informativas aguardam uma pausa natural.
- `paginator` expõe o texto "X-Y de Z" com `aria-live="polite"` para anunciar mudança de página sem roubar o foco.
- `info-list` usa `aria-busy` no host durante carregamento.

### 5. Conteúdo visualmente oculto mas acessível (1.3.1)

Padrão de "visually hidden" (clip-rect) usado para texto que deve existir apenas para leitores de tela, como o sufixo "obrigatório" em `card-selection__required-text`:

```scss
position: absolute;
width: 1px;
height: 1px;
padding: 0;
margin: -1px;
overflow: hidden;
clip: rect(0, 0, 0, 0);
white-space: nowrap;
border: 0;
```

Usar esta técnica (e não `display: none`/`visibility: hidden`, que removem o elemento da árvore de acessibilidade) sempre que for necessário texto "somente leitor de tela".

### 6. Diálogos e modais (2.4.3 / 4.1.2)

- `modal` e `confirmation-dialog` são abertos via Angular CDK Dialog (`ModalService`/`ConfirmationDialogService`), o que garante automaticamente: `aria-modal="true"`, gerenciamento de overlay/backdrop, e devolução de foco ao elemento que abriu o diálogo quando fechado.
- `confirmation-dialog` usa `role="alertdialog"` quando `tone === 'danger'` (ação destrutiva) e `role="dialog"` no caso padrão — distinção importante porque `alertdialog` sinaliza ao leitor de tela que é necessário atenção imediata (ex.: exclusão de conta).
- Título e descrição do modal são amarrados via `aria-labelledby`/`aria-describedby` com IDs únicos por instância (`aq-modal-title-<n>`).

### 7. Movimento e animação (2.3.3)

`card-selection` respeita `prefers-reduced-motion: reduce`, removendo a transição da seleção de card para usuários que configuraram redução de movimento no sistema operacional. **Todo componente com animação/transição decorativa deve implementar o mesmo media query.**

### 8. Contraste de cor (1.4.3 / 1.4.11)

Os tokens de cor semântica (`$aq-color-error`, `$aq-color-warning`, etc.) foram escolhidos para atender contraste mínimo de 4.5:1 contra `$aq-color-surface` (`#fff`) em texto normal. Ao introduzir uma nova cor de token, validar contraste com uma ferramenta (ex.: WebAIM Contrast Checker) antes de adicionar ao `_tokens.scss`.

## Checklist para novos componentes

Ao criar um componente novo, verificar:

- [ ] Todo elemento interativo é um `<button>`, `<a>`, ou elemento nativo equivalente (ou tem `role` + `tabindex` + handlers de teclado corretos, caso não seja possível usar o elemento nativo).
- [ ] Existe nome acessível (texto visível, `aria-label` ou `aria-labelledby`) para cada controle.
- [ ] Ícones puramente decorativos têm `aria-hidden="true"`.
- [ ] Estados de erro/obrigatório usam `aria-invalid`, `aria-required`, `aria-describedby` + `role="alert"` na mensagem.
- [ ] Foco visível usa o mixin `aq-focus-ring`.
- [ ] Padrões de interação complexos (menu, combobox, dialog, radiogroup, tablist) seguem o WAI-ARIA APG correspondente.
- [ ] Animações respeitam `prefers-reduced-motion`.
- [ ] Cor não é o único meio de transmitir informação (ex.: badge de status combina cor + texto, nunca só cor).
- [ ] Testado com navegação exclusiva por teclado (Tab/Shift+Tab/Enter/Space/Esc/setas conforme o padrão).
