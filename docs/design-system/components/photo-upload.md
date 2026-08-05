# Photo Upload (`aq-photo-upload`)

## Visão geral

Dropzone de upload de imagem única, com suporte a clique (seletor de arquivo nativo), arrastar-e-soltar (drag-and-drop), validação de tipo/tamanho e pré-visualização opcional.

## Localização

`src/app/shared/components/photo-upload/` — componente + `photo-upload-rejection.model.ts`.

## Seletor

`aq-photo-upload` (standalone).

## API

### Inputs

| Nome                                    | Tipo             | Padrão                              | Descrição                                                                                                               |
| --------------------------------------- | ---------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `label`                                 | `string`         | `'Drop your image here, or'`        | Texto principal (idealmente sobrescrito e traduzido pelo consumidor).                                                   |
| `browseLabel`                           | `string`         | `'browse'`                          | Texto do link/ação de navegar arquivos, exibido em destaque dentro do `label`.                                          |
| `hint`                                  | `string`         | auto-gerado                         | Texto de apoio; se não informado, gera automaticamente "Supports: X (Max YMB)" a partir de `accept`/`maxFileSizeBytes`. |
| `accept`                                | `string`         | `'image/jpeg,image/png,image/webp'` | Lista de tipos/mimes/extensões aceitos (atributo `accept` nativo + validação própria).                                  |
| `maxFileSizeBytes`                      | `number`         | `5 * 1024 * 1024` (5MB)             | Tamanho máximo do arquivo.                                                                                              |
| `fieldName`                             | `string`         | `'file'`                            | Nome do campo usado ao montar o `FormData` emitido.                                                                     |
| `icon`                                  | `string`         | `'image'`                           | Ícone Material exibido na dropzone.                                                                                     |
| `previewUrl`                            | `string \| null` | `null`                              | URL de preview controlada externamente (ex.: imagem já salva no servidor).                                              |
| `errorMessage`                          | `string \| null` | `null`                              | Erro controlado externamente (ex.: erro retornado pela API após upload).                                                |
| `invalidTypeMessage` / `maxSizeMessage` | `string`         | auto-gerado                         | Mensagens customizadas para os dois tipos de rejeição local.                                                            |
| `showPreview`                           | `boolean`        | `false`                             | Ativa geração de preview local (via `URL.createObjectURL`) do arquivo selecionado.                                      |
| `disabled` (alias `disabledState`)      | `boolean`        | `false`                             | Desabilita clique/drag/drop.                                                                                            |

### Outputs

| Nome               | Tipo                                                                                     | Quando dispara                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `fileSelected`     | `File`                                                                                   | Arquivo válido selecionado (clique ou drop).                                          |
| `formDataSelected` | `FormData`                                                                               | Mesmo momento de `fileSelected`, já empacotado em `FormData` com a chave `fieldName`. |
| `fileRejected`     | `PhotoUploadRejection` (`{ reason: 'invalid-type' \| 'file-too-large', file, message }`) | Arquivo inválido (tipo ou tamanho).                                                   |

## Regras visuais

- Estado `dragging`: destaque visual enquanto um arquivo é arrastado sobre a área.
- Estado `disabled`: bloqueia interação visual e funcionalmente.
- Estado `invalid` (`resolvedError`): combina erro local (validação) com `errorMessage` externo (API) — local tem prioridade se ambos existirem simultaneamente.
- Estado `with-preview`: quando há uma URL de preview resolvida (local ou externa), exibe a imagem ao lado/abaixo da dropzone.
- Nome do arquivo selecionado é exibido como confirmação textual (`selectedFileName`).

## Regras de acionamento

- Clique na dropzone inteira (`openFilePicker`) abre o seletor de arquivo nativo do sistema operacional (bloqueado se `disabled`).
- `Enter`/`Space` com a dropzone focada também abrem o seletor (`onKeydown`), já que a dropzone é `role="button"` `tabindex="0"`.
- Drag-and-drop: `dragover` (previne comportamento padrão + ativa estado `dragging`), `dragleave` (desativa), `drop` (processa o primeiro arquivo do `DataTransfer`, previne comportamento padrão).
- Validação em duas etapas, na ordem: (1) tipo aceito — compara contra `accept` normalizando tokens (extensão `.ext`, mime exato, ou `group/*`); (2) tamanho máximo. Falha em qualquer etapa emite `fileRejected` com a razão específica e **não** emite `fileSelected`/`formDataSelected`.
- Sucesso: atualiza nome do arquivo, gera preview (se `showPreview=true` e `URL.createObjectURL` disponível), emite `fileSelected` e `formDataSelected` simultaneamente.
- Input de arquivo nativo tem seu `value` resetado após cada seleção (`input.value = ''`), permitindo selecionar o mesmo arquivo duas vezes seguidas e ainda disparar o evento `change`.
- `URL.createObjectURL`/`revokeObjectURL` são gerenciados com cuidado para evitar vazamento de memória: a URL anterior é sempre revogada antes de criar uma nova, e também no `DestroyRef.onDestroy`.

## Acessibilidade

- Dropzone: `role="button"`, `tabindex="0"`, `aria-disabled`, `aria-describedby` (aponta para hint + erro, quando presente).
- Mensagem de erro em `role="alert"`.
- Input de arquivo real é `hidden` (mas continua no DOM e acessível programaticamente via clique simulado) — a interação do usuário passa pela dropzone, não pelo input nativo diretamente.
- Imagem de preview usa `alt=""` (decorativa — o nome do arquivo já está disponível como texto separado).

## Cenários de uso

- Foto de perfil do usuário.
- Foto de capa/identificação de um aquário na tela de criação.

## Onde é usado

- `src/app/features/aquarium/pages/aquarium-create-page/aquarium-create-page.component.html`

## Showcase

`/components/photo-upload` → `src/app/features/components-showcase/pages/photo-upload/photo-upload-showcase.component.ts`
