import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import { LogOut, Menu, User, X } from 'lucide-react';
import quantum_save_icon from '../assets/quantum-save-icon.png';
import Sidebar from './Sidebar.jsx';

const Menubar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { user, clearUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setShowDropdown(false);
    clearUser?.();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between gap-5 px-4 py-3 sm:px-8">
        {/* Left: menu + brand */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setOpenSideMenu(!openSideMenu)}
            className="block lg:hidden rounded-full p-1.5 text-slate-600 hover:bg-slate-100 transition"
          >
            {openSideMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Brand */}
          <div className="flex items-center gap-3">
            {/* Icon with soft glow */}
            <div className="relative h-9 w-9 flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-teal-100 blur-xl" />
              <div className="absolute inset-0 rounded-2xl bg-violet-100 blur-xl" />
              <div className="relative h-full w-full rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                <img
                  src={quantum_save_icon}
                  alt="Quantum Save Logo"
                  className="h-6 w-6 object-contain drop-shadow-[0_0_4px_rgba(56,189,248,0.7)]"
                />
              </div>
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-500">
                Quantum Save
              </span>
              <span className="text-[11px] text-slate-400">Personal finance OS</span>
            </div>
          </div>
        </div>

        {/* Right: profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:border-teal-400/70 hover:text-teal-600 transition focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-2 focus:ring-offset-slate-100"
          >
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User className="h-4 w-4 text-teal-500" />
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              {/* User info */}
              <div className="border-b border-slate-200 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                    <User className="h-4 w-4 text-teal-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {user?.fullName || 'User'}
                    </p>
                    <p className="truncate text-xs text-slate-500">{user?.email || ''}</p>
                  </div>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <LogOut className="h-4 w-4 text-slate-400" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sidebar */}
      {openSideMenu && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <Sidebar activeMenu={activeMenu} />
        </div>
      )}
    </header>
  );
};

export default Menubar;
