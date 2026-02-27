import { useState, useEffect } from 'react';
import {
  Users,
  Edit2,
  Trash2,
  UserPlus,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Building2,
} from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import adminService from '../../api/adminService';

const ROLE_LABELS = {
  candidate: 'Doctor',
  hr: 'Employer (HR)',
  admin: 'Admin',
  employee: 'Employee',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'candidate',
    status: 'Active',
  });

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchUsers();
    };
    loadData();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddUser = () => {
    setFormData({
      name: '',
      email: '',
      role: 'candidate',
      status: 'Active',
    });
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleViewUser = async (user) => {
    setViewLoading(true);
    setViewUser(null);
    setShowViewModal(true);
    try {
      const data = await adminService.getUserById(user.id);
      setViewUser(data);
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      setViewUser(user); // fallback to list data
    } finally {
      setViewLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      await adminService.createUser(formData);
      await fetchUsers(); // Refresh the list
      setShowAddModal(false);
      showNotification(`User ${formData.name} has been added successfully!`);
    } catch (error) {
      console.error('Failed to add user:', error);
      showNotification(error.message || 'Failed to add user', 'error');
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateUser(selectedUser.id, formData);
      await fetchUsers(); // Refresh the list
      setShowEditModal(false);
      showNotification(`User ${formData.name} has been updated successfully!`);
    } catch (error) {
      console.error('Failed to update user:', error);
      showNotification(error.message || 'Failed to update user', 'error');
    }
  };

  const confirmDelete = async () => {
    try {
      await adminService.deleteUser(selectedUser.id);
      await fetchUsers(); // Refresh the list
      setShowDeleteModal(false);
      showNotification(`User ${selectedUser.name} has been deleted.`, 'info');
    } catch (error) {
      console.error('Failed to delete user:', error);
      showNotification(error.message || 'Failed to delete user', 'error');
    }
  };

  const filteredUsers = roleFilter === 'all' ? users : users.filter(u => u.role === roleFilter);

  const RolePill = ({ role }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
      role === 'candidate' ? 'bg-cyan-100 text-cyan-800' :
      role === 'hr' ? 'bg-blue-100 text-blue-800' :
      'bg-gray-100 text-gray-800'
    }`}>
      {ROLE_LABELS[role] || role}
    </span>
  );

  const StatusPill = ({ status }) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        status === 'Active'
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {status}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* ✅ Desktop unchanged, ✅ Mobile: add top padding so header moves down */}
      <div className="ml-0 md:ml-64 min-h-screen bg-gray-50 p-4 sm:p-6 pt-16 sm:pt-6 md:pt-6">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Users Management
            </h1>
            <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
              Manage all system users and their roles
            </p>
          </div>

          <button
            onClick={handleAddUser}
            className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 md:px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 font-medium flex items-center justify-center md:justify-start space-x-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add User</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="text-xs md:text-sm text-gray-600 mb-1">
              Total Users
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">
              {users.length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="text-xs md:text-sm text-gray-600 mb-1">
              Candidates
            </div>
            <div className="text-2xl md:text-3xl font-bold text-cyan-600">
              {users.filter((u) => u.role === 'candidate').length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="text-xs md:text-sm text-gray-600 mb-1">
              HR/Employers
            </div>
            <div className="text-2xl md:text-3xl font-bold text-blue-600">
              {users.filter((u) => u.role === 'hr').length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="text-xs md:text-sm text-gray-600 mb-1">
              Employees
            </div>
            <div className="text-2xl md:text-3xl font-bold text-green-600">
              {users.filter((u) => u.role === 'employee').length}
            </div>
          </div>
        </div>

        {/* Role Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {['all', 'candidate', 'hr', 'admin'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                roleFilter === r
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {r === 'all' ? 'All Users' : (ROLE_LABELS[r] || r)}
            </button>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RolePill role={user.role} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusPill status={user.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(user.joined)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="text-emerald-600 hover:text-emerald-900"
                      title="View Full Profile"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit User"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete User"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500 break-all">
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewUser(user)}
                    className="p-2 rounded-lg border border-gray-200 text-emerald-600 active:scale-95"
                    title="View Profile"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditUser(user)}
                    className="p-2 rounded-lg border border-gray-200 text-blue-600 active:scale-95"
                    title="Edit User"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="p-2 rounded-lg border border-gray-200 text-red-600 active:scale-95"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Role</div>
                  <RolePill role={user.role} />
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Status</div>
                  <StatusPill status={user.status} />
                </div>
                <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                  <div className="text-xs text-gray-500 mb-1">Joined</div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(user.joined)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">No users found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowAddModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmitAdd}>
                <div className="bg-white px-6 pt-5 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Add New User
                    </h3>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="user@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option value="candidate">Candidate</option>
                        <option value="hr">HR</option>
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
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

                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowEditModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmitEdit}>
                <div className="bg-white px-6 pt-5 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Edit User
                    </h3>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option value="candidate">Candidate</option>
                        <option value="hr">HR</option>
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
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

                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700"
                  >
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete User
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete{' '}
                        <span className="font-semibold">{selectedUser.name}</span>
                        ? This action cannot be undone.
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

      {/* ─── Full Profile View Modal ────────────────────────────────────────── */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-start justify-center min-h-screen px-4 pt-6 pb-20">
            <div
              className="fixed inset-0 bg-gray-700 bg-opacity-60"
              onClick={() => setShowViewModal(false)}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-cyan-500 to-blue-600 rounded-t-2xl">
                <h2 className="text-xl font-bold text-white">Full Profile Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {viewLoading ? (
                <div className="p-12 text-center text-gray-500">Loading profile…</div>
              ) : viewUser ? (
                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">

                  {/* ── Basic Info ── */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      {viewUser.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{viewUser.title ? `${viewUser.title} ` : ''}{viewUser.name}</h3>
                      <p className="text-gray-500 text-sm">{viewUser.email}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          viewUser.role === 'candidate' ? 'bg-cyan-100 text-cyan-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {ROLE_LABELS[viewUser.role] || viewUser.role}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          viewUser.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {viewUser.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ── Contact Details ── */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Contact & Location</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>{viewUser.phone_number || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>{viewUser.location || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>Joined: {formatDate(viewUser.joined)}</span>
                      </div>
                      {viewUser.dob && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span>DOB: {formatDate(viewUser.dob)}</span>
                        </div>
                      )}
                      {viewUser.gender && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span>{viewUser.gender}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Doctor / Candidate Profile ── */}
                  {viewUser.role === 'candidate' && (
                    <div className="space-y-4">
                      <div className="bg-cyan-50 rounded-xl p-4">
                        <h4 className="font-semibold text-cyan-800 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" /> Medical Professional Details
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500 text-xs">Qualification</span>
                            <p className="font-medium text-gray-800">{viewUser.qualification || '—'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">Highest Qualification</span>
                            <p className="font-medium text-gray-800">{viewUser.highest_qualification || '—'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">Current Position</span>
                            <p className="font-medium text-gray-800">{viewUser.current_position || '—'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">Experience</span>
                            <p className="font-medium text-gray-800">{viewUser.current_experience || '—'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">Expected Salary</span>
                            <p className="font-medium text-gray-800">{viewUser.expected_salary || '—'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">Preferred Job Type</span>
                            <p className="font-medium text-gray-800">{viewUser.preferred_job_type || '—'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">Preferred Location</span>
                            <p className="font-medium text-gray-800">{viewUser.preferred_location || '—'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">Willing to Relocate</span>
                            <p className="font-medium text-gray-800">{viewUser.willing_to_relocate ? 'Yes' : 'No'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">Interested in Teaching</span>
                            <p className="font-medium text-gray-800">{viewUser.interested_in_teaching ? 'Yes' : 'No'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 text-xs">Total Applications</span>
                            <p className="font-medium text-gray-800">{viewUser.total_applications || 0}</p>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      {viewUser.skills && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {(() => {
                              let arr = [];
                              try {
                                const s = typeof viewUser.skills === 'string' ? JSON.parse(viewUser.skills) : viewUser.skills;
                                arr = Array.isArray(s) ? s : [String(viewUser.skills)];
                              } catch (parseErr) {
                                void parseErr;
                                arr = [String(viewUser.skills)];
                              }
                              return arr.map((sk, i) => (
                                <span key={i} className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs">{sk}</span>
                              ));
                            })()}
                          </div>
                        </div>
                      )}

                      {/* Professional Summary */}
                      {viewUser.professional_summary && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Professional Summary</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">{viewUser.professional_summary}</p>
                        </div>
                      )}

                      {/* Resume */}
                      <div className="bg-blue-50 rounded-xl p-4">
                        <h4 className="font-semibold text-blue-800 mb-3 text-sm uppercase tracking-wide">Resume / CV</h4>
                        {viewUser.resume_url ? (
                          <a
                            href={`${import.meta.env.VITE_API_URL || 'https://mcare-backend-61sy.onrender.com'}${viewUser.resume_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            View / Download Resume
                          </a>
                        ) : (
                          <p className="text-sm text-gray-500 italic">No resume uploaded</p>
                        )}
                      </div>

                      {/* Education */}
                      {viewUser.education && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Education</h4>
                          {(() => {
                            const raw = viewUser.education;
                            let edu = null;
                            try { edu = typeof raw === 'string' ? JSON.parse(raw) : raw; } catch (parseErr) { void parseErr; }
                            if (Array.isArray(edu)) {
                              return edu.map((e, i) => (
                                <div key={i} className="mb-2 text-sm border-l-2 border-cyan-300 pl-3">
                                  <p className="font-medium text-gray-800">{e.degree || e.title || '—'}</p>
                                  <p className="text-gray-500">{e.institution || e.school || ''} {e.year ? `· ${e.year}` : ''}</p>
                                </div>
                              ));
                            }
                            return <p className="text-sm text-gray-700">{raw}</p>;
                          })()}
                        </div>
                      )}

                      {/* Certifications */}
                      {viewUser.certifications && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Certifications</h4>
                          <p className="text-sm text-gray-700">{viewUser.certifications}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Employer / HR Profile ── */}
                  {viewUser.role === 'hr' && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-800 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                        <Building2 className="w-4 h-4" /> Organization Details
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500 text-xs">Designation</span>
                          <p className="font-medium text-gray-800">{viewUser.designation || '—'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">Organization</span>
                          <p className="font-medium text-gray-800">{viewUser.organization_name || '—'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">Category</span>
                          <p className="font-medium text-gray-800">{viewUser.organization_category || '—'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">Number of Beds</span>
                          <p className="font-medium text-gray-800">{viewUser.number_of_beds || '—'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">City</span>
                          <p className="font-medium text-gray-800">{viewUser.organization_city || '—'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs">Address</span>
                          <p className="font-medium text-gray-800">{viewUser.organization_address || '—'}</p>
                        </div>
                        {viewUser.website_url && (
                          <div className="sm:col-span-2">
                            <span className="text-gray-500 text-xs">Website</span>
                            <a
                              href={viewUser.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block font-medium text-blue-600 hover:underline"
                            >
                              {viewUser.website_url}
                            </a>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-500 text-xs">Jobs Posted</span>
                          <p className="font-medium text-gray-800">{viewUser.total_applications || 0}</p>
                        </div>
                        {viewUser.organization_description && (
                          <div className="sm:col-span-2">
                            <span className="text-gray-500 text-xs">Description</span>
                            <p className="text-sm text-gray-700 mt-1">{viewUser.organization_description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              ) : null}

              <div className="px-6 py-4 border-t flex justify-end gap-3">
                {viewUser && (
                  <button
                    onClick={() => { setShowViewModal(false); handleEditUser(viewUser); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" /> Edit User
                  </button>
                )}
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`flex items-center space-x-3 px-5 py-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
            } text-white max-w-[92vw] md:max-w-md`}
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm md:text-base">
              {notification.message}
            </span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 hover:bg-white/20 rounded p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;