export function calcularGradiente({ tipo, A1, G, n, i, calculo }) {
  const A = A1;
  const factor = Math.pow(1 + i, n);

  const valorPresente =
    A * ((factor - 1) / (i * factor)) +
    (tipo === 'creciente'
      ? G * ((factor - i * n - 1) / (i * i * factor))
      : -G * ((factor - i * n - 1) / (i * i * factor)));

  const valorFuturo =
    A * ((factor - 1) / i) +
    (tipo === 'creciente'
      ? G * ((factor - i * n - 1) / (i * i))
      : -G * ((factor - i * n - 1) / (i * i)));

  return calculo === 'valor_presente' ? valorPresente : valorFuturo;
}
