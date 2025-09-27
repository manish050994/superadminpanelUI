import React, { useEffect, useState } from "react";
import Layout from "../layouts/Collegelayout";

const API_BASE = "https://mynexus.co.in/api/api";
const AttendancePage = () => {
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [file, setFile] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Fetch students by course
  const fetchStudents = async (courseId) => {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/students?course=${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStudents(data.data?.students || []);
      // Initialize attendance
      setAttendance((data.data?.students || []).map((s) => ({ studentId: s.id, status: "present" })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle attendance status change
  const handleStatusChange = (studentId, status) => {
    setAttendance(attendance.map(a => a.studentId === studentId ? { ...a, status } : a));
  };

  // Submit attendance
  const handleSubmit = async () => {
    if (!date) return alert("Please select a date!");
    setLoading(true);
    try {
      await fetch(`${API_BASE}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ date, attendances: attendance }),
      });
      alert("Attendance submitted successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Export attendance
  const handleExport = async () => {
    if (!fromDate || !toDate) return alert("Select from and to dates!");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/attendance/export?from=${fromDate}&to=${toDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance_${fromDate}_to_${toDate}.csv`;
      a.click();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Upload offline CSV
  const handleUpload = async () => {
    if (!file) return alert("Select a CSV file!");
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      await fetch(`${API_BASE}/attendance/upload-offline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      alert("File uploaded successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "#246fb2" }}>📋 Attendance Management</h1>

        {/* Course selection */}
        <div className="flex gap-2 mb-4">
          <input
            placeholder="Course ID (e.g., C10)"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          />
          <button onClick={() => fetchStudents(selectedCourse)} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Load Students</button>
        </div>

        {/* Attendance Date */}
        <div className="mb-4">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border px-3 py-2 rounded-lg" />
        </div>

        {/* Attendance Table */}
        {students.length > 0 && (
          <div className="bg-white shadow-md rounded-lg overflow-x-auto mb-4">
            <table className="w-full border-collapse">
              <thead style={{ backgroundColor: "#246fb2" }}>
                <tr className="text-left text-white">
                  <th className="p-3">Student</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => {
                  const status = attendance.find(a => a.studentId === s.id)?.status || "present";
                  return (
                    <tr key={s.id} className="border-b">
                      <td className="p-3">{s.name}</td>
                      <td className="p-3">
                        <select value={status} onChange={(e) => handleStatusChange(s.id, e.target.value)} className="border px-2 py-1 rounded-lg">
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg">Submit Attendance</button>
          </div>
        )}

        {/* Export Attendance */}
        <div className="flex gap-2 mb-4">
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border px-3 py-2 rounded-lg" />
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border px-3 py-2 rounded-lg" />
          <button onClick={handleExport} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Export CSV</button>
        </div>

        {/* Upload CSV */}
        <div className="flex gap-2 mb-6">
          <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} className="border px-3 py-2 rounded-lg" />
          <button onClick={handleUpload} className="px-4 py-2 bg-green-500 text-white rounded-lg">Upload CSV</button>
        </div>

        {loading && <div className="text-center py-4"><div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full mx-auto"></div></div>}
      </div>
    </Layout>
  );
};

export default AttendancePage;
