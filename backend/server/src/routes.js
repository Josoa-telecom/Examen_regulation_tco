import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import mongoose from 'mongoose'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { User, Publication, Feedback, QoS, Threshold, OPERATORS, CATEGORIES, REGIONS } from './models.js'
import { auth, role, audit, h } from './middleware.js'

const r = Router()
const lim = (windowMs, limit, error) => rateLimit({ windowMs, limit, standardHeaders: true, legacyHeaders: false, message: { error } })
const today = () => new Date().toISOString().slice(0, 10)
const validId = (req, res, next) => (mongoose.isValidObjectId(req.params.id) ? next() : res.status(400).json({ error: 'Identifiant invalide.' }))

// ---------- Authentification ----------
const loginS = z.object({ email: z.string().email().max(120), password: z.string().min(1).max(100) })
r.post('/auth/login', lim(15 * 60e3, 10, 'Trop de tentatives. Réessayez dans 15 minutes.'), h(async (req, res) => {
  const { email, password } = loginS.parse(req.body)
  const u = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash')
  const ok = u && (await bcrypt.compare(password, u.passwordHash))
  if (!ok) { await audit(req, 'login_echec', email, { email }); return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect.' }) }
  if (!u.active) return res.status(403).json({ error: 'Ce compte est suspendu. Contactez l’administrateur.' })
  const token = jwt.sign({ sub: String(u._id), role: u.role, operator: u.operator }, process.env.JWT_SECRET, { expiresIn: '8h' })
  await audit(req, 'login', u.email, { email: u.email, role: u.role })
  res.json({ token, user: u.toJSON() })
}))

// ---------- Lecture publique ----------
r.get('/publications', h(async (q, s) => s.json(await Publication.find().sort({ createdAt: -1 }).limit(200))))
r.get('/feedbacks', h(async (q, s) => s.json(await Feedback.find().sort({ createdAt: -1 }).limit(200))))
r.get('/qos', h(async (q, s) => s.json(await QoS.find().sort({ month: 1 }))))
r.get('/thresholds', h(async (q, s) => s.json(await Threshold.find().sort({ key: 1 }))))

// ---------- Avis visiteurs (anonymes) ----------
const feedbackS = z.object({
  operator: z.enum(OPERATORS), category: z.enum(CATEGORIES), rating: z.number().int().min(0).max(10),
  region: z.enum([...REGIONS, '']).default(''), comment: z.string().trim().max(500).default(''), website: z.string().max(200).optional(),
})
r.post('/feedbacks', lim(3600e3, 20, 'Trop d’avis envoyés. Réessayez plus tard.'), h(async (req, res) => {
  const d = feedbackS.parse(req.body)
  if (d.website) return res.status(201).json({ ok: true }) // robot : ignoré silencieusement
  const ipHash = crypto.createHash('sha256').update(String(req.ip) + (process.env.IP_SALT || '')).digest('hex')
  const dup = await Feedback.exists({ ipHash, operator: d.operator, category: d.category, comment: d.comment, createdAt: { $gt: new Date(Date.now() - 864e5) } })
  if (dup) return res.status(409).json({ error: 'Cet avis a déjà été envoyé.' })
  const sentiment = d.rating >= 7 ? 'positif' : d.rating >= 5 ? 'neutre' : 'négatif'
  const f = await Feedback.create({ operator: d.operator, category: d.category, rating: d.rating, region: d.region, comment: d.comment, date: today(), sentiment, ipHash })
  res.status(201).json(f)
}))

// ---------- Opérateur : ses publications uniquement ----------
const pubS = z.object({ type: z.enum(['Offre', 'Promotion']), title: z.string().trim().min(3).max(120), body: z.string().trim().min(3).max(1000) })
r.post('/publications', auth, role('operator'), h(async (req, res) => {
  const d = pubS.parse(req.body)
  const p = await Publication.create({ ...d, operator: req.user.operator, date: today() }) // l'opérateur vient du jeton, jamais du corps
  await audit(req, 'publication_creee', String(p._id))
  res.status(201).json(p)
}))
r.delete('/publications/:id', auth, role('operator'), validId, h(async (req, res) => {
  const p = await Publication.findOneAndDelete({ _id: req.params.id, operator: req.user.operator })
  if (!p) return res.status(404).json({ error: 'Publication introuvable.' })
  await audit(req, 'publication_supprimee', req.params.id)
  res.json({ ok: true })
}))

// ---------- Administrateur ----------
r.get('/users', auth, role('admin'), h(async (q, s) => s.json(await User.find().sort({ createdAt: 1 }))))
r.patch('/users/:id/toggle', auth, role('admin'), validId, h(async (req, res) => {
  const u = await User.findById(req.params.id)
  if (!u) return res.status(404).json({ error: 'Utilisateur introuvable.' })
  if (u.role === 'admin') return res.status(400).json({ error: 'Un compte administrateur ne peut pas être suspendu ici.' })
  u.active = !u.active; await u.save()
  await audit(req, u.active ? 'compte_reactive' : 'compte_suspendu', u.email)
  res.json(u)
}))
r.put('/thresholds/:key', auth, role('admin'), h(async (req, res) => {
  const { value } = z.object({ value: z.number().finite() }).parse(req.body)
  const t = await Threshold.findOneAndUpdate({ key: req.params.key }, { value }, { new: true })
  if (!t) return res.status(404).json({ error: 'Indicateur introuvable.' })
  await audit(req, 'seuil_modifie', `${t.key}=${value}`)
  res.json(t)
}))

export default r
