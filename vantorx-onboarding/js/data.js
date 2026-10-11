/* ============================================================
   VANTORX ONBOARDING — data.js
   Presets and demo content: industries, sample services,
   starter FAQ templates, AI personalities, connection catalog.
   ============================================================ */

export const INDUSTRIES = [
  { id: 'barbershop', label: 'Barbershop', icon: '💈', services: ['Haircut — $30 / 30 min', 'Haircut + Beard — $45 / 45 min', 'Kids cut — $20 / 25 min', 'Hot towel shave — $35 / 30 min'] },
  { id: 'salon', label: 'Salon / Spa', icon: '💅', services: ['Cut & style — $55 / 60 min', 'Color — $120 / 120 min', 'Manicure — $35 / 45 min', 'Blowout — $45 / 45 min'] },
  { id: 'dental', label: 'Dental / Clinic', icon: '🦷', services: ['Cleaning — $120 / 45 min', 'Consultation — $80 / 30 min', 'Emergency visit — $150 / 45 min'] },
  { id: 'auto', label: 'Auto Detailing', icon: '🚗', services: ['Exterior wash — $40 / 45 min', 'Full detail — $180 / 180 min', 'Interior only — $95 / 90 min'] },
  { id: 'fitness', label: 'Gym / Studio', icon: '🏋️', services: ['Class drop-in — $20 / 60 min', 'Personal training — $65 / 60 min', 'Monthly membership — $89'] },
  { id: 'other', label: 'Other', icon: '🏢', services: [] },
];

export const PERSONALITIES = [
  { id: 'Friendly', icon: '😊', blurb: 'Warm and welcoming — great for salons, barbershops, and local favorites.' },
  { id: 'Professional', icon: '💼', blurb: 'Polished and direct — ideal for clinics, law offices, and premium brands.' },
  { id: 'Casual', icon: '😎', blurb: 'Relaxed and conversational — fits studios, creative shops, and young crowds.' },
];

export const CONNECTIONS = [
  { id: 'calendar', icon: '📅', title: 'Calendar connection', desc: 'Sync with Google Calendar so booked slots never double-book.' },
  { id: 'phone', icon: '📞', title: 'Business phone number', desc: 'A local number your AI receptionist answers 24/7.' },
  { id: 'leadflow', icon: '🎯', title: 'LeadFlow CRM', desc: 'Every missed call and inquiry becomes a tracked lead.' },
  { id: 'clienthub', icon: '🤖', title: 'Client Hub portal', desc: 'Your dashboard for calls, appointments, and AI knowledge.' },
];

export const TESTS = [
  { id: 'info', label: 'Business information complete', hint: 'Name, contact, hours, and services filled in.' },
  { id: 'services', label: 'Services and pricing confirmed', hint: 'Prices match what you actually charge.' },
  { id: 'hours', label: 'Hours and policies confirmed', hint: 'Open times, cancellations, walk-ins.' },
  { id: 'greeting', label: 'AI greeting reviewed', hint: 'You listened to how the AI answers.' },
  { id: 'booking', label: 'Booking flow tested', hint: 'The AI booked a test appointment correctly.' },
  { id: 'transfer', label: 'Human transfer tested', hint: 'The AI passed a complex call to a human.' },
];

export function starterFAQs(industryId) {
  const common = [
    { q: 'Where are you located?', a: 'I can text you our address and directions right after this call.' },
    { q: 'Do you take walk-ins?', a: 'Yes, when there\u2019s availability \u2014 booking ahead guarantees your spot.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major cards, tap, and cash.' },
  ];
  const byId = {
    barbershop: [
      { q: 'Do you do beard trims and hot towel shaves?', a: 'Yes — beard trims and hot towel shaves are available with any haircut or on their own.' },
      { q: 'Do you cut kids\u2019 hair?', a: 'Yes, kids cuts are welcome any day of the week.' },
    ],
    salon: [
      { q: 'How far in advance should I book color?', a: 'Color appointments book out 1\u20132 weeks ahead, especially weekends.' },
      { q: 'Do you offer bridal or event packages?', a: 'Yes — call us for group and bridal pricing.' },
    ],
    dental: [
      { q: 'Do you take insurance?', a: 'We bill most major PPO plans. Call to confirm your coverage.' },
      { q: 'What do I do in an emergency?', a: 'Call our line and describe the issue — we reserve same-day emergency slots.' },
    ],
    auto: [
      { q: 'How long does a full detail take?', a: 'A full detail takes about 3 hours; drop it off or wait in our lounge.' },
      { q: 'Do you offer mobile detailing?', a: 'Not at this time — all services are done at our shop.' },
    ],
    fitness: [
      { q: 'Do I need to book classes in advance?', a: 'Classes are first-come, and members can reserve through the front desk line.' },
      { q: 'Is there an initiation fee?', a: 'No initiation fee — memberships are month to month.' },
    ],
    other: [],
  };
  return [...(byId[industryId] || []), ...common];
}

export function sampleGreeting(industryId, businessName, aiName) {
  const b = businessName || 'the shop';
  const map = {
    barbershop: `Thanks for calling ${b}! This is ${aiName}. Want to book a cut, or can I help with something else?`,
    salon: `Hi, you've reached ${b} — this is ${aiName}. Are you looking to book a service today?`,
    dental: `Thank you for calling ${b}, this is ${aiName}. Are you an existing patient, or would you like to schedule a visit?`,
    auto: `${b}, this is ${aiName}. Are you calling to book a detail or asking about a service?`,
    fitness: `Hey, thanks for calling ${b}! ${aiName} here. Want info on memberships or booking a class?`,
    other: `Thanks for calling ${b}! This is ${aiName} — how can I help you today?`,
  };
  return map[industryId] || map.other;
}
