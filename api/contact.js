/**
 * Vercel serverless function — sends contact-form mail via Resend.
 * Requires env var: RESEND_API_KEY
 */

const TO_EMAIL = "zachwkaiser@gmail.com";
const FROM_EMAIL = "Portfolio <onboarding@resend.dev>";

function isValidEmail(value) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
}

function clean(value) {
  return String(value || "").trim();
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Missing RESEND_API_KEY");
    return res.status(500).json({ error: "Email service is not configured." });
  }

  const name = clean(req.body?.name);
  const email = clean(req.body?.email);
  const message = clean(req.body?.message);

  if (!name) {
    return res.status(400).json({ error: "Please enter your name." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  if (message.length < 0) {
    return res.status(400).json({ error: "Please enter a message." });
  }
  if (message.length > 5000) {
    return res.status(400).json({ error: "Message is too long (max 5000 characters)." });
  }

  const body = [
    `New message from your portfolio contact form.`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    ``,
    `Message:`,
    message,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: body,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Resend error:", data);
      return res.status(502).json({
        error: "Could not send your message. Please try again or email me directly.",
      });
    }

    return res.status(200).json({ ok: true, id: data.id });
  } catch (err) {
    console.error("Contact API error:", err);
    return res.status(500).json({
      error: "Could not send your message. Please try again or email me directly.",
    });
  }
};
