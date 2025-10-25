// import React, { useEffect, useState } from "react";
// import Layout from "../layouts/Collegelayout";

// const API_COURSES = "https://mynexus.co.in/api/api/courses";
// const API_SUBJECTS = "https://mynexus.co.in/api/api/subjects";

// const initialCourseForm = { code: "", name: "" };
// const initialSubjectForm = { code: "", name: "" };

// const CoursesPage = () => {
//   const [courses, setCourses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [courseForm, setCourseForm] = useState(initialCourseForm);
//   const [subjectForm, setSubjectForm] = useState(initialSubjectForm);
//   const [editingCourseId, setEditingCourseId] = useState(null);
//   const [editingSubjectId, setEditingSubjectId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [assignSubjects, setAssignSubjects] = useState([]);
//   const [selectedCourseId, setSelectedCourseId] = useState(null);
// const [courseSubjects, setCourseSubjects] = useState([]);
//   const token = localStorage.getItem("token");

//   // Fetch Courses
//   const fetchCourses = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_COURSES}?page=1&limit=10`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setCourses(data.data?.courses || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   // Fetch subjects by course
//   const fetchSubjectsByCourse = async (courseId) => {
//     if (!courseId) return;
//     setLoading(true); 
//     try {
//       const res = await fetch(`https://mynexus.co.in/api/api/subjects/by-course/${courseId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setCourseSubjects(data.data?.subjects || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch Subjects
//   const fetchSubjects = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_SUBJECTS}?page=1&limit=10`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setSubjects(data.data?.subjects || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//     fetchSubjects();
//   }, []);

//   // Handlers for form changes
//   const handleCourseChange = (e) => {
//     const { name, value } = e.target;
//     setCourseForm({ ...courseForm, [name]: value });
//   };

//   const handleSubjectChange = (e) => {
//     const { name, value } = e.target;
//     setSubjectForm({ ...subjectForm, [name]: value });
//   };

//   // Create / Update Course
//   const handleCourseSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const url = editingCourseId ? `${API_COURSES}/${editingCourseId}` : API_COURSES;
//       const method = editingCourseId ? "PUT" : "POST";
//       await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(courseForm),
//       });
//       setCourseForm(initialCourseForm);
//       setEditingCourseId(null);
//       fetchCourses();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create / Update Subject
//   const handleSubjectSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const url = editingSubjectId ? `${API_SUBJECTS}/${editingSubjectId}` : API_SUBJECTS;
//       const method = editingSubjectId ? "PUT" : "POST";
//       await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(subjectForm),
//       });
//       setSubjectForm(initialSubjectForm);
//       setEditingSubjectId(null);
//       fetchSubjects();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete Course / Subject
//   const handleDeleteCourse = async (id) => {
//     if (!window.confirm("Are you sure to delete this course?")) return;
//     setLoading(true);
//     try {
//       await fetch(`${API_COURSES}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
//       fetchCourses();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteSubject = async (id) => {
//     if (!window.confirm("Are you sure to delete this subject?")) return;
//     setLoading(true);
//     try {
//       await fetch(`${API_SUBJECTS}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
//       fetchSubjects();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Edit Course / Subject
//   const handleEditCourse = (course) => {
//     setCourseForm({ code: course.code, name: course.name });
//     setEditingCourseId(course.id);
//   };
//   const handleEditSubject = (subject) => {
//     setSubjectForm({ code: subject.code, name: subject.name });
//     setEditingSubjectId(subject.id);
//   };

//   // Assign subjects to course
//   const handleAssignSubjects = async () => {
//     if (!selectedCourseId || assignSubjects.length === 0) return;
//     setLoading(true);
//     try {
//       await fetch(`${API_COURSES}/${selectedCourseId}/assign-subjects`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ subjectIds: assignSubjects }),
//       });
//       setAssignSubjects([]);
//       setSelectedCourseId(null);
//       alert("Subjects assigned successfully!");
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-6" style={{ color: "#246fb2" }}>
//           📚 Courses & Subjects Management
//         </h1>

