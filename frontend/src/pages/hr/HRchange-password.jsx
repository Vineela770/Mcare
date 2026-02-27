import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Sidebar from "../../components/common/Sidebar";

const HRChangePassword = () => {
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

    let newErrors = {};

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

      {/* Right Content */}
      <div className="flex flex-col w-full min-h-screen md:ml-64">
        {/* ✅ Proper mobile spacing */}
        <div className="flex-grow px-4 sm:px-6 md:px-10 py-6 md:py-8 pt-16 md:pt-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-6">
            Change Password
          </h1>

          <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 md:p-8 w-full max-w-4xl">
            <form onSubmit={handleSubmit}>
              {/* Old Password */}
              <div className="mb-6">
                <label className="block mb-2 text-sm md:text-base">
                  Old password
                </label>
                <div className="relative">
                  <input
                    type={showOld ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-gray-100 px-4 py-3 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-4 top-3 text-gray-500"
                  >
                    {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.oldPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.oldPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="mb-6">
                <label className="block mb-2 text-sm md:text-base">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-100 px-4 py-3 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-3 text-gray-500"
                  >
                    {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-8">
                <label className="block mb-2 text-sm md:text-base">
                  Retype password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-100 px-4 py-3 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-3 text-gray-500"
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="bg-sky-500 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg hover:bg-sky-600 w-full sm:w-auto"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-sky-500 text-white text-center py-6 px-4">
          <p className="text-sm">© 2025 Mcare Jobs. All Right Reserved.</p>
          <p className="text-sm mt-1">
            Privacy policy, Terms & Conditions.
          </p>
          <p className="text-sm mt-2">
            Developed By – MerQ Digisol
          </p>
        </footer>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 md:p-8 w-full max-w-md text-center">
            <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-4">
              Success 🎉
            </h2>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Your password has been changed successfully.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 w-full sm:w-auto"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRChangePassword;