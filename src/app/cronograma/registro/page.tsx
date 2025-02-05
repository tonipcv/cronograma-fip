"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function Registro() {
  const router = useRouter();
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    whatsapp: '',
    instagram: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formattedData = {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ''),
        whatsapp: formData.whatsapp.replace(/\D/g, ''),
        instagram: formData.instagram.startsWith('@') ? formData.instagram : `@${formData.instagram}`,
        email: formData.email.toLowerCase().trim(),
        enrollmentDate: new Date().toISOString(),
      };

      const response = await fetch('/api/cronograma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cadastrar');
      }

      const loginResult = await signIn('credentials', {
        email: formattedData.email,
        cpf: formattedData.cpf,
        redirect: false,
      });

      if (loginResult?.error) {
        throw new Error(loginResult.error);
      }

      router.push('/cronograma');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
      console.error('Erro no registro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      // Formata CPF
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
      
      setFormData(prev => ({ ...prev, [name]: formattedCPF }));
    } else if (name === 'whatsapp') {
      // Formata WhatsApp
      const phoneNumbers = value.replace(/\D/g, '');
      let formattedPhone = phoneNumbers;
      
      if (phoneNumbers.length > 2) {
        formattedPhone = `(${phoneNumbers.slice(0, 2)}) ${phoneNumbers.slice(2)}`;
      }
      if (phoneNumbers.length > 7) {
        formattedPhone = `${formattedPhone.slice(0, 10)}-${phoneNumbers.slice(7)}`;
      }
      
      setFormData(prev => ({ ...prev, [name]: formattedPhone }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="font-montserrat bg-black text-white min-h-screen">
      {/* Language Selector */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
          className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <Globe className="h-3 w-3" />
          {language.toUpperCase()}
        </button>
      </div>

      <div className="max-w-md mx-auto pt-16 px-4">
        <div className="text-center mb-8">
          <Image
            src="/fip.png"
            alt="FIP"
            width={120}
            height={120}
            className="mx-auto mb-8 rounded-lg"
          />
          <h1 className="text-2xl font-light mb-4 bg-gradient-to-r from-neutral-400 to-white bg-clip-text text-transparent">
            {language === 'pt' ? 'REGISTRO FIP' : 'FIP REGISTRATION'}
          </h1>
        </div>

        <div className="bg-white/[0.02] border border-neutral-800 rounded-lg p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                {language === 'pt' ? 'Nome Completo' : 'Full Name'}
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500/50 transition-colors"
                placeholder={language === 'pt' ? 'Seu nome completo' : 'Your full name'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
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
                name="cpf"
                required
                maxLength={14}
                value={formData.cpf}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500/50 transition-colors"
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                WhatsApp
              </label>
              <input
                type="text"
                name="whatsapp"
                required
                value={formData.whatsapp}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500/50 transition-colors"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                Instagram
              </label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500/50 transition-colors"
                placeholder="@seuinstagram"
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
                ? (language === 'pt' ? 'Registrando...' : 'Registering...')
                : (language === 'pt' ? 'Registrar' : 'Register')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/cronograma"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              {language === 'pt' 
                ? 'Já tem cadastro? Entre aqui'
                : 'Already have an account? Sign in here'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 