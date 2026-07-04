import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <button
        onClick={() => navigate('/auth')}
        className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
      >
        Sign In
      </button>
    </div>
  );
}

export default Landing;
