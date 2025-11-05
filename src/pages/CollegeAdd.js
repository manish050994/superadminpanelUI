

// import React, { useEffect, useState } from "react";
// import Layout from "../layouts/Collegelayout";
// const BULK_API = "https://mynexus.co.in/api/api/students/bulk";
// const API_BASE = "https://mynexus.co.in/api/api/students";
// const COURSES_API = "https://mynexus.co.in/api/api/courses?page=1&limit=50"; // fetch all courses

// const initialForm = {
//   name: "",
//   rollNo: "",
//   courseId: "",
//   year: 2024,
//   section: "",
//   email: "",
//   password: "",
//   parent: {
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//   },
// };

// const StudentsPage = () => {
//   const [students, setStudents] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState(initialForm);
//   const [editingId, setEditingId] = useState(null);
//   const [bulkFile, setBulkFile] = useState(null);
//   const token = localStorage.getItem("token");

//   // Fetch students
//   const fetchStudents = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}?collegeId=1&page=1&limit=10`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setStudents(data.data?.students || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch courses for dropdown
//   const fetchCourses = async () => {
//     try {
//       const res = await fetch(COURSES_API, { headers: { Authorization: `Bearer ${token}` } });
//       const data = await res.json();
//       setCourses(data.data?.courses || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchStudents();
//     fetchCourses();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.startsWith("parent.")) {
//       const field = name.split(".")[1];
//       setForm({ ...form, parent: { ...form.parent, [field]: value } });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);
//   //   try {
//   //     const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
//   //     const method = editingId ? "PUT" : "POST";

//   //     await fetch(url, {
//   //       method,
//   //       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//   //       body: JSON.stringify(form),
//   //     });

//   //     setForm(initialForm);
//   //     setEditingId(null);
//   //     fetchStudents();
//   //   } catch (err) {
//   //     console.error(err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   try {
//     const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
//     const method = editingId ? "PUT" : "POST";

//     const res = await fetch(url, {
//       method,
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       body: JSON.stringify(form),
//     });

//     const data = await res.json(); // parse response

//     if (!res.ok || data.status === 0) {
//       // ❌ API returned an error
//       alert(data.message || data.error || "Failed to create student.");
//     } else {
//       // ✅ Success
//       alert("Student created successfully!");
//       setForm(initialForm);
//       setEditingId(null);
//       fetchStudents();
//     }
//   } catch (err) {
//     console.error(err);
//     alert("Something went wrong while submitting.");
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure?")) return;
//     setLoading(true);
//     try {
//       await fetch(`${API_BASE}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
//       fetchStudents();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (student) => {
//     setForm({
//       name: student.name,
//       rollNo: student.rollNo,
//       courseId: student.id || "",
//       year: student.year || 1,
//       section: student.section || "",
//       email: student.Parent?.email,
//       password: "",
//       parent: {
//         name: student.Parent?.name || "",
//         email: student.Parent?.email || "",
//         phone: student.Parent?.phone || "",
//         password: "",
//       },
//     });
//     setEditingId(student.id);
//   };

//   const handleIdCard = async (id) => {
//     try {
//       const res = await fetch(`${API_BASE}/${id}/idcard`, { headers: { Authorization: `Bearer ${token}` } });
//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `idcard_${id}.pdf`;
//       a.click();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleExport = async (type) => {
//     try {
//       const endpoint = type === "sample" ? "sample-csv" : "export";
//       const res = await fetch(`${API_BASE}/${endpoint}`, { headers: { Authorization: `Bearer ${token}` } });
//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = type === "sample" ? `students_sample.csv` : `students_export.csv`;
//       a.click();
//     } catch (err) {
//       console.error(err);
//     }
//   };
//  const handleBulkUpload = async () => {
//     if (!bulkFile) {
//       alert("Please select a CSV file first.");
//       return;
//     }
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("file", bulkFile);

