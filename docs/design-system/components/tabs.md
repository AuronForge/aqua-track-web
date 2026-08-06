# Tabs (`aq-tabs` + `aq-tab`)

## Visão geral

Componente de navegação local para alternar entre seções relacionadas de uma mesma página. As tabs
ficam alinhadas horizontalmente, com fundo transparente, indicador inferior na opção ativa e linha
divisória abaixo do conjunto, conforme os protótipos de detalhe de aquário.

## Localização

`src/app/shared/components/tabs/` - componentes `TabsComponent`, `TabComponent` e barrel local.

## Seletores

- `aq-tabs`
- `aq-tab`

## Decisão arquitetural

Implementação própria sobre HTML nativo, sem Angular Material. O projeto não possui Angular Material
como dependência direta, e o visual exigido é simples, com semântica WAI-ARIA específica e sem
necessidade de sincronização com rotas. Usar `MatTabGroup` exigiria adicionar dependência e
sobrescrever estrutura/estilos internos sem benefício proporcional.

## API

### `aq-tabs` inputs

| Nome          | Tipo     | Padrão   | Descrição                        |
| ------------- | -------- | -------- | -------------------------------- |
| `activeTabId` | `string` | `''`     | Identificador da tab ativa.      |
| `ariaLabel`   | `string` | `Seções` | Nome acessível do grupo de tabs. |

### `aq-tabs` outputs

| Nome              | Tipo     | Quando dispara                                      |
| ----------------- | -------- | --------------------------------------------------- |
| `activeTabChange` | `string` | Quando o usuário seleciona uma tab habilitada nova. |

### `aq-tab` inputs

| Nome       | Tipo      | Padrão  | Descrição                            |
| ---------- | --------- | ------- | ------------------------------------ |
| `id`       | `string`  | -       | Identificador estável e obrigatório. |
| `label`    | `string`  | -       | Texto exibido no cabeçalho.          |
| `disabled` | `boolean` | `false` | Impede seleção e navegação por seta. |

### Slots

O conteúdo padrão de cada `aq-tab` é projetado como painel da tab correspondente. Apenas o painel
ativo é renderizado para o usuário.

## Exemplo

```html
<aq-tabs [activeTabId]="activeTabId()" (activeTabChange)="activeTabId.set($event)">
  <aq-tab id="overview" label="Visão Geral"> Conteúdo da visão geral </aq-tab>

  <aq-tab id="measurements" label="Medições"> Conteúdo das medições </aq-tab>

  <aq-tab id="applications" label="Aplicações" [disabled]="applicationsDisabled()">
    Conteúdo das aplicações
  </aq-tab>
</aq-tabs>
```

## Comportamento

- Se `activeTabId` apontar para uma tab habilitada, ela é exibida.
- Se `activeTabId` for vazio, inexistente, removido ou desabilitado, a primeira tab habilitada é
  exibida.
- Se não houver tabs, ou todas estiverem desabilitadas, nenhum painel é renderizado.
- Tabs desabilitadas não emitem seleção e são ignoradas pela navegação por teclado.
- O componente base não usa Router; tabs como navegação de rota devem ser compostas fora dele.

## Estados visuais

- Padrão: texto secundário e fundo transparente.
- Hover: texto primário e superfície suave.
- Selected: texto primário da marca, peso maior e indicador inferior.
- Focus-visible: `aq-focus-ring`.
- Disabled: contraste reduzido, cursor bloqueado e `aria-disabled`.
- Overflow: a barra de tabs permanece em uma linha e rola horizontalmente.

## Acessibilidade

- Cabeçalho com `role="tablist"` e `aria-label`.
- Cada botão usa `role="tab"`, `aria-selected`, `aria-controls`, `aria-disabled` quando aplicável e
  roving `tabindex`.
- Painel ativo usa `role="tabpanel"`, `aria-labelledby` e `tabindex="0"`.
- A ativação por teclado é automática: `ArrowRight`, `ArrowLeft`, `Home` e `End` movem foco e
  seleção. `Enter` e `Space` ativam a tab focada quando necessário.

## Quando usar

- Alternar seções locais de uma página: resumo, histórico, anexos, configurações.
- Organizar conteúdo relacionado sem navegar para outra rota.

## Quando não usar

- Para filtros de poucas opções dentro de formulário: use `aq-segmented-control`.
- Para navegação global/lateral: use `app-nav-menu`.
- Para passos sequenciais obrigatórios: use uma composição específica de fluxo.

## Boas práticas

- Use `id` estável, independente do texto traduzido.
- Mantenha labels curtos.
- Não esconda tabs em telas pequenas; deixe o overflow horizontal funcionar.
- Não coloque regras de domínio dentro do componente.

## Showcase

`/components/tabs` -> `src/app/features/components-showcase/pages/tabs/tabs-showcase.component.ts`
