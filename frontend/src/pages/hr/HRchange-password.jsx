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

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!oldPassword) newErrors.oldPassword = "Old password is required";

    if (!newPassword)
      newErrors.newPassword = "New password is required";
    else if (newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters";

    if (!confirmPassword)
      newErrors.confirmPassword = "Please retype your password";
    else if (newPassword !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const res = await fetch("http://localhost:5000/api/hr/change-password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hrId: 1, // ⚠ Replace with logged-in HR ID
            oldPassword,
            newPassword,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrors({ oldPassword: data.message });
          return;
        }

        setShowSuccess(true);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="ml-64 flex flex-col w-full min-h-screen">
        <div className="flex-grow p-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            Change Password
          </h1>

          <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl">
            <form onSubmit={handleSubmit}>
              
              {/* Old Password */}
              <div className="mb-6">
                <label className="block mb-2">Old password</label>
                <div className="relative">
                  <input
                    type={showOld ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-gray-100 px-4 py-3 rounded-lg pr-12"
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
                <label className="block mb-2">New password</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-100 px-4 py-3 rounded-lg pr-12"
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
                <label className="block mb-2">Retype password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-100 px-4 py-3 rounded-lg pr-12"
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
                className="bg-sky-500 text-white px-8 py-3 rounded-lg hover:bg-sky-600"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>

        <footer className="bg-sky-500 text-white text-center py-6">
          <p className="text-sm">© 2025 Mcare Jobs. All Right Reserved.</p>
          <p className="text-sm mt-1">
            Privacy policy, Terms & Conditions.
          </p>
          <p className="text-sm mt-2">
            Developed By – MerQ Digisol
          </p>
        </footer>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md text-center">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">
              Success 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              Your password has been changed successfully.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600"
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
