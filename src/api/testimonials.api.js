import axiosInstance from './axiosInstance';

export const getTestimonials = async () => {
  const response = await axiosInstance.get('/testimonials');
  return response.data.data.testimonials;
};

export const getTestimonial = async (id) => {
  const response = await axiosInstance.get(`/testimonials/${id}`);
  return response.data.data.testimonial;
};

export const createTestimonial = async (data, isFormData = false) => {
  const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const response = await axiosInstance.post('/testimonials', data, config);
  return response.data.data.testimonial;
};

export const updateTestimonial = async ({ id, data, isFormData = false }) => {
  const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const response = await axiosInstance.patch(`/testimonials/${id}`, data, config);
  return response.data.data.testimonial;
};

export const deleteTestimonial = async (id) => {
  const response = await axiosInstance.delete(`/testimonials/${id}`);
  return response.data;
};
