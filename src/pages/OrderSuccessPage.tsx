import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { FiCheckCircle } from 'react-icons/fi';

const OrderSuccessPage = () => {
    return (
        <div className="container mx-auto px-4 py-32 text-center">
            <div className="flex flex-col items-center max-w-lg mx-auto">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-bounce">
                    <FiCheckCircle size={48} />
                </div>
                <h1 className="text-4xl font-bold font-display text-gray-900 mb-4">Order Placed Successfully!</h1>
                <p className="text-gray-600 mb-8 text-lg">
                    Thank you for your purchase. Your order has been received and is being processed.
                    You will receive an email confirmation shortly.
                </p>
                <div className="flex gap-4">
                    <Button to="/shop" size="lg">Continue Shopping</Button>
                    {/* <Button to="/profile" variant="outline" size="lg">View Order</Button> */}
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
