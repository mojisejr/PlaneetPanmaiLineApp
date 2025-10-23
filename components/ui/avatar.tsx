import React from 'react'

interface AvatarProps {
  className?: string
  children: React.ReactNode
}

export function Avatar({ className = '', children }: AvatarProps) {
  return (
    <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
      {children}
    </div>
  )
}

interface AvatarImageProps {
  src?: string
  alt?: string
  className?: string
}

export function AvatarImage({ src, alt, className = '' }: AvatarImageProps) {
  if (!src) return null

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`aspect-square h-full w-full object-cover ${className}`}
    />
  )
}

interface AvatarFallbackProps {
  className?: string
  children: React.ReactNode
}

export function AvatarFallback({ className = '', children }: AvatarFallbackProps) {
  return (
    <div className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600 ${className}`}>
      {children}
    </div>
  )
}
