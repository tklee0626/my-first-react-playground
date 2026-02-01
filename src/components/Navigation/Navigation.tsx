import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  const linkClass = (path: string) =>
    `px-4 py-2 rounded-lg transition-colors ${
      location.pathname === path
        ? 'bg-gray-900 text-white'
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 mb-6">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/" className={linkClass('/')}>
            홈
          </Link>
          <Link to="/calculator" className={linkClass('/calculator')}>
            계산기
          </Link>
          <Link to="/admin/products" className={linkClass('/admin/products')}>
            상품 관리
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
