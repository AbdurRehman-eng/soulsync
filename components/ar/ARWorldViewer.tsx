"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { ARAsset, ARWorldMusic } from "@/types";
import { Camera, Eye, Volume2, VolumeX, XCircle, MousePointer2, ArrowLeft } from "lucide-react";

interface ARWorldViewerProps {
  assets: ARAsset[];
  music?: ARWorldMusic;
  onClose?: () => void;
}

export function ARWorldViewer({ assets, music, onClose }: ARWorldViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const modelsRef = useRef<THREE.Object3D[]>([]);
  const controlsRef = useRef<OrbitControls | null>(null);
  const groundRef = useRef<THREE.Mesh | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [loadedModels, setLoadedModels] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [arMode, setArMode] = useState<"preview" | "camera">("preview");
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    const desktop = !('ontouchstart' in window) || window.innerWidth > 1024;
    setIsDesktop(desktop);
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 3);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x7ec850,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    groundRef.current = ground;

    // Load 3D models
    const loader = new GLTFLoader();
    let modelsLoaded = 0;

    const selectedAssets = assets
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(5, assets.length));

    selectedAssets.forEach((asset, index) => {
      console.log(`[AR World] Loading model: ${asset.name} from ${asset.model_url}`);
      loader.load(
        asset.model_url,
        (gltf) => {
          console.log(`[AR World] Successfully loaded: ${asset.name}`);
          const model = gltf.scene;
          model.scale.set(asset.scale, asset.scale, asset.scale);

          const angle = (index / selectedAssets.length) * Math.PI * 2;
          const radius = 2 + Math.random() * 1;
          model.position.set(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
          );
          model.rotation.y = Math.random() * Math.PI * 2;
          model.castShadow = true;
          model.receiveShadow = true;

          scene.add(model);
          modelsRef.current.push(model);
          modelsLoaded++;
          setLoadedModels(modelsLoaded);
          if (modelsLoaded === selectedAssets.length) setIsLoading(false);
        },
        undefined,
        (loadError) => {
          console.error(`[AR World] Failed to load model ${asset.name}:`, loadError);
          setError(`Failed to load 3D model: ${asset.name}. Check Storage bucket setup.`);
          modelsLoaded++;
          setLoadedModels(modelsLoaded);
          if (modelsLoaded === selectedAssets.length) setIsLoading(false);
        }
      );
    });

    if (selectedAssets.length === 0) setIsLoading(false);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 1.5;
    controls.target.set(0, 0.5, 0);
    controlsRef.current = controls;

    // Animation loop
    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate);
      if (controls) controls.update();
      modelsRef.current.forEach((model, i) => {
        model.rotation.y += 0.002 * (i % 2 === 0 ? 1 : -1);
      });
      renderer.render(scene, camera);
    }
    animate();

    function handleResize() {
      if (!containerRef.current || !camera || !renderer) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (controlsRef.current) controlsRef.current.dispose();
      if (renderer) {
        renderer.dispose();
        containerRef.current?.removeChild(renderer.domElement);
      }
    };
  }, [assets]);

  // Background music
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

  // Start camera stream for AR camera mode
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(console.error);
      }

      // Make Three.js canvas transparent so video shows through
      if (sceneRef.current) {
        sceneRef.current.background = null;
      }
      // Hide ground plane in camera mode
      if (groundRef.current) {
        groundRef.current.visible = false;
      }

      setCameraReady(true);
      setArMode("camera");
    } catch (err) {
      console.error("Failed to start camera:", err);
      setError("Camera access denied. Please enable camera in browser settings.");
    }
  }, []);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Restore scene background and ground
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(0x87ceeb);
    }
    if (groundRef.current) {
      groundRef.current.visible = true;
    }

    setCameraReady(false);
    setArMode("preview");
  }, []);

  // Toggle between preview and camera
  const toggleARMode = useCallback(async () => {
    if (arMode === "preview") {
      await startCamera();
    } else {
      stopCamera();
    }
  }, [arMode, startCamera, stopCamera]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
    <div className="relative w-full h-full touch-none select-none overflow-hidden">
      {/* Camera video background - behind everything */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className={`absolute inset-0 w-full h-full object-cover ${arMode === "camera" ? "block" : "hidden"}`}
      />

      {/* 3D Canvas Container - on top of video */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Audio element */}
      {music && <audio ref={audioRef} />}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-sm">Loading AR World...</p>
            <p className="text-xs opacity-70 mt-1">{loadedModels} of {Math.min(5, assets.length)} models loaded</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && !isLoading && (
        <div className="absolute top-16 left-4 right-4 bg-red-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-sm max-w-md mx-auto z-30">
          <p className="font-semibold mb-1">Loading Error</p>
          <p className="text-xs opacity-90">{error}</p>
        </div>
      )}

      {/* Top controls - Back button + Mode indicator */}
      {!isLoading && (
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-30">
          {/* Back button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2.5 bg-black/60 backdrop-blur-sm rounded-full shadow-lg active:scale-95 transition-all text-white"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          {/* Mode indicator */}
          <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs max-w-[200px]">
            <p className="font-semibold">
              {arMode === "camera" ? "AR Camera Mode" : isDesktop ? "Desktop Preview" : "3D Preview"}
            </p>
            <p className="text-[10px] opacity-80 mt-0.5">
              {arMode === "camera"
                ? "Move device to explore"
                : isDesktop
                ? "Mouse to rotate, scroll to zoom"
                : "Drag to rotate, pinch to zoom"}
            </p>
          </div>
        </div>
      )}

      {/* Bottom controls */}
      {!isLoading && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-3 px-4 z-30">
          {/* AR Camera toggle button - always visible on mobile */}
          {!isDesktop && (
            <button
              onClick={toggleARMode}
              className={`px-5 py-3 backdrop-blur-sm rounded-full font-semibold text-sm shadow-lg active:scale-95 transition-all flex items-center gap-2 ${
                arMode === "camera"
                  ? "bg-red-500/90 text-white"
                  : "bg-white/90 text-gray-900"
              }`}
            >
              {arMode === "camera" ? (
                <>
                  <Eye size={18} />
                  <span>3D Preview</span>
                </>
              ) : (
                <>
                  <Camera size={18} />
                  <span>AR Camera</span>
                </>
              )}
            </button>
          )}

          {/* Mute button */}
          {music && (
            <button
              onClick={toggleMute}
              className="p-3 bg-black/60 backdrop-blur-sm rounded-full shadow-lg active:scale-95 transition-all text-white"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
