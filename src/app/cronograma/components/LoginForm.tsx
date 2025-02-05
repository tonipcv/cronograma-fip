"use client";

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

interface LoginFormProps {
  language: 'pt' | 'en';
  onLogin: (email: string, cpf: string) => Promise<void>;
}

export function LoginForm({ language, onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        cpf,
        redirect: false,
        callbackUrl: '/cronograma'
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Se o login for bem sucedido, redireciona
      if (result?.ok) {
        window.location.href = '/cronograma';
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Formata o CPF enquanto digita
  const handleCPFChange = (value: string) => {
    const cpfNumbers = value.replace(/\D/g, '');
    let formattedCPF = cpfNumbers;
    
    if (cpfNumbers.length > 3) {
      formattedCPF = `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3)}`;
    }
    if (cpfNumbers.length > 6) {
      formattedCPF = `${formattedCPF.slice(0, 7)}.${cpfNumbers.slice(6)}`;
    }
    if (cpfNumbers.length > 9) {
      formattedCPF = `${formattedCPF.slice(0, 11)}-${cpfNumbers.slice(9, 11)}`;
    }

    setCpf(formattedCPF);
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
              CPF
            </label>
            <input
              type="text"
              required
              value={cpf}
              onChange={(e) => handleCPFChange(e.target.value)}
              maxLength={14}
              className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500/50 transition-colors"
              placeholder={language === 'pt' ? 'Seu CPF' : 'Your CPF'}
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