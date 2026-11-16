// scripts/fix_templates.js
const fs = require('fs');
let src = fs.readFileSync('scripts/render_nvidia_3d_reel.js', 'utf8');

// Replace all the font/style lines inside htmlContent
src = src.replace(/ctx\.font = `900 \${Math\.round\(28 \* p0\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "900 " + Math.round(28 * p0.scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.font = `800 \${Math\.round\(15 \* p0\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "800 " + Math.round(15 * p0.scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.strokeStyle = `rgba\(250, 204, 21, \${0\.4 \* face\.light}\)`;/g, 'ctx.strokeStyle = "rgba(250, 204, 21, " + (0.4 * face.light) + ")";');
src = src.replace(/ctx\.fillStyle = `rgba\(234, 179, 8, \${0\.85 \* face\.light}\)`;/g, 'ctx.fillStyle = "rgba(234, 179, 8, " + (0.85 * face.light) + ")";');
src = src.replace(/ctx\.font = `800 \${Math\.round\(18 \* p\[0\]\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "800 " + Math.round(18 * p[0].scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.font = `900 \${Math\.round\(48 \* p\[0\]\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "900 " + Math.round(48 * p[0].scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.font = `800 \${Math\.round\(16 \* p\[0\]\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "800 " + Math.round(16 * p[0].scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.font = `900 \${Math\.round\(14 \* p\[0\]\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "900 " + Math.round(14 * p[0].scale) + "px \\"Segoe UI\\", Arial, sans-serif";');

src = src.replace(/ctx\.font = `900 \${Math\.round\(28 \* p\[0\]\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "900 " + Math.round(28 * p[0].scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.font = `800 \${Math\.round\(18 \* p\[0\]\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "800 " + Math.round(18 * p[0].scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.font = `900 \${Math\.round\(62 \* p\[0\]\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "900 " + Math.round(62 * p[0].scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.font = `900 \${Math\.round\(38 \* p\[0\]\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "900 " + Math.round(38 * p[0].scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.font = `700 \${Math\.round\(14 \* p\[0\]\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "700 " + Math.round(14 * p[0].scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.font = `800 \${Math\.round\(16 \* p\[0\]\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "800 " + Math.round(16 * p[0].scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.font = `900 \${Math\.round\(36 \* p\[0\]\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "900 " + Math.round(36 * p[0].scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.font = `900 \${Math\.round\(22 \* p\[0\]\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "900 " + Math.round(22 * p[0].scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.font = `800 \${Math\.round\(15 \* p\[0\]\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "800 " + Math.round(15 * p[0].scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.font = `900 \${Math\.round\(28 \* p\[0\]\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "900 " + Math.round(28 * p[0].scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.font = `800 \${Math\.round\(14 \* p\[0\]\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "800 " + Math.round(14 * p[0].scale) + "px \\"Segoe UI\\", Arial, sans-serif";');

src = src.replace(/ctx\.font = `900 \${Math\.round\(18 \* p1\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "900 " + Math.round(18 * p1.scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.font = `900 \${Math\.round\(38 \* corePt\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "900 " + Math.round(38 * corePt.scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.font = `800 \${Math\.round\(14 \* corePt\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "800 " + Math.round(14 * corePt.scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.font = `900 \${Math\.round\(44 \* p\[0\]\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "900 " + Math.round(44 * p[0].scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.font = `900 \${Math\.round\(23 \* p\[0\]\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "900 " + Math.round(23 * p[0].scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.font = `700 \${Math\.round\(15 \* p\[0\]\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "700 " + Math.round(15 * p[0].scale) + "px \\"Segoe UI\\", Arial, sans-serif";');
src = src.replace(/ctx\.font = `900 \${Math\.round\(14 \* p\[0\]\.scale\)}px "Segoe UI", Arial, sans-serif`;/g, 'ctx.font = "900 " + Math.round(14 * p[0].scale) + "px \\"Segoe UI\\", Arial, sans-serif";');

fs.writeFileSync('scripts/render_nvidia_3d_reel.js', src, 'utf8');
console.log('Fixed all template literals in scripts/render_nvidia_3d_reel.js');
