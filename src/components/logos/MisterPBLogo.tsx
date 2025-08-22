'use client'

import React from 'react'

interface LogoProps {
  variant?: 'full' | 'icon' | 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
}

const MisterPBLogo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showText = true
}) => {
  const sizes = {
    sm: { width: 24, height: 24, fontSize: 'text-sm' },
    md: { width: 32, height: 32, fontSize: 'text-base' },
    lg: { width: 48, height: 48, fontSize: 'text-xl' },
    xl: { width: 64, height: 64, fontSize: 'text-2xl' }
  }

  const { width, fontSize } = sizes[size]

  // Icon component with AI network pattern and PB initials
  const LogoIcon = ({ iconSize = width }: { iconSize?: number }) => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        {/* Glow effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Main container circle */}
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="url(#logoGradient)"
        className="drop-shadow-lg"
      />

      {/* AI Network nodes - subtle background pattern */}
      <g opacity="0.3" stroke="#ffffff" strokeWidth="1" fill="none">
        {/* Network connections */}
        <line x1="12" y1="20" x2="24" y2="28" />
        <line x1="24" y1="28" x2="40" y2="24" />
        <line x1="40" y1="24" x2="52" y2="32" />
        <line x1="24" y1="28" x2="32" y2="44" />
        <line x1="40" y1="24" x2="44" y2="48" />
        <line x1="16" y1="48" x2="32" y2="44" />
        
        {/* Network nodes */}
        <circle cx="12" cy="20" r="2" fill="#ffffff" />
        <circle cx="24" cy="28" r="2" fill="#ffffff" />
        <circle cx="40" cy="24" r="2" fill="#ffffff" />
        <circle cx="52" cy="32" r="2" fill="#ffffff" />
        <circle cx="32" cy="44" r="2" fill="#ffffff" />
        <circle cx="44" cy="48" r="2" fill="#ffffff" />
        <circle cx="16" cy="48" r="2" fill="#ffffff" />
      </g>

      {/* Central PB initials */}
      <g filter="url(#glow)">
        {/* P letter */}
        <path
          d="M22 18 L22 46 M22 18 L30 18 Q34 18 34 24 Q34 30 30 30 L22 30"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* B letter */}
        <path
          d="M38 18 L38 46 M38 18 L44 18 Q48 18 48 22 Q48 26 45 28 Q48 30 48 36 Q48 40 44 40 L38 40 M38 28 L44 28"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Subtle sparkle effects */}
      <g opacity="0.8" fill="#ffffff">
        <circle cx="18" cy="16" r="1" />
        <circle cx="48" cy="20" r="1" />
        <circle cx="20" cy="50" r="1" />
        <circle cx="46" cy="52" r="1" />
      </g>
    </svg>
  )

  // Text component
  const LogoText = ({ textSize = fontSize }: { textSize?: string }) => (
    <span className={`font-bold tracking-tight ${textSize} bg-gradient-to-r from-slate-700 to-slate-600 bg-clip-text text-transparent`}>
      MisterPB.in
    </span>
  )

  // Render based on variant
  if (variant === 'icon') {
    return <LogoIcon iconSize={width} />
  }

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <LogoIcon iconSize={width} />
        {showText && <LogoText textSize={fontSize} />}
      </div>
    )
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <LogoIcon iconSize={width} />
        {showText && <LogoText textSize={fontSize} />}
      </div>
    )
  }

  // Default 'full' variant (horizontal)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon iconSize={width} />
      {showText && <LogoText textSize={fontSize} />}
    </div>
  )
}

export default MisterPBLogo
