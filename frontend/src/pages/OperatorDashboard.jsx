import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { opName, opColor } from '../data/mock'

export default function OperatorDashboard() {
  const { user } = useAuth(); const op = user.operator
  const { publications, feedbacks, qos, avgRating, addPublication, removePublication, compliance } = useData()
  const [p, setP] = useState({ type: 'Offre', title: '', body: '' }); const [msg, setMsg] = useState('')
  const mine = publications.filter((x) => x.operator === op); const fbs = feedbacks.filter((f) => f.operator === op)
  const c = compliance(op)
  const publish = (e) => { e.preventDefault(); addPublication({ ...p, operator: op }); setP({ type: 'Offre', title: '', body: '' }); setMsg('Publication ajoutée.') }
  const csv = () => {
    const rows = [['date', 'service', 'note', 'région', 'commentaire'], ...fbs.map((f) => [f.date, f.category, f.rating, f.region, `"${f.comment.replace(/"/g, '""')}"`])]
    const url = URL.createObjectURL(new Blob(['\ufeff' + rows.map((r) => r.join(';')).join('\n')], { type: 'text/csv' }))
    const a = document.createElement('a'); a.href = url; a.download = `avis-${op}.csv`; a.click(); URL.revokeObjectURL(url)
  }
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold" style={{ color: opColor(op) }}>{opName(op)}</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card"><p className="text-sm">Note moyenne</p><p className="text-3xl font-display font-extrabold">{avgRating(op)?.toFixed(1) ?? '–'}/10</p></div>
        <div className="card"><p className="text-sm">Avis reçus</p><p className="text-3xl font-display font-extrabold">{fbs.length}</p></div>
        <div className="card"><p className="text-sm">Situation selon les seuils configurés</p><p className="text-xl font-display font-extrabold">{c.status}</p><p className="text-xs">Indication automatique, sans valeur de décision.</p></div>
      </div>
      <section className="card"><h2 className="text-xl font-extrabold mb-2">Évolution du débit descendant (Mbit/s)</h2>
        <div style={{ height: 220 }}><ResponsiveContainer><LineChart data={qos.filter((q) => q.operator === op)}><XAxis dataKey="month" /><YAxis domain={['auto', 'auto']} /><Tooltip /><Line dataKey="down" stroke={opColor(op)} strokeWidth={3} /></LineChart></ResponsiveContainer></div></section>
      <form onSubmit={publish} className="card space-y-3"><h2 className="text-xl font-extrabold">Nouvelle publication</h2>
        <div className="grid sm:grid-cols-3 gap-3"><div><label className="label" htmlFor="pt">Type</label><select id="pt" className="input" value={p.type} onChange={(e) => setP({ ...p, type: e.target.value })}><option>Offre</option><option>Promotion</option></select></div>
          <div className="sm:col-span-2"><label className="label" htmlFor="pti">Titre</label><input id="pti" required className="input" value={p.title} onChange={(e) => setP({ ...p, title: e.target.value })} /></div></div>
        <div><label className="label" htmlFor="pb">Description</label><textarea id="pb" required rows="3" className="input" value={p.body} onChange={(e) => setP({ ...p, body: e.target.value })} /></div>
        {msg && <p role="status" className="font-semibold">{msg}</p>}<button className="btn">Publier</button></form>
      <section className="card"><h2 className="text-xl font-extrabold mb-2">Mes publications</h2><table className="w-full"><tbody>{mine.map((x) => <tr key={x.id}><td>{x.type}</td><td>{x.title}</td><td>{x.date}</td><td><button className="btn-ghost" onClick={() => removePublication(x.id)}>Supprimer</button></td></tr>)}</tbody></table></section>
      <section className="card overflow-x-auto"><div className="flex items-center mb-2"><h2 className="text-xl font-extrabold">Avis des visiteurs</h2><button className="btn ml-auto" onClick={csv}>Exporter en CSV</button></div>
        <table className="w-full"><thead><tr><th>Date</th><th>Service</th><th>Note</th><th>Sentiment</th><th>Commentaire</th></tr></thead><tbody>{fbs.map((f) => <tr key={f.id}><td>{f.date}</td><td>{f.category}</td><td>{f.rating}</td><td>{f.sentiment}</td><td>{f.comment}</td></tr>)}</tbody></table></section>
    </div>
  )
}
