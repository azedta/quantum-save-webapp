import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import quantum_save_icon from '../assets/quantum-save-icon.png';
import Input from '../components/Input.jsx';
import { validateEmail } from '../util/validation.js';
import { API_ENDPOINTS } from '../util/apiEndpoints.js';
import axiosConfig from '../util/axiosConfig.jsx';
import { AppContext } from '../context/AppContext.jsx';
import { LoaderCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setInfo(null);

    // BASIC Validation
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
      const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      const { token, user, isActive, message } = response.data;

      // backend can return a success token even if account isn't active
      if (token) localStorage.setItem('token', token);
      if (user) setUser(user);

      if (isActive === false) {
        setInfo(
          message ||
            "Your account isn't activated yet. Please check your email for the verification link.",
        );
        navigate(`/verify-email?email=${encodeURIComponent(email)}`, { replace: true });
        return;
      }

      if (message) toast.success(message);
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        console.error('Something went wrong', error);
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError(null);
    setInfo(null);

    if (!email.trim()) {
      setError('Enter your email first, then click resend.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    try {
      setIsResending(true);
      const res = await axiosConfig.post(API_ENDPOINTS.RESEND_VERIFICATION, { email });
      toast.success(res?.data || 'If eligible, a verification email has been sent.');
      setInfo('If the account exists and is not active, a fresh verification link is on the way.');
    } catch (e) {
      console.error('Resend verification failed:', e);
      toast.error('Could not resend right now. Please try again.');
    } finally {
      setIsResending(false);
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
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-teal-700">
                Welcome back
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              Log in to your account
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-xs">
              Continue tracking your spending and stay in control of every transaction.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                value={email}
                onChange={setEmail}
                label="Email address"
                placeholder="name@example.com"
                type="email"
              />
              <Input
                value={password}
                onChange={setPassword}
                label="Password"
                placeholder="Enter your password"
                type="password"
              />
            </div>

            {info && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 text-center">
                <p>{info}</p>
                <button
                  type="button"
                  disabled={isResending}
                  onClick={handleResendVerification}
                  className={
                    isResending
                      ? 'mt-2 inline-flex items-center justify-center rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-800 opacity-60 cursor-not-allowed'
                      : 'mt-2 inline-flex items-center justify-center rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-amber-800 hover:bg-amber-100'
                  }
                >
                  {isResending ? 'Resending…' : 'Resend verification link'}
                </button>
              </div>
            )}

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
                  <span>Logging in…</span>
                </>
              ) : (
                'Log in'
              )}
            </button>

            <p className="text-xs sm:text-sm text-slate-500 text-center mt-4">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-purple-600 hover:text-purple-700 underline underline-offset-4 decoration-purple-300"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>

        <p className="mt-4 text-[11px] text-center text-slate-400">
          Need help? Reach out to <span className="text-slate-600">support@quantumsave.app</span>.
        </p>
      </div>
    </div>
  );
};

export default Login;
