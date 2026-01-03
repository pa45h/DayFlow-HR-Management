import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  DollarSign,
  Settings,
  LogOut,
  Bell,
  Moon,
  Search,
} from "lucide-react";


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold">Dayflow</div>

        <nav className="flex-1 space-y-1 px-3">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          <SidebarItem icon={Users} label="Employees" />
          <SidebarItem icon={Clock} label="Attendance" />
          <SidebarItem icon={Calendar} label="Leave" />
          <SidebarItem icon={DollarSign} label="Payroll" />
          <SidebarItem icon={Settings} label="Settings" />
        </nav>

        <div className="border-t border-slate-700 p-4">
          <p className="font-medium">Sarah Mitchell</p>
          <p className="text-sm text-slate-400">HR Manager</p>
          <button className="mt-4 flex items-center gap-2 text-sm text-red-400">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1">
        {/* TOP BAR */}
        <header className="bg-white p-4 flex items-center justify-between border-b">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 focus:outline-none"
              placeholder="Search employees, records..."
            />
          </div>

          <div className="flex items-center gap-4">
            <Moon className="h-5 w-5 text-gray-600" />
            <Bell className="h-5 w-5 text-gray-600" />
            <div className="h-9 w-9 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">
              SM
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-6 space-y-6">
          {/* WELCOME */}
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, Sarah! 👋
              </h1>
              <p className="text-gray-500">
                Here's what's happening with your team today.
              </p>
            </div>
            <p className="text-gray-500">
              {new Date().toDateString()}
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Total Employees" value={users.length} />
            <StatCard title="Present Today" value="2" />
            <StatCard title="Pending Leaves" value="2" />
            <StatCard title="Pending Payroll" value="2" />
          </div>

          {/* USERS TABLE */}
          <div className="bg-white rounded-xl shadow">
            <div className="p-4 font-semibold border-b">
              Employees
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.phone}</td>
                    <td className="p-3 capitalize">{u.role}</td>
                    <td className="p-3 text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <p className="p-6 text-center text-gray-500">
                No users found
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

/* COMPONENTS */
const SidebarItem = ({ icon: Icon, label, active }) => (
  <div
    className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer
    ${active ? "bg-teal-500" : "hover:bg-slate-800"}`}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-white p-5 rounded-xl shadow">
    <h2 className="text-3xl font-bold">{value}</h2>
    <p className="text-gray-500 mt-1">{title}</p>
  </div>
);

export default AdminDashboard;