//       await fetch(BULK_API, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       setBulkFile(null);
//       fetchStudents();
//       alert("Students uploaded successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Bulk upload failed!");
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <Layout>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-6" style={{ color: "#246fb2" }}>
//           🧑‍🎓 Students Management
//         </h1>
//   <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//           <h2 className="text-lg font-semibold mb-2">📂 Bulk Upload Students (CSV)</h2>
//           <input
//             type="file"
//             accept=".csv"
//             onChange={(e) => setBulkFile(e.target.files[0])}
//             className="mb-3"
//           />
//           <button
//             onClick={handleBulkUpload}
//             disabled={loading}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//           >
//             Upload CSV
//           </button>
//         </div>
//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-md mb-6">
//           <input name="name" value={form.name} onChange={handleChange} placeholder="Student Name" required className="border px-3 py-2 rounded-lg w-full" />
//           <input name="rollNo" value={form.rollNo} onChange={handleChange} placeholder="Roll No" required className="border px-3 py-2 rounded-lg w-full" />

//           {/* Course Dropdown */}
//           <select name="courseId" value={form.courseId} onChange={handleChange} required className="border px-3 py-2 rounded-lg w-full">
//             <option value="">{"Select Course"}</option>
//             {courses.map((course) => (
//               <option key={course.id} value={course.id}>
//                 {course.name}
//               </option>
//             ))}
//           </select>

//           <input name="year" type="number" value={form.year} onChange={handleChange} placeholder="Year" required className="border px-3 py-2 rounded-lg w-full" />
//           <input name="section" value={form.section} onChange={handleChange} placeholder="Section" className="border px-3 py-2 rounded-lg w-full" />
//           <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" autoComplete="off" required className="border px-3 py-2 rounded-lg w-full" />
//           <input name="password" type="password" value={form.password} onChange={handleChange} autoComplete="new-password" placeholder="Password" className="border px-3 py-2 rounded-lg w-full" />

//           <input name="parent.name" value={form.parent.name} onChange={handleChange} placeholder="Parent Name" className="border px-3 py-2 rounded-lg w-full" />
//           <input name="parent.email" value={form.parent.email} onChange={handleChange} placeholder="Parent Email" className="border px-3 py-2 rounded-lg w-full" />
//           <input name="parent.phone" value={form.parent.phone} onChange={handleChange} placeholder="Parent Phone" className="border px-3 py-2 rounded-lg w-full" />
//           <input name="parent.password" type="password" value={form.parent.password} onChange={handleChange} placeholder="Parent Password" className="border px-3 py-2 rounded-lg w-full" />

//           <button type="submit" disabled={loading} className="col-span-2 py-2 text-white font-semibold rounded-lg" style={{ backgroundColor: "#246fb2" }}>
//             {editingId ? "Update Student" : "Add Student"}
//           </button>
//         </form>

//         {loading && <div className="text-center py-4"><div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full mx-auto"></div></div>}

//         {/* Students Table */}
//         <div className="bg-white shadow-md rounded-lg overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead style={{ backgroundColor: "#246fb2" }}>
//               <tr className="text-left text-white">
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Roll No</th>
//                 <th className="p-3">Course</th>
//                 <th className="p-3">Year</th>
//                 <th className="p-3">Section</th>
//                 <th className="p-3">Email</th>
//                 <th className="p-3">Parent</th>
//                 <th className="p-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.length > 0 ? (
//                 students.map((stu) => {
//                   const course = courses.find((c) => c.code === stu.courseId);
//                   return (
//                     <tr key={stu.id} className="border-b">
//                       <td className="p-3">{stu.name}</td>
//                       <td className="p-3">{stu.rollNo}</td>
//                       <td className="p-3">{course?.name || stu.courseId}</td>
//                       <td className="p-3">{stu.year}</td>
//                       <td className="p-3">{stu.section}</td>
//                       <td className="p-3">{stu.Parent?.email}</td>
//                       <td className="p-3">{stu.Parent?.name}</td>
//                       <td className="p-3 flex gap-2 flex-wrap">
//                         <button onClick={() => handleEdit(stu)} className="px-3 py-1 bg-yellow-400 text-white rounded-md text-sm">Edit</button>
//                         <button onClick={() => handleIdCard(stu.id)} className="px-3 py-1 bg-green-500 text-white rounded-md text-sm">ID Card</button>
//                         <button onClick={() => handleDelete(stu.id)} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Delete</button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td className="p-3 text-center text-gray-500" colSpan={8}>No students found</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="mt-4 flex gap-2">
//           <button onClick={() => handleExport("sample")} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Download Sample CSV</button>
//           <button onClick={() => handleExport("export")} className="px-4 py-2 bg-green-500 text-white rounded-lg">Export CSV</button>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default StudentsPage;




