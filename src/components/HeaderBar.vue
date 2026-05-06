<template>
  <header class="header">
    <div class="header__inner">
      <div class="header__brand">
        <img src="/logo_grafismo_preciso_transparente.png" alt="EcoUrbis" class="header__logo" />
        <span class="header__name">EcoUrbis</span>
      </div>

      <div class="header__right">
        <div class="header__user">
          <div class="header__avatar" aria-hidden="true">
            {{ iniciais }}
          </div>
          <span class="header__username">{{ usuario.nome }}</span>
        </div>

        <button class="header__logout" @click="logout" aria-label="Sair da conta">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          <span class="header__logout-text">Sair</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useAuth } from '../composables/useAuth';

const { usuario, logout } = useAuth();

const iniciais = computed(() => {
  const partes = (usuario.value.nome || '').trim().split(' ');
  if (partes.length >= 2) return (partes[0][0] + partes[1][0]).toUpperCase();
  return (partes[0]?.[0] ?? 'U').toUpperCase();
});
</script>

<style scoped>
.header {
  background: var(--color-primary);
  color: #fff;
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
}

.header__inner {
  max-width: 1100px;
  margin: 0 auto;
  height: 100%;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
}

.header__logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.header__name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.3px;
}

.header__right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header__user {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.header__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
}

.header__username {
  font-size: 0.9rem;
  font-weight: 500;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header__logout {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  color: #fff;
  border-radius: 8px;
  padding: 0.45rem 0.9rem;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s;
}

.header__logout:hover { background: rgba(255,255,255,0.25); }

@media (max-width: 480px) {
  .header__username { display: none; }
  .header__logout-text { display: none; }
  .header__logout { padding: 0.45rem; }
}
</style>
