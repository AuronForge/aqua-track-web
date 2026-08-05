# Settings Card (`aq-settings-card`)

## Visão geral

Container de card para seções de configuração (ex.: página de perfil), com cabeçalho (ícone + título + subtítulo), corpo de conteúdo livre e rodapé de ações opcional.

## Localização

`src/app/shared/components/settings-card/` — componente + `settings-card-tone.type.ts`.

## Seletor

`aq-settings-card` (standalone).

## API

### Inputs

| Nome       | Tipo                    | Padrão      | Descrição                                                                           |
| ---------- | ----------------------- | ----------- | ----------------------------------------------------------------------------------- |
| `icon`     | `string`                | `''`        | Ícone Material do cabeçalho (opcional).                                             |
| `title`    | `string` (obrigatório)  | —           | Título da seção.                                                                    |
| `subtitle` | `string`                | `''`        | Texto de apoio abaixo do título.                                                    |
| `tone`     | `'default' \| 'danger'` | `'default'` | `'danger'` sinaliza visualmente uma seção sensível/destrutiva (ex.: zona de risco). |

### Content projection (slots)

| Slot                   | Uso                                                           |
| ---------------------- | ------------------------------------------------------------- |
| (default, sem seletor) | Corpo do card — qualquer conteúdo (formulário, texto, lista). |
| `[slot=actions]`       | Rodapé de ações (ex.: botões salvar/cancelar/excluir).        |

## Regras visuais

- `tone="danger"` aplica estilo de destaque de risco (classe `settings-card--danger`) — usado para seções como exclusão de conta.
- Estrutura: `settings-card__surface` > `settings-card__header` (ícone + heading) + `settings-card__body` (conteúdo projetado) + `settings-card__actions` (slot de ações).

## Regras de acionamento

Componente puramente estrutural/apresentacional — não emite eventos nem gerencia estado próprio. Toda interatividade vem do conteúdo projetado.

## Acessibilidade

- Ícone do cabeçalho é `aria-hidden="true"`.
- Título/subtítulo são texto simples (`<p>`) — se a hierarquia de heading da página exigir, o consumidor deve avaliar se `title` deveria ser semanticamente um `<h2>`/`<h3>` (hoje não é).

## Cenários de uso

- Seção "Segurança da conta" (`account-security-card`), "Zona de perigo" (`danger-zone-card`, `tone="danger"`), "Preferências" (`preferences-card`), "Informações do perfil" (`profile-information-card`) — todas as seções da página de perfil usam este componente como container padrão.

## Onde é usado

- `src/app/features/profile/components/account-security-card/account-security-card.component.html`
- `src/app/features/profile/components/danger-zone-card/danger-zone-card.component.html`
- `src/app/features/profile/components/preferences-card/preferences-card.component.html`
- `src/app/features/profile/components/profile-information-card/profile-information-card.component.html`

## Showcase

**Não possui showcase** (ver `showcase-guidelines.md`, pendência conhecida) — apesar de já ser o container padrão de 4 seções em produção.
