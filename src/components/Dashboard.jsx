import { useContext } from 'react';
import Menubar from './Menubar.jsx';
import Sidebar from './Sidebar.jsx';
import { AppContext } from '../context/AppContext.jsx';

const Dashboard = ({ children, activeMenu }) => {
  const { user } = useContext(AppContext);

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col">
      {/* Top bar */}
      <Menubar activeMenu={activeMenu} />

      {/* Main layout */}
      {user && (
        <div className="flex flex-1">
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
