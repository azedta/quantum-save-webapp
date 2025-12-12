import Dashboard from '../components/Dashboard.jsx';
import { useUser } from '../hooks/useUser.jsx';
import { useEffect, useState } from 'react';
import axiosConfig from '../util/axiosConfig.jsx';
import { API_ENDPOINTS } from '../util/apiEndpoints.js';
import toast from 'react-hot-toast';
import IncomeList from '../components/IncomeList.jsx';
import Modal from '../components/Modal.jsx';
import AddIncomeForm from '../components/AddIncomeForm.jsx';
import DeleteAlert from '../components/DeleteAlert.jsx';
import IncomeOverview from '../components/IncomeOverview.jsx';

const Income = () => {
  useUser();

  const [incomeData, setIncomeData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });

  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOMES);
      if (response.status === 200) setIncomeData(response.data);
    } catch (error) {
      console.error('Failed to fetch income details: ', error);
      toast.error(error.response?.data?.message || 'Failed to fetch income details');
    } finally {
      setLoading(false);
    }
  };

  const fetchIncomeCategories = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.CATEGORY_BY_TYPE('income'));
      if (response.status === 200) setCategories(response.data);
    } catch (error) {
      console.log('Failed to fetch income categories:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch income categories');
    }
  };

  const handleAddIncome = async (income) => {
    const { name, amount, date, icon, categoryId } = income;

    if (!name.trim()) return toast.error('Please enter a valid name');
    if (!amount || isNaN(amount) || Number(amount) < 0)
      return toast.error('Please enter a valid amount');
    if (!date) return toast.error('Please enter a valid date');

    const today = new Date().toISOString().split('T')[0];
    if (date > today) return toast.error('Date cannot be in the future');

    if (!categoryId) return toast.error('Please select a category');

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, {
        name,
        amount: Number(amount),
        date,
        icon,
        categoryId: Number(categoryId),
      });

      if (response.status === 201) {
        setOpenAddIncomeModal(false);
        toast.success('Income added successfully');
        fetchIncomeDetails();
        fetchIncomeCategories();
      }
    } catch (error) {
      console.log('Failed to add income details: ', error);
      toast.error(error.response?.data?.message || 'Failed to add income details');
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axiosConfig.delete(API_ENDPOINTS.DELETE_INCOME(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success('Income deleted successfully');
      fetchIncomeDetails();
    } catch (error) {
      console.log('Error deleting income', error);
      toast.error(error.response?.data?.message || 'Failed to delete income');
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
    fetchIncomeCategories();
  }, []);

  return (
    <Dashboard activeMenu="Income">
      <div className="space-y-6 py-2">
        <IncomeOverview transactions={incomeData} onAddIncome={() => setOpenAddIncomeModal(true)} />

        <IncomeList
          transactions={incomeData}
          onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
        />

        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} categories={categories} />
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
