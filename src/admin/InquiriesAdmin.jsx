
import { useCallback, useEffect, useState } from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  RefreshCw,
  Search,
  Send,
  Inbox,
} from "lucide-react";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost/professor-api/"
).replace(/\/+$/, "");

export default function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadInquiries = useCallback(async () => {
    try {
      setError("");

      const response = await fetch(
        `${API_BASE}/contact/get.php`,
        { credentials: "include" }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load inquiries.");
      }

      setInquiries(data.inquiries || []);
    } catch (err) {
      setError(err.message || "Unable to load inquiries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  const postAction = async (endpoint, payload) => {
    const response = await fetch(
      `${API_BASE}/contact/${endpoint}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Action failed.");
    }

    return data;
  };

  const markRead = async (inquiry, isRead) => {
    setBusyId(inquiry.id);

    try {
      setError("");

      await postAction("mark_read.php", {
        id: inquiry.id,
        is_read: isRead,
      });

      setInquiries((prev) =>
        prev.map((item) =>
          item.id === inquiry.id
            ? { ...item, is_read: isRead }
            : item
        )
      );

      setSelected((prev) =>
        prev?.id === inquiry.id
          ? { ...prev, is_read: isRead }
          : prev
      );

      window.dispatchEvent(new Event("inquiries-updated"));
    } catch (err) {
      setError(err.message || "Unable to update inquiry.");
    } finally {
      setBusyId(null);
    }
  };

  const openInquiry = async (inquiry) => {
    setSelected(inquiry);

    if (Number(inquiry.is_read) === 0) {
      await markRead(inquiry, 1);
    }
  };

  const deleteInquiry = async (inquiry) => {
    const confirmed = window.confirm(
      `Delete inquiry from ${inquiry.name}?`
    );

    if (!confirmed) return;

    setBusyId(inquiry.id);

    try {
      setError("");

      await postAction("delete.php", {
        id: inquiry.id,
      });

      setInquiries((prev) =>
        prev.filter((item) => item.id !== inquiry.id)
      );

      setSelected((prev) =>
        prev?.id === inquiry.id ? null : prev
      );

      window.dispatchEvent(new Event("inquiries-updated"));
    } catch (err) {
      setError(err.message || "Unable to delete inquiry.");
    } finally {
      setBusyId(null);
    }
  };

  const filteredInquiries = inquiries.filter((item) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && Number(item.is_read) === 0) ||
      (filter === "read" && Number(item.is_read) === 1);

    const query = search.toLowerCase().trim();

    const matchesSearch =
      !query ||
      [item.name, item.email, item.subject, item.message]
        .some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

    return matchesFilter && matchesSearch;
  });

  const unreadCount = inquiries.filter(
    (item) => Number(item.is_read) === 0
  ).length;

  const replyToInquiry = (inquiry) => {
    const subject = encodeURIComponent(
      `Re: ${inquiry.subject}`
    );

    window.location.href =
      `mailto:${inquiry.email}?subject=${subject}`;
  };

  return (
    <div className="space-y-7">

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#41634C]">
            Contact Inquiries
          </h1>

          <p className="text-gray-500 mt-2">
            View and manage messages received from website visitors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setLoading(true);
            loadInquiries();
          }}
          className="inline-flex items-center gap-2 bg-white border border-[#E9E5DB] px-4 py-2.5 rounded-xl text-[#41634C] hover:bg-[#E9EEDC] transition"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Inquiries",
            value: inquiries.length,
            icon: <Inbox size={22} />,
          },
          {
            label: "Unread",
            value: unreadCount,
            icon: <Mail size={22} />,
          },
          {
            label: "Read",
            value: inquiries.length - unreadCount,
            icon: <MailOpen size={22} />,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white border border-[#E9E5DB] rounded-2xl p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {item.label}
              </span>

              <span className="text-[#54765C]">
                {item.icon}
              </span>
            </div>

            <p className="text-3xl font-bold text-[#41634C] mt-3">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-[#E9E5DB] rounded-2xl p-5">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "All" },
              { value: "unread", label: "Unread" },
              { value: "read", label: "Read" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  filter === option.value
                    ? "bg-[#54765C] text-white"
                    : "bg-[#FAF9F6] text-gray-600 hover:bg-[#E9EEDC]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inquiries..."
              className="w-full pl-10 pr-4 py-2.5 border border-[#E9E5DB] rounded-xl outline-none focus:border-[#54765C]"
            />
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4"
        >
          {error}
        </div>
      )}

      {/* INQUIRIES */}
      <div className="bg-white border border-[#E9E5DB] rounded-2xl overflow-hidden">

        {loading ? (
          <p className="text-center text-gray-500 py-14">
            Loading inquiries...
          </p>
        ) : filteredInquiries.length === 0 ? (
          <div className="text-center py-14 px-5">
            <Inbox
              size={42}
              className="mx-auto text-[#54765C] mb-4"
            />

            <h3 className="font-semibold text-lg text-[#41634C]">
              No inquiries found
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              New contact inquiries will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E9E5DB]">
            {filteredInquiries.map((inquiry) => {
              const isUnread = Number(inquiry.is_read) === 0;

              return (
                <div
                  key={inquiry.id}
                  className={`p-5 hover:bg-[#FAF9F6] transition ${
                    isUnread ? "bg-[#F6F9F1]" : ""
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    <button
                      type="button"
                      onClick={() => openInquiry(inquiry)}
                      className="text-left flex-1 min-w-0"
                    >
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="font-bold text-[#343C32]">
                          {inquiry.name}
                        </h3>

                        {isUnread && (
                          <span className="text-xs font-semibold bg-[#E9EEDC] text-[#41634C] px-3 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-[#54765C] font-semibold mb-1">
                        {inquiry.subject}
                      </p>

                      <p className="text-sm text-gray-500 truncate">
                        {inquiry.message}
                      </p>

                      <p className="text-xs text-gray-400 mt-2">
                        {inquiry.email} · {inquiry.created_at}
                      </p>
                    </button>

                    <div className="flex items-center gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          markRead(inquiry, isUnread ? 1 : 0)
                        }
                        disabled={busyId === inquiry.id}
                        title={isUnread ? "Mark as read" : "Mark as unread"}
                        className="p-2.5 rounded-lg bg-[#E9EEDC] text-[#41634C] hover:bg-[#DCE5CC] disabled:opacity-50"
                      >
                        {isUnread
                          ? <MailOpen size={18} />
                          : <Mail size={18} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => replyToInquiry(inquiry)}
                        title="Reply by email"
                        className="p-2.5 rounded-lg bg-[#E9EEDC] text-[#41634C] hover:bg-[#DCE5CC]"
                      >
                        <Send size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteInquiry(inquiry)}
                        disabled={busyId === inquiry.id}
                        title="Delete inquiry"
                        className="p-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MESSAGE DETAILS MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Inquiry details"
            className="bg-white rounded-2xl w-full max-w-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-[#41634C]">
                Inquiry Details
              </h2>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-gray-500 hover:text-gray-900 text-2xl"
                aria-label="Close inquiry"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">From</p>
                <p className="font-semibold">{selected.name}</p>
                <p className="text-sm text-gray-500">
                  {selected.email}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Subject</p>
                <p className="font-semibold">{selected.subject}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Received</p>
                <p className="text-sm">{selected.created_at}</p>
              </div>

              <div className="bg-[#FAF9F6] border border-[#E9E5DB] rounded-xl p-5">
                <p className="whitespace-pre-wrap break-words text-gray-700 leading-7">
                  {selected.message}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-7">
              <button
                type="button"
                onClick={() => replyToInquiry(selected)}
                className="inline-flex items-center gap-2 bg-[#54765C] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#405C47]"
              >
                <Send size={17} />
                Reply by Email
              </button>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="px-5 py-3 bg-[#F3F0E8] rounded-xl font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
