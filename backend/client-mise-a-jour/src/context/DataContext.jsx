import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../api'
import { useAuth } from './AuthContext'

const Ctx = createContext(null)
export const useData = () => useContext(Ctx)

export function DataProvider({ children }) {
  const { user, logout } = useAuth()
  const [d, setD] = useState(null)
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const [publications, feedbacks, qos, thresholds] = await Promise.all(['/publications', '/feedbacks', '/qos', '/thresholds'].map((p) => api(p)))
      setD({ publications, feedbacks, qos, thresholds })
      setUsers(user?.role === 'admin' ? await api('/users') : [])
      setError('')
    } catch (e) { setError(e.message) }
  }, [user])
  useEffect(() => { load() }, [load])

  const run = (fn) => async (...a) => {
    try { await fn(...a); await load(); return { ok: true } }
    catch (e) { if (/expirée|indisponible/.test(e.message)) logout(); setError(e.message); return { ok: false, error: e.message } }
  }
  const addFeedback = async (f) => { try { await api('/feedbacks', { method: 'POST', body: f }); await load(); return { ok: true } } catch (e) { return { ok: false, error: e.message } } }
  const addPublication = run((p) => api('/publications', { method: 'POST', body: { type: p.type, title: p.title, body: p.body } }))
  const removePublication = run((id) => api(`/publications/${id}`, { method: 'DELETE' }))
  const toggleUser = run((id) => api(`/users/${id}/toggle`, { method: 'PATCH' }))
  const setThreshold = (key, value) => {
    setD((p) => ({ ...p, thresholds: p.thresholds.map((t) => (t.key === key ? { ...t, value } : t)) }))
    api(`/thresholds/${key}`, { method: 'PUT', body: { value } }).catch((e) => setError(e.message))
  }

  if (!d) return <p className="p-6" role={error ? 'alert' : 'status'}>{error ? <>{error} <button className="btn-ghost" onClick={load}>Réessayer</button></> : 'Chargement…'}</p>

  const { publications, feedbacks, qos, thresholds } = d
  const avgRating = (op) => { const l = feedbacks.filter((f) => f.operator === op); return l.length ? l.reduce((s, f) => s + f.rating, 0) / l.length : null }
  // Compare les mesures aux seuils. Résultat = INDICATION, jamais une décision.
  const compliance = (op) => {
    const q = qos.filter((x) => x.operator === op).sort((a, b) => b.month.localeCompare(a.month))[0]
    if (!q) return { q: {}, breaches: [], status: 'Données insuffisantes' }
    const breaches = thresholds.filter((t) => (t.type === 'min' ? q[t.key] < t.value : q[t.key] > t.value))
    return { q, breaches, status: breaches.length === 0 ? 'Conforme' : breaches.length === 1 ? 'À surveiller' : 'Vérification nécessaire' }
  }
  return (
    <Ctx.Provider value={{ publications, feedbacks, users, thresholds, qos, addFeedback, addPublication, removePublication, toggleUser, setThreshold, avgRating, compliance }}>
      {error && <p role="alert" className="bg-red-100 text-red-800 font-semibold px-4 py-2 text-center">{error}</p>}
      {children}
    </Ctx.Provider>
  )
}