// import React, { useEffect, useState } from "react";
// import Layout from "../layouts/Collegelayout";

// const BULK_API = "https://mynexus.co.in/api/api/students/bulk";
// const API_BASE = "https://mynexus.co.in/api/api/students";
// const COURSES_API = "https://mynexus.co.in/api/api/courses?page=1&limit=50";

// const initialForm = {
//   name: "",
//   rollNo: "",
//   courseId: "",
//   year: 2024,
//   section: "",
//   email: "",
//   password: "",
//   parent: {
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//   },
// };

// const StudentsPage = () => {
//   const [students, setStudents] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState(initialForm);
//   const [editingId, setEditingId] = useState(null);
//   const [bulkFile, setBulkFile] = useState(null);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [total, setTotal] = useState(0);
//   const token = localStorage.getItem("token");

//   // Fetch students (with pagination)
//   const fetchStudents = async (pageNum = 1) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}?collegeId=1&page=${pageNum}&limit=${limit}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();

//       setStudents(data.data?.students || []);
//       setTotal(data.data?.total || 0);
//       setPage(data.data?.page || 1);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch courses
//   const fetchCourses = async () => {
//     try {
//       const res = await fetch(COURSES_API, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setCourses(data.data?.courses || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchStudents(page);
//     fetchCourses();
//   }, [page]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.startsWith("parent.")) {
//       const field = name.split(".")[1];
//       setForm({ ...form, parent: { ...form.parent, [field]: value } });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
//       const method = editingId ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();
//       if (!res.ok || data.status === 0) {
//         alert(data.message || "Failed to create student.");
//       } else {
//         alert("Student created successfully!");
//         setForm(initialForm);
//         setEditingId(null);
//         fetchStudents(page);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong while submitting.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure?")) return;
//     setLoading(true);
//     try {
//       await fetch(`${API_BASE}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
//       fetchStudents(page);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (student) => {
//     setForm({
//       name: student.name,
//       rollNo: student.rollNo,
//       courseId: student.id || "",
//       year: student.year || 1,
//       section: student.section || "",
//       email: student.Parent?.email,
//       password: "",
//       parent: {
//         name: student.Parent?.name || "",
//         email: student.Parent?.email || "",
//         phone: student.Parent?.phone || "",
//         password: "",
//       },
//     });
//     setEditingId(student.id);
//   };

//   const handleIdCard = async (id) => {
//     try {
//       const res = await fetch(`${API_BASE}/${id}/idcard`, { headers: { Authorization: `Bearer ${token}` } });
//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `idcard_${id}.pdf`;
//       a.click();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleExport = async (type) => {
//     try {
//       const endpoint = type === "sample" ? "sample-csv" : "export";
//       const res = await fetch(`${API_BASE}/${endpoint}`, { headers: { Authorization: `Bearer ${token}` } });
//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = type === "sample" ? `students_sample.csv` : `students_export.csv`;
//       a.click();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleBulkUpload = async () => {
//     if (!bulkFile) {
//       alert("Please select a CSV file first.");
//       return;
//     }
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("file", bulkFile);

//       await fetch(BULK_API, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       setBulkFile(null);
//       fetchStudents(page);
//       alert("Students uploaded successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Bulk upload failed!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const totalPages = Math.ceil(total / limit);

//   return (
//     <Layout>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-6" style={{ color: "#246fb2" }}>
//           🧑‍🎓 Students Management
//         </h1>

