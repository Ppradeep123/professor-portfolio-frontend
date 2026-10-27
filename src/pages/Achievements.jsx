
import { useEffect, useMemo, useState } from "react";
import {
  Trophy,
  Award,
  Medal,
  Star,
  GraduationCap,
  CalendarDays,
  Building2,
  Search,
  FileText,
  ExternalLink,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  FolderOpen,
  Filter,
} from "lucide-react";

const API =
  "http://professor-portfolio-api.onrender.comachievements/get.php";

const FILE_BASE = "http://professor-portfolio-api.onrender.com";

const TYPES = [
  "All",
  "Award",
  "Honor",
  "Recognition",
  "Certification",
  "Other",
];

const TYPE_CONFIG = {
  Award: {
    icon: Trophy,
    label: "Award",
    color: "bg-amber-50 text-amber-700",
  },
  Honor: {
    icon: Medal,
    label: "Honor",
    color: "bg-purple-50 text-purple-700",
  },
  Recognition: {
    icon: Star,
    label: "Recognition",
    color: "bg-sky-50 text-sky-700",
  },
  Certification: {
    icon: GraduationCap,
    label: "Certification",
    color: "bg-emerald-50 text-emerald-700",
  },
  Other: {
    icon: Award,
    label: "Achievement",
    color: "bg-gray-100 text-gray-700",
  },
};

function getCertificateUrl(path) {
  if (
    !path ||
    !/^uploads\/achievements\/[a-f0-9]{32}\.(pdf|jpg|jpeg|png|webp)$/i.test(
      path
    )
  ) {
    return null;
  }

  return FILE_BASE + path;
}

function getYear(dateValue) {
  if (!dateValue) return null;

  const match = String(dateValue).match(/^(\d{4})-\d{2}-\d{2}/);

  return match ? match[1] : null;
}

