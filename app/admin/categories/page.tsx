"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, FolderTree, Eye } from "lucide-react";
import { API_ENDPOINTS, API_BASE_URL } from "@/lib/api-config";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  parentCategoryId?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    isActive: true,
    sortOrder: 1,
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    parentCategoryId: ""
  });

  // Helper function to get full image URL
  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${API_BASE_URL}${imageUrl}`;
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_ENDPOINTS.categories}?includeInactive=true&includeSubCategories=false`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      if (response.ok) {
        const result = await response.json();
        setCategories(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingCategory
        ? `${API_ENDPOINTS.categories}/${editingCategory.id}`
        : API_ENDPOINTS.categories;

      const method = editingCategory ? 'PUT' : 'POST';

      const payload: any = {
        ...formData,
        parentCategoryId: formData.parentCategoryId || null,
      };

      if (editingCategory) {
        payload.id = editingCategory.id;
      }

      const token = localStorage.getItem('authToken');
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchCategories();
        setShowModal(false);
        resetForm();
      } else {
        const error = await response.json();
        console.error('Error saving category:', error);
        alert(`Failed to ${editingCategory ? 'update' : 'create'} category`);
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert(`Failed to ${editingCategory ? 'update' : 'create'} category`);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl || "",
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      metaTitle: category.metaTitle || "",
      metaDescription: category.metaDescription || "",
      metaKeywords: category.metaKeywords || "",
      parentCategoryId: category.parentCategoryId || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_ENDPOINTS.categories}/${id}`, {
          method: 'DELETE',
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        });

        if (response.ok) {
          await fetchCategories();
        } else {
          const error = await response.json();
          console.error('Error deleting category:', error);
          alert('Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      isActive: true,
      sortOrder: 1,
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      parentCategoryId: ""
    });
    setEditingCategory(null);
  };

  // Get parent categories (exclude current category and its children)
  const getParentCategoryOptions = () => {
    return categories.filter(cat => {
      if (editingCategory && cat.id === editingCategory.id) return false;
      return true;
    });
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
            Categories Management
          </h1>
          <p className="text-slate-400 mt-1">Manage product categories and hierarchies</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/50 transition-all flex items-center gap-2 font-semibold"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="search"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading categories...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <FolderTree className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No categories found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Category Name</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Parent Category</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium text-sm">Products</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium text-sm">Status</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium text-sm">Order</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Created At</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Updated At</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium text-sm">Updated By</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {category.imageUrl ? (
                          <div
                            className="w-10 h-10 rounded-lg overflow-hidden border border-slate-700 cursor-pointer hover:ring-2 hover:ring-violet-500 transition-all"
                            onClick={() => setSelectedImageUrl(getImageUrl(category.imageUrl))}
                          >
                            <img
                              src={getImageUrl(category.imageUrl)}
                              alt={category.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center"><svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg></div>';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                            <FolderTree className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <div>
                          <p
                            className="text-white font-medium cursor-pointer hover:text-violet-400 transition-colors"
                            onClick={() => setViewingCategory(category)}
                          >
                            {category.name}
                          </p>
                          <p className="text-xs text-slate-500">{category.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {category.parentCategoryId ? (
                        <span className="text-slate-300 text-sm">
                          {categories.find(c => c.id === category.parentCategoryId)?.name || '-'}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-sm">Root Category</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm font-medium">
                        {category.productCount}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        category.isActive
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-slate-300">{category.sortOrder}</td>
                    <td className="py-4 px-4 text-slate-300 text-sm">
                      {category.createdAt ? new Date(category.createdAt).toLocaleString() : '-'}
                    </td>
                    <td className="py-4 px-4 text-slate-300 text-sm">
                      {category.updatedAt ? new Date(category.updatedAt).toLocaleString() : '-'}
                    </td>
                    <td className="py-4 px-4 text-slate-300 text-sm">
                      {category.updatedBy || '-'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewingCategory(category)}
                          className="p-2 text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-violet-500/20 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-violet-500/10">
            <div className="p-6 border-b border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-cyan-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
                    {editingCategory ? 'Edit Category' : 'Create New Category'}
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    {editingCategory ? 'Update category information' : 'Add a new category to your store'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                >
                  ✕
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm">1</span>
                  <span>Basic Information</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter category name"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Parent Category</label>
                    <select
                      value={formData.parentCategoryId}
                      onChange={(e) => setFormData({...formData, parentCategoryId: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    >
                      <option value="">None (Root Category)</option>
                      {getParentCategoryOptions().map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-2">Select a parent category to create a sub-category</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      placeholder="Enter category description"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-sm">2</span>
                  <span>Category Image</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-600 border-dashed rounded-xl cursor-pointer bg-slate-900/30 hover:bg-slate-800/50 transition-all group">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {formData.imageUrl ? (
                          <img src={getImageUrl(formData.imageUrl)} alt="Preview" className="w-32 h-32 object-cover rounded-lg mb-2" />
                        ) : (
                          <>
                            <svg className="w-12 h-12 mb-3 text-slate-500 group-hover:text-violet-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const formDataToUpload = new FormData();
                            formDataToUpload.append('image', file);
                            try {
                              const token = localStorage.getItem('authToken');
                              const response = await fetch(`${API_ENDPOINTS.categories}/upload-image`, {
                                method: 'POST',
                                headers: {
                                  ...(token && { 'Authorization': `Bearer ${token}` }),
                                },
                                body: formDataToUpload,
                              });
                              if (response.ok) {
                                const result = await response.json();
                                setFormData({...formData, imageUrl: result.data});
                              } else {
                                alert('Failed to upload image');
                              }
                            } catch (error) {
                              console.error('Error uploading image:', error);
                              alert('Failed to upload image');
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-slate-900 text-slate-400">OR</span>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="Paste image URL"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-sm">3</span>
                  <span>SEO Information</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Meta Title</label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
                      placeholder="Enter meta title for SEO"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Meta Description</label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                      placeholder="Enter meta description for SEO"
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Meta Keywords</label>
                    <input
                      type="text"
                      value={formData.metaKeywords}
                      onChange={(e) => setFormData({...formData, metaKeywords: e.target.value})}
                      placeholder="Enter keywords separated by commas"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-sm">4</span>
                  <span>Settings</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-600 rounded-xl cursor-pointer hover:border-violet-500 transition-all group">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="w-5 h-5 rounded border-slate-600 text-violet-500 focus:ring-2 focus:ring-violet-500 focus:ring-offset-0 focus:ring-offset-slate-900"
                      />
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-violet-400 transition-colors">Active</p>
                        <p className="text-xs text-slate-500">Make category visible</p>
                      </div>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Sort Order</label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value)})}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-500 text-white rounded-xl hover:shadow-xl hover:shadow-violet-500/50 transition-all font-semibold hover:scale-105"
                >
                  {editingCategory ? '✓ Update Category' : '+ Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImageUrl && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImageUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImageUrl}
              alt="Full size preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImageUrl(null)}
              className="absolute top-4 right-4 p-2 bg-slate-900/80 text-white rounded-lg hover:bg-slate-800 transition-all"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Category Details Modal */}
      {viewingCategory && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-violet-500/20 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-violet-500/10">
            <div className="p-6 border-b border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-cyan-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
                    Category Details
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">View category information</p>
                </div>
                <button
                  onClick={() => setViewingCategory(null)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Image Section */}
                {viewingCategory.imageUrl && (
                  <div className="lg:col-span-3">
                    <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-violet-500/20">
                      <img
                        src={getImageUrl(viewingCategory.imageUrl)}
                        alt={viewingCategory.name}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setSelectedImageUrl(getImageUrl(viewingCategory.imageUrl))}
                      />
                    </div>
                  </div>
                )}

                {/* Basic Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">ℹ</span>
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 bg-slate-900/50 p-4 rounded-xl">
                        <p className="text-sm text-slate-400 mb-1">Name</p>
                        <p className="text-xl font-bold text-white">{viewingCategory.name}</p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-xl">
                        <p className="text-sm text-slate-400 mb-1">Slug</p>
                        <p className="text-white font-mono">{viewingCategory.slug}</p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-xl">
                        <p className="text-sm text-slate-400 mb-1">Sort Order</p>
                        <p className="text-white font-semibold">{viewingCategory.sortOrder}</p>
                      </div>
                      <div className="col-span-2 bg-slate-900/50 p-4 rounded-xl">
                        <p className="text-sm text-slate-400 mb-1">Description</p>
                        <p className="text-white">{viewingCategory.description || 'No description'}</p>
                      </div>
                    </div>
                  </div>

                  {/* SEO Info */}
                  <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">🔍</span>
                      SEO Information
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-slate-900/50 p-4 rounded-xl">
                        <p className="text-sm text-slate-400 mb-1">Meta Title</p>
                        <p className="text-white">{viewingCategory.metaTitle || 'Not set'}</p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-xl">
                        <p className="text-sm text-slate-400 mb-1">Meta Description</p>
                        <p className="text-white">{viewingCategory.metaDescription || 'Not set'}</p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-xl">
                        <p className="text-sm text-slate-400 mb-1">Meta Keywords</p>
                        <p className="text-white">{viewingCategory.metaKeywords || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats & Activity */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/20 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Statistics</h3>
                    <div className="space-y-3">
                      <div className="bg-slate-900/50 p-4 rounded-xl flex items-center justify-between">
                        <span className="text-slate-300">Products</span>
                        <span className="text-2xl font-bold text-white">{viewingCategory.productCount}</span>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-xl flex items-center justify-between">
                        <span className="text-slate-300">Status</span>
                        <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          viewingCategory.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {viewingCategory.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
                    <h3 className="text-xl font-bold text-white mb-4">Activity</h3>
                    <div className="space-y-3">
                      <div className="bg-slate-900/50 p-3 rounded-xl">
                        <p className="text-xs text-slate-400 mb-1">Created At</p>
                        <p className="text-white text-sm">{viewingCategory.createdAt ? new Date(viewingCategory.createdAt).toLocaleString() : 'N/A'}</p>
                      </div>
                      <div className="bg-slate-900/50 p-3 rounded-xl">
                        <p className="text-xs text-slate-400 mb-1">Created By</p>
                        <p className="text-white text-sm">{viewingCategory.createdBy || 'N/A'}</p>
                      </div>
                      <div className="bg-slate-900/50 p-3 rounded-xl">
                        <p className="text-xs text-slate-400 mb-1">Updated At</p>
                        <p className="text-white text-sm">{viewingCategory.updatedAt ? new Date(viewingCategory.updatedAt).toLocaleString() : 'N/A'}</p>
                      </div>
                      <div className="bg-slate-900/50 p-3 rounded-xl">
                        <p className="text-xs text-slate-400 mb-1">Updated By</p>
                        <p className="text-white text-sm">{viewingCategory.updatedBy || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-700/50">
                <button
                  onClick={() => {
                    setViewingCategory(null);
                    handleEdit(viewingCategory);
                  }}
                  className="px-6 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-all font-semibold"
                >
                  Edit Category
                </button>
                <button
                  onClick={() => setViewingCategory(null)}
                  className="px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
