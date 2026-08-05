# Avatar (`app-avatar`)

## Visão geral

Exibe a identidade visual de um usuário/entidade em três formatos: iniciais, imagem circular ou ícone. Usado tipicamente em toolbars, listas de usuário e menus de perfil.

## Localização

`src/app/shared/components/avatar/` — `avatar.component.ts` / `.html` / `.scss`, `avatar-color.type.ts`, `avatar-size.type.ts`, `avatar-variant.type.ts`.

## Seletor

`app-avatar` (standalone, sem módulo).

## API

### Inputs

| Nome       | Tipo                                     | Padrão       | Descrição                                                               |
| ---------- | ---------------------------------------- | ------------ | ----------------------------------------------------------------------- |
| `variant`  | `'initials' \| 'circular' \| 'icon'`     | `'initials'` | Define o conteúdo exibido: texto (iniciais), `<img>` ou ícone Material. |
| `color`    | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'`  | Cor de fundo quando `variant` é `initials`/`icon`.                      |
| `size`     | `'small' \| 'normal' \| 'large'`         | `'normal'`   | Diâmetro do avatar: 2rem / 2.5rem / 3.5rem.                             |
| `initials` | `string`                                 | `''`         | Texto de iniciais; truncado para 3 caracteres e forçado a maiúsculas.   |
| `src`      | `string`                                 | `''`         | URL da imagem, usado quando `variant="circular"`.                       |
| `alt`      | `string`                                 | `''`         | Texto alternativo/`aria-label` do avatar.                               |
| `icon`     | `string`                                 | `''`         | Nome do ícone Material Icons, usado quando `variant="icon"`.            |

Não possui outputs nem slots de projeção de conteúdo.

## Regras visuais

- Formato sempre circular (`border-radius: 50%`), com `overflow: hidden`.
- Cor de fundo por `color`: `primary` → `$aq-color-primary`; `secondary` → `$aq-color-accent`; `tertiary` → `$aq-color-success` (todas com texto em `$aq-color-surface`). Quando `variant="circular"`, o fundo é neutro (`$aq-color-border`) pois a imagem cobre toda a área.
- Tamanho de fonte das iniciais/ícone escala junto com `size` (0.65rem/0.82rem/1.15rem para iniciais; 1.2rem/1.5rem/2.1rem para ícone).
- Imagem usa `object-fit: cover` para preencher o círculo sem distorção.

## Regras de acionamento

Componente puramente apresentacional — não possui interação própria (clique, foco, teclado). Qualquer comportamento clicável deve ser implementado pelo componente pai (ex.: `toolbar` o envolve em um `dropdown-menu` trigger).

## Acessibilidade

- Host `<div>` com `role="img"` e `aria-label` resolvido em cascata: `alt()` → `truncatedInitials()` → `'avatar'` (nunca fica sem nome acessível).
- Conteúdo interno (`span` de iniciais, `span` de ícone) é `aria-hidden="true"` para não duplicar a leitura do `aria-label` do host.
- Imagem (`variant="circular"`) usa `[alt]` próprio — se vazio, a imagem é tratada como decorativa por leitores de tela modernos, mas o `role="img"` do host garante o nome acessível de qualquer forma.

## Cenários de uso

- Avatar do usuário logado na toolbar (trigger do menu de conta).
- Cabeçalho do menu dropdown do usuário (versão `large`).
- Cards de listagem de usuários/membros (variante `initials` como fallback quando não há foto).

## Onde é usado

- `src/app/features/profile/components/profile-information-card/profile-information-card.component.html`
- `src/app/shared/components/toolbar/toolbar.component.html` (avatar do usuário + cabeçalho do menu)

## Showcase

`/components/avatar` → `src/app/features/components-showcase/pages/avatar/avatar-showcase.component.ts`
