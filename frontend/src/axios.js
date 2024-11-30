import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3000', // Backend URL
});

instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Attach token to headers
    }
    return config;
});

export default instance;
