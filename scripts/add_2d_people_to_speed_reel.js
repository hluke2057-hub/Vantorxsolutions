// scripts/add_2d_people_to_speed_reel.js
const fs = require('fs');
const path = require('path');

const targetPath = path.resolve('scripts/render_speed_to_lead_reel.js');
let code = fs.readFileSync(targetPath, 'utf8').replace(/\r\n/g, '\n');

// 1. Add draw2DCharacter function before window.renderFrame
const characterFunc = `
    // ----------------------------------------------------------------------------
    // 2D ILLUSTRATED VECTOR CHARACTER ENGINE (Matches modern Cueva/Taskflix style)
    // Detailed expressive face, specular pupil shines, eyebrows, animated mouth,
    // sculpted hair/hardhat, contractor safety vest, suit, sweater, hands & props!
    // ----------------------------------------------------------------------------
    function draw2DCharacter(ctx, opts, t) {
      const {
        x,
        y, // Foot level Y
        scale = 1.0,
        outfit = 'contractor', // 'contractor' | 'sweater_coral' | 'suit'
        hair = 'hardhat', // 'hardhat' | 'auburn' | 'curly_gold'
        mood = 'smile', // 'smile' | 'talk' | 'worried' | 'panic'
        leftArmAngle = 0.25,
        rightArmAngle = -0.25,
        holdingItem = null // 'phone' | 'wrench'
      } = opts;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      const bob = Math.sin(t * 4.5 + x * 0.02) * 2.5;

      // 1. Shoes
      ctx.fillStyle = (outfit === 'sweater_coral') ? '#e2e8f0' : '#0f172a';
      ctx.beginPath();
      ctx.ellipse(-26, -6, 20, 9, 0, 0, Math.PI * 2);
      ctx.ellipse(26, -6, 20, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Trousers / Legs
      ctx.fillStyle = (outfit === 'contractor') ? '#1e293b' : '#334155';
      roundRect(ctx, -38, -105, 26, 98, 6, ctx.fillStyle, null);
      roundRect(ctx, 12, -105, 26, 98, 6, ctx.fillStyle, null);

      // 3. Torso with breathing bob
      ctx.save();
      ctx.translate(0, bob);

      if (outfit === 'contractor') {
        // Blue work shirt base
        roundRect(ctx, -48, -225, 96, 125, 16, '#1d4ed8', null);
        // High-vis orange safety vest
        roundRect(ctx, -46, -223, 92, 120, 14, '#f97316', '#fb923c', 1.5);
        // Reflective yellow safety stripes
        ctx.fillStyle = '#fde047';
        ctx.fillRect(-46, -155, 92, 10);
        ctx.fillRect(-46, -130, 92, 10);
        ctx.fillRect(-30, -223, 12, 68);
        ctx.fillRect(18, -223, 12, 68);
      } else if (outfit === 'sweater_coral') {
        // Coral homeowner sweater (Sarah Jenkins)
        roundRect(ctx, -48, -225, 96, 125, 18, '#f43f5e', null);
        roundRect(ctx, -48, -120, 96, 16, 6, '#e11d48', null);
      } else {
        // Charcoal business suit
        roundRect(ctx, -48, -225, 96, 125, 16, '#27272a', '#3f3f46', 1.5);
        ctx.fillStyle = '#bae6fd';
        ctx.beginPath();
        ctx.moveTo(-22, -225);
        ctx.lineTo(22, -225);
        ctx.lineTo(0, -165);
        ctx.closePath();
        ctx.fill();
      }

      // 4. Arms & Hands
      const armCol = (outfit === 'contractor') ? '#1d4ed8' : (outfit === 'sweater_coral') ? '#f43f5e' : '#27272a';
      [-1, 1].forEach(side => {
        const isRight = (side === 1);
        const shoulderX = side * 48;
        const shoulderY = -208;
        const angle = isRight ? rightArmAngle : leftArmAngle;

        ctx.save();
        ctx.translate(shoulderX, shoulderY);
        ctx.rotate(angle);

        // Sleeve
        roundRect(ctx, -12, 0, 24, 78, 11, armCol, null);

        // Peach Hand
        ctx.fillStyle = '#eab68c';
        ctx.beginPath();
        ctx.arc(0, 86, 14, 0, Math.PI * 2);
        ctx.fill();

        // Optional Props
        if (isRight && holdingItem === 'phone') {
          ctx.save();
          ctx.translate(4, 82);
          ctx.rotate(-0.35);
          roundRect(ctx, -14, -36, 28, 52, 6, '#0f172a', '#38bdf8', 2);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(-10, -30, 20, 36);
          ctx.restore();
        } else if (isRight && holdingItem === 'wrench') {
          ctx.save();
          ctx.translate(4, 86);
          ctx.rotate(-0.5 + Math.sin(t * 6) * 0.2);
          roundRect(ctx, -5, -45, 10, 52, 4, '#cbd5e1', '#64748b', 1.5);
          ctx.beginPath();
          ctx.arc(0, -48, 12, 0.4, Math.PI * 2 - 0.4);
          ctx.lineWidth = 6;
          ctx.strokeStyle = '#cbd5e1';
          ctx.stroke();
          ctx.restore();
        }

        ctx.restore();
      });

      // 5. Head
      const headY = -278;
      ctx.fillStyle = '#eab68c';
      ctx.beginPath();
      ctx.arc(0, headY, 46, 0, Math.PI * 2);
      ctx.fill();

      // Warm forehead shadow
      ctx.fillStyle = 'rgba(180, 115, 70, 0.24)';
      ctx.beginPath();
      ctx.ellipse(0, headY - 18, 34, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // 6. Eyes with Specular Shine
      [-15, 15].forEach(ex => {
        ctx.fillStyle = '#111827';
        ctx.beginPath();
        ctx.arc(ex, headY - 4, 5.8, 0, Math.PI * 2);
        ctx.fill();
        // Pupil shine
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ex - 1.8, headY - 6, 2.0, 0, Math.PI * 2);
        ctx.fill();
      });

      // 7. Eyebrows
      ctx.strokeStyle = '#3f2314';
      ctx.lineWidth = 4.2;
      ctx.lineCap = 'round';
      if (mood === 'worried' || mood === 'panic') {
        ctx.beginPath();
        ctx.moveTo(-24, headY - 13);
        ctx.lineTo(-8, headY - 20);
        ctx.moveTo(24, headY - 13);
        ctx.lineTo(8, headY - 20);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(-23, headY - 17);
        ctx.lineTo(-8, headY - 16);
        ctx.moveTo(8, headY - 16);
        ctx.lineTo(23, headY - 17);
        ctx.stroke();
      }

      // 8. Animated Mouth
      ctx.strokeStyle = '#5c2814';
      ctx.fillStyle = '#5c2814';
      ctx.lineWidth = 4.0;
      if (mood === 'talk') {
        const talkOpen = 3 + Math.abs(Math.sin(t * 14)) * 6;
        ctx.beginPath();
        ctx.ellipse(0, headY + 15, 10, talkOpen, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (mood === 'worried') {
        ctx.beginPath();
        ctx.ellipse(0, headY + 16, 9, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Confident Smile
        ctx.beginPath();
        ctx.arc(0, headY + 8, 14, 0.2, Math.PI - 0.15);
        ctx.stroke();
      }

      // 9. Hair / Hardhat
      if (hair === 'hardhat') {
        // Brown hair sides
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(-38, headY - 10, 12, 0, Math.PI * 2);
        ctx.arc(38, headY - 10, 12, 0, Math.PI * 2);
        ctx.fill();
        // Yellow Contractor Hardhat
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(0, headY - 16, 48, Math.PI, Math.PI * 2);
        ctx.fill();
        roundRect(ctx, -56, headY - 20, 112, 11, 5, '#eab308', '#fef08a', 1.5);
        // Hardhat shine
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.arc(0, headY - 16, 36, Math.PI + 0.4, Math.PI + 1.1);
        ctx.stroke();
      } else if (hair === 'auburn') {
        // Smooth Auburn Hair (Sarah Jenkins)
        ctx.fillStyle = '#9a3412';
        ctx.beginPath();
        ctx.arc(0, headY - 14, 48, Math.PI - 0.15, Math.PI * 2 + 0.15);
        ctx.fill();
        // Glossy hair highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(16, headY - 40);
        ctx.lineTo(28, headY - 30);
        ctx.stroke();
      }

      ctx.restore(); // bob restore
      ctx.restore(); // main character restore
    }
`;

