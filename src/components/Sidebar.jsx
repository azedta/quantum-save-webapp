import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { AppContext } from '../context/AppContext.jsx';
import { SIDEBAR_DATA } from '../assets/assets.js';

const Sidebar = ({ activeMenu }) => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <aside className="w-64 h-[calc(100vh-52px)] border-r border-slate-800/80 bg-slate-950/80 px-4 py-5 backdrop-blur-xl">
      {/* User avatar */}
      <div className="mt-2 mb-8 flex flex-col items-center justify-center gap-3">
        <div className="relative h-20 w-20">
          {/* Gradient ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-400 via-emerald-400 to-violet-500 opacity-80" />
          <div className="absolute inset-[3px] rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-9 w-9 text-slate-400" />
            )}
          </div>
        </div>

        <h5 className="text-sm font-medium text-slate-100">{user?.fullName || 'Guest'}</h5>
        <p className="text-xs text-slate-500">{user?.email || ''}</p>
      </div>

      {/* Nav items */}
      <nav className="space-y-1.5">
        {SIDEBAR_DATA.map((item, index) => {
          const isActive = activeMenu === item.label;

          return (
            <button
              key={`menu_${index}`}
              onClick={() => navigate(item.path)}
              className={`group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition ${
                isActive
                  ? 'bg-gradient-to-r from-teal-500 via-emerald-400 to-violet-500 text-slate-950 shadow-[0_0_25px_rgba(45,212,191,0.55)]'
                  : 'text-slate-300 hover:bg-slate-900/80 hover:text-slate-50'
              }`}
            >
              <item.icon
                className={`h-4 w-4 ${
                  isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-teal-300'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
