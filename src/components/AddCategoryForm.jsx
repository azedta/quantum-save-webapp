import { useEffect, useState } from 'react';
import Input from './Input.jsx';
import EmojiPickerPopup from './EmojiPickerPopup.jsx';
import { LoaderCircle } from 'lucide-react';

const AddCategoryForm = ({ onAddCategory, initialCategoryData, isEditing }) => {
  const [category, setCategory] = useState({
    name: '',
    type: 'income',
    icon: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && initialCategoryData) {
      setCategory(initialCategoryData);
    } else {
      setCategory({ name: '', type: 'income', icon: '' });
    }
  }, [isEditing, initialCategoryData]);

  const handleChange = (key, value) => setCategory((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onAddCategory(category);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <EmojiPickerPopup
        icon={category.icon}
        onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
      />

      <Input
        value={category.name}
        onChange={(e) => handleChange('name', e.target.value)}
        label="Category name"
        placeholder="e.g., Freelance, Salary, Groceries"
        type="text"
      />

      {/* Select (styled like your inputs) */}
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
          type="button"
          onClick={handleSubmit}
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
    </div>
  );
};

export default AddCategoryForm;
