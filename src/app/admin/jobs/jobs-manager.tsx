"use client";

import { useState } from "react";
import { createClient } from "../../../../../supabase/client";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Image as ImageIcon, Search } from "lucide-react";

type Job = {
  id: string;
  title: string;
  category: string;
  location: string;
  salary: string;
  description: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
};

const CATEGORIES = ["Cleaning", "Caretaker", "Nanny", "Truck Driver", "Delivery", "Office", "Other"];

const emptyForm = { title: "", category: "Office", location: "", salary: "", description: "", image_url: "" };

export default function JobsManager({ initialJobs }: { initialJobs: Job[] }) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.category.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditJob(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (job: Job) => {
    setEditJob(job);
    setForm({
      title: job.title,
      category: job.category,
      location: job.location,
      salary: job.salary || "",
      description: job.description || "",
      image_url: job.image_url || "",
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title required";
    if (!form.location.trim()) errs.location = "Location required";
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    const supabase = createClient();

    if (editJob) {
      const { data, error } = await supabase
        .from("jobs")
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq("id", editJob.id)
        .select()
        .single();
      if (!error && data) setJobs((prev) => prev.map((j) => (j.id === data.id ? data : j)));
    } else {
      const { data, error } = await supabase.from("jobs").insert(form).select().single();
      if (!error && data) setJobs((prev) => [data, ...prev]);
    }

    setLoading(false);
    setModalOpen(false);
  };

  const handleToggle = async (job: Job) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("jobs")
      .update({ is_active: !job.is_active })
      .eq("id", job.id)
      .select()
      .single();
    if (data) setJobs((prev) => prev.map((j) => (j.id === data.id ? data : j)));
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    await supabase.from("jobs").delete().eq("id", id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-500 text-sm mt-1">{jobs.length} total listings</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#1A56DB] text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-md shadow-blue-200"
        >
          <Plus className="w-4 h-4" />
          Add Job
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-200 mb-6 shadow-sm">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm outline-none text-gray-900 placeholder:text-gray-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Salary</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">{job.title}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs bg-blue-50 text-[#1A56DB] px-2.5 py-1 rounded-full font-medium">{job.category}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{job.location}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{job.salary || "—"}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => handleToggle(job)} className="flex items-center gap-1.5">
                      {job.is_active ? (
                        <>
                          <ToggleRight className="w-5 h-5 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5 text-gray-400" />
                          <span className="text-xs text-gray-400 font-medium">Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(job)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-[#1A56DB] transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(job.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">No jobs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl z-10 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">{editJob ? "Edit Job" : "Add New Job"}</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Senior Office Manager"
                  className={`w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border ${errors.title ? "border-red-400" : "border-transparent"} focus:border-[#1A56DB] transition-colors`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#1A56DB] transition-colors"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                  <input
                    type="text"
                    value={form.salary}
                    onChange={(e) => setForm((p) => ({ ...p, salary: e.target.value }))}
                    placeholder="e.g. $25/hr"
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#1A56DB] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. New York, USA"
                  className={`w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border ${errors.location ? "border-red-400" : "border-transparent"} focus:border-[#1A56DB] transition-colors`}
                />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-[#1A56DB] transition-colors">
                  <ImageIcon className="w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="bg-transparent flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400"
                  />
                </div>
                {form.image_url && (
                  <img src={form.image_url} alt="Preview" className="mt-2 w-full h-28 object-cover rounded-xl" onError={(e) => (e.currentTarget.style.display = "none")} />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={4}
                  placeholder="Job description..."
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#1A56DB] transition-colors resize-none"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-[#1A56DB] text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editJob ? "Save Changes" : "Create Job"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl z-10 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Delete Job?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white py-3 rounded-xl text-sm font-medium hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
