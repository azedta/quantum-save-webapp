import { useState } from 'react';
import { Smile, X } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const EmojiPickerPopup = ({ icon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emojiData) => {
    // Store emoji character (cleaner than imageUrl)
    onSelect(emojiData?.emoji || '');
    setIsOpen(false);
  };

  return (
    <div className="flex items-start justify-between gap-4">
      {/* Picker trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 hover:bg-slate-100 transition"
      >
        <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
          {icon ? (
            <span className="text-xl leading-none">{icon}</span>
          ) : (
            <Smile className="h-5 w-5 text-teal-600" />
          )}
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-slate-900">
            {icon ? 'Change icon' : 'Pick an icon'}
          </p>
          <p className="text-xs text-slate-500">Choose an emoji that represents this category.</p>
        </div>
      </button>

      {isOpen && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute -top-2 -right-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] overflow-hidden">
            <EmojiPicker open={isOpen} onEmojiClick={handleEmojiClick} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPickerPopup;
