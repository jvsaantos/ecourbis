<template>
  <div class="parceiro-page">

    <!-- Nav mínima pública -->
    <nav class="pub-nav">
      <RouterLink to="/" class="pub-nav__brand">
        <img src="/logo_grafismo_preciso_transparente.png" alt="EcoUrbis" class="pub-nav__logo" />
        <span>EcoUrbis</span>
      </RouterLink>
      <RouterLink to="/" class="pub-nav__login">Já sou parceiro</RouterLink>
    </nav>

    <!-- ══ Hero ══ -->
    <section class="hero">
      <div class="hero__inner">
        <div class="hero__badge">♻ Programa de Parceria ESG</div>
        <h1 class="hero__title">
          Reduza impostos e<br />
          <span class="hero__title--accent">impulsione a reciclagem</span>
        </h1>
        <p class="hero__desc">
          Empresas parceiras EcoUrbis disponibilizam créditos para cidadãos recicladores
          e recebem isenções fiscais reais sobre ISS e IPTU. Simples, verificável e
          alinhado com o Decreto Municipal 58.811/2019.
        </p>
        <div class="hero__actions">
          <a href="#cadastro" class="btn-hero-primary">Quero ser parceiro</a>
          <a href="#como-funciona" class="btn-hero-secondary">Ver como funciona</a>
        </div>
        <div class="hero__trust">
          <div class="trust-item">
            <strong>+240</strong>
            <span>empresas parceiras</span>
          </div>
          <div class="trust-sep"></div>
          <div class="trust-item">
            <strong>182 ton</strong>
            <span>recicladas em 2024</span>
          </div>
          <div class="trust-sep"></div>
          <div class="trust-item">
            <strong>R$ 1,2M</strong>
            <span>em isenções geradas</span>
          </div>
        </div>
      </div>
      <div class="hero__visual" aria-hidden="true">
        <div class="hero__circle hero__circle--1"></div>
        <div class="hero__circle hero__circle--2"></div>
        <svg class="hero__icon" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="56" fill="rgba(255,255,255,0.12)"/>
          <text x="60" y="78" text-anchor="middle" font-size="52">♻</text>
        </svg>
      </div>
    </section>

    <!-- ══ Benefícios ══ -->
    <section class="section" id="beneficios">
      <div class="section__inner">
        <p class="section__label">Por que participar</p>
        <h2 class="section__title">Benefícios reais para o seu negócio</h2>
        <div class="beneficios-grid">
          <div v-for="b in beneficios" :key="b.titulo" class="beneficio-card">
            <div class="beneficio-card__icon" :style="{ background: b.bg, color: b.cor }">
              <component :is="b.icone" />
            </div>
            <h3 class="beneficio-card__titulo">{{ b.titulo }}</h3>
            <p class="beneficio-card__desc">{{ b.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ Como funciona ══ -->
    <section class="section section--alt" id="como-funciona">
      <div class="section__inner">
        <p class="section__label">Passo a passo</p>
        <h2 class="section__title">Como funciona a parceria</h2>
        <div class="fluxo">
          <div v-for="(passo, i) in passos" :key="i" class="fluxo-item">
            <div class="fluxo-item__num">{{ i + 1 }}</div>
            <div class="fluxo-item__conteudo">
              <h3 class="fluxo-item__titulo">{{ passo.titulo }}</h3>
              <p class="fluxo-item__desc">{{ passo.desc }}</p>
            </div>
            <div v-if="i < passos.length - 1" class="fluxo-item__seta" aria-hidden="true">→</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ Simulador ══ -->
    <section class="section" id="simulador">
      <div class="section__inner section__inner--narrow">
        <p class="section__label">Calculadora</p>
        <h2 class="section__title">Simule sua isenção fiscal</h2>
        <p class="section__subtitle">Calcule em tempo real quanto você economizaria em impostos</p>

        <div class="simulador-card">
          <div class="sim-field">
            <label class="sim-label">Valor mensal em créditos (R$)</label>
            <div class="sim-input-wrap">
              <span class="sim-prefix">R$</span>
              <input
                type="number"
                class="sim-input"
                v-model.number="simValor"
                min="100"
                step="100"
                placeholder="1000"
              />
            </div>
          </div>

          <label class="toggle-row sim-toggle">
            <div class="toggle-wrap">
              <input type="checkbox" v-model="simVeterano" class="toggle-input" />
              <div class="toggle-slider"></div>
            </div>
            <span class="sim-toggle__label">Empresa veterana (+2pp bônus)</span>
          </label>

          <div v-if="simValor >= 100" class="sim-resultado">
            <div class="sim-resultado__item sim-resultado__item--destaque">
              <p class="sim-resultado__label">Isenção estimada/mês</p>
              <p class="sim-resultado__valor">{{ formatarMoeda(simIsencao.valorIsencao) }}</p>
            </div>
            <div class="sim-resultado__item">
              <p class="sim-resultado__label">Percentual</p>
              <p class="sim-resultado__valor sim-resultado__valor--sm">{{ simIsencao.percentual }}%</p>
            </div>
            <div class="sim-resultado__item">
              <p class="sim-resultado__label">Economia anual</p>
              <p class="sim-resultado__valor sim-resultado__valor--sm">{{ formatarMoeda(simIsencao.valorIsencao * 12) }}</p>
            </div>
          </div>

          <div class="sim-barra-wrap" v-if="simValor >= 100">
            <div class="sim-barra">
              <div class="sim-barra__fill" :style="{ width: Math.min(simIsencao.percentual / 30 * 100, 100) + '%' }"></div>
            </div>
            <div class="sim-barra__labels">
              <span>0%</span>
              <span>{{ simIsencao.percentual }}%</span>
              <span>Teto 30%</span>
            </div>
          </div>

          <p class="sim-nota">
            * Estimativa baseada no Decreto Municipal 58.811/2019. O valor final depende da apuração municipal.
          </p>

          <a href="#cadastro" class="btn-hero-primary" style="display:inline-block; text-align:center; margin-top:0.25rem; text-decoration:none;">
            Quero essa isenção
          </a>
        </div>
      </div>
    </section>

    <!-- ══ Impacto ESG ══ -->
    <section class="section section--green" id="esg">
      <div class="section__inner">
        <p class="section__label section__label--light">Impacto real</p>
        <h2 class="section__title section__title--light">Relatório de Impacto ESG 2024</h2>
        <div class="esg-grid">
          <div v-for="m in metricas" :key="m.label" class="esg-card">
            <span class="esg-card__icon">{{ m.emoji }}</span>
            <p class="esg-card__valor">{{ m.valor }}</p>
            <p class="esg-card__label">{{ m.label }}</p>
          </div>
        </div>
        <p class="esg-nota">Dados verificados pela plataforma EcoUrbis · Ciclo janeiro–dezembro 2024</p>
      </div>
    </section>

    <!-- ══ CTA Cadastro ══ -->
    <section class="section" id="cadastro">
      <div class="section__inner section__inner--narrow">
        <div class="cta-card">
          <h2 class="cta-card__title">Pronto para fazer parte?</h2>
          <p class="cta-card__desc">
            Cadastre-se agora. Nossa equipe entra em contato em até 24h úteis
            para validar seu CNPJ e ativar os benefícios.
          </p>

          <form class="cta-form" @submit.prevent="handleCadastro">
            <div class="cta-form__row">
              <AppInput
                v-model="form.nome"
                label="Nome da empresa"
                placeholder="Razão social"
                required
              />
              <AppInput
                label="CNPJ"
                :model-value="cnpjMascarado"
                placeholder="00.000.000/0000-00"
                maxlength="18"
                required
                @update:model-value="onCnpjInput"
              />
            </div>
            <div class="cta-form__row">
              <AppInput
                v-model="form.email"
                type="email"
                label="E-mail comercial"
                placeholder="contato@empresa.com"
                required
              />
              <AppInput
                v-model="form.telefone"
                type="tel"
                label="Telefone"
                placeholder="(11) 9 0000-0000"
              />
            </div>

            <div v-if="cadastroSucesso" class="alert alert--success">
              Cadastro enviado! Entraremos em contato em breve.
            </div>
            <div v-else-if="cadastroErro" class="alert alert--error">{{ cadastroErro }}</div>

            <button type="submit" class="btn-hero-primary" :disabled="cadastrando" style="width:100%; border:none; cursor:pointer;">
              {{ cadastrando ? 'Enviando...' : 'Enviar Cadastro' }}
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- Footer mínimo -->
    <footer class="pub-footer">
      <p>© 2025 EcoUrbis · Plataforma de Economia Circular Urbana</p>
      <RouterLink to="/">Voltar ao sistema</RouterLink>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue';
import { calcularIsencaoFiscal } from '../services/mocks.js';
import { useFormatters } from '../composables/useFormatters.js';
import AppInput from '../components/AppInput.vue';

const { formatarMoeda } = useFormatters();

// ── Simulador ──────────────────────────────────────────────
const simValor = ref(1000);
const simVeterano = ref(false);
const simIsencao = computed(() => calcularIsencaoFiscal(simValor.value, simVeterano.value));

// ── Toggle veterano reutilizado do EmpresaParceira ─────────
const beneficios = [
  {
    titulo: 'Isenção Fiscal Real',
    desc: 'Até 30% de isenção sobre ISS e IPTU. Base legal: Decreto 58.811/2019. Sem burocracia adicional.',
    bg: '#dcfce7', cor: '#166534',
    icone: () => h('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' }),
    ]),
  },
  {
    titulo: 'Selo ESG Verificado',
    desc: 'Destaque no aplicativo como "Parceiro Sustentável". Relatório mensal de impacto ambiental.',
    bg: '#dbeafe', cor: '#1e40af',
    icone: () => h('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('circle', { cx: 12, cy: 8, r: 6 }),
      h('path', { d: 'M15.477 12.89L17 22l-5-3-5 3 1.523-9.11' }),
    ]),
  },
  {
    titulo: 'Novos Clientes Verdes',
    desc: 'Beneficiários da plataforma preferem estabelecimentos parceiros ao usar seus créditos de reciclagem.',
    bg: '#f3e5f5', cor: '#7b1fa2',
    icone: () => h('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('path', { d: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2' }),
      h('circle', { cx: 9, cy: 7, r: 4 }),
      h('path', { d: 'M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' }),
    ]),
  },
  {
    titulo: 'Zero Burocracia',
    desc: 'Ativação em 24h. Painel de gestão online. Créditos gerenciados automaticamente pela plataforma.',
    bg: '#fff8e1', cor: '#f57f17',
    icone: () => h('svg', { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      h('polyline', { points: '20 6 9 17 4 12' }),
    ]),
  },
];

