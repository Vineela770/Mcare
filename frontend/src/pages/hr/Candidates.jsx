import { useState, useEffect } from 'react';
import {
  Search, Filter, Download, Eye, Check, X,
  Star, Phone, Mail, MapPin, Briefcase,
  CheckCircle, AlertCircle
} from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/candidates");
      const data = await res.json();
      setCandidates(data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  // ✅ Update Status (Accept/Reject)
  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/candidates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      fetchCandidates();
      showNotification("Status updated successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.specialization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterSpecialization === 'all' ||
      candidate.specialization === filterSpecialization;

    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Candidate Database</h1>
          <p className="text-gray-600 mt-2">Browse and manage all candidates</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Candidates" value={candidates.length} />
          <StatCard title="Available"
            value={candidates.filter(c => c.status === 'Available').length}
            color="text-green-600"
          />
          <StatCard title="Interviewing"
            value={candidates.filter(c => c.status === 'Interviewing').length}
            color="text-yellow-600"
          />
          <StatCard
            title="Avg Rating"
            value={
              candidates.length > 0
                ? (candidates.reduce((sum, c) => sum + Number(c.rating), 0) / candidates.length).toFixed(1)
                : "0.0"
            }
            color="text-cyan-600"
          />
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left">Candidate</th>
                <th className="px-6 py-3 text-left">Specialization</th>
                <th className="px-6 py-3 text-left">Experience</th>
                <th className="px-6 py-3 text-left">Location</th>
                <th className="px-6 py-3 text-left">Rating</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCandidates.map(candidate => (
                <tr key={candidate.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{candidate.name}</div>
                    <div className="text-sm text-gray-500">{candidate.email}</div>
                  </td>
                  <td className="px-6 py-4">{candidate.specialization}</td>
                  <td className="px-6 py-4">{candidate.experience}</td>
                  <td className="px-6 py-4">{candidate.location}</td>
                  <td className="px-6 py-4 flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    {candidate.rating}
                  </td>
                  <td className="px-6 py-4">{candidate.status}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => updateStatus(candidate.id, "Hired")}
                      className="text-green-600"
                    >
                      <Check />
                    </button>
                    <button
                      onClick={() => updateStatus(candidate.id, "Rejected")}
                      className="text-red-600"
                    >
                      <X />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {notification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
};

// Small reusable stat card
const StatCard = ({ title, value, color = "text-gray-900" }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="text-sm text-gray-600 mb-1">{title}</div>
    <div className={`text-3xl font-bold ${color}`}>{value}</div>
  </div>
);

export default Candidates;
