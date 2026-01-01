import api from './api';
import { useAuthStore } from '@/store/authStore';

export const UserService = {
    getProfile: async () => {
        const response = await api.get('/api/user/profile');
        return response.data;
    },

    updateProfile: async (data: any) => {
        const response = await api.put('/api/user/profile', data);
        return response.data;
    },

    initiateChangePassword: async (currentPassword: string) => {
        const response = await api.post('/api/user/change-password/init', { currentPassword });
        return response.data;
    },

    verifyChangePasswordOTP: async (data: any) => {
        const response = await api.post('/api/user/change-password/verify', data);
        return response.data;
    },

    deleteAccount: async () => {
        const response = await api.delete('/api/user/delete-account');
        return response.data;
    }
};
