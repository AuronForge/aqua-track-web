# Toolbar (`app-toolbar`)

## Visão geral

Cabeçalho fixo do layout autenticado: marca/logo, título/subtítulo da página atual, área central opcional para ações contextuais, seletor de idioma e menu do usuário (com avatar). É um componente de composição, combinando `avatar`, `dropdown-menu` e `language-switcher`.

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
| `centerContentTemplate` | `TemplateRef<unknown> \| null`     | `null`              | Template opcional renderizado na área central, útil para integração com layouts/rotas.  |

### Outputs

| Nome                | Tipo               | Quando dispara                            |
| ------------------- | ------------------ | ----------------------------------------- |
| `languageChange`    | `LanguageCode`     | Repassado do `language-switcher` interno. |
| `userMenuItemClick` | `DropdownMenuItem` | Repassado do `dropdown-menu` interno.     |

### Content projection

| Slot              | Uso                                                                 |
| ----------------- | ------------------------------------------------------------------- |
| `[slot='center']` | Injeta conteúdo opcional entre o bloco de título e as ações finais. |

Se `centerContentTemplate` for informado, ele tem precedência sobre o slot projetado.

## Regras visuais

- Quatro regiões: `toolbar__brand` (opcional), `toolbar__page-info` (título/subtítulo), `toolbar__center-content` (conteúdo contextual opcional) e `toolbar__actions` (idioma + menu de usuário).
- `userAvatarVariant()` decide automaticamente entre `circular` (se `userAvatarUrl` presente) e `initials`.
- Cabeçalho do menu do usuário exibe avatar em tamanho `large`, nome e badge de plano (se `userPlan` não vazio).
- Em telas menores, a toolbar pode quebrar em múltiplas linhas para acomodar o conteúdo central.

## Regras de acionamento

Componente de composição puro. Toda a lógica de interação (abrir menu, trocar idioma, aplicar filtro, clicar em ação contextual) vive no conteúdo projetado ou nos componentes filhos (`dropdown-menu`, `language-switcher`); o `toolbar` apenas organiza a estrutura e repassa `languageChange` e `userMenuItemClick`.

## Acessibilidade

- `<header role="banner">` — landmark de página.
- `<h1>` para `pageTitle`; deve permanecer como o heading principal da página.
- Logo/marca tem `alt=""` na imagem e `aria-hidden="true"` no container visual.
- Herda a acessibilidade dos componentes internos e do conteúdo projetado na área central.

## Cenários de uso

- Cabeçalho fixo de toda tela autenticada da aplicação.
- Páginas que precisam mostrar filtros, tabs, chips, busca rápida ou CTAs adicionais no topo.
- Layouts roteados que preenchem a área central via `TemplateRef` compartilhado.

## Onde é usado

- `src/app/layouts/authenticated-layout/authenticated-layout.component.html`
- `src/app/features/components-showcase/pages/toolbar/toolbar-showcase.component.html`

## Showcase

`/components/toolbar` → `src/app/features/components-showcase/pages/toolbar/toolbar-showcase.component.ts`

## Dependências internas

`AvatarComponent`, `DropdownMenuComponent`, `LanguageSwitcherComponent`.
