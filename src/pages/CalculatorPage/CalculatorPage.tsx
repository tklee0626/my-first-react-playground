import Calculator from '../../components/Calculator/Calculator';

function CalculatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        계산기
      </h1>
      <p className="text-gray-500 text-center mb-8">
        providence API와 연동된 계산기입니다
      </p>
      <Calculator />
    </div>
  );
}

export default CalculatorPage;
