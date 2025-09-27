import React, { useEffect, useState } from "react";
import Layout from "../layouts/Collegelayout";

const LEAVES_API = "https://mynexus.co.in/api/api/teacher-leaves";

const TeacherLeavesPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch leaves
  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${LEAVES_API}?page=1&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLeaves(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Approve / Reject leave
  const handleUpdateStatus = async (id, status) => {
    const comments = window.prompt("Add comments (optional):", "");
    if (!comments && status === "Rejected") {
      alert("Please provide comments for rejection");
      return;
    }

    setLoading(true);
    try {
      await fetch(`${LEAVES_API}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status, comments }),
      });
      fetchLeaves();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "#246fb2" }}>
          📝 Teacher Leave Management
        </h1>

        {/* Loader */}
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full mx-auto"></div>
          </div>
        )}

        {/* Leaves Table */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full border-collapse">
            <thead style={{ backgroundColor: "#246fb2" }}>
              <tr className="text-left text-white">
                <th className="p-3">Teacher Name</th>
                <th className="p-3">From</th>
                <th className="p-3">To</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length > 0 ? (
                leaves.map((leave) => (
                  <tr key={leave.id} className="border-b">
                    <td className="p-3">{leave.teacher?.name}</td>
                    <td className="p-3">{new Date(leave.fromDate).toLocaleDateString()}</td>
                    <td className="p-3">{new Date(leave.toDate).toLocaleDateString()}</td>
                    <td className="p-3">{leave.reason}</td>
                    <td className="p-3">{leave.status}</td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      {leave.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(leave.id, "Approved")}
                            className="px-3 py-1 bg-green-500 text-white rounded-md text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(leave.id, "Rejected")}
                            className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-3 text-center text-gray-500">
                    No leaves found
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

export default TeacherLeavesPage;
