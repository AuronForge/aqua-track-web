# Button (`button[aqButton]`, `a[aqButton]`)

## Visão geral

Diretiva-componente aplicada diretamente a um elemento `<button>` ou `<a>` nativo (attribute selector), em vez de um wrapper de componente. Isso preserva toda a semântica e comportamento nativo do elemento (tipo de botão, navegação de link, foco, etc.) enquanto aplica a aparência do design system.

## Localização

`src/app/shared/components/button/` — `button.component.ts` / `.html` / `.scss`, `button-color.type.ts`, `button-size.type.ts`, `button-variant.type.ts`.

## Seletor

`button[aqButton], a[aqButton]` — usar como atributo: `<button aqButton>...</button>` ou `<a aqButton routerLink="...">...</a>`.

## API

### Inputs

| Nome      | Tipo                                                                          | Padrão      | Descrição                             |
| --------- | ----------------------------------------------------------------------------- | ----------- | ------------------------------------- |
| `variant` | `'basic' \| 'stroked' \| 'flat' \| 'icon'`                                    | `'flat'`    | Estilo visual (ver "Regras visuais"). |
| `color`   | `'primary' \| 'secondary' \| 'tertiary' \| 'success' \| 'error' \| 'warning'` | `'primary'` | Esquema de cor semântico.             |
| `size`    | `'small' \| 'medium' \| 'large'`                                              | `'medium'`  | Altura 2rem / 2.5rem / 3rem.          |

Todos os demais atributos (`disabled`, `type`, `routerLink`, etc.) são os nativos do elemento host — o componente não os reimplementa.

### Content projection

`<ng-content>` livre. Suporta SVG inline e `<span class="material-icons">` como filhos — ambos recebem estilo automático via `::ng-deep` (tamanho `1.25em`, `flex-shrink: 0`).

## Regras visuais

- `border-radius: $aq-radius-pill` (formato pílula) em todas as variantes exceto `icon` (circular, `border-radius: 50%`).
- Segue o padrão "accent + accent-hover + accent-muted" por cor.
- `flat`: fundo sólido `--_accent`, texto branco; hover escurece para `--_accent-hover`; active aplica `transform: scale(0.97)`.
- `stroked`: borda `--_accent`, fundo transparente; hover preenche com `--_accent-muted`.
- `basic`: sem borda, fundo transparente, padding horizontal reduzido; hover preenche com `--_accent-muted`.
- `icon`: circular, sem padding, `aspect-ratio: 1`, largura fixa por tamanho (2rem/2.5rem/3rem); active aplica `scale(0.9)`.
- Transições suaves (150ms) em background/border/color/shadow; feedback tátil via `transform: scale()` no `:active`.

## Regras de acionamento

- Estado `:disabled` (nativo) ou `[aria-disabled="true"]`: opacidade 0.4, `cursor: not-allowed`, `pointer-events: none` — bloqueia clique e foco por mouse, mas o elemento continua no DOM (não usar `hidden`).
- `:focus-visible` aplica `aq-focus-ring` (anel de foco do tema).
- Como é aplicado a `<button>`/`<a>` nativos, herda toda a semântica de clique/Enter/Space (button) ou navegação (link) sem código adicional.

## Acessibilidade

- Por ser um attribute selector sobre elemento nativo, o nome acessível vem do próprio conteúdo do botão (texto ou `aria-label` explícito no elemento host) — sempre garantir texto visível ou `aria-label` quando o conteúdo for só ícone (variante `icon`).
- Foco e ativação por teclado são nativos do `<button>`/`<a>`, sem necessidade de listeners customizados.

## Cenários de uso

- Ação primária de formulário (`flat` + `primary`).
- Ação secundária/cancelar (`stroked` + `tertiary`).
- Botão de ícone isolado (fechar modal, alternar visibilidade de senha) com `variant="icon"`.
- Botão destrutivo (`color="error"`) em fluxos de exclusão/cancelamento.
- Trigger de dropdown-menu (`variant="basic"` + `color="tertiary"`).

## Onde é usado

Amplamente usado em toda a aplicação — presente em `application-create-page`, `aquarium-create-page`, `home-page`, `measurement-create-page`, `account-security-card`, `change-password-modal`, `danger-zone-card`, `preferences-card`, `profile-information-card`, `delete-account-request-modal`, além de uso interno em `confirmation-dialog`, `modal` e `dropdown-menu`.

## Showcase

`/components/button` → `src/app/features/components-showcase/pages/button/button-showcase.component.ts`
