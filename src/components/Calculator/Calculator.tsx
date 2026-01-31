import { useState } from 'react';
import * as calculatorApi from '../../services/calculatorApi';

type Operator = '+' | '-' | '×' | '÷' | null;

function Calculator() {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputDigit = (digit: string) => {
    setError(null);
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    setError(null);
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setError(null);
  };

  const handleOperator = (nextOperator: Operator) => {
    setError(null);
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator && !waitingForSecondOperand) {
      performCalculation();
      return;
    }

    setOperator(nextOperator);
    setWaitingForSecondOperand(true);
  };

  const performCalculation = async () => {
    if (firstOperand === null || operator === null) return;

    const secondOperand = parseFloat(display);
    setIsLoading(true);
    setError(null);

    try {
      let result: number;

      switch (operator) {
        case '+':
          result = await calculatorApi.add(firstOperand, secondOperand);
          break;
        case '-':
          result = await calculatorApi.minus(firstOperand, secondOperand);
          break;
        case '×':
          result = await calculatorApi.multiply(firstOperand, secondOperand);
          break;
        case '÷':
          result = await calculatorApi.divide(firstOperand, secondOperand);
          break;
        default:
          return;
      }

      setDisplay(String(result));
      setFirstOperand(result);
      setOperator(null);
      setWaitingForSecondOperand(true);
    } catch {
      setError('계산 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const buttonClass =
    'flex items-center justify-center text-2xl font-medium rounded-xl transition-colors active:scale-95';
  const numberClass = `${buttonClass} bg-gray-100 hover:bg-gray-200 text-gray-900`;
  const operatorClass = `${buttonClass} bg-orange-500 hover:bg-orange-600 text-white`;
  const functionClass = `${buttonClass} bg-gray-300 hover:bg-gray-400 text-gray-900`;

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="bg-gray-900 rounded-3xl p-4 shadow-2xl">
        {/* Display */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4 min-h-[80px] flex flex-col justify-end">
          {error && (
            <div className="text-red-400 text-sm mb-1">{error}</div>
          )}
          <div
            className="text-right text-white font-light break-all"
            style={{
              fontSize: display.length > 12 ? '1.5rem' : display.length > 8 ? '2rem' : '3rem',
            }}
          >
            {isLoading ? '...' : display}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <button className={functionClass} onClick={clear}>
            C
          </button>
          <button className={functionClass} onClick={() => setDisplay(String(parseFloat(display) * -1))}>
            ±
          </button>
          <button className={functionClass} onClick={() => setDisplay(String(parseFloat(display) / 100))}>
            %
          </button>
          <button className={operatorClass} onClick={() => handleOperator('÷')}>
            ÷
          </button>

          {/* Row 2 */}
          <button className={numberClass} onClick={() => inputDigit('7')}>
            7
          </button>
          <button className={numberClass} onClick={() => inputDigit('8')}>
            8
          </button>
          <button className={numberClass} onClick={() => inputDigit('9')}>
            9
          </button>
          <button className={operatorClass} onClick={() => handleOperator('×')}>
            ×
          </button>

          {/* Row 3 */}
          <button className={numberClass} onClick={() => inputDigit('4')}>
            4
          </button>
          <button className={numberClass} onClick={() => inputDigit('5')}>
            5
          </button>
          <button className={numberClass} onClick={() => inputDigit('6')}>
            6
          </button>
          <button className={operatorClass} onClick={() => handleOperator('-')}>
            −
          </button>

          {/* Row 4 */}
          <button className={numberClass} onClick={() => inputDigit('1')}>
            1
          </button>
          <button className={numberClass} onClick={() => inputDigit('2')}>
            2
          </button>
          <button className={numberClass} onClick={() => inputDigit('3')}>
            3
          </button>
          <button className={operatorClass} onClick={() => handleOperator('+')}>
            +
          </button>

          {/* Row 5 */}
          <button
            className={`${numberClass} col-span-2`}
            onClick={() => inputDigit('0')}
          >
            0
          </button>
          <button className={numberClass} onClick={inputDecimal}>
            .
          </button>
          <button className={operatorClass} onClick={performCalculation}>
            =
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
