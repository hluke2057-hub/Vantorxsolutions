const fs = require('fs');

const transcriptPath = 'C:/Users/hungr/.gemini/antigravity/brain/b805e771-e1c1-4976-afc1-cd59dd49eae0/.system_generated/logs/transcript.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
lines.forEach((l, i) => {
  if (!l.trim()) return;
  try {
    const j = JSON.parse(l);
    if (j.type === 'USER_INPUT' && (j.step_index >= 28000 && j.step_index <= 29300)) {
      console.log(`\n=== STEP ${j.step_index} ===\n${j.content}\n`);
    }
  } catch(e) {}
});
