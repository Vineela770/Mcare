import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";
import axios from "axios";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Added loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setErrors({});

    let newErrors = {};

    if (!oldPassword) {
      newErrors.oldPassword = "Old password is required";
    }

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // ✅ Make the API call
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token"); 
      
      const response = await axios.put(
        "http://localhost:3000/api/auth/change-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setShowSuccess(true);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error("❌ Password Change Failed:", err);
      setApiError(err.response?.data?.message || "Server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Right Content */}
      <div className="ml-64 flex flex-col w-full min-h-screen">
        {/* Page Content */}
        <div className="flex-grow p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Change Password
            </h1>
            <p className="text-gray-500 mt-1">Update your security credentials to keep your account safe.</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl border border-gray-100">
            {/* ✅ Show Backend Error if it exists */}
            {apiError && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm">
                <span className="font-bold">Error:</span> {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Old Password */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Old password</label>
                <div className="relative">
                  <input
                    type={showOld ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className={`w-full bg-gray-50 px-4 py-3 rounded-lg pr-12 border ${errors.oldPassword ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-sky-500 outline-none transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.oldPassword && <p className="text-red-500 text-xs mt-1 font-medium">{errors.oldPassword}</p>}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">New password</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className={`w-full bg-gray-50 px-4 py-3 rounded-lg pr-12 border ${errors.newPassword ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-sky-500 outline-none transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.newPassword && <p className="text-red-500 text-xs mt-1 font-medium">{errors.newPassword}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Retype password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className={`w-full bg-gray-50 px-4 py-3 rounded-lg pr-12 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-sky-500 outline-none transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-sky-500 text-white px-10 py-3 rounded-lg hover:bg-sky-600 font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? <><Loader2 className="animate-spin w-5 h-5" /> Processing...</> : "Change Password"}
              </button>
            </form>
          </div>
        </div>

        {/* ✅ Sticky Footer */}
        <footer className="bg-sky-500 text-white text-center py-6 mt-auto">
          <p className="text-sm font-medium">
            ©️ 2025 Mcare Jobs. All Right Reserved.
          </p>
          <p className="text-sm mt-1 opacity-90">
            Privacy policy, Terms & Conditions.
          </p>
          <p className="text-sm mt-2 font-bold">
            Developed By – MerQ Digisol
          </p>
        </footer>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Password Changed!
            </h2>
            <p className="text-gray-600 mb-8">
              Your account security has been updated successfully.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-sky-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-sky-600 transition-colors shadow-lg"
            >
              Great, thank you!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;