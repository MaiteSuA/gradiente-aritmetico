import React, { useState } from 'react';
import './GradientForm.css'; // si deseas separar estilos

const GradientForm = ({ onCalculate }) => {
  const [form, setForm] = useState({
    tipo: 'creciente',
    A1: '',
    G: '',
    n: '',
    i: '',
    calculo: 'valor_presente',
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
    if (form.n === '' || Number(form.n) <= 0) newErrors.n = 'Debe ser mayor que 0';
    if (form.i === '' || Number(form.i) < 0) newErrors.i = 'No puede ser negativa';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const parsed = {
      tipo: form.tipo,
      A1: parseFloat(form.A1),
      G: parseFloat(form.G),
      n: parseInt(form.n),
      i: parseFloat(form.i) / 100,
      calculo: form.calculo,
    };
    onCalculate(parsed);
  };

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

      <label>Número de periodos (n):</label>
      <input
        type="number"
        name="n"
        value={form.n}
        onChange={handleChange}
        className={errors.n ? 'input-error' : ''}
      />
      {errors.n && <p className="error-text">{errors.n}</p>}

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
      </select>

      <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Calcular
      </button>
    </form>
  );
};

export default GradientForm;
