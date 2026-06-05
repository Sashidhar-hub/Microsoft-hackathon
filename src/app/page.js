'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="gradient-mesh animate-fade-in"></div>
      {/* Floating Atmospheric Elements */}
      <div className="absolute top-20 left-[-100px] w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-20 right-[-100px] w-96 h-96 bg-secondary/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <main className="relative z-10 w-full max-w-[1440px] px-margin-page grid grid-cols-1 lg:grid-cols-12 items-center gap-gutter">
        {/* Left Column: Branding and Illustration (Visible on Desktop) */}
        <div className="hidden lg:flex lg:col-span-7 flex-col space-y-8 animate-fade-in pr-gutter">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-primary-container text-white rounded-full flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <div>
              <h1 className="font-headline-xl text-headline-xl font-extrabold text-primary leading-none">SmartCampus</h1>
              <p className="font-label-md text-label-md font-semibold text-secondary tracking-widest uppercase mt-1">Energy AI</p>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="font-display-lg text-display-lg text-on-background tracking-tight leading-tight">
              Optimize campus energy <br />with intelligent AI.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
              Real-time monitoring, AI-powered peak prediction, IoT heating & cooling automation, and deep building carbon analytics in one dashboard.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 pt-4 max-w-md">
            <div>
              <p className="text-3xl font-extrabold text-primary">15%</p>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Average Cost Savings</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-secondary">1.2T</p>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Daily CO2 Reduction</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-tertiary">94/100</p>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Sustainability Score</p>
            </div>
          </div>
        </div>

        {/* Right Column: Sign-in Card */}
        <div className="col-span-1 lg:col-span-5 flex justify-center w-full">
          <div className="acrylic-card w-full max-w-md p-8 rounded-2xl border border-outline-variant/30 flex flex-col space-y-6">
            <div className="space-y-1">
              <h3 className="font-headline-lg text-headline-lg font-bold text-on-background">Sign In</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Enter campus credentials to access the AI dashboard.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Campus Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">mail</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@campus.edu"
                    className="w-full bg-surface-container-lowest/50 border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3 pl-10 pr-4 text-body-md focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Password</label>
                  <a href="#" className="font-label-md text-xs text-primary hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">lock</span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface-container-lowest/50 border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl py-3 pl-10 pr-4 text-body-md focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <label htmlFor="remember" className="ml-2 font-body-md text-sm text-on-surface-variant cursor-pointer">
                  Remember this device
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-label-md text-label-md font-bold hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer mt-4"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-outline-variant/30"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-outline-variant/30"></div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full border border-outline-variant/50 bg-surface-container-lowest/50 hover:bg-surface-container transition-colors py-3 rounded-xl font-label-md text-label-md font-semibold text-on-background flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">vpn_key</span>
              <span>Use Single Sign-On (SSO)</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-6 w-full max-w-[1440px] px-margin-page flex flex-col md:flex-row justify-between items-center text-xs text-on-surface-variant gap-4 z-10">
        <p>© 2026 SmartCampus Energy AI. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-primary transition-colors">Security Standards</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Help Center</a>
        </div>
      </footer>
    </div>
  );
}
