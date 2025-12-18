import { Outlet } from "react-router";
import DashBoardNavbar from "../pages/DashBoard/DashboardSared/DashBoardNavbar";

export const DashboardLayout = () => {
  return (
    <div>
      <DashBoardNavbar />
      <main className="flex-1 md:ml-64 pl-8 pr-2 py-8">
        <Outlet />
      </main>
    </div>
  );
};
