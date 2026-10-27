
import { useEffect, useRef, useState } from "react";


const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://professor-portfolio-api.onrender.com"
).replace(/\/+$/, "") + "/";

const API = `${API_BASE}research`;

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

const emptyForm = {
  title: "",
  research_area: "",
  description: "",
  funding_agency: "",
  start_date: "",
  end_date: "",
  status: "Ongoing"
};

export default function ResearchAdmin() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const formRef = useRef(null);


  async function loadProjects() {
    try {
      const response = await fetch(`${API}/get.php`, {
        method: "GET",
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load projects");
      }

      setProjects(data.projects || []);
    } catch (err) {
      setError(err.message || "Unable to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);


  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      research_area: item.research_area || "",
      description: item.description || "",
      funding_agency: item.funding_agency || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      status: item.status || "Ongoing"
    });

    setMessage("");

    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  async function handleSave(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(`${API}/save.php`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify({
          ...form,
          id: editingId
        })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Update failed");
      }
      setMessage(
        editingId
          ? "Research project updated successfully!"
          : "Research project added successfully!"
      );
      resetForm();
      await loadProjects();
    } catch (err) {
      setError(err.message || "Unable to save education.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this research project?")) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      // Get the CSRF token
      const csrfToken = await getCsrfToken();

      const response = await fetch(`${API}/delete.php`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify({ id })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Delete failed");
      }

      setMessage(data.message || "Qualification deleted successfully.");

      // Refresh the education list
      await loadProjects();

    } catch (err) {
      setError(err.message || "Failed to delete qualification.");
    } finally {
      setBusy(false);
    }
  }
  const fields = [
    { name: "title", label: "Project Title", required: true },
    { name: "research_area", label: "Research Area" },
    { name: "funding_agency", label: "Funding Agency" },
    { name: "start_date", label: "Start Date", type: "date" },
    { name: "end_date", label: "End Date", type: "date" }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#41634C]">
          Research Management
        </h1>
        <p className="text-gray-500 mt-2">
          Add and manage academic research projects.
        </p>
      </div>

      {error && (
        <p className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </p>
      )}

      {message && (
        <p className="bg-green-50 text-green-700 p-4 rounded-lg">
          {message}
        </p>
      )}

      <form
        ref={formRef}
        onSubmit={handleSave}
        className="bg-white border border-[#E9E5DB] rounded-2xl p-6 space-y-5"
      >
        <h2 className="text-xl font-semibold text-[#41634C]">
          {editingId ? "Edit Research Project" : "Add Research Project"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-2">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required={field.required}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#54765C]"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Project Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          >
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Proposed">Proposed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Project Description
          </label>
          <textarea
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={busy}
            className="bg-[#54765C] text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {busy ? "Saving..." : editingId ? "Update Project" : "Add Project"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="border px-6 py-3 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white border border-[#E9E5DB] rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-[#41634C] mb-5">
          Research Projects
        </h2>

        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-500">No research projects added yet.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((item) => (
              <div
                key={item.id}
                className="border rounded-xl p-5 flex flex-col md:flex-row md:justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-lg text-[#41634C]">
                    {item.title}
                  </h3>

                  <p className="text-gray-600">{item.research_area}</p>

                  <p className="text-sm mt-2">
                    Status: <strong>{item.status}</strong>
                  </p>

                  {item.funding_agency && (
                    <p className="text-sm text-gray-500">
                      Funding: {item.funding_agency}
                    </p>
                  )}

                  {item.description && (
                    <p className="mt-3 text-gray-600">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 items-start">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleEdit(item)}
                    className="px-4 py-2 rounded-lg border border-[#54765C] text-[#54765C]"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 rounded-lg bg-red-50 text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
