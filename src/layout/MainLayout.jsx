import { NavBar } from '../pages/shared/NavBar/NavBar'
import { Outlet } from 'react-router'
import { Footer } from '../pages/shared/Footer/Footer'

export const MainLayout = () => {
  return (
    <div>
        <NavBar />
        <Outlet />
        <Footer />
    </div>
  )
}
