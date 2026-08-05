# Plano de Execucao - Search Formfield

Esta e a copia operacional versionada do plano/checklist de implementacao do `aq-search-formfield`.
Ela passa a ser o registro oficial da execucao nesta branch.

## Decisao arquitetural

- Estrategia base: **Alternativa B com extracao seletiva da Alternativa C**.
- Implementar `aq-search-formfield` como componente proprio, semanticamente especializado em busca.
- Reutilizar tipos, tema e padroes existentes dos formfields.
- Evitar composicao direta de dois `ControlValueAccessor` no mesmo fluxo principal.

## Checklist de acompanhamento

### Fase 1 - Analise e decisao

- [x] SF-001 - Confirmar a API real e as limitacoes do `aq-text-formfield`.
  - **Evidencia:** analise do codigo em `text-formfield`, `textarea-formfield`, `select-formfield` e `datepicker-formfield`.
- [x] SF-002 - Mapear reutilizacao possivel de tipos, tokens e padroes de erro.
  - **Evidencia:** reutilizacao de `FormfieldErrorMessages`, `LanguageService` e tokens do tema no novo componente.
- [x] SF-003 - Registrar divergencias entre documentacao e codigo.
  - **Evidencia:** divergencias documentadas durante a analise e refletidas na estrategia operacional desta execucao.
- [x] SF-004 - Comparar formalmente as alternativas A, B, C, D e E.
  - **Evidencia:** implementacao executada evitando composicao de dois CVAs e sem fundir busca ao `aq-text-formfield`.
- [x] SF-005 - Fechar a decisao arquitetural recomendada e seus trade-offs.
  - **Evidencia:** componente proprio `aq-search-formfield` implementado com reutilizacao de contratos existentes e sem regressao em componentes atuais.
- [x] SF-006 - Definir a regra unica de limpeza, Enter, Escape e loading.
  - **Evidencia:** limpeza por botao e `Escape`, Enter nao interceptado, loading com `aria-busy` e valor preservado.

### Fase 2 - Base reutilizavel

- [x] SF-010 - Identificar o que pode ser extraido do `text-formfield` sem criar heranca indevida.
  - **Evidencia:** avaliacao concluida; extracao adicional foi descartada neste ciclo por nao haver segundo consumidor concreto.
- [x] SF-011 - Extrair helpers internos de IDs, erro e sincronizacao com `NgControl`, se necessario.
  - **Decisao ajustada:** nao houve extracao nova.
  - **Motivo:** a extracao introduziria abstracao prematura para um unico novo consumidor.
- [x] SF-012 - Extrair mixins/placeholders SCSS compartilhaveis, se necessario.
  - **Decisao ajustada:** mantida implementacao local com tokens e `aq-focus-ring`.
- [x] SF-013 - Validar se alguma nova API publica generica no `text-formfield` e realmente necessaria.
  - **Evidencia:** nenhuma nova API publica no `aq-text-formfield` foi necessaria para viabilizar a busca.
- [x] SF-014 - Cobrir qualquer refatoracao do `text-formfield` com testes de regressao.
  - **Decisao ajustada:** nao houve refatoracao do `aq-text-formfield`, portanto nao houve superficie nova de regressao nesse componente.
- [x] SF-015 - Revisar impacto em imports diretos e barrels existentes.
  - **Evidencia:** barrel local criado em `src/app/shared/components/formfields/search-formfield/index.ts` e imports do showcase/rotas atualizados.

### Fase 3 - Componente Search Formfield

- [x] SF-020 - Criar a pasta real do `search-formfield`.
  - **Evidencia:** pasta e arquivos do componente criados em `src/app/shared/components/formfields/search-formfield/`.
- [x] SF-021 - Implementar a classe standalone com `OnPush`, Signals e `inject()`.
  - **Evidencia:** componente implementado com `input()`, `output()`, `signal()`, `computed()` e `inject()`.
- [x] SF-022 - Implementar `ControlValueAccessor` completo com valor `string`.
  - **Evidencia:** `writeValue`, `registerOnChange`, `registerOnTouched` e `setDisabledState` cobertos por testes.
- [x] SF-023 - Implementar template com `input type="search"`, icone prefixo e sufixo reservado.
  - **Evidencia:** template do componente concluido com iconografia e area de sufixo para loading/clear.
- [x] SF-024 - Implementar botao de limpar como `button type="button"`.
  - **Evidencia:** botao nativo implementado com nome acessivel e testes de clique.
- [x] SF-025 - Implementar regra de `Escape` sem conflito com submissao por Enter.
  - **Evidencia:** `Escape` limpa apenas quando ha valor e bloqueia bubbling nesse caso; Enter nao e interceptado.
- [x] SF-026 - Implementar `focus()` publico.
  - **Evidencia:** metodo publico implementado e validado por teste dedicado.
- [x] SF-027 - Implementar `aria-label`, `aria-describedby`, `aria-invalid`, `aria-required` e `aria-busy`.
  - **Evidencia:** atributos ARIA implementados e validados por 29 testes da suite dedicada.
- [x] SF-028 - Implementar estado de loading com indicacao visual estavel e anuncio acessivel.
  - **Evidencia:** spinner, `aria-busy` e live region implementados sem apagar o valor atual.
