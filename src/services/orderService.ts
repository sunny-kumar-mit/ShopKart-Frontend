import api from './api';
import { Order } from '@/types/order';

export const OrderService = {
    getMyOrders: async (): Promise<Order[]> => {
        const response = await api.get('/api/orders');
        return response.data;
    },

    getOrderById: async (id: string): Promise<Order> => {
        const response = await api.get(`/api/orders/${id}`);
        return response.data;
    },

    cancelOrder: async (id: string): Promise<Order> => {
        const response = await api.patch(`/api/orders/${id}/cancel`);
        return response.data;
    },

    returnOrder: async (id: string): Promise<Order> => {
        const response = await api.patch(`/api/orders/${id}/return`);
        return response.data;
    },

    // Mock order creation for testing
    createMockOrder: async (orderData: any): Promise<Order> => {
        const response = await api.post('/api/orders/mock', orderData);
        return response.data;
    }
};
