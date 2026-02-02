import { ReactNode, useState, useMemo } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div className={`flex flex-col ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

function generateRandomColor(): string {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 60%, 70%)`;
}

function CardImage({ src, alt, className = '' }: CardImageProps) {
  const [hasError, setHasError] = useState(false);
  const fallbackColor = useMemo(() => generateRandomColor(), []);

  if (hasError || !src) {
    return (
      <div
        className={`aspect-square flex items-center justify-center mb-3 ${className}`}
        style={{ backgroundColor: fallbackColor }}
      >
        <span className="text-white text-sm font-medium px-2 text-center">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`aspect-square bg-gray-100 flex items-center justify-center mb-3 ${className}`}>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {children}
    </div>
  );
}

Card.Image = CardImage;
Card.Content = CardContent;

export default Card;
