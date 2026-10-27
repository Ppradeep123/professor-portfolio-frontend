
import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
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
  Video,
  Presentation,
  Link2,
  GraduationCap,
} from "lucide-react";

const API = "http://professor-portfolio-api.onrender.come-content/";
const FILE_BASE = "http://professor-portfolio-api.onrender.com";

const CONTENT_TYPES = [
  "PDF",
  "Video",
  "PPT",
  "Document",
  "External Link",
];

const emptyForm = {
  title: "",
  subject: "",
  semester: "",
  content_type: "PDF",
  description: "",
  resource_url: "",
};

const inputClass =
  "w-full px-4 py-3 border border-[#DDE5DA] rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#54765C]/20 focus:border-[#54765C] text-sm";

const labelClass =
  "block text-sm font-semibold text-[#41634C] mb-2";

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

async function request(endpoint, options = {}) {
  const response = await fetch(API + endpoint, {
    credentials: "include",
    ...options,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

function ResourceIcon({ type, size = 20 }) {
  const icons = {
    PDF: FileText,
    Video: Video,
    PPT: Presentation,
    Document: BookOpen,
    "External Link": Link2,
  };

  const Icon = icons[type] || BookOpen;

  return <Icon size={size} />;
}

export default function EContentAdmin() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  const loadResources = useCallback(async () => {
    setLoading(true);

    try {
      const data = await request("get.php");
      setResources(
        Array.isArray(data.resources) ? data.resources : []
      );
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

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

  const editResource = (item) => {
    setEditingId(Number(item.id));

    setForm({
      title: item.title || "",
      subject: item.subject || "",
      semester: item.semester || "",
      content_type: item.content_type || "PDF",
      description: item.description || "",
      resource_url: item.resource_url || "",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const saveResource = async (event) => {
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
          ? "Resource updated."
          : "Resource added.")
      );

      resetForm();
      await loadResources();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteResource = async (id) => {
    if (!window.confirm("Delete this learning resource?")) {
      return;
    }

    setBusyId(id);
    setError("");
    setMessage("");

    try {
      const data = await request("delete.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      setMessage(data.message || "Resource deleted.");

      if (editingId === Number(id)) {
        resetForm();
      }

      await loadResources();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const uploadFile = async (id) => {
    const file = selectedFiles[id];

    if (!file) {
      setError("Select a file first.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Maximum file size is 10 MB.");
      return;
    }

    setBusyId(id);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("file", file);

      const data = await request("upload.php", {
        method: "POST",
        body: formData,
      });

      setMessage(data.message || "File uploaded.");

      setSelectedFiles((previous) => ({
        ...previous,
        [id]: null,
      }));

      await loadResources();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const removeFile = async (id) => {
    if (!window.confirm("Remove this uploaded file?")) {
      return;
    }

    setBusyId(id);
    setError("");
    setMessage("");

    try {
      const data = await request("remove_file.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      setMessage(data.message || "File removed.");
      await loadResources();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const filteredResources = resources.filter(
    (item) => filter === "All" || item.content_type === filter
  );

  const isLinkType =
    form.content_type === "Video" ||
    form.content_type === "External Link";

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
              E-Content Management
            </h1>

            <p className="text-gray-500 mt-2">
              Manage notes, presentations, documents,
              video lectures and learning resources.
            </p>
          </div>

          <button
            type="button"
            onClick={loadResources}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DCE6D9] bg-white text-[#41634C] font-semibold"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "Total Resources",
              value: resources.length,
              icon: BookOpen,
            },
            {
              title: "Uploaded Files",
              value: resources.filter((item) => item.file_path)
                .length,
              icon: FileText,
            },
            {
              title: "Learning Links",
              value: resources.filter(
                (item) =>
                  item.content_type === "Video" ||
                  item.content_type === "External Link"
              ).length,
              icon: Link2,
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
                  ? "Edit Learning Resource"
                  : "Add Learning Resource"}
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Enter the resource details below.
              </p>
            </div>
          </div>

          <form
            onSubmit={saveResource}
            className="p-6 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="md:col-span-2">
                <label className={labelClass}>
                  Resource Title *
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={updateForm}
                  className={inputClass}
                  placeholder="e.g. Introduction to Database Management Systems"
                  maxLength={255}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Subject
                </label>

                <input
                  name="subject"
                  value={form.subject}
                  onChange={updateForm}
                  className={inputClass}
                  placeholder="e.g. DBMS"
                  maxLength={255}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Semester
                </label>

                <input
                  name="semester"
                  value={form.semester}
                  onChange={updateForm}
                  className={inputClass}
                  placeholder="e.g. Semester 5"
                  maxLength={50}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Content Type *
                </label>

                <select
                  name="content_type"
                  value={form.content_type}
                  onChange={updateForm}
                  className={inputClass}
                  required
                >
                  {CONTENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Resource URL {isLinkType ? "*" : "(Optional)"}
                </label>

                <input
                  type="url"
                  name="resource_url"
                  value={form.resource_url}
                  onChange={updateForm}
                  className={inputClass}
                  placeholder="https://..."
                  required={isLinkType}
                  maxLength={1000}
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
                  placeholder="Describe the learning material..."
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
                  ? "Update Resource"
                  : "Save Resource"}
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

        {/* RESOURCE LIST */}
        <section>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
            <div>
              <h2 className="text-xl font-bold text-[#344F3C]">
                Saved Learning Resources
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {filteredResources.length} resources
              </p>
            </div>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="px-4 py-2.5 bg-white border border-[#DDE5DA] rounded-xl text-sm text-[#41634C]"
            >
              <option value="All">All Types</option>

              {CONTENT_TYPES.map((type) => (
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
              Loading resources...
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5E9E2] p-12 text-center">
              <GraduationCap
                size={36}
                className="mx-auto text-[#9CAF9C]"
              />

              <h3 className="font-bold text-[#41634C] mt-4">
                No Resources Found
              </h3>

              <p className="text-gray-500 mt-2">
                Add your first learning resource using the form above.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredResources.map((item) => {
                const fileUrl = getFileUrl(item.file_path);
                const isFileType = [
                  "PDF",
                  "PPT",
                  "Document",
                ].includes(item.content_type);

                return (
                  <article
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#E5E9E2] overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-5">
                        <div className="flex-1 min-w-0">
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#EDF3EA] text-[#54765C] rounded-full text-xs font-bold">
                            <ResourceIcon
                              type={item.content_type}
                              size={15}
                            />
                            {item.content_type}
                          </span>

                          <h3 className="text-lg font-bold text-[#344F3C] mt-4">
                            {item.title}
                          </h3>

                          <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                            {item.subject && (
                              <span>
                                Subject: {item.subject}
                              </span>
                            )}

                            {item.semester && (
                              <span>
                                Semester: {item.semester}
                              </span>
                            )}
                          </div>

                          {item.description && (
                            <p className="text-sm text-gray-600 leading-7 mt-4 whitespace-pre-line">
                              {item.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-4 mt-5">
                            {fileUrl && (
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-[#54765C] font-semibold underline"
                              >
                                <FileText size={16} />
                                View File
                              </a>
                            )}

                            {item.resource_url &&
                              /^https?:\/\//i.test(
                                item.resource_url
                              ) && (
                                <a
                                  href={item.resource_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm text-[#54765C] font-semibold underline"
                                >
                                  <ExternalLink size={16} />
                                  Open Link
                                </a>
                              )}
                          </div>
                        </div>

                        <div className="flex md:flex-col gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => editResource(item)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#EDF3EA] text-[#41634C] font-semibold text-sm"
                          >
                            <Pencil size={16} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteResource(item.id)}
                            disabled={busyId === item.id}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 font-semibold text-sm disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* FILE MANAGEMENT */}
                    {isFileType && (
                      <div className="border-t border-[#EDF0EA] bg-[#FAFBF9] p-5 md:p-6">
                        <h4 className="font-semibold text-[#41634C] text-sm mb-3">
                          File Management
                        </h4>

                        {fileUrl && (
                          <div className="flex flex-wrap gap-4 items-center mb-4">
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-semibold text-[#54765C] underline"
                            >
                              <FileText size={17} />
                              View Uploaded File
                            </a>

                            <button
                              type="button"
                              onClick={() => removeFile(item.id)}
                              disabled={busyId === item.id}
                              className="inline-flex items-center gap-2 text-sm text-red-600 font-semibold disabled:opacity-50"
                            >
                              <Trash2 size={15} />
                              Remove File
                            </button>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                          <input
                            key={`${item.id}-${item.file_path || "empty"}`}
                            type="file"
                            accept={
                              item.content_type === "PDF"
                                ? ".pdf"
                                : item.content_type === "PPT"
                                  ? ".ppt,.pptx"
                                  : ".doc,.docx"
                            }
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
                            onClick={() => uploadFile(item.id)}
                            disabled={
                              !selectedFiles[item.id] ||
                              busyId === item.id
                            }
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#41634C] text-white text-sm font-semibold disabled:opacity-50"
                          >
                            <Upload size={16} />
                            {fileUrl
                              ? "Replace File"
                              : "Upload File"}
                          </button>
                        </div>

                        <p className="text-xs text-gray-400 mt-3">
                          Maximum file size: 10 MB.
                        </p>
                      </div>
                    )}
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
