const Input = ({ label, type, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
    />
  </div>
);

export default Input;
