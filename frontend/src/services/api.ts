import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

// Request Interceptor for Auth Token
// Request Interceptor for Auth Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // Ensure headers object exists
        if (!config.headers) {
            config.headers = {} as any;
        }
        // Set the header
        // For newer axios versions, headers might be an AxiosHeaders object, but setting property usually still works due to proxy or plain object.
        // To be safe, try standard property assignment.
        (config.headers as any).Authorization = `Bearer ${token}`;
    }
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        token: token ? 'Present' : 'Missing',
        headers: config.headers
    });
    return config;
});

// Response Interceptor for 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Optional: Redirect to login or just let the UI handle the logged-out state
            // window.location.href = '/login'; 
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
    // Admin
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
