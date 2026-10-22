import { createContext, useContext, useState } from 'react'
import { PUBLICATIONS, FEEDBACKS, USERS, THRESHOLDS, QOS } from '../data/mock'

const Ctx = createContext(null)
export const useData = () => useContext(Ctx)

// Couche d'accès aux données : chaque fonction deviendra un appel fetch('/api/...') au backend.
export function DataProvider({ children }) {
  const [publications, setPublications] = useState(PUBLICATIONS)
  const [feedbacks, setFeedbacks] = useState(FEEDBACKS)
  const [users, setUsers] = useState(USERS)
  const [thresholds, setThresholds] = useState(THRESHOLDS)

  const addFeedback = (f) => setFeedbacks((l) => [{ ...f, id: Date.now(), date: new Date().toISOString().slice(0, 10), sentiment: f.rating >= 7 ? 'positif' : f.rating >= 5 ? 'neutre' : 'négatif' }, ...l])
  const addPublication = (p) => setPublications((l) => [{ ...p, id: Date.now(), date: new Date().toISOString().slice(0, 10) }, ...l])
  const removePublication = (id) => setPublications((l) => l.filter((p) => p.id !== id))
  const toggleUser = (id) => setUsers((l) => l.map((u) => (u.id === id ? { ...u, active: !u.active } : u)))
  const setThreshold = (key, value) => setThresholds((l) => l.map((t) => (t.key === key ? { ...t, value } : t)))

  const avgRating = (op) => { const l = feedbacks.filter((f) => f.operator === op); return l.length ? l.reduce((s, f) => s + f.rating, 0) / l.length : null }
  const latestQos = (op) => QOS.filter((q) => q.operator === op).sort((a, b) => b.month.localeCompare(a.month))[0]
  // Compare les mesures aux seuils. Résultat = INDICATION, jamais une décision.
  const compliance = (op) => {
    const q = latestQos(op)
    const breaches = thresholds.filter((t) => (t.type === 'min' ? q[t.key] < t.value : q[t.key] > t.value))
    const status = breaches.length === 0 ? 'Conforme' : breaches.length === 1 ? 'À surveiller' : 'Vérification nécessaire'
    return { q, breaches, status }
  }
  return (
    <Ctx.Provider value={{ publications, feedbacks, users, thresholds, qos: QOS, addFeedback, addPublication, removePublication, toggleUser, setThreshold, avgRating, compliance }}>
      {children}
    </Ctx.Provider>
  )
}
