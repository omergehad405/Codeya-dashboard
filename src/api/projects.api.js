import axiosInstance from './axiosInstance';

export const getProjects = async () => {
  const response = await axiosInstance.get('/projects');
  return response.data.data.projects;
};

export const getProject = async (id) => {
  const response = await axiosInstance.get(`/projects/${id}`);
  return response.data.data.project;
};

export const createProject = async (data, isFormData = false) => {
  const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const response = await axiosInstance.post('/projects', data, config);
  return response.data.data.project;
};

export const updateProject = async ({ id, data, isFormData = false }) => {
  const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const response = await axiosInstance.patch(`/projects/${id}`, data, config);
  return response.data.data.project;
};

export const deleteProject = async (id) => {
  const response = await axiosInstance.delete(`/projects/${id}`);
  return response.data;
};
