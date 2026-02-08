import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const getBackendUrl = () => {
    return API_BASE_URL.replace('/api', '');
};

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

export const candidateService = {
    getAllCandidates: async (filters = {}) => {
        try {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.search) params.append('search', filters.search);
            const response = await api.get('/candidates?' + params.toString());
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch candidates' };
        }
    },

    createCandidate: async (candidateData) => {
        try {
            const formData = new FormData();
            formData.append('name', candidateData.name);
            formData.append('email', candidateData.email);
            formData.append('phone', candidateData.phone);
            formData.append('jobTitle', candidateData.jobTitle);
            if (candidateData.resume) {
                formData.append('resume', candidateData.resume);
            }
            const response = await api.post('/candidates', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to create candidate' };
        }
    },

    updateStatus: async (candidateId, status) => {
        try {
            const response = await api.put('/candidates/' + candidateId + '/status', { status });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update status' };
        }
    },

    deleteCandidate: async (candidateId) => {
        try {
            const response = await api.delete('/candidates/' + candidateId);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to delete candidate' };
        }
    }
};

export default api;
