import axiosInstance from './axiosInstance';

export const getInvoices = async () => {
  const response = await axiosInstance.get('/invoices');
  return response.data.data.invoices;
};

export const getInvoice = async (id) => {
  const response = await axiosInstance.get(`/invoices/${id}`);
  return response.data.data.invoice;
};

export const createInvoice = async (data) => {
  const response = await axiosInstance.post('/invoices', data);
  return response.data.data.invoice;
};

export const deleteInvoice = async (id) => {
  const response = await axiosInstance.delete(`/invoices/${id}`);
  return response.data;
};
