import { useEffect, useState } from 'react';
import { prepareExpenseLineChartData } from '../util/lineChartData.js';
import CustomLineChart from './CustomLineChart.jsx';
import { Plus } from 'lucide-react';

const ExpenseOverview = ({ transactions = [], onAddExpense }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareExpenseLineChartData(transactions);
    setChartData(result);
  }, [transactions]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h5 className="text-lg font-semibold text-slate-900">Expense Overview</h5>
          <p className="text-sm text-slate-500 mt-1">
            Track your spending over time and spot patterns early.
          </p>
        </div>

        <button
          onClick={onAddExpense}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-violet-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-[0_0_18px_rgba(56,189,248,0.28)] transition hover:scale-[1.01] active:scale-[0.99]"
          type="button"
        >
          <Plus size={16} />
          Add Expense
        </button>
      </div>

      <div className="mt-6">
        <CustomLineChart data={chartData} />
      </div>
    </div>
  );
};

export default ExpenseOverview;
