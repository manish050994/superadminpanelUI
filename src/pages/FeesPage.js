


// import React, { useEffect, useState } from "react";
// import Layout from "../layouts/Collegelayout";

// const FEES_API = "https://mynexus.co.in/api/api/fees";
// const STUDENTS_API = "https://mynexus.co.in/api/api/students";
// const COURSES_API = "https://mynexus.co.in/api/api/courses";

// const initialClassForm = {
//   courseId: "",
//   amount: "",
//   dueDate: "",
//   description: "",
//   force: false
// };

// const initialStudentForm = {
//   studentId: "",
//   amount: "",
//   dueDate: "",
//   note: ""
// };

// const FeesPage = () => {
//   const [fees, setFees] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [studentHistory, setStudentHistory] = useState([]);
//   const [classForm, setClassForm] = useState(initialClassForm);
//   const [studentForm, setStudentForm] = useState(initialStudentForm);
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("class"); // "class" or "student" or "history"
//   const [selectedStudent, setSelectedStudent] = useState("");
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     totalPages: 0
//   });

//   const token = localStorage.getItem("token");
//   const collegeId = localStorage.getItem("collegeId") || "1";

//   // Fetch students and courses
//   useEffect(() => {
//     fetchStudents();
//     fetchCourses();
//     fetchFees();
//   }, [pagination.page]);

