# Federal Global by DeltaFox

Sistema completo de inteligência e contrainteligência empresarial desenvolvido em Next.js com TypeScript.

## 📋 Sobre o Projeto

O Federal Global é uma plataforma abrangente para gestão de segurança empresarial, oferecendo ferramentas avançadas para:

- **Inteligência Empresarial**: Coleta e análise de dados estratégicos
- **Contrainteligência**: Proteção contra ameaças internas e externas
- **Análise de Riscos**: Avaliação sistemática de vulnerabilidades
- **Relatórios de Segurança**: Documentação e acompanhamento de incidentes
- **Dashboard Executivo**: Painéis de controle com métricas em tempo real

## 🚀 Tecnologias Utilizadas

- **Frontend**: Next.js 15 com TypeScript
- **Styling**: Tailwind CSS
- **Banco de Dados**: MySQL (Hostgator)
- **ORM**: Prisma
- **Autenticação**: NextAuth.js
- **IA**: Google Gemini API
- **Deploy**: Vercel
- **Controle de Versão**: GitHub

## 🔧 Configuração do Ambiente

### Pré-requisitos

- Node.js 18+
- NPM ou Yarn
- Acesso ao banco MySQL

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/tborgesdf/federalglobal.git
cd federalglobal
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

4. Configure o banco de dados:

```bash
npx prisma generate
npx prisma db push
```

5. Execute o projeto:

```bash
npm run dev
```

## 🏗️ Estrutura do Projeto

```
├── src/
│   ├── app/                 # App Router (Next.js 13+)
│   ├── components/          # Componentes reutilizáveis
│   ├── lib/                 # Utilitários e configurações
│   └── types/               # Tipos TypeScript
├── prisma/                  # Schema e migrações do banco
├── public/                  # Arquivos estáticos
└── docs/                    # Documentação
```

## 📊 Funcionalidades Principais

### Dashboard Principal

- Métricas de segurança em tempo real
- Gráficos de tendências e análises
- Alertas e notificações

### Gestão de Usuários

- Controle de acesso por níveis (Admin, Manager, Analyst, User)
- Autenticação segura
- Histórico de atividades

### Relatórios de Inteligência

- Categorização automática
- Anexos e evidências
- Workflow de aprovação

### Análise de Riscos

- Matriz de riscos dinâmica
- Scoring automático
- Recomendações de ação

## 🔒 Segurança

- Criptografia de dados sensíveis
- Autenticação de dois fatores
- Logs de auditoria completos
- Controle de sessões

## 🌐 Deploy

O projeto está configurado para deploy automático no Vercel:

- **URL de Produção**: https://federalglobal.vercel.app
- **Ambiente de Desenvolvimento**: Configuração local

## 📚 Documentação

- [Manual Técnico](./docs/manual-tecnico.md)
- [Manual do Usuário](./docs/manual-usuario.md)
- [API Documentation](./docs/api.md)

## 👨‍💻 Equipe de Desenvolvimento

- **Thiago Borges** - Especialista em Segurança e Inteligência Empresarial
- **GitHub Copilot** - Assistente de Desenvolvimento

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema:

- Email: suporte@federalglobal.com
- GitHub Issues: [https://github.com/tborgesdf/federalglobal/issues](https://github.com/tborgesdf/federalglobal/issues)

## 📄 Licença

Este projeto está sob licença proprietária da DeltaFox Solutions.

---

**Federal Global by DeltaFox** - Protegendo o futuro das empresas através da inteligência estratégica.
