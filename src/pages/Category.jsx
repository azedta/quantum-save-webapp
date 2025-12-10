import Dashboard from '../components/Dashboard.jsx';
import { useUser } from '../hooks/useUser.jsx';

const Category = () => {
  useUser();
  return (
    <div>
      <Dashboard activeMenu="Category">This is category page</Dashboard>
    </div>
  );
};

export default Category;
