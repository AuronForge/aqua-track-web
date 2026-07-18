# Dropdown Menu (`app-dropdown-menu`)

## Visão geral

Menu suspenso com trigger customizável (via slot) e lista de itens de ação. Usado, por exemplo, como menu do usuário na toolbar.

## Localização

`src/app/shared/components/dropdown-menu/` — componente + `dropdown-menu-item.model.ts`, `dropdown-menu-placement.type.ts`.

## Seletor

`app-dropdown-menu` (standalone).

## API

### Inputs

| Nome          | Tipo                                                           | Padrão           | Descrição                                                             |
| ------------- | -------------------------------------------------------------- | ---------------- | --------------------------------------------------------------------- |
| `items`       | `DropdownMenuItem[]` (obrigatório)                             | —                | `{ id, label, icon?, isDestructive?, hasDividerBefore?, disabled? }`. |
| `placement`   | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Posição do painel relativa ao trigger.                                |
| `showChevron` | `boolean`                                                      | `true`           | Exibe/oculta o ícone de seta no trigger.                              |

### Outputs

| Nome        | Tipo               | Quando dispara                                                       |
| ----------- | ------------------ | -------------------------------------------------------------------- |
| `itemClick` | `DropdownMenuItem` | Ao clicar em um item não desabilitado; fecha o menu automaticamente. |

### Slots (content projection nomeada)

| Slot               | Uso                                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| `[slot='trigger']` | Conteúdo do botão que abre o menu (ex.: avatar + nome do usuário).                                   |
| `[slot='header']`  | Conteúdo fixo no topo do painel, acima da lista de itens (ex.: cabeçalho com avatar grande + plano). |

## Regras visuais

- Painel: `min-width: 15rem`, fundo `$aq-color-surface`, borda `$aq-color-border`, `border-radius: $aq-radius-md`, sombra customizada em duas camadas.
- Animação de entrada (`dm-enter-down`/`dm-enter-up`, 200ms `cubic-bezier(0.16, 1, 0.3, 1)`) conforme o painel abre para baixo ou para cima.
- Chevron rotaciona 180° quando aberto; para `placement` "top-\*", a rotação de repouso já é invertida (aponta para cima) e some ao abrir.
- Item `isDestructive`: texto/ícone em vermelho pontual (`#e05257`), hover com fundo vermelho translúcido.
- Item `disabled`: `opacity: 0.45`, `pointer-events: none`.
- `hasDividerBefore`: renderiza um separador (`<li role="separator">`) antes do item.

## Regras de acionamento

- Trigger é um `button[aqButton]` (`variant="basic" color="tertiary"`); clique alterna `isOpen` (`toggle()`, com `stopPropagation`).
- Fecha automaticamente ao: clicar fora do componente (`@HostListener('document:click')`, checa `contains`), pressionar `Escape` (`@HostListener('keydown.escape')`), ou clicar em um item habilitado.
- Item desabilitado (`item.disabled`) ignora o clique (early return antes de emitir `itemClick`).

## Acessibilidade

- Trigger: `aria-haspopup="menu"`, `aria-expanded` refletindo `isOpen()`.
- Painel: `role="menu"`, `aria-orientation="vertical"`.
- Itens: `role="menuitem"` dentro de `<li role="none">`; lista tem `role="presentation"`.
- Divisor: `role="separator"` + `aria-hidden="true"`.
- **Ponto de atenção**: não há navegação por setas (`ArrowDown`/`ArrowUp`) entre itens do menu nem `Home`/`End`, que é o comportamento esperado pelo padrão ARIA de menu (APG "Menu Button"). Hoje a navegação depende de `Tab` sequencial. Recomenda-se implementar roving focus com setas ao evoluir este componente.

## Cenários de uso

- Menu de conta do usuário na toolbar (perfil, configurações, sair).
- Qualquer menu de ações contextuais (ex.: ações de uma linha de tabela/card).

## Onde é usado

- `src/app/shared/components/toolbar/toolbar.component.html` (menu do usuário, com slots `trigger` e `header` preenchidos por `app-avatar`).

## Showcase

`/components/dropdown-menu` → `src/app/features/components-showcase/pages/dropdown-menu/dropdown-menu-showcase.component.ts`

## Dependências internas

`ButtonComponent` (trigger).
