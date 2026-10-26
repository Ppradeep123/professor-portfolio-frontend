
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Public pages
import Home from "./pages/Home";
import About from "./pages/About";
import Research from "./pages/Research";
import Publications from "./pages/Publications";
import Contact from "./pages/Contact";
import Teaching from "./pages/Teaching";
import AcademicActivities from "./pages/AcademicActivities";
import EContent from "./pages/EContent";
// Admin pages
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ProfileAdmin from "./admin/ProfileAdmin";
import AdminLayout from "./admin/AdminLayout";
import ProtectedRoute from "./admin/ProtectedRoute";
import EducationAdmin from "./admin/EducationAdmin";
import ResearchAdmin from "./admin/ResearchAdmin";
import PublicationsAdmin from "./admin/PublicationsAdmin";
import TeachingAdmin from "./admin/TeachingAdmin";
import AcademicActivitiesAdmin from "./admin/AcademicActivitiesAdmin";
import EContentAdmin from "./admin/EContentAdmin";
import AchievementsAdmin from "./admin/AchievementsAdmin";
import Achievements from "./pages/Achievements";
import Gallery from "./pages/Gallery";
import GalleryAdmin from "./admin/GalleryAdmin";
import InquiriesAdmin from "./admin/InquiriesAdmin";
import SettingsAdmin from "./admin/SettingsAdmin";
// Public Layout
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC WEBSITE */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/research" element={<Research />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/teaching" element={<Teaching />} />
          <Route
            path="/academic-activities"
            element={<AcademicActivities />}
          />
          <Route
            path="/e-content"
            element={<EContent />}
          />
          <Route
            path="/achievements"
            element={<Achievements />}
          />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* ADMIN LOGIN */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* PROTECTED ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to="dashboard" replace />}
          />

          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="profile"
            element={<ProfileAdmin />}
          />

          <Route
            path="education"
            element={<EducationAdmin />}
          />

          <Route
            path="research"
            element={<ResearchAdmin />}
          />

          <Route
            path="publications"
            element={<PublicationsAdmin />}
          />

          <Route
            path="teaching"
            element={<TeachingAdmin />}
          />
          <Route
            path="achievements"
            element={<AchievementsAdmin />}
          />

          {/* Academic Activities WITH sidebar */}
          <Route
            path="academic-activities"
            element={<AcademicActivitiesAdmin />}
          />
          <Route
            path="e-content"
            element={<EContentAdmin />}
          />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="inquiries" element={<InquiriesAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
