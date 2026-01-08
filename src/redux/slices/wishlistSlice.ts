import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: any;
    stock: number;
}

interface WishlistState {
    items: Product[];
}

// Load from localStorage
const loadWishlistFromStorage = (): Product[] => {
    try {
        const wishlist = localStorage.getItem('wishlist');
        return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
        console.error('Failed to load wishlist from localStorage:', error);
        return [];
    }
};

// Save to localStorage
const saveWishlistToStorage = (items: Product[]) => {
    try {
        localStorage.setItem('wishlist', JSON.stringify(items));
    } catch (error) {
        console.error('Failed to save wishlist to localStorage:', error);
    }
};

const initialState: WishlistState = {
    items: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addToWishlist: (state, action: PayloadAction<Product>) => {
            const existingItem = state.items.find(item => item._id === action.payload._id);

            if (!existingItem) {
                state.items.push(action.payload);
                saveWishlistToStorage(state.items);
            }
        },
        removeFromWishlist: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item._id !== action.payload);
            saveWishlistToStorage(state.items);
        },
        clearWishlist: (state) => {
            state.items = [];
            saveWishlistToStorage(state.items);
        },
        // Sync with backend when user logs in (optional)
        syncWishlistWithBackend: (state, action: PayloadAction<Product[]>) => {
            state.items = action.payload;
            saveWishlistToStorage(state.items);
        }
    },
});

export const { addToWishlist, removeFromWishlist, clearWishlist, syncWishlistWithBackend } = wishlistSlice.actions;
export default wishlistSlice.reducer;
