// Base Layout Component - Estrutura padrão para layouts do Canva
import React from 'react'

interface BaseLayoutProps {
  children: React.ReactNode
  headerTitle?: string
  headerSubtitle?: string
  showNavigation?: boolean
  backgroundColor?: string
  className?: string
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  headerTitle = "Federal Global",
  headerSubtitle = "by DeltaFox",
  showNavigation = true,
  backgroundColor = "bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900",
  className = ""
}) => {
  return (
    <div className={`min-h-screen ${backgroundColor} ${className}`}>
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                <span className="text-lg font-bold text-blue-900">FG</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{headerTitle}</h1>
                <p className="text-xs text-blue-200">{headerSubtitle}</p>
              </div>
            </div>

            {/* Navigation (se habilitada) */}
            {showNavigation && (
              <nav className="hidden md:flex space-x-4">
                <a href="#" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </a>
                <a href="#" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">
                  Serviços
                </a>
                <a href="#" className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium">
                  Suporte
                </a>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}

// Card Component - Para seções de conteúdo
interface CardProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'solid'
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = "",
  variant = 'glass'
}) => {
  const variantClasses = {
    default: "bg-white rounded-lg shadow-lg",
    glass: "bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl",
    solid: "bg-white rounded-xl shadow-xl"
  }

  return (
    <div className={`${variantClasses[variant]} p-6 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className={`text-xl font-bold ${variant === 'solid' ? 'text-gray-900' : 'text-white'} mb-1`}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className={`text-sm ${variant === 'solid' ? 'text-gray-600' : 'text-blue-200'}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

// Button Component - Botões estilizados
interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = "",
  disabled = false
}) => {
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    outline: "border-2 border-white text-white hover:bg-white hover:text-blue-900",
    glass: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        font-medium rounded-lg transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  )
}

export default BaseLayout