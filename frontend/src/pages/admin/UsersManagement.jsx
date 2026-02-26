import { useState, useEffect, useCallback } from 'react';
import { Users, Edit2, Trash2, UserPlus, X } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'candidate',
    status: 'Active'
  });

  // FETCH USERS
  const fetchUsers = useCallback(async () => {
    const res = await fetch(`${API_URL}/api/admin/users`);
    const data = await res.json();
    setUsers(data);
  }, []);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ADD USER
  const handleSubmitAdd = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/admin/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const newUser = await res.json();
    setUsers(prev => [...prev, newUser]);
    setShowAddModal(false);
  };

  // EDIT USER
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setShowEditModal(true);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `${API_URL}/api/admin/users/${selectedUser.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    const updatedUser = await res.json();

    setUsers(prev =>
      prev.map(u => u.id === selectedUser.id ? updatedUser : u)
    );

    setShowEditModal(false);
  };

  // DELETE USER
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await fetch(
      `${API_URL}/api/admin/users/${selectedUser.id}`,
      { method: "DELETE" }
    );

    setUsers(prev =>
      prev.filter(u => u.id !== selectedUser.id)
    );

    setShowDeleteModal(false);
  };

  return (
    <div>
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6">

        {/* HEADER */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
            <p className="text-gray-600 mt-2">Manage all system users and their roles</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add User</span>
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Joined</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4">{user.name} ({user.email})</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">{user.status}</td>
                  <td className="px-6 py-4">{user.joined}</td>
                  <td className="px-6 py-4 space-x-3">

                    <button onClick={() => handleEditUser(user)}>
                      <Edit2 />
                    </button>

                    <button onClick={() => handleDeleteUser(user)}>
                      <Trash2 />
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
        <Modal
          title="Add User"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleSubmitAdd}
          formData={formData}
          handleFormChange={handleFormChange}
        />
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <Modal
          title="Edit User"
          onClose={() => setShowEditModal(false)}
          onSubmit={handleSubmitEdit}
          formData={formData}
          handleFormChange={handleFormChange}
        />
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl text-center">
            <h2 className="text-xl font-bold mb-4">Delete User?</h2>

            <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded mr-3">
              Delete
            </button>

            <button onClick={() => setShowDeleteModal(false)} className="border px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// REUSABLE MODAL
const Modal = ({ title, onClose, onSubmit, formData, handleFormChange }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
    <div className="bg-white rounded-xl p-6 w-96">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <button onClick={onClose}><X /></button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">

        <input name="name" placeholder="Name"
          value={formData.name} onChange={handleFormChange}
          className="w-full border p-2 rounded" required />

        <input name="email" placeholder="Email"
          value={formData.email} onChange={handleFormChange}
          className="w-full border p-2 rounded" required />

        <select name="role" value={formData.role}
          onChange={handleFormChange}
          className="w-full border p-2 rounded">
          <option value="candidate">Candidate</option>
          <option value="hr">HR</option>
          <option value="employee">Employee</option>
        </select>

        <select name="status" value={formData.status}
          onChange={handleFormChange}
          className="w-full border p-2 rounded">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 rounded">
          Save
        </button>

      </form>
    </div>
  </div>
);

export default UsersManagement;