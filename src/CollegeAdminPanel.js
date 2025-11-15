import React, { useEffect, useState } from "react";
import Layout from "./layouts/Collegelayout";

const CollegeDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔑 Get token dynamically
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Authorization token not found!");
      setLoading(false);
      return;
    }

    fetch("https://mynexus.co.in/api/api/dashboard/college", {
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
          setError(data?.message || "Failed to load college dashboard");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching college dashboard:", err);
        setError("Something went wrong.");
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 font-medium">{error}</div>;
  }

  return (
    <Layout>
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">
        College Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">

        {/* Students */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-600">Total Students</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {dashboard?.students}
          </p>
        </div>

        {/* Teachers */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-600">Total Teachers</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {dashboard?.teachers}
          </p>
        </div>

        {/* Fee Collections */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-600">Total Fee Collections</h2>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            ₹{dashboard?.feeCollections}
          </p>
        </div>

        {/* Present Today */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-gray-600">Total Present Today</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {dashboard?.presentToday}
          </p>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default CollegeDashboard;

