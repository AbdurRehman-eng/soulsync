"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Upload, Trash2, Eye, EyeOff, Search, X } from "lucide-react";
import type { ARAsset } from "@/types";
import toast from "react-hot-toast";

export default function ARAssetsPage() {
  const [assets, setAssets] = useState<ARAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "animal" | "tree" | "object" | "decoration">("all");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState<"animal" | "tree" | "object" | "decoration">("animal");
  const [description, setDescription] = useState("");
  const [scale, setScale] = useState("1.0");
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [modelPreview, setModelPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ar-animals/upload");
      if (response.ok) {
        const data = await response.json();
        setAssets(data.assets || []);
      }
    } catch (error) {
      console.error("Failed to fetch AR assets:", error);
      toast.error("Failed to load AR assets");
    } finally {
      setLoading(false);
    }
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setModelFile(file);
      setModelPreview(file.name);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!modelFile || !name) {
      toast.error("Please provide a name and model file");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("model", modelFile);
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }
      formData.append("name", name);
      formData.append("type", type);
      formData.append("scale", scale);
      if (description) {
        formData.append("description", description);
      }

      const response = await fetch("/api/ar-animals/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("AR asset uploaded successfully!");
        resetForm();
        setShowUploadModal(false);
        fetchAssets();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to upload AR asset");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload AR asset");
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (assetId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("ar_assets")
        .update({ is_active: !currentStatus })
        .eq("id", assetId);

      if (error) throw error;

      toast.success(`Asset ${!currentStatus ? "activated" : "deactivated"}`);
      fetchAssets();
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error("Failed to update asset status");
    }
  };

  const handleDelete = async (assetId: string) => {
    if (!confirm("Are you sure you want to delete this AR asset?")) return;

    try {
      const { error } = await supabase
        .from("ar_assets")
        .delete()
        .eq("id", assetId);

      if (error) throw error;

      toast.success("Asset deleted successfully");
      fetchAssets();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete asset");
    }
  };

  const resetForm = () => {
    setName("");
    setType("animal");
    setDescription("");
    setScale("1.0");
    setModelFile(null);
    setThumbnailFile(null);
    setModelPreview(null);
    setThumbnailPreview(null);
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || asset.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[var(--foreground)]">AR Assets</h2>
          <p className="text-[var(--muted-foreground)]">
            Manage 3D models for AR World ({assets.length} total)
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary)]/90 transition-colors flex items-center gap-2"
        >
          <Upload size={18} />
          Upload Asset
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">All Types</option>
            <option value="animal">Animals</option>
            <option value="tree">Trees</option>
            <option value="object">Objects</option>
            <option value="decoration">Decorations</option>
          </select>
        </div>
      </div>

      {/* Assets Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[var(--primary)]" size={48} />
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-[var(--muted-foreground)] mb-4">No AR assets found</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary)]/90 transition-colors"
          >
            Upload Your First Asset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <div key={asset.id} className="glass-card p-4 space-y-4">
              {/* Thumbnail */}
              <div className="aspect-video bg-[var(--secondary)] rounded-lg overflow-hidden">
                {asset.thumbnail_url ? (
                  <img
                    src={asset.thumbnail_url}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    {asset.type === "animal" && "🦁"}
                    {asset.type === "tree" && "🌳"}
                    {asset.type === "object" && "📦"}
                    {asset.type === "decoration" && "✨"}
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-[var(--foreground)]">{asset.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      asset.type === "animal"
                        ? "bg-blue-100 text-blue-700"
                        : asset.type === "tree"
                        ? "bg-green-100 text-green-700"
                        : asset.type === "object"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-pink-100 text-pink-700"
                    }`}
                  >
                    {asset.type}
                  </span>
                </div>

                {asset.description && (
                  <p className="text-sm text-[var(--muted-foreground)] mb-2 line-clamp-2">
                    {asset.description}
                  </p>
                )}

                <p className="text-xs text-[var(--muted-foreground)]">
                  Scale: {asset.scale}x
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  onClick={() => handleToggleActive(asset.id, asset.is_active)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    asset.is_active
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {asset.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                  {asset.is_active ? "Active" : "Inactive"}
                </button>

                <button
                  onClick={() => handleDelete(asset.id)}
                  className="px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[var(--border)] flex justify-between items-center sticky top-0 bg-[var(--card)] z-10">
              <h3 className="text-xl font-bold">Upload AR Asset</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-[var(--secondary)] rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder:text-[var(--muted-foreground)]"
                  placeholder="e.g., Lion, Oak Tree, Rock"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Type *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="animal">Animal</option>
                  <option value="tree">Tree</option>
                  <option value="object">Object</option>
                  <option value="decoration">Decoration</option>
                </select>
              </div>

              {/* Scale */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Scale</label>
                <input
                  type="number"
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder:text-[var(--muted-foreground)]"
                  placeholder="1.0"
                />
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  Default size multiplier (1.0 = original size)
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder:text-[var(--muted-foreground)]"
                  placeholder="Brief description of the asset..."
                />
              </div>

              {/* 3D Model */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">3D Model (GLB/GLTF) *</label>
                <input
                  type="file"
                  accept=".glb,.gltf"
                  onChange={handleModelChange}
                  required
                  className="w-full px-4 py-2.5 bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary)] file:text-white hover:file:bg-[var(--primary)]/90"
                />
                {modelPreview && (
                  <p className="text-xs text-[var(--muted-foreground)] mt-2">
                    Selected: {modelPreview}
                  </p>
                )}
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  Max file size: 50MB
                </p>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Thumbnail (Optional)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleThumbnailChange}
                  className="w-full px-4 py-2.5 bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary)] file:text-white hover:file:bg-[var(--primary)]/90"
                />
                {thumbnailPreview && (
                  <img
                    src={thumbnailPreview}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-[var(--secondary)] text-[var(--foreground)] rounded-xl font-semibold hover:bg-[var(--secondary)]/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Upload Asset
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
