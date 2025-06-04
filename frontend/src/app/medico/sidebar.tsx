export default function sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md p-6">
      <h2 className="text-2xl font-bold text-green-600 mb-6">Medico</h2>
      <nav className="flex flex-col gap-4">
        <a href="/medico" className="text-green-700 hover:underline">
          Inicio
        </a>
        <a href="/medico/mis-turnos" className="text-green-700 hover:underline">
          Mis turnos
        </a>
        <a
          href="/medico/agregar-turnos"
          className="text-green-700 hover:underline"
        >
          Agregar Turnos
        </a>
      </nav>
    </aside>
  );
}
