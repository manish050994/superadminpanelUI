import React from "react";
import Layout from "../layouts/Layouts";

const Dashboard = () => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4" style={{ color: "#246fb2" }}>
        Welcome to Dashboard
      </h1>
      <p className="text-gray-700">This is your main dashboard page.</p>
    </Layout>
  );
};

export default Dashboard;
