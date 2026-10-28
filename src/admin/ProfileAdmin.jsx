
import { useEffect, useState } from "react";



const API_BASE = (
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost/professor-api/"
).replace(/\/+$/, "") + "/";

const API = `${API_BASE}profile/`;

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


const initialForm = {
    full_name: "",
    designation: "",
    department: "",
    college_name: "",
    qualification: "",
    experience_years: 0,
    biography: "",
    email: "",
    phone: "",
    linkedin_url: "",
    google_scholar_url: ""
};

export default function ProfileAdmin() {
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [photo, setPhoto] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        async function loadProfile() {
            try {
                const response = await fetch(`${API}/get.php`);
                if (!response.ok) {
                    throw new Error("Unable to load profile");
                }

                const data = await response.json();

                if (data.success && data.profile) {
                    setForm({
                        ...initialForm,
                        ...Object.fromEntries(
                            Object.entries(data.profile).map(
                                ([key, value]) => [key, value ?? ""]
                            )
                        )
                    });
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {
            // Get CSRF token
            const csrfToken = await getCsrfToken();

            // Save profile
            const response = await fetch(`${API}/update.php`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Update failed");
            }

            setMessage("Profile updated successfully!");

        } catch (err) {
            setError(err.message);

        } finally {
            setSaving(false);
        }
    };



    const fields = [
        { name: "full_name", label: "Full Name", required: true },
        { name: "designation", label: "Designation" },
        { name: "department", label: "Department" },
        { name: "college_name", label: "College Name" },
        { name: "qualification", label: "Qualification" },
        { name: "experience_years", label: "Experience (Years)", type: "number" },
        { name: "email", label: "Email", type: "email" },
        { name: "phone", label: "Phone" },
        { name: "linkedin_url", label: "LinkedIn URL", type: "url" },
        { name: "google_scholar_url", label: "Google Scholar URL", type: "url" }
    ];




    const handlePhotoUpload = async () => {
        console.log("Upload button clicked");

        if (!photo) {
            alert("Please select a photo first");
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append("photo", photo);



        try {
            const csrfToken = await getCsrfToken();

            const response = await fetch(
                `${API}/upload_photo.php`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "X-CSRF-Token": csrfToken
                    },
                    body: formData
                }
            );

            const data = await response.json();


            console.log("Upload response:", data);

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Upload failed");
            }

            const photoUrl = data.photo_url;

            const apiBaseUrl = new URL(
                API_BASE,
                window.location.origin
            );

            const uploadedUrl = new URL(
                photoUrl,
                apiBaseUrl
            );

            const relativePhotoPath = uploadedUrl.href.startsWith(
                apiBaseUrl.href
            )
                ? uploadedUrl.href.slice(apiBaseUrl.href.length)
                : photoUrl;

            setForm((prev) => ({
                ...prev,
                profile_photo: relativePhotoPath
            }));

            alert("Photo uploaded successfully!");
            setPhoto(null);

        } catch (error) {
            console.error("Upload error:", error);
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <p className="p-8">Loading professor profile...</p>;
    }


    return (



        <div>
            <div className="max-w-4xl mx-auto space-y-8">

                {/* PAGE HEADER */}
                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#41634C]">
                        Manage Professor Profile
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Update the personal information, details, and photo displayed on your website.
                    </p>
                </div>

                {/* FEEDBACK ALERTS */}
                {message && (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl shadow-sm">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl shadow-sm">
                        {error}
                    </div>
                )}

                {/* PHOTO UPLOAD SECTION */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E9E5DB] p-6 md:p-8">
                    <h2 className="text-xl font-bold text-[#41634C] mb-4">
                        Profile Photo
                    </h2>

                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="flex-1 space-y-4">
                            <label className="block text-sm font-semibold text-gray-700">
                                Select New Profile Image (.jpg, .jpeg, .png, .webp)
                            </label>

                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    setPhoto(file);
                                    console.log("Selected file:", file);
                                }}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#E9EEDC] file:text-[#54765C] hover:file:bg-[#d8e0cc] border border-gray-300 rounded-lg cursor-pointer p-2"
                            />

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <span className="font-medium">
                                    {photo ? `Selected: ${photo.name}` : "No photo selected"}
                                </span>
                                <span className="text-gray-300">|</span>
                                <span>Uploading: <strong className={uploading ? "text-[#54765C]" : ""}>{uploading ? "Yes" : "No"}</strong></span>
                            </div>
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={handlePhotoUpload}
                                disabled={uploading || !photo}
                                className="w-full md:w-auto bg-[#54765C] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#405B47] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                {uploading ? "Uploading..." : "Upload Photo"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* PROFILE DETAILS FORM */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E9E5DB] p-6 md:p-8">
                    <h2 className="text-xl font-bold text-[#41634C] mb-6">
                        General Information
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {fields.map((field) => (
                                <div key={field.name} className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        {field.label}
                                    </label>

                                    <input
                                        type={field.type || "text"}
                                        name={field.name}
                                        value={form[field.name] ?? ""}
                                        onChange={handleChange}
                                        required={field.required}
                                        min={field.type === "number" ? 0 : undefined}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#54765C] focus:ring-1 focus:ring-[#54765C] transition"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Biography
                            </label>

                            <textarea
                                name="biography"
                                value={form.biography ?? ""}
                                onChange={handleChange}
                                rows={6}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#54765C] focus:ring-1 focus:ring-[#54765C] transition"
                            />
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving || (!!error && !form.full_name)}
                                className="bg-[#54765C] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#405B47] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? "Saving Changes..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}
