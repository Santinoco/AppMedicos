import "./globals.css";

export const metadata = {
  title: "App Medicos",
  description: "App de turnos medicos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
