# Federal Global by DeltaFox - Instruções do Copilot

Este é o sistema Federal Global desenvolvido pela DeltaFox Consultoria, um sistema avançado de inteligência e contrainteligência empresarial.

## Tecnologias Principais

- Next.js 15 com TypeScript
- MySQL (Hostgator)
- Prisma ORM
- Tailwind CSS
- Google Gemini AI
- Vercel (Deploy)

## Funcionalidades Implementadas

- Sistema de autenticação com CPF e senha
- Verificação GPS obrigatória para todos os acessos
- Captura avançada de dados (rede, dispositivo, localização, clima)
- Sistema hierárquico de usuários (SUPER_ADMIN, ADMIN, USER)
- Logs completos de acesso e ações
- Sistema de email automatizado
- Criptografia e segurança avançada

## Configurações de Segurança

- GPS obrigatório para funcionamento do sistema
- Captura de dados de rede e dispositivo em todos os acessos
- Logs detalhados de todas as ações
- Protocolo único para cada usuário
- Verificação de permissões em todas as operações

## APIs Externas

- OpenWeatherMap (clima)
- OpenCage/BigDataCloud (geolocalização)
- Google Gemini (IA)
- Configuradas para uso gratuito com upgrade para produção massiva

## Estrutura do Projeto

- `/src/app` - Páginas Next.js
- `/src/lib/services` - Serviços de negócio
- `/src/lib/utils` - Utilitários (segurança, captura, logs)
- `/prisma` - Schema do banco de dados
- `/public` - Assets estáticos

## Credenciais de Teste

- CPF: 12345678901
- Senha: SuperAdmin2024!
- Protocolo: FG414712EEGGZT

Ao trabalhar neste projeto, sempre considere os requisitos de segurança e a necessidade de GPS habilitado.
