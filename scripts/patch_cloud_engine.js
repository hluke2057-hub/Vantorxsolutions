const fs = require("fs");
const path = require("path");

const enginePath = path.resolve(__dirname, "..", "scripts", "cloud_outbound_engine.js");
let content = fs.readFileSync(enginePath, "utf8");

// Add import near top if not present
if (!content.includes('const { sendEmail } = require("../website/api/_lib/email");') && !content.includes("website/api/_lib/email")) {
  content = `const { sendEmail } = require("../website/api/_lib/email");\n` + content;
}

// Replace sendPhysicalEmail body
const oldSnippet = `  try {
    const payload = {
      from: \`\${SENDER_NAME} <\${SENDER_EMAIL}>\`,
      to: [lead.email],
      subject: lead.subject,
      text: lead.body
    };
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${RESEND_API_KEY}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      console.error(\`[Resend Error] Delivery failed for \${lead.email}:\`, data);
      return null;
    }
    return data.id || null;
  } catch (err) {
    console.error(\`[Resend Exception] Delivery failed for \${lead.email}:\`, err.message);
    return null;
  }`;

const newSnippet = `  try {
    const res = await sendEmail({
      to: lead.email,
      subject: lead.subject,
      text: lead.body,
      from: \`\${SENDER_NAME} <\${SENDER_EMAIL}>\`,
      businessName: lead.company,
      source: "cloud_outbound_engine"
    });
    if (!res.ok) {
      console.error(\`[Resend Error] Delivery failed for \${lead.email}:\`, res.error);
      return null;
    }
    return res.id || null;
  } catch (err) {
    console.error(\`[Resend Exception] Delivery failed for \${lead.email}:\`, err.message);
    return null;
  }`;

if (content.includes(oldSnippet)) {
  content = content.replace(oldSnippet, newSnippet);
  fs.writeFileSync(enginePath, content, "utf8");
  console.log("Successfully connected cloud_outbound_engine.js to sendEmail");
} else {
  // Try CRLF replace
  const oldCRLF = oldSnippet.replace(/\n/g, "\r\n");
  const newCRLF = newSnippet.replace(/\n/g, "\r\n");
  if (content.includes(oldCRLF)) {
    content = content.replace(oldCRLF, newCRLF);
    fs.writeFileSync(enginePath, content, "utf8");
    console.log("Successfully connected cloud_outbound_engine.js (CRLF) to sendEmail");
  } else {
    console.log("Snippet not found in cloud_outbound_engine.js");
  }
}