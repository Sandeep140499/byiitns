import { sendRegistrationEmails } from "../server/emailService.js";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Enable CORS for frontend requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const formData = req.body;

    // Validate required fields
    if (
      !formData.name ||
      !formData.fatherName ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.class ||
      !formData.schoolName
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Delegate email + PDF generation to centralized service
    const result = await sendRegistrationEmails(formData);

    if (!result.success) {
      console.error("[API] sendRegistrationEmails failed:", result.error || result.message);
      return res.status(500).json({
        success: false,
        message: result.message || "Failed to process registration emails",
        error: result.error,
      });
    }

    console.log("[API] Registration completed successfully");
    return res.status(200).json({
      success: true,
      message: result.message || "Registration successful! Confirmation emails sent.",
      serialNumber: result.serialNumber,
    });
  } catch (error) {
    console.error("[API] Unhandled error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
      error: error.message,
    });
  }
}
