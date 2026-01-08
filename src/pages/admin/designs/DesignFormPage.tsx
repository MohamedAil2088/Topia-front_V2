import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FiArrowLeft, FiUpload, FiX, FiCheck, FiImage, FiEdit3, FiSave,
    FiDollarSign, FiTag, FiPlusCircle, FiPackage
} from 'react-icons/fi';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

interface DesignFormData {
    name: string;
    description: string;
    category: string;
    price: string;
    tags: string;
    isActive: boolean;
}

const DesignFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState<DesignFormData>({
        name: '',
        description: '',
        category: 'T-Shirt',
        price: '0',
        tags: '',
        isActive: true,
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [existingImage, setExistingImage] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isEditMode && id) {
            fetchDesign();
        }
    }, [id, isEditMode]);

    const fetchDesign = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/designs/${id}`);

            if (data.success) {
                const design = data.data;
                setFormData({
                    name: design.name,
                    description: design.description || '',
                    category: design.category,
                    price: design.price.toString(),
                    tags: design.tags.join(', '),
                    isActive: design.isActive,
                });
                setExistingImage(design.image);
                setImagePreview(design.image);
            }
        } catch (error: any) {
            console.error('Error fetching design:', error);
            toast.error(error.response?.data?.message || 'Failed to load design');
            navigate('/admin/designs');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setFormData(prev => ({
                ...prev,
                [name]: target.checked,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size must be less than 5MB');
                return;
            }

            setImageFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(existingImage || '');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Please enter design name');
            return;
        }

        if (!isEditMode && !imageFile) {
            toast.error('Please select an image');
            return;
        }

        if (parseFloat(formData.price) < 0) {
            toast.error('Price must be a positive number');
            return;
        }

        try {
            setSubmitting(true);

            const submitData = new FormData();
            submitData.append('name', formData.name.trim());
            submitData.append('description', formData.description.trim());
            submitData.append('category', formData.category);
            submitData.append('price', formData.price);
            submitData.append('isActive', formData.isActive.toString());
            submitData.append('tags', formData.tags.trim());

            if (imageFile) {
                submitData.append('image', imageFile);
            }

            let response;
            if (isEditMode) {
                response = await api.put(`/designs/${id}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                response = await api.post('/designs', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            if (response.data.success) {
                toast.success(isEditMode ? 'Design updated successfully' : 'Design added successfully');
                navigate('/admin/designs');
            }
        } catch (error: any) {
            console.error('Error submitting design:', error);
            toast.error(error.response?.data?.message || 'Failed to save design');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/designs')}
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all transform hover:scale-105"
                    >
                        <FiArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${isEditMode ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                            {isEditMode ? <FiEdit3 size={24} /> : <FiPlusCircle size={24} />}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">
                                {isEditMode ? 'Edit Design' : 'Add New Design'}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {isEditMode ? 'Update design information' : 'Create a new custom design'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                            <FiImage size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Design Image</h2>
                            <p className="text-sm text-gray-500">Upload a high-quality image</p>
                        </div>
                    </div>

                    {imagePreview ? (
                        <div className="relative inline-block">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full max-w-md h-auto object-cover rounded-2xl border-4 border-gray-200 shadow-lg"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-4 right-4 p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-lg transform hover:scale-110"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="border-3 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer group">
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <label htmlFor="image" className="cursor-pointer">
                                <FiUpload className="mx-auto text-gray-400 group-hover:text-purple-600 mb-4 transition-colors" size={64} />
                                <p className="text-lg font-bold text-gray-700 group-hover:text-purple-700 mb-2">Click to upload image</p>
                                <p className="text-sm text-gray-500">PNG, JPG, WEBP (Max 5MB)</p>
                            </label>
                        </div>
                    )}
                </div>

                {/* Basic Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                            <FiPackage size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Basic Information</h2>
                            <p className="text-sm text-gray-500">Design details and description</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Design Name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., Modern Design 001"
                            required
                        />

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-900 outline-none transition-all resize-none font-medium"
                                placeholder="Brief description of the design..."
                            />
                        </div>
                    </div>
                </div>

                {/* Category & Pricing */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                            <FiDollarSign size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Category & Pricing</h2>
                            <p className="text-sm text-gray-500">Set category and price</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-900 outline-none font-bold text-gray-700"
                                required
                            >
                                <option value="T-Shirt">T-Shirt</option>
                                <option value="Shirt">Shirt</option>
                                <option value="Pants">Pants</option>
                                <option value="Jacket">Jacket</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <Input
                            label="Price (EGP)"
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>

                {/* Tags & Status */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-orange-100 text-orange-600 p-3 rounded-xl">
                            <FiTag size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Tags & Status</h2>
                            <p className="text-sm text-gray-500">Additional details</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Tags (comma separated)"
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            placeholder="e.g., modern, sports, casual"
                        />

                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="w-6 h-6 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <label htmlFor="isActive" className="text-sm font-black text-gray-900 cursor-pointer">
                                Design is active and available to customers
                            </label>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            isLoading={submitting}
                            fullWidth
                            className="bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                        >
                            {submitting ? (
                                <>Saving...</>
                            ) : (
                                <>
                                    {isEditMode ? (
                                        <>
                                            <FiSave className="inline mr-2" size={20} /> Update Design
                                        </>
                                    ) : (
                                        <>
                                            <FiCheck className="inline mr-2" size={20} /> Add Design
                                        </>
                                    )}
                                </>
                            )}
                        </Button>

                        <button
                            type="button"
                            onClick={() => navigate('/admin/designs')}
                            disabled={submitting}
                            className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-black disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DesignFormPage;
