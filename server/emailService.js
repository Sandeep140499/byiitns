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

// Send payment link email
export async function sendPaymentLinkEmail(formData) {
  const { name, email, amount, paymentMethod } = formData;

  // Generate payment link (in production, use actual payment gateway)
  const paymentLink = `https://your-payment-gateway.com/pay?amount=${amount}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&method=${paymentMethod}`;

  const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Link - Olympiad Registration</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e9ecef;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #d32f2f;
          margin-bottom: 10px;
        }
        .title {
          color: #2c3e50;
          font-size: 24px;
          margin-bottom: 10px;
        }
        .content {
          margin-bottom: 30px;
        }
        .payment-details {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .payment-details h3 {
          color: #495057;
          margin-top: 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #dee2e6;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: 600;
          color: #6c757d;
        }
        .detail-value {
          font-weight: bold;
          color: #2c3e50;
        }
        .payment-button {
          display: inline-block;
          background-color: #d32f2f;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          font-size: 18px;
          text-align: center;
          margin: 20px 0;
          transition: background-color 0.3s ease;
        }
        .payment-button:hover {
          background-color: #b71c1c;
        }
        .instructions {
          background-color: #e7f3ff;
          border-left: 4px solid #2196f3;
          padding: 15px;
          margin: 20px 0;
        }
        .instructions h4 {
          color: #2196f3;
          margin-top: 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #e9ecef;
          color: #6c757d;
          font-size: 14px;
        }
        .support-info {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .whatsapp-button {
          display: inline-block;
          background-color: #25d366;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          margin-top: 10px;
        }
        .whatsapp-button:hover {
          background-color: #128c7e;
        }
        @media only screen and (max-width: 600px) {
          body {
            padding: 10px;
          }
          .container {
            padding: 20px;
          }
          .payment-button {
            display: block;
            width: 100%;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🏆 ByIITians</div>
          <h1 class="title">Payment Link</h1>
        </div>

        <div class="content">
          <p>Dear <strong>${name}</strong>,</p>
          
          <p>Thank you for registering for the Olympiad Aptitude Test. Please complete your payment using the link below:</p>

          <div class="payment-details">
            <h3>Payment Details</h3>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Amount:</span>
              <span class="detail-value">₹${amount}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Payment Method:</span>
              <span class="detail-value">${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</span>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="${paymentLink}" class="payment-button">
              💳 Complete Payment Now
            </a>
          </div>

          <div class="instructions">
            <h4>📋 Instructions:</h4>
            <ol>
              <li>Click the "Complete Payment Now" button above</li>
              <li>You will be redirected to our secure payment gateway</li>
              <li>Enter your payment details and complete the transaction</li>
              <li>After payment, return to the registration page and click "Confirm Payment"</li>
              <li>You will receive a confirmation email once payment is verified</li>
            </ol>
          </div>

          <div class="support-info">
            <h4>💬 Need Help?</h4>
            <p>If you face any issues with payment or have questions, feel free to contact us:</p>
            <a href="https://wa.me/918447412646" class="whatsapp-button">
              📱 WhatsApp Support: +91 8447412646
            </a>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>© 2024 ByIITians. All rights reserved.</p>
          <p><em>Always Build Concepts</em></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: "sumanme10@gmail.com",
    to: email,
    subject: `Payment Link for Olympiad Registration - ₹${amount}`,
    html: emailTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      success: true,
      message: 'Payment link sent successfully',
      paymentLink
    };
  } catch (error) {
    console.error('Error sending payment link:', error);
    return {
      success: false,
      message: 'Failed to send payment link',
      error: error.message
    };
  }
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
          <li><strong>OR</strong> Click the button below for instant online payment</li>
        </ol>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://your-domain.com/payment" style="display: inline-block; background-color: #d32f2f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            💳 Pay Online Instantly
          </a>
        </div>
        
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
