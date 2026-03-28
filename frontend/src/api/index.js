import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('snag_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Handle 401 globally
API.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('snag_token');
            localStorage.removeItem('snag_user');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

// ── Auth ──────────────────────────────────────────────────────
// export const authAPI = {
//     login: (data) => API.post('/auth/login', data),
//     register: (data) => API.post('/auth/register', data),
//     getProfile: () => API.get('/auth/profile'),
//     getContractors: () => API.get('/auth/contractors'),
//     sendOTP: (phone, email) => API.post('/auth/send-otp', { phone, email }),
//     verifyOTP: (phone, otp) => API.post('/auth/verify-otp', { phone, otp }),
//     updateProfile: (data) => API.post('/auth/update-profile', data),
// };

export const authAPI = {
    login: (data) => API.post('/api/auth/login', data),
    register: (data) => API.post('/api/auth/register', data),
    getProfile: () => API.get('/api/auth/profile'),
    getContractors: () => API.get('/api/auth/contractors'),
    sendOTP: (phone, email) => API.post('/api/auth/send-otp', { phone, email }),
    verifyOTP: (phone, otp) => API.post('/api/auth/verify-otp', { phone, otp }),
    updateProfile: (data) => API.post('/api/auth/update-profile', data),
};
// ── Projects ──────────────────────────────────────────────────
export const projectAPI = {
    getAll: () => API.get('/api/projects'),
    getById: (id) => API.get(`/api/projects/${id}`),
    create: (data) => API.post('/api/projects', data),
    update: (id, data) => API.put(`/api/projects/${id}`, data),
};

// ── Snags ─────────────────────────────────────────────────────
export const snagAPI = {
    getAll: (params) => API.get('/api/snags', { params }),
    getById: (id) => API.get(`/api/snags/${id}`),
    getStats: () => API.get('/api/snags/stats'),
    create: (formData) => API.post('/api/snags', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    update: (id, data) => API.put(`/api/snags/${id}`, data),
    delete: (id) => API.delete(`/api/snags/${id}`),
    sendReport: (id, data) => API.post(`/api/snags/${id}/send-report`, data),
    getPreviewReport: (id) => API.get(`/api/snags/${id}/preview-report`),
    getMailLogs: () => API.get('/api/snags/mail-logs'),
    updateStatus: (id, data) => API.patch(`/api/snags/${id}/status`, data),
};

export default API;
