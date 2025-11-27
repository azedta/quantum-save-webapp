import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ label, value, onChange, placeholder, type = 'text' }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className="w-full rounded-xl border border-slate-700/80 bg-slate-900/60 px-3.5 py-2.5 pr-10 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition
                     focus:border-teal-400 focus:ring-2 focus:ring-teal-500/40 focus:ring-offset-0"
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full p-1 hover:bg-slate-800/80 transition"
          >
            {showPassword ? (
              <Eye className="h-4 w-4 text-teal-300" />
            ) : (
              <EyeOff className="h-4 w-4 text-slate-500" />
            )}
          </button>
        )}

        {/* subtle inner glow */}
        <div className="pointer-events-none absolute inset-px rounded-xl border border-white/5 shadow-[0_0_25px_rgba(15,23,42,0.8)]" />
      </div>
    </div>
  );
};

export default Input;
