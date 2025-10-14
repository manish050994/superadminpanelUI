


import React, { useEffect, useState } from "react";
import Layout from "../layouts/Layouts";
const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔑 Get token dynamically (localStorage example)
  const token = localStorage.getItem("token"); 

  useEffect(() => {
    if (!token) {
      setError("Authorization token not found!");
      setLoading(false);
      return;
    }

    fetch("https://mynexus.co.in/api/api/dashboard/super", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data?.status === 1) {
          setDashboard(data.data);
        } else {
          setError(data?.message || "Failed to load dashboard");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching dashboard:", err);
        setError("Something went wrong.");
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  if (error) {
    alert(error);
    // return <div className="text-center text-red-600 font-medium">{error}</div>;
  }

  return (
    <Layout>
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Super Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        
        {/* Total Colleges */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-600">Total Colleges</h2>
          <p className="text-4xl font-bold text-indigo-600 mt-2">{dashboard?.totalColleges}</p>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-600">Active Users</h2>
          <p className="text-4xl font-bold text-green-600 mt-2">{dashboard?.activeUsers}</p>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default Dashboard;
