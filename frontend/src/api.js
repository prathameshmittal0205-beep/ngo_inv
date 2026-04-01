import axios from 'axios';

// --- USE ENVIRONMENT VARIABLE FOR PRODUCTION, FALLBACK TO LOCALHOST ---
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

// --- INTERCEPTOR: ATTACH TOKEN AUTOMATICALLY ---
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- AUTH ENDPOINTS ---
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// --- DONOR & DONATION ---
export const getDonors = () => API.get('/donors');
export const addDonor = (data) => API.post('/donors', data);
export const getDonations = () => API.get('/donations');
export const addDonation = (data) => API.post('/donations', data);
export const deleteDonation = (id) => API.delete(`/donations/${id}`);

// --- RESOURCE & INVENTORY ---
export const getResources = () => API.get('/resources');
export const addResource = (data) => API.post('/resources', data);
export const updateResource = (id, data) => API.patch(`/resources/${id}`, data);
export const deleteResource = (id) => API.delete(`/resources/${id}`);

// --- REQUEST & FULFILLMENT ---
export const getRequests = () => API.get('/requests');
export const addRequest = (data) => API.post('/requests', data);
export const updateRequest = (id, data) => API.patch(`/requests/${id}/fulfill`, data);

// --- ANALYTICS & TOP DONORS ---
export const getStats = () => API.get('/stats');
export const getDistribution = () => API.get('/distribution');
export const getTopDonors = () => API.get('/stats/top-donors'); 

export default API;