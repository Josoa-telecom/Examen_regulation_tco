import { createContext, useContext, useState } from 'react'
import { api, setToken } from '../api'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(sessionStorage.getItem('user')) } catch { return null } })
  const login = async (email, password) => {
    try {
      const { token, user } = await api('/auth/login', { method: 'POST', body: { email, password } })
      setToken(token); sessionStorage.setItem('user', JSON.stringify(user)); setUser(user)
      return { ok: true, user }
    } catch (e) { return { ok: false, error: e.message } }
  }
  const logout = () => { setToken(null); sessionStorage.removeItem('user'); setUser(null) }
  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>
}
