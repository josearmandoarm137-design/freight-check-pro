# VisionScan

Registro de avarias/retornos (motoristas) e conferência (conferentes), com rotas de entrega de demonstração em Iguatu-CE.

> Todos os colaboradores, matrículas e empresas são **fictícios**. A entrada por matrícula não é uma autenticação real — não use com dados confidenciais.

## Tecnologia
- **Linguagem:** TypeScript + React 19
- **Framework:** TanStack Start (rotas por arquivo, funções de servidor) com Vite 7
- **Estilos:** Tailwind CSS v4 + `src/styles.css`
- **Dados:** Lovable Cloud (banco de dados) para colaboradores, produtos e ocorrências; rotas de entrega ficam em arquivo local.

## Estrutura
| Pasta / arquivo | Função |
|---|---|
| `src/routes/` | Páginas (`index` painel, `ocorrencias`, `registrar`, `produtos`, `indicadores`, `perdas`, `perfil`, `rotas`) |
| `src/routes/__root.tsx` | Layout geral: mostra a tela de entrada, a página pública de rotas ou o sistema |
| `src/components/visionscan-*.tsx` | Tela de entrada, menu lateral, tabelas, filtros e relatório |
| `src/data/delivery-routes.ts` | As 7 rotas e 25 empresas (fonte única) + função de filtro |
| `src/lib/visionscan.ts` | Tipos, validações e utilitários |
| `src/lib/visionscan.functions.ts` / `.server.ts` | Operações no servidor (validação de perfil em cada ação) |
| `src/lib/report-pdf.ts` | Geração do PDF de relatórios |
| `src/styles.css` | Cores, fontes e estilos visuais |
| `src/test/` | Testes automáticos |

## Dependências principais
- `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/react-query` — páginas, navegação e dados
- `@supabase/supabase-js` — acesso ao banco do Lovable Cloud
- `zod` — validação de formulários
- `jspdf` / `jspdf-autotable` — relatórios em PDF
- `lucide-react` — ícones
- `tailwindcss` — estilos

## Executar localmente
```bash
bun install   # ou npm install
bun run dev   # abre em http://localhost:8080
bunx vitest run  # testes
```
É necessário um arquivo `.env` com as variáveis públicas do banco (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`). Sem banco, apenas a página de rotas funciona.

## Exportar o projeto
Conecte o projeto ao GitHub (menu do Lovable → GitHub) e baixe o repositório como ZIP, ou clone-o.

## Reuso em outras ferramentas (ex.: Canva IA)
O Canva IA não executa projetos React/TanStack com servidor. Reaproveitáveis diretamente: `src/data/delivery-routes.ts` (dados), `src/styles.css` (visual) e o logotipo. As páginas e funções de servidor precisam ser adaptadas à ferramenta de destino.
