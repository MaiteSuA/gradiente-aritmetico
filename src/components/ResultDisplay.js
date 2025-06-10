import React from 'react';

const ResultDisplay = ({ resultado, tipo }) => {
  if (resultado === null) return null;

  return (
    <div className="result-display mt-6 p-4 rounded-lg bg-white shadow-lg text-center">
      <h3 className="text-lg font-semibold text-green-700">Resultado:</h3>
      <p className="text-2xl font-bold text-black mt-2">
        {tipo === 'valor_presente' ? 'Valor Presente' : 'Valor Futuro'}: ${resultado.toFixed(2)}
      </p>
    </div>
  );
};

export default ResultDisplay;