//         {/* Bulk Upload */}
//         <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//           <h2 className="text-lg font-semibold mb-2">📂 Bulk Upload Students (CSV)</h2>
//           <input type="file" accept=".csv" onChange={(e) => setBulkFile(e.target.files[0])} className="mb-3" />
//           <button onClick={handleBulkUpload} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
//             Upload CSV
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-md mb-6">
//           <input name="name" value={form.name} onChange={handleChange} placeholder="Student Name" required className="border px-3 py-2 rounded-lg w-full" />
//           <input name="rollNo" value={form.rollNo} onChange={handleChange} placeholder="Roll No" required className="border px-3 py-2 rounded-lg w-full" />
//           <select name="courseId" value={form.courseId} onChange={handleChange} required className="border px-3 py-2 rounded-lg w-full">
//             <option value="">Select Course</option>
//             {courses.map((course) => (
//               <option key={course.id} value={course.id}>{course.name}</option>
//             ))}
//           </select>
//           <input name="year" type="number" value={form.year} onChange={handleChange} placeholder="Year" required className="border px-3 py-2 rounded-lg w-full" />
//           <input name="section" value={form.section} onChange={handleChange} placeholder="Section" className="border px-3 py-2 rounded-lg w-full" />
//           <input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="off" placeholder="Email" required className="border px-3 py-2 rounded-lg w-full" />
//           <input name="password" type="password" value={form.password} onChange={handleChange} autoComplete="new-password" placeholder="Password" className="border px-3 py-2 rounded-lg w-full" />

//           {/* Parent Info */}
//           <input name="parent.name" value={form.parent.name} onChange={handleChange} placeholder="Parent Name" className="border px-3 py-2 rounded-lg w-full" />
//           <input name="parent.email" value={form.parent.email} onChange={handleChange} placeholder="Parent Email" className="border px-3 py-2 rounded-lg w-full" />
//           <input name="parent.phone" value={form.parent.phone} onChange={handleChange} placeholder="Parent Phone" className="border px-3 py-2 rounded-lg w-full" />
//           <input name="parent.password" type="password" value={form.parent.password} onChange={handleChange} placeholder="Parent Password" className="border px-3 py-2 rounded-lg w-full" />

//           <button type="submit" disabled={loading} className="col-span-2 py-2 text-white font-semibold rounded-lg" style={{ backgroundColor: "#246fb2" }}>
//             {editingId ? "Update Student" : "Add Student"}
//           </button>
//         </form>

//         {/* Loader */}
//         {loading && <div className="text-center py-4"><div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full mx-auto"></div></div>}

//         {/* Students Table */}
//         <div className="bg-white shadow-md rounded-lg overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead style={{ backgroundColor: "#246fb2" }}>
//               <tr className="text-left text-white">
//                 <th className="p-3">S.No.</th>
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Roll No</th>
//                 <th className="p-3">Login ID</th>
                
//                 <th className="p-3">Course</th>
//                 <th className="p-3">Year</th>
//                 <th className="p-3">Section</th>
//                 <th className="p-3">Email</th>
//                 <th className="p-3">Parent Login ID</th>
//                 <th className="p-3">Parent</th>
//                 <th className="p-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.length > 0 ? (
//                 students.map((stu) => {
//                   const course = courses.find((c) => c.code === stu.courseId);
//                   return (
//                     <tr key={stu.id} className="border-b">
//                       <td className="p-3">{(page - 1) * limit + students.indexOf(stu) + 1}</td>
//                       <td className="p-3">{stu.name}</td>
//                       <td className="p-3">{stu.rollNo}</td>
//                       <td className="p-3">{stu.User.loginId}</td>
                   
