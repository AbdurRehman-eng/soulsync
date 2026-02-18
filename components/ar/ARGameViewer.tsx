"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { ARGameType, ARGameConfig } from "@/types";
import { Camera, XCircle, Trophy, Target } from "lucide-react";

interface ARGameViewerProps {
  gameType: ARGameType;
  config: ARGameConfig;
  title: string;
  instructions: string;
  onClose?: () => void;
  onGameEnd?: (score: number) => void;
}

export function ARGameViewer({
  gameType,
  config,
  title,
  instructions,
  onClose,
  onGameEnd,
}: ARGameViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const gameObjectsRef = useRef<THREE.Object3D[]>([]);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  const [isARSupported, setIsARSupported] = useState(false);
  const [gameState, setGameState] = useState<"ready" | "playing" | "ended">("ready");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.gameTime);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    // Check for WebXR support
    if ("xr" in navigator) {
      (navigator as any).xr?.isSessionSupported("immersive-ar").then((supported: boolean) => {
        setIsARSupported(supported);
      });
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || gameState !== "playing") return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Spawn game objects based on game type
    spawnGameObjects();

    // Animation loop
    let lastSpawnTime = Date.now();
    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Spawn new objects based on spawn rate
      const now = Date.now();
      const spawnInterval = (10 - config.spawnRate) * 1000; // Convert to ms
      if (now - lastSpawnTime > spawnInterval) {
        spawnGameObject();
        lastSpawnTime = now;
      }

      // Animate objects
      gameObjectsRef.current.forEach((obj, index) => {
        if (gameType === "balloon_pop" || gameType === "target_tap") {
          obj.rotation.y += 0.02;
        } else if (gameType === "catch_game") {
          obj.position.y -= 0.02; // Fall down
          if (obj.position.y < -2) {
            scene.remove(obj);
            gameObjectsRef.current.splice(index, 1);
          }
        }
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

    // Handle clicks/taps
    function handleClick(event: MouseEvent | TouchEvent) {
      if (!camera || !scene) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      let x, y;
      if (event instanceof MouseEvent) {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
      } else {
        x = event.touches[0].clientX - rect.left;
        y = event.touches[0].clientY - rect.top;
      }

      mouseRef.current.x = (x / rect.width) * 2 - 1;
      mouseRef.current.y = -(y / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(gameObjectsRef.current, true);

      if (intersects.length > 0) {
        const hitObject = intersects[0].object;
        const parentObject = gameObjectsRef.current.find(
          (obj) => obj === hitObject || obj.children.includes(hitObject)
        );

        if (parentObject) {
          // Hit! Add points and remove object
          const points = calculatePoints();
          setScore((prev) => prev + points);

          // Visual feedback
          createHitEffect(parentObject.position);

          // Haptic feedback if enabled
          if (config.hapticEnabled && "vibrate" in navigator) {
            navigator.vibrate(50);
          }

          // Remove object
          scene.remove(parentObject);
          const index = gameObjectsRef.current.indexOf(parentObject);
          if (index > -1) {
            gameObjectsRef.current.splice(index, 1);
          }
        }
      }
    }

    containerRef.current.addEventListener("click", handleClick);
    containerRef.current.addEventListener("touchstart", handleClick);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeEventListener("click", handleClick);
      containerRef.current?.removeEventListener("touchstart", handleClick);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (renderer) {
        renderer.dispose();
        containerRef.current?.removeChild(renderer.domElement);
      }
    };
  }, [gameState, config, gameType]);

  // Game timer
  useEffect(() => {
    if (gameState !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("ended");
          onGameEnd?.(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, score, onGameEnd]);

  function spawnGameObjects() {
    for (let i = 0; i < 3; i++) {
      spawnGameObject();
    }
  }

  function spawnGameObject() {
    if (!sceneRef.current) return;

    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;

    // Create object based on type
    switch (config.objectType) {
      case "balloon":
        geometry = new THREE.SphereGeometry(0.3, 32, 32);
        material = new THREE.MeshStandardMaterial({
          color: config.objectColor,
          metalness: 0.1,
          roughness: 0.3,
        });
        break;
      case "star":
        geometry = new THREE.OctahedronGeometry(0.3);
        material = new THREE.MeshStandardMaterial({
          color: config.objectColor,
          emissive: config.objectColor,
          emissiveIntensity: 0.3,
        });
        break;
      case "heart":
        geometry = new THREE.SphereGeometry(0.25, 32, 32);
        material = new THREE.MeshStandardMaterial({
          color: config.objectColor,
          metalness: 0.2,
          roughness: 0.4,
        });
        break;
      default:
        geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        material = new THREE.MeshStandardMaterial({ color: config.objectColor });
    }

    const mesh = new THREE.Mesh(geometry, material);

    // Position randomly in front of camera
    const angle = Math.random() * Math.PI * 2;
    const distance = 2 + Math.random() * 2;
    const height = gameType === "catch_game" ? 3 : 1 + Math.random();

    mesh.position.set(
      Math.cos(angle) * distance,
      height,
      Math.sin(angle) * distance
    );

    sceneRef.current.add(mesh);
    gameObjectsRef.current.push(mesh);
  }

  function createHitEffect(position: THREE.Vector3) {
    if (!sceneRef.current) return;

    // Create particle effect
    const particleCount = 10;
    const particles = new THREE.Group();

    for (let i = 0; i < particleCount; i++) {
      const geometry = new THREE.SphereGeometry(0.05, 8, 8);
      const material = new THREE.MeshBasicMaterial({ color: config.objectColor });
      const particle = new THREE.Mesh(geometry, material);

      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 0.1;

      particle.position.copy(position);
      particle.userData.velocity = new THREE.Vector3(
        Math.cos(angle) * speed,
        Math.random() * speed,
        Math.sin(angle) * speed
      );

      particles.add(particle);
    }

    sceneRef.current.add(particles);

    // Animate and remove
    setTimeout(() => {
      sceneRef.current?.remove(particles);
    }, 500);
  }

  function calculatePoints(): number {
    const basePoints = 10;
    const difficultyMultiplier = config.difficulty === "hard" ? 2 : config.difficulty === "medium" ? 1.5 : 1;
    return Math.floor(basePoints * difficultyMultiplier);
  }

  function startGame() {
    setShowInstructions(false);
    setGameState("playing");
    setScore(0);
    setTimeLeft(config.gameTime);
  }

  function restartGame() {
    setGameState("ready");
    setShowInstructions(true);
    setScore(0);
    setTimeLeft(config.gameTime);
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-purple-500 to-blue-500">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Instructions overlay */}
      {showInstructions && gameState === "ready" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center">
            <div className="text-5xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
            <p className="text-gray-600 mb-6">{instructions}</p>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="bg-purple-50 rounded-lg p-3">
                <Target className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                <p className="font-semibold">Target Score</p>
                <p className="text-purple-600">{config.targetScore}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <Trophy className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                <p className="font-semibold">Time</p>
                <p className="text-blue-600">{config.gameTime}s</p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-blue-600 transition-all"
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      {/* Game HUD */}
      {gameState === "playing" && (
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
            <p className="text-xs text-gray-600 font-medium">Score</p>
            <p className="text-2xl font-bold text-purple-600">{score}</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
            <p className="text-xs text-gray-600 font-medium">Time</p>
            <p className="text-2xl font-bold text-blue-600">{timeLeft}s</p>
          </div>
        </div>
      )}

      {/* Game end overlay */}
      {gameState === "ended" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">
              {score >= config.targetScore ? "🎉" : "😊"}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {score >= config.targetScore ? "You Won!" : "Game Over"}
            </h2>
            <p className="text-gray-600 mb-6">
              Final Score: <span className="font-bold text-purple-600 text-3xl">{score}</span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={restartGame}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all"
              >
                Play Again
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Exit
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Close button */}
      {onClose && gameState !== "ended" && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
        >
          <XCircle size={20} />
        </button>
      )}
    </div>
  );
}
