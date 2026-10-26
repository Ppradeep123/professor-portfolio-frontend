
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useProfessorProfile from "../hooks/useProfessorProfile";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost/professor-api/";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function Contact() {
  const { profile } = useProfessorProfile();

  // Dynamic professor information
  const professor = {
    name: profile?.full_name || "Professor",
    designation: profile?.designation || "",
    department: profile?.department || "",
    institute: profile?.college_name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    googleScholar: profile?.google_scholar_url || "",
    linkedin: profile?.linkedin_url || "",
    researchGate: profile?.researchgate_url || "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setSuccessMessage("");
    setSubmitError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    } else if (formData.name.trim().length > 150) {
      newErrors.name = "Name is too long.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Please enter a valid email.";
    } else if (formData.email.trim().length > 255) {
      newErrors.email = "Email is too long.";
    }

    if (!formData.subject) {
      newErrors.subject = "Please select a subject.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message.";
    } else if (formData.message.trim().length > 5000) {
      newErrors.message = "Message cannot exceed 5000 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit inquiry to PHP + MySQL
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;
    if (!validateForm()) return;

    setSubmitting(true);
    setSuccessMessage("");
    setSubmitError("");

    try {
      const response = await fetch(
        `${API_BASE.replace(/\/+$/, "")}/contact/submit.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: formData.subject,
            message: formData.message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to submit your inquiry."
        );
      }

      setSuccessMessage(
        "Your inquiry has been submitted successfully. Thank you for contacting us!"
      );

      setFormData(initialForm);
      setErrors({});
    } catch (error) {
      setSubmitError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-5 py-3.5 bg-[#FAF9F6] border border-[#E2E4DC] rounded-xl text-[#343C32] outline-none focus:ring-2 focus:ring-[#54765C] focus:border-transparent transition";

  const safeExternalUrl = (url) => {
    if (!url) return "";

    try {
      const parsed = new URL(url);
      return ["https:", "http:"].includes(parsed.protocol)
        ? parsed.href
        : "";
    } catch {
      return "";
    }
  };

  const googleScholar = safeExternalUrl(professor.googleScholar);
  const linkedin = safeExternalUrl(professor.linkedin);
  const researchGate = safeExternalUrl(professor.researchGate);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#343C32]">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#F3F0E8] py-20 md:py-28">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#E9EEDC] rounded-full blur-3xl opacity-70" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">

          <span className="inline-block px-5 py-2 rounded-full bg-[#E9EEDC] text-[#54765C] text-sm font-semibold mb-6">
            ✦ Let's Connect
          </span>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get in
            <span className="text-[#54765C]"> Touch.</span>
          </h1>

          <p className="text-[#77796E] text-lg leading-8 max-w-2xl mx-auto">
            Have a question, research idea, academic inquiry,
            or collaboration opportunity? I'd be happy to
            hear from you.
          </p>

          <div className="mt-8 text-sm text-[#8A806F]">
            <Link
              to="/"
              className="hover:text-[#54765C]"
            >
              Home
            </Link>

            <span className="mx-3">/</span>

            <span className="text-[#54765C] font-semibold">
              Contact
            </span>
          </div>

        </div>
      </section>

      {/* CONTACT INFORMATION AND FORM */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-10">

            {/* LEFT SIDE */}
            <div className="lg:col-span-2">

              <p className="text-[#B38B59] uppercase tracking-widest text-sm font-semibold mb-4">
                Contact Information
              </p>

              <h2 className="text-4xl font-bold leading-tight mb-6">
                Let's Start a
                <span className="block text-[#54765C]">
                  Conversation.
                </span>
              </h2>

              <p className="text-[#77796E] leading-8 mb-10">
                Whether you're a student, researcher,
                academic professional, or collaborator,
                feel free to reach out through the
                contact details below.
              </p>

              {/* DYNAMIC EMAIL */}
              {professor.email && (
                <div className="flex items-start gap-5 mb-8">
                  <div className="w-14 h-14 flex-shrink-0 bg-[#E9EEDC] rounded-2xl flex items-center justify-center text-[#54765C] text-2xl">
                    ✉
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      Email Address
                    </h3>

                    <a
                      href={`mailto:${professor.email}`}
                      className="text-[#77796E] hover:text-[#54765C] break-all"
                    >
                      {professor.email}
                    </a>
                  </div>
                </div>
              )}

              {/* DYNAMIC PHONE */}
              {professor.phone && (
                <div className="flex items-start gap-5 mb-8">
                  <div className="w-14 h-14 flex-shrink-0 bg-[#E9EEDC] rounded-2xl flex items-center justify-center text-[#54765C] text-2xl">
                    ☎
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      Phone Number
                    </h3>

                    <a
                      href={`tel:${professor.phone.replace(/[^\d+]/g, "")}`}
                      className="text-[#77796E] hover:text-[#54765C]"
                    >
                      {professor.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* DYNAMIC DEPARTMENT */}
              {(professor.department || professor.institute) && (
                <div className="flex items-start gap-5 mb-8">
                  <div className="w-14 h-14 flex-shrink-0 bg-[#E9EEDC] rounded-2xl flex items-center justify-center text-[#54765C] text-2xl">
                    ◈
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      Academic Department
                    </h3>

                    <p className="text-[#77796E] leading-7">
                      {professor.department}
                      {professor.department && professor.institute && <br />}
                      {professor.institute}
                    </p>
                  </div>
                </div>
              )}

              {/* DYNAMIC LOCATION */}
              {professor.location && (
                <div className="flex items-start gap-5 mb-10">
                  <div className="w-14 h-14 flex-shrink-0 bg-[#E9EEDC] rounded-2xl flex items-center justify-center text-[#54765C] text-2xl">
                    ◎
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      Location
                    </h3>

                    <p className="text-[#77796E]">
                      {professor.location}
                    </p>
                  </div>
                </div>
              )}

              {/* ACADEMIC PROFILES */}
              <div className="bg-[#E9EEDC] rounded-3xl p-8">

                <h3 className="text-xl font-bold mb-4">
                  Academic & Social Profiles
                </h3>

                <p className="text-[#77796E] text-sm leading-7 mb-6">
                  Connect with me through academic
                  research networks and professional
                  platforms.
                </p>

                <div className="flex flex-wrap gap-3">

                  {googleScholar && (
                    <a
                      href={googleScholar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-[#54765C] hover:shadow-md transition"
                    >
                      Google Scholar ↗
                    </a>
                  )}

                  {linkedin && (
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-[#54765C] hover:shadow-md transition"
                    >
                      LinkedIn ↗
                    </a>
                  )}

                  {researchGate && (
                    <a
                      href={researchGate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-[#54765C] hover:shadow-md transition"
                    >
                      ResearchGate ↗
                    </a>
                  )}

                  {!googleScholar && !linkedin && !researchGate && (
                    <p className="text-sm text-[#77796E]">
                      Academic profile links will be added soon.
                    </p>
                  )}

                </div>
              </div>

            </div>

            {/* RIGHT SIDE: CONTACT FORM */}
            <div className="lg:col-span-3">

              <div className="bg-white border border-[#EAE7DE] rounded-[2rem] p-7 md:p-12 shadow-sm">

                <div className="mb-9">
                  <span className="inline-block px-4 py-2 rounded-full bg-[#E9EEDC] text-[#54765C] text-xs font-semibold mb-5">
                    Send a Message
                  </span>

                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    How Can I Help You?
                  </h2>

                  <p className="text-[#77796E] leading-7">
                    Fill out the form below to send your inquiry
                    directly to the professor.
                  </p>
                </div>

                {/* SUCCESS MESSAGE */}
                {successMessage && (
                  <div
                    role="status"
                    className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm"
                  >
                    ✓ {successMessage}
                  </div>
                )}

                {/* SUBMISSION ERROR */}
                {submitError && (
                  <div
                    role="alert"
                    className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
                  >
                    {submitError}
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-6"
                >

                  {/* NAME */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block font-semibold text-sm mb-3"
                    >
                      Full Name *
                    </label>

                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      maxLength={150}
                      className={inputClass}
                    />

                    {errors.name && (
                      <p className="text-red-600 text-xs mt-2">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block font-semibold text-sm mb-3"
                    >
                      Email Address *
                    </label>

                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      autoComplete="email"
                      maxLength={255}
                      className={inputClass}
                    />

                    {errors.email && (
                      <p className="text-red-600 text-xs mt-2">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* SUBJECT */}
                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block font-semibold text-sm mb-3"
                    >
                      Subject *
                    </label>

                    <select
                      id="contact-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">
                        Select a subject
                      </option>

                      <option value="Research Collaboration">
                        Research Collaboration
                      </option>

                      <option value="Academic Inquiry">
                        Academic Inquiry
                      </option>

                      <option value="Student Query">
                        Student Query
                      </option>

                      <option value="Publication Discussion">
                        Publication Discussion
                      </option>

                      <option value="Other Inquiry">
                        Other Inquiry
                      </option>
                    </select>

                    {errors.subject && (
                      <p className="text-red-600 text-xs mt-2">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* MESSAGE */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block font-semibold text-sm mb-3"
                    >
                      Your Message *
                    </label>

                    <textarea
                      id="contact-message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      maxLength={5000}
                      className={`${inputClass} resize-none`}
                    />

                    {errors.message && (
                      <p className="text-red-600 text-xs mt-2">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#54765C] text-white py-4 rounded-xl font-semibold hover:bg-[#405C47] transition duration-300 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? "Sending Inquiry..."
                      : "Send Inquiry ↗"}
                  </button>

                  <p className="text-xs text-center text-[#8A806F] leading-6">
                    Your inquiry will be submitted directly
                    through this website.
                  </p>

                </form>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COLLABORATION CTA */}
      <section className="bg-[#F3F0E8] py-20">

        <div className="max-w-5xl mx-auto px-6">

          <div className="bg-[#E9EEDC] rounded-[2.5rem] p-10 md:p-20 text-center">

            <p className="text-[#54765C] uppercase tracking-widest text-sm font-semibold mb-5">
              Academic Collaboration
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mb-7">
              Let's Create Something
              <span className="text-[#54765C]">
                {" "}Meaningful.
              </span>
            </h2>

            <p className="text-[#77796E] leading-8 max-w-2xl mx-auto mb-9">
              Open to research discussions, student
              mentorship, interdisciplinary projects,
              and academic partnerships.
            </p>

            <Link
              to="/research"
              className="inline-block bg-[#54765C] text-white px-9 py-4 rounded-full font-semibold hover:bg-[#405C47] transition"
            >
              Explore My Research →
            </Link>

          </div>

        </div>
      </section>

    </div>
  );
}

export default Contact;
