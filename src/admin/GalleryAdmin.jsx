
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Images,
  Upload,
  Plus,
  Pencil,
  Trash2,
  X,
  ImagePlus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Save,
  Eye,
  FolderOpen,
} from "lucide-react";

const API = "http://localhost/professor-api/gallery/";
const FILE_BASE = "http://localhost/professor-api/";

const CATEGORIES = [
  "Conferences",
  "Seminars",
  "Workshops",
  "Events",
  "Awards",
  "Academic Activities",
  "Other",
];

const emptyForm = {
  title: "",
  category: "Events",
  description: "",
  display_order: 0,
};

const inputClass =
  "w-full px-4 py-3 border border-[#DDE5DA] rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#54765C]/20 focus:border-[#54765C] text-sm";

const labelClass =
  "block text-sm font-semibold text-[#41634C] mb-2";

function getImageUrl(path) {
  if (
    !path ||
    !/^uploads\/gallery\/[a-f0-9]{32}\.(jpg|jpeg|png|webp)$/i.test(path)
  ) {
    return null;
  }

  return FILE_BASE + path;
}

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(API + endpoint, {
    credentials: "include",
    ...options,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export default function GalleryAdmin() {
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const loadPhotos = useCallback(async () => {
    setLoading(true);

    try {
      const data = await apiRequest("get.php");

      setPhotos(
        Array.isArray(data.photos) ? data.photos : []
      );

      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  // Generate local previews for selected images.
  useEffect(() => {
    const urls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const updateForm = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files || []);

    setError("");

    if (files.length > 10) {
      setError("You can upload a maximum of 10 photos at once.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const invalidFile = files.find(
      (file) =>
        !allowedTypes.includes(file.type) ||
        file.size > 5 * 1024 * 1024
    );

    if (invalidFile) {
      setError(
        "Only JPG, PNG, and WebP images up to 5 MB are allowed."
      );
      return;
    }

    setSelectedFiles(files);
  };

  const clearFiles = () => {
    setSelectedFiles([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadPhotos = async (event) => {
    event.preventDefault();

    if (selectedFiles.length === 0) {
      setError("Please select at least one image.");
      return;
    }

    if (!form.title.trim()) {
      setError("Photo title is required.");
      return;
    }

    setUploading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append(
        "display_order",
        String(form.display_order)
      );

      selectedFiles.forEach((file) => {
        formData.append("images[]", file);
      });

      const data = await apiRequest("upload.php", {
        method: "POST",
        body: formData,
      });

      setMessage(
        `${data.uploaded_count} photo(s) uploaded successfully.`
      );

      if (data.errors?.length) {
        setError(data.errors.join(" "));
      }

      clearFiles();
      setForm(emptyForm);

      await loadPhotos();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (photo) => {
    setEditingId(Number(photo.id));

    setForm({
      title: photo.title || "",
      category: photo.category || "Other",
      description: photo.description || "",
      display_order: photo.display_order ?? 0,
    });

    setMessage("");
    setError("");

    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const savePhoto = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const data = await apiRequest("save.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          ...form,
          display_order: Number(form.display_order),
        }),
      });

      setMessage(data.message || "Photo updated.");

      cancelEdit();
      await loadPhotos();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deletePhoto = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this photo permanently?"
      )
    ) {
      return;
    }

    setBusyId(Number(id));
    setMessage("");
    setError("");

    try {
      const data = await apiRequest("delete.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      setMessage(data.message || "Photo deleted.");

      if (editingId === Number(id)) {
        cancelEdit();
      }

      await loadPhotos();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const filteredPhotos = photos.filter(
    (photo) =>
      filter === "All" || photo.category === filter
  );

  const categoriesUsed = new Set(
    photos.map((photo) => photo.category)
  ).size;

  return (
    <div className="min-h-full bg-[#F8F7F2] p-5 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* PAGE HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-[#829786]">
              Portfolio Management
            </p>

            <h1 className="text-2xl md:text-3xl font-bold text-[#344F3C] mt-2">
              Photo Gallery
            </h1>

            <p className="text-gray-500 mt-2">
              Upload and manage academic event photos,
              conferences, workshops and achievements.
            </p>
          </div>

          <button
            type="button"
            onClick={loadPhotos}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#DCE6D9] bg-white text-[#41634C] font-semibold"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "Total Photos",
              value: photos.length,
              icon: Images,
            },
            {
              title: "Categories",
              value: categoriesUsed,
              icon: FolderOpen,
            },
            {
              title: "Selected Images",
              value: selectedFiles.length,
              icon: ImagePlus,
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="bg-white rounded-2xl border border-[#E5E9E2] p-5 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EDF3EA] text-[#54765C] flex items-center justify-center">
                  <Icon size={22} />
                </div>

                <div>
                  <p className="text-2xl font-bold text-[#344F3C]">
                    {stat.value}
                  </p>

                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ALERTS */}
        {message && (
          <div
            role="status"
            className="flex gap-3 items-center p-4 rounded-xl bg-green-50 border border-green-200 text-green-800"
          >
            <CheckCircle2 size={20} />
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex gap-3 items-center p-4 rounded-xl bg-red-50 border border-red-200 text-red-700"
          >
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* UPLOAD / EDIT FORM */}
        <section
          ref={formRef}
          className="bg-white rounded-2xl border border-[#E5E9E2] overflow-hidden"
        >
          <div className="bg-[#EDF3EA] p-6 flex items-center gap-3">
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-[#54765C]">
              {editingId ? (
                <Pencil size={21} />
              ) : (
                <Plus size={21} />
              )}
            </div>

            <div>
              <h2 className="font-bold text-lg text-[#344F3C]">
                {editingId
                  ? "Edit Photo Details"
                  : "Upload Gallery Photos"}
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                {editingId
                  ? "Update photo information."
                  : "Select up to 10 photos at once."}
              </p>
            </div>
          </div>

          <form
            onSubmit={editingId ? savePhoto : uploadPhotos}
            className="p-6 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="md:col-span-2">
                <label className={labelClass}>
                  Photo Title *
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={updateForm}
                  className={inputClass}
                  placeholder="e.g. National Conference 2026"
                  maxLength={255}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Category *
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={updateForm}
                  className={inputClass}
                  required
                >
                  {CATEGORIES.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Display Order
                </label>

                <input
                  type="number"
                  name="display_order"
                  value={form.display_order}
                  onChange={updateForm}
                  className={inputClass}
                  min={0}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateForm}
                  className={inputClass}
                  rows={3}
                  placeholder="Describe the event or activity..."
                />
              </div>

              {!editingId && (
  <div className="md:col-span-2">
    <label className={labelClass}>Upload Images *</label>

    <div className="rounded-2xl border-2 border-dashed border-[#C8D7C5] bg-[#F8FBF7] p-6 text-center">
      <ImagePlus
        size={35}
        className="mx-auto text-[#54765C]"
      />

      <p className="mt-3 font-semibold text-[#41634C]">
        Choose Gallery Photos
      </p>

      <p className="mt-1 text-sm text-gray-500">
        JPG, PNG, WebP — Maximum 5 MB each
      </p>

      {/* Choose Files button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#54765C] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3F5F47] focus:outline-none focus:ring-2 focus:ring-[#54765C] focus:ring-offset-2"
      >
        <Upload size={17} />
        Choose Files
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        id="gallery-images"
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        multiple
        onChange={handleFileSelection}
        className="hidden"
      />
    </div>

   

                  {previews.length > 0 && (
                    <div className="mt-5">
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-sm font-semibold text-[#41634C]">
                          Selected Photos ({previews.length})
                        </p>

                        <button
                          type="button"
                          onClick={clearFiles}
                          className="inline-flex items-center gap-2 text-red-600 text-sm font-semibold"
                        >
                          <X size={16} />
                          Clear
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {previews.map((url, index) => (
                          <div
                            key={url}
                            className="rounded-xl overflow-hidden border border-[#E5E9E2]"
                          >
                            <img
                              src={url}
                              alt={`Selected ${index + 1}`}
                              className="w-full h-28 object-cover"
                            />

                            <p className="text-xs text-gray-500 truncate p-2">
                              {selectedFiles[index]?.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-7">
              <button
                type="submit"
                disabled={uploading || saving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#41634C] text-white font-semibold hover:bg-[#304C39] disabled:opacity-60"
              >
                {uploading || saving ? (
                  <RefreshCw
                    size={18}
                    className="animate-spin"
                  />
                ) : editingId ? (
                  <Save size={18} />
                ) : (
                  <Upload size={18} />
                )}

                {editingId
                  ? "Save Changes"
                  : uploading
                  ? "Uploading..."
                  : "Upload Photos"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold"
                >
                  <X size={18} />
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        {/* GALLERY LIST */}
        <section>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
            <div>
              <h2 className="text-xl font-bold text-[#344F3C]">
                Uploaded Photos
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {filteredPhotos.length} photos
              </p>
            </div>

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="px-4 py-2.5 bg-white border border-[#DDE5DA] rounded-xl text-sm text-[#41634C]"
            >
              <option value="All">All Categories</option>

              {CATEGORIES.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-14 text-gray-500">
              <RefreshCw
                size={20}
                className="animate-spin"
              />
              Loading gallery...
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5E9E2] p-12 text-center">
              <Images
                size={38}
                className="mx-auto text-[#9CAF9C]"
              />

              <h3 className="font-bold text-[#41634C] mt-4">
                No Photos Found
              </h3>

              <p className="text-gray-500 mt-2">
                Upload your first gallery photos using the form above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhotos.map((photo) => {
                const imageUrl = getImageUrl(
                  photo.image_path
                );

                return (
                  <article
                    key={photo.id}
                    className="bg-white rounded-2xl border border-[#E5E9E2] overflow-hidden"
                  >
                    <div className="relative h-52 bg-[#EDF3EA]">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={photo.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-[#9CAF9C]">
                          <Images size={40} />
                        </div>
                      )}

                      <span className="absolute top-3 left-3 px-3 py-1.5 bg-white/95 rounded-full text-xs font-semibold text-[#41634C]">
                        {photo.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-[#344F3C] text-lg">
                        {photo.title}
                      </h3>

                      {photo.description && (
                        <p className="text-sm text-gray-500 leading-6 mt-2 line-clamp-3">
                          {photo.description}
                        </p>
                      )}

                      <p className="text-xs text-gray-400 mt-3">
                        Display Order: {photo.display_order}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-[#EDF0EA]">
                        {imageUrl && (
                          <a
                            href={imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-[#EDF3EA] text-[#41634C] rounded-lg text-sm font-semibold"
                          >
                            <Eye size={15} />
                            View
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => startEdit(photo)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-[#EDF3EA] text-[#41634C] rounded-lg text-sm font-semibold"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deletePhoto(photo.id)}
                          disabled={busyId === Number(photo.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
