import axiosInstance from './axiosInstance';

export const getClients = async () => {
  const response = await axiosInstance.get('/clients');
  return response.data.data.clients;
};

export const getClient = async (id) => {
  const response = await axiosInstance.get(`/clients/${id}`);
  return response.data.data.client;
};

export const createClient = async (data) => {
  const response = await axiosInstance.post('/clients', data);
  return response.data.data.client;
};

export const updateClient = async ({ id, data }) => {
  const response = await axiosInstance.patch(`/clients/${id}`, data);
  return response.data.data.client;
};

export const deleteClient = async (id) => {
  const response = await axiosInstance.delete(`/clients/${id}`);
  return response.data;
};
