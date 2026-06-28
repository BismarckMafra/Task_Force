# TaskFlow

TaskFlow é uma aplicação web para organizar tarefas com painel de gestão, calendário e quadro Kanban, construída com Next.js, TypeScript e Firebase.

## Funcionalidades

- Gestão de tarefas com fluxo visual
- Dashboard com visão geral das atividades
- Calendário para acompanhar prazos
- Kanban para priorizar o trabalho
- Tema claro/escuro
- Alto contraste para melhor leitura
- Redução de movimento para usuários sensíveis a animações
- Feedback tátil via vibração em dispositivos compatíveis

## Como executar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o projeto em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Acesse http://localhost:3000 no navegador.

## Scripts

- `npm run dev` — inicia o servidor local
- `npm run build` — gera a build de produção
- `npm run lint` — valida o código com ESLint

## Acessibilidade

Os controles de acessibilidade estão disponíveis no rodapé e permitem:

- alternar entre tema claro e escuro
- ativar alto contraste
- reduzir movimentos e transições

## Estrutura principal

- `src/app` — páginas e rotas da aplicação
- `src/components` — componentes reutilizáveis
- `src/contexts` — contexto de autenticação
- `src/services` — integração com Firebase e regras de negócio
