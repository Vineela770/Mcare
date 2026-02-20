import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";

const HRDeleteProfile = () => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [recoveryEmail, setRecoveryEmail] = useState("");
    const [mailLoading, setMailLoading] = useState(false);
    const [mailMessage, setMailMessage] = useState("");

    const navigate = useNavigate();

    // 🔴 DELETE PROFILE API CALL
    const handleDelete = async (e) => {
        e.preventDefault();

        if (!password) {
            setError("Password is required");
            return;
        }

        try {
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/account/delete-profile",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ password }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("Profile deleted successfully.");
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                setError(data.message || "Failed to delete profile");
            }
        } catch (err) {
            setError("Server error. Try again.");
        }
    };

    // 📩 SEND RECOVERY MAIL
    const handleSendRecoveryMail = async () => {
        if (!recoveryEmail) {
            setMailMessage("Please enter recovery email");
            return;
        }

        try {
            setMailLoading(true);
            setMailMessage("");

            const response = await fetch(
                "http://localhost:5000/api/account/send-recovery-mail",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: recoveryEmail }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMailMessage("Recovery email sent successfully ✅");
            } else {
                setMailMessage(data.message || "Failed to send mail");
            }
        } catch (error) {
            setMailMessage("Server error. Try again.");
        } finally {
            setMailLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Right Content */}
            <div className="ml-64 flex flex-col w-full min-h-screen">
                <div className="flex-grow px-10 py-8">
                    <h1 className="text-3xl font-semibold text-gray-800 mb-6">
                        Delete Profile
                    </h1>

                    <div className="bg-white rounded-xl shadow p-8 max-w-4xl">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Are you sure! You want to delete your profile.
                        </h2>

                        <p className="text-gray-500 mb-6">
                            This can't be undone!
                        </p>

                        <form onSubmit={handleDelete}>
                            <label className="block text-gray-600 mb-2">
                                Please enter your login Password to confirm:
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="w-full bg-gray-100 px-4 py-3 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm mt-2">
                                    {error}
                                </p>
                            )}

                            {successMessage && (
                                <p className="text-green-600 text-sm mt-2">
                                    {successMessage}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="mt-6 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg transition"
                            >
                                Delete Profile
                            </button>
                        </form>

                        {/* Recovery Mail Section */}
                        <div className="mt-6">
                            <label className="block text-gray-600 mb-2">
                                Recovery Email
                            </label>

                            <input
                                type="email"
                                value={recoveryEmail}
                                onChange={(e) =>
                                    setRecoveryEmail(e.target.value)
                                }
                                placeholder="Enter recovery email"
                                className="w-full bg-gray-100 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                            />

                            <button
                                type="button"
                                onClick={handleSendRecoveryMail}
                                disabled={mailLoading}
                                className="mt-3 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition"
                            >
                                {mailLoading
                                    ? "Sending..."
                                    : "Send Recovery Mail"}
                            </button>

                            {mailMessage && (
                                <p className="text-sm mt-2 text-blue-600">
                                    {mailMessage}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-sky-500 text-white text-center py-6">
                    <p className="text-sm">
                        © 2025 Mcare Jobs. All Right Reserved.
                    </p>
                    <p className="text-sm mt-1">
                        Privacy policy, Terms & Conditions.
                    </p>
                    <p className="text-sm mt-2">
                        Developed By – MerQ Digisol
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default HRDeleteProfile;
