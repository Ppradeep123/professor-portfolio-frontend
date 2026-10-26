
import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  Upload,
  FileText,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Award,
  MapPin,
  Building2,
} from "lucide-react";

const API = "http://localhost/professor-api/academic-activities/";
const FILE_BASE = "http://localhost/professor-api/";
async function getCsrfToken() {
    const response = await fetch(
        "http://localhost/professor-api/auth/session.php",
        {
            method: "GET",
            credentials: "include"
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
const TYPES = [
  "Workshop",
  "Seminar",
  "Conference",
  "FDP",
  "Webinar",
  "Guest Lecture",
  "Training",
  "Other",
];

const emptyForm = {
  title: "",
  activity_type: "Workshop",
  organizer: "",
  venue: "",
  participation_role: "",
  start_date: "",
  end_date: "",
  description: "",
};

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

export default function AcademicActivitiesAdmin() {
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const formRef = useRef(null);

  const loadActivities = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await request("get.php");
      setActivities(data.activities || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

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

  const editActivity = (item) => {
    setEditingId(item.id);

    setForm({
      title: item.title || "",
      activity_type: item.activity_type || "Workshop",
      organizer: item.organizer || "",
      venue: item.venue || "",
      participation_role: item.participation_role || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      description: item.description || "",
    });

    setMessage("");
    setError("");

    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const saveActivity = async (event) => {
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

      setMessage(data.message);
      resetForm();
      await loadActivities();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteActivity = async (id) => {
    if (!window.confirm("Delete this academic activity?")) {
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

      setMessage(data.message);

      if (editingId === id) {
        resetForm();
      }

      await loadActivities();
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

      setMessage(data.message);

      setSelectedFiles((previous) => ({
        ...previous,
        [id]: null,
      }));

      await loadActivities();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const removeCertificate = async (id) => {
    if (!window.confirm("Remove this certificate?")) {
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

      setMessage(data.message);
      await loadActivities();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-[#DDE5DA] rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#54765C]/20 focus:border-[#54765C] text-sm";

  const labelClass =
    "block text-sm font-semibold text-[#41634C] mb-2";

  return (
    <div className="min-h-full bg-[#F8F7F2] p-5 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* PAGE HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#829786]">
              Academic Portfolio
            </p>

            <h1 className="text-2xl md:text-3xl font-bold text-[#344F3C] mt-2">
              Academic Activities
            </h1>

            <p className="text-gray-500 mt-2">
              Manage workshops, seminars, conferences, FDPs and certificates.
            </p>
          </div>

          <button
            type="button"
            onClick={loadActivities}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DCE6D9] bg-white text-[#41634C] font-medium"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* MESSAGES */}
        {message && (
          <div
            role="status"
            className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800"
          >
            <CheckCircle2 size={19} />
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700"
          >
            <AlertCircle size={19} />
            {error}
          </div>
        )}

        {/* ADD / EDIT FORM */}
        <section
          ref={formRef}
          className="scroll-mt-24 bg-white rounded-2xl border border-[#E5E9E2] shadow-sm overflow-hidden"
        >
          <div className="bg-[#EDF3EA] px-6 py-5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-[#54765C]">
              {editingId ? <Pencil size={21} /> : <Plus size={21} />}
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#344F3C]">
                {editingId ? "Edit Academic Activity" : "Add Academic Activity"}
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Enter the activity details below
              </p>
            </div>
          </div>

          <form onSubmit={saveActivity} className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="md:col-span-2">
                <label className={labelClass}>
                  Activity Title *
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={updateForm}
                  className={inputClass}
                  placeholder="e.g. National Workshop on Artificial Intelligence"
                  required
                  maxLength={255}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Activity Type *
                </label>

                <select
                  name="activity_type"
                  value={form.activity_type}
                  onChange={updateForm}
                  className={inputClass}
                  required
                >
                  {TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Participation Role
                </label>

                <input
                  name="participation_role"
                  value={form.participation_role}
                  onChange={updateForm}
                  className={inputClass}
                  placeholder="Participant / Organizer / Speaker"
                  maxLength={100}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Organizer
                </label>

                <input
                  name="organizer"
                  value={form.organizer}
                  onChange={updateForm}
                  className={inputClass}
                  placeholder="Organizing institution"
                  maxLength={255}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Venue
                </label>

                <input
                  name="venue"
                  value={form.venue}
                  onChange={updateForm}
                  className={inputClass}
                  placeholder="College / City / Online"
                  maxLength={255}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Start Date
                </label>

                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={updateForm}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  End Date
                </label>

                <input
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={updateForm}
                  min={form.start_date || undefined}
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
                  placeholder="Describe the activity, learning outcomes or contributions..."
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
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <Plus size={18} />
                )}

                {editingId ? "Update Activity" : "Save Activity"}
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

        {/* ACTIVITIES LIST */}
        <section>
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-bold text-[#344F3C]">
                Saved Activities
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {activities.length} academic activities
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center gap-3 py-14 text-gray-500">
              <RefreshCw size={20} className="animate-spin" />
              Loading activities...
            </div>
          ) : activities.length === 0 ? (
            <div className="bg-white border border-[#E5E9E2] rounded-2xl p-12 text-center">
              <Award
                size={36}
                className="mx-auto text-[#9CAF9C]"
              />

              <h3 className="font-bold text-[#41634C] mt-4">
                No Activities Added
              </h3>

              <p className="text-gray-500 mt-2">
                Add your first academic activity using the form above.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {activities.map((item) => (
                <article
                  key={item.id}
                  className="bg-white border border-[#E5E9E2] rounded-2xl overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-5">
                      <div className="flex-1">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#EDF3EA] text-[#54765C] rounded-full text-xs font-bold">
                          <CalendarDays size={14} />
                          {item.activity_type}
                        </span>

                        <h3 className="text-lg font-bold text-[#344F3C] mt-4">
                          {item.title}
                        </h3>

                        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-gray-600">
                          {item.organizer && (
                            <span className="flex items-center gap-2">
                              <Building2 size={15} />
                              {item.organizer}
                            </span>
                          )}

                          {item.venue && (
                            <span className="flex items-center gap-2">
                              <MapPin size={15} />
                              {item.venue}
                            </span>
                          )}

                          {item.start_date && (
                            <span className="flex items-center gap-2">
                              <CalendarDays size={15} />
                              {item.start_date}
                              {item.end_date &&
                                item.end_date !== item.start_date &&
                                ` to ${item.end_date}`}
                            </span>
                          )}
                        </div>

                        {item.participation_role && (
                          <p className="text-sm mt-3 text-[#54765C] font-medium">
                            Role: {item.participation_role}
                          </p>
                        )}

                        {item.description && (
                          <p className="text-sm text-gray-600 leading-7 mt-4 whitespace-pre-line">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="flex md:flex-col gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => editActivity(item)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#EDF3EA] text-[#41634C] font-semibold text-sm"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteActivity(item.id)}
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

                    {item.certificate_file && (
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <a
                          href={FILE_BASE + item.certificate_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-[#54765C] font-semibold underline"
                        >
                          <FileText size={17} />
                          View Certificate
                        </a>

                        <button
                          type="button"
                          onClick={() => removeCertificate(item.id)}
                          disabled={busyId === item.id}
                          className="inline-flex items-center gap-1 text-sm text-red-600 font-medium disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(event) => {
                          setSelectedFiles((previous) => ({
                            ...previous,
                            [item.id]: event.target.files?.[0] || null,
                          }));
                        }}
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
                        {item.certificate_file
                          ? "Replace Certificate"
                          : "Upload Certificate"}
                      </button>
                    </div>

                    <p className="text-xs text-gray-400 mt-3">
                      PDF, JPG or PNG. Maximum 10 MB.
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
