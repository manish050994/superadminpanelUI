import React, { useEffect, useState } from "react";
import Layout from "../layouts/Collegelayout";

const API_BASE = "https://mynexus.co.in/api/api/timetables";

const initialForm = {
  day: "",
  time: "",
  subjectId: "",
  teacherId: "",
  courseId: "",
  section: "",
  validFrom: "",
  validTo: "",
};

const TimetablePage = () => {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const token = localStorage.getItem("token");
  const [file, setFile] = useState(null);

  // Fetch timetables
  const fetchTimetables = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTimetables(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetables();
  }, []);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Submit timetable entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      setForm(initialForm);
      fetchTimetables();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV file!");
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      setFile(null);
      fetchTimetables();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Download sample CSV
  const handleDownloadSample = async () => {
    try {
      const res = await fetch(`${API_BASE}/sample`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "timetable_sample.csv";
      a.click();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "#246fb2" }}>
          🗓️ Timetable Management
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-md mb-6">
          <input name="day" value={form.day} onChange={handleChange} placeholder="Day" required className="border px-3 py-2 rounded-lg w-full" />
          <input name="time" value={form.time} onChange={handleChange} placeholder="Time (HH:MM)" required className="border px-3 py-2 rounded-lg w-full" />
          <input name="subjectId" value={form.subjectId} onChange={handleChange} placeholder="Subject ID" required className="border px-3 py-2 rounded-lg w-full" />
          <input name="teacherId" value={form.teacherId} onChange={handleChange} placeholder="Teacher ID" required className="border px-3 py-2 rounded-lg w-full" />
          <input name="courseId" value={form.courseId} onChange={handleChange} placeholder="Course ID" required className="border px-3 py-2 rounded-lg w-full" />
          <input name="section" value={form.section} onChange={handleChange} placeholder="Section" required className="border px-3 py-2 rounded-lg w-full" />
          <input name="validFrom" type="date" value={form.validFrom} onChange={handleChange} placeholder="Valid From" required className="border px-3 py-2 rounded-lg w-full" />
          <input name="validTo" type="date" value={form.validTo} onChange={handleChange} placeholder="Valid To" required className="border px-3 py-2 rounded-lg w-full" />

          <button type="submit" disabled={loading} className="col-span-2 py-2 text-white font-semibold rounded-lg" style={{ backgroundColor: "#246fb2" }}>
            Add Timetable
          </button>
        </form>

        {/* File upload */}
        <div className="flex gap-2 mb-6">
          <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} className="border px-3 py-2 rounded-lg w-full" />
          <button onClick={handleUpload} className="px-4 py-2 bg-green-500 text-white rounded-lg">Upload CSV</button>
          <button onClick={handleDownloadSample} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Download Sample CSV</button>
        </div>

        {/* Loader */}
        {loading && <div className="text-center py-4"><div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full mx-auto"></div></div>}

        {/* Timetable list */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full border-collapse">
            <thead style={{ backgroundColor: "#246fb2" }}>
              <tr className="text-left text-white">
                <th className="p-3">Day</th>
                <th className="p-3">Time</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Teacher</th>
                <th className="p-3">Course</th>
                <th className="p-3">Section</th>
                <th className="p-3">Valid From</th>
                <th className="p-3">Valid To</th>
              </tr>
            </thead>
            <tbody>
              {timetables.length > 0 ? (
                timetables.map((tt) => (
                  <tr key={tt.id} className="border-b">
                    <td className="p-3">{tt.day}</td>
                    <td className="p-3">{tt.time}</td>
                    <td className="p-3">{tt.subjectId}</td>
                    <td className="p-3">{tt.teacherId}</td>
                    <td className="p-3">{tt.courseId}</td>
                    <td className="p-3">{tt.section}</td>
                    <td className="p-3">{tt.validFrom}</td>
                    <td className="p-3">{tt.validTo}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 text-center text-gray-500" colSpan={8}>No timetable entries found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default TimetablePage;
