import axiosInstance from './axiosInstance';

export const getServices = async () => {
  const response = await axiosInstance.get('/services');
  return response.data.data.services;
};

export const getService = async (id) => {
  const response = await axiosInstance.get(`/services/${id}`);
  return response.data.data.service;
};

export const createService = async (data) => {
  const response = await axiosInstance.post('/services', data);
  return response.data.data.service;
};

export const updateService = async ({ id, data }) => {
  const response = await axiosInstance.patch(`/services/${id}`, data);
  return response.data.data.service;
};

export const deleteService = async (id) => {
  const response = await axiosInstance.delete(`/services/${id}`);
  return response.data;
};
