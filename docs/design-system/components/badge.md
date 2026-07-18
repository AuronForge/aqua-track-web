# Badge (`aq-badge`)

## Visão geral

Rótulo compacto e não interativo para exibir tags, status, planos ou classificações. Conteúdo totalmente livre via `ng-content` (texto, ícone Material, ou combinação).

## Localização

`src/app/shared/components/badge/` — `badge.component.ts` / `.html` / `.scss`, `badge-color.type.ts`, `badge-size.type.ts`, `badge-variant.type.ts`.

## Seletor

`aq-badge` (standalone).

## API

### Inputs

| Nome       | Tipo                                                                                           | Padrão      | Descrição                                    |
| ---------- | ---------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------- |
| `variant`  | `'filled' \| 'outlined' \| 'tinted'`                                                           | `'filled'`  | Estilo visual (ver "Regras visuais").        |
| `color`    | `'primary' \| 'secondary' \| 'tertiary' \| 'success' \| 'error' \| 'warning' \| 'information'` | `'primary'` | Esquema de cor semântico.                    |
| `size`     | `'small' \| 'medium'`                                                                          | `'medium'`  | Altura 1.5rem / 2rem.                        |
| `disabled` | `boolean`                                                                                      | `false`     | Aplica `aria-disabled` e opacidade reduzida. |

### Content projection

`<ng-content>` único (sem slots nomeados) — aceita texto e/ou `<span class="material-icons">`.

## Regras visuais

- Segue o padrão de tema "accent + accent-strong + accent-muted" (ver `theme.md`).
- `filled`: fundo = `--_accent`, texto = branco.
- `outlined`: fundo transparente, borda e texto = `--_accent`.
- `tinted`: fundo = `--_accent-muted` (translúcido), texto = `--_accent-strong`.
- `border-radius: $aq-radius-xs` (6px) — diferente de chip, que usa pill.
- `disabled` (`aria-disabled="true"`): `opacity: 0.4`, `cursor: not-allowed`, `pointer-events: none`.

## Regras de acionamento

Não interativo por padrão (`cursor: default`). Não emite eventos. Se usado como indicador clicável (ex.: filtro), o comportamento de clique deve ser adicionado pelo componente pai envolvendo o badge em um elemento clicável.

## Acessibilidade

- `aria-disabled` refletido quando `disabled=true`.
- Por ser apenas rótulo textual/ícone, herda a semântica do conteúdo projetado; se usado para transmitir status, garantir que o texto (não apenas a cor) comunique o significado (ver `accessibility.md`, item "Contraste de cor").

## Cenários de uso

- Selo de status dentro de `info-card` (`statusLabel`, cor mapeada a partir de `InfoCardStatus`).
- Selo de status/badge de item dentro de `info-list-item`.
- Indicadores de plano, categoria ou contagem em cards e listas.

## Onde é usado

- Internamente por `info-card` (`src/app/shared/components/info-card/info-card.component.html`) e `info-list-item` (`src/app/shared/components/info-list-item/info-list-item.component.html`).
- Nenhum uso direto (fora do design system) encontrado em `features/` no momento — uso hoje é majoritariamente via composição dentro de outros componentes.

## Showcase

`/components/badge` → `src/app/features/components-showcase/pages/badge/badge-showcase.component.ts`
