import * as THREE from 'three';

// Particle wordmark: points sampled from rendered text, assembled from a
// galaxy-like scatter, repelled by the cursor and dissolved on scroll.

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uAssemble;
  uniform float uScroll;
  uniform float uScale;
  uniform float uLift;
  uniform float uPixelRatio;
  uniform vec2  uMouse;
  attribute vec3 aScatter;
  attribute float aRand;
  attribute float aLine;
  varying float vRand;
  varying float vLine;
  varying float vAlpha;

  void main() {
    vec3 text = position * uScale + vec3(0.0, uLift, 0.0);
    // ease each particle individually so the assembly ripples
    float t = clamp(uAssemble * 1.6 - aRand * 0.6, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 p = mix(aScatter, text, t);

    // idle breathing
    p.x += sin(uTime * 0.6 + aRand * 40.0) * 0.012;
    p.y += cos(uTime * 0.7 + aRand * 30.0) * 0.012;
    p.z += sin(uTime * 0.5 + aRand * 20.0) * 0.05;

    // cursor repulsion
    vec2 d = p.xy - uMouse;
    float dist = length(d);
    float force = smoothstep(1.4, 0.0, dist) * (1.0 - uScroll);
    p.xy += normalize(d + 0.0001) * force * 0.55;
    p.z  += force * 0.8;

    // scroll: swirl outwards into a galaxy and towards camera
    float s = uScroll;
    float ang = s * (2.5 + aRand * 3.0);
    mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
    vec3 g = aScatter * (1.0 + s * 1.5);
    g.xy = rot * g.xy;
    g.z += s * 6.0 * aRand;
    p = mix(p, g, smoothstep(0.0, 1.0, s));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (2.0 + aRand * 2.6 + aLine * 0.5) * uPixelRatio * (8.0 / -mv.z);
    vRand = aRand;
    vLine = aLine;
    vAlpha = 0.35 + 0.65 * t;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uScroll;
  uniform float uTime;
  varying float vRand;
  varying float vLine;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.0, d);
    // VENTURA: hot red -> orange. MALL: orange -> gold, slightly brighter.
    vec3 col = mix(uColorA, uColorB, vRand);
    col = mix(col, mix(uColorB, uColorC, vRand), vLine);
    // occasional sparkle
    float sparkle = step(0.985, fract(vRand * 91.0 + uTime * 0.15)) * 0.8;
    col += sparkle;
    gl_FragColor = vec4(col, a * vAlpha * (1.0 + vLine * 0.15) * (1.0 - uScroll * 0.55));
  }
