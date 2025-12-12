import { Layers2, Pencil, Plus } from 'lucide-react';

const CategoryList = ({ categories, onEditCategory, onCreate, loading }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-slate-900">Category Sources</h4>
          <p className="text-sm text-slate-500 mt-1">Used across income and expense entries.</p>
        </div>
        <div className="text-xs text-slate-500">
          {loading ? 'Loading…' : `${categories.length} total`}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-2xl border border-slate-200 bg-slate-50 animate-pulse"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="text-slate-700 font-medium">No categories yet</p>
          <p className="text-sm text-slate-500 mt-1">
            Create your first category to start organizing transactions.
          </p>

          <button
            onClick={onCreate}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-violet-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-[0_0_18px_rgba(56,189,248,0.28)] transition hover:scale-[1.01] active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50 transition"
            >
              {/* Icon */}
              <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                {category.icon ? (
                  <span className="text-2xl leading-none">{category.icon}</span>
                ) : (
                  <Layers2 className="h-5 w-5 text-violet-500" />
                )}
              </div>

              {/* Details */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900 truncate">{category.name}</p>
                <p className="text-xs text-slate-500 mt-1 capitalize">{category.type}</p>
              </div>

              {/* Edit */}
              <button
                onClick={() => onEditCategory(category)}
                className="opacity-0 group-hover:opacity-100 transition inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-teal-600 hover:border-teal-200"
                title="Edit"
              >
                <Pencil size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
