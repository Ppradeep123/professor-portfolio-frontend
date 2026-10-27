
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Search,
  FileText,
  Video,
  Presentation,
  File,
  Link2,
  ExternalLink,
  Download,
  GraduationCap,
  RefreshCw,
  AlertCircle,
  FolderOpen,
  ArrowRight,
  Layers,
  Filter,
} from "lucide-react";

const API =
  "http://professor-portfolio-api.onrender.come-content/get.php";

const FILE_BASE = "http://professor-portfolio-api.onrender.com";

const CONTENT_TYPES = [
  "All",
  "PDF",
  "Video",
  "PPT",
  "Document",
  "External Link",
];

const TYPE_CONFIG = {
  PDF: {
    icon: FileText,
    label: "PDF Notes",
    color: "bg-red-50 text-red-700",
  },
  Video: {
    icon: Video,
    label: "Video Lecture",
    color: "bg-purple-50 text-purple-700",
  },
  PPT: {
    icon: Presentation,
    label: "Presentation",
    color: "bg-amber-50 text-amber-700",
  },
  Document: {
    icon: File,
    label: "Document",
    color: "bg-sky-50 text-sky-700",
  },
  "External Link": {
    icon: Link2,
    label: "External Resource",
    color: "bg-emerald-50 text-emerald-700",
  },
};

function getFileUrl(path) {
  if (
    !path ||
    !/^uploads\/e-content\/[a-f0-9]{32}\.(pdf|ppt|pptx|doc|docx)$/i.test(
      path
    )
  ) {
    return null;
  }

  return FILE_BASE + path;
}

function getExternalUrl(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    return ["http:", "https:"].includes(parsed.protocol)
      ? parsed.href
      : null;
  } catch {
    return null;
  }
}

