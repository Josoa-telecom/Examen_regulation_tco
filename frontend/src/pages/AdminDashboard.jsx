import { useData } from '../context/DataContext'

export default function AdminDashboard() {
  const { users, toggleUser, thresholds, setThreshold } = useData()
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Administration</h1>
      <section className="card overflow-x-auto"><h2 className="text-xl font-extrabold mb-2">Comptes</h2>
        <table className="w-full"><thead><tr><th>Nom</th><th>E-mail</th><th>Rôle</th><th>État</th><th></th></tr></thead>
          <tbody>{users.map((u) => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.active ? 'Actif' : 'Suspendu'}</td>
            <td>{u.role !== 'admin' && <button className="btn-ghost" onClick={() => toggleUser(u.id)}>{u.active ? 'Suspendre' : 'Réactiver'}</button>}</td></tr>)}</tbody></table></section>
      <section className="card"><h2 className="text-xl font-extrabold mb-1">Seuils réglementaires</h2>
        <p className="text-sm mb-3">Saisissez les seuils officiels fournis par les autorités compétentes. Les valeurs actuelles sont des exemples.</p>
        <div className="grid sm:grid-cols-2 gap-3">{thresholds.map((t) => <div key={t.key}><label className="label" htmlFor={t.key}>{t.label} ({t.type === 'min' ? 'minimum' : 'maximum'})</label>
          <input id={t.key} type="number" step="0.1" className="input" value={t.value} onChange={(e) => setThreshold(t.key, Number(e.target.value))} /></div>)}</div></section>
      <p className="card text-sm">Séparation des responsabilités : ce rôle gère les comptes et la configuration, sans pouvoir de décision réglementaire.</p>
    </div>
  )
}
