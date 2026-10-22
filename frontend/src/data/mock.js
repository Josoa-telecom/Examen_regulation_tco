// Données SYNTHÉTIQUES de démonstration. Seront remplacées par l'API MongoDB à l'étape backend.
export const OPERATORS = [
  { id: 'orange', name: 'Orange Madagascar', color: '#E8710A' },
  { id: 'yas', name: 'Yas Madagascar', color: '#C9A100' },
  { id: 'airtel', name: 'Airtel Madagascar', color: '#D61F26' },
]
export const opName = (id) => OPERATORS.find((o) => o.id === id)?.name ?? id
export const opColor = (id) => OPERATORS.find((o) => o.id === id)?.color ?? '#13566B'

export const CATEGORIES = ['Appels téléphoniques','SMS','Internet mobile','Couverture réseau','Débit de téléchargement','Débit d’envoi','Latence','Stabilité de la connexion','Prix et facturation','Service client']
export const REGIONS = ['Analamanga','Atsinanana','Boeny','Diana','Haute Matsiatra','Atsimo-Andrefana','Autre']

export const QOS = [
  { month: '2026-05', operator: 'orange', down: 9.1, up: 3.2, latency: 62, availability: 99.4, callFail: 1.6 },
  { month: '2026-06', operator: 'orange', down: 9.4, up: 3.3, latency: 60, availability: 99.5, callFail: 1.5 },
  { month: '2026-07', operator: 'orange', down: 9.8, up: 3.4, latency: 58, availability: 99.5, callFail: 1.4 },
  { month: '2026-05', operator: 'yas', down: 7.6, up: 2.6, latency: 71, availability: 99.1, callFail: 2.0 },
  { month: '2026-06', operator: 'yas', down: 7.1, up: 2.4, latency: 78, availability: 98.9, callFail: 2.3 },
  { month: '2026-07', operator: 'yas', down: 6.4, up: 2.2, latency: 85, availability: 98.6, callFail: 2.6 },
  { month: '2026-05', operator: 'airtel', down: 6.0, up: 2.1, latency: 74, availability: 99.2, callFail: 1.9 },
  { month: '2026-06', operator: 'airtel', down: 6.3, up: 2.2, latency: 72, availability: 99.3, callFail: 1.8 },
  { month: '2026-07', operator: 'airtel', down: 6.6, up: 2.3, latency: 70, availability: 99.3, callFail: 1.7 },
]

// Seuils d'EXEMPLE : à remplacer par les seuils officiels (espace administrateur)
export const THRESHOLDS = [
  { key: 'down', label: 'Débit descendant (Mbit/s)', type: 'min', value: 5 },
  { key: 'latency', label: 'Latence (ms)', type: 'max', value: 80 },
  { key: 'availability', label: 'Disponibilité (%)', type: 'min', value: 99 },
  { key: 'callFail', label: 'Échec des appels (%)', type: 'max', value: 2 },
]

export const PUBLICATIONS = [
  { id: 1, operator: 'orange', type: 'Offre', title: 'Forfait Internet 10 Go', body: '10 Go valables 30 jours. Comment évaluez-vous la qualité de notre connexion Internet mobile dans votre région ?', date: '2026-10-12' },
  { id: 2, operator: 'yas', type: 'Promotion', title: 'Bonus appels week-end', body: 'Appels vers tous les réseaux avec bonus de 50 % le samedi et le dimanche.', date: '2026-10-15' },
  { id: 3, operator: 'airtel', type: 'Offre', title: 'Pack SMS illimités', body: 'SMS illimités vers tous les réseaux pendant 7 jours.', date: '2026-10-18' },
]

export const FEEDBACKS = [
  { id: 1, operator: 'orange', category: 'Internet mobile', rating: 8, region: 'Analamanga', comment: 'Connexion stable en ville.', date: '2026-10-10', sentiment: 'positif' },
  { id: 2, operator: 'yas', category: 'Internet mobile', rating: 3, region: 'Atsinanana', comment: 'Très lent le soir.', date: '2026-10-14', sentiment: 'négatif' },
  { id: 3, operator: 'airtel', category: 'Prix et facturation', rating: 6, region: 'Boeny', comment: 'Tarifs corrects.', date: '2026-10-16', sentiment: 'neutre' },
  { id: 4, operator: 'yas', category: 'Appels téléphoniques', rating: 4, region: 'Analamanga', comment: 'Appels coupés fréquemment.', date: '2026-10-17', sentiment: 'négatif' },
  { id: 5, operator: 'orange', category: 'Service client', rating: 7, region: 'Diana', comment: 'Réponse rapide.', date: '2026-10-19', sentiment: 'positif' },
]

export const USERS = [
  { id: 1, email: 'admin@demo.mg', name: 'Admin technique', role: 'admin', active: true },
  { id: 2, email: 'agent@artec.demo', name: 'Agent ARTEC', role: 'artec', active: true },
  { id: 3, email: 'orange@demo.mg', name: 'Orange Madagascar', role: 'operator', operator: 'orange', active: true },
  { id: 4, email: 'yas@demo.mg', name: 'Yas Madagascar', role: 'operator', operator: 'yas', active: true },
  { id: 5, email: 'airtel@demo.mg', name: 'Airtel Madagascar', role: 'operator', operator: 'airtel', active: true },
]