//         {/* Forms */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <form onSubmit={handleCourseSubmit} className="bg-white p-4 rounded shadow-md">
//             <h2 className="font-semibold mb-2">Course</h2>
//             <input name="code" value={courseForm.code} onChange={handleCourseChange} placeholder="Course Code" className="border px-3 py-2 w-full rounded mb-2" required />
//             <input name="name" value={courseForm.name} onChange={handleCourseChange} placeholder="Course Name" className="border px-3 py-2 w-full rounded mb-2" required />
//             <button type="submit" disabled={loading} className="w-full py-2 rounded text-white font-semibold" style={{ backgroundColor: "#246fb2" }}>
//               {editingCourseId ? "Update Course" : "Add Course"}
//             </button>
//           </form>

//           <form onSubmit={handleSubjectSubmit} className="bg-white p-4 rounded shadow-md">
//             <h2 className="font-semibold mb-2">Subject</h2>
//             <input name="code" value={subjectForm.code} onChange={handleSubjectChange} placeholder="Subject Code" className="border px-3 py-2 w-full rounded mb-2" required />
//             <input name="name" value={subjectForm.name} onChange={handleSubjectChange} placeholder="Subject Name" className="border px-3 py-2 w-full rounded mb-2" required />
//             <button type="submit" disabled={loading} className="w-full py-2 rounded text-white font-semibold" style={{ backgroundColor: "#246fb2" }}>
//               {editingSubjectId ? "Update Subject" : "Add Subject"}
//             </button>
//           </form>
//         </div>

//         {/* Loader */}
//         {loading && <div className="text-center py-4"><div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full mx-auto"></div></div>}

