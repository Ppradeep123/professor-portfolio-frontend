
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Bell, Mail, ArrowRight } from "lucide-react";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://professor-portfolio-api.onrender.com"
).replace(/\/+$/, "");

const stats = [
  {
    title: "Publications",
    key: "publications",
    icon: "📚",
    path: "/admin/publications",
  },
  {
    title: "Research Projects",
    key: "research",
    icon: "🔬",
    path: "/admin/research",
  },
  {
    title: "Gallery Photos",
    key: "gallery",
    icon: "🖼️",
    path: "/admin/gallery",
  },
  {
    title: "Certificates",
    key: "certificates",
    icon: "🏆",
    path: "/admin/achievements",
  },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    publications: 0,
    research: 0,
    gallery: 0,
    certificates: 0,
  });

  const [unreadCount, setUnreadCount] = useState(0);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inquiryError, setInquiryError] = useState("");

  // Existing dashboard statistics
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/dashboard/stats.php`,
          { credentials: "include" }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setCounts(data.stats || {});
        }
      } catch (error) {
        console.error("Dashboard statistics error:", error);
      }
    };

    loadStats();
  }, []);

  // Fetch unread count and recent inquiries
  const loadNotifications = useCallback(async () => {
    try {
      setInquiryError("");

      const [countResponse, inquiriesResponse] = await Promise.all([
        fetch(`${API_BASE}/contact/unread_count.php`, {
          credentials: "include",
        }),
        fetch(`${API_BASE}/contact/get.php`, {
          credentials: "include",
        }),
      ]);

      const countData = await countResponse.json();
      const inquiriesData = await inquiriesResponse.json();

      if (
        !countResponse.ok ||
        !countData.success ||
        !inquiriesResponse.ok ||
        !inquiriesData.success
      ) {
        throw new Error("Unable to load inquiry notifications.");
      }

      setUnreadCount(Number(countData.unread_count) || 0);

      const recent = (inquiriesData.inquiries || [])
        .filter((item) => Number(item.is_read) === 0)
        .slice(0, 3);

      setRecentInquiries(recent);
    } catch (error) {
      setInquiryError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    // Refresh every 30 seconds while dashboard is open
    const interval = setInterval(loadNotifications, 30000);

    // Refresh after inquiry actions in this tab
    window.addEventListener(
      "inquiries-updated",
      loadNotifications
    );

    return () => {
      clearInterval(interval);
      window.removeEventListener(
        "inquiries-updated",
        loadNotifications
      );
    };
  }, [loadNotifications]);

  return (
    <div className="space-y-8">

      {/* HEADER + NOTIFICATION BELL */}
      <div className="flex items-start justify-between gap-4">

        <div>
          <h2 className="text-2xl font-bold text-[#41634C] mb-2">
            Welcome, Professor!
          </h2>

          <p className="text-gray-500">
            Manage your website content from here.
          </p>
        </div>

        <Link
          to="/admin/inquiries"
          title="View contact inquiries"
          aria-label={`View inquiries, ${unreadCount} unread`}
          className="relative flex items-center justify-center w-12 h-12 bg-white border border-[#E9E5DB] rounded-xl text-[#41634C] hover:bg-[#E9EEDC] transition"
        >
          <Bell size={23} />

          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 min-w-6 h-6 px-1.5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

      </div>

      {/* EXISTING FOUR STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {stats.map((item) => (
          <Link
            key={item.title}
            to={item.path}
            className="bg-white rounded-xl border border-[#E9E5DB] p-6 hover:shadow-md transition"
          >
            <span className="text-3xl">
              {item.icon}
            </span>

            <h3 className="mt-4 text-lg font-semibold text-[#41634C]">
              {item.title}
            </h3>

            <p className="text-3xl font-bold text-[#343C32] mt-3">
              {counts[item.key] ?? 0}
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Manage {item.title.toLowerCase()}
            </p>
          </Link>
        ))}

      </div>

      {/* RECENT INQUIRIES */}
      <div className="bg-white border border-[#E9E5DB] rounded-2xl overflow-hidden">

        <div className="flex items-center justify-between gap-4 p-6 border-b border-[#E9E5DB]">

          <div className="flex items-center gap-3">
            <div className="bg-[#E9EEDC] text-[#41634C] p-3 rounded-xl">
              <Mail size={21} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#41634C]">
                New Inquiries
              </h3>

              <p className="text-sm text-gray-500">
                Messages awaiting your attention
              </p>
            </div>
          </div>

          <Link
            to="/admin/inquiries"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#54765C] hover:underline"
          >
            View All
            <ArrowRight size={16} />
          </Link>

        </div>

        {inquiryError && (
          <p role="alert" className="px-6 pt-4 text-sm text-red-600">
            {inquiryError}
          </p>
        )}

        {loading ? (
          <p className="text-center text-gray-500 py-12">
            Loading inquiries...
          </p>
        ) : recentInquiries.length === 0 ? (
          <div className="text-center py-12 px-6">
            <Mail
              size={36}
              className="mx-auto text-[#54765C] mb-3"
            />

            <p className="font-semibold text-[#41634C]">
              No new inquiries
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Unread contact messages will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E9E5DB]">

            {recentInquiries.map((inquiry) => (
              <Link
                key={inquiry.id}
                to="/admin/inquiries"
                className="flex items-center justify-between gap-4 p-5 hover:bg-[#FAF9F6] transition"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-[#343C32] truncate">
                      {inquiry.name}
                    </h4>

                    <span className="text-xs bg-[#E9EEDC] text-[#41634C] px-2 py-1 rounded-full">
                      New
                    </span>
                  </div>

                  <p className="text-sm text-[#54765C] mt-1">
                    {inquiry.subject}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {inquiry.created_at}
                  </p>
                </div>

                <ArrowRight
                  size={18}
                  className="text-[#54765C] shrink-0"
                />
              </Link>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}
