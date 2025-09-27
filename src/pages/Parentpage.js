import React, { useEffect, useState } from "react";
import Layout from "../layouts/Collegelayout";

const API_BASE = "https://mynexus.co.in/api/api/parents";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  studentId: "",
};

const ParentsPage = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch parents
  const fetchParents = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setParents(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Add / Update parent
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
      fetchParents();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete parent
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    setLoading(true);
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      fetchParents();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Edit parent
  const handleEdit = (parent) => {
    setForm({
      name: parent.name,
      email: parent.email,
      phone: parent.phone,
      studentId: parent.studentId,
    });
    setEditingId(parent.id);
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "#246fb2" }}>
          👪 Parents Management
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-md mb-6">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Parent Name" required className="border px-3 py-2 rounded-lg w-full" />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Parent Email" required className="border px-3 py-2 rounded-lg w-full" />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Parent Phone" required className="border px-3 py-2 rounded-lg w-full" />
          <input name="studentId" value={form.studentId} onChange={handleChange} placeholder="Student ID" required className="border px-3 py-2 rounded-lg w-full" />

          <button type="submit" disabled={loading} className="col-span-2 py-2 text-white font-semibold rounded-lg" style={{ backgroundColor: "#246fb2" }}>
            {editingId ? "Update Parent" : "Add Parent"}
          </button>
        </form>

        {/* Loader */}
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full mx-auto"></div>
          </div>
        )}

        {/* Parents List */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full border-collapse">
            <thead style={{ backgroundColor: "#246fb2" }}>
              <tr className="text-left text-white">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Student ID</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parents.length > 0 ? (
                parents.map((parent) => (
                  <tr key={parent.id} className="border-b">
                    <td className="p-3">{parent.name}</td>
                    <td className="p-3">{parent.email}</td>
                    <td className="p-3">{parent.phone}</td>
                    <td className="p-3">{parent.studentId}</td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      <button onClick={() => handleEdit(parent)} className="px-3 py-1 bg-yellow-400 text-white rounded-md text-sm">Edit</button>
                      <button onClick={() => handleDelete(parent.id)} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 text-center text-gray-500" colSpan={5}>
                    No parents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ParentsPage;
