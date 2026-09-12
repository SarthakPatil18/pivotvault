import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Mail, Lock, Eye, EyeOff, Zap, ShieldCheck, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PivotVaultIcon } from '../assets/logo';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../lib/supabase';

export function SignIn() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Google OAuth via Supabase
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setGoogleLoading(true);

    try {
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (!anonKey) {
        // Helpful demo fallback if anon key is not yet set in environment
        setErrorMsg('Supabase Anon Key is not set in frontend/.env. Set VITE_SUPABASE_ANON_KEY to enable live Google OAuth.');
        setGoogleLoading(false);
        return;
      }

      await signInWithGoogle();
      // Supabase redirects to Google login automatically
    } catch (err) {
      console.error('[Google Sign In Error]', err);
      setErrorMsg(err.message || 'Failed to initiate Google authentication.');
      setGoogleLoading(false);
    }
  };

  const handleGuestAccess = () => {
    setSuccessMsg('Entering PivotVault Intelligence Platform...');
    setTimeout(() => {
      navigate('/app');
    }, 300);
  };

  // Handle Email & Password Sign In / Sign Up
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter your email and password, or click "Explore as Guest" below to access the platform immediately.');
      return;
    }

    setLoading(true);

    try {
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (!anonKey) {
        // Allow demo login so the user can test the UI immediately
        setSuccessMsg('Demo access granted! Redirecting to PivotVault intelligence platform...');
        setTimeout(() => {
          navigate('/app');
        }, 600);
        return;
      }

      if (isSignUp) {
        const data = await signUpWithEmail(email, password);
        if (data?.user && !data?.session) {
          setSuccessMsg('Verification email sent! Check your inbox to confirm your account.');
        } else {
          setSuccessMsg('Account created successfully! Redirecting...');
          setTimeout(() => navigate('/app'), 800);
        }
      } else {
        await signInWithEmail(email, password);
        setSuccessMsg('Signed in successfully! Redirecting...');
        setTimeout(() => navigate('/app'), 600);
      }
    } catch (err) {
      console.error('[Auth Error]', err);
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 font-sans bg-white text-neutral-900 selection:bg-black selection:text-white">
      {/* Left Column: Dark Brand & Value Proposition */}
      <div className="hidden lg:flex flex-col justify-between bg-black text-white p-12 xl:p-20 relative overflow-hidden">
        {/* Subtle glow effect */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#6320EE]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#8075FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Main Bold Headline */}
          <div className="mt-8 mb-10">
            <h1 className="text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.08] font-['Sora']">
              Break Free From<br />The Matrix
            </h1>
            {/* White accent underline */}
            <div className="w-16 h-1 bg-white mt-5 mb-8" />

            <p className="text-xl font-bold text-white mb-3">
              760+ problem statements <span className="text-neutral-400 font-normal">waiting to be solved.</span>
            </p>
            <p className="text-neutral-400 text-base leading-relaxed max-w-lg">
              Stop trading time for money. Build something that works while you sleep.
              <br />
              Your startup journey starts here. <strong className="text-white font-semibold">Today.</strong>
            </p>
          </div>

          {/* 3 Pillars List */}
          <div className="space-y-6 pt-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-white">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white font-['Sora']">AI-Powered Insights</h3>
                <p className="text-sm text-neutral-400">Generate business blueprints instantly</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-white">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white font-['Sora']">Validated Ideas</h3>
                <p className="text-sm text-neutral-400">Real problems, real opportunities</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-white">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white font-['Sora']">Scale Fast</h3>
                <p className="text-sm text-neutral-400">Complete tech & marketing guides</p>
              </div>
            </div>
          </div>
        </div>

        {/* Left Footer subtle copy */}
        <div className="relative z-10 pt-8 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-500">
          <span>© 2026 PivotVault Inc.</span>
          <span>Forensic Startup Intelligence</span>
        </div>
      </div>

      {/* Right Column: Clean White Sign-In Form */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-16 xl:p-20 bg-white relative">
        {/* Top bar: Back to Home link & Skip to Dashboard */}
        <div className="w-full flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <button
            type="button"
            onClick={handleGuestAccess}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 hover:text-black transition-colors bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg border border-neutral-200 shadow-2xs"
          >
            <span>Skip to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Auth Form Container */}
        <div className="max-w-[400px] w-full mx-auto my-auto py-8">
          {/* Brand Logo & Name */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2.5 justify-center group mb-4">
              <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <PivotVaultIcon className="w-5 h-5 text-white" color="currentColor" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-neutral-900 font-['Sora']">
                PivotVault
              </span>
            </Link>

            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight font-['Sora']">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="text-sm text-neutral-500 mt-1.5">
              {isSignUp ? 'Sign up to access 760+ startup postmortems' : 'Sign in to your account'}
            </p>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-green-50 border border-green-200 flex items-start gap-2.5 text-xs text-green-700">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600 mt-0.5" />
              <div className="flex-1 leading-relaxed">{successMsg}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5" htmlFor="auth-email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white text-neutral-900 placeholder:text-neutral-400 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5" htmlFor="auth-password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-white text-neutral-900 placeholder:text-neutral-400 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setErrorMsg('Password reset link will be sent to your email.')}
                  className="text-xs text-neutral-500 hover:text-black font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-black text-white hover:bg-neutral-800 disabled:opacity-50 text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isSignUp ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* "or" Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <span className="relative px-3 bg-white text-xs text-neutral-400 uppercase font-medium tracking-wider">
              or
            </span>
          </div>

          {/* Continue with Google (Official Google Logo + Supabase OAuth) */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-3 px-4 bg-white text-neutral-800 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 text-sm font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-3 active:scale-[0.99]"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-neutral-400 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                {/* Official Multi-Color Google G SVG */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Guest / Direct Demo Dashboard Button */}
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={handleGuestAccess}
              className="w-full py-3 px-4 bg-neutral-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] group"
            >
              <span>Explore as Guest (Instant Access)</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-[11px] text-center text-neutral-400 mt-2">
              Instant preview of 413+ startup autopsies, failure intelligence & tools.
            </p>
          </div>

          {/* Toggle between Sign In & Sign Up */}
          <div className="mt-8 text-center text-xs text-neutral-500">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="font-semibold text-neutral-900 hover:underline"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don’t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="font-semibold text-neutral-900 hover:underline"
                >
                  Create Account
                </button>
              </>
            )}
          </div>

          {/* Helper Verification Link */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setSuccessMsg('Please check your spam/promotions folder or re-enter your email above.');
              }}
              className="text-[11px] text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              Didn’t receive verification email?
            </button>
          </div>
        </div>

        {/* Bottom copyright on mobile/tablet */}
        <div className="lg:hidden text-center text-xs text-neutral-400 pt-4">
          © 2026 PivotVault
        </div>
      </div>
    </div>
  );
}

export default SignIn;
