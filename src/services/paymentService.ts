import api from './api';
import { useAuthStore } from '@/store/authStore';

export const PaymentService = {
    // 1. Create Order on Razorpay
    createOrder: async (amount: number) => {
        const response = await api.post('/api/payment/create-order', { amount });
        return response.data;
    },

    // 2. Verify Payment & Save Order
    verifyPayment: async (paymentData: any) => {
        const response = await api.post('/api/payment/verify', paymentData);
        return response.data;
    },

    // Helper to load Razorpay Script
    loadRazorpayScript: () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }
};
