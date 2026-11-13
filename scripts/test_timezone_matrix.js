const zones = [
  { country: "US Eastern (EST)", tz: "America/New_York", bestUs: "9:00 AM - 5:00 PM EST" },
  { country: "United Kingdom (London)", tz: "Europe/London", bestUs: "4:00 AM - 12:00 PM EST" },
  { country: "Ireland (Dublin)", tz: "Europe/Dublin", bestUs: "4:00 AM - 12:00 PM EST" },
  { country: "Canada (Toronto)", tz: "America/Toronto", bestUs: "9:00 AM - 5:00 PM EST" },
  { country: "Canada (Vancouver)", tz: "America/Vancouver", bestUs: "12:00 PM - 8:00 PM EST" },
  { country: "Australia (Sydney)", tz: "Australia/Sydney", bestUs: "5:00 PM - 1:00 AM EST" },
  { country: "Australia (Perth)", tz: "Australia/Perth", bestUs: "8:00 PM - 4:00 AM EST" },
  { country: "New Zealand (Auckland)", tz: "Pacific/Auckland", bestUs: "4:00 PM - 12:00 AM EST" }
];

const now = new Date();
console.log("Current System ISO Time:", now.toISOString());
zones.forEach(z => {
  const timeStr = now.toLocaleTimeString("en-US", { timeZone: z.tz, hour: "numeric", minute: "2-digit", hour12: true });
  const hour24 = parseInt(now.toLocaleTimeString("en-US", { timeZone: z.tz, hour: "numeric", hour12: false }), 10);
  const isOpen = hour24 >= 9 && hour24 < 17;
  console.log(`${z.country.padEnd(28)}: ${timeStr.padEnd(10)} (24h: ${hour24}) | Best US Call Time: ${z.bestUs.padEnd(24)} | Status: ${isOpen ? "🟢 IN CALL WINDOW" : "🟡 AFTER HOURS"}`);
});
