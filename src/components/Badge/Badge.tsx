import { ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-gray-100 text-gray-600',
    primary: 'bg-blue-100 text-blue-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
  };

  return (
    <span className={`text-xs px-1.5 py-0.5 rounded ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
