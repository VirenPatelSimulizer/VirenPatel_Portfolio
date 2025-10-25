// ------------------- Variables -------------------
const showSimBtn = document.getElementById('showSimBtn');
const simContainer = document.getElementById('simContainer');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const controls = document.getElementById('controls');
const playBtn = document.getElementById('playBtn');
const resetBtn = document.getElementById('resetBtn');

// Parameter elements
const particleCountSlider = document.getElementById('particleCount');
const speedSlider = document.getElementById('speed');
const sizeSlider = document.getElementById('size');
const gravitySlider = document.getElementById('gravity');
const frictionSlider = document.getElementById('friction');
const enableCollisionsCheckbox = document.getElementById('enableCollisions');
const trailEffectCheckbox = document.getElementById('trailEffect');

// Parameter display spans
const particleCountVal = document.getElementById('particleCountVal');
const speedVal = document.getElementById('speedVal');
const sizeVal = document.getElementById('sizeVal');
const gravityVal = document.getElementById('gravityVal');
const frictionVal = document.getElementById('frictionVal');

// ------------------- Simulation State -------------------
let particles = [];
let animationId;
let isPlaying = false;
let isPaused = false;

// Default parameters
let parameters = {
  particleCount: parseInt(particleCountSlider.value),
  speed: parseFloat(speedSlider.value),
  size: parseInt(sizeSlider.value),
  gravity: parseFloat(gravitySlider.value),
  friction: parseFloat(frictionSlider.value),
  enableCollisions: enableCollisionsCheckbox.checked,
  trailEffect: trailEffectCheckbox.checked
};

// ------------------- Particle Class -------------------
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * parameters.speed * 2;
    this.vy = (Math.random() - 0.5) * parameters.speed * 2;
    this.radius = parameters.size;
    this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
  }

  update() {
    this.vy += parameters.gravity;
    this.vx *= parameters.friction;
    this.vy *= parameters.friction;

    this.x += this.vx;
    this.y += this.vy;

    if (parameters.enableCollisions) {
      if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
        this.vx *= -0.8;
        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
      }
      if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
        this.vy *= -0.8;
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

// ------------------- Simulation Functions -------------------
function initSimulation() {
  particles = [];
  for (let i=0; i<parameters.particleCount; i++) {
    particles.push(new Particle(Math.random()*canvas.width, Math.random()*canvas.height));
  }
}

function updateSimulation() {
  if (parameters.trailEffect) {
    ctx.fillStyle = 'rgba(26,26,46,0.1)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
  } else {
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }

  particles.forEach(p => { p.update(); p.draw(); });

  if (isPlaying && !isPaused) {
    animationId = requestAnimationFrame(updateSimulation);
  }
}

function handlePlay() {
  if (!isPlaying) initSimulation();
  isPlaying = true;
  isPaused = false;
  controls.style.display = 'none';
  updateSimulation();
}

function handlePause() {
  isPaused = true;
  controls.style.display = 'flex';
  cancelAnimationFrame(animationId);
}

function handleReset() {
  isPlaying = false;
  isPaused = false;
  controls.style.display = 'flex';
  cancelAnimationFrame(animationId);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles = [];
}

// ------------------- Event Listeners -------------------
showSimBtn.addEventListener('click', () => { simContainer.style.display='block'; showSimBtn.style.display='none'; handlePlay(); });

canvas.addEventListener('click', () => { if(isPlaying && !isPaused) handlePause(); });

playBtn.addEventListener('click', handlePlay);
resetBtn.addEventListener('click', handleReset);

function updateParameterFromSlider(slider, valSpan, key) {
  slider.addEventListener('input', () => {
    parameters[key] = slider.type==='checkbox'? slider.checked : parseFloat(slider.value);
    valSpan.textContent = slider.value;
    if(key==='size') particles.forEach(p=>p.radius=parameters.size);
  });
}

updateParameterFromSlider(particleCountSlider, particleCountVal, 'particleCount');
updateParameterFromSlider(speedSlider, speedVal, 'speed');
updateParameterFromSlider(sizeSlider, sizeVal, 'size');
updateParameterFromSlider(gravitySlider, gravityVal, 'gravity');
updateParameterFromSlider(frictionSlider, frictionVal, 'friction');
updateParameterFromSlider(enableCollisionsCheckbox, null, 'enableCollisions');
updateParameterFromSlider(trailEffectCheckbox, null, 'trailEffect');

// ------------------- Resize Canvas -------------------
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
