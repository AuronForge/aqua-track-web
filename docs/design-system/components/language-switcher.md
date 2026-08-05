# Language Switcher (`app-language-switcher`)

## Visão geral

Seletor de idioma da aplicação (dropdown customizado), usado nas telas de autenticação e na toolbar do layout autenticado.

## Localização

`src/app/shared/components/language-switcher/` — componente. Depende de `src/app/shared/constants/language-options.constant.ts` (`LANGUAGE_OPTIONS`) e `src/app/shared/types/language-code.type.ts` (`LanguageCode`).

## Seletor

`app-language-switcher` (standalone).

## API

### Inputs

| Nome               | Tipo                         | Padrão | Descrição                                                  |
| ------------------ | ---------------------------- | ------ | ---------------------------------------------------------- |
| `label`            | `string` (obrigatório)       | —      | Texto usado como `aria-label` do trigger e título do menu. |
| `selectedLanguage` | `LanguageCode` (obrigatório) | —      | Idioma atualmente selecionado (controlado externamente).   |

### Outputs

| Nome             | Tipo           | Quando dispara                             |
| ---------------- | -------------- | ------------------------------------------ |
| `languageChange` | `LanguageCode` | Ao selecionar um idioma diferente no menu. |

## Regras visuais

- Trigger exibe um ícone de globo (`language-switcher__trigger-globe`, elemento decorativo via CSS, não ícone Material) + `triggerLabel` do idioma selecionado.
- Menu suspenso lista todos os `LANGUAGE_OPTIONS`, cada opção com `primaryLabel` (nome no idioma nativo) e `secondaryLabel` (nome traduzido/código); opção ativa exibe um check (`✓`) e destaque visual.

## Regras de acionamento

- Clique no trigger (`toggleMenu`, com `stopPropagation`) alterna `isMenuOpen`.
- Fecha automaticamente ao clicar fora do componente (`@HostListener('document:click')`).
- Selecionar um idioma emite `languageChange` e fecha o menu — **o componente não gerencia o idioma atual internamente**; cabe ao componente pai atualizar `selectedLanguage` (via `LanguageService` normalmente) em resposta ao evento.

## Acessibilidade

- Container: `aria-label` (mesmo texto do `label`).
- Trigger: `aria-expanded`, `aria-label`.
- **Ponto de atenção**: o menu não usa `role="menu"`/`role="menuitem"` nem fecha com `Escape` (diferente do `dropdown-menu`, que implementa ambos) — recomenda-se alinhar este componente ao mesmo padrão ARIA do `dropdown-menu` para consistência, incluindo suporte a `Escape`.

## Cenários de uso

- Seletor de idioma nas telas públicas de autenticação (login, cadastro, recuperação de senha).
- Seletor de idioma na toolbar do layout autenticado.

## Onde é usado

- `forgot-password`, `login`, `registration` (telas de autenticação, fora do layout autenticado).
- `src/app/shared/components/toolbar/toolbar.component.html` (dentro da toolbar do layout autenticado).

## Showcase

**Não possui showcase** (ver `showcase-guidelines.md`, pendência conhecida). Ao criar, cobrir: idioma selecionado, abertura/fechamento do menu e o evento `languageChange`.
