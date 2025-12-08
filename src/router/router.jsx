import { createBrowserRouter } from "react-router";
import { MainLayout } from "../layout/MainLayout";
import { Home } from "../pages/Home/Home";
import { AllClubs } from "../pages/Clubs/AllClubs/AllClubs";
import { UpComingEvents } from "../pages/Events/UpComingEvents/UpComingEvents";
import { Register } from "../pages/Register/Register";
import { Login } from "../pages/Login/Login";
import { Profile } from "../pages/Profile/Profile";
import { DashboardLayout } from "../layout/DashboardLayout";
import { AdminPanel } from "../pages/DashBoard/AdminPanel/AdminPanel";
import { ManageUsers } from "../pages/DashBoard/ClubManager/ManageUsers";
import { MemberDashboard } from "../pages/DashBoard/Member/MemberDashboard";



export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/clubs",
        Component: AllClubs,
      },
      {
        path: "/events",
        Component: UpComingEvents,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/dashboard",
        Component: DashboardLayout,
        children: [
          {
            path:'admin',
            Component: AdminPanel,
          },
          {
            path: "manager",
            Component: ManageUsers,
          },
          {
            path: "member",
            Component: MemberDashboard,
          },
        ],
      },

      {
        path: "/profile",
        Component: Profile,
      },
    ],
  },
]);
