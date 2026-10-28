
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";



function Publications() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);

  const publicationTypes = [
    "All",
    "Journal",
    "Conference",
    "Book",
    "Book Chapter",
    "Patent",
    "Other",
  ];
  const years = [
    "All",
    ...new Set(
      publications
        .map((pub) => String(pub.year ?? ""))
        .filter(Boolean)
    ),
  ].sort((a, b) => {
    if (a === "All") return -1;
    if (b === "All") return 1;
    return Number(b) - Number(a);
  });

  const filteredPublications = (publications || []).filter((pub) => {
    // Search by title, author, or journal
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      String(pub.title || "").toLowerCase().includes(searchText) ||
      String(pub.authors || "").toLowerCase().includes(searchText) ||
      String(pub.journal || "").toLowerCase().includes(searchText);

    // Filter by publication type
    const matchesType =
      selectedType === "All" ||
      pub.type === selectedType;

    // Filter by publication year
    const matchesYear =
      selectedYear === "All" ||
      String(pub.year) === String(selectedYear);

    return matchesSearch && matchesType && matchesYear;
  });
  const resetFilters = () => {
    setSearch("");
    setSelectedType("All");
    setSelectedYear("All");
  };

  const visiblePublications = filteredPublications;
  const getTypeStyle = (type) => {
    const styles = {
      Journal: "bg-green-100 text-green-700",
      Conference: "bg-purple-100 text-purple-700",
      Book: "bg-amber-100 text-amber-700",
      "Book Chapter": "bg-orange-100 text-orange-700",
      Patent: "bg-pink-100 text-pink-700",
      Other: "bg-gray-100 text-gray-700",
    };

    return styles[type] || "bg-gray-100 text-gray-700";
  };
  const [filter, setFilter] = useState("All");
  const API_BASE = (
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost/professor-api/"
  ).replace(/\/+$/, "") + "/";

  const API = `${API_BASE}publications/get.php`;
  useEffect(() => {
    const controller = new AbortController();

    async function loadPublications() {
      try {
        const response = await fetch(API, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Unable to load publications");
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.publications)) {
          throw new Error("Invalid API response");
        }

        setPublications(data.publications);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadPublications();

    return () => controller.abort();
  }, []);

  const types = [
    "All", "Journal", "Conference",
    "Book", "Book Chapter", "Other"
  ];

  const filtered = filter === "All"
    ? publications
    : publications.filter(
      (item) => item.publication_type === filter
    );




  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#343C32]">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#F3F0E8] py-20 md:py-28">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E9EEDC] rounded-full blur-3xl opacity-70" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">

          <span className="inline-block px-5 py-2 bg-[#E9EEDC] text-[#54765C] rounded-full text-sm font-semibold mb-6">
            ✦ Academic Contributions
          </span>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Academic
            <span className="text-[#54765C]"> Publications</span>
          </h1>

          <p className="text-[#77796E] text-lg leading-8 max-w-3xl mx-auto">
            Exploring research contributions through journal
            articles, conference papers, books, and scholarly
            publications.
          </p>

          <div className="mt-8 text-sm text-[#8A806F]">
            <Link to="/" className="hover:text-[#54765C]">
              Home
            </Link>

            <span className="mx-3">/</span>

            <span className="text-[#54765C] font-semibold">
              Publications
            </span>
          </div>

        </div>
      </section>
      <section className="min-h-screen bg-[#E9EEDC] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-[#B38B59] uppercase  tracking-widest text-sm font-semibold mb-3">
              Academic Contributions
            </p>

            <h2 className="text-4xl font-bold text-[#41634C] mt-2">
              Publications
            </h2>

            <p className="text-gray-500 mt-2">
              Research papers, journals, conferences and books
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {types.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilter(type)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${filter === type
                  ? "bg-[#54765C] text-white"
                  : "bg-white text-[#41634C] border border-[#E9E5DB]"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>

          {loading && (
            <p className="text-center text-gray-500">
              Loading publications...
            </p>
          )}

          {error && (
            <p className="text-center text-red-600">{error}</p>
          )}

          {!loading && !error && filtered.length === 0 && (
            <p className="text-center text-gray-500">
              No publications found.
            </p>
          )}

          {!loading && !error && (
            <div className="space-y-5">
              {filtered.map((item) => (
                <article
                  key={item.id}
                  className="bg-white border border-[#E9E5DB] rounded-2xl p-6 md:p-8 shadow-sm"
                >
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="bg-[#EEF3ED] text-[#41634C] px-3 py-1 rounded-full text-xs font-semibold">
                      {item.publication_type}
                    </span>

                    {item.publication_year && (
                      <span className="text-sm text-gray-500">
                        {item.publication_year}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-[#41634C]">
                    {item.title}
                  </h2>

                  {item.authors && (
                    <p className="text-gray-600 mt-3">
                      {item.authors}
                    </p>
                  )}

                  {item.journal_name && (
                    <p className="mt-2 text-[#54765C] font-medium">
                      {item.journal_name}
                    </p>
                  )}

                  {item.publisher && (
                    <p className="mt-2 text-sm text-gray-500">
                      Publisher: {item.publisher}
                    </p>
                  )}

                  {item.description && (
                    <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 mt-6">
                    {item.doi && (
                      <a
                        href={`https://doi.org/${encodeURIComponent(item.doi.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, ""))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#41634C] underline font-medium"
                      >
                        View DOI
                      </a>
                    )}

                    {item.publication_url && /^https?:\/\//i.test(item.publication_url) && (
                      <a
                        href={item.publication_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#41634C] underline font-medium"
                      >
                        View Publication
                      </a>
                    )}

                    {item.pdf_file && (
                      <a
                        href={`${API_BASE.replace(/\/+$/, "")}/${String(item.pdf_file).replace(/^\/+/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#41634C] underline font-medium"
                      >
                        View PDF
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PUBLICATIONS SECTION */}
      <section className="py-4 md:py-20">

        <div className="max-w-7xl mx-auto px-6">

          {/* SECTION HEADING */}
          <div className=" text-center mb-6 ">

            <p className="text-[#B38B59] uppercase  tracking-widest text-sm font-semibold mb-4">
              Research Contributions
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Explore My
              <span className="text-[#54765C]"> Publications</span>
            </h2>

            <p className="text-[#77796E] ">
              Browse scholarly contributions by publication
              type, year, or research topic.
            </p>

          </div>

          {/* SEARCH AND FILTERS */}
          <div className="bg-white border border-[#EAE7DE] rounded-3xl p-6 md:p-8 mb-10 shadow-sm">

            <div className="grid md:grid-cols-3 gap-5">

              {/* SEARCH */}
              <div>
                <label
                  htmlFor="publication-search"
                  className="block text-sm font-semibold mb-3"
                >
                  Search Publications
                </label>

                <input
                  id="publication-search"
                  type="search"
                  placeholder="Search title, author, journal..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setVisibleCount(6);
                  }}
                  className="w-full px-5 py-3 rounded-xl border border-[#E2E4DC] bg-[#FAF9F6] focus:outline-none focus:ring-2 focus:ring-[#54765C] text-sm"
                />
              </div>

              {/* TYPE FILTER */}
              <div>
                <label
                  htmlFor="publication-type"
                  className="block text-sm font-semibold mb-3"
                >
                  Publication Type
                </label>

                <select
                  id="publication-type"
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setVisibleCount(6);
                  }}
                  className="w-full px-5 py-3 rounded-xl border border-[#E2E4DC] bg-[#FAF9F6] focus:outline-none focus:ring-2 focus:ring-[#54765C] text-sm"
                >
                  {publicationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "All" ? "All Types" : type}
                    </option>
                  ))}
                </select>
              </div>

              {/* YEAR FILTER */}
              <div>
                <label
                  htmlFor="publication-year"
                  className="block text-sm font-semibold mb-3"
                >
                  Publication Year
                </label>

                <select
                  id="publication-year"
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setVisibleCount(6);
                  }}
                  className="w-full px-5 py-3 rounded-xl border border-[#E2E4DC] bg-[#FAF9F6] focus:outline-none focus:ring-2 focus:ring-[#54765C] text-sm"
                >
                  <option value="All">All Years</option>

                  {years.map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-[#EEEAE1]">

              <p className="text-sm text-[#77796E]">
                Showing{" "}
                <span className="font-semibold text-[#54765C]">
                  {Math.min(
                    visibleCount,
                    filteredPublications.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold">
                  {filteredPublications.length}
                </span>{" "}
                publications
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-semibold text-[#54765C] hover:text-[#405C47] transition"
              >
                Reset Filters ↻
              </button>

            </div>

          </div>

          {/* PUBLICATION CARDS */}
          {visiblePublications.length > 0 ? (

            <div className="space-y-6">

              {visiblePublications.map((publication, index) => (
                <article
                  key={publication.id}
                  className="group bg-white border border-[#EAE7DE] rounded-3xl p-6 md:p-9 hover:shadow-xl hover:border-[#C8D5C3] transition-all duration-300"
                >

                  <div className="flex flex-col md:flex-row gap-6">

                    {/* PUBLICATION NUMBER */}
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-[#E9EEDC] text-[#54765C] flex items-center justify-center font-bold text-lg">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    {/* PUBLICATION DETAILS */}
                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-3 mb-5">

                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold ${getTypeStyle(
                            publication.type
                          )}`}
                        >
                          {publication.type}
                        </span>

                        <span className="text-sm text-[#8A806F]">
                          {publication.year}
                        </span>

                      </div>

                      <h3 className="text-xl md:text-2xl font-bold leading-snug mb-4 group-hover:text-[#54765C] transition">
                        {publication.title}
                      </h3>

                      <p className="text-[#54765C] font-medium text-sm mb-3">
                        {publication.authors}
                      </p>

                      <p className="text-[#77796E] text-sm italic mb-4">
                        {publication.journal}
                        {publication.volume && ` • ${publication.volume}`}
                      </p>

                      <p className="text-[#77796E] leading-7 mb-6">
                        {publication.description}
                      </p>

                      {/* DOI AND PDF LINKS */}
                      <div className="flex flex-wrap gap-4 pt-5 border-t border-[#EEEAE1]">

                        {publication.doi && (
                          <a
                            href={publication.doi}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#54765C] hover:underline"
                          >
                            View DOI ↗
                          </a>
                        )}

                        {publication.pdf && (
                          <a
                            href={publication.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#54765C] hover:underline"
                          >
                            View PDF ↗
                          </a>
                        )}

                        {!publication.doi && !publication.pdf && (
                          <span className="text-xs text-[#8A806F]">
                            Publication link not available
                          </span>
                        )}

                      </div>

                    </div>

                  </div>

                </article>
              ))}

            </div>

          ) : (

            <div className="bg-white rounded-3xl border border-[#EAE7DE] p-14 text-center">

              <div className="text-5xl mb-5">⌕</div>

              <h3 className="text-2xl font-bold mb-3">
                No Publications Found
              </h3>

              <p className="text-[#77796E] mb-6">
                Try changing your search or filter selection.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="px-7 py-3 bg-[#54765C] text-white rounded-full font-semibold hover:bg-[#405C47] transition"
              >
                Clear Filters
              </button>

            </div>

          )}

          {/* LOAD MORE */}
          {visibleCount < filteredPublications.length && (
            <div className="text-center mt-12">

              <button
                type="button"
                onClick={() =>
                  setVisibleCount((prev) => prev + 6)
                }
                className="px-9 py-4 bg-[#54765C] text-white rounded-full font-semibold hover:bg-[#405C47] transition shadow-sm"
              >
                Load More Publications ↓
              </button>

            </div>
          )}

        </div>
      </section>

      {/* RESEARCH COLLABORATION */}
      <section className="py-20 bg-[#F3F0E8]">

        <div className="max-w-5xl mx-auto px-6">

          <div className="bg-[#E9EEDC] rounded-[2.5rem] p-10 md:p-20 text-center">

            <p className="text-[#54765C] uppercase tracking-widest text-sm font-semibold mb-5">
              Research & Collaboration
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mb-7">
              Let's Advance
              <span className="text-[#54765C]">
                {" "}Knowledge Together.
              </span>
            </h2>

            <p className="text-[#77796E] max-w-2xl mx-auto leading-8 mb-9">
              Interested in academic research,
              interdisciplinary collaboration, or
              discussing scholarly publications?
              Feel free to connect.
            </p>

            <Link
              to="/contact"
              className="inline-block bg-[#54765C] text-white px-9 py-4 rounded-full font-semibold hover:bg-[#405C47] transition"
            >
              Contact Me →
            </Link>

          </div>

        </div>
      </section>

    </div>
  );
}

export default Publications;
