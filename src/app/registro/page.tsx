"use client";

import { useState } from 'react';
import { Globe } from 'lucide-react';
import Image from 'next/image';
import { signIn } from "next-auth/react";
import Link from 'next/link';

export default function Registro() {
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    whatsapp: '',
    instagram: '',
    enrollmentDate: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ... (resto do código de registro existente) ...

      // Após registro bem-sucedido, redireciona para login
      window.location.href = '/cronograma';
    } catch (err: any) {
      console.error('Erro:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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

      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-xl w-full">
          <div className="text-center mb-8">
            <Image
              src="/fip.png"
              alt="FIP"
              width={80}
              height={80}
              className="mx-auto mb-6 rounded"
            />
            <h1 className="text-2xl font-light mb-4 bg-gradient-to-r from-neutral-400 to-white bg-clip-text text-transparent">
              {language === 'pt' ? 'Cadastre-se no Cronograma' : 'Register for Schedule'}
            </h1>
            <p className="text-sm text-neutral-400">
              {language === 'pt' 
                ? 'Preencha seus dados para acessar o cronograma personalizado'
                : 'Fill in your details to access your personalized schedule'}
            </p>
          </div>

          <div className="bg-white/[0.02] border border-neutral-800 rounded-lg p-6">
            {/* ... (formulário de registro existente) ... */}
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/cronograma"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              {language === 'pt' 
                ? 'Já tem cadastro? Entre aqui'
                : 'Already registered? Login here'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 