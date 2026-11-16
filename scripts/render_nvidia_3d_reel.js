// scripts/render_nvidia_3d_reel.js
// VantorX 3D Motion Graphics Reel: "Nvidia's Secret / Jensen Huang 1995" (75.1s Master Cut)
// Features:
// - True 3D Isometric Projection Engine (3D Matrix Math, Depth Sorting, Directional Lighting)
// - Continuous 3D Camera Momentum (Dollies, 3D Orbits, Roll, Cinematic Tilts, Impact Shakes)
// - 3D Rotating Silicon GPU Die with Gold Pins, Circuit Pulses & Nvidia Emblems
// - 3D Shattering Polygon Shards & Explosive Dynamics
// - 3D Holographic Boardroom Table & Rotating $5M Check
// - 3D Interlocking Automation Gears & Fiber Optic Data Streams
// - 3D Vibrating Smartphone with Incoming Emergency Call & Voicemail Bleed
// - 3D Disintegrating Dollar Stacks (-$8,000 Cash Bleed)
// - 3D AVA Voice AI Reactor (Triple-Axis Gyroscope Rings + 3D Neural Sphere)
// - 3D Sub-Second Response Speedometer (0.8s Slam)
// - 3D Glassmorphic Dispatch Cards Flying in Perspective
// - 3D Live Phone Dialer ((561) 813-8602) & Pulsing "Comment AVA" CTA
// - Kinetic Hormozi-Style Captions Synced to Word Timestamps

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');
const ffmpegPath = require('ffmpeg-static');

const root = 'C:/Users/hungr/.gemini/antigravity/scratch/Vantorxsolutions';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACT_DIR = 'C:\\Users\\hungr\\.gemini\\antigravity\\brain\\80451426-584a-4969-8d9c-573a8dd3a27d';

const audioPath = path.join(root, 'website/demo/audio/reel-nvidia-master.wav');
const tsJsonPath = path.join(root, 'website/demo/audio/reel-nvidia-timestamps.json');
const outMp4Path = path.join(root, 'website/demo/video/vantorx-30s-reel-2.mp4');
const outNamedMp4 = path.join(root, 'website/demo/video/vantorx-nvidia-reel.mp4');
const outSpeedMp4 = path.join(root, 'website/demo/video/vantorx-speed-to-lead-reel.mp4');

const tsData = JSON.parse(fs.readFileSync(tsJsonPath, 'utf8'));
const TOTAL_SEC = Number(tsData.duration || 74.3);
const FPS = 30;
const W = 1080;
const H = 1920;

console.log(`Starting 3D Motion Graphics Reel Render: ${TOTAL_SEC}s (${tsData.words.length} words, ${Math.ceil(TOTAL_SEC * FPS)} frames)`);

const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #04060d; overflow: hidden; display: flex; align-items: center; justify-content: center; width: 1080px; height: 1920px; }
    canvas { width: 1080px; height: 1920px; image-rendering: -webkit-optimize-contrast; }
  </style>
