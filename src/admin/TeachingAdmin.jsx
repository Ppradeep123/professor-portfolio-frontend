
import { useState } from "react";
import TeachingModule from "./components/TeachingModule";
import SubjectsAdmin from "./SubjectsAdmin";

const tabs = [
  { id: "subjects", label: "Subjects Taught" },
  { id: "experience", label: "Teaching Experience" },
  { id: "timetable", label: "Teaching Timetable" },
  { id: "guidance", label: "Student Guidance" },
  
];

const moduleFields = {
  experience: [
    { name: "institution", label: "Institution", required: true },
    { name: "designation", label: "Designation", required: true },
    { name: "department", label: "Department" },
    { name: "start_date", label: "Start Date", type: "date" },
    { name: "end_date", label: "End Date", type: "date" },
    { name: "description", label: "Responsibilities", type: "textarea" }
  ],

  timetable: [
    { name: "subject", label: "Subject", required: true },
    {
      name: "day_of_week",
      label: "Day",
      required: true,
      options: [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday"
      ]
    },
    { name: "start_time", label: "Start Time", type: "time", required: true },
    { name: "end_time", label: "End Time", type: "time", required: true },
    { name: "classroom", label: "Classroom" },
    { name: "academic_year", label: "Academic Year" }
  ],

  guidance: [
    { name: "project_title", label: "Project Title", required: true },
    { name: "student_names", label: "Student Names", type: "textarea" },
    { name: "programme", label: "Programme" },
    { name: "academic_year", label: "Academic Year" },
    { name: "guidance_type", label: "Guidance Type" },
    { name: "description", label: "Description", type: "textarea" }
  ],

  methods: [
    { name: "method_name", label: "Teaching Method", required: true },
    { name: "tools", label: "Tools / Technologies" },
    { name: "description", label: "Description", type: "textarea" }
  ]
};

export default function TeachingAdmin() {
  const [activeTab, setActiveTab] = useState("subjects");

  const selectedTab = tabs.find(
    (tab) => tab.id === activeTab
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#41634C]">
          Teaching Management
        </h1>
        <p className="text-gray-500 mt-2">
          Manage subjects, experience, timetables,
          student guidance and teaching methods.
        </p>
      </div>

      <div className="bg-white border border-[#E9E5DB] rounded-xl p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#54765C] text-white"
                  : "text-gray-600 hover:bg-[#F8F7F2]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "subjects" ? (
        <SubjectsAdmin />
      ) : (
        <TeachingModule
          key={activeTab}
          module={activeTab}
          title={selectedTab.label}
          fields={moduleFields[activeTab]}
        />
      )}
    </div>
  );
}
