import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";

const HRDeleteProfile = () => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleDelete = (e) => {
        e.preventDefault();

        if (!password) {
        setError("Password is required");
        return;
        }

        setError("");

        alert("Your profile has been deleted successfully.");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Right Content */}
        <div className="flex flex-col w-full min-h-screen md:ml-64">
            {/* ✅ Mobile spacing so hamburger doesn't overlap */}
            <div className="flex-grow px-4 sm:px-6 md:px-10 py-6 md:py-8 pt-16 md:pt-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-6">
                Delete Profile
            </h1>

            <div className="bg-white rounded-xl shadow p-5 sm:p-6 md:p-8 w-full max-w-4xl">
                <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                Are you sure! You want to delete your profile.
                </h2>

                <p className="text-gray-500 mb-5 md:mb-6 text-sm md:text-base">
                This can't be undone!
                </p>

                <form onSubmit={handleDelete}>
                <label className="block text-gray-600 mb-2 text-sm md:text-base">
                    Please enter your login Password to confirm:
                </label>

                {/* Password Field with Eye Icon */}
                <div className="relative">
                    <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-100 px-4 py-3 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />

                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700"
                    >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <button
                    type="submit"
                    className="mt-6 bg-sky-500 hover:bg-sky-600 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg transition w-full sm:w-auto"
                >
                    Delete Profile
                </button>
                </form>
            </div>
            </div>

            {/* Footer */}
            <footer className="bg-sky-500 text-white text-center py-6 px-4">
            <p className="text-sm">© 2025 Mcare Jobs. All Right Reserved.</p>
            <p className="text-sm mt-1">Privacy policy, Terms & Conditions.</p>
            <p className="text-sm mt-2">Developed By – MerQ Digisol</p>
            </footer>
        </div>
        </div>
    );
};

export default HRDeleteProfile;