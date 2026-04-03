'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword, loading } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const portalRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    portalRef.current = document.body;
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      if (mode === 'forgot') {
        const result = await resetPassword(email);
        if (result.error) {
          setError(result.error);
        } else {
          setSuccessMsg('Password reset link sent to your email.');
        }
        return;
      }

      const result = mode === 'login'
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password, name);

      if (result.error) {
        setError(result.error);
      } else if (mode === 'signup') {
        setSuccessMsg('Check your email for a confirmation link to complete signup.');
      } else {
        onClose();
      }
    } catch {
      setError('Authentication service is not configured. Please try again later.');
    }
  }

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-20 sm:pt-24 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md glass-card rounded-2xl p-8 border border-gold-primary/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
        </h2>

        {/* Google sign-in — hide in forgot mode */}
        {mode !== 'forgot' && (
          <>
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gold-primary/20 rounded-xl text-text-primary hover:bg-gold-primary/10 transition-all mb-6"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gold-primary/15" />
              <span className="text-text-secondary text-xs">or</span>
              <div className="flex-1 h-px bg-gold-primary/15" />
            </div>
          </>
        )}

        {mode === 'forgot' && (
          <p className="text-text-secondary text-sm mb-6">Enter your email and we&apos;ll send you a link to reset your password.</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:border-gold-primary/40 focus:outline-none"
              aria-label="Name"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:border-gold-primary/40 focus:outline-none"
            aria-label="Email"
          />
          {mode !== 'forgot' && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:border-gold-primary/40 focus:outline-none"
              aria-label="Password"
            />
          )}
          {mode === 'signup' && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full px-4 py-3 bg-bg-secondary/50 border border-gold-primary/15 rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:border-gold-primary/40 focus:outline-none"
              aria-label="Confirm Password"
            />
          )}

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          {successMsg && (
            <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-emerald-400 text-sm">{successMsg}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-semibold rounded-xl hover:from-gold-primary hover:to-gold-light transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        <div className="text-center text-text-secondary text-sm mt-6 space-y-2">
          {mode === 'login' && (
            <>
              <p>
                <button
                  onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }}
                  className="text-text-secondary/60 hover:text-gold-light transition-colors text-xs"
                >
                  Forgot password?
                </button>
              </p>
              <p>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => { setMode('signup'); setError(''); setSuccessMsg(''); setConfirmPassword(''); }}
                  className="text-gold-primary hover:text-gold-light transition-colors"
                >
                  Sign up
                </button>
              </p>
            </>
          )}
          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); setConfirmPassword(''); }}
                className="text-gold-primary hover:text-gold-light transition-colors"
              >
                Sign in
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <p>
              <button
                onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                className="text-gold-primary hover:text-gold-light transition-colors"
              >
                Back to Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, portalRef.current!);
}
