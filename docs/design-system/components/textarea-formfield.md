# Textarea Formfield (`aq-textarea-formfield`)

## Visão geral

Campo de texto multilinha, irmão do `text-formfield` mas sem prefixo/sufixo/ações — voltado a descrições e comentários mais longos.

## Localização

`src/app/shared/components/formfields/textarea-formfield/` — componente. Tipos compartilhados em `formfields/formfield-error-messages.model.ts`.

## Seletor

`aq-textarea-formfield` (standalone, implementa `ControlValueAccessor`).

## API

### Inputs

| Nome                               | Tipo                                             | Padrão         | Descrição                                                              |
| ---------------------------------- | ------------------------------------------------ | -------------- | ---------------------------------------------------------------------- |
| `label`                            | `string` (obrigatório)                           | —              | Label sempre exigido (diferente do `text-formfield`, onde é opcional). |
| `placeholder`                      | `string`                                         | `''`           | Placeholder nativo.                                                    |
| `hint`                             | `string`                                         | `''`           | Texto de apoio.                                                        |
| `id` / `name` / `autocomplete`     | `string`                                         | gerado / — / — | Atributos nativos.                                                     |
| `rows`                             | `number`                                         | `4`            | Altura inicial em linhas.                                              |
| `resize`                           | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'`   | Direção de redimensionamento permitida pelo usuário.                   |
| `readonly` (alias `readonlyState`) | `boolean`                                        | `false`        | Somente leitura.                                                       |
| `required` (alias `requiredState`) | `boolean`                                        | `false`        | Obrigatório.                                                           |
| `disabled` (alias `disabledState`) | `boolean`                                        | `false`        | Desabilitado.                                                          |
| `errorMessages`                    | `FormfieldErrorMessages`                         | `{}`           | Mapa de mensagens customizadas.                                        |

Sem outputs próprios além do contrato `ControlValueAccessor`.

## Regras visuais

- Container: `min-height: 7.5rem` (7rem em ≤640px), mesma borda/raio/tema do `text-formfield`.
- Mesmos estados visuais de `text-formfield` (`focused`, `filled`, `invalid`, `disabled`, `readonly`) com a mesma paleta.
- `isFilled` considera o valor "preenchido" apenas se houver conteúdo não-whitespace (`value().trim().length > 0`) — diferente do `text-formfield`, que considera qualquer `length > 0`.

## Regras de acionamento

- Implementa `ControlValueAccessor` completo.
- Fallback de mensagens de erro embutido: `required`, `minlength`, `maxlength`, `pattern` (mesmo conjunto do `text-formfield`, exceto `email`).
- Não possui `hideErrorMessage` (sempre exibe erro quando presente, diferente do `text-formfield`).

## Acessibilidade

- Mesmo padrão de `aria-invalid`/`aria-required`/`aria-describedby`/`role="alert"` dos demais formfields.
- `<label for>` sempre renderizado (não é opcional, já que `label` é `input.required`).

## Cenários de uso

- Campo de descrição/observações em formulários de criação (ex.: notas de medição, descrição de aplicação).
- Qualquer texto livre de múltiplas linhas.

## Onde é usado

- `src/app/features/aquarium/pages/aquarium-create-page/aquarium-create-page.component.html`

## Showcase

`/components/textarea-formfield` → `src/app/features/components-showcase/pages/formfields/textarea-formfield-showcase.component.ts`
