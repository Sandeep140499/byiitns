import express from "express";
import { sendRegistrationEmails, sendPaymentLinkEmail } from "./emailService.js";

const app = express();

// Middleware
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Payment link email endpoint
app.post("/api/send-payment-link", async (req, res) => {
  try {
    const { name, email, amount, paymentMethod } = req.body;

    // Validate required fields
    if (!name || !email || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Send payment link email
    const emailResult = await sendPaymentLinkEmail({ name, email, amount, paymentMethod });

    if (emailResult.success) {
      res.json({
        success: true,
        message: "Payment link sent successfully!",
        paymentLink: emailResult.paymentLink,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send payment link",
        error: emailResult.error,
      });
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Registration and email endpoint
app.post("/api/register-and-send-email", async (req, res) => {
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

    // Send emails
    const emailResult = await sendRegistrationEmails(formData);

    if (emailResult.success) {
      res.json({
        success: true,
        message: "Registration successful! Confirmation emails sent.",
        serialNumber: emailResult.serialNumber,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Registration processed but email sending failed",
        error: emailResult.error,
      });
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Email server running on port ${PORT}`);
  console.log(`📧 POST /api/register-and-send-email`);
});
