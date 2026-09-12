import axiosInstance from './axiosInstance';

export const getNotifications = async () => {
  const response = await axiosInstance.get('/notifications');
  return response.data.data.notifications;
};

export const markNotificationRead = async (id) => {
  const response = await axiosInstance.patch(`/notifications/${id}`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await axiosInstance.patch('/notifications/mark-all-read');
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await axiosInstance.delete(`/notifications/${id}`);
  return response.data;
};