// Insert characterFunc before window.renderFrame
code = code.replace('    // Master Render Frame Function\n    window.renderFrame = function(t) {', characterFunc + '\n    // Master Render Frame Function\n    window.renderFrame = function(t) {');

// 2. Integrate 2D People into Scene 2: The Customer Calling and Voicemail Graveyard
// Move competitor phone slightly to the right (x: 740), put 2D customer on left (x: 280)
const oldScene2Phone = `        // Competitor Phone ringing endlessly
        ctx.save();
        ctx.translate(W / 2, 780);
        roundRect(ctx, -170, -320, 340, 640, 44, '#080d1a', 'rgba(239, 68, 68, 0.6)', 3);
        roundRect(ctx, -150, -300, 300, 600, 32, '#03060f', null);

        // Ringing cycles
        const rings = Math.min(5, Math.floor((t - 4.05) * 1.5) + 1);
        drawPhoneIcon(ctx, 0, -80, 85, '#ef4444');

        ctx.textAlign = 'center';
        ctx.font = '800 28px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Ringing... (' + rings + ')', 0, 15);

        // At 5.5s -> Voicemail Reached
        if (t >= 5.5) {
          roundRect(ctx, -130, 60, 260, 60, 18, '#ef4444', null);
          ctx.font = '900 22px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('VOICEMAIL REACHED', 0, 95);

          ctx.font = '600 18px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#f87171';
          ctx.fillText('Customer hanging up...', 0, 150);
        }
        ctx.restore();`;