`;

function sampleText(lines, count) {
  // Draws each line (big VENTURA, then a tracked-out MALL underneath) and
  // samples filled pixels. Returns positions and a per-point line index.
  const w = 1600;
  const h = 620;
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const layers = lines.map((l) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#fff';
    // shrink the font until the line fits the sampling canvas (no cropping)
    let size = l.size;
    const fit = () => {
      ctx.font = `${l.weight} ${size}px "Syne", "Helvetica Neue", Arial, sans-serif`;
      if ('letterSpacing' in ctx) ctx.letterSpacing = `${(l.tracking || 0) * (size / l.size)}px`;
      return ctx.measureText(l.text).width;
    };
    while (fit() > w * 0.94 && size > 40) size -= 6;
    ctx.fillText(l.text, w / 2 + ((l.tracking || 0) * (size / l.size)) / 2, l.y);
    const data = ctx.getImageData(0, 0, w, h).data;
    const pts = [];
    for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) if (data[(y * w + x) * 4 + 3] > 128) pts.push([x, y]);
    return pts;
  });
  const total = layers.reduce((n, p) => n + p.length, 0) || 1;
  const pos = new Float32Array(count * 3);
  const line = new Float32Array(count);
  let i = 0;
  layers.forEach((pts, li) => {
    const n = li === layers.length - 1 ? count - i : Math.round((count * pts.length) / total);
    for (let k = 0; k < n && i < count; k++, i++) {
      const p = pts[Math.floor(Math.random() * pts.length)] || [w / 2, h / 2];
      pos[i * 3] = (p[0] - w / 2) / w + (Math.random() - 0.5) * 0.002;
      pos[i * 3 + 1] = -(p[1] - h / 2) / w + (Math.random() - 0.5) * 0.002;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      line[i] = li;
    }
  });
  return { pos, line };
}

export function createHero(canvas) {
  const isPhone = window.innerWidth < 768 || window.matchMedia('(hover: none)').matches;
  // phones: no MSAA and a lower pixel ratio — the points are soft glows anyway
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isPhone, alpha: true, powerPreference: isPhone ? 'low-power' : 'high-performance' });
  const pr = Math.min(window.devicePixelRatio, isPhone ? 1.5 : 2);
  renderer.setPixelRatio(pr);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  const COUNT = isPhone ? 8000 : 30000;
  const { pos: text, line } = sampleText([
    { text: 'VENTURA', size: 300, weight: 800, y: 205 },
    { text: 'MALL', size: 150, weight: 800, y: 420, tracking: 90 },
  ], COUNT);

  const scatter = new Float32Array(COUNT * 3);
  const rand = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    // flattened galaxy disc with spiral arms
    const r = 2 + Math.pow(Math.random(), 0.7) * 9;
    const arm = (i % 3) * ((Math.PI * 2) / 3);
    const a = arm + r * 0.45 + (Math.random() - 0.5) * 0.9;
    scatter[i * 3] = Math.cos(a) * r;
    scatter[i * 3 + 1] = Math.sin(a) * r * 0.55;
    scatter[i * 3 + 2] = (Math.random() - 0.5) * 3 - 2;
    rand[i] = Math.random();
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(text, 3));
  geo.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3));
  geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));
  geo.setAttribute('aLine', new THREE.BufferAttribute(line, 1));

  const uniforms = {
    uTime: { value: 0 },
    uAssemble: { value: 0 },
    uScroll: { value: 0 },
    uScale: { value: 10 },
    uLift: { value: 0.8 },
    uPixelRatio: { value: pr },
    uMouse: { value: new THREE.Vector2(99, 99) },
    uColorA: { value: new THREE.Color('#ff2436') },
    uColorB: { value: new THREE.Color('#ff8a00') },
    uColorC: { value: new THREE.Color('#ffc93c') },
  };

  const mat = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const mouseTarget = new THREE.Vector2(99, 99); // repulsion point, far away until the pointer moves
  const tilt = new THREE.Vector2(0, 0); // normalised -0.5..0.5 for camera-ish tilt
  const tiltTarget = new THREE.Vector2(0, 0);
  let visibleW = 10;
  let visibleH = 6;

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    visibleH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    visibleW = visibleH * camera.aspect;
    // fit both lines: limited by width on phones, by height on wide screens
    const byW = visibleW * (w < 768 ? 0.94 : 0.74);
    const byH = visibleH * 0.62 / (620 / 1600);
    uniforms.uScale.value = Math.min(byW, byH);
    uniforms.uLift.value = visibleH * (w < 768 ? 0.16 : 0.12);
  }

  function onMove(e) {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = -((e.clientY - r.top) / r.height - 0.5);
    mouseTarget.set(x * visibleW, y * visibleH);
    tiltTarget.set(x, y);
  }
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('resize', resize);
  resize();

  const timer = new THREE.Timer();
  let running = true;
  let raf;
  function tick() {
    raf = requestAnimationFrame(tick);
    if (!running) return;
    timer.update();
    const t = timer.getElapsed();
    uniforms.uTime.value = t;
    uniforms.uMouse.value.lerp(mouseTarget, 0.08);
    tilt.lerp(tiltTarget, 0.05);
    points.rotation.y = Math.sin(t * 0.15) * 0.08 + tilt.x * 0.25;
    points.rotation.x = tilt.y * -0.15;
    renderer.render(scene, camera);
  }
  tick();

  // pause rendering when the hero is off-screen
  const io = new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting;
  });
  io.observe(canvas);

  return {
    uniforms,
    destroy() {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', resize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    },
  };
}
