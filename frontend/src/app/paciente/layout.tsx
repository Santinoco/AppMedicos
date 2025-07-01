'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Toaster } from 'sonner';

export default function PacienteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: '/paciente', label: 'Inicio', exact: true },
    { href: '/paciente/mis-turnos', label: 'Mis turnos' },
    { href: '/paciente/listado-medicos', label: 'Cartilla de médicos' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold text-green-600 mb-6">Paciente</h2>
        <nav className="flex flex-col gap-2">
          {links.map(({ href, label, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(`${href}`);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'py-2 px-3 rounded transition',
                  isActive
                    ? 'bg-green-100 text-green-800 font-semibold'
                    : 'text-green-700 hover:bg-green-200 hover:text-green-900'
                )}
              >
                {label}
              </Link>
            );
          })}

          <Link
            href="/"
            className={clsx(
              'py-2 px-3 rounded transition',
              pathname === '/'
                ? 'bg-green-100 text-green-800 font-semibold'
                : 'text-green-700 hover:bg-green-200 hover:text-green-900'
            )}
            onClick={() => {
              localStorage.removeItem('access_token');
              localStorage.removeItem('user');
              localStorage.removeItem('user_id');
            }}
          >
            Cerrar sesión
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-10 space-y-6">
        {children}
        <Toaster richColors position="top-right"
          toastOptions={{
            className: 'text-base p-4 text-[1.1rem] max-w-md',
            style: {
              fontSize: '0.95rem',
              padding: '1rem 1.25rem',
              borderRadius: '0.75rem',
            },
          }} />
      </main>
    </div>
  );
}