const passos = [
  { titulo: 'Cadastre sua empresa', desc: 'Preencha o formulário com CNPJ e e-mail. Validamos em 24h.' },
  { titulo: 'Defina os créditos', desc: 'Escolha o valor e validade. Os créditos ficam disponíveis no app.' },
  { titulo: 'Clientes reciclam', desc: 'Beneficiários acumulam créditos reciclando e os usam no seu estabelecimento.' },
  { titulo: 'Receba a isenção', desc: 'A prefeitura aplica o desconto no seu ISS/IPTU no mês seguinte.' },
];

const metricas = [
  { emoji: '♻', valor: '182 ton', label: 'resíduos reciclados em 2024' },
  { emoji: '🏢', valor: '+240', label: 'empresas parceiras ativas' },
  { emoji: '💚', valor: '4.800', label: 'beneficiários impactados' },
  { emoji: '🌱', valor: '94 ton CO₂', label: 'emissões evitadas' },
  { emoji: '💰', valor: 'R$ 1,2M', label: 'em isenções concedidas' },
  { emoji: '🔄', valor: '38.000', label: 'coletas registradas' },
];

// ── CNPJ mask ──────────────────────────────────────────────
const cnpjMascarado = ref('');
const onCnpjInput = (val) => {
  const raw = typeof val === 'string' ? val : val.target.value;
  const n = raw.replace(/\D/g, '').slice(0, 14);
  cnpjMascarado.value = n
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

// ── Formulário ─────────────────────────────────────────────
const form = ref({ nome: '', email: '', telefone: '' });
const cadastrando = ref(false);
const cadastroSucesso = ref(false);
const cadastroErro = ref('');

const handleCadastro = async () => {
  cadastroErro.value = '';
  cadastrando.value = true;
  await new Promise((r) => setTimeout(r, 1200)); // mock
  cadastrando.value = false;
  cadastroSucesso.value = true;
  form.value = { nome: '', email: '', telefone: '' };
  cnpjMascarado.value = '';
};

// Toggle slider styles reusados inline (sem scoped conflict)
</script>

<style scoped>
.parceiro-page {
  min-height: 100vh;
  background: var(--color-bg);
  font-family: 'Poppins', sans-serif;
}

/* ── Nav ── */
.pub-nav {
  position: sticky; top: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 2rem; height: 64px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.pub-nav__brand {
  display: flex; align-items: center; gap: 0.6rem;
  font-weight: 700; font-size: 1.1rem; color: var(--color-text);
  text-decoration: none;
}

.pub-nav__logo {
  width: 32px; height: 32px; object-fit: contain;
}

.pub-nav__login {
  font-size: 0.875rem; font-weight: 600;
  color: var(--color-primary);
  border: 1.5px solid var(--color-primary);
  border-radius: 8px;
  padding: 0.4rem 1rem;
  transition: all var(--transition);
  text-decoration: none;
}
.pub-nav__login:hover {
  background: var(--color-primary);
  color: #fff;
  text-decoration: none;
}

/* ── Hero ── */
.hero {
  background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 60%, #4CAF50 100%);
  color: #fff;
  padding: 5rem 2rem 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  position: relative;
  overflow: hidden;
}

.hero__inner { max-width: 560px; z-index: 1; }

.hero__badge {
  display: inline-flex; align-items: center;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  font-size: 0.8rem; font-weight: 600;
  margin-bottom: 1.25rem;
}

.hero__title {
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 700;
  line-height: 1.15;
  margin: 0 0 1rem;
}

.hero__title--accent { color: #A5D6A7; }

.hero__desc {
  font-size: 1rem; opacity: 0.9; line-height: 1.65;
  margin: 0 0 2rem; max-width: 480px;
}

.hero__actions { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2.5rem; }

.btn-hero-primary {
  display: inline-flex; align-items: center; justify-content: center;
  background: #fff; color: var(--color-primary-dark);
  font-weight: 700; font-size: 0.95rem;
  padding: 0.8rem 1.75rem;
  border-radius: 10px;
  transition: all 0.2s; text-decoration: none;
}
.btn-hero-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.2); text-decoration: none; }
.btn-hero-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.btn-hero-secondary {
  display: inline-flex; align-items: center; justify-content: center;
  background: transparent; color: #fff;
  font-weight: 600; font-size: 0.95rem;
  padding: 0.8rem 1.75rem;
  border: 2px solid rgba(255,255,255,0.5);
  border-radius: 10px;
  transition: all 0.2s; text-decoration: none;
}
.btn-hero-secondary:hover { border-color: #fff; text-decoration: none; }

.hero__trust {
  display: flex; align-items: center; gap: 1.5rem;
  flex-wrap: wrap;
}

.trust-item { display: flex; flex-direction: column; }
.trust-item strong { font-size: 1.3rem; font-weight: 700; }
.trust-item span { font-size: 0.75rem; opacity: 0.8; }
.trust-sep { width: 1px; height: 32px; background: rgba(255,255,255,0.3); }

.hero__visual {
  position: relative; width: 200px; height: 200px; flex-shrink: 0;
  display: none;
}
@media (min-width: 768px) { .hero__visual { display: block; } }

.hero__circle {
  position: absolute; border-radius: 50%;
  background: rgba(255,255,255,0.08);
}
.hero__circle--1 { width: 200px; height: 200px; top: 0; left: 0; }
.hero__circle--2 { width: 140px; height: 140px; top: 30px; left: 30px; background: rgba(255,255,255,0.12); }
.hero__icon { position: absolute; top: 10px; left: 10px; width: 180px; height: 180px; }

/* ── Sections ── */
.section { padding: 4rem 1.5rem; }
.section--alt { background: var(--color-surface); }
.section--green {
  background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
  color: #fff;
}

.section__inner {
  max-width: 1000px; margin: 0 auto;
}
.section__inner--narrow { max-width: 660px; }

.section__label {
  font-size: 0.78rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--color-primary); margin: 0 0 0.5rem;
}
.section__label--light { color: rgba(255,255,255,0.7); }

.section__title {
  font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 700;
  margin: 0 0 2rem; color: var(--color-text);
}
.section__title--light { color: #fff; }

.section__subtitle { font-size: 0.95rem; color: var(--color-text-secondary); margin: -1.5rem 0 2rem; }

/* ── Benefícios ── */
.beneficios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}

.beneficio-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s;
}
.beneficio-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }

