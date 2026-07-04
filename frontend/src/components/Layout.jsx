import { Outlet, Link } from 'react-router-dom';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-primary-600 tracking-tight">
            Melonote
          </Link>
          <nav className="flex items-center gap-4 text-sm text-gray-600">
            <Link to="/home" className="hover:text-sky-600">Home</Link>
            <Link to="/auth" className="hover:text-sky-600">Sign in</Link>
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