const newScene2PhoneAndPerson = `        // 2D Homeowner Character (Sarah Jenkins) Calling in Frustration
        const custProg = Math.min(1, (t - 4.05) / 0.5);
        ctx.save();
        ctx.translate(260, 1080);
        ctx.scale(easeOutBack(custProg), easeOutBack(custProg));
        draw2DCharacter(ctx, {
          x: 0,
          y: 0,
          scale: 1.25,
          outfit: 'sweater_coral',
          hair: 'auburn',
          mood: (t >= 5.5) ? 'worried' : 'talk',
          leftArmAngle: 0.2,
          rightArmAngle: -1.25,
          holdingItem: 'phone'
        }, t);

        // Frustration bubble
        if (t >= 5.5) {
          roundRect(ctx, -110, -420, 220, 62, 16, '#0f172a', '#ef4444', 2);
          ctx.font = '800 18px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#f87171';
          ctx.textAlign = 'center';
          ctx.fillText('Hanging up...', 0, -382);
        }
        ctx.restore();

        // Competitor Phone Screen on Right
        ctx.save();
        ctx.translate(750, 780);
        roundRect(ctx, -160, -320, 320, 640, 44, '#080d1a', 'rgba(239, 68, 68, 0.6)', 3);
        roundRect(ctx, -140, -300, 280, 600, 32, '#03060f', null);

        // Ringing cycles
        const rings = Math.min(5, Math.floor((t - 4.05) * 1.5) + 1);
        drawPhoneIcon(ctx, 0, -80, 85, '#ef4444');

        ctx.textAlign = 'center';
        ctx.font = '800 28px "SF Pro Display", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Ringing... (' + rings + ')', 0, 15);

        // At 5.5s -> Voicemail Reached
        if (t >= 5.5) {
          roundRect(ctx, -125, 60, 250, 60, 18, '#ef4444', null);
          ctx.font = '900 22px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('VOICEMAIL REACHED', 0, 95);

          ctx.font = '600 18px "SF Pro Display", sans-serif';
          ctx.fillStyle = '#f87171';
          ctx.fillText('Customer hanging up...', 0, 150);
        }
        ctx.restore();`;

