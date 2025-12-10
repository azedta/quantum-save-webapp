import Dashboard from '../components/Dashboard.jsx';
import { useUser } from '../hooks/useUser.jsx';

const Expense = () => {
  useUser();
  return (
    <div>
      <Dashboard activeMenu="Expense">This is expense page</Dashboard>
    </div>
  );
};

export default Expense;
