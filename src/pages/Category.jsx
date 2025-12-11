import Dashboard from '../components/Dashboard.jsx';
import { useUser } from '../hooks/useUser.jsx';
import { Plus } from 'lucide-react';
import CategoryList from '../components/CategoryList.jsx';
import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../util/apiEndpoints.js';
import toast from 'react-hot-toast';
import axiosConfig from '../util/axiosConfig.jsx';
import Modal from '../components/Modal.jsx';
import AddCategoryForm from '../components/AddCategoryForm.jsx';

const Category = () => {
  useUser();
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategoryDetails = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
      if (response.status === 200) {
        console.log('Categories :', response.data);
        setCategoryData(response.data);
      }
    } catch (error) {
      console.error('Something went wrong. Please try again.', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryDetails();
  }, []);

  const handleAddCategory = async (category) => {
    const { name, type, icon } = category;

    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    // Check if Category Already Exists
    const isDuplicate = categoryData.some((category) => {
      return category.name.toLowerCase() === name.toLowerCase().trim();
    });

    if (isDuplicate) {
      toast.error('Category name already exists');
      return;
    }

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, { name, type, icon });
      if (response.status === 201) {
        toast.success('Category added successfully.');
        setOpenAddCategoryModal(false);
        fetchCategoryDetails();
      }
    } catch (error) {
      console.error('Error adding category', error);
      toast.error(error.response?.data?.message || 'Failed to add category.');
    }
  };

  const handleEditCategory = async (categoryToEdit) => {
    setSelectedCategory(categoryToEdit);
    setOpenEditCategoryModal(true);
  };

  const handleUpdateCategory = async (updatedCategory) => {
    const { id, name, type, icon } = updatedCategory;
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (!id) {
      toast.error('Category ID is required');
      return;
    }

    try {
      await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id), {
        name,
        type,
        icon,
      });
      setOpenEditCategoryModal(false);
      setSelectedCategory(null);
      toast.success('Category updated successfully.');
      fetchCategoryDetails();
    } catch (error) {
      console.error('Error updating category', error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || 'Failed to update category.');
    }
  };

  return (
    <div>
      <Dashboard activeMenu="Category">
        <div className="my-5 mx-auto">
          {/* Add Button to add category*/}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-semibold">All Categories</h2>
            <button
              onClick={() => setOpenAddCategoryModal(true)}
              className="add-btn flex items-center gap-1"
            >
              <Plus size={15} />
              Add Category
            </button>
          </div>

          {/* Category List*/}
          <CategoryList categories={categoryData} onEditCategory={handleEditCategory} />

          {/* Adding Category Modal*/}
          <Modal
            isOpen={openAddCategoryModal}
            onClose={() => setOpenAddCategoryModal(false)}
            title="Add Category"
          >
            <AddCategoryForm onAddCategory={handleAddCategory} />
          </Modal>

          {/* Updating Category Modal*/}
          <Modal
            isOpen={openEditCategoryModal}
            onClose={() => {
              setOpenEditCategoryModal(false);
              setSelectedCategory(null);
            }}
            title="Edit Category"
          >
            <AddCategoryForm
              initialCategoryData={selectedCategory}
              onAddCategory={handleUpdateCategory}
              isEditing={true}
            />
          </Modal>
        </div>
      </Dashboard>
    </div>
  );
};

export default Category;
