import { Download, Mail } from 'lucide-react';
import TransactionInfoCard from './TransactionInfoCard.jsx';
import moment from 'moment';

const IncomeList = ({ transactions = [], onDelete }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h5 className="text-lg font-semibold text-slate-900">Income Sources</h5>
          <p className="text-sm text-slate-500 mt-1">All income transactions you’ve recorded.</p>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 hover:bg-slate-100 transition"
          >
            <Mail size={15} />
            Email
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 hover:bg-slate-100 transition"
          >
            <Download size={15} />
            Download
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {transactions.map((income) => (
          <TransactionInfoCard
            key={income.id}
            title={income.name}
            icon={income.icon}
            date={moment(income.date).format('Do MMM YYYY')}
            amount={income.amount}
            type="income"
            onDelete={() => onDelete(income.id)}
          />
        ))}
      </div>

      {transactions.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="text-slate-700 font-medium">No income yet</p>
          <p className="text-sm text-slate-500 mt-1">Add an income to see it appear here.</p>
        </div>
      )}
    </div>
  );
};

export default IncomeList;
