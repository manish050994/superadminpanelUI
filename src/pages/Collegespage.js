
// import React, { useEffect, useState } from "react";
// import Layout from "../layouts/Layouts";

// const API_BASE = "https://mynexus.co.in/api/api/colleges";

// const CollegesPage = () => {
//   const [colleges, setColleges] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [total, setTotal] = useState(0);
//   const [form, setForm] = useState({
//     name: "",
//     code: "",
//     shortName: "",
//     address: "",
//     street: "",
//     city: "",
//     state: "",
//     country: "",
//     pincode: "",
//     contactNo: "",
//     email: "",
//     type: "",
//     adminName: "",
//     adminEmail: "",
//     adminPassword: "",
//     features: {
//       attendance: false,
//       studentManagement: false,
//       teacherManagement: false,
//       courseManagement: false,
//       feeManagement: false,
//       parent: false,
//       notification: false,
//       leave: false,
//       report: false,
//       assignment: false,
//       assessment: false,
//       timetable: false,
//     },
//   });
//   const [signatureFile, setSignatureFile] = useState(null);
//   const [stampFile, setStampFile] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const token = localStorage.getItem("token");

//   // Fetch Colleges
//   const fetchColleges = async (pageNum = page) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}?page=${pageNum}&limit=${limit}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setColleges(data.data?.colleges || []);
//       setTotal(data.data?.total || 0);
//       setPage(data.data?.page || 1);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchColleges();
//   }, []);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (name.startsWith("features.")) {
//       const field = name.split(".")[1];
//       setForm({
//         ...form,
//         features: { ...form.features, [field]: checked },
//       });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   // Handle file changes
//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (name === "signature") {
//       setSignatureFile(files[0]);
//     } else if (name === "stamp") {
//       setStampFile(files[0]);
//     }
//   };

//   // Add / Update College
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!editingId && !form.adminPassword.trim())
//       return alert("Admin password is required");

//     setLoading(true);
//     try {
//       const formData = new FormData();
      
//       // Add all form fields to FormData
//       Object.keys(form).forEach(key => {
//         if (key === 'features') {
//           formData.append(key, JSON.stringify(form[key]));
//         } else if (form[key] !== null && form[key] !== undefined) {
//           formData.append(key, form[key]);
//         }
//       });

//       // Add files if they exist
//       if (signatureFile) {
//         formData.append("signature", signatureFile);
//       }
//       if (stampFile) {
//         formData.append("stamp", stampFile);
//       }

//       const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
//       const method = editingId ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const result = await res.json();
      
