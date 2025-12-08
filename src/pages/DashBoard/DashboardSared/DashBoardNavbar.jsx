import { NavLink } from "react-router";
import { Home, Users, User } from "lucide-react";

const DashBoardNavbar = () => {
  const menuItems = [
    { to: "/dashboard/admin", label: "Admin Panel", icon: Home },
    { to: "/dashboard/manager", label: "Club Manager", icon: Users },
    { to: "/dashboard/member", label: "Member", icon: User },
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-20 sm:w-64 text-white flex flex-col z-40">
      {/* Centered Menu Items */}
      <nav className="flex-1 flex items-center justify-center">
        <div className="space-y-6 w-full px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 font-medium text-black ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "hover:bg-blue-600 hover:text-white shadow-lg"
                  }`
                }
              >
                <Icon size={22} className="flex-shrink-0" />
                <span className="hidden sm:block text-sm sm:text-base">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default DashBoardNavbar;
