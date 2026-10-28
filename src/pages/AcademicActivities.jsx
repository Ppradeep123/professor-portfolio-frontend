
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Award,
  BookOpen,
  GraduationCap,
  Users,
  MapPin,
  Building2,
  ArrowUpRight,
  Search,
  RefreshCw,
  AlertCircle,
  FileText,
  Presentation,
  Mic2,
  Laptop,
  Filter,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost/professor-api/"
).replace(/\/+$/, "") + "/";

const API = `${API_BASE}academic-activities/get.php`;
const FILE_BASE = API_BASE.replace(/\/$/, "");

const categories = [
  "All",
  "Workshop",
  "Seminar",
  "Conference",
  "FDP",
  "Webinar",
  "Guest Lecture",
  "Training",
  "Other",
];

const categoryIcons = {
  Workshop: BookOpen,
  Seminar: Users,
  Conference: Presentation,
  FDP: GraduationCap,
  Webinar: Laptop,
  "Guest Lecture": Mic2,
  Training: Award,
  Other: Sparkles,
};

const categoryColors = {
  Workshop: "bg-emerald-50 text-emerald-700",
  Seminar: "bg-amber-50 text-amber-700",
  Conference: "bg-purple-50 text-purple-700",
  FDP: "bg-sky-50 text-sky-700",
  Webinar: "bg-indigo-50 text-indigo-700",
  "Guest Lecture": "bg-rose-50 text-rose-700",
  Training: "bg-orange-50 text-orange-700",
  Other: "bg-gray-100 text-gray-700",
};

