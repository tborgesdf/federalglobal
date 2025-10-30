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
    const detectAndSetDomain = () => {
      if (typeof window === 'undefined') return;
      
      const hostname = window.location.hostname
      const pathname = window.location.pathname
      
      // Detectar tipo de domínio
      const isAdmin = hostname.includes('admin.federalglobal') || 
                      hostname.includes('admin-federalglobal') ||
                      new URLSearchParams(window.location.search).get('admin') === 'true'
      
      const isClient = hostname.includes('federalglobal') && !isAdmin
      
      console.log(`[DomainRouter] Host: ${hostname}, Path: ${pathname}, Admin: ${isAdmin}, Client: ${isClient}`)
      
      // Usar callback form do setState para evitar cascading renders
      if (isAdmin) {
        setDomainType(prev => {
          if (prev !== 'admin') {
            // Redirecionar para área admin se necessário
            if (!pathname.startsWith('/admin')) {
              router.push('/admin')
            }
            return 'admin'
          }
          return prev
        })
      } else if (isClient) {
        setDomainType(prev => {
          if (prev !== 'client') {
            // Redirecionar para área cliente se necessário
            if (pathname.startsWith('/admin')) {
              router.push('/client')
            } else if (pathname === '/' || pathname === '') {
              router.push('/client')
            }
            return 'client'
          }
          return prev
        })
      } else {
        // Domínio local ou desenvolvimento - redirecionar para cliente por padrão
        setDomainType(prev => {
          if (prev !== 'client') {
            if (pathname === '/' || pathname === '') {
              router.push('/client')
            }
            return 'client'
          }
          return prev
        })
      }
    }

    detectAndSetDomain()
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