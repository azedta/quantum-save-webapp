import { useEffect, useState } from 'react';
import EmojiPickerPopup from './EmojiPickerPopup.jsx';
import Input from './Input.jsx';
import { LoaderCircle } from 'lucide-react';

const AddExpenseForm = ({ categories = [], onAddExpense }) => {
  const [expense, setExpense] = useState({
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

  const handleChange = (key, value) => setExpense((prev) => ({ ...prev, [key]: value }));

  const handleAddExpense = async () => {
    setLoading(true);
    try {
      await onAddExpense(expense);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categories.length > 0 && !expense.categoryId) {
      setExpense((prev) => ({ ...prev, categoryId: String(categories[0].id) }));
    }
  }, [categories, expense.categoryId]);

  return (
    <div className="space-y-5">
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange('icon', selectedIcon)}
      />

      <Input
        value={expense.name}
        onChange={(val) => handleChange('name', val)}
        label="Expense name"
        placeholder="e.g., Groceries, Rent, Uber"
        type="text"
      />

      <Input
        value={expense.categoryId}
        onChange={(val) => handleChange('categoryId', val)}
        label="Category"
        isSelect={true}
        options={categoryOptions}
      />

      <Input
        value={expense.amount}
        onChange={(val) => handleChange('amount', val)}
        label="Amount"
        placeholder="e.g., 80.00"
        type="number"
      />

      <Input
        value={expense.date}
        onChange={(val) => handleChange('date', val)}
        label="Date"
        type="date"
      />

      <div className="flex justify-end pt-2">
        <button
          onClick={handleAddExpense}
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
            <>Add Expense</>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
