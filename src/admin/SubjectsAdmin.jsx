
import { useState } from "react";

export default function SubjectsAdmin() {
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");

  const addSubject = (e) => {
    e.preventDefault();

    const name = subjectName.trim();
    if (!name) return;

    setSubjects((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
      },
    ]);

    setSubjectName("");
  };

  const deleteSubject = (id) => {
    setSubjects((prev) =>
      prev.filter((subject) => subject.id !== id)
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="mb-5 text-2xl font-semibold text-[#41634C]">
        Manage Teaching Subjects
      </h2>

      <form onSubmit={addSubject} className="mb-6 flex gap-3">
        <input
          type="text"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          placeholder="Enter subject name"
          className="flex-1 rounded-lg border border-gray-300 p-3"
        />

        <button
          type="submit"
          className="rounded-lg bg-[#41634C] px-5 py-3 text-white"
        >
          Add Subject
        </button>
      </form>

      <div className="space-y-3">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <span>{subject.name}</span>

            <button
              type="button"
              onClick={() => deleteSubject(subject.id)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