code = code.replace(oldScene2Phone, newScene2PhoneAndPerson);

// 3. Integrate 2D People into Scene 4A & 4B
// In Scene 4A (Qualifies Callers): add Sarah Jenkins speaking
const oldScene4ACard = `          // Animated Contact Card (Sarah Jenkins)
          ctx.save();
          ctx.translate(W / 2, 1080);
          roundRect(ctx, -380, -220, 760, 440, 32, '#0c1630', '#10b981', 3);`;

const newScene4ACardAndPerson = `          // 2D Customer (Sarah Jenkins) Speaking Live
          ctx.save();
          ctx.translate(180, 1380);
          draw2DCharacter(ctx, {
            x: 0,
            y: 0,
            scale: 1.15,
            outfit: 'sweater_coral',
            hair: 'auburn',
            mood: 'talk',
            leftArmAngle: 0.2,
            rightArmAngle: -1.25,
            holdingItem: 'phone'
          }, t);
          ctx.restore();

          // Animated Contact Card (Sarah Jenkins)
          ctx.save();
          ctx.translate(620, 1080);
          roundRect(ctx, -300, -220, 600, 440, 32, '#0c1630', '#10b981', 3);`;

code = code.replace(oldScene4ACard, newScene4ACardAndPerson);

// In Scene 4B (Locks Appointment & SMS): add Contractor in hardhat
const oldScene4BCalendar = `          // Calendar Card
          ctx.save();
          ctx.translate(W / 2, 680);
          roundRect(ctx, -380, -220, 760, 440, 32, '#0c1630', '#10b981', 3);`;

const newScene4BCalendarAndContractor = `          // 2D Contractor in Hardhat receiving confirmed job
          ctx.save();
          ctx.translate(880, 1080);
          draw2DCharacter(ctx, {
            x: 0,
            y: 0,
            scale: 1.15,
            outfit: 'contractor',
            hair: 'hardhat',
            mood: 'smile',
            leftArmAngle: 0.25,
            rightArmAngle: -1.15,
            holdingItem: 'phone'
          }, t);
          ctx.restore();

          // Calendar Card
          ctx.save();
          ctx.translate(450, 680);
          roundRect(ctx, -360, -220, 720, 440, 32, '#0c1630', '#10b981', 3);`;

code = code.replace(oldScene4BCalendar, newScene4BCalendarAndContractor);

// 4. Integrate 2D Contractor into Scene 5: Confident Thumbs-up Contractor
const oldScene5Graph = `        // Upward Growth Spline Graph
        ctx.save();
        ctx.translate(W / 2, 1180);
        roundRect(ctx, -400, -280, 800, 560, 36, '#081024', 'rgba(56, 189, 248, 0.4)', 2);`;

const newScene5GraphAndContractor = `        // 2D Contractor celebrating confirmed schedule
        ctx.save();
        ctx.translate(180, 1380);
        draw2DCharacter(ctx, {
          x: 0,
          y: 0,
          scale: 1.18,
          outfit: 'contractor',
          hair: 'hardhat',
          mood: 'smile',
          leftArmAngle: -0.4,
          rightArmAngle: -0.4,
          holdingItem: 'wrench'
        }, t);
        ctx.restore();

        // Upward Growth Spline Graph
        ctx.save();
        ctx.translate(650, 1180);
        roundRect(ctx, -320, -280, 640, 560, 36, '#081024', 'rgba(56, 189, 248, 0.4)', 2);`;

code = code.replace(oldScene5Graph, newScene5GraphAndContractor);

fs.writeFileSync(targetPath, code, 'utf8');
console.log('✓ Successfully integrated 2D Illustrated Vector People into render_speed_to_lead_reel.js!');