//       if (res.ok) {
//         // Reset form
//         setForm({
//           name: "",
//           code: "",
//           shortName: "",
//           address: "",
//           street: "",
//           city: "",
//           state: "",
//           country: "",
//           pincode: "",
//           contactNo: "",
//           email: "",
//           type: "",
//           adminName: "",
//           adminEmail: "",
//           adminPassword: "",
//           features: {
//             attendance: false,
//             studentManagement: false,
//             teacherManagement: false,
//             courseManagement: false,
//             feeManagement: false,
//             parent: false,
//             notification: false,
//             leave: false,
//             report: false,
//             assignment: false,
//             assessment: false,
//             timetable: false,
//           },
//         });
//         setSignatureFile(null);
//         setStampFile(null);
//         setEditingId(null);
//         fetchColleges(page);
//       } else {
//         alert(result.message || "Something went wrong");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Network error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete College
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure?")) return;
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       if (res.ok) {
//         fetchColleges(page);
//       } else {
//         alert("Failed to delete college");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Network error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Toggle Active/Inactive
//   const handleToggle = async (id) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/${id}/toggle`, {
//         method: "PATCH",
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       if (res.ok) {
//         fetchColleges(page);
//       } else {
//         alert("Failed to toggle college status");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Network error occurred");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Edit College
//   const handleEdit = (college) => {
//     setForm({
//       name: college.name || "",
//       code: college.code || "",
//       shortName: college.shortName || "",
//       address: college.address || "",
//       street: college.street || "",
//       city: college.city || "",
//       state: college.state || "",
//       country: college.country || "",
//       pincode: college.pincode || "",
//       contactNo: college.contactNo || "",
//       email: college.email || "",
//       type: college.type || "",
//       adminName: college.admin?.name || "",
//       adminEmail: college.admin?.email || "",
//       adminPassword: "",
//       features: {
//         attendance: college.features?.attendance || false,
//         studentManagement: college.features?.studentManagement || false,
//         teacherManagement: college.features?.teacherManagement || false,
//         courseManagement: college.features?.courseManagement || false,
//         feeManagement: college.features?.feeManagement || false,
//         parent: college.features?.parent || false,
//         notification: college.features?.notification || false,
//         leave: college.features?.leave || false,
//         report: college.features?.report || false,
//         assignment: college.features?.assignment || false,
//         assessment: college.features?.assessment || false,
//         timetable: college.features?.timetable || false,
//       },
//     });
//     setEditingId(college.id);
//     setSignatureFile(null);
//     setStampFile(null);
//   };

//   // Pagination controls
//   const totalPages = Math.ceil(total / limit);

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > totalPages) return;
//     fetchColleges(newPage);
//   };

//   // Export to CSV
//   const exportToCSV = () => {
//     if (!colleges.length) return;

//     const headers = [
//       "College Code",
//       "College Name",
//       "Type of College",
//       "Street",
//       "City",
//       "State",
//       "Country",
//       "Pincode",
//       "Contact No",
//       "Email ID",
//       "Created At",
//     ];

//     const rows = colleges.map((college) => [
//       college.code || "",
//       college.name || "",
//       college.type || "",
//       college.street || "",
//       college.city || "",
//       college.state || "",
//       college.country || "",
//       college.pincode || "",
//       college.contactNo || college.admin?.mobile || "",
//       college.admin?.email || "",
//       college.createdAt || "",
//     ]);

//     const csvContent =
//       [headers, ...rows]
//         .map((e) => e.map((v) => `"${v}"`).join(","))
//         .join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.setAttribute("download", "colleges.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <Layout>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-6" style={{ color: "#246fb2" }}>
//           🎓 Colleges Management
//         </h1>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-md mb-6"
//           encType="multipart/form-data"
//         >
//           <input
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             placeholder="College Name"
//             required
//             className="border px-3 py-2 rounded-lg w-full"
//           />
//           <input
//             name="code"
//             value={form.code}
//             onChange={handleChange}
//             placeholder="College Code"
//             required
//             className="border px-3 py-2 rounded-lg w-full"
//           />
//           <input
//             name="shortName"
//             value={form.shortName}
//             onChange={handleChange}
//             placeholder="Short Name"
//             className="border px-3 py-2 rounded-lg w-full"
//           />
//           <input
//             name="address"
//             value={form.address}
//             onChange={handleChange}
//             placeholder="College Address"
//             className="border px-3 py-2 rounded-lg w-full"
//           />

//           {/* Address Fields */}
//           <input
//             name="street"
//             value={form.street}
//             onChange={handleChange}
//             placeholder="Street"
//             className="border px-3 py-2 rounded-lg w-full"
//           />
//           <input
//             name="city"
//             value={form.city}
//             onChange={handleChange}
//             placeholder="City"
//             className="border px-3 py-2 rounded-lg w-full"
//           />
//           <input
//             name="state"
//             value={form.state}
//             onChange={handleChange}
//             placeholder="State"
//             className="border px-3 py-2 rounded-lg w-full"
//           />
//           <input
//             name="country"
//             value={form.country}
//             onChange={handleChange}
//             placeholder="Country"
//             className="border px-3 py-2 rounded-lg w-full"
//           />
//           <input
//             name="pincode"
//             value={form.pincode}
//             onChange={handleChange}
//             placeholder="Pincode"
//             className="border px-3 py-2 rounded-lg w-full"
//           />
//           <input
//             name="contactNo"
//             value={form.contactNo}
//             onChange={handleChange}
//             placeholder="Contact Number"
//             className="border px-3 py-2 rounded-lg w-full"
//           />
//           <input
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             placeholder="College Email"
//             type="email"
//             className="border px-3 py-2 rounded-lg w-full"
//           />

//           <select
//             name="type"
//             onChange={handleChange}
//             value={form.type || ""}
//             className="border px-3 py-2 rounded-lg w-full"
//           >
//             <option value="" disabled>Select College Type</option>
//             <option value="Private">Private</option>
//             <option value="Government">Government</option>
//             <option value="Autonomous">Autonomous</option>
//             <option value="University">University</option>
//             <option value="Institute">Institute</option>
//             <option value="Affiliated University">Affiliated University</option>
//             <option value="Board Name">Board Name</option>
//           </select>

//           {/* Admin Section */}
//           <input
//             name="adminName"
//             value={form.adminName}
//             onChange={handleChange}
//             placeholder="Admin Name"
//             required
//             className="border px-3 py-2 rounded-lg w-full"
//           />
//           <input
//             name="adminEmail"
//             value={form.adminEmail}
//             onChange={handleChange}
//             placeholder="Admin Email"
//             required
//             className="border px-3 py-2 rounded-lg w-full"
//             type="email"
//           />

//           <input
//             name="adminPassword"
//             type="password"
//             value={form.adminPassword}
//             onChange={handleChange}
//             placeholder="Admin Password"
//             className="border px-3 py-2 rounded-lg w-full"
//             autoComplete="new-password"
//           />

//           {/* File Uploads */}
//           <div className="col-span-2">
//             <label className="block mb-2 font-medium">Signature</label>
//             <input
//               type="file"
//               name="signature"
//               onChange={handleFileChange}
//               className="border px-3 py-2 rounded-lg w-full"
//               accept="image/*"
//             />
//           </div>

//           <div className="col-span-2">
//             <label className="block mb-2 font-medium">Stamp</label>
//             <input
//               type="file"
//               name="stamp"
//               onChange={handleFileChange}
//               className="border px-3 py-2 rounded-lg w-full"
//               accept="image/*"
//             />
//           </div>

//           {/* Features */}
//           <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 gap-2 border-t pt-4">
//             {Object.keys(form.features).map((key) => (
//               <label key={key} className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   name={`features.${key}`}
//                   checked={form.features[key]}
//                   onChange={handleChange}
//                   className="w-4 h-4"
//                 />
//                 <span className="capitalize">{key}</span>
//               </label>
//             ))}
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="col-span-2 py-2 text-white font-semibold rounded-lg disabled:opacity-50"
//             style={{ backgroundColor: "#246fb2" }}
//           >
//             {loading ? "Processing..." : editingId ? "Update College" : "Add College"}
//           </button>
//         </form>

//         {/* Loader */}
//         {loading && (
//           <div className="text-center py-4">
//             <div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full mx-auto"></div>
//           </div>
//         )}

//         {/* Colleges List */}
//         <div className="bg-white shadow-md rounded-lg overflow-x-auto">
//           <button
//             onClick={exportToCSV}
//             className="mb-4 px-4 py-2 text-white rounded-lg"
//             style={{ backgroundColor: "#246fb2" }}
//           >
//             Export CSV
//           </button>
//           <table className="w-full border-collapse">
//             <thead style={{ backgroundColor: "#246fb2" }}>
//               <tr className="text-left text-white">
//                 <th className="p-3">ID</th>
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Code</th>
//                 <th className="p-3">Login ID</th>
//                 <th className="p-3">Address</th>
//                 <th className="p-3">Status</th>
//                 <th className="p-3">Features</th>
//                 <th className="p-3">Type</th>
//                 <th className="p-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {colleges.length > 0 ? (
//                 colleges.map((college, index) => (
//                   <tr key={college.id} className="border-b hover:bg-gray-50">
//                     <td className="p-3">{index + 1}</td>
//                     <td className="p-3 font-medium">{college.name}</td>
//                     <td className="p-3">{college.code}</td>
//                     <td className="p-3">{college.loginId}</td>
//                     <td className="p-3">
//                       {[
//                         college.address,
//                         college.street,
//                         college.city,
//                         college.state,
//                         college.country,
//                         college.pincode,
//                       ]
//                         .filter(Boolean)
//                         .join(", ")}
//                     </td>
//                     <td className="p-3">
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         college.status 
//                           ? "bg-green-100 text-green-800" 
//                           : "bg-red-100 text-red-800"
//                       }`}>
//                         {college.status ? "Active" : "Inactive"}
//                       </span>
//                     </td>
//                     <td className="p-3 text-sm">
//                       {college.features &&
//                         Object.keys(college.features)
//                           .filter((key) => college.features[key])
//                           .join(", ")}
//                     </td>
//                     <td className="p-3">{college.type}</td>
//                     <td className="p-3 flex gap-2 flex-wrap">
//                       <button
//                         onClick={() => handleEdit(college)}
//                         className="px-3 py-1 bg-yellow-400 text-white rounded-md text-sm hover:bg-yellow-500"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleToggle(college.id)}
//                         className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
//                       >
//                         Toggle
//                       </button>
//                       <button
//                         onClick={() => handleDelete(college.id)}
//                         className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td className="p-3 text-center text-gray-500" colSpan={9}>
//                     No colleges found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination Controls */}
//         <div className="flex justify-center items-center gap-4 mt-4">
//           <button
//             onClick={() => handlePageChange(page - 1)}
//             disabled={page <= 1}
//             className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-400"
//           >
//             ◀ Prev
//           </button>
//           <span className="text-sm font-medium">
//             Page {page} of {totalPages}
//           </span>
//           <button
//             onClick={() => handlePageChange(page + 1)}
//             disabled={page >= totalPages}
//             className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-400"
//           >
//             Next ▶
//           </button>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default CollegesPage;


import React, { useEffect, useState } from "react";
import Layout from "../layouts/Layouts";

const API_BASE = "https://mynexus.co.in/api/api/colleges";

const CollegesPage = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const emptyForm = {
    name: "",
    code: "",
    shortName: "",
    address: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    contactNo: "",
    email: "",
    type: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    features: {
      attendance: false,
      studentManagement: false,
      teacherManagement: false,
      courseManagement: false,
      feeManagement: false,
      parent: false,
      notification: false,
      leave: false,
      report: false,
      assignment: false,
      assessment: false,
      timetable: false,
    },
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [signatureFile, setSignatureFile] = useState(null);
  const [stampFile, setStampFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  // ---------------- FETCH COLLEGES ----------------
  const fetchColleges = async (pageNum = page) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?page=${pageNum}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setColleges(data.data?.colleges || []);
      setTotal(data.data?.total || 0);
      setPage(data.data?.page || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  // ---------------- VALIDATION ----------------
  const validate = () => {
    let newErrors = {};

    Object.keys(form).forEach((key) => {
      if (key !== "features" && !form[key]?.trim()) {
        newErrors[key] = "This field is required";
      }
    });

    // Email validation
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (form.adminEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.adminEmail)) {
      newErrors.adminEmail = "Invalid admin email";
    }

    // Mobile number validation
    if (form.contactNo && !/^[0-9]{10}$/.test(form.contactNo)) {
      newErrors.contactNo = "Must be a 10-digit number";
    }

    // Admin password is required only while adding
    if (!editingId && !form.adminPassword.trim()) {
      newErrors.adminPassword = "Admin password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- HANDLE INPUT CHANGE ----------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("features.")) {
      const field = name.split(".")[1];
      setForm({
        ...form,
        features: { ...form.features, [field]: checked },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ---------------- FILE UPLOAD ----------------
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "signature") setSignatureFile(files[0]);
    if (name === "stamp") setStampFile(files[0]);
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "features") {
          formData.append(key, JSON.stringify(form[key]));
        } else formData.append(key, form[key]);
      });

      if (signatureFile) formData.append("signature", signatureFile);
      if (stampFile) formData.append("stamp", stampFile);

      const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        resetForm();
        fetchColleges(page);
      } else {
        alert("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setSignatureFile(null);
    setStampFile(null);
    setEditingId(null);
    setErrors({});
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    setLoading(true);
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchColleges(page);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- TOGGLE ACTIVE ----------------
  const handleToggle = async (id) => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchColleges(page);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- EDIT ----------------
  // const handleEdit = (college) => {
  //   setForm({
  //     name: college.name || "",
  //     code: college.code || "",
  //     shortName: college.shortName || "",
  //     address: college.address || "",
  //     street: college.street || "",
  //     city: college.city || "",
  //     state: college.state || "",
  //     country: college.country || "",
  //     pincode: college.pincode || "",
  //     contactNo: college.contactNo || "",
  //     email: college.email || "",
  //     type: college.type || "",
  //     adminName: college.admin?.name || "",
  //     adminEmail: college.admin?.email || "",
  //     adminPassword: "",
  //     features: college.features || emptyForm.features,
  //   });

  //   setEditingId(college.id);
  // };
const handleEdit = (college) => {
  setEditingId(college.id);

  // Extract address fields
  let street = "";
  let city = "";
  let state = "";
  let country = "";
  let pincode = "";

  if (college.address) {
    const parts = college.address.split(",");
    street = parts[0]?.trim() || "";
    city = parts[1]?.trim() || "";
    state = parts[2]?.trim() || "";
    country = parts[3]?.trim() || "";

    // last part contains "- 2080012"
    const pinPart = parts[4]?.trim() || "";
    pincode = pinPart.replace("- ", "").trim();
  }

  setForm({
    name: college.name || "",
    code: college.code || "",
    shortName: college.shortName || "",
    type: college.type || "",
    email: college.email || "",
    contactNo: college.contactNo || "",
    street,
    city,
    state,
    country,
    pincode,
    adminName: college.adminName || "",
    adminEmail: college.email || "", // if API gives separate admin email, map that
    adminPassword: "", // password cannot be shown in edit
    features: college.features || {
      leave: false,
      parent: false,
      report: false,
      timetable: false,
      assessment: false,
      assignment: false,
      attendance: false,
      notification: false,
      feeManagement: false,
      courseManagement: false,
      studentManagement: false,
      teacherManagement: false
    },
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
};

  // ---------------- PAGINATION ----------------
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) fetchColleges(newPage);
  };

  // ---------------- CSV EXPORT ----------------
  const exportToCSV = () => {
    if (!colleges.length) return;
    const headers = [
      "College Code",
      "College Name",
      "Type",
      "City",
      "State",
      "Email",
    ];
    const rows = colleges.map((c) => [
      c.code,
      c.name,
      c.type,
      c.city,
      c.state,
      c.email,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "colleges.csv";
    link.click();
  };

  return (
    <Layout>
      <div className="p-6">

        <h1 className="text-2xl font-bold mb-6" style={{ color: "#246fb2" }}>
          🎓 Colleges Management
        </h1>

        {/* ------------ FORM START ------------ */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-md mb-6"
          encType="multipart/form-data"
        >
          {/** ------- INPUT COMPONENT ------- */}
          {[
            "name",
            "code",
            "shortName",
            "address",
            "street",
            "city",
            "state",
            "country",
            "pincode",
            "contactNo",
            "email",
            "adminName",
            "adminEmail",
          ].map((key) => (
            <div key={key}>
              <input
                name={key}
                value={form[key]}
                onChange={handleChange}
                placeholder={key.replace(/([A-Z])/g, " $1")}
                className="border px-3 py-2 rounded-lg w-full"
              />
              {errors[key] && (
                <p className="text-red-500 text-sm mt-1">{errors[key]}</p>
              )}
            </div>
          ))}

          {/* ADMIN PASSWORD */}
          <div>
            <input
              name="adminPassword"
              type="password"
              value={form.adminPassword}
              onChange={handleChange}
              placeholder="Admin Password"
              className="border px-3 py-2 rounded-lg w-full"
              autoComplete="new-password"
            />
            {errors.adminPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.adminPassword}</p>
            )}
          </div>

          {/* SELECT TYPE */}
          <select
            name="type"
            onChange={handleChange}
            value={form.type}
            className="border px-3 py-2 rounded-lg w-full"
          >
            <option value="">Select College Type</option>
            <option>Private</option>
            <option>Government</option>
            <option>Autonomous</option>
            <option>University</option>
            <option>Institute</option>
            <option>Affiliated University</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type}</p>
          )}

          {/* FILE INPUTS */}
          <div className="col-span-2">
            <label>Signature</label>
            <input type="file" name="signature" onChange={handleFileChange} />
          </div>

          <div className="col-span-2">
            <label>Stamp</label>
            <input type="file" name="stamp" onChange={handleFileChange} />
          </div>

          {/* FEATURES */}
          <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t">
            {Object.keys(form.features).map((key) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={`features.${key}`}
                  checked={form.features[key]}
                  onChange={handleChange}
                />
                <span>{key}</span>
              </label>
            ))}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="col-span-2 py-2 text-white rounded-lg"
            style={{ backgroundColor: "#246fb2" }}
          >
            {editingId ? "Update College" : "Add College"}
          </button>
        </form>

        {/* ------------ LOADER ------------ */}
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full mx-auto"></div>
          </div>
        )}

        {/* ------------ TABLE ------------ */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto p-4">
          <button
            onClick={exportToCSV}
            className="mb-4 px-4 py-2 text-white rounded-lg"
            style={{ backgroundColor: "#246fb2" }}
          >
            Export CSV
          </button>

          <table className="w-full border-collapse">
            <thead style={{ backgroundColor: "#246fb2" }}>
              <tr className="text-left text-white">
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Code</th>
                <th className="p-3">Login ID</th>
                <th className="p-3">Address</th>
                <th className="p-3">Status</th>
                <th className="p-3">Features</th>
                <th className="p-3">Type</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {colleges.length ? (
                colleges.map((c, index) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{c.name}</td>
                    <td className="p-3">{c.code}</td>
                    <td className="p-3">{c.loginId}</td>
                    <td className="p-3">
                      {[c.address, c.street, c.city, c.state].join(", ")}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          c.status ? "bg-green-200" : "bg-red-200"
                        }`}
                      >
                        {c.status ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="p-3 text-sm">
                      {Object.keys(c.features || {})
                        .filter((f) => c.features[f])
                        .join(", ")}
                    </td>

                    <td className="p-3">{c.type}</td>

                    <td className="p-3 flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleEdit(c)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleToggle(c.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Toggle
                      </button>

                      <button
                        onClick={() => handleDelete(c.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center p-4" colSpan={9}>
                    No colleges found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ------------ PAGINATION ------------ */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CollegesPage;
