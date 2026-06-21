import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { navLink, navLinkActive, container, btnGhost, btnBase } from '../styles/components';
import { IconHome, IconCartas, IconColecao, IconPacotes, IconMissoes, IconDiaria, IconStreak, IconGuildas, IconRanking, IconSair, IconMenu, IconFechar, IconMoedas } from '../utils/icones';

const rotas = [
  { path: '/', label: 'Dashboard', icone: IconHome },
  { path: '/cartas', label: 'Cartas', icone: IconCartas },
  { path: '/colecao', label: 'Coleção', icone: IconColecao },
  { path: '/pacotes', label: 'Pacotes', icone: IconPacotes },
  { path: '/missoes', label: 'Missões', icone: IconMissoes },
  { path: '/missao-diaria', label: 'Diária', icone: IconDiaria },
  { path: '/streak', label: 'Streak', icone: IconStreak },
  { path: '/guildas', label: 'Guildas', icone: IconGuildas },
  { path: '/ranking', label: 'Ranking', icone: IconRanking },
];

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-40">
      <div className={`${container} flex items-center justify-between h-16`}>
        <Link to="/" className="flex items-center gap-2">
          <IconMissoes size={24} className="text-cyan-400" />
          <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">Heróis</span>
        </Link>
        <div className="hidden lg:flex items-center gap-1">
          {rotas.map((r) => (
            <Link key={r.path} to={r.path} className={location.pathname === r.path ? navLinkActive : navLink}>
              <r.icone size={16} />
              <span>{r.label}</span>
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-3">
          {usuario && (
            <>
              <div className="text-right mr-2">
                <div className="text-sm font-semibold text-slate-200">{usuario.nomeUsuario}</div>
                <div className="text-xs text-amber-400 flex items-center gap-1"><IconMoedas size={10} /> {usuario.moedas}</div>
              </div>
              <button onClick={logout} className={`${btnBase} ${btnGhost} text-xs`}><IconSair size={14} /> Sair</button>
            </>
          )}
        </div>
        <button className="lg:hidden p-2 text-slate-400 hover:text-slate-100" onClick={() => setMenuAberto(!menuAberto)}>
          {menuAberto ? <IconFechar size={20} /> : <IconMenu size={20} />}
        </button>
      </div>
      {menuAberto && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {rotas.map((r) => (
              <Link key={r.path} to={r.path} onClick={() => setMenuAberto(false)} className={location.pathname === r.path ? navLinkActive : navLink}>
                <r.icone size={16} />
                <span>{r.label}</span>
              </Link>
            ))}
            {usuario && (
              <button onClick={logout} className={`${navLink} w-full text-left text-red-400`}>
                <IconSair size={16} />
                <span>Sair</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}