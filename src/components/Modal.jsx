import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6 border-b border-slate-200">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
                {title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Keep it clean and consistent across your finance flows.
              </p>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 sm:px-6 sm:py-6 text-slate-700">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
