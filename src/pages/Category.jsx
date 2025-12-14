import Dashboard from '../components/Dashboard.jsx';
import { useUser } from '../hooks/useUser.jsx';
import { Layers2, Plus } from 'lucide-react';
import CategoryList from '../components/CategoryList.jsx';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosConfig from '../util/axiosConfig.jsx';
import { API_ENDPOINTS } from '../util/apiEndpoints.js';
import Modal from '../components/Modal.jsx';
import AddCategoryForm from '../components/AddCategoryForm.jsx';
import { AppContext } from '../context/AppContext.jsx';

const Category = () => {
  useUser();

  const { categories, categoriesLoading, fetchCategories } = useContext(AppContext);

  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories().catch((error) => {
      console.error('Something went wrong. Please try again.', error);
      toast.error(error?.response?.data?.message || error.message);
    });
  }, [fetchCategories]);

  const handleAddCategory = async (category) => {
    const { name, type, icon } = category;

    if (!name.trim()) return toast.error('Category name is required');

    const isDuplicate = categories.some((c) => c.name.toLowerCase() === name.toLowerCase().trim());
    if (isDuplicate) return toast.error('Category name already exists');

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, { name, type, icon });
      if (response.status === 201) {
        toast.success('Category added successfully.');
        setOpenAddCategoryModal(false);
        await fetchCategories({ force: true }); // refresh shared cache
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

    if (!name.trim()) return toast.error('Category name is required');
    if (!id) return toast.error('Category ID is required');

    try {
      await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id), { name, type, icon });
      setOpenEditCategoryModal(false);
      setSelectedCategory(null);
      toast.success('Category updated successfully.');
      await fetchCategories({ force: true }); // refresh shared cache
    } catch (error) {
      console.error('Error updating category', error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || 'Failed to update category.');
    }
  };

  return (
    <Dashboard activeMenu="Category">
      <div className="py-2">
        {/* Header */}
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="relative h-12 w-12 flex items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-teal-100 blur-xl" />
                <div className="absolute inset-0 rounded-2xl bg-violet-100 blur-xl" />
                <div className="relative h-full w-full rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  <Layers2 className="h-6 w-6 text-teal-600" />
                </div>
              </div>

              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                  Categories
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Organize income & expenses with clean, reusable sources.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                  <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600">
                    Total
                  </span>
                  <span className="text-[11px] font-semibold text-slate-900">
                    {(categories ?? []).length}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setOpenAddCategoryModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-violet-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.35)] transition hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] active:scale-[0.99]"
            >
              <Plus size={16} />
              Add Category
            </button>
          </div>
        </div>

        {/* List */}
        <CategoryList
          loading={categoriesLoading}
          categories={categories}
          onEditCategory={handleEditCategory}
          onCreate={() => setOpenAddCategoryModal(true)}
        />

        {/* Add Modal */}
        <Modal
          isOpen={openAddCategoryModal}
          onClose={() => setOpenAddCategoryModal(false)}
          title="Add Category"
        >
          <AddCategoryForm onAddCategory={handleAddCategory} />
        </Modal>

        {/* Edit Modal */}
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
  );
};

export default Category;
