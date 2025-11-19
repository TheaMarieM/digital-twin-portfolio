interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const badgeVariants = {
  default: 'border-[rgb(var(--border))] bg-[rgb(var(--card))] text-[rgb(var(--muted))]',
  primary: 'border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400',
  secondary: 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400',
  success: 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400',
  warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  error: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm'
};

export default function Badge({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '' 
}: BadgeProps) {
  return (
    <span 
      className={`
        inline-flex items-center rounded-full border font-medium transition-all
        ${badgeVariants[variant]} 
        ${badgeSizes[size]} 
        ${className}
      `}
    >
      {children}
    </span>
  );
}