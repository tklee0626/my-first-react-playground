import { ReactNode } from 'react';

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

function CardImage({ src, alt, className = '' }: CardImageProps) {
  return (
    <div className={`aspect-square bg-gray-100 flex items-center justify-center mb-3 ${className}`}>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain"
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
