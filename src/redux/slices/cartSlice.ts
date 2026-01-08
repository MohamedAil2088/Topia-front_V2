import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface CustomizationDetails {
    designSource: 'upload' | 'template';
    designImages?: string[];
    selectedDesign?: {
        _id: string;
        name: string;
        image: string;
        price: number;
    };
    printLocation: string;
    printSize: string;
    specialInstructions?: string;
    designNotes?: string;
}

interface CartItem {
    _id: string;
    name: string;
    image: string;
    price: number;
    qty: number;
    stock: number;
    size?: string;
    color?: string;
    isCustomOrder?: boolean;
    customization?: CustomizationDetails;
}

interface CartState {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}

const getInitialState = (): CartState => {
    const items = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')!) : [];
    const totalItems = items.reduce((total: number, item: any) => total + item.qty, 0);
    const totalPrice = items.reduce((total: number, item: any) => total + item.price * item.qty, 0);

    return {
        items,
        totalItems,
        totalPrice,
    };
};

const initialState: CartState = getInitialState();

// Calculate totals
const calculateTotals = (state: CartState) => {
    state.totalItems = state.items.reduce((total, item) => total + item.qty, 0);
    state.totalPrice = state.items.reduce((total, item) => total + item.price * item.qty, 0);
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(
                (item) =>
                    item._id === action.payload._id &&
                    item.size === action.payload.size &&
                    item.color === action.payload.color &&
                    // For custom orders, treat them as unique unless we implement deep comparison
                    // Here we simply check if existing is NOT custom if payload IS NOT custom
                    // If either is custom, we don't merge (safest approach)
                    item.isCustomOrder === action.payload.isCustomOrder &&
                    !item.isCustomOrder // Only merge non-custom items
            );

            if (existingItem) {
                existingItem.qty += action.payload.qty;
            } else {
                state.items.push(action.payload);
            }

            calculateTotals(state);
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        removeFromCart: (state, action: PayloadAction<{ _id: string; size?: string; color?: string }>) => {
            state.items = state.items.filter(
                (item) => !(
                    item._id === action.payload._id &&
                    item.size === action.payload.size &&
                    item.color === action.payload.color
                )
            );
            calculateTotals(state);
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        updateQuantity: (state, action: PayloadAction<{ _id: string; qty: number; size?: string; color?: string }>) => {
            const item = state.items.find(
                (item) =>
                    item._id === action.payload._id &&
                    item.size === action.payload.size &&
                    item.color === action.payload.color
            );

            if (item) {
                item.qty = action.payload.qty;
            }

            calculateTotals(state);
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        clearCart: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalPrice = 0;
            localStorage.removeItem('cart');
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
