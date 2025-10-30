'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDomainContext } from '../lib/utils/domain';

export default function Home() {
  const router = useRouter();
  const domainContext = useDomainContext();

  useEffect(() => {
    // Redirecionar baseado no contexto do domínio
    if (domainContext.isAdmin) {
      router.push('/admin');
    } else if (domainContext.isClient || domainContext.isDevelopment) {
      router.push('/client');
    }
  }, [router, domainContext]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-700 to-green-800 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="mb-8">
          <div className="w-48 h-36 mx-auto mb-6 bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-4xl">🛡️</span>
          </div>
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
          <div className="mt-4 text-sm text-blue-200">
            <p>Domínio: {domainContext.hostname}</p>
            <p>Tipo: {domainContext.type}</p>
          </div>
        </div>

        <div className="animate-pulse">
          <p className="text-sm text-white opacity-75">
            Redirecionando para {domainContext.isAdmin ? 'painel administrativo' : 'portal do cliente'}...
          </p>
        </div>

        <div className="mt-12 space-x-4">
          <button
            onClick={() => router.push(domainContext.isAdmin ? '/admin' : '/client')}
            className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200"
          >
            Acessar {domainContext.isAdmin ? 'Dashboard' : 'Portal'}
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
