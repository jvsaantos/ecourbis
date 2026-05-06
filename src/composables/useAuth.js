import { computed } from 'vue';
import { useRouter } from 'vue-router';

export function useAuth() {
  const router = useRouter();

  const usuario = computed(() => ({
    cpf: localStorage.getItem('cpf') || '',
    nome: localStorage.getItem('nome') || 'Usuário',
  }));

  const isAutenticado = computed(() => !!localStorage.getItem('cpf'));

  const salvarSessao = (dados) => {
    localStorage.setItem('cpf', dados.cpf);
    localStorage.setItem('nome', dados.nome);
  };

  const logout = () => {
    localStorage.clear();
    router.push('/');
  };

  return { usuario, isAutenticado, salvarSessao, logout };
}