.beneficio-card__icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 1rem;
}
.beneficio-card__titulo { font-size: 1rem; font-weight: 700; margin: 0 0 0.5rem; }
.beneficio-card__desc { font-size: 0.85rem; color: var(--color-text-secondary); margin: 0; line-height: 1.55; }

/* ── Fluxo ── */
.fluxo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0;
  position: relative;
}

.fluxo-item {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 1.5rem 1rem;
  position: relative;
}

.fluxo-item__num {
  width: 44px; height: 44px;
  background: var(--color-primary);
  color: #fff;
  border-radius: 50%;
  font-size: 1.1rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 1rem; flex-shrink: 0;
}

.fluxo-item__titulo { font-size: 0.95rem; font-weight: 700; margin: 0 0 0.4rem; }
.fluxo-item__desc { font-size: 0.82rem; color: var(--color-text-secondary); margin: 0; line-height: 1.5; }

.fluxo-item__seta {
  display: none;
  position: absolute; right: -10px; top: 50%;
  transform: translateY(-50%);
  font-size: 1.3rem; color: var(--color-primary); font-weight: 700;
}

/* ── Simulador ── */
.simulador-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  display: flex; flex-direction: column; gap: 1.25rem;
}

.sim-field { display: flex; flex-direction: column; gap: 0.4rem; }
.sim-label { font-size: 0.875rem; font-weight: 600; color: var(--color-text); }

