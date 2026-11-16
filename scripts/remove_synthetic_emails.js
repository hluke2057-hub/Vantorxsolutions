const fs = require("fs");
const path = require("path");

const files = [
  path.resolve(__dirname, "..", "website", "cold-call-arena", "index.html"),
  path.resolve(__dirname, "..", "website", "cold-call-arena", "international-vault.html")
];

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, "utf8");
  const badSnippet = "const defaultEmail = lead.email || (lead.company ? (lead.company.toLowerCase().replace(/[^a-z0-9]/g, '') + '@gmail.com') : '');";
  const cleanSnippet = "const defaultEmail = lead.email || '';";
  
  if (content.includes(badSnippet)) {
    const occurrences = content.split(badSnippet).length - 1;
    content = content.replaceAll(badSnippet, cleanSnippet);
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Replaced ${occurrences} instances of synthetic @gmail fallback in ${path.basename(filePath)}`);
  } else {
    console.log(`Snippet not found in ${path.basename(filePath)}`);
  }
}