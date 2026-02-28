import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";

const DeleteProfile = () => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleDelete = (e) => {
        e.preventDefault();

        if (!password) {
        setError("Password is required");
        return;
        }

        setError("");
        setSuccess(true);
        setTimeout(() => navigate("/"), 1500);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <Sidebar />

        {/* ✅ Right Content */}
        <div className="flex flex-col w-full min-h-screen md:ml-64">
            {/* ✅ Page Content */}
            <div className="flex-grow px-4 sm:px-6 md:px-10 py-6 md:py-8">
            {/* ✅ Move heading down on mobile (because hamburger button is fixed) */}
            <div className="pt-14 md:pt-0">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-6">
                Delete Profile
                </h1>

                <div className="bg-white rounded-xl shadow p-5 sm:p-6 md:p-8 w-full max-w-4xl">
                <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                    Are you sure! You want to delete your profile.
                </h2>

                <p className="text-sm md:text-base text-gray-500 mb-5 md:mb-6">
                    This can't be undone!
                </p>

                <form onSubmit={handleDelete}>
                    <label className="block text-sm md:text-base text-gray-600 mb-2">
                    Please enter your login Password to confirm:
                    </label>

                    {/* Password Field with Eye Icon */}
                    <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-100 px-4 py-3 rounded-lg pr-12 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-sky-400"
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
                        <p className="text-green-700 text-sm font-medium">Your profile has been deleted successfully. Redirecting...</p>
                      </div>
                    )}

                    {!success && (
                      <button
                      type="submit"
                      className="mt-6 w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg transition text-sm md:text-base"
                      >
                      Delete Profile
                      </button>
                    )}
                </form>
                </div>
            </div>
            </div>

            {/* ✅ Footer */}
            <footer className="bg-sky-500 text-white text-center py-5 md:py-6 px-4">
            <p className="text-xs md:text-sm">© 2025 Mcare Jobs. All Right Reserved.</p>
            <p className="text-xs md:text-sm mt-1">Privacy policy, Terms & Conditions.</p>
            <p className="text-xs md:text-sm mt-2">Developed By – MerQ Digisol</p>
            </footer>
        </div>
        </div>
    );
};

export default DeleteProfile;