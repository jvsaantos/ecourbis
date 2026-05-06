import { createRouter, createWebHistory } from 'vue-router';

import LoginPage        from '../views/LoginPage.vue';
import Register         from '../views/Register.vue';
import ForgotPassword   from '../views/ForgotPassword.vue';
import NewPassword      from '../views/NewPassword.vue';
import SelectProfile    from '../views/SelectProfile.vue';
import BeneficiarioProfile from '../views/BeneficiarioProfile.vue';
import ColetaProfile    from '../views/ColetaProfile.vue';
import EmpresaParceira  from '../views/EmpresaParceira.vue';
import CentralProfile   from '../views/CentralProfile.vue';
import GerarQrCode      from '../views/GerarQrCode.vue';
import SejaParceiro     from '../views/SejaParceiro.vue';

const routes = [
  { path: '/',              name: 'Login',             component: LoginPage },
  { path: '/register',      name: 'Register',          component: Register },
  { path: '/forgot',        name: 'ForgotPassword',    component: ForgotPassword },
  { path: '/new-password',  name: 'NewPassword',       component: NewPassword },
  { path: '/seja-parceiro', name: 'SejaParceiro',      component: SejaParceiro },

  { path: '/select-profile',         name: 'SelectProfile',      component: SelectProfile,       meta: { requiresAuth: true } },
  { path: '/perfil/beneficiario',    name: 'Beneficiario',       component: BeneficiarioProfile, meta: { requiresAuth: true } },
  { path: '/perfil/coleta',          name: 'Coleta',             component: ColetaProfile,       meta: { requiresAuth: true } },
  { path: '/perfil/empresa',         name: 'Empresa',            component: EmpresaParceira,     meta: { requiresAuth: true } },
  { path: '/perfil/central',         name: 'Central',            component: CentralProfile,      meta: { requiresAuth: true } },
  { path: '/gerar-qrcode',           name: 'GerarQrCode',        component: GerarQrCode,         meta: { requiresAuth: true } },

  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

const DEV_MODE = false; // Mude para false quando o backend estiver pronto

router.beforeEach((to, _from, next) => {
  if (DEV_MODE && !localStorage.getItem('cpf')) {
    localStorage.setItem('cpf', '00000000000');
    localStorage.setItem('nome', 'Usuário Teste');
  }

  const isAuth = !!localStorage.getItem('cpf');
  if (to.meta.requiresAuth && !isAuth) return next('/');
  if (!to.meta.requiresAuth && isAuth && to.path === '/') return next('/select-profile');
  next();
});

export default router;
