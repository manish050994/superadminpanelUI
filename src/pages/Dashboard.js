// import React, { useEffect, useState } from "react";
// import Layout from "../layouts/Layouts";

// const Dashboard = () => {
//   const [dashboard, setDashboard] = useState(null);
//   const [logs, setLogs] = useState([]);
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!token) {
//       setError("Authorization token not found!");
//       setLoading(false);
//       return;
//     }

//     const fetchDashboard = async () => {
//       try {
//         // Fetch annual report summary
//         const reportRes = await fetch(
//           "https://mynexus.co.in/api/api/reports/export-annual",
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         const reportData = await reportRes.json();

//         if (reportData?.status === 1) {
//           setDashboard(reportData.data.summary);
//           setDownloadUrl(reportData.data.downloadUrl); // store download URL
//         } else {
//           setError(reportData?.message || "Failed to load dashboard summary");
//         }

//         // Fetch logs
//         const logsRes = await fetch("https://mynexus.co.in/api/api/logs", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         const logsData = await logsRes.json();

//         if (logsData?.status === 1) {
//           setLogs(logsData.data.logs);
//         } else {
//           setError(logsData?.message || "Failed to load logs");
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Something went wrong while fetching data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboard();
//   }, [token]);

//   if (loading) {
//     return <div className="text-center text-lg font-semibold">Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div className="text-center text-red-600 font-medium py-4">{error}</div>
//     );
//   }

//   return (
//     <Layout>
//       <div className="p-6 bg-gray-100 min-h-screen">
//         <h1 className="text-2xl font-bold mb-6 text-center">
//           Super Admin Dashboard
//         </h1>

//         {/* Download Annual Report */}
//         {downloadUrl && (
//           <div className="text-center mb-6">
//             <a
//               href={downloadUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
//             >
//               Download Annual Report
//             </a>
//           </div>
//         )}

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
//           <Card title="Total Colleges" value={dashboard?.totalColleges} />
//           {/* <Card title="Total Students" value={dashboard?.totalStudents} />
//           <Card title="Total Teachers" value={dashboard?.totalTeachers} />
//           <Card
//             title="Attendance %"
//             value={`${dashboard?.attendancePercentage || 0}%`}
//           />
//           <Card
//             title="Collection %"
//             value={`${dashboard?.collectionPercentage || 0}%`}
//           />
//           <Card title="Total Marks" value={dashboard?.totalMarks} /> */}
//         </div>

//         {/* Logs Table */}
//         <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-4">System Logs</h2>
//           <table className="w-full border-collapse border border-gray-300 text-sm">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-300 px-3 py-2">#</th>
//                 <th className="border border-gray-300 px-3 py-2">Actor</th>
//                 <th className="border border-gray-300 px-3 py-2">Action</th>
//                 <th className="border border-gray-300 px-3 py-2">Target</th>
//                 <th className="border border-gray-300 px-3 py-2">Date & Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {logs.map((log, index) => (
//                 <tr key={log.id} className="hover:bg-gray-50">
//                   <td className="border border-gray-300 px-3 py-2">{index + 1}</td>
//                   <td className="border border-gray-300 px-3 py-2">{log.actor}</td>
//                   <td className="border border-gray-300 px-3 py-2">{log.action}</td>
//                   <td className="border border-gray-300 px-3 py-2">{log.target}</td>
//                   <td className="border border-gray-300 px-3 py-2">
//                     {new Date(log.at).toLocaleString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// // Summary Card Component
// const Card = ({ title, value }) => {
//   return (
//     <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
//       <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
//       <p className="text-3xl font-bold text-indigo-600 mt-2">{value}</p>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from "react";
import Layout from "../layouts/Layouts";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [logs, setLogs] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentLogs = logs.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(logs.length / rowsPerPage);

  useEffect(() => {
    if (!token) {
      setError("Authorization token not found!");
      setLoading(false);
      return;
    }

    const fetchDashboard = async () => {
      try {
        // Fetch annual report summary
        const reportRes = await fetch(
          "https://mynexus.co.in/api/api/reports/export-annual",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const reportData = await reportRes.json();

        if (reportData?.status === 1) {
          setDashboard(reportData.data.summary);
          setDownloadUrl(reportData.data.downloadUrl);
        } else {
          setError(reportData?.message || "Failed to load dashboard summary");
        }

        // Fetch logs
        const logsRes = await fetch("https://mynexus.co.in/api/api/logs", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const logsData = await logsRes.json();

        if (logsData?.status === 1) {
          setLogs(logsData.data.logs);
        } else {
          setError(logsData?.message || "Failed to load logs");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  if (loading) {
    return <div className="text-center text-lg font-semibold">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 font-medium py-4">{error}</div>
    );
  }

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Super Admin Dashboard
        </h1>

        {/* Download Annual Report */}
        {downloadUrl && (
          <div className="text-center mb-6">
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Download Annual Report
            </a>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
          <Card title="Total Colleges" value={dashboard?.totalColleges} />
        </div>

        {/* Logs Table */}
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">System Logs</h2>

          {/* Rows per page */}
          <div className="flex justify-end mb-3">
            <select
              className="border px-3 py-1 rounded"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2">#</th>
                <th className="border border-gray-300 px-3 py-2">Actor</th>
                <th className="border border-gray-300 px-3 py-2">Action</th>
                <th className="border border-gray-300 px-3 py-2">Target</th>
                <th className="border border-gray-300 px-3 py-2">
                  Date & Time
                </th>
              </tr>
            </thead>

            <tbody>
              {currentLogs.map((log, index) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2">
                    {indexOfFirstRow + index + 1}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {log.actor}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {log.action}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {log.target}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {new Date(log.at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <p className="text-sm">
              Page <strong>{currentPage}</strong> of{" "}
              <strong>{totalPages}</strong>
            </p>

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Summary Card Component
const Card = ({ title, value }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
      <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
      <p className="text-3xl font-bold text-indigo-600 mt-2">{value}</p>
    </div>
  );
};

export default Dashboard;
