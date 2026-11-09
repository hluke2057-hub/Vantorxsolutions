const fs = require('fs');

const transcriptPath = 'C:/Users/hungr/.gemini/antigravity/brain/b805e771-e1c1-4976-afc1-cd59dd49eae0/.system_generated/logs/transcript.jsonl';
if (fs.existsSync(transcriptPath)) {
  const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
  console.log('Total transcript lines:', lines.length);
  lines.forEach((l, i) => {
    if (!l.trim()) return;
    try {
      const j = JSON.parse(l);
      if (j.type === 'USER_INPUT') {
        const text = typeof j.content === 'string' ? j.content : JSON.stringify(j.content);
        if (text.toLowerCase().includes('cylex') || text.toLowerCase().includes('yellow') || text.toLowerCase().includes('.com') || text.toLowerCase().includes('website') || text.toLowerCase().includes('lead')) {
          console.log(`[Step ${j.step_index || i}]: ${text}`);
        }
      }
    } catch(e) {}
  });
} else {
  console.log('Transcript not found');
}
