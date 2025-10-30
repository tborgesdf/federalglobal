'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface DomainRouterProps {
  children: React.ReactNode
}

export default function DomainRouter({ children }: DomainRouterProps) {
  const router = useRouter()
  const [domainType, setDomainType] = useState<'admin' | 'client' | 'unknown'>('unknown')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      const pathname = window.location.pathname
      
      // Detectar tipo de domínio
      const isAdmin = hostname.includes('admin.federalglobal') || 
                      hostname.includes('admin-federalglobal') ||
                      new URLSearchParams(window.location.search).get('admin') === 'true'
      
      const isClient = hostname.includes('federalglobal') && !isAdmin
      
      console.log(`[DomainRouter] Host: ${hostname}, Path: ${pathname}, Admin: ${isAdmin}, Client: ${isClient}`)
      
      if (isAdmin) {
        setDomainType('admin')
        // Redirecionar para área admin se necessário
        if (!pathname.startsWith('/admin')) {
          router.push('/admin')
        }
      } else if (isClient) {
        setDomainType('client')
        // Redirecionar para área cliente se necessário
        if (pathname.startsWith('/admin')) {
          router.push('/client')
        } else if (pathname === '/' || pathname === '') {
          router.push('/client')
        }
      } else {
        // Domínio local ou desenvolvimento - redirecionar para cliente por padrão
        setDomainType('client')
        if (pathname === '/' || pathname === '') {
          router.push('/client')
        }
      }
    }
  }, [router])

  // Mostrar loading enquanto determina o tipo de domínio
  if (domainType === 'unknown') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Carregando Federal Global...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}