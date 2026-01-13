import Dashboard from '../components/Dashboard.jsx';
import { useUser } from '../hooks/useUser.jsx';
import InfoCard from '../components/InfoCard.jsx';
import { Coins, Wallet, WalletCards } from 'lucide-react';
import { addThousandsSeparator } from '../util/util.js';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import RecentTransactions from '../components/RecentTransactions.jsx';
import FinanceOverview from '../components/FinanceOverview.jsx';
import Transactions from '../components/Transactions.jsx';
import { AppContext } from '../context/AppContext.jsx';

const CardRowSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="h-[108px] rounded-3xl border border-slate-200 bg-slate-50 animate-pulse"
      />
    ))}
  </div>
);

const GridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="h-[340px] rounded-3xl border border-slate-200 bg-slate-50 animate-pulse"
      />
    ))}
  </div>
);

const Home = () => {
  const { user, authLoading } = useUser();
  const navigate = useNavigate();

  const { dashboardData, dashboardLoading, fetchDashboardData } = useContext(AppContext);

  // ✅ Prevent refetch spamming (especially in React strict mode / navigation)
  const didFetchRef = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;

    // ✅ if we already fetched once AND we already have data, don't refetch
    if (didFetchRef.current && dashboardData) return;

    didFetchRef.current = true;

    fetchDashboardData({ force: false }).catch((error) => {
      if (error?.response?.status === 401) return;
      console.error('Something went wrong while fetching dashboard data', error);
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]); // ✅ removed location.key and force:true

  const showSkeleton = authLoading || (dashboardLoading && !dashboardData);

  return (
    <Dashboard activeMenu="Dashboard">
      <div className="my-5 mx-auto space-y-6">
        {showSkeleton ? (
          <CardRowSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              icon={<WalletCards className="h-6 w-6" />}
              label="Total Balance"
              value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
              color="bg-gradient-to-br from-violet-600 to-indigo-600"
            />
            <InfoCard
              icon={<Wallet className="h-6 w-6" />}
              label="Total Income"
              value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
              color="bg-gradient-to-br from-emerald-500 to-teal-600"
            />
            <InfoCard
              icon={<Coins className="h-6 w-6" />}
              label="Total Expense"
              value={addThousandsSeparator(dashboardData?.totalExpense || 0)}
              color="bg-gradient-to-br from-rose-500 to-red-600"
            />
          </div>
        )}

        {showSkeleton ? (
          <GridSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecentTransactions
              transactions={dashboardData?.recentTransactions || []}
              onMore={() => navigate('/expense')}
            />

            <FinanceOverview
              totalBalance={dashboardData?.totalBalance || 0}
              totalIncome={dashboardData?.totalIncome || 0}
              totalExpense={dashboardData?.totalExpense || 0}
            />

            <Transactions
              transactions={dashboardData?.recent5Expenses || []}
              onMore={() => navigate('/expense')}
              type="expense"
              title="Recent Expenses"
            />

            <Transactions
              transactions={dashboardData?.recent5Incomes || []}
              onMore={() => navigate('/income')}
              type="income"
              title="Recent Incomes"
            />
          </div>
        )}
      </div>
    </Dashboard>
  );
};

export default Home;
