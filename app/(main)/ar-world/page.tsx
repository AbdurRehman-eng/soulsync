"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { ARAsset, ARWorldMusic } from "@/types";
import { ArrowLeft } from "lucide-react";

// Dynamically import ARWorldViewer for better performance
const ARWorldViewer = dynamic(
  () => import("@/components/ar/ARWorldViewer").then((mod) => ({ default: mod.ARWorldViewer })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-sky-400 to-sky-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white font-semibold text-lg">Loading AR World...</p>
        </div>
      </div>
    ),
  }
);

export default function ARWorldPage() {
  const router = useRouter();
  const [assets, setAssets] = useState<ARAsset[]>([]);
  const [music, setMusic] = useState<ARWorldMusic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchARContent();
  }, []);

  const fetchARContent = async () => {
    setLoading(true);
    try {
      // Fetch AR assets (animals, trees, etc.)
      const assetsResponse = await fetch("/api/ar-animals/upload");
      if (assetsResponse.ok) {
        const assetsData = await assetsResponse.json();
        setAssets(assetsData.assets || []);
      }

      // Fetch AR music
      const musicResponse = await fetch("/api/ar-music/upload");
      if (musicResponse.ok) {
        const musicData = await musicResponse.json();
        // Pick a random music track
        const tracks = musicData.music || [];
        if (tracks.length > 0) {
          const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
          setMusic(randomTrack);
        }
      }
    } catch (err) {
      console.error("Failed to fetch AR content:", err);
      setError("Failed to load AR content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-sky-400 to-sky-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white font-semibold text-lg">Preparing AR World...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-sky-400 to-sky-200 p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-xl">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-sky-400 to-sky-200 p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-xl">
          <div className="text-6xl mb-4">🌍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No AR Content Yet</h2>
          <p className="text-gray-600 mb-6">
            The AR World is still being set up. Check back soon for an amazing experience!
          </p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* Back button */}
      <button
        onClick={handleClose}
        className="absolute top-4 left-4 z-50 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
      >
        <ArrowLeft size={20} />
      </button>

      {/* AR World Viewer */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
          </div>
        }
      >
        <ARWorldViewer assets={assets} music={music || undefined} onClose={handleClose} />
      </Suspense>
    </div>
  );
}
