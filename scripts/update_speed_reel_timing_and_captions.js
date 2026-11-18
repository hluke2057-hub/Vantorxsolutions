// scripts/update_speed_reel_timing_and_captions.js
const fs = require('fs');
const path = require('path');

const filePath = path.resolve('scripts/render_speed_to_lead_reel.js');
let code = fs.readFileSync(filePath, 'utf8');

// Normalize line endings
code = code.replace(/\r\n/g, '\n');

// 1. Scene 1 Timing
code = code.replace('if (t >= 0.0 && t < 3.2) {', 'if (t >= 0.0 && t < 4.05) {');
code = code.replace('const s1Prog = Math.min(1, Math.max(0, t / 3.0));', 'const s1Prog = Math.min(1, Math.max(0, t / 4.0));');
code = code.replace('const timeFraction = Math.max(0, 1 - (t / 3.0));', 'const timeFraction = Math.max(0, 1 - (t / 4.0));');
code = code.replace('const msLeft = Math.max(0, Math.floor((1 - (t / 3.0)) * 300));', 'const msLeft = Math.max(0, Math.floor((1 - (t / 4.0)) * 300));');
code = code.replace('if (t >= 0.8) {\n          const statProg = Math.min(1, (t - 0.8) / 0.5);', 'if (t >= 1.0) {\n          const statProg = Math.min(1, (t - 1.0) / 0.5);');

// 2. Scene 2 Timing
code = code.replace('else if (t >= 3.0 && t < 7.0) {', 'else if (t >= 4.05 && t < 8.05) {');
code = code.replace('const s2Prog = (t - 3.0) / 4.0;', 'const s2Prog = (t - 4.05) / 4.0;');
code = code.replace('const headProg = Math.min(1, (t - 3.0) / 0.5);', 'const headProg = Math.min(1, (t - 4.05) / 0.5);');
code = code.replace('const rings = Math.min(5, Math.floor((t - 3.0) * 1.5) + 1);', 'const rings = Math.min(5, Math.floor((t - 4.05) * 1.5) + 1);');
code = code.replace('if (t >= 4.5) {', 'if (t >= 5.5) {');
code = code.replace('if (t >= 5.0) {\n          const cardProg = Math.min(1, (t - 5.0) / 0.5);', 'if (t >= 6.0) {\n          const cardProg = Math.min(1, (t - 6.0) / 0.5);');

// 3. Scene 3 Timing
code = code.replace('else if (t >= 6.8 && t < 11.2) {', 'else if (t >= 8.05 && t < 12.15) {');
code = code.replace('const s3Prog = (t - 6.8) / 4.2;', 'const s3Prog = (t - 8.05) / 4.1;');
code = code.replace('if (t < 7.8) {\n          const waveR = (t - 6.8) * 1600;', 'if (t < 9.2) {\n          const waveR = (t - 8.05) * 1600;');
code = code.replace("Math.max(0, 1 - (t - 6.8) / 1.0)", "Math.max(0, 1 - (t - 8.05) / 1.0)");
code = code.replace('const headProg = Math.min(1, (t - 7.0) / 0.5);', 'const headProg = Math.min(1, (t - 8.1) / 0.5);');
code = code.replace('const speedFrac = Math.min(1, Math.max(0, (t - 7.2) / 0.6));', 'const speedFrac = Math.min(1, Math.max(0, (t - 8.2) / 0.6));');
code = code.replace('if (t >= 8.2) {\n          const cardProg = Math.min(1, (t - 8.2) / 0.4);', 'if (t >= 9.4) {\n          const cardProg = Math.min(1, (t - 9.4) / 0.4);');

// 4. Scene 4 Timing
code = code.replace('else if (t >= 11.0 && t < 18.2) {', 'else if (t >= 12.15 && t < 19.85) {');
code = code.replace('if (t < 14.5) {', 'if (t < 15.95) {');
code = code.replace('if (t >= 15.2) {\n            const smsProg = Math.min(1, (t - 15.2) / 0.4);', 'if (t >= 17.2) {\n            const smsProg = Math.min(1, (t - 17.2) / 0.4);');

// 5. Scene 5 Timing
code = code.replace('else if (t >= 18.0 && t < 24.0) {', 'else if (t >= 19.85 && t < 23.95) {');
code = code.replace('const s5Prog = (t - 18.0) / 5.8;', 'const s5Prog = (t - 19.85) / 4.1;');
code = code.replace('const headProg = Math.min(1, (t - 18.0) / 0.5);', 'const headProg = Math.min(1, (t - 19.85) / 0.5);');
code = code.replace("{ name: 'Sarah J. • AC Emergency', time: '11:30 AM', delay: 18.3 }", "{ name: 'Sarah J. • AC Emergency', time: '11:30 AM', delay: 20.0 }");
code = code.replace("{ name: 'Robert C. • System Quote', time: '02:00 PM', delay: 18.7 }", "{ name: 'Robert C. • System Quote', time: '02:00 PM', delay: 20.4 }");
code = code.replace("{ name: 'Michael M. • Duct Repair', time: '04:30 PM', delay: 19.1 }", "{ name: 'Michael M. • Duct Repair', time: '04:30 PM', delay: 20.8 }");
code = code.replace('const graphProg = Math.min(1, Math.max(0, (t - 19.2) / 3.4));', 'const graphProg = Math.min(1, Math.max(0, (t - 20.2) / 3.4));');

