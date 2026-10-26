
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

 
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      "http://localhost/professor-api/auth/login.php",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      window.location.href = "/admin/dashboard";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (error) {
    alert("Unable to connect to the server");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F2] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#54765C]">
             Admin
          </h1>
          <p className="mt-2 text-gray-500">
            Sign in to manage your website
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#54765C]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 outline-none focus:border-[#54765C]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#54765C]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#54765C] py-3 font-semibold text-white transition hover:bg-[#405B47]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-[#54765C] hover:underline">
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}
