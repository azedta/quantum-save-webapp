import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ label, value, onChange, placeholder, type, isSelect, options }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
          {label}
        </label>
      )}
      <div className="relative">
        {isSelect ? (
          <select
            className="w-full bg-transparent outline-none border border-gray-300 rounded-md py-2 px-3 text-gray-700 leading focus:outline-none focus:border-blue-500"
            value={value}
            onChange={(e) => onChange(e)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition
                     focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-0"
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full p-1 hover:bg-slate-100 transition"
          >
            {showPassword ? (
              <Eye className="h-4 w-4 text-teal-500" />
            ) : (
              <EyeOff className="h-4 w-4 text-slate-400" />
            )}
          </button>
        )}

        {/* subtle inner outline for a soft, premium feel */}
        <div className="pointer-events-none absolute inset-px rounded-xl border border-white shadow-[0_0_10px_rgba(148,163,184,0.15)]" />
      </div>
    </div>
  );
};

export default Input;