// 6. Scene 6 Timing
code = code.replace('else if (t >= 23.8) {', 'else if (t >= 23.95) {');

// 7. Insert Continuous Dynamic Karaoke Caption Bar
const captionBlock = `
      // ==============================================================
      // CONTINUOUS DYNAMIC KARAOKE CAPTION READOUT (READING OUT ALL THE TIME)
      // Displays current sentence with active spoken word highlighted in Gold
      // ==============================================================
      const CAPTION_SEGMENTS = [
        {
          start: 0.15, end: 3.95,
          words: ["SPEED", "TO", "LEAD", "IS", "EVERYTHING.", "MOST", "CUSTOMERS", "HIRE", "WHOEVER", "ANSWERS", "FIRST."]
        },
        {
          start: 4.10, end: 7.90,
          words: ["WHEN", "YOU", "HIT", "VOICEMAIL,", "THAT", "CALLER", "HANGS", "UP", "AND", "CALLS", "YOUR", "COMPETITOR."]
        },
        {
          start: 8.10, end: 12.00,
          words: ["VANTORX", "ANSWERS", "IN", "0.2", "SECONDS,", "PICKING", "UP", "BEFORE", "THE", "SECOND", "RING."]
        },
        {
          start: 12.20, end: 15.80,
          words: ["OUR", "AI", "RECEPTIONIST", "QUALIFIES", "THE", "CUSTOMER", "AND", "CAPTURES", "EVERY", "DETAIL", "LIVE."]
        },
        {
          start: 16.00, end: 19.70,
          words: ["IT", "SYNCS", "YOUR", "CALENDAR,", "LOCKS", "THE", "SLOT,", "AND", "TEXTS", "THE", "DISPATCH", "ALERT."]
        },
        {
          start: 19.90, end: 23.80,
          words: ["WHILE", "YOU", "FOCUS", "ON", "THE", "JOB,", "VANTORX", "STACKS", "YOUR", "SCHEDULE", "WITH", "REVENUE."]
        },
        {
          start: 24.00, end: 27.60,
          words: ["OUT-ANSWER", "YOUR", "COMPETITION", "TODAY.", "VISIT", "VANTORXSOLUTIONS.COM"]
        }
      ];

      const curCap = CAPTION_SEGMENTS.find(c => t >= c.start && t <= c.end + 0.12);
      if (curCap) {
        ctx.save();
        ctx.translate(W / 2, 1690);

        // Glassmorphism Caption Capsule
        const capW = 960;
        const capH = 120;
        roundRect(ctx, -capW / 2, -capH / 2, capW, capH, 26, 'rgba(4, 9, 24, 0.94)', 'rgba(56, 189, 248, 0.85)', 2.5);

        // Subtle Ambient Glow
        ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
        ctx.shadowBlur = 16;

        // Word progress calculation
        const prog = Math.max(0, Math.min(0.999, (t - curCap.start) / (curCap.end - curCap.start)));
        const activeWordIdx = Math.floor(prog * curCap.words.length);

        ctx.font = '900 27px "SF Pro Display", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Split into 2 lines if long
        const totalWords = curCap.words.length;
        let line1Words = curCap.words;
        let line2Words = [];
        let mid = Math.ceil(totalWords / 2);
        if (totalWords > 6) {
          line1Words = curCap.words.slice(0, mid);
          line2Words = curCap.words.slice(mid);
        }

        function renderWordLine(lineWords, startIdx, lineY) {
          const spaceW = 12;
          const wordWidths = lineWords.map(w => ctx.measureText(w).width);
          const totalLineW = wordWidths.reduce((a, b) => a + b, 0) + (lineWords.length - 1) * spaceW;
          let drawX = -totalLineW / 2;

          lineWords.forEach((word, wIdx) => {
            const globalIdx = startIdx + wIdx;
            const isCurrent = (globalIdx === activeWordIdx);
            const isPast = (globalIdx < activeWordIdx);

            if (isCurrent) {
              ctx.fillStyle = '#facc15'; // Neon Gold for active word being spoken
              ctx.shadowColor = '#facc15';
              ctx.shadowBlur = 16;
              ctx.fillText(word, drawX + wordWidths[wIdx] / 2, lineY);
            } else if (isPast) {
              ctx.fillStyle = '#38bdf8'; // Electric Cyan for spoken words
              ctx.shadowColor = 'transparent';
              ctx.shadowBlur = 0;
              ctx.fillText(word, drawX + wordWidths[wIdx] / 2, lineY);
            } else {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; // Subdued white for upcoming words
              ctx.shadowColor = 'transparent';
              ctx.shadowBlur = 0;
              ctx.fillText(word, drawX + wordWidths[wIdx] / 2, lineY);
            }
            drawX += wordWidths[wIdx] + spaceW;
          });
        }

        if (line2Words.length > 0) {
          renderWordLine(line1Words, 0, -20);
          renderWordLine(line2Words, mid, 22);
        } else {
          renderWordLine(line1Words, 0, 0);
        }

        ctx.restore();
      }

      ctx.restore();
    };
`;

code = code.replace(/\n\s*ctx\.restore\(\);\s*\n\s*\}\;\s*\n\s*\<\/script\>/, captionBlock + '\n  </script>');

fs.writeFileSync(filePath, code, 'utf8');
console.log('✓ Successfully updated render_speed_to_lead_reel.js with continuous timing and dynamic karaoke caption bar!');
