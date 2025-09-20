import { useEffect, useState } from "react";
import API from "../config/axious";

const Dashboard = () => {
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    const fetchColleges = async () => {
      const { data } = await API.get("/colleges");
      setColleges(data);
    };
    fetchColleges();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <ul className="space-y-2">
        {colleges.map((c) => (
          <li key={c._id} className="p-3 bg-gray-100 rounded-lg shadow">
            {c.name} ({c.code})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
