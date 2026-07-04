import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function checkHealth() {
  const { data } = await api.get('/health');
  return data;
}

export default api;
