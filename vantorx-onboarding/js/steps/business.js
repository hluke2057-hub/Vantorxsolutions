/* ============================================================
   VANTORX ONBOARDING — steps/business.js
   Step 1 · Business information + industry picker
   Step 2 · Services & pricing (industry presets + custom rows)
   ============================================================ */

import { esc } from '../utils.js';
import { INDUSTRIES } from '../data.js';

/* ---------------- step 1: business ---------------- */
export function paintBusiness(body, d, rerender) {
  body.innerHTML = `
    <div class="onboard-title">Tell us about the business</div>
    <div class="onboard-sub">This is what the AI receptionist says and knows on day one.</div>

    <div class="card-title" style="margin-bottom:12px">🏢 Business details</div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Business name <span class="req">*</span></label>
        <input class="form-input" id="fName" value="${esc(d.name)}" placeholder="e.g. Fade Culture Barbering"></div>
      <div class="form-group"><label class="form-label">Owner / contact <span class="req">*</span></label>
        <input class="form-input" id="fContact" value="${esc(d.contact)}" placeholder="Who manages this account"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Email <span class="req">*</span></label>
        <input class="form-input" id="fEmail" type="email" value="${esc(d.email)}" placeholder="owner@business.com"></div>
      <div class="form-group"><label class="form-label">Phone <span class="req">*</span></label>
        <input class="form-input" id="fPhone" value="${esc(d.phone)}" placeholder="(555) 555-0100"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">City <span class="req">*</span></label>
        <input class="form-input" id="fCity" value="${esc(d.city)}" placeholder="City, ST"></div>
      <div class="form-group"><label class="form-label">Website (optional)</label>
        <input class="form-input" id="fWebsite" value="${esc(d.website)}" placeholder="https://"></div>
    </div>

    <div class="card-title" style="margin:18px 0 12px">🧭 Industry</div>
    <div class="obx-ind-grid" id="indGrid">
      ${INDUSTRIES.map(i => `
        <button class="obx-ind ${d.industry === i.id ? 'selected' : ''}" data-ind="${i.id}">
          <span class="obx-ind-ico">${i.icon}</span>
          <span>${i.label}</span>
        </button>`).join('')}
    </div>
    <div class="form-hint" style="margin-top:10px">Industry presets load sample services you can edit in the next step.</div>
  `;

  const g = id => body.querySelector(id).value.trim();
  const grab = () => ({
    name: g('#fName'), contact: g('#fContact'), email: g('#fEmail'),
    phone: g('#fPhone'), city: g('#fCity'), website: g('#fWebsite'),
  });

  body.querySelectorAll('[data-ind]').forEach(b => b.addEventListener('click', () => {
    d.industry = b.dataset.ind;
    body.querySelectorAll('[data-ind]').forEach(x => x.classList.toggle('selected', x.dataset.ind === d.industry));
  }));

  body.querySelectorAll('input').forEach(inp => inp.addEventListener('input', () => Object.assign(d, grab())));

  return {
    validate() {
      const v = grab();
      if (!v.name || !v.contact || !v.email || !v.phone || !v.city) return 'Fill in every required field to continue.';
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) return 'Enter a valid email address.';
      return '';
    },
    collect() { Object.assign(d, grab()); },
  };
}

/* ---------------- step 2: services ---------------- */
export function paintServices(body, d, rerender) {
  const presets = (INDUSTRIES.find(i => i.id === d.industry) || {}).services || [];
  const suggested = presets.filter(p => !d.services.some(s => s.name === parseName(p)));

  body.innerHTML = `
    <div class="onboard-title">Services &amp; pricing</div>
    <div class="onboard-sub">What customers can ask about or book. The AI quotes these prices verbatim.</div>

    ${suggested.length ? `
    <div class="card-title" style="margin-bottom:10px">✨ Suggested for your industry <span class="cell-dim">(tap to add)</span></div>
    <div class="test-chip-row" style="margin-bottom:18px">
      ${suggested.map((s, i) => `<button class="test-chip" data-add="${i}">+ ${esc(s)}</button>`).join('')}
    </div>` : ''}

    <div class="card-title" style="margin-bottom:10px">📋 Your service list</div>
    <div id="svcRows">
      ${d.services.length ? d.services.map((s, i) => `
        <div class="obx-svc-row">
          <input class="form-input" data-f="name" data-i="${i}" value="${esc(s.name)}" placeholder="Service name">
          <input class="form-input obx-svc-price" data-f="price" data-i="${i}" value="${esc(s.price)}" placeholder="$0">
          <input class="form-input obx-svc-min" data-f="minutes" data-i="${i}" value="${esc(s.minutes)}" placeholder="min">
          <button class="icon-btn" data-del="${i}" title="Remove">✕</button>
        </div>`).join('')
      : `<div class="obx-hint-box">No services yet — add one below or tap a suggestion above.</div>`}
    </div>
    <button class="btn btn-ghost btn-sm" id="addSvc" style="margin-top:12px">+ Add service</button>
  `;

  function parseName(p) { return p.split('—')[0].trim(); }

  function parsePreset(p) {
    const m = p.match(/^(.*?)\s*[—-]\s*\$(\d+)(?:\s*\/\s*(\d+)\s*min)?$/);
    /* plain numeric price — the server validates it and stores it as a number */
    return m ? { name: m[1].trim(), price: m[2], minutes: m[3] || '' } : { name: p, price: '', minutes: '' };
  }

  body.querySelectorAll('[data-add]').forEach(b => b.addEventListener('click', () => {
    d.services.push(parsePreset(suggested[Number(b.dataset.add)]));
    rerender();
  }));

  body.querySelector('#addSvc').addEventListener('click', () => {
    d.services.push({ name: '', price: '', minutes: '' });
    rerender();
  });

  body.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
    d.services.splice(Number(b.dataset.del), 1);
    rerender();
  }));

  body.querySelectorAll('[data-f]').forEach(inp => inp.addEventListener('input', () => {
    const s = d.services[Number(inp.dataset.i)];
    if (s) s[inp.dataset.f] = inp.value;
  }));

  return {
    validate() {
      const bad = d.services.find(s => (s.name.trim() && !s.price.trim()) || (!s.name.trim() && s.price.trim()));
      if (bad) return 'Give each service both a name and a price.';
      return '';
    },
    collect() {},
  };
}