//   const fetchStudents = async () => {
//     try {
//       const res = await fetch(`${STUDENTS_API}?collegeId=${collegeId}&page=1&limit=100`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await res.json();
//       setStudents(data.data?.students || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchCourses = async () => {
//     try {
//       const res = await fetch(`${COURSES_API}?collegeId=${collegeId}&page=1&limit=50`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await res.json();
//       setCourses(data.data?.courses || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Fetch fees with pagination
//   const fetchFees = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${FEES_API}?collegeId=${collegeId}&page=${pagination.page}&limit=${pagination.limit}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await res.json();
//       setFees(data.data?.fees || []);
//       setPagination(prev => ({
//         ...prev,
//         total: data.data?.total || 0,
//         totalPages: Math.ceil((data.data?.total || 0) / pagination.limit)
//       }));
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch student fee history
//   const fetchStudentHistory = async (studentId = selectedStudent) => {
//     if (!studentId) return;
//     setLoading(true);
//     try {
//       const res = await fetch(`${FEES_API}/student-history/${studentId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await res.json();
//       setStudentHistory(data.data || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle class form changes
//   const handleClassFormChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setClassForm(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   // Handle student form changes
//   const handleStudentFormChange = (e) => {
//     const { name, value } = e.target;
//     setStudentForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Add class fee (for all students in a course)
//   const handleAddClassFee = async (e) => {
//     e.preventDefault();
//     if (!classForm.courseId || !classForm.amount || !classForm.dueDate) {
//       alert("Please fill all required fields");
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch(`${FEES_API}/class`, {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json", 
//           Authorization: `Bearer ${token}` 
//         },
//         body: JSON.stringify({
//           courseId: parseInt(classForm.courseId),
//           amount: parseFloat(classForm.amount),
//           dueDate: classForm.dueDate,
//           description: classForm.description
//         }),
//       });

//       const data = await res.json();
//       if (res.ok && data.status === 1) {
//         alert("Class fee created successfully!");
//         setClassForm(initialClassForm);
//         fetchFees();
//       } else {
//         alert(data.message || "Failed to create class fee");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update class fee
//   const handleUpdateClassFee = async (e) => {
//     e.preventDefault();
//     if (!classForm.courseId || !classForm.amount) {
//       alert("Course and Amount are required");
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch(`${FEES_API}/class`, {
//         method: "PATCH",
//         headers: { 
//           "Content-Type": "application/json", 
//           Authorization: `Bearer ${token}` 
//         },
//         body: JSON.stringify({
//           courseId: parseInt(classForm.courseId),
//           amount: parseFloat(classForm.amount),
//           dueDate: classForm.dueDate,
//           force: classForm.force
//         }),
//       });

//       const data = await res.json();
//       if (res.ok && data.status === 1) {
//         alert("Class fee updated successfully!");
//         setClassForm(initialClassForm);
//         fetchFees();
//       } else {
//         alert(data.message || "Failed to update class fee");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update individual student fee
//   const handleUpdateStudentFee = async (e) => {
//     e.preventDefault();
//     if (!studentForm.studentId || !studentForm.amount) {
//       alert("Student and Amount are required");
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch(`${FEES_API}/student/${studentForm.studentId}`, {
//         method: "PATCH",
//         headers: { 
//           "Content-Type": "application/json", 
//           Authorization: `Bearer ${token}` 
//         },
//         body: JSON.stringify({
//           amount: parseFloat(studentForm.amount),
//           dueDate: studentForm.dueDate,
//           note: studentForm.note
//         }),
//       });

//       const data = await res.json();
//       if (res.ok && data.status === 1) {
//         alert("Student fee updated successfully!");
//         setStudentForm(initialStudentForm);
//         fetchFees();
//       } else {
//         alert(data.message || "Failed to update student fee");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fee actions
//   const handlePay = async (id) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${FEES_API}/${id}/pay`, { 
//         method: "POST", 
//         headers: { Authorization: `Bearer ${token}` } 
//       });
//       const data = await res.json();
//       if (res.ok && data.status === 1) {
//         alert("Payment marked as paid!");
//         fetchFees();
//       } else {
//         alert(data.message || "Payment failed");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Payment failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInvoice = async (id) => {
//     try {
//       const res = await fetch(`${FEES_API}/${id}/invoice`, { 
//         headers: { Authorization: `Bearer ${token}` } 
//       });
//       if (!res.ok) throw new Error('Invoice generation failed');
      
//       const blob = await res.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `invoice_${id}.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to generate invoice");
//     }
//   };

//   const handleReminder = async (id) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${FEES_API}/${id}/reminder`, { 
//         method: "POST", 
//         headers: { Authorization: `Bearer ${token}` } 
//       });
//       const data = await res.json();
//       if (res.ok && data.status === 1) {
//         alert("Reminder sent successfully!");
//       } else {
//         alert(data.message || "Failed to send reminder");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to send reminder");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInitiatePayment = async (id) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${FEES_API}/${id}/initiate-payment`, { 
//         method: "POST", 
//         headers: { Authorization: `Bearer ${token}` } 
//       });
//       const data = await res.json();
//       if (res.ok && data.status === 1) {
//         alert("Payment initiated successfully!");
//       } else {
//         alert(data.message || "Failed to initiate payment");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to initiate payment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Pagination handlers
//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.totalPages) {
//       setPagination(prev => ({ ...prev, page: newPage }));
//     }
//   };

//   // Tab content renderer
//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "class":
//         return (
//           <div className="space-y-6">
//             {/* Create Class Fee */}
//             <div className="bg-white p-4 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold mb-4">Create Class Fee</h3>
//               <form onSubmit={handleAddClassFee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <select name="courseId" value={classForm.courseId} onChange={handleClassFormChange} className="border px-3 py-2 rounded-lg w-full" required>
//                   <option value="">Select Course</option>
//                   {courses.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
//                 </select>
//                 <input type="number" name="amount" value={classForm.amount} onChange={handleClassFormChange} placeholder="Amount" className="border px-3 py-2 rounded-lg w-full" required />
//                 <input type="date" name="dueDate" value={classForm.dueDate} onChange={handleClassFormChange} className="border px-3 py-2 rounded-lg w-full" required />
//                 <input type="text" name="description" value={classForm.description} onChange={handleClassFormChange} placeholder="Description" className="border px-3 py-2 rounded-lg w-full" />
//                 <button type="submit" disabled={loading} className="col-span-2 py-2 bg-green-600 text-white font-semibold rounded-lg disabled:opacity-50">
//                   Create Class Fee
//                 </button>
//               </form>
//             </div>

//             {/* Update Class Fee */}
//             <div className="bg-white p-4 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold mb-4">Update Class Fee</h3>
//               <form onSubmit={handleUpdateClassFee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <select name="courseId" value={classForm.courseId} onChange={handleClassFormChange} className="border px-3 py-2 rounded-lg w-full" required>
//                   <option value="">Select Course</option>
//                   {courses.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
//                 </select>
//                 <input type="number" name="amount" value={classForm.amount} onChange={handleClassFormChange} placeholder="New Amount" className="border px-3 py-2 rounded-lg w-full" required />
//                 <input type="date" name="dueDate" value={classForm.dueDate} onChange={handleClassFormChange} className="border px-3 py-2 rounded-lg w-full" />
//                 <div className="flex items-center gap-2">
//                   <input type="checkbox" name="force" checked={classForm.force} onChange={handleClassFormChange} className="w-4 h-4" />
//                   <label>Force Update (override existing payments)</label>
//                 </div>
//                 <button type="submit" disabled={loading} className="col-span-2 py-2 bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50">
//                   Update Class Fee
//                 </button>
//               </form>
//             </div>
//           </div>
//         );

//       case "student":
//         return (
//           <div className="bg-white p-4 rounded-lg shadow-md">
//             <h3 className="text-lg font-semibold mb-4">Update Student Fee</h3>
//             <form onSubmit={handleUpdateStudentFee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <select name="studentId" value={studentForm.studentId} onChange={handleStudentFormChange} className="border px-3 py-2 rounded-lg w-full" required>
//                 <option value="">Select Student</option>
//                 {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>)}
//               </select>
//               <input type="number" name="amount" value={studentForm.amount} onChange={handleStudentFormChange} placeholder="Amount" className="border px-3 py-2 rounded-lg w-full" required />
//               <input type="date" name="dueDate" value={studentForm.dueDate} onChange={handleStudentFormChange} className="border px-3 py-2 rounded-lg w-full" />
//               <input type="text" name="note" value={studentForm.note} onChange={handleStudentFormChange} placeholder="Note/Reason" className="border px-3 py-2 rounded-lg w-full" />
//               <button type="submit" disabled={loading} className="col-span-2 py-2 bg-purple-600 text-white font-semibold rounded-lg disabled:opacity-50">
//                 Update Student Fee
//               </button>
//             </form>
//           </div>
//         );

//       case "history":
//         return (
//           <div className="space-y-4">
//             <div className="bg-white p-4 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold mb-4">Student Fee History</h3>
//               <div className="flex gap-4 items-center">
//                 <select 
//                   value={selectedStudent} 
//                   onChange={(e) => setSelectedStudent(e.target.value)}
//                   className="border px-3 py-2 rounded-lg w-full md:w-auto"
//                 >
//                   <option value="">Select Student</option>
//                   {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>)}
//                 </select>
//                 <button 
//                   onClick={() => fetchStudentHistory()} 
//                   disabled={!selectedStudent}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
//                 >
//                   View History
//                 </button>
//               </div>
//             </div>

//             {studentHistory.length > 0 && (
//               <div className="bg-white rounded-lg shadow-md overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead style={{ backgroundColor: "#246fb2" }}>
//                     <tr className="text-left text-white">
//                       <th className="p-3">Date</th>
//                       <th className="p-3">Amount</th>
//                       <th className="p-3">Type</th>
//                       <th className="p-3">Status</th>
//                       {/* <th className="p-3">Note</th> */}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {studentHistory.map((history, index) => (
//                       <tr key={index} className="border-b hover:bg-gray-50">
//                         <td className="p-3">{new Date(history.createdAt).toLocaleDateString()}</td>
//                         <td className="p-3">₹{history.amount}</td>
//                         <td className="p-3">{history.type || "Fee"}</td>
//                         <td className="p-3">
//                           <span className={`px-2 py-1 rounded-full text-xs ${
//                             history.status === 'paid' 
//                               ? 'bg-green-100 text-green-800' 
//                               : 'bg-yellow-100 text-yellow-800'
//                           }`}>
//                             {history.status || 'pending'}
//                           </span>
//                         </td>
//                         {/* <td className="p-3">{history.note || "-"}</td> */}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Layout>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-6" style={{ color: "#246fb2" }}>💰 Fees Management</h1>

//         {/* Tabs */}
//         <div className="mb-6">
//           <div className="flex border-b">
//             <button
//               onClick={() => setActiveTab("class")}
//               className={`px-4 py-2 font-medium ${
//                 activeTab === "class" 
//                   ? "border-b-2 border-blue-600 text-blue-600" 
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               Class Fees
//             </button>
//             <button
//               onClick={() => setActiveTab("student")}
//               className={`px-4 py-2 font-medium ${
//                 activeTab === "student" 
//                   ? "border-b-2 border-blue-600 text-blue-600" 
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               Student Fees
//             </button>
//             <button
//               onClick={() => setActiveTab("history")}
//               className={`px-4 py-2 font-medium ${
//                 activeTab === "history" 
//                   ? "border-b-2 border-blue-600 text-blue-600" 
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               Fee History
//             </button>
//           </div>
//         </div>

//         {/* Tab Content */}
//         {renderTabContent()}

//         {/* Loader */}
//         {loading && (
//           <div className="text-center py-4">
//             <div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full mx-auto"></div>
//           </div>
//         )}

//         {/* All Fees Table */}
//         <div className="mt-6 bg-white shadow-md rounded-lg overflow-x-auto">
//           <div className="p-4 border-b">
//             <h3 className="text-lg font-semibold">All Fees</h3>
//           </div>
//           <table className="w-full border-collapse">
//             <thead style={{ backgroundColor: "#246fb2" }}>
//               <tr className="text-left text-white">
//                 <th className="p-3">Student</th>
//                 <th className="p-3">Course</th>
//                 <th className="p-3">Amount</th>
//                 <th className="p-3">Due Date</th>
//                 <th className="p-3">Status</th>
//                 <th className="p-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {fees.length > 0 ? fees.map((f) => (
//                 <tr key={f.id} className="border-b hover:bg-gray-50">
//                   <td className="p-3 font-medium">{f.Student?.name || "N/A"}</td>
//                   <td className="p-3">{f.Course?.name || "N/A"}</td>
//                   <td className="p-3">₹{f.amount}</td>
//                   <td className="p-3">{f.dueDate ? new Date(f.dueDate).toLocaleDateString() : "N/A"}</td>
//                   <td className="p-3">
//                     <span className={`px-2 py-1 rounded-full text-xs ${
//                       f.status === 'paid' 
//                         ? 'bg-green-100 text-green-800' 
//                         : f.status === 'overdue'
//                         ? 'bg-red-100 text-red-800'
//                         : 'bg-yellow-100 text-yellow-800'
//                     }`}>
//                       {f.status || 'pending'}
//                     </span>
//                   </td>
//                   <td className="p-3 flex gap-2 flex-wrap">
//                     <button onClick={() => handlePay(f.id)} className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600">Pay</button>
//                     <button onClick={() => handleInvoice(f.id)} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">Invoice</button>
//                     <button onClick={() => handleReminder(f.id)} className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600">Reminder</button>
//                     <button onClick={() => handleInitiatePayment(f.id)} className="px-3 py-1 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-600">Initiate Payment</button>
//                   </td>
//                 </tr>
//               )) : (
//                 <tr>
//                   <td colSpan={6} className="p-3 text-center text-gray-500">No fees found</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* Pagination */}
//           {pagination.totalPages > 1 && (
//             <div className="flex items-center justify-between p-4 border-t">
//               <div className="text-sm text-gray-600">
//                 Page {pagination.page} of {pagination.totalPages} • {pagination.total} total fees
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handlePageChange(pagination.page - 1)}
//                   disabled={pagination.page === 1}
//                   className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
//                 >
//                   Previous
//                 </button>
//                 <button
//                   onClick={() => handlePageChange(pagination.page + 1)}
//                   disabled={pagination.page >= pagination.totalPages}
//                   className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default FeesPage;


import React, { useEffect, useState } from "react";
import Layout from "../layouts/Collegelayout";

const FEES_API = "https://mynexus.co.in/api/api/fees";
const STUDENTS_API = "https://mynexus.co.in/api/api/students";
const COURSES_API = "https://mynexus.co.in/api/api/courses";

const initialClassForm = {
  courseId: "",
  amount: "",
  dueDate: "",
  description: "",
  force: false
};

const initialStudentForm = {
  feeId: "", // Changed from studentId to feeId
  amount: "",
  dueDate: "",
  note: ""
};

const FeesPage = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentHistory, setStudentHistory] = useState([]);
  const [classForm, setClassForm] = useState(initialClassForm);
  const [studentForm, setStudentForm] = useState(initialStudentForm);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("class");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const token = localStorage.getItem("token");
  const collegeId = localStorage.getItem("collegeId") || "1";

  // Fetch students and courses
  useEffect(() => {
    fetchStudents();
    fetchCourses();
    fetchFees();
  }, [pagination.page]);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${STUDENTS_API}?collegeId=${collegeId}&page=1&limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStudents(data.data?.students || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${COURSES_API}?collegeId=${collegeId}&page=1&limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCourses(data.data?.courses || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch fees with pagination
  const fetchFees = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${FEES_API}?collegeId=${collegeId}&page=${pagination.page}&limit=${pagination.limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFees(data.data?.fees || []);
      setPagination(prev => ({
        ...prev,
        total: data.data?.total || 0,
        totalPages: Math.ceil((data.data?.total || 0) / pagination.limit)
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch student fee history
  const fetchStudentHistory = async (studentId = selectedStudent) => {
    if (!studentId) return;
    setLoading(true);
    try {
      const res = await fetch(`${FEES_API}/student-history/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 1) {
        setStudentHistory(data.data || []);
      } else {
        alert(data.message || "Failed to fetch fee history");
        setStudentHistory([]);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching fee history");
      setStudentHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle class form changes
  const handleClassFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClassForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle student form changes
  const handleStudentFormChange = (e) => {
    const { name, value } = e.target;
    setStudentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add class fee (for all students in a course)
  const handleAddClassFee = async (e) => {
    e.preventDefault();
    if (!classForm.courseId || !classForm.amount || !classForm.dueDate) {
      alert("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${FEES_API}/class`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          courseId: parseInt(classForm.courseId),
          amount: parseFloat(classForm.amount),
          dueDate: classForm.dueDate,
          description: classForm.description
        }),
      });

      const data = await res.json();
      if (res.ok && data.status === 1) {
        alert("Class fee created successfully!");
        setClassForm(initialClassForm);
        fetchFees();
      } else {
        alert(data.message || "Failed to create class fee");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Update class fee
  const handleUpdateClassFee = async (e) => {
    e.preventDefault();
    if (!classForm.courseId || !classForm.amount) {
      alert("Course and Amount are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${FEES_API}/class`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          courseId: parseInt(classForm.courseId),
          amount: parseFloat(classForm.amount),
          dueDate: classForm.dueDate,
          force: classForm.force
        }),
      });

      const data = await res.json();
      if (res.ok && data.status === 1) {
        alert("Class fee updated successfully!");
        setClassForm(initialClassForm);
        fetchFees();
      } else {
        alert(data.message || "Failed to update class fee");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Update individual student fee - CORRECTED: Uses fee ID instead of student ID
  const handleUpdateStudentFee = async (e) => {
    e.preventDefault();
    if (!studentForm.feeId || !studentForm.amount) {
      alert("Fee ID and Amount are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${FEES_API}/student/${studentForm.feeId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          amount: parseFloat(studentForm.amount),
          dueDate: studentForm.dueDate,
          note: studentForm.note
        }),
      });

      const data = await res.json();
      if (res.ok && data.status === 1) {
        alert("Student fee updated successfully!");
        setStudentForm(initialStudentForm);
        fetchFees();
        // Also refresh student history if we're viewing it
        if (selectedStudent) {
          fetchStudentHistory();
        }
      } else {
        alert(data.message || "Failed to update student fee");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Fee actions
  const handlePay = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${FEES_API}/${id}/pay`, { 
        method: "POST", 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      if (res.ok && data.status === 1) {
        alert("Payment marked as paid!");
        fetchFees();
        // Refresh student history if viewing
        if (selectedStudent) {
          fetchStudentHistory();
        }
      } else {
        alert(data.message || "Payment failed");
      }
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleInvoice = async (id) => {
    try {
      const res = await fetch(`${FEES_API}/${id}/invoice`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (!res.ok) throw new Error('Invoice generation failed');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate invoice");
    }
  };

  const handleReminder = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${FEES_API}/${id}/reminder`, { 
        method: "POST", 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      if (res.ok && data.status === 1) {
        alert("Reminder sent successfully!");
      } else {
        alert(data.message || "Failed to send reminder");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send reminder");
    } finally {
      setLoading(false);
    }
  };

  const handleInitiatePayment = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${FEES_API}/${id}/initiate-payment`, { 
        method: "POST", 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      if (res.ok && data.status === 1) {
        alert("Payment initiated successfully!");
      } else {
        alert(data.message || "Failed to initiate payment");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // Pre-fill fee ID from history table
  const handleSelectFeeFromHistory = (feeId, studentName, currentAmount) => {
    setStudentForm(prev => ({
      ...prev,
      feeId: feeId,
      amount: currentAmount,
      note: `Updated fee for ${studentName}`
    }));
  };

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case "class":
        return (
          <div className="space-y-6">
            {/* Create Class Fee */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Create Class Fee</h3>
              <form onSubmit={handleAddClassFee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select name="courseId" value={classForm.courseId} onChange={handleClassFormChange} className="border px-3 py-2 rounded-lg w-full" required>
                  <option value="">Select Course</option>
                  {courses.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                </select>
                <input type="number" name="amount" value={classForm.amount} onChange={handleClassFormChange} placeholder="Amount" className="border px-3 py-2 rounded-lg w-full" required />
                <input type="date" name="dueDate" value={classForm.dueDate} onChange={handleClassFormChange} className="border px-3 py-2 rounded-lg w-full" required />
                <input type="text" name="description" value={classForm.description} onChange={handleClassFormChange} placeholder="Description" className="border px-3 py-2 rounded-lg w-full" />
                <button type="submit" disabled={loading} className="col-span-2 py-2 bg-green-600 text-white font-semibold rounded-lg disabled:opacity-50">
                  Create Class Fee
                </button>
              </form>
            </div>

            {/* Update Class Fee */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Update Class Fee</h3>
              <form onSubmit={handleUpdateClassFee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select name="courseId" value={classForm.courseId} onChange={handleClassFormChange} className="border px-3 py-2 rounded-lg w-full" required>
                  <option value="">Select Course</option>
                  {courses.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                </select>
                <input type="number" name="amount" value={classForm.amount} onChange={handleClassFormChange} placeholder="New Amount" className="border px-3 py-2 rounded-lg w-full" required />
                <input type="date" name="dueDate" value={classForm.dueDate} onChange={handleClassFormChange} className="border px-3 py-2 rounded-lg w-full" />
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="force" checked={classForm.force} onChange={handleClassFormChange} className="w-4 h-4" />
                  <label>Force Update (override existing payments)</label>
                </div>
                <button type="submit" disabled={loading} className="col-span-2 py-2 bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50">
                  Update Class Fee
                </button>
              </form>
            </div>
          </div>
        );

      case "student":
        return (
          <div className="space-y-6">
            {/* Update Individual Student Fee */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Update Individual Student Fee</h3>
              <p className="text-sm text-gray-600 mb-4">
                Enter the Fee ID (from the fees table or student history) to update a specific student's fee.
              </p>
              <form onSubmit={handleUpdateStudentFee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  name="feeId" 
                  value={studentForm.feeId} 
                  onChange={handleStudentFormChange} 
                  placeholder="Fee ID (e.g., 44)" 
                  className="border px-3 py-2 rounded-lg w-full" 
                  required 
                />
                <input type="number" name="amount" value={studentForm.amount} onChange={handleStudentFormChange} placeholder="New Amount" className="border px-3 py-2 rounded-lg w-full" required />
                <input type="date" name="dueDate" value={studentForm.dueDate} onChange={handleStudentFormChange} className="border px-3 py-2 rounded-lg w-full" />
                <input type="text" name="note" value={studentForm.note} onChange={handleStudentFormChange} placeholder="Note/Reason for update" className="border px-3 py-2 rounded-lg w-full" />
                <button type="submit" disabled={loading} className="col-span-2 py-2 bg-purple-600 text-white font-semibold rounded-lg disabled:opacity-50">
                  Update Student Fee
                </button>
              </form>
            </div>

            {/* Quick Fee ID Reference */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Quick Fee ID Reference</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Fee ID</th>
                      <th className="p-2 text-left">Student</th>
                      <th className="p-2 text-left">Amount</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.slice(0, 5).map((f) => (
                      <tr key={f.id} className="border-b">
                        <td className="p-2 font-mono">{f.id}</td>
                        <td className="p-2">{f.Student?.name || "N/A"}</td>
                        <td className="p-2">₹{f.amount}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            f.status === 'paid' ? 'bg-green-100' : 'bg-yellow-100'
                          }`}>
                            {f.status}
                          </span>
                        </td>
                        <td className="p-2">
                          <button 
                            onClick={() => handleSelectFeeFromHistory(f.id, f.student?.name, f.amount)}
                            className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                          >
                            Use This Fee
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "history":
        return (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Student Fee History</h3>
              <div className="flex gap-4 items-center">
                <select 
                  value={selectedStudent} 
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="border px-3 py-2 rounded-lg w-full md:w-auto"
                >
                  <option value="">Select Student</option>
                  {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>)}
                </select>
                <button 
                  onClick={() => fetchStudentHistory()} 
                  disabled={!selectedStudent}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                  View History
                </button>
              </div>
            </div>

            {studentHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead style={{ backgroundColor: "#246fb2" }}>
                    <tr className="text-left text-white">
                      <th className="p-3">Fee ID</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Course</th>
                      <th className="p-3">Created Date</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentHistory.map((fee) => (
                      <tr key={fee.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-mono text-sm">{fee.id}</td>
                        <td className="p-3 font-medium">₹{fee.amount}</td>
                        <td className="p-3">{fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : "N/A"}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            fee.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : fee.status === 'overdue'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {fee.status || 'pending'}
                          </span>
                        </td>
                        <td className="p-3">{fee.courseName || `Course ${fee.courseId}`}</td>
                        <td className="p-3">{new Date(fee.createdAt).toLocaleDateString()}</td>
                        <td className="p-3 flex gap-2 flex-wrap">
                          <button 
                            onClick={() => handleSelectFeeFromHistory(fee.id, selectedStudent, fee.amount)}
                            className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
                          >
                            Use for Update
                          </button>
                          <button 
                            onClick={() => handlePay(fee.id)} 
                            disabled={fee.status === 'paid'}
                            className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 disabled:opacity-50"
                          >
                            Pay
                          </button>
                          <button 
                            onClick={() => handleInvoice(fee.id)} 
                            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                          >
                            Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedStudent && studentHistory.length === 0 && !loading && (
              <div className="bg-white p-8 text-center rounded-lg shadow-md">
                <p className="text-gray-500">No fee history found for this student</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "#246fb2" }}>💰 Fees Management</h1>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("class")}
              className={`px-4 py-2 font-medium ${
                activeTab === "class" 
                  ? "border-b-2 border-blue-600 text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Class Fees
            </button>
            <button
              onClick={() => setActiveTab("student")}
              className={`px-4 py-2 font-medium ${
                activeTab === "student" 
                  ? "border-b-2 border-blue-600 text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Student Fees
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 font-medium ${
                activeTab === "history" 
                  ? "border-b-2 border-blue-600 text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Fee History
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Loader */}
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full mx-auto"></div>
          </div>
        )}

        {/* All Fees Table */}
        <div className="mt-6 bg-white shadow-md rounded-lg overflow-x-auto">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">All Fees</h3>
          </div>
          <table className="w-full border-collapse">
            <thead style={{ backgroundColor: "#246fb2" }}>
              <tr className="text-left text-white">
                <th className="p-3">Fee ID</th>
                <th className="p-3">Student</th>
                <th className="p-3">Course</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.length > 0 ? fees.map((f) => (
                <tr key={f.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">{f.id}</td>
                  <td className="p-3 font-medium">{f.Student?.name || "N/A"}</td>
                  <td className="p-3">{f.Course?.name || "N/A"}</td>
                  <td className="p-3">₹{f.amount}</td>
                  <td className="p-3">{f.dueDate ? new Date(f.dueDate).toLocaleDateString() : "N/A"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      f.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : f.status === 'overdue'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {f.status || 'pending'}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2 flex-wrap">
                    <button 
                      onClick={() => handleSelectFeeFromHistory(f.id, f.Student?.name, f.amount)}
                      className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
                    >
                      Use for Update
                    </button>
                    <button 
                      onClick={() => handlePay(f.id)} 
                      disabled={f.status === 'paid'}
                      className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 disabled:opacity-50"
                    >
                      Pay
                    </button>
                    <button onClick={() => handleInvoice(f.id)} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">Invoice</button>
                    <button onClick={() => handleReminder(f.id)} className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600">Reminder</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="p-3 text-center text-gray-500">No fees found</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages} • {pagination.total} total fees
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FeesPage;