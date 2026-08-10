# Aquarium Detail Execution Plan

## Checklist

- [x] analise da arquitetura do projeto;
- [x] analise da documentacao do Design System;
- [x] inventario dos componentes reutilizaveis;
- [x] identificacao de componentes ausentes;
- [x] validacao do usuario para novos componentes, quando necessaria;
- [x] configuracao da rota `aquarium/:uuid`;
- [x] carregamento e estados da pagina;
- [x] cabecalho do aquario;
- [x] imagem de destaque;
- [x] navegacao por tabs;
- [x] aba Visao Geral;
- [x] cards de resumo;
- [x] parametros recentes;
- [x] aba Medicoes;
- [x] filtros;
- [x] tabela de medicoes;
- [x] modal Adicionar Medicao;
- [x] validacoes do formulario;
- [x] atualizacao dos dados apos cadastro;
- [x] aba Aplicacoes;
- [x] tabela de aplicacoes;
- [x] estados vazios;
- [x] responsividade;
- [x] acessibilidade;
- [x] testes;
- [x] lint;
- [x] formatacao;
- [x] cobertura;
- [x] build;
- [x] revisao visual final.

## Analise Inicial

- Projeto Angular 21 com componentes standalone, Signals, RxJS, Reactive Forms e `ChangeDetectionStrategy.OnPush`.
- Shell autenticado existente em `AuthenticatedLayoutComponent`; a tela deve ocupar apenas a area de conteudo.
- Feature `aquarium` ja possui listagem, criacao, DTOs, mappers, validators, constantes de parametros e servicos para listagem/criacao/upload de foto.
- Rotas atuais: `/aquariums` e `/aquariums/new`; ha utilitario apontando detalhes para `/aquariums/:id`, mas a rota de detalhe ainda nao existe.
- Servico atual de aquarios possui `listAquariums`, `createAquarium` e `uploadAquariumPhoto`; nao ha contrato local para detalhe, historico de medicoes ou historico de aplicacoes.
- Home possui DTOs e mocks de dashboard com parametros, medicoes recentes e aplicacoes recentes, mas nao ha contrato especifico para detalhe do aquario.
- Fluxos `/measurements/new` e `/applications/new` existem apenas como paginas "coming soon".

## Componentes Reutilizaveis Identificados

- `button[aqButton]` para acoes primarias, secundarias, links e icones.
- `aq-badge` para status do aquario e das medicoes.
- `aq-modal` via `ModalService` para o modal de nova medicao.
- `aq-select-formfield` para parametro e filtros por parametro.
- `aq-datepicker-formfield` para data.
- `aq-text-formfield` para valor e hora, com validadores no formulario.
- `aq-textarea-formfield` para observacoes.
- `aq-search-formfield` caso a busca textual seja necessaria em filtros.
- `aq-paginator` caso haja paginacao.
- `aq-info-card` pode apoiar cards de resumo, quando sua estrutura encaixar sem distorcer o prototipo.
- `aq-feedback-message` e padroes existentes para feedback.
- `aq-tabs` para navegacao entre `Visao Geral`, `Medicoes` e `Aplicacoes`.
- `aq-table` para historico de medicoes e historico de aplicacoes.

## Componentes Ausentes

- Nenhum componente reutilizavel bloqueante foi identificado na branch atual.
- A avaliacao anterior citava ausencia de tabs e table, mas a branch atual ja contem `aq-tabs` e `aq-table`, com documentacao e showcase.

## Pendencias de Integracao

- Contrato de API para detalhe do aquario.
- Contrato de API para historico de medicoes do aquario.
- Contrato de API para cadastrar medicao via modal.
- Contrato de API para historico de aplicacoes.
- Especificacao do fluxo de adicionar aplicacao.
- Regra de negocio para percentual de saude/estabilidade.
