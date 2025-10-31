'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface UserData {
  id: number
  name: string
  role: string
  email: string
}

export default function SuperAdminSelection() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há dados do usuário no sessionStorage ou cookies
    const checkUserData = () => {
      try {
        const userInfo = sessionStorage.getItem('federal_global_user')
        if (userInfo) {
          const user = JSON.parse(userInfo)
          setUserData(user)
        } else {
          // Se não há dados, redirecionar para login
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Erro ao verificar dados do usuário:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkUserData()
  }, [router])

  const handleAdminPanel = () => {
    // Salvar escolha e redirecionar para painel administrativo
    sessionStorage.setItem('federal_global_panel_type', 'admin')
    router.push('/admin/dashboard')
  }

  const handleClientPanel = () => {
    // Salvar escolha e redirecionar para painel de clientes
    sessionStorage.setItem('federal_global_panel_type', 'client')
    router.push('/client/dashboard')
  }

  const handleLogout = () => {
    // Limpar dados e redirecionar para login
    sessionStorage.clear()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl font-bold text-blue-900">FG</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Federal Global</h1>
              <p className="text-blue-200">by DeltaFox</p>
            </div>
          </div>
          
          {/* Informações do usuário */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8">
            <div className="text-white">
              <h2 className="text-xl font-semibold mb-2">Bem-vindo, {userData?.name}</h2>
              <p className="text-blue-200">Role: {userData?.role}</p>
              <p className="text-blue-200">Email: {userData?.email}</p>
            </div>
          </div>
        </div>

        {/* Seleção de Painel */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Escolha o painel de acesso:
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Administração Interna */}
            <button
              onClick={handleAdminPanel}
              className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-400 transition-colors">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Administração Interna</h4>
                <p className="text-blue-200 text-sm">
                  Gerenciar usuários, configurações do sistema, relatórios e funcionalidades administrativas
                </p>
              </div>
            </button>

            {/* Painel de Clientes */}
            <button
              onClick={handleClientPanel}
              className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-400 transition-colors">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Painel de Clientes</h4>
                <p className="text-blue-200 text-sm">
                  Acessar funcionalidades voltadas para clientes, consultas e serviços oferecidos
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Botão de Logout */}
        <div className="text-center mt-8">
          <button
            onClick={handleLogout}
            className="text-blue-200 hover:text-white transition-colors underline"
          >
            Sair do sistema
          </button>
        </div>
      </div>
    </div>
  )
}