import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from '../api/testimonials.api';

export const TESTIMONIALS_QUERY_KEY = ['testimonials'];

export const useTestimonials = () => {
  return useQuery({
    queryKey: TESTIMONIALS_QUERY_KEY,
    queryFn: getTestimonials,
  });
};

export const useTestimonial = (id) => {
  return useQuery({
    queryKey: ['testimonials', id],
    queryFn: () => getTestimonial(id),
    enabled: !!id,
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, isFormData }) => createTestimonial(data, isFormData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TESTIMONIALS_QUERY_KEY });
      toast.success('Testimonial added successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add testimonial');
    },
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, isFormData }) => updateTestimonial({ id, data, isFormData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TESTIMONIALS_QUERY_KEY });
      toast.success('Testimonial updated successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update testimonial');
    },
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TESTIMONIALS_QUERY_KEY });
      toast.success('Testimonial deleted successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete testimonial');
    },
  });
};
