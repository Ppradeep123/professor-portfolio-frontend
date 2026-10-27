
import { useState } from "react";
import { LockKeyhole, Eye, EyeOff, ShieldCheck } from "lucide-react";

const API_BASE = (
    import.meta.env.VITE_API_BASE_URL ||
    "http://professor-portfolio-api.onrender.com"
).replace(/\/+$/, "");

export default function SettingsAdmin() {
    const [form, setForm] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [visible, setVisible] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const toggleVisibility = (name) => {
        setVisible((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (form.new_password !== form.confirm_password) {
            setError("New passwords do not match.");
            return;
        }

        if (
            form.new_password.length < 4 ||
            form.new_password.length > 72
        ) {
            setError("New password must contain 4 to 72 characters.");
            return;
        }

        setLoading(true);

        try {
            // Step 1: Get the existing session's CSRF token
            const sessionResponse = await fetch(
                `${API_BASE}/auth/session.php`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const session = await sessionResponse.json();

            if (
                !sessionResponse.ok ||
                !session.authenticated ||
                !session.csrf_token
            ) {
                throw new Error(
                    "Session expired or CSRF token unavailable. Please log in again."
                );
            }

            // Step 2: Send the password-change request with the token
            const response = await fetch(
                `${API_BASE}/auth/change_password.php`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-Token": session.csrf_token,
                    },
                    body: JSON.stringify(form),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Unable to change password."
                );
            }

            setMessage("Password changed successfully.");

            setForm({
                current_password: "",
                new_password: "",
                confirm_password: "",
            });
        } catch (err) {
            setError(err.message || "Unable to change password.");
        } finally {
            setLoading(false);
        }
    };


    const fields = [
        {
            name: "current_password",
            label: "Current Password",
            placeholder: "Enter your current password",
        },
        {
            name: "new_password",
            label: "New Password",
            placeholder: "Enter your new password",
        },
        {
            name: "confirm_password",
            label: "Confirm New Password",
            placeholder: "Re-enter your new password",
        },
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            <div>
                <h1 className="text-2xl font-bold text-[#41634C]">
                    Account Settings
                </h1>
                <p className="text-gray-500 mt-2">
                    Manage your administrator account security.
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E9E5DB] overflow-hidden">

                <div className="flex items-center gap-4 p-6 border-b border-[#E9E5DB]">
                    <div className="bg-[#E9EEDC] p-3 rounded-xl text-[#54765C]">
                        <LockKeyhole size={24} />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-[#41634C]">
                            Change Password
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Keep your admin account secure.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {message && (
                        <div role="status" className="bg-green-50 text-green-700 rounded-xl p-4 text-sm">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div role="alert" className="bg-red-50 text-red-700 rounded-xl p-4 text-sm">
                            {error}
                        </div>
                    )}

                    {fields.map((field) => (
                        <div key={field.name}>
                            <label
                                htmlFor={field.name}
                                className="block font-semibold text-[#343C32] text-sm mb-2"
                            >
                                {field.label}
                            </label>

                            <div className="relative">
                                <input
                                    id={field.name}
                                    type={visible[field.name] ? "text" : "password"}
                                    name={field.name}
                                    value={form[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    required
                                    minLength={field.name === "current_password" ? undefined : 4}
                                    autoComplete={
                                        field.name === "current_password"
                                            ? "current-password"
                                            : "new-password"
                                    }
                                    className="w-full px-4 py-3 pr-12 border border-[#E2E4DC] rounded-xl outline-none focus:border-[#54765C] transition"
                                />

                                <button
                                    type="button"
                                    onClick={() => toggleVisibility(field.name)}
                                    aria-label={visible[field.name] ? "Hide password" : "Show password"}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#54765C]"
                                >
                                    {visible[field.name] ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="flex items-start gap-3 bg-[#F3F0E8] rounded-xl p-4">
                        <ShieldCheck
                            size={21}
                            className="text-[#54765C] shrink-0 mt-0.5"
                        />
                        <p className="text-sm text-[#61685D]">
                            Use a unique password with at least 4 characters.
                            Avoid using your name or easily guessed information.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#54765C] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#41634C] transition disabled:opacity-60"
                    >
                        {loading ? "Updating Password..." : "Update Password"}
                    </button>

                </form>
            </div>
        </div>
    );
}
