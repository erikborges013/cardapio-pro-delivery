# CardápioPró Delivery

> Plataforma SaaS de alta performance para geração de cardápios digitais e gestão de pedidos de delivery. Desenvolvida com Vue.js, TypeScript e arquitetura serverless no Firebase.

O CardápioPró Delivery é um SaaS criado para digitalizar e escalar o atendimento de restaurantes e lanchonetes. O sistema automatiza desde a montagem da vitrine de produtos até a gestão complexa de taxas de entrega. Uma solução completa rodando em uma infraestrutura moderna, segura e desenhada para ter alta disponibilidade.

## 🚀 Funcionalidades Principais

* Vitrine Digital Dinâmica: Geração de cardápios interativos em tempo real para os clientes finais.
* Autenticação Blindada: Sistema de login e controle de acesso via Firebase Auth.
* Arquitetura Multi-tenant: Estrutura desenhada para suportar múltiplos lojistas isolados no mesmo banco de dados.

## 🛠️ Tecnologias e Engenharia

* Frontend: Vue.js com TypeScript e Tailwind CSS para uma interface rápida e reativa.
* Backend e Banco de Dados: Firebase Serverless (Firestore e Cloud Functions) rodando sobre Node.js.
* Pagamentos: Infraestrutura do Stripe.
* Hospedagem: Vercel (Frontend) e Google Cloud (Backend).

## ⚙️ Como executar este projeto localmente

1. Clone este repositório em sua máquina:
   `git clone https://github.com/erikborges013/cardapio-pro-delivery.git`

2. Instale as dependências do projeto:
   `npm install`

3. Configure o cofre de variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto baseado no arquivo `.env.example` e insira as suas chaves públicas do Firebase e do Stripe.

4. Inicie o servidor de desenvolvimento:
   `npm run dev`