import * as LucideIcons from 'lucide-react'
import { ComponentType } from 'react'

interface IconProps {
  name: string
  size?: number
  color?: string
  strokeWidth?: number
  className?: string
  ariaLabel?: string
}

export const Icon = ({
  name,
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
  ariaLabel,
}: IconProps) => {
  // Convert name to PascalCase for lucide-react
  // Handle both "User" and "user" formats
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1)
  const IconName = formattedName as keyof typeof LucideIcons
  
  const IconComponent = LucideIcons[IconName] as ComponentType<{
    size?: number
    color?: string
    strokeWidth?: number
    className?: string
    'aria-label'?: string
  }>

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`)
    return null
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      aria-label={ariaLabel}
    />
  )
}

export default Icon

