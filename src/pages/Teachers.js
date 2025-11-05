// import React, { useEffect, useState } from "react";
// import Layout from "../layouts/Collegelayout";

// const API_BASE = "https://mynexus.co.in/api/api/teachers";
// const COURSES_API = "https://mynexus.co.in/api/api/courses?page=1&limit=50";
// const SUBJECTS_API = "https://mynexus.co.in/api/api/subjects?page=1&limit=50";

// const initialForm = {
//   name: "",
//   employeeId: "",
//   email: "",
//   password: "",
//   section: [],
//   courseId: "",
//   subjectId: "",
// };

// const TeachersPage = () => {
//   const [teachers, setTeachers] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState(initialForm);
//   const [editingId, setEditingId] = useState(null);
//   const [bulkFile, setBulkFile] = useState(null);
//   const token = localStorage.getItem("token");

//   // Fetch teachers
//   const fetchTeachers = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}?page=1&limit=10`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setTeachers(data.data?.teachers || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch courses and subjects for dropdowns
//   const fetchCourses = async () => {
//     try {
//       const res = await fetch(COURSES_API, { headers: { Authorization: `Bearer ${token}` } });
//       const data = await res.json();
//       setCourses(data.data?.courses || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchSubjects = async () => {
//     try {
//       const res = await fetch(SUBJECTS_API, { headers: { Authorization: `Bearer ${token}` } });
//       const data = await res.json();
//       setSubjects(data.data?.subjects || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchTeachers();
//     fetchCourses();
//     fetchSubjects();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
//       const method = editingId ? "PUT" : "POST";

//       await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(form),
//       });

//       setForm(initialForm);
//       setEditingId(null);
//       fetchTeachers();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure?")) return;
//     setLoading(true);
//     try {
//       await fetch(`${API_BASE}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
//       fetchTeachers();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (teacher) => {
//     setForm({
//       name: teacher.name,
//       employeeId: teacher.employeeId,
//       email: teacher.email,
//       password: "",
//       section: teacher.section || [],
//       courseId: teacher.courseId || "",
//       subjectId: teacher.subjectId || "",
//     });
//     setEditingId(teacher.id);
//   };

