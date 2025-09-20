import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  ShieldCheck,
  KeyRound,
  LayoutDashboard,
  School,
  Activity,
  Users2,
  Database,
  Download,
  FileClock,
  Cog,
  Search,
  Plus,
  Pencil,
  Trash2,
  LockKeyhole,
  Fingerprint,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  Link2,
  RefreshCw,
} from "lucide-react";

/**
 * Super Admin Panel (Multi-College Manager)
 * 
 * Notes
 * - TailwindCSS styles are used throughout (no external CSS needed)
 * - Pure React (no router) with a simple tab state to switch modules
 * - Mock data + no-op handlers where backend is expected
 * - Clean, modern, printable layout with cards and tables
 * - Framer Motion for soft transitions
 */

const SectionHeader = ({ icon: Icon, title, subtitle, actions }) => (
  <div className="flex items-start justify-between gap-4 mb-6">
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-2xl bg-gray-100">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-xl font-semibold leading-tight">{title}</h2>
        {subtitle && (
          <p className="text-sm text-gray-500 leading-snug mt-1">{subtitle}</p>
        )}
      </div>
    </div>
    <div className="flex items-center gap-2">{actions}</div>
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 ${className}`}>{children}</div>
);

const StatCard = ({ label, value, icon: Icon }) => (
  <Card>
    <div className="p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      <div className="p-3 rounded-2xl bg-gray-100">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </Card>
);

const TextInput = ({ label, type = "text", value, onChange, placeholder, rightIcon: RightIcon }) => (
  <label className="block">
    <span className="text-sm text-gray-700">{label}</span>
    <div className="mt-1 relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition px-3 py-2 pr-10"
      />
      {RightIcon && (
        <RightIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      )}
    </div>
  </label>
);

const SelectInput = ({ label, value, onChange, options }) => (
  <label className="block">
    <span className="text-sm text-gray-700">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition px-3 py-2"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </label>
);

const Toggle = ({ checked, onChange, label }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border transition ${checked ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-300"
      }`}
  >
    {checked ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
    <span className="text-sm">{label}</span>
  </button>
);

