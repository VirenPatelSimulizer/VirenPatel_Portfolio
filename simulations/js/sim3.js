const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
for(let i=0; i<100; i++){
  particles.push({x: Math.random()*canvas.width, y: Math.random()*canvas.height, vx: Math.random()-0.5, vy: Math.random()-0.5});
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if(p.x > canvas.width || p.x < 0) p.vx *= -1;
    if(p.y > canvas.height || p.y < 0) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
    ctx.fillStyle = 'blue';
    ctx.fill();
  });
  requestAnimationFrame(animate);
}

animate();
