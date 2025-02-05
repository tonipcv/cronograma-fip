"use client";

import { useState } from 'react';
import Link from 'next/link';

interface LoginFormProps {
  language: 'pt' | 'en';
  onLogin: (email: string, password: string) => Promise<void>;
}

export function LoginForm({ language, onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white/[0.02] border border-neutral-800 rounded-lg p-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500/50 transition-colors"
              placeholder={language === 'pt' ? 'Seu email' : 'Your email'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-2">
              {language === 'pt' ? 'Senha' : 'Password'}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500/50 transition-colors"
              placeholder={language === 'pt' ? 'Sua senha' : 'Your password'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 text-green-400 py-3 rounded-lg font-medium hover:from-green-500/30 hover:to-green-600/30 transition-all ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading 
              ? (language === 'pt' ? 'Entrando...' : 'Signing in...')
              : (language === 'pt' ? 'Entrar' : 'Sign in')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/cronograma/registro"
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            {language === 'pt' 
              ? 'Não tem cadastro? Registre-se aqui'
              : 'No account? Register here'}
          </Link>
        </div>
      </div>
    </div>
  );
} 