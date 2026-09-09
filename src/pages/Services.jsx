import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Plus,
  Search,
  LayoutGrid,
  List,
  Loader2,
  Edit2,
  Trash2,
  Target,
  CheckCircle2,
  ListPlus,
  Sparkles,
  Tag,
  ArrowRight
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import AddServiceModal from '../components/modals/AddServiceModal';
import EditServiceModal from '../components/modals/EditServiceModal';
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal';

const Services = () => {
  const { services, loading, delService } = useDashboard();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Extract unique categories for filtering
  const categories = ['All', ...Array.from(new Set(services.map(s => s.category).filter(Boolean)))];

  const filteredServices = services.filter(service => {
    const matchesCat = selectedCategory === 'All' || service.category === selectedCategory;
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === '' ||
      service.title?.toLowerCase().includes(query) ||
      service.category?.toLowerCase().includes(query) ||
      service.description?.toLowerCase().includes(query) ||
      service.suitedFor?.toLowerCase().includes(query) ||
      service.builtToAchieve?.some(item => item.toLowerCase().includes(query)) ||
      service.canInclude?.some(item => item.toLowerCase().includes(query));

    return matchesCat && matchesSearch;
  });

  const handleEditClick = (service) => {
    setSelectedService(service);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (service) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedService?._id) {
      await delService(selectedService._id);
      setIsDeleteModalOpen(false);
      setSelectedService(null);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-neon animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-dark mb-2">Services Management</h1>
          <p className="text-[#6b8a78] font-medium">
            Define, structure, and customize your agency's offerings and service deliverables.
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {/* View Mode Toggle */}
          <div className="flex bg-white border border-brand-border rounded-xl overflow-hidden p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-brand-deep text-brand-neon shadow-sm'
                  : 'text-[#6b8a78] hover:bg-brand-light'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-brand-deep text-brand-neon shadow-sm'
                  : 'text-[#6b8a78] hover:bg-brand-light'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Service Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary flex items-center gap-2 justify-center"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="dashboard-card !p-5 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a78] group-focus-within:text-brand-neon transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, category, goals, deliverables or audience..."
            className="w-full bg-brand-light border-none rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/30 outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-deep text-brand-neon shadow-sm'
                  : 'bg-brand-light/60 text-[#4a6b58] hover:bg-brand-light'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services List / Grid View */}
      {filteredServices.length === 0 ? (
        <div className="dashboard-card p-16 text-center space-y-4">
          <div className="w-16 h-16 bg-brand-neon/10 rounded-3xl flex items-center justify-center mx-auto text-brand-deep">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-brand-dark">No Services Found</h3>
          <p className="text-sm text-[#6b8a78] max-w-md mx-auto">
            {searchTerm || selectedCategory !== 'All'
              ? "No services match your active search filters. Try clearing filters or searching for different terms."
              : "You haven't created any service offerings yet. Click below to add your first service."}
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary inline-flex items-center gap-2 mt-2"
          >
            <Plus className="w-4 h-4" />
            Add New Service
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredServices.map((service, index) => (
              <motion.div
                key={service._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-[28px] border border-brand-border overflow-hidden hover:shadow-xl hover:border-brand-neon/40 transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Card Top Section */}
                <div className="p-6 space-y-4">
                  {/* Category Pill & Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-deep bg-brand-neon/15 px-3 py-1 rounded-full">
                      <Tag className="w-3 h-3 text-brand-neon" />
                      {service.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(service)}
                        className="p-2 text-[#6b8a78] hover:text-brand-deep hover:bg-brand-light rounded-xl transition-all"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(service)}
                        className="p-2 text-[#6b8a78] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-serif text-xl font-bold text-brand-dark group-hover:text-brand-deep transition-colors mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-[#6b8a78] leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  {/* Suited For Box */}
                  <div className="p-3 bg-brand-light/50 rounded-2xl border border-brand-border/60">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-deep mb-1">
                      <Target className="w-3.5 h-3.5 text-brand-neon" />
                      Suited For
                    </div>
                    <p className="text-xs font-semibold text-brand-dark">
                      {service.suitedFor}
                    </p>
                  </div>

                  {/* Built to Achieve */}
                  {service.builtToAchieve && service.builtToAchieve.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-brand-border/60">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#4a6b58]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-neon" />
                        Built to Achieve
                      </div>
                      <ul className="space-y-1.5">
                        {service.builtToAchieve.map((goal, gIdx) => (
                          <li key={gIdx} className="text-xs text-[#4a6b58] flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-neon mt-1.5 flex-shrink-0" />
                            <span className="line-clamp-2">{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Can Include */}
                  {service.canInclude && service.canInclude.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-brand-border/60">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#4a6b58]">
                        <ListPlus className="w-3.5 h-3.5 text-brand-neon" />
                        Can Include
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {service.canInclude.map((item, iIdx) => (
                          <span
                            key={iIdx}
                            className="text-[11px] font-medium bg-brand-light text-brand-dark px-2.5 py-1 rounded-lg border border-brand-border/60"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Bottom Accent */}
                <div className="h-1 bg-gradient-to-r from-brand-neon/0 via-brand-neon/50 to-brand-neon/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* List View */
        <div className="dashboard-card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-light/50 border-b border-brand-border">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#6b8a78]">Service Title</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#6b8a78]">Category</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#6b8a78]">Suited For</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#6b8a78]">Built to Achieve</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#6b8a78]">Can Include</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {filteredServices.map((service) => (
                  <tr key={service._id} className="hover:bg-brand-light/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-brand-dark group-hover:text-brand-deep">{service.title}</p>
                        <p className="text-xs text-[#6b8a78] line-clamp-1 max-w-xs">{service.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-brand-deep bg-brand-neon/15 px-2.5 py-0.5 rounded-md">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-[#4a6b58] max-w-xs truncate">
                      {service.suitedFor}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-brand-deep bg-brand-light px-2 py-1 rounded-lg">
                        {service.builtToAchieve?.length || 0} goals
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-brand-deep bg-brand-light px-2 py-1 rounded-lg">
                        {service.canInclude?.length || 0} items
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditClick(service)}
                          className="p-2 text-[#6b8a78] hover:text-brand-deep hover:bg-brand-light rounded-xl transition-all"
                          title="Edit Service"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(service)}
                          className="p-2 text-[#6b8a78] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditServiceModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedService(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Service"
        message={`Are you sure you want to delete "${selectedService?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Services;
