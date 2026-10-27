
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, ArrowRight } from "lucide-react";

const API =
  (import.meta.env.VITE_API_BASE_URL ||
    "http://professor-portfolio-api.onrender.com").replace(/\/+$/, "") +
  "/achievements/get.php";

export default function LatestAchievements() {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(API, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load achievements");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.achievements)) {
          setAchievements(data.achievements.slice(0, 3));
        }
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });

    return () => controller.abort();
  }, []);

  if (achievements.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-between items-end gap-5 mb-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#B38B59]">
              Academic Recognition
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mt-3">
              Latest{" "}
              <span className="text-[#54765C]">
                Achievements
              </span>
            </h2>
          </div>

          <Link
            to="/achievements"
            className="inline-flex items-center gap-2 text-[#54765C] font-semibold"
          >
            View All
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {achievements.map((item) => (
            <article
              key={item.id}
              className="bg-[#FAF9F6] rounded-2xl p-7 border border-[#EAE7DE]"
            >
              <div className="w-12 h-12 bg-[#E9EEDC] rounded-xl flex items-center justify-center text-[#54765C] mb-5">
                <Award size={23} />
              </div>

              <p className="text-xs uppercase tracking-wider text-[#54765C] font-semibold mb-3">
                {item.achievement_type}
              </p>

              <h3 className="text-lg font-bold text-[#343C32]">
                {item.title}
              </h3>

              {item.organization && (
                <p className="text-sm text-gray-500 mt-3">
                  {item.organization}
                </p>
              )}

              {item.achievement_date && (
                <p className="text-xs text-gray-400 mt-4">
                  {item.achievement_date}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
