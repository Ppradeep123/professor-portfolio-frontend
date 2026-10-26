
import React, { useEffect, useState } from "react";
import {
    getPublications,
    savePublication,
    deletePublication,
} from "../hooks/publicationService";

const emptyForm = {
    title: "",
    authors: "",
    publication_type: "Journal",
    journal_name: "",
    publisher: "",
    publication_year: "",
    volume: "",
    issue: "",
    pages: "",
    doi: "",
    publication_url: "",
    description: "",
};

export default function PublicationsAdmin() {
    const [publications, setPublications] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const loadPublications = async () => {
        try {
            setError("");
            const data = await getPublications();
            setPublications(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPublications();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = (publication) => {
        setEditingId(publication.id);

        setForm({
            title: publication.title ?? "",
            authors: publication.authors ?? "",
            publication_type:
                publication.publication_type ?? "Journal",
            journal_name: publication.journal_name ?? "",
            publisher: publication.publisher ?? "",
            publication_year:
                publication.publication_year ?? "",
            volume: publication.volume ?? "",
            issue: publication.issue ?? "",
            pages: publication.pages ?? "",
            doi: publication.doi ?? "",
            publication_url:
                publication.publication_url ?? "",
            description: publication.description ?? "",
        });

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm({ ...emptyForm });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {
            const payload = {
                ...form,
                publication_year:
                    form.publication_year === ""
                        ? null
                        : Number(form.publication_year),
            };

            if (editingId !== null) {
                payload.id = editingId;
            }

            const result = await savePublication(payload);

            setMessage(result.message);
            setEditingId(null);
            setForm({ ...emptyForm });

            await loadPublications();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const inputClass =
        "w-full px-4 py-3 border border-[#E9E5DB] rounded-xl bg-[#FAF9F6] outline-none focus:ring-2 focus:ring-[#54765C]";

    const fields = [
        { name: "title", label: "Publication Title", required: true },
        { name: "authors", label: "Authors" },
        { name: "journal_name", label: "Journal / Conference Name" },
        { name: "publisher", label: "Publisher" },
        { name: "volume", label: "Volume" },
        { name: "issue", label: "Issue" },
        { name: "pages", label: "Pages" },
        { name: "doi", label: "DOI" },
        { name: "publication_url", label: "Publication URL" },
    ];

    const handleDelete = async (publication) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${publication.title}"?\n\nThis action cannot be undone.`
        );

        if (!confirmed) return;

        setDeletingId(publication.id);
        setMessage("");
        setError("");

        try {
            const result = await deletePublication(publication.id);

            // Remove the deleted record immediately
            setPublications((prev) =>
                prev.filter((item) => item.id !== publication.id)
            );

            // Reset form if deleting the publication being edited
            if (String(editingId) === String(publication.id)) {
                setEditingId(null);
                setForm({ ...emptyForm });
            }

            setMessage(result.message || "Publication deleted successfully.");

            // Reload the latest records from MySQL
            await loadPublications();
        } catch (err) {
            setError(err.message || "Unable to delete publication.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF9F6] p-5 md:p-8">

            <div className="max-w-6xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#41634C]">
                        Manage Publications
                    </h1>

                    <p className="text-[#8A806F] mt-2">
                        Add and update research publications.
                    </p>
                </div>

                {message && (
                    <div
                        role="status"
                        className="bg-green-50 text-green-800 p-4 rounded-xl mb-5"
                    >
                        {message}
                    </div>
                )}

                {error && (
                    <div
                        role="alert"
                        className="bg-red-50 text-red-700 p-4 rounded-xl mb-5"
                    >
                        {error}
                    </div>
                )}

                {/* PUBLICATION FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-[#E9E5DB] rounded-2xl p-6 mb-10"
                >
                    <h2 className="text-xl font-bold text-[#41634C] mb-6">
                        {editingId !== null
                            ? "Edit Publication"
                            : "Add New Publication"}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-5">

                        {fields.map((field) => (
                            <div key={field.name}>
                                <label className="block text-sm font-medium mb-2">
                                    {field.label}
                                </label>

                                <input
                                    type="text"
                                    name={field.name}
                                    value={form[field.name]}
                                    onChange={handleChange}
                                    required={field.required || false}
                                    className={inputClass}
                                />
                            </div>
                        ))}

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Publication Type
                            </label>

                            <select
                                name="publication_type"
                                value={form.publication_type}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                {[
                                    "Journal",
                                    "Conference",
                                    "Book",
                                    "Book Chapter",
                                    "Other",
                                ].map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Publication Year
                            </label>

                            <input
                                type="number"
                                name="publication_year"
                                min="1900"
                                max="2155"
                                value={form.publication_year}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={4}
                                className={inputClass}
                            />
                        </div>

                    </div>

                    <div className="flex flex-wrap gap-3 mt-7">

                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-[#54765C] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#405C47] disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : editingId !== null
                                    ? "Update Publication"
                                    : "Save Publication"}
                        </button>

                        {editingId !== null && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="border border-[#E9E5DB] px-7 py-3 rounded-xl"
                            >
                                Cancel
                            </button>
                        )}

                    </div>
                </form>

                {/* PUBLICATION LIST */}
                <div className="bg-white border border-[#E9E5DB] rounded-2xl p-6">

                    <h2 className="text-xl font-bold text-[#41634C] mb-6">
                        Publication Records ({publications.length})
                    </h2>

                    {loading ? (
                        <p>Loading publications...</p>
                    ) : publications.length === 0 ? (
                        <p className="text-gray-500">
                            No publications added yet.
                        </p>
                    ) : (
                        <div className="space-y-4">

                            {publications.map((publication) => (
                                <div
                                    key={publication.id}
                                    className="border border-[#E9E5DB] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5"
                                >

                                    <div>
                                        <h3 className="font-bold text-lg">
                                            {publication.title}
                                        </h3>

                                        <p className="text-sm text-[#8A806F] mt-2">
                                            {publication.authors}
                                        </p>

                                        <p className="text-sm text-[#54765C] mt-2">
                                            {publication.publication_type}
                                            {" • "}
                                            {publication.publication_year || "Year not specified"}
                                        </p>
                                    </div>


                                    <div className="flex items-center gap-3">

                                        {/* EDIT BUTTON */}
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(publication)}
                                            disabled={deletingId !== null}
                                            className="bg-[#E9EEDC] text-[#41634C] px-5 py-2.5 rounded-lg font-semibold hover:bg-[#DDE6D4] disabled:opacity-50"
                                        >
                                            Edit
                                        </button>

                                        {/* DELETE BUTTON */}
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(publication)}
                                            disabled={deletingId !== null}
                                            className="bg-red-50 text-red-600 border border-red-200 px-5 py-2.5 rounded-lg font-semibold hover:bg-red-100 disabled:opacity-50"
                                        >
                                            {deletingId === publication.id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>

                                    </div>


                                </div>
                            ))}

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}
