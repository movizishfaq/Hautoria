import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2Icon,
  EyeIcon,
  EyeOffIcon,
  SparklesIcon } from
'lucide-react';
import { authService } from '../services/authService';
import { useAppState } from '../hooks/useAppState';
import { BrandLogo } from '../components/BrandLogo';
type Mode = 'signin' | 'signup' | 'forgot' | 'verify' | 'reset';
export function AuthPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, notify } = useAppState();
  const [mode, setMode] = useState<Mode>(
    params.get('mode') as Mode || 'signin'
  );
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState('');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === 'signin') {
        setUser(await authService.signIn(email, password));
        notify('Welcome back');
        navigate('/account');
      } else if (mode === 'signup') {
        setUser(await authService.signUp(name, email, password));
        setMode('verify');
        setSuccess(
          'A six-digit mock verification code has been prepared. Use any six digits.'
        );
      } else if (mode === 'forgot') {
        await authService.requestPasswordReset(email);
        setMode('reset');
        setSuccess('A reset link has been simulated for this frontend.');
      } else if (mode === 'reset') {
        setMode('signin');
        setSuccess('Password reset in demo. You can sign in now.');
      } else {
        const result = await authService.verifyOtp(email, otp);
        if (result.verified) {
          notify('Email verified');
          navigate('/account');
        } else setSuccess('Enter all six digits to verify.');
      }
    } finally {
      setBusy(false);
    }
  };
  const title: Record<Mode, string> = {
    signin: 'Welcome back.',
    signup: 'Begin your ritual.',
    forgot: 'Find your way back.',
    verify: 'One final detail.',
    reset: 'Set a new password.'
  };
  return (
    <main className="grid min-h-screen grid-cols-1 bg-ivory lg:grid-cols-2 dark:bg-[#181818]">
      <section className="hidden bg-charcoal p-14 text-ivory lg:flex lg:flex-col lg:justify-between">
        <BrandLogo to="/" size="lg" className="brightness-0 invert" />
        <div>
          <SparklesIcon className="h-8 w-8 text-gold" />
          <h1 className="mt-6 max-w-md font-serif text-6xl font-light leading-tight">
            Considered care, made{' '}
            <i className="text-gradient-gold">personal.</i>
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/60">
            Your profile remembers your rituals, rewards, addresses, and
            delivery history.
          </p>
        </div>
        <p className="text-xs uppercase tracking-luxe text-ivory/35">
          Secure demo interface · adapters ready for real auth
        </p>
      </section>
      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <BrandLogo to="/" size="md" className="lg:hidden" />
          <p className="mt-12 text-[.62rem] uppercase tracking-luxe text-gold">
            Account
          </p>
          <h1 className="mt-3 font-serif text-5xl">{title[mode]}</h1>
          <p className="mt-4 text-sm text-charcoal/60 dark:text-ivory/60">
            {mode === 'signin' ?
            'Sign in to continue your personal Hautoria experience.' :
            mode === 'signup' ?
            'Create an account to save your rituals and earn rewards.' :
            'A secure-looking frontend flow with no live credentials involved.'}
          </p>
          {success &&
          <p className="mt-5 flex items-center gap-2 rounded-xl bg-sage p-3 text-sm">
              <CheckCircle2Icon className="h-4 w-4" />
              {success}
            </p>
          }
          <form onSubmit={submit} className="mt-8 space-y-5">
            {mode === 'signup' &&
            <label className="block text-xs uppercase tracking-luxe">
                Name
                <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full border-b border-charcoal/20 bg-transparent py-3 text-base normal-case tracking-normal outline-none focus:border-gold dark:border-white/20" />
              
              </label>
            }
            {mode !== 'reset' && mode !== 'verify' &&
            <label className="block text-xs uppercase tracking-luxe">
                Email
                <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border-b border-charcoal/20 bg-transparent py-3 text-base normal-case tracking-normal outline-none focus:border-gold dark:border-white/20" />
              
              </label>
            }
            {mode === 'verify' &&
            <label className="block text-xs uppercase tracking-luxe">
                Six digit code
                <input
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="mt-2 w-full border-b border-charcoal/20 bg-transparent py-3 text-2xl tracking-[.5em] outline-none focus:border-gold dark:border-white/20" />
              
              </label>
            }
            {['signin', 'signup', 'reset'].includes(mode) &&
            <label className="block text-xs uppercase tracking-luxe">
                Password
                <div className="mt-2 flex border-b border-charcoal/20 dark:border-white/20">
                  <input
                  required
                  minLength={8}
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent py-3 text-base normal-case tracking-normal outline-none" />
                
                  <button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-label="Toggle password visibility">
                  
                    {show ?
                  <EyeOffIcon className="h-4 w-4" /> :

                  <EyeIcon className="h-4 w-4" />
                  }
                  </button>
                </div>
              </label>
            }
            {mode === 'signin' &&
            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked /> Remember me
              </label>
            }
            <button
              disabled={busy}
              className="w-full rounded-full bg-charcoal py-4 text-[.65rem] uppercase tracking-luxe text-ivory disabled:opacity-50 dark:bg-ivory dark:text-charcoal">
              
              {busy ?
              'One moment…' :
              mode === 'signin' ?
              'Sign in' :
              mode === 'signup' ?
              'Create account' :
              mode === 'forgot' ?
              'Send reset link' :
              mode === 'verify' ?
              'Verify email' :
              'Reset password'}
            </button>
          </form>
          {mode === 'signin' &&
          <>
              <button
              onClick={async () => {
                await authService.signInWithGoogle();
                setSuccess(
                  'Google is a visual mock provider. Connect OAuth in authService before launch.'
                );
              }}
              className="mt-4 w-full rounded-full border border-charcoal/20 py-3 text-xs uppercase tracking-luxe dark:border-white/20">
              
                Continue with Google{' '}
                <span className="normal-case text-charcoal/45 dark:text-ivory/45">
                  (demo)
                </span>
              </button>
              <button
              onClick={() => setMode('forgot')}
              className="mt-5 text-sm underline">
              
                Forgot password?
              </button>
            </>
          }
          {mode === 'signin' ?
          <p className="mt-8 text-sm text-charcoal/60 dark:text-ivory/60">
              New to Hautoria?{' '}
              <button
              onClick={() => setMode('signup')}
              className="text-gold underline">
              
                Create account
              </button>
            </p> :

          <button
            onClick={() => setMode('signin')}
            className="mt-8 text-sm underline">
            
              Return to sign in
            </button>
          }
        </div>
      </section>
    </main>);

}