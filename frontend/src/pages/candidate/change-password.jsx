import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!oldPassword) newErrors.oldPassword = "Old password is required";

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please retype your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setShowSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* ✅ Right Content (mobile + desktop safe) */}
      <div className="flex flex-col w-full min-h-screen md:ml-64">
        {/* Page Content */}
        <div className="flex-grow px-4 sm:px-6 md:p-8 py-6">
          {/* ✅ Push content down on mobile because hamburger is fixed */}
          <div className="pt-14 md:pt-0">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-6">
              Change Password
            </h1>

            <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 md:p-8 w-full max-w-4xl">
              <form onSubmit={handleSubmit}>
                {/* Old Password */}
                <div className="mb-5 md:mb-6">
                  <label className="block mb-2 text-sm md:text-base text-gray-700">
                    Old password
                  </label>
                  <div className="relative">
                    <input
                      type={showOld ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full h-12 bg-gray-100 border border-gray-300 px-4 pr-12 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter old password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOld(!showOld)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-700"
                      aria-label={showOld ? "Hide old password" : "Show old password"}
                    >
                      {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.oldPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
                  )}
                </div>

                {/* New Password */}
                <div className="mb-5 md:mb-6">
                  <label className="block mb-2 text-sm md:text-base text-gray-700">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-12 bg-gray-100 border border-gray-300 px-4 pr-12 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-700"
                      aria-label={showNew ? "Hide new password" : "Show new password"}
                    >
                      {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-6 md:mb-8">
                  <label className="block mb-2 text-sm md:text-base text-gray-700">
                    Retype password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-12 bg-gray-100 border border-gray-300 px-4 pr-12 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Retype new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-700"
                      aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-sky-500 text-white px-8 py-3 rounded-lg hover:bg-sky-600 transition text-sm md:text-base"
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ✅ Footer */}
        <footer className="bg-sky-500 text-white text-center py-5 md:py-6 px-4">
          <p className="text-xs md:text-sm">©️ 2025 Mcare Jobs. All Right Reserved.</p>
          <p className="text-xs md:text-sm mt-1">Privacy policy, Terms & Conditions.</p>
          <p className="text-xs md:text-sm mt-2">Developed By – MerQ Digisol</p>
        </footer>
      </div>

      {/* ✅ Success Modal (mobile safe) */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 md:p-8 w-full max-w-md text-center">
            <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-3 md:mb-4">
              Success 🎉
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-5 md:mb-6">
              Your password has been changed successfully.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full sm:w-auto bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition text-sm md:text-base"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;