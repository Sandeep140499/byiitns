import nodemailer from "nodemailer";
import { generateInvoicePDF } from "./pdfGenerator.js";

// Email transporter setup with Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sumanme10@gmail.com",
    pass: "sykn fpnn soyc jrcq", // Gmail App Password
  },
});

// Generate random serial number (format: BYIIT-XXXXXX)
function generateSerialNumber() {
  const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BYIIT-${randomId}`;
}

// Send emails to both owner and student
export async function sendRegistrationEmails(formData) {
  const serialNumber = generateSerialNumber();
  const ownerEmail = "sumanme10@gmail.com";
  const studentEmail = formData.email;

  // Generate PDF invoice
  let pdfBuffer;
  try {
    pdfBuffer = await generateInvoicePDF(formData, serialNumber);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate invoice PDF");
  }

  const registrationDetails = `
    <h2>Registration Details</h2>
    <p><strong>Serial Number:</strong> ${serialNumber}</p>
    <hr/>
    <h3>Student Information</h3>
    <p><strong>Name:</strong> ${formData.name}</p>
    <p><strong>Father's Name:</strong> ${formData.fatherName}</p>
    <p><strong>Phone Number:</strong> ${formData.phoneNumber}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Gender:</strong> ${formData.gender || "Not specified"}</p>
    <hr/>
    <h3>Academic Information</h3>
    <p><strong>Class:</strong> ${formData.class}</p>
    <p><strong>School Name:</strong> ${formData.schoolName}</p>
    <p><strong>Section:</strong> ${formData.section || "Not specified"}</p>
    <p><strong>Roll Number:</strong> ${formData.rollNumber || "Not specified"}</p>
    <p><strong>City:</strong> ${formData.city || "Not specified"}</p>
    <p><strong>Percentage/Grade:</strong> ${formData.percentage || "Not specified"}</p>
    <hr/>
    <p><strong>Registration Fee:</strong> ₹225</p>
    <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
  `;

  // Email to student
  const studentMailOptions = {
    from: "sumanme10@gmail.com",
    to: studentEmail,
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
    from: "sumanme10@gmail.com",
    to: ownerEmail,
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

  try {
    // Send both emails
    await transporter.sendMail(studentMailOptions);
    await transporter.sendMail(ownerMailOptions);

    return {
      success: true,
      message: "Emails sent successfully",
      serialNumber: serialNumber,
    };
  } catch (error) {
    console.error("Error sending emails:", error);
    return {
      success: false,
      message: "Failed to send emails",
      error: error.message,
    };
  }
}
