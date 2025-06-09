import Sidebar from "./sidebar";

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
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar></Sidebar>
      {children}
    </div>
  );
}
