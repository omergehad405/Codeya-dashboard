import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, DollarSign, Wallet, TrendingUp, Search,
  Loader2, ArrowUpRight, ArrowDownRight, Plus, X, Trash2, Link as LinkIcon, TrendingDown
} from 'lucide-react';
import { useProjects } from '../hooks/useProjectsQuery';
import { useInvoices, useCreateInvoice, useDeleteInvoice } from '../hooks/useInvoicesQuery';

const CATEGORIES = ['Development', 'Design', 'Hosting', 'Domain', 'Maintenance', 'Consultation', 'Other'];

const getCategoryStyle = (category, invoiceType, rowType) => {
  if (rowType === 'project') return 'bg-[#e2f0e9] text-[#2c5e43] border border-[#b8dec9]/60';
  if (invoiceType === 'expense') {
    switch (category?.toLowerCase()) {
      case 'hosting':    return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'domain':     return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'maintenance':return 'bg-cyan-50 text-cyan-700 border border-cyan-200';
      default:           return 'bg-red-50 text-red-700 border border-red-200';
    }
  }
  switch (category?.toLowerCase()) {
    case 'design':       return 'bg-purple-50 text-purple-700 border border-purple-200';
    case 'development':  return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
    case 'consultation': return 'bg-teal-50 text-teal-700 border border-teal-200';
    default:             return 'bg-gray-50 text-gray-700 border border-gray-200';
  }
};

