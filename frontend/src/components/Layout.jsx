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

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={isAuthenticated ? '/home' : '/landing'} className="text-xl font-semibold text-primary-600 tracking-tight">
            Melonote
          </Link>
          <nav className="flex items-center gap-4 text-sm text-gray-600">
            {!hideHomeLink && (
              <Link to="/home" className="hover:text-sky-600">Home</Link>
            )}
              {isAuthenticated ? (
                <>
                  <Link to="/journal" className="hover:text-sky-600">Journal</Link>
                  <Link to="/dashboard" className="hover:text-sky-600">Dashboard</Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </>
            ) : (
              <Link to="/auth" className="hover:text-sky-600">Sign in</Link>
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
