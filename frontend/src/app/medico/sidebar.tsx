"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export default function sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/medico", label: "Inicio" },
    { href: "/medico/mis-turnos", label: "Mis turnos" },
    { href: "/medico/agregar-turnos", label: "Agregar Turnos" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md p-6">
      <h2 className="text-2xl font-bold text-green-600 mb-6">Medico</h2>
      <nav className="flex flex-col gap-2">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "py-2 px-3 rounded transition",
              pathname === href
                ? "bg-green-100 text-green-800 font-semibold"
                : "text-green-700 hover:bg-green-200 hover:text-green-900"
            )}
          >
            {label}
          </Link>
        ))}
        <Link
          key={"/"}
          href={"/"}
          className={clsx(
            "py-2 px-3 rounded transition",
            pathname === "/"
              ? "bg-green-100 text-green-800 font-semibold"
              : "text-green-700 hover:bg-green-200 hover:text-green-900"
          )}
          onClick={() => localStorage.removeItem("token")}
          //invalidar token en backend ?
        >
          Cerrar sesion
        </Link>
      </nav>
    </aside>
  );
}
