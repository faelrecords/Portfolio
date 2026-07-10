import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';

const isAdmin = window.location.pathname.startsWith('/adm');
const App = lazy(() => isAdmin ? import('./admin/AdminApp') : import('./public/PublicApp'));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<div className="site-loading"><img src="/assets/mark.svg" alt="" /><span>Carregando interface</span></div>}>
      <App />
    </Suspense>
  </StrictMode>,
);
