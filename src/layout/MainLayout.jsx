import { NavBar } from "../pages/shared/NavBar/NavBar";
import { Outlet } from "react-router";
import { Footer } from "../pages/shared/Footer/Footer";

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#fcfcfd] ">
      <NavBar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
