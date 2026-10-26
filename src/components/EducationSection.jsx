import { useEffect, useState } from "react";
const API_URL = "http://localhost/professor-api/education/get.php";
export default function EducationSection() {
    const [education, setEducation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        const controller = new AbortController();
        async function fetchEducation() {
            try {
                const response = await fetch(API_URL, {
                    signal: controller.signal
                });
                if (!response.ok) {
                    throw new Error("Unable to load education");
                }
                const data = await response.json();
                if (!data.success || !Array.isArray(data.education)) {
                    throw new Error("Invalid education response");
                }
                setEducation(data.education);
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
        fetchEducation();
        return () => controller.abort();
    }, []);
    return (
        <section className="py-16 bg-[#F8F7F2]">
            <div className="max-w-5xl mx-auto px-6">
                {loading && (
                    <p className="text-center text-gray-500">
                        Loading education...
                    </p>
                )}
                {error && (
                    <p className="text-center text-red-600">
                        {error}
                    </p>
                )}
                {!loading && !error && education.length === 0 && (
                    <p className="text-center text-gray-500">
                        Education details will be available soon.
                    </p>
                )}
                {!loading && !error && education.length > 0 && (
                    <div className="relative border-l-2 border-[#C6D5C8] ml-3 md:ml-6 space-y-8">
                        {education.map((item) => (
                            <div key={item.id} className="relative pl-8 md:pl-12">
                                {/* Timeline dot */}
                                <div className="absolute -left-[9px] top-7 w-4 h-4 rounded-full bg-[#54765C] border-4 border-[#F8F7F2]" />
                                <div className="bg-white border border-[#E9E5DB] rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-bold text-[#41634C]">
                                                {item.degree}
                                            </h3>
                                            <p className="mt-2 font-medium text-gray-700">
                                                {item.institution}
                                            </p>
                                        </div>
                                        <span className="self-start bg-[#EEF3ED] text-[#41634C] px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap">
                                            {item.start_year || "—"} – {item.end_year || "Present"}
                                        </span>
                                    </div>
                                    {item.specialization && (
                                        <p className="mt-4 text-[#54765C] font-medium">
                                            {item.specialization}
                                        </p>
                                    )}
                                    {item.description && (
                                        <p className="mt-4 text-gray-600 leading-relaxed whitespace-pre-line">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