//                       <td className="p-3">{ stu.Course.name}</td>
//                       <td className="p-3">{stu.year}</td>
//                       <td className="p-3">{stu.section}</td>
//                       <td className="p-3">{stu.Parent?.email}</td>
//                          <td className="p-3">{stu?.Parent?.User?.loginId}</td>
//                       <td className="p-3">{stu.Parent?.name}</td>
//                       <td className="p-3 flex gap-2 flex-wrap">
//                         <button onClick={() => handleEdit(stu)} className="px-3 py-1 bg-yellow-400 text-white rounded-md text-sm">Edit</button>
//                         <button onClick={() => handleIdCard(stu.id)} className="px-3 py-1 bg-green-500 text-white rounded-md text-sm">ID Card</button>
//                         <button onClick={() => handleDelete(stu.id)} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Delete</button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td className="p-3 text-center text-gray-500" colSpan={8}>No students found</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* ✅ Pagination Controls */}
//         <div className="flex justify-center items-center mt-6 gap-2">
//           <button
//             onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//             disabled={page === 1}
//             className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span className="px-3 py-1 border rounded text-sm">
//             Page {page} of {totalPages}
//           </span>
//           <button
//             onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
//             disabled={page >= totalPages}
//             className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>

//         {/* Export Buttons */}
//         <div className="mt-6 flex gap-2">
//           <button onClick={() => handleExport("sample")} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Download Sample CSV</button>
//           <button onClick={() => handleExport("export")} className="px-4 py-2 bg-green-500 text-white rounded-lg">Export CSV</button>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default StudentsPage;



import React, { useEffect, useState } from "react";
import Layout from "../layouts/Collegelayout";

const BULK_API = "https://mynexus.co.in/api/api/students/bulk";
const API_BASE = "https://mynexus.co.in/api/api/students";
const COURSES_API = "https://mynexus.co.in/api/api/courses?page=1&limit=50";

