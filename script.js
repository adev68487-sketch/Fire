console.clear();

const fireConfig = {
  maxParticles: 500,
  spawnDelay: 10,
  lifeSpan: {
    min: 2000,
    max: 2000 },

  alpha: {
    min: 0.4,
    max: 0.6 },

  alphaDecay: {
    min: 0.2,
    max: 0.5 },

  colour: [
  '#9C2A00',
  '#9E2F03',
  '#9E1B09'],

  radius: {
    min: 10,
    max: 40 },

  radiusDecay: {
    min: 25,
    max: 50 },

  direction: {
    min: -Math.PI / 2 - 0.3,
    max: -Math.PI / 2 + 0.3 },

  speed: {
    min: 50,
    max: 200 } };



const smokeConfig = {
  maxParticles: 50,
  spawnDelay: 100,
  lifeSpan: {
    min: 6000,
    max: 10000 },

  alpha: {
    min: 0.1,
    max: 0.25 },

  alphaDecay: {
    min: 0,
    max: 0.05 },

  colour: [
  '#1A1A1A',
  '#0A0A0A',
  '#2B2B2B'],

  radius: {
    min: 20,
    max: 40 },

  radiusDecay: {
    min: 0,
    max: 5 },

  direction: {
    min: -Math.PI / 2 - 0.6,
    max: -Math.PI / 2 + 0.6 },

  speed: {
    min: 50,
    max: 100 } };



const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const mouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2 };

const fireParticles = [];
const smokeParticles = [];

window.addEventListener('resize', resize);
document.body.addEventListener('mousemove', mouseMove);
document.body.addEventListener('touchmove', touchMove);
document.body.addEventListener('mouseout', mouseOut);
document.body.addEventListener('touchend', mouseOut);
resize();
requestAnimationFrame(update);

function createParticle(array, config) {
  const p = {
    lifeSpan: getRandom(config.lifeSpan),
    life: 0,
    alpha: getRandom(config.alpha),
    alphaDecay: getRandom(config.alphaDecay),
    colour: getColour(config.colour),
    x: mouse.x,
    y: mouse.y,
    radius: getRandom(config.radius),
    radiusDecay: getRandom(config.radiusDecay),
    direction: getRandom(config.direction),
    speed: getRandom(config.speed) };


  array.push(p);
}

function createFireParticle() {
  createParticle(fireParticles, fireConfig);
}

function createSmokeParticle() {
  createParticle(smokeParticles, smokeConfig);
}

function getRandom(o) {
  return Math.random() * (o.max - o.min) + o.min;
}

function getColour(a) {
  return a[Math.floor(Math.random() * a.length)];
}

let lastTime = null;
let delta = 0;
let fireSpawnTimer = 0;
let smokeSpawnTimer = 0;
function update(timestamp) {
  if (lastTime === null) lastTime = timestamp;
  delta = timestamp - lastTime;
  lastTime = timestamp;
  fireSpawnTimer += delta;
  smokeSpawnTimer += delta;

  context.globalCompositeOperation = 'source-over';
  context.fillStyle = '#000';
  context.globalAlpha = 1;
  context.fillRect(0, 0, canvas.width, canvas.height);

  let p;
  for (let i = fireParticles.length - 1; i >= 0; i--) {
    p = fireParticles[i];

    p.life += delta;
    if (p.life >= p.lifeSpan) {
      fireParticles.splice(i, 1);
      continue;
    }

    p.alpha -= p.alphaDecay * delta / 1000;
    if (p.alpha <= 0) {
      fireParticles.splice(i, 1);
      continue;
    }

    p.radius -= p.radiusDecay * delta / 1000;
    if (p.radius <= 0) {
      fireParticles.splice(i, 1);
      continue;
    }

    p.x += p.speed * Math.cos(p.direction) * delta / 1000;
    p.y += p.speed * Math.sin(p.direction) * delta / 1000;
  }

  for (let i = smokeParticles.length - 1; i >= 0; i--) {
    p = smokeParticles[i];

    p.life += delta;
    if (p.life >= p.lifeSpan) {
      smokeParticles.splice(i, 1);
      continue;
    }

    p.alpha -= p.alphaDecay * delta / 1000;
    if (p.alpha <= 0) {
      smokeParticles.splice(i, 1);
      continue;
    }

    p.radius -= p.radiusDecay * delta / 1000;
    if (p.radius <= 0) {
      smokeParticles.splice(i, 1);
      continue;
    }

    p.x += p.speed * Math.cos(p.direction) * delta / 1000;
    p.y += p.speed * Math.sin(p.direction) * delta / 1000;
  }

  if (fireParticles.length < fireConfig.maxParticles && fireSpawnTimer >= fireConfig.spawnDelay) {
    createFireParticle();
    fireSpawnTimer -= fireConfig.spawnDelay;
  }

  if (smokeParticles.length < smokeConfig.maxParticles && smokeSpawnTimer >= smokeConfig.spawnDelay) {
    createSmokeParticle();
    smokeSpawnTimer -= smokeConfig.spawnDelay;
  }

  for (let i = 0; i < smokeParticles.length; i++) {
    p = smokeParticles[i];
    context.fillStyle = p.colour;
    context.globalAlpha = p.alpha;
    context.beginPath();
    context.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
    context.fill();
  }

  context.globalCompositeOperation = 'lighter';
  for (let i = 0; i < fireParticles.length; i++) {
    p = fireParticles[i];
    context.fillStyle = p.colour;
    context.globalAlpha = p.alpha;
    context.beginPath();
    context.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
    context.fill();
  }

  requestAnimationFrame(update);
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  mouse.x = window.innerWidth / 2;
  mouse.y = window.innerHeight / 2;
}

function mouseMove(e) {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
}

function touchMove(e) {
  e.preventDefault();
  if (e.changedTouches.length === 0) return;
  mouse.x = e.changedTouches[0].pageX;
  mouse.y = e.changedTouches[0].pageY;
}

function mouseOut() {
  mouse.x = window.innerWidth / 2;
  mouse.y = window.innerHeight / 2;
}