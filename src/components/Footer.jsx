
import React from "react";
import { Link } from "react-router-dom";
import useProfessorProfile from "../hooks/useProfessorProfile";

export default function Footer() {

  // Fetch professor details from database
  const { profile } = useProfessorProfile();

  const professorName = profile?.full_name || "Professor";
  const designation = profile?.designation || "";
  const department = profile?.department || "";
  const email = profile?.email || "";
  const phone = profile?.phone || "";

  return (
    <footer className="bg-[#F3F0E8] border-t border-[#E9E5DB]">

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* PROFESSOR DETAILS */}
          <div>
            <h2 className="text-2xl font-bold text-[#54765C] mb-4">
              {professorName}
            </h2>

            <p className="text-[#77796E] font-medium mb-2">
              {designation}
            </p>

            <p className="text-[#8A806F] text-sm leading-7">
              {department}
            </p>

            <p className="text-[#8A806F] text-sm leading-7 mt-4">
              Dedicated to academic excellence, research,
              innovation, and inspiring future generations.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="md:mx-auto">
            <h3 className="text-lg font-bold text-[#343C32] mb-5">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-sm text-[#77796E]">

              <Link
                to="/"
                className="hover:text-[#54765C] transition"
              >
                Home
              </Link>

              <Link
                to="/about"
                className="hover:text-[#54765C] transition"
              >
                About Me
              </Link>

              <Link
                to="/research"
                className="hover:text-[#54765C] transition"
              >
                Research
              </Link>

              <Link
                to="/gallery"
                className="hover:text-[#54765C] transition"
              >
                Gallery
              </Link>

              <Link
                to="/contact"
                className="hover:text-[#54765C] transition"
              >
                Contact
              </Link>

            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-lg font-bold text-[#343C32] mb-5">
              Get in Touch
            </h3>

            <p className="text-[#77796E] text-sm leading-7 mb-4">
              Interested in academic collaboration,
              research, or student mentorship?
            </p>

            {/* DYNAMIC EMAIL */}
            {email && (
              <a
                href={`mailto:${email}`}
                className="block text-[#54765C] text-sm font-medium hover:underline break-all mb-6"
              >
                ✉ {email}
              </a>
            )}

            {/* DYNAMIC PHONE */}
            {phone && (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                className="block text-[#54765C] text-sm font-medium hover:underline mb-6"
              >
                ☎ {phone}
              </a>
            )}

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#54765C] text-white rounded-full text-sm font-semibold hover:bg-[#405C47] transition"
            >
              Contact Me ↗
            </Link>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-[#DADFD2] pt-7 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-sm text-[#8A806F] text-center md:text-left">
            © {new Date().getFullYear()} {professorName}.
            All Rights Reserved.
          </p>

          <p className="text-sm text-[#8A806F]">
            Academic Portfolio Website
          </p>

        </div>

      </div>
    </footer>
  );
}
