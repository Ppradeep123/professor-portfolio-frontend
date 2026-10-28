
import { useCallback, useEffect, useState } from "react";
import {
  Trophy,
  Plus,
  Pencil,
  Trash2,
  Upload,
  FileText,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Award,
  CalendarDays,
  Building2,
  Medal,
} from "lucide-react";
const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost/professor-api/"
).replace(/\/+$/, "") + "/";

const API = `${API_BASE}achievements/`;
const FILE_BASE = API_BASE;

async function getCsrfToken() {
  const response = await fetch(
    `${API_BASE}auth/session.php`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Session expired. Please log in again.");
  }

  const data = await response.json();

  if (!data.authenticated || !data.csrf_token) {
    throw new Error("CSRF token not available.");
  }

  return data.csrf_token;
}

const ACHIEVEMENT_TYPES = [
  "Award",
  "Honor",
  "Recognition",
  "Certification",
  "Other",
];

const emptyForm = {
  title: "",
  achievement_type: "Award",
  organization: "",
  achievement_date: "",
  description: "",
};

const inputClass =
  "w-full px-4 py-3 border border-[#DDE5DA] rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#54765C]/20 focus:border-[#54765C] text-sm";

const labelClass =
  "block text-sm font-semibold text-[#41634C] mb-2";

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

function formatDate(value) {
  if (!value) return "";

  const parts = value.split("-");

  if (parts.length !== 3) return value;

  const date = new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2])
  );

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}


async function request(endpoint, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = new Headers(options.headers || {});

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrfToken = await getCsrfToken();
    headers.set("X-CSRF-Token", csrfToken);
  }

  const response = await fetch(API + endpoint, {
    ...options,
    method,
    headers,
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok || data.success !== true) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}


