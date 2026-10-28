
import { useEffect, useState } from "react";
const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost/professor-api/"
).replace(/\/+$/, "") + "/";

const API = `${API_BASE}teaching/manage.php`;
export default function TeachingPublicSection({
  module,
  title,
  fields
}) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(
          `${API}?module=${encodeURIComponent(module)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Unable to load teaching information");
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.records)) {
          throw new Error("Invalid response");
        }

        setRecords(data.records);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();

    return () => controller.abort();
  }, [module]);

  return (
    <section className="mt-14">
      <h2 className="text-2xl font-bold text-[#41634C] mb-6">
        {title}
      </h2>

      {loading && (
        <p className="text-gray-500">Loading...</p>
      )}

      {error && (
        <p className="text-red-600">{error}</p>
      )}

      {!loading && !error && records.length === 0 && (
        <p className="text-gray-500">
          Information will be available soon.
        </p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {records.map((record) => (
            <article
              key={record.id}
              className="bg-white border border-[#E9E5DB] rounded-xl p-6 shadow-sm"
            >
              {fields.map((field, index) =>
                record[field.name] ? (
                  <div key={field.name} className="mb-3">
                    {index === 0 ? (
                      <h3 className="text-lg font-bold text-[#41634C]">
                        {record[field.name]}
                      </h3>
                    ) : (
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        <strong>{field.label}:</strong>{" "}
                        {record[field.name]}
                      </p>
                    )}
                  </div>
                ) : null
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
