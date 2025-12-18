import { use, useState } from "react";
import { NavLink } from "react-router";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import toast from "react-hot-toast";
import { Calendar1, Club, House } from "lucide-react";

export const NavBar = () => {
  const { user, signOutUser } = use(AuthContext);
  const [open, setOpen] = useState(false);

  const links = (
    <>
      <li>
        <NavLink to="/">
          <House size={22} /> Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/clubs">
          <Club size={22} /> Clubs
        </NavLink>
      </li>
      <li>
        <NavLink to="/events">
          <Calendar1 size={22} /> Events
        </NavLink>
      </li>
    </>
  );

  const handleLogout = () => {
    signOutUser();
    toast.success("Log out successful");
  };

  return (
    <div className="navbar bg-base-100 shadow-sm md:px-10 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <NavLink className="flex items-center" to='/'>
          <div>
            <svg
              width="48"
              height="48"
              viewBox="0 0 128 128"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M64 110c20-22 36-38 36-60 0-15-12-26-26-26s-26 11-26 26c0 22 16 38 36 60z"
                stroke="#1E1E1E"
                stroke-width="5"
                stroke-linecap="round"
              />
              <path
                d="M50 50h28M50 58h20"
                stroke="#1E1E1E"
                stroke-width="5"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <h3 className="text-3xl text-red-900 font-bold -ms-2">clubNest</h3>
        </NavLink>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{links}</ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <div className="relative">
            <img
              src={user.photoURL}
              alt="avatar"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setOpen(!open)}
            />

            {open && (
              <ul className="absolute right-0 mt-2 bg-white shadow p-2 rounded">
                <li>
                  <NavLink to="/profile">Profile</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/admin">Dashboard</NavLink>
                </li>
                <li className="cursor-pointer" onClick={handleLogout}>
                  Logout
                </li>
              </ul>
            )}
          </div>
        ) : (
          <div className="flex gap-x-3">
            <NavLink className="btn btn-outline btn-info" to="/login">
              Login
            </NavLink>

            <div className="hidden sm:block">
              <NavLink className="btn btn-outline btn-primary" to="/register">
                Register
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
