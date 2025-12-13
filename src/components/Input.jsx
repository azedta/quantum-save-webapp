import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  isSelect = false,
  options = [],
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const baseInputClasses =
    'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition ' +
    'placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30';

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
            className={`${baseInputClasses} appearance-none pr-8`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            className={`${baseInputClasses} pr-10`}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}

        {/* Password toggle */}
        {isPassword && !isSelect && (
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

        {/* subtle inner highlight */}
        <div className="pointer-events-none absolute inset-px rounded-xl border border-white/60 shadow-[0_0_8px_rgba(148,163,184,0.12)]" />
      </div>
    </div>
  );
};

export default Input;
