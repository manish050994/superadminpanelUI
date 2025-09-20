import React, { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { getCourses, createCourse, updateCourse, deleteCourses } from "./config/courseApi";
import axios from "axios";
import {
  UserCheck,
  ShieldCheck,
  LayoutDashboard,
  Users,
  FilePlus,
  BookOpen,
  Calendar,
  DollarSign,
  Bell,
  FileText,
  ClipboardList,
  UserPlus,
  UserMinus,
  Search,
  Download,
  UploadCloud,
  Printer,
  Settings,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit3,
  ToggleRight,
  ToggleLeft,
  Mail,
  Smartphone,
  Play,
  CalendarCheck,
} from "lucide-react";

// College Admin Panel (single-file demo React component)
// - Tailwind utility classes assumed available
// - Framer Motion for page transitions
// - Mock data and placeholder handlers for API wiring
// - Modules: Auth, Dashboard, StudentMgmt, TeacherMgmt, Courses, Attendance, Fees, Notifications, Reports, Leave

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 ${className}`}>{children}</div>
);

const TopBar = ({ title, onExport }) => {
  const [q, setQ] = useState("");
  return (
    <div className="sticky top-0 bg-white/80 backdrop-blur border-b z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white grid place-items-center font-bold">CA</div>
          <div>
            <p className="text-xs text-gray-500">College Admin</p>
            <h1 className="text-base font-semibold">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && alert(`Search: ${q}`)}
              className="w-64 rounded-xl border border-gray-300 px-3 py-2 pl-9"
              placeholder="Search students, teachers, invoices..."
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button onClick={onExport} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-600 text-white">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>
    </div>
  );
};

const SideNav = ({ active, onSelect }) => {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "students", label: "Student Management", icon: UserPlus },
    { key: "teachers", label: "Teacher Management", icon: Users },
    { key: "courses", label: "Courses & Subjects", icon: BookOpen },
    { key: "attendance", label: "Attendance Reports", icon: CalendarCheck },
    { key: "fees", label: "Fees Management", icon: DollarSign },
    { key: "notifications", label: "Notification Centre", icon: Bell },
    { key: "reports", label: "Reports & Exports", icon: FileText },
    { key: "leave", label: "Leave Approvals", icon: ClipboardList },
    { key: "settings", label: "Authentication & Roles", icon: ShieldCheck },
  ];

  return (
    <aside className="hidden md:block md:w-64 border-r bg-white">
      <div className="p-4 space-y-2">
        {items.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl transition ${active === key ? "bg-indigo-600 text-white" : "hover:bg-gray-100"
              }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

/* MOCK DATA */
const COURSES = [
  { id: "68b69560db08d5a5b1e17hghg", name: "B.Sc Computer Science" },
  { id: "68b69560db08d5a5b1e17gtry", name: "B.Com" },
  { id: "68b69560db08d5a5b1e17tred", name: "B.A. Economics" },
];

const initialStudents = [
  { id: "S001", name: "Asha Kumar", course: "C01", year: 2, section: "A", attendanceToday: true, feesDue: 0 },
  { id: "S002", name: "Rohit Sharma", course: "C01", year: 2, section: "B", attendanceToday: false, feesDue: 5000 },
  { id: "S003", name: "Neha Gupta", course: "C02", year: 1, section: "A", attendanceToday: true, feesDue: 0 },
];

const initialTeachers = [
  { id: "T01", name: "Dr. Vivek Rao", subjects: ["Algorithms"], groups: ["C01-Y2"] },
  { id: "T02", name: "Ms. Priya Singh", subjects: ["Economics"], groups: ["C03-Y1"] },
];

const initialLeaves = [
  { id: 1, teacherId: "T01", teacherName: "Dr. Vivek Rao", from: "2025-08-25", to: "2025-08-27", reason: "Conference", status: "Pending" },
  { id: 2, teacherId: "T02", teacherName: "Ms. Priya Singh", from: "2025-09-02", to: "2025-09-03", reason: "Medical", status: "Pending" },
];

export default function CollegeAdminPanel() {


  const token = localStorage.getItem("token");
  const [tab, setTab] = useState("dashboard");
  const [students, setStudents] = useState(initialStudents);
  const [teachers, setTeachers] = useState(initialTeachers);
  const [courses, setCourses] = useState(COURSES);
  const [leaves, setLeaves] = useState(initialLeaves);

  /* Authentication mock state */
  const [authConfig, setAuthConfig] = useState({ requireCollegeCode: true, rbacEnabled: true });

  const stats = useMemo(() => {
    const totalStudents = students.length;
    const totalTeachers = teachers.length;
    const feesCollected = 250000; // placeholder
    const presentToday = students.filter((s) => s.attendanceToday).length;
    return { totalStudents, totalTeachers, feesCollected, presentToday };
  }, [students, teachers]);

  /* Generic handlers */
  const handleExport = () => alert("Exporting data (wire to backend)");
  // const generateId = (prefix, list) => `${prefix}${String(list.length + 1).padStart(3, "0")}`;
  const generateId = (prefix, list) => {
    let id;
    const existingIds = new Set(list.map(item => item.id)); // पहले से मौजूद IDs

    do {
      // नया candidate ID generate करो
      id = `${prefix}${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
    } while (existingIds.has(id)); // अगर already exist है तो दोबारा try करो

    return id;
  };

  /* Student Management */
  // const addStudent = (payload) => setStudents((p) => [...p, payload]);
  // const updateStudent = (id, payload) => setStudents((p) => p.map((s) => (s.id === id ? { ...s, ...payload } : s)));
  // const deleteStudent = (id) => setStudents((p) => p.filter((s) => s.id !== id));
  const addStudent = async (payloads) => {
    console.log(payloads)
    const payload = {
      name: payloads.name,
      rollNo: payloads.id, // must be unique
      course: payloads.course, // ObjectId of an existing Course
      year: payloads.year,
      section: payloads.section,
      profilePic: "https://example.com/profile.jpg",
      feesPaid: true


      // "name": "John Doe",
      // "email": "john.doe@example.com",
      // "collegeId": "68b6f76e55a449490e4ebef0",  // the college _id
      // "course": "68b6e6e92d07e70e724d5fd8",    // the course _id
      // "rollNo": "2025CS101",
      // "year": 2,
      // "status": "active"


      // "name": "John Doe",
      // "rollNo": "2025CS1013343",
      // "course": "68b69560db08d5a5b1e17bde",   // Replace with a valid course _id from your DB
      // "year": 2,
      // "section": "A",
      // "profilePic": "https://example.com/profile.jpg",
      // "feesPaid": true,
      // "collegeId": "68b6f76e55a449490e4ebef0" // Replace with a valid college _id


    };

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/students",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents((p) => [...p, data]);
    } catch (err) {
      console.error("Error adding student:", err.response?.data || err.message);
    }
  };

  const updateStudent = async (id, payload) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/students/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents((p) => p.map((s) => (s._id === id ? { ...s, ...data } : s)));
    } catch (err) {
      console.error("Error updating student:", err.response?.data || err.message);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents((p) => p.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Error deleting student:", err.response?.data || err.message);
    }
  };
  /* Teacher Management */
  // const addTeacher = (payload) => setTeachers((p) => [...p, payload]);
  // const updateTeacher = (id, payload) => setTeachers((p) => p.map((t) => (t.id === id ? { ...t, ...payload } : t)));
  // const deleteTeacher = (id) => setTeachers((p) => p.filter((t) => t.id !== id));
  const addTeacher = async (payloads) => {
    console.log(payloads)


    const payload = {
      "name": payloads.name,
      "employeeId": payloads.id,
      "email": "john.doe@example.com",
      "subjects": payloads.subjects,
      "groups": payloads.groups,
    }
    try {
      const { data } = await axios.post("http://localhost:5000/api/teachers", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTeachers((p) => [...p, { ...data, id: data._id }]);
      alert("Teacher added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add teacher: " + err.response?.data?.message);
    }
  };

  const updateTeacher = async (id, payload) => {
    try {
      const { data } = await axios.put(`http://localhost:5000/api/teachers/${id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTeachers((p) =>
        p.map((t) => (t.id === data._id ? { ...data, id: data._id } : t))
      );
      alert("Teacher updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update teacher: " + err.response?.data?.message);
    }
  };

  const deleteTeacher = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/teachers/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTeachers((p) => p.filter((t) => t.id !== id));
      alert("Teacher deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete teacher: " + err.response?.data?.message);
    }
  };
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/teachers", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTeachers(data); // update state with API response
      } catch (err) {
        console.error(err);
        alert("Failed to fetch teachers: " + err.response?.data?.message);
      }
    };

    fetchTeachers();
  }, []);
  /* Course Management */
  // const addCourse = (course) => setCourses((c) => [...c, course]);
  // const deleteCourse = (id) => setCourses((c) => c.filter((x) => x.id !== id));
  const addCourse = async (course) => {
    const payload = {
      "code": course.id,
      "name": course.name,
      "subjects": []
    }
    try {
      const newCourse = await createCourse(payload); // Call backend API
      setCourses((c) => [...c, newCourse]);           // Update state with response
    } catch (error) {
      console.error("Failed to add course:", error);
    }
  };

  const deleteCourse = async (id) => {
    try {
      await deleteCourses(id);                       // Call backend API
      setCourses((c) => c.filter((x) => x._id !== id)); // Update state locally
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };
  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  useEffect(() => {
    fetchCourses()
  }, [])
  /* Leave approvals */
  const setLeaveStatus = (leaveId, status) => setLeaves((l) => l.map((x) => (x.id === leaveId ? { ...x, status } : x)));

  /* CSV Import (placeholder) */
  const handleImportCSV = (file) => {
    alert(`Importing ${file?.name || "file"} (parse CSV and map columns in backend)`);
  };

  /* Notification send (placeholder) */
  const sendNotification = ({ to, message, channels = ["email"] }) => {
    alert(`Sending notification to ${to} via ${channels.join(", ")}: ${message}`);
  };


  // GET API
  const fetchStudents = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);
  /* UI Components for modules (kept concise) */
  const Dashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <p className="text-sm text-gray-500">Quick overview of college metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-xl border" onClick={() => alert("Open academic year settings")}>Academic Year</button>
          <button className="px-3 py-2 rounded-xl bg-indigo-600 text-white" onClick={() => alert("Sync with central ERP")}>Sync</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-gray-500">Students</p>
          <p className="text-2xl font-semibold mt-2">{stats.totalStudents}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Teachers</p>
          <p className="text-2xl font-semibold mt-2">{stats.totalTeachers}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Fee Collections</p>
          <p className="text-2xl font-semibold mt-2">₹ {stats.feesCollected.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Present Today</p>
          <p className="text-2xl font-semibold mt-2">{stats.presentToday}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <h3 className="font-semibold">Today's Snapshot</h3>
          <p className="text-sm text-gray-500 mt-2">List of present students (quick view)</p>
          <ul className="mt-3 divide-y">
            {students.filter((s) => s.attendanceToday).map((s) => (
              <li key={s.id} className="py-2 flex items-center justify-between">
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-gray-500">{courses.find((c) => c.id === s.course)?.name || s.course} • Year {s.year} • Sec {s.section}</div>
                </div>
                <div className="text-sm text-gray-500">Present</div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="font-semibold">Actions</h3>
          <div className="mt-3 space-y-2">
            <button className="w-full px-3 py-2 rounded-xl border" onClick={() => alert("Generate today's attendance report")}>Export Attendance (CSV)</button>
            <button className="w-full px-3 py-2 rounded-xl border" onClick={() => alert("Open ID card generator")}>Generate ID Cards</button>
            <button className="w-full px-3 py-2 rounded-xl bg-indigo-600 text-white" onClick={() => alert("Notify absent parents")}>Notify Absentees</button>
          </div>
        </Card>
      </div>
    </div>
  );

  const StudentsModule = () => {
    const [q, setQ] = useState("");
    const [filter, setFilter] = useState({ course: "all", year: "all", section: "all" });
    const [editing, setEditing] = useState(null);
    const filtered = students.filter((s) => {
      if (q && !(`${s.name} ${s.id}`.toLowerCase().includes(q.toLowerCase()))) return false;
      if (filter.course !== "all" && s.course !== filter.course) return false;
      if (filter.year !== "all" && String(s.year) !== String(filter.year)) return false;
      if (filter.section !== "all" && s.section !== filter.section) return false;
      return true;
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Student Management</h2>
            <p className="text-sm text-gray-500">Add, edit, import and manage students</p>
          </div>
          <div className="flex items-center gap-2">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search students..." className="rounded-xl border px-3 py-2" />
            <div className="flex items-center gap-2">
              <select className="rounded-xl border px-3 py-2" value={filter.course} onChange={(e) => setFilter((f) => ({ ...f, course: e.target.value }))}>
                <option value="all">All Courses</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select className="rounded-xl border px-3 py-2" value={filter.year} onChange={(e) => setFilter((f) => ({ ...f, year: e.target.value }))}>
                <option value="all">All Years</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
              <select className="rounded-xl border px-3 py-2" value={filter.section} onChange={(e) => setFilter((f) => ({ ...f, section: e.target.value }))}>
                <option value="all">All Sections</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer">
              <UploadCloud className="w-4 h-4" />
              <input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" className="hidden" onChange={(e) => handleImportCSV(e.target.files?.[0])} />
              Import
            </label>
            <button className="px-3 py-2 rounded-xl bg-indigo-600 text-white" onClick={() => setEditing({ id: generateId("S", students), name: "", course: courses[0].id, year: 1, section: "A" })}>New Student</button>
          </div>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3">Section</th>
                  <th className="px-4 py-3">Attendance</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{s.rollNo}</td>
                    <td className="px-4 py-3">{s.name}</td>
                    <td className="px-4 py-3">{s.course}</td>
                    <td className="px-4 py-3">{s.year}</td>
                    <td className="px-4 py-3">{s.section}</td>
                    <td className="px-4 py-3">{s.attendanceToday ? "Present" : "Absent"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-gray-100" onClick={() => setEditing(s)} title="Edit"><Edit3 className="w-4 h-4" /></button>
                        <button className="p-2 rounded-lg hover:bg-gray-100" onClick={() => { deleteStudent(s._id); alert('Student deleted'); }} title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <AnimatePresence>
          {editing && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="fixed inset-0 z-50 grid place-items-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
              <div className="z-50 w-full max-w-2xl p-6">
                <Card>
                  <h3 className="font-semibold">{editing.id ? "Edit Student" : "New Student"}</h3>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* <input placeholder="roll number" className="rounded-xl border px-3 py-2" value={editing.rollNo} onChange={(e) => setEditing((p) => ({ ...p, rollNo: e.target.value }))} /> */}
                    <input className="rounded-xl border px-3 py-2" value={editing.name} onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))} placeholder="Name" />
                    <select className="rounded-xl border px-3 py-2" value={editing.course} onChange={(e) => setEditing((p) => ({ ...p, course: e.target.value }))}>
                      {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input type="number" className="rounded-xl border px-3 py-2" value={editing.year} onChange={(e) => setEditing((p) => ({ ...p, year: Number(e.target.value) }))} />
                    <input className="rounded-xl border px-3 py-2" value={editing.section} onChange={(e) => setEditing((p) => ({ ...p, section: e.target.value }))} />
                    {/* <input placeholder="college id" className="rounded-xl border px-3 py-2" value={editing.collegeId} onChange={(e) => setEditing((p) => ({ ...p, collegeId: e.target.value }))} /> */}
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button className="px-3 py-2 rounded-xl border" onClick={() => setEditing(null)}>Cancel</button>
                    <button className="px-3 py-2 rounded-xl bg-indigo-600 text-white" onClick={() => { if (students.some(s => s.id === editing.id)) updateStudent(editing._id, editing); else addStudent(editing); setEditing(null); }}>Save</button>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const TeachersModule = () => {
    const [editing, setEditing] = useState(null);

    return (
      // <div className="space-y-6">
      //   <div className="flex items-center justify-between">
      //     <div>
      //       <h2 className="text-lg font-semibold">Teacher Management</h2>
      //       <p className="text-sm text-gray-500">Add, assign subjects and approve leaves</p>
      //     </div>
      //     <div className="flex items-center gap-2">
      //       <button className="px-3 py-2 rounded-xl border" onClick={() => setEditing({ id: generateId("T", teachers), name: "", subjects: [], groups: [] })}>New Teacher</button>
      //     </div>
      //   </div>

      //   <Card>
      //     <div className="overflow-x-auto">
      //       <table className="w-full text-sm">
      //         <thead>
      //           <tr className="text-left text-gray-500">
      //             <th className="px-4 py-3">ID</th>
      //             <th className="px-4 py-3">Name</th>
      //             <th className="px-4 py-3">Subjects</th>
      //             <th className="px-4 py-3">Groups</th>
      //             <th className="px-4 py-3 text-right">Actions</th>
      //           </tr>
      //         </thead>
      //         <tbody>
      //           {teachers.map((t) => (
      //             <tr key={t.id} className="hover:bg-gray-50">
      //               <td className="px-4 py-3">{t.id}</td>
      //               <td className="px-4 py-3">{t.name}</td>
      //               <td className="px-4 py-3">{t.subjects.join(", ")}</td>
      //               <td className="px-4 py-3">{t.groups.join(", ")}</td>
      //               <td className="px-4 py-3 text-right">
      //                 <div className="inline-flex items-center gap-2">
      //                   <button className="p-2 rounded-lg hover:bg-gray-100" onClick={() => setEditing(t)} title="Edit"><Edit3 className="w-4 h-4" /></button>
      //                   <button className="p-2 rounded-lg hover:bg-gray-100" onClick={() => { deleteTeacher(t.id); alert('Teacher deleted'); }} title="Delete"><Trash2 className="w-4 h-4" /></button>
      //                 </div>
      //               </td>
      //             </tr>
      //           ))}
      //         </tbody>
      //       </table>
      //     </div>
      //   </Card>

      //   <AnimatePresence>
      //     {editing && (
      //       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="fixed inset-0 z-50 grid place-items-center">
      //         <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
      //         <div className="z-50 w-full max-w-2xl p-6">
      //           <Card>
      //             <h3 className="font-semibold">{editing.id ? "Edit Teacher" : "New Teacher"}</h3>
      //             <div className="mt-4 grid grid-cols-1 gap-3">
      //               <input className="rounded-xl border px-3 py-2" value={editing.name} onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))} placeholder="Name" />
      //               <input className="rounded-xl border px-3 py-2" value={editing.subjects?.join(", ") || ""} onChange={(e) => setEditing((p) => ({ ...p, subjects: e.target.value.split(",").map(s => s.trim()) }))} placeholder="Subjects (comma separated)" />
      //               <input className="rounded-xl border px-3 py-2" value={editing.groups?.join(", ") || ""} onChange={(e) => setEditing((p) => ({ ...p, groups: e.target.value.split(",").map(s => s.trim()) }))} placeholder="Groups (comma separated)" />
      //             </div>
      //             <div className="mt-4 flex items-center justify-end gap-2">
      //               <button className="px-3 py-2 rounded-xl border" onClick={() => setEditing(null)}>Cancel</button>
      //               <button className="px-3 py-2 rounded-xl bg-indigo-600 text-white" onClick={() => { if (teachers.some(t => t.id === editing.id)) updateTeacher(editing.id, editing); else addTeacher(editing); setEditing(null); }}>Save</button>
      //             </div>
      //           </Card>
      //         </div>
      //       </motion.div>
      //     )}
      //   </AnimatePresence>
      // </div>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Teacher Management</h2>
            <p className="text-sm text-gray-500">
              Add, assign subjects and approve leaves
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 rounded-xl border"
              onClick={() =>
                setEditing({
                  id: generateId("T", teachers),
                  name: "",
                  subjects: [],
                  groups: [],
                })
              }
            >
              New Teacher
            </button>
          </div>
        </div>

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Subjects</th>
                  <th className="px-4 py-3">Groups</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{t.employeeId}</td>
                    <td className="px-4 py-3">{t.name}</td>
                    <td className="px-4 py-3">{t.subjects?.join(", ")}</td>
                    <td className="px-4 py-3">{t.groups?.join(", ")}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          className="p-2 rounded-lg hover:bg-gray-100"
                          onClick={() => setEditing(t)}
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-gray-100"
                          onClick={() => deleteTeacher(t.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal */}
        <AnimatePresence>
          {editing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed inset-0 z-50 grid place-items-center"
            >
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setEditing(null)}
              />
              <div className="z-50 w-full max-w-2xl p-6">
                <Card>
                  <h3 className="font-semibold">
                    {teachers.some((t) => t.id === editing.id)
                      ? "Edit Teacher"
                      : "New Teacher"}
                  </h3>
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <input
                      className="rounded-xl border px-3 py-2"
                      value={editing.name}
                      onChange={(e) =>
                        setEditing((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Name"
                    />
                    <input
                      className="rounded-xl border px-3 py-2"
                      value={editing.subjects?.join(", ") || ""}
                      onChange={(e) =>
                        setEditing((p) => ({
                          ...p,
                          subjects: e.target.value
                            .split(",")
                            .map((s) => s.trim()),
                        }))
                      }
                      placeholder="Subjects (comma separated)"
                    />
                    <input
                      className="rounded-xl border px-3 py-2"
                      value={editing.groups?.join(", ") || ""}
                      onChange={(e) =>
                        setEditing((p) => ({
                          ...p,
                          groups: e.target.value.split(",").map((s) => s.trim()),
                        }))
                      }
                      placeholder="Groups (comma separated)"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                      className="px-3 py-2 rounded-xl border"
                      onClick={() => setEditing(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-2 rounded-xl bg-indigo-600 text-white"
                      onClick={async () => {
                        if (teachers.some((t) => t.id === editing.id)) {
                          await updateTeacher(editing.id, editing);
                        } else {
                          await addTeacher(editing);
                        }
                        setEditing(null);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    );
  };

  const CoursesModule = () => {
    const [editing, setEditing] = useState(null);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Courses & Subjects</h2>
            <p className="text-sm text-gray-500">Create courses, subjects and link with teachers</p>
          </div>
          <div>
            <button className="px-3 py-2 rounded-xl bg-indigo-600 text-white" onClick={() => setEditing({ id: generateId("C", courses), name: "New Course", subjects: [] })}>New Course</button>
          </div>
        </div>

        <Card>
          <div className="space-y-3">
            {courses.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl border">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.id}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 rounded-xl border" onClick={() => { alert('Open subject manager for ' + c.name); }}>Manage Subjects</button>
                  <button className="px-3 py-2 rounded-xl border" onClick={() => { deleteCourse(c._id); }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <AnimatePresence>
          {editing && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="fixed inset-0 z-50 grid place-items-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
              <div className="z-50 w-full max-w-2xl p-6">
                <Card>
                  <h3 className="font-semibold">{editing.id ? "Edit Course" : "New Course"}</h3>
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <input className="rounded-xl border px-3 py-2" value={editing.name} onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))} placeholder="Course name" />
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button className="px-3 py-2 rounded-xl border" onClick={() => setEditing(null)}>Cancel</button>
                    <button className="px-3 py-2 rounded-xl bg-indigo-600 text-white" onClick={() => { addCourse(editing); setEditing(null); }}>Save</button>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const AttendanceModule = () => {
    const [period, setPeriod] = useState("daily");

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Attendance Reports</h2>
            <p className="text-sm text-gray-500">Daily, weekly or monthly attendance exports and views</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="rounded-xl border px-3 py-2">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <button className="px-3 py-2 rounded-xl border" onClick={() => alert(`Export ${period} attendance`)}>Export</button>
          </div>
        </div>

        <Card>
          <p className="text-sm text-gray-500">Filters: by class, date range, student</p>
          <div className="mt-3">
            <button className="px-3 py-2 rounded-xl border" onClick={() => alert('Show student-specific view')}>Student View</button>
            <button className="px-3 py-2 rounded-xl border ml-2" onClick={() => alert('Teacher view')}>Teacher View</button>
          </div>
        </Card>
      </div>
    );
  };

  const FeesModule = () => {
    const [invoices, setInvoices] = useState([]);

    const createInvoice = (studentId, amount) => {
      setInvoices((p) => [...p, { id: `INV-${p.length + 1}`, studentId, amount, date: new Date().toISOString().slice(0, 10), status: "Pending" }]);
      alert(`Invoice generated for ${studentId}: ₹${amount}`);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Fees Management</h2>
            <p className="text-sm text-gray-500">Create fee structures, send invoices and reminders</p>
          </div>
          <div>
            <button className="px-3 py-2 rounded-xl bg-indigo-600 text-white" onClick={() => createInvoice('S001', 25000)}>Generate Sample Invoice</button>
          </div>
        </div>

        <Card>
          <p className="text-sm text-gray-500">Course-wise fee structures, invoice history and reminders</p>
          <div className="mt-3 space-y-2">
            <button className="px-3 py-2 rounded-xl border" onClick={() => alert('Send email/SMS reminders')}>Send Reminders</button>
            <button className="px-3 py-2 rounded-xl border" onClick={() => alert('Download payment history (Excel)')}>Export Payments</button>
          </div>
        </Card>
      </div>
    );
  };

  const NotificationsModule = () => {
    const [payload, setPayload] = useState({ to: "all", message: "" });

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Notification Centre</h2>
            <p className="text-sm text-gray-500">Send targeted notifications via Email / SMS / WhatsApp / Push</p>
          </div>
          <div>
            <button className="px-3 py-2 rounded-xl bg-indigo-600 text-white" onClick={() => sendNotification({ to: payload.to, message: payload.message || 'Test message', channels: ['email'] })}>Send</button>
          </div>
        </div>

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select className="rounded-xl border px-3 py-2" value={payload.to} onChange={(e) => setPayload((p) => ({ ...p, to: e.target.value }))}>
              <option value="all">All</option>
              <option value="students">Students</option>
              <option value="parents">Parents</option>
              <option value="teachers">Teachers</option>
            </select>
            <input className="col-span-2 rounded-xl border px-3 py-2" value={payload.message} onChange={(e) => setPayload((p) => ({ ...p, message: e.target.value }))} placeholder="Message text" />
          </div>
          <div className="mt-3 text-sm text-gray-500">You can filter recipients by class, group, or individual after selecting a target audience.</div>
        </Card>
      </div>
    );
  };

  const ReportsModule = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Reports & Exports</h2>
          <p className="text-sm text-gray-500">Downloadable report cards, academic progress and consolidated attendance</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-xl border" onClick={() => alert('Generate report cards PDF')}>Report Cards (PDF)</button>
          <button className="px-3 py-2 rounded-xl border" onClick={() => alert('Export consolidated attendance')}>Attendance (Excel)</button>
        </div>
      </div>

      <Card>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Academic Progress Reports</div>
              <div className="font-medium">Generate term-wise progress</div>
            </div>
            <div>
              <button className="px-3 py-2 rounded-xl border" onClick={() => alert('Download progress reports')}>Download</button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const LeaveModule = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Leave Approvals</h2>
          <p className="text-sm text-gray-500">Approve or reject teacher leave requests with comments</p>
        </div>
      </div>

      <Card>
        <div className="space-y-3">
          {leaves.map((l) => (
            <div key={l.id} className="p-3 rounded-xl border flex items-center justify-between">
              <div>
                <div className="font-medium">{l.teacherName}</div>
                <div className="text-xs text-gray-500">{l.from} → {l.to} • {l.reason}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 rounded-xl border" onClick={() => setLeaveStatus(l.id, 'Rejected')}>Reject</button>
                <button className="px-3 py-2 rounded-xl bg-indigo-600 text-white" onClick={() => setLeaveStatus(l.id, 'Approved')}>Approve</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const SettingsModule = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Authentication & Roles</h2>
          <p className="text-sm text-gray-500">College-level login with college code and RBAC for sub-admins</p>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Require College Code</div>
              <div className="text-xs text-gray-500">Require admins to enter college-specific code at login</div>
            </div>
            <div>
              <button className={`px-3 py-2 rounded-xl ${authConfig.requireCollegeCode ? 'bg-indigo-600 text-white' : 'border'}`} onClick={() => setAuthConfig(a => ({ ...a, requireCollegeCode: !a.requireCollegeCode }))}>{authConfig.requireCollegeCode ? 'On' : 'Off'}</button>
            </div>
          </label>

          <label className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Role-based Access Control (RBAC)</div>
              <div className="text-xs text-gray-500">Create sub-admin roles and assign permissions</div>
            </div>
            <div>
              <button className={`px-3 py-2 rounded-xl ${authConfig.rbacEnabled ? 'bg-indigo-600 text-white' : 'border'}`} onClick={() => setAuthConfig(a => ({ ...a, rbacEnabled: !a.rbacEnabled }))}>{authConfig.rbacEnabled ? 'Enabled' : 'Disabled'}</button>
            </div>
          </label>
        </div>

        <div className="mt-4">
          <button className="px-3 py-2 rounded-xl border" onClick={() => alert('Manage roles & permissions')}>Manage Roles</button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title="College Admin Panel" onExport={handleExport} />
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <SideNav active={tab} onSelect={setTab} />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18 }}>
              {tab === 'dashboard' && <Dashboard />}
              {tab === 'students' && <StudentsModule />}
              {tab === 'teachers' && <TeachersModule />}
              {tab === 'courses' && <CoursesModule />}
              {tab === 'attendance' && <AttendanceModule />}
              {tab === 'fees' && <FeesModule />}
              {tab === 'notifications' && <NotificationsModule />}
              {tab === 'reports' && <ReportsModule />}
              {tab === 'leave' && <LeaveModule />}
              {tab === 'settings' && <SettingsModule />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <footer className="max-w-7xl mx-auto px-4 pb-8 text-xs text-gray-500">
        <div className="flex items-center gap-2"> <small>© 2025 College Admin Panel · Demo UI</small></div>
      </footer>
    </div>
  );
}
