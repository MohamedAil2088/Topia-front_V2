import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/api';

interface CustomOrder {
    _id: string;
    user: any;
    product: any;
    quantity: number;
    size: string;
    color: string;
    customization: {
        designImages: any[];
        printLocation: string;
        printSize: string;
        specialInstructions?: string;
        designNotes?: string;
    };
    pricing: {
        basePrice: number;
        printPrice: number;
        totalPrice: number;
    };
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface CustomOrdersState {
    orders: CustomOrder[];
    currentOrder: CustomOrder | null;
    loading: boolean;
    error: string | null;
}

const initialState: CustomOrdersState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
};

// Create custom order
export const createCustomOrder = createAsyncThunk(
    'customOrders/create',
    async (orderData: any, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/custom-orders', orderData);
            return data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create custom order');
        }
    }
);

// Fetch my custom orders
export const fetchMyCustomOrders = createAsyncThunk(
    'customOrders/fetchMy',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/custom-orders/my-orders');
            return data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

// Fetch single order
export const fetchCustomOrderById = createAsyncThunk(
    'customOrders/fetchById',
    async (orderId: string, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/custom-orders/${orderId}`);
            return data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
        }
    }
);

// Cancel order
export const cancelCustomOrder = createAsyncThunk(
    'customOrders/cancel',
    async ({ orderId, reason }: { orderId: string; reason?: string }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/custom-orders/${orderId}/cancel`, { reason });
            return data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
        }
    }
);

const customOrdersSlice = createSlice({
    name: 'customOrders',
    initialState,
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Order
            .addCase(createCustomOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCustomOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders.unshift(action.payload);
                state.currentOrder = action.payload;
            })
            .addCase(createCustomOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch My Orders
            .addCase(fetchMyCustomOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyCustomOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchMyCustomOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch Order By ID
            .addCase(fetchCustomOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(fetchCustomOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Cancel Order
            .addCase(cancelCustomOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelCustomOrder.fulfilled, (state, action) => {
                state.loading = false;
                // Update order in list
                const index = state.orders.findIndex(o => o._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
                if (state.currentOrder?._id === action.payload._id) {
                    state.currentOrder = action.payload;
                }
            })
            .addCase(cancelCustomOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCurrentOrder, clearError } = customOrdersSlice.actions;
export default customOrdersSlice.reducer;
