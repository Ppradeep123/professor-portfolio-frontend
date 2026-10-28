
import { useEffect, useState } from "react";

export default function useProfessorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE = (
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost/professor-api/"
  ).replace(/\/+$/, "") + "/";
  useEffect(() => {
    let active = true;

    async function fetchProfile() {
      try {
        const response = await fetch(
          `${API_BASE}profile/get.php`
        );

        if (!response.ok) {
          throw new Error("Failed to load professor profile");
        }

        const data = await response.json();

        if (active) {
          setProfile(data.profile);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchProfile();

    return () => {
      active = false;
    };
  }, []);

  return { profile, loading, error };
}
