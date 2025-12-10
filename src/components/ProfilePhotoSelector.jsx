import { useRef, useState } from 'react';
import { Trash, Upload, User } from 'lucide-react';

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-3 mb-4">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Avatar + upload badge */}
      <button type="button" onClick={onChooseFile} className="relative group focus:outline-none">
        {/* Gradient ring */}
        <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-teal-400 via-emerald-400 to-violet-500 p-[2px] shadow-[0_0_25px_rgba(56,189,248,0.45)] group-hover:shadow-[0_0_35px_rgba(168,85,247,0.45)] transition">
          <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img src={previewUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User className="h-9 w-9 text-slate-400" />
            )}
          </div>
        </div>

        {/* Upload badge */}
        <span className="absolute -bottom-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white border border-teal-300 shadow-[0_0_16px_rgba(56,189,248,0.55)]">
          <Upload className="h-4 w-4 text-teal-500" />
        </span>
      </button>

      {/* Remove + helper text */}
      {image && (
        <button
          type="button"
          onClick={handleRemoveImage}
          className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-red-500 transition"
        >
          <Trash className="h-3.5 w-3.5" />
          <span>Remove photo</span>
        </button>
      )}

      <p className="text-[11px] text-slate-500 text-center max-w-xs mb-2">
        Optional, but recommended. A clear photo makes your Quantum Save profile feel more personal.
      </p>
    </div>
  );
};

export default ProfilePhotoSelector;
