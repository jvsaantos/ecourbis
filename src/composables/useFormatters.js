export function useFormatters() {
  const formatarMoeda = (valor) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor ?? 0);

  const formatarPeso = (valor) =>
    `${parseFloat(valor ?? 0).toFixed(2).replace('.', ',')} kg`;

  const formatarCpfCnpj = (valor) => {
    const nums = String(valor ?? '').replace(/\D/g, '');
    if (nums.length <= 11) {
      return nums
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return nums
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  };

  const somentNumeros = (valor) => String(valor ?? '').replace(/\D/g, '');

  return { formatarMoeda, formatarPeso, formatarCpfCnpj, somentNumeros };
}
