import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import Registrar from './pages/Registrar';
import Dashboard from './pages/Dashboard';
import Cartas from './pages/Cartas';
import Colecao from './pages/Colecao';
import Pacotes from './pages/Pacotes';
import Boosters from './pages/Boosters';
import Criacao from './pages/Criacao';
import Laboratorio from './pages/Laboratorio';
import Missoes from './pages/Missoes';
import MissaoDiaria from './pages/MissaoDiaria';
import Evolucao from './pages/Evolucao';
import Streak from './pages/Streak';
import Titulos from './pages/Titulos';
import Progressao from './pages/Progressao';
import Guildas from './pages/Guildas';
import GuildaDetalhes from './pages/GuildaDetalhes';
import BossGuilda from './pages/BossGuilda';
import SessaoTroca from './pages/SessaoTroca';
import Ranking from './pages/Ranking';

const queryClient = new QueryClient();

function AppRotas() {
  const location = useLocation();

  const wrapProtected = (Component) => (
    <ProtectedRoute>
      <Layout>
        <Component />
      </Layout>
    </ProtectedRoute>
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/" element={wrapProtected(Dashboard)} />
        <Route path="/cartas" element={wrapProtected(Cartas)} />
        <Route path="/colecao" element={wrapProtected(Colecao)} />
        <Route path="/pacotes" element={wrapProtected(Pacotes)} />
        <Route path="/boosters" element={wrapProtected(Boosters)} />
        <Route path="/criacao" element={wrapProtected(Criacao)} />
        <Route path="/laboratorio" element={wrapProtected(Laboratorio)} />
        <Route path="/missoes" element={wrapProtected(Missoes)} />
        <Route path="/missao-diaria" element={wrapProtected(MissaoDiaria)} />
        <Route path="/evolucao" element={wrapProtected(Evolucao)} />
        <Route path="/streak" element={wrapProtected(Streak)} />
        <Route path="/titulos" element={wrapProtected(Titulos)} />
        <Route path="/progressao" element={wrapProtected(Progressao)} />
        <Route path="/guildas" element={wrapProtected(Guildas)} />
        <Route path="/guildas/:id" element={wrapProtected(GuildaDetalhes)} />
        <Route path="/boss-guilda" element={wrapProtected(BossGuilda)} />
        <Route path="/sessao-troca/:id" element={wrapProtected(SessaoTroca)} />
        <Route path="/ranking" element={wrapProtected(Ranking)} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <AppRotas />
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}