import { useState } from "react";
import API from "../config/axious";
import Input from "../components/Input";

const UserForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("teacher");
  const [collegeId, setCollegeId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/auth/register-super", { name, email, role, collegeId });
    alert("User created successfully!");
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Add User</h2>
      <form onSubmit={handleSubmit}>
        <Input label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          >
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
            <option value="collegeadmin">College Admin</option>
          </select>
        </div>
        <Input label="College ID" type="text" value={collegeId} onChange={(e) => setCollegeId(e.target.value)} />
        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
          Add User
        </button>
      </form>
    </div>
  );
};

export default UserForm;
