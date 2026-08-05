# Code Block (`aq-code-block`)

## Visão geral

Exibe um trecho de código formatado com cabeçalho (linguagem + botão "Copiar"). Usado principalmente dentro das próprias páginas de showcase para exemplificar o uso de outros componentes, mas serve para qualquer necessidade de exibir código na aplicação.

## Localização

`src/app/shared/components/code-block/` — `code-block.component.ts` / `.html` / `.scss`.

## Seletor

`aq-code-block` (standalone).

## API

### Inputs

| Nome       | Tipo                   | Padrão   | Descrição                                                                              |
| ---------- | ---------------------- | -------- | -------------------------------------------------------------------------------------- |
| `code`     | `string` (obrigatório) | —        | Conteúdo de código a ser exibido (`input.required`).                                   |
| `language` | `string`               | `'html'` | Rótulo da linguagem exibido no cabeçalho (não afeta syntax highlighting — é só texto). |

Sem outputs.

## Regras visuais

- Tema escuro fixo, independente do tema claro da aplicação (ver "Exceções conhecidas" em `theme.md`): fundo `#0f0f1e`, cabeçalho `#16162a`, texto de código `#c8d3f5`, label de linguagem `#818cf8`.
- Fonte monoespaçada (`Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace`) para o corpo do código; `white-space: pre` preserva formatação original.
- Botão "Copiar" muda de ícone/texto (`content_copy` → `check`, "Copiar" → "Copiado") por 2 segundos após o clique.

## Regras de acionamento

- Clique no botão de copiar chama `navigator.clipboard.writeText(code())`; ao resolver a Promise, ativa o estado `copied` por 2000ms via `setTimeout` (limpo automaticamente em `DestroyRef.onDestroy` para evitar leak).
- Não há debounce — cliques repetidos apenas reiniciam o timeout de 2s.

## Acessibilidade

- O botão de copiar é um `<button type="button">` nativo, focável e acionável por teclado nativamente.
- **Ponto de atenção**: o botão não possui `aria-label` explícito além do texto visível ("Copiar"/"Copiado"), o que é suficiente, mas o `<pre><code>` não expõe nenhuma indicação sonora de que o conteúdo foi copiado além da mudança visual — recomenda-se avaliar um `aria-live="polite"` no futuro para anunciar "Copiado" a leitores de tela.

## Cenários de uso

- Documentação de uso de componentes nas páginas de showcase (`codeTs`/`codeHtml` como inputs).
- Exibição de payloads JSON, comandos ou snippets de configuração em qualquer tela.

## Onde é usado

Usado internamente por praticamente todas as páginas de `features/components-showcase/pages/*` para exibir os exemplos de código TypeScript/HTML de cada componente.

## Showcase

**Não possui showcase próprio** (ver `showcase-guidelines.md`, pendência conhecida). Recomenda-se criar `/components/code-block` documentando os inputs `code`/`language` isoladamente, apesar de o componente já ser exercitado indiretamente em toda página de showcase existente.
