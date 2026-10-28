
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost/professor-api/"
).replace(/\/+$/, "") + "/";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    fetch(`${API_BASE}auth/session.php`, {
      credentials: "include",
    })
      .then((response) => {
        if (active) {
          setStatus(response.ok ? "authenticated" : "unauthorized");
        }
      })
      .catch(() => {
        if (active) {
          setStatus("unauthorized");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return <p className="p-8">Checking login...</p>;
  }

  if (status === "unauthorized") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
