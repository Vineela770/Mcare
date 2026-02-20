import { useEffect, useState } from "react";
import Sidebar from "../../components/common/Sidebar";

const Packages = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/packages");
      const data = await res.json();
      setPackages(data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="ml-64 flex flex-col w-full min-h-screen">

        <main className="flex-grow flex items-center justify-center px-10">
          <div className="bg-white rounded-xl shadow p-10 max-w-4xl w-full text-center">

            {packages.length === 0 ? (
              <p className="text-gray-500 text-lg">
                Don&apos;t have any packages
              </p>
            ) : (
              <div className="space-y-6">
                {packages.map(pkg => (
                  <div
                    key={pkg.id}
                    className="border border-gray-200 rounded-lg p-6 text-left"
                  >
                    <h2 className="text-xl font-semibold text-gray-900">
                      {pkg.package_name}
                    </h2>

                    <p className="text-gray-600 mt-2">
                      {pkg.description}
                    </p>

                    <div className="mt-4 flex justify-between text-sm text-gray-700">
                      <span>Duration: {pkg.duration_days} days</span>
                      <span className="font-semibold text-sky-600">
                        ₹ {pkg.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white">
          <div className="max-w-7xl mx-auto px-10 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Home</h3>
              <ul className="space-y-2 text-sky-600">
                <li><a href="/">Home</a></li>
                <li><a href="/jobs">All Jobs</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Call us</h3>
              <p className="text-sky-600 mb-2">+91-9347118061</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">
                Corporate Office
              </h3>
              <p className="text-sky-600">
                201, Aster Prime Hospital,<br />
                Ameerpet, Hyderabad,<br />
                Telangana – 500 016
              </p>
            </div>
          </div>

          <div className="bg-sky-500 text-white text-center py-4 text-sm">
            <p>
              © 2025 Mcare Jobs. All Right Reserved – Privacy policy, Terms &
              Conditions.
            </p>
            <p className="mt-1">Developed By – MerQ Digisol</p>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Packages;
