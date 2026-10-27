
import { useEffect, useState } from "react";

const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    "http://professor-portfolio-api.onrender.com";

export default function HomeStats({ profile }) {
    const [counts, setCounts] = useState({
        publications: 0,
        research_projects: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadStats() {
            try {
                const response = await fetch(
                    `${API_BASE.replace(/\/+$/, "")}/profile/public_stats.php`,
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error("Failed to load statistics");
                }

                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.message || "Unable to load stats");
                }

                setCounts(data.stats);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadStats();

        return () => controller.abort();
    }, []);

    const stats = [
        {
            value:
                profile?.experience_years !== undefined &&
                    profile?.experience_years !== null
                    ? `${Number(profile.experience_years)}+`
                    : "—",
            label: "Years of Experience",
        },

        {
            value: loading || error ? "—" : `${counts.publications}+`,
            label: "Publications",
        },
        {
            value: loading || error ? "—" : `${counts.research_projects}+`,
            label: "Research Projects",
        },

    ];

    return (
        <section className="bg-white py-14 border-y border-[#EEEAE1]">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="text-center"
                    >
                        <h3 className="text-4xl font-bold text-[#54765C]">
                            {stat.value}
                        </h3>

                        <p className="text-[#8A806F] text-sm mt-3">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            {error && (
                <p className="text-center text-sm text-red-600 mt-5">
                    Some statistics are temporarily unavailable.
                </p>
            )}
        </section>
    );
}
