import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#041d13',
            color: '#4ade80',
            borderRadius: '10px',
            padding: '16px 24px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            fontSize: '16px',
            fontWeight: 500,
            minWidth: '300px',
            justifyContent: 'center',
          },
          success: {
            iconTheme: {
              primary: '#4ade80',
              secondary: '#041d13',
            },
          },
        }}
      />
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
