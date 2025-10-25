import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Save, Upload } from 'lucide-react';

const SimulationFramework = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const [showControls, setShowControls] = useState(true);
  
  // Simulation parameters - easily customizable
  const [parameters, setParameters] = useState({
    particleCount: 100,
    speed: 2,
    size: 5,
    gravity: 0.1,
    friction: 0.99,
    enableCollisions: true,
    trailEffect: false
  });

  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  // ============================================================
  // SIMULATION LOGIC - Replace this section with your own simulation
  // ============================================================
  
  class Particle {
    constructor(x, y, canvas) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * parameters.speed * 2;
      this.vy = (Math.random() - 0.5) * parameters.speed * 2;
      this.radius = parameters.size;
      this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
      this.canvas = canvas;
    }

    update() {
      // Apply gravity
      this.vy += parameters.gravity;
      
      // Apply friction
      this.vx *= parameters.friction;
      this.vy *= parameters.friction;
      
      // Update position
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off walls
      if (this.x - this.radius <= 0 || this.x + this.radius >= this.canvas.width) {
        this.vx *= -0.8;
        this.x = Math.max(this.radius, Math.min(this.canvas.width - this.radius, this.x));
      }

      if (this.y - this.radius <= 0 || this.y + this.radius >= this.canvas.height) {
        this.vy *= -0.8;
        this.y = Math.max(this.radius, Math.min(this.canvas.height - this.radius, this.y));
      }
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  const initSimulation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current = [];
    for (let i = 0; i < parameters.particleCount; i++) {
      particlesRef.current.push(
        new Particle(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          canvas
        )
      );
    }
  };

  const updateSimulation = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas (with trail effect option)
    if (parameters.trailEffect) {
      ctx.fillStyle = 'rgba(26, 26, 46, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Update and draw particles
    particlesRef.current.forEach(particle => {
      particle.update();
      particle.draw(ctx);
    });

    if (isPlaying && !isPaused) {
      animationRef.current = requestAnimationFrame(updateSimulation);
    }
  };

  // ============================================================
  // END OF SIMULATION LOGIC
  // ============================================================

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Handle play/pause state changes
  useEffect(() => {
    if (isPlaying && !isPaused) {
      updateSimulation();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isPaused]);

  // Handle parameter changes
  useEffect(() => {
    if (particlesRef.current.length > 0) {
      particlesRef.current.forEach(particle => {
        particle.radius = parameters.size;
      });
    }
  }, [parameters]);

  const handlePlay = () => {
    if (!isPlaying) {
      initSimulation();
    }
    setIsPlaying(true);
    setIsPaused(false);
    setShowControls(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    setShowControls(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setShowControls(true);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesRef.current = [];
  };

  const handleCanvasClick = () => {
    if (isPlaying && !isPaused) {
      handlePause();
    }
  };

  const updateParameter = (key, value) => {
    setParameters(prev => ({ ...prev, [key]: value }));
  };

  const savePreset = () => {
    const preset = JSON.stringify(parameters);
    const blob = new Blob([preset], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simulation-preset.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadPreset = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const preset = JSON.parse(event.target.result);
          setParameters(preset);
        } catch (error) {
          alert('Invalid preset file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex overflow-hidden">
      {/* Collapsible Menu */}
      <div
        className={`bg-slate-800/95 backdrop-blur-sm transition-all duration-300 ease-in-out ${
          menuOpen ? 'w-80' : 'w-0'
        } overflow-hidden shadow-2xl`}
      >
        <div className="w-80 h-full overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-between">
            Simulation Controls
            <button
              onClick={() => setMenuOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <ChevronLeft size={24} />
            </button>
          </h2>

          {/* Preset Management */}
          <div className="mb-6 space-y-2">
            <button
              onClick={savePreset}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Save size={18} />
              Save Preset
            </button>
            <label className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer">
              <Upload size={18} />
              Load Preset
              <input
                type="file"
                accept=".json"
                onChange={loadPreset}
                className="hidden"
              />
            </label>
          </div>

          {/* Parameter Controls - Customize these for your simulation */}
          <div className="space-y-6">
            {/* Particle Count Slider */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Particle Count: {parameters.particleCount}
              </label>
              <input
                type="range"
                min="10"
                max="500"
                value={parameters.particleCount}
                onChange={(e) => updateParameter('particleCount', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Speed Slider */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Speed: {parameters.speed.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={parameters.speed}
                onChange={(e) => updateParameter('speed', parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Size Slider */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Particle Size: {parameters.size}
              </label>
              <input
                type="range"
                min="2"
                max="20"
                value={parameters.size}
                onChange={(e) => updateParameter('size', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Gravity Slider */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Gravity: {parameters.gravity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={parameters.gravity}
                onChange={(e) => updateParameter('gravity', parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Friction Slider */}
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Friction: {parameters.friction.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.9"
                max="1"
                step="0.01"
                value={parameters.friction}
                onChange={(e) => updateParameter('friction', parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={parameters.enableCollisions}
                  onChange={(e) => updateParameter('enableCollisions', e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                />
                <span className="ml-3">Enable Collisions</span>
              </label>

              <label className="flex items-center text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={parameters.trailEffect}
                  onChange={(e) => updateParameter('trailEffect', e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500"
                />
                <span className="ml-3">Trail Effect</span>
              </label>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-slate-700/50 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Instructions</h3>
            <p className="text-slate-300 text-sm">
              • Click on the simulation to pause
              <br />
              • Adjust parameters in real-time
              <br />
              • Save/Load presets for later use
              <br />
              • Toggle menu with the sidebar button
            </p>
          </div>
        </div>
      </div>

      {/* Main Simulation Area */}
      <div className="flex-1 relative">
        {/* Menu Toggle Button */}
        {!menuOpen && (
          <button
            onClick={() => setMenuOpen(true)}
            className="absolute top-4 left-4 z-20 bg-slate-800/90 hover:bg-slate-700 text-white p-3 rounded-lg shadow-lg transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Canvas Container */}
        <div
          className="w-full h-full relative cursor-pointer"
          onClick={handleCanvasClick}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800"
          />

          {/* Overlay Controls */}
          {showControls && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="flex gap-4">
                {!isPlaying || isPaused ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay();
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-full shadow-2xl transition-all transform hover:scale-110"
                  >
                    <Play size={48} fill="white" />
                  </button>
                ) : null}

                {isPaused && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReset();
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white p-6 rounded-full shadow-2xl transition-all transform hover:scale-110"
                  >
                    <RotateCcw size={48} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Simulation Info Overlay */}
          {isPlaying && !isPaused && (
            <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg">
              <p className="text-sm">
                Particles: {parameters.particleCount} | 
                Speed: {parameters.speed.toFixed(1)} | 
                FPS: {Math.round(1000 / 16)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationFramework;