import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MENUS = {
  visitor: [['/', 'Accueil']],
  operator: [['/', 'Public'], ['/operateur', 'Mon espace']],
  artec: [['/', 'Public'], ['/artec', 'Régulation']],
  admin: [['/', 'Public'], ['/admin', 'Administration']],
}
export default function Layout() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const items = MENUS[user?.role ?? 'visitor']
  const cls = ({ isActive }) => `px-3 py-2 rounded-md font-semibold ${isActive ? 'bg-white text-lagon-900' : 'text-white hover:bg-lagon-700'}`
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-lagon-900">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <span className="font-display font-extrabold text-white text-lg mr-4">Observatoire télécoms MG</span>
          <nav className="flex gap-1 flex-wrap" aria-label="Navigation principale">
            {items.map(([to, label]) => <NavLink key={to} to={to} end className={cls}>{label}</NavLink>)}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-white text-sm">
            {user ? (<><span>{user.name}</span><button className="btn-ghost !text-white !border-white hover:!bg-lagon-700" onClick={() => { logout(); nav('/') }}>Se déconnecter</button></>)
              : <NavLink to="/connexion" className="btn-ghost !text-white !border-white hover:!bg-lagon-700">Espace professionnel</NavLink>}
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6"><Outlet /></main>
      <footer className="text-center text-sm py-4 text-lagon-700">Données de démonstration synthétiques. Les avis des visiteurs sont subjectifs et distincts des mesures techniques.</footer>
    </div>
  )
}
