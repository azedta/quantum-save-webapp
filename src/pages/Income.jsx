import {useContext, useEffect, useMemo, useState} from 'react';
import Dashboard from '../components/Dashboard.jsx';
import {useUser} from '../hooks/useUser.jsx';
import axiosConfig from '../util/axiosConfig.jsx';
import {API_ENDPOINTS} from '../util/apiEndpoints.js';
import toast from 'react-hot-toast';
import Modal from '../components/Modal.jsx';
import DeleteAlert from '../components/DeleteAlert.jsx';

import IncomeOverview from '../components/IncomeOverview.jsx';
import IncomeList from '../components/IncomeList.jsx';
import AddIncomeForm from '../components/AddIncomeForm.jsx';

import {AppContext} from '../context/AppContext.jsx';

const STALE_TIME_MS = 60_000;

const CardSkeleton = () => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
    <div className="h-5 w-44 bg-slate-100 rounded animate-pulse" />
    <div className="mt-3 h-4 w-72 bg-slate-100 rounded animate-pulse" />
    <div className="mt-6 h-56 w-full bg-slate-100 rounded-2xl animate-pulse" />
  </div>
);

const ListSkeleton = () => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-5 w-44 bg-slate-100 rounded animate-pulse" />
        <div className="mt-3 h-4 w-60 bg-slate-100 rounded animate-pulse" />
      </div>
      <div className="flex gap-2">
        <div className="h-9 w-28 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-9 w-32 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    </div>

    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-20 rounded-2xl border border-slate-200 bg-slate-50 animate-pulse"
        />
      ))}
    </div>
  </div>
);

const Income = () => {
  const { user, authLoading } = useUser(); // ✅ IMPORTANT (gate requests)

  const {
    incomeData,
    setIncomeData,
    incomeFetchedAt,
    setIncomeFetchedAt,
    categories,
    fetchCategories,
    categoriesLoaded,
    fetchDashboardData,
    invalidateDashboard,
  } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });

  const incomeCategories = useMemo(
    () => categories.filter((c) => c.type === 'income'),
    [categories],
  );

  const categoryIconById = useMemo(() => {
    const map = new Map();
    (categories ?? []).forEach((c) => map.set(Number(c.id), c.icon));
    return map;
  }, [categories]);

  const fetchIncomeDetails = async () => {
    const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
    if (response.status === 200) setIncomeData(response.data ?? []);
  };

  useEffect(() => {
    // ✅ wait auth
    if (authLoading) return;
    if (!user) return;

    const fetchIfNeeded = async () => {
      const now = Date.now();
      const isStale = !incomeFetchedAt || now - incomeFetchedAt > STALE_TIME_MS;

      // ✅ if we fetched recently (even if empty), and categories are ready, skip
      if (!isStale && categoriesLoaded) return;

      setLoading(true);
      try {
        await Promise.all([
          fetchIncomeDetails(),
          categoriesLoaded ? Promise.resolve() : fetchCategories(),
        ]);
        setIncomeFetchedAt(Date.now());
      } catch (error) {
        if (error?.response?.status === 401) return;
        console.error('Failed to fetch income data:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch income data');
      } finally {
        setLoading(false);
      }
    };

    fetchIfNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  const refreshDashboardHard = async () => {
    invalidateDashboard?.();
    await fetchDashboardData?.({ force: true });
  };

  const handleAddIncome = async (income) => {
    const { name, amount, date, icon, categoryId } = income;

    if (!name?.trim()) return toast.error('Please enter a valid name');
    if (!amount || isNaN(amount) || Number(amount) < 0)
      return toast.error('Please enter a valid amount');
    if (!date) return toast.error('Please enter a valid date');
    if (!categoryId) return toast.error('Please select a category');

    try {
      const resolvedIcon = icon?.toString().trim()
        ? icon
        : (categoryIconById.get(Number(categoryId)) ?? null);

      const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, {
        name: name.trim(),
        amount: Number(amount),
        date,
        icon: resolvedIcon,
        categoryId: Number(categoryId),
      });

      if (response.status === 201) {
        setOpenAddIncomeModal(false);
        toast.success('Income added successfully');

        await Promise.all([fetchIncomeDetails(), refreshDashboardHard()]);
        setIncomeFetchedAt(Date.now());
      }
    } catch (error) {
      console.log('Failed to add income details: ', error);
      toast.error(error.response?.data?.message || 'Failed to add income details');
    }
  };

  const deleteIncome = async (id) => {
    if (!id && id !== 0) return toast.error('Invalid income id');

    try {
      const res = await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));

      // ✅ Optimistic UI update (so deletion works even if refresh fails)
      setIncomeData((prev) => (prev ?? []).filter((t) => t.id !== id));

      setOpenDeleteAlert({ show: false, data: null });

      toast.success(res?.data?.message || 'Income deleted successfully');

      // ✅ Keep your dashboard + list consistent
      await Promise.all([fetchIncomeDetails(), refreshDashboardHard()]);
      setIncomeFetchedAt(Date.now());
    } catch (error) {
      console.log('Error deleting income', error);
      toast.error(error.response?.data?.message || 'Failed to delete income');
    }
  };

  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.INCOME_EXCEL_DOWNLOAD, {
        responseType: 'blob',
      });

      const filename = 'income_details.xlsx';
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Downloaded income details successfully');
    } catch (error) {
      console.log('Failed to download income details: ', error);
      toast.error(error.response?.data?.message || 'Failed to download income details');
    }
  };

  const handleEmailIncomeDetails = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_INCOME);
      if (response.status === 200) toast.success('Income details emailed successfully');
    } catch (error) {
      console.error('Failed to email income details: ', error);
      toast.error(error.response?.data?.message || 'Failed to email income details');
    }
  };

  const showSkeleton = authLoading || loading;

  return (
    <Dashboard activeMenu="Income">
      <div className="space-y-6 py-2">
        {showSkeleton ? (
          <>
            <CardSkeleton />
            <ListSkeleton />
          </>
        ) : (
          <>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={async () => {
                if (!categoriesLoaded) await fetchCategories();
                setOpenAddIncomeModal(true);
              }}
            />

            <IncomeList
              transactions={incomeData}
              onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
              onDownload={handleDownloadIncomeDetails}
              onEmail={handleEmailIncomeDetails}
            />
          </>
        )}

        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} categories={incomeCategories} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income?"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};

export default Income;
