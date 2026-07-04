import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Journal from './pages/Journal';
import Editor from './pages/Editor';
import NotFound from './pages/NotFound';

function RootRoute() {
  const token = localStorage.getItem('melonote-token');

  return token ? <Navigate to="/journal" replace /> : <Auth />;
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<RootRoute />} />
        <Route path="/home" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