const Badge = ({ children, tone = "gray" }) => {
  const tones = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-800",
    sky: "bg-sky-100 text-sky-800",
  };
  return (
    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${tones[tone] || tones.gray}`}>{children}</span>
  );
};

const Table = ({ columns, data, rowKey = (r) => r.id, actions }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-500">
          {columns.map((c) => (
            <th key={c.key} className="px-4 py-3 border-b bg-gray-50 font-medium">
              {c.title}
            </th>
          ))}
          {actions && <th className="px-4 py-3 border-b bg-gray-50 font-medium text-right">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={rowKey(row)} className="hover:bg-gray-50">
            {columns.map((c) => (
              <td key={c.key} className="px-4 py-3 border-b">
                {typeof c.render === "function" ? c.render(row[c.key], row) : row[c.key]}
              </td>
            ))}
            {actions && (
              <td className="px-4 py-3 border-b text-right">
                <div className="inline-flex items-center gap-2">{actions(row)}</div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Modal = ({ open, onClose, title, children, actions }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute inset-x-0 top-20 mx-auto max-w-2xl"
        >
          <Card>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">{title}</h3>
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100">
                  <EyeOff className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4">{children}</div>
              {actions && <div className="mt-6 flex items-center justify-end gap-2">{actions}</div>}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const TopBar = ({ onSearch, onExportAll }) => {
  const [q, setQ] = useState("");
  return (
    <div className="sticky top-0 z-40 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gray-900 text-white grid place-items-center font-bold">SA</div>
          <div>
            <p className="text-sm text-gray-500">Multi-College Manager</p>
            <h1 className="text-base md:text-lg font-semibold">Super Admin Panel</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              className="w-64 rounded-xl border border-gray-300 px-3 py-2 pl-9 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              placeholder="Search colleges, users, modules..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch(q)}
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={onExportAll}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900 text-white hover:bg-black"
            title="Export annual records (Excel)"
          >
            <Download className="w-4 h-4" /> Export All
          </button>
        </div>
      </div>
    </div>
  );
};

const SideNav = ({ active, onSelect }) => {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "auth", label: "Authentication", icon: ShieldCheck },
    { key: "colleges", label: "College Management", icon: School },
    { key: "logs", label: "Logs & History", icon: FileClock },
    { key: "features", label: "Feature Management", icon: Cog },
  ];
  return (
    <aside className="hidden md:block md:w-64 shrink-0 border-r bg-white">
      <div className="p-4">
        <nav className="space-y-1">
          {items.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl transition ${active === key ? "bg-gray-900 text-white" : "hover:bg-gray-100"
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

/** Mock Data **/
const MOCK_COLLEGES = [
  { id: "COL-001", name: "St. Xavier's College", city: "Mumbai", status: "Enabled", users: 312, createdAt: "2018-06-12" },
  { id: "COL-002", name: "IIT Kanpur", city: "Kanpur", status: "Enabled", users: 1250, createdAt: "2016-01-20" },
  { id: "COL-003", name: "Govt. Engineering College", city: "Bhopal", status: "Disabled", users: 142, createdAt: "2020-08-03" },
  { id: "COL-004", name: "National Law University", city: "Bengaluru", status: "Enabled", users: 520, createdAt: "2019-02-17" },
];

const MOCK_LOGS = [
  { id: 1, actor: "admin@cap", action: "Enabled ERP: Library", target: "IIT Kanpur", at: "2025-08-21 10:15" },
  { id: 2, actor: "auditor@cap", action: "Viewed access logs", target: "All", at: "2025-08-20 16:02" },
  { id: 3, actor: "ops@cap", action: "Reset password", target: "St. Xavier's College", at: "2025-08-18 09:43" },
  { id: 4, actor: "admin@cap", action: "Disabled college login", target: "GEC Bhopal", at: "2025-08-10 14:25" },
];

const ERP_MODULES = [
  "Admissions",
  "Attendance",
  "Exams",
  "Library",
  "Hostel",
  "Finance",
  "Transport",
  "HRMS",
  "Inventory",
  "Placement",
];

export default function SuperAdminPanel() {

  const [tab, setTab] = useState("dashboard");
  const [colleges, setColleges] = useState(MOCK_COLLEGES);
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [showReset, setShowReset] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const [featureState, setFeatureState] = useState(() => {
    // per-college feature toggles
    const initial = {};
    colleges.forEach((c) => {
      initial[c.id] = Object.fromEntries(ERP_MODULES.map((m) => [m, Math.random() > 0.5]));
    });
    return initial;
  });
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  console.log("token", token, role)
  const totals = useMemo(() => {
    const totalColleges = colleges.length;
    const activeUsers = colleges.reduce((s, c) => s + (c.status === "Enabled" ? c.users : 0), 0);
    const uptime = "99.97%"; // mock system health
    return { totalColleges, activeUsers, uptime };
  }, [colleges]);

  const handleExportAll = () => {
    // Placeholder for Excel export
    alert("Exporting annual records to Excel… (wire this to your backend)");
  };

  const handleSearch = (q) => {
    alert(`Search for: ${q}`);
  };

  const openEditCollege = (college) => {
    console.log("college", college)
    setEditingCollege(college);
    setShowCollegeModal(true);
  };

  // const saveCollege = async(payload) => {
  //   console.log(payload);
  //   // setColleges((prev) => {
  //   //   const exists = prev.some((c) => c.id === payload.id);
  //   //   if (exists) return prev.map((c) => (c.id === payload.id ? { ...c, ...payload } : c));
  //   //   return [...prev, payload];
  //   // });

  //    const response = await fetch("http://localhost:5000/api/colleges", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization:
  //           `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         name: payload?.name,
  //         code: payload?.id,
  //         address: payload?.city,
  //       }),
  //     });

  //     const data = await response.json();
  //     console.log("College added:", data);
  //   setShowCollegeModal(false);
  //   setEditingCollege(null);
  // };

  const saveCollege = async (payload) => {
    console.log(payload);

    let url = "http://localhost:5000/api/colleges";
    let method = "POST";

    // agar edit ho raha hai toh method aur url badal do
    if (payload._id) {
      url = `http://localhost:5000/api/colleges/${payload._id}`;
      method = "PUT";
    }

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: payload?.name,
        code: payload?.code,   // yaha id mat bhejna, actual code bhejna
        address: payload?.address,
        status:payload?.status
      }),
    });

    const data = await response.json();
    console.log("College saved:", data);

    setShowCollegeModal(false);
    setEditingCollege(null);

    // UI refresh ke liye data ko list me update/add kar sakte ho
  };
  const handleDeleteCollege = async (row) => {
    try {
      await axios.delete(`http://localhost:5000/api/colleges/${row._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}` // ✅ अगर auth है
        }
      });
      // success के बाद frontend state से हटाओ
      setColleges((prev) => prev.filter((c) => c._id !== row._id));
    } catch (error) {
      console.error("Failed to delete college:", error);
      alert("Failed to delete college");
    }
  };
  useEffect(() => {
    fetch("http://localhost:5000/api/colleges", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setColleges(data))
      .catch((err) => console.error("Error fetching colleges:", err));
  }, []);
  const generateId = () => {
    const n = colleges.length + 1;
    return `COL-${String(n).padStart(3, "0")}`;
  };

  // const toggleCollegeLogin = (college) => {
  //   setColleges((prev) =>
  //     prev.map((c) =>
  //       c.id === college.code ? { ...c, status: c.status === "Enabled" ? "Disabled" : "Enabled" } : c
  //     )
  //   );
  //   setLogs((prev) => [
  //     { id: prev.length + 1, actor: "admin@cap", action: `${college.status === "Enabled" ? "Disabled" : "Enabled"} college login`, target: college.name, at: new Date().toISOString().slice(0, 16).replace("T", " ") },
  //     ...prev,
  //   ]);
  // };

  const toggleCollegeLogin = (college) => {
    setColleges((prev) =>
      prev.map((c) =>
        c._id === college._id
          ? { ...c, status: !c.status } // boolean toggle
          : c
      )
    );

    setLogs((prev) => [
      {
        id: prev.length + 1,
        actor: "admin@cap",
        action: `${college.status ? "Disabled" : "Enabled"} college login`,
        target: college.name,
        at: new Date().toISOString().slice(0, 16).replace("T", " "),
      },
      ...prev,
    ]);
  };

  const handleToggleCollege = async (college) => {
    try {
      const token = localStorage.getItem("token"); // auth token agar required hai
      const res = await axios.patch(
        `http://localhost:5000/api/colleges/${college._id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Backend se updated college aa raha hoga
      const updatedCollege = res.data;

      // Ab UI aur logs update karo
      toggleCollegeLogin(updatedCollege);

    } catch (err) {
      console.error("Error toggling college:", err);
    }
  };
  const columnsColleges = [
    { key: "code", title: "College Code" },
    { key: "name", title: "Name" },
    { key: "address", title: "Address" },
    // {
    //   key: "status",
    //   title: "status",
    //   render: (v) => <Badge tone={v === "Enabled" ? "green" : "red"}>{v}</Badge>,
    // },
    {
      key: "status",
      title: "Status",
      render: (v) => (
        <Badge tone={v ? "green" : "red"}>
          {v ? "Enabled" : "Disabled"}
        </Badge>
      ),
    },

    { key: "users", title: "Active Users" },
    { key: "createdAt", title: "Onboarded" },
  ];

  const columnsLogs = [
    { key: "at", title: "When" },
    { key: "actor", title: "Who" },
    { key: "action", title: "What" },
    { key: "target", title: "Where" },
  ];

  const Dashboard = () => (
    <div className="space-y-6">
      <SectionHeader
        icon={LayoutDashboard}
        title="Dashboard Overview"
        subtitle="At-a-glance status for institutions and systems"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Colleges" value={totals.totalColleges} icon={School} />
        <StatCard label="Active Users" value={totals.activeUsers} icon={Users2} />
        <StatCard label="System Uptime" value={totals.uptime} icon={Activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Colleges Snapshot</h3>
              <button onClick={() => setTab("colleges")} className="text-sm underline">Manage</button>
            </div>
            <Table columns={columnsColleges} data={colleges.slice(0, 5)} actions={(row) => (
              <>
                <button className="p-2 rounded-lg hover:bg-gray-100" title="Edit" onClick={() => openEditCollege(row)}>
                  <Pencil className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100" title="Toggle Login" onClick={() => handleToggleCollege(row)}>
                  <LockKeyhole className="w-4 h-4" />
                </button>
              </>
            )} />
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <h3 className="font-semibold mb-4">System Health</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between"><span>Database</span><Badge tone="green">Healthy</Badge></li>
              <li className="flex items-center justify-between"><span>API Gateway</span><Badge tone="green">Healthy</Badge></li>
              <li className="flex items-center justify-between"><span>Background Jobs</span><Badge tone="amber">Delay: 1m</Badge></li>
              <li className="flex items-center justify-between"><span>Storage</span><Badge tone="sky">72% used</Badge></li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );

  const Authentication = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [twoFAEnabled, setTwoFAEnabled] = useState(true);

    return (
      <div className="space-y-6">
        <SectionHeader
          icon={ShieldCheck}
          title="Authentication"
          subtitle="Secure login, 2FA, and password recovery"
          actions={
            <>
              <Toggle checked={twoFAEnabled} onChange={setTwoFAEnabled} label="Require 2FA" />
              <button onClick={() => setShow2FA(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border"><Fingerprint className="w-4 h-4" />2FA Methods</button>
              <button onClick={() => setShowReset(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900 text-white"><KeyRound className="w-4 h-4" />Reset Password</button>
            </>
          }
        />

        <Card>
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextInput label="Admin Email" value={email} onChange={setEmail} placeholder="admin@domain.com" />
            <TextInput label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" rightIcon={Eye} />
            <div className="flex items-end">
              <button className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gray-900 text-white">
                <ShieldCheck className="w-4 h-4" /> Login (Demo)
              </button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <h3 className="font-semibold mb-4">Password Recovery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="User Email" value={email} onChange={setEmail} placeholder="user@college.edu" />
              <div className="flex items-end gap-2">
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border"><Link2 className="w-4 h-4" /> Send Reset Link</button>
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border"><RefreshCw className="w-4 h-4" /> Force Reset</button>
              </div>
            </div>
          </div>
        </Card>

        <Modal open={showReset} onClose={() => setShowReset(false)} title="Reset Password">
          <div className="grid grid-cols-1 gap-3">
            <TextInput label="Email" value={email} onChange={setEmail} placeholder="user@college.edu" />
            <TextInput label="Temporary Password" value="Auto-generated" onChange={() => { }} />
          </div>
          <div className="mt-6 flex items-center justify-end gap-2">
            <button className="px-3 py-2 rounded-xl border" onClick={() => setShowReset(false)}>Cancel</button>
            <button className="px-3 py-2 rounded-xl bg-gray-900 text-white" onClick={() => setShowReset(false)}>Send</button>
          </div>
        </Modal>

        <Modal open={show2FA} onClose={() => setShow2FA(false)} title="Two-Factor Methods">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between"><span>Authenticator App (TOTP)</span><Badge tone="green">Enabled</Badge></li>
            <li className="flex items-center justify-between"><span>SMS OTP</span><Badge tone="amber">Optional</Badge></li>
            <li className="flex items-center justify-between"><span>Backup Codes</span><Badge tone="gray">Available</Badge></li>
          </ul>
          <div className="mt-6 flex items-center justify-end gap-2">
            <button className="px-3 py-2 rounded-xl border" onClick={() => setShow2FA(false)}>Close</button>
          </div>
        </Modal>
      </div>
    );
  };

  const CollegeManagement = () => {
    const [q, setQ] = useState("");
    const filtered = colleges.filter(
      (c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.id.toLowerCase().includes(q.toLowerCase())
    );

    const [form, setForm] = useState(() =>
      editingCollege || { id: generateId(), name: "", city: "", status: "Enabled", users: 0, createdAt: new Date().toISOString().slice(0, 10) }
    );

    const updateForm = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    return (
      <div className="space-y-6">
        <SectionHeader
          icon={School}
          title="College Management"
          subtitle="Add/Edit college profiles, assign unique IDs, enable/disable logins"
          actions={
            <>
              <div className="relative">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search college…"
                  className="w-64 rounded-xl border border-gray-300 px-3 py-2 pl-9"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={() => {
                  setEditingCollege(null);
                  setShowCollegeModal(true);
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900 text-white"
              >
                <Plus className="w-4 h-4" /> New College
              </button>
            </>
          }
        />

        <Card>
          <div className="p-5">
            <Table
              columns={columnsColleges}
              data={filtered}
              actions={(row) => (
                <>
                  <button className="p-2 rounded-lg hover:bg-gray-100" title="Edit" onClick={() => openEditCollege(row)}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100" title="Toggle Login" onClick={() => handleToggleCollege(row)}>
                    <LockKeyhole className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100" title="Delete" onClick={() => handleDeleteCollege(row)} >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            />
          </div>
        </Card>

        <Modal
          open={showCollegeModal}
          onClose={() => {
            setShowCollegeModal(false);
            setEditingCollege(null);
          }}
          title={editingCollege ? "Edit College" : "Add College"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="College ID" value={form.code} onChange={(v) => updateForm("code", v)} />
            <div className="flex items-end">
              <button className="w-full px-3 py-2 rounded-xl border" onClick={() => updateForm("id", generateId())}>
                Assign/Generate Unique ID
              </button>
            </div>
            <TextInput label="Name" value={form.name} onChange={(v) => updateForm("name", v)} />
            <TextInput label="address" value={form.address} onChange={(v) => updateForm("address", v)} />
            <SelectInput
              label="Status"
              value={form.status}
              onChange={(v) => updateForm("status", v)}
              options={[{ value: true, label: "Enabled" }, { value: false, label: "Disabled" }]}
            />
            <TextInput label="Active Users" type="number" value={form.users} onChange={(v) => updateForm("users", Number(v))} />
          </div>
          <div className="mt-6 flex items-center justify-end gap-2">
            <button className="px-3 py-2 rounded-xl border" onClick={() => setShowCollegeModal(false)}>Cancel</button>
            <button className="px-3 py-2 rounded-xl bg-gray-900 text-white" onClick={() => saveCollege(form)}>Save</button>
          </div>
        </Modal>
      </div>
    );
  };

  const LogsHistory = () => {
    const [q, setQ] = useState("");
    const filtered = logs.filter((l) => (l.actor + l.action + l.target).toLowerCase().includes(q.toLowerCase()));

    return (
      <div className="space-y-6">
        <SectionHeader
          icon={FileClock}
          title="Logs & History"
          subtitle="Track who did what and when across the system"
          actions={<TextInput label="" value={q} onChange={setQ} placeholder="Filter logs…" rightIcon={Search} />}
        />
        <Card>
          <div className="p-5">
            <Table columns={columnsLogs} data={filtered} />
          </div>
        </Card>
      </div>
    );
  };

  const FeatureManagement = () => {
    const [selectedCollegeId, setSelectedCollegeId] = useState(colleges[0]?.id || "");
    const selectedCollege = colleges.find((c) => c.id === selectedCollegeId) || colleges[0];
    const states = featureState[selectedCollege?.id] || {};

    const toggle = (module) => {
      setFeatureState((prev) => ({
        ...prev,
        [selectedCollege.id]: { ...prev[selectedCollege.id], [module]: !prev[selectedCollege.id][module] },
      }));
      setLogs((prev) => [
        { id: prev.length + 1, actor: "admin@cap", action: `${states[module] ? "Disabled" : "Enabled"} ERP: ${module}`, target: selectedCollege.name, at: new Date().toISOString().slice(0, 16).replace("T", " ") },
        ...prev,
      ]);
    };

    return (
      <div className="space-y-6">
        <SectionHeader
          icon={Cog}
          title="Feature Management"
          subtitle="Enable or disable ERP modules per college"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-1">
            <div className="p-5 space-y-4">
              <h3 className="font-semibold">Select College</h3>
              <SelectInput
                label="College"
                value={selectedCollegeId}
                onChange={setSelectedCollegeId}
                options={colleges.map((c) => ({ value: c.id, label: `${c.name} (${c.id})` }))}
              />
              <div className="text-sm text-gray-500">
                <p><span className="font-medium text-gray-700">City:</span> {selectedCollege?.city}</p>
                <p><span className="font-medium text-gray-700">Status:</span> {selectedCollege?.status}</p>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">ERP Modules</h3>
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border" onClick={() => alert("Saved feature flags (demo)")}>Save Changes</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ERP_MODULES.map((m) => (
                  <div key={m} className="flex items-center justify-between p-3 rounded-xl border">
                    <span className="text-sm font-medium">{m}</span>
                    <Toggle checked={!!states[m]} onChange={() => toggle(m)} label={states[m] ? "Enabled" : "Disabled"} />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar onSearch={handleSearch} onExportAll={handleExportAll} />
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <SideNav active={tab} onSelect={setTab} />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {tab === "dashboard" && <Dashboard />}
              {tab === "auth" && <Authentication />}
              {tab === "colleges" && <CollegeManagement />}
              {tab === "logs" && <LogsHistory />}
              {tab === "features" && <FeatureManagement />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <footer className="max-w-7xl mx-auto px-4 pb-8 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4" />
          <span>© 2025 Super Admin Panel · Demo UI</span>
        </div>
      </footer>
    </div>
  );
}