const initialForm = {
  name: "",
  rollNo: "",
  courseId: "",
  year: new Date().getFullYear(),
  section: "",
  email: "",
  password: "",
  gender: "",
  motherName: "",
  fatherName: "",
  category: "",
  contact: "",
  address: "",
  feesPaid: false,
  parent: {
    name: "",
    email: "",
    phone: "",
    password: "",
    gender: ""
  },
};

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const token = localStorage.getItem("token");
  const collegeId = localStorage.getItem("collegeId") || "1";

  // Fetch students (with pagination)
  const fetchStudents = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?collegeId=${collegeId}&page=${pageNum}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      setStudents(data.data?.students || []);
      setTotal(data.data?.total || 0);
      setPage(data.data?.page || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${COURSES_API}&collegeId=${collegeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCourses(data.data?.courses || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents(page);
    fetchCourses();
  }, [page]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith("parent.")) {
      const field = name.split(".")[1];
      setForm({ 
        ...form, 
        parent: { ...form.parent, [field]: value } 
      });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingId) {
        // UPDATE - Use FormData
        const formData = new FormData();
        
        // Add all form fields
        Object.keys(form).forEach(key => {
          if (key === 'parent') {
            formData.append(key, JSON.stringify(form[key]));
          } else if (key === 'feesPaid') {
            formData.append(key, form[key].toString());
          } else if (form[key] !== null && form[key] !== undefined && form[key] !== '') {
            formData.append(key, form[key]);
          }
        });

        // Add profile picture if exists
        if (profilePic) {
          formData.append("profilePic", profilePic);
        }

        const res = await fetch(`${API_BASE}/${editingId}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || data.status === 0) {
          alert(data.message || "Failed to update student.");
        } else {
          alert("Student updated successfully!");
          resetForm();
          fetchStudents(page);
        }
      } else {
        // CREATE - Use JSON
        const res = await fetch(API_BASE, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({
            ...form,
            collegeId: parseInt(collegeId)
          }),
        });

        const data = await res.json();
        if (!res.ok || data.status === 0) {
          alert(data.message || "Failed to create student.");
        } else {
          alert("Student created successfully!");
          resetForm();
          fetchStudents(page);
        }
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
    setProfilePic(null);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${id}`, { 
        method: "DELETE", 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      if (res.ok) {
        fetchStudents(page);
        alert("Student deleted successfully!");
      } else {
        alert("Failed to delete student");
      }
    } catch (err) {
      console.error(err);
      alert("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name || "",
      rollNo: student.rollNo || "",
      courseId: student.courseId || "",
      year: student.year || new Date().getFullYear(),
      section: student.section || "",
      email: student.email || "",
      password: "",
      gender: student.gender || "",
      motherName: student.motherName || "",
      fatherName: student.fatherName || "",
      category: student.category || "",
      contact: student.contact || "",
      address: student.address || "",
      feesPaid: student.feesPaid || false,
      parent: {
        name: student.Parent?.name || "",
        email: student.Parent?.email || "",
        phone: student.Parent?.phone || "",
        password: "",
        gender: student.Parent?.gender || ""
      },
    });
    setEditingId(student.id);
  };

  const handleIdCard = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}/idcard`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      if (!res.ok) {
        throw new Error('Failed to generate ID card');
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `idcard_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download ID card");
    }
  };

  const handleExport = async (type) => {
    try {
      const endpoint = type === "sample" ? "sample-csv" : "export";
      const res = await fetch(`${API_BASE}/${endpoint}?collegeId=${collegeId}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      
      if (!res.ok) {
        throw new Error('Export failed');
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = type === "sample" ? `students_sample.csv` : `students_export_${collegeId}.csv`;
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
    if (!bulkFile) {
      alert("Please select a CSV file first.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", bulkFile);
      formData.append("collegeId", collegeId);

      const res = await fetch(BULK_API, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok && data.status === 1) {
        setBulkFile(null);
        fetchStudents(page);
        alert("Students uploaded successfully!");
      } else {
        alert(data.message || "Bulk upload failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Bulk upload failed!");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "#246fb2" }}>
          🧑‍🎓 Students Management
        </h1>

        {/* Bulk Upload */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-2">📂 Bulk Upload Students (CSV)</h2>
          <input 
            type="file" 
            accept=".csv" 
            onChange={(e) => setBulkFile(e.target.files[0])} 
            className="mb-3 border p-2 rounded w-full" 
          />
          <button 
            onClick={handleBulkUpload} 
            disabled={loading || !bulkFile}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload CSV"}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-md mb-6">
          {/* Basic Info */}
          <input name="name" value={form.name} onChange={handleChange} placeholder="Student Name" required className="border px-3 py-2 rounded-lg w-full" />
          <input name="rollNo" value={form.rollNo} onChange={handleChange} placeholder="Roll No" required className="border px-3 py-2 rounded-lg w-full" />
          
          <select name="courseId" value={form.courseId} onChange={handleChange} required className="border px-3 py-2 rounded-lg w-full">
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.name} ({course.code})</option>
            ))}
          </select>
          
          <input name="year" type="number" value={form.year} onChange={handleChange} placeholder="Year" required className="border px-3 py-2 rounded-lg w-full" />
          <input name="section" value={form.section} onChange={handleChange} placeholder="Section" className="border px-3 py-2 rounded-lg w-full" />
          
          <select name="gender" value={form.gender} onChange={handleChange} required className="border px-3 py-2 rounded-lg w-full">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <select name="category" value={form.category} onChange={handleChange} className="border px-3 py-2 rounded-lg w-full">
            <option value="">Select Category</option>
            <option value="general">General</option>
            <option value="obc">OBC</option>
            <option value="sc">SC</option>
            <option value="st">ST</option>
          </select>

          <input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="off" placeholder="Student Email" required className="border px-3 py-2 rounded-lg w-full" />
          <input name="password" type="password" value={form.password} onChange={handleChange} autoComplete="new-password" placeholder="Student Password" className="border px-3 py-2 rounded-lg w-full" />
          
          <input name="motherName" value={form.motherName} onChange={handleChange} placeholder="Mother's Name" className="border px-3 py-2 rounded-lg w-full" />
          <input name="fatherName" value={form.fatherName} onChange={handleChange} placeholder="Father's Name" className="border px-3 py-2 rounded-lg w-full" />
          
          <input name="contact" value={form.contact} onChange={handleChange} placeholder="Contact Number" className="border px-3 py-2 rounded-lg w-full" />
          <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="border px-3 py-2 rounded-lg w-full" />

          {/* Profile Picture - Only for update */}
          {editingId && (
            <div className="col-span-2">
              <label className="block mb-2 font-medium">Profile Picture</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="border px-3 py-2 rounded-lg w-full"
              />
            </div>
          )}

          {/* Fees Status */}
          <div className="col-span-2 flex items-center gap-2">
            <input 
              type="checkbox" 
              name="feesPaid" 
              checked={form.feesPaid} 
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label>Fees Paid</label>
          </div>

          {/* Parent Info */}
          <div className="col-span-2 border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Parent Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="parent.name" value={form.parent.name} onChange={handleChange} placeholder="Parent Name" className="border px-3 py-2 rounded-lg w-full" />
              <input name="parent.email" value={form.parent.email} onChange={handleChange} placeholder="Parent Email" className="border px-3 py-2 rounded-lg w-full" />
              <input name="parent.phone" value={form.parent.phone} onChange={handleChange} placeholder="Parent Phone" className="border px-3 py-2 rounded-lg w-full" />
              <input name="parent.password" type="password" value={form.parent.password} onChange={handleChange} placeholder="Parent Password" className="border px-3 py-2 rounded-lg w-full" />
              <select name="parent.gender" value={form.parent.gender} onChange={handleChange} className="border px-3 py-2 rounded-lg w-full">
                <option value="">Parent Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="col-span-2 py-2 text-white font-semibold rounded-lg disabled:opacity-50"
            style={{ backgroundColor: "#246fb2" }}
          >
            {loading ? "Processing..." : editingId ? "Update Student" : "Add Student"}
          </button>
          
          {editingId && (
            <button 
              type="button" 
              onClick={resetForm}
              className="col-span-2 py-2 bg-gray-500 text-white font-semibold rounded-lg"
            >
              Cancel Edit
            </button>
          )}
        </form>

        {/* Loader */}
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full mx-auto"></div>
          </div>
        )}

        {/* Students Table */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full border-collapse">
            <thead style={{ backgroundColor: "#246fb2" }}>
              <tr className="text-left text-white">
                <th className="p-3">S.No.</th>
                <th className="p-3">Name</th>
                <th className="p-3">Roll No</th>
                <th className="p-3">Login ID</th>
                <th className="p-3">Course</th>
                <th className="p-3">Year</th>
                <th className="p-3">Section</th>
                <th className="p-3">Email</th>
                <th className="p-3">Parent Login ID</th>
                <th className="p-3">Parent</th>
                <th className="p-3">Fees</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((stu, index) => (
                  <tr key={stu.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{(page - 1) * limit + index + 1}</td>
                    <td className="p-3 font-medium">{stu.name}</td>
                    <td className="p-3">{stu.rollNo}</td>
                    <td className="p-3">{stu.User?.loginId}</td>
                    <td className="p-3">{stu.Course?.name || "N/A"}</td>
                    <td className="p-3">{stu.year}</td>
                    <td className="p-3">{stu.section || "-"}</td>
                    <td className="p-3">{stu.User.email}</td>
                    <td className="p-3">{stu.Parent?.User?.loginId || "-"}</td>
                    <td className="p-3">{stu.Parent?.name || "-"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        stu.feesPaid 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {stu.feesPaid ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      <button onClick={() => handleEdit(stu)} className="px-3 py-1 bg-yellow-400 text-white rounded-md text-sm hover:bg-yellow-500">Edit</button>
                      <button onClick={() => handleIdCard(stu.id)} className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600">ID Card</button>
                      <button onClick={() => handleDelete(stu.id)} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 text-center text-gray-500" colSpan={12}>
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
          >
            Prev
          </button>
          <span className="px-3 py-1 border rounded text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
            disabled={page >= totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
          >
            Next
          </button>
        </div>

        {/* Export Buttons */}
        <div className="mt-6 flex gap-2">
          <button onClick={() => handleExport("sample")} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Download Sample CSV
          </button>
          <button onClick={() => handleExport("export")} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Export CSV
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default StudentsPage;