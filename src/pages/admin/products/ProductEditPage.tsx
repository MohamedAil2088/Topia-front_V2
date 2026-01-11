import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { fetchProductDetails } from '../../../redux/slices/productSlice';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Loader from '../../../components/Loader';
import { FiUploadCloud, FiX, FiSave, FiArrowLeft, FiPackage, FiDollarSign, FiImage, FiEdit3 } from 'react-icons/fi';
import api from '../../../utils/api';
import { getLocalizedName } from '../../../utils/getLocalizedName';

const ProductEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // State for form
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    // NEW: Sizes & Colors State
    const [sizes, setSizes] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
    const availableColors = [
        { name: 'Black', value: '#000000' },
        { name: 'White', value: '#FFFFFF' },
        { name: 'Gray', value: '#808080' },
        { name: 'Navy', value: '#001f3f' },
        { name: 'Red', value: '#FF4136' },
        { name: 'Blue', value: '#0074D9' },
        { name: 'Green', value: '#2ECC40' },
        { name: 'Yellow', value: '#FFDC00' },
        { name: 'Orange', value: '#FF851B' },
        { name: 'Purple', value: '#B10DC9' },
        { name: 'Pink', value: '#F012BE' },
        { name: 'Brown', value: '#8B4513' },
    ];

    // NEW: Discount State
    const [salePrice, setSalePrice] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');

    // NEW: Validation State
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Customization State
    const [isCustomizable, setIsCustomizable] = useState(false);
    const [frontPrintPrice, setFrontPrintPrice] = useState('50');
    const [backPrintPrice, setBackPrintPrice] = useState('50');

    const isEditMode = !!id;

    const { product, loading: loadingProduct } = useAppSelector((state) => state.products);

    useEffect(() => {
        if (isEditMode && id) {
            dispatch(fetchProductDetails(id));
        }
    }, [dispatch, id, isEditMode]);

    useEffect(() => {
        if (isEditMode && product) {
            setName(getLocalizedName(product.name));
            setPrice(product.price.toString());
            setDescription(product.description);
            const catId = typeof product.category === 'object' ? (product.category as any)._id : product.category;
            setCategory(catId || '');
            setStock(product.stock.toString());
            setImages(product.images || []);

            // NEW: Load sizes and colors
            setSizes(product.sizes || []);
            setColors(product.colors || []);

            // NEW: Load sale price if exists
            if (product.salePrice) {
                setSalePrice(product.salePrice.toString());
                const discount = ((product.price - product.salePrice) / product.price * 100).toFixed(0);
                setDiscountPercentage(discount);
            }

            setIsCustomizable(product.isCustomizable || false);
            if (product.customizationPricing) {
                setFrontPrintPrice(product.customizationPricing.frontPrint?.toString() || '50');
                setBackPrintPrice(product.customizationPricing.backPrint?.toString() || '50');
            }
        }
    }, [product, isEditMode]);

    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data.data || data);
            } catch (error) {
                console.error('Failed to fetch categories', error);
            }
        };
        fetchCategories();
    }, []);

    const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await api.post('/upload', formData, config);
            setImages((prev) => [...prev, data]);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // NEW: Helper functions for sizes and colors
    const toggleSize = (size: string) => {
        if (sizes.includes(size)) {
            setSizes(sizes.filter(s => s !== size));
        } else {
            setSizes([...sizes, size]);
        }
    };

    const toggleColor = (colorName: string) => {
        if (colors.includes(colorName)) {
            setColors(colors.filter(c => c !== colorName));
        } else {
            setColors([...colors, colorName]);
        }
    };

    // NEW: Calculate discount percentage when sale price changes
    const handleSalePriceChange = (value: string) => {
        setSalePrice(value);
        if (value && price) {
            const discount = ((Number(price) - Number(value)) / Number(price) * 100).toFixed(0);
            setDiscountPercentage(discount);
        } else {
            setDiscountPercentage('');
        }
    };

    // NEW: Calculate sale price when discount percentage changes
    const handleDiscountChange = (value: string) => {
        setDiscountPercentage(value);
        if (value && price) {
            const sale = (Number(price) * (1 - Number(value) / 100)).toFixed(2);
            setSalePrice(sale);
        } else {
            setSalePrice('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // NEW: Basic validation
        const newErrors: { [key: string]: string } = {};
        if (!name.trim()) newErrors.name = 'Product name is required';
        if (!price || Number(price) <= 0) newErrors.price = 'Valid price is required';
        if (!stock || Number(stock) < 0) newErrors.stock = 'Valid stock is required';
        if (!category) newErrors.category = 'Category is required';
        if (images.length === 0) newErrors.images = 'At least one image is required';
        if (salePrice && Number(salePrice) >= Number(price)) {
            newErrors.salePrice = 'Sale price must be less than regular price';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoadingUpdate(true);
        try {
            const productData = {
                name,
                price: Number(price),
                description,
                category,
                stock: Number(stock),
                images,
                sizes, // NEW
                colors, // NEW
                salePrice: salePrice ? Number(salePrice) : undefined, // NEW
                isCustomizable,
                customizationPricing: {
                    frontPrint: Number(frontPrintPrice),
                    backPrint: Number(backPrintPrice)
                }
            };

            if (isEditMode) {
                await api.put(`/products/${id}`, productData);
            } else {
                await api.post('/products', productData);
            }

            navigate('/admin/products');
        } catch (error) {
            console.error(error);
            alert('Failed to save product');
        } finally {
            setLoadingUpdate(false);
        }
    };

    if (isEditMode && loadingProduct) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/products')}
                            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all transform hover:scale-105"
                        >
                            <FiArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black font-display text-gray-900 flex items-center gap-3">
                                {isEditMode ? (
                                    <>
                                        <FiEdit3 className="text-blue-600" /> Edit Product
                                    </>
                                ) : (
                                    <>
                                        <FiPackage className="text-green-600" /> Create New Product
                                    </>
                                )}
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                {isEditMode ? 'Update product information' : 'Add a new product to your catalog'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                            <FiPackage size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Basic Information</h2>
                            <p className="text-sm text-gray-500">Product name, category, and description</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Product Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="e.g., Premium Cotton T-Shirt"
                        />

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-900 outline-none transition-all font-medium text-gray-900 bg-white"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {getLocalizedName(cat.name)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
                            <textarea
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-900 outline-none transition-all h-32 font-medium resize-none"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your product in detail..."
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                            <FiDollarSign size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Pricing & Inventory</h2>
                            <p className="text-sm text-gray-500">Set product price and stock quantity</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Price (EGP)"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                        />
                        <Input
                            label="Stock Quantity"
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                            placeholder="0"
                            min="0"
                        />
                    </div>
                </div>

                {/* NEW: Discount/Sale Price Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-orange-100 text-orange-600 p-3 rounded-xl">
                            <FiDollarSign size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Sales & Discounts</h2>
                            <p className="text-sm text-gray-500">Set sale price and discount percentage (optional)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Input
                                label="Sale Price (EGP)"
                                type="number"
                                value={salePrice}
                                onChange={(e) => handleSalePriceChange(e.target.value)}
                                placeholder="Leave empty for no sale"
                                min="0"
                                step="0.01"
                            />
                            {errors.salePrice && (
                                <p className="text-red-600 text-xs font-bold mt-1 flex items-center gap-1">
                                    ⚠️ {errors.salePrice}
                                </p>
                            )}
                        </div>
                        <div>
                            <Input
                                label="Discount Percentage (%)"
                                type="number"
                                value={discountPercentage}
                                onChange={(e) => handleDiscountChange(e.target.value)}
                                placeholder="0"
                                min="0"
                                max="100"
                                step="1"
                            />
                        </div>
                    </div>

                    {/* Price Preview */}
                    {salePrice && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border-2 border-orange-200">
                            <p className="text-sm font-bold text-gray-700 mb-2">Price Preview:</p>
                            <div className="flex items-center gap-4">
                                <span className="text-lg font-black line-through text-gray-400">{price} EGP</span>
                                <span className="text-2xl font-black text-orange-600">{salePrice} EGP</span>
                                {discountPercentage && (
                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black">
                                        {discountPercentage}% OFF
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* NEW: Sizes Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl">
                            <FiPackage size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Available Sizes</h2>
                            <p className="text-sm text-gray-500">Select all sizes available for this product</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {availableSizes.map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => toggleSize(size)}
                                className={`px-6 py-3 rounded-xl font-black text-sm transition-all transform hover:scale-105 border-2 ${sizes.includes(size)
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>

                    {sizes.length > 0 && (
                        <div className="mt-4 p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                            <p className="text-sm font-bold text-indigo-900">
                                Selected: <span className="text-indigo-600">{sizes.join(', ')}</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* NEW: Colors Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-pink-100 text-pink-600 p-3 rounded-xl text-2xl">
                            🎨
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Available Colors</h2>
                            <p className="text-sm text-gray-500">Select all colors available for this product</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {availableColors.map((color) => (
                            <button
                                key={color.name}
                                type="button"
                                onClick={() => toggleColor(color.name)}
                                className={`group relative p-4 rounded-xl transition-all transform hover:scale-105 border-3 ${colors.includes(color.name)
                                    ? 'border-pink-600 shadow-xl ring-4 ring-pink-100'
                                    : 'border-gray-200 hover:border-pink-300'
                                    }`}
                            >
                                <div
                                    className="w-full aspect-square rounded-lg mb-2 shadow-md"
                                    style={{ backgroundColor: color.value }}
                                />
                                <p className="text-xs font-black text-gray-700 text-center">{color.name}</p>
                                {colors.includes(color.name) && (
                                    <div className="absolute top-2 right-2 bg-pink-600 text-white rounded-full p-1 shadow-lg">
                                        <FiX size={12} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    {colors.length > 0 && (
                        <div className="mt-4 p-3 bg-pink-50 rounded-xl border border-pink-200">
                            <p className="text-sm font-bold text-pink-900">
                                Selected Colors: <span className="text-pink-600">{colors.join(', ')}</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Product Images */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
                            <FiImage size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Product Images</h2>
                            <p className="text-sm text-gray-500">Upload high-quality images (recommended: 800x1000px)</p>
                        </div>
                    </div>

                    {/* File Upload Section */}
                    <div className="mb-6">
                        <label className="flex flex-col items-center justify-center w-full h-48 px-4 transition bg-gray-50 border-3 border-gray-300 border-dashed rounded-2xl appearance-none cursor-pointer hover:border-primary-500 hover:bg-primary-50 focus:outline-none group">
                            <div className="flex flex-col items-center justify-center text-center">
                                <FiUploadCloud className="w-16 h-16 text-gray-400 group-hover:text-primary-600 transition-colors mb-3" />
                                <span className="font-bold text-gray-700 group-hover:text-primary-900 transition-colors">
                                    {uploading ? 'Uploading...' : 'Drop files here or click to browse'}
                                </span>
                                <span className="text-xs text-gray-500 mt-2">
                                    PNG, JPG or WEBP (MAX. 5MB)
                                </span>
                            </div>
                            <input
                                type="file"
                                name="image"
                                className="hidden"
                                onChange={uploadFileHandler}
                                disabled={uploading}
                                accept="image/*"
                            />
                        </label>
                    </div>

                    {/* Images Preview Grid */}
                    {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden border-3 border-gray-200 group hover:border-primary-500 transition-all shadow-sm hover:shadow-lg"
                                >
                                    <img
                                        src={img}
                                        alt={`Product ${idx + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 hover:bg-red-600 shadow-lg"
                                        title="Remove image"
                                    >
                                        <FiX size={16} />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-xs font-bold">Image {idx + 1}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Customization Options */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <input
                            type="checkbox"
                            id="isCustomizable"
                            className="w-6 h-6 text-primary-600 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-primary-100 transition-all cursor-pointer"
                            checked={isCustomizable}
                            onChange={(e) => setIsCustomizable(e.target.checked)}
                        />
                        <label htmlFor="isCustomizable" className="text-base font-black text-gray-900 cursor-pointer select-none">
                            🎨 Enable Custom Design Options (Allow customers to upload their designs)
                        </label>
                    </div>

                    {isCustomizable && (
                        <div className="mt-6 bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl border-2 border-purple-200">
                            <p className="text-sm font-bold text-gray-700 mb-4">Customization Pricing (Extra charges)</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Front Print Price (EGP)"
                                    type="number"
                                    value={frontPrintPrice}
                                    onChange={(e) => setFrontPrintPrice(e.target.value)}
                                    min="0"
                                    placeholder="50"
                                />
                                <Input
                                    label="Back Print Price (EGP)"
                                    type="number"
                                    value={backPrintPrice}
                                    onChange={(e) => setBackPrintPrice(e.target.value)}
                                    min="0"
                                    placeholder="50"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-end gap-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => navigate('/admin/products')}
                            className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl font-bold transition-all"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={loadingUpdate}
                            className="px-8 py-3 bg-primary-900 hover:bg-black text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
                        >
                            <FiSave size={20} />
                            {isEditMode ? 'Update Product' : 'Create Product'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductEditPage;
