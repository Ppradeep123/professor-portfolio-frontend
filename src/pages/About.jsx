import React from "react";
import { Link } from "react-router-dom";
import useProfessorProfile from "../hooks/useProfessorProfile";
import EducationSection from "../components/EducationSection";
function About() {
  const { profile, loading, error } = useProfessorProfile();
  // Loading State with original styling
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center text-[#343C32]">
        <div className="text-center">
          <div className="inline-block px-5 py-2 rounded-full bg-[#E9EEDC] text-[#54765C] text-sm font-semibold mb-4 animate-pulse">
            ✦ Loading Profile
          </div>
          <p className="text-[#77796E]">Please wait while we fetch the details...</p>
        </div>
      </div>
    );
  }
  // Error State with original styling
  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center text-[#343C32]">
        <div className="text-center p-8 bg-white rounded-3xl border border-[#EAE7DE] shadow-lg max-w-md mx-auto">
          <p className="text-red-600 font-semibold mb-2">Unable to load profile</p>
          <p className="text-[#77796E] text-sm">{error}</p>
        </div>
      </div>
    );
  }
  // Fallback if profile is empty
  const currentProfile = profile || {
    full_name: "Dr. Trupti Thorat",
    designation: "Associate Professor",
    department: "Department of Computer Science",
    college_name: "ABC Institute of Technology",
    email: "professor@example.com",
    biography: "An academic professional passionate about teaching, research, and helping students develop strong technical knowledge and problem-solving skills.",
    qualification: "Ph.D. in Computer Science",
    experience_years: "10+",
    image: "/professor.jpg",
    cv: "/documents/professor-cv.pdf",
  };
  const education = [
    {
      degree: currentProfile.qualification || "Ph.D. in Computer Science",
      institute: currentProfile.college_name || "University Name",
      year: "Completed",
      description: currentProfile.biography || "Specialization and doctoral research details.",
    },
  ];
  const experience = [
    {
      role: currentProfile.designation || "Associate Professor",
      institute: currentProfile.college_name || "ABC Institute of Technology",
      duration: `${currentProfile.experience_years || "Multiple"} Years Experience`,
      description: "Teaching undergraduate and postgraduate students, guiding academic projects, and contributing to research activities.",
    },
  ];
  const expertise = [
    "Artificial Intelligence",
    "Machine Learning",
    "Data Science",
    "Computer Science",
    "Research Methodology",
    "Academic Mentorship",
  ];
  const achievements = [
    {
      icon: "🏆",
      title: "Academic Experience",
      description: `${currentProfile.experience_years || "10+"} Years of dedicated teaching and research excellence.`,
    },
    {
      icon: "📚",
      title: "Qualifications",
      description: currentProfile.qualification || "Verified academic credentials and specialized degrees.",
    },
    {
      icon: "🎓",
      title: "Student Mentorship",
      description: "Active guidance for student projects, research publications, and career development.",
    },
    {
      icon: "🌿",
      title: "Professional Profile",
      description: `Department of ${currentProfile.department || "Computer Science"} faculty member.`,
    },
  ];
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#343C32]">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#F3F0E8] py-20 md:py-28">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E9EEDC] rounded-full blur-3xl opacity-70" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-5 py-2 rounded-full bg-[#E9EEDC] text-[#54765C] text-sm font-semibold mb-6">
            ✦ Get to Know Me
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="text-[#54765C]">Me.</span>
          </h1>
          <p className="text-[#77796E] text-lg leading-8 max-w-2xl mx-auto">
            A journey of teaching, learning, research,
            and inspiring the next generation of innovators.
          </p>
          <div className="mt-8 text-sm text-[#8A806F]">
            <Link to="/" className="hover:text-[#54765C]">
              Home
            </Link>
            <span className="mx-3">/</span>
            <span className="text-[#54765C] font-semibold">
              About
            </span>
          </div>
        </div>
      </section>
      {/* PROFESSOR INTRODUCTION */}
      <section className="py-20 md:py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* PROFILE IMAGE */}
          <div className="relative max-w-lg mx-auto w-full">
            <div className="absolute -top-6 -left-6 w-36 h-36 bg-[#E9EEDC] rounded-full" />
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-[#F1E5D0] rounded-full" />
            <div className="relative bg-white p-3 rounded-[2rem] shadow-xl">
              {profile.profile_photo && (
                <img
                  src={`${(
                    import.meta.env.VITE_API_BASE_URL ||
                    "http://localhost/professor-api/"
                  ).replace(/\/+$/, "")}/${profile.profile_photo.replace(/^\/+/, "")}`}
                  alt={profile.full_name}
                  className="w-full h-[400px] md:h-[450px] object-cover rounded-[1.5rem]"
                  onError={(e) => {
                    console.error("Image loading failed:", e.currentTarget.src);
                  }}
                />
              )}
              <div className="absolute bottom-6 left-7 right-7 bg-white/95 backdrop-blur rounded-2xl p-5 shadow-lg">
                <h3 className="font-bold text-xl">
                  {currentProfile.full_name}
                </h3>
                <p className="text-[#54765C] text-sm mt-1">
                  Educator • Researcher • Mentor
                </p>
              </div>
            </div>
          </div>
          {/* BIOGRAPHY */}
          <div>
            <p className="text-[#B38B59] uppercase tracking-widest text-sm font-semibold mb-4">
              My Academic Journey
            </p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-7">
              Passionate About
              <span className="block text-[#54765C]">
                Education & Research.
              </span>
            </h2>
            <h3 className="text-xl font-semibold mb-3">
              {currentProfile.full_name}
            </h3>
            <p className="text-[#54765C] font-medium mb-6">
              {currentProfile.designation}
              <br />
              {currentProfile.department}
              <br />
              {currentProfile.college_name}
            </p>
            <p className="text-[#77796E] leading-8 mb-5 whitespace-pre-line">
              {currentProfile.biography}
            </p>
            <div className="mt-6 mb-8 text-sm text-[#77796E] space-y-2">
              <p><strong>Qualification:</strong> {currentProfile.qualification}</p>
              <p><strong>Experience:</strong> {currentProfile.experience_years} Years</p>
              <p><strong>Email:</strong> {currentProfile.email}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href={currentProfile.cv || "#"}
                download
                className="inline-flex items-center gap-2 px-7 py-4 bg-[#54765C] text-white rounded-full font-semibold hover:bg-[#405C47] transition"
              >
                Download My CV ↓
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-4 border border-[#B7C5B4] rounded-full font-semibold hover:bg-[#E9EEDC] transition"
              >
                Contact Me ↗
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* EDUCATION */}
      <section className="bg-[#F3F0E8] py-20 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#B38B59] uppercase tracking-widest text-sm font-semibold mb-4">
              Academic Qualifications
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">
              My <span className="text-[#54765C]">Education</span>
            </h2>
            <p className="text-[#77796E] mt-5 max-w-xl mx-auto leading-8">
              The academic foundation behind my teaching
              and research journey.
            </p>
            <EducationSection />
          </div>
        </div>
      </section >
      {/* PROFESSIONAL EXPERIENCE */}
      < section className="py-20 md:py-24 " >
        <div className="max-w-7xl mx-auto px-6 ">
          <div className="mb-14">
            <p className="text-[#B38B59] uppercase tracking-widest text-sm font-semibold mb-4">
              Professional Journey
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">
              Teaching &
              <span className="text-[#54765C]"> Experience</span>
            </h2>
            <p className="text-[#77796E] mt-5 max-w-2xl leading-8">
              My journey in academic teaching,
              student guidance, and institutional development.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {experience.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 md:p-10 border border-[#EAE7DE] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <span className="inline-block px-4 py-2 bg-[#E9EEDC] text-[#54765C] rounded-full text-xs font-semibold mb-6">
                  {item.duration}
                </span>
                <h3 className="text-2xl font-bold mb-3">
                  {item.role}
                </h3>
                <p className="text-[#54765C] font-semibold mb-5">
                  {item.institute}
                </p>
                <p className="text-[#77796E] leading-8">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section >


      {/* ACHIEVEMENTS */}

      {/* TEACHING PHILOSOPHY */}
      < section className="bg-[#E9EEDC] py-20 md:py-24" >
        <div className="max-w-5xl mx-auto px-6 text-center">
          <span className="text-[#54765C] uppercase tracking-widest text-sm font-semibold">
            My Teaching Philosophy
          </span>
          <div className="text-7xl text-[#54765C] mt-8">
            “
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold leading-snug mt-3 mb-8">
            Education is not just about sharing
            knowledge, but about inspiring curiosity,
            creativity, and lifelong learning.
          </h2>
          <p className="text-[#54765C] font-semibold">
            — Teaching Philosophy
          </p>
        </div>
      </section >
      {/* CONTACT CTA */}
      < section className="py-20 md:py-24" >
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[#B38B59] uppercase tracking-widest text-sm font-semibold mb-5">
            Let's Connect
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-7">
            Interested in
            <span className="text-[#54765C]">
              {" "}Collaboration?
            </span>
          </h2>
          <p className="text-[#77796E] max-w-2xl mx-auto leading-8 mb-9">
            Open to academic discussions, research
            collaborations, student mentorship,
            and professional opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-9 py-4 bg-[#54765C] text-white rounded-full font-semibold hover:bg-[#405C47] transition"
            >
              Get in Touch →
            </Link>
            <Link
              to="/research"
              className="px-9 py-4 border border-[#B7C5B4] rounded-full font-semibold hover:bg-[#E9EEDC] transition"
            >
              Explore Research ↗
            </Link>
          </div>
        </div>
      </section >
    </div >
  );
}
export default About;