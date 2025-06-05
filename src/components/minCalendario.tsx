import { useState } from 'react';

export default function MiniCalendario() {
  const [fecha, setFecha] = useState('');

  return (
    <div style={{ maxWidth: 300, margin: 'auto', padding: 20 }}>
      <label htmlFor="fecha">Selecciona una fecha:</label>
      <input
        type="date"
        id="fecha"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        style={{ display: 'block', marginTop: 8, padding: 6, fontSize: 16 }}
      />
      {fecha && <p>Fecha seleccionada: {fecha}</p>}
    </div>
  );
}
