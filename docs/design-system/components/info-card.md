# Info Card (`aq-info-card`)

## Visão geral

Card de resumo/status para exibir uma entidade (ex.: um aquário) com ícone, badge de status, título, subtítulo, métrica de destaque no título, métricas no rodapé e conteúdo livre projetado no meio.

## Localização

`src/app/shared/components/info-card/` — componente + `info-card-metric.model.ts`, `info-card-status.type.ts`.

## Seletor

`aq-info-card` (standalone).

## API

### Inputs

| Nome                              | Tipo                                                 | Padrão                      | Descrição                                                                                                             |
| --------------------------------- | ---------------------------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `icon`                            | `string`                                             | `''`                        | Ícone Material exibido no canto superior.                                                                             |
| `iconFamily`                      | `string`                                             | `'material-icons-outlined'` | Família do ícone.                                                                                                     |
| `status`                          | `'stable' \| 'attention' \| 'critical' \| 'unknown'` | `'stable'`                  | Status semântico — só afeta cor de borda/acento (ver "Regras visuais"); precisa de `statusLabel` para exibir o badge. |
| `statusLabel`                     | `string`                                             | `''`                        | Texto do badge de status; se vazio, o badge não é renderizado.                                                        |
| `title`                           | `string` (obrigatório)                               | —                           | Título principal do card.                                                                                             |
| `subtitleLabel` / `subtitleValue` | `string`                                             | `''`                        | Par label/valor exibido abaixo do título (ex.: "Última medição" / "há 2 dias"), separados por `•`.                    |
| `metrics`                         | `InfoCardMetric[]`                                   | `[]`                        | Lista de métricas no rodapé (`{ label, value, icon?, iconClass? }`), separadas por um `<hr>`.                         |
| `titleMetric`                     | `InfoCardMetric \| null`                             | `null`                      | Métrica de destaque ao lado do título (ex.: variação percentual).                                                     |
| `clickable`                       | `boolean`                                            | `false`                     | Torna o card inteiro clicável/focável.                                                                                |
| `fillContainer`                   | `boolean`                                            | `false`                     | Faz o card ocupar 100% do container pai.                                                                              |
| `selected`                        | `boolean`                                            | `false`                     | Estado visual de selecionado.                                                                                         |
| `alignTop`                        | `boolean`                                            | `false`                     | Alinha o conteúdo ao topo em vez de centralizar.                                                                      |

### Outputs

| Nome        | Tipo   | Quando dispara                                          |
| ----------- | ------ | ------------------------------------------------------- |
| `cardClick` | `void` | Ao clicar (ou `Enter`/`Space`) quando `clickable=true`. |

### Content projection

`<ng-content>` livre, renderizado entre o cabeçalho (ícone/badge/título/subtítulo) e o rodapé de métricas — usado para gráficos, listas ou qualquer conteúdo adicional do card.

## Regras visuais

- `status` mapeia para cor de badge via `statusBadgeColor`: `stable`→`success`, `attention`→`warning`, `critical`→`error`, `unknown`→`secondary`.
- `clickable`: cursor pointer + leve elevação/realce ao passar o mouse (classe `info-card--interactive`).
- `selected`: destaque de borda/fundo (classe `info-card--selected`).
- `fillContainer`: `height: 100%`/`width: 100%` (classe `info-card--fill`), útil em grids de cards de mesma altura.
- Estrutura interna: `info-card__surface` > (`info-card__top` com header + body) + `<ng-content>` + `info-card__footer` (métricas, condicional).

## Regras de acionamento

- Quando `clickable=true`, o host ganha `role="button"`, `tabindex="0"` e responde a clique de mouse e `Enter`/`Space` (`preventDefault` + emite `cardClick`).
- Quando `clickable=false`, não há `role`/`tabindex` — o card é puramente informativo e não deve capturar foco.

## Acessibilidade

- Ícone do cabeçalho é `aria-hidden="true"` (decorativo — o significado está no `title`/`statusLabel`).
- Divisor entre corpo e métricas (`<hr>`) é `aria-hidden="true"`.
- Badge de status usa `aq-badge` (`variant="outlined" size="small"`), herdando a semântica de texto+cor (nunca só cor) do badge.

## Cenários de uso

- Card de resumo de aquário na home (com métricas de temperatura, pH, etc. no rodapé).
- Qualquer entidade que precise de um resumo visual com status e métricas associadas.

## Onde é usado

- `src/app/features/home/pages/home-page/home-page.component.html`

## Showcase

`/components/info-card` → `src/app/features/components-showcase/pages/info-card/info-card-showcase.component.ts`

## Dependências internas

`BadgeComponent`.
