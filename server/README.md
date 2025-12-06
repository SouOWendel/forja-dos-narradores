# Forja dos Narradores - Backend API

API RESTful modular construída com NestJS e TypeORM.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js progressivo
- **TypeORM** - ORM para TypeScript e JavaScript
- **PostgreSQL** - Banco de dados relacional
- **Class Validator** - Validação de DTOs
- **Class Transformer** - Transformação de objetos

## 📋 Pré-requisitos

- Node.js 16+
- PostgreSQL 12+
- npm ou yarn

## 🔧 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure o banco de dados:
```bash
# Copie o arquivo de exemplo
copy server\.env.example server\.env

# Edite server\.env com suas credenciais do PostgreSQL
```

3. Crie o banco de dados no PostgreSQL:
```sql
CREATE DATABASE forja_narradores;
```

## 🎮 Executando o servidor

### Desenvolvimento
```bash
npm run start:server:dev
```

### Produção
```bash
npm run start:server
```

O servidor estará rodando em `http://localhost:3000`

## 📚 Endpoints da API

### Posts

- `GET /api/posts` - Lista todos os posts
- `GET /api/posts?published=true` - Lista apenas posts publicados
- `GET /api/posts/:id` - Busca post por ID
- `GET /api/posts/category/:category` - Busca posts por categoria
- `POST /api/posts` - Cria novo post
- `PATCH /api/posts/:id` - Atualiza post
- `DELETE /api/posts/:id` - Remove post
- `POST /api/posts/:id/views` - Incrementa visualizações

### Health Check

- `GET /health` - Verifica status do servidor

## 📦 Estrutura do Projeto

```
server/
├── src/
│   ├── posts/
│   │   ├── dto/
│   │   │   ├── create-post.dto.ts
│   │   │   └── update-post.dto.ts
│   │   ├── entities/
│   │   │   └── post.entity.ts
│   │   ├── posts.controller.ts
│   │   ├── posts.service.ts
│   │   └── posts.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── app.module.ts
│   └── main.ts
├── .env.example
└── tsconfig.json
```

## 🧪 Testando a API

### Criar um post
```bash
curl -X POST http://localhost:3000/api/posts ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Meu Primeiro Post\",\"content\":\"Conteúdo do post\",\"author\":\"Autor\",\"published\":true}"
```

### Listar posts
```bash
curl http://localhost:3000/api/posts
```

### Buscar post por ID
```bash
curl http://localhost:3000/api/posts/{id}
```

## 🔒 Validações

Todos os DTOs possuem validações automáticas:

- `title`: obrigatório, 3-255 caracteres
- `content`: obrigatório, mínimo 10 caracteres
- `excerpt`: opcional, máximo 500 caracteres
- `author`: opcional, máximo 255 caracteres
- `category`: opcional, máximo 100 caracteres
- `tags`: array de strings opcional
- `published`: boolean opcional (padrão: true)

## 🛠️ Próximos passos

1. Adicionar autenticação JWT
2. Implementar paginação
3. Adicionar filtros e ordenação
4. Implementar upload de imagens
5. Adicionar testes unitários e e2e
6. Criar módulos de comentários e usuários
