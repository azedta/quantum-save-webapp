import Dashboard from '../components/Dashboard.jsx';
import { useUser } from '../hooks/useUser.jsx';

const Filter = () => {
  useUser();
  return (
    <div>
      <Dashboard activeMenu="Filters">This is filter page</Dashboard>
    </div>
  );
};

export default Filter;
