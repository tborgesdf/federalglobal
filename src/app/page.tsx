'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verificar se há usuário logado
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      // Redirecionar baseado no role
      switch (userData.role) {
        case 'SUPER_ADMIN':
          router.push('/dashboard/super-admin');
          break;
        case 'ADMIN':
          router.push('/dashboard/admin');
          break;
        case 'USER':
          router.push('/dashboard/user');
          break;
        default:
          router.push('/login');
      }
    } else {
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-700 to-green-800 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="mb-8">
          <Image
            src="/logo_federal_global_sem_fundo.png"
            alt="Federal Global"
            width={200}
            height={150}
            className="mx-auto mb-6"
          />
        </div>
        
        <h1 className="text-5xl font-bold mb-4">Federal Global</h1>
        <p className="text-2xl mb-8 text-green-100">by DeltaFox Consultoria</p>
        
        <div className="max-w-2xl mx-auto mb-8">
          <p className="text-lg text-green-100 mb-4">
            Sistema avançado de inteligência e contrainteligência empresarial
          </p>
          <p className="text-base text-blue-100">
            Protegendo o futuro das empresas através da inteligência estratégica
          </p>
        </div>

        <div className="animate-pulse">
          <p className="text-sm text-white opacity-75">
            Redirecionando para o sistema...
          </p>
        </div>

        <div className="mt-12">
          <button
            onClick={() => router.push('/login')}
            className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200"
          >
            Acessar Sistema
          </button>
        </div>

        {/* Footer */}
        <div className="mt-16">
          <p className="text-sm text-green-100">
            © Desenvolvido por DeltaFox Consultoria
          </p>
        </div>
      </div>
    </div>
  );
}
