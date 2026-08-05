# Text Formfield (`aq-text-formfield`)

## Visão geral

Campo de texto de propósito geral (texto, senha, e-mail, busca, telefone, URL), com suporte a prefixo/sufixo (texto, ícone, botões de ação) e integração completa com Reactive Forms.

## Localização

`src/app/shared/components/formfields/text-formfield/` — componente. Tipos compartilhados em `src/app/shared/components/formfields/`: `formfield-action.model.ts`, `formfield-error-messages.model.ts`, `formfield-icon-position.type.ts`, `formfield-input-type.type.ts`.

## Seletor

`aq-text-formfield` (standalone, implementa `ControlValueAccessor`).

## API

### Inputs

| Nome                                    | Tipo                                                            | Padrão                      | Descrição                                                                                                                       |
| --------------------------------------- | --------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `label`                                 | `string`                                                        | `''`                        | Label visível (opcional — se vazio, não renderiza `<label>`).                                                                   |
| `placeholder`                           | `string`                                                        | `''`                        | Placeholder nativo.                                                                                                             |
| `hint`                                  | `string`                                                        | `''`                        | Texto de apoio abaixo do campo.                                                                                                 |
| `type`                                  | `'text' \| 'password' \| 'email' \| 'search' \| 'tel' \| 'url'` | `'text'`                    | Tipo nativo do `<input>`.                                                                                                       |
| `id` / `name` / `autocomplete`          | `string`                                                        | gerado / — / —              | Atributos nativos repassados.                                                                                                   |
| `readonly` (alias `readonlyState`)      | `boolean`                                                       | `false`                     | Somente leitura.                                                                                                                |
| `required` (alias `requiredState`)      | `boolean`                                                       | `false`                     | Obrigatório.                                                                                                                    |
| `disabled` (alias `disabledState`)      | `boolean`                                                       | `false`                     | Desabilitado.                                                                                                                   |
| `prefixText` / `suffixText`             | `string`                                                        | —                           | Texto fixo antes/depois do input (ex.: unidade de medida).                                                                      |
| `prefixIcon` / `suffixIcon`             | `string`                                                        | —                           | Ícone Material antes/depois.                                                                                                    |
| `prefixIconFamily` / `suffixIconFamily` | `string`                                                        | `'material-icons-outlined'` | Família do ícone.                                                                                                               |
| `passwordToggle`                        | `boolean`                                                       | `false`                     | Exibe botão de mostrar/ocultar senha (só tem efeito com `type="password"`).                                                     |
| `hideErrorMessage`                      | `boolean`                                                       | `false`                     | Suprime a renderização da mensagem de erro (útil quando o erro é exibido em outro lugar, ex.: dentro de `confirmation-dialog`). |
| `errorMessages`                         | `FormfieldErrorMessages`                                        | `{}`                        | Mapa `validatorKey → mensagem` customizada.                                                                                     |
| `actions`                               | `FormfieldAction[]`                                             | `[]`                        | Botões de ação extras dentro do campo (`{ id, icon, ariaLabel, position?, iconFamily?, disabled?, hidden? }`).                  |

### Outputs

| Nome          | Tipo              | Quando dispara                              |
| ------------- | ----------------- | ------------------------------------------- |
| `actionClick` | `FormfieldAction` | Ao clicar em uma action (não desabilitada). |

### Métodos públicos

| Método    | Descrição                                                       |
| --------- | --------------------------------------------------------------- |
| `focus()` | Foca programaticamente o input interno (no-op se desabilitado). |

## Regras visuais

- Container (`text-formfield__control`): borda `1.5px solid $aq-color-border`, `border-radius: $aq-radius-md`, altura mínima 3rem (2.875rem em ≤640px).
- Estado `focused`: aplica `aq-focus-ring` no container inteiro.
- Estado `filled` (valor não vazio): borda muda para `$aq-color-border-strong`.
- Estado `invalid`: borda `$aq-color-error` + `box-shadow: 0 0 0 4px rgb(217 48 37 / 10%)`.
- Estado `disabled`: fundo `$aq-color-surface-muted`, `opacity: 0.72`.
- Estado `readonly`: fundo sutil (`rgb(223 231 239 / 24%)`).
- Autofill do navegador é neutralizado visualmente (cor de texto/caret e fundo forçados via `-webkit-autofill` overrides) para não quebrar o tema.
- Contexto especial: dentro de `.login-card`, o label ganha peso 700 e tamanho maior (0.98rem) — override pontual via `:host-context`.

## Regras de acionamento

- Implementa `ControlValueAccessor` — funciona com `formControlName`/`[formControl]`/`ngModel`.
- `type="password"` + `passwordToggle=true`: adiciona botão de olho que alterna entre `password`/`text`, com `aria-label` dinâmico ("Mostrar senha"/"Ocultar senha").
- Mensagem de erro exibida apenas quando `control.invalid && (control.touched || control.dirty)` — nunca antes do usuário interagir.
- Mapa de erro com fallback embutido em português: `required`, `email`, `minlength`, `maxlength`, `pattern`; `errorMessages` do input tem prioridade sobre o fallback.
- `actions` (botões extra) são posicionadas via `position: 'prefix' | 'suffix'` (padrão `'suffix'`) e podem ser ocultadas individualmente (`hidden`) ou desabilitadas (`disabled`) sem removê-las do array.

## Acessibilidade

- `aria-invalid`, `aria-required`, `aria-describedby` (hint ou erro) no `<input>`.
- `<label for>` associado ao `id` do input (gerado automaticamente se não informado).
- Ícones decorativos e ícones de prefixo/sufixo são `aria-hidden="true"`; botões de ação exigem `ariaLabel` obrigatório no modelo `FormfieldAction`.
- Mensagem de erro em `role="alert"`.

## Cenários de uso

- Campos de e-mail/senha em login, cadastro e recuperação de senha.
- Campo de confirmação por palavra em `confirmation-dialog`.
- Qualquer campo de texto simples em formulários de criação/edição (aquário, medição, aplicação).

## Onde é usado

`aquarium-create-page`, `forgot-password`, `login`, `registration`, `change-password-modal`, `profile-information-card`, além do uso interno em `confirmation-dialog`.

## Showcase

`/components/text-formfield` → `src/app/features/components-showcase/pages/formfields/text-formfield-showcase.component.ts`
