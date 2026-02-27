import PDFDocument from "pdfkit";
import { Readable } from "stream";

export function generateInvoicePDF(formData, serialNumber) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 40,
        size: "A4",
      });

      const chunks = [];

      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });

      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      doc.on("error", (err) => {
        reject(err);
      });

      // Brand colors aligned with homepage
      const brandBlue = "#0055CC"; // By
      const primaryColor = "#E74C3C"; // IITians red

      // Header with branding – By (blue) + IITians (red) on white background
      doc
        .rect(40, 40, 515, 60)
        .fill("#ffffff")
        .fillColor(brandBlue)
        .fontSize(32)
        .font("Helvetica-Bold")
        .text("By", 45, 50, { continued: true })
        .fillColor(primaryColor)
        .text("IITians")
        .fillColor("#333333")
        .fontSize(12)
        .font("Helvetica")
        .text("Always Build Concepts", 45, 72, { align: "left" });

      doc.moveTo(40, 110).lineTo(555, 110).strokeColor("#d32f2f").lineWidth(2).stroke();

      // Invoice details header
      doc
        .fillColor("#333333")
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("REGISTRATION INVOICE", 40, 120);

      // Invoice and serial number box
      doc
        .rect(40, 150, 250, 80)
        .fillOpacity(0.1)
        .fill("#1976d2")
        .fillOpacity(1)
        .stroke();

      doc
        .fillColor("#000000")
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Invoice No:", 50, 160)
        .font("Helvetica")
        .fontSize(11)
        .text(serialNumber, 120, 160);

      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Date:", 50, 180)
        .font("Helvetica")
        .fontSize(11)
        .text(new Date().toLocaleDateString("en-IN"), 120, 180);

      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Status:", 50, 200)
        .font("Helvetica")
        .fontSize(11)
        .fillColor("#d32f2f")
        .text("PENDING PAYMENT VERIFICATION", 120, 200)
        .fillColor("#000000");

      doc.moveTo(40, 210).lineTo(555, 210).stroke();

      // Student Information Section
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("STUDENT INFORMATION", 40, 230);

      const studentInfoY = 255;
      const infoBoxHeight = 110;

      doc
        .rect(40, studentInfoY, 255, infoBoxHeight)
        .stroke();

      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Name:", 50, studentInfoY + 10)
        .font("Helvetica")
        .text(formData.name, 50, studentInfoY + 28);

      doc
        .font("Helvetica-Bold")
        .text("Father's Name:", 50, studentInfoY + 50)
        .font("Helvetica")
        .text(formData.fatherName, 50, studentInfoY + 68);

      // Right side of student info
      doc
        .rect(305, studentInfoY, 250, infoBoxHeight)
        .stroke();

      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Phone:", 315, studentInfoY + 10)
        .font("Helvetica")
        .text(formData.phoneNumber, 315, studentInfoY + 28);

      doc
        .font("Helvetica-Bold")
        .text("Email:", 315, studentInfoY + 50)
        .font("Helvetica")
        .fontSize(9)
        .text(formData.email, 315, studentInfoY + 68);

      // Academic Information Section
      const academicY = studentInfoY + infoBoxHeight + 30;

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("ACADEMIC INFORMATION", 40, academicY);

      const academicBoxY = academicY + 25;
      const academicBoxHeight = 130;

      // Left side academic info
      doc
        .rect(40, academicBoxY, 255, academicBoxHeight)
        .stroke();

      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Class:", 50, academicBoxY + 10)
        .font("Helvetica")
        .text(formData.class, 50, academicBoxY + 28);

      doc
        .font("Helvetica-Bold")
        .text("Section:", 50, academicBoxY + 50)
        .font("Helvetica")
        .text(formData.section || "N/A", 50, academicBoxY + 68);

      doc
        .font("Helvetica-Bold")
        .text("Roll Number:", 50, academicBoxY + 90)
        .font("Helvetica")
        .text(formData.rollNumber || "N/A", 50, academicBoxY + 108);

      // Right side academic info
      doc
        .rect(305, academicBoxY, 250, academicBoxHeight)
        .stroke();

      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("School Name:", 315, academicBoxY + 10)
        .font("Helvetica")
        .fontSize(9)
        .text(formData.schoolName, 315, academicBoxY + 28);

      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("City:", 315, academicBoxY + 65)
        .font("Helvetica")
        .text(formData.city || "N/A", 315, academicBoxY + 83);

      doc
        .font("Helvetica-Bold")
        .text("Percentage/Grade:", 315, academicBoxY + 105)
        .font("Helvetica")
        .text(formData.percentage || "N/A", 315, academicBoxY + 123);

      // Fee Summary
      const feeY = academicBoxY + academicBoxHeight + 30;

      doc
        .rect(40, feeY, 515, 70)
        .stroke();

      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("TEST DETAILS & FEE", 50, feeY + 10);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Olympiad Aptitude Test Registration", 50, feeY + 30);

      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("₹300", 480, feeY + 28, { align: "right" });

      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Registration Fee:", 50, feeY + 50);

      // Total
      const totalY = feeY + 80;

      doc
        .rect(40, totalY, 515, 50)
        .stroke();

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Total Amount", 50, totalY + 12);

      doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("₹300", 480, totalY + 8, { align: "right" });

      // Payment Instructions
      const instructionsY = totalY + 60;

      doc
        .moveTo(40, instructionsY)
        .lineTo(555, instructionsY)
        .stroke();

      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("PAYMENT INSTRUCTIONS", 40, instructionsY + 15);

      doc
        .fontSize(9)
        .font("Helvetica")
        .text(
          "1. Scan the PayTM QR code to complete the payment of ₹300",
          40,
          instructionsY + 35
        )
        .text(
          "2. Save the PayTM payment screenshot",
          40,
          instructionsY + 55
        )
        .text(
          "3. Send the screenshot along with this invoice number to: Suman Kumar (WhatsApp: +91 8447412646)",
          40,
          instructionsY + 75
        )
        .text(
          "4. Your application will be verified upon receipt of payment",
          40,
          instructionsY + 95
        );

      // Footer
      doc
        .fontSize(9)
        .font("Helvetica")
        .text(
          "This is an official registration invoice. Please keep it for your records.",
          40,
          730,
          { align: "center" }
        )
        .text(
          `Generated on ${new Date().toLocaleString("en-IN")}`,
          40,
          750,
          { align: "center" }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
