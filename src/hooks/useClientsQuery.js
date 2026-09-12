import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
} from '../api/clients.api';

export const CLIENTS_QUERY_KEY = ['clients'];

export const useClients = () => {
  return useQuery({
    queryKey: CLIENTS_QUERY_KEY,
    queryFn: getClients,
  });
};

export const useClient = (id) => {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => getClient(id),
    enabled: !!id,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
      toast.success('Client added successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add client');
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateClient({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
      toast.success('Client updated successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update client');
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
      toast.success('Client deleted successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete client');
    },
  });
};
