import { useState } from 'react';
import { LoaderCircle, Trash2 } from 'lucide-react';

const DeleteAlert = ({ content, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">{content}</p>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className={
            loading
              ? 'inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white opacity-60 cursor-not-allowed shadow-sm'
              : 'inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm hover:bg-red-700 transition'
          }
        >
          {loading ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Deleting…
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Delete
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
