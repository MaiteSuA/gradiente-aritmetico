import React, { useState } from 'react';
import GradientForm from './components/GradientForm';
import ResultDisplay from './components/ResultDisplay';
import { calcularGradiente } from './utils/gradientCalculator';
import './App.css';

function App() {
  const [resultado, setResultado] = useState(null);
  const [tipoCalculo, setTipoCalculo] = useState('');

  const handleCalcular = (datos) => {
    const res = calcularGradiente(datos);
    setResultado(res);
    setTipoCalculo(datos.calculo);
  };

  return (
    <div className="App">
      <GradientForm onCalculate={handleCalcular} />
      <ResultDisplay resultado={resultado} tipo={tipoCalculo} />
    </div>
  );
}

export default App;

