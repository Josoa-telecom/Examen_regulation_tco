import { createContext, useContext, useState } from 'react'
import { USERS } from '../data/mock'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

// MODE DÉMO : mot de passe unique "demo123". Remplacé par POST /api/auth/login (JWT) à l'étape backend.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const login = (email, password) => {
    const u = USERS.find((x) => x.email === email.trim().toLowerCase())
    if (!u || password !== 'demo123') return { ok: false, error: 'Identifiant ou mot de passe incorrect.' }
    if (!u.active) return { ok: false, error: 'Ce compte est suspendu. Contactez l’administrateur.' }
    setUser(u)
    return { ok: true, user: u }
  }
  return <Ctx.Provider value={{ user, login, logout: () => setUser(null) }}>{children}</Ctx.Provider>
}
