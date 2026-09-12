import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  getInvoices,
  getInvoice,
  createInvoice,
  deleteInvoice
} from '../api/invoices.api';

export const INVOICES_QUERY_KEY = ['invoices'];

export const useInvoices = () => {
  return useQuery({
    queryKey: INVOICES_QUERY_KEY,
    queryFn: getInvoices,
  });
};

export const useInvoice = (id) => {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: () => getInvoice(id),
    enabled: !!id,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
      toast.success('Billing added successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add billing');
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
      toast.success('Billing deleted successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete billing');
    },
  });
};
