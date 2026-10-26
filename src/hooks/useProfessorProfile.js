
import { useEffect, useState } from "react";

export default function useProfessorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchProfile() {
      try {
        const response = await fetch(
          "http://localhost/professor-api/profile/get.php"
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
