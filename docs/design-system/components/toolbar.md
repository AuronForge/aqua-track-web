# Toolbar (`app-toolbar`)

## Visão geral

Cabeçalho fixo do layout autenticado: marca/logo, título/subtítulo da página atual, seletor de idioma e menu do usuário (com avatar). É um componente de composição — combina `avatar`, `dropdown-menu` e `language-switcher`.

## Localização

`src/app/shared/components/toolbar/` — componente único, sem models próprios (reutiliza tipos de `avatar`, `dropdown-menu` e `language-code.type.ts`).

## Seletor

`app-toolbar` (standalone).

## API

### Inputs

| Nome                    | Tipo                               | Padrão              | Descrição                                                                               |
| ----------------------- | ---------------------------------- | ------------------- | --------------------------------------------------------------------------------------- |
| `showBrand`             | `boolean`                          | `true`              | Exibe/oculta o bloco de logo + nome "AquaTrack".                                        |
| `pageTitle`             | `string` (obrigatório)             | —                   | Título da página atual.                                                                 |
| `pageSubtitle`          | `string`                           | `''`                | Subtítulo opcional abaixo do título.                                                    |
| `userName`              | `string` (obrigatório)             | —                   | Nome do usuário logado.                                                                 |
| `userEmail`             | `string` (obrigatório)             | —                   | E-mail do usuário logado.                                                               |
| `userInitials`          | `string` (obrigatório)             | —                   | Iniciais para o avatar (fallback sem foto).                                             |
| `userAvatarUrl`         | `string \| null`                   | `null`              | URL da foto do usuário; se presente, o avatar usa `variant="circular"` automaticamente. |
| `userAvatarColor`       | `AvatarColor`                      | `'primary'`         | Cor de fundo do avatar quando sem foto.                                                 |
| `userPlan`              | `string`                           | `''`                | Nome do plano do usuário, exibido como badge no cabeçalho do menu (se não vazio).       |
| `selectedLanguage`      | `LanguageCode` (obrigatório)       | —                   | Idioma atualmente selecionado.                                                          |
| `languageSelectorLabel` | `string`                           | `'Select language'` | `aria-label` repassado ao `language-switcher`.                                          |
| `userMenuItems`         | `DropdownMenuItem[]` (obrigatório) | —                   | Itens do menu do usuário (perfil, configurações, sair).                                 |

### Outputs

| Nome                | Tipo               | Quando dispara                            |
| ------------------- | ------------------ | ----------------------------------------- |
| `languageChange`    | `LanguageCode`     | Repassado do `language-switcher` interno. |
| `userMenuItemClick` | `DropdownMenuItem` | Repassado do `dropdown-menu` interno.     |

## Regras visuais

- Três regiões: `toolbar__brand` (opcional), `toolbar__page-info` (título/subtítulo, sempre presente), `toolbar__actions` (idioma + menu de usuário).
- `userAvatarVariant()` decide automaticamente entre `circular` (se `userAvatarUrl` presente) e `initials` — o consumidor não precisa calcular isso manualmente.
- Cabeçalho do menu do usuário exibe avatar em tamanho `large`, nome e badge de plano (se `userPlan` não vazio).

## Regras de acionamento

Componente de composição puro — toda a lógica de interação (abrir menu, trocar idioma) vive nos componentes filhos (`dropdown-menu`, `language-switcher`); o `toolbar` apenas repassa os eventos (`languageChange`, `userMenuItemClick`) para o consumidor final decidir a ação (ex.: navegar para `/profile`, fazer logout, chamar `LanguageService`).

## Acessibilidade

- `<header role="banner">` — landmark de página.
- `<h1>` para `pageTitle` — atenção: como é `<h1>`, deve ser o único `<h1>` da página; se a página filha também renderizar um `<h1>` próprio, isso quebra a hierarquia de headings (WCAG 1.3.1) e deve ser revisado.
- Logo/marca tem `alt=""` na imagem (decorativa, nome já está no texto adjacente) e o container é `aria-hidden="true"`.
- Herda toda a acessibilidade de `avatar`, `dropdown-menu` e `language-switcher` internamente.

## Cenários de uso

- Cabeçalho fixo de toda tela autenticada da aplicação (montado uma vez no `authenticated-layout`, com `pageTitle`/`pageSubtitle` variando por rota).

## Onde é usado

- `src/app/layouts/authenticated-layout/authenticated-layout.component.html`

## Showcase

`/components/toolbar` → `src/app/features/components-showcase/pages/toolbar/toolbar-showcase.component.ts`

## Dependências internas

`AvatarComponent`, `DropdownMenuComponent`, `LanguageSwitcherComponent`.
