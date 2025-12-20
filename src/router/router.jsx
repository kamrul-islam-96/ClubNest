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
import { MyClubs } from "../pages/DashBoard/ClubManager/MyClubs/MyClubs";
import { ClubMangerLayout } from "../layout/ClubMangerLayout";
import { CreateClub } from "../Components/CreateClub";
import { ClubDetails } from "../pages/Clubs/ClubDetails/ClubDetails";
import { AdminPanelLayout } from "../layout/AdminPanelLayout";
import { ManageUsersRole } from "../pages/DashBoard/AdminPanel/ManageUsers/ManageUsersRole";
import { ManageClubs } from "../pages/DashBoard/AdminPanel/ManageClubs/ManageClubs";
import { ManagePayments } from "../pages/DashBoard/AdminPanel/ManagePayments/ManagePayments";
import { ClubMembers } from "../pages/DashBoard/ClubManager/ClubMembers/ClubMembers";
import { EventsManagement } from "../pages/DashBoard/ClubManager/EventsManagement/EventsManagement";
import { CreateEvents } from "../Components/CreateEvents";
import { EventDetails } from "../pages/Events/EventDetails/EventDetails";
import { EventsRegistrations } from "../pages/DashBoard/ClubManager/EventsRegistrations/EventsRegistrations";
import { EditClub } from "../Components/EditClub";
import { EditEvent } from "../Components/EditEvent";
import ErrorPage from "../Components/ErrorPage";



export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    errorElement: <ErrorPage />,
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
        path: "/clubs/:id",
        Component: ClubDetails,
      },
      {
        path: "/events",
        Component: UpComingEvents,
      },
      {
        path: "/events/:id",
        Component: EventDetails,
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
            Component: AdminPanelLayout,
            children: [
              {
                index: true,
                Component: AdminPanel,
              },
              {
                path: 'manage-users',
                Component: ManageUsersRole,
              },
              {
                path: 'manage-clubs',
                Component: ManageClubs,
              },
              {
                path: 'payments',
                Component: ManagePayments,
              },
            ]
          },
          {
            path: "manager",
            Component: ClubMangerLayout,
            children: [
              {
                index: true,
                Component: ManageUsers,
              },
              {
                path: 'my-clubs',
                Component: MyClubs,
              },
              {
                path: 'create-club',
                Component: CreateClub,
              },
              {
                path: 'edit-club/:id',
                Component: EditClub,
              },
              {
                path: 'club-members',
                Component: ClubMembers,
              },
              {
                path: 'events',
                Component: EventsManagement,
              },
              {
                path: 'edit-event/:id',
                Component: EditEvent,
              },
              {
                path: 'create-event',
                Component: CreateEvents,
              },
              {
                path: 'event-registrations',
                Component: EventsRegistrations,
              },
            ]
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
