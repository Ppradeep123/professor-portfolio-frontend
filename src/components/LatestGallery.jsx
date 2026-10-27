
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Images,
  Camera,
  RefreshCw,
} from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://professor-portfolio-api.onrender.com";

const apiUrl = (path) =>
  `${API_BASE.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

function getImageUrl(path) {
  if (
    !/^uploads\/gallery\/[a-f0-9]{32}\.(jpg|jpeg|png|webp)$/i.test(
      path || ""
    )
  ) {
    return null;
  }

  return apiUrl(path);
}

export default function LatestGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchGallery() {
      try {
        setLoading(true);

        const response = await fetch(
          apiUrl("gallery/get.php"),
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Unable to load gallery.");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Gallery error.");
        }

        const latest = (data.photos || [])
          .filter((photo) => getImageUrl(photo.image_path))
          .sort(
            (a, b) =>
              Number(b.id) - Number(a.id)
          )
          .slice(0, 6);

        setPhotos(latest);
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

    fetchGallery();

    return () => controller.abort();
  }, []);

  return (
    <section className="bg-[#F8F7F2] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* SECTION HEADING */}

        <div className="flex flex-col items-center justify-center gap-5 mb-10 text-center">
          <div className="flex flex-col items-center">

            <div className="flex items-center justify-center gap-3">
              <span className="w-10 h-px bg-[#54765C]" />

              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#54765C]">
                Academic Moments
              </span>

              <span className="w-10 h-px bg-[#54765C]" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-[#344F3C] mt-4">
              Photo Gallery
            </h2>

            <p className="text-gray-500 mt-4 max-w-xl leading-7">
              A glimpse into conferences, workshops,
              academic events and memorable achievements.
            </p>

          </div>



          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#54765C] text-[#41634C] font-semibold hover:bg-[#EDF3EA] transition-colors"
          >
            View All Photos
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center items-center gap-3 py-16 text-[#54765C]">
            <RefreshCw
              size={21}
              className="animate-spin"
            />
            Loading gallery...
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="bg-white rounded-2xl border border-[#E5EBE2] p-10 text-center">
            <p className="text-gray-500">{error}</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && photos.length === 0 && (
          <div className="bg-white border border-[#E5EBE2] rounded-2xl p-12 text-center">
            <Camera
              size={35}
              className="mx-auto text-[#9CAF9C]"
            />

            <h3 className="text-lg font-bold text-[#41634C] mt-4">
              Gallery Coming Soon
            </h3>

            <p className="text-gray-500 mt-2">
              Photos from academic activities will appear here.
            </p>
          </div>
        )}

        {/* PHOTO GRID */}
        {!loading && !error && photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {photos.map((photo) => (
              <Link
                key={photo.id}
                to="/gallery"
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-[#E8EFE5]"
              >
                <img
                  src={getImageUrl(photo.image_path)}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5">
                  <span className="inline-flex items-center gap-1 text-[10px] md:text-xs text-white/80 mb-1">
                    <Images size={13} />
                    {photo.category}
                  </span>

                  <h3 className="text-white font-semibold text-sm md:text-lg line-clamp-2">
                    {photo.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
