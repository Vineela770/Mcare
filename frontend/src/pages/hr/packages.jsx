import Sidebar from "../../components/common/Sidebar";

const Packages = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Right Content */}
        <div className="flex flex-col w-full min-h-screen md:ml-64">
            {/* Page Content */}
            <main className="flex-grow flex items-center justify-center px-4 sm:px-6 md:px-10 pt-16 md:pt-0">
            <div className="bg-white rounded-xl shadow p-6 sm:p-8 md:p-10 max-w-4xl w-full text-center">
                <p className="text-gray-500 text-base sm:text-lg">
                Don&apos;t have any packages
                </p>
            </div>
            </main>

            {/* Footer */}
            <footer className="bg-white">
            {/* Upper footer */}
            {/* ✅ CHANGED: grid-cols-3 for mobile also */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-10 
                            grid grid-cols-3 md:grid-cols-3 
                            gap-4 md:gap-8 text-xs sm:text-sm">

                {/* Section 1 */}
                <div>
                <h3 className="font-semibold text-gray-800 mb-3">Home</h3>
                <ul className="space-y-2 text-sky-600">
                    <li>
                    <a href="/" className="hover:underline">Home</a>
                    </li>
                    <li>
                    <a href="/jobs" className="hover:underline">All Jobs</a>
                    </li>
                    <li>
                    <a href="/about" className="hover:underline">About Us</a>
                    </li>
                    <li>
                    <a href="/contact" className="hover:underline">Contact Us</a>
                    </li>
                </ul>
                </div>

                {/* Section 2 */}
                <div>
                <h3 className="font-semibold text-gray-800 mb-3">Call us</h3>
                <p className="text-sky-600 mb-2 break-words">
                    +91-9347118061
                </p>
                </div>

                {/* Section 3 */}
                <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                    Corporate Office
                </h3>
                <p className="text-emerald-600 leading-relaxed break-words">
                    201, Aster Prime Hospital,
                    <br />
                    Ameerpet, Hyderabad,
                    <br />
                    Telangana – 500 016
                </p>
                </div>
            </div>

            {/* Bottom green bar */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center py-4 text-xs sm:text-sm px-4">
                <p>
                © 2025 Mcare Jobs. All Right Reserved – Privacy policy, Terms &amp; Conditions.
                </p>
                <p className="mt-1">Developed By – MerQ Digisol</p>
            </div>
            </footer>
        </div>
        </div>
    );
};

export default Packages;