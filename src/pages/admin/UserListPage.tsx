import React, { useEffect, useState, useMemo } from 'react';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import {
    FiTrash2, FiCheck, FiX, FiAlertCircle, FiEdit2, FiSave, FiUser, FiUsers,
    FiShield, FiMail, FiCalendar, FiSearch, FiFilter, FiRefreshCw, FiUserPlus
} from 'react-icons/fi';
import api from '../../utils/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Input from '../../components/Input';

const MySwal = withReactContent(Swal);

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

const UserListPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Search & Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');

    // Edit Modal State
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editRole, setEditRole] = useState('');
    const [updating, setUpdating] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/users');
            setUsers(data.data || data);
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.message || 'Failed to load users', 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter users based on search and role
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole = roleFilter === 'all' || user.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    // Calculate statistics
    const stats = useMemo(() => {
        const total = users.length;
        const admins = users.filter(u => u.role === 'admin').length;
        const regularUsers = users.filter(u => u.role === 'user').length;
        const recentUsers = users.filter(u => {
            const daysSinceJoin = (Date.now() - new Date(u.createdAt).getTime()) / (1000 * 60 * 60 * 24);
            return daysSinceJoin <= 7;
        }).length;

        return { total, admins, regularUsers, recentUsers };
    }, [users]);

    const handleDelete = async (id: string, userName: string) => {
        const result = await MySwal.fire({
            title: `Delete ${userName}?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/users/${id}`);
                setUsers(users.filter(user => user._id !== id));
                Swal.fire('Deleted!', 'User has been deleted.', 'success');
            } catch (err: any) {
                Swal.fire('Error', err.response?.data?.message || 'Failed to delete user', 'error');
            }
        }
    };

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setEditName(user.name);
        setEditEmail(user.email);
        setEditRole(user.role);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        setUpdating(true);
        try {
            const { data } = await api.put(`/users/${editingUser._id}`, {
                name: editName,
                email: editEmail,
                role: editRole
            });

            setUsers(users.map(u => u._id === editingUser._id ? (data.data || data) : u));
            setEditingUser(null);
            Swal.fire('Updated!', 'User details have been updated.', 'success');
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.message || 'Failed to update user', 'error');
        } finally {
            setUpdating(false);
        }
    };

    // Quick role toggle
    const toggleUserRole = async (user: User) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        const result = await MySwal.fire({
            title: `Change role to ${newRole.toUpperCase()}?`,
            text: `Change ${user.name}'s role to ${newRole}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, change it!',
            confirmButtonColor: newRole === 'admin' ? '#7c3aed' : '#3b82f6'
        });

        if (result.isConfirmed) {
            try {
                const { data } = await api.put(`/users/${user._id}`, {
                    ...user,
                    role: newRole
                });
                setUsers(users.map(u => u._id === user._id ? (data.data || data) : u));
                Swal.fire('Success', `Role changed to ${newRole}`, 'success');
            } catch (err: any) {
                Swal.fire('Error', err.response?.data?.message || 'Failed to update role', 'error');
            }
        }
    };

    // Generate avatar placeholder
    const getAvatar = (name: string) => {
        const initials = name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

        const colors = [
            'bg-blue-500',
            'bg-green-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-indigo-500',
            'bg-yellow-500',
        ];

        const colorIndex = name.length % colors.length;
        return { initials, color: colors[colorIndex] };
    };

    return (
        <div className="space-y-6">
            {/* Statistics Dashboard */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-black text-gray-900 mb-1">Users Management</h1>
                    <p className="text-gray-500 text-sm">Manage user accounts and permissions</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-500 text-white p-3 rounded-lg">
                                <FiUsers size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-blue-600 font-bold uppercase">Total Users</p>
                                <p className="text-3xl font-black text-blue-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-500 text-white p-3 rounded-lg">
                                <FiShield size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-purple-600 font-bold uppercase">Administrators</p>
                                <p className="text-3xl font-black text-purple-900">{stats.admins}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-500 text-white p-3 rounded-lg">
                                <FiUser size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-green-600 font-bold uppercase">Regular Users</p>
                                <p className="text-3xl font-black text-green-900">{stats.regularUsers}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-500 text-white p-3 rounded-lg">
                                <FiUserPlus size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-orange-600 font-bold uppercase">New This Week</p>
                                <p className="text-3xl font-black text-orange-900">{stats.recentUsers}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <FiFilter className="text-gray-600" size={20} />
                    <h2 className="text-lg font-black text-gray-900">Search & Filters</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2 relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-900 focus:ring-4 focus:ring-primary-100 transition-all outline-none font-medium"
                        />
                    </div>

                    {/* Role Filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-900 focus:ring-4 focus:ring-primary-100 outline-none font-bold text-gray-700"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Administrators</option>
                        <option value="user">Regular Users</option>
                    </select>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-black text-gray-900">{filteredUsers.length}</span> of <span className="font-black">{users.length}</span> users
                    </p>
                    <button
                        onClick={fetchUsers}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold text-sm transition-all"
                    >
                        <FiRefreshCw size={16} /> Refresh
                    </button>
                </div>
            </div>

            {/* Users Table */}
            {loading ? (
                <div className="bg-white rounded-2xl p-12 flex justify-center border border-gray-100">
                    <Loader size="lg" />
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                    <FiUsers className="mx-auto text-gray-300 mb-4" size={64} />
                    <p className="text-gray-500 font-medium">
                        {searchTerm || roleFilter !== 'all'
                            ? 'No users match your filters'
                            : 'No users found'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase">Joined</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-gray-700 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user) => {
                                    const avatar = getAvatar(user.name);
                                    return (
                                        <tr key={user._id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full ${avatar.color} flex items-center justify-center text-white font-black text-sm`}>
                                                        {avatar.initials}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-gray-500">ID: {user._id.slice(-6)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <a
                                                    href={`mailto:${user.email}`}
                                                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                                                >
                                                    <FiMail size={14} />
                                                    {user.email}
                                                </a>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleUserRole(user)}
                                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black border-2 transition-all transform hover:scale-105 ${user.role === 'admin'
                                                            ? 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200'
                                                            : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                                                        }`}
                                                    title="Click to toggle role"
                                                >
                                                    {user.role === 'admin' ? (
                                                        <>
                                                            <FiShield size={14} /> Administrator
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiUser size={14} /> User
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <FiCalendar size={14} />
                                                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold text-sm transition-all border-2 border-blue-200 hover:border-blue-300 hover:shadow-md transform hover:scale-105"
                                                        onClick={() => handleEditClick(user)}
                                                        title="Edit user"
                                                    >
                                                        <FiEdit2 size={16} /> Edit
                                                    </button>
                                                    <button
                                                        className={`inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold text-sm transition-all border-2 border-red-200 hover:border-red-300 hover:shadow-md transform hover:scale-105 ${user.role === 'admin' ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                        onClick={() => handleDelete(user._id, user.name)}
                                                        disabled={user.role === 'admin'}
                                                        title={user.role === 'admin' ? 'Cannot delete admin users' : 'Delete user'}
                                                    >
                                                        <FiTrash2 size={16} /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in">
                        <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-blue-200 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-500 text-white p-2 rounded-lg">
                                    <FiEdit2 size={20} />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl text-gray-900">Edit User</h3>
                                    <p className="text-xs text-gray-600">Update user information</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEditingUser(null)}
                                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white/50 rounded-lg transition-all"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateUser} className="p-6 space-y-5">
                            <Input
                                label="Full Name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                required
                                placeholder="Enter full name"
                            />
                            <Input
                                label="Email Address"
                                type="email"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                required
                                placeholder="user@example.com"
                            />

                            <div>
                                <label className="block text-sm font-black text-gray-900 mb-2">User Role</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-900 outline-none font-bold text-gray-700"
                                    value={editRole}
                                    onChange={(e) => setEditRole(e.target.value)}
                                >
                                    <option value="user">👤 Regular User</option>
                                    <option value="admin">🛡️ Administrator</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3 border-t-2 border-gray-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingUser(null)}
                                    fullWidth
                                    className="font-bold py-3"
                                >
                                    <FiX className="inline mr-2" /> Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    isLoading={updating}
                                    fullWidth
                                    className="bg-blue-600 hover:bg-blue-700 font-bold py-3"
                                >
                                    <FiSave className="inline mr-2" size={16} /> Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserListPage;