const Invoices = () => {
  const { data: projects = [], isLoading: isProjectsLoading } = useProjects();
  const { data: invoices = [], isLoading: isInvoicesLoading } = useInvoices();
  const createInvoiceMutation = useCreateInvoice();
  const deleteInvoiceMutation = useDeleteInvoice();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ description: '', price: '', category: 'Development', invoiceType: 'income' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tableSearch, setTableSearch] = useState('');

  const loading = isProjectsLoading || isInvoicesLoading;

  const resetForm = () => {
    setShowForm(false);
    setSelectedProject(null);
    setSearchQuery('');
    setFormData({ description: '', price: '', category: 'Development', invoiceType: 'income' });
  };

  const { completedRevenue, pendingRevenue, totalExpenses, netProfit, allPayments } = useMemo(() => {
    let completed = 0;
    let pending = 0;
    let expenses = 0;
    const items = [];

    projects.forEach(p => {
      const price = Number(p.price) || 0;
      if (p.status?.toLowerCase() === 'completed') {
        completed += price;
        items.push({ _id: p._id, name: p.name, rowType: 'project', invoiceType: 'income', client: p.client?.name || 'Unknown', date: p.updatedAt || p.createdAt, price, category: null });
      } else {
        pending += price;
      }
    });

    (invoices || []).forEach(inv => {
      const price = Number(inv.price) || 0;
      if (inv.invoiceType === 'expense') {
        expenses += price;
      } else {
        completed += price;
      }
      items.push({
        _id: inv._id, name: inv.description, rowType: 'invoice',
        invoiceType: inv.invoiceType || 'income',
        client: inv.project?.client?.name || (inv.invoiceType === 'expense' ? '—' : 'No Client'),
        project: inv.project?.name || null,
        date: inv.createdAt, price,
        category: inv.category || 'Development',
        original: inv
      });
    });

    items.sort((a, b) => new Date(b.date) - new Date(a.date));
    const totalExp = completed + pending;
    const profitPct = totalExp > 0 ? ((completed / totalExp) * 100).toFixed(1) : 0;

    return { completedRevenue: completed, pendingRevenue: pending, totalExpenses: expenses, netProfit: completed - expenses, profitPercentage: profitPct, allPayments: items };
  }, [projects, invoices]);

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    return projects.filter(p =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.client?.name && p.client.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [projects, searchQuery]);

  const filteredPayments = useMemo(() => {
    if (!tableSearch) return allPayments;
    return allPayments.filter(p =>
      p.name?.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.client?.toLowerCase().includes(tableSearch.toLowerCase()) ||
      (p.project && p.project.toLowerCase().includes(tableSearch.toLowerCase()))
    );
  }, [allPayments, tableSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.price) return;
    try {
      await createInvoiceMutation.mutateAsync({
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        invoiceType: formData.invoiceType,
        project: selectedProject ? selectedProject._id : undefined
      });
      resetForm();
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="h-full w-full flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-brand-neon animate-spin" />
    </div>
  );

  const statBoxes = [
    { title: 'Total Income', value: `$${completedRevenue.toLocaleString()}`, subtitle: 'Completed projects & income billings', icon: DollarSign, color: 'text-brand-deep', bg: 'bg-brand-neon/10', trend: true },
    { title: 'Total Expenses', value: `$${totalExpenses.toLocaleString()}`, subtitle: 'Hosting, domains & other costs', icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50', trend: false },
    { title: 'Net Profit', value: `$${netProfit.toLocaleString()}`, subtitle: 'Income minus all expenses', icon: TrendingUp, color: 'text-brand-deep', bg: 'bg-brand-neon/10', trend: netProfit >= 0 },
    { title: 'Pending Revenue', value: `$${pendingRevenue.toLocaleString()}`, subtitle: 'From active / pending projects', icon: Wallet, color: 'text-[#4a6b58]', bg: 'bg-brand-deep/5', trend: null },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-brand-dark mb-2">Invoices & Billing</h1>
          <p className="text-[#6b8a78] font-medium">Track income, expenses and your net profit.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 justify-center">
          <Plus className="w-4 h-4" /> Add Billing
        </button>
      </div>

      {/* Stat Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statBoxes.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="dashboard-card group relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="stat-label">{stat.title}</span>
                <h3 className={`stat-value mt-2 ${stat.title === 'Total Expenses' ? 'text-red-600' : ''}`}>{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#6b8a78]">
              {stat.trend === true && <ArrowUpRight className="w-3 h-3 text-brand-neon" />}
              {stat.trend === false && <ArrowDownRight className="w-3 h-3 text-red-500" />}
              <span>{stat.subtitle}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <div className="dashboard-card !p-0 overflow-hidden">
        <div className="p-6 border-b border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-serif text-xl font-bold text-brand-dark">All Billing Records</h3>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a78] group-focus-within:text-brand-neon transition-colors" />
            <input type="text" placeholder="Search records..." value={tableSearch} onChange={e => setTableSearch(e.target.value)}
              className="w-full md:w-64 bg-[#f0f7f3] border-none rounded-xl py-2 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand-neon/20 outline-none" />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredPayments.length === 0 ? (
            <div className="p-12 text-center text-[#6b8a78] font-medium">No records found. Add a billing or complete projects.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-light/50">
                  {['ID', 'Details', 'Client', 'Date', 'Amount', 'Actions'].map(h => (
                    <th key={h} className={`px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#6b8a78] ${h === 'Amount' ? 'text-right' : h === 'Actions' ? 'text-center' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {filteredPayments.map((payment, index) => {
                  const isExpense = payment.invoiceType === 'expense';
                  return (
                    <motion.tr key={payment._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className={`transition-colors group ${isExpense ? 'hover:bg-red-50/40' : 'hover:bg-brand-light/30'}`}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <FileText className={`w-4 h-4 ${isExpense ? 'text-red-400' : 'text-[#6b8a78]'}`} />
                          <span className="text-sm font-bold text-brand-dark">
                            {payment.rowType === 'project' ? 'PRJ-' : isExpense ? 'EXP-' : 'INC-'}
                            {payment._id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-brand-dark">{payment.name}</span>
                          {payment.rowType === 'invoice' && payment.project && (
                            <div className="flex items-center gap-1 text-xs text-brand-deep font-semibold">
                              <LinkIcon className="w-3 h-3 text-[#6b8a78]" />
                              <span>Project: {payment.project}</span>
                            </div>
                          )}
                          <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full w-fit border ${getCategoryStyle(payment.category, payment.invoiceType, payment.rowType)}`}>
                            {payment.rowType === 'project' ? 'Project Completion' : payment.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm text-[#4a6b58] font-medium">{payment.client}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm text-[#6b8a78]">{new Date(payment.date).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {isExpense ? (
                          <span className="text-sm font-black text-red-600 bg-red-50 px-3 py-1 rounded-lg border border-red-100">
                            −${payment.price?.toLocaleString() || 0}
                          </span>
                        ) : (
                          <span className="text-sm font-black text-brand-neon bg-brand-neon/10 px-3 py-1 rounded-lg">
                            +${payment.price?.toLocaleString() || 0}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {payment.rowType === 'invoice' ? (
                          <button onClick={() => { if (window.confirm('Delete this billing record?')) deleteInvoiceMutation.mutate(payment._id); }}
                            className="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-xs text-[#6b8a78] italic">Auto-generated</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/40 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={resetForm} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl border border-brand-border">
              <button onClick={resetForm} className="absolute top-4 right-4 p-2 text-[#6b8a78] hover:text-brand-dark rounded-full hover:bg-brand-light transition-colors">
                <X className="w-5 h-5" />
              </button>

              <h2 className="font-serif text-2xl font-bold text-brand-dark mb-2">Create Billing Record</h2>
              <p className="text-sm text-[#6b8a78] mb-6">Add income you received or an expense you paid.</p>

              {/* Income / Expense toggle */}
              <div className="flex gap-2 mb-6 p-1 bg-brand-light rounded-xl">
                {[{ val: 'income', label: '+ Income', active: 'bg-brand-neon/20 text-brand-deep border border-brand-neon/30' },
                  { val: 'expense', label: '− Expense', active: 'bg-red-100 text-red-700 border border-red-200' }].map(opt => (
                  <button key={opt.val} type="button"
                    onClick={() => setFormData(f => ({ ...f, invoiceType: opt.val }))}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${formData.invoiceType === opt.val ? opt.active : 'text-[#6b8a78] hover:text-brand-dark'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-[#4a6b58] mb-2">Description</label>
                  <input type="text" required placeholder={formData.invoiceType === 'expense' ? 'e.g., Monthly Hosting Fee, Domain Renewal' : 'e.g., UI Design Phase 1, Consultation Fee'}
                    value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                    className="w-full bg-[#f0f7f3] border border-transparent focus:border-brand-neon rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[#4a6b58] mb-2">Amount ($)</label>
                    <input type="number" required min="0" placeholder="e.g., 50"
                      value={formData.price} onChange={e => setFormData(f => ({ ...f, price: e.target.value }))}
                      className="w-full bg-[#f0f7f3] border border-transparent focus:border-brand-neon rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#4a6b58] mb-2">Category</label>
                    <select value={formData.category} onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}
                      className="w-full bg-[#f0f7f3] border border-transparent focus:border-brand-neon rounded-xl py-3 px-4 text-sm font-medium outline-none transition-all">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Project link (only for income) */}
                {formData.invoiceType === 'income' && (
                  <div className="relative">
                    <label className="block text-sm font-bold text-[#4a6b58] mb-2">Link to Project (Optional)</label>
                    {selectedProject ? (
                      <div className="flex items-center justify-between bg-[#f0f7f3] border border-brand-neon/30 rounded-xl px-4 py-3">
                        <div>
                          <div className="font-bold text-sm text-brand-dark">{selectedProject.name}</div>
                          {selectedProject.client?.name && <div className="text-xs text-[#6b8a78]">Client: {selectedProject.client.name}</div>}
                        </div>
                        <button type="button" onClick={() => setSelectedProject(null)} className="text-[#6b8a78] hover:text-brand-deep p-1 rounded-full hover:bg-black/5">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8a78]" />
                          <input type="text" placeholder="Search projects to link..." value={searchQuery}
                            onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                            onFocus={() => setShowDropdown(true)}
                            className="w-full bg-[#f0f7f3] border border-transparent focus:border-brand-neon rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none transition-all" />
                        </div>
                        {showDropdown && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                            <div className="absolute z-50 w-full mt-2 bg-white border border-brand-border rounded-xl shadow-lg max-h-44 overflow-y-auto">
                              {filteredProjects.length === 0
                                ? <div className="p-4 text-center text-sm text-[#6b8a78]">No projects found</div>
                                : filteredProjects.map(p => (
                                    <button key={p._id} type="button"
                                      onClick={() => { setSelectedProject(p); setSearchQuery(''); setShowDropdown(false); }}
                                      className="w-full text-left px-4 py-3 hover:bg-[#f0f7f3] transition-colors border-b border-brand-border last:border-b-0">
                                      <div className="font-bold text-sm text-brand-dark">{p.name}</div>
                                      {p.client?.name && <div className="text-xs text-[#6b8a78]">Client: {p.client.name}</div>}
                                    </button>
                                  ))
                              }
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={resetForm}
                    className="px-5 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-[#6b8a78] hover:bg-brand-light transition-colors">
                    Cancel
                  </button>
                  <button type="submit"
                    disabled={createInvoiceMutation.isPending}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${formData.invoiceType === 'expense' ? 'bg-red-500 hover:bg-red-600 text-white' : 'btn-primary'}`}>
                    {formData.invoiceType === 'expense' ? 'Save Expense' : 'Save Income'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Invoices;
