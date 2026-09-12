import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layers, Plus, Trash2, Loader2, Sparkles, CheckCircle2, Target, ListPlus } from 'lucide-react';
import { useCreateService } from '../../hooks/useServicesQuery';

const DEFAULT_CATEGORIES = [
  'Web Development',
  'UI/UX Design',
  'Mobile App Development',
  'Backend & APIs',
  'Cloud & DevOps',
  'SEO & Performance'
];

const AddServiceModal = ({ isOpen, onClose }) => {
  const createServiceMutation = useCreateService();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    suitedFor: '',
    builtToAchieve: [''],
    canInclude: ['']
  });

  // Handle dynamic list changes
  const handleListChange = (field, index, value) => {
    setFormData(prev => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const addListItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeListItem = (field, index) => {
    setFormData(prev => {
      const updated = prev[field].filter((_, i) => i !== index);
      return {
        ...prev,
        [field]: updated.length === 0 ? [''] : updated
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Filter out empty lines
      const payload = {
        title: formData.title.trim(),
        category: formData.category.trim(),
        description: formData.description.trim(),
        suitedFor: formData.suitedFor.trim(),
        builtToAchieve: formData.builtToAchieve.map(s => s.trim()).filter(Boolean),
        canInclude: formData.canInclude.map(s => s.trim()).filter(Boolean)
      };

      await createServiceMutation.mutateAsync(payload);
      onClose();
      setFormData({
        title: '',
        category: '',
        description: '',
        suitedFor: '',
        builtToAchieve: [''],
        canInclude: ['']
      });
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const loading = createServiceMutation.isPending;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[32px] shadow-2xl z-[60] border border-brand-border max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="relative p-8 pb-4 border-b border-brand-border/60">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-6 top-6 p-2 hover:bg-brand-light rounded-full text-[#6b8a78] transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 bg-brand-neon/10 rounded-2xl flex items-center justify-center text-brand-deep mb-4">
                <Layers className="w-7 h-7" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-brand-dark">Add New Service</h2>
              <p className="text-sm font-medium text-[#6b8a78] mt-1">
                Configure service details, target audience, deliverables, and features.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] ml-1">
                    Service Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Full-Stack Web Development"
                    className="w-full bg-brand-light border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/30 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] ml-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Web Development"
                    className="w-full bg-brand-light border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/30 outline-none"
                  />
                </div>
              </div>

              {/* Quick Categories Selection */}
              <div className="space-y-1.5 -mt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b8a78]/80 ml-1">Suggested Categories:</span>
                <div className="flex flex-wrap gap-1.5">
                  {DEFAULT_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        formData.category === cat
                          ? 'bg-brand-deep text-brand-neon border-brand-deep font-bold'
                          : 'bg-brand-light/60 text-[#4a6b58] border-brand-border/60 hover:bg-brand-light'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suited For */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] ml-1 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-brand-neon" />
                  Suited For <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.suitedFor}
                  onChange={(e) => setFormData({ ...formData, suitedFor: e.target.value })}
                  placeholder="e.g. Startups, E-commerce Brands, SaaS Companies"
                  className="w-full bg-brand-light border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/30 outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] ml-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this service delivers and how it helps clients..."
                  className="w-full bg-brand-light border-none rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/30 outline-none resize-none"
                />
              </div>

              {/* Built to Achieve (Dynamic List) */}
              <div className="space-y-3 p-5 bg-brand-light/40 rounded-2xl border border-brand-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-neon" />
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                      Built to Achieve
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => addListItem('builtToAchieve')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-deep bg-brand-neon/20 hover:bg-brand-neon/30 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add item
                  </button>
                </div>
                <p className="text-xs text-[#6b8a78]">
                  Key outcomes, business goals, and measurable value generated for the client.
                </p>

                <div className="space-y-2">
                  {formData.builtToAchieve.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#6b8a78] w-5 text-center">{index + 1}.</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleListChange('builtToAchieve', index, e.target.value)}
                        placeholder={`Goal #${index + 1} (e.g. 3x faster page load & higher conversion)`}
                        className="flex-1 bg-white border border-brand-border rounded-xl py-2.5 px-3.5 text-sm font-medium focus:ring-2 focus:ring-brand-neon/30 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeListItem('builtToAchieve', index)}
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Can Include (Dynamic List) */}
              <div className="space-y-3 p-5 bg-brand-light/40 rounded-2xl border border-brand-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ListPlus className="w-4 h-4 text-brand-neon" />
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                      Can Include
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => addListItem('canInclude')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-deep bg-brand-neon/20 hover:bg-brand-neon/30 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add item
                  </button>
                </div>
                <p className="text-xs text-[#6b8a78]">
                  Specific deliverables, technologies, and features bundled in this service.
                </p>

                <div className="space-y-2">
                  {formData.canInclude.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#6b8a78] w-5 text-center">{index + 1}.</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleListChange('canInclude', index, e.target.value)}
                        placeholder={`Deliverable #${index + 1} (e.g. Responsive Design & Cross-Browser Testing)`}
                        className="flex-1 bg-white border border-brand-border rounded-xl py-2.5 px-3.5 text-sm font-medium focus:ring-2 focus:ring-brand-neon/30 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeListItem('canInclude', index)}
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl font-bold text-sm text-[#4a6b58] hover:bg-brand-light transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 min-w-[140px] justify-center"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Save Service
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddServiceModal;
