import { Outlet } from "react-router";
import DashBoardNavbar from "../pages/DashBoard/DashboardSared/DashBoardNavbar";

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashBoardNavbar />
      <main className="flex-1 md:ml-64 p-6">
        <Outlet />
      </main>
    </div>
  );
};
