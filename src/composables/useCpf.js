import { ref, computed } from 'vue';

/** Aplica máscara XXX.XXX.XXX-XX conforme o usuário digita */
export function mascararCpf(valor) {
  const nums = String(valor ?? '').replace(/\D/g, '').slice(0, 11);
  if (nums.length <= 3) return nums;
  if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
  if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
  return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
}

/** Remove tudo que não é dígito */
export function limparCpf(valor) {
  return String(valor ?? '').replace(/\D/g, '');
}

/** Algoritmo oficial de validação de CPF */
export function validarCpf(cpf) {
  const nums = limparCpf(cpf);
  if (nums.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(nums)) return false; // sequências como 111.111.111-11

  const calc = (len) => {
    let soma = 0;
    for (let i = 0; i < len; i++) soma += parseInt(nums[i]) * (len + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return calc(9) === parseInt(nums[9]) && calc(10) === parseInt(nums[10]);
}

/**
 * Composable para uso em formulários com campo CPF.
 * Retorna estado reativo e handlers prontos para v-model.
 */
export function useCpf() {
  const cpfMascarado = ref('');
  const cpfErro = ref('');

  const cpfNums = computed(() => limparCpf(cpfMascarado.value));
  const cpfValido = computed(() => validarCpf(cpfNums.value));

  const onCpfInput = (e) => {
    const raw = typeof e === 'string' ? e : e.target.value;
    cpfMascarado.value = mascararCpf(raw);
    cpfErro.value = '';
  };

  const validarCampo = () => {
    if (!cpfNums.value) {
      cpfErro.value = 'Informe o CPF do beneficiário.';
      return false;
    }
    if (!cpfValido.value) {
      cpfErro.value = 'CPF inválido. Verifique os números.';
      return false;
    }
    cpfErro.value = '';
    return true;
  };

  const resetCpf = () => {
    cpfMascarado.value = '';
    cpfErro.value = '';
  };

  return { cpfMascarado, cpfNums, cpfValido, cpfErro, onCpfInput, validarCampo, resetCpf };
}
