import React from "react";
import { Clock, CalendarDays, DollarSign } from "lucide-react";

const EmployeeDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <p className="text-gray-500">Your work summary</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat title="Attendance" value="Present" icon={Clock} />
        <Stat title="Leave Balance" value="12 Days" icon={CalendarDays} />
        <Stat title="Salary Status" value="Credited" icon={DollarSign} />
      </div>

      {/* Leave history */}
      <div className="mt-8 bg-white rounded-xl p-5 shadow">
        <h2 className="font-semibold mb-4">My Leave Requests</h2>

        <div className="space-y-3">
          <LeaveRow type="Casual Leave" status="Approved" />
          <LeaveRow type="Sick Leave" status="Pending" />
        </div>
      </div>
    </div>
  );
};

const Stat = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-xl p-5 shadow">
    <Icon className="h-6 w-6 text-blue-600" />
    <h2 className="text-xl font-bold mt-4">{value}</h2>
    <p className="text-gray-500 text-sm">{title}</p>
  </div>
);

const LeaveRow = ({ type, status }) => (
  <div className="flex justify-between bg-gray-50 p-3 rounded">
    <span>{type}</span>
    <span
      className={`text-sm font-medium ${
        status === "Approved"
          ? "text-green-600"
          : "text-yellow-600"
      }`}
    >
      {status}
    </span>
  </div>
);

export default EmployeeDashboard;
