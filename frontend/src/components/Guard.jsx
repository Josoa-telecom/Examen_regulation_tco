import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Contrôle d'accès par rôle (le backend refera la même vérification côté serveur).
export default function Guard({ role, children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/connexion" replace />
  if (user.role !== role) return <Navigate to="/" replace />
  return children
}
