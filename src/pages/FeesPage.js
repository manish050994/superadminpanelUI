import React, { useEffect, useState } from "react";
import Layout from "../layouts/Collegelayout";

const FEES_API = "https://mynexus.co.in/api/api/fees";
const STUDENTS_API = "https://mynexus.co.in/api/api/students?collegeId=1&page=1&limit=50";
const COURSES_API = "https://mynexus.co.in/api/api/courses?page=1&limit=50";

const initialForm = {
  student: "",
  course: "",
  amount: "",
  dueDate: "",
};

const FeesPage = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch students and courses
  useEffect(() => {
    const fetchStudentsCourses = async () => {
      try {
        const [stuRes, courseRes] = await Promise.all([
          fetch(STUDENTS_API, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(COURSES_API, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const stuData = await stuRes.json();
        const courseData = await courseRes.json();
        setStudents(stuData.data?.students || []);
        setCourses(courseData.data?.courses || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudentsCourses();
    fetchFees();
  }, []);

  // Fetch fees
  const fetchFees = async () => {
    setLoading(true);
    try {
      const res = await fetch(FEES_API, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setFees(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Add fee
  const handleAddFee = async (e) => {
    e.preventDefault();
    if (!form.student || !form.course || !form.amount || !form.dueDate) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      await fetch(FEES_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      setForm(initialForm);
      fetchFees();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fee actions
  const handlePay = async (id) => {
    setLoading(true);
    try {
      await fetch(`${FEES_API}/${id}/pay`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      fetchFees();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvoice = async (id) => {
    try {
      const res = await fetch(`${FEES_API}/${id}/invoice`, { headers: { Authorization: `Bearer ${token}` } });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${id}.pdf`;
      a.click();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReminder = async (id) => {
    setLoading(true);
    try {
      await fetch(`${FEES_API}/${id}/reminder`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      alert("Reminder sent!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInitiatePayment = async (id) => {
    setLoading(true);
    try {
      await fetch(`${FEES_API}/${id}/initiate-payment`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      alert("Payment initiated!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "#246fb2" }}>💰 Fees Management</h1>

        {/* Form */}
        <form onSubmit={handleAddFee} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-md mb-6">
          <select name="student" value={form.student} onChange={handleChange} className="border px-3 py-2 rounded-lg w-full">
            <option value="">Select Student</option>
            {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select name="course" value={form.course} onChange={handleChange} className="border px-3 py-2 rounded-lg w-full">
            <option value="">Select Course</option>
            {courses.map((c) => <option key={c.id} value={c.code}>{c.name}</option>)}
          </select>
          <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" className="border px-3 py-2 rounded-lg w-full" required />
          <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="border px-3 py-2 rounded-lg w-full" required />
          <button type="submit" disabled={loading} className="col-span-2 py-2 text-white font-semibold rounded-lg" style={{ backgroundColor: "#246fb2" }}>
            Add Fee
          </button>
        </form>

        {/* Loader */}
        {loading && <div className="text-center py-4"><div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full mx-auto"></div></div>}

        {/* Fees Table */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full border-collapse">
            <thead style={{ backgroundColor: "#246fb2" }}>
              <tr className="text-left text-white">
                <th className="p-3">Student</th>
                <th className="p-3">Course</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.length > 0 ? fees.map((f) => (
                <tr key={f.id} className="border-b">
                  <td className="p-3">{f.student?.name}</td>
                  <td className="p-3">{f.course?.name}</td>
                  <td className="p-3">{f.amount}</td>
                  <td className="p-3">{new Date(f.dueDate).toLocaleDateString()}</td>
                  <td className="p-3 flex gap-2 flex-wrap">
                    <button onClick={() => handlePay(f.id)} className="px-3 py-1 bg-green-500 text-white rounded-md text-sm">Pay</button>
                    <button onClick={() => handleInvoice(f.id)} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">Invoice</button>
                    <button onClick={() => handleReminder(f.id)} className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm">Reminder</button>
                    <button onClick={() => handleInitiatePayment(f.id)} className="px-3 py-1 bg-purple-500 text-white rounded-md text-sm">Initiate Payment</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">No fees found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default FeesPage;
