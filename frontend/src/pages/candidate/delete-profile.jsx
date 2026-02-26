import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import axios from "axios"; // ✅ Added axios for API calls

const DeleteProfile = () => {
    const [password, setPassword] = useState("");
    const [recoveryEmail, setRecoveryEmail] = useState(""); // ✅ Added state for recovery email
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // ✅ Track loading state for deletion
    const [emailLoading, setEmailLoading] = useState(false); // ✅ Track loading state for email
    const navigate = useNavigate();

    const handleDelete = async (e) => {
        e.preventDefault();
        setError("");

        // 1. Validation
        if (!password) {
            setError("Password is required to confirm deletion.");
            return;
        }

        // 2. Final Confirmation
        if (!window.confirm("WARNING: This action is permanent and cannot be undone. Are you sure you want to delete your profile?")) {
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token"); // Get token for Auth middleware

            // ✅ REAL API CALL: Connecting to auth.controller.js deleteProfile
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios({
                method: 'delete',
                url: `${API_BASE}/api/auth/delete-profile`,
                data: { password }, // Send password in the request body
                headers: {
                    Authorization: `Bearer ${token}`, // Verified via protect middleware
                }
            });

            if (response.data.success) {
                alert("Your profile has been deleted successfully.");
                
                // 3. Clear session and redirect
                localStorage.clear();
                navigate("/");
            }
        } catch (err) {
            console.error("❌ Deletion Failed:", err);
            setError(err.response?.data?.message || "Incorrect password or server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ UPDATED: New handler connecting to real backend send-recovery-mail API
    const handleSendRecoveryMail = async (e) => {
        e.preventDefault();
        if (!recoveryEmail) {
            alert("Please enter a recovery email address.");
            return;
        }

        try {
            setEmailLoading(true);
            const token = localStorage.getItem("token");
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            
            const response = await axios.post(
                `${API_BASE}/api/auth/send-recovery-mail`, 
                { recoveryEmail },
                { 
                    headers: { 
                        Authorization: `Bearer ${token}` 
                    } 
                }
            );

            if (response.data.success) {
                alert(response.data.message);
                setRecoveryEmail(""); // Clear input on success
            }
        } catch (err) {
            console.error("❌ Recovery Mail Error:", err);
            alert(err.response?.data?.message || "Failed to send recovery mail. Please try again.");
        } finally {
            setEmailLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Right Content */}
            <div className="ml-64 flex flex-col w-full min-h-screen">
                {/* Page Content */}
                <div className="flex-grow px-10 py-8 text-left">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">
                        Delete Profile
                    </h1>

                    <div className="bg-white rounded-xl shadow p-8 max-w-4xl border border-red-50">
                        <h2 className="text-lg font-bold text-red-600 mb-2">
                            Are you sure? You want to delete your profile.
                        </h2>

                        <p className="text-gray-500 mb-6 text-sm">
                            This can't be undone! All your data, including applications and saved jobs, will be lost permanently.
                        </p>

                        <form onSubmit={handleDelete} className="space-y-6">
                            {/* Password Section */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm">
                                    Please enter your login Password to confirm:
                                </label>
                                <div className="relative max-w-xl">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} // ✅ Added onChange to allow typing
                                        className={`w-full bg-gray-50 px-4 py-3 rounded-lg pr-12 focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-400' : 'focus:ring-sky-400 border-gray-200'} border transition-all`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {error && (
                                    <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-4 bg-sky-500 hover:bg-sky-600 text-white px-8 py-2.5 rounded-lg font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin w-4 h-4" />
                                            <span>Deleting...</span>
                                        </>
                                    ) : (
                                        <span>Delete Profile</span>
                                    )}
                                </button>
                            </div>

                            {/* Recovery Email Section - Matches Screenshot 1 Style */}
                            <div className="pt-2">
                                <label className="block text-gray-700 font-medium mb-2 text-sm">
                                    Recovery Email
                                </label>
                                <div className="max-w-xl">
                                    <input
                                        type="email"
                                        placeholder="Enter recovery email"
                                        value={recoveryEmail}
                                        onChange={(e) => setRecoveryEmail(e.target.value)} // ✅ Added onChange to allow typing
                                        className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all mb-4"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSendRecoveryMail}
                                        disabled={emailLoading}
                                        className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-2.5 rounded-lg font-bold shadow-sm transition-all active:scale-95 flex items-center space-x-2 disabled:opacity-50"
                                    >
                                        {emailLoading ? <Loader2 className="animate-spin w-4 h-4" /> : null}
                                        <span>{emailLoading ? "Sending..." : "Send Recovery Mail"}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-sky-500 text-white text-center py-6 mt-auto">
                    <p className="text-xs">
                        © 2025 Mcare Jobs. All Right Reserved.
                    </p>
                    <p className="text-xs mt-1">
                        Privacy policy, Terms & Conditions.
                    </p>
                    <p className="text-xs mt-2 font-bold">
                        Developed By – MerQ Digisol
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default DeleteProfile;