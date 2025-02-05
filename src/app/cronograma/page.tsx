"use client";

import { useState, useEffect } from 'react';
import { Globe, Clock, BookOpen, Laptop, Gift, BarChart, Brain, FileText } from 'lucide-react';
import Image from 'next/image';
import FloatingGroupButton from '@/components/FloatingGroupButton';
import { LoginForm } from './components/LoginForm';
import { useSession, signIn, signOut } from "next-auth/react";
import Link from 'next/link';

export default function Cronograma() {
  const { data: session, status } = useSession();
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [countdowns, setCountdowns] = useState<{
    [key: string]: {
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    };
  }>({});
  const [isRegistering, setIsRegistering] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);

  // Verifica se o usuário já está autenticado ao carregar a página
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setIsAuthenticated(true);
      setUserData(session.user);
    }
  }, [session, status]);

  useEffect(() => {
    if (status !== 'loading') {
      setPageLoading(false);
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validações básicas
      if (!formData.name || !formData.email || !formData.cpf || !formData.whatsapp || !formData.password || !formData.enrollmentDate) {
        throw new Error('Todos os campos obrigatórios devem ser preenchidos');
      }

      // Formata o CPF
      const formattedCPF = formData.cpf.replace(/\D/g, '');
      if (formattedCPF.length !== 11) {
        throw new Error('CPF inválido');
      }

      // Primeiro registra o usuário
      const registerResponse = await fetch('/api/cronograma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          cpf: formattedCPF,
          email: formData.email.toLowerCase(),
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.error || 'Erro ao cadastrar');
      }

      // Após registro bem-sucedido, faz login
      const loginResult = await signIn('credentials', {
        email: formData.email.toLowerCase(),
        password: formData.password,
        redirect: false,
      });

      if (loginResult?.error) {
        throw new Error(loginResult.error);
      }

      // Redireciona após login bem-sucedido
      window.location.href = '/cronograma';

    } catch (err: any) {
      console.error('Erro:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const scheduleItems = [
    {
      icon: <Laptop className="w-5 h-5" />,
      title: {
        pt: 'PLATAFORMA (PRÁTICA)',
        en: 'PLATFORM (PRACTICAL)'
      },
      status: {
        pt: 'AULAS JÁ LIBERADAS',
        en: 'CLASSES ALREADY RELEASED'
      },
      description: {
        pt: 'Vamos ensinar a usar a plataforma da corretora para abrir e gerenciar operações. Dominar essas ferramentas é essencial para atuar com segurança.',
        en: 'We will teach how to use the broker\'s platform to open and manage operations. Mastering these tools is essential for operating safely.'
      }
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: {
        pt: 'LIBERAÇÃO DE AULAS K17 (PRÁTICA)',
        en: 'K17 CLASSES RELEASE (PRACTICAL)'
      },
      status: {
        pt: '7 DIAS PÓS COMPRA',
        en: '7 DAYS AFTER PURCHASE'
      },
      description: {
        pt: 'Novas aulas avançadas para consolidar o que aprendemos até aqui, aplicando em cenários mais complexos.',
        en: 'New advanced classes to consolidate what we\'ve learned so far, applying in more complex scenarios.'
      }
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: {
        pt: 'LIBERAÇÃO DO BLACK BOOK',
        en: 'BLACK BOOK RELEASE'
      },
      status: {
        pt: '8 DIAS PÓS COMPRA',
        en: '8 DAYS AFTER PURCHASE'
      },
      description: {
        pt: 'Acesso ao exclusivo Black Book (Versão Digital) com segredos de mercado que vão acelerar seus resultados.',
        en: 'Access to the exclusive Black Book (Digital Version) with market secrets that will accelerate your results.'
      }
    },
    {
      icon: <BarChart className="w-5 h-5" />,
      title: {
        pt: 'LIBERAÇÃO DO BÔNUS FUTUROS TECH',
        en: 'FUTUROS TECH BONUS RELEASE'
      },
      status: {
        pt: '8 DIAS PÓS COMPRA',
        en: '8 DAYS AFTER PURCHASE'
      },
      description: {
        pt: 'Acesso ao Bônus Futuros Tech, uma tecnologia de sinais que vai otimizar suas estratégias.',
        en: 'Access to Futuros Tech Bonus, a signal technology that will optimize your strategies.'
      }
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: {
        pt: 'ATUALIZAÇÕES: NOVAS AULAS K17',
        en: 'UPDATES: NEW K17 CLASSES'
      },
      status: {
        pt: 'EM BREVE',
        en: 'COMING SOON'
      },
      description: {
        pt: 'Novos conteúdos para atualizar seus conhecimentos e reforçar as estratégias operacionais.',
        en: 'New content to update your knowledge and reinforce operational strategies.'
      }
    },
    {
      icon: <Gift className="w-5 h-5" />,
      title: {
        pt: 'LIBERAÇÃO DE BÔNUS SECRETO',
        en: 'SECRET BONUS RELEASE'
      },
      status: {
        pt: '9 DIAS PÓS COMPRA',
        en: '9 DAYS AFTER PURCHASE'
      },
      description: {
        pt: 'O Bônus Secreto vai ensinar como aumentar seu capital e lucrar nas operações.',
        en: 'The Secret Bonus will teach you how to increase your capital and profit in operations.'
      }
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: {
        pt: 'RELATÓRIO FUTUROS TECH',
        en: 'FUTUROS TECH REPORT'
      },
      status: {
        pt: 'DISPONIBILIZAÇÃO MENSAL',
        en: 'MONTHLY AVAILABILITY'
      },
      description: {
        pt: 'Análise detalhada sobre o uso da tecnologia de sinais de operações Futuros Tech, ajudando a otimizar suas estratégias no mercado.',
        en: 'Detailed analysis of the use of Futuros Tech operations signal technology, helping to optimize your market strategies.'
      }
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (userData?.enrollmentDate) {
        const enrollment = new Date(userData.enrollmentDate);
        const now = new Date();

        // Função para definir a data de liberação às 12:00 PM
        const setReleaseDate = (date: Date, daysToAdd: number) => {
          const releaseDate = new Date(date);
          releaseDate.setDate(releaseDate.getDate() + daysToAdd);
          releaseDate.setHours(12, 0, 0, 0);
          return releaseDate;
        };

        // Função para calcular a diferença em dias, horas, minutos e segundos
        const calculateTimeLeft = (releaseDate: Date) => {
          const diff = releaseDate.getTime() - now.getTime();
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          return { 
            days: Math.max(0, days),
            hours: Math.max(0, hours),
            minutes: Math.max(0, minutes),
            seconds: Math.max(0, seconds)
          };
        };

        // Calcula os countdowns para cada liberação
        const k17Release = setReleaseDate(enrollment, 7);
        const blackBookRelease = setReleaseDate(enrollment, 8);
        const futurosTechRelease = setReleaseDate(enrollment, 8);
        const secretBonusRelease = setReleaseDate(enrollment, 9);

        setCountdowns({
          'k17classesrelease(practical)': calculateTimeLeft(k17Release),
          'blackbookrelease': calculateTimeLeft(blackBookRelease),
          'futurostechbonusrelease': calculateTimeLeft(futurosTechRelease),
          'secretbonusrelease': calculateTimeLeft(secretBonusRelease)
        });
      }
    }, 1000); // Atualiza a cada segundo

    return () => clearInterval(timer);
  }, [userData?.enrollmentDate]);

  // Função auxiliar para formatar a data
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // No botão de logout
  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: '/cronograma'
    });
  };

  if (pageLoading) {
    return (
      <div className="font-montserrat bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-sm text-neutral-400">
            {language === 'pt' ? 'Carregando...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session) {
    return (
      <div className="font-montserrat bg-black text-white min-h-screen">
        <div className="absolute top-4 left-4">
          <button
            onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <Globe className="h-3 w-3" />
            {language.toUpperCase()}
          </button>
        </div>

        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Image
                src="/fip.png"
                alt="FIP"
                width={80}
                height={80}
                className="mx-auto mb-6 rounded-lg"
              />
              <h1 className="text-2xl font-light mb-4 bg-gradient-to-r from-neutral-400 to-white bg-clip-text text-transparent">
                {language === 'pt' ? 'Acesse seu Cronograma' : 'Access your Schedule'}
              </h1>
              <p className="text-sm text-neutral-400">
                {language === 'pt' 
                  ? 'Entre com suas credenciais para acessar'
                  : 'Login with your credentials to access'}
              </p>
            </div>

            <LoginForm 
              language={language}
            />
          </div>
        </div>
      </div>
    );
  }

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

      {/* Header */}
      <section className="py-8 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Image
            src="/fip.png"
            alt="FIP"
            width={80}
            height={80}
            className="mx-auto mb-6 sm:mb-8 rounded-lg"
          />
          <h1 className="text-xl sm:text-2xl font-light mb-4 bg-gradient-to-r from-neutral-400 to-white bg-clip-text text-transparent">
            {language === 'pt' ? 'CRONOGRAMA FIP' : 'FIP SCHEDULE'}
          </h1>
          {userData && (
            <div className="text-sm text-neutral-400 mb-4">
              {language === 'pt' 
                ? `Data de Inscrição: ${formatDate(new Date(userData.enrollmentDate))}`
                : `Enrollment Date: ${formatDate(new Date(userData.enrollmentDate))}`}
            </div>
          )}
          <p className="text-sm text-neutral-400 max-w-2xl mx-auto">
            {language === 'pt' 
              ? 'Nosso cronograma foi estrategicamente planejado para acelerar seu desenvolvimento no mercado financeiro. Acompanhe cada etapa:'
              : 'Our schedule has been strategically planned to accelerate your development in the financial market. Follow each step:'}
          </p>
        </div>
      </section>

      {/* Schedule Items */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {scheduleItems.map((item, index) => (
              <div 
                key={index}
                className="bg-white/[0.02] border border-neutral-800 rounded-lg p-4 sm:p-6 transition-colors hover:bg-white/[0.03]"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="bg-green-500/10 p-3 rounded-lg shrink-0">
                    {item.icon}
                  </div>
                  <div className="w-full">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
                      <h3 className="text-sm font-medium text-white">
                        {item.title[language]}
                      </h3>
                      {userData?.enrollmentDate && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                          <span className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs bg-gradient-to-b from-green-900/20 to-green-950/20 px-3 py-2 rounded-lg border border-green-800/30 w-full sm:w-auto">
                            {(() => {
                              const itemKey = item.title.en.toLowerCase().replace(/\s+/g, '');
                              const countdown = countdowns[itemKey];
                              
                              if (!countdown) return item.status[language];
                              
                              const { days, hours, minutes, seconds } = countdown;
                              
                              if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
                                return language === 'pt' ? 'Liberado' : 'Released';
                              }
                              
                              const formattedMinutes = minutes.toString().padStart(2, '0');
                              const formattedSeconds = seconds.toString().padStart(2, '0');
                              
                              return (
                                <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 w-full">
                                  <div className="flex flex-col items-center px-2 py-1 bg-gradient-to-b from-green-800/20 to-green-900/20 rounded border border-green-700/30">
                                    <span className="text-base sm:text-lg font-medium bg-gradient-to-b from-green-100 to-green-200 bg-clip-text text-transparent">
                                      {days}
                                    </span>
                                    <span className="text-[10px] text-green-300/80">
                                      {language === 'pt' ? 'dias' : 'days'}
                                    </span>
                                  </div>
                                  <div className="flex flex-col items-center px-2 py-1 bg-gradient-to-b from-green-800/20 to-green-900/20 rounded border border-green-700/30">
                                    <span className="text-base sm:text-lg font-medium bg-gradient-to-b from-green-100 to-green-200 bg-clip-text text-transparent">
                                      {hours}
                                    </span>
                                    <span className="text-[10px] text-green-300/80">
                                      {language === 'pt' ? 'horas' : 'hours'}
                                    </span>
                                  </div>
                                  <div className="flex flex-col items-center px-2 py-1 bg-gradient-to-b from-green-800/20 to-green-900/20 rounded border border-green-700/30">
                                    <span className="text-base sm:text-lg font-medium bg-gradient-to-b from-green-100 to-green-200 bg-clip-text text-transparent">
                                      {formattedMinutes}
                                    </span>
                                    <span className="text-[10px] text-green-300/80">
                                      {language === 'pt' ? 'min' : 'min'}
                                    </span>
                                  </div>
                                  <div className="flex flex-col items-center px-2 py-1 bg-gradient-to-b from-green-800/20 to-green-900/20 rounded border border-green-700/30">
                                    <span className="text-base sm:text-lg font-medium bg-gradient-to-b from-green-100 to-green-200 bg-clip-text text-transparent">
                                      {formattedSeconds}
                                    </span>
                                    <span className="text-[10px] text-green-300/80">
                                      {language === 'pt' ? 'seg' : 'sec'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                          </span>
                          {countdowns[item.title.en.toLowerCase().replace(/\s+/g, '')] &&
                           countdowns[item.title.en.toLowerCase().replace(/\s+/g, '')]?.days === 0 &&
                           countdowns[item.title.en.toLowerCase().replace(/\s+/g, '')]?.hours === 0 &&
                           countdowns[item.title.en.toLowerCase().replace(/\s+/g, '')]?.minutes === 0 &&
                           countdowns[item.title.en.toLowerCase().replace(/\s+/g, '')]?.seconds === 0 && (
                            <span className="text-xs text-neutral-500 w-full sm:w-auto text-center sm:text-left">
                              {language === 'pt' ? 'Liberado em: ' : 'Released on: '}
                              {formatDate(new Date(userData.enrollmentDate))}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      {item.description[language]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <p className="text-sm text-neutral-400">
            {language === 'pt'
              ? 'Aproveitem ao máximo cada aula e bônus, pois o sucesso está na APLICAÇÃO constante do que foi aprendido.'
              : 'Make the most of each class and bonus, as success lies in the constant APPLICATION of what has been learned.'}
          </p>

          {/* WhatsApp Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://api.whatsapp.com/send?phone=557391778075&text=Ol%C3%A1%2C%20quero%20tirar%20d%C3%BAvidas%20do%20Cronograma!"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600/20 hover:bg-green-600/30 text-green-500 px-6 py-3 rounded-lg transition-colors text-sm sm:text-base"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {language === 'pt' ? 'Falar com Especialista' : 'Talk to Specialist'}
            </a>

            <a
              href="https://chat.whatsapp.com/FMbIa2JGxa15j628J1J60Y"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600/20 hover:bg-green-600/30 text-green-500 px-6 py-3 rounded-lg transition-colors text-sm sm:text-base"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {language === 'pt' ? 'Entrar na Comunidade FIP' : 'Join FIP Community'}
            </a>
          </div>
        </div>
      </section>

      <FloatingGroupButton />

      {/* Adiciona botão de logout */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="text-xs text-neutral-400 hover:text-white transition-colors"
        >
          {language === 'pt' ? 'Sair' : 'Logout'}
        </button>
      </div>
    </div>
  );
} 