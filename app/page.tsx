'use client';

import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { motion } from 'motion/react';
import { Wallet, ShieldCheck, Zap, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const { user, loading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">loading...</div>;

  return (
    <div className="min-h-screen bg-background grid-line-overlay overflow-x-hidden">
      {/* Hero Section */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Wallet className="text-primary-foreground w-6 h-6" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight">VAULT</span>
        </div>
        <button 
          onClick={handleLogin}
          className="px-6 py-2 bg-surface border border-border rounded-full hover:bg-surface-hover transition-colors font-medium"
        >
          login
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>AI-powered savings for Ugandans</span>
            </div>
            <h1 className="text-6xl md:text-8xl leading-tight">
              secure your <br />
              <span className="text-primary">financial</span> future.
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl">
              Vault is your AI savings coach that understands the Ugandan context. 
              From boda boda riders to corporate professionals, we help you hit your goals in UGX.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={handleLogin}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-primary/20"
              >
                get started for free
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-[3rem] blur-3xl absolute -inset-4" />
            <div className="relative bg-surface border border-border rounded-[3rem] p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Saved</p>
                    <p className="text-4xl font-display font-bold">UGX 4,250,000</p>
                  </div>
                  <TrendingUp className="text-primary w-8 h-8 mb-1" />
                </div>
                <div className="h-48 bg-background/50 rounded-2xl border border-border flex items-end p-4 gap-2">
                  {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/20 hover:bg-primary transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-background border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">School Fees</p>
                    <p className="font-bold">85% complete</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-background border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Medical Fund</p>
                    <p className="font-bold">UGX 1.2M saved</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Features */}
      <section className="bg-surface border-y border-border py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">Safe & Secure</h3>
            <p className="text-muted-foreground">Your data is yours. We use bank-grade security to keep your financial plan protected.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <Zap className="text-accent w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">Smart Insights</h3>
            <p className="text-muted-foreground">Our AI analyzes your spending and suggests small micro-saves that add up over time.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">Goal Focused</h3>
            <p className="text-muted-foreground">Whether it&apos;s land, a new boda, or school fees, we keep you on track to hit your targets.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
