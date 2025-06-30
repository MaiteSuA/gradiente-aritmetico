// App.js
import React, { useState } from 'react';
import GradientForm from './components/GradientForm';
import ResultDisplay from './components/ResultDisplay';
import { calcularGradiente, calcularPeriodo } from './utils/gradientCalculator'; // Importa ambos
import './App.css';

function App() {
  const [resultado, setResultado] = useState(null);
  const [tipoCalculo, setTipoCalculo] = useState(''); // 'valor_presente', 'valor_futuro', 'numero_periodos'

  const handleCalculate = (datos) => {
    let res;
    if (datos.calculo === 'numero_periodos') {
      res = calcularPeriodo({
        tipo: datos.tipo,
        A1: datos.A1,
        G: datos.G,
        i: datos.i, // La función calcularPeriodo manejará la división por 100
        valorObjetivo: datos.valorObjetivo,
        tipoDeCalculoObjetivo: datos.tipoDeCalculoObjetivo,
      });
      // console.log("Resultado N:", res); // Para depuración
      setResultado(res); // res.n_formateado y res.n_valor
      setTipoCalculo('numero_periodos');
    } else {
      res = calcularGradiente({
        tipo: datos.tipo,
        A1: datos.A1,
        G: datos.G,
        n: datos.n,
        i: datos.i / 100, // Dividir aquí para calcularGradiente
        calculo: datos.calculo,
      });
      setResultado(res);
      setTipoCalculo(datos.calculo);
    }
  };

  return (
    <div className="App">
      <h1>SISTEMAS ECONOMICOS Feria Ecosist 1-2025 <br /> Grupo 4</h1>
      <GradientForm onCalculate={handleCalculate} />
      <ResultDisplay resultado={resultado} tipo={tipoCalculo} />
    </div>
  );
}

export default App;