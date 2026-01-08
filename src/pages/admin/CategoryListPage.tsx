import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Import i18n
import Button from '../../components/Button';
import Input from '../../components/Input';
import Loader from '../../components/Loader';
import { FiTrash2, FiAlertCircle, FiTag, FiEdit3, FiPlus, FiPackage, FiLayers, FiImage, FiUpload } from 'react-icons/fi';
import api from '../../utils/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
}

const CategoryListPage = () => {
    const { i18n } = useTranslation(); // Use hook
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');

    // Helper to get translated name safely
    const getName = (name: any) => {
        if (!name) return 'Category';
        if (typeof name === 'string') return name;
        return name[i18n.language] || name.en || Object.values(name)[0] || 'Category';
    };
    const [newImage, setNewImage] = useState<File | null>(null);
    const [newImagePreview, setNewImagePreview] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // NEW: Edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editImage, setEditImage] = useState<File | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string>('');

    const fetchCategories = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.get('/categories');
            setCategories(data.data || data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load categories');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        setSubmitting(true);
        try {
            let imageUrl = '';

            // Upload image first if selected
            if (newImage) {
                const formData = new FormData();
                formData.append('image', newImage);

                const { data: uploadData } = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = uploadData.url || uploadData.imagePath;
            }

            const { data } = await api.post('/categories', {
                name: newName.trim(),
                description: newDescription.trim() || undefined,
                image: imageUrl || undefined
            });

            setCategories([...categories, data.data || data]);
            setNewName('');
            setNewDescription('');
            setNewImage(null);
            setNewImagePreview('');

            Swal.fire({
                icon: 'success',
                title: 'Category Added!',
                text: 'The category has been successfully created.',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.message || 'Failed to add category', 'error');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    // NEW: Edit handler
    const startEdit = (category: Category) => {
        setEditingId(category._id);
        setEditName(getName(category.name));
        setEditDescription(category.description || '');
        setEditImagePreview(category.image || '');
    };

    const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = async (id: string) => {
        if (!editName.trim()) return;

        try {
            let imageUrl = editImagePreview;

            // Upload new image if selected
            if (editImage) {
                const formData = new FormData();
                formData.append('image', editImage);

                const { data: uploadData } = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = uploadData.url || uploadData.imagePath;
            }

            const { data } = await api.put(`/categories/${id}`, {
                name: editName.trim(),
                description: editDescription.trim() || undefined,
                image: imageUrl || undefined
            });

            setCategories(categories.map(c => c._id === id ? (data.data || data) : c));
            setEditingId(null);
            setEditName('');
            setEditDescription('');
            setEditImage(null);
            setEditImagePreview('');

            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Category has been updated successfully.',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.message || 'Failed to update category', 'error');
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName('');
        setEditDescription('');
        setEditImage(null);
        setEditImagePreview('');
    };

    const handleDelete = async (id: string, name: any) => {
        const displayName = getName(name);
        const result = await MySwal.fire({
            title: `Delete "${displayName}"?`,
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            setDeletingId(id);
            try {
                await api.delete(`/categories/${id}`);
                setCategories(categories.filter(c => c._id !== id));
                Swal.fire('Deleted!', 'Category has been deleted.', 'success');
            } catch (err: any) {
                Swal.fire('Error', err.response?.data?.message || 'Failed to delete category', 'error');
                console.error(err);
            } finally {
                setDeletingId(null);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-black font-display text-gray-900 mb-1">Categories Management</h1>
                        <p className="text-gray-500 text-sm">Organize your products into categories</p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-500 text-white p-3 rounded-lg">
                                <FiLayers size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">Total Categories</p>
                                <p className="text-2xl font-black text-blue-900">{categories.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-500 text-white p-3 rounded-lg">
                                <FiTag size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-green-600 font-bold uppercase tracking-wide">Active</p>
                                <p className="text-2xl font-black text-green-900">{categories.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-500 text-white p-3 rounded-lg">
                                <FiPackage size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-purple-600 font-bold uppercase tracking-wide">With Description</p>
                                <p className="text-2xl font-black text-purple-900">
                                    {categories.filter(c => c.description).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Add Category Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                                <FiPlus size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Add Category</h2>
                                <p className="text-xs text-gray-500">Create a new category</p>
                            </div>
                        </div>

                        <form onSubmit={handleAdd} className="space-y-4">
                            <Input
                                label="Category Name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="e.g. Shoes, Shirts, Pants"
                                required
                                disabled={submitting}
                            />
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-900 outline-none transition-all h-24 resize-none font-medium"
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    placeholder="Brief description..."
                                    disabled={submitting}
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                    <FiImage className="inline mr-2" /> Category Image (Optional)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-primary-500 transition-colors">
                                    {newImagePreview ? (
                                        <div className="relative">
                                            <img src={newImagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg mb-2" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setNewImage(null);
                                                    setNewImagePreview('');
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <FiUpload className="mx-auto text-gray-400 mb-2" size={32} />
                                            <p className="text-sm text-gray-600 mb-2">Click to upload category image</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageSelect}
                                                className="hidden"
                                                id="category-image-upload"
                                                disabled={submitting}
                                            />
                                            <label
                                                htmlFor="category-image-upload"
                                                className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                                            >
                                                Choose Image
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                isLoading={submitting}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                            >
                                <FiPlus className="inline mr-2" /> Add Category
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Categories List */}
                <div className="lg:col-span-2">
                    {loading ? (
                        <div className="bg-white rounded-2xl p-12 flex justify-center border border-gray-100">
                            <Loader size="lg" />
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-start gap-3">
                            <FiAlertCircle className="text-red-500 mt-0.5" size={20} />
                            <div>
                                <h3 className="font-semibold text-red-900 mb-1">Error Loading Categories</h3>
                                <p className="text-red-700 text-sm">{error}</p>
                                <Button onClick={fetchCategories} variant="outline" className="mt-3">
                                    Retry
                                </Button>
                            </div>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                            <FiTag className="mx-auto text-gray-300 mb-4" size={64} />
                            <p className="text-gray-500 font-medium">No categories yet. Add your first category!</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Slug</th>
                                            <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-4 text-right text-xs font-black text-gray-700 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {categories.map((cat) => (
                                            <tr key={cat._id} className="hover:bg-gray-50 transition-colors group">
                                                {editingId === cat._id ? (
                                                    // Edit Mode
                                                    <>
                                                        <td className="px-6 py-4" colSpan={3}>
                                                            <div className="space-y-3">
                                                                <input
                                                                    type="text"
                                                                    value={editName}
                                                                    onChange={(e) => setEditName(e.target.value)}
                                                                    className="w-full px-4 py-2 rounded-xl border-2 border-blue-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-bold"
                                                                    placeholder="Category name"
                                                                />
                                                                <textarea
                                                                    value={editDescription}
                                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                                    className="w-full px-4 py-2 rounded-xl border-2 border-blue-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none h-20"
                                                                    placeholder="Description (optional)"
                                                                />

                                                                {/* Edit Image Upload */}
                                                                <div className="border-2 border-dashed border-blue-300 rounded-xl p-3">
                                                                    {editImagePreview ? (
                                                                        <div className="relative">
                                                                            <img src={editImagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg mb-2" />
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    setEditImage(null);
                                                                                    setEditImagePreview('');
                                                                                }}
                                                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                                                                            >
                                                                                <FiTrash2 size={14} />
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-center">
                                                                            <FiUpload className="mx-auto text-blue-400 mb-1" size={24} />
                                                                            <input
                                                                                type="file"
                                                                                accept="image/*"
                                                                                onChange={handleEditImageSelect}
                                                                                className="hidden"
                                                                                id={`edit-category-image-${cat._id}`}
                                                                            />
                                                                            <label
                                                                                htmlFor={`edit-category-image-${cat._id}`}
                                                                                className="inline-block px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors text-sm font-bold"
                                                                            >
                                                                                Choose New Image
                                                                            </label>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => handleEdit(cat._id)}
                                                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    onClick={cancelEdit}
                                                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-300 transition-all"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                ) : (
                                                    // View Mode
                                                    <>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                                                    <FiTag size={18} />
                                                                </div>
                                                                <span className="font-black text-gray-900">{getName(cat.name)}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <code className="bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 border border-gray-200">
                                                                {cat.slug}
                                                            </code>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                                                            {cat.description || <span className="text-gray-400 italic">No description</span>}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => startEdit(cat)}
                                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all font-bold text-sm border-2 border-blue-200 hover:border-blue-300 hover:shadow-md transform hover:scale-105"
                                                                    title="Edit"
                                                                >
                                                                    <FiEdit3 size={16} /> Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(cat._id, cat.name)}
                                                                    disabled={deletingId === cat._id}
                                                                    className={`inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all font-bold text-sm border-2 border-red-200 hover:border-red-300 hover:shadow-md transform hover:scale-105 ${deletingId === cat._id ? 'opacity-50 cursor-not-allowed' : ''
                                                                        }`}
                                                                    title="Delete"
                                                                >
                                                                    {deletingId === cat._id ? <Loader size="sm" /> : <><FiTrash2 size={16} /> Delete</>}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryListPage;
