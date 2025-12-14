const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
      {/* soft accent glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-52 w-52 rounded-full opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full opacity-15 blur-3xl" />

      <div className="flex items-center gap-4">
        <div
          className={`h-12 w-12 rounded-2xl ${color} text-white flex items-center justify-center shadow-sm`}
        >
          <div className="opacity-95">{icon}</div>
        </div>

        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {label}
          </div>
          <div className="mt-1 text-2xl font-semibold text-slate-900 truncate">${value}</div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