function formatDate(dateValue) {
  if (!dateValue) return "";

  const parts = String(dateValue).slice(0, 10).split("-");

  if (parts.length !== 3) return "";

  const date = new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2])
  );

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function AchievementCard({ achievement }) {
  const config =
    TYPE_CONFIG[achievement.achievement_type] ||
    TYPE_CONFIG.Other;

  const Icon = config.icon;

  const certificateUrl = getCertificateUrl(
    achievement.certificate_file
  );

  const certificateIsImage =
    certificateUrl &&
    /\.(jpg|jpeg|png|webp)$/i.test(certificateUrl);

  return (
    <article className="group bg-white rounded-2xl border border-[#E4EAE1] overflow-hidden hover:shadow-xl hover:shadow-[#54765C]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {certificateIsImage ? (
        <div className="h-52 overflow-hidden bg-[#F0F4ED]">
          <img
            src={certificateUrl}
            alt={`Certificate for ${achievement.title}`}
            loading="lazy"
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-2 bg-gradient-to-r from-[#54765C] to-[#C4D5BD]" />
      )}

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#EDF3EA] text-[#54765C] flex items-center justify-center">
            <Icon size={27} strokeWidth={1.8} />
          </div>

          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${config.color}`}
          >
            {config.label}
          </span>
        </div>

        <h3 className="text-xl font-bold text-[#344F3C] mt-6 leading-snug group-hover:text-[#54765C] transition-colors">
          {achievement.title}
        </h3>

        <div className="space-y-3 mt-5">
          {achievement.organization && (
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <Building2
                size={17}
                className="text-[#7F9C83] shrink-0 mt-0.5"
              />

              <span>{achievement.organization}</span>
            </div>
          )}

          {achievement.achievement_date && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <CalendarDays
                size={17}
                className="text-[#7F9C83] shrink-0"
              />

              <span>
                {formatDate(achievement.achievement_date)}
              </span>
            </div>
          )}
        </div>

        {achievement.description && (
          <p className="text-sm text-gray-600 leading-7 mt-5 whitespace-pre-line">
            {achievement.description}
          </p>
        )}

        <div className="flex-1" />

        {certificateUrl && (
          <div className="mt-6 pt-5 border-t border-[#EDF0EA]">
            <a
              href={certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 w-full bg-[#41634C] hover:bg-[#304C39] text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              {certificateIsImage ? (
                <ExternalLink size={17} />
              ) : (
                <FileText size={17} />
              )}

              View Certificate
              <ArrowRight size={16} />
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [year, setYear] = useState("All");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAchievements() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load achievements.");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || "Unable to load achievements."
          );
        }

        setAchievements(
          Array.isArray(data.achievements)
            ? data.achievements
            : []
        );
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

    loadAchievements();

    return () => controller.abort();
  }, [reloadKey]);

  const years = useMemo(() => {
    return [
      ...new Set(
        achievements
          .map((item) => getYear(item.achievement_date))
          .filter(Boolean)
      ),
    ].sort((a, b) => Number(b) - Number(a));
  }, [achievements]);

  const filteredAchievements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return achievements.filter((item) => {
      const matchesType =
        activeType === "All" ||
        item.achievement_type === activeType;

      const matchesYear =
        year === "All" ||
        getYear(item.achievement_date) === year;

      const searchableText = [
        item.title,
        item.organization,
        item.description,
        item.achievement_type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesType &&
        matchesYear &&
        searchableText.includes(query)
      );
    });
  }, [achievements, search, activeType, year]);

  const resetFilters = () => {
    setSearch("");
    setActiveType("All");
    setYear("All");
  };

  const totalAwards = achievements.filter(
    (item) =>
      item.achievement_type === "Award" ||
      item.achievement_type === "Honor"
  ).length;

  const totalCertificates = achievements.filter(
    (item) => item.certificate_file
  ).length;

  return (
    <div className="min-h-screen bg-[#F8F7F2]">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#41634C] text-white">
        <div className="absolute -top-28 -right-20 w-96 h-96 rounded-full border border-white/10" />
        <div className="absolute top-12 right-16 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/5" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-xs uppercase tracking-[0.18em] font-semibold">
              <Award size={15} />
              Academic Excellence
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mt-7 leading-tight">
              Achievements
              <span className="block text-[#D4E5CC]">
                & Awards
              </span>
            </h1>

            <p className="text-base md:text-lg leading-8 text-white/75 mt-6 max-w-2xl">
              A collection of academic honors, professional
              recognitions, certifications and milestones
              celebrating excellence in teaching, research
              and professional development.
            </p>

            <a
              href="#achievements"
              className="inline-flex items-center gap-3 mt-9 px-6 py-3.5 bg-white text-[#41634C] font-semibold rounded-xl hover:bg-[#F0F4ED] transition-colors"
            >
              Explore Achievements
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Total Achievements",
              value: achievements.length,
              icon: Trophy,
            },
            {
              label: "Awards & Honors",
              value: totalAwards,
              icon: Medal,
            },
            {
              label: "Certificates",
              value: totalCertificates,
              icon: FileText,
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-[#E5EBE2] shadow-sm p-6 flex items-center gap-5"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#EDF3EA] text-[#54765C] flex items-center justify-center">
                  <Icon size={25} />
                </div>

                <div>
                  <p className="text-3xl font-bold text-[#344F3C]">
                    {loading ? "—" : stat.value}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section
        id="achievements"
        className="max-w-7xl mx-auto px-6 py-16 md:py-20"
      >
        <div className="mb-9">
          <div className="flex items-center gap-3 text-[#54765C]">
            <span className="w-10 h-px bg-[#54765C]" />

            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Milestones & Recognition
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-[#344F3C] mt-4">
            Awards & Recognitions
          </h2>

          <p className="text-gray-500 leading-7 mt-3">
            Browse academic and professional achievements
            by category or year.
          </p>
        </div>

        {/* FILTERS */}
        <div className="bg-white border border-[#E5EBE2] rounded-2xl p-5 md:p-6 mb-10">
          <div className="flex items-center gap-2 text-[#41634C] font-semibold mb-5">
            <Filter size={18} />
            Search & Filter
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search awards, organizations, recognitions..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#E1E7DE] outline-none focus:border-[#54765C] focus:ring-2 focus:ring-[#54765C]/10 text-sm"
              />
            </div>

            <select
              value={year}
              onChange={(event) => setYear(event.target.value)}
              className="px-4 py-3.5 rounded-xl border border-[#E1E7DE] bg-white text-sm text-[#41634C] outline-none"
            >
              <option value="All">All Years</option>

              {years.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2 mt-5">
            {TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setActiveType(type)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeType === type
                  ? "bg-[#41634C] text-white"
                  : "bg-[#F3F5F0] text-[#647166] hover:bg-[#E5EDE2]"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <RefreshCw
              size={32}
              className="animate-spin text-[#54765C]"
            />

            <p className="mt-5">
              Loading achievements...
            </p>
          </div>
        ) : error ? (
          <div className="text-center bg-white border border-red-100 rounded-2xl p-12">
            <AlertCircle
              size={35}
              className="mx-auto text-red-500"
            />

            <h3 className="font-bold text-xl mt-4 text-gray-800">
              Unable to Load Achievements
            </h3>

            <p className="text-gray-500 mt-3">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                setReloadKey((key) => key + 1)
              }
              className="mt-6 px-6 py-3 rounded-xl bg-[#41634C] text-white font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="text-center bg-white border border-[#E5EBE2] rounded-2xl p-12">
            <FolderOpen
              size={40}
              className="mx-auto text-[#9AAF9B]"
            />

            <h3 className="font-bold text-xl mt-4 text-[#344F3C]">
              No Achievements Found
            </h3>

            <p className="text-gray-500 mt-3">
              {achievements.length === 0
                ? "Achievements will appear here when they are published."
                : "Try adjusting your search or filters."}
            </p>

            {achievements.length > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 px-5 py-3 bg-[#EDF3EA] text-[#41634C] font-semibold rounded-xl"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-7">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-bold text-[#41634C]">
                  {filteredAchievements.length}
                </span>{" "}
                achievements
              </p>

              {(search ||
                year !== "All" ||
                activeType !== "All") && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-sm font-semibold text-[#54765C] hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* CLOSING SECTION */}
      <section className="bg-[#EDF3EA] border-t border-[#DFE9DC]">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 text-center">
          <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center text-[#54765C] shadow-sm">
            <Trophy size={30} />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#344F3C] mt-6">
            Celebrating Academic Excellence
          </h2>

          <p className="text-gray-600 leading-8 max-w-2xl mx-auto mt-4">
            Every achievement represents dedication to
            continuous learning, teaching excellence,
            research contributions and professional growth.
          </p>
        </div>
      </section>
    </div>
  );
}