</head>
<body>
  <canvas id="c" width="1080" height="1920"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const WORDS = ${JSON.stringify(tsData.words)};
    const W = 1080, H = 1920;

    // ==========================================
    // 3D MATH & PROJECTION ENGINE
    // ==========================================
    const FOV = 1000;

    // 3D Point Rotation & Camera Projection
    function project3D(pt, cam) {
      // 1. World space to Camera space translation
      let x = pt.x - cam.x;
      let y = pt.y - cam.y;
      let z = pt.z - cam.z;

      // 2. Yaw (around Y axis)
      if (cam.yaw) {
        const cosY = Math.cos(cam.yaw), sinY = Math.sin(cam.yaw);
        const nx = x * cosY - z * sinY;
        const nz = x * sinY + z * cosY;
        x = nx; z = nz;
      }

      // 3. Pitch (around X axis)
      if (cam.pitch) {
        const cosP = Math.cos(cam.pitch), sinP = Math.sin(cam.pitch);
        const ny = y * cosP - z * sinP;
        const nz = y * sinP + z * cosP;
        y = ny; z = nz;
      }

      // 4. Roll (around Z axis)
      if (cam.roll) {
        const cosR = Math.cos(cam.roll), sinR = Math.sin(cam.roll);
        const nx = x * cosR - y * sinR;
        const ny = x * sinR + y * cosR;
        x = nx; y = ny;
      }

      // 5. Perspective projection
      const effZ = z + FOV;
      if (effZ <= 20) return null; // Behind camera
      const scale = FOV / effZ;
      return {
        sx: W / 2 + x * scale,
        sy: H / 2 + y * scale,
        scale: scale,
        depth: z
      };
    }

    // Rotate a 3D point around local origin [rx, ry, rz]
    function rotatePoint(p, rx, ry, rz) {
      let x = p.x, y = p.y, z = p.z;
      // Rot X
      if (rx) {
        const c = Math.cos(rx), s = Math.sin(rx);
        const ny = y * c - z * s;
        const nz = y * s + z * c;
        y = ny; z = nz;
      }
      // Rot Y
      if (ry) {
        const c = Math.cos(ry), s = Math.sin(ry);
        const nx = x * c + z * s;
        const nz = -x * s + z * c;
        x = nx; z = nz;
      }
      // Rot Z
      if (rz) {
        const c = Math.cos(rz), s = Math.sin(rz);
        const nx = x * c - y * s;
        const ny = x * s + y * c;
        x = nx; y = ny;
      }
      return { x, y, z };
    }

    // Deterministic 3D Ambient Dust Particles (70 particles)
    const DUST = [];
    for (let i = 0; i < 70; i++) {
      DUST.push({
        x: ((i * 12347) % 2400) - 1200,
        y: ((i * 31415) % 3200) - 1600,
        z: ((i * 54321) % 2200) - 400,
        speedX: 18 + (i % 5) * 12,
        speedY: -25 - (i % 7) * 15,
        speedZ: (i % 3 === 0 ? 30 : -20),
        r: 3 + (i % 4) * 2.5,
        color: (i % 4 === 0) ? '#00f0ff' : (i % 4 === 1) ? '#22c55e' : (i % 4 === 2) ? '#facc15' : '#a855f7'
      });
    }

    // Helper: Draw Rounded Rectangle
    function drawRoundBox(ctx, x, y, w, h, r, fillColor, strokeColor, lineW = 2) {
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, y, w, h, r);
      } else {
        const rad = typeof r === 'number' ? r : 8;
        ctx.moveTo(x + rad, y);
        ctx.lineTo(x + w - rad, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
        ctx.lineTo(x + w, y + h - rad);
        ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
        ctx.lineTo(x + rad, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
        ctx.lineTo(x, y + rad);
        ctx.quadraticCurveTo(x, y, x + rad, y);
        ctx.closePath();
      }
      if (fillColor) { ctx.fillStyle = fillColor; ctx.fill(); }
      if (strokeColor) { ctx.strokeStyle = strokeColor; ctx.lineWidth = lineW; ctx.stroke(); }
    }

    // ==========================================
    // 3D RENDERING COMPONENTS
    // ==========================================

    // 1. Infinite 3D Cyber Floor Grid
    function render3DGrid(cam, t, gridRGB = { r: 0, g: 240, b: 255 }, horizonY = 320) {
      ctx.save();
      const floorY = 560; // 3D world height of floor
      const gridSpacing = 160;
      const numLinesX = 18;
      const zStart = 0;
      const zEnd = 2400;
      const zOffset = (t * 420) % gridSpacing;

      // Longitudinal lines (Z-direction)
      for (let ix = -numLinesX / 2; ix <= numLinesX / 2; ix++) {
        const wx = ix * gridSpacing;
        const p1 = project3D({ x: wx, y: floorY, z: zStart }, cam);
        const p2 = project3D({ x: wx, y: floorY, z: zEnd }, cam);
        if (p1 && p2) {
          const alpha = 0.35 * (1 - Math.abs(ix) / (numLinesX / 2));
          ctx.strokeStyle = 'rgba(' + gridRGB.r + ',' + gridRGB.g + ',' + gridRGB.b + ',' + alpha + ')';
          ctx.lineWidth = Math.max(1, 2.5 * p1.scale);
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();
        }
      }

      // Latitudinal lines (X-direction)
      for (let z = zStart - zOffset; z <= zEnd; z += gridSpacing) {
        if (z < 10) continue;
        const leftP = project3D({ x: -1600, y: floorY, z: z }, cam);
        const rightP = project3D({ x: 1600, y: floorY, z: z }, cam);
        if (leftP && rightP) {
          const depthFade = Math.max(0, 1 - (z / zEnd));
          ctx.strokeStyle = 'rgba(' + gridRGB.r + ',' + gridRGB.g + ',' + gridRGB.b + ',' + (depthFade * 0.45) + ')';
          ctx.lineWidth = Math.max(1, 2 * leftP.scale);
          ctx.beginPath();
          ctx.moveTo(leftP.sx, leftP.sy);
          ctx.lineTo(rightP.sx, rightP.sy);
          ctx.stroke();
        }
      }

      // Glowing horizon streak
      const horiz = project3D({ x: 0, y: floorY, z: zEnd }, cam);
      if (horiz) {
        const hGrad = ctx.createLinearGradient(0, horiz.sy - 80, 0, horiz.sy + 120);
        hGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
        hGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.35)');
        hGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = hGrad;
        ctx.fillRect(0, horiz.sy - 80, W, 200);
      }
      ctx.restore();
    }

    // 2. 3D Floating Dust & Cyber Light Orbs
    function render3DDust(cam, t) {
      ctx.save();
      DUST.forEach(p => {
        const curX = ((p.x + t * p.speedX) % 2400 + 2400) % 2400 - 1200;
        const curY = ((p.y + t * p.speedY) % 3200 + 3200) % 3200 - 1600;
        const curZ = ((p.z + t * p.speedZ) % 2200 + 2200) % 2200 - 400;

        const proj = project3D({ x: curX, y: curY, z: curZ }, cam);
        if (proj && proj.scale > 0) {
          const r = Math.max(1, p.r * proj.scale);
          const alpha = Math.min(0.85, 0.3 + proj.scale * 0.5);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(proj.sx, proj.sy, r, 0, Math.PI * 2);
          ctx.fill();

          // Glow halo for larger particles
          if (r > 3) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha * 0.3;
            ctx.beginPath();
            ctx.arc(proj.sx, proj.sy, r * 2.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
      ctx.globalAlpha = 1.0;
      ctx.restore();
    }

    // 3. 3D Silicon Microchip (Nvidia GPU NV1 Die)
    function render3DMicrochip(center, rx, ry, rz, cam, t, opts = {}) {
      const {
        chipSize = 340,
        thickness = 46,
        isCracking = false,
        crackProgress = 0,
        highlightText = 'NVIDIA NV1',
        subText = '3nm TENSOR DIE'
      } = opts;

      const half = chipSize / 2;
      const th = thickness / 2;

      // Define local 8 vertices of the chip box
      const localVerts = [
        { x: -half, y: -half, z: -th }, // 0: Top-Left-Front
        { x: half, y: -half, z: -th },  // 1: Top-Right-Front
        { x: half, y: half, z: -th },   // 2: Bot-Right-Front
        { x: -half, y: half, z: -th },  // 3: Bot-Left-Front
        { x: -half, y: -half, z: th },  // 4: Top-Left-Back
        { x: half, y: -half, z: th },   // 5: Top-Right-Back
        { x: half, y: half, z: th },    // 6: Bot-Right-Back
        { x: -half, y: half, z: th }    // 7: Bot-Left-Back
      ];

      // Rotate and translate vertices
      const worldVerts = localVerts.map(v => {
        const rot = rotatePoint(v, rx, ry, rz);
        return {
          x: center.x + rot.x,
          y: center.y + rot.y,
          z: center.z + rot.z
        };
      });

      // Project vertices
      const proj = worldVerts.map(v => project3D(v, cam));
      if (proj.some(p => p === null)) return;

      // Define 6 faces with normal vectors for lighting
      const faces = [
        { indices: [0, 1, 2, 3], normal: { x: 0, y: 0, z: -1 }, type: 'front' },
        { indices: [5, 4, 7, 6], normal: { x: 0, y: 0, z: 1 },  type: 'back' },
        { indices: [4, 5, 1, 0], normal: { x: 0, y: -1, z: 0 }, type: 'top' },
        { indices: [3, 2, 6, 7], normal: { x: 0, y: 1, z: 0 },  type: 'bottom' },
        { indices: [4, 0, 3, 7], normal: { x: -1, y: 0, z: 0 }, type: 'left' },
        { indices: [1, 5, 6, 2], normal: { x: 1, y: 0, z: 0 },  type: 'right' }
      ];

      // Light source in camera space: from top-right-front
      const lightDir = { x: 0.5, y: -0.7, z: -0.8 };
      const lightLen = Math.hypot(lightDir.x, lightDir.y, lightDir.z);
      lightDir.x /= lightLen; lightDir.y /= lightLen; lightDir.z /= lightLen;

      // Calculate face centers for depth sorting
      faces.forEach(f => {
        const rotNorm = rotatePoint(f.normal, rx, ry, rz);
        f.worldNormal = rotNorm;
        // Dot product with camera vector (view vector ~ z)
        f.dotCam = rotNorm.z;
        // Calculate average depth
        let sumZ = 0;
        f.indices.forEach(idx => sumZ += worldVerts[idx].z);
        f.avgZ = sumZ / 4;
        // Light intensity
        const dotLight = -(rotNorm.x * lightDir.x + rotNorm.y * lightDir.y + rotNorm.z * lightDir.z);
        f.light = Math.max(0.18, (dotLight + 1) * 0.5);
      });

      // Sort faces by depth (back to front)
      faces.sort((a, b) => b.avgZ - a.avgZ);

      // Render each face
      faces.forEach(face => {
        const p0 = proj[face.indices[0]];
        const p1 = proj[face.indices[1]];
        const p2 = proj[face.indices[2]];
        const p3 = proj[face.indices[3]];

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p0.sx, p0.sy);
        ctx.lineTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.lineTo(p3.sx, p3.sy);
        ctx.closePath();

        if (face.type === 'front') {
          // Top silicon surface: Dark obsidian mirrored die with green neon circuit patterns
          const grad = ctx.createLinearGradient(p0.sx, p0.sy, p2.sx, p2.sy);
          grad.addColorStop(0, '#0c151c');
          grad.addColorStop(0.5, '#070b10');
          grad.addColorStop(1, '#020406');
          ctx.fillStyle = grad;
          ctx.fill();

          // Glowing border
          ctx.strokeStyle = isCracking ? '#ef4444' : '#22c55e';
          ctx.lineWidth = Math.max(2, 4 * p0.scale);
          ctx.stroke();

          // Silicon circuit bus lines (animated energy pulses)
          ctx.strokeStyle = isCracking ? 'rgba(239, 68, 68, 0.45)' : 'rgba(34, 197, 94, 0.55)';
          ctx.lineWidth = Math.max(1, 2 * p0.scale);
          const centerSx = (p0.sx + p2.sx) / 2;
          const centerSy = (p0.sy + p2.sy) / 2;

          // Radial circuit rings on die
          for (let r = 20; r <= 110; r += 28) {
            const scaledR = r * p0.scale;
            ctx.beginPath();
            ctx.arc(centerSx, centerSy, scaledR, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Circuit bus traces pulsing
          const pulseOffset = (t * 8) % 1;
          for (let a = 0; a < 8; a++) {
            const ang = (a * Math.PI / 4) + t * 0.4;
            const x1 = centerSx + Math.cos(ang) * (30 * p0.scale);
            const y1 = centerSy + Math.sin(ang) * (30 * p0.scale);
            const x2 = centerSx + Math.cos(ang) * (130 * p0.scale);
            const y2 = centerSy + Math.sin(ang) * (130 * p0.scale);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Pulsing photon node
            const px = x1 + (x2 - x1) * pulseOffset;
            const py = y1 + (y2 - y1) * pulseOffset;
            ctx.fillStyle = isCracking ? '#ff7878' : '#86efac';
            ctx.beginPath();
            ctx.arc(px, py, 3.5 * p0.scale, 0, Math.PI * 2);
            ctx.fill();
          }

          // Center Nvidia / Titan Typography
          ctx.save();
          ctx.translate(centerSx, centerSy);
          const angle2D = Math.atan2(p1.sy - p0.sy, p1.sx - p0.sx);
          ctx.rotate(angle2D);

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = "900 " + Math.round(28 * p0.scale) + "px Arial, sans-serif";
          ctx.fillStyle = isCracking ? '#fca5a5' : '#ffffff';
          ctx.shadowColor = isCracking ? '#ef4444' : '#22c55e';
          ctx.shadowBlur = 12 * p0.scale;
          ctx.fillText(highlightText, 0, -10 * p0.scale);

          ctx.font = "800 " + Math.round(15 * p0.scale) + "px Arial, sans-serif";
          ctx.fillStyle = isCracking ? '#ef4444' : '#4ade80';
          ctx.shadowBlur = 0;
          ctx.fillText(subText, 0, 16 * p0.scale);
          ctx.restore();

          // If cracking, draw jagged fracture fissures
          if (isCracking && crackProgress > 0) {
            ctx.strokeStyle = '#ff2222';
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 24 * p0.scale;
            ctx.lineWidth = Math.max(3, 8 * p0.scale * crackProgress);
            ctx.beginPath();
            ctx.moveTo(centerSx - 130 * p0.scale, centerSy - 80 * p0.scale);
            ctx.lineTo(centerSx - 20 * p0.scale, centerSy - 10 * p0.scale);
            ctx.lineTo(centerSx + 30 * p0.scale, centerSy + 20 * p0.scale);
            ctx.lineTo(centerSx + 140 * p0.scale, centerSy + 90 * p0.scale);
            ctx.stroke();
          }
        } else {
          // Side bevel faces with metallic gold interconnect pins
          const baseCol = (face.type === 'top' || face.type === 'bottom') ? '#1e293b' : '#0f172a';
          ctx.fillStyle = baseCol;
          ctx.fill();

          // Metallic bevel highlight
          ctx.strokeStyle = "rgba(250, 204, 21, " + (0.4 * face.light) + ")";
          ctx.lineWidth = Math.max(1, 2.5 * p0.scale);
          ctx.stroke();

          // Gold contact pins on side faces
          const numPins = 8;
          ctx.fillStyle = "rgba(234, 179, 8, " + (0.85 * face.light) + ")";
          for (let i = 1; i < numPins; i++) {
            const factor = i / numPins;
            const pinX = p0.sx + (p1.sx - p0.sx) * factor;
            const pinY = p0.sy + (p1.sy - p0.sy) * factor;
            const pinW = (p3.sx - p0.sx) * 0.45;
            const pinH = (p3.sy - p0.sy) * 0.45;
            ctx.beginPath();
            ctx.arc(pinX + pinW / 2, pinY + pinH / 2, 2.5 * p0.scale, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      });
    }

    // 4. 3D Shattered Shards Explosion (Act 2 Failure)
    function render3DShards(center, progress, cam, t) {
      ctx.save();
      const numShards = 24;
      for (let i = 0; i < numShards; i++) {
        const seed = i * 17.38;
        const angle = (i / numShards) * Math.PI * 2 + seed;
        const speed = 400 + (i % 7) * 90;
        const dist = progress * speed;

        const shardWorld = {
          x: center.x + Math.cos(angle) * dist + (i % 3 - 1) * 60,
          y: center.y + Math.sin(angle) * dist * 0.7 + progress * 240, // gravity drop
          z: center.z - progress * 600 + Math.sin(seed) * 200 // fly toward camera
        };

        const shardRot = {
          rx: t * 5 + i,
          ry: t * 4 + i * 2,
          rz: t * 6 + i * 3
        };

        const size = (24 + (i % 5) * 12) * (1 - progress * 0.35);
        const p1 = project3D({
          x: shardWorld.x + rotatePoint({ x: -size, y: -size, z: 0 }, shardRot.rx, shardRot.ry, shardRot.rz).x,
          y: shardWorld.y + rotatePoint({ x: -size, y: -size, z: 0 }, shardRot.rx, shardRot.ry, shardRot.rz).y,
          z: shardWorld.z + rotatePoint({ x: -size, y: -size, z: 0 }, shardRot.rx, shardRot.ry, shardRot.rz).z
        }, cam);
        const p2 = project3D({
          x: shardWorld.x + rotatePoint({ x: size, y: -size * 0.5, z: 0 }, shardRot.rx, shardRot.ry, shardRot.rz).x,
          y: shardWorld.y + rotatePoint({ x: size, y: -size * 0.5, z: 0 }, shardRot.rx, shardRot.ry, shardRot.rz).y,
          z: shardWorld.z + rotatePoint({ x: size, y: -size * 0.5, z: 0 }, shardRot.rx, shardRot.ry, shardRot.rz).z
        }, cam);
        const p3 = project3D({
          x: shardWorld.x + rotatePoint({ x: 0, y: size, z: 0 }, shardRot.rx, shardRot.ry, shardRot.rz).x,
          y: shardWorld.y + rotatePoint({ x: 0, y: size, z: 0 }, shardRot.rx, shardRot.ry, shardRot.rz).y,
          z: shardWorld.z + rotatePoint({ x: 0, y: size, z: 0 }, shardRot.rx, shardRot.ry, shardRot.rz).z
        }, cam);

        if (p1 && p2 && p3) {
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.lineTo(p3.sx, p3.sy);
          ctx.closePath();

          ctx.fillStyle = (i % 2 === 0) ? '#ef4444' : '#f97316';
          ctx.shadowColor = '#ff0000';
          ctx.shadowBlur = 16 * p1.scale;
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = Math.max(1, 2 * p1.scale);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // 5. 3D Floating Hologram $5,000,000 Check (Sega Rescue)
    function render3DCheck(center, rx, ry, rz, cam, t) {
      const w = 480, h = 260;
      const hw = w / 2, hh = h / 2;

      const corners = [
        { x: -hw, y: -hh, z: 0 },
        { x: hw, y: -hh, z: 0 },
        { x: hw, y: hh, z: 0 },
        { x: -hw, y: hh, z: 0 }
      ];

      const world = corners.map(c => {
        const r = rotatePoint(c, rx, ry, rz);
        return { x: center.x + r.x, y: center.y + r.y, z: center.z + r.z };
      });

      const p = world.map(pt => project3D(pt, cam));
      if (p.some(pt => pt === null)) return;

      ctx.save();
      // Holographic green beam from below
      const beamBot = project3D({ x: center.x, y: center.y + 450, z: center.z }, cam);
      if (beamBot) {
        const bGrad = ctx.createLinearGradient((p[0].sx + p[1].sx)/2, (p[0].sy + p[1].sy)/2, beamBot.sx, beamBot.sy);
        bGrad.addColorStop(0, 'rgba(34, 197, 94, 0.45)');
        bGrad.addColorStop(1, 'rgba(34, 197, 94, 0)');
        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.moveTo(p[3].sx, p[3].sy);
        ctx.lineTo(p[2].sx, p[2].sy);
        ctx.lineTo(beamBot.sx + 100 * beamBot.scale, beamBot.sy);
        ctx.lineTo(beamBot.sx - 100 * beamBot.scale, beamBot.sy);
        ctx.closePath();
        ctx.fill();
      }

      // 3D Glassmorphic Emerald Check Body
      ctx.beginPath();
      ctx.moveTo(p[0].sx, p[0].sy);
      ctx.lineTo(p[1].sx, p[1].sy);
      ctx.lineTo(p[2].sx, p[2].sy);
      ctx.lineTo(p[3].sx, p[3].sy);
      ctx.closePath();

      const chGrad = ctx.createLinearGradient(p[0].sx, p[0].sy, p[2].sx, p[2].sy);
      chGrad.addColorStop(0, 'rgba(6, 78, 59, 0.92)');
      chGrad.addColorStop(0.5, 'rgba(4, 120, 87, 0.95)');
      chGrad.addColorStop(1, 'rgba(2, 44, 34, 0.95)');
      ctx.fillStyle = chGrad;
      ctx.fill();

      // Glowing green border
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = Math.max(3, 6 * p[0].scale);
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 24 * p[0].scale;
      ctx.stroke();

      // Check text in 3D perspective
      const cx = (p[0].sx + p[2].sx) / 2;
      const cy = (p[0].sy + p[2].sy) / 2;
      const ang = Math.atan2(p[1].sy - p[0].sy, p[1].sx - p[0].sx);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#a7f3d0';
      ctx.font = "800 " + Math.round(18 * p[0].scale) + "px Arial, sans-serif";
      ctx.fillText('SEGA ENTERPRISES • EMERGENCY ADVANCE', 0, -68 * p[0].scale);

      ctx.fillStyle = '#ffffff';
      ctx.font = "900 " + Math.round(48 * p[0].scale) + "px Arial, sans-serif";
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 18 * p[0].scale;
      ctx.fillText('$5,000,000', 0, -10 * p[0].scale);

      ctx.fillStyle = '#6ee7b7';
      ctx.font = "800 " + Math.round(16 * p[0].scale) + "px Arial, sans-serif";
      ctx.shadowBlur = 0;
      ctx.fillText('PAY TO THE ORDER OF: NVIDIA CORP', 0, 38 * p[0].scale);

      ctx.fillStyle = '#fde047';
      ctx.font = "900 " + Math.round(14 * p[0].scale) + "px Arial, sans-serif";
      ctx.fillText('STATUS: CLEARED (SAVED FROM DEATH)', 0, 72 * p[0].scale);

      ctx.restore();
      ctx.restore();
    }

    // 6. 3D Interlocking Automation Gears
    function render3DGears(center, cam, t) {
      ctx.save();
      const gears = [
        { x: -140, y: -60, r: 120, teeth: 12, speed: 1.8, color: '#00f0ff' },
        { x: 110, y: 30, r: 95, teeth: 10, speed: -2.3, color: '#22c55e' },
        { x: -40, y: 150, r: 80, teeth: 8, speed: 2.7, color: '#facc15' }
      ];

      gears.forEach(g => {
        const pt = project3D({ x: center.x + g.x, y: center.y + g.y, z: center.z }, cam);
        if (!pt) return;

        const rad = g.r * pt.scale;
        const rot = t * g.speed;

        ctx.save();
        ctx.translate(pt.sx, pt.sy);
        ctx.rotate(rot);

        // Gear core
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = g.color;
        ctx.lineWidth = Math.max(2, 4.5 * pt.scale);
        ctx.shadowColor = g.color;
        ctx.shadowBlur = 14 * pt.scale;
        ctx.stroke();

        // Gear teeth
        for (let i = 0; i < g.teeth; i++) {
          const a = (i / g.teeth) * Math.PI * 2;
          ctx.save();
          ctx.rotate(a);
          ctx.fillStyle = g.color;
          drawRoundBox(ctx, -10 * pt.scale, -rad - 18 * pt.scale, 20 * pt.scale, 24 * pt.scale, 4, g.color, null);
          ctx.restore();
        }

        // Center hub
        ctx.fillStyle = '#020617';
        ctx.beginPath();
        ctx.arc(0, 0, rad * 0.38, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(1, 2.5 * pt.scale);
        ctx.stroke();

        ctx.restore();
      });

      ctx.restore();
    }

    // 7. 3D Floating Smartphone with Emergency Incoming Call & Voicemail Bleed
    function render3DPhone(center, rx, ry, rz, cam, t, opts = {}) {
      const {
        isRinging = true,
        isMissed = false,
        caller = 'Sarah W. (Emergency Pipe Burst)',
        jobValue = '$8,000.00'
      } = opts;

      const w = 340, h = 640, th = 32;
      const hw = w / 2, hh = h / 2;

      // Phone vibration shake if ringing
      let vibX = 0, vibY = 0;
      if (isRinging && !isMissed) {
        vibX = Math.sin(t * 55) * 8;
        vibY = Math.cos(t * 65) * 8;
      }

      const localVerts = [
        { x: -hw + vibX, y: -hh + vibY, z: -th },
        { x: hw + vibX, y: -hh + vibY, z: -th },
        { x: hw + vibX, y: hh + vibY, z: -th },
        { x: -hw + vibX, y: hh + vibY, z: -th },
        { x: -hw + vibX, y: -hh + vibY, z: th },
        { x: hw + vibX, y: -hh + vibY, z: th },
        { x: hw + vibX, y: hh + vibY, z: th },
        { x: -hw + vibX, y: hh + vibY, z: th }
      ];

      const world = localVerts.map(v => {
        const r = rotatePoint(v, rx, ry, rz);
        return { x: center.x + r.x, y: center.y + r.y, z: center.z + r.z };
      });

      const p = world.map(pt => project3D(pt, cam));
      if (p.some(pt => pt === null)) return;

      ctx.save();

      // Draw phone chassis (back & sides)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(p[4].sx, p[4].sy);
      ctx.lineTo(p[5].sx, p[5].sy);
      ctx.lineTo(p[6].sx, p[6].sy);
      ctx.lineTo(p[7].sx, p[7].sy);
      ctx.closePath();
      ctx.fill();

      // Titanium edge shine
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = Math.max(2, 4 * p[0].scale);
      ctx.stroke();

      // Screen Face (p[0], p[1], p[2], p[3])
      ctx.beginPath();
      ctx.moveTo(p[0].sx, p[0].sy);
      ctx.lineTo(p[1].sx, p[1].sy);
      ctx.lineTo(p[2].sx, p[2].sy);
      ctx.lineTo(p[3].sx, p[3].sy);
      ctx.closePath();

      const screenGrad = ctx.createLinearGradient(p[0].sx, p[0].sy, p[2].sx, p[2].sy);
      if (isMissed) {
        screenGrad.addColorStop(0, '#450a0a');
        screenGrad.addColorStop(1, '#180404');
      } else {
        screenGrad.addColorStop(0, '#090d16');
        screenGrad.addColorStop(1, '#030712');
      }
      ctx.fillStyle = screenGrad;
      ctx.fill();

      // Screen outer rim
      ctx.strokeStyle = isMissed ? '#ef4444' : isRinging ? '#facc15' : '#38bdf8';
      ctx.lineWidth = Math.max(3, 5 * p[0].scale);
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 20 * p[0].scale;
      ctx.stroke();

      // Screen Content in 3D perspective
      const cx = (p[0].sx + p[2].sx) / 2;
      const cy = (p[0].sy + p[2].sy) / 2;
      const ang = Math.atan2(p[1].sy - p[0].sy, p[1].sx - p[0].sx);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);
      ctx.textAlign = 'center';

      if (isMissed) {
        // Red Missed Call & Voicemail Stamp
        ctx.fillStyle = '#ef4444';
        ctx.font = "900 " + Math.round(28 * p[0].scale) + "px Arial, sans-serif";
        ctx.fillText('⚠️ MISSED CALL', 0, -140 * p[0].scale);

        ctx.fillStyle = '#fca5a5';
        ctx.font = "800 " + Math.round(18 * p[0].scale) + "px Arial, sans-serif";
        ctx.fillText('DIED IN VOICEMAIL', 0, -100 * p[0].scale);

        // Skull / Warning symbol
        ctx.fillStyle = '#ef4444';
        ctx.font = "900 " + Math.round(62 * p[0].scale) + "px Arial, sans-serif";
        ctx.fillText('💀', 0, -20 * p[0].scale);

        ctx.fillStyle = '#ffffff';
        ctx.font = "900 " + Math.round(38 * p[0].scale) + "px Arial, sans-serif";
        ctx.fillText('-$8,000.00', 0, 60 * p[0].scale);

        ctx.fillStyle = '#94a3b8';
        ctx.font = "700 " + Math.round(14 * p[0].scale) + "px Arial, sans-serif";
        ctx.fillText('Customer called competitor #2', 0, 110 * p[0].scale);
      } else {
        // Ringing Emergency Caller Screen
        ctx.fillStyle = '#38bdf8';
        ctx.font = "800 " + Math.round(16 * p[0].scale) + "px Arial, sans-serif";
        ctx.fillText('INCOMING EMERGENCY CALL...', 0, -160 * p[0].scale);

        // Caller Avatar Ring
        const ringPulse = Math.sin(t * 12) * 8;
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 4 * p[0].scale;
        ctx.beginPath();
        ctx.arc(0, -70 * p[0].scale, (38 + ringPulse) * p[0].scale, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = "900 " + Math.round(36 * p[0].scale) + "px Arial, sans-serif";
        ctx.fillText('📞', 0, -68 * p[0].scale);

        ctx.fillStyle = '#ffffff';
        ctx.font = "900 " + Math.round(22 * p[0].scale) + "px Arial, sans-serif";
        ctx.fillText('Sarah W.', 0, 10 * p[0].scale);

        ctx.fillStyle = '#facc15';
        ctx.font = "800 " + Math.round(15 * p[0].scale) + "px Arial, sans-serif";
        ctx.fillText('BURST PIPE • FLOODING ATTIC', 0, 42 * p[0].scale);

        ctx.fillStyle = '#4ade80';
        ctx.font = "900 " + Math.round(28 * p[0].scale) + "px Arial, sans-serif";
        ctx.fillText(jobValue, 0, 88 * p[0].scale);

        ctx.fillStyle = '#ef4444';
        ctx.font = "800 " + Math.round(14 * p[0].scale) + "px Arial, sans-serif";
        ctx.fillText('(Contractor stuck on ladder)', 0, 126 * p[0].scale);
      }

      ctx.restore();
      ctx.restore();
    }

    // 8. 3D Tumbling Currency Stacks & Burning Red Embers (-$8,000 Lost)
    function render3DCurrency(center, cam, t) {
      ctx.save();
      const numBills = 16;
      for (let i = 0; i < numBills; i++) {
        const seed = i * 43.12;
        const driftT = (t * 1.5 + i * 0.25) % 3.0; // cycle
        const bx = center.x + Math.sin(seed + t) * 320 + (i % 4 - 2) * 80;
        const by = center.y - 100 + driftT * 260 + (i * 20);
        const bz = center.z + Math.cos(seed) * 200 - driftT * 200;

        const rot = {
          rx: t * 3 + i,
          ry: t * 4 + i * 1.5,
          rz: t * 2 + i * 0.8
        };

        const w = 110, h = 55;
        const p1 = project3D({
          x: bx + rotatePoint({ x: -w/2, y: -h/2, z: 0 }, rot.rx, rot.ry, rot.rz).x,
          y: by + rotatePoint({ x: -w/2, y: -h/2, z: 0 }, rot.rx, rot.ry, rot.rz).y,
          z: bz + rotatePoint({ x: -w/2, y: -h/2, z: 0 }, rot.rx, rot.ry, rot.rz).z
        }, cam);
        const p2 = project3D({
          x: bx + rotatePoint({ x: w/2, y: -h/2, z: 0 }, rot.rx, rot.ry, rot.rz).x,
          y: by + rotatePoint({ x: w/2, y: -h/2, z: 0 }, rot.rx, rot.ry, rot.rz).y,
          z: bz + rotatePoint({ x: w/2, y: -h/2, z: 0 }, rot.rx, rot.ry, rot.rz).z
        }, cam);
        const p3 = project3D({
          x: bx + rotatePoint({ x: w/2, y: h/2, z: 0 }, rot.rx, rot.ry, rot.rz).x,
          y: by + rotatePoint({ x: w/2, y: h/2, z: 0 }, rot.rx, rot.ry, rot.rz).y,
          z: bz + rotatePoint({ x: w/2, y: h/2, z: 0 }, rot.rx, rot.ry, rot.rz).z
        }, cam);
        const p4 = project3D({
          x: bx + rotatePoint({ x: -w/2, y: h/2, z: 0 }, rot.rx, rot.ry, rot.rz).x,
          y: by + rotatePoint({ x: -w/2, y: h/2, z: 0 }, rot.rx, rot.ry, rot.rz).y,
          z: bz + rotatePoint({ x: -w/2, y: h/2, z: 0 }, rot.rx, rot.ry, rot.rz).z
        }, cam);

        if (p1 && p2 && p3 && p4) {
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.lineTo(p3.sx, p3.sy);
          ctx.lineTo(p4.sx, p4.sy);
          ctx.closePath();

          ctx.fillStyle = 'rgba(239, 68, 68, 0.75)';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 14 * p1.scale;
          ctx.fill();

          ctx.strokeStyle = '#fee2e2';
          ctx.lineWidth = Math.max(1, 2 * p1.scale);
          ctx.stroke();

          // $100 marking
          const midX = (p1.sx + p3.sx) / 2;
          const midY = (p1.sy + p3.sy) / 2;
          ctx.fillStyle = '#ffffff';
          ctx.font = "900 " + Math.round(18 * p1.scale) + "px Arial, sans-serif";
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('$100', midX, midY);
        }
      }
      ctx.restore();
    }

    // 9. 3D AVA Voice AI Reactor (Triple-Axis Gyroscope & 3D Neural Sound Sphere)
    function render3DAvaReactor(center, cam, t) {
      ctx.save();
      const r = 240;

      // 3 Concentric Gyroscope Rings rotating on 3 axes
      const rings = [
        { rotX: t * 1.6, rotY: 0, rotZ: t * 0.8, color: '#00f0ff', rad: r },
        { rotX: 0, rotY: t * 2.1, rotZ: t * 1.2, color: '#a855f7', rad: r * 0.85 },
        { rotX: t * 1.1, rotY: t * 1.4, rotZ: 0, color: '#22c55e', rad: r * 0.7 }
      ];

      rings.forEach(ring => {
        const numPts = 36;
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = Math.max(2, 4.5 * (FOV / (FOV + center.z)));
        ctx.shadowColor = ring.color;
        ctx.shadowBlur = 18;
        ctx.beginPath();

        let first = null;
        for (let i = 0; i <= numPts; i++) {
          const ang = (i / numPts) * Math.PI * 2;
          const local = {
            x: Math.cos(ang) * ring.rad,
            y: Math.sin(ang) * ring.rad,
            z: 0
          };
          const rot = rotatePoint(local, ring.rotX, ring.rotY, ring.rotZ);
          const pt = project3D({
            x: center.x + rot.x,
            y: center.y + rot.y,
            z: center.z + rot.z
          }, cam);

          if (pt) {
            if (i === 0) { ctx.moveTo(pt.sx, pt.sy); first = pt; }
            else { ctx.lineTo(pt.sx, pt.sy); }
          }
        }
        ctx.stroke();
      });

      // Inner 3D Neural Sphere with 36 glowing connected nodes
      const numNodes = 36;
      const sphereR = r * 0.45 + Math.sin(t * 14) * 12; // breathing audio pulse
      const projectedNodes = [];

      for (let i = 0; i < numNodes; i++) {
        const phi = Math.acos(-1 + (2 * i) / numNodes);
        const theta = Math.sqrt(numNodes * Math.PI) * phi + t * 1.5;

        const nx = Math.cos(theta) * Math.sin(phi) * sphereR;
        const ny = Math.sin(theta) * Math.sin(phi) * sphereR;
        const nz = Math.cos(phi) * sphereR;

        const pt = project3D({
          x: center.x + nx,
          y: center.y + ny,
          z: center.z + nz
        }, cam);

        if (pt) projectedNodes.push(pt);
      }

      // Connect nearby nodes with laser arcs
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const dx = projectedNodes[i].sx - projectedNodes[j].sx;
          const dy = projectedNodes[i].sy - projectedNodes[j].sy;
          const d = Math.hypot(dx, dy);
          if (d < 85) {
            ctx.beginPath();
            ctx.moveTo(projectedNodes[i].sx, projectedNodes[i].sy);
            ctx.lineTo(projectedNodes[j].sx, projectedNodes[j].sy);
            ctx.stroke();
          }
        }
      }

      // Draw node sparks
      projectedNodes.forEach(pt => {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, 3.5 * pt.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Core Voice AI Label
      const corePt = project3D(center, cam);
      if (corePt) {
        ctx.save();
        ctx.translate(corePt.sx, corePt.sy);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = "900 " + Math.round(38 * corePt.scale) + "px Arial, sans-serif";
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 24 * corePt.scale;
        ctx.fillText('AVA', 0, -6 * corePt.scale);

        ctx.font = "800 " + Math.round(14 * corePt.scale) + "px Arial, sans-serif";
        ctx.fillStyle = '#22c55e';
        ctx.fillText('24/7 VOICE AI', 0, 22 * corePt.scale);
        ctx.restore();
      }

      ctx.restore();
    }

    // 10. 3D Sub-Second Speedometer Gauge (0.8s Slam)
    function render3DSpeedometer(center, cam, t) {
      const pt = project3D(center, cam);
      if (!pt) return;

      ctx.save();
      ctx.translate(pt.sx, pt.sy);
      ctx.scale(pt.scale, pt.scale);

      const rad = 140;

      // Arc track
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 0, rad, Math.PI * 0.75, Math.PI * 2.25);
      ctx.stroke();

      // Green active speed arc
      ctx.strokeStyle = '#22c55e';
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 22;
      ctx.beginPath();
      ctx.arc(0, 0, rad, Math.PI * 0.75, Math.PI * 1.25);
      ctx.stroke();

      // Needle slamming to 0.8s
      const needleAngle = Math.PI * 0.75 + (Math.PI * 0.5) * (0.8 / 3.0) + Math.sin(t * 18) * 0.04;
      ctx.save();
      ctx.rotate(needleAngle);
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(-6, 0);
      ctx.lineTo(0, -rad + 10);
      ctx.lineTo(6, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Center Hub & Readout
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 48px Arial, sans-serif';
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 18;
      ctx.fillText('0.8s', 0, 75);

      ctx.font = '800 18px Arial, sans-serif';
      ctx.fillStyle = '#86efac';
      ctx.shadowBlur = 0;
      ctx.fillText('1ST RING ANSWER', 0, 110);

      ctx.restore();
    }

    // 11. 3D Glassmorphic Dispatch Cards Flying in Perspective
    function render3DDispatchCard(center, rot, cam, title, subtitle, icon, badge, color = '#00f0ff') {
      const w = 520, h = 130;
      const hw = w / 2, hh = h / 2;

      const corners = [
        { x: -hw, y: -hh, z: 0 },
        { x: hw, y: -hh, z: 0 },
        { x: hw, y: hh, z: 0 },
        { x: -hw, y: hh, z: 0 }
      ];

      const world = corners.map(c => {
        const r = rotatePoint(c, rot.rx, rot.ry, rot.rz);
        return { x: center.x + r.x, y: center.y + r.y, z: center.z + r.z };
      });

      const p = world.map(pt => project3D(pt, cam));
      if (p.some(pt => pt === null)) return;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p[0].sx, p[0].sy);
      ctx.lineTo(p[1].sx, p[1].sy);
      ctx.lineTo(p[2].sx, p[2].sy);
      ctx.lineTo(p[3].sx, p[3].sy);
      ctx.closePath();

      const bg = ctx.createLinearGradient(p[0].sx, p[0].sy, p[2].sx, p[2].sy);
      bg.addColorStop(0, 'rgba(15, 23, 42, 0.94)');
      bg.addColorStop(1, 'rgba(3, 7, 18, 0.94)');
      ctx.fillStyle = bg;
      ctx.fill();

      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(2, 4.5 * p[0].scale);
      ctx.shadowColor = color;
      ctx.shadowBlur = 18 * p[0].scale;
      ctx.stroke();

      const cx = (p[0].sx + p[2].sx) / 2;
      const cy = (p[0].sy + p[2].sy) / 2;
      const ang = Math.atan2(p[1].sy - p[0].sy, p[1].sx - p[0].sx);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);

      // Icon
      ctx.font = "900 " + Math.round(44 * p[0].scale) + "px Arial, sans-serif";
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(icon, -220 * p[0].scale, 0);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = "900 " + Math.round(23 * p[0].scale) + "px Arial, sans-serif";
      ctx.fillText(title, -150 * p[0].scale, -18 * p[0].scale);

      // Subtitle
      ctx.fillStyle = '#94a3b8';
      ctx.font = "700 " + Math.round(15 * p[0].scale) + "px Arial, sans-serif";
      ctx.fillText(subtitle, -150 * p[0].scale, 18 * p[0].scale);

      // Badge
      ctx.fillStyle = color;
      ctx.font = "900 " + Math.round(14 * p[0].scale) + "px Arial, sans-serif";
      ctx.textAlign = 'right';
      ctx.fillText(badge, 220 * p[0].scale, 0);

      ctx.restore();
      ctx.restore();
    }

    // 12. 3D Live Call Challenge Finale Screen
    function render3DFinale(center, cam, t) {
      const pt = project3D(center, cam);
      if (!pt) return;

      ctx.save();
      ctx.translate(pt.sx, pt.sy);
      ctx.scale(pt.scale, pt.scale);

      // Main CTA Card Box
      const w = 780, h = 480;
      drawRoundBox(ctx, -w/2, -h/2, w, h, 28, 'rgba(10, 15, 29, 0.96)', '#38bdf8', 4);

      // Glowing pulse ring around card
      ctx.strokeStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 32;
      ctx.lineWidth = 4;
      ctx.stroke();

      // Top Tag
      ctx.textAlign = 'center';
      ctx.fillStyle = '#facc15';
      ctx.font = '900 24px Arial, sans-serif';
      ctx.fillText('⚡ LIVE SYSTEM ACTIVE · TEST AVA RIGHT NOW', 0, -170);

      // Live Phone Number
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 66px Arial, sans-serif';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 24;
      ctx.fillText('(561) 813-8602', 0, -85);

      // Subtext
      ctx.fillStyle = '#94a3b8';
      ctx.font = '800 22px Arial, sans-serif';
      ctx.shadowBlur = 0;
      ctx.fillText('DIAL FROM ANY PHONE · HEAR HER ANSWER IN 0.8s', 0, -25);

      // Green "CALL LIVE" Button
      const btnW = 540, btnH = 82;
      const pulseScale = 1 + Math.sin(t * 8) * 0.03;
      ctx.save();
      ctx.scale(pulseScale, pulseScale);
      drawRoundBox(ctx, -btnW/2, 20, btnW, btnH, 18, 'linear-gradient(135deg, #22c55e, #16a34a)', '#86efac', 3);

      ctx.fillStyle = '#041f0e';
      ctx.font = '900 32px Arial, sans-serif';
      ctx.shadowBlur = 0;
      ctx.fillText('📞 TAP OR DIAL (561) 813-8602', 0, 68);
      ctx.restore();

      // Comment AVA Banner
      ctx.fillStyle = '#facc15';
      ctx.font = '900 28px Arial, sans-serif';
      ctx.fillText('💬 OR COMMENT "AVA" BELOW FOR DEMO', 0, 185);

      ctx.restore();
    }

    // ==========================================
    // MAIN MASTER FRAME RENDERER (0s - 75.1s)
    // ==========================================
    window.renderFrame = function(t) {
      // Clear Screen
      ctx.fillStyle = '#03060d';
      ctx.fillRect(0, 0, W, H);

      // Dynamic Camera Trajectory (Continuous forward push & cinematic drift)
      let sceneProgress = 0;
      if (t < 15.2) sceneProgress = t / 15.2;
      else if (t < 33.5) sceneProgress = (t - 15.2) / (33.5 - 15.2);
      else if (t < 46.5) sceneProgress = (t - 33.5) / (46.5 - 33.5);
      else sceneProgress = (t - 46.5) / (75.1 - 46.5);

      // Continuous forward camera push per scene (-180 to -80)
      const forwardPush = -180 + sceneProgress * 120;

      let cam = {
        x: Math.sin(t * 0.45) * 60,
        y: Math.cos(t * 0.35) * 40 - 30,
        z: forwardPush + Math.sin(t * 0.3) * 30,
        pitch: -0.05 + Math.sin(t * 0.45) * 0.025,
        yaw: Math.sin(t * 0.35) * 0.04,
        roll: Math.cos(t * 0.28) * 0.018
      };

      // Sound/Impact Screen Shake & White Flash on hard beats
      let flashAlpha = 0;
      const impactBeats = [0.0, 5.13, 11.8, 15.48, 20.0, 27.36, 34.25, 38.02, 44.59, 46.14, 50.67, 58.72, 66.28];
      impactBeats.forEach(trig => {
        const diff = t - trig;
        if (diff >= 0 && diff < 0.38) {
          const decay = 1 - (diff / 0.38);
          cam.x += Math.sin(diff * 52) * 18 * decay;
          cam.y += Math.cos(diff * 64) * 16 * decay;
          cam.roll += Math.sin(diff * 48) * 0.035 * decay;
          if (diff < 0.12) {
            flashAlpha = Math.max(flashAlpha, (1 - diff / 0.12) * 0.25);
          }
        }
      });

      // 1. Render 3D Ground Cyber Grid
      render3DGrid(cam, t, (t >= 33.5 && t < 46.5) ? { r: 239, g: 68, b: 68 } : { r: 0, g: 240, b: 255 });

      // 2. Render 3D Floating Dust & Cyber Particles
      render3DDust(cam, t);

      // 3. Top Progress Stepper (① NVIDIA ② 1995 SEGA ③ THE BLEED ④ AVA 0.8s)
      const curAct = (t < 15.2) ? 1 : (t < 33.5) ? 2 : (t < 46.5) ? 3 : 4;
      const actTitles = ['① NVIDIA $3T EMPIRE', '② 1995 SEGA RESCUE', '③ -$8,000 VOICEMAIL BLEED', '④ AVA 24/7 VOICE AI'];

      ctx.save();
      const stepY = 135;
      const spacing = 80;
      const startX = W / 2 - (spacing * 1.5);
      for (let i = 1; i <= 4; i++) {
        const cx = startX + (i - 1) * spacing;
        const isCurrent = (i === curAct);
        const isPast = (i < curAct);

        ctx.beginPath();
        ctx.arc(cx, stepY, isCurrent ? 24 : 20, 0, Math.PI * 2);
        if (isCurrent) {
          ctx.fillStyle = '#facc15';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3.5;
          ctx.stroke();

          ctx.font = '900 22px Arial, sans-serif';
          ctx.fillStyle = '#090d16';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(i), cx, stepY + 1);
        } else if (isPast) {
          ctx.fillStyle = '#22c55e';
          ctx.fill();
          ctx.font = '900 20px Arial, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✓', cx, stepY + 1);
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.fill();
          ctx.font = '800 18px Arial, sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(i), cx, stepY + 1);
        }
      }

      ctx.font = '900 24px Arial, sans-serif';
      ctx.fillStyle = (curAct === 3) ? '#ef4444' : '#facc15';
      ctx.textAlign = 'center';
      ctx.fillText(actTitles[curAct - 1], W / 2, stepY + 54);
      ctx.restore();

      // ==========================================
      // SCENE LOGIC (BASED ON EXACT TIMESTAMPS)
      // ==========================================

      // ACT 1: 0s - 15.2s (The $3T Question & "Jensen Huang Cheated")
      if (t < 15.2) {
        const chipCenter = { x: 0, y: -40, z: 250 };
        const rx = 0.35 + Math.sin(t * 1.2) * 0.15;
        const ry = t * 1.1;
        const rz = Math.sin(t * 0.8) * 0.1;

        // Is it the "cheated" punchline? (11.5s - 14.5s)
        const isCheated = (t >= 11.5 && t <= 14.5);

        render3DMicrochip(chipCenter, rx, ry, rz, cam, t, {
          chipSize: 360,
          thickness: 52,
          isCracking: isCheated,
          crackProgress: isCheated ? (t - 11.5) / 3.0 : 0,
          highlightText: isCheated ? '⚠️ CHEATED DEATH' : 'NVIDIA TITAN',
          subText: isCheated ? 'UNFAIR ADVANTAGE' : '$3,000,000,000,000'
        });

        // Floating 3D Valuation Monument
        const bannerPt = project3D({ x: 0, y: 310, z: 180 }, cam);
        if (bannerPt) {
          ctx.save();
          ctx.translate(bannerPt.sx, bannerPt.sy);
          ctx.scale(bannerPt.scale, bannerPt.scale);
          drawRoundBox(ctx, -260, -50, 520, 100, 20, 'rgba(10, 20, 35, 0.92)', isCheated ? '#ef4444' : '#22c55e', 3.5);

          ctx.textAlign = 'center';
          ctx.fillStyle = '#ffffff';
          ctx.font = '900 42px Arial, sans-serif';
          ctx.shadowColor = isCheated ? '#ef4444' : '#22c55e';
          ctx.shadowBlur = 18;
          ctx.fillText(isCheated ? 'RULE BREAKER' : '$3 TRILLION EMPIRE', 0, -6);

          ctx.font = '800 18px Arial, sans-serif';
          ctx.fillStyle = isCheated ? '#fca5a5' : '#86efac';
          ctx.shadowBlur = 0;
          ctx.fillText(isCheated ? 'Jensen Huang refused to die' : 'BUILT BY RUTHLESS ADVANTAGE', 0, 28);
          ctx.restore();
        }
      }

      // ACT 2: 15.2s - 33.5s (1995 Bankruptcy, Shattered Chip, Sega $5M Check, Automation)
      else if (t < 33.5) {
        const timeInAct = t - 15.2;

        if (timeInAct < 5.8) {
          // 15.2s - 21.0s: "In 1995 Nvidia was 30 days from total bankruptcy. Their chip was broken."
          const chipCenter = { x: 0, y: -40, z: 260 };
          const shatterProgress = Math.min(1.0, Math.max(0, (timeInAct - 3.2) / 2.6));

          if (shatterProgress > 0) {
            render3DShards(chipCenter, shatterProgress, cam, t);
          } else {
            render3DMicrochip(chipCenter, 0.45, timeInAct * 1.5, 0.1, cam, t, {
              chipSize: 340,
              thickness: 48,
              isCracking: true,
              crackProgress: timeInAct / 3.2,
              highlightText: 'NV1 CHIP BROKEN',
              subText: '30 DAYS TO BANKRUPTCY'
            });
          }

          // Warning Countdown Banner
          const warnPt = project3D({ x: 0, y: 310, z: 200 }, cam);
          if (warnPt) {
            ctx.save();
            ctx.translate(warnPt.sx, warnPt.sy);
            ctx.scale(warnPt.scale, warnPt.scale);
            drawRoundBox(ctx, -250, -45, 500, 90, 18, 'rgba(40, 10, 15, 0.94)', '#ef4444', 3.5);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 36px Arial, sans-serif';
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 18;
            ctx.fillText('🚨 30 DAYS TO TOTAL DEATH', 0, -5);
            ctx.font = '800 17px Arial, sans-serif';
            ctx.fillStyle = '#fca5a5';
            ctx.fillText('1995: Zero cash. Hardware failed.', 0, 26);
            ctx.restore();
          }
        } else if (timeInAct < 13.5) {
          // 21.0s - 28.7s: Jensen Sega Boardroom Confession & $5M Rescue Check
          const checkCenter = { x: 0, y: -30, z: 240 };
          const rx = 0.2 + Math.sin(t * 1.4) * 0.1;
          const ry = Math.sin(t * 1.6) * 0.35;
          const rz = Math.cos(t * 1.1) * 0.08;

          render3DCheck(checkCenter, rx, ry, rz, cam, t);
        } else {
          // 28.7s - 33.5s: Ruthless Automation
          const gearCenter = { x: 0, y: -30, z: 260 };
          render3DGears(gearCenter, cam, t);

          const autoPt = project3D({ x: 0, y: 290, z: 200 }, cam);
          if (autoPt) {
            ctx.save();
            ctx.translate(autoPt.sx, autoPt.sy);
            ctx.scale(autoPt.scale, autoPt.scale);
            drawRoundBox(ctx, -260, -45, 520, 90, 18, 'rgba(10, 25, 20, 0.94)', '#22c55e', 3.5);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 38px Arial, sans-serif';
            ctx.shadowColor = '#22c55e';
            ctx.shadowBlur = 18;
            ctx.fillText('⚡ RUTHLESS AUTOMATION', 0, -5);
            ctx.font = '800 17px Arial, sans-serif';
            ctx.fillStyle = '#86efac';
            ctx.fillText('Replaced manual bottleneck with software', 0, 26);
            ctx.restore();
          }
        }
      }

      // ACT 3: 33.5s - 46.5s (Contractor Attic, Emergency Voicemail Bleed & -$8,000 Cash Disintegration)
      else if (t < 46.5) {
        const timeInBleed = t - 33.5;
        const isMissed = (timeInBleed >= 4.5); // After 38.0s, call misses

        const phoneCenter = { x: 0, y: -40, z: 240 };
        const rx = 0.25 + Math.sin(t * 1.5) * 0.08;
        const ry = -0.3 + Math.cos(t * 1.2) * 0.15;
        const rz = Math.sin(t * 1.8) * 0.05;

        render3DPhone(phoneCenter, rx, ry, rz, cam, t, {
          isRinging: !isMissed,
          isMissed: isMissed,
          caller: 'Sarah W. (Emergency Pipe Burst)',
          jobValue: '$8,000.00'
        });

        if (isMissed) {
          // Stacks of falling $100 bills scattering in 3D
          render3DCurrency(phoneCenter, cam, t);

          const bleedPt = project3D({ x: 0, y: 310, z: 180 }, cam);
          if (bleedPt) {
            ctx.save();
            ctx.translate(bleedPt.sx, bleedPt.sy);
            ctx.scale(bleedPt.scale, bleedPt.scale);
            drawRoundBox(ctx, -260, -45, 520, 90, 18, 'rgba(45, 10, 15, 0.96)', '#ef4444', 3.5);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 40px Arial, sans-serif';
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 20;
            ctx.fillText('-$8,000 LOST TO VOICEMAIL', 0, -5);
            ctx.font = '800 17px Arial, sans-serif';
            ctx.fillStyle = '#fca5a5';
            ctx.fillText('While you were stuck on a ladder or asleep', 0, 26);
            ctx.restore();
          }
        }
      }

      // ACT 4: 46.5s - 75.1s (AVA Voice AI, 0.8s Slam, Dispatch Cards & Live CTA Challenge)
      else {
        const timeInAva = t - 46.5;

        if (timeInAva < 17.5) {
          // 46.5s - 64.0s: AVA 24/7 Voice AI Reactor & Speedometer & Dispatch Cards
          const reactorCenter = { x: 0, y: -160, z: 260 };
          render3DAvaReactor(reactorCenter, cam, t);

          // Speedometer
          const speedCenter = { x: -260, y: 220, z: 220 };
          render3DSpeedometer(speedCenter, cam, t);

          // Dispatch cards sliding in sequentially
          if (timeInAva >= 2.5 && timeInAva < 7.5) {
            const cardCenter = { x: 140, y: 220, z: 190 };
            render3DDispatchCard(cardCenter, { rx: 0.1, ry: -0.2, rz: 0 }, cam, '0.8s 1ST RING ANSWER', 'Instant Voice AI Pickup', '⚡', 'SUB-SECOND', '#00f0ff');
          } else if (timeInAva >= 7.5 && timeInAva < 12.5) {
            const cardCenter = { x: 140, y: 220, z: 190 };
            render3DDispatchCard(cardCenter, { rx: 0.1, ry: -0.2, rz: 0 }, cam, 'JOB QUALIFIED & PRICED', 'Books directly onto calendar', '🎯', 'AUTOMATED', '#22c55e');
          } else if (timeInAva >= 12.5) {
            const cardCenter = { x: 140, y: 220, z: 190 };
            render3DDispatchCard(cardCenter, { rx: 0.1, ry: -0.2, rz: 0 }, cam, 'DISPATCHED TO TRUCK', 'SMS with address & problem', '🚚', 'INSTANT SMS', '#facc15');
          }
        } else {
          // 64.0s - 75.1s: Grand Finale Live Call Challenge (561) 813-8602 & Comment AVA
          const finaleCenter = { x: 0, y: -40, z: 210 };
          render3DFinale(finaleCenter, cam, t);
        }
      }

      // ==========================================
      // KINETIC HORMOZI CAPTIONS (Synced to words)
      // ==========================================
      const activeWordIdx = WORDS.findIndex(w => t >= w.start && t <= w.end);
      let targetIdx = activeWordIdx;
      if (targetIdx === -1) {
        for (let i = WORDS.length - 1; i >= 0; i--) {
          if (t >= WORDS[i].end) { targetIdx = Math.min(i, WORDS.length - 1); break; }
        }
      }
      if (targetIdx === -1) targetIdx = 0;

      // Sliding 3-word phrase window
      const chunkStart = Math.max(0, targetIdx - 1);
      const chunkWords = WORDS.slice(chunkStart, chunkStart + 3);

      ctx.save();
      const capY = 1680;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let totalWidth = 0;
      ctx.font = '900 62px Arial, sans-serif';
      const wordMetrics = chunkWords.map(cw => {
        const txt = cw.word.toUpperCase();
        const m = ctx.measureText(txt);
        totalWidth += m.width + 30;
        return { txt, width: m.width, isCurrent: (cw.start <= t && cw.end >= t) };
      });

      // Backdrop glassmorphic pill for captions
      const pillW = Math.min(W - 80, totalWidth + 90);
      drawRoundBox(ctx, W / 2 - pillW / 2, capY - 58, pillW, 116, 26, 'rgba(4, 8, 18, 0.88)', 'rgba(56, 189, 248, 0.35)', 2.5);

      let startWordX = W / 2 - totalWidth / 2;
      wordMetrics.forEach((wm) => {
        const curWordX = startWordX + wm.width / 2;
        ctx.save();
        ctx.translate(curWordX, capY);

        if (wm.isCurrent) {
          const pop = 1 + Math.sin(t * 20) * 0.1;
          ctx.scale(pop, pop);

          // Yellow/Green kinetic glow highlight
          ctx.font = '900 72px Arial, sans-serif';
          ctx.fillStyle = '#facc15';
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 24;
          // 3D Drop text shadow
          ctx.fillText(wm.txt, 3, 3);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(wm.txt, 0, 0);
        } else {
          ctx.font = '900 58px Arial, sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.shadowBlur = 0;
          ctx.fillText(wm.txt, 0, 0);
        }

        ctx.restore();
        startWordX += wm.width + 30;
      });

      ctx.restore();

      // White Impact Flash on Key Punchlines
      if (flashAlpha > 0) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, ' + flashAlpha + ')';
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }
    };
  </script>
</body>
</html>`;

const tmpHtmlPath = path.join(root, 'scripts/tmp_3d_nvidia.html');
fs.writeFileSync(tmpHtmlPath, htmlContent, 'utf8');

async function renderVideo() {
  const userDataDir = path.join(root, '.cache/edge_profile_3d');
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    userDataDir: userDataDir,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--allow-file-access-from-files',
      '--disable-web-security',
      '--disable-gpu-shader-disk-cache',
      '--disable-gpu-program-cache'
    ]
  });

  const page = await browser.newPage();
  page.on('pageerror', err => console.error('BROWSER PAGE ERROR:', err.message, err.stack));
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto('file:///' + tmpHtmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });

  const totalFrames = Math.ceil(TOTAL_SEC * FPS);
  console.log(`Rendering ${totalFrames} frames @ ${FPS} FPS into ${outMp4Path}...`);

  const ffArgs = [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-r', String(FPS),
    '-i', 'pipe:0',
    '-i', audioPath,
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'veryfast',
    '-crf', '20',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-shortest',
    outMp4Path
  ];

  const ff = spawn(ffmpegPath, ffArgs, { stdio: ['pipe', 'ignore', 'pipe'] });
  let ffErr = '';
  ff.stderr.on('data', d => ffErr += d.toString());
  let stdinClosed = false;
  ff.stdin.on('error', () => { stdinClosed = true; });

  const startTime = Date.now();
  for (let f = 0; f < totalFrames; f++) {
    if (stdinClosed) break;
    const t = f / FPS;
    await page.evaluate((tm) => window.renderFrame(tm), t);
    const buf = await page.screenshot({ type: 'jpeg', quality: 85 });
    if (stdinClosed) break;
    try {
      if (!ff.stdin.write(buf)) {
        await new Promise(res => ff.stdin.once('drain', res));
      }
    } catch (e) {
      break;
    }
    if (f % 60 === 0 || f === totalFrames - 1) {
      const pct = ((f / totalFrames) * 100).toFixed(0);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      process.stdout.write(`\r[3D RENDER] Frame ${f}/${totalFrames} (${pct}%) — ${elapsed}s elapsed`);
    }
  }

  try { ff.stdin.end(); } catch (e) {}
  await new Promise((resolve, reject) => {
    ff.on('close', code => code === 0 ? resolve() : reject(new Error(ffErr)));
  });

  await browser.close();
  try { fs.unlinkSync(tmpHtmlPath); } catch (e) {}
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}

  // Duplicate to outNamedMp4, outSpeedMp4 and Artifact Directory
  fs.copyFileSync(outMp4Path, outNamedMp4);
  fs.copyFileSync(outMp4Path, outSpeedMp4);
  try {
    fs.copyFileSync(outMp4Path, path.join(ARTIFACT_DIR, 'vantorx-30s-reel-2.mp4'));
    fs.copyFileSync(outMp4Path, path.join(ARTIFACT_DIR, 'vantorx-nvidia-reel.mp4'));
  } catch (e) {
    console.log('Artifact copy skipped:', e.message);
  }

  const sz = (fs.statSync(outMp4Path).size / (1024 * 1024)).toFixed(2);
  console.log(`\n✅ 3D Motion Graphics Nvidia Reel Rendered: ${outMp4Path} (${sz} MB)`);
}

renderVideo().catch(err => {
  console.error('\nRender error:', err);
  process.exit(1);
});
