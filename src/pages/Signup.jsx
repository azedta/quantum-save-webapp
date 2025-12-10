import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input.jsx';
import quantum_save_icon from '../assets/quantum-save-icon.png';
import { validateEmail } from '../util/validation.js';
import axiosConfig from '../util/axiosConfig.jsx';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../util/apiEndpoints.js';
import { LoaderCircle } from 'lucide-react';
import ProfilePhotoSelector from '../components/ProfilePhotoSelector.jsx';
import uploadProfileImage from '../util/uploadProfileImage.js';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    let profileImageUrl = '';

    // BASIC Validation
    if (!fullName.trim()) {
      setError('Please enter your full name');
      setIsLoading(false);
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      setIsLoading(false);
      return;
    }

    try {
      // Upload image if present
      if (profilePhoto) {
        const imageUrl = await uploadProfileImage(profilePhoto);
        profileImageUrl = imageUrl || '';
      }

      const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });

      if (response.status === 201) {
        toast.success('Profile created successfully.');
        navigate('/login');
      }
    } catch (err) {
      console.error('Something went wrong', err);
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md sm:max-w-lg">
        {/* Brand header */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex items-center gap-4">
            {/* Icon with soft glow */}
            <div className="relative h-12 w-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-teal-100 blur-xl" />
              <div className="absolute inset-0 rounded-2xl bg-violet-100 blur-xl" />
              <div className="relative h-full w-full rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                <img
                  src={quantum_save_icon}
                  alt="Quantum Save Logo"
                  className="h-7 w-7 object-contain drop-shadow-[0_0_4px_rgba(56,189,248,0.7)]"
                />
              </div>
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-xs font-semibold tracking-[0.3em] text-slate-500 uppercase">
                Quantum Save
              </span>
              <span className="text-[11px] text-slate-400">Personal finance, reimagined.</span>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-7 sm:px-8 sm:py-8 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-purple-600">
                Start your quantum journey
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              Create your account
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-xs">
              Track spending, visualize insights, and stay ahead of every transaction.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Profile photo selector */}
            <ProfilePhotoSelector image={profilePhoto} setImage={setProfilePhoto} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                label="Full name"
                placeholder="John Smith"
                type="text"
              />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email address"
                placeholder="name@example.com"
                type="email"
              />
              <div className="sm:col-span-2">
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Password"
                  placeholder="Create a strong password"
                  type="password"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 text-center">
                {error}
              </p>
            )}

            <button
              disabled={isLoading}
              className={
                isLoading
                  ? 'w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-violet-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-[0_0_25px_rgba(56,189,248,0.55)] transition-transform transition-shadow hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(168,85,247,0.45)] active:scale-[0.99] opacity-60 cursor-not-allowed'
                  : 'w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-violet-500 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-[0_0_25px_rgba(56,189,248,0.55)] transition-transform transition-shadow hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(168,85,247,0.45)] active:scale-[0.99]'
              }
              type="submit"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin w-5 h-5" />
                  Signing up ...
                </>
              ) : (
                'Sign up'
              )}
            </button>

            <p className="text-xs sm:text-sm text-slate-500 text-center mt-4">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-purple-600 hover:text-purple-700 underline underline-offset-4 decoration-purple-300"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>

        <p className="mt-4 text-[11px] text-center text-slate-400">
          By creating an account, you agree to our <span className="text-slate-600">Terms</span> &{' '}
          <span className="text-slate-600">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default Signup;
