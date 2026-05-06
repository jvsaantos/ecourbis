<template>
  <div>
    <HeaderBar />
    <div class="page-wrapper">
      <div class="page-card page-card--md select-card">
        <img src="/logo_grafismo_preciso_transparente.png" alt="EcoUrbis" class="page-logo" />
        <h2 class="page-title">Selecione seu perfil</h2>
        <p class="page-subtitle">Escolha como deseja acessar o sistema</p>

        <div class="profiles-grid">
          <button
            v-for="perfil in perfis"
            :key="perfil.id"
            class="profile-card"
            @click="select(perfil.id)"
          >
            <div class="profile-card__icon" :style="{ background: perfil.bg }">
              <component :is="perfil.icon" />
            </div>
            <span class="profile-card__label">{{ perfil.label }}</span>
            <span class="profile-card__desc">{{ perfil.desc }}</span>
            <div class="profile-card__arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue';
import { useRouter } from 'vue-router';
import HeaderBar from '../components/HeaderBar.vue';

const router = useRouter();

const IconBeneficiario = () => h('svg', { width: 28, height: 28, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
  h('path', { d: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2' }),
  h('circle', { cx: 12, cy: 7, r: 4 }),
]);

const IconColeta = () => h('svg', { width: 28, height: 28, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
  h('path', { d: 'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2' }),
  h('line', { x1: 10, y1: 11, x2: 10, y2: 17 }),
  h('line', { x1: 14, y1: 11, x2: 14, y2: 17 }),
]);

const IconEmpresa = () => h('svg', { width: 28, height: 28, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
  h('path', { d: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' }),
  h('polyline', { points: '9,22 9,12 15,12 15,22' }),
]);

const IconCentral = () => h('svg', { width: 28, height: 28, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
  h('polyline', { points: '23 6 13.5 15.5 8.5 10.5 1 18' }),
  h('polyline', { points: '17 6 23 6 23 12' }),
]);

const perfis = [
  {
    id: 'beneficiario',
    label: 'Beneficiário',
    desc: 'Acompanhe seu saldo e coletas',
    icon: IconBeneficiario,
    bg: '#E8F5E9',
  },
  {
    id: 'coleta',
    label: 'Funcionário de Coleta',
    desc: 'Registre coletas de resíduos',
    icon: IconColeta,
    bg: '#E3F2FD',
  },
  {
    id: 'empresa',
    label: 'Empresa Parceira',
    desc: 'Gerencie créditos e benefícios',
    icon: IconEmpresa,
    bg: '#FFF3E0',
  },
  {
    id: 'central',
    label: 'Central de Tratamento',
    desc: 'Compre e gerencie resíduos',
    icon: IconCentral,
    bg: '#F3E5F5',
  },
];

const select = (id) => router.push(`/perfil/${id}`);
</script>

<style scoped>
.select-card { text-align: center; }

.profiles-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 0.5rem;
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.22s ease;
  text-align: center;
  position: relative;
  font-family: inherit;
}

.profile-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.profile-card__icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-dark);
  margin-bottom: 0.25rem;
}

.profile-card__label {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--color-text);
}

.profile-card__desc {
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.profile-card__arrow {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  color: var(--color-border);
  transition: color var(--transition);
}

.profile-card:hover .profile-card__arrow { color: var(--color-primary); }

@media (max-width: 420px) {
  .profiles-grid { grid-template-columns: 1fr; }
}
</style>
