/**
 * VantorX Multi-Engine Email Discovery & Lead Enrichment Engine
 * Integrates:
 *   1. Hunter.io (Domain Search & Pattern Analysis)
 *   2. Apollo.io (Direct Decision Maker & Owner Match)
 *   3. Snov.io (Email Verification & Drip Discovery)
 *   4. RocketReach (Professional & Executive Email Lookup)
 *   5. ContactOut (Direct Personal & Business Contact Finder)
 * + Real-time DNS MX Resolution & Verification
 */

const fs = require('fs');
const path = require('path');
const {
  loadEnrichmentKeys,
  cleanDomainFromLead,
  getEnrichmentLinks,
  checkDomainMx,
  enrichLeadEmail,
} = require('../website/api/_lib/lead-enricher');

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const WEB_DATA_DIR = path.resolve(__dirname, '..', 'website', 'data');

async function main() {
  console.log('==============================================================================');
  console.log('   VANTORX MULTI-ENGINE EMAIL FINDER & LEAD ENRICHMENT SUITE                  ');
  console.log('   Platforms: Hunter.io · Apollo.io · Snov.io · RocketReach · ContactOut      ');
  console.log('==============================================================================\n');

  const keys = loadEnrichmentKeys();
  console.log('API Key Configuration Status:');
  console.log('  • Hunter.io:    ', keys.hunter ? 'CONFIGURED (' + keys.hunter.substring(0, 4) + '...)' : 'Pending (Using Waterfall Fallback & 1-Click Deep Links)');
  console.log('  • Apollo.io:    ', keys.apollo ? 'CONFIGURED (' + keys.apollo.substring(0, 4) + '...)' : 'Pending (Using Waterfall Fallback & 1-Click Deep Links)');
  console.log('  • Snov.io:      ', keys.snovClientId ? 'CONFIGURED' : 'Pending (Using Waterfall Fallback & 1-Click Deep Links)');
  console.log('  • RocketReach:  ', keys.rocketReach ? 'CONFIGURED' : 'Pending (Using Waterfall Fallback & 1-Click Deep Links)');
  console.log('  • ContactOut:   ', keys.contactOut ? 'CONFIGURED' : 'Pending (Using Waterfall Fallback & 1-Click Deep Links)\n');

  // 1. Process Florida 100 No-Website Leads
  const flPath = path.join(DATA_DIR, 'florida_100_no_website_leads.json');
  if (fs.existsSync(flPath)) {
    console.log('1. Enriching Florida 100 No-Website Contractor Targets...');
    const flLeads = JSON.parse(fs.readFileSync(flPath, 'utf8'));
    let flEnrichedCount = 0;

    for (const lead of flLeads) {
      const links = getEnrichmentLinks(lead.owner, lead.company, null);
      lead.enrichmentLinks = links;

      if (!lead.email || lead.email.trim() === '') {
        const enriched = await enrichLeadEmail(lead);
        if (enriched && enriched.email) {
          lead.email = enriched.email;
          lead.emailSource = enriched.source;
          lead.mxStatus = enriched.verified ? 'VERIFIED' : 'SYNTHESIZED';
          lead.mxHost = enriched.mxHost || null;
          flEnrichedCount++;
        }
      }
    }

    fs.writeFileSync(flPath, JSON.stringify(flLeads, null, 2), 'utf8');
    const webFlPath = path.join(WEB_DATA_DIR, 'florida_100_no_website_leads.json');
    if (fs.existsSync(path.dirname(webFlPath))) {
      fs.writeFileSync(webFlPath, JSON.stringify(flLeads, null, 2), 'utf8');
    }

    // Also update CSV
    const flCsvLines = ['ID,Company,Owner,Trade,Phone,City,State,Zip,Rating,Employees,Email,EmailSource,MXStatus,HunterLink,ApolloLink,SnovLink,RocketReachLink,ContactOutLink'];
    flLeads.forEach(l => {
      flCsvLines.push(`"${l.id}","${l.company}","${l.owner}","${l.trade}","${l.phone}","${l.city}","${l.state}","${l.zip}","${l.rating}","${l.employees}","${l.email || ''}","${l.emailSource || ''}","${l.mxStatus || ''}","${l.enrichmentLinks.hunter}","${l.enrichmentLinks.apollo}","${l.enrichmentLinks.snov}","${l.enrichmentLinks.rocketreach}","${l.enrichmentLinks.contactout}"`);
    });
    fs.writeFileSync(path.join(DATA_DIR, 'florida_100_no_website_leads.csv'), flCsvLines.join('\n'), 'utf8');

    console.log(`   ✓ Enriched ${flEnrichedCount} / ${flLeads.length} Florida targets with verified/pattern emails & 5-engine links.\n`);
  }

  // 2. Process Verified Targets Queue (Nationwide / Core Leads)
  const qPath = path.join(DATA_DIR, 'verified_targets_queue.json');
  if (fs.existsSync(qPath)) {
    console.log('2. Enriching Verified Targets Outbound Queue...');
    const qLeads = JSON.parse(fs.readFileSync(qPath, 'utf8'));
    let qEnrichedCount = 0;

    for (const lead of qLeads) {
      const domain = cleanDomainFromLead(lead);
      lead.enrichmentLinks = getEnrichmentLinks(lead.owner, lead.company, domain);

      if (!lead.email || !lead.email.includes('@')) {
        const enriched = await enrichLeadEmail(lead);
        if (enriched && enriched.email) {
          lead.email = enriched.email;
          lead.emailSource = enriched.source;
          lead.mxStatus = enriched.verified ? 'VERIFIED' : 'SYNTHESIZED';
          lead.mxHost = enriched.mxHost || null;
          qEnrichedCount++;
        }
      } else {
        // Lead already has an email, verify MX if missing
        if (!lead.mx_status || lead.mx_status === 'UNCHECKED') {
          const emailDomain = lead.email.split('@')[1];
          const mx = await checkDomainMx(emailDomain);
          lead.mx_status = mx.valid ? 'VERIFIED' : 'UNVERIFIED';
          lead.mx_host = mx.host || null;
        }
      }
    }

    fs.writeFileSync(qPath, JSON.stringify(qLeads, null, 2), 'utf8');
    const webQPath = path.join(WEB_DATA_DIR, 'verified_targets_queue.json');
    if (fs.existsSync(path.dirname(webQPath))) {
      fs.writeFileSync(webQPath, JSON.stringify(qLeads, null, 2), 'utf8');
    }

    console.log(`   ✓ Processed ${qLeads.length} queue leads. Enriched new emails & verified MX records.\n`);
  }

  console.log('==============================================================================');
  console.log('   ENRICHMENT COMPLETE: ALL 5 SERVICES LINKED & MX SHIELD ACTIVE              ');
  console.log('==============================================================================');
}

main().catch(err => {
  console.error('Fatal error in enrichment runner:', err);
  process.exit(1);
});
