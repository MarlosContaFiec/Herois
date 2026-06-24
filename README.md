# 🦸 Herois — Sistema de Gerenciamento de Heróis

Sistema completo de gerenciamento de heróis com **catálogo de personagens**, **perfis**, **habilidades**, **equipes** e **estatísticas**.

Arquitetura separada em:
- **backend** → API (Node.js + Express + Prisma + MongoDB)  
- **frontend** → Interface web (React + Vite + Tailwind CSS)

---

## ⚙️ Pré requisitos

Instale antes de começar:

| **Ferramenta** | **Versão recomendada** |
|---------------|------------------------|
| Node.js       | v18+                   |
| MongoDB       | Community              |
| mongosh       | latest                 |
| MongoDB Database Tools | latest         |
| Git           | latest                 |

---

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/MarlosContaFiec/Herois.git
cd Herois
```

---

## 🧠 Backend

```bash
cd backend
npm install
```

**Variáveis de ambiente**

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

**Banco de dados**

Siga a ordem abaixo para preparar o banco de dados:

Altere a linha de `DATABASE_URL` conforme necessário para desenvolvimento local.

```bash
npm run genPrisma
npm run pushPrisma
npm run db:seed
```

**Iniciar servidor**

```bash
npm run dev
```

Servidor disponível em: **http://localhost:3000/api**

---

## 🎨 Frontend

```bash
cd ../frontend
npm install
```

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Inicie o frontend:

```bash
npm run dev
```

A aplicação estará em: **http://localhost:5173**

---

## 🧪 Comandos úteis Backend

| **Comando**            | **Descrição**                       |
|------------------------|-------------------------------------|
| `npm run dev`          | Inicia API com hot reload           |
| `npm run dev:f`        | Inicia sem rodar Prisma             |
| `npm run genPrisma`    | Gera Prisma Client                  |
| `npm run pushPrisma`   | Sincroniza schema com MongoDB       |
| `npm run db:seed`      | Popula banco com dados iniciais     |
| `npm run db:export`    | Exporta dados do banco              |
| `npm run lint`         | Verifica problemas de código        |
| `npm run debug:fix`    | Corrige problemas com ESLint        |
| `npm run format`       | Formata código com Prettier         |
| `npm run studio`       | Abre Prisma Studio para visualizar dados |

**Reaplicar seed**

```bash
npm run db:seed
```

Atualiza o banco usando o script de seed.

---

## 🎨 Comandos úteis Frontend

| **Comando**            | **Descrição**                       |
|------------------------|-------------------------------------|
| `npm run dev`          | Inicia servidor de desenvolvimento  |
| `npm run build`        | Cria build de produção              |
| `npm run preview`      | Visualiza build em produção         |
| `npm run lint`         | Verifica problemas de código        |
| `npm run debug:fix`    | Corrige problemas com ESLint        |
| `npm run format`       | Formata código com Prettier         |
| `npm run clear`        | Limpa cache do Vite                 |

---

## 👤 Credenciais de Acesso Padrão

Para acessar a aplicação em desenvolvimento, use as seguintes credenciais:

| **Perfil**        | **Email**                | **Senha** | **Permissões**                             |
|-------------------|--------------------------|-----------|---------------------------------------------|
| **DEV**           | dev@dev.com              | 123456    | Acesso total ao sistema                    |
| **ADMIN**         | admin@admin.com          | 123456    | Gerenciar heróis, equipes e estatísticas   |
| **USUÁRIO**       | usuario@usuario.com      | 123456    | Consultar catálogo de heróis               |

> **⚠️ Aviso:** Estas são credenciais padrão apenas para desenvolvimento. Em produção, altere todas as senhas e utilize autenticação segura.

---

## 📚 Tecnologias

### Backend
- **Express.js** - Framework web para roteamento e middleware
- **Prisma** - ORM (Object-Relational Mapping) para MongoDB
- **MongoDB** - Banco de dados NoSQL
- **bcryptjs** - Criptografia de senhas com hash seguro
- **JWT (jsonwebtoken)** - Autenticação e autorização via tokens
- **Zod** - Validação de schemas e tipos
- **node-cron** - Agendamento de tarefas periódicas
- **CORS** - Configuração de requisições cross-origin
- **Dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **React 19** - Biblioteca UI para construção de interfaces
- **Vite** - Build tool rápido e moderno
- **Tailwind CSS** - Framework CSS utilitário para estilização
- **React Router** - Roteamento client-side
- **TanStack Query** - Gerenciamento de estado e cache de requisições
- **Axios** - Cliente HTTP para chamadas de API
- **Motion** - Biblioteca de animações fluidas
- **React Icons** - Biblioteca de ícones prontos

---

## 🔐 Estrutura do .env

### Backend (.env)

Crie um arquivo `.env` na pasta `backend/` com as seguintes variáveis:

```env
# Banco de Dados MongoDB
DATABASE_URL=mongodb://localhost:27017/herois

