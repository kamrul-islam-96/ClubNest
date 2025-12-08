import { NavLink } from "react-router";

export const DashboardLink = ({ title, description, to }) => {
  return (
    <NavLink
      to={to}
      className="bg-white p-6 rounded-xl shadow block hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </NavLink>
  );
};
