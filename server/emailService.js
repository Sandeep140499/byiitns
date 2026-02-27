import nodemailer from "nodemailer";
import { generateInvoicePDF } from "./pdfGenerator.js";
import fs from "fs";
import path from "path";

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

// Center locations with map URLs
const centerLocations = {
  mehrauli: {
    name: "ByIITians MEHRAULI",
    address: "Mehrauli, New Delhi",
    mapUrl: "https://maps.app.goo.gl/Q9rWEneuXHkg47gy9?g_st=iw",
    navigationUrl: "https://maps.google.com/maps?q=ByIITians+MEHRAULI&nav=1"
  },
  "vasant-kunj": {
    name: "ByIITians VASANT KUNJ", 
    address: "Vasant Kunj, New Delhi",
    mapUrl: "https://maps.app.goo.gl/6UV3E17ruEEFsg1q8?g_st=iw",
    navigationUrl: "https://maps.google.com/maps?q=ByIITians+VASANT+KUNJ&nav=1"
  },
  okhala: {
    name: "ByIITians OKHLA",
    address: "Okhla, New Delhi", 
    mapUrl: "https://maps.app.goo.gl/7H3kDanHGtpiCTjL9?g_st=iw",
    navigationUrl: "https://maps.google.com/maps?q=ByIITians+OKHLA&nav=1"
  }
};

