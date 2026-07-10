# API.md — Contrato HTTP

## 1. Visão geral

### Base URL

```text
Produção: https://api-portfolio.vibecodex.pro/api/v1
Desenvolvimento: http://localhost:3333/api/v1
```

### Formato

- JSON em `camelCase`;
- UTF-8;
- datas em ISO 8601 UTC;
- IDs em UUID;
- arquivos via `multipart/form-data` ou URL assinada.

### Headers comuns

```http
Accept: application/json
Content-Type: application/json
X-Request-Id: <uuid opcional>
```

### Autenticação

A sessão administrativa usa cookie seguro:

```http
Cookie: fr_session=<token-opaco-ou-jwt>
```

O cookie deve ser `HttpOnly`, `Secure` e não pode ser lido pelo JavaScript.

Operações mutáveis devem usar proteção CSRF quando a estratégia de cookie exigir:

```http
X-CSRF-Token: <token>
```

## 2. Envelope de sucesso

```json
{
  "data": {},
  "meta": {
    "requestId": "0fa4fd9a-4252-4514-a7ac-c7730bc8ecae"
  }
}
```

## 3. Envelope de erro

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Não foi possível processar a solicitação.",
    "details": [
      {
        "field": "title",
        "message": "Informe um título com até 80 caracteres."
      }
    ]
  },
  "meta": {
    "requestId": "0fa4fd9a-4252-4514-a7ac-c7730bc8ecae"
  }
}
```

## 4. Códigos de erro comuns

| Código | HTTP | Significado |
|---|---:|---|
| `VALIDATION_ERROR` | 400 | entrada inválida |
| `UNAUTHENTICATED` | 401 | sessão ausente ou expirada |
| `FORBIDDEN` | 403 | sem permissão |
| `NOT_FOUND` | 404 | recurso inexistente |
| `CONFLICT` | 409 | versão ou slug em conflito |
| `PAYLOAD_TOO_LARGE` | 413 | arquivo acima do limite |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | formato não permitido |
| `RATE_LIMITED` | 429 | excesso de solicitações |
| `INTERNAL_ERROR` | 500 | falha inesperada |
| `SERVICE_UNAVAILABLE` | 503 | dependência indisponível |

# 5. Health

## `GET /health`

### Descrição

Verifica se o processo HTTP está respondendo.

### Autenticação

Não requer.

### Resposta 200

```json
{
  "data": {
    "status": "ok",
    "version": "1.0.0",
    "timestamp": "2026-07-10T13:00:00.000Z"
  },
  "meta": {
    "requestId": "..."
  }
}
```

## `GET /ready`

Verifica API, banco e storage. Pode ser restrito à infraestrutura.

# 6. Autenticação

## `POST /auth/login`

### Descrição

Autentica o administrador e cria uma sessão.

### Headers

```http
Content-Type: application/json
```

### Autenticação

Não requer.

### Body

```json
{
  "username": "nome-do-administrador",
  "password": "senha-informada-no-login"
}
```

### Resposta 200

```json
{
  "data": {
    "user": {
      "id": "fd73cd05-a2f0-4dd0-a5cb-eaa46e09acb7",
      "username": "nome-do-administrador",
      "role": "owner"
    },
    "expiresAt": "2026-07-10T14:00:00.000Z",
    "csrfToken": "..."
  },
  "meta": {
    "requestId": "..."
  }
}
```

O servidor envia o cookie por `Set-Cookie`.

### Erros

- `400 VALIDATION_ERROR`
- `401 INVALID_CREDENTIALS`
- `429 RATE_LIMITED`

### Exemplo

```bash
curl -i -X POST "$API_URL/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"username":"nome-do-administrador","password":"senha"}'
```

## `POST /auth/refresh`

### Descrição

Rotaciona a sessão usando refresh token seguro.

### Autenticação

Cookie de refresh válido.

### Body

Nenhum.

### Resposta 200

```json
{
  "data": {
    "expiresAt": "2026-07-10T15:00:00.000Z",
    "csrfToken": "novo-token"
  },
  "meta": {
    "requestId": "..."
  }
}
```

### Erros

- `401 UNAUTHENTICATED`
- `409 SESSION_REUSED`

## `POST /auth/logout`

### Descrição

Revoga a sessão atual e apaga cookies.

### Autenticação

Obrigatória.

### Resposta 204

Sem body.

## `GET /auth/session`

### Descrição

Retorna a sessão administrativa atual.

### Autenticação

Obrigatória.

### Resposta 200

```json
{
  "data": {
    "user": {
      "id": "fd73cd05-a2f0-4dd0-a5cb-eaa46e09acb7",
      "username": "nome-do-administrador",
      "role": "owner"
    },
    "expiresAt": "2026-07-10T14:00:00.000Z"
  },
  "meta": {
    "requestId": "..."
  }
}
```

# 7. Conteúdo público

## `GET /site/public`

### Descrição

Retorna a versão publicada do site.

### Autenticação

Não requer.

### Query params

| Parâmetro | Tipo | Uso |
|---|---|---|
| `locale` | string | reservado para idiomas futuros |

### Resposta 200

```json
{
  "data": {
    "site": {
      "name": "Fael Records",
      "tagline": "Vibecodex",
      "updatedAt": "2026-07-10T13:00:00.000Z",
      "version": 12
    },
    "page": {
      "slug": "home",
      "title": "Fael Records — Vibecodex",
      "sections": [
        {
          "id": "5f24a262-70b4-4d2d-8a5a-4dc8022783f7",
          "type": "heroSplit",
          "position": 0,
          "props": {
            "eyebrow": "FAEL RECORDS",
            "title": "Vibecodex",
            "description": "Ferramentas, agentes, skills e materiais para transformar ideias em execução.",
            "primaryCta": {
              "label": "Conhecer ferramentas",
              "href": "#ferramentas"
            }
          }
        }
      ]
    }
  },
  "meta": {
    "requestId": "...",
    "etag": "W/\"site-12\""
  }
}
```

### Cache

Suporta `ETag` e `If-None-Match`.

### Erros

- `404 NOT_FOUND`
- `503 SERVICE_UNAVAILABLE`

# 8. Páginas e seções administrativas

## `GET /admin/pages/:slug`

### Descrição

Retorna rascunho, versão publicada e metadados da página.

### Autenticação

Obrigatória.

### Resposta 200

```json
{
  "data": {
    "id": "...",
    "slug": "home",
    "title": "Home",
    "status": "draft",
    "draftVersion": 18,
    "publishedVersion": 12,
    "sections": []
  },
  "meta": {
    "requestId": "..."
  }
}
```

## `POST /admin/pages/:pageId/sections`

### Descrição

Cria uma nova seção a partir de um tipo permitido.

### Headers

```http
Content-Type: application/json
X-CSRF-Token: <token>
```

### Body

```json
{
  "type": "resourceGrid",
  "position": 3,
  "props": {
    "eyebrow": "FERRAMENTAS",
    "title": "Ferramentas de IA",
    "collection": "aiTools",
    "columns": 3
  }
}
```

### Resposta 201

```json
{
  "data": {
    "id": "...",
    "type": "resourceGrid",
    "position": 3,
    "visible": true,
    "props": {
      "eyebrow": "FERRAMENTAS",
      "title": "Ferramentas de IA",
      "collection": "aiTools",
      "columns": 3
    },
    "version": 1
  },
  "meta": {
    "requestId": "..."
  }
}
```

### Erros

- `400 VALIDATION_ERROR`
- `401 UNAUTHENTICATED`
- `409 POSITION_CONFLICT`

## `PATCH /admin/sections/:sectionId`

### Descrição

Atualiza parcialmente uma seção em rascunho.

### Body

```json
{
  "version": 4,
  "visible": true,
  "props": {
    "title": "Ferramentas criadas para executar mais"
  }
}
```

### Resposta 200

```json
{
  "data": {
    "id": "...",
    "version": 5,
    "updatedAt": "2026-07-10T13:30:00.000Z"
  },
  "meta": {
    "requestId": "..."
  }
}
```

### Erros

- `409 VERSION_CONFLICT` quando outro processo salvou antes.

## `DELETE /admin/sections/:sectionId`

### Descrição

Move a seção para lixeira lógica.

### Body

```json
{
  "version": 5
}
```

### Resposta 204

Sem body.

## `POST /admin/pages/:pageId/sections/reorder`

### Descrição

Atualiza a ordem das seções em uma transação.

### Body

```json
{
  "version": 18,
  "sectionIds": [
    "id-hero",
    "id-purpose",
    "id-tools",
    "id-utilities",
    "id-design",
    "id-faq"
  ]
}
```

### Resposta 200

```json
{
  "data": {
    "version": 19,
    "updatedAt": "2026-07-10T13:40:00.000Z"
  },
  "meta": {
    "requestId": "..."
  }
}
```

# 9. Recursos: IA, utilidades e design

## `GET /resources`

### Descrição

Lista recursos públicos ou administrativos conforme autenticação e filtros.

### Query params

| Parâmetro | Exemplo |
|---|---|
| `kind` | `aiTool`, `utility`, `designMaterial` |
| `status` | `draft`, `published`, `archived` |
| `search` | texto |
| `tag` | `automacao` |
| `page` | `1` |
| `pageSize` | `24` |
| `sort` | `position`, `createdAt`, `title` |

### Resposta 200

```json
{
  "data": [
    {
      "id": "...",
      "kind": "aiTool",
      "title": "Nome da ferramenta",
      "slug": "nome-da-ferramenta",
      "summary": "Descrição objetiva.",
      "thumbnail": {
        "url": "https://cdn.example.com/...",
        "alt": "Interface da ferramenta"
      },
      "externalUrl": "https://example.com",
      "tags": ["IA", "Automação"],
      "status": "published"
    }
  ],
  "meta": {
    "requestId": "...",
    "pagination": {
      "page": 1,
      "pageSize": 24,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

## `POST /admin/resources`

### Body

```json
{
  "kind": "utility",
  "title": "Checklist de prompt",
  "slug": "checklist-de-prompt",
  "summary": "Material para estruturar prompts com consistência.",
  "description": "Conteúdo detalhado opcional.",
  "externalUrl": null,
  "downloadAssetId": "uuid-do-arquivo",
  "thumbnailAssetId": "uuid-da-capa",
  "tags": ["Prompt", "Produtividade"],
  "featured": false
}
```

### Resposta 201

Retorna o recurso completo.

## `GET /admin/resources/:resourceId`

Retorna dados completos e versões.

## `PATCH /admin/resources/:resourceId`

Atualiza parcialmente, exigindo `version`.

## `DELETE /admin/resources/:resourceId`

Move para lixeira lógica.

## `POST /admin/resources/reorder`

Reordena recursos dentro de uma coleção.

# 10. FAQ

O FAQ pode ser modelado como recurso ou seção. Caso use endpoints próprios:

## `POST /admin/faqs`

### Body

```json
{
  "question": "O conteúdo é gratuito?",
  "answer": "Cada material informa sua forma de acesso e licença.",
  "position": 0,
  "visible": true
}
```

### Resposta 201

```json
{
  "data": {
    "id": "...",
    "question": "O conteúdo é gratuito?",
    "answer": "Cada material informa sua forma de acesso e licença.",
    "position": 0,
    "visible": true,
    "version": 1
  },
  "meta": {
    "requestId": "..."
  }
}
```

# 11. Mídia

## `GET /admin/media`

### Query params

- `type=image|video|document|archive`
- `search`
- `page`
- `pageSize`

### Resposta 200

Lista assets e suas variantes.

## `POST /admin/media`

### Content-Type

```http
multipart/form-data
```

### Campos

| Campo | Obrigatório | Descrição |
|---|---|---|
| `file` | sim | arquivo binário |
| `alt` | para imagem informativa | texto alternativo |
| `folder` | não | agrupamento lógico |
| `visibility` | sim | `public` ou `private` |

### Resposta 201

```json
{
  "data": {
    "id": "...",
    "status": "processing",
    "filename": "capa-ferramenta.webp",
    "mimeType": "image/webp",
    "size": 184203,
    "visibility": "public"
  },
  "meta": {
    "requestId": "..."
  }
}
```

### Erros

- `413 PAYLOAD_TOO_LARGE`
- `415 UNSUPPORTED_MEDIA_TYPE`
- `422 INVALID_FILE_SIGNATURE`

## `GET /admin/media/:assetId`

Retorna metadados e status de processamento.

## `DELETE /admin/media/:assetId`

### Regras

- retorna `409 ASSET_IN_USE` se houver referência ativa;
- exclusão forçada exige endpoint ou flag de alta segurança e não deve ser padrão.

# 12. Preview e publicação

## `POST /admin/pages/:pageId/preview`

### Descrição

Valida o rascunho e retorna payload de preview ou token temporário.

### Body

```json
{
  "viewport": "desktop"
}
```

### Resposta 200

```json
{
  "data": {
    "valid": true,
    "previewToken": "...",
    "expiresAt": "2026-07-10T14:10:00.000Z",
    "warnings": []
  },
  "meta": {
    "requestId": "..."
  }
}
```

## `POST /admin/pages/:pageId/publish`

### Descrição

Publica atomicamente o rascunho validado.

### Body

```json
{
  "draftVersion": 19,
  "message": "Atualiza cards de ferramentas"
}
```

### Resposta 200

```json
{
  "data": {
    "publishedVersion": 20,
    "publishedAt": "2026-07-10T14:00:00.000Z",
    "cacheInvalidated": true
  },
  "meta": {
    "requestId": "..."
  }
}
```

### Erros

- `409 VERSION_CONFLICT`
- `422 PUBLICATION_VALIDATION_FAILED`
- `503 STORAGE_UNAVAILABLE`

# 13. Auditoria

## `GET /admin/audit-logs`

### Query params

- `action`
- `entityType`
- `entityId`
- `from`
- `to`
- `page`

### Resposta 200

```json
{
  "data": [
    {
      "id": "...",
      "action": "page.published",
      "entityType": "page",
      "entityId": "...",
      "actor": {
        "id": "...",
        "username": "nome-do-administrador"
      },
      "createdAt": "2026-07-10T14:00:00.000Z"
    }
  ],
  "meta": {
    "requestId": "...",
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

# 14. Convenções para novos endpoints

## 14.1 Nomeação

- substantivos no plural;
- ações especiais apenas quando CRUD não representar o domínio;
- kebab-case em segmentos compostos;
- versão no prefixo.

```text
Correto: POST /admin/pages/:pageId/publish
Incorreto: POST /doPublishPage
```

## 14.2 Validação

Todo endpoint deve possuir:

- schema de params;
- schema de query;
- schema de headers relevantes;
- schema de body;
- schema de resposta por status;
- limite de payload;
- regra de autenticação e autorização.

## 14.3 Idempotência

Operações de publicação ou upload finalizado podem aceitar:

```http
Idempotency-Key: <uuid>
```

## 14.4 Concorrência

Entidades editáveis usam campo `version`. Atualizações com versão antiga retornam `409 VERSION_CONFLICT`.

## 14.5 Paginação

Padrão inicial:

```text
?page=1&pageSize=24
```

- `pageSize` máximo definido pelo servidor;
- listas muito grandes podem migrar para cursor sem quebrar contrato de versão.

## 14.6 Segurança

- não retornar hash, tokens ou configuração interna;
- não aceitar role pelo body do cliente;
- não confiar em MIME declarado;
- não usar mensagens que revelem existência de usuário no login;
- não registrar payload sensível.

## 14.7 Testes mínimos

Todo endpoint mutável deve testar:

- sucesso;
- validação;
- ausência de autenticação;
- falta de permissão;
- conflito;
- falha de dependência quando relevante;
- auditoria.
