# Prodigy API

Prodigy API é o backend da aplicação de produtividade Prodigy, desenvolvido com Node.js, TypeScript e Fastify. O servidor oferece uma API REST completa com autenticação JWT, banco de dados PostgreSQL, integração com IA para geração de notas e sistema de gerenciamento de eventos, tarefas e notas.

## Funcionalidades

- **Autenticação Segura**: Sistema de login com JWT e refresh tokens
- **API REST Completa**: Endpoints para eventos, tarefas, notas e usuários
- **Integração com IA**: Geração automática de notas usando OpenRouter/DeepSeek
- **Banco de Dados**: PostgreSQL com Drizzle ORM e migrações
- **Sistema Kanban**: Gerenciamento de grupos de tarefas e colunas
- **Calendário**: CRUD completo de eventos com datas
- **Notas Inteligentes**: Sistema de notas com geração por IA
- **CORS Configurado**: Suporte para requisições do frontend
- **Validação de Dados**: Schemas Zod para validação de entrada

## Tecnologias utilizadas

![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-000000?style=for-the-badge&logo=drizzle&logoColor=white)
![OpenRouter AI](https://img.shields.io/badge/OpenRouter%20AI-000000?style=for-the-badge&logo=openai&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/) ou [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [OpenRouter API Key](https://openrouter.ai/) (para integração com IA)

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/prodigy-server.git
npm install
# ou
yarn install
# ou
pnpm install
```

## Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3333
OPENROUTER_API_KEY=sua_chave_openrouter_aqui
DATABASE_URL=postgresql://docker:docker@localhost:5432/focus
JWT_SECRET=sua_chave_secreta_jwt_aqui
```

## Execução

### 1. Iniciar o banco de dados

```bash
docker compose up -d
```

### 2. Executar migrações

```bash
npm run db:migrate
```

### 3. Iniciar o servidor

```bash
npm run dev
```

O servidor estará disponível em [http://localhost:3333](http://localhost:3333).

## Funcionalidades do Sistema

### Autenticação
- Login com email e senha
- Registro de novos usuários
- Refresh token automático
- Logout seguro
- Proteção de rotas com middleware

### Eventos
- Criação, listagem e exclusão de eventos
- Validação de datas e horários
- Associação com usuários

### Sistema Kanban
- Gerenciamento de grupos de tarefas
- Criação e organização de colunas
- CRUD completo de tarefas
- Reordenação de colunas e tarefas

### Notas
- Criação e edição de notas
- Geração automática com IA
- Busca e filtros
- Associação com usuários

### Integração com IA
- Geração de notas usando DeepSeek
- Streaming de respostas
- Sistema de prompts personalizados


## Implementações Futuras

- [ ] Integração com Google Calendar
- [ ] Sistema de notificações
- [ ] Relatórios de produtividade
- [ ] Cache com Redis
- [ ] Rate limiting
- [ ] Logs estruturados
- [ ] Testes automatizados
- [ ] Documentação da API com Swagger
