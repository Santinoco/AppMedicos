'use client';

import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Turno {
    id: number;
    fecha: string;
    hora: string;
    medico: string;
    especialidad: string;
}

export default function MisTurnos() {
    const [date, setDate] = useState<Date | null>(null);
    const [nuevoTurno, setNuevoTurno] = useState({ hora: '', medico: '', especialidad: '', fecha: '' });

    useEffect(() => {
        setDate(new Date());
    }, []);

    if (!date) return null;

    const fechaSeleccionada = date.toLocaleDateString();
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-green-700 mb-4">Mis Turnos</h1>

            <div className="flex flex-col items-center">
                <select
                    className="w-full mb-2 p-2  border rounded"
                    value={nuevoTurno.especialidad}
                    onChange={(e) => setNuevoTurno({ ...nuevoTurno, especialidad: e.target.value })}
                    required
                >
                    <option value="">Seleccionar especialidad</option>
                    <option value="Clínica Médica">Clínica Médica</option>
                    <option value="Cardiología">Cardiología</option>
                    <option value="Pediatría">Pediatría</option>
                    <option value="Dermatología">Dermatología</option>
                    <option value="Ginecología">Ginecología</option>
                </select>
                <select
                    className="w-full mb-2 p-2 border rounded "
                    value={nuevoTurno.medico}
                    onChange={(e) => setNuevoTurno({ ...nuevoTurno, medico: e.target.value })}
                    required
                >
                    <option value="">Seleccionar médico</option>
                    <option value="Dr. López">Dr. López</option>
                    <option value="Dra. Ramírez">Dra. Ramírez</option>
                    <option value="Dr. Torres">Dr. Torres</option>
                </select>
                <select
                    className="w-full mb-2 p-2 border rounded"
                    value={nuevoTurno.hora}
                    onChange={(e) => setNuevoTurno({ ...nuevoTurno, hora: e.target.value })}
                    required
                >
                    <option value="">Seleccionar hora</option>
                    {Array.from({ length: 12 }, (_, i) => {
                        const hora = 9 + i;
                        const label = `${hora.toString().padStart(2, '0')}:00 hs`;
                        return (
                            <option key={hora} value={label}>
                                {label}
                            </option>
                        );
                    })}
                </select>
                <Calendar className="mt-5"
                    onChange={(value: Date | Date[]) => {
                        if (value instanceof Date) setDate(value);
                    }}
                    value={date}
                    selectRange={false}
                />
                <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-200 max-w-md mx-auto mt-6">
                    <h3 className="text-xl font-semibold text-center mb-4">
                        Turno seleccionado
                    </h3>
                    <p className="text-lg text-center">
                        <strong>{fechaSeleccionada} - {nuevoTurno.medico} - {nuevoTurno.hora}</strong>
                    </p>
                </div>


                <div className="mt-6 w-full max-w-md bg-green-50 p-4 rounded shadow">
                    <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
                        Agregar Turno
                    </button>

                </div>
            </div>
        </div>
    );
}
