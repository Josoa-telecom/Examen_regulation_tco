import { useData } from '../context/DataContext'
import { OPERATORS, opName } from '../data/mock'

export default function ArtecDashboard() {
  const { thresholds, compliance, feedbacks, publications, avgRating } = useData()
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Tableau de bord de régulation</h1>
      <p className="card text-sm">Les statuts ci-dessous comparent des mesures aux seuils configurés. Ils orientent la vérification. Toute décision ou sanction relève d’un agent habilité, après procédure contradictoire.</p>
      <div className="grid md:grid-cols-3 gap-4">
        {OPERATORS.map((o) => { const c = compliance(o.id); return (
          <article key={o.id} className="card border-l-8" style={{ borderLeftColor: o.color }}>
            <h2 className="font-extrabold text-lg">{o.name}</h2><p className="text-2xl font-display font-extrabold">{c.status}</p>
            <ul className="text-sm mt-2 list-disc pl-5">{c.breaches.length ? c.breaches.map((t) => <li key={t.key}>{t.label} : {c.q[t.key]} (seuil {t.type === 'min' ? '≥' : '≤'} {t.value})</li>) : <li>Tous les seuils respectés.</li>}</ul>
            <p className="text-sm mt-2">{publications.filter((p) => p.operator === o.id).length} publications · {feedbacks.filter((f) => f.operator === o.id).length} avis · note {avgRating(o.id)?.toFixed(1)}</p>
          </article>) })}
      </div>
      <section className="card overflow-x-auto"><h2 className="text-xl font-extrabold mb-2">Mesures techniques et seuils (dernier mois)</h2>
        <table className="w-full"><thead><tr><th>Indicateur</th><th>Seuil</th>{OPERATORS.map((o) => <th key={o.id}>{o.name}</th>)}</tr></thead>
          <tbody>{thresholds.map((t) => <tr key={t.key}><td>{t.label}</td><td>{t.type === 'min' ? '≥' : '≤'} {t.value}</td>
            {OPERATORS.map((o) => { const v = compliance(o.id).q[t.key]; const bad = t.type === 'min' ? v < t.value : v > t.value; return <td key={o.id} className={bad ? 'font-extrabold text-red-700' : ''}>{v}{bad ? ' (hors seuil)' : ''}</td> })}</tr>)}</tbody></table></section>
      <section className="card"><h2 className="text-xl font-extrabold mb-2">Sentiment des avis visiteurs (indice subjectif)</h2>
        <table className="w-full"><thead><tr><th>Opérateur</th><th>Positif</th><th>Neutre</th><th>Négatif</th></tr></thead>
          <tbody>{OPERATORS.map((o) => <tr key={o.id}><td>{opName(o.id)}</td>{['positif', 'neutre', 'négatif'].map((s) => <td key={s}>{feedbacks.filter((f) => f.operator === o.id && f.sentiment === s).length}</td>)}</tr>)}</tbody></table></section>
    </div>
  )
}
