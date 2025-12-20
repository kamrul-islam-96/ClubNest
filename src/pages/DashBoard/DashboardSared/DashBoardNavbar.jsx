import { NavLink, useNavigate } from "react-router";
import { Home, Users, User } from "lucide-react";
import { use, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext/AuthContext";

const DashBoardNavbar = () => {
  const { user } = use(AuthContext);
  const [currentUserRole, setCurrentUserRole] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Role-based dashboard mapping
  const roleDashboardMap = {
    admin: { to: "/dashboard/admin", label: "Admin Panel", icon: Home },
    clubManager: {
      to: "/dashboard/manager",
      label: "Club Manager",
      icon: Users,
    },
    member: { to: "/dashboard/member", label: "Member", icon: User },
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
        if (!res.ok) throw new Error("Failed to fetch users");

        const allUsers = await res.json();

        // Find current user by email or uid
        const current = allUsers.find((u) => u.email === user.email);
        if (current) {
          setCurrentUserRole(current.role);

          // Automatic redirect to correct dashboard
          const userDashboard = roleDashboardMap[current.role];
          if (userDashboard) {
            // Check if we're already on the correct dashboard
            const currentPath = window.location.pathname;
            if (!currentPath.startsWith(userDashboard.to)) {
              // Redirect to correct dashboard
              navigate(userDashboard.to);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, navigate]);

  // Loading state - EXACT SAME STRUCTURE as first code
  if (loading) {
    return (
      <div className="fixed inset-y-0 left-0 w-20 sm:w-64 text-white flex flex-col z-40">
        {/* Centered Menu Items */}
        <nav className="flex-1 flex items-center justify-center">
          <div className="space-y-6 w-full md:px-4 pr-8">
            <div className="flex items-center gap-4 px-4 py-4 rounded-xl bg-gray-200 animate-pulse">
              <div className="w-6 h-6 rounded-full bg-gray-300"></div>
              <div className="hidden sm:block h-4 w-24 bg-gray-300 rounded"></div>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  // Get the single dashboard item for current user's role
  const dashboardItem = currentUserRole
    ? roleDashboardMap[currentUserRole]
    : null;

  // No dashboard item found - show error and redirect
  if (!dashboardItem) {
    // Redirect to home or login after 2 seconds
    setTimeout(() => {
      navigate("/");
    }, 2000);

    return (
      <div className="fixed inset-y-0 left-0 w-20 sm:w-64 text-white flex flex-col z-40">
        {/* Centered Menu Items */}
        <nav className="flex-1 flex items-center justify-center">
          <div className="space-y-6 w-full md:px-4 pr-8">
            <div className="flex items-center gap-4 px-4 py-4 rounded-xl bg-red-50 border border-red-200">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-500 text-xs">!</span>
              </div>
              <span className="hidden sm:block text-sm text-red-600">
                Access Restricted. Redirecting...
              </span>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  const Icon = dashboardItem.icon;

  return (
    <div className="fixed inset-y-0 left-0 w-20 sm:w-64 text-white flex flex-col z-40">
      {/* Centered Menu Items - EXACT SAME as first code */}
      <nav className="flex-1 flex items-center justify-center">
        <div className="space-y-6 w-full md:px-4 pr-8">
          <NavLink
            key={dashboardItem.to}
            to={dashboardItem.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 font-medium text-black ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "hover:bg-blue-600 hover:text-white shadow-lg"
              }`
            }
          >
            <Icon size={22} className="shrink-0" />
            <span className="hidden sm:block text-sm sm:text-base">
              {dashboardItem.label}
            </span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default DashBoardNavbar;
