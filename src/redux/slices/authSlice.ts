import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Types
export interface User {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    role: string;
    token: string;
    points?: number;
    tier?: string;
}

interface AuthState {
    userInfo: User | null;
    loading: boolean;
    error: string | null;
}

// Initial State
const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')!)
    : null;

const initialState: AuthState = {
    userInfo: userInfoFromStorage,
    loading: false,
    error: null,
};

// Async Thunks
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: any, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/login', credentials);
            const userData = {
                ...data,
                isAdmin: data.isAdmin || data.role === 'admin'
            };
            localStorage.setItem('userInfo', JSON.stringify(userData));
            return userData;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData: any, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            const userWithAdminInfo = {
                ...data,
                isAdmin: data.isAdmin || data.role === 'admin'
            };
            localStorage.setItem('userInfo', JSON.stringify(userWithAdminInfo));
            return userWithAdminInfo;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'auth/updateProfile',
    async (userData: any, { rejectWithValue }) => {
        try {
            const { data } = await api.put('/users/profile', userData);
            const updatedUserInfo = {
                ...JSON.parse(localStorage.getItem('userInfo') || '{}'),
                ...data.data
            };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            return updatedUserInfo;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.userInfo = null;
            state.error = null;
            localStorage.removeItem('userInfo');
        },
        clearError: (state) => {
            state.error = null;
        },
        googleLoginAction: (state, action: PayloadAction<any>) => {
            state.userInfo = action.payload;
            state.loading = false;
            state.error = null;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Profile
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearError, googleLoginAction } = authSlice.actions;
export default authSlice.reducer;
