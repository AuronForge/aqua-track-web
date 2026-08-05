# Regra de Showcase — obrigatoriedade e padrão

## Regra

**Todo componente novo criado em `src/app/shared/components/` deve obrigatoriamente ganhar uma página de showcase correspondente em `src/app/features/components-showcase/`, registrada na navegação lateral e nas rotas, antes de ser considerado "pronto".** O showcase é a documentação viva do componente (exemplos renderizados + snippet de código) e é também a forma primária de QA visual do design system. Um componente sem showcase é considerado incompleto, mesmo que funcionalmente correto.

Isso vale tanto para componentes totalmente novos quanto para novas variantes/props relevantes adicionadas a um componente existente (o showcase deve ser atualizado para refletir a nova API).

## Checklist para publicar um novo showcase

1. Criar a pasta `src/app/features/components-showcase/pages/<nome-do-componente>/` com três arquivos:
   - `<nome>-showcase.component.ts`
   - `<nome>-showcase.component.html`
   - `<nome>-showcase.component.scss` (geralmente vazio ou mínimo — o layout compartilhado vive em `_showcase-page.scss`)
2. O componente TS é `standalone`, importa o componente do design system sendo documentado + `CodeBlockComponent` (para exibir os snippets de uso), e expõe como propriedades de classe as strings de exemplo de código (`codeTs`, `codeHtml`, etc.) usadas pelo `aq-code-block` no template.
3. O template HTML segue a estrutura padrão (ver "Anatomia de uma página de showcase" abaixo), reutilizando as classes utilitárias de `_showcase-page.scss` (`showcase__section`, `showcase__section-title`, `showcase__section-desc`, `showcase__group-title`, `showcase__props-table`, `showcase__row`, `showcase__card`, `showcase__usage`).
4. Registrar a rota filha em `src/app/app.routes.ts`, dentro do array `children` de `path: 'components'`, com `loadComponent` (lazy standalone) apontando para o novo componente.
5. Registrar a entrada correspondente em `sidebarItems` de `src/app/features/components-showcase/components-showcase.component.ts` (`id`, `label`, `icon` do Material Icons, `route: '/components/<rota>'`). Se o componente fizer parte de um agrupamento (como os formfields), adicionar como filho (`children`) do grupo correspondente em vez de criar um novo grupo.
6. Validar a página em `/components/<rota>` cobrindo: todas as variantes visuais, todos os tamanhos/cores relevantes, estado desabilitado, estado de erro (quando aplicável) e pelo menos um exemplo de código copiável.

## Anatomia de uma página de showcase (referência: `badge-showcase`)

```html
<section class="showcase__section">
  <h2 class="showcase__section-title">Nome do Componente</h2>
  <p class="showcase__section-desc">Descrição breve do propósito e quando usar.</p>

  <h3 class="showcase__group-title">Como usar</h3>
  <div class="showcase__usage">
    <aq-code-block language="typescript" [code]="codeTs" />
    <aq-code-block language="html" [code]="codeHtml" />
  </div>

  <h3 class="showcase__group-title">Propriedades</h3>
  <table class="showcase__props-table">
    <!-- colunas: Input | Tipo | Padrão | Descrição -->
  </table>

  <h3 class="showcase__group-title">Variantes</h3>
  <div class="showcase__row"><!-- exemplos ao vivo lado a lado --></div>
</section>
```

Seções recomendadas, na ordem: descrição → como usar (import + snippet) → tabela de propriedades (inputs/outputs) → variantes visuais → tamanhos → cores → estados (disabled/error/loading) → casos de uso reais quando relevante.

## Mapa atual: componente → showcase

