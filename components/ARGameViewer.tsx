"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  X,
  Play,
  Trophy,
  Target,
  Clock,
  Volume2,
  VolumeX,
  Gamepad2,
  Camera,
  CameraOff,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ARGameType, ARGameConfig } from "@/types";
import * as THREE from "three";

interface ARGameViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  instructions: string;
  arType: ARGameType;
  arConfig: ARGameConfig;
  maxScore: number;
  onGameComplete: (score: number) => void;
}

export function ARGameViewer({
  isOpen,
  onClose,
  title,
  instructions,
  arType,
  arConfig,
  maxScore,
  onGameComplete,
}: ARGameViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [gameState, setGameState] = useState<
    "requesting_camera" | "ready" | "playing" | "complete"
  >("requesting_camera");
  const [cameraStatus, setCameraStatus] = useState<
    "pending" | "granted" | "denied" | "unavailable"
  >("pending");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(arConfig.gameTime);
  const [soundEnabled, setSoundEnabled] = useState(arConfig.soundEnabled);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectsRef = useRef<THREE.Mesh[]>([]);
  const animationFrameRef = useRef<number>();

  // Request camera access when the component opens
  const requestCamera = useCallback(async () => {
    setCameraStatus("pending");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraStatus("granted");
      setGameState("ready");
    } catch (err: any) {
      console.error("Camera access error:", err);
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setCameraStatus("denied");
      } else {
        setCameraStatus("unavailable");
      }
      // Still allow playing without camera
      setGameState("ready");
    }
  }, []);

  // Request camera when opened
  useEffect(() => {
    if (isOpen) {
      setGameState("requesting_camera");
      requestCamera();
    }

    return () => {
      // Stop camera stream on close
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, requestCamera]);

  // Initialize Three.js scene when playing
  useEffect(() => {
    if (!isOpen || !canvasRef.current || gameState !== "playing") return;

    const scene = new THREE.Scene();
    scene.background = null; // Transparent so camera feed shows through
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Animation loop
    let lastSpawnTime = Date.now();
    const spawnInterval = 1000 / arConfig.spawnRate;

    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate);

      const now = Date.now();

      // Update objects
      objectsRef.current.forEach((obj, index) => {
        if (arType === "balloon_pop") {
          obj.position.y += 0.02;
          obj.rotation.y += 0.01;
          if (obj.position.y > 10) {
            scene.remove(obj);
            objectsRef.current.splice(index, 1);
          }
        } else if (arType === "catch_game") {
          obj.position.y -= 0.03;
          obj.rotation.z += 0.02;
          if (obj.position.y < -10) {
            scene.remove(obj);
            objectsRef.current.splice(index, 1);
          }
        } else if (arType === "target_tap" || arType === "reaction_time") {
          obj.position.y += Math.sin(Date.now() * 0.005 + index) * 0.005;
          obj.rotation.y += 0.02;
        }
      });

      // Spawn new objects
      if (
        now - lastSpawnTime > spawnInterval &&
        objectsRef.current.length < 20
      ) {
        spawnObject();
        lastSpawnTime = now;
      }

      if (rendererRef.current && cameraRef.current) {
        rendererRef.current.render(scene, cameraRef.current);
      }
    }

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      objectsRef.current.forEach((obj) => scene.remove(obj));
      objectsRef.current = [];
      renderer.dispose();
    };
  }, [isOpen, gameState, arType, arConfig]);

  // Game timer
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("complete");
            onGameComplete(score);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft, score, onGameComplete]);

  const spawnObject = () => {
    if (!sceneRef.current) return;

    const geometry = createGeometry();
    const material = new THREE.MeshPhongMaterial({
      color: arConfig.objectColor,
      shininess: 100,
      specular: 0x444444,
    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.x = (Math.random() - 0.5) * 8;
    mesh.position.y = arType === "catch_game" ? 8 : -5;
    mesh.position.z = (Math.random() - 0.5) * 3;

    if (arConfig.specialEffects.includes("glow")) {
      const glowGeometry = geometry.clone();
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: arConfig.objectColor,
        transparent: true,
        opacity: 0.3,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.scale.multiplyScalar(1.2);
      mesh.add(glow);
    }

    sceneRef.current.add(mesh);
    objectsRef.current.push(mesh);
  };

  const createGeometry = (): THREE.BufferGeometry => {
    switch (arConfig.objectType) {
      case "balloon":
        return new THREE.SphereGeometry(0.5, 16, 16);
      case "target":
        return new THREE.TorusGeometry(0.5, 0.1, 16, 32);
      case "coin":
        return new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
      case "star":
        return createStarGeometry();
      case "gift":
        return new THREE.BoxGeometry(0.6, 0.6, 0.6);
      case "heart":
        return createHeartGeometry();
      default:
        return new THREE.SphereGeometry(0.5, 16, 16);
    }
  };

  const createStarGeometry = (): THREE.BufferGeometry => {
    const shape = new THREE.Shape();
    const outerRadius = 0.5;
    const innerRadius = 0.2;
    const points = 5;

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI / points) * i;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }

    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: false });
  };

  const createHeartGeometry = (): THREE.BufferGeometry => {
    const shape = new THREE.Shape();
    const x = 0,
      y = 0;
    shape.moveTo(x, y);
    shape.bezierCurveTo(x + 0.3, y - 0.3, x + 0.6, y, x, y + 0.5);
    shape.bezierCurveTo(x - 0.6, y, x - 0.3, y - 0.3, x, y);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: true });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== "playing" || !cameraRef.current || !rendererRef.current)
      return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(objectsRef.current);

    if (intersects.length > 0) {
      const hitObject = intersects[0].object as THREE.Mesh;
      handleObjectHit(hitObject);
    }
  };

  const handleObjectHit = (object: THREE.Mesh) => {
    const index = objectsRef.current.indexOf(object);
    if (index > -1) {
      objectsRef.current.splice(index, 1);
    }

    if (sceneRef.current) {
      if (arConfig.specialEffects.includes("particles")) {
        createParticleExplosion(object.position);
      }
      sceneRef.current.remove(object);
    }

    const points = 10;
    setScore((prev) => prev + points);

    if (soundEnabled && arConfig.soundEnabled) {
      playHitSound();
    }

    if (arConfig.hapticEnabled && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const createParticleExplosion = (position: THREE.Vector3) => {
    if (!sceneRef.current) return;

    for (let i = 0; i < 20; i++) {
      const geometry = new THREE.SphereGeometry(0.05, 4, 4);
      const material = new THREE.MeshBasicMaterial({
        color: arConfig.objectColor,
        transparent: true,
        opacity: 1,
      });
      const particle = new THREE.Mesh(geometry, material);
      particle.position.copy(position);

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3
      );

      sceneRef.current.add(particle);

      let opacity = 1;
      const animateParticle = () => {
        particle.position.add(velocity);
        opacity -= 0.05;
        material.opacity = opacity;
        if (opacity > 0) {
          requestAnimationFrame(animateParticle);
        } else {
          sceneRef.current?.remove(particle);
        }
      };
      animateParticle();
    }
  };

  const playHitSound = () => {
    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch {
      // Ignore audio errors
    }
  };

  const handleStartGame = () => {
    setGameState("playing");
    setScore(0);
    setTimeLeft(arConfig.gameTime);
  };

  const handleRestart = () => {
    setGameState("ready");
    setScore(0);
    setTimeLeft(arConfig.gameTime);
    objectsRef.current.forEach((obj) => sceneRef.current?.remove(obj));
    objectsRef.current = [];
  };

  const handleCloseGame = () => {
    setGameState("requesting_camera");
    setCameraStatus("pending");
    setScore(0);
    setTimeLeft(arConfig.gameTime);
    objectsRef.current.forEach((obj) => sceneRef.current?.remove(obj));
    objectsRef.current = [];
    // Stop camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    onClose();
  };

  const progress = (score / arConfig.targetScore) * 100;
  const isWinner = score >= arConfig.targetScore;
  const hasCamera = cameraStatus === "granted";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black"
        >
          {/* Camera Video Feed (behind everything) */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
            style={{ display: hasCamera ? "block" : "none" }}
          />

          {/* Dark overlay when no camera (fallback background) */}
          {!hasCamera && (
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />
          )}

          {/* Game Canvas (transparent, overlays camera) */}
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="absolute inset-0 w-full h-full"
            style={{ touchAction: "none" }}
          />

          {/* HUD Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top Bar */}
            <div className="p-4 flex items-center justify-between pointer-events-auto">
              <button
                onClick={handleCloseGame}
                className="p-2 rounded-lg bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
              >
                <X size={24} className="text-white" />
              </button>

              {gameState === "playing" && (
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm flex items-center gap-1.5">
                    <Clock size={16} className="text-white" />
                    <span className="text-white font-bold">{timeLeft}s</span>
                  </div>

                  <div className="px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm flex items-center gap-1.5">
                    <Trophy size={16} className="text-yellow-500" />
                    <span className="text-white font-bold">{score}</span>
                  </div>

                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 rounded-lg bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
                  >
                    {soundEnabled ? (
                      <Volume2 size={16} className="text-white" />
                    ) : (
                      <VolumeX size={16} className="text-white" />
                    )}
                  </button>
                </div>
              )}

              {/* Camera status indicator */}
              {gameState !== "requesting_camera" && (
                <div
                  className={`p-2 rounded-lg backdrop-blur-sm ${
                    hasCamera ? "bg-green-500/30" : "bg-orange-500/30"
                  }`}
                >
                  {hasCamera ? (
                    <Camera size={16} className="text-green-400" />
                  ) : (
                    <CameraOff size={16} className="text-orange-400" />
                  )}
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {gameState === "playing" && (
              <div className="absolute top-20 left-4 right-4">
                <div className="h-2 bg-black/50 backdrop-blur-sm rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                  />
                </div>
                <p className="text-white text-sm mt-2 text-center drop-shadow-lg">
                  Target: {arConfig.targetScore} points
                </p>
              </div>
            )}

            {/* Camera Permission / Loading Screen */}
            {gameState === "requesting_camera" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center p-4 pointer-events-auto bg-black/80"
              >
                <div className="text-center max-w-sm">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-6"
                  >
                    <Camera size={40} className="text-blue-500" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    Setting up AR Camera...
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Please allow camera access for the AR experience
                  </p>
                </div>
              </motion.div>
            )}

            {/* Start Screen */}
            {gameState === "ready" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center p-4 pointer-events-auto"
              >
                <div className="glass-card max-w-md w-full p-6 text-center bg-black/60 backdrop-blur-xl border border-white/10">
                  <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {title}
                  </h2>
                  <p className="text-gray-300 mb-4">{instructions}</p>

                  {/* Camera status banner */}
                  {cameraStatus === "denied" && (
                    <div className="mb-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-start gap-2 text-left">
                      <AlertTriangle
                        size={18}
                        className="text-orange-400 flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-orange-400 text-sm font-medium">
                          Camera access denied
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          The game will work without the camera, but for the
                          full AR experience, allow camera access in your browser
                          settings.
                        </p>
                      </div>
                    </div>
                  )}

                  {cameraStatus === "unavailable" && (
                    <div className="mb-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-start gap-2 text-left">
                      <CameraOff
                        size={18}
                        className="text-orange-400 flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-orange-400 text-sm font-medium">
                          Camera not available
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          No camera detected. The game will use a fallback
                          background.
                        </p>
                      </div>
                    </div>
                  )}

                  {hasCamera && (
                    <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-2">
                      <Camera size={18} className="text-green-400" />
                      <p className="text-green-400 text-sm font-medium">
                        AR Camera ready
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="p-3 rounded-lg bg-white/10">
                      <Target className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                      <p className="text-gray-400">Target</p>
                      <p className="text-white font-bold">
                        {arConfig.targetScore} pts
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/10">
                      <Clock className="w-5 h-5 mx-auto mb-1 text-green-500" />
                      <p className="text-gray-400">Time</p>
                      <p className="text-white font-bold">
                        {arConfig.gameTime}s
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleStartGame}
                    className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Play size={24} />
                    Start Game
                  </button>
                </div>
              </motion.div>
            )}

            {/* End Screen */}
            {gameState === "complete" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center p-4 pointer-events-auto"
              >
                <div className="glass-card max-w-md w-full p-6 text-center bg-black/60 backdrop-blur-xl border border-white/10">
                  <Trophy
                    className={`w-20 h-20 mx-auto mb-4 ${
                      isWinner ? "text-yellow-500" : "text-gray-500"
                    }`}
                  />
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {isWinner ? "You Won!" : "Game Over"}
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Final Score:{" "}
                    <span className="text-2xl font-bold text-white">
                      {score}
                    </span>
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={handleRestart}
                      className="flex-1 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={handleCloseGame}
                      className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
