import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { AuthTab } from '../types';
import { ApiService } from '../services/api';

interface AuthViewProps {
  onLoginSuccess: (email: string, name: string, token?: string) => void;
}

export default function AuthView({ onLoginSuccess }: AuthViewProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [email, setEmail] = useState('nexus@auragen.ai');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Creative Pioneer');
  const [errorInput, setErrorInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorInput('Please enter email and password.');
      return;
    }
    setErrorInput('');
    setLoading(true);

    try {
      if (activeTab === 'signin') {
        const res = await ApiService.login(email, password);
        onLoginSuccess(res.user.email, res.user.name, res.access);
      } else {
        const res = await ApiService.register(email, name, password);
        onLoginSuccess(res.user.email, res.user.name, res.access);
      }
    } catch (e: any) {
      setErrorInput(e.message || 'Authentication coordinates rejected.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const res = await ApiService.googleLogin('mock-google-token');
      onLoginSuccess(res.user.email, res.user.name, res.access);
    } catch (e: any) {
      setErrorInput(e.message || 'Google authentication rejected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#05070C] text-[#e1e2ea] flex items-center justify-center p-4 relative font-body overflow-hidden">
      {/* Dynamic ambient glowing spheres */}
      <div className="absolute top-[-200px] left-[-200px] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#03b5d3]/5 to-transparent blur-[120px] pointer-events-none z-0"></div>

      <div className="w-full max-w-md px-4 z-10 animate-fade-up">
        {/* Branding Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-primary tracking-tighter mb-2 bg-gradient-to-r from-primary via-secondary to-[#8083ff] bg-clip-text text-transparent">
            AuraGen AI
          </h1>
          <p className="text-base text-on-surface-variant max-w-xs mx-auto opacity-90">
            Computational Elegance Awaits.
          </p>
        </div>

        {/* glassmorphic card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 shrink-0">
          {/* Tabs */}
          <div className="flex gap-6 mb-8 border-b border-white/5 pb-2">
            <button
              onClick={() => {
                setActiveTab('signin');
                setErrorInput('');
              }}
              className={`pb-2 text-lg font-semibold tracking-tight transition-all duration-300 relative cursor-pointer ${
                activeTab === 'signin' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Sign In
              {activeTab === 'signin' && (
                <div className="absolute bottom-[-9px] left-0 w-full h-[2px] bg-primary shadow-[0_0_12px_rgba(192,193,255,1)]"></div>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setErrorInput('');
              }}
              className={`pb-2 text-lg font-semibold tracking-tight transition-all duration-300 relative cursor-pointer ${
                activeTab === 'signup' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Create Account
              {activeTab === 'signup' && (
                <div className="absolute bottom-[-9px] left-0 w-full h-[2px] bg-primary shadow-[0_0_12px_rgba(192,193,255,1)]"></div>
              )}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-2">
            {activeTab === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-label font-semibold text-on-surface-variant uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    className="input-glass w-full rounded-lg py-3 px-4 text-sm text-on-surface placeholder:text-on-surface-variant/45"
                    placeholder="Alex Vance"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-label font-semibold text-on-surface-variant uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 w-5 h-5" />
                <input
                  className="input-glass w-full rounded-lg py-3 pl-11 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/45"
                  placeholder="nexus@auragen.ai"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-label font-semibold text-on-surface-variant uppercase tracking-wider">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    setEmail('nexus@auragen.ai');
                    setPassword('password123');
                    setErrorInput('Reset coordinates populated: credentials restored!');
                  }}
                  className="text-xs font-code text-secondary hover:text-[#acedff] transition-colors"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 w-5 h-5" />
                <input
                  className="input-glass w-full rounded-lg py-3 pl-11 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/45"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {errorInput && (
              <p className="text-xs text-[#ffb4ab] font-code py-1 bg-red-500/10 px-3 rounded-lg border border-red-500/10">
                {errorInput}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-glow w-full py-3.5 mt-2 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(73,75,214,0.3)] disabled:opacity-50 hover:shadow-[0_4px_25px_rgba(73,75,214,0.5)] active:scale-98 transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {activeTab === 'signin' ? 'Access Portal' : 'Register Account'}
                  <ArrowRight className="w-5 h-5 text-white/90" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-white/10"></div>
              <span className="px-4 font-code text-[10px] text-on-surface-variant uppercase tracking-widest leading-none">
                OR
              </span>
              <div className="flex-grow h-px bg-white/10"></div>
            </div>

            {/* Google Auth with SVG logo */}
            <button
              onClick={handleGoogleAuth}
              type="button"
              className="btn-ghost w-full py-3 rounded-lg flex items-center justify-center gap-3 text-sm text-on-surface font-semibold hover:border-white/30 cursor-pointer active:scale-98"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                ></path>
              </svg>
              Continue with Google
            </button>
          </form>

          {/* Secure footnote */}
          <p className="text-center font-code text-[10px] text-on-surface-variant mt-8 opacity-60 flex items-center justify-center gap-1">
            Secure encryption enabled. <ShieldCheck className="w-3.5 h-3.5 text-secondary inline" />
          </p>
        </div>
      </div>
    </div>
  );
}