export default function AchievementsAdmin() {
  const [achievements, setAchievements] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  const loadAchievements = useCallback(async () => {
    setLoading(true);

    try {
      const data = await request("get.php");

      setAchievements(
        Array.isArray(data.achievements)
          ? data.achievements
          : []
      );

      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  const updateForm = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const editAchievement = (item) => {
    setEditingId(Number(item.id));

    setForm({
      title: item.title || "",
      achievement_type: item.achievement_type || "Award",
      organization: item.organization || "",
      achievement_date: item.achievement_date || "",
      description: item.description || "",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const saveAchievement = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const data = await request("save.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          id: editingId,
        }),
      });

      setMessage(
        data.message ||
        (editingId
          ? "Achievement updated."
          : "Achievement added.")
      );

      resetForm();
      await loadAchievements();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteAchievement = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this achievement?"
      )
    ) {
      return;
    }

    setBusyId(id);
    setMessage("");
    setError("");

    try {
      const data = await request("delete.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      setMessage(data.message || "Achievement deleted.");

      if (editingId === Number(id)) {
        resetForm();
      }

      await loadAchievements();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const uploadCertificate = async (id) => {
    const file = selectedFiles[id];

    if (!file) {
      setError("Please select a certificate first.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Maximum certificate size is 5 MB.");
      return;
    }

    setBusyId(id);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("certificate", file);

      const data = await request("upload_certificate.php", {
        method: "POST",
        body: formData,
      });

      setMessage(
        data.message || "Certificate uploaded successfully."
      );

      setSelectedFiles((previous) => ({
        ...previous,
        [id]: null,
      }));

      await loadAchievements();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const removeCertificate = async (id) => {
    if (
      !window.confirm(
        "Remove the certificate from this achievement?"
      )
    ) {
      return;
    }

    setBusyId(id);
    setMessage("");
    setError("");

    try {
      const data = await request("remove_certificate.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      setMessage(data.message || "Certificate removed.");
      await loadAchievements();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const filteredAchievements = achievements.filter(
    (item) =>
      filter === "All" ||
      item.achievement_type === filter
  );

  const totalCertificates = achievements.filter(
    (item) => item.certificate_file
  ).length;

  return (
    <div className="min-h-full bg-[#F8F7F2] p-5 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-[#829786]">
              Academic Portfolio
            </p>

            <h1 className="text-2xl md:text-3xl font-bold text-[#344F3C] mt-2">
              Achievements & Awards
            </h1>

            <p className="text-gray-500 mt-2">
              Manage awards, honors, recognitions,
              certifications and achievements.
            </p>
          </div>

          <button
            type="button"
            onClick={loadAchievements}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DCE6D9] bg-white text-[#41634C] font-semibold"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "Total Achievements",
              value: achievements.length,
              icon: Trophy,
            },
            {
              title: "Awards & Honors",
              value: achievements.filter(
                (item) =>
                  item.achievement_type === "Award" ||
                  item.achievement_type === "Honor"
              ).length,
              icon: Medal,
            },
            {
              title: "Certificates",
              value: totalCertificates,
              icon: FileText,
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="bg-white rounded-2xl border border-[#E5E9E2] p-5 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EDF3EA] text-[#54765C] flex items-center justify-center">
                  <Icon size={22} />
                </div>

                <div>
                  <p className="text-2xl font-bold text-[#344F3C]">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* MESSAGES */}
        {message && (
          <div
            role="status"
            className="flex gap-3 items-center p-4 rounded-xl bg-green-50 border border-green-200 text-green-800"
          >
            <CheckCircle2 size={20} />
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex gap-3 items-center p-4 rounded-xl bg-red-50 border border-red-200 text-red-700"
          >
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* ADD / EDIT FORM */}
        <section className="bg-white rounded-2xl border border-[#E5E9E2] overflow-hidden">
          <div className="bg-[#EDF3EA] p-6 flex items-center gap-3">
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-[#54765C]">
              {editingId ? (
                <Pencil size={21} />
              ) : (
                <Plus size={21} />
              )}
            </div>

            <div>
              <h2 className="font-bold text-lg text-[#344F3C]">
                {editingId
                  ? "Edit Achievement"
                  : "Add New Achievement"}
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Enter the award or achievement details.
              </p>
            </div>
          </div>

          <form
            onSubmit={saveAchievement}
            className="p-6 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="md:col-span-2">
                <label className={labelClass}>
                  Achievement Title *
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={updateForm}
                  className={inputClass}
                  placeholder="e.g. Best Teacher Award"
                  maxLength={255}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Achievement Type *
                </label>

                <select
                  name="achievement_type"
                  value={form.achievement_type}
                  onChange={updateForm}
                  className={inputClass}
                  required
                >
                  {ACHIEVEMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Organization / Institution
                </label>

                <input
                  name="organization"
                  value={form.organization}
                  onChange={updateForm}
                  className={inputClass}
                  placeholder="e.g. University of Mumbai"
                  maxLength={255}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>
                  Achievement Date
                </label>

                <input
                  type="date"
                  name="achievement_date"
                  value={form.achievement_date}
                  onChange={updateForm}
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateForm}
                  className={inputClass}
                  rows={4}
                  placeholder="Describe the achievement..."
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-7">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#41634C] text-white font-semibold hover:bg-[#304C39] disabled:opacity-60"
              >
                {saving ? (
                  <RefreshCw
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Plus size={18} />
                )}

                {editingId
                  ? "Update Achievement"
                  : "Save Achievement"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold"
                >
                  <X size={18} />
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ACHIEVEMENTS LIST */}
        <section>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
            <div>
              <h2 className="text-xl font-bold text-[#344F3C]">
                Saved Achievements
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {filteredAchievements.length} achievements
              </p>
            </div>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="px-4 py-2.5 bg-white border border-[#DDE5DA] rounded-xl text-sm text-[#41634C]"
            >
              <option value="All">All Types</option>

              {ACHIEVEMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-14 text-gray-500">
              <RefreshCw
                size={20}
                className="animate-spin"
              />
              Loading achievements...
            </div>
          ) : filteredAchievements.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5E9E2] p-12 text-center">
              <Award
                size={36}
                className="mx-auto text-[#9CAF9C]"
              />

              <h3 className="font-bold text-[#41634C] mt-4">
                No Achievements Found
              </h3>

              <p className="text-gray-500 mt-2">
                Add your first achievement using the form above.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredAchievements.map((item) => {
                const certificateUrl = getCertificateUrl(
                  item.certificate_file
                );

                return (
                  <article
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#E5E9E2] overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-5">
                        <div className="flex-1 min-w-0">
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#EDF3EA] text-[#54765C] rounded-full text-xs font-bold">
                            <Trophy size={15} />
                            {item.achievement_type}
                          </span>

                          <h3 className="text-lg font-bold text-[#344F3C] mt-4">
                            {item.title}
                          </h3>

                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                            {item.organization && (
                              <span className="inline-flex items-center gap-2">
                                <Building2 size={15} />
                                {item.organization}
                              </span>
                            )}

                            {item.achievement_date && (
                              <span className="inline-flex items-center gap-2">
                                <CalendarDays size={15} />
                                {formatDate(item.achievement_date)}
                              </span>
                            )}
                          </div>

                          {item.description && (
                            <p className="text-sm text-gray-600 leading-7 mt-4 whitespace-pre-line">
                              {item.description}
                            </p>
                          )}

                          {certificateUrl && (
                            <a
                              href={certificateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 mt-5 text-sm text-[#54765C] font-semibold underline"
                            >
                              <ExternalLink size={16} />
                              View Certificate
                            </a>
                          )}
                        </div>

                        <div className="flex md:flex-col gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => editAchievement(item)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#EDF3EA] text-[#41634C] font-semibold text-sm"
                          >
                            <Pencil size={16} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteAchievement(item.id)}
                            disabled={busyId === item.id}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 font-semibold text-sm disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* CERTIFICATE MANAGEMENT */}
                    <div className="border-t border-[#EDF0EA] bg-[#FAFBF9] p-5 md:p-6">
                      <h4 className="font-semibold text-[#41634C] text-sm mb-3">
                        Certificate Management
                      </h4>

                      {certificateUrl && (
                        <div className="flex flex-wrap gap-4 items-center mb-4">
                          <a
                            href={certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#54765C] underline"
                          >
                            <FileText size={17} />
                            View Uploaded Certificate
                          </a>

                          <button
                            type="button"
                            onClick={() => removeCertificate(item.id)}
                            disabled={busyId === item.id}
                            className="inline-flex items-center gap-2 text-sm text-red-600 font-semibold disabled:opacity-50"
                          >
                            <Trash2 size={15} />
                            Remove Certificate
                          </button>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                        <input
                          key={`${item.id}-${item.certificate_file || "empty"}`}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.webp"
                          onChange={(event) =>
                            setSelectedFiles((previous) => ({
                              ...previous,
                              [item.id]:
                                event.target.files?.[0] || null,
                            }))
                          }
                          className="block w-full max-w-md text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#EDF3EA] file:px-4 file:py-2 file:text-[#41634C] file:font-semibold"
                        />

                        <button
                          type="button"
                          onClick={() => uploadCertificate(item.id)}
                          disabled={
                            !selectedFiles[item.id] ||
                            busyId === item.id
                          }
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#41634C] text-white text-sm font-semibold disabled:opacity-50"
                        >
                          <Upload size={16} />
                          {certificateUrl
                            ? "Replace Certificate"
                            : "Upload Certificate"}
                        </button>
                      </div>

                      <p className="text-xs text-gray-400 mt-3">
                        Supported: PDF, JPG, PNG, WebP.
                        Maximum size: 5 MB.
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
