import React, { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, 
  Search, 
  Edit2, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  UserPlus,
  Award,
  Activity,
  Mail,
  Phone
} from 'lucide-react';
import { apiService } from '../services/apiService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'view', 'edit', 'delete'
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });
  const [filters, setFilters] = useState({
    search: '',
    userType: 'all'
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllUsers(
        pagination.currentPage,
        pagination.limit,
        filters.search
      );
      
      if (response && response.success) {
        setUsers(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value });
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handleView = async (userId) => {
    try {
      const response = await apiService.getUserById(userId);
      if (response && response.success) {
        setSelectedUser(response.data);
        setModalType('view');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalType('edit');
    setShowModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setModalType('delete');
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await apiService.deleteUser(selectedUser.id);
      setShowModal(false);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSaveEdit = async (userData) => {
    try {
      await apiService.updateUser(selectedUser.id, userData);
      setShowModal(false);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const UserModal = () => {
    const [editData, setEditData] = useState({
      name: selectedUser?.name || '',
      email: selectedUser?.email || '',
      phone: selectedUser?.phone || '',
      user_type: selectedUser?.user_type || 'student',
      language: selectedUser?.language || 'en'
    });

    if (!showModal || !selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {modalType === 'view' ? 'User Details' : 
               modalType === 'edit' ? 'Edit User' : 'Delete User'}
            </h3>
            <button 
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {modalType === 'delete' ? (
            <div>
              <p className="mb-4">Are you sure you want to delete user "{selectedUser.name}"?</p>
              <p className="text-red-600 text-sm mb-4">This action cannot be undone and will delete all associated data.</p>
              <div className="flex gap-2">
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  {modalType === 'view' ? (
                    <p className="text-gray-900">{selectedUser.name}</p>
                  ) : (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  {modalType === 'view' ? (
                    <p className="text-gray-900">{selectedUser.email}</p>
                  ) : (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  {modalType === 'view' ? (
                    <p className="text-gray-900">{selectedUser.phone || 'N/A'}</p>
                  ) : (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="w-full p-2 border rounded"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">User Type</label>
                  {modalType === 'view' ? (
                    <p className="text-gray-900 capitalize">{selectedUser.user_type}</p>
                  ) : (
                    <select
                      value={editData.user_type}
                      onChange={(e) => setEditData({...editData, user_type: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="student">Student</option>
                      <option value="salaried">Salaried</option>
                      <option value="business">Business</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Language</label>
                  {modalType === 'view' ? (
                    <p className="text-gray-900 uppercase">{selectedUser.language}</p>
                  ) : (
                    <select
                      value={editData.language}
                      onChange={(e) => setEditData({...editData, language: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="pa">Punjabi</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Total Points</label>
                  <p className="text-gray-900">{selectedUser.total_points || 0}</p>
                </div>
              </div>

              {modalType === 'view' && selectedUser.quiz_results && (
                <div>
                  <h4 className="font-medium mb-2">Recent Quiz Results</h4>
                  <div className="max-h-40 overflow-y-auto">
                    {selectedUser.quiz_results.slice(0, 5).map((quiz, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded mb-1">
                        <span className="text-sm">{quiz.quiz_topic}</span>
                        <span className="text-sm font-medium">{quiz.score}/{quiz.total_questions}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modalType === 'edit' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(editData)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Manage and monitor user accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={filters.search}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quiz Attempts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <UsersIcon className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                      {user.user_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.total_points || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.quiz_attempts}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(user.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-green-600 hover:text-green-900"
                        title="Edit User"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagination({...pagination, currentPage: pagination.currentPage - 1})}
                disabled={pagination.currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination({...pagination, currentPage: pagination.currentPage + 1})}
                disabled={pagination.currentPage === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((pagination.currentPage - 1) * pagination.limit) + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)}</span> of{' '}
                  <span className="font-medium">{pagination.totalItems}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPagination({...pagination, currentPage: pagination.currentPage - 1})}
                    disabled={pagination.currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPagination({...pagination, currentPage: pagination.currentPage + 1})}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      <UserModal />
    </div>
  );
};

export default Users;