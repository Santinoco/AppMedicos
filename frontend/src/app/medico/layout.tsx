import Sidebar from "./sidebar";
import { Toaster} from 'sonner';
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
       <main className="flex-1 p-10 space-y-6">
            {children}
            <Toaster richColors position="top-right"
              toastOptions={{
                className: 'text-base p-4 text-[1.1rem] max-w-md',
                style: {
                  fontSize: '1.1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: '0.75rem',
                },
              }} />
          </main>
    </div>
   
  );
}
