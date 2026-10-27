
import { useEffect, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  CalendarDays,
  Users,
  Lightbulb,
  BriefcaseBusiness,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Layers3,
  Award,
  Clock3,
  MapPin,
  Building2,
  CalendarRange,
  ChevronRight,
  Sparkles,
  UserRound,
  MonitorPlay,
} from "lucide-react";

const BASE_API = "http://professor-portfolio-api.onrender.comteaching";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const sectionLinks = [
  { id: "experience", label: "Experience" },
  { id: "courses", label: "Courses" },
  { id: "timetable", label: "Timetable" },
  { id: "guidance", label: "Student Guidance" },
  { id: "methods", label: "Teaching Methods" },
];

function SectionHeading({ number, title, subtitle, icon: Icon }) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className="w-12 h-12 shrink-0 rounded-xl bg-[#E9F0E7] text-[#41634C] flex items-center justify-center">
        <Icon size={23} strokeWidth={1.8} />
      </div>

      <div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold tracking-widest text-[#829786]">
            {number}
          </span>
          <span className="w-8 h-px bg-[#A5B9A6]" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-[#344F3C] mt-1">
          {title}
        </h2>

        <p className="text-sm md:text-base text-gray-500 mt-2">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function LoadingState({ label = "Loading information..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-gray-500">
      <RefreshCw size={20} className="animate-spin" />
      {label}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="bg-white border border-[#E9E5DB] rounded-2xl text-center py-14 px-6">
      <BookOpen size={32} className="mx-auto text-[#9CAF9C]" />
      <p className="text-gray-500 mt-4">{message}</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center bg-white border border-red-100 rounded-2xl p-10">
      <AlertCircle className="mx-auto text-red-500" size={30} />
      <p className="text-red-600 mt-4">{message}</p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 px-5 py-2 bg-[#41634C] text-white rounded-lg hover:bg-[#304C39]"
      >
        Try Again
      </button>
    </div>
  );
}

function useTeachingData(module, reloadKey) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");

      try {
        const url = module === "subjects"
          ? `${BASE_API}/get.php`
          : `${BASE_API}/manage.php?module=${encodeURIComponent(module)}`;

        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load teaching information.");
        }

        const data = await response.json();

        const result = module === "subjects"
          ? data.teaching
          : data.records;

        if (!data.success || !Array.isArray(result)) {
          throw new Error("Invalid teaching response.");
        }

        if (!controller.signal.aborted) {
          setRecords(result);
        }
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

    load();

    return () => controller.abort();
  }, [module, reloadKey]);

  return { records, loading, error };
}

function formatDate(date) {
  if (!date) return "Present";

  const parts = date.split("-");

  if (parts.length !== 3) return date;

  const parsed = new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2])
  );

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

function formatTime(time) {
  if (!time) return "—";

  const parts = time.split(":");
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return time;
  }

  const hour12 = hours % 12 || 12;
  const period = hours >= 12 ? "PM" : "AM";

  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}

/* =====================================================
   SECTION 01: TEACHING EXPERIENCE — TIMELINE
===================================================== */

