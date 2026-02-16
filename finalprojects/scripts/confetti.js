const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confettiParticles = [];

function createConfetti() {
  for (let i = 0; i < 100; i++) {
    confettiParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 20 + 10,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.random() * 10 - 10,
      tiltAngleIncrement: Math.random() * 0.07 + 0.05
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiParticles.forEach(p => {
    ctx.beginPath();
    ctx.lineWidth = p.r / 2;
    ctx.strokeStyle = p.color;
    ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
    ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
    ctx.stroke();

    p.tilt += p.tiltAngleIncrement;
    p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;

    if (p.y > canvas.height) {
      p.y = -10;
      p.x = Math.random() * canvas.width;
    }
  });
}

function launchConfetti() {
  createConfetti();
  let confettiInterval = setInterval(drawConfetti, 20);
  setTimeout(() => {
    clearInterval(confettiInterval);
    confettiParticles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 2000); // Confetti lasts 2 seconds
}
