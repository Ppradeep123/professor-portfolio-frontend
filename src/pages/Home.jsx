
import React from "react";
import { Link } from "react-router-dom";

import useProfessorProfile from "../hooks/useProfessorProfile";
import LatestGallery from "../components/LatestGallery";
import LatestAchievements from "../components/LatestAchievements";
import HomeStats from "../components/HomeStats";
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://professor-portfolio-api.onrender.com";

const fileUrl = (path) => {
  if (!path) return "";

  // Only allow paths inside the expected uploads folder.
  if (!/^uploads\/[a-z0-9/_\-.]+$/i.test(path)) {
    return "";
  }

  return `${API_BASE.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
};

const interests = [
  {
    icon: "✦",
    title: "Artificial Intelligence",
    description:
      "Exploring intelligent systems and their real-world applications.",
  },
  {
    icon: "◈",
    title: "Machine Learning",
    description:
      "Developing innovative data-driven solutions and models.",
  },
  {
    icon: "✳",
    title: "Data Science",
    description:
      "Discovering meaningful insights through research and analytics.",
  },
];

const quickLinks = [
  {
    title: "Research",
    description:
      "Explore research projects and scholarly contributions.",
    path: "/research",
    icon: "◈",
  },
  {
    title: "Publications",
    description: "Browse journals, papers and academic publications.",
    path: "/research#publications",
    icon: "▤",
  },
  {
    title: "Teaching",
    description:
      "Discover teaching activities and academic courses.",
    path: "/teaching",
    icon: "✦",
  },
  {
    title: "Academic Activities",
    description:
      "Explore workshops, seminars and professional activities.",
    path: "/academic-activities",
    icon: "✳",
  },
  {
    title: "E-Content",
    description:
      "Access academic resources and learning materials.",
    path: "/e-content",
    icon: "▣",
  },
  {
    title: "Achievements",
    description:
      "View awards, honors and professional recognition.",
    path: "/achievements",
    icon: "★",
  },
];

export default function Home() {

  const { profile, loading, error } = useProfessorProfile();
  const name = profile?.full_name || "Professor";
  const designation = profile?.designation || "Faculty Member";
  const department = profile?.department || "";
  const college = profile?.college_name || "";
  const biography = profile?.biography || "";
  const email = profile?.email || "";

  const profileImage = fileUrl(profile?.profile_photo);

  const experience = Number(profile?.experience_years);

  const hasExperience =
    profile?.experience_years !== null &&
    profile?.experience_years !== undefined &&
    profile?.experience_years !== "" &&
    Number.isFinite(experience) &&
    experience > 0;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#343C32]">

      {/* HERO */}
      <section
        id="home"
        className="relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#E9EEDC] rounded-full blur-3xl opacity-60" />

        <div className="relative max-w-7xl mx-auto px-6 pt-8 pb-16 md:pt-12 md:pb-20 grid md:grid-cols-2 gap-12 items-center">

          <div>
            <span className="inline-block px-5 py-2 rounded-full bg-[#E9EEDC] text-[#54765C] text-sm font-semibold mb-7">
              ✦ Welcome to My Academic World
            </span>

            {/* Professor Name */}
            <div>
              <p className="text-lg md:text-xl text-[#8A806F] mb-2 font-medium">
                Hello, I'm
              </p>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.12] tracking-tight text-[#2F4033]">
                {name}
              </h1>
            </div>

            {/* Designation */}
            <div className="flex items-center gap-3 pt-2">
              <span className="w-1 h-10 rounded-full bg-[#6B9274]"></span>

              <h2 className="text-lg md:text-2xl font-semibold text-[#54765C]">
                {designation}
              </h2>
            </div>



            <p className="text-[#77796E] mt-2 mb-6 leading-7">
              {department}
              {department && college && <br />}
              {college}
            </p>

            <p className="text-[#77796E] max-w-lg leading-8 mb-9">
              {biography ||
                "Dedicated to teaching, academic research, mentoring students, and contributing to meaningful developments in education."}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/about"
                className="px-8 py-4 bg-[#54765C] text-white rounded-full font-medium hover:bg-[#405C47] transition"
              >
                Explore My Profile →
              </Link>

              <Link
                to="/research"
                className="px-8 py-4 border border-[#B7C5B4] rounded-full font-medium hover:bg-[#E9EEDC] transition"
              >
                My Research
              </Link>
            </div>
          </div>

          {/* PROFILE PHOTO */}
          <div className="relative flex justify-center md:-translate-y-8">
            <div className="absolute -top-6 -right-3 w-32 h-32 bg-[#E9EEDC] rounded-full" />
            <div className="absolute -bottom-7 -left-3 w-36 h-36 bg-[#F1E5D0] rounded-full" />

            <div className="relative w-full max-w-md p-3 bg-white rounded-[2rem] shadow-xl shadow-[#DCD8CC]/50">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={name}
                  className="w-full h-[400px] md:h-[450px] object-cover rounded-[1.5rem]"
                />
              ) : (
                <div className="w-full h-[400px] md:h-[450px] bg-[#E9EEDC] rounded-[1.5rem] flex items-center justify-center">
                  <span className="text-8xl text-[#54765C]">
                    ♙
                  </span>
                </div>
              )}

              <div className="absolute bottom-7 left-7 right-7 bg-white/95 backdrop-blur rounded-2xl p-5 shadow-lg">
                <p className="font-bold text-lg">
                  {name}
                </p>

                <p className="text-sm text-[#54765C] mt-1">
                  {designation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      {hasExperience && (
        <section className="bg-white py-12 border-y border-[#EEEAE1]">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <HomeStats profile={profile} />
          </div>
        </section>
      )}

      {/* ABOUT */}
      <section id="about" className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">

          <div className="bg-[#E9EEDC] rounded-[2rem] p-10 md:p-14">
            <span className="text-6xl text-[#54765C]">
              “
            </span>

            <h3 className="text-3xl md:text-4xl font-semibold leading-snug mt-3">
              Education is the foundation of innovation
              and a better tomorrow.
            </h3>

            <p className="mt-8 text-[#54765C] font-medium">
              — My Teaching Philosophy
            </p>
          </div>

          <div>
            <p className="text-[#B38B59] uppercase tracking-widest text-sm font-semibold mb-4">
              A Little About Me
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mb-7">
              Passionate About
              <span className="text-[#54765C]">
                {" "}Education.
              </span>
            </h2>

            <p className="text-[#77796E] leading-8 mb-6">
              {biography ||
                "My academic work focuses on teaching, guiding students, encouraging innovation, and contributing to research and professional development."}
            </p>

            {profile?.qualification && (
              <p className="text-[#77796E] leading-8 mb-6">
                <strong className="text-[#41634C]">
                  Qualification:
                </strong>{" "}
                {profile.qualification}
              </p>
            )}

            <Link
              to="/about"
              className="inline-flex items-center gap-3 text-[#54765C] font-semibold border-b-2 border-[#54765C] pb-2"
            >
              Read More About Me <span>↗</span>
            </Link>
          </div>
        </div>
      </section>




      {/* EXPLORE ACADEMIC WORK */}
      <section className="py-24 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">
            <p className="text-[#B38B59] uppercase tracking-widest text-sm font-semibold mb-4">
              Academic Portfolio
            </p>

            <h2 className="text-4xl md:text-5xl font-bold">
              Explore My{" "}
              <span className="text-[#54765C]">
                Work
              </span>
            </h2>

            <p className="text-[#77796E] mt-5 max-w-2xl mx-auto leading-7">
              Explore research, publications, teaching,
              learning resources and academic activities.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="group bg-white rounded-3xl p-8 border border-[#EAE7DE] hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >
                <div className="w-14 h-14 bg-[#E9EEDC] text-[#54765C] rounded-2xl flex items-center justify-center text-2xl mb-6">
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold text-[#343C32] mb-3">
                  {item.title}
                </h3>

                <p className="text-[#77796E] text-sm leading-7">
                  {item.description}
                </p>

                <span className="inline-block mt-6 text-[#54765C] font-semibold text-sm">
                  View Details →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DYNAMIC ACHIEVEMENTS */}
      <LatestAchievements />

      {/* DYNAMIC GALLERY */}
      <LatestGallery />

      {/* CONTACT */}
      <section
        id="contact"
        className="py-24 px-6"
      >
        <div className="max-w-5xl mx-auto bg-[#E9EEDC] rounded-[2.5rem] p-10 md:p-20 text-center">
          <p className="text-[#54765C] uppercase text-sm font-semibold tracking-widest mb-4">
            Let's Collaborate
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Let's Make Something
            <span className="text-[#54765C]">
              {" "}Meaningful.
            </span>
          </h2>

          <p className="text-[#77796E] max-w-xl mx-auto leading-8 mb-9">
            Open to academic discussions, research
            collaborations, student mentorship and
            professional opportunities.
          </p>

          {email ? (
            <a
              href={`mailto:${email}`}
              className="inline-block bg-[#54765C] text-white px-9 py-4 rounded-full font-semibold hover:bg-[#405C47] transition"
            >
              Send an Email →
            </a>
          ) : (
            <Link
              to="/contact"
              className="inline-block bg-[#54765C] text-white px-9 py-4 rounded-full font-semibold hover:bg-[#405C47] transition"
            >
              Contact Me →
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
