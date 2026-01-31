interface PriceProps {
  value: number;
  originalValue?: number;
  currency?: string;
  className?: string;
}

function Price({ value, originalValue, currency = '', className = '' }: PriceProps) {
  const formatPrice = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  return (
    <div className={className}>
      <span className="text-lg font-bold text-gray-900">
        {formatPrice(value)}
        {currency}
      </span>
      {originalValue && (
        <span className="ml-2 text-sm text-gray-400 line-through">
          {formatPrice(originalValue)}
          {currency}
        </span>
      )}
    </div>
  );
}

export default Price;
