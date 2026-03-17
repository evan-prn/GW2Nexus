// frontend/src/components/layout/RootLayout.jsx
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../providers/AuthProvider'
import Navbar from './Navbar'
import Footer from './Footer'

/**
 * RootLayout — Enveloppe toutes les pages avec Navbar + Footer.
 *
 * Utilisé comme `element` du layout parent dans createBrowserRouter,
 * ce qui évite de répéter Navbar/Footer dans App.jsx ou dans chaque page.
 *
 * Remarque : les pages d'auth (login, register…) héritent aussi de ce
 * layout — c'est intentionnel pour conserver la navbar sur ces pages.
 * Si tu veux un layout différent pour l'auth (ex: pleine page sans nav),
 * crée un AuthLayout.jsx séparé et imbrique les GuestRoutes dedans.
 */
const RootLayout = () => {
  const { user, logout } = useAuth()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar user={user} onLogout={logout} />
      <main style={{ flexGrow: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default RootLayout