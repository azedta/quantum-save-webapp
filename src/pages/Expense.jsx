import {useContext, useEffect, useState} from 'react';
import Dashboard from '../components/Dashboard.jsx';
import {useUser} from '../hooks/useUser.jsx';
import axiosConfig from '../util/axiosConfig.jsx';
import {API_ENDPOINTS} from '../util/apiEndpoints.js';
import toast from 'react-hot-toast';
import Modal from '../components/Modal.jsx';
import DeleteAlert from '../components/DeleteAlert.jsx';

import ExpenseOverview from '../components/ExpenseOverview.jsx';
import ExpenseList from '../components/ExpenseList.jsx';
import AddExpenseForm from '../components/AddExpenseForm.jsx';

import {AppContext} from '../context/AppContext.jsx';

const STALE_TIME_MS = 60_000; // 1 minute

// ✅ Skeletons to prevent flicker
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

const Expense = () => {
  useUser();

  // ✅ Cached across navigation
  const { expenseData, setExpenseData, expenseFetchedAt, setExpenseFetchedAt } =
    useContext(AppContext);

  // ✅ Page-local state
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });

  const fetchExpenseDetails = async () => {
    const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);
    if (response.status === 200) setExpenseData(response.data);
  };

  const fetchExpenseCategories = async () => {
    const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE('expense'));
    if (response.status === 200) setCategories(response.data);
  };

  // ✅ Only fetch if needed (cache + staleTime)
  useEffect(() => {
    const fetchIfNeeded = async () => {
      const now = Date.now();
      const isStale = !expenseFetchedAt || now - expenseFetchedAt > STALE_TIME_MS;

      // If we already have data and it's not stale, do nothing
      if (expenseData.length > 0 && !isStale) return;

      setLoading(true);
      try {
        await Promise.all([fetchExpenseDetails(), fetchExpenseCategories()]);
        setExpenseFetchedAt(Date.now());
      } catch (error) {
        console.error('Failed to fetch expense data:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch expense data');
      } finally {
        setLoading(false);
      }
    };

    fetchIfNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddExpense = async (expense) => {
    const { name, amount, date, icon, categoryId } = expense;

    if (!name?.trim()) return toast.error('Please enter a valid name');
    if (!amount || isNaN(amount) || Number(amount) < 0)
      return toast.error('Please enter a valid amount');
    if (!date) return toast.error('Please enter a valid date');

    const today = new Date().toISOString().split('T')[0];
    if (date > today) return toast.error('Date cannot be in the future');

    if (!categoryId) return toast.error('Please select a category');

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, {
        name,
        amount: Number(amount),
        date,
        icon,
        categoryId: Number(categoryId),
      });

      if (response.status === 201) {
        setOpenAddExpenseModal(false);
        toast.success('Expense added successfully');

        await fetchExpenseDetails(); // update cache
        setExpenseFetchedAt(Date.now());
      }
    } catch (error) {
      console.log('Failed to add expense details: ', error);
      toast.error(error.response?.data?.message || 'Failed to add expense details');
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success('Expense deleted successfully');

      await fetchExpenseDetails(); // update cache
      setExpenseFetchedAt(Date.now());
    } catch (error) {
      console.log('Error deleting expense', error);
      toast.error(error.response?.data?.message || 'Failed to delete expense');
    }
  };

  // OPTIONAL: If your backend doesn't support these, remove buttons in ExpenseList
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD, {
        responseType: 'blob',
      });

      const filename = 'expense_details.xlsx';
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Downloaded expense details successfully');
    } catch (error) {
      console.log('Failed to download expense details: ', error);
      toast.error(error.response?.data?.message || 'Failed to download expense details');
    }
  };

  const handleEmailExpenseDetails = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_EXPENSE);
      if (response.status === 200) toast.success('Expense details emailed successfully');
    } catch (error) {
      console.error('Failed to email expense details: ', error);
      toast.error(error.response?.data?.message || 'Failed to email expense details');
    }
  };

  return (
    <Dashboard activeMenu="Expense">
      <div className="space-y-6 py-2">
        {loading ? (
          <>
            <CardSkeleton />
            <ListSkeleton />
          </>
        ) : (
          <>
            <ExpenseOverview
              transactions={expenseData}
              onAddExpense={() => setOpenAddExpenseModal(true)}
            />

            <ExpenseList
              transactions={expenseData}
              onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
              onDownload={handleDownloadExpenseDetails}
              onEmail={handleEmailExpenseDetails}
            />
          </>
        )}

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} categories={categories} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </Dashboard>
  );
};

export default Expense;
