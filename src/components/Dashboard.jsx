import { useContext } from 'react';
import Menubar from './Menubar.jsx';
import Sidebar from './Sidebar.jsx';
import { AppContext } from '../context/AppContext.jsx';

const Dashboard = ({ children, activeMenu }) => {
  const { user } = useContext(AppContext);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-slate-950 text-slate-50">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-32 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* Top bar */}
      <Menubar activeMenu={activeMenu} />

      {/* Main layout */}
      {user && (
        <div className="flex">
          {/* Sidebar (desktop) */}
          <div className="hidden lg:block">
            <Sidebar activeMenu={activeMenu} />
          </div>

          {/* Content area */}
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
