"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "../../../../supabase/client";
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight } from "lucide-react";

type Character = {
  id: string;
  name: string;
  country: string;
  country_flag: string;
  tagline: string;
  personality_prompt: string;
  image_url: string;
  is_active: boolean;
};

const emptyForm = { name: "", country: "", country_flag: "🌍", tagline: "", personality_prompt: "", image_url: "" };

export default function CharactersManager({ initialCharacters }: { initialCharacters: Character[] }) {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [modalOpen, setModalOpen] = useState(false);
  const [editChar, setEditChar] = useState<Character | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openCreate = () => {
    setEditChar(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (char: Character) => {
    setEditChar(char);
    setForm({
      name: char.name,
      country: char.country || "",
      country_flag: char.country_flag || "🌍",
      tagline: char.tagline || "",
      personality_prompt: char.personality_prompt || "",
      image_url: char.image_url || "",
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name required";
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    const supabase = createClient();

    if (editChar) {
      const { data, error } = await supabase
        .from("ai_characters")
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq("id", editChar.id)
        .select()
        .single();
      if (!error && data) {
        setCharacters((prev) => prev.map((c) => (c.id === data.id ? data : c)));
        setModalOpen(false);
      } else {
        alert("Failed to update character. Check database permissions or try again.");
        console.error(error);
      }
    } else {
      const { data, error } = await supabase.from("ai_characters").insert(form).select().single();
      if (!error && data) {
        setCharacters((prev) => [...prev, data]);
        setModalOpen(false);
      } else {
        alert("Failed to create character. Check database permissions or run the fix_rls_and_seed.sql script in Supabase.");
        console.error(error);
      }
    }

    setLoading(false);
  };

  const handleToggle = async (char: Character) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("ai_characters")
      .update({ is_active: !char.is_active })
      .eq("id", char.id)
      .select()
      .single();
    if (data) setCharacters((prev) => prev.map((c) => (c.id === data.id ? data : c)));
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    await supabase.from("ai_characters").delete().eq("id", id);
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Life Guiders</h1>
          <p className="text-gray-500 text-sm mt-1">{characters.length} Life Guiders</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#1A56DB] text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-md shadow-blue-200"
        >
          <Plus className="w-4 h-4" />
          Add Life Guider
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {characters.map((char) => (
          <div key={char.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="relative h-44">
              {char.image_url ? (
                <Image src={char.image_url} alt={char.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-600 flex items-center justify-center text-5xl">
                  {char.country_flag}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <div className="text-white font-semibold text-sm">{char.country_flag} {char.name}</div>
                <div className="text-gray-300 text-xs">{char.country}</div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{char.tagline}</p>
              <div className="flex items-center justify-between">
                <button onClick={() => handleToggle(char)} className="flex items-center gap-1.5 text-xs">
                  {char.is_active ? (
                    <><ToggleRight className="w-4 h-4 text-green-500" /><span className="text-green-600">Active</span></>
                  ) : (
                    <><ToggleLeft className="w-4 h-4 text-gray-400" /><span className="text-gray-400">Inactive</span></>
                  )}
                </button>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(char)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-[#1A56DB] transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteConfirm(char.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl z-10 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">{editChar ? "Edit Life Guider" : "Add Life Guider"}</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Sofia" className={`w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border ${errors.name ? "border-red-400" : "border-transparent"} focus:border-[#1A56DB]`} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Flag Emoji</label>
                  <input type="text" value={form.country_flag} onChange={(e) => setForm((p) => ({ ...p, country_flag: e.target.value }))}
                    placeholder="🇪🇸" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#1A56DB] text-center text-2xl" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input type="text" value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                  placeholder="Spain" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#1A56DB]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                <input type="text" value={form.tagline} onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))}
                  placeholder="Your warm Mediterranean companion" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#1A56DB]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="url" value={form.image_url} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
                  placeholder="https://images.unsplash.com/..." className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#1A56DB]" />
                {form.image_url && (
                  <img src={form.image_url} alt="Preview" className="mt-2 h-24 w-24 rounded-xl object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personality Prompt</label>
                <textarea value={form.personality_prompt} onChange={(e) => setForm((p) => ({ ...p, personality_prompt: e.target.value }))}
                  rows={5} placeholder="You are Sofia, a warm and expressive young woman from Barcelona..."
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-[#1A56DB] resize-none" />
              </div>

              <button onClick={handleSave} disabled={loading}
                className="w-full bg-[#1A56DB] text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editChar ? "Save Changes" : "Create Life Guider"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl z-10 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Delete Life Guider?</h3>
            <p className="text-gray-500 text-sm mb-6">This will remove them from the chat platform.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white py-3 rounded-xl text-sm font-medium hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
