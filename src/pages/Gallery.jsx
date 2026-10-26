
import { useEffect, useMemo, useState } from "react";
import {
  Images,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Expand,
  RefreshCw,
  AlertCircle,
  Camera,
  CalendarDays,
  FolderOpen,
} from "lucide-react";

const API = "http://localhost/professor-api/gallery/get.php";
const FILE_BASE = "http://localhost/professor-api/";

function getImageUrl(path) {
  if (
    !path ||
    !/^uploads\/gallery\/[a-f0-9]{32}\.(jpg|jpeg|png|webp)$/i.test(path)
  ) {
    return null;
  }

  return FILE_BASE + path;
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value.replace(" ", "T"));

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGallery() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load gallery photos.");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || "Unable to load gallery."
          );
        }

        setPhotos(
          Array.isArray(data.photos) ? data.photos : []
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

    loadGallery();

    return () => controller.abort();
  }, [reloadKey]);

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        photos.map((photo) => photo.category).filter(Boolean)
      ),
    ];
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    const query = search.trim().toLowerCase();

    return photos.filter((photo) => {
      const categoryMatch =
        category === "All" || photo.category === category;

      const searchableText = [
        photo.title,
        photo.category,
        photo.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        categoryMatch &&
        searchableText.includes(query) &&
        getImageUrl(photo.image_path)
      );
    });
  }, [photos, category, search]);

  const activePhoto =
    activeIndex !== null
      ? filteredPhotos[activeIndex]
      : null;

  const openLightbox = (index) => {
    setActiveIndex(index);
  };

  const closeLightbox = () => {
    setActiveIndex(null);
  };

  const nextPhoto = () => {
    setActiveIndex((previous) =>
      (previous + 1) % filteredPhotos.length
    );
  };

  const previousPhoto = () => {
    setActiveIndex((previous) =>
      (previous - 1 + filteredPhotos.length) %
      filteredPhotos.length
    );
  };

  // Close lightbox when filters change.
  useEffect(() => {
    setActiveIndex(null);
  }, [category, search]);

  // Keyboard navigation and background scroll lock.
  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((previous) =>
          (previous + 1) % filteredPhotos.length
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((previous) =>
          (previous - 1 + filteredPhotos.length) %
          filteredPhotos.length
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, filteredPhotos.length]);

  const resetFilters = () => {
    setCategory("All");
    setSearch("");
  };

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
              <Camera size={15} />
              Academic Moments
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mt-7 leading-tight">
              Photo
              <span className="block text-[#D4E5CC]">
                Gallery
              </span>
            </h1>

            <p className="text-base md:text-lg leading-8 text-white/75 mt-6 max-w-2xl">
              Explore memorable moments from academic
              conferences, seminars, workshops, achievements,
              institutional events and professional activities.
            </p>

            <a
              href="#gallery"
              className="inline-flex items-center gap-3 mt-9 px-6 py-3.5 bg-white text-[#41634C] font-semibold rounded-xl hover:bg-[#F0F4ED] transition-colors"
            >
              <Images size={18} />
              Explore Gallery
            </a>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section
        id="gallery"
        className="max-w-7xl mx-auto px-6 py-16 md:py-20"
      >
        <div className="flex flex-wrap justify-between items-end gap-5 mb-9">
          <div>
            <div className="flex items-center gap-3 text-[#54765C]">
              <span className="w-10 h-px bg-[#54765C]" />

              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                Captured Memories
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-[#344F3C] mt-4">
              Moments & Milestones
            </h2>

            <p className="text-gray-500 leading-7 mt-3">
              Browse photographs from academic and
              professional activities.
            </p>
          </div>

          {!loading && !error && (
            <div className="inline-flex items-center gap-2 bg-[#EDF3EA] text-[#41634C] px-4 py-2.5 rounded-xl text-sm font-semibold">
              <Images size={17} />
              {photos.length} Photos
            </div>
          )}
        </div>

        {/* SEARCH */}
        <div className="bg-white border border-[#E5EBE2] rounded-2xl p-5 md:p-6 mb-9">
          <div className="relative mb-5">
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
              placeholder="Search events, conferences, workshops..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#E1E7DE] outline-none focus:border-[#54765C] focus:ring-2 focus:ring-[#54765C]/10 text-sm"
            />
          </div>

          {/* CATEGORY FILTERS */}
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  category === item
                    ? "bg-[#41634C] text-white"
                    : "bg-[#F3F5F0] text-[#647166] hover:bg-[#E5EDE2]"
                }`}
              >
                {item}
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
              Loading gallery photos...
            </p>
          </div>
        ) : error ? (
          <div className="text-center bg-white border border-red-100 rounded-2xl p-12">
            <AlertCircle
              size={35}
              className="mx-auto text-red-500"
            />

            <h3 className="font-bold text-xl mt-4 text-gray-800">
              Unable to Load Gallery
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
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center bg-white border border-[#E5EBE2] rounded-2xl p-12">
            <FolderOpen
              size={40}
              className="mx-auto text-[#9AAF9B]"
            />

            <h3 className="font-bold text-xl mt-4 text-[#344F3C]">
              No Photos Found
            </h3>

            <p className="text-gray-500 mt-3">
              {photos.length === 0
                ? "Gallery photos will appear here when they are uploaded."
                : "Try adjusting your search or category filter."}
            </p>

            {photos.length > 0 && (
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
            <p className="text-sm text-gray-500 mb-6">
              Showing{" "}
              <span className="font-bold text-[#41634C]">
                {filteredPhotos.length}
              </span>{" "}
              photos
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhotos.map((photo, index) => {
                const imageUrl = getImageUrl(
                  photo.image_path
                );

                return (
                  <button
                    type="button"
                    key={photo.id}
                    onClick={() => openLightbox(index)}
                    className="group bg-white rounded-2xl overflow-hidden border border-[#E5E9E2] text-left hover:shadow-xl hover:shadow-[#54765C]/10 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative h-64 overflow-hidden bg-[#EDF3EA]">
                      <img
                        src={imageUrl}
                        alt={photo.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      <span className="absolute top-4 left-4 bg-white/95 text-[#41634C] text-xs font-bold px-3 py-1.5 rounded-full">
                        {photo.category}
                      </span>

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#41634C] shadow-lg">
                          <Expand size={21} />
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-[#344F3C] line-clamp-2">
                        {photo.title}
                      </h3>

                      {photo.description && (
                        <p className="text-sm text-gray-500 leading-6 mt-2 line-clamp-2">
                          {photo.description}
                        </p>
                      )}

                      {photo.created_at && (
                        <p className="inline-flex items-center gap-2 text-xs text-gray-400 mt-4">
                          <CalendarDays size={14} />
                          {formatDate(photo.created_at)}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* LIGHTBOX */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
        >
          {/* TOP BAR */}
          <div className="flex items-center justify-between gap-4 px-5 md:px-10 py-4 text-white">
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {activePhoto.title}
              </p>

              <p className="text-xs text-white/60 mt-1">
                {activeIndex + 1} of {filteredPhotos.length}
              </p>
            </div>

            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close gallery viewer"
              className="p-3 rounded-full hover:bg-white/15 transition-colors"
            >
              <X size={25} />
            </button>
          </div>

          {/* IMAGE VIEWER */}
          <div className="flex-1 min-h-0 flex items-center justify-center relative px-14 md:px-24 py-4">
            {filteredPhotos.length > 1 && (
              <button
                type="button"
                onClick={previousPhoto}
                aria-label="Previous photo"
                className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
              >
                <ChevronLeft size={25} />
              </button>
            )}

            <img
              src={getImageUrl(activePhoto.image_path)}
              alt={activePhoto.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {filteredPhotos.length > 1 && (
              <button
                type="button"
                onClick={nextPhoto}
                aria-label="Next photo"
                className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
              >
                <ChevronRight size={25} />
              </button>
            )}
          </div>

          {/* CAPTION */}
          <div className="text-center text-white px-6 py-5 bg-black/40">
            <p className="font-semibold">
              {activePhoto.title}
            </p>

            <p className="text-xs text-[#BBD2B9] mt-1">
              {activePhoto.category}
            </p>

            {activePhoto.description && (
              <p className="text-sm text-white/65 mt-2 max-w-2xl mx-auto">
                {activePhoto.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
