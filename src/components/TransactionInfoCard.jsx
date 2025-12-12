import { Trash2, TrendingDown, TrendingUp, UtensilsCrossed } from 'lucide-react';
import { addThousandsSeparator } from '../util/util.js';

const TransactionInfoCard = ({ icon, title, date, amount, type, hideDeleteBtn, onDelete }) => {
  const isIncome = type === 'income';

  const pill = isIncome
    ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
    : 'bg-rose-50 text-rose-800 border border-rose-100';

  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm hover:bg-slate-50 transition">
      {/* Icon */}
      <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
        {icon ? (
          <span className="text-2xl leading-none">{icon}</span>
        ) : (
          <UtensilsCrossed className="h-5 w-5 text-violet-500" />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900 truncate">{title}</p>
        <p className="text-xs text-slate-500 mt-1">{date}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {!hideDeleteBtn && (
          <button
            onClick={onDelete}
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 opacity-0 group-hover:opacity-100 hover:text-rose-600 hover:border-rose-200 transition"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        )}

        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${pill}`}>
          <span className="text-xs font-semibold">
            {isIncome ? '+' : '-'} ${addThousandsSeparator(amount)}
          </span>
          {isIncome ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
        </div>
      </div>
    </div>
  );
};

export default TransactionInfoCard;
