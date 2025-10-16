



// import React, { useEffect, useState } from "react";
// import Layout from "../layouts/Layouts";

// const API_BASE = "https://mynexus.co.in/api/api/colleges";

// const CollegesPage = () => {
//   const [colleges, setColleges] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({
//     name: "",
//     code: "",
//     address: "",
//     street: "",
//     city: "",
//     state: "",
//     country: "",
//     pincode: "",
//     admin: { name: "", email: "", password: "" },
//     features: {
//       attendance: false,
//       studentManagement: false,
//       teacherManagement: false,
//       courseManagement: false,
//       feeManagement: false,
//       notification: false,
//       leave: false,
//       report: false,
//       assignment: false,
//       assessment: false,
//       timetable: false,
//     },
//   });
//   const [editingId, setEditingId] = useState(null);
//   const token = localStorage.getItem("token");

//   // Fetch Colleges
//   const fetchColleges = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}?page=1&limit=10`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setColleges(data.data?.colleges || []);
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

//     if (name.startsWith("admin.")) {
//       const field = name.split(".")[1];
//       setForm({ ...form, admin: { ...form.admin, [field]: value } });
//     } else if (name.startsWith("features.")) {
//       const field = name.split(".")[1];
//       setForm({
//         ...form,
//         features: { ...form.features, [field]: checked },
//       });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   // Add / Update College
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!editingId && !form.admin.password.trim())
//       return alert("Admin password is required");

//     setLoading(true);
//     try {
//       const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
//       const method = editingId ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(form),
//       });

//       await res.json();
//       setForm({
//         name: "",
//         code: "",
//         address: "",
//         street: "",
//         city: "",
//         state: "",
//         country: "",
//         pincode: "",
//         admin: { name: "", email: "", password: "" },
//         features: {
//           attendance: false,
//           studentManagement: false,
//           teacherManagement: false,
//           courseManagement: false,
//           feeManagement: false,
//           notification: false,
//           leave: false,
//           report: false,
//           assignment: false,
//           assessment: false,
//           timetable: false,
//         },
//       });
//       setEditingId(null);
//       fetchColleges();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete College
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure?")) return;
//     setLoading(true);
//     try {
//       await fetch(`${API_BASE}/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchColleges();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Toggle Active/Inactive
//   const handleToggle = async (id) => {
//     setLoading(true);
//     try {
//       await fetch(`${API_BASE}/${id}/toggle`, {
//         method: "PATCH",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchColleges();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Edit College
//   const handleEdit = (college) => {
//     setForm({
//       name: college.name || "",
//       code: college.code || "",
//       address: college.address || "",
//       street: college.street || "",
//       city: college.city || "",
//       state: college.state || "",
//       country: college.country || "",
//       pincode: college.pincode || "",
//       admin: {
//         name: college.admin?.name || "",
//         email: college.admin?.email || "",
//         password: "",
//       },
//       features: {
//         attendance: college.features?.attendance || false,
//         studentManagement: college.features?.studentManagement || false,
//         teacherManagement: college.features?.teacherManagement || false,
//         courseManagement: college.features?.courseManagement || false,
//         feeManagement: college.features?.feeManagement || false,
//         notification: college.features?.notification || false,
//         leave: college.features?.leave || false,
//         report: college.features?.report || false,
//         assignment: college.features?.assignment || false,
//         assessment: college.features?.assessment || false,
//         timetable: college.features?.timetable || false,
//       },
//     });
//     setEditingId(college.id);
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
//             name="address"
//             value={form.address}
//             onChange={handleChange}
//             placeholder="College Address"
//             className="border px-3 py-2 rounded-lg w-full col-span-2"
//           />

//           {/* New Address Fields */}
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

