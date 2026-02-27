import React, { useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MapPin,
  Briefcase,
  Download,
  Users,
  CheckCircle,
  XCircle,
  X,
  AlertCircle,
  Mail,
  Phone,
} from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';

const Employers = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [notification, setNotification] = useState(null);

  const [employersList, setEmployersList] = useState([
    {
      id: 1,
      name: 'MCARE Hospital',
      contactPerson: 'Dr. Ramesh Kumar',
      email: 'hr@mcare.com',
      phone: '+91 98765 43210',
      location: 'Guntur, AP',
      activeJobs: 12,
      totalApplications: 2,
      joinedDate: '2023-01-15',
      status: 'Active',
      applicants: [
        { id: 1, name: 'Anjali Reddy', email: 'anjali@gmail.com', resume: '/resumes/anjali_resume.pdf' },
        { id: 2, name: 'Kiran Kumar', email: 'kiran@gmail.com', resume: '/resumes/kiran_resume.pdf' },
      ],
    },
    {
      id: 2,
      name: 'Apollo Hospitals',
      contactPerson: 'Ms. Priya Sharma',
      email: 'recruitment@apollo.com',
      phone: '+91 98765 43211',
      location: 'Hyderabad, TS',
      activeJobs: 18,
      totalApplications: 1,
      joinedDate: '2023-02-20',
      status: 'Active',
      applicants: [{ id: 1, name: 'Kavya', email: 'kavya@gmail.com', resume: '/resumes/kavya_resume.pdf' }],
    },
    {
      id: 3,
      name: 'City Hospital',
      contactPerson: 'Mr. Suresh Reddy',
      email: 'hr@cityhospital.com',
      phone: '+91 98765 43212',
      location: 'Vijayawada, AP',
      activeJobs: 8,
      totalApplications: 1,
      joinedDate: '2023-03-10',
      status: 'Active',
      applicants: [{ id: 1, name: 'Yashwanth', email: 'yashwanth@gmail.com', resume: '/resumes/yashwanth_resume.pdf' }],
    },
    {
      id: 4,
      name: 'Care Hospital',
      contactPerson: 'Dr. Lakshmi Devi',
      email: 'jobs@carehospital.com',
      phone: '+91 98765 43213',
      location: 'Guntur, AP',
      activeJobs: 0,
      totalApplications: 0,
      joinedDate: '2023-05-22',
      status: 'Inactive',
    },
    {
      id: 5,
      name: 'Max Hospital',
      contactPerson: 'Mr. Rajesh Patel',
      email: 'hr@maxhospital.com',
      phone: '+91 98765 43214',
      location: 'Vijayawada, AP',
      activeJobs: 15,
      totalApplications: 0,
      joinedDate: '2023-04-18',
      status: 'Active',
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    location: '',
    status: 'Active',
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddEmployer = () => {
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      location: '',
      status: 'Active',
    });
    setShowAddModal(true);
  };

  const handleViewEmployer = (employer) => {
    setSelectedEmployer(employer);
    setShowViewModal(true);
  };

  const handleEditEmployer = (employer) => {
    setSelectedEmployer(employer);
    setFormData({
      name: employer.name,
      contactPerson: employer.contactPerson,
      email: employer.email,
      phone: employer.phone,
      location: employer.location,
      status: employer.status,
    });
    setShowEditModal(true);
  };

  const handleDeleteEmployer = (employer) => {
    setSelectedEmployer(employer);
    setShowDeleteModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    const newEmployer = {
      id: employersList.length + 1,
      ...formData,
      activeJobs: 0,
      totalApplications: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setEmployersList((prev) => [...prev, newEmployer]);
    setShowAddModal(false);
    showNotification(`${formData.name} has been added successfully!`);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    setEmployersList((prev) =>
      prev.map((emp) => (emp.id === selectedEmployer.id ? { ...emp, ...formData } : emp))
    );
    setShowEditModal(false);
    showNotification(`${formData.name} has been updated successfully!`);
  };

  const confirmDelete = () => {
    setEmployersList((prev) => prev.filter((emp) => emp.id !== selectedEmployer.id));
    setShowDeleteModal(false);
    showNotification(`${selectedEmployer.name} has been deleted.`, 'info');
  };

  const stats = useMemo(
    () => [
      {
        label: 'Total Employers',
        value: employersList.length.toString(),
        icon: Briefcase,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
      },
      {
        label: 'Active',
        value: employersList.filter((e) => e.status === 'Active').length.toString(),
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-50',
      },
      {
        label: 'Inactive',
        value: employersList.filter((e) => e.status === 'Inactive').length.toString(),
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-50',
      },
      {
        label: 'Total Jobs Posted',
        value: employersList.reduce((sum, e) => sum + e.activeJobs, 0).toString(),
        icon: Users,
        color: 'text-cyan-600',
        bg: 'bg-cyan-50',
      },
    ],
    [employersList]
  );

  const filteredEmployers = useMemo(() => {
    const byStatus =
      filterStatus === 'all'
        ? employersList
        : employersList.filter((emp) => emp.status.toLowerCase() === filterStatus);

    const q = searchTerm.trim().toLowerCase();
    if (!q) return byStatus;

    return byStatus.filter((emp) => {
      const hay = `${emp.name} ${emp.contactPerson} ${emp.email} ${emp.phone} ${emp.location} ${emp.status}`.toLowerCase();
      return hay.includes(q);
    });
  }, [filterStatus, employersList, searchTerm]);

  const downloadAllResumes = () => {
    if (!selectedEmployer?.applicants?.length) return;

    selectedEmployer.applicants.forEach((applicant) => {
      const link = document.createElement('a');
      link.href = applicant.resume;
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    showNotification('All resumes downloaded successfully!');
  };

  return (
    <div>
      <Sidebar />

      {/* ✅ Desktop preserved (md:ml-64). ✅ Mobile header moved slightly down (pt-12) */}
      <div className="flex-1 md:ml-64 pt-16 md:pt-6 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Employers Management</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">Manage hospital and healthcare organizations</p>
          </div>

          <button
            onClick={handleAddEmployer}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Employer</span>
          </button>
        </div>

        {/* Stats: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters + Search: stack on mobile */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Employers
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'active'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterStatus('inactive')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'inactive'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Inactive
              </button>
            </div>

            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search employers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* ✅ Desktop table (unchanged look) */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Organization</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Contact Person</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Location</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Active Jobs</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Applications</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredEmployers.map((employer) => (
                <tr key={employer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-gray-900">{employer.name}</p>
                      <p className="text-sm text-gray-500">{employer.email}</p>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div>
                      <p className="text-gray-900">{employer.contactPerson}</p>
                      <p className="text-sm text-gray-500">{employer.phone}</p>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{employer.location}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className="text-gray-900 font-medium">{employer.activeJobs}</span>
                  </td>

                  <td className="py-4 px-6">
                    <span className="text-gray-900 font-medium">{employer.totalApplications}</span>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        employer.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {employer.status}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewEmployer(employer)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleEditEmployer(employer)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Employer"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployer(employer)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Delete Employer"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Mobile/Tablet cards (does not affect desktop) */}
        <div className="lg:hidden space-y-4">
          {filteredEmployers.map((emp) => (
            <div key={emp.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{emp.name}</p>
                  <p className="text-sm text-gray-600 truncate">{emp.contactPerson}</p>

                  <div className="mt-2 flex flex-col gap-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{emp.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{emp.location}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                    emp.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}
                >
                  {emp.status}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <p className="text-xs text-gray-500">Active Jobs</p>
                  <p className="text-lg font-bold text-gray-900">{emp.activeJobs}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <p className="text-xs text-gray-500">Applications</p>
                  <p className="text-lg font-bold text-gray-900">{emp.totalApplications}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleViewEmployer(emp)}
                  className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium inline-flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => handleEditEmployer(emp)}
                  className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium inline-flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEmployer(emp)}
                  className="px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm font-medium inline-flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredEmployers.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-600">
              No employers found.
            </div>
          )}
        </div>
      </div>

      {/* Add Employer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-10 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowAddModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmitAdd}>
                <div className="bg-white px-6 pt-5 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">Add New Employer</h3>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700"
                  >
                    Add Employer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Employer Modal */}
      {showViewModal && selectedEmployer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-10 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowViewModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-6 pt-5 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Employer Details</h3>
                  <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{selectedEmployer.name}</h4>
                    <span
                      className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedEmployer.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedEmployer.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Contact Person</p>
                        <p className="text-sm font-medium text-gray-900">{selectedEmployer.contactPerson}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900 break-all">{selectedEmployer.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium text-gray-900">{selectedEmployer.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-medium text-gray-900">{selectedEmployer.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Active Jobs</p>
                      <p className="text-2xl font-bold text-cyan-600">{selectedEmployer.activeJobs}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Applications</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedEmployer.totalApplications}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Joined Date</p>
                      <p className="text-sm font-medium text-gray-900">{selectedEmployer.joinedDate}</p>
                    </div>

                    <div className="sm:col-span-3 pt-4 border-t">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Applicants ({selectedEmployer.applicants?.length || 0})
                      </h4>

                      {selectedEmployer.applicants?.length > 0 ? (
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {selectedEmployer.applicants.map((applicant) => (
                            <div
                              key={applicant.id}
                              className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200"
                            >
                              <div className="min-w-0">
                                <p className="font-medium text-gray-900 truncate">{applicant.name}</p>
                                <p className="text-sm text-gray-500 truncate">{applicant.email}</p>
                              </div>

                              <a
                                href={applicant.resume}
                                download
                                className="shrink-0 p-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
                                title="Download Resume"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No applicants yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                {selectedEmployer.applicants?.length > 0 && (
                  <button
                    onClick={downloadAllResumes}
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download All</span>
                  </button>
                )}

                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employer Modal */}
      {showEditModal && selectedEmployer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-10 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowEditModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmitEdit}>
                <div className="bg-white px-6 pt-5 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">Edit Employer</h3>
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700"
                  >
                    Update Employer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEmployer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-10 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowDeleteModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-6 pt-5 pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>

                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Employer</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete <span className="font-semibold">{selectedEmployer.name}</span>?
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div
            className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
            } text-white`}
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-4 hover:bg-white/20 rounded p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employers;