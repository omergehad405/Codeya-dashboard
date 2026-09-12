import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
} from '../api/services.api';

export const SERVICES_QUERY_KEY = ['services'];

export const useServices = () => {
  return useQuery({
    queryKey: SERVICES_QUERY_KEY,
    queryFn: getServices,
  });
};

export const useService = (id) => {
  return useQuery({
    queryKey: ['services', id],
    queryFn: () => getService(id),
    enabled: !!id,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY });
      toast.success('Service added successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add service');
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateService({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY });
      toast.success('Service updated successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update service');
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICES_QUERY_KEY });
      toast.success('Service deleted successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete service');
    },
  });
};
