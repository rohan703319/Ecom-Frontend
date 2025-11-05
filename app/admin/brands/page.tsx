"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Tag, Eye, Upload, X, Calendar, User, Package, EyeOff } from "lucide-react";
import { API_ENDPOINTS, API_BASE_URL } from "@/lib/api-config";

interface Brand {
  id: string;
  name: string;
  description: string;
  slug: string;
  logoUrl?: string;
  isPublished: boolean;
  showOnHomepage: boolean;
  displayOrder: number;
  productCount: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [viewingBrand, setViewingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logoUrl: "",
    isPublished: true,
    showOnHomepage: false,
    displayOrder: 1,
    metaTitle: "",
    metaDescription: "",
    metaKeywords: ""
  });

  const getImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${API_BASE_URL}${imageUrl}`;
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_ENDPOINTS.brands}?includeUnpublished=true`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      if (response.ok) {
        const result = await response.json();
        setBrands(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        alert('Please login first');
        return;
      }

      const url = editingBrand
        ? `${API_ENDPOINTS.brands}/${editingBrand.id}`
        : API_ENDPOINTS.brands;

      const payload: any = {
        ...formData,
        ...(editingBrand && { id: editingBrand.id })
      };

      const response = await fetch(url, {
        method: editingBrand ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok || response.status === 201) {
        await fetchBrands();
        setShowModal(false);
        resetForm();
      } else if (response.status === 401) {
        alert('Unauthorized. Please login again.');
      } else {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        alert('Failed to save brand');
      }
    } catch (error) {
      console.error('Error saving brand:', error);
      alert('Failed to save brand');
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description,
      logoUrl: brand.logoUrl || "",
      isPublished: brand.isPublished,
      showOnHomepage: brand.showOnHomepage,
      displayOrder: brand.displayOrder,
      metaTitle: brand.metaTitle || "",
      metaDescription: brand.metaDescription || "",
      metaKeywords: brand.metaKeywords || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_ENDPOINTS.brands}/${id}`, {
          method: 'DELETE',
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        });

        if (response.ok) {
          await fetchBrands();
        } else {
          alert('Failed to delete brand');
        }
      } catch (error) {
        console.error('Error deleting brand:', error);
        alert('Failed to delete brand');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      logoUrl: "",
      isPublished: true,
      showOnHomepage: false,
      displayOrder: 1,
      metaTitle: "",
      metaDescription: "",
      metaKeywords: ""
    });
    setEditingBrand(null);
  };

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading brands...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
            Brand Management
          </h1>
          <p className="text-slate-400 mt-1">Manage your product brands</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/50 transition-all flex items-center gap-2 font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add Brand
        </button>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="text-sm text-slate-400">
            {filteredBrands.length} brand{filteredBrands.length !== 1 ? 's' : ''}
          </div>
        </div>

        {filteredBrands.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No brands found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-4 text-slate-300 font-semibold">Brand</th>
                  <th className="text-center py-4 px-4 text-slate-300 font-semibold">Products</th>
                  <th className="text-center py-4 px-4 text-slate-300 font-semibold">Status</th>
                  <th className="text-center py-4 px-4 text-slate-300 font-semibold">Homepage</th>
                  <th className="text-center py-4 px-4 text-slate-300 font-semibold">Order</th>
                  <th className="text-left py-4 px-4 text-slate-300 font-semibold">Created At</th>
                  <th className="text-left py-4 px-4 text-slate-300 font-semibold">Updated At</th>
                  <th className="text-left py-4 px-4 text-slate-300 font-semibold">Updated By</th>
                  <th className="text-center py-4 px-4 text-slate-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBrands.map((brand) => (
                  <tr key={brand.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {brand.logoUrl ? (
                          <img
                            src={getImageUrl(brand.logoUrl)}
                            alt={brand.name}
                            className="w-10 h-10 rounded-lg object-cover cursor-pointer hover:scale-110 transition-transform"
                            onClick={() => setSelectedImageUrl(getImageUrl(brand.logoUrl))}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                            <Tag className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <div>
                          <p
                            className="text-white font-medium cursor-pointer hover:text-violet-400 transition-colors"
                            onClick={() => setViewingBrand(brand)}
                          >
                            {brand.name}
                          </p>
                          <p className="text-xs text-slate-500">{brand.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-sm font-medium">
                        {brand.productCount}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        brand.isPublished
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {brand.isPublished ? 'Published' : 'Unpublished'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        brand.showOnHomepage
                          ? 'bg-violet-500/10 text-violet-400'
                          : 'bg-slate-500/10 text-slate-400'
                      }`}>
                        {brand.showOnHomepage ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-slate-300">{brand.displayOrder}</td>
                    <td className="py-4 px-4 text-slate-300 text-sm">
                      {brand.createdAt ? new Date(brand.createdAt).toLocaleString() : '-'}
                    </td>
                    <td className="py-4 px-4 text-slate-300 text-sm">
                      {brand.updatedAt ? new Date(brand.updatedAt).toLocaleString() : '-'}
                    </td>
                    <td className="py-4 px-4 text-slate-300 text-sm">
                      {brand.updatedBy || '-'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewingBrand(brand)}
                          className="p-2 text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(brand)}
                          className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(brand.id)}
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-violet-500/20 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-violet-500/10">
            <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 px-8 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {editingBrand ? '✏️ Edit Brand' : '➕ Create New Brand'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-100px)]">
              <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm">1</span>
                  <span>Basic Information</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter brand name"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Display Order</label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value)})}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Enter brand description"
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-sm">2</span>
                  <span>Brand Logo</span>
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block w-full px-6 py-8 bg-slate-900/50 border-2 border-dashed border-slate-600 rounded-xl text-center cursor-pointer hover:border-violet-500 hover:bg-violet-500/5 transition-all group">
                      <Upload className="w-12 h-12 text-slate-500 mx-auto mb-3 group-hover:text-violet-400 transition-colors" />
                      <p className="text-slate-400 group-hover:text-violet-400 transition-colors">Click to upload logo</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append('logo', file);

                            try {
                              const response = await fetch(`${API_ENDPOINTS.brands}/upload-logo`, {
                                method: 'POST',
                                body: formData,
                              });

                              if (response.ok) {
                                const result = await response.json();
                                setFormData(prev => ({...prev, logoUrl: result.data}));
                              } else {
                                alert('Failed to upload logo');
                              }
                            } catch (error) {
                              console.error('Error uploading logo:', error);
                              alert('Failed to upload logo');
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
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                    placeholder="Paste logo URL"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  />
                  {formData.logoUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-400 mb-2">Preview:</p>
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-slate-700">
                        <img
                          src={getImageUrl(formData.logoUrl)}
                          alt="Logo preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
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
                        checked={formData.isPublished}
                        onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                        className="w-5 h-5 rounded border-slate-600 text-violet-500 focus:ring-2 focus:ring-violet-500 focus:ring-offset-0 focus:ring-offset-slate-900"
                      />
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-violet-400 transition-colors">Published</p>
                        <p className="text-xs text-slate-500">Make brand visible</p>
                      </div>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-600 rounded-xl cursor-pointer hover:border-violet-500 transition-all group">
                      <input
                        type="checkbox"
                        checked={formData.showOnHomepage}
                        onChange={(e) => setFormData({...formData, showOnHomepage: e.target.checked})}
                        className="w-5 h-5 rounded border-slate-600 text-violet-500 focus:ring-2 focus:ring-violet-500 focus:ring-offset-0 focus:ring-offset-slate-900"
                      />
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-violet-400 transition-colors">Show on Homepage</p>
                        <p className="text-xs text-slate-500">Display on homepage</p>
                      </div>
                    </label>
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
                  {editingBrand ? '✓ Update Brand' : '+ Create Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {viewingBrand && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-violet-500/20 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-violet-500/10">
            <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 px-8 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Brand Details</h2>
              <button
                onClick={() => setViewingBrand(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-100px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
                    <h3 className="text-xl font-bold text-white mb-4">Basic Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                          <p className="text-sm text-slate-400 mb-1">Brand Name</p>
                          <p className="text-xl font-bold text-white">{viewingBrand.name}</p>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                          <p className="text-sm text-slate-400 mb-1">Slug</p>
                          <p className="text-lg font-mono text-cyan-400">{viewingBrand.slug}</p>
                        </div>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                        <p className="text-sm text-slate-400 mb-1">Description</p>
                        <p className="text-white">{viewingBrand.description || 'No description'}</p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                        <p className="text-sm text-slate-400 mb-1">Display Order</p>
                        <p className="text-white font-semibold">{viewingBrand.displayOrder}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
                    <h3 className="text-xl font-bold text-white mb-4">SEO Information</h3>
                    <div className="space-y-4">
                      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                        <p className="text-sm text-slate-400 mb-1">Meta Title</p>
                        <p className="text-white">{viewingBrand.metaTitle || 'Not set'}</p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                        <p className="text-sm text-slate-400 mb-1">Meta Description</p>
                        <p className="text-white">{viewingBrand.metaDescription || 'Not set'}</p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                        <p className="text-sm text-slate-400 mb-1">Meta Keywords</p>
                        <p className="text-white">{viewingBrand.metaKeywords || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {viewingBrand.logoUrl && (
                    <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
                      <h3 className="text-xl font-bold text-white mb-4">Brand Logo</h3>
                      <div className="aspect-square rounded-xl overflow-hidden border-2 border-slate-700">
                        <img
                          src={getImageUrl(viewingBrand.logoUrl)}
                          alt={viewingBrand.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div className="bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/20 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-cyan-400" />
                          <span className="text-slate-300">Products</span>
                        </div>
                        <span className="text-2xl font-bold text-white">{viewingBrand.productCount}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                        <div className="flex items-center gap-2">
                          {viewingBrand.isPublished ? (
                            <Eye className="w-5 h-5 text-green-400" />
                          ) : (
                            <EyeOff className="w-5 h-5 text-red-400" />
                          )}
                          <span className="text-slate-300">Status</span>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          viewingBrand.isPublished
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          {viewingBrand.isPublished ? 'Published' : 'Unpublished'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
                    <h3 className="text-xl font-bold text-white mb-4">Activity</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-900/50 rounded-xl">
                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>Created At</span>
                        </div>
                        <p className="text-white text-sm">
                          {viewingBrand.createdAt ? new Date(viewingBrand.createdAt).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-900/50 rounded-xl">
                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                          <User className="w-4 h-4" />
                          <span>Created By</span>
                        </div>
                        <p className="text-white text-sm">
                          {viewingBrand.createdBy || 'N/A'}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-900/50 rounded-xl">
                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                          <Calendar className="w-4 h-4" />
                          <span>Updated At</span>
                        </div>
                        <p className="text-white text-sm">
                          {viewingBrand.updatedAt ? new Date(viewingBrand.updatedAt).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-900/50 rounded-xl">
                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                          <User className="w-4 h-4" />
                          <span>Updated By</span>
                        </div>
                        <p className="text-white text-sm">
                          {viewingBrand.updatedBy || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-700/50">
                <button
                  onClick={() => {
                    handleEdit(viewingBrand);
                    setViewingBrand(null);
                  }}
                  className="px-6 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-all font-semibold"
                >
                  Edit Brand
                </button>
                <button
                  onClick={() => setViewingBrand(null)}
                  className="px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImageUrl && (
        <div
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedImageUrl(null)}
        >
          <img
            src={selectedImageUrl}
            alt="Preview"
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
