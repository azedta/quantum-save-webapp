import Dashboard from '../components/Dashboard.jsx';
import { useUser } from '../hooks/useUser.jsx';
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import axiosConfig from '../util/axiosConfig.jsx';
import { API_ENDPOINTS } from '../util/apiEndpoints.js';
import TransactionInfoCard from '../components/TransactionInfoCard.jsx';
import moment from 'moment';
import toast from 'react-hot-toast';
import Input from '../components/Input.jsx';

const ResultSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="h-20 rounded-2xl border border-slate-200 bg-slate-50 animate-pulse" />
    ))}
  </div>
);

const Filter = () => {
  useUser();

  const [type, setType] = useState('income');
  const [resultsType, setResultsType] = useState('income');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [keyword, setKeyword] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const typeOptions = useMemo(
    () => [
      { value: 'income', label: 'Income' },
      { value: 'expense', label: 'Expense' },
    ],
    [],
  );

  const sortFieldOptions = useMemo(
    () => [
      { value: 'date', label: 'Date' },
      { value: 'amount', label: 'Amount' },
      { value: 'category', label: 'Category' },
    ],
    [],
  );

  const sortOrderOptions = useMemo(
    () => [
      { value: 'asc', label: 'Ascending' },
      { value: 'desc', label: 'Descending' },
    ],
    [],
  );

  const canClear =
    type !== 'income' ||
    startDate ||
    endDate ||
    keyword ||
    sortField !== 'date' ||
    sortOrder !== 'asc';

  const clearFilters = () => {
    setType('income');
    setStartDate('');
    setEndDate('');
    setKeyword('');
    setSortField('date');
    setSortOrder('asc');
    setTransactions([]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    // tiny validation
    if (startDate && endDate && startDate > endDate) {
      toast.error('Start date must be before end date.');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.APPLY_FILTER, {
        type,
        startDate,
        endDate,
        keyword,
        sortField,
        sortOrder,
      });
      setTransactions(response.data || []);
      setResultsType(type); // ✅ lock colors to the search type
    } catch (error) {
      console.error('Failed to fetch transactions', error);
      toast.error(
        error?.response?.data?.message || error.message || 'Failed to fetch transactions.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard activeMenu="Filters">
      <div className="space-y-6 py-2">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1">
              <Sparkles className="h-4 w-4 text-violet-600" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700">
                Smart Filters
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900 tracking-tight">
              Filter Transactions
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Slice your income & expenses by date range, keyword, and sorting — instantly.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearFilters}
              disabled={!canClear}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>

        {/* Filters card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center">
                <SlidersHorizontal className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h5 className="text-lg font-semibold text-slate-900">Select filters</h5>
                <p className="text-sm text-slate-500 mt-0.5">
                  Adjust parameters then run a search.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSearch}
            className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4"
          >
            <Input label="Type" value={type} onChange={setType} isSelect options={typeOptions} />

            <Input label="Start date" value={startDate} onChange={setStartDate} type="date" />

            <Input label="End date" value={endDate} onChange={setEndDate} type="date" />

            <Input
              label="Sort field"
              value={sortField}
              onChange={setSortField}
              isSelect
              options={sortFieldOptions}
            />

            <Input
              label="Sort order"
              value={sortOrder}
              onChange={setSortOrder}
              isSelect
              options={sortOrderOptions}
            />

            <div className="lg:col-span-1 flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label="Keyword"
                  value={keyword}
                  onChange={setKeyword}
                  type="text"
                  placeholder="e.g., rent, salary, uber…"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`mb-[2px] inline-flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-violet-500 text-slate-950 shadow-[0_0_18px_rgba(56,189,248,0.28)] transition hover:scale-[1.02] active:scale-[0.99] ${
                  loading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                title="Search"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h5 className="text-lg font-semibold text-slate-900">Results</h5>
              <p className="text-sm text-slate-500 mt-1">
                {loading
                  ? 'Fetching matching transactions…'
                  : transactions.length
                    ? `${transactions.length} transaction(s) found`
                    : 'Run a search to see results here.'}
              </p>
            </div>
          </div>

          {loading ? (
            <ResultSkeleton />
          ) : transactions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="text-slate-700 font-medium">No results yet</p>
              <p className="text-sm text-slate-500 mt-1">
                Select filters above and press the search button.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {transactions.map((transaction) => (
                <TransactionInfoCard
                  key={transaction.id}
                  title={transaction.name}
                  icon={transaction.icon}
                  date={moment(transaction.date).format('Do MMM YYYY')}
                  amount={transaction.amount}
                  type={transaction.type ?? resultsType}
                  hideDeleteBtn
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
};

export default Filter;
