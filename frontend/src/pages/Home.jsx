import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useData } from '../context/DataContext'
import { OPERATORS, CATEGORIES, REGIONS, opName, opColor } from '../data/mock'

const METRICS = { down: 'Débit descendant (Mbit/s)', up: 'Débit montant (Mbit/s)', latency: 'Latence (ms)', availability: 'Disponibilité (%)', callFail: 'Échec des appels (%)' }

function FeedbackForm() {
  const { addFeedback } = useData()
  const blank = { operator: 'orange', category: CATEGORIES[2], rating: 5, region: '', comment: '', website: '' }
  const [f, setF] = useState(blank); const [msg, setMsg] = useState(''); const [last, setLast] = useState(0)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    if (f.website) return // piège anti-robot : le backend ajoutera limitation de débit et détection de doublons
    if (Date.now() - last < 15000) return setMsg('Merci de patienter quelques secondes avant d’envoyer un autre avis.')
    addFeedback({ operator: f.operator, category: f.category, rating: Number(f.rating), region: f.region, comment: f.comment.trim() })
    setLast(Date.now()); setF(blank); setMsg('Avis envoyé. Merci pour votre participation.')
  }
  return (
    <form onSubmit={submit} className="card space-y-3" aria-labelledby="fb-title">
      <h2 id="fb-title" className="text-xl font-extrabold">Donner mon avis</h2>
      <p className="text-sm">Sans compte. Aucune donnée personnelle n’est demandée.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="label" htmlFor="fo">Opérateur</label><select id="fo" className="input" value={f.operator} onChange={set('operator')}>{OPERATORS.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select></div>
        <div><label className="label" htmlFor="fc">Service concerné</label><select id="fc" className="input" value={f.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
        <div><label className="label" htmlFor="fr">Région (facultatif)</label><select id="fr" className="input" value={f.region} onChange={set('region')}><option value="">Non précisée</option>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></div>
        <div><label className="label" htmlFor="fn">Note : {f.rating} / 10</label><input id="fn" type="range" min="0" max="10" className="w-full" value={f.rating} onChange={set('rating')} /></div>
      </div>
      <div><label className="label" htmlFor="fm">Votre expérience</label><textarea id="fm" rows="3" maxLength="500" className="input" value={f.comment} onChange={set('comment')} /></div>
      <input type="text" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" className="hidden" value={f.website} onChange={set('website')} />
      {msg && <p role="status" className="font-semibold text-lagon-700">{msg}</p>}
      <button className="btn">Envoyer mon avis</button>
    </form>
  )
}

export default function Home() {
  const { publications, feedbacks, qos, avgRating } = useData()
  const [metric, setMetric] = useState('down'); const [filter, setFilter] = useState('all')
  const months = [...new Set(qos.map((q) => q.month))].sort()
  const chart = months.map((m) => ({ month: m, ...Object.fromEntries(qos.filter((q) => q.month === m).map((q) => [q.operator, q[metric]])) }))
  const pubs = publications.filter((p) => filter === 'all' || p.operator === filter)
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl sm:text-4xl font-extrabold max-w-3xl">Comparez Orange, Yas et Airtel, et dites ce que vous vivez sur le réseau.</h1>
        <p className="mt-2 max-w-2xl">Offres publiées, qualité de service mesurée et avis des utilisateurs réunis au même endroit, sous le regard de l’ARTEC.</p>
      </section>
      <section className="grid md:grid-cols-3 gap-4" aria-label="Opérateurs">
        {OPERATORS.map((o) => { const a = avgRating(o.id); return (
          <article key={o.id} className="card border-l-8" style={{ borderLeftColor: o.color }}>
            <h2 className="text-xl font-extrabold">{o.name}</h2>
            <p className="text-3xl font-display font-extrabold mt-2">{a === null ? '–' : a.toFixed(1)}<span className="text-base font-normal"> / 10</span></p>
            <p className="text-sm">{feedbacks.filter((f) => f.operator === o.id).length} avis de visiteurs</p>
          </article>) })}
      </section>
      <section className="card">
        <div className="flex flex-wrap items-center gap-3 mb-3"><h2 className="text-xl font-extrabold">Qualité de service mesurée</h2>
          <label className="sr-only" htmlFor="m">Indicateur</label>
          <select id="m" className="input !w-auto ml-auto" value={metric} onChange={(e) => setMetric(e.target.value)}>{Object.entries(METRICS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        <div style={{ height: 280 }}><ResponsiveContainer><BarChart data={chart}><XAxis dataKey="month" /><YAxis domain={['auto', 'auto']} /><Tooltip /><Legend formatter={opName} />
          {OPERATORS.map((o) => <Bar key={o.id} dataKey={o.id} fill={o.color} />)}</BarChart></ResponsiveContainer></div>
        <p className="text-sm mt-2">Mesures techniques fournies par les opérateurs (démo). Elles ne sont pas des avis.</p>
      </section>
      <section>
        <div className="flex flex-wrap items-center gap-2 mb-3"><h2 className="text-xl font-extrabold mr-3">Dernières publications</h2>
          {[['all', 'Tous'], ...OPERATORS.map((o) => [o.id, o.name])].map(([id, l]) => <button key={id} onClick={() => setFilter(id)} aria-pressed={filter === id} className={`btn-ghost ${filter === id ? '!bg-lagon-900 !text-white' : ''}`}>{l}</button>)}</div>
        <div className="grid md:grid-cols-3 gap-4">{pubs.map((p) => (
          <article key={p.id} className="card"><p className="text-sm font-semibold" style={{ color: opColor(p.operator) }}>{opName(p.operator)} · {p.type}</p>
            <h3 className="font-extrabold text-lg">{p.title}</h3><p className="my-2">{p.body}</p><p className="text-sm">{p.date}</p></article>))}
          {pubs.length === 0 && <p>Aucune publication pour ce filtre.</p>}</div>
      </section>
      <FeedbackForm />
      <section><h2 className="text-xl font-extrabold mb-3">Avis récents</h2>
        <ul className="grid md:grid-cols-2 gap-3">{feedbacks.slice(0, 6).map((f) => (
          <li key={f.id} className="card"><strong>{opName(f.operator)}</strong> · {f.category} · <strong>{f.rating}/10</strong>
            <p>{f.comment || 'Pas de commentaire.'}</p><p className="text-sm">{f.region || 'Région non précisée'} · {f.date}</p></li>))}</ul></section>
    </div>
  )
}
