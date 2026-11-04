const fs = require('fs');
const readline = require('readline');
const brain = 'C:/Users/hungr/.gemini/antigravity/brain/b805e771-e1c1-4976-afc1-cd59dd49eae0/.system_generated/logs/transcript.jsonl';
const rl = readline.createInterface({ input: fs.createReadStream(brain), crlfDelay: Infinity });

let lineNum = 0;
rl.on('line', (line) => {
  lineNum++;
  if (lineNum >= 22615 && lineNum <= 22923) {
    try {
      const obj = JSON.parse(line);
      const text = JSON.stringify(obj);
      if (text.includes('reel') || text.includes('Instagram') || text.includes('video') || text.includes('visual')) {
        const c = typeof obj.content === 'string' ? obj.content : JSON.stringify(obj.content);
        console.log(`[Line ${lineNum}]:`, c.slice(0, 300));
      }
    } catch(e) {}
  }
});
