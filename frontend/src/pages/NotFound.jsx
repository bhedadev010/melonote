import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-center">
      <h1 className="text-6xl font-light text-gray-300 mb-4">404</h1>
      <p className="text-gray-500 mb-8">This page doesn&apos;t exist.</p>
      <Link
        to="/"
        className="text-primary-600 hover:text-primary-700 transition-colors"
      >
        Return home
      </Link>
    </div>
  );
}

export default NotFound;