| Componente (selector)               | Pasta em `shared/components`                       | Rota do showcase                   | Página de showcase                                              |
| ----------------------------------- | -------------------------------------------------- | ---------------------------------- | --------------------------------------------------------------- |
| `app-avatar`                        | `avatar/`                                          | `/components/avatar`               | `pages/avatar/avatar-showcase.component.ts`                     |
| `aq-badge`                          | `badge/`                                           | `/components/badge`                | `pages/badge/badge-showcase.component.ts`                       |
| `button[aqButton]` / `a[aqButton]`  | `button/`                                          | `/components/button`               | `pages/button/button-showcase.component.ts`                     |
| `aq-card-selection`                 | `card-selection/`                                  | `/components/card-selection`       | `pages/card-selection/card-selection-showcase.component.ts`     |
| `aq-chip`                           | `chip/`                                            | `/components/chip`                 | `pages/chip/chip-showcase.component.ts`                         |
| `app-dropdown-menu`                 | `dropdown-menu/`                                   | `/components/dropdown-menu`        | `pages/dropdown-menu/dropdown-menu-showcase.component.ts`       |
| `aq-feedback-message` (+ container) | `feedback-message/`, `feedback-message-container/` | `/components/feedback-message`     | `pages/feedback-message/feedback-message-showcase.component.ts` |
| `aq-text-formfield`                 | `formfields/text-formfield/`                       | `/components/text-formfield`       | `pages/formfields/text-formfield-showcase.component.ts`         |
| `aq-search-formfield`               | `formfields/search-formfield/`                     | `/components/search-formfield`     | `pages/formfields/search-formfield-showcase.component.ts`       |
| `aq-textarea-formfield`             | `formfields/textarea-formfield/`                   | `/components/textarea-formfield`   | `pages/formfields/textarea-formfield-showcase.component.ts`     |
| `aq-select-formfield`               | `formfields/select-formfield/`                     | `/components/select-formfield`     | `pages/formfields/select-formfield-showcase.component.ts`       |
| `aq-datepicker-formfield`           | `formfields/datepicker-formfield/`                 | `/components/datepicker-formfield` | `pages/formfields/datepicker-formfield-showcase.component.ts`   |
| `aq-info-card`                      | `info-card/`                                       | `/components/info-card`            | `pages/info-card/info-card-showcase.component.ts`               |
| `aq-info-list`                      | `info-list/`                                       | `/components/info-list`            | `pages/info-list/info-list-showcase.component.ts`               |
| `aq-info-list-item`                 | `info-list-item/`                                  | `/components/info-list-item`       | `pages/info-list-item/info-list-item-showcase.component.ts`     |
| `app-nav-menu`                      | `nav-menu/`                                        | `/components/menu`                 | `pages/nav-menu/nav-menu-showcase.component.ts`                 |
| `aq-modal`                          | `modal/`                                           | `/components/modal`                | `pages/modal/modal-showcase.component.ts`                       |
| `aq-photo-upload`                   | `photo-upload/`                                    | `/components/photo-upload`         | `pages/photo-upload/photo-upload-showcase.component.ts`         |
| `app-toolbar`                       | `toolbar/`                                         | `/components/toolbar`              | `pages/toolbar/toolbar-showcase.component.ts`                   |

### Componentes sem showcase (pendência conhecida)

Os componentes abaixo já existem em `shared/components/` mas **não têm página de showcase nem rota registrada**. Ao criar telas novas com estes componentes, ou ao pegar qualquer tarefa que os toque, deve-se priorizar a criação do showcase correspondente seguindo o checklist acima:

| Componente (selector)    | Pasta                  |
| ------------------------ | ---------------------- |
| `aq-code-block`          | `code-block/`          |
| `aq-confirmation-dialog` | `confirmation-dialog/` |
| `app-language-switcher`  | `language-switcher/`   |
| `aq-paginator`           | `paginator/`           |
| `aq-segmented-control`   | `segmented-control/`   |
| `aq-settings-card`       | `settings-card/`       |
| `aq-switch`              | `switch/`              |

`code-block` é um caso especial: ele é usado _dentro_ de outros showcases (para exibir os próprios snippets de código), então sua "prova de uso" já existe implicitamente em toda página de showcase — ainda assim, recomenda-se uma página dedicada para documentar suas próprias props (`code`, `language`) de forma explícita.