function ExperienceSection({ reloadKey, onRetry }) {
  const { records, loading, error } = useTeachingData(
    "experience",
    reloadKey
  );

  return (
    <section id="experience" className="scroll-mt-24">
      <SectionHeading
        number="01"
        title="Teaching Experience"
        subtitle="Academic positions and professional responsibilities"
        icon={BriefcaseBusiness}
      />

      {loading ? (
        <LoadingState label="Loading teaching experience..." />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : records.length === 0 ? (
        <EmptyState message="Teaching experience will be available soon." />
      ) : (
        <div className="relative ml-3 md:ml-6 border-l-2 border-[#D7E3D5] space-y-8 py-2">
          {records.map((item, index) => (
            <div
              key={item.id}
              className="relative pl-8 md:pl-12"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[11px] top-7 w-5 h-5 rounded-full bg-[#54765C] border-4 border-[#F8F7F2] ring-2 ring-[#C5D8C3]" />

              <div className="bg-white rounded-2xl border border-[#E8E9E2] p-6 md:p-8 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-[#829786] tracking-widest">
                        POSITION {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-[#344F3C]">
                      {item.designation}
                    </h3>

                    <div className="flex items-center gap-2 mt-3 text-[#54765C] font-semibold">
                      <Building2 size={17} />
                      <span>{item.institution}</span>
                    </div>

                    {item.department && (
                      <p className="text-gray-500 text-sm mt-2 ml-6">
                        {item.department}
                      </p>
                    )}
                  </div>

                  {(item.start_date || item.end_date) && (
                    <div className="shrink-0 inline-flex items-center gap-2 bg-[#EDF3EA] text-[#41634C] px-4 py-2 rounded-xl text-sm font-semibold self-start">
                      <CalendarRange size={16} />
                      {formatDate(item.start_date) === "Present"
                        ? "Date not specified"
                        : formatDate(item.start_date)}
                      {" — "}
                      {formatDate(item.end_date)}
                    </div>
                  )}
                </div>

                {item.description && (
                  <div className="mt-6 pt-5 border-t border-[#EDF0EA]">
                    <p className="text-sm leading-7 text-gray-600 whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* =====================================================
   SECTION 02: COURSES — ORIGINAL DESIGN UNCHANGED
===================================================== */

function CourseCard({ item }) {
  return (
    <article className="group bg-white rounded-2xl border border-[#E8E9E2] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="h-1 bg-[#729078]" />

      <div className="p-6 md:p-7">
        <div className="flex justify-between items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#EFF4ED] flex items-center justify-center text-[#54765C]">
            <BookOpen size={23} />
          </div>

          {item.teaching_level && (
            <span className="bg-[#EDF3EA] text-[#54765C] text-xs font-semibold px-3 py-1.5 rounded-full">
              {item.teaching_level}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-[#344F3C] mt-6 group-hover:text-[#62816B] transition-colors">
          {item.subject_name || "Untitled Subject"}
        </h3>

        {item.course_name && (
          <p className="text-gray-600 mt-2">
            {item.course_name}
          </p>
        )}

        {item.course_code && (
          <div className="mt-4">
            <span className="text-xs font-semibold text-[#54765C] bg-[#F3F6F1] px-3 py-1.5 rounded-lg">
              {item.course_code}
            </span>
          </div>
        )}

        {(item.semester || item.academic_year) && (
          <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-gray-100 text-sm text-gray-500">
            {item.semester && (
              <span className="flex items-center gap-2">
                <Layers3 size={16} />
                {item.semester}
              </span>
            )}

            {item.academic_year && (
              <span className="flex items-center gap-2">
                <CalendarDays size={16} />
                {item.academic_year}
              </span>
            )}
          </div>
        )}

        {item.description && (
          <p className="text-sm leading-7 text-gray-600 mt-5 whitespace-pre-line">
            {item.description}
          </p>
        )}
      </div>
    </article>
  );
}

function CoursesSection({ reloadKey, onRetry }) {
  const { records, loading, error } = useTeachingData(
    "subjects",
    reloadKey
  );

  return (
    <section id="courses" className="scroll-mt-24">
      <SectionHeading
        number="02"
        title="Courses & Subjects"
        subtitle="Subjects taught across different academic programmes"
        icon={BookOpen}
      />

      {loading ? (
        <LoadingState label="Loading courses..." />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : records.length === 0 ? (
        <div className="bg-white border border-[#E9E5DB] rounded-2xl text-center py-16 px-6">
          <BookOpen
            size={38}
            className="mx-auto text-[#9CAF9C]"
          />
          <h3 className="font-semibold text-[#41634C] mt-5 text-lg">
            Courses Coming Soon
          </h3>
          <p className="text-gray-500 mt-2">
            Teaching subjects and course details will be available soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((item, index) => (
            <CourseCard
              key={item.id ?? index}
              item={item}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* =====================================================
   SECTION 03: TIMETABLE — HORIZONTAL TABLE
===================================================== */

function TimetableSection({ reloadKey, onRetry }) {
  const { records, loading, error } = useTeachingData(
    "timetable",
    reloadKey
  );

  const sortedRecords = [...records].sort((a, b) => {
    const dayA = DAYS.indexOf(a.day_of_week);
    const dayB = DAYS.indexOf(b.day_of_week);

    if (dayA !== dayB) return dayA - dayB;

    return (a.start_time || "").localeCompare(b.start_time || "");
  });

  return (
    <section id="timetable" className="scroll-mt-24">
      <SectionHeading
        number="03"
        title="Teaching Timetable"
        subtitle="Weekly academic teaching schedule"
        icon={CalendarDays}
      />

      {loading ? (
        <LoadingState label="Loading timetable..." />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : records.length === 0 ? (
        <EmptyState message="Teaching timetable will be available soon." />
      ) : (
        <div className="bg-white border border-[#E5E9E2] rounded-2xl overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="px-6 py-5 bg-[#EDF3EA] flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <CalendarDays size={21} className="text-[#41634C]" />
              <div>
                <h3 className="font-bold text-[#344F3C]">
                  Weekly Class Schedule
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Subject-wise timetable
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold text-[#54765C] bg-white px-3 py-2 rounded-lg">
              {records.length} Scheduled Classes
            </span>
          </div>

          {/* Horizontal Scroll on Mobile */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAF7] border-b border-[#E5E9E2]">
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-[#54765C]">
                    Day
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-[#54765C]">
                    Time
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-[#54765C]">
                    Subject
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-[#54765C]">
                    Classroom
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-[#54765C]">
                    Academic Year
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedRecords.map((item, index) => {
                  const firstOfDay =
                    index === 0 ||
                    sortedRecords[index - 1].day_of_week !==
                    item.day_of_week;

                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-[#EDF0EA] last:border-b-0 hover:bg-[#F8FAF7] transition-colors ${firstOfDay ? "border-t-2 border-t-[#DCE8DA]" : ""
                        }`}
                    >
                      <td className="px-6 py-5">
                        {firstOfDay && (
                          <span className="inline-flex px-3 py-1.5 rounded-lg bg-[#E9F0E7] text-[#41634C] text-sm font-bold">
                            {item.day_of_week}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap">
                          <Clock3
                            size={16}
                            className="text-[#54765C]"
                          />
                          {formatTime(item.start_time)}
                          <span className="text-gray-400">–</span>
                          {formatTime(item.end_time)}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="font-semibold text-[#344F3C]">
                          {item.subject}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {item.classroom ? (
                          <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                            <MapPin
                              size={15}
                              className="text-[#829786]"
                            />
                            {item.classroom}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {item.academic_year || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-[#FAFBF9] border-t border-[#E5E9E2]">
            <p className="text-xs text-gray-500">
              Schedule information is subject to academic updates.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

/* =====================================================
   SECTION 04: STUDENT GUIDANCE — PROJECT SHOWCASE
===================================================== */

function GuidanceSection({ reloadKey, onRetry }) {
  const { records, loading, error } = useTeachingData(
    "guidance",
    reloadKey
  );

  return (
    <section id="guidance" className="scroll-mt-24">
      <SectionHeading
        number="04"
        title="Student Guidance"
        subtitle="Research supervision and academic mentorship"
        icon={Users}
      />

      {loading ? (
        <LoadingState label="Loading student guidance..." />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : records.length === 0 ? (
        <EmptyState message="Student guidance details will be available soon." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {records.map((item, index) => (
            <article
              key={item.id}
              className="group bg-white rounded-2xl border border-[#E5E9E2] overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Project Header */}
              <div className="bg-[#EDF3EA] px-6 py-5 flex justify-between items-center gap-3">
                <div className="flex items-center gap-2 text-[#54765C]">
                  <GraduationCap size={19} />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Guided Project {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {item.academic_year && (
                  <span className="bg-white text-[#54765C] text-xs font-semibold px-3 py-1.5 rounded-full">
                    {item.academic_year}
                  </span>
                )}
              </div>

              <div className="p-6 md:p-7">
                <h3 className="text-xl font-bold text-[#344F3C] leading-snug">
                  {item.project_title}
                </h3>

                <div className="flex flex-wrap gap-2 mt-4">
                  {item.guidance_type && (
                    <span className="px-3 py-1.5 rounded-lg bg-[#F2F5EF] text-[#54765C] text-xs font-semibold">
                      {item.guidance_type}
                    </span>
                  )}

                  {item.programme && (
                    <span className="px-3 py-1.5 rounded-lg border border-[#E2E9DE] text-gray-600 text-xs font-medium">
                      {item.programme}
                    </span>
                  )}
                </div>

                {item.student_names && (
                  <div className="mt-6 pt-5 border-t border-[#EDF0EA]">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#F0F4ED] flex items-center justify-center text-[#54765C] shrink-0">
                        <UserRound size={18} />
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider font-bold text-[#829786]">
                          Guided Students
                        </p>
                        <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                          {item.student_names}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {item.description && (
                  <p className="text-sm leading-7 text-gray-600 mt-5 whitespace-pre-line">
                    {item.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

/* =====================================================
   SECTION 05: TEACHING METHODS — NUMBERED LIST
===================================================== */

function MethodsSection({ reloadKey, onRetry }) {
  const { records, loading, error } = useTeachingData(
    "methods",
    reloadKey
  );

  return (
    <section id="methods" className="scroll-mt-24">
      <SectionHeading
        number="05"
        title="Teaching Methods"
        subtitle="Innovative learning and instructional approaches"
        icon={Lightbulb}
      />

      {loading ? (
        <LoadingState label="Loading teaching methods..." />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : records.length === 0 ? (
        <EmptyState message="Teaching methods will be available soon." />
      ) : (
        <div className="bg-white border border-[#E5E9E2] rounded-2xl overflow-hidden">
          {records.map((item, index) => (
            <div
              key={item.id}
              className="group flex flex-col md:flex-row gap-5 md:gap-8 p-6 md:p-8 border-b border-[#EDF0EA] last:border-b-0 hover:bg-[#FAFCF9] transition-colors"
            >
              {/* Large Number */}
              <div className="shrink-0">
                <span className="text-4xl md:text-5xl font-bold text-[#D0DFCD] group-hover:text-[#8DAD91] transition-colors">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Method Content */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-bold text-[#344F3C]">
                    {item.method_name}
                  </h3>

                  <Sparkles
                    size={17}
                    className="text-[#8DAF8F]"
                  />
                </div>

                {item.description && (
                  <p className="text-sm md:text-base text-gray-600 leading-7 mt-3 whitespace-pre-line">
                    {item.description}
                  </p>
                )}

                {item.tools && (
                  <div className="flex items-start gap-2 mt-5">
                    <MonitorPlay
                      size={17}
                      className="text-[#54765C] mt-0.5 shrink-0"
                    />

                    <div className="text-sm">
                      <span className="font-semibold text-[#41634C]">
                        Tools & Technologies:
                      </span>{" "}
                      <span className="text-gray-600">
                        {item.tools}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <ChevronRight
                size={20}
                className="hidden md:block text-[#C4D4C3] shrink-0"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* =====================================================
   MAIN TEACHING PAGE
===================================================== */

export default function Teaching() {
  const [reloadKey, setReloadKey] = useState(0);

  const retry = () => setReloadKey((value) => value + 1);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen bg-[#F8F7F2] text-[#334238]">

      {/* HERO */}
      <header className="relative overflow-hidden bg-[#EDF2E9] border-b border-[#E1E7DC]">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#DDE8D8] rounded-full opacity-50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-white rounded-full opacity-60 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-[#DCE7D9] text-[#54765C] text-xs font-bold uppercase tracking-widest">
              <GraduationCap size={16} />
              Academic Portfolio
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#344F3C] mt-7 leading-tight">
              Teaching &amp;
              <span className="block text-[#74927B]">
                Academic Excellence
              </span>
            </h1>

            <p className="text-base md:text-lg text-[#647267] leading-8 mt-6 max-w-2xl">
              An overview of teaching experience, academic courses,
              student mentorship, and innovative approaches to
              education and learning.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <button
                type="button"
                onClick={() => scrollToSection("courses")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#41634C] text-white rounded-xl font-semibold hover:bg-[#304C39] transition-colors"
              >
                Explore Courses
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("experience")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#41634C] border border-[#C9D8C9] rounded-xl font-semibold hover:bg-[#F4F7F1] transition-colors"
              >
                Teaching Experience
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* QUICK NAVIGATION */}
      <nav
        aria-label="Teaching page sections"
        className="bg-white border-b border-[#E9E9E1]"
      >
        <div className="max-w-6xl justify-center items-center mx-auto px-6 py-5 flex flex-wrap gap-3">
          {sectionLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollToSection(link.id)}
              className="px-4 py-2 rounded-full border border-[#E2E9DE] bg-[#F9FBF7] text-sm font-medium text-[#54765C] hover:bg-[#E8F0E6] transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ALL TEACHING SECTIONS */}
      <div className="max-w-6xl mx-auto px-6 py-14 md:py-20 space-y-20">

        <ExperienceSection
          reloadKey={reloadKey}
          onRetry={retry}
        />

        <CoursesSection
          reloadKey={reloadKey}
          onRetry={retry}
        />

        <TimetableSection
          reloadKey={reloadKey}
          onRetry={retry}
        />

        <GuidanceSection
          reloadKey={reloadKey}
          onRetry={retry}
        />



        {/* BOTTOM BANNER */}
        <div className="bg-[#E9F0E7] rounded-3xl px-7 py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white text-[#54765C] flex items-center justify-center shrink-0">
              <Award size={24} />
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#344F3C]">
                Committed to Academic Excellence
              </h2>

              <p className="text-gray-600 mt-2 max-w-xl leading-7">
                Supporting students through quality education,
                mentorship, practical learning, and continuous
                academic development.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="shrink-0 bg-[#41634C] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#304C39] transition-colors"
          >
            Back to Top ↑
          </button>
        </div>

      </div>
    </main>
  );
}
