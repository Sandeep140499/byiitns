export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    console.log("[API-TEST] Ping received");
    console.log("[API-TEST] Env check - GMAIL_USER:", process.env.GMAIL_USER);
    console.log("[API-TEST] Env check - GMAIL_PASSWORD exists:", !!process.env.GMAIL_PASSWORD);

    return res.status(200).json({
      success: true,
      message: "API is working!",
      timestamp: new Date().toISOString(),
      env: {
        hasGmailUser: !!process.env.GMAIL_USER,
        hasGmailPassword: !!process.env.GMAIL_PASSWORD,
        hasAdminEmail: !!process.env.ADMIN_EMAIL,
      },
    });
  } catch (error) {
    console.error("[API-TEST] Error:", error);
    return res.status(500).json({
      error: error.message,
    });
  }
}
