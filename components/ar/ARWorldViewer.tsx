"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { ARAsset, ARWorldMusic } from "@/types";
import { Camera, Volume2, VolumeX, XCircle, MousePointer2, Move } from "lucide-react";

interface ARWorldViewerProps {
  assets: ARAsset[];
  music?: ARWorldMusic;
  onClose?: () => void;
}

export function ARWorldViewer({ assets, music, onClose }: ARWorldViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const modelsRef = useRef<THREE.Object3D[]>([]);
  const controlsRef = useRef<OrbitControls | null>(null);

  const [isARSupported, setIsARSupported] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [loadedModels, setLoadedModels] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [arMode, setArMode] = useState<"preview" | "camera">("preview");
  const [isARSessionActive, setIsARSessionActive] = useState(false);

  useEffect(() => {
    // Check if desktop (no touch support or large screen)
    const desktop = !('ontouchstart' in window) || window.innerWidth > 1024;
    setIsDesktop(desktop);

    // Check for WebXR support
    if ("xr" in navigator) {
      (navigator as any).xr?.isSessionSupported("immersive-ar").then((supported: boolean) => {
        setIsARSupported(supported);

        // If AR is supported (mobile device), automatically request camera permission
        if (supported && !desktop) {
          requestCameraPermission();
        }
      }).catch(() => {
        setIsARSupported(false);
      });
    } else {
      setIsARSupported(false);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Sky blue background
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 3); // Eye level height
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Add ground plane for reference
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x7ec850,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Load 3D models
    const loader = new GLTFLoader();
    let modelsLoaded = 0;

    // Select random assets to show (max 5)
    const selectedAssets = assets
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(5, assets.length));

    selectedAssets.forEach((asset, index) => {
      console.log(`[AR World] Loading model: ${asset.name} from ${asset.model_url}`);

      loader.load(
        asset.model_url,
        (gltf) => {
          console.log(`[AR World] ✓ Successfully loaded: ${asset.name}`);
          const model = gltf.scene;
          model.scale.set(asset.scale, asset.scale, asset.scale);

          // Position models in a circle around the user
          const angle = (index / selectedAssets.length) * Math.PI * 2;
          const radius = 2 + Math.random() * 1; // 2-3 meters away
          model.position.set(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
          );

          // Random rotation
          model.rotation.y = Math.random() * Math.PI * 2;

          model.castShadow = true;
          model.receiveShadow = true;

          scene.add(model);
          modelsRef.current.push(model);

          modelsLoaded++;
          setLoadedModels(modelsLoaded);

          if (modelsLoaded === selectedAssets.length) {
            setIsLoading(false);
          }
        },
        undefined,
        (loadError) => {
          console.error(`[AR World] ✗ Failed to load model ${asset.name}:`, loadError);
          console.error(`[AR World] Model URL: ${asset.model_url}`);
          console.error(`[AR World] This usually means:
  1. Storage bucket 'ar-assets' doesn't exist
  2. Storage bucket is not public
  3. Storage policies are not set up
  4. File was not uploaded correctly

See: ${window.location.origin}/SETUP_AR_STORAGE.md for setup instructions`);

          setError(`Failed to load 3D model: ${asset.name}. Check Storage bucket setup.`);
          modelsLoaded++;
          setLoadedModels(modelsLoaded);

          if (modelsLoaded === selectedAssets.length) {
            setIsLoading(false);
          }
        }
      );
    });

    // If no assets, stop loading
    if (selectedAssets.length === 0) {
      setIsLoading(false);
    }

    // Add OrbitControls for desktop users
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 1.5; // Prevent going under ground
    controls.target.set(0, 0.5, 0); // Look at center, slightly up
    controlsRef.current = controls;

    // Animation loop
    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Update controls
      if (controls) {
        controls.update();
      }

      // Gentle rotation animation for models
      modelsRef.current.forEach((model, index) => {
        model.rotation.y += 0.002 * (index % 2 === 0 ? 1 : -1);
      });

      renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    function handleResize() {
      if (!containerRef.current || !camera || !renderer) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (renderer) {
        renderer.dispose();
        containerRef.current?.removeChild(renderer.domElement);
      }
    };
  }, [assets]);

  // Handle background music
  useEffect(() => {
    if (music && audioRef.current) {
      audioRef.current.src = music.audio_url;
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      if (!isMuted) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [music, isMuted]);

  // Memoize selected assets for performance
  const selectedAssets = useMemo(() => {
    return assets
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(5, assets.length));
  }, [assets]);

  const requestCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop immediately, just checking permission
      setCameraPermission("granted");
    } catch (error) {
      console.error("Camera permission denied:", error);
      setCameraPermission("denied");
      setError("Camera permission is required for AR experience");
    }
  }, []);

  const startARSession = useCallback(async () => {
    if (!rendererRef.current || !sceneRef.current || !isARSupported) return;

    try {
      // Ensure camera permission is granted
      if (cameraPermission !== "granted") {
        await requestCameraPermission();
        if (cameraPermission === "denied") {
          setError("Camera permission is required for AR mode");
          return;
        }
      }

      const session = await (navigator as any).xr.requestSession("immersive-ar", {
        requiredFeatures: ["hit-test", "local"],
        optionalFeatures: ["dom-overlay", "light-estimation"],
      });

      await rendererRef.current.xr.setSession(session);

      // Remove sky background for AR - camera feed will be the background
      if (sceneRef.current) {
        sceneRef.current.background = null;
      }

      setIsARSessionActive(true);
      setArMode("camera");

      // Handle session end
      session.addEventListener("end", () => {
        setIsARSessionActive(false);
        setArMode("preview");
        // Restore sky background
        if (sceneRef.current) {
          sceneRef.current.background = new THREE.Color(0x87ceeb);
        }
      });

    } catch (error) {
      console.error("Failed to start AR session:", error);
      setError("Failed to start AR session. Make sure you're on a compatible device.");
    }
  }, [isARSupported, cameraPermission, requestCameraPermission]);

  const stopARSession = useCallback(() => {
    if (rendererRef.current?.xr) {
      const session = rendererRef.current.xr.getSession();
      if (session) {
        session.end();
      }
    }
  }, []);

  const toggleARMode = useCallback(async () => {
    if (arMode === "preview") {
      // Switch to camera AR mode
      await startARSession();
    } else {
      // Switch back to preview mode
      stopARSession();
    }
  }, [arMode, startARSession, stopARSession]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted]);

  return (
    <div className="relative w-full h-full touch-none select-none">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Audio element */}
      {music && <audio ref={audioRef} />}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-sm">Loading AR World...</p>
            <p className="text-xs opacity-70 mt-1">{loadedModels} of {Math.min(5, assets.length)} models loaded</p>
          </div>
        </div>
      )}

      {/* Desktop mode notice */}
      {isDesktop && !isARSupported && !isLoading && !error && (
        <div className="absolute top-4 left-4 right-4 bg-blue-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-sm max-w-md mx-auto z-10">
          <div className="flex items-center gap-2 mb-1">
            <MousePointer2 size={16} />
            <p className="font-semibold">Desktop 3D Preview Mode</p>
          </div>
          <p className="text-xs opacity-90">
            AR camera mode requires a mobile device. Use mouse to rotate view, scroll to zoom.
          </p>
        </div>
      )}

      {/* Camera permission prompt */}
      {!isDesktop && cameraPermission === "prompt" && !isLoading && !error && (
        <div className="absolute top-4 left-4 right-4 bg-green-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-sm max-w-md mx-auto z-10">
          <div className="flex items-center gap-2 mb-1">
            <Camera size={16} />
            <p className="font-semibold">Camera Access Required</p>
          </div>
          <p className="text-xs opacity-90 mb-2">
            Allow camera access to experience AR with real environment
          </p>
          <button
            onClick={requestCameraPermission}
            className="px-3 py-1.5 bg-white text-green-600 rounded-md text-xs font-semibold hover:bg-green-50 transition-colors"
          >
            Allow Camera
          </button>
        </div>
      )}

      {/* Camera permission denied notice */}
      {!isDesktop && cameraPermission === "denied" && !isLoading && !error && (
        <div className="absolute top-4 left-4 right-4 bg-yellow-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-sm max-w-md mx-auto z-10">
          <div className="flex items-center gap-2 mb-1">
            <Camera size={16} />
            <p className="font-semibold">Camera Access Denied</p>
          </div>
          <p className="text-xs opacity-90">
            Enable camera in browser settings to use AR camera mode. Using 3D preview for now.
          </p>
        </div>
      )}

      {/* Error message */}
      {error && !isLoading && (
        <div className="absolute top-4 left-4 right-4 bg-red-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-sm max-w-md mx-auto z-10">
          <p className="font-semibold mb-1">⚠️ Loading Error</p>
          <p className="text-xs opacity-90 mb-2">{error}</p>
          <p className="text-xs opacity-75">
            Open browser console (F12) for details or check <a href="/SETUP_AR_STORAGE.md" target="_blank" className="underline">setup guide</a>
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-3 sm:gap-4 px-4 flex-wrap">
        {isARSupported && cameraPermission === "granted" && !isLoading && (
          <button
            onClick={toggleARMode}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 backdrop-blur-sm rounded-full font-semibold text-sm sm:text-base shadow-lg active:scale-95 transition-all flex items-center gap-2 ${
              arMode === "camera"
                ? "bg-red-500/90 text-white hover:bg-red-600"
                : "bg-white/90 text-gray-900 hover:bg-white"
            }`}
          >
            <Camera size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">
              {arMode === "camera" ? "Exit AR Camera" : "Enter AR Camera"}
            </span>
            <span className="xs:hidden">{arMode === "camera" ? "Exit AR" : "AR Camera"}</span>
          </button>
        )}

        {music && (
          <button
            onClick={toggleMute}
            className="p-2.5 sm:p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white active:scale-95 transition-all"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={18} className="sm:w-5 sm:h-5" /> : <Volume2 size={18} className="sm:w-5 sm:h-5" />}
          </button>
        )}

        {onClose && (
          <button
            onClick={onClose}
            className="p-2.5 sm:p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white active:scale-95 transition-all"
            aria-label="Close"
          >
            <XCircle size={18} className="sm:w-5 sm:h-5" />
          </button>
        )}
      </div>

      {/* Mobile AR Instructions */}
      {!isLoading && !isDesktop && cameraPermission === "granted" && !error && (
        <div className="absolute top-4 left-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm max-w-md mx-auto z-10">
          <p className="font-semibold mb-0.5 sm:mb-1">
            {arMode === "camera" ? "AR Camera Mode Active" : "3D Preview Mode"}
          </p>
          <p className="text-[10px] sm:text-xs opacity-90 leading-relaxed">
            {arMode === "camera"
              ? "Move your device to see animals in your real environment"
              : isARSupported
              ? "Tap 'Enter AR Camera' to see animals with your camera"
              : "Explore the 3D environment - drag to rotate view"}
          </p>
        </div>
      )}
    </div>
  );
}
