"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Upload, Trash2, Eye, EyeOff, Search, X, Play, Pause, Music } from "lucide-react";
import type { ARWorldMusic } from "@/types";
import toast from "react-hot-toast";

export default function ARMusicPage() {
  const [musicTracks, setMusicTracks] = useState<ARWorldMusic[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [duration, setDuration] = useState("");
  const [audioPreview, setAudioPreview] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchMusic();
  }, []);

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const fetchMusic = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ar-music/upload");
      if (response.ok) {
        const data = await response.json();
        setMusicTracks(data.music || []);
      }
    } catch (error) {
      console.error("Failed to fetch AR music:", error);
      toast.error("Failed to load AR music");
    } finally {
      setLoading(false);
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setAudioPreview(url);

      // Get duration
      const audio = new Audio(url);
      audio.addEventListener("loadedmetadata", () => {
        setDuration(Math.round(audio.duration).toString());
      });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioFile || !name) {
      toast.error("Please provide a name and audio file");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("audio", audioFile);
      formData.append("name", name);
      if (duration) {
        formData.append("duration", duration);
      }

      const response = await fetch("/api/ar-music/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success(`Music track "${name}" uploaded successfully`);
        resetForm();
        setShowUploadModal(false);
        fetchMusic();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to upload music");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload music");
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (musicId: string, currentStatus: boolean) => {
    const track = musicTracks.find((t) => t.id === musicId);
    try {
      const { error } = await supabase
        .from("ar_world_music")
        .update({ is_active: !currentStatus })
        .eq("id", musicId);

      if (error) throw error;

      toast.success(`"${track?.name}" ${!currentStatus ? "activated" : "deactivated"} successfully`);
      fetchMusic();
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error(`Failed to update status for "${track?.name}"`);
    }
  };

  const handleDelete = async (musicId: string) => {
    const track = musicTracks.find((t) => t.id === musicId);
    if (!confirm(`Are you sure you want to delete "${track?.name || ""}"?`)) return;

    try {
      const { error } = await supabase
        .from("ar_world_music")
        .delete()
        .eq("id", musicId);

      if (error) throw error;

      toast.success(`"${track?.name}" deleted successfully`);
      fetchMusic();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(`Failed to delete "${track?.name}"`);
    }
  };

  const handlePlayPause = (track: ARWorldMusic) => {
    if (playingTrackId === track.id) {
      // Pause
      audioRef.current?.pause();
      setPlayingTrackId(null);
    } else {
      // Play new track
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(track.audio_url);
      audio.volume = 0.5;
      audio.play();
      audioRef.current = audio;
      setPlayingTrackId(track.id);

      audio.addEventListener("ended", () => {
        setPlayingTrackId(null);
      });
    }
  };

  const resetForm = () => {
    setName("");
    setAudioFile(null);
    setDuration("");
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
    }
    setAudioPreview(null);
  };

  const filteredTracks = musicTracks.filter((track) =>
    track.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "Unknown";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[var(--foreground)]">AR Background Music</h2>
          <p className="text-[var(--muted-foreground)]">
            Manage background music for AR World ({musicTracks.length} tracks)
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary)]/90 transition-colors flex items-center gap-2"
        >
          <Upload size={18} />
          Upload Music
        </button>
      </div>

      {/* Search */}
      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
          <input
            type="text"
            placeholder="Search music..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder:text-[var(--muted-foreground)]"
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
      </div>

      {/* Music List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[var(--primary)]" size={48} />
        </div>
      ) : filteredTracks.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Music className="w-16 h-16 mx-auto mb-4 text-[var(--muted-foreground)]" />
          <p className="text-[var(--muted-foreground)] mb-4">No music tracks found</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary)]/90 transition-colors"
          >
            Upload Your First Track
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTracks.map((track) => (
            <div key={track.id} className="glass-card p-4">
              <div className="flex items-center gap-4">
                {/* Play Button */}
                <button
                  onClick={() => handlePlayPause(track)}
                  className="flex-shrink-0 w-12 h-12 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  {playingTrackId === track.id ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--foreground)] truncate">{track.name}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Duration: {formatDuration(track.duration)}
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={`flex-shrink-0 text-xs px-3 py-1 rounded-full font-medium ${
                    track.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {track.is_active ? "Active" : "Inactive"}
                </span>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleActive(track.id, track.is_active)}
                    className="p-2 hover:bg-[var(--secondary)] rounded-lg transition-colors"
                    title={track.is_active ? "Deactivate" : "Activate"}
                  >
                    {track.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                  <button
                    onClick={() => handleDelete(track.id)}
                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-lg w-full">
            <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
              <h3 className="text-xl font-bold">Upload Music</h3>
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
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Track Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder:text-[var(--muted-foreground)]"
                  placeholder="e.g., Peaceful Forest, Ambient Calm"
                />
              </div>

              {/* Audio File */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Audio File (MP3, WAV, OGG) *</label>
                <input
                  type="file"
                  accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
                  onChange={handleAudioChange}
                  required
                  className="w-full px-4 py-2.5 bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary)] file:text-white hover:file:bg-[var(--primary)]/90"
                />
                {audioPreview && (
                  <div className="mt-3 p-3 bg-[var(--secondary)] rounded-lg">
                    <audio src={audioPreview} controls className="w-full" />
                  </div>
                )}
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  Max file size: 20MB
                </p>
              </div>

              {/* Duration (auto-filled) */}
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--foreground)]">Duration (seconds)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder:text-[var(--muted-foreground)]"
                  placeholder="Auto-detected"
                />
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  Automatically detected from audio file
                </p>
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
                      Upload Music
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
