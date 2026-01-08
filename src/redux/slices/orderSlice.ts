import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

interface OrderState {
    orders: any[];
    order: any | null;
    loading: boolean;
    error: string | null;
    success: boolean;
    page: number;
    pages: number;
    total: number;
}

const initialState: OrderState = {
    orders: [],
    order: null,
    loading: false,
    error: null,
    success: false,
    page: 1,
    pages: 1,
    total: 0,
};

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (order: any, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/orders', order);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const getMyOrders = createAsyncThunk(
    'orders/getMyOrders',
    async (pageNumber: number | string = 1, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/orders/myorders?pageNumber=${pageNumber}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        resetOrder: (state) => {
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.order = action.payload.data;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getMyOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.data;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
                state.total = action.payload.total;
            })
            .addCase(getMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
