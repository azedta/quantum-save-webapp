import { useEffect, useMemo, useState } from 'react';
import Input from './Input.jsx';
import EmojiPickerPopup from './EmojiPickerPopup.jsx';
import { LoaderCircle } from 'lucide-react';

const AddCategoryForm = ({ onAddCategory, initialCategoryData, isEditing }) => {
  const initialId = useMemo(() => initialCategoryData?.id ?? null, [initialCategoryData]);

  const [category, setCategory] = useState({
    id: null,
    name: '',
    type: 'income',
    icon: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && initialCategoryData) {
      // ✅ guarantee id is included
      setCategory({
        id: initialCategoryData.id ?? null,
        name: initialCategoryData.name ?? '',
        type: initialCategoryData.type ?? 'income',
        icon: initialCategoryData.icon ?? '',
      });
    } else {
      setCategory({ id: null, name: '', type: 'income', icon: '' });
    }
  }, [isEditing, initialCategoryData]);

  const handleChange = (key, value) =>
    setCategory((prev) => ({
      ...prev,
      [key]: value,
      // ✅ never lose the id while editing
      ...(isEditing ? { id: prev.id ?? initialId } : {}),
    }));

  const validate = () => {
    if (!category.name?.trim()) return 'Please enter a category name';
    if (!category.type) return 'Please select category type';
    // icon optional — if you want to require it, uncomment:
    // if (!category.icon) return 'Please choose an icon';
    if (isEditing && !category.id) return 'Missing category id (cannot update)';
    return null;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();

    if (loading) return;

    const error = validate();
    if (error) return; // let Category.jsx show toast (or add toast here if you want)

    setLoading(true);
    try {
      const payload = isEditing
        ? { ...category, id: category.id ?? initialId } // ✅ absolute guarantee
        : { name: category.name.trim(), type: category.type, icon: category.icon };

      await onAddCategory(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <EmojiPickerPopup
        icon={category.icon}
        onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
      />

      <Input
        value={category.name}
        onChange={(val) => handleChange('name', val)}
        label="Category name"
        placeholder="e.g., Freelance, Salary, Groceries"
        type="text"
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
          Category type
        </label>
        <select
          value={category.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition
                     focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className={
            loading
              ? 'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-violet-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 opacity-60 cursor-not-allowed shadow-[0_0_18px_rgba(56,189,248,0.28)]'
              : 'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-violet-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-[0_0_18px_rgba(56,189,248,0.28)] transition hover:scale-[1.01] active:scale-[0.99]'
          }
        >
          {loading ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin" />
              {isEditing ? 'Updating…' : 'Adding…'}
            </>
          ) : (
            <>{isEditing ? 'Update Category' : 'Add Category'}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddCategoryForm;
