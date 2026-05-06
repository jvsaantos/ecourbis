# EcoUrbis ♻️

> Plataforma de economia circular urbana — conectando cidadãos, empresas e centrais de reciclagem através de créditos e incentivos sustentáveis.

---

## Sobre o Projeto

**EcoUrbis** é um sistema web que digitaliza e incentiva a cadeia de reciclagem urbana. Cidadãos entregam resíduos recicláveis e acumulam créditos que podem ser usados em estabelecimentos parceiros. Empresas locais ganham isenção fiscal ao participar, e centrais de tratamento compram os materiais coletados de forma organizada.

### Fluxo do Sistema

```
Beneficiário entrega resíduos
       ↓
Funcionário de Coleta registra no sistema
       ↓
Beneficiário acumula créditos
       ↓
Gera QR Code para usar em Empresas Parceiras
       ↓
Resíduos são vendidos para Centrais de Tratamento
```

---

## Telas e Funcionalidades

| Perfil | Funcionalidade |
|--------|---------------|
| **Beneficiário** | Dashboard com saldo, histórico de coletas por tipo e peso, geração de voucher QR Code |
| **Funcionário de Coleta** | Registro de coleta com seleção visual do tipo de resíduo e cálculo de crédito em tempo real |
| **Empresa Parceira** | Configuração de créditos disponíveis, cálculo de isenção fiscal (ISS/IPTU), validade flexível |
| **Central de Tratamento** | Catálogo de resíduos com filtros, carrinho de compras, geração de boleto |

---

## Stack Tecnológica

| Tecnologia | Versão | Função |
|-----------|--------|--------|
| **Vue 3** | 3.5.x | Framework principal (Composition API) |
| **Vue Router 4** | 4.5.x | SPA routing com guards de autenticação |
| **Vite 6** | 6.3.x | Build tool e dev server |
| **Axios** | 1.9.x | HTTP client com interceptors |
| **CSS Custom Properties** | — | Design system com tokens |
| **Google Fonts (Poppins)** | — | Tipografia |

---

## Arquitetura do Projeto

```
src/
├── assets/
│   └── styles.css          # Design system global (tokens, classes base)
├── components/
│   ├── AppButton.vue        # Botão reutilizável (variantes, loading state)
│   ├── AppInput.vue         # Input com label, ícone, erro, hint
│   ├── AppModal.vue         # Modal genérico com Teleport + Transition
│   ├── AppBadge.vue         # Badge de status (success, error, warning...)
│   ├── EmptyState.vue       # Estado vazio padronizado
│   ├── LoadingSpinner.vue   # Spinner de carregamento
│   └── HeaderBar.vue        # Header com avatar, nome e logout
├── composables/
│   ├── useAuth.js           # Gerenciamento de sessão do usuário
│   └── useFormatters.js     # Formatadores: moeda, peso, CPF
├── services/
│   └── api.js              # Axios centralizado + todos os endpoints
├── router/
│   └── index.js            # Rotas + guards de autenticação
└── views/
    ├── LoginPage.vue
    ├── Register.vue
    ├── ForgotPassword.vue
    ├── NewPassword.vue
    ├── SelectProfile.vue
    ├── BeneficiarioProfile.vue
    ├── ColetaProfile.vue
    ├── EmpresaParceira.vue
    ├── CentralProfile.vue
    └── GerarQrCode.vue
```

---

## Instalação e Execução

### Pré-requisitos

- Node.js 18+
- npm 9+

### Passo a passo

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/ecourbis.git
cd ecourbis

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com a URL do seu backend

# Execute em modo de desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Variáveis de Ambiente

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## Backend Esperado

O frontend consome uma API REST. Endpoints necessários:

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/login` | Login com CPF e senha |
| `POST` | `/register` | Cadastro de usuário |
| `POST` | `/forgot-password` | Envio de link de recuperação |
| `POST` | `/reset-password` | Redefinição de senha |
| `GET`  | `/resumo-materiais/:cpf` | Resumo de coletas do beneficiário |
| `POST` | `/coletas` | Registrar nova coleta |
| `POST` | `/empresa/creditos` | Configurar créditos da empresa |
| `GET`  | `/residuos` | Listar resíduos disponíveis |
| `POST` | `/central/comprar` | Finalizar compra de resíduos |
| `POST` | `/voucher` | Gerar voucher QR Code |

> O frontend funciona no modo **mock** mesmo sem backend — todas as telas são navegáveis e demonstráveis.

---

## Diferenciais Técnicos

- **Design System próprio** — tokens CSS reutilizáveis (`--color-primary`, `--radius-md`, `--shadow-lg`...) aplicados em 100% das telas
- **Componentes atômicos reutilizáveis** — `AppButton`, `AppInput`, `AppModal`, `AppBadge`, `EmptyState`, `LoadingSpinner` com zero duplicação de CSS
- **Composables** — `useAuth` e `useFormatters` isolam lógica de negócio e formatação
- **API layer centralizada** — `services/api.js` com instância Axios única, interceptors de auth e tratamento de erro 401 automático
- **Route guards completos** — todas as 6 rotas privadas protegidas por meta `requiresAuth`, com redirect automático para usuários já logados
- **Loading + Error + Empty states** — feedback visual em 100% das operações assíncronas
- **Transições de página** — `<Transition name="fade">` no `App.vue` para transições suaves entre rotas
- **Responsividade mobile** — grids adaptativos com breakpoints em todas as telas críticas
- **Acessibilidade básica** — `aria-label`, `role="dialog"`, foco gerenciado nos modais, contraste WCAG AA
- **SEO básico** — meta description, theme-color, lang="pt-BR"
- **Variáveis de ambiente** — URL do backend via `VITE_API_URL` (sem hardcoded)

---

## Screenshots

> Sugestão de screenshots para o repositório:
> - `/` — Tela de login (layout split com painel de marca)
> - `/select-profile` — Seleção de perfil com ícones SVG
> - `/perfil/beneficiario` — Dashboard com stats e histórico
> - `/perfil/coleta` — Seleção visual de resíduo
> - `/perfil/central` — Layout de dois painéis (catálogo + carrinho)

---

## Roadmap

- [ ] Autenticação JWT com refresh token
- [ ] Pinia para estado global
- [ ] Testes unitários com Vitest
- [ ] PWA com suporte offline
- [ ] Notificações push
- [ ] Gráfico de evolução de coletas

---

## Licença

MIT © 2025
