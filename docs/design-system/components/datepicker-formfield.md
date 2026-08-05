# Datepicker Formfield (`aq-datepicker-formfield`)

## Visão geral

Campo de seleção de data com calendário próprio (dias/meses/anos), renderizado em overlay via Angular CDK. Não depende de bibliotecas externas de data além da API nativa `Intl`/`Date`.

## Localização

`src/app/shared/components/formfields/datepicker-formfield/` — componente único (sem models próprios; usa `FormfieldErrorMessages` compartilhado).

## Seletor

`aq-datepicker-formfield` (standalone, implementa `ControlValueAccessor`).

## API

### Inputs

| Nome                               | Tipo                     | Padrão                 | Descrição                                                                                    |
| ---------------------------------- | ------------------------ | ---------------------- | -------------------------------------------------------------------------------------------- |
| `label`                            | `string` (obrigatório)   | —                      | Label do campo.                                                                              |
| `placeholder`                      | `string`                 | `'Selecione uma data'` | Texto do trigger sem valor.                                                                  |
| `hint`                             | `string`                 | `''`                   | Texto de apoio.                                                                              |
| `id`                               | `string`                 | gerado                 | Id do trigger.                                                                               |
| `locale`                           | `string`                 | `'pt-BR'`              | Locale usado em `Intl.DateTimeFormat` para formatação de data, nomes de mês e dia da semana. |
| `required` (alias `requiredState`) | `boolean`                | `false`                | Obrigatório.                                                                                 |
| `disabled` (alias `disabledState`) | `boolean`                | `false`                | Desabilitado.                                                                                |
| `errorMessages`                    | `FormfieldErrorMessages` | `{}`                   | Mapa de mensagens (fallback embutido cobre apenas `required`).                               |

O valor de forms é uma **string ISO `YYYY-MM-DD`** (`writeValue`/`onChange` trabalham com este formato, não com `Date`).

Sem outputs próprios além do contrato `ControlValueAccessor`.

## Regras visuais

- Trigger com a mesma linguagem visual dos demais formfields (borda/raio/altura/estados), com ícone `calendar_month` à direita.
- Painel (`datepicker-formfield__panel`): `role="dialog"`, largura entre 280px e 360px (`DATEPICKER_PANEL_MIN_WIDTH`/`MAX_WIDTH`), posicionado via CDK Overlay com lógica de auto-flip (abre para cima se não houver espaço suficiente abaixo, com margem de viewport de 16px).
- Três modos de visualização internos (`ViewMode`): `days` (grade de 7 colunas com dias, incluindo dias do mês anterior/seguinte esmaecidos), `months` (grade de 12 meses), `years` (grade de 12 anos, em blocos de 12). O título central do cabeçalho (`navLabel`) é clicável e alterna entre os três modos (`days → months → years → days`).
- Dia atual (`isToday`) e dia selecionado (`isSelected`) recebem destaque visual próprio, independentes um do outro.

## Regras de acionamento

- Clique no trigger (`toggle`) abre/fecha o painel; bloqueado se `disabled`.
- `Escape` (`@HostListener('keydown.escape')`) fecha o painel quando aberto.
- `window:resize` reposiciona o overlay automaticamente enquanto aberto.
- Navegação de período: botões `‹`/`›` avançam/retrocedem um mês (`days`), um ano (`months`) ou 12 anos (`years`), conforme o `viewMode` atual.
- Selecionar um dia grava a data (convertida para ISO), fecha o painel e marca o campo como tocado. Selecionar um mês ou ano navega para o próximo nível de detalhe (`months` → volta para `days`; `years` → avança para `months`) em vez de fechar imediatamente.
- Ao clicar em um dia de outro mês (célula esmaecida), o `viewDate` também é ajustado para esse mês antes de confirmar a seleção.
- Overlay é descartado ao fechar/destruir/desabilitar, restaurando foco ao trigger quando apropriado (`disposeOverlay(restoreFocus)`).

## Acessibilidade

- Trigger: `aria-haspopup="dialog"`, `aria-expanded`, `aria-invalid`, `aria-required`, `aria-describedby`.
- Painel: `role="dialog"` `aria-modal="true"`.
- Botões de navegação de período têm `aria-label` explícito ("Periodo anterior"/"Proximo periodo").
- **Ponto de atenção**: a grade de dias/meses/anos não implementa navegação por setas do teclado (padrão ARIA "Date Picker Dialog" recomendaria `ArrowLeft/Right/Up/Down` movendo entre células) — hoje a navegação interna depende de `Tab` sequencial entre botões. Recomenda-se avaliar essa melhoria ao evoluir o componente.

## Cenários de uso

- Data de nascimento em cadastro/perfil.
- Data de recuperação de senha (token/expiração), data de criação de aquário, data de medição.

## Onde é usado

- `aquarium-create-page`, `forgot-password`, `registration`, `profile-information-card`.

## Showcase

`/components/datepicker-formfield` → `src/app/features/components-showcase/pages/formfields/datepicker-formfield-showcase.component.ts`

## Dependências internas

`OverlayModule` (`@angular/cdk/overlay`).