// Send payment link email
export async function sendPaymentLinkEmail(formData) {
  const { name, email, amount, paymentMethod } = formData;

  // Link to live payment page
  const paymentLink = "https://byiitns.vercel.app/payment";

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
          background-color: #E74C3C;
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
          background-color: #FF6F61;
        }
        .instructions {
          background-color: #e7f3ff;
          border-left: 4px solid #0055CC;
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
          <div class="logo">🏆 <span style="color: #0055CC;">By</span><span style="color: #E74C3C;">IITians</span></div>
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

  // Get selected center information
  const selectedCenter = centerLocations[formData.center] || null;

  // Generate PDF invoice
  let pdfBuffer;
  try {
    pdfBuffer = await generateInvoicePDF(formData, serialNumber);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate invoice PDF");
  }

  // Get brochure path
  const brochurePath = path.join(process.cwd(), 'public', 'assets', 'testSeries', 'OLYMPIAD INFORMATION BROUCHER.pdf');
  let brochureBuffer;
  try {
    brochureBuffer = fs.readFileSync(brochurePath);
  } catch (error) {
    console.error("Error reading brochure:", error);
    // Continue without brochure if file not found
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
    <p><strong>Registration Fee:</strong> ₹300</p>
    <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
  `;

  // Email to student
  const studentAttachments = [
    {
      filename: `ByIITians_Invoice_${serialNumber}.pdf`,
      content: pdfBuffer,
      contentType: "application/pdf",
    }
  ];

  // Add brochure if available
  if (brochureBuffer) {
    studentAttachments.push({
      filename: "OLYMPIAD_INFORMATION_BROUCHER.pdf",
      content: brochureBuffer,
      contentType: "application/pdf",
      headers: {
        'Content-ID': '<brochure>',
      }
    });
  }

  const studentMailOptions = {
    from: "sumanme10@gmail.com",
    to: studentEmail,
    subject: `ByIITians - Olympiad Registration Confirmation (${serialNumber})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div style="background: #ffffff; color: #111827; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; border-bottom: 2px solid #e5e7eb;">
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">🎓 <span style="color: #0055CC;">By</span><span style="color: #E74C3C;">IITians</span></h1>
          <p style="margin: 5px 0 0; font-size: 16px; opacity: 0.9;">Always Build Concepts</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 25px; text-align: center;">
            <h2 style="margin: 0; font-size: 24px;">✅ Registration Successful!</h2>
            <p style="margin: 10px 0 0; font-size: 16px;">Your Olympiad Aptitude Test registration has been confirmed</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #E74C3C;">
            <h3 style="color: #E74C3C; margin: 0 0 15px; font-size: 20px;">📋 Your Registration Details</h3>
            <p style="margin: 5px 0; color: #333;"><strong>Serial Number:</strong> <span style="background: #E74C3C; color: white; padding: 5px 10px; border-radius: 5px; font-family: monospace;">${serialNumber}</span></p>
            <p style="margin: 5px 0; color: #333;"><strong>Name:</strong> ${formData.name}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Class:</strong> ${formData.class}</p>
            <p style="margin: 5px 0; color: #333;"><strong>School:</strong> ${formData.schoolName}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Center:</strong> ${selectedCenter ? selectedCenter.name : 'Not specified'}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Registration Fee:</strong> <span style="color: #E74C3C; font-weight: bold; font-size: 18px;">₹300</span></p>
          </div>

          ${selectedCenter ? `
          <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px; font-size: 18px;">📍 Your Center Location</h3>
            <p style="margin: 5px 0; font-weight: bold;">${selectedCenter.name}</p>
            <p style="margin: 5px 0;">${selectedCenter.address}</p>
            <div style="margin: 15px 0;">
              <a href="${selectedCenter.mapUrl}" target="_blank" style="display: inline-block; background: white; color: #4CAF50; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">
                🗺️ View Map
              </a>
              <a href="${selectedCenter.navigationUrl}" target="_blank" style="display: inline-block; background: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                🧭 Navigate Now
              </a>
            </div>
          </div>
          ` : ''}

          <div style="background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px; font-size: 18px;">📄 Information Brochure</h3>
            <p style="margin: 10px 0;">Download your comprehensive Olympiad Information Brochure for complete details:</p>
            <div style="margin: 15px 0;">
              <a href="cid:brochure" style="display: inline-block; background: white; color: #FF9800; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">
                📥 Download Brochure
              </a>
            </div>
            <p style="margin: 10px 0; font-size: 14px;">The brochure is also attached to this email for your convenience.</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px; font-size: 18px;">🏆 Exciting Prizes Await!</h3>
            <div style="display: flex; justify-content: space-around; text-align: center;">
              <div>
                <div style="font-size: 24px; margin-bottom: 5px;">🥇</div>
                <div style="font-weight: bold;">Tablet</div>
              </div>
              <div>
                <div style="font-size: 24px; margin-bottom: 5px;">🥈</div>
                <div style="font-weight: bold;">27" LED Monitor</div>
              </div>
              <div>
                <div style="font-size: 24px; margin-bottom: 5px;">🥉</div>
                <div style="font-weight: bold;">22" LED Monitor</div>
              </div>
            </div>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #2196F3;">
            <h3 style="color: #1976D2; margin: 0 0 15px; font-size: 18px;">💳 Complete Your Payment</h3>
            <p style="margin: 10px 0; color: #333;">Complete your payment of ₹300 to finalize your registration:</p>
            <ol style="margin: 15px 0; padding-left: 20px; color: #333;">
              <li style="margin-bottom: 8px;">Scan the PayTM QR code sent in the attachment</li>
              <li style="margin-bottom: 8px;">Save your payment screenshot</li>
              <li style="margin-bottom: 8px;">Send screenshot with serial number to Suman Kumar</li>
              <li style="margin-bottom: 8px;">WhatsApp: +91 8447412646</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://byiitns.vercel.app/payment" style="display: inline-block; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);">
              💳 Pay Online Instantly
            </a>
          </div>
          
          <div style="background: #fff7e0; padding: 15px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #FFC107;">
            <p style="margin: 0; color: #8a6d1d;"><strong>⏰ Important:</strong> Registration closes on 26th March. Complete your payment before the deadline!</p>
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #666; font-size: 14px;">For any queries, contact us at:</p>
            <p style="margin: 5px 0; color: #E74C3C; font-weight: bold;">📞 +91 8447412646</p>
            <p style="margin: 5px 0; color: #666; font-size: 12px;">Generated on ${new Date().toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>
    `,
    attachments: studentAttachments,
  };

  // Email to owner
  const ownerMailOptions = {
    from: "sumanme10@gmail.com",
    to: ownerEmail,
    subject: `New Olympiad Registration - ${formData.name} (${serialNumber})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ffffff; color: #111827; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; border-bottom: 2px solid #e5e7eb;">
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">🎓 <span style="color: #0055CC;">By</span><span style="color: #E74C3C;">IITians</span></h1>
          <p style="margin: 5px 0 0; font-size: 16px; opacity: 0.9;">New Registration Received</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 5px solid #E74C3C;">
            <h3 style="color: #E74C3C; margin: 0 0 15px; font-size: 20px;">📋 Registration Details</h3>
            <p style="margin: 5px 0; color: #333;"><strong>Serial Number:</strong> <span style="background: #E74C3C; color: white; padding: 5px 10px; border-radius: 5px; font-family: monospace;">${serialNumber}</span></p>
            <p style="margin: 5px 0; color: #333;"><strong>Name:</strong> ${formData.name}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Class:</strong> ${formData.class}</p>
            <p style="margin: 5px 0; color: #333;"><strong>School:</strong> ${formData.schoolName}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Center:</strong> ${selectedCenter ? selectedCenter.name : 'Not specified'}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Registration Fee:</strong> <span style="color: #E74C3C; font-weight: bold; font-size: 18px;">₹300</span></p>
            <p style="margin: 5px 0; color: #333;"><strong>Status:</strong> Pending Payment Verification</p>
            <p style="margin: 5px 0; color: #333;"><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
            ${selectedCenter ? `
            <p style="margin: 5px 0; color: #333;"><strong>Center Map:</strong> <a href="${selectedCenter.mapUrl}" target="_blank" style="color: #2196F3; text-decoration: underline;">View Location</a></p>
            ` : ''}
            <p style="margin: 5px 0; color: #333;">Please verify the payment screenshot sent by the student at +91 8447412646</p>
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #666; font-size: 14px;">The detailed invoice has been attached for your records.</p>
            <p style="margin: 10px 0 0; color: #E74C3C; font-weight: bold;">📞 +91 8447412646</p>
            <p style="margin: 5px 0; color: #666; font-size: 12px;">Generated on ${new Date().toLocaleString("en-IN")}</p>
          </div>
        </div>
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
