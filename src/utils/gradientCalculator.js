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

export function calcularPeriodo({ tipo, A1, G, i, valorObjetivo, tipoDeCalculoObjetivo }) {
  // Aseguramos que la tasa de interés sea decimal
  // Si la tasa viene como porcentaje (ej. 5), la convertimos a decimal (0.05)
  let tasaInteres = parseFloat(i);
  if (tasaInteres >= 1) tasaInteres /= 100;


  // Definimos un rango de búsqueda para n y una tolerancia
  let n_min = 0.001; // No puede ser 0, para evitar divisiones por cero o logaritmos de cero
  let n_max = 500; // Puedes ajustar este máximo según los casos de uso esperados (ej. 500 períodos)
  const tolerancia = 0.001; // Tolerancia para la diferencia, ej. +/- 0.001 de la moneda

  // Función auxiliar que devuelve la diferencia entre el valor calculado y el objetivo
  const funcionADespejar = (n_prueba) => {
    // Si n_prueba es <= 0, devolver un valor muy grande para evitar logaritmos de cero o negativos
    if (n_prueba <= 0) return Number.MAX_VALUE;

    // Usamos la misma función calcularGradiente para obtener el valor calculado
    const valorCalculado = calcularGradiente({
      tipo,
      A1,
      G,
      n: n_prueba, // Aquí pasamos el 'n_prueba'
      i: tasaInteres,
      calculo: tipoDeCalculoObjetivo,
    });
    return valorCalculado - valorObjetivo;
  };

  let n_estimado = (n_min + n_max) / 2;
  let iteraciones = 0;
  const max_iteraciones = 500; // Límite para evitar bucles infinitos

  // Usamos el método de bisección
  let fa = funcionADespejar(n_min);
  let fb = funcionADespejar(n_max);

  // Pequeña validación inicial para ver si la raíz está en el rango
  // Esto es importante para el método de bisección
  if (fa * fb > 0) {
      console.warn("La función no cambia de signo en el intervalo inicial. Ajusta n_min/n_max o revisa los parámetros.");
      // Intentar una búsqueda un poco más amplia o un valor inicial diferente si es posible
      // Para este caso, podemos intentar ajustar si es que el valor objetivo está fuera del rango inicial
      // O simplemente retornar null si no se encuentra solución
      return { n_valor: null, n_formateado: "No se encontró período para los valores dados." };
  }


  while (Math.abs(funcionADespejar(n_estimado)) > tolerancia && iteraciones < max_iteraciones) {
    if (funcionADespejar(n_min) * funcionADespejar(n_estimado) < 0) {
      n_max = n_estimado;
    } else {
      n_min = n_estimado;
    }
    n_estimado = (n_min + n_max) / 2;
    iteraciones++;

    // Evitar bucle infinito si n_min y n_max se estancan
    if (n_min === n_max) break;
  }

  // Si no se encontró la solución con la tolerancia deseada
  if (iteraciones === max_iteraciones && Math.abs(funcionADespejar(n_estimado)) > tolerancia) {
      console.warn("No se pudo encontrar un 'n' con la precisión deseada dentro del número de iteraciones.");
      return { n_valor: null, n_formateado: "No se encontró período exacto." };
  }

  // Formateo del resultado
  // Asumiremos que 'i' es una tasa ANUAL para el formato de años y meses.
  // Si 'i' pudiera ser mensual, necesitarías un campo adicional en el formulario
  // para que el usuario especifique la unidad de tiempo de la tasa de interés.

  let resultadoFormateado = '';

  const anios = Math.floor(n_estimado);
  const mesesDecimal = (n_estimado - anios) * 12;
  const meses = Math.floor(mesesDecimal);
  const dias = Math.round((mesesDecimal - meses) * 30); // Usamos 30 días como aproximación

  if (anios > 0) {
    resultadoFormateado = `${anios} año${anios !== 1 ? 's' : ''}`;
    if (meses > 0) {
      resultadoFormateado += ` y ${meses} mes${meses !== 1 ? 'es' : ''}`;
    }
    if (dias > 0 && meses === 0) { // Solo si no hay meses, o si hay pero queremos más granularidad
      resultadoFormateado += `${meses > 0 ? ' y' : ''} ${dias} día${dias !== 1 ? 's' : ''}`;
    }
  } else if (meses > 0) {
    resultadoFormateado = `${meses} mes${meses !== 1 ? 'es' : ''}`;
    if (dias > 0) {
      resultadoFormateado += ` y ${dias} día${dias !== 1 ? 's' : ''}`;
    }
  } else if (dias > 0) {
    resultadoFormateado = `${dias} día${dias !== 1 ? 's' : ''}`;
  } else {
    resultadoFormateado = "Menos de un día"; // Para casos muy pequeños de n
  }


  return {
    n_valor: n_estimado, // Valor numérico exacto de n
    n_formateado: resultadoFormateado // String formateado
  };
}