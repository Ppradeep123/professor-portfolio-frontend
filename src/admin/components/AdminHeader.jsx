
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = async () => {
  try {
    const response = await fetch(
      "http://localhost/professor-api/auth/logout.php",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      alert(result.message || "Logout failed. Please try again.");
      return;
    }

    // Notify all other tabs in this browser.
    localStorage.setItem(
      "admin_logged_out",
      Date.now().toString()
    );

    // Redirect the current tab.
    window.location.replace("/admin/login");
  } catch (error) {
    console.error("Logout error:", error);
    alert("Unable to log out. Please check your connection.");
  }
};

  return (
    <header className="bg-white border-b border-[#E9E5DB] px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold text-[#41634C]">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Manage your academic portfolio
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="bg-[#54765C] text-white px-5 py-2 rounded-lg hover:bg-[#405B47]"
      >
        Logout
      </button>
    </header>
  );
}
