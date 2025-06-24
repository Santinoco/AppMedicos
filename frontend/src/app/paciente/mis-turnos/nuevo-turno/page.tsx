'use client';

import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Doctor {
  user_id: number;
  user: {
    nombre: string;
    apellido: string;
  };
  specialty?: string;
  shift_start?: string;
  shift_end?: string;
}

interface Slot {
  slot_id: number;
  slot_datetime: string;
}

export default function MisTurnos() {
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [especialidadFiltro, setEspecialidadFiltro] = useState('');
  const [medicoSeleccionado, setMedicoSeleccionado] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(new Date());
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar doctores
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No autenticado. Por favor inicia sesión.');
      return;
    }
    fetch(`http://localhost:3000/doctors`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject('Error al obtener doctores'))
      .then(data => setDoctores(data))
      .catch(err => setError(String(err)));
  }, []);

  // Cargar slots cuando cambia el médico
  useEffect(() => {
    if (!medicoSeleccionado) {
      setSlots([]);
      return;
    }
    setLoading(true);
    const token = localStorage.getItem('access_token');
    fetch(`http://localhost:3000/calendar/doctor-available-slots?doctorUserId=${medicoSeleccionado.user_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject('Error al obtener slots'))
      .then(data => {
        setSlots(data);
        setLoading(false);
      })
      .catch(err => {
        setError(String(err));
        setLoading(false);
      });
  }, [medicoSeleccionado]);

  const especialidadesUnicas = Array.from(new Set(doctores.map(d => d.specialty || ''))).filter(Boolean);
  const doctoresFiltrados = especialidadFiltro ? doctores.filter(d => d.specialty === especialidadFiltro) : doctores;

  const formatHoraUTC = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    }).format(date);
  };

  const formatFecha = (date: Date | null) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-AR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    }).format(date);
  };

  const slotsFiltrados = fechaSeleccionada
    ? slots.filter(slot => {
        const date = new Date(slot.slot_datetime);
        return (
          date.getUTCFullYear() === fechaSeleccionada.getUTCFullYear() &&
          date.getUTCMonth() === fechaSeleccionada.getUTCMonth() &&
          date.getUTCDate() === fechaSeleccionada.getUTCDate()
        );
      })
    : [];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Agendar Nuevo Turno</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block font-medium mb-1">Filtrar por especialidad:</label>
        <select
          className="border rounded p-2 w-full"
          value={especialidadFiltro}
          onChange={e => setEspecialidadFiltro(e.target.value)}
        >
          <option value="">Todas</option>
          {especialidadesUnicas.map(esp => (
            <option key={esp} value={esp}>{esp}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Seleccionar médico:</label>
        <select
          className="border rounded p-2 w-full"
          value={medicoSeleccionado?.user_id || ''}
          onChange={e => {
            const selectedId = Number(e.target.value);
            const doc = doctores.find(d => d.user_id === selectedId) || null;
            setMedicoSeleccionado(doc);
            setHoraSeleccionada('');
          }}
        >
          <option value="">Seleccionar médico</option>
          {doctoresFiltrados.map(d => (
            <option key={d.user_id} value={d.user_id}>
              {d.user.nombre} {d.user.apellido} {d.specialty ? `- ${d.specialty}` : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6 relative">
        <button
          onClick={() => setDropdownAbierto(!dropdownAbierto)}
          className="w-full bg-gray-100 border rounded p-3 text-left"
        >
          {fechaSeleccionada && horaSeleccionada
            ? `${formatFecha(fechaSeleccionada)} - ${formatHoraUTC(horaSeleccionada)} hs`
            : 'Seleccionar fecha y hora'}
        </button>

        {dropdownAbierto && (
          <div className="absolute z-10 bg-white border shadow rounded mt-2 w-full p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Calendar
              onChange={(value) => {
                if (value instanceof Date) {
                  setFechaSeleccionada(value);
                  setHoraSeleccionada('');
                }
              }}
              value={fechaSeleccionada}
              minDate={new Date()}
              maxDate={new Date(new Date().setMonth(new Date().getMonth() + 3))}
              tileDisabled={({ date }) => date.getDay() === 0 || date.getDay() === 6}
            />

            <div>
              <p className="font-semibold mb-2">Horarios disponibles:</p>
              {loading ? (
                <p className="text-gray-500">Cargando...</p>
              ) : slotsFiltrados.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {slotsFiltrados.map(slot => (
                    <button
                      key={slot.slot_id}
                      onClick={() => setHoraSeleccionada(slot.slot_datetime)}
                      className={`px-3 py-2 rounded border text-sm ${
                        horaSeleccionada === slot.slot_datetime
                          ? 'bg-green-600 text-white'
                          : 'hover:bg-green-100'
                      }`}
                    >
                      {formatHoraUTC(slot.slot_datetime)} hs
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No hay turnos disponibles.</p>
              )}
              {horaSeleccionada && (
                <div className="mt-4">
                  <button
                    className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700"
                    onClick={() => setDropdownAbierto(false)}
                  >
                    OK
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {horaSeleccionada && (
        <div className="bg-white shadow rounded p-4 mt-6 border">
          <h2 className="text-lg font-semibold mb-2 text-green-700">Turno Seleccionado</h2>
          <p>
            <span className="font-medium">Médico: </span>
            {medicoSeleccionado.user.nombre} {medicoSeleccionado.user.apellido}
          </p>
          <p>
            <span className="font-medium">Especialidad: </span>
            {medicoSeleccionado.specialty || 'No especificada'}
          </p>
          <p>
            <span className="font-medium">Fecha: </span>
            {formatFecha(fechaSeleccionada)}
          </p>
          <p>
            <span className="font-medium">Hora: </span>
            {formatHoraUTC(horaSeleccionada)} hs
          </p>
        </div>
      )}

      <div className="mt-8 max-w-xs">
        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:opacity-50"
          disabled={!medicoSeleccionado || !fechaSeleccionada || !horaSeleccionada}
          onClick={async () => {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user?.id) {
              alert('No autenticado o paciente no definido.');
              return;
            }

            const turnoData = {
              doctor_id: medicoSeleccionado.user_id,
              patient_id: user.id,
              slot_datetime: horaSeleccionada,
              motivo: 'Consulta',
              estado_id: 1
            };

            try {
              const token = localStorage.getItem('access_token');
              const res = await fetch(`http://localhost:3000/appointments`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(turnoData)
              });

              if (!res.ok) {
                const err = await res.json();
                alert(`Error al agendar turno: ${err.message || res.statusText}`);
                return;
              }

              alert('Turno agendado correctamente');
              setHoraSeleccionada('');
              setFechaSeleccionada(new Date());
              setMedicoSeleccionado(null);
              setEspecialidadFiltro('');
            } catch (e) {
              alert('Error de conexión al agendar turno');
            }
          }}
        >
          Agendar Turno
        </button>
      </div>
    </div>
  );
}
