// GradienteForm.js
import React, { useState } from 'react';

const GradientForm = ({ onCalculate }) => {
  const [form, setForm] = useState({
    tipo: 'creciente',
    A1: '',
    G: '',
    n: '', // Este campo será condicional
    i: '',
    calculo: 'valor_presente', // Ahora puede ser 'valor_presente', 'valor_futuro', o 'numero_periodos'
    valorObjetivo: '', // Nuevo campo para cuando se calcula el período
    tipoDeCalculoObjetivo: 'valor_presente', // Si el valorObjetivo es VP o VF
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: null }); // limpia errores al modificar
  };

  const validate = () => {
    const newErrors = {};
    if (form.A1 === '') newErrors.A1 = 'Requerido';
    if (form.G === '') newErrors.G = 'Requerido';
    if (form.i === '' || Number(form.i) < 0) newErrors.i = 'No puede ser negativa';

    // Validación condicional basada en lo que se va a calcular
    if (form.calculo === 'numero_periodos') {
      if (form.valorObjetivo === '' || Number(form.valorObjetivo) <= 0) {
        newErrors.valorObjetivo = 'Requerido y debe ser mayor que 0';
      }
    } else { // Si se calcula valor_presente o valor_futuro
      if (form.n === '' || Number(form.n) <= 0) newErrors.n = 'Debe ser mayor que 0';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const parsedData = {
      tipo: form.tipo,
      A1: parseFloat(form.A1),
      G: parseFloat(form.G),
      i: parseFloat(form.i), // La conversión a /100 se hará en la función de cálculo
      calculo: form.calculo,
    };

    // Añadir propiedades condicionalmente
    if (form.calculo === 'numero_periodos') {
      parsedData.valorObjetivo = parseFloat(form.valorObjetivo);
      parsedData.tipoDeCalculoObjetivo = form.tipoDeCalculoObjetivo;
    } else {
      parsedData.n = parseFloat(form.n); // Usamos parseFloat para permitir decimales en n si se desea
    }

    onCalculate(parsedData);
  };

  // Determinar si se está calculando "n" para mostrar/ocultar campos
  const isCalculatingN = form.calculo === 'numero_periodos';

  return (
    <form onSubmit={handleSubmit} className="gradient-form">
      <h2 className="text-xl font-bold mb-4">Cálculo de Gradiente Aritmético</h2>

      <label>Tipo de gradiente:</label>
      <select name="tipo" value={form.tipo} onChange={handleChange}>
        <option value="creciente">Creciente</option>
        <option value="decreciente">Decreciente</option>
      </select>

      <label>Valor inicial (A₁):</label>
      <input
        type="number"
        name="A1"
        value={form.A1}
        onChange={handleChange}
        className={errors.A1 ? 'input-error' : ''}
      />
      {errors.A1 && <p className="error-text">{errors.A1}</p>}

      <label>Gradiente (G):</label>
      <input
        type="number"
        name="G"
        value={form.G}
        onChange={handleChange}
        className={errors.G ? 'input-error' : ''}
      />
      {errors.G && <p className="error-text">{errors.G}</p>}

      {/* Campo 'n' se muestra solo si NO se está calculando 'n' */}
      {!isCalculatingN && (
        <>
          <label>Número de periodos (n):</label>
          <input
            type="number"
            name="n"
            value={form.n}
            onChange={handleChange}
            className={errors.n ? 'input-error' : ''}
          />
          {errors.n && <p className="error-text">{errors.n}</p>}
        </>
      )}

      {/* Campos para cuando se calcula el período ('n') */}
      {isCalculatingN && (
        <>
          <label>Valor Objetivo:</label>
          <input
            type="number"
            name="valorObjetivo"
            value={form.valorObjetivo}
            onChange={handleChange}
            className={errors.valorObjetivo ? 'input-error' : ''}
            placeholder="Ingrese el Valor Presente o Valor Futuro conocido"
          />
          {errors.valorObjetivo && <p className="error-text">{errors.valorObjetivo}</p>}

          <label>El Valor Objetivo es:</label>
          <select name="tipoDeCalculoObjetivo" value={form.tipoDeCalculoObjetivo} onChange={handleChange}>
            <option value="valor_presente">Valor Presente</option>
            <option value="valor_futuro">Valor Futuro</option>
          </select>
        </>
      )}

      <label>Tasa de interés anual (%):</label>
      <input
        type="number"
        name="i"
        value={form.i}
        onChange={handleChange}
        className={errors.i ? 'input-error' : ''}
      />
      {errors.i && <p className="error-text">{errors.i}</p>}

      <label>¿Qué deseas calcular?</label>
      <select name="calculo" value={form.calculo} onChange={handleChange}>
        <option value="valor_presente">Valor Presente</option>
        <option value="valor_futuro">Valor Futuro</option>
        <option value="numero_periodos">Número de Períodos (n)</option> {/* NUEVA OPCIÓN */}
      </select>

      <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Calcular
      </button>
    </form>
  );
};

export default GradientForm;