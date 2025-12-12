import { useEffect, useState } from 'react';
import EmojiPickerPopup from './EmojiPickerPopup.jsx';
import Input from './Input.jsx';
import { LoaderCircle } from 'lucide-react';

const AddIncomeForm = ({ categories = [], onAddIncome }) => {
  const [income, setIncome] = useState({
    name: '',
    amount: '',
    date: '',
    icon: '',
    categoryId: '',
  });

  const [loading, setLoading] = useState(false);

  const categoryOptions = categories.map((category) => ({
    value: String(category.id),
    label: category.name,
  }));

  const handleChange = (key, value) => {
    setIncome((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddIncome = async () => {
    setLoading(true);
    try {
      await onAddIncome(income);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categories.length > 0 && !income.categoryId) {
      setIncome((prev) => ({ ...prev, categoryId: String(categories[0].id) }));
    }
  }, [categories, income.categoryId]);

  return (
    <div className="space-y-5">
      <EmojiPickerPopup
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
      />

      <Input
        value={income.name}
        onChange={(val) => handleChange('name', val)}
        label="Income source"
        placeholder="e.g., Salary, Freelance, Bonus"
        type="text"
      />

      <Input
        value={income.categoryId}
        onChange={(val) => handleChange('categoryId', val)}
        label="Category"
        isSelect={true}
        options={categoryOptions}
      />

      <Input
        value={income.amount}
        onChange={(val) => handleChange('amount', val)}
        label="Amount"
        placeholder="e.g., 500.00"
        type="number"
      />

      <Input
        value={income.date}
        onChange={(val) => handleChange('date', val)}
        label="Date"
        type="date"
      />

      <div className="flex justify-end pt-2">
        <button
          onClick={handleAddIncome}
          disabled={loading}
          type="button"
          className={
            loading
              ? 'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-violet-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 opacity-60 cursor-not-allowed shadow-[0_0_18px_rgba(56,189,248,0.28)]'
              : 'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-violet-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-[0_0_18px_rgba(56,189,248,0.28)] transition hover:scale-[1.01] active:scale-[0.99]'
          }
        >
          {loading ? (
            <>
              <LoaderCircle className="w-4 h-4 animate-spin" />
              Adding…
            </>
          ) : (
            <>Add Income</>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;
