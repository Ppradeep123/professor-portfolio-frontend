
import { NavLink } from "react-router-dom";
import { BookOpen,Trophy,Images  } from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: "▦" },
  { name: "My Profile", path: "/admin/profile", icon: "♙" },
  { name: "Education", path: "/admin/education", icon: "🎓" },
  { name: "Teaching", path: "/admin/teaching", icon: BookOpen },

  { name: "Research", path: "/admin/research", icon: "◈" },
  {
    name: "Academic Activities",
    path: "/admin/academic-activities",
    icon: "📅"
  },
  {
  name: "Gallery",
  path: "/admin/gallery",
  icon: Images,
},
  {
    name: "E-Content",
    path: "/admin/e-content",
    icon: BookOpen,
  },
  {
    name: "Achievements & Awards",
    path: "/admin/achievements",
    icon: Trophy,
  },
  { name: "Publications", path: "/admin/publications", icon: "▤" },
  { name: "Inquiries", path: "/admin/inquiries", icon: "✉" },
  
  { name: "Settings", path: "/admin/settings", icon: "⚙" }
];

export default function AdminSidebar() {
  return (
    <aside
  className="w-full h-screen bg-[#41634C] text-white overflow-y-auto"
  style={{
    height: "100dvh",
    scrollbarWidth: "none",      // Firefox
    msOverflowStyle: "none",     // Older Edge
  }}
>
      <div className="p-5">
        <h2 className="text-xl font-bold mb-8">
          AcademicPortfolio.
        </h2>

        <nav className="space-y-2 pb-10">
          {menuItems.map((item) => {
            const IconComponent =
              typeof item.icon === "string" ? null : item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-[#66856F] font-semibold"
                      : "hover:bg-[#54765C]"
                  }`
                }
              >
                <span className="w-6 flex items-center justify-center shrink-0">
                  {IconComponent ? (
                    <IconComponent size={20} />
                  ) : (
                    item.icon
                  )}
                </span>

                <span className="text-sm">{item.name}</span>
                
              </NavLink>
              
            );
            
          })}
        </nav>
      </div>
    </aside>
  );
}