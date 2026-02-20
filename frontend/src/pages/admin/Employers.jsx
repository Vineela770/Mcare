import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Edit2, Trash2, Eye,
  Briefcase, Users,
  CheckCircle, XCircle
} from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';

const Employers = () => {

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [notification, setNotification] = useState(null);
  const [employersList, setEmployersList] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    location: '',
    status: 'Active'
  });

  // ================= FETCH =================
  const fetchEmployers = useCallback(async () => {
    const res = await fetch("http://localhost:5000/api/employers");
    const data = await res.json();
    setEmployersList(data);
  }, []);

  useEffect(() => {
    fetchEmployers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // ================= ADD =================
  const handleSubmitAdd = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/employers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    fetchEmployers();
    setShowAddModal(false);
    showNotification("Employer added");
  };

  // ================= VIEW =================
  const handleViewEmployer = async (emp) => {
    const res = await fetch(`http://localhost:5000/api/employers/${emp.id}`);
    const data = await res.json();
    setSelectedEmployer(data);
    setShowViewModal(true);
  };

  // ================= EDIT =================
  const handleEditEmployer = (emp) => {
    setSelectedEmployer(emp);
    setFormData({
      name: emp.name,
      contactPerson: emp.contact_person,
      email: emp.email,
      phone: emp.phone,
      location: emp.location,
      status: emp.status
    });
    setShowEditModal(true);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:5000/api/employers/${selectedEmployer.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    fetchEmployers();
    setShowEditModal(false);
    showNotification("Employer updated");
  };

  // ================= DELETE =================
  const handleDeleteEmployer = (emp) => {
    setSelectedEmployer(emp);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await fetch(`http://localhost:5000/api/employers/${selectedEmployer.id}`, {
      method: "DELETE"
    });

    fetchEmployers();
    setShowDeleteModal(false);
    showNotification("Employer deleted");
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ================= STATS =================
  const stats = [
    {
      label: 'Total Employers',
      value: employersList.length,
      icon: Briefcase,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Active',
      value: employersList.filter(e => e.status === 'Active').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'Inactive',
      value: employersList.filter(e => e.status === 'Inactive').length,
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    },
    {
      label: 'Total Applications',
      value: 0,
      icon: Users,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50'
    }
  ];

  return (
    <div>
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employers Management</h1>
            <p className="text-gray-600 mt-1">Manage hospital and healthcare organizations</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Add Employer
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Organization</th>
                <th className="px-6 py-4 text-left">Contact</th>
                <th className="px-6 py-4 text-left">Location</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employersList.map(emp => (
                <tr key={emp.id} className="border-t">
                  <td className="px-6 py-4">{emp.name}</td>
                  <td className="px-6 py-4">{emp.contact_person}</td>
                  <td className="px-6 py-4">{emp.location}</td>
                  <td className="px-6 py-4">{emp.status}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button onClick={() => handleViewEmployer(emp)}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleEditEmployer(emp)}>
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteEmployer(emp)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <Modal title="Add Employer" onClose={() => setShowAddModal(false)} onSubmit={handleSubmitAdd} formData={formData} handleFormChange={handleFormChange} />
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <Modal title="Edit Employer" onClose={() => setShowEditModal(false)} onSubmit={handleSubmitEdit} formData={formData} handleFormChange={handleFormChange} />
      )}

      {/* VIEW MODAL */}
      {showViewModal && selectedEmployer && (
        <ViewModal employer={selectedEmployer} onClose={() => setShowViewModal(false)} />
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <DeleteModal onClose={() => setShowDeleteModal(false)} onConfirm={confirmDelete} />
      )}

      {/* TOAST */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg">
          {notification}
        </div>
      )}
    </div>
  );
};


// ===== REUSABLE MODAL COMPONENTS =====

const Modal = ({ title, onClose, onSubmit, formData, handleFormChange }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        {['name','contactPerson','email','phone','location'].map(field => (
          <input key={field} name={field} placeholder={field}
            value={formData[field]} onChange={handleFormChange}
            className="w-full border p-2 rounded" required />
        ))}
        <select name="status" value={formData.status}
          onChange={handleFormChange} className="w-full border p-2 rounded">
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <div className="flex justify-end space-x-2 pt-2">
          <button type="button" onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
          <button type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  </div>
);

const ViewModal = ({ employer, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-xl font-bold mb-4">Employer Details</h2>
      <p><b>Name:</b> {employer.name}</p>
      <p><b>Contact:</b> {employer.contact_person}</p>
      <p><b>Email:</b> {employer.email}</p>
      <p><b>Phone:</b> {employer.phone}</p>
      <p><b>Location:</b> {employer.location}</p>
      <p><b>Status:</b> {employer.status}</p>

      <div className="flex justify-end mt-4">
        <button onClick={onClose}
          className="px-4 py-2 bg-gray-400 text-white rounded">Close</button>
      </div>
    </div>
  </div>
);

const DeleteModal = ({ onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg w-96 text-center">
      <h2 className="text-xl font-bold mb-4">Delete Employer?</h2>
      <div className="flex justify-center space-x-3">
        <button onClick={onClose}
          className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
        <button onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
      </div>
    </div>
  </div>
);

export default Employers;