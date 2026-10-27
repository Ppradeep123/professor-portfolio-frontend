
import { useEffect, useRef, useState } from "react";

const API = "http://professor-portfolio-api.onrender.comteaching/manage.php";

export default function TeachingModule({
  module,
  title,
  fields
}) {
  const makeEmpty = () =>
    Object.fromEntries(fields.map((field) => [
      field.name,
      field.options ? field.options[0] : ""
    ]));

  const [form, setForm] = useState(makeEmpty);
  const [records, setRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const formRef = useRef(null);

  async function loadRecords() {
    try {
      const response = await fetch(
        `${API}?module=${encodeURIComponent(module)}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load records");
      }

      setRecords(data.records);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    setRecords([]);
    setForm(makeEmpty());
    setEditingId(null);
    setError("");
    setMessage("");
    loadRecords();
  }, [module]);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  function resetForm() {
    setForm(makeEmpty());
    setEditingId(null);
  }

  function handleEdit(record) {
    const values = {};

    fields.forEach((field) => {
      values[field.name] = record[field.name] || "";
    });

    setForm(values);
    setEditingId(record.id);
    setMessage("");

    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  async function sendRequest(payload) {
    const response = await fetch(
      `${API}?module=${encodeURIComponent(module)}`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  async function handleSave(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const data = await sendRequest({
        action: "save",
        id: editingId,
        ...form
      });

      setMessage(data.message);
      resetForm();
      await loadRecords();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this record?")) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const data = await sendRequest({
        action: "delete",
        id
      });

      setMessage(data.message);

      if (editingId === id) resetForm();

      await loadRecords();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-7">
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
          {editingId ? `Edit ${title}` : `Add ${title}`}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fields.map((field) => (
            <div
              key={field.name}
              className={field.type === "textarea" ? "md:col-span-2" : ""}
            >
              <label className="block text-sm font-medium mb-2">
                {field.label}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  rows={4}
                  required={field.required}
                  className="w-full border rounded-lg px-4 py-3"
                />
              ) : field.options ? (
                <select
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full border rounded-lg px-4 py-3"
                >
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full border rounded-lg px-4 py-3"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={busy}
            className="bg-[#54765C] text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {busy ? "Saving..." : editingId ? "Update" : "Add Record"}
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
          {title} Records ({records.length})
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : records.length === 0 ? (
          <p className="text-gray-500">No records added yet.</p>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="border rounded-xl p-5 flex flex-col md:flex-row justify-between gap-4"
              >
                <div className="space-y-2 min-w-0">
                  {fields.map((field) =>
                    record[field.name] ? (
                      <p key={field.name} className="text-sm text-gray-600 break-words">
                        <strong>{field.label}:</strong>{" "}
                        {record[field.name]}
                      </p>
                    ) : null
                  )}
                </div>

                <div className="flex gap-2 items-start">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleEdit(record)}
                    className="border border-[#54765C] text-[#54765C] px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleDelete(record.id)}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg"
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