.sim-input-wrap {
  display: flex; align-items: center;
  border: 1.5px solid var(--color-border);
  border-radius: 10px; overflow: hidden;
  transition: border-color 0.2s;
}
.sim-input-wrap:focus-within { border-color: var(--color-primary); }

.sim-prefix {
  padding: 0 0.75rem;
  background: var(--color-surface-alt);
  color: var(--color-text-secondary);
  font-weight: 600; font-size: 0.9rem;
  border-right: 1px solid var(--color-border);
  align-self: stretch; display: flex; align-items: center;
}

.sim-input {
  flex: 1; padding: 0.75rem;
  border: none; outline: none;
  font-size: 1rem; font-family: inherit;
  color: var(--color-text);
}

.sim-resultado {
  display: grid; grid-template-columns: 1.5fr 1fr 1fr;
  gap: 0.75rem;
}

.sim-resultado__item {
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.9rem;
}
.sim-resultado__item--destaque {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
}

.sim-resultado__label { font-size: 0.72rem; color: var(--color-text-secondary); margin: 0; }
.sim-resultado__valor { font-size: 1.25rem; font-weight: 700; color: var(--color-primary); margin: 0.25rem 0 0; }
.sim-resultado__valor--sm { font-size: 1rem; }

.sim-barra-wrap { display: flex; flex-direction: column; gap: 0.3rem; }

