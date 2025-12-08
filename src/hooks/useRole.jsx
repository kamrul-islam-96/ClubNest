import { use, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext/AuthContext";

export const useRole = () => {
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(true);
  const { user } = use(AuthContext);

  useEffect(() => {
    const fetchRole = async () => {
      if (user?.email) {
        try {
          const token = await user.getIdToken(); 
          const res = await fetch(
            `http://localhost:3000/api/users/role?email=${user.email}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, 
              },
            }
          );
          const data = await res.json();
          setRole(data.role || "member");
        } catch (err) {
          setRole("member");
          console.error("Error fetching role:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  return [role, loading];
};
