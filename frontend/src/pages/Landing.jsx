import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="animate-fade-in">
        <h1 className="text-5xl font-light text-gray-900 mb-4 tracking-tight">
          Melonote
        </h1>
        <p className="text-lg text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
          A calm space for personal reflection.<br />
          Write freely, discover insights, and grow.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navigate('/auth')}
            className="rounded-full bg-sky-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-sky-600 hover:scale-105 active:scale-95"
          >
            Get started
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="rounded-full border border-gray-300 px-8 py-3.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50 hover:scale-105 active:scale-95"
          >
            Sign in
          </button>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl animate-slide-up">
        <div className="rounded-2xl bg-white border border-gray-100 p-5 text-left shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-sky-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-800 mb-1">Journal Freely</h3>
          <p className="text-xs text-gray-500 leading-relaxed">Write without distractions. Your thoughts, your space.</p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 p-5 text-left shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-emerald-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-800 mb-1">Spark Ideas</h3>
          <p className="text-xs text-gray-500 leading-relaxed">Get thoughtful prompts to deepen your reflection.</p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 p-5 text-left shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-violet-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-800 mb-1">AI Chat</h3>
          <p className="text-xs text-gray-500 leading-relaxed">Chat with an AI that understands your journal history.</p>
        </div>
      </div>
    </div>
  );
}

export default Landing;