function formatDate(value) {
  if (!value) return "";

  const date = new Date(`${value.slice(0, 10)}T12:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getYear(value) {
  return value?.slice(0, 4) || "Undated";
}

function getCertificateUrl(path) {
  if (!path) return null;

  // Certificate paths are stored as relative paths in MySQL.
  const normalized = path.replace(/^\/+/, "");

  if (!/^uploads\/academic-activities\/[a-f0-9]{32}\.(pdf|jpg|jpeg|png)$/i.test(normalized)) {
    return null;
  }

  return FILE_BASE + normalized;
}

function ActivityCard({ activity, index }) {
  const Icon = categoryIcons[activity.activity_type] || Award;
  const color =
    categoryColors[activity.activity_type] ||
    categoryColors.Other;

  const certificateUrl = getCertificateUrl(
    activity.certificate_file
  );

  return (
    <article className="group relative">
      <div className="hidden md:block absolute -left-[34px] top-9 w-4 h-4 rounded-full bg-[#54765C] border-4 border-[#E8EFE6] ring-4 ring-[#F8F7F2] z-10" />

      <div className="bg-white rounded-2xl border border-[#E5EBE2] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#54765C]/10 hover:-translate-y-1">
        <div className="h-1 bg-gradient-to-r from-[#54765C] via-[#A9BCA5] to-[#E8EFE6]" />

        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#EDF3EA] text-[#54765C] flex items-center justify-center">
              <Icon size={26} strokeWidth={1.8} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${color}`}
                >
                  <Icon size={13} />
                  {activity.activity_type || "Academic Activity"}
                </span>

                {activity.participation_role && (
                  <span className="px-3 py-1.5 rounded-full bg-[#F6F5F0] text-[#647166] text-xs font-semibold">
                    {activity.participation_role}
                  </span>
                )}
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-[#344F3C] leading-snug group-hover:text-[#54765C] transition-colors">
                {activity.title}
              </h3>

              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-5 text-sm text-gray-600">
                {activity.start_date && (
                  <div className="flex items-start gap-2">
                    <CalendarDays
                      size={17}
                      className="text-[#78917A] shrink-0 mt-0.5"
                    />
                    <span>
                      {formatDate(activity.start_date)}
                      {activity.end_date &&
                        activity.end_date !== activity.start_date &&
                        ` – ${formatDate(activity.end_date)}`}
                    </span>
                  </div>
                )}

                {activity.organizer && (
                  <div className="flex items-start gap-2">
                    <Building2
                      size={17}
                      className="text-[#78917A] shrink-0 mt-0.5"
                    />
                    <span>{activity.organizer}</span>
                  </div>
                )}

                {activity.venue && (
                  <div className="flex items-start gap-2">
                    <MapPin
                      size={17}
                      className="text-[#78917A] shrink-0 mt-0.5"
                    />
                    <span>{activity.venue}</span>
                  </div>
                )}
              </div>

              {activity.description && (
                <p className="mt-5 text-[15px] text-gray-600 leading-8 whitespace-pre-line">
                  {activity.description}
                </p>
              )}

              {certificateUrl && (
                <div className="mt-6 pt-5 border-t border-[#EDF0EA]">
                  <a
                    href={certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-[#EDF3EA] text-[#41634C] font-semibold text-sm hover:bg-[#DFE9DC] transition-colors"
                  >
                    <FileText size={18} />
                    View Certificate
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              )}
            </div>

            <span className="hidden lg:block text-5xl font-bold text-[#E8EFE6] select-none">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function AcademicActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadActivities() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load academic activities.");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || "Unable to load academic activities."
          );
        }

        setActivities(
          Array.isArray(data.activities) ? data.activities : []
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

    loadActivities();

    return () => controller.abort();
  }, [reloadKey]);

  const years = useMemo(() => {
    const result = activities
      .map((item) => getYear(item.start_date))
      .filter((year) => year !== "Undated");

    return [...new Set(result)].sort((a, b) =>
      b.localeCompare(a)
    );
  }, [activities]);

  const filteredActivities = useMemo(() => {
    return activities
      .filter((item) => {
        const categoryMatch =
          activeCategory === "All" ||
          item.activity_type === activeCategory;

        const yearMatch =
          selectedYear === "All" ||
          getYear(item.start_date) === selectedYear;

        const text = [
          item.title,
          item.activity_type,
          item.organizer,
          item.venue,
          item.participation_role,
          item.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const searchMatch = text.includes(
          search.trim().toLowerCase()
        );

        return categoryMatch && yearMatch && searchMatch;
      })
      .sort((a, b) => {
        const dateA = a.start_date || "";
        const dateB = b.start_date || "";

        if (dateA !== dateB) {
          return dateB.localeCompare(dateA);
        }

        return Number(b.id) - Number(a.id);
      });
  }, [activities, activeCategory, selectedYear, search]);

  const groupedActivities = useMemo(() => {
    const groups = {};

    filteredActivities.forEach((activity) => {
      const year = getYear(activity.start_date);

      if (!groups[year]) groups[year] = [];

      groups[year].push(activity);
    });

    return Object.entries(groups).sort(([a], [b]) => {
      if (a === "Undated") return 1;
      if (b === "Undated") return -1;

      return Number(b) - Number(a);
    });
  }, [filteredActivities]);

  const totalCertificates = activities.filter(
    (item) => item.certificate_file
  ).length;

  const totalTypes = new Set(
    activities.map((item) => item.activity_type)
  ).size;

  const clearFilters = () => {
    setActiveCategory("All");
    setSelectedYear("All");
    setSearch("");
  };

  return (
    <main className="min-h-screen bg-[#F8F7F2]">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#41634C] text-white">
        <div className="absolute -top-24 -right-20 w-96 h-96 rounded-full border border-white/10" />
        <div className="absolute top-4 right-10 w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute -bottom-36 -left-20 w-80 h-80 rounded-full bg-white/5" />

        <div className="relative max-w-7xl mx-auto px-6  md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
              <Sparkles size={15} />
              Professional Development
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mt-7">
              Academic
              <span className="block text-[#D4E5CC]">
                Activities
              </span>
            </h1>

            <p className="text-base md:text-lg text-white/75 leading-8 mt-6 max-w-2xl">
              A record of academic participation, professional
              development, knowledge exchange, and continuous
              learning through workshops, conferences, faculty
              development programmes, and scholarly events.
            </p>

            <a
              href="#activities"
              className="inline-flex items-center gap-3 mt-9 px-6 py-3.5 rounded-xl bg-white text-[#41634C] font-semibold hover:bg-[#F0F4ED] transition-colors"
            >
              Explore Activities
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Academic Activities",
              value: activities.length,
              icon: CalendarDays,
            },
            {
              label: "Activity Categories",
              value: totalTypes,
              icon: GraduationCap,
            },
            {
              label: "Certificates",
              value: totalCertificates,
              icon: Award,
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-[#E6EBE3] shadow-sm p-6 flex items-center gap-5"
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

      {/* CONTENT */}
      <section
        id="activities"
        className="max-w-7xl mx-auto px-6 py-16 md:py-20"
      >
        <div className="mb-9 ">
          <div className="flex items-center gap-3 text-[#54765C]">
            <span className="h-px w-10 bg-[#54765C]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Academic Journey
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-[#344F3C] mt-4">
            Activities & Participation
          </h2>

          <p className="text-gray-500 leading-7 mt-3 max-w-2xl">
            Explore professional development programmes,
            academic engagements, and participation in
            educational events.
          </p>
        </div>

        {/* FILTERS */}
        <div className="bg-white border border-[#E5EBE2] rounded-2xl p-5 md:p-6 mb-12">
          <div className="flex items-center gap-2 mb-5 text-[#41634C] font-semibold">
            <Filter size={18} />
            Browse Academic Activities
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-5">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search activities, organizers, topics..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#E1E7DE] outline-none focus:border-[#54765C] focus:ring-2 focus:ring-[#54765C]/10 text-sm"
              />
            </div>

            <select
              value={selectedYear}
              onChange={(event) =>
                setSelectedYear(event.target.value)
              }
              className="w-full md:w-44 px-4 py-3.5 rounded-xl border border-[#E1E7DE] bg-white text-sm text-[#41634C] outline-none focus:border-[#54765C]"
            >
              <option value="All">All Years</option>

              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeCategory === category
                  ? "bg-[#41634C] text-white"
                  : "bg-[#F3F5F0] text-[#647166] hover:bg-[#E5EDE2]"
                  }`}
              >
                {category}
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
              Loading academic activities...
            </p>
          </div>
        ) : error ? (
          <div className="text-center bg-white border border-red-100 rounded-2xl p-12">
            <AlertCircle
              size={35}
              className="mx-auto text-red-500"
            />

            <h3 className="font-bold text-xl mt-4 text-gray-800">
              Unable to Load Activities
            </h3>

            <p className="text-gray-500 mt-3">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="mt-6 px-6 py-3 rounded-xl bg-[#41634C] text-white font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center bg-white border border-[#E5EBE2] rounded-2xl p-12">
            <CalendarDays
              size={38}
              className="mx-auto text-[#9AAF9B]"
            />

            <h3 className="font-bold text-xl mt-4 text-[#344F3C]">
              No Activities Found
            </h3>

            <p className="text-gray-500 mt-3">
              {activities.length === 0
                ? "Academic activities will appear here once they are added."
                : "Try changing your search or filters."}
            </p>

            {activities.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 px-5 py-3 bg-[#EDF3EA] text-[#41634C] font-semibold rounded-xl"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-9">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-bold text-[#41634C]">
                  {filteredActivities.length}
                </span>{" "}
                activities
              </p>

              {(search ||
                activeCategory !== "All" ||
                selectedYear !== "All") && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm font-semibold text-[#54765C] hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
            </div>

            {/* YEAR GROUPS / TIMELINE */}
            <div className="space-y-14">
              {groupedActivities.map(([year, items]) => (
                <div key={year}>
                  <div className="flex items-center gap-5 mb-9">
                    <div className="bg-[#41634C] text-white px-6 py-3 rounded-xl font-bold text-xl">
                      {year}
                    </div>

                    <div className="flex-1 h-px bg-[#DCE6D9]" />

                    <span className="text-sm text-gray-400">
                      {items.length}{" "}
                      {items.length === 1
                        ? "Activity"
                        : "Activities"}
                    </span>
                  </div>

                  <div className="md:ml-7 md:pl-7 md:border-l-2 md:border-[#DCE6D9] space-y-6">
                    {items.map((activity, index) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* BOTTOM BANNER */}
      <section className="bg-[#EDF3EA] border-t border-[#DFE9DC]">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 text-center">
          <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center text-[#54765C] shadow-sm">
            <GraduationCap size={30} />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#344F3C] mt-6">
            Commitment to Lifelong Learning
          </h2>

          <p className="text-gray-600 leading-8 max-w-2xl mx-auto mt-4">
            Continuous academic engagement strengthens teaching,
            encourages collaboration, and supports the exchange
            of knowledge across disciplines.
          </p>
        </div>
      </section>
    </main>
  );
}
