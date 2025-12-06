import { createBrowserRouter } from "react-router";
import { MainLayout } from "../layout/MainLayout";
import { Home } from "../pages/Home/Home";
import { AllClubs } from "../pages/Clubs/AllClubs/AllClubs";
import { UpComingEvents } from "../pages/Events/UpComingEvents/UpComingEvents";
import { Register } from "../pages/Register/Register";
import { Login } from "../pages/Login/Login";
;

export const router = createBrowserRouter([
    {
        path: '/',
        Component: MainLayout,
        children: [
            {
                index: true,
                Component: Home,
            },
            {
                path: '/clubs',
                Component: AllClubs,
            },
            {
                path: '/events',
                Component: UpComingEvents,
            },
            {
                path: '/register',
                Component: Register,
            },
            {
                path: '/login',
                Component: Login,
            },
        ]
    }
])