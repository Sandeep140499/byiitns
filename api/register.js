import nodemailer from "nodemailer";
import { generateInvoicePDF } from "./pdfGenerator.js";

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

    // Generate random serial number
    function generateSerialNumber() {
      const randomId = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      return `BYIIT-${randomId}`;
    }

    const serialNumber = generateSerialNumber();

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER || "sumanme10@gmail.com",
        pass: process.env.GMAIL_PASSWORD || "sykn fpnn soyc jrcq",
      },
    });

    // Generate PDF invoice
    let pdfBuffer;
    try {
      pdfBuffer = await generateInvoicePDF(formData, serialNumber);
    } catch (error) {
      console.error("Error generating PDF:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to generate invoice PDF",
        error: error.message,
      });
    }

    // Email to student
    const studentMailOptions = {
      from: process.env.GMAIL_USER || "sumanme10@gmail.com",
      to: formData.email,
      subject: `ByIITians - Olympiad Registration Confirmation (${serialNumber})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #d32f2f;">ByIITians</h1>
          <h2>Olympiad Aptitude Test - Registration Confirmation</h2>
          
          <p>Dear ${formData.name},</p>
          
          <p>Thank you for registering for the Olympiad Aptitude Test!</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #d32f2f;">Your Registration Serial Number: <strong>${serialNumber}</strong></h3>
            <p>Please save this serial number for future reference.</p>
          </div>
          
          <h3>Registration Details Summary</h3>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Class:</strong> ${formData.class}</p>
          <p><strong>School:</strong> ${formData.schoolName}</p>
          <p><strong>Registration Fee:</strong> ₹225</p>
          
          <h3>What's Next?</h3>
          <ol>
            <li>Scan the PayTM QR code to complete the payment of ₹225</li>
            <li>Save your payment screenshot</li>
            <li>Send the screenshot along with your serial number (${serialNumber}) to Suman Kumar</li>
            <li>WhatsApp: +91 8447412646</li>
          </ol>
          
          <p>The detailed invoice has been attached to this email. Please download and keep it safe.</p>
          
          <hr style="margin: 30px 0;"/>
          
          <p>Best regards,<br/>
          <strong>ByIITians Team</strong><br/>
          Always Build Concepts</p>
          
          <p style="font-size: 12px; color: #999; margin-top: 20px;">
            This is an automated email. Please do not reply to this email.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `ByIITians_Invoice_${serialNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    // Email to owner
    const ownerMailOptions = {
      from: process.env.GMAIL_USER || "sumanme10@gmail.com",
      to: process.env.ADMIN_EMAIL || "sumanme10@gmail.com",
      subject: `New Registration: ${formData.name} (${serialNumber})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #d32f2f;">ByIITians - Admin Notification</h1>
          <h2>New Olympiad Registration</h2>
          
          <p>A new student has registered for the Olympiad Aptitude Test.</p>
          
          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Serial Number: <strong style="color: #d32f2f;">${serialNumber}</strong></h3>
          </div>
          
          <h3>Student Information</h3>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Father's Name:</strong> ${formData.fatherName}</p>
          <p><strong>Phone Number:</strong> ${formData.phoneNumber}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          
          <h3>Academic Information</h3>
          <p><strong>Class:</strong> ${formData.class}</p>
          <p><strong>School Name:</strong> ${formData.schoolName}</p>
          <p><strong>Section:</strong> ${formData.section || "Not specified"}</p>
          <p><strong>Roll Number:</strong> ${formData.rollNumber || "Not specified"}</p>
          <p><strong>City:</strong> ${formData.city || "Not specified"}</p>
          
          <h3>Status Update</h3>
          <p><strong>Status:</strong> Pending Payment Verification</p>
          <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p>Please verify the payment screenshot sent by the student at +91 8447412646</p>
          
          <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ccc;">
            The detailed invoice has been attached for your records.
          </p>
          
          <hr style="margin: 30px 0;"/>
          
          <p><strong>ByIITians Admin Panel</strong></p>
        </div>
      `,
      attachments: [
        {
          filename: `ByIITians_Invoice_${serialNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    // Send both emails
    try {
      console.log("[API] Sending student email...");
      await transporter.sendMail(studentMailOptions);
      console.log("[API] Student email sent successfully");
    } catch (emailError) {
      console.error("[API] Student email send error:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send student email: " + emailError.message,
        error: emailError.message,
      });
    }

    try {
      console.log("[API] Sending admin email...");
      await transporter.sendMail(ownerMailOptions);
      console.log("[API] Admin email sent successfully");
    } catch (emailError) {
      console.error("[API] Admin email send error:", emailError);
      // Don't fail the whole request if admin email fails
      console.warn("[API] Warning: Admin email failed but continuing...");
    }

    console.log("[API] Registration completed successfully");
    return res.status(200).json({
      success: true,
      message: "Registration successful! Confirmation emails sent.",
      serialNumber: serialNumber,
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
