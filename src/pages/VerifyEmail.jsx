import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import quantum_save_icon from '../assets/quantum-save-icon.png';
import axiosConfig from '../util/axiosConfig.jsx';
import { API_ENDPOINTS } from '../util/apiEndpoints.js';
import { validateEmail } from '../util/validation.js';
import Input from '../components/Input.jsx';
import { LoaderCircle, MailCheck, ShieldCheck, ShieldX } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get('token');
  const initialEmail = params.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState('idle'); // idle | activating | success | error
  const [statusMsg, setStatusMsg] = useState(null);
  const [isResending, setIsResending] = useState(false);

  const title = useMemo(() => {
    if (status === 'activating') return 'Activating your account…';
    if (status === 'success') return 'Account activated';
    if (status === 'error') return 'Activation failed';
    return 'Verify your email';
  }, [status]);

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        setStatus('activating');
        setStatusMsg(null);

        const res = await axiosConfig.get(
          `${API_ENDPOINTS.ACTIVATE}?token=${encodeURIComponent(token)}`,
        );

        setStatus('success');
        setStatusMsg(res?.data || 'Your account is now active.');
        toast.success('Account activated. You can log in now.');

        setTimeout(() => navigate('/login', { replace: true }), 1200);
      } catch (e) {
        const msg =
          e?.response?.data ||
          e?.response?.data?.message ||
          'Activation token not found or already used.';
        setStatus('error');
        setStatusMsg(typeof msg === 'string' ? msg : 'Activation token not found or already used.');
      }
    })();
  }, [token, navigate]);

  const resend = async () => {
    if (!email.trim()) {
      toast.error('Please enter your email.');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email.');
      return;
    }

    try {
      setIsResending(true);
      const res = await axiosConfig.post(API_ENDPOINTS.RESEND_VERIFICATION, { email });
      toast.success(res?.data || 'If eligible, a verification email has been sent.');
    } catch (e) {
      console.error('Resend verification failed:', e);
      toast.error('Could not resend right now. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const Icon = status === 'success' ? ShieldCheck : status === 'error' ? ShieldX : MailCheck;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md sm:max-w-lg">
        {/* Brand header */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex items-center gap-4">
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
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-700">
                Email verification
              </span>
            </div>

            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
              {status === 'activating' ? (
                <LoaderCircle className="h-6 w-6 animate-spin" />
              ) : (
                <Icon className="h-6 w-6" />
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              {title}
            </h3>

            <p className="mt-2 text-sm text-slate-500 max-w-xs">
              {token
                ? 'We’re validating your activation token.'
                : 'We sent you a verification link. Click it to activate your account.'}
            </p>
          </div>

          {statusMsg && (
            <div
              className={
                status === 'success'
                  ? 'rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 text-center'
                  : 'rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 text-center'
              }
            >
              {statusMsg}
            </div>
          )}

          {/* Resend section (always available) */}
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Didn’t get the email?</p>
              <p className="mt-1 text-xs text-slate-500">
                Enter your email and we’ll send a fresh verification link (if the account exists and
                isn’t active).
              </p>

              <div className="mt-4 space-y-3">
                <Input
                  value={email}
                  onChange={setEmail}
                  label="Email address"
                  placeholder="name@example.com"
                  type="email"
                />

                <button
                  type="button"
                  onClick={resend}
                  disabled={isResending}
                  className={
                    isResending
                      ? 'w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900 opacity-60 cursor-not-allowed'
                      : 'w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-900 hover:bg-slate-100'
                  }
                >
                  {isResending ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Resending…
                    </>
                  ) : (
                    'Resend verification link'
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link
                to="/login"
                className="text-slate-600 hover:text-slate-900 underline underline-offset-4 decoration-slate-300"
              >
                Back to login
              </Link>
              <Link
                to="/signup"
                className="text-purple-600 hover:text-purple-700 underline underline-offset-4 decoration-purple-300"
              >
                Create a new account
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-4 text-[11px] text-center text-slate-400">
          Tip: Check your spam folder. If you’re on mobile, open the link in your default browser.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
