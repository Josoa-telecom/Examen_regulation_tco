import 'dotenv/config'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { User, Publication, Feedback, QoS, Threshold } from './models.js'

if (process.env.NODE_ENV === 'production') { console.error('Seed interdit en production.'); process.exit(1) }
await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/artec')
await Promise.all([User, Publication, Feedback, QoS, Threshold].map((m) => m.deleteMany({})))

const passwordHash = await bcrypt.hash('demo123', 10)
await User.insertMany([
  { email: 'admin@demo.mg', name: 'Admin technique', role: 'admin' },
  { email: 'agent@artec.demo', name: 'Agent ARTEC', role: 'artec' },
  { email: 'orange@demo.mg', name: 'Orange Madagascar', role: 'operator', operator: 'orange' },
  { email: 'yas@demo.mg', name: 'Yas Madagascar', role: 'operator', operator: 'yas' },
  { email: 'airtel@demo.mg', name: 'Airtel Madagascar', role: 'operator', operator: 'airtel' },
].map((u) => ({ ...u, passwordHash })))

await Publication.insertMany([
  { operator: 'orange', type: 'Offre', title: 'Forfait Internet 10 Go', body: '10 Go valables 30 jours. Comment évaluez-vous la qualité de notre connexion Internet mobile dans votre région ?', date: '2026-10-12' },
  { operator: 'yas', type: 'Promotion', title: 'Bonus appels week-end', body: 'Appels vers tous les réseaux avec bonus de 50 % le samedi et le dimanche.', date: '2026-10-15' },
  { operator: 'airtel', type: 'Offre', title: 'Pack SMS illimités', body: 'SMS illimités vers tous les réseaux pendant 7 jours.', date: '2026-10-18' },
])
await Feedback.insertMany([
  { operator: 'orange', category: 'Internet mobile', rating: 8, region: 'Analamanga', comment: 'Connexion stable en ville.', date: '2026-10-10', sentiment: 'positif' },
  { operator: 'yas', category: 'Internet mobile', rating: 3, region: 'Atsinanana', comment: 'Très lent le soir.', date: '2026-10-14', sentiment: 'négatif' },
  { operator: 'airtel', category: 'Prix et facturation', rating: 6, region: 'Boeny', comment: 'Tarifs corrects.', date: '2026-10-16', sentiment: 'neutre' },
  { operator: 'yas', category: 'Appels téléphoniques', rating: 4, region: 'Analamanga', comment: 'Appels coupés fréquemment.', date: '2026-10-17', sentiment: 'négatif' },
  { operator: 'orange', category: 'Service client', rating: 7, region: 'Diana', comment: 'Réponse rapide.', date: '2026-10-19', sentiment: 'positif' },
])
const q = (operator, rows) => rows.map(([month, down, up, latency, availability, callFail]) => ({ operator, month, down, up, latency, availability, callFail }))
await QoS.insertMany([
  ...q('orange', [['2026-05', 9.1, 3.2, 62, 99.4, 1.6], ['2026-06', 9.4, 3.3, 60, 99.5, 1.5], ['2026-07', 9.8, 3.4, 58, 99.5, 1.4]]),
  ...q('yas', [['2026-05', 7.6, 2.6, 71, 99.1, 2.0], ['2026-06', 7.1, 2.4, 78, 98.9, 2.3], ['2026-07', 6.4, 2.2, 85, 98.6, 2.6]]),
  ...q('airtel', [['2026-05', 6.0, 2.1, 74, 99.2, 1.9], ['2026-06', 6.3, 2.2, 72, 99.3, 1.8], ['2026-07', 6.6, 2.3, 70, 99.3, 1.7]]),
])
// Seuils d'EXEMPLE à remplacer par les seuils officiels
await Threshold.insertMany([
  { key: 'down', label: 'Débit descendant (Mbit/s)', type: 'min', value: 5 },
  { key: 'latency', label: 'Latence (ms)', type: 'max', value: 80 },
  { key: 'availability', label: 'Disponibilité (%)', type: 'min', value: 99 },
  { key: 'callFail', label: 'Échec des appels (%)', type: 'max', value: 2 },
])
console.log('Base initialisée (données synthétiques). Comptes : admin@demo.mg, agent@artec.demo, orange@demo.mg, yas@demo.mg, airtel@demo.mg — mot de passe : demo123')
await mongoose.disconnect()
