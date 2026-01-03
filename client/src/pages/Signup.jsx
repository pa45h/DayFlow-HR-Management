import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Signup() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            await axios.post(
                "http://localhost:5000/api/auth/signup",
                {
                    firstName,
                    lastName,
                    email,
                    phone,
                    password,
                    confirmPassword,
                    role: "employee",
                },
                { withCredentials: true }
            );

            alert("Employee created successfully");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Left Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 items-center justify-center p-12">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">Dayflow HRMS</h1>
                    <p className="opacity-80">
                        Create employee accounts securely
                    </p>
                </div>
            </div>

            {/* Right Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-center mb-1">
                        Create Employee
                    </h2>
                    <p className="text-sm text-gray-500 text-center mb-6">
                        Admin / HR only
                    </p>

                    {error && (
                        <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* First + Last Name */}
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="First Name"
                                className="border rounded px-3 py-2 w-full"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="border rounded px-3 py-2 w-full"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>

                        {/* Email */}
                        <input
                            type="email"
                            placeholder="Email"
                            className="border rounded px-3 py-2 w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        {/* Phone */}
                        <input
                            type="text"
                            placeholder="Phone"
                            className="border rounded px-3 py-2 w-full"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />

                        {/* Password */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="border rounded px-3 py-2 w-full pr-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-2 text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Confirm Password */}
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="border rounded px-3 py-2 w-full"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
                        >
                            {isLoading ? "Creating..." : "Create Employee"}
                            <ArrowRight size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;