//         {/* Courses Table */}
//         <div className="bg-white shadow-md rounded-lg overflow-x-auto mb-6">
//           <h2 className="font-semibold p-3" style={{ color: "#246fb2" }}>Courses</h2>
//           <table className="w-full border-collapse">
//             <thead style={{ backgroundColor: "#246fb2" }}>
//               <tr className="text-left text-white">
//                 <th className="p-3">Code</th>
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {courses.map((c) => (
//                 <tr key={c.id} className="border-b">
//                   <td className="p-3">{c.code}</td>
//                   <td className="p-3">{c.name}</td>
//                   <td className="p-3 flex gap-2 flex-wrap">
//                     <button onClick={() => handleEditCourse(c)} className="px-3 py-1 bg-yellow-400 text-white rounded-md text-sm">Edit</button>
//                     <button onClick={() => handleDeleteCourse(c.id)} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Delete</button>
//                     {/* <button onClick={() => setSelectedCourseId(c.id)} className="px-3 py-1 bg-green-500 text-white rounded-md text-sm">Assign Subjects</button> */}
//                     <button
//                       onClick={() => {
//                         setSelectedCourseId(c.id);
//                         fetchSubjectsByCourse(c.id); // fetch subjects only for this course
//                       }}
//                       className="px-3 py-1 bg-green-500 text-white rounded-md text-sm"
//                     >
//                       Assign Subjects
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Subjects Table */}
//         <div className="bg-white shadow-md rounded-lg overflow-x-auto mb-6">
//           <h2 className="font-semibold p-3" style={{ color: "#246fb2" }}>Subjects</h2>
//           <table className="w-full border-collapse">
//             <thead style={{ backgroundColor: "#246fb2" }}>
//               <tr className="text-left text-white">
//                 <th className="p-3">Code</th>
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {subjects.map((s) => (
//                 <tr key={s.id} className="border-b">
//                   <td className="p-3">{s.code}</td>
//                   <td className="p-3">{s.name}</td>
//                   <td className="p-3 flex gap-2 flex-wrap">
//                     <button onClick={() => handleEditSubject(s)} className="px-3 py-1 bg-yellow-400 text-white rounded-md text-sm">Edit</button>
//                     <button onClick={() => handleDeleteSubject(s.id)} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Assign Subjects */}
//         {selectedCourseId && (
//           <div className="bg-white shadow-md rounded-lg p-4 mb-6">
//             <h2 className="font-semibold mb-2" style={{ color: "#246fb2" }}>Assign Subjects to Course</h2>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//               {subjects.map((s) => (
//                 <label key={s.id} className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     value={s.id}
//                     checked={assignSubjects.includes(s.id)}
//                     onChange={(e) => {
//                       const id = s.id;
//                       if (assignSubjects.includes(id)) {
//                         setAssignSubjects(assignSubjects.filter((x) => x !== id));
//                       } else {
//                         setAssignSubjects([...assignSubjects, id]);
//                       }
//                     }}
//                   />
//                   {s.name}
//                 </label>
//               ))}
//             </div>
//             <button onClick={handleAssignSubjects} className="mt-3 py-2 px-4 rounded text-white font-semibold" style={{ backgroundColor: "#246fb2" }}>Assign</button>
//           </div>
//         )}
//         {selectedCourseId && courseSubjects.length > 0 && (
//   <div className="bg-white shadow-md rounded-lg overflow-x-auto mb-6">
//     <h2 className="font-semibold p-3" style={{ color: "#246fb2" }}>
//       Subjects for Course
//     </h2>
//     <table className="w-full border-collapse">
//       <thead style={{ backgroundColor: "#246fb2" }}>
//         <tr className="text-left text-white">
//           <th className="p-3">Code</th>
//           <th className="p-3">Name</th>
//           <th className="p-3">Teacher</th>
//         </tr>
//       </thead>
//       <tbody>
//         {courseSubjects.map((s) => (
//           <tr key={s.id} className="border-b">
//             <td className="p-3">{s.code}</td>
//             <td className="p-3">{s.name}</td>
//             <td className="p-3">{s.Teacher ? s.Teacher.name : "-"}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// )}

//       </div>
//     </Layout>
//   );
// };

// export default CoursesPage;


import React, { useEffect, useState } from "react";
import Layout from "../layouts/Collegelayout";

const API_COURSES = "https://mynexus.co.in/api/api/courses";
const API_SUBJECTS = "https://mynexus.co.in/api/api/subjects";

const initialCourseForm = { code: "", name: "" };
const initialSubjectForm = { code: "", name: "" };

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courseForm, setCourseForm] = useState(initialCourseForm);
  const [subjectForm, setSubjectForm] = useState(initialSubjectForm);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assignSubjects, setAssignSubjects] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courseSubjects, setCourseSubjects] = useState([]);
  const [courseName, setCourseName] = useState("");
  
  // Pagination states
  const [coursesPagination, setCoursesPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [subjectsPagination, setSubjectsPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const token = localStorage.getItem("token");

  // Fetch Courses with pagination
  const fetchCourses = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_COURSES}?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      if (data.data) {
        setCourses(data.data.courses || []);
        setCoursesPagination({
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

  // Fetch subjects by course
  const fetchSubjectsByCourse = async (courseId) => {
    if (!courseId) return;
    setLoading(true); 
    try {
      const res = await fetch(`https://mynexus.co.in/api/api/subjects/by-course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCourseSubjects(data.data?.subjects || []);
      setCourseName(data.data?.courseName || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Subjects with pagination
  const fetchSubjects = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_SUBJECTS}?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      if (data.data) {
        setSubjects(data.data.subjects || []);
        setSubjectsPagination({
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

  useEffect(() => {
    fetchCourses();
    fetchSubjects();
  }, []);

  // Pagination handlers
  const handleCoursesPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= coursesPagination.totalPages) {
      fetchCourses(newPage, coursesPagination.limit);
    }
  };

  const handleSubjectsPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= subjectsPagination.totalPages) {
      fetchSubjects(newPage, subjectsPagination.limit);
    }
  };

  // Handlers for form changes
  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseForm({ ...courseForm, [name]: value });
  };

  const handleSubjectChange = (e) => {
    const { name, value } = e.target;
    setSubjectForm({ ...subjectForm, [name]: value });
  };

  // Create / Update Course
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingCourseId ? `${API_COURSES}/${editingCourseId}` : API_COURSES;
      const method = editingCourseId ? "PUT" : "POST";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(courseForm),
      });
      setCourseForm(initialCourseForm);
      setEditingCourseId(null);
      fetchCourses(coursesPagination.page, coursesPagination.limit);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create / Update Subject
  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingSubjectId ? `${API_SUBJECTS}/${editingSubjectId}` : API_SUBJECTS;
      const method = editingSubjectId ? "PUT" : "POST";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(subjectForm),
      });
      setSubjectForm(initialSubjectForm);
      setEditingSubjectId(null);
      fetchSubjects(subjectsPagination.page, subjectsPagination.limit);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete Course / Subject
  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure to delete this course?")) return;
    setLoading(true);
    try {
      await fetch(`${API_COURSES}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      fetchCourses(coursesPagination.page, coursesPagination.limit);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Are you sure to delete this subject?")) return;
    setLoading(true);
    try {
      await fetch(`${API_SUBJECTS}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      fetchSubjects(subjectsPagination.page, subjectsPagination.limit);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Edit Course / Subject
  const handleEditCourse = (course) => {
    setCourseForm({ code: course.code, name: course.name });
    setEditingCourseId(course.id);
  };
  
  const handleEditSubject = (subject) => {
    setSubjectForm({ code: subject.code, name: subject.name });
    setEditingSubjectId(subject.id);
  };

  // Assign subjects to course
  const handleAssignSubjects = async () => {
    if (!selectedCourseId || assignSubjects.length === 0) return;
    setLoading(true);
    try {
      await fetch(`${API_COURSES}/${selectedCourseId}/assign-subjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subjectIds: assignSubjects }),
      });
      setAssignSubjects([]);
      setSelectedCourseId(null);
      alert("Subjects assigned successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Pagination Component
  const Pagination = ({ pagination, onPageChange, type }) => (
    <div className="flex items-center justify-between mt-4 p-3 border-t">
      <div className="text-sm text-gray-600">
        Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} {type}
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(pagination.page - 1)}
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
              onClick={() => onPageChange(pageNum)}
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
          onClick={() => onPageChange(pagination.page + 1)}
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
          📚 Courses & Subjects Management
        </h1>

        {/* Forms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <form onSubmit={handleCourseSubmit} className="bg-white p-4 rounded shadow-md">
            <h2 className="font-semibold mb-2">Course</h2>
            <input name="code" value={courseForm.code} onChange={handleCourseChange} placeholder="Course Code" className="border px-3 py-2 w-full rounded mb-2" required />
            <input name="name" value={courseForm.name} onChange={handleCourseChange} placeholder="Course Name" className="border px-3 py-2 w-full rounded mb-2" required />
            <button type="submit" disabled={loading} className="w-full py-2 rounded text-white font-semibold" style={{ backgroundColor: "#246fb2" }}>
              {editingCourseId ? "Update Course" : "Add Course"}
            </button>
          </form>

          <form onSubmit={handleSubjectSubmit} className="bg-white p-4 rounded shadow-md">
            <h2 className="font-semibold mb-2">Subject</h2>
            <input name="code" value={subjectForm.code} onChange={handleSubjectChange} placeholder="Subject Code" className="border px-3 py-2 w-full rounded mb-2" required />
            <input name="name" value={subjectForm.name} onChange={handleSubjectChange} placeholder="Subject Name" className="border px-3 py-2 w-full rounded mb-2" required />
            <button type="submit" disabled={loading} className="w-full py-2 rounded text-white font-semibold" style={{ backgroundColor: "#246fb2" }}>
              {editingSubjectId ? "Update Subject" : "Add Subject"}
            </button>
          </form>
        </div>

        {/* Loader */}
        {loading && <div className="text-center py-4"><div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full mx-auto"></div></div>}

        {/* Courses Table */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto mb-6">
          <h2 className="font-semibold p-3" style={{ color: "#246fb2" }}>Courses</h2>
          <table className="w-full border-collapse">
            <thead style={{ backgroundColor: "#246fb2" }}>
              <tr className="text-left text-white">
                <th className="p-3">Code</th>
                <th className="p-3">Name</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="p-3">{c.code}</td>
                  <td className="p-3">{c.name}</td>
                  <td className="p-3 flex gap-2 flex-wrap">
                    <button onClick={() => handleEditCourse(c)} className="px-3 py-1 bg-yellow-400 text-white rounded-md text-sm">Edit</button>
                    <button onClick={() => handleDeleteCourse(c.id)} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Delete</button>
                    <button
                      onClick={() => {
                        setSelectedCourseId(c.id);
                        fetchSubjectsByCourse(c.id);
                      }}
                      className="px-3 py-1 bg-green-500 text-white rounded-md text-sm"
                    >
                      Assign Subjects
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination 
            pagination={coursesPagination} 
            onPageChange={handleCoursesPageChange}
            type="courses"
          />
        </div>

        {/* Subjects Table */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto mb-6">
          <h2 className="font-semibold p-3" style={{ color: "#246fb2" }}>Subjects</h2>
          <table className="w-full border-collapse">
            <thead style={{ backgroundColor: "#246fb2" }}>
              <tr className="text-left text-white">
                <th className="p-3">Code</th>
                <th className="p-3">Name</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="p-3">{s.code}</td>
                  <td className="p-3">{s.name}</td>
                  <td className="p-3 flex gap-2 flex-wrap">
                    <button onClick={() => handleEditSubject(s)} className="px-3 py-1 bg-yellow-400 text-white rounded-md text-sm">Edit</button>
                    <button onClick={() => handleDeleteSubject(s.id)} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination 
            pagination={subjectsPagination} 
            onPageChange={handleSubjectsPageChange}
            type="subjects"
          />
        </div>

        {/* Assign Subjects */}
        {selectedCourseId && (
          <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 className="font-semibold mb-2" style={{ color: "#246fb2" }}>Assign Subjects to Course</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {subjects.map((s) => (
                <label key={s.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={s.id}
                    checked={assignSubjects.includes(s.id)}
                    onChange={(e) => {
                      const id = s.id;
                      if (assignSubjects.includes(id)) {
                        setAssignSubjects(assignSubjects.filter((x) => x !== id));
                      } else {
                        setAssignSubjects([...assignSubjects, id]);
                      }
                    }}
                  />
                  {s.name}
                </label>
              ))}
            </div>
            <button onClick={handleAssignSubjects} className="mt-3 py-2 px-4 rounded text-white font-semibold" style={{ backgroundColor: "#246fb2" }}>Assign</button>
          </div>
        )}
        
        {selectedCourseId && courseSubjects.length > 0 && (
          <div className="bg-white shadow-md rounded-lg overflow-x-auto mb-6">
            <h2 className="font-semibold p-3" style={{ color: "#246fb2" }}>
              Subjects for Course {courseName}
            </h2>
            <table className="w-full border-collapse">
              <thead style={{ backgroundColor: "#246fb2" }}>
                <tr className="text-left text-white">
                  <th className="p-3">Code</th>
                  <th className="p-3">Name</th>
              
                </tr>
              </thead>
              <tbody>
                {courseSubjects.map((s) => (
                  <tr key={s.id} className="border-b">
                    <td className="p-3">{s.code}</td>
                    <td className="p-3">{s.name}</td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CoursesPage;