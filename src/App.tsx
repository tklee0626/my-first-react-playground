import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import HomePage from './pages/HomePage/HomePage';
import CalculatorPage from './pages/CalculatorPage/CalculatorPage';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
      </Routes>
    </div>
  );
}

export default App;
