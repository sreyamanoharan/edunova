import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://edunova-backend-kp5n.onrender.com/', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json', 
  },
});

export default axiosInstance;