'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CaptureUtils } from '@/lib/utils/capture';

export default function LoginPage() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gpsStatus, setGpsStatus] = useState<'checking' | 'enabled' | 'disabled'>('checking');
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const router = useRouter();

  // Verificar GPS ao carregar a página
  useEffect(() => {
    checkGPSStatus();
  }, []);

  const checkGPSStatus = async () => {
    try {
      const hasPermission = await CaptureUtils.checkGPSPermission();
      if (hasPermission) {
        const coords = await CaptureUtils.getGPSCoordinates();
        setGpsCoords(coords);
        setGpsStatus('enabled');
      } else {
        setGpsStatus('disabled');
        setError('🛡️ GPS é obrigatório para utilizar o sistema. Por favor, habilite a localização e recarregue a página.');
      }
    } catch (err: unknown) {
      console.error('Erro ao verificar GPS:', err);
      setGpsStatus('disabled');
      setError('🛡️ GPS é obrigatório para utilizar o sistema. Por favor, habilite a localização e recarregue a página.');
    }
  };

  // Formatar CPF enquanto digita
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Verificar se GPS está habilitado antes de permitir login
    if (gpsStatus !== 'enabled' || !gpsCoords) {
      setError('🛡️ GPS é obrigatório para acessar o sistema. Por favor, habilite a localização.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cpf, 
          password,
          gpsCoords: gpsCoords // Enviar coordenadas GPS
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Salvar token/session e redirecionar baseado no role
        localStorage.setItem('user', JSON.stringify(data.user));
        
        switch (data.user.role) {
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
            router.push('/dashboard');
        }
      } else {
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (err: unknown) {
      console.error('Erro de conexão:', err);
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-700 to-green-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header com logo */}
        <div className="bg-gradient-to-r from-green-600 to-blue-700 p-8 text-center">
          <div className="mb-4">
            <Image
              src="/logo_federal_global_sem_fundo.png"
              alt="Federal Global"
              width={120}
              height={80}
              className="mx-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Federal Global</h1>
          <p className="text-green-100">Sistema de Inteligência Empresarial</p>
        </div>

        {/* Formulário de login */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Acesso ao Sistema
          </h2>

          {/* Indicador de Status GPS */}
          <div className={`flex items-center justify-center p-3 rounded-lg mb-4 ${
            gpsStatus === 'checking' ? 'bg-yellow-50 border border-yellow-300' :
            gpsStatus === 'enabled' ? 'bg-green-50 border border-green-300' :
            'bg-red-50 border border-red-300'
          }`}>
            <div className="flex items-center">
              {gpsStatus === 'checking' && (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-yellow-600 border-t-transparent rounded-full mr-2"></div>
                  <span className="text-yellow-700 text-sm">Verificando GPS...</span>
                </>
              )}
              {gpsStatus === 'enabled' && (
                <>
                  <div className="h-4 w-4 bg-green-600 rounded-full mr-2"></div>
                  <span className="text-green-700 text-sm">🛡️ GPS Habilitado - Sistema Seguro</span>
                </>
              )}
              {gpsStatus === 'disabled' && (
                <>
                  <div className="h-4 w-4 bg-red-600 rounded-full mr-2"></div>
                  <span className="text-red-700 text-sm">🚫 GPS Desabilitado - Acesso Negado</span>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                CPF
              </label>
              <input
                type="text"
                id="cpf"
                value={cpf}
                onChange={handleCPFChange}
                placeholder="000.000.000-00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black placeholder-gray-500"
                required
                maxLength={14}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-black placeholder-gray-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || gpsStatus !== 'enabled'}
              className={`w-full py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                gpsStatus === 'enabled' && !loading
                  ? 'bg-gradient-to-r from-green-600 to-blue-700 text-white hover:from-green-700 hover:to-blue-800 focus:ring-green-500'
                  : 'bg-gray-400 text-gray-700 cursor-not-allowed'
              }`}
            >
              {loading ? 'Entrando...' : 
               gpsStatus === 'checking' ? 'Verificando GPS...' :
               gpsStatus === 'disabled' ? '🚫 GPS Necessário' : 
               'Entrar no Sistema'}
            </button>

            {/* Botão para tentar recarregar GPS */}
            {gpsStatus === 'disabled' && (
              <button
                type="button"
                onClick={checkGPSStatus}
                className="w-full mt-3 bg-yellow-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200"
              >
                🔄 Tentar Novamente GPS
              </button>
            )}
          </form>

          {/* Informações para teste */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Dados para teste:</h3>
            <p className="text-xs text-gray-600">
              CPF: 123.456.789-01<br />
              Senha: SuperAdmin2024!<br />
              Protocolo: FG414712EEGGZT
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 text-center py-4">
          <p className="text-white text-sm">
            © Desenvolvido por DeltaFox Consultoria
          </p>
        </div>
      </div>
    </div>
  );
}