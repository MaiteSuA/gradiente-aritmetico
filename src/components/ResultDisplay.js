// ResultDisplay.js
import React from 'react';

const ResultDisplay = ({ resultado, tipo }) => {
  if (resultado === null) return null;

  return (
    <div className="result-display mt-6 p-4 rounded-lg bg-white shadow-lg text-center">
      <h3 className="text-lg font-semibold text-green-700">Resultado:</h3>
      {tipo === 'numero_periodos' ? (
        <>
          <p className="text-xl font-bold text-black mt-2">
            Número de Períodos (n):
          </p>
          <p className="text-2xl font-bold text-black mt-2">
            {resultado.n_formateado}
          </p>
          {/* Opcionalmente, puedes mostrar el valor numérico exacto de 'n' */}
          {/* <p className="text-md text-gray-600">({resultado.n_valor.toFixed(4)} períodos)</p> */}
        </>
      ) : (
        <p className="text-2xl font-bold text-black mt-2">
          {tipo === 'valor_presente' ? 'Valor Presente' : 'Valor Futuro'}: ${resultado.toFixed(2)}
        </p>
      )}
    </div>
  );
};

export default ResultDisplay;