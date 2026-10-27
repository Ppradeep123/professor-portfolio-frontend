import { useEffect, useRef, useState } from "react";

const API_BASE = (
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost/professor-api/"
).replace(/\/+$/, "") + "/";

const API = `${API_BASE}education`;

async function getCsrfToken() {
    const response = await fetch(
        `${API_BASE}auth/session.php`,
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

const emptyForm = {
    degree: "",
    institution: "",
    specialization: "",
    start_year: "",
    end_year: "",
    description: ""
};
export default function EducationAdmin() {
    const [education, setEducation] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const formRef = useRef(null);
    async function loadEducation() {
        try {
            const response = await fetch(`${API}/get.php`);
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || "Unable to load education");
            }
            setEducation(data.education);
            setError("");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        loadEducation();
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
            degree: item.degree || "",
            institution: item.institution || "",
            specialization: item.specialization || "",
            start_year: item.start_year || "",
            end_year: item.end_year || "",
            description: item.description || ""
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
                    ? "Education updated successfully!"
                    : "Education added successfully!"
            );
            resetForm();
            await loadEducation();
        } catch (err) {
            setError(err.message || "Unable to save education.");
        } finally {
            setBusy(false);
        }
    }
    
async function handleDelete(id) {
    if (!window.confirm("Delete this qualification?")) return;

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
        await loadEducation();

    } catch (err) {
        setError(err.message || "Failed to delete qualification.");
    } finally {
        setBusy(false);
    }
}

    const fields = [
        { name: "degree", label: "Degree", required: true },
        { name: "institution", label: "Institution", required: true },
        { name: "specialization", label: "Specialization" },
        { name: "start_year", label: "Start Year", type: "number" },
        { name: "end_year", label: "End Year", type: "number" }
    ];
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-[#41634C]">
                    Education Management
                </h1>
                <p className="text-gray-500 mt-2">
                    Add, edit and manage academic qualifications.
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
            <form ref={formRef} onSubmit={handleSave}>
                <h2 className="text-xl font-semibold text-[#41634C]">
                    {editingId ? "Edit Qualification" : "Add Qualification"}
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
                                min={field.type === "number" ? 1901 : undefined}
                                max={field.type === "number" ? 2155 : undefined}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#54765C]"
                            />
                        </div>
                    ))}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        rows={4}
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#54765C]"
                    />
                </div>
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={busy}
                        className="bg-[#54765C] text-white px-6 py-3 rounded-lg disabled:opacity-50"
                    >
                        {busy ? "Please wait..." : editingId ? "Update" : "Add Education"}
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
                    Education Records
                </h2>
                {loading ? (
                    <p>Loading...</p>
                ) : education.length === 0 ? (
                    <p className="text-gray-500">No qualifications added yet.</p>
                ) : (
                    <div className="space-y-4">
                        {education.map((item) => (
                            <div
                                key={item.id}
                                className="border rounded-xl p-5 flex flex-col md:flex-row md:justify-between gap-4"
                            >
                                <div>
                                    <h3 className="font-bold text-lg text-[#41634C]">
                                        {item.degree}
                                    </h3>
                                    <p>{item.institution}</p>
                                    <p className="text-gray-500 text-sm">
                                        {item.specialization}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {item.start_year || "—"} – {item.end_year || "Present"}
                                    </p>
                                    {item.description && (
                                        <p className="mt-2 text-gray-600">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2 items-start">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        disabled={busy}
                                        className="px-4 py-2 rounded-lg border border-[#54765C] text-[#54765C]"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        disabled={busy}
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
