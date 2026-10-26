import React from "react";
import { useState, useMemo, useEffect } from "react";
import { getPublications } from "../hooks/publicationService";
import { Link } from "react-router-dom";

function Research() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API = "http://localhost/professor-api/research/get.php";
  const [publications, setPublications] = useState([]);
  const [loadingPublications, setLoadingPublications] = useState(true);
  const [publicationError, setPublicationError] = useState("");


  useEffect(() => {
    let active = true;

    async function loadPublications() {
      try {
        setLoadingPublications(true);
        setPublicationError("");

        const data = await getPublications();

        if (active) {
          if (!Array.isArray(data)) {
            throw new Error("Invalid publications response");
          }

          setPublications(data);
        }
      } catch (err) {
        if (active) {
          setPublicationError(err.message);
        }
      } finally {
        if (active) {
          setLoadingPublications(false);
        }
      }
    }

    loadPublications();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        const response = await fetch(API, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Unable to load research projects");
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.projects)) {
          throw new Error("Invalid API response");
        }

        setProjects(data.projects);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadProjects();

    return () => controller.abort();
  }, []);

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  
const filteredPublications = useMemo(() => {
  return publications
    .filter((publication) => {
      const keyword = search.toLowerCase().trim();

      const title = String(publication.title ?? "");
      const authors = String(publication.authors ?? "");
      const journal = String(publication.journal_name ?? "");
      const publisher = String(publication.publisher ?? "");

      const matchesSearch =
        title.toLowerCase().includes(keyword) ||
        authors.toLowerCase().includes(keyword) ||
        journal.toLowerCase().includes(keyword) ||
        publisher.toLowerCase().includes(keyword);

      const matchesType =
        selectedType === "All" ||
        publication.publication_type === selectedType;

      return matchesSearch && matchesType;
    })
    .sort(
      (a, b) =>
        Number(b.publication_year ?? 0) -
        Number(a.publication_year ?? 0)
    );
}, [publications, search, selectedType]);


  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#343C32]">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#F3F0E8] py-20 md:py-28">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E9EEDC] rounded-full blur-3xl opacity-70" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-5 py-2 bg-[#E9EEDC] text-[#54765C] rounded-full text-sm font-semibold mb-6">
            ✦ Academic Research & Innovation
          </span>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Research &
            <span className="text-[#54765C]"> Innovation</span>
          </h1>

          <p className="text-[#77796E] text-lg leading-8 max-w-3xl mx-auto">
            Advancing knowledge through innovative research,
            interdisciplinary collaboration, and the
            exploration of emerging technologies.
          </p>

          <div className="mt-8 text-sm text-[#8A806F]">
            <Link to="/" className="hover:text-[#54765C]">
              Home
            </Link>
            <span className="mx-3">/</span>
            <span className="text-[#54765C] font-semibold">
              Research
            </span>
          </div>
        </div>
      </section>

      {/* RESEARCH PROJECTS SECTION */}
      <section className="min-h-screen bg-[#F8F7F2] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="uppercase tracking-widest text-sm font-semibold text-[#54765C]">
              Academic Contributions
            </p>

            <h1 className="text-4xl font-bold text-[#41634C] mt-3">
              Research Projects
            </h1>

            <p className="text-gray-500 mt-3">
              Exploring ideas, innovation and academic research
            </p>
          </div>

          {loading && (
            <p className="text-center text-gray-500">
              Loading research projects...
            </p>
          )}

          {error && (
            <p className="text-center text-red-600">{error}</p>
          )}

          {!loading && !error && projects.length === 0 && (
            <p className="text-center text-gray-500">
              Research projects will be available soon.
            </p>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((item) => (
                <article
                  key={item.id}
                  className="bg-white border border-[#E9E5DB] rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start gap-3">
                    <h2 className="text-xl font-bold text-[#41634C]">
                      {item.title}
                    </h2>

                    <span className="shrink-0 bg-[#EEF3ED] text-[#41634C] rounded-full px-3 py-1 text-xs font-semibold">
                      {item.status}
                    </span>
                  </div>

                  {item.research_area && (
                    <p className="text-[#54765C] font-medium mt-3">
                      {item.research_area}
                    </p>
                  )}

                  {item.description && (
                    <p className="text-gray-600 leading-relaxed mt-4 whitespace-pre-line">
                      {item.description}
                    </p>
                  )}

                  <div className="border-t border-[#E9E5DB] mt-6 pt-4 space-y-2 text-sm text-gray-500">
                    {item.funding_agency && (
                      <p>
                        <strong>Funding Agency:</strong>{" "}
                        {item.funding_agency}
                      </p>
                    )}

                    {(item.start_date || item.end_date) && (
                      <p>
                        <strong>Duration:</strong>{" "}
                        {item.start_date || "Not specified"} –{" "}
                        {item.end_date || "Present"}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* RESEARCH OVERVIEW */}
      <section className="py-20 md:py-24 bg-[#F3F0E8] min-h-screen">
        <div className="max-w-5xl mx-auto px-6">

          {/* SECTION HEADER */}
          <div className="text-center mb-12"  id="publications">
            <span className="uppercase tracking-widest text-xs font-bold text-[#54765C] bg-[#E9EEDC] px-4 py-1.5 rounded-full inline-block mb-3">
              Academic Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#343C32]">
              Featured Publications
            </h2>
          </div>

          {/* PUBLICATION CARDS CONTAINER */}
          <div className="space-y-6">

            {/* LOADING STATE */}
            {loadingPublications && (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#E9E5DB]">
                <p className="text-gray-500 font-medium animate-pulse">
                  Loading publications...
                </p>
              </div>
            )}

            {/* ERROR STATE */}
            {publicationError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                <p className="text-red-600 font-medium">{publicationError}</p>
              </div>
            )}

            {/* PUBLICATIONS LIST */}
            {!loadingPublications &&
              !publicationError &&
              filteredPublications.map((publication, index) => {
                // URL Helpers
                const pdfUrl = publication.pdf_file
                  ? new URL(
                    publication.pdf_file,
                    "http://localhost/professor-api/"
                  ).href
                  : null;

                const doiUrl = publication.doi
                  ? /^https?:\/\//i.test(publication.doi)
                    ? publication.doi
                    : `https://doi.org/${publication.doi.replace(/^doi:\s*/i, "")}`
                  : null;

                return (
                  <article
                    key={publication.id || index}
                    className="group bg-white border border-[#E9E5DB] rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md hover:border-[#54765C]/40 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row gap-6 items-start">

                      {/* PUBLICATION INDEX BADGE */}
                      <div className="w-12 h-12 shrink-0 bg-[#E9EEDC] text-[#54765C] group-hover:bg-[#54765C] group-hover:text-white rounded-xl flex items-center justify-center font-bold text-base transition-colors duration-300">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="flex-1 min-w-0">

                        {/* TYPE AND YEAR BADGES */}
                        <div className="flex flex-wrap items-center gap-2.5 mb-3">
                          <span className="bg-[#E9EEDC] text-[#54765C] px-3.5 py-1 rounded-full text-xs font-semibold">
                            {publication.publication_type || "Other"}
                          </span>

                          <span className="bg-[#F3F0E8] text-[#77796E] px-3.5 py-1 rounded-full text-xs font-medium">
                            {publication.publication_year || "Year N/A"}
                          </span>
                        </div>

                        {/* TITLE */}
                        <h3 className="text-xl md:text-2xl font-bold text-[#343C32] mb-2 leading-snug group-hover:text-[#54765C] transition-colors">
                          {publication.title}
                        </h3>

                        {/* AUTHORS */}
                        {publication.authors && (
                          <p className="text-[#54765C] font-medium text-sm md:text-base mb-2">
                            {publication.authors}
                          </p>
                        )}

                        {/* JOURNAL */}
                        {publication.journal_name && (
                          <p className="text-[#77796E] italic text-sm mb-5">
                            {publication.journal_name}
                          </p>
                        )}

                        {/* DETAILS GRID (Publisher, Volume, Issue, Pages) */}
                        {(publication.publisher ||
                          publication.volume ||
                          publication.issue ||
                          publication.pages) && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF9F6] border border-[#E9E5DB]/60 rounded-xl p-4 mb-5">
                              {publication.publisher && (
                                <div>
                                  <span className="block text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">
                                    Publisher
                                  </span>
                                  <span className="text-xs font-medium text-[#343C32] truncate block">
                                    {publication.publisher}
                                  </span>
                                </div>
                              )}

                              {publication.volume && (
                                <div>
                                  <span className="block text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">
                                    Volume
                                  </span>
                                  <span className="text-xs font-medium text-[#343C32]">
                                    {publication.volume}
                                  </span>
                                </div>
                              )}

                              {publication.issue && (
                                <div>
                                  <span className="block text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">
                                    Issue
                                  </span>
                                  <span className="text-xs font-medium text-[#343C32]">
                                    {publication.issue}
                                  </span>
                                </div>
                              )}

                              {publication.pages && (
                                <div>
                                  <span className="block text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">
                                    Pages
                                  </span>
                                  <span className="text-xs font-medium text-[#343C32]">
                                    {publication.pages}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                        {/* ABSTRACT / DESCRIPTION */}
                        {publication.description && (
                          <div className="mb-5 bg-[#FAF9F6] rounded-xl p-4 border border-[#E9E5DB]/40">
                            <h4 className="text-xs uppercase tracking-wider font-bold text-[#41634C] mb-1.5">
                              Abstract / Overview
                            </h4>
                            <p className="text-[#77796E] text-sm leading-relaxed whitespace-pre-line line-clamp-4">
                              {publication.description}
                            </p>
                          </div>
                        )}

                        {/* DOI TEXT DISPLAY */}
                        {publication.doi && (
                          <p className="text-xs text-gray-500 mb-5 font-mono bg-gray-50 px-3 py-1.5 rounded-md inline-block border border-gray-200/60">
                            <strong className="font-sans text-gray-600">DOI:</strong> {publication.doi}
                          </p>
                        )}

                        {/* ACTION LINKS */}
                        <div className="flex flex-wrap gap-3 border-t border-[#E9E5DB] pt-5">
                          {doiUrl && (
                            <a
                              href={doiUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-[#54765C] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#405C47] transition shadow-sm"
                            >
                              <span>View DOI</span>
                              <span>↗</span>
                            </a>
                          )}

                          {publication.publication_url && (
                            <a
                              href={publication.publication_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 border border-[#54765C] text-[#54765C] px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#E9EEDC] transition"
                            >
                              <span>View Publication</span>
                              <span>↗</span>
                            </a>
                          )}

                          {pdfUrl && (
                            <a
                              href={pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-[#E9EEDC] text-[#41634C] px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#DDE6D4] transition"
                            >
                              <span>View PDF</span>
                              <span>↗</span>
                            </a>
                          )}

                          {!doiUrl &&
                            !publication.publication_url &&
                            !pdfUrl && (
                              <span className="text-xs text-gray-400 italic self-center">
                                No direct publication links available
                              </span>
                            )}
                        </div>

                      </div>
                    </div>
                  </article>
                );
              })}


          </div>
        </div>
      </section>

      {/* RESEARCH COLLABORATION */}
      <section className="bg-[#E9EEDC] py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-[#54765C] uppercase tracking-widest text-sm font-semibold">
            Research Collaboration
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-5 mb-7">
            Let's Explore New
            <span className="text-[#54765C]">
              {" "}Possibilities.
            </span>
          </h2>

          <p className="text-[#77796E] leading-8 max-w-2xl mx-auto mb-9">
            Interested in academic collaboration,
            interdisciplinary research, innovative
            projects, or student research mentorship?
            Let's connect and exchange ideas.
          </p>

          <Link
            to="/contact"
            className="inline-block bg-[#54765C] text-white px-9 py-4 rounded-full font-semibold hover:bg-[#405C47] transition shadow-sm"
          >
            Get in Touch →
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Research;