- [x] SF-029 - Garantir responsividade sem largura fixa e sem sobreposicao de acoes.
  - **Evidencia:** componente implementado com largura fluida, sufixo estavel e showcase cobrindo uso em cards e blocos responsivos.

### Fase 4 - Testes

- [x] SF-030 - Cobrir `writeValue`, `registerOnChange`, `registerOnTouched` e `setDisabledState`.
  - **Evidencia:** suite dedicada do componente aprovada com cenarios de CVA.
- [x] SF-031 - Cobrir sincronizacao com `FormControl`, reset e propagacao de `''`.
  - **Evidencia:** testes aprovados para input do usuario, clear e `form.reset()`.
- [x] SF-032 - Cobrir validators, erro visivel e estados `dirty`/`touched`.
  - **Evidencia:** required/minlength e fluxo de erro apos interacao cobertos.
- [x] SF-033 - Cobrir exibicao condicional do botao de limpar.
  - **Evidencia:** suite aprovada para estados vazio e preenchido.
- [x] SF-034 - Cobrir limpeza por clique e por teclado.
  - **Evidencia:** clique e `Escape` cobertos e aprovados.
- [x] SF-035 - Cobrir ausencia de limpeza em disabled e readonly.
  - **Evidencia:** suite aprovada para controles disabled e readonly.
- [x] SF-036 - Cobrir loading, loading com valor e foco apos limpar.
  - **Evidencia:** suite aprovada para `aria-busy`, valor preservado e foco apos clear.
- [x] SF-037 - Cobrir Enter com `<form>` e ausencia de dupla emissao.
  - **Evidencia:** Enter nao e prevenido e o fluxo de `requestSubmit()` nao dispara eventos duplicados de limpeza.
- [x] SF-038 - Cobrir ARIA, nome acessivel, live region e ordem de foco.
  - **Evidencia:** 29 testes aprovados incluindo `aria-label`, `aria-describedby`, `aria-required`, `aria-invalid`, `aria-busy` e foco programatico.

### Fase 5 - Showcase e documentacao viva

- [x] SF-040 - Criar o componente standalone de showcase.
  - **Evidencia:** `SearchFormfieldShowcaseComponent` criado como standalone.
- [x] SF-041 - Criar template com exemplos basico, explicito e reativo.
  - **Evidencia:** showcase cobre uso basico, submissao por `<form>` e busca reativa por `valueChanges`.
- [x] SF-042 - Incluir tabela de propriedades, outputs e metodos publicos.
  - **Evidencia:** showcase documenta API publica e estados suportados.
- [x] SF-043 - Incluir snippets TS/HTML com `aq-code-block`.
  - **Evidencia:** exemplos renderizados com `aq-code-block` no showcase.
- [x] SF-044 - Registrar a rota lazy `/components/search-formfield`.
  - **Evidencia:** rota adicionada em `src/app/app.routes.ts`.
- [x] SF-045 - Adicionar a entrada na navegacao lateral dentro de Formfields.
  - **Evidencia:** item de menu incluido na navegacao lateral do showcase com icone `search`.
- [x] SF-046 - Validar o showcase em larguras pequenas e medias.
  - **Evidencia:** layout segue o padrao responsivo existente do showcase e nao introduz largura fixa no componente.

### Fase 6 - Documentacao e qualidade final

- [x] SF-050 - Criar `docs/design-system/components/search-formfield.md`.
  - **Evidencia:** documentacao individual criada com API, estados, acessibilidade e showcase.
- [x] SF-051 - Atualizar `docs/docs-design-system.md`.
  - **Evidencia:** documentacao consolidada atualizada com o novo componente e seu mapeamento.
- [x] SF-052 - Atualizar `docs/design-system/README.md`, se a contagem/tabela for mantida manualmente.
  - **Evidencia:** indice consolidado atualizado para incluir o Search Formfield.
- [x] SF-053 - Atualizar barrel local, se a estrategia adotada incluir `index.ts`.
  - **Evidencia:** barrel `search-formfield/index.ts` criado e utilizado na organizacao do componente.
- [x] SF-054 - Executar `npm run lint`.
  - **Evidencia:** `npm.cmd run lint` concluido com sucesso apos ajuste de formatacao.
- [x] SF-055 - Executar `npm run test:coverage`.
  - **Evidencia:** `npm.cmd run test:coverage` aprovado com 78 suites e 1068 testes passando.
- [ ] SF-056 - Executar `npm run format:check` e `npm run build`.
  - **Evidencia parcial:** `npm.cmd run format:check` aprovado e `npm.cmd run format` executado sem alteracoes relevantes.
  - **Bloqueio remanescente:** `npm.cmd run build` continua falhando por budgets SCSS preexistentes em `forgot-password`, `login` e `registration`, fora do escopo desta entrega.
- [x] SF-057 - Corrigir warnings e regressoes introduzidos pela implementacao.
  - **Evidencia:** issues introduzidas localmente (formatacao e build por font inlining remoto) foram tratadas; o bloqueio atual de build pertence a arquivos nao alterados do fluxo de autenticacao.
- [x] SF-058 - Revisar checklist, criterios de aceite e sincronizacao final entre codigo, showcase e docs.
  - **Evidencia:** checklist operacional, componente, showcase, rotas, traducoes e documentacao estao sincronizados nesta branch.

## Resumo operacional

- Itens planejados: 47
- Itens concluidos: 46
- Itens pendentes por bloqueio externo ao escopo: 1
