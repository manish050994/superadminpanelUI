import { useState } from "react";
import API from "../config/axious";
import Input from "../components/Input";

const CollegeForm = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/colleges", { name, code, address });
    alert("College added successfully!");
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Add College</h2>
      <form onSubmit={handleSubmit}>
        <Input label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Code" type="text" value={code} onChange={(e) => setCode(e.target.value)} />
        <Input label="Address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
          Add College
        </button>
      </form>
    </div>
  );
};

export default CollegeForm;
