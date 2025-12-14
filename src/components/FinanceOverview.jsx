import { addThousandsSeparator } from '../util/util.js';
import CustomPieChart from './CustomPieChart.jsx';

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  const COLORS = ['#7C3AED', '#EF4444', '#10B981']; // violet / red / emerald

  const balanceData = [
    { name: 'Total Income', amount: totalIncome },
    { name: 'Total Expense', amount: totalExpense },
    { name: 'Total Balance', amount: totalBalance },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg font-semibold text-slate-900">Financial Overview</h5>
          <p className="text-sm text-slate-500 mt-1">A clean snapshot of your cashflow.</p>
        </div>
      </div>

      <CustomPieChart
        data={balanceData}
        label="Total Balance"
        totalAmount={`$${addThousandsSeparator(totalBalance)}`}
        colors={COLORS}
        showTextAnchor
      />
    </div>
  );
};

export default FinanceOverview;
