import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://twostones-studio.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const API_BASE_URL: string = import.meta.env.VITE_BASE_URL || 'https://twostones-studio.onrender.com';

// Request Interceptor for Auth Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        if (!config.headers) {
            config.headers = {} as any;
        }
        (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor for 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export const productApi = {
    getAll: () => api.get('/products'),
    getById: (id: string) => api.get(`/products/${id}`),
};

export const authApi = {
    login: (credentials: any) => api.post('/auth/login', credentials),
    register: (userData: any) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
};

export const journalApi = {
    getEntries: () => api.get('/journal'),
    getEntry: (id: string) => api.get(`/journal/${id}`),
    saveReflection: (data: any) => api.post('/journal/reflect', data),
    getMyReflections: () => api.get('/journal/my-reflections'),
    getAllReflections: () => api.get('/journal/admin/all'),
    exportPDF: (id: string) => `${api.defaults.baseURL}/journal/admin/export/${id}`,
};

export const cartApi = {
    getCart: () => api.get('/cart'),
    addToCart: (data: any) => api.post('/cart/add', data),
    removeFromCart: (itemId: number) => api.delete(`/cart/${itemId}`),
};

export const orderApi = {
    checkout: (data: any) => api.post('/orders/checkout', data),
    getMyOrders: () => api.get('/orders/my-orders'),
};

export const adminApi = {
    getClients: () => api.get('/admin/clients'),
    updateClient: (id: string, data: any) => api.put(`/admin/clients/${id}`, data),
    deleteClient: (id: string) => api.delete(`/admin/clients/${id}`),
    getOrders: () => api.get('/admin/orders'),
    updateOrderStatus: (id: number, status: string) => api.patch(`/admin/orders/${id}/status`, { status }),
    markOrderAsPaid: (id: number) => api.put(`/admin/orders/${id}/mark-paid`),
};

export default api;
