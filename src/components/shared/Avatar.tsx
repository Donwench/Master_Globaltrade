'use client';

interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

export function Avatar({ name = 'U', src, size = 'md', className = '' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeStyles[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  const colors = [
    'bg-primary-100 text-primary-700',
    'bg-accent-100 text-accent-700',
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-green-100 text-green-700',
  ];

  const colorIndex = name.charCodeAt(0) % colors.length;

  return (
    <div
      className={`${sizeStyles[size]} rounded-full flex items-center justify-center font-semibold ${colors[colorIndex]} ${className}`}
    >
      {initials}
    </div>
  );
}