function formatDate(dateValue) {
  if (!dateValue) return "";

  const date = new Date(
    dateValue.replace(" ", "T")
  );

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ResourceCard({ resource }) {
  const config =
    TYPE_CONFIG[resource.content_type] ||
    TYPE_CONFIG.Document;

  const Icon = config.icon;
  const fileUrl = getFileUrl(resource.file_path);
  const externalUrl = getExternalUrl(resource.resource_url);

  const primaryUrl = fileUrl || externalUrl;

  return (
    <article className="group bg-white border border-[#E4EAE1] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-[#54765C]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="h-1 bg-gradient-to-r from-[#54765C] to-[#C4D5BD]" />

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
          {resource.title}
        </h3>

        <div className="flex flex-wrap gap-2 mt-4">
          {resource.subject && (
            <span className="inline-flex items-center gap-2 bg-[#F4F6F1] text-[#617566] px-3 py-1.5 rounded-lg text-xs font-semibold">
              <BookOpen size={13} />
              {resource.subject}
            </span>
          )}

          {resource.semester && (
            <span className="inline-flex items-center gap-2 bg-[#F4F6F1] text-[#617566] px-3 py-1.5 rounded-lg text-xs font-semibold">
              <GraduationCap size={13} />
              {resource.semester}
            </span>
          )}
        </div>

        {resource.description && (
          <p className="text-sm text-gray-600 leading-7 mt-5 whitespace-pre-line line-clamp-4">
            {resource.description}
          </p>
        )}

        <div className="flex-1" />

        <div className="mt-6 pt-5 border-t border-[#EDF0EA]">
          {resource.created_at && (
            <p className="text-xs text-gray-400 mb-4">
              Added {formatDate(resource.created_at)}
            </p>
          )}

          {primaryUrl ? (
            <a
              href={primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex justify-center items-center gap-3 bg-[#41634C] hover:bg-[#304C39] text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              {fileUrl ? (
                <>
                  <Download size={17} />
                  Access Material
                </>
              ) : (
                <>
                  <ExternalLink size={17} />
                  Open Resource
                </>
              )}

              <ArrowRight size={16} />
            </a>
          ) : (
            <div className="w-full text-center bg-[#F4F6F1] text-gray-400 px-5 py-3 rounded-xl text-sm">
              Resource not uploaded yet
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function EContent() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [subject, setSubject] = useState("All");
  const [semester, setSemester] = useState("All");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadResources() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load learning resources.");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || "Unable to load learning resources."
          );
        }

        setResources(
          Array.isArray(data.resources)
            ? data.resources
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

    loadResources();

    return () => controller.abort();
  }, [reloadKey]);

  const subjects = useMemo(() => {
    return [
      ...new Set(
        resources
          .map((item) => item.subject?.trim())
          .filter(Boolean)
      ),
    ].sort();
  }, [resources]);

  const semesters = useMemo(() => {
    return [
      ...new Set(
        resources
          .map((item) => item.semester?.trim())
          .filter(Boolean)
      ),
    ].sort();
  }, [resources]);

  const filteredResources = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return resources.filter((item) => {
      const typeMatch =
        activeType === "All" ||
        item.content_type === activeType;

      const subjectMatch =
        subject === "All" || item.subject === subject;

      const semesterMatch =
        semester === "All" || item.semester === semester;

      const searchableText = [
        item.title,
        item.subject,
        item.semester,
        item.description,
        item.content_type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        typeMatch &&
        subjectMatch &&
        semesterMatch &&
        searchableText.includes(searchText)
      );
    });
  }, [resources, search, activeType, subject, semester]);

  const resetFilters = () => {
    setSearch("");
    setActiveType("All");
    setSubject("All");
    setSemester("All");
  };

  const totalFiles = resources.filter(
    (item) => item.file_path
  ).length;

  const totalVideos = resources.filter(
    (item) => item.content_type === "Video"
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
              <Layers size={15} />
              Digital Learning Resources
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mt-7 leading-tight">
              E-Content &
              <span className="block text-[#D4E5CC]">
                Learning Resources
              </span>
            </h1>

            <p className="text-base md:text-lg leading-8 text-white/75 mt-6 max-w-2xl">
              Explore digital study materials, lecture notes,
              presentations, educational videos and curated
              academic resources to support independent learning.
            </p>

            <a
              href="#resources"
              className="inline-flex items-center gap-3 mt-9 px-6 py-3.5 bg-white text-[#41634C] font-semibold rounded-xl hover:bg-[#F0F4ED] transition-colors"
            >
              Explore Resources
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
              label: "Learning Resources",
              value: resources.length,
              icon: BookOpen,
            },
            {
              label: "Uploaded Materials",
              value: totalFiles,
              icon: FileText,
            },
            {
              label: "Video Lectures",
              value: totalVideos,
              icon: Video,
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

      {/* RESOURCES */}
      <section
        id="resources"
        className="max-w-7xl mx-auto px-6 py-16 md:py-20"
      >
        <div className="mb-9">
          <div className="flex items-center gap-3 text-[#54765C]">
            <span className="w-10 h-px bg-[#54765C]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Knowledge Library
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-[#344F3C] mt-4">
            Browse Learning Materials
          </h2>

          <p className="text-gray-500 leading-7 mt-3">
            Find resources by subject, semester, or content type.
          </p>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white border border-[#E5EBE2] rounded-2xl p-5 md:p-6 mb-10">
          <div className="flex items-center gap-2 text-[#41634C] font-semibold mb-5">
            <Filter size={18} />
            Search & Filter
          </div>

          <div className="relative mb-5">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search notes, subjects, lectures..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#E1E7DE] outline-none focus:border-[#54765C] focus:ring-2 focus:ring-[#54765C]/10 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <select
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="px-4 py-3.5 rounded-xl border border-[#E1E7DE] bg-white text-sm text-[#41634C] outline-none"
            >
              <option value="All">All Subjects</option>

              {subjects.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={semester}
              onChange={(event) => setSemester(event.target.value)}
              className="px-4 py-3.5 rounded-xl border border-[#E1E7DE] bg-white text-sm text-[#41634C] outline-none"
            >
              <option value="All">All Semesters</option>

              {semesters.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {CONTENT_TYPES.map((type) => (
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
              Loading learning resources...
            </p>
          </div>
        ) : error ? (
          <div className="text-center bg-white border border-red-100 rounded-2xl p-12">
            <AlertCircle
              size={35}
              className="mx-auto text-red-500"
            />

            <h3 className="font-bold text-xl mt-4 text-gray-800">
              Unable to Load Resources
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
        ) : filteredResources.length === 0 ? (
          <div className="text-center bg-white border border-[#E5EBE2] rounded-2xl p-12">
            <FolderOpen
              size={40}
              className="mx-auto text-[#9AAF9B]"
            />

            <h3 className="font-bold text-xl mt-4 text-[#344F3C]">
              No Learning Resources Found
            </h3>

            <p className="text-gray-500 mt-3">
              {resources.length === 0
                ? "Learning materials will appear here when they are published."
                : "Try adjusting your search or filters."}
            </p>

            {resources.length > 0 && (
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
                  {filteredResources.length}
                </span>{" "}
                resources
              </p>

              {(search ||
                subject !== "All" ||
                semester !== "All" ||
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
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* FOOTER BANNER */}
      <section className="bg-[#EDF3EA] border-t border-[#DFE9DC]">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 text-center">
          <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center text-[#54765C] shadow-sm">
            <GraduationCap size={30} />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#344F3C] mt-6">
            Learning Beyond the Classroom
          </h2>

          <p className="text-gray-600 leading-8 max-w-2xl mx-auto mt-4">
            Access educational materials and digital resources
            designed to encourage self-paced learning,
            exploration and academic growth.
          </p>
        </div>
      </section>
    </div>
  );
}
