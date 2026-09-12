import { useMemo } from 'react';
import { useProjects } from './useProjectsQuery';
import { useClients } from './useClientsQuery';
import { useServices } from './useServicesQuery';
import { useNotifications } from './useNotificationsQuery';

export const useDashboardStats = () => {
  const { data: projects = [], isLoading: isProjectsLoading } = useProjects();
  const { data: clients = [], isLoading: isClientsLoading } = useClients();
  const { data: services = [], isLoading: isServicesLoading } = useServices();
  const { data: notifications = [], isLoading: isNotificationsLoading } = useNotifications();

  const stats = useMemo(() => {
    const totalRevenue = projects.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
    const activeProjects = projects.filter(p => ['active', 'in progress'].includes(p.status?.toLowerCase())).length;
    const completedProjects = projects.filter(p => p.status?.toLowerCase() === 'completed').length;
    const successRate = projects.length > 0 ? (completedProjects / projects.length) * 100 : 0;
    const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

    return {
      totalRevenue: `$${totalRevenue.toLocaleString()}`,
      activeProjectsCount: activeProjects,
      totalClientsCount: clients.length,
      totalServicesCount: services.length,
      successRate: `${successRate.toFixed(1)}%`,
      projectsLoaded: projects.length,
      unreadNotificationsCount,
    };
  }, [projects, clients, notifications, services]);

  const isLoading = isProjectsLoading || isClientsLoading || isServicesLoading || isNotificationsLoading;

  return {
    stats,
    projects,
    clients,
    services,
    notifications,
    isLoading,
  };
};
