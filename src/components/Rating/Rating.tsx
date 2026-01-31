interface RatingProps {
  value: number;
  count: number;
  className?: string;
}

function Rating({ value, count, className = '' }: RatingProps) {
  if (!count || count <= 0) return null;

  return (
    <div className={`flex items-center gap-1 text-xs text-gray-500 ${className}`}>
      <span className="text-yellow-500">★</span>
      <span>{value}</span>
      <span className="text-gray-400">({count.toLocaleString()})</span>
    </div>
  );
}

export default Rating;
