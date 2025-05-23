import { createRouter, createWebHistory } from 'vue-router';

// Telas de autenticação
import LoginPage from '../views/LoginPage.vue';
import Register from '../views/Register.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import NewPassword from '../views/NewPassword.vue';

// Seleção de perfil
import SelectProfile from '../views/SelectProfile.vue';

// Dashboards por perfil
import BeneficiarioProfile from '../views/BeneficiarioProfile.vue';
import ColetaProfile from '../views/ColetaProfile.vue';
import EmpresaParceira from '../views/EmpresaParceira.vue';
import CentralProfile from '../views/CentralProfile.vue';

// Funcionalidades
import GerarQrCode from '../views/GerarQrCode.vue';

const routes = [
  // Autenticação
  { path: '/', name: 'Login', component: LoginPage },
  { path: '/register', name: 'Register', component: Register },
  { path: '/forgot', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/new-password', name: 'NewPassword', component: NewPassword },

  // Perfil
  { path: '/select-profile', name: 'SelectProfile', component: SelectProfile },
  { path: '/perfil/beneficiario', name: 'BeneficiarioProfile', component: BeneficiarioProfile },
  { path: '/perfil/coleta', name: 'ColetaProfile', component: ColetaProfile },
  { path: '/perfil/empresa', name: 'EmpresaParceira', component: EmpresaParceira },
  { path: '/perfil/central', name: 'CentralProfile', component: CentralProfile },

  // Funcionalidades
  { path: '/gerar-qrcode', name: 'GerarQrCode', component: GerarQrCode }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;