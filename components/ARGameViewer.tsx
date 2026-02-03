"use client";

import { useEffect, useRef, useState } from "react";
import { X, Play, Trophy, Target, Clock, Volume2, VolumeX, Gamepad2 } from "lucide-react";
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
  const [gameState, setGameState] = useState<"ready" | "playing" | "complete">("ready");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(arConfig.gameTime);
  const [soundEnabled, setSoundEnabled] = useState(arConfig.soundEnabled);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectsRef = useRef<THREE.Mesh[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!isOpen || !canvasRef.current || gameState !== "playing") return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = null; // Transparent for AR feel
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

    // Create objects based on AR type
    createGameObjects();

    // Animation loop
    let lastSpawnTime = Date.now();
    const spawnInterval = 1000 / arConfig.spawnRate; // Convert rate to ms

    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate);

      const now = Date.now();

      // Update objects
      objectsRef.current.forEach((obj, index) => {
        if (arType === "balloon_pop") {
          // Float upward
          obj.position.y += 0.02;
          obj.rotation.y += 0.01;

          // Remove if too high
          if (obj.position.y > 10) {
            scene.remove(obj);
            objectsRef.current.splice(index, 1);
          }
        } else if (arType === "catch_game") {
          // Fall downward
          obj.position.y -= 0.03;
          obj.rotation.z += 0.02;

          // Remove if too low
          if (obj.position.y < -10) {
            scene.remove(obj);
            objectsRef.current.splice(index, 1);
          }
        } else if (arType === "target_tap" || arType === "reaction_time") {
          // Slight floating animation
          obj.position.y += Math.sin(Date.now() * 0.005 + index) * 0.005;
          obj.rotation.y += 0.02;
        }
      });

      // Spawn new objects
      if (now - lastSpawnTime > spawnInterval && objectsRef.current.length < 20) {
        spawnObject();
        lastSpawnTime = now;
      }

      if (rendererRef.current && cameraRef.current) {
        rendererRef.current.render(scene, cameraRef.current);
      }
    }

    animate();

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      objectsRef.current.forEach(obj => scene.remove(obj));
      objectsRef.current = [];
      renderer.dispose();
    };
  }, [isOpen, gameState, arType, arConfig]);

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
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

  const createGameObjects = () => {
    // Initial objects will be spawned by animation loop
  };

  const spawnObject = () => {
    if (!sceneRef.current) return;

    const geometry = createGeometry();
    const material = new THREE.MeshPhongMaterial({
      color: arConfig.objectColor,
      shininess: 100,
      specular: 0x444444,
    });

    const mesh = new THREE.Mesh(geometry, material);

    // Random position
    mesh.position.x = (Math.random() - 0.5) * 8;
    mesh.position.y = arType === "catch_game" ? 8 : -5;
    mesh.position.z = (Math.random() - 0.5) * 3;

    // Add glow effect if enabled
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

    const extrudeSettings = { depth: 0.1, bevelEnabled: false };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  };

  const createHeartGeometry = (): THREE.BufferGeometry => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x, y);
    shape.bezierCurveTo(x + 0.3, y - 0.3, x + 0.6, y, x, y + 0.5);
    shape.bezierCurveTo(x - 0.6, y, x - 0.3, y - 0.3, x, y);

    const extrudeSettings = { depth: 0.1, bevelEnabled: true };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== "playing" || !cameraRef.current || !rendererRef.current) return;

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
    // Remove object
    const index = objectsRef.current.indexOf(object);
    if (index > -1) {
      objectsRef.current.splice(index, 1);
    }

    if (sceneRef.current) {
      // Particle effect if enabled
      if (arConfig.specialEffects.includes("particles")) {
        createParticleExplosion(object.position);
      }

      sceneRef.current.remove(object);
    }

    // Update score
    const points = 10;
    setScore(prev => prev + points);

    // Play sound if enabled
    if (soundEnabled && arConfig.soundEnabled) {
      playHitSound();
    }

    // Haptic feedback if enabled
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

      // Animate particle
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
    // Simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
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
    objectsRef.current.forEach(obj => sceneRef.current?.remove(obj));
    objectsRef.current = [];
  };

  const handleCloseGame = () => {
    setGameState("ready");
    setScore(0);
    setTimeLeft(arConfig.gameTime);
    objectsRef.current.forEach(obj => sceneRef.current?.remove(obj));
    objectsRef.current = [];
    onClose();
  };

  const progress = (score / arConfig.targetScore) * 100;
  const isWinner = score >= arConfig.targetScore;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black"
        >
          {/* Game Canvas */}
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
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm flex items-center gap-2">
                    <Clock size={20} className="text-white" />
                    <span className="text-white font-bold text-lg">{timeLeft}s</span>
                  </div>

                  <div className="px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm flex items-center gap-2">
                    <Trophy size={20} className="text-yellow-500" />
                    <span className="text-white font-bold text-lg">{score}</span>
                  </div>

                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 rounded-lg bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
                  >
                    {soundEnabled ? (
                      <Volume2 size={20} className="text-white" />
                    ) : (
                      <VolumeX size={20} className="text-white" />
                    )}
                  </button>
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
                <p className="text-white text-sm mt-2 text-center">
                  Target: {arConfig.targetScore} points
                </p>
              </div>
            )}

            {/* Start Screen */}
            {gameState === "ready" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center p-4 pointer-events-auto"
              >
                <div className="glass-card max-w-md w-full p-6 text-center">
                  <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                  <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                  <p className="text-gray-300 mb-6">{instructions}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="p-3 rounded-lg bg-white/10">
                      <Target className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                      <p className="text-gray-400">Target</p>
                      <p className="text-white font-bold">{arConfig.targetScore} pts</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/10">
                      <Clock className="w-5 h-5 mx-auto mb-1 text-green-500" />
                      <p className="text-gray-400">Time</p>
                      <p className="text-white font-bold">{arConfig.gameTime}s</p>
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
                <div className="glass-card max-w-md w-full p-6 text-center">
                  <Trophy className={`w-20 h-20 mx-auto mb-4 ${isWinner ? "text-yellow-500" : "text-gray-500"}`} />
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {isWinner ? "You Won!" : "Game Over"}
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Final Score: <span className="text-2xl font-bold text-white">{score}</span>
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