//           {/* Admin Section */}
//           <input
//             name="admin.name"
//             value={form.admin.name}
//             onChange={handleChange}
//             placeholder="Admin Name"
//             required
//             className="border px-3 py-2 rounded-lg w-full"
//           />
//           <input
//             name="admin.email"
//             value={form.admin.email}
//             onChange={handleChange}
//             placeholder="Admin Email"
//             required
//             className="border px-3 py-2 rounded-lg w-full"
//           />
//           <input
//             name="admin.password"
//             type="password"
//             value={form.admin.password}
//             onChange={handleChange}
//             placeholder="Admin Password"
//             className="border px-3 py-2 rounded-lg w-full col-span-2"
//           />

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
//             className="col-span-2 py-2 text-white font-semibold rounded-lg"
//             style={{ backgroundColor: "#246fb2" }}
//           >
//             {editingId ? "Update College" : "Add College"}
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
//           <table className="w-full border-collapse">
//             <thead style={{ backgroundColor: "#246fb2" }}>
//               <tr className="text-left text-white">
//                 <th className="p-3">Name</th>
//                 <th className="p-3">Code</th>
//                 <th className="p-3">Login ID</th>
//                 <th className="p-3">Address</th>
//                 <th className="p-3">Status</th>
//                 <th className="p-3">Features</th>
//                 <th className="p-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {colleges.length > 0 ? (
//                 colleges.map((college) => (
//                   <tr key={college.id} className="border-b">
//                     <td className="p-3">{college.name}</td>
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
//                       {college.status ? "Active" : "Inactive"}
//                     </td>
//                     <td className="p-3">
//                       {college.features &&
//                         Object.keys(college.features)
//                           .filter((key) => college.features[key])
//                           .join(", ")}
//                     </td>
//                     <td className="p-3 flex gap-2 flex-wrap">
//                       <button
//                         onClick={() => handleEdit(college)}
//                         className="px-3 py-1 bg-yellow-400 text-white rounded-md text-sm"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleToggle(college.id)}
//                         className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
//                       >
//                         Toggle
//                       </button>
//                       <button
//                         onClick={() => handleDelete(college.id)}
//                         className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td className="p-3 text-center text-gray-500" colSpan={6}>
//                     No colleges found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
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
  const [form, setForm] = useState({
    name: "",
    code: "",
    address: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    admin: { name: "", email: "", password: "" },
    features: {
      attendance: false,
      studentManagement: false,
      teacherManagement: false,
      courseManagement: false,
      feeManagement: false,
      notification: false,
      leave: false,
      report: false,
      assignment: false,
      assessment: false,
      timetable: false,
    },
  });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch Colleges
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("admin.")) {
      const field = name.split(".")[1];
      setForm({ ...form, admin: { ...form.admin, [field]: value } });
    } else if (name.startsWith("features.")) {
      const field = name.split(".")[1];
      setForm({
        ...form,
        features: { ...form.features, [field]: checked },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Add / Update College
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !form.admin.password.trim())
      return alert("Admin password is required");

    setLoading(true);
    try {
      const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      await res.json();
      setForm({
        name: "",
        code: "",
        address: "",
        street: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        admin: { name: "", email: "", password: "" },
        features: {
          attendance: false,
          studentManagement: false,
          teacherManagement: false,
          courseManagement: false,
          feeManagement: false,
          notification: false,
          leave: false,
          report: false,
          assignment: false,
          assessment: false,
          timetable: false,
        },
      });
      setEditingId(null);
      fetchColleges(page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete College
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    setLoading(true);
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchColleges(page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Active/Inactive
  const handleToggle = async (id) => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchColleges(page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Edit College
  const handleEdit = (college) => {
    setForm({
      name: college.name || "",
      code: college.code || "",
      address: college.address || "",
      street: college.street || "",
      city: college.city || "",
      state: college.state || "",
      country: college.country || "",
      pincode: college.pincode || "",
      admin: {
        name: college.admin?.name || "",
        email: college.admin?.email || "",
        password: "",
      },
      features: {
        attendance: college.features?.attendance || false,
        studentManagement: college.features?.studentManagement || false,
        teacherManagement: college.features?.teacherManagement || false,
        courseManagement: college.features?.courseManagement || false,
        feeManagement: college.features?.feeManagement || false,
        notification: college.features?.notification || false,
        leave: college.features?.leave || false,
        report: college.features?.report || false,
        assignment: college.features?.assignment || false,
        assessment: college.features?.assessment || false,
        timetable: college.features?.timetable || false,
      },
    });
    setEditingId(college.id);
  };

  // Pagination controls
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchColleges(newPage);
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "#246fb2" }}>
          🎓 Colleges Management
        </h1>

        {/* Form */}
        {/* ... (form code stays the same) ... */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-md mb-6"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="College Name"
            required
            className="border px-3 py-2 rounded-lg w-full"
          />
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="College Code"
            required
            className="border px-3 py-2 rounded-lg w-full"
          />
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="College Address"
            className="border px-3 py-2 rounded-lg w-full col-span-2"
          />

          {/* New Address Fields */}
          <input
            name="street"
            value={form.street}
            onChange={handleChange}
            placeholder="Street"
            className="border px-3 py-2 rounded-lg w-full"
          />
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            className="border px-3 py-2 rounded-lg w-full"
          />
          <input
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="State"
            className="border px-3 py-2 rounded-lg w-full"
          />
          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="Country"
            className="border px-3 py-2 rounded-lg w-full"
          />
          <input
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="border px-3 py-2 rounded-lg w-full"
          />

          {/* Admin Section */}
          <input
            name="admin.name"
            value={form.admin.name}
            onChange={handleChange}
            placeholder="Admin Name"
            required
            className="border px-3 py-2 rounded-lg w-full"
          />
          <input
            name="admin.email"
            value={form.admin.email}
            onChange={handleChange}
            placeholder="Admin Email"
            required
            className="border px-3 py-2 rounded-lg w-full"
            autoComplete="off"
          />
          <input
            name="admin.password"
            type="password"
            value={form.admin.password}
            onChange={handleChange}
            placeholder="Admin Password"
            className="border px-3 py-2 rounded-lg w-full col-span-2"
            autoComplete="new-password"
          />

          {/* Features */}
          <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 gap-2 border-t pt-4">
            {Object.keys(form.features).map((key) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={`features.${key}`}
                  checked={form.features[key]}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="capitalize">{key}</span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="col-span-2 py-2 text-white font-semibold rounded-lg"
            style={{ backgroundColor: "#246fb2" }}
          >
            {editingId ? "Update College" : "Add College"}
          </button>
        </form>

        {/* Loader */}
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full mx-auto"></div>
          </div>
        )}

        {/* Colleges List */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
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
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {colleges.length > 0 ? (
                colleges.map((college,index) => (
                  <tr key={college.id} className="border-b">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{college.name}</td>
                    <td className="p-3">{college.code}</td>
                    <td className="p-3">{college.loginId}</td>

                    <td className="p-3">
                      {[
                        college.address,
                        college.street,
                        college.city,
                        college.state,
                        college.country,
                        college.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </td>
                    <td className="p-3">
                      {college.status ? "Active" : "Inactive"}
                    </td>
                    <td className="p-3">
                      {college.features &&
                        Object.keys(college.features)
                          .filter((key) => college.features[key])
                          .join(", ")}
                    </td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleEdit(college)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded-md text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggle(college.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
                      >
                        Toggle
                      </button>
                      <button
                        onClick={() => handleDelete(college.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 text-center text-gray-500" colSpan={6}>
                    No colleges found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            ◀ Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next ▶
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CollegesPage;