.sim-barra {
  height: 10px; background: var(--color-border);
  border-radius: 999px; overflow: hidden;
}
.sim-barra__fill {
  height: 100%; background: var(--color-primary);
  border-radius: 999px; transition: width 0.5s ease;
}
.sim-barra__labels {
  display: flex; justify-content: space-between;
  font-size: 0.72rem; color: var(--color-text-secondary);
}

.sim-nota { font-size: 0.75rem; color: var(--color-text-secondary); margin: 0; font-style: italic; }

.sim-toggle {
  display: flex; align-items: center; gap: 0.75rem;
  cursor: pointer; padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-border); border-radius: var(--radius-md);
  background: var(--color-surface-alt);
}

.toggle-wrap { position: relative; flex-shrink: 0; }
.toggle-input { opacity: 0; width: 0; height: 0; position: absolute; }
.toggle-slider {
  width: 40px; height: 22px; background: var(--color-border);
  border-radius: 999px; display: block; transition: background 0.2s; position: relative;
}
.toggle-slider::after {
  content: ''; position: absolute;
  width: 16px; height: 16px; background: #fff;
  border-radius: 50%; top: 3px; left: 3px;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.toggle-input:checked ~ .toggle-slider { background: var(--color-primary); }
.toggle-input:checked ~ .toggle-slider::after { transform: translateX(18px); }
.sim-toggle__label { font-size: 0.875rem; font-weight: 600; }

/* ── ESG ── */
.esg-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem; margin-bottom: 1.5rem;
}

.esg-card {
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--radius-lg);
  padding: 1.25rem 1rem;
  text-align: center;
}
.esg-card__icon { font-size: 1.75rem; display: block; margin-bottom: 0.5rem; }
.esg-card__valor { font-size: 1.1rem; font-weight: 700; color: #fff; margin: 0; }
.esg-card__label { font-size: 0.75rem; color: rgba(255,255,255,0.75); margin: 0.25rem 0 0; line-height: 1.3; }
.esg-nota { font-size: 0.75rem; color: rgba(255,255,255,0.6); text-align: center; }

/* ── CTA ── */
.cta-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-lg);
}

.cta-card__title { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.5rem; }
.cta-card__desc { color: var(--color-text-secondary); margin: 0 0 1.75rem; font-size: 0.9rem; line-height: 1.6; }

.cta-form { display: flex; flex-direction: column; gap: 1rem; }
.cta-form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

/* ── Footer ── */
.pub-footer {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: 1.5rem 2rem;
  display: flex; align-items: center; justify-content: space-between;
  font-size: 0.82rem; color: var(--color-text-secondary);
  flex-wrap: wrap; gap: 0.5rem;
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .hero { padding: 3rem 1.25rem 2.5rem; }
  .cta-form__row { grid-template-columns: 1fr; }
  .sim-resultado { grid-template-columns: 1fr 1fr; }
  .sim-resultado__item--destaque { grid-column: 1 / -1; }
  .beneficios-grid { grid-template-columns: 1fr; }
}
</style>
