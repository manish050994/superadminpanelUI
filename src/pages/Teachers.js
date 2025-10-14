import React, { useEffect, useState } from "react";
import Layout from "../layouts/Collegelayout";

const API_BASE = "https://mynexus.co.in/api/api/teachers";
const COURSES_API = "https://mynexus.co.in/api/api/courses?page=1&limit=50";
const SUBJECTS_API = "https://mynexus.co.in/api/api/subjects?page=1&limit=50";

const initialForm = {
  name: "",
  employeeId: "",
  email: "",
  password: "",
  section: [],
  courseId: "",
  subjectId: "",
};

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch teachers
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?page=1&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTeachers(data.data?.teachers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses and subjects for dropdowns
  const fetchCourses = async () => {
    try {
      const res = await fetch(COURSES_API, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setCourses(data.data?.courses || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch(SUBJECTS_API, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setSubjects(data.data?.subjects || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchCourses();
    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
      const method = editingId ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });

      setForm(initialForm);
      setEditingId(null);
      fetchTeachers();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    setLoading(true);
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      fetchTeachers();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (teacher) => {
    setForm({
      name: teacher.name,
      employeeId: teacher.employeeId,
      email: teacher.email,
      password: "",
      section: teacher.section || [],
      courseId: teacher.courseId || "",
      subjectId: teacher.subjectId || "",
    });
    setEditingId(teacher.id);
  };

  const handleAssignCourse = async (teacherId) => {
    if (!form.courseId) return alert("Select a course to assign!");
    try {
      await fetch(`${API_BASE}/${teacherId}/assign-course`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseId: form.courseId }),
      });
      fetchTeachers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignSubject = async (teacherId) => {
    if (!form.subjectId) return alert("Select a subject to assign!");
    try {
      await fetch(`${API_BASE}/${teacherId}/assign-subject`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subjectId: form.subjectId }),
      });
      fetchTeachers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignGroup = async (teacherId) => {
    if (!form.section.length) return alert("Enter group to assign!");
    try {
      await fetch(`${API_BASE}/${teacherId}/assign-group`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ group: form.section[0] }), // assign first group
      });
      fetchTeachers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = async (type) => {
    try {
      const endpoint = type === "sample" ? "sample-csv" : "bulk";
      const res = await fetch(`${API_BASE}/${endpoint}`, { headers: { Authorization: `Bearer ${token}` } });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = type === "sample" ? `teachers_sample.csv` : `teachers_bulk.csv`;
      a.click();
    } catch (err) {
      console.error(err);
    }
  };
  const handleBulkUpload = async () => {
    if (!bulkFile) return alert("Select a file first!");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("csvFile", bulkFile);

      const res = await fetch(`${API_BASE}/bulk`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.status === 1) {
        alert("Teachers uploaded successfully!");
        setBulkFile(null);
        fetchTeachers();
      } else {
        alert(data.message || "Failed to upload teachers");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "#246fb2" }}>
          👩‍🏫 Teachers Management
        </h1>
        <div className="mt-4 flex gap-2 items-center">
          <input
            type="file"
            onChange={(e) => setBulkFile(e.target.files[0])}
            className="border px-3 py-2 rounded-lg"
          />
          <button
            onClick={handleBulkUpload}
            disabled={!bulkFile || loading}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Upload CSV
          </button>

          <button onClick={() => handleExport("sample")} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            Download Sample CSV
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-md mb-6">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Teacher Name" required className="border px-3 py-2 rounded-lg w-full" />
          <input name="employeeId" value={form.employeeId} onChange={handleChange} placeholder="Employee ID" required className="border px-3 py-2 rounded-lg w-full" />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className="border px-3 py-2 rounded-lg w-full" />
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="border px-3 py-2 rounded-lg w-full" />
          <input name="section" value={form.section} onChange={(e) => setForm({ ...form, section: [e.target.value] })} placeholder="Section" className="border px-3 py-2 rounded-lg w-full" />

          {/* Course Dropdown */}
          <select name="courseId" value={form.courseId} onChange={handleChange} className="border px-3 py-2 rounded-lg w-full">
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.code}>{c.name}</option>
            ))}
          </select>

          {/* Subject Dropdown */}
          <select name="subjectId" value={form.subjectId} onChange={handleChange} className="border px-3 py-2 rounded-lg w-full">
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <button type="submit" disabled={loading} className="col-span-2 py-2 text-white font-semibold rounded-lg" style={{ backgroundColor: "#246fb2" }}>
            {editingId ? "Update Teacher" : "Add Teacher"}
          </button>
        </form>

        {loading && <div className="text-center py-4"><div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full mx-auto"></div></div>}

        {/* Teachers Table */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full border-collapse">
            <thead style={{ backgroundColor: "#246fb2" }}>
              <tr className="text-left text-white">
                <th className="p-3">Name</th>
                <th className="p-3">Employee ID</th>
                <th className="p-3">Email</th>
                <th className="p-3">Section</th>
                <th className="p-3">Course</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length > 0 ? (
                teachers.map((t) => {
                  const course = courses.find((c) => c.code === t.courseId);
                  const subject = subjects.find((s) => s.id === t.subjectId);
                  return (
                    <tr key={t.id} className="border-b">
                      <td className="p-3">{t.name}</td>
                      <td className="p-3">{t.employeeId}</td>
                      <td className="p-3">{t.email}</td>
                      <td className="p-3">{t.section?.join(", ")}</td>
                      <td className="p-3">{course?.name || t.courseId}</td>
                      <td className="p-3">
                        {t.Subjects && t.Subjects.length > 0
                          ? t.Subjects.map((sub) => sub.name).join(", ")
                          : "No subjects"}
                      </td>
                      <td className="p-3 flex gap-2 flex-wrap">
                        <button onClick={() => handleEdit(t)} className="px-3 py-1 bg-yellow-400 text-white rounded-md text-sm">Edit</button>
                        <button onClick={() => handleAssignCourse(t.id)} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">Assign Course</button>
                        <button onClick={() => handleAssignSubject(t.id)} className="px-3 py-1 bg-green-500 text-white rounded-md text-sm">Assign Subject</button>
                        <button onClick={() => handleAssignGroup(t.id)} className="px-3 py-1 bg-purple-500 text-white rounded-md text-sm">Assign Group</button>
                        <button onClick={() => handleDelete(t.id)} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Delete</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="p-3 text-center text-gray-500" colSpan={7}>No teachers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={() => handleExport("sample")} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Download Sample CSV</button>
          <button onClick={() => handleExport("bulk")} className="px-4 py-2 bg-green-500 text-white rounded-lg">Bulk Upload</button>
        </div>
      </div>
    </Layout>
  );
};

export default TeachersPage;
