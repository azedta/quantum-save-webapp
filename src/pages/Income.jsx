import Dashboard from '../components/Dashboard.jsx';
import { useUser } from '../hooks/useUser.jsx';

const Income = () => {
  useUser();
  return (
    <div>
      <Dashboard activeMenu="Income">This is income page</Dashboard>
    </div>
  );
};

export default Income;