# Ambiente de execução
NODE_ENV=development

# Porta do servidor
PORT=3000

# JWT - Configuração de tokens
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRATION=7d

# CORS - Origens permitidas
CORS_ORIGIN=http://localhost:5173

# Email (opcional - para notificações)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app

# API Keys (se necessário)
API_KEY=sua_api_key_aqui
```

**Descrição das variáveis:**

| **Variável**       | **Descrição** | **Exemplo** |
|--------------------|---------------|-------------|
| `DATABASE_URL`     | String de conexão com MongoDB | `mongodb://localhost:27017/herois` |
| `NODE_ENV`         | Ambiente de execução (development, production) | `development` |
| `PORT`             | Porta onde a API rodará | `3000` |
| `JWT_SECRET`       | Chave secreta para assinar tokens JWT | Gerar uma chave segura |
| `JWT_EXPIRATION`   | Tempo de expiração do token | `7d` (7 dias) |
| `CORS_ORIGIN`      | URL do frontend para CORS | `http://localhost:5173` |
| `SMTP_HOST`        | Host do servidor de email | `smtp.gmail.com` |
| `SMTP_PORT`        | Porta do servidor de email | `587` |
| `SMTP_USER`        | Email para autenticação SMTP | Seu email |
| `SMTP_PASS`        | Senha de app do email | Senha de app |
| `API_KEY`          | Chave de API para integrações | Sua chave |

---

### Frontend (.env)

Crie um arquivo `.env` na pasta `frontend/` com as seguintes variáveis:

```env
# URL da API Backend
VITE_API_URL=http://localhost:3000/api

# Ambiente
VITE_APP_ENV=development

# Modo de debug
VITE_DEBUG=true
```

**Descrição das variáveis:**

| **Variável**       | **Descrição** | **Exemplo** |
|--------------------|---------------|-------------|
| `VITE_API_URL`     | URL base da API backend | `http://localhost:3000/api` |
| `VITE_APP_ENV`     | Ambiente da aplicação | `development` ou `production` |
| `VITE_DEBUG`       | Ativar modo de debug no console | `true` ou `false` |

---

## 🔧 Dicas e observações

- Mantenha o **MongoDB** rodando antes de executar os comandos do Prisma.  
- Se houver problemas com o Prisma Client, execute `npm run genPrisma` novamente.  
- Para desenvolvimento local, use os scripts `dev` para backend e frontend simultaneamente em terminais separados.  
- Atualize as variáveis de ambiente conforme necessário para conexões externas ou credenciais.
- Use `npm run studio` no backend para visualizar e gerenciar dados via Prisma Studio.
- O frontend utiliza Tailwind CSS para estilização — customizações de tema podem ser feitas em `tailwind.config.js`.
- **Nunca** commite o arquivo `.env` com dados sensíveis - use apenas `.env.example` com valores de exemplo.

---

## 📝 Estrutura do Projeto

```
Herois/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── server.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── scripts/
│   │   └── export.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.jsx
│   ├── public/
│   ├── .env.example
│   └── package.json
├── .gitignore
├── .vscode/
└── README.md
```

---

## 🚀 Deploy

Para fazer deploy da aplicação:

1. **Backend**: Configure as variáveis de ambiente em produção e execute `npm run start`
2. **Frontend**: Execute `npm run build` e hospede os arquivos gerados em `dist/`

---

## 📧 Suporte

Para dúvidas ou problemas, abra uma **issue** neste repositório.

---

**Desenvolvido com ❤️ por Marlos**
