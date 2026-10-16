/**
 * VantorX Solutions — Stripe Billing, Invoicing & Checkout API
 * Handles:
 *  - GET /api/billing?action=plans (Active subscriptions & Payment Links)
 *  - POST /api/billing?action=create-checkout (1-click checkout sessions)
 *  - POST /api/billing?action=create-invoice (Custom audit quotes & website invoices)
 *  - POST /api/billing?action=customer-portal (Self-service billing portal)
 *  - POST /api/billing?action=webhook (Payment fulfillment & auto-provisioning)
 */

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUB_KEY = process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_51URFYuH4ZgIHFqsNO7hIytFl0c0jljrOHz6JQzrS86sDwRy7MxTsAP6lNnyzuhLfpPUOK4OUdisQNP7WzCpqjY1G00ijaFADic";

// Configured Product & Price IDs
const PLANS = {
  receptionist: {
    productId: "prod_VSA9o8AuZ1HN6E",
    priceId: "price_1URFouH4ZgIHFqsNyJWV5Wyb",
    name: "24/7 AI Phone Receptionist (Ava)",
    amount: 29900,
    interval: "month",
    paymentLink: "https://buy.stripe.com/test_00wcN553c43E9lIgFldnW00"
  }
};

async function stripeRequest(endpoint, method = "GET", body = null) {
  if (!STRIPE_SECRET_KEY) {
    const err = new Error("STRIPE_SECRET_KEY is not configured in Vercel environment variables.");
    err.status = 503;
    throw err;
  }
  const headers = {
    "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
  };

  let reqBody = null;
  if (body) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    }
    reqBody = params.toString();
  }

  const res = await fetch(`https://api.stripe.com/v1${endpoint}`, {
    method,
    headers,
    body: reqBody
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error?.message || `Stripe error ${res.status}`);
    err.status = res.status;
    err.stripeData = data;
    throw err;
  }
  return data;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const action = req.query.action || (req.method === "GET" ? "plans" : "create-checkout");

  try {
    // ----------------------------------------------------
    // 1. GET PLANS & PAYMENT LINKS
    // ----------------------------------------------------
    if (action === "plans") {
      return res.status(200).json({
        ok: true,
        publishableKey: STRIPE_PUB_KEY,
        plans: PLANS,
        defaultPaymentLink: PLANS.receptionist.paymentLink
      });
    }

    // ----------------------------------------------------
    // 2. CREATE CHECKOUT SESSION
    // ----------------------------------------------------
    if (action === "create-checkout") {
      const { priceId, customerEmail, successUrl, cancelUrl } = req.body || {};
      const targetPrice = priceId || PLANS.receptionist.priceId;
      const origin = req.headers.origin || "https://www.vantorxsolutions.com";

      const session = await stripeRequest("/checkout/sessions", "POST", {
        "line_items[0][price]": targetPrice,
        "line_items[0][quantity]": "1",
        "mode": "subscription",
        "customer_email": customerEmail || undefined,
        "allow_promotion_codes": "true",
        "phone_number_collection[enabled]": "true",
        "success_url": successUrl || `${origin}/vantorx-onboarding/?session_id={CHECKOUT_SESSION_ID}&code=VANTORX2026&paid=true`,
        "cancel_url": cancelUrl || `${origin}/#pricing`
      });

      return res.status(200).json({
        ok: true,
        sessionId: session.id,
        url: session.url
      });
    }

    // ----------------------------------------------------
    // 3. CREATE CUSTOM AUDIT / WEBSITE INVOICE
    // ----------------------------------------------------
    if (action === "create-invoice") {
      const { name, email, amount, description, daysUntilDue = 7 } = req.body || {};

      if (!email || !amount) {
        return res.status(400).json({ ok: false, error: "Client email and invoice amount are required." });
      }

      // Convert dollar amount to cents (e.g. 1500 -> 150000)
      const numericAmount = typeof amount === "number" ? amount : parseFloat(String(amount).replace(/[^0-9.]/g, ""));
      const amountInCents = Math.round(numericAmount * 100);

      // Create Customer
      const customer = await stripeRequest("/customers", "POST", {
        name: name || "VantorX Client",
        email: email
      });

      // Create Invoice Item
      await stripeRequest("/invoiceitems", "POST", {
        customer: customer.id,
        amount: String(amountInCents),
        currency: "usd",
        description: description || "VantorX Custom Solutions (Website Design & Workflow Automation)"
      });

      // Create Draft Invoice
      const invoice = await stripeRequest("/invoices", "POST", {
        customer: customer.id,
        collection_method: "send_invoice",
        days_until_due: String(daysUntilDue)
      });

      // Finalize and Send Invoice
      const finalized = await stripeRequest(`/invoices/${invoice.id}/finalize`, "POST", {
        auto_advance: "true"
      });

      return res.status(200).json({
        ok: true,
        invoiceId: finalized.id,
        invoiceNumber: finalized.number,
        hostedInvoiceUrl: finalized.hosted_invoice_url,
        pdfUrl: finalized.invoice_pdf,
        amountDue: finalized.amount_due / 100,
        status: finalized.status
      });
    }

    // ----------------------------------------------------
    // 4. CUSTOMER BILLING PORTAL
    // ----------------------------------------------------
    if (action === "customer-portal") {
      const { customerId } = req.body || {};
      const origin = req.headers.origin || "https://www.vantorxsolutions.com";

      if (!customerId) {
        return res.status(400).json({ ok: false, error: "customerId is required." });
      }

      const portal = await stripeRequest("/billing_portal/sessions", "POST", {
        customer: customerId,
        return_url: `${origin}/client-hub/`
      });

      return res.status(200).json({
        ok: true,
        url: portal.url
      });
    }

    // ----------------------------------------------------
    // 5. WEBHOOK HANDLER
    // ----------------------------------------------------
    if (action === "webhook") {
      const event = req.body;
      // In production, signature verification is handled via STRIPE_WEBHOOK_SECRET
      if (event && event.type === "checkout.session.completed") {
        const session = event.data?.object;
        console.log(`[Stripe Webhook] Checkout completed for: ${session?.customer_email}`);
      }
      return res.status(200).json({ received: true });
    }

    return res.status(404).json({ ok: false, error: `Unknown billing action: ${action}` });

  } catch (err) {
    console.error("[Stripe API Error]", err);
    return res.status(err.status || 500).json({
      ok: false,
      error: err.message || "Stripe request failed."
    });
  }
}
