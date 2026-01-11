import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Define Types
export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    salePrice?: number;
    images: string[];
    category: { _id: string; name: string };
    stock: number;
    rating: number;
    numReviews: number;
    sizes: string[];
    colors: string[];
    isFeatured: boolean;
    isCustomizable?: boolean;
    customizationPricing?: {
        frontPrint: number;
        backPrint: number;
        bothSides?: number;
    };
}

interface ProductState {
    products: Product[];
    product: Product | null;
    loading: boolean;
    error: string | null;
    page: number;
    pages: number;
    total: number;
}

const initialState: ProductState = {
    products: [],
    product: null,
    loading: false,
    error: null,
    page: 1,
    pages: 1,
    total: 0,
};

// Async Thunks
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (params: any = {}, { rejectWithValue }) => {
        try {
            // Convert params (like pageNumber, keyword) to query string
            const response = await api.get('/products', { params });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);

export const fetchProductDetails = createAsyncThunk(
    'products/fetchProductDetails',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch product details');
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearProductDetails: (state) => {
            state.product = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Products
        builder.addCase(fetchProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload.data;
            state.page = action.payload.page;
            state.pages = action.payload.pages;
            state.total = action.payload.total;
        });
        builder.addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch Product Details
        builder.addCase(fetchProductDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchProductDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.product = action.payload.data;
        });
        builder.addCase(fetchProductDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearProductDetails } = productSlice.actions;
export default productSlice.reducer;
