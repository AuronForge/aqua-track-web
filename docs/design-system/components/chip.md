# Chip (`aq-chip`)

## Visão geral

Rótulo compacto similar ao badge, mas sempre em formato pílula e com um indicador de "dot" colorido à esquerda do conteúdo. Usado para categorização, filtros e marcação de status leve.

## Localização

`src/app/shared/components/chip/` — `chip.component.ts` / `.html` / `.scss`, `chip-color.type.ts`, `chip-size.type.ts`, `chip-variant.type.ts`.

## Seletor

`aq-chip` (standalone).

## API

### Inputs

| Nome       | Tipo                                                                                           | Padrão      | Descrição                                                  |
| ---------- | ---------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------- |
| `color`    | `'primary' \| 'secondary' \| 'tertiary' \| 'success' \| 'warning' \| 'error' \| 'information'` | `'primary'` | Esquema de cor semântico.                                  |
| `size`     | `'small' \| 'medium'`                                                                          | `'small'`   | Altura 1.25rem / 1.75rem.                                  |
| `variant`  | `'filled' \| 'outlined' \| 'tinted'`                                                           | `'tinted'`  | Estilo visual (padrão diferente do badge, que é `filled`). |
| `disabled` | `boolean`                                                                                      | `false`     | Aplica `aria-disabled` e opacidade reduzida.               |

### Content projection

`<ng-content>` — texto do chip, renderizado após o dot indicador (`.chip__dot`).

## Regras visuais

- `border-radius: $aq-radius-pill` (sempre pílula, diferente do badge que usa `radius-xs`).
- Dot indicador de 6px, cor muda conforme a variante: em `filled` o dot fica na cor "on-accent" (branco); em `outlined`/`tinted` o dot usa `--_accent`/`--_accent-strong`.
- Mesmo padrão "accent/accent-strong/accent-muted" do tema, com 7 cores (inclui `information`, que badge também tem, mas com paleta idêntica).
- `disabled`: opacidade 0.4, `pointer-events: none`.

## Regras de acionamento

Não interativo — sem eventos de clique próprios. Uso como filtro clicável requer wrapper externo com handler de clique.

## Acessibilidade

- `aria-disabled` refletido no host.
- Dot indicador é puramente decorativo (`aria-hidden="true"`); o significado semântico deve estar sempre no texto projetado, nunca só na cor do dot.

## Cenários de uso

- Tags de categoria/filtro em listagens.
- Indicadores de status leve em linhas de tabela ou cards, quando o badge é visualmente "pesado" demais para o contexto.

## Onde é usado

Nenhum uso direto encontrado em `features/` no momento — componente disponível no design system mas ainda não consumido fora do showcase. Ao adicionar filtros ou tags em novas telas, este é o componente indicado.

## Showcase

`/components/chip` → `src/app/features/components-showcase/pages/chip/chip-showcase.component.ts`
