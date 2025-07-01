"use client";
import { Toaster} from 'sonner';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
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
