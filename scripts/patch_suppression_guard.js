const fs = require('fs');
const path = require('path');

const p = path.resolve('scripts/cloud_outbound_engine.js');
let content = fs.readFileSync(p, 'utf8');

const target = `  // Block placeholder/synthesized prefixes & unverified guessed emails (zero hard bounces)
  const srcLower = (lead.emailSource || '').toLowerCase();
  const isWebsiteVerified = srcLower.includes('website verified') || srcLower.includes('website scraped') || srcLower.includes('published');
  if (
    KNOWN_SUPPRESSED.has(cleanEmail) ||
    localPart === 'the.owner' ||
    localPart === 'executive.leadership' ||
    localPart === 'franchise.owner' ||
    cleanEmail.includes('the.owner@') ||
    srcLower.includes('pattern synthesized') ||
    !isWebsiteVerified
  ) {`;

const replacement = `  // Block placeholder/synthesized prefixes & unverified guessed emails (zero hard bounces)
  const srcLower = (lead.emailSource || '').toLowerCase();
  const isMxVerified = srcLower.includes('mx verified') || lead.mx_status === 'VERIFIED';
  const isWebsiteVerified = srcLower.includes('website verified') || srcLower.includes('website scraped') || srcLower.includes('published');
  if (
    KNOWN_SUPPRESSED.has(cleanEmail) ||
    localPart === 'the.owner' ||
    localPart === 'executive.leadership' ||
    localPart === 'franchise.owner' ||
    cleanEmail.includes('the.owner@') ||
    cleanEmail.endsWith('.con') ||
    (!isMxVerified && !isWebsiteVerified)
  ) {`;

// Normalize CRLF to LF for matching, then do replacement
const normalizedContent = content.replace(/\r\n/g, '\n');
const normalizedTarget = target.replace(/\r\n/g, '\n');
const normalizedReplacement = replacement.replace(/\r\n/g, '\n');

if (normalizedContent.includes(normalizedTarget)) {
  const result = normalizedContent.replace(normalizedTarget, normalizedReplacement);
  fs.writeFileSync(p, result, 'utf8');
  console.log('Successfully replaced suppression guard!');
} else {
  console.error('Target not found in normalized content!');
}
