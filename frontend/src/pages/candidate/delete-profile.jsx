import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import { authService } from "../../api/authService";
import { AuthContext } from "../../context/AuthContext";

const DeleteProfile = () => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleDelete = async (e) => {
        e.preventDefault();

        if (!password) {
            setError("Password is required");
            return;
        }

        setError("");
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        try {
            setLoading(true);
            setShowConfirmModal(false);
            await authService.deleteProfile(password);
            setSuccess(true);
            
            // Auto-logout after 2 seconds
            setTimeout(() => {
                logout();
                navigate("/");
            }, 2000);
        } catch (err) {
            setError(err.message || "Failed to delete account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Right Content */}
        <div className="flex flex-col w-full min-h-screen md:ml-64">
            {/* Page Content */}
            <div className="flex-grow px-4 sm:px-6 md:px-10 py-6 md:py-8">
            <div className="pt-14 md:pt-0">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-6">
                Delete Profile
                </h1>

                <div className="bg-white rounded-xl shadow p-5 sm:p-6 md:p-8 w-full max-w-4xl">
                <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                    Are you sure you want to delete your profile?
                </h2>

                {/* Recovery notice */}
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-5 md:mb-6">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm md:text-base text-amber-800 font-medium">30-Day Recovery Period</p>
                        <p className="text-xs md:text-sm text-amber-700 mt-1">
                            After deletion, you have 30 days to recover your account. After that, your data will be permanently deleted.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleDelete}>
                    <label className="block text-sm md:text-base text-gray-600 mb-2">
                    Please enter your login password to confirm:
                    </label>

                    {/* Password Field with Eye Icon */}
                    <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-100 px-4 py-3 rounded-lg pr-12 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    {success && (
                      <div className="mt-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-green-700 text-sm font-medium">
                            Your profile has been deleted. You have 30 days to recover it. Logging out...
                        </p>
                      </div>
                    )}

                    {!success && (
                      <button
                      type="submit"
                      disabled={loading}
                      className="mt-6 w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg transition text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                      {loading ? "Deleting..." : "Delete Profile"}
                      </button>
                    )}
                </form>
                </div>
            </div>
            </div>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center py-5 md:py-6 px-4">
            <p className="text-xs md:text-sm">© 2025 Mcare Jobs. All Right Reserved.</p>
            <p className="text-xs md:text-sm mt-1">Privacy policy, Terms & Conditions.</p>
            <p className="text-xs md:text-sm mt-2">Developed By – MerQ Digisol</p>
            </footer>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 md:p-8 w-full max-w-md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-6">
                        This will deactivate your account. You can recover it within 30 days by contacting support or logging in again. Are you sure?
                    </p>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => setShowConfirmModal(false)}
                            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                        >
                            Yes, Delete My Account
                        </button>
                    </div>
                </div>
            </div>
        )}
        </div>
    );
};

export default DeleteProfile;