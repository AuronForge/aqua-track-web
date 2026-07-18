# Nav Menu (`app-nav-menu`)

## Visão geral

Menu de navegação lateral (sidebar) colapsável, com suporte a grupos expansíveis (dois níveis), controle de visibilidade por papel de usuário (`roles`) e por plano (`allowedPlans`). Usado como navegação principal do layout autenticado e como navegação lateral da área de showcase de componentes.

## Localização

`src/app/shared/components/nav-menu/` — componente + `nav-menu-item.model.ts`.

## Seletor

`app-nav-menu` (standalone).

## API

### Inputs

| Nome                            | Tipo                          | Padrão                    | Descrição                                                                                                 |
| ------------------------------- | ----------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------- |
| `items`                         | `NavMenuItem[]` (obrigatório) | —                         | Árvore de itens (`{ id, label, icon, route?, exact?, roles?, allowedPlans?, displayRoute?, children? }`). |
| `userRoles`                     | `string[]`                    | `[]`                      | Papéis do usuário atual, usados para filtrar itens com `roles` definido.                                  |
| `userPlan`                      | `string \| null \| undefined` | `null`                    | Plano do usuário atual, usado para filtrar itens com `allowedPlans` definido.                             |
| `collapseLabel` / `expandLabel` | `string`                      | `'Collapse'` / `'Expand'` | Textos/aria-labels do botão de colapsar (devem ser passados traduzidos pelo consumidor).                  |
| `homeAriaLabel`                 | `string`                      | `'Go to home page'`       | `aria-label` do link de marca/logo.                                                                       |

Sem outputs — navegação é feita via `routerLink` nativo, não por eventos emitidos.

## Regras de filtragem de itens (`NavMenuItem`)

- `displayRoute: false` remove o item completamente (nem ele nem seus filhos aparecem).
- `roles`: se definido e não vazio, o item só aparece se ao menos um papel do usuário estiver na lista.
- `allowedPlans`: se definido e não vazio, o item só aparece se `userPlan` estiver na lista.
- Itens com filhos: um item pai só aparece se tiver **ao menos um filho visível** após aplicar os filtros recursivamente (ou se ele próprio tiver uma `route` válida, no caso de não ter filhos).
- Essa resolução (`toVisibleItem`) é recursiva e recalculada via `computed` a cada mudança de `items`/`userRoles`/`userPlan`.

## Regras visuais

- Estado colapsado (`collapsed`, toggle interno via botão no rodapé): esconde labels de texto, mantém apenas ícones; usa `title` (tooltip nativo) como fallback de identificação quando colapsado.
- Grupos com filhos (`nav-menu__group-trigger`) exibem uma seta que gira ao expandir/colapsar (`nav-menu__group-trigger--expanded`).
- Item ativo (rota atual) é destacado via `routerLinkActive` (`nav-menu__link--active`/`nav-menu__sublink--active`), com `routerLinkActiveOptions: { exact: item.exact ?? false }` configurável por item.

## Regras de acionamento

- Clique no botão de rodapé (`toggleCollapse`) alterna o estado colapsado/expandido de todo o menu.
- Clique no cabeçalho de um grupo com filhos (`toggleGroup`) expande/colapsa aquele grupo especificamente — **não tem efeito se o menu estiver colapsado** (grupos ficam sempre fechados visualmente nesse estado).
- Estado de expansão de cada grupo é individual (`expandedGroups: Record<string, boolean>`), com padrão **expandido** (`?? true`) até o usuário colapsar manualmente.

## Acessibilidade

- Link de marca/logo: `aria-label` (`homeAriaLabel`).
- Botão de colapsar: `aria-label` dinâmico (`collapsed() ? expandLabel() : collapseLabel()`).
- Trigger de grupo: `aria-expanded` (só aplicado quando o menu não está colapsado — `collapsed() ? null : isGroupExpanded(item)`).
- **Ponto de atenção**: o menu não usa `<nav>` com `role="navigation"` explícito além do elemento `<nav>` nativo (que já tem essa semântica implícita) — ok por padrão HTML5, mas se houver mais de uma navegação na página, considerar `aria-label` no próprio `<nav>` para diferenciá-las.

## Cenários de uso

- Navegação principal do layout autenticado (`authenticated-layout`).
- Navegação lateral da área de showcase de componentes (`components-showcase`), sem uso de `roles`/`allowedPlans`.

## Onde é usado

- `src/app/layouts/authenticated-layout/authenticated-layout.component.html`
- `src/app/features/components-showcase/components-showcase.component.html` (via `sidebarItems`, ver `showcase-guidelines.md`)

## Showcase

`/components/menu` → `src/app/features/components-showcase/pages/nav-menu/nav-menu-showcase.component.ts`
