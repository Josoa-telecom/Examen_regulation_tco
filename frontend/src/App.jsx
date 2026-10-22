import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Guard from './components/Guard'
import Home from './pages/Home'
import Login from './pages/Login'
import OperatorDashboard from './pages/OperatorDashboard'
import ArtecDashboard from './pages/ArtecDashboard'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="connexion" element={<Login />} />
        <Route path="operateur" element={<Guard role="operator"><OperatorDashboard /></Guard>} />
        <Route path="artec" element={<Guard role="artec"><ArtecDashboard /></Guard>} />
        <Route path="admin" element={<Guard role="admin"><AdminDashboard /></Guard>} />
        <Route path="*" element={<p>Page introuvable.</p>} />
      </Route>
    </Routes>
  )
}
