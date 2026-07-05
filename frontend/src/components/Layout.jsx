import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('melonote-token');
  const isAuthenticated = Boolean(token);
  const hideHomeLink = location.pathname === '/landing' || location.pathname === '/auth';

  function handleLogout() {
    localStorage.removeItem('melonote-token');
    localStorage.removeItem('melonote-user');
    navigate('/auth', { replace: true });
  }

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to={isAuthenticated ? '/journal' : '/landing'}
            className="text-xl font-semibold text-primary-600 tracking-tight transition-opacity hover:opacity-80"
          >
            Melonote
          </Link>
          <nav className="flex items-center gap-4 text-sm text-gray-600">
            {!hideHomeLink && (
              <Link
                to="/home"
                className={`transition-all hover:text-sky-600 ${
                  isActive('/home') ? 'text-sky-600 font-medium' : ''
                }`}
              >
                Home
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link
                  to="/journal"
                  className={`transition-all hover:text-sky-600 ${
                    isActive('/journal') ? 'text-sky-600 font-medium' : ''
                  }`}
                >
                  Journal
                </Link>
                <Link
                  to="/dashboard"
                  className={`transition-all hover:text-sky-600 ${
                    isActive('/dashboard') ? 'text-sky-600 font-medium' : ''
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/chat"
                  className={`transition-all hover:text-sky-600 ${
                    isActive('/chat') ? 'text-sky-600 font-medium' : ''
                  }`}
                >
                  Chat
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-all hover:bg-gray-50 hover:scale-105 active:scale-95"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className={`transition-all hover:text-sky-600 ${
                  isActive('/auth') ? 'text-sky-600 font-medium' : ''
                }`}
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        Melonote — a calm space for reflection
      </footer>
    </div>
  );
}

export default Layout;