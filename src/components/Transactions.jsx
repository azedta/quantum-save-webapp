import { ArrowRight } from 'lucide-react';
import TransactionInfoCard from './TransactionInfoCard.jsx';
import moment from 'moment';

const Transactions = ({ transactions = [], onMore, type, title }) => {
  const list = transactions?.slice(0, 5) || [];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h5 className="text-lg font-semibold text-slate-900">{title}</h5>
          <p className="text-sm text-slate-500 mt-1">
            Latest {type === 'income' ? 'earnings' : 'spending'} entries.
          </p>
        </div>

        <button
          type="button"
          onClick={onMore}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 hover:bg-slate-100 transition"
        >
          More <ArrowRight size={15} />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <p className="text-slate-700 font-medium">Nothing here yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Add some {type === 'income' ? 'income' : 'expenses'} to populate this list.
            </p>
          </div>
        ) : (
          list.map((item) => (
            <TransactionInfoCard
              key={item.id}
              title={item.name}
              icon={item.icon}
              date={moment(item.date).format('Do MMM YYYY')}
              amount={item.amount}
              type={type}
              hideDeleteBtn
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Transactions;