//   const handleAssignCourse = async (teacherId) => {
//     if (!form.courseId) return alert("Select a course to assign!");
//     try {
//       await fetch(`${API_BASE}/${teacherId}/assign-course`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ courseId: form.courseId }),
//       });
//       fetchTeachers();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleAssignSubject = async (teacherId) => {
//     if (!form.subjectId) return alert("Select a subject to assign!");
//     try {
//       await fetch(`${API_BASE}/${teacherId}/assign-subject`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ subjectId: form.subjectId }),
//       });
//       fetchTeachers();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleAssignGroup = async (teacherId) => {
//     if (!form.section.length) return alert("Enter group to assign!");
//     try {
//       await fetch(`${API_BASE}/${teacherId}/assign-group`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ group: form.section[0] }), // assign first group
//       });
//       fetchTeachers();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleExport = async (type) => {
//     try {
//       const endpoint = type === "sample" ? "sample-csv" : "bulk";
//       const res = await fetch(`${API_BASE}/${endpoint}`, { headers: { Authorization: `Bearer ${token}` } });
//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = type === "sample" ? `teachers_sample.csv` : `teachers_bulk.csv`;
//       a.click();
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   const handleBulkUpload = async () => {
//     if (!bulkFile) return alert("Select a file first!");
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("csvFile", bulkFile);

//       const res = await fetch(`${API_BASE}/bulk`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       const data = await res.json();
//       if (data.status === 1) {
//         alert("Teachers uploaded successfully!");
//         setBulkFile(null);
//         fetchTeachers();
//       } else {
//         alert(data.message || "Failed to upload teachers");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error uploading file");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-6" style={{ color: "#246fb2" }}>
//           👩‍🏫 Teachers Management
//         </h1>
//         <div className="mt-4 flex gap-2 items-center">
//           <input
//             type="file"
//             onChange={(e) => setBulkFile(e.target.files[0])}
//             className="border px-3 py-2 rounded-lg"
//           />
//           <button
//             onClick={handleBulkUpload}
//             disabled={!bulkFile || loading}
//             className="px-4 py-2 bg-green-500 text-white rounded-lg"
//           >
//             Upload CSV
//           </button>

//           <button onClick={() => handleExport("sample")} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
//             Download Sample CSV
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-md mb-6">
//           <input name="name" value={form.name} onChange={handleChange} placeholder="Teacher Name" required className="border px-3 py-2 rounded-lg w-full" />
//           <input name="employeeId" value={form.employeeId} onChange={handleChange} placeholder="Employee ID" required className="border px-3 py-2 rounded-lg w-full" />
//           <input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="off" placeholder="Email" required className="border px-3 py-2 rounded-lg w-full" />
//           <input name="password" type="password" value={form.password} onChange={handleChange} autoComplete="new-password" placeholder="Password" className="border px-3 py-2 rounded-lg w-full" />
//           <input name="section" value={form.section} onChange={(e) => setForm({ ...form, section: [e.target.value] })} placeholder="Section" className="border px-3 py-2 rounded-lg w-full" />

//           {/* Course Dropdown */}
//           <select name="courseId" value={form.courseId} onChange={handleChange} className="border px-3 py-2 rounded-lg w-full">
//             <option value="">Select Course</option>
//             {courses.map((c) => (
//               <option key={c.id} value={c.code}>{c.name}</option>
//             ))}
//           </select>

//           {/* Subject Dropdown */}
//           <select name="subjectId" value={form.subjectId} onChange={handleChange} className="border px-3 py-2 rounded-lg w-full">
//             <option value="">Select Subject</option>
//             {subjects.map((s) => (
//               <option key={s.id} value={s.id}>{s.name}</option>
//             ))}
//           </select>

//           <button type="submit" disabled={loading} className="col-span-2 py-2 text-white font-semibold rounded-lg" style={{ backgroundColor: "#246fb2" }}>
//             {editingId ? "Update Teacher" : "Add Teacher"}
//           </button>
//         </form>

//         {loading && <div className="text-center py-4"><div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full mx-auto"></div></div>}

//         {/* Teachers Table */}
//         <div className="bg-white shadow-md rounded-lg overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead style={{ backgroundColor: "#246fb2" }}>
//               <tr className="text-left text-white">
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Employee ID</th>
//                 <th className="p-3">Email</th>
//                 <th className="p-3">Section</th>
//                 <th className="p-3">Course</th>
//                 <th className="p-3">Subject</th>
//                 <th className="p-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {teachers.length > 0 ? (
//                 teachers.map((t) => {
//                   const course = courses.find((c) => c.code === t.courseId);
//                   const subject = subjects.find((s) => s.id === t.subjectId);
//                   return (
//                     <tr key={t.id} className="border-b">
//                       <td className="p-3">{t.name}</td>
//                       <td className="p-3">{t.employeeId}</td>
//                       <td className="p-3">{t.email}</td>
//                       <td className="p-3">{t.section?.join(", ")}</td>
//                       <td className="p-3">{course?.name || t.courseId}</td>
//                       <td className="p-3">
//                         {t.Subjects && t.Subjects.length > 0
//                           ? t.Subjects.map((sub) => sub.name).join(", ")
//                           : "No subjects"}
//                       </td>
//                       <td className="p-3 flex gap-2 flex-wrap">
//                         <button onClick={() => handleEdit(t)} className="px-3 py-1 bg-yellow-400 text-white rounded-md text-sm">Edit</button>
//                         <button onClick={() => handleAssignCourse(t.id)} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">Assign Course</button>
//                         <button onClick={() => handleAssignSubject(t.id)} className="px-3 py-1 bg-green-500 text-white rounded-md text-sm">Assign Subject</button>
//                         <button onClick={() => handleAssignGroup(t.id)} className="px-3 py-1 bg-purple-500 text-white rounded-md text-sm">Assign Group</button>
//                         <button onClick={() => handleDelete(t.id)} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Delete</button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td className="p-3 text-center text-gray-500" colSpan={7}>No teachers found</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="mt-4 flex gap-2">
//           <button onClick={() => handleExport("sample")} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Download Sample CSV</button>
//           <button onClick={() => handleExport("bulk")} className="px-4 py-2 bg-green-500 text-white rounded-lg">Bulk Upload</button>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default TeachersPage;



// import React, { useEffect, useState } from "react";
// import Layout from "../layouts/Collegelayout";

// const API_BASE = "https://mynexus.co.in/api/api/teachers";
// const COURSES_API = "https://mynexus.co.in/api/api/courses?page=1&limit=50";
// const SUBJECTS_API = "https://mynexus.co.in/api/api/subjects?page=1&limit=50";

// const initialForm = {
//   name: "",
//   employeeId: "",
//   email: "",
//   password: "",
//   section: [],
//   courseId: "",
//   subjectId: "",
// };

// const TeachersPage = () => {
//   const [teachers, setTeachers] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState(initialForm);
//   const [editingId, setEditingId] = useState(null);
//   const [bulkFile, setBulkFile] = useState(null);
//   const token = localStorage.getItem("token");

//   // Pagination states
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0
//   });

//   // Fetch teachers with pagination
//   const fetchTeachers = async (page = 1, limit = 10) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}?page=${page}&limit=${limit}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
      
//       if (data.data) {
//         setTeachers(data.data.teachers || []);
//         setPagination({
//           page: data.data.page || page,
//           limit: data.data.limit || limit,
//           total: data.data.total || 0,
//           totalPages: Math.ceil((data.data.total || 0) / (data.data.limit || limit))
//         });
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch courses and subjects for dropdowns
//   const fetchCourses = async () => {
//     try {
//       const res = await fetch(COURSES_API, { headers: { Authorization: `Bearer ${token}` } });
//       const data = await res.json();
//       setCourses(data.data?.courses || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchSubjects = async () => {
//     try {
//       const res = await fetch(SUBJECTS_API, { headers: { Authorization: `Bearer ${token}` } });
//       const data = await res.json();
//       setSubjects(data.data?.subjects || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchTeachers();
//     fetchCourses();
//     fetchSubjects();
//   }, []);

//   // Pagination handler
//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       fetchTeachers(newPage, pagination.limit);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
//       const method = editingId ? "PUT" : "POST";

//       await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(form),
//       });

//       setForm(initialForm);
//       setEditingId(null);
//       fetchTeachers(pagination.page, pagination.limit);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure?")) return;
//     setLoading(true);
//     try {
//       await fetch(`${API_BASE}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
//       fetchTeachers(pagination.page, pagination.limit);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (teacher) => {
//     setForm({
//       name: teacher.name,
//       employeeId: teacher.employeeId,
//       email: teacher.email,
//       password: "",
//       section: teacher.section || [],
//       courseId: teacher.courseId || "",
//       subjectId: teacher.subjectId || "",
//     });
//     setEditingId(teacher.id);
//   };

//   const handleAssignCourse = async (teacherId) => {
//     if (!form.courseId) return alert("Select a course to assign!");
//     try {
//       await fetch(`${API_BASE}/${teacherId}/assign-course`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ courseId: form.courseId }),
//       });
//       fetchTeachers(pagination.page, pagination.limit);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleAssignSubject = async (teacherId) => {
//     if (!form.subjectId) return alert("Select a subject to assign!");
//     try {
//       await fetch(`${API_BASE}/${teacherId}/assign-subject`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ subjectId: form.subjectId }),
//       });
//       fetchTeachers(pagination.page, pagination.limit);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleAssignGroup = async (teacherId) => {
//     if (!form.section.length) return alert("Enter group to assign!");
//     try {
//       await fetch(`${API_BASE}/${teacherId}/assign-group`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ group: form.section[0] }), // assign first group
//       });
//       fetchTeachers(pagination.page, pagination.limit);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleExport = async (type) => {
//     try {
//       const endpoint = type === "sample" ? "sample-csv" : "bulk";
//       const res = await fetch(`${API_BASE}/${endpoint}`, { headers: { Authorization: `Bearer ${token}` } });
//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = type === "sample" ? `teachers_sample.csv` : `teachers_bulk.csv`;
//       a.click();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleBulkUpload = async () => {
//     if (!bulkFile) return alert("Select a file first!");
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("csvFile", bulkFile);

//       const res = await fetch(`${API_BASE}/bulk`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       const data = await res.json();
//       if (data.status === 1) {
//         alert("Teachers uploaded successfully!");
//         setBulkFile(null);
//         fetchTeachers(pagination.page, pagination.limit);
//       } else {
//         alert(data.message || "Failed to upload teachers");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error uploading file");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Pagination Component
//   const Pagination = () => (
//     <div className="flex items-center justify-between mt-4 p-3 border-t">
//       <div className="text-sm text-gray-600">
//         Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} teachers
//       </div>
//       <div className="flex gap-1">
//         <button
//           onClick={() => handlePageChange(pagination.page - 1)}
//           disabled={pagination.page === 1}
//           className="px-3 py-1 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//         >
//           Previous
//         </button>
        
//         {/* Page numbers */}
//         {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//           let pageNum;
//           if (pagination.totalPages <= 5) {
//             pageNum = i + 1;
//           } else if (pagination.page <= 3) {
//             pageNum = i + 1;
//           } else if (pagination.page >= pagination.totalPages - 2) {
//             pageNum = pagination.totalPages - 4 + i;
//           } else {
//             pageNum = pagination.page - 2 + i;
//           }
          
//           return (
//             <button
//               key={pageNum}
//               onClick={() => handlePageChange(pageNum)}
//               className={`px-3 py-1 rounded border text-sm ${
//                 pagination.page === pageNum 
//                   ? 'bg-blue-600 text-white border-blue-600' 
//                   : 'hover:bg-gray-50'
//               }`}
//             >
//               {pageNum}
//             </button>
//           );
//         })}
        
//         <button
//           onClick={() => handlePageChange(pagination.page + 1)}
//           disabled={pagination.page === pagination.totalPages}
//           className="px-3 py-1 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <Layout>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-6" style={{ color: "#246fb2" }}>
//           👩‍🏫 Teachers Management
//         </h1>
        
//         {/* Bulk Upload Section */}
//         <div className="mt-4 flex gap-2 items-center mb-6">
//           <input
//             type="file"
//             onChange={(e) => setBulkFile(e.target.files[0])}
//             className="border px-3 py-2 rounded-lg"
//           />
//           <button
//             onClick={handleBulkUpload}
//             disabled={!bulkFile || loading}
//             className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50"
//           >
//             Upload CSV
//           </button>

//           <button onClick={() => handleExport("sample")} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
//             Download Sample CSV
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-md mb-6">
//           <input name="name" value={form.name} onChange={handleChange} placeholder="Teacher Name" required className="border px-3 py-2 rounded-lg w-full" />
//           <input name="employeeId" value={form.employeeId} onChange={handleChange} placeholder="Employee ID" required className="border px-3 py-2 rounded-lg w-full" />
//           <input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="off" placeholder="Email" required className="border px-3 py-2 rounded-lg w-full" />
//           <input name="password" type="password" value={form.password} onChange={handleChange} autoComplete="new-password" placeholder="Password" className="border px-3 py-2 rounded-lg w-full" />
//           <input name="section" value={form.section} onChange={(e) => setForm({ ...form, section: [e.target.value] })} placeholder="Section" className="border px-3 py-2 rounded-lg w-full" />

//           {/* Course Dropdown */}
//           <select name="courseId" value={form.courseId} onChange={handleChange} className="border px-3 py-2 rounded-lg w-full">
//             <option value="">Select Course</option>
//             {courses.map((c) => (
//               <option key={c.id} value={c.code}>{c.name}</option>
//             ))}
//           </select>

//           {/* Subject Dropdown */}
//           <select name="subjectId" value={form.subjectId} onChange={handleChange} className="border px-3 py-2 rounded-lg w-full">
//             <option value="">Select Subject</option>
//             {subjects.map((s) => (
//               <option key={s.id} value={s.id}>{s.name}</option>
//             ))}
//           </select>

//           <button type="submit" disabled={loading} className="col-span-2 py-2 text-white font-semibold rounded-lg disabled:opacity-50" style={{ backgroundColor: "#246fb2" }}>
//             {editingId ? "Update Teacher" : "Add Teacher"}
//           </button>
//         </form>

//         {loading && <div className="text-center py-4"><div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full mx-auto"></div></div>}

//         {/* Teachers Table */}
//         <div className="bg-white shadow-md rounded-lg overflow-x-auto mb-6">
//           <table className="w-full border-collapse">
//             <thead style={{ backgroundColor: "#246fb2" }}>
//               <tr className="text-left text-white">
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Employee ID</th>
//                 <th className="p-3">Email</th>
//                 <th className="p-3">Section</th>
//                 <th className="p-3">Course</th>
//                 <th className="p-3">Subject</th>
//                 <th className="p-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {teachers.length > 0 ? (
//                 teachers.map((t) => {
//                   const course = courses.find((c) => c.code === t.courseId);
//                   const subject = subjects.find((s) => s.id === t.subjectId);
//                   return (
//                     <tr key={t.id} className="border-b">
//                       <td className="p-3">{t.name}</td>
//                       <td className="p-3">{t.employeeId}</td>
//                       <td className="p-3">{t.email}</td>
//                       <td className="p-3">{t.section?.join(", ")}</td>
//                       <td className="p-3">{course?.name || t.courseId}</td>
//                       <td className="p-3">
//                         {t.Subjects && t.Subjects.length > 0
//                           ? t.Subjects.map((sub) => sub.name).join(", ")
//                           : "No subjects"}
//                       </td>
//                       <td className="p-3 flex gap-2 flex-wrap">
//                         <button onClick={() => handleEdit(t)} className="px-3 py-1 bg-yellow-400 text-white rounded-md text-sm">Edit</button>
//                         <button onClick={() => handleAssignCourse(t.id)} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">Assign Course</button>
//                         <button onClick={() => handleAssignSubject(t.id)} className="px-3 py-1 bg-green-500 text-white rounded-md text-sm">Assign Subject</button>
//                         <button onClick={() => handleAssignGroup(t.id)} className="px-3 py-1 bg-purple-500 text-white rounded-md text-sm">Assign Group</button>
//                         <button onClick={() => handleDelete(t.id)} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Delete</button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td className="p-3 text-center text-gray-500" colSpan={7}>No teachers found</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//           <Pagination />
//         </div>

//         {/* Export Buttons */}
//         <div className="mt-4 flex gap-2">
//           <button onClick={() => handleExport("sample")} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Download Sample CSV</button>
//           <button onClick={() => handleExport("bulk")} className="px-4 py-2 bg-green-500 text-white rounded-lg">Export Teachers</button>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default TeachersPage;



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
  gender: "",
  dob: "",
  mobileNo: "",
  category: "",
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
  const [profilePhoto, setProfilePhoto] = useState(null);
  const token = localStorage.getItem("token");
  const collegeId = localStorage.getItem("collegeId") || "1";

  // Pagination states
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Fetch teachers with pagination
  const fetchTeachers = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?collegeId=${collegeId}&page=${page}&limit=${limit}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Feature-Access': 'teacherManagement'
        },
      });
      const data = await res.json();
      
      if (data.data) {
        setTeachers(data.data.teachers || []);
        setPagination({
          page: data.data.page || page,
          limit: data.data.limit || limit,
          total: data.data.total || 0,
          totalPages: Math.ceil((data.data.total || 0) / (data.data.limit || limit))
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses and subjects for dropdowns
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${COURSES_API}&collegeId=${collegeId}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      setCourses(data.data?.courses || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch(`${SUBJECTS_API}&collegeId=${collegeId}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
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

  // Pagination handler
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchTeachers(newPage, pagination.limit);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Add all form fields
      Object.keys(form).forEach(key => {
        if (key === 'section' && Array.isArray(form[key])) {
          form[key].forEach(section => formData.append('section[]', section));
        } else if (form[key] !== null && form[key] !== undefined && form[key] !== '') {
          formData.append(key, form[key]);
        }
      });

      // Add profile photo if exists
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { 
          Authorization: `Bearer ${token}`,
          'Feature-Access': 'teacherManagement'
        },
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok && data.status === 1) {
        resetForm();
        fetchTeachers(pagination.page, pagination.limit);
        alert(editingId ? "Teacher updated successfully!" : "Teacher created successfully!");
      } else {
        alert(data.message || "Operation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while submitting.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setProfilePhoto(null);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"][name="profilePhoto"]');
    if (fileInput) fileInput.value = '';
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${id}`, { 
        method: "DELETE", 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Feature-Access': 'teacherManagement'
        } 
      });
      
      const data = await res.json();
      if (res.ok && data.status === 1) {
        fetchTeachers(pagination.page, pagination.limit);
        alert("Teacher deleted successfully!");
      } else {
        alert(data.message || "Failed to delete teacher");
      }
    } catch (err) {
      console.error(err);
      alert("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (teacher) => {
    setForm({
      name: teacher.name || "",
      employeeId: teacher.employeeId || "",
      email: teacher.email || "",
      password: "",
      gender: teacher.gender || "",
      dob: teacher.dob ? teacher.dob.split('T')[0] : "",
      mobileNo: teacher.mobileNo || "",
      category: teacher.category || "",
      section: teacher.section || [],
      courseId: teacher.courseId || "",
      subjectId: teacher.subjectId || "",
    });
    setEditingId(teacher.id);
  };

  const handleAssignCourse = async (teacherId) => {
    if (!form.courseId) return alert("Select a course to assign!");
    try {
      const res = await fetch(`${API_BASE}/${teacherId}/assign-course`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`,
          'Feature-Access': 'teacherManagement'
        },
        body: JSON.stringify({ courseId: form.courseId }),
      });

      const data = await res.json();
      if (res.ok && data.status === 1) {
        fetchTeachers(pagination.page, pagination.limit);
        alert("Course assigned successfully!");
      } else {
        alert(data.message || "Failed to assign course");
      }
    } catch (err) {
      console.error(err);
      alert("Error assigning course");
    }
  };

  const handleAssignSubject = async (teacherId) => {
    if (!form.subjectId) return alert("Select a subject to assign!");
    try {
      const res = await fetch(`${API_BASE}/${teacherId}/assign-subject`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`,
          'Feature-Access': 'teacherManagement'
        },
        body: JSON.stringify({ subjectId: form.subjectId }),
      });

      const data = await res.json();
      if (res.ok && data.status === 1) {
        fetchTeachers(pagination.page, pagination.limit);
        alert("Subject assigned successfully!");
      } else {
        alert(data.message || "Failed to assign subject");
      }
    } catch (err) {
      console.error(err);
      alert("Error assigning subject");
    }
  };

  const handleAssignGroup = async (teacherId) => {
    if (!form.section.length) return alert("Enter group to assign!");
    try {
      const res = await fetch(`${API_BASE}/${teacherId}/assign-group`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`,
          'Feature-Access': 'teacherManagement'
        },
        body: JSON.stringify({ group: form.section[0] }),
      });

      const data = await res.json();
      if (res.ok && data.status === 1) {
        fetchTeachers(pagination.page, pagination.limit);
        alert("Group assigned successfully!");
      } else {
        alert(data.message || "Failed to assign group");
      }
    } catch (err) {
      console.error(err);
      alert("Error assigning group");
    }
  };

  const handleExport = async (type) => {
    try {
      const endpoint = type === "sample" ? "sample-csv" : "export";
      const res = await fetch(`${API_BASE}/${endpoint}?collegeId=${collegeId}`, { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Feature-Access': 'teacherManagement'
        } 
      });
      
      if (!res.ok) {
        throw new Error('Export failed');
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = type === "sample" ? `teachers_sample.csv` : `teachers_export_${collegeId}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Export failed!");
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return alert("Select a file first!");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("csvFile", bulkFile);
      formData.append("collegeId", collegeId);

      const res = await fetch(`${API_BASE}/bulk`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          'Feature-Access': 'teacherManagement'
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.status === 1) {
        alert("Teachers uploaded successfully!");
        setBulkFile(null);
        fetchTeachers(pagination.page, pagination.limit);
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

  // Pagination Component
  const Pagination = () => (
    <div className="flex items-center justify-between mt-4 p-3 border-t">
      <div className="text-sm text-gray-600">
        Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} teachers
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="px-3 py-1 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        
        {/* Page numbers */}
        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
          let pageNum;
          if (pagination.totalPages <= 5) {
            pageNum = i + 1;
          } else if (pagination.page <= 3) {
            pageNum = i + 1;
          } else if (pagination.page >= pagination.totalPages - 2) {
            pageNum = pagination.totalPages - 4 + i;
          } else {
            pageNum = pagination.page - 2 + i;
          }
          
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-1 rounded border text-sm ${
                pagination.page === pageNum 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
          className="px-3 py-1 rounded border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "#246fb2" }}>
          👩‍🏫 Teachers Management
        </h1>
        
        {/* Bulk Upload Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-2">📂 Bulk Upload Teachers (CSV)</h2>
          <div className="flex gap-2 items-center">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setBulkFile(e.target.files[0])}
              className="border px-3 py-2 rounded-lg flex-1"
            />
            <button
              onClick={handleBulkUpload}
              disabled={!bulkFile || loading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50 hover:bg-green-600"
            >
              {loading ? "Uploading..." : "Upload CSV"}
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-md mb-6">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Teacher Name" required className="border px-3 py-2 rounded-lg w-full" />
          <input name="employeeId" value={form.employeeId} onChange={handleChange} placeholder="Employee ID" required className="border px-3 py-2 rounded-lg w-full" />
          <input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="off" placeholder="Email" required className="border px-3 py-2 rounded-lg w-full" />
          <input name="password" type="password" value={form.password} onChange={handleChange} autoComplete="new-password" placeholder="Password" className="border px-3 py-2 rounded-lg w-full" />
          
          <select name="gender" value={form.gender} onChange={handleChange} required className="border px-3 py-2 rounded-lg w-full">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <input name="dob" type="date" value={form.dob} onChange={handleChange} placeholder="Date of Birth" className="border px-3 py-2 rounded-lg w-full" />
          <input name="mobileNo" value={form.mobileNo} onChange={handleChange} placeholder="Mobile Number" className="border px-3 py-2 rounded-lg w-full" />
          
          <select name="category" value={form.category} onChange={handleChange} className="border px-3 py-2 rounded-lg w-full">
            <option value="">Select Category</option>
            <option value="general">General</option>
            <option value="obc">OBC</option>
            <option value="sc">SC</option>
            <option value="st">ST</option>
          </select>

          <input name="section" value={form.section} onChange={(e) => setForm({ ...form, section: [e.target.value] })} placeholder="Section/Group" className="border px-3 py-2 rounded-lg w-full" />

          {/* Course Dropdown */}
          <select name="courseId" value={form.courseId} onChange={handleChange} className="border px-3 py-2 rounded-lg w-full">
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
            ))}
          </select>

          {/* Subject Dropdown */}
          <select name="subjectId" value={form.subjectId} onChange={handleChange} className="border px-3 py-2 rounded-lg w-full">
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Profile Photo Upload */}
          <div className="col-span-2">
            <label className="block mb-2 font-medium">Profile Photo</label>
            <input
              type="file"
              name="profilePhoto"
              accept="image/*"
              onChange={handleFileChange}
              className="border px-3 py-2 rounded-lg w-full"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="col-span-2 py-2 text-white font-semibold rounded-lg disabled:opacity-50 hover:bg-blue-700"
            style={{ backgroundColor: "#246fb2" }}
          >
            {loading ? "Processing..." : editingId ? "Update Teacher" : "Add Teacher"}
          </button>

          {editingId && (
            <button 
              type="button" 
              onClick={resetForm}
              className="col-span-2 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600"
            >
              Cancel Edit
            </button>
          )}
        </form>

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full mx-auto"></div>
          </div>
        )}

        {/* Teachers Table */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead style={{ backgroundColor: "#246fb2" }}>
              <tr className="text-left text-white">
                <th className="p-3">S.No.</th>
                <th className="p-3">Name</th>
                <th className="p-3">Employee ID</th>
                <th className="p-3">Email</th>
                <th className="p-3">Mobile</th>
                {/* <th className="p-3">Section</th>
                <th className="p-3">Course</th> */}
                <th className="p-3">Subject</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length > 0 ? (
                teachers.map((t,index) => {
                  const course = courses.find((c) => c.id === t.courseId);
                  const subject = subjects.find((s) => s.id === t.subjectId);
                  return (
                    <tr key={t.id} className="border-b hover:bg-gray-50">
                         <td className="p-3">{index+1}</td>
                      <td className="p-3 font-medium">{t.name}</td>
                      <td className="p-3">{t.employeeId}</td>
                      <td className="p-3">{t.email}</td>
                      <td className="p-3">{t.mobileNo || "-"}</td>
                      {/* <td className="p-3">{t.section?.join(", ") || "-"}</td>
                      <td className="p-3">{course?.name || t.courseId || "-"}</td> */}
                      <td className="p-3">
                        {t.subjects && t.subjects.length > 0
                          ? t.subjects.map((sub) => sub.name).join(", ")
                          : subject?.name || "-"}
                      </td>
                      <td className="p-3 flex gap-2 flex-wrap">
                        <button onClick={() => handleEdit(t)} className="px-3 py-1 bg-yellow-400 text-white rounded-md text-sm hover:bg-yellow-500">Edit</button>
                        <button onClick={() => handleAssignCourse(t.id)} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">Assign Course</button>
                        <button onClick={() => handleAssignSubject(t.id)} className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600">Assign Subject</button>
                        <button onClick={() => handleAssignGroup(t.id)} className="px-3 py-1 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-600">Assign Group</button>
                        <button onClick={() => handleDelete(t.id)} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600">Delete</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="p-3 text-center text-gray-500" colSpan={8}>No teachers found</td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination />
        </div>

        {/* Export Buttons */}
        <div className="mt-4 flex gap-2">
          <button onClick={() => handleExport("sample")} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Download Sample CSV
          </button>
          <button onClick={() => handleExport("export")} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Export Teachers
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default TeachersPage;