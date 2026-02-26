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

      // Define brand colors
      const primaryColor = "#d32f2f"; // ByIITians red
      const secondaryColor = "#1a1a1a"; // Dark black
      const accentColor = "#f5f5f5"; // Light gray

      // Header with branding and colors
      doc.fillColor(primaryColor)
        .fontSize(32)
        .font("Helvetica-Bold")
        .text("ByIITians", { align: "center" })
        .fillColor(secondaryColor)
        .fontSize(12)
        .font("Helvetica")
        .text("Always Build Concepts", { align: "center" })
        .fontSize(10)
        .fillColor("#666666")
        .text("Delhi | NEET | IIT | CBSE | NTSE | Foundation", { align: "center" });

      // Decorative line with brand color
      doc.strokeColor(primaryColor)
        .lineWidth(2)
        .moveTo(40, 90)
        .lineTo(555, 90)
        .stroke();

      // Invoice details header with brand colors
      doc.fillColor(primaryColor)
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("REGISTRATION INVOICE", 40, 110);

      // Invoice and serial number
      doc.fillColor(secondaryColor)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Invoice No:", 40, 140)
        .fillColor(primaryColor)
        .fontSize(14)
        .font("Helvetica-Bold")
        .text(serialNumber, 150, 140);

      doc.fillColor(secondaryColor)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Date:", 40, 160)
        .fillColor("#333333")
        .fontSize(11)
        .font("Helvetica")
        .text(new Date().toLocaleDateString("en-IN"), 150, 160);

      doc.fillColor(primaryColor)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Status:", 40, 180)
        .fillColor("#ff6b6b")
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("PENDING PAYMENT VERIFICATION", 150, 180);

      // Decorative line
      doc.strokeColor(primaryColor)
        .lineWidth(2)
        .moveTo(40, 210)
        .lineTo(555, 210)
        .stroke();

      // Student Information Section with brand colors
      doc.fillColor(primaryColor)
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("STUDENT INFORMATION", 40, 230);

      const studentInfoY = 255;
      const infoBoxHeight = 110;

      // Student info boxes with better styling
      doc.strokeColor("#cccccc")
        .lineWidth(1)
        .rect(40, studentInfoY, 255, infoBoxHeight)
        .stroke();

      doc.fillColor(secondaryColor)
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("Name:", 50, studentInfoY + 10)
        .fillColor("#333333")
        .fontSize(12)
        .font("Helvetica")
        .text(formData.name, 50, studentInfoY + 28);

      doc.fillColor(secondaryColor)
        .font("Helvetica-Bold")
        .text("Father's Name:", 50, studentInfoY + 50)
        .fillColor("#333333")
        .font("Helvetica")
        .text(formData.fatherName, 50, studentInfoY + 68);

      // Right side of student info
      doc.strokeColor("#cccccc")
        .rect(305, studentInfoY, 250, infoBoxHeight)
        .stroke();

      doc.fillColor(secondaryColor)
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("Phone:", 315, studentInfoY + 10)
        .fillColor("#333333")
        .fontSize(12)
        .font("Helvetica")
        .text(formData.phoneNumber, 315, studentInfoY + 28);

      doc.fillColor(secondaryColor)
        .font("Helvetica-Bold")
        .text("Email:", 315, studentInfoY + 50)
        .fillColor("#333333")
        .fontSize(10)
        .font("Helvetica")
        .text(formData.email, 315, studentInfoY + 68);

      // Academic Information Section
      const academicY = studentInfoY + 20;

      // Academic Information Section with brand colors
      doc.fillColor(primaryColor)
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("ACADEMIC INFORMATION", 50, academicY);

      doc.strokeColor(primaryColor)
        .lineWidth(1)
        .moveTo(50, academicY + 5)
        .lineTo(200, academicY + 5)
        .stroke();

      doc.fillColor("#333333")
        .fontSize(11)
        .font("Helvetica")
        .text("Class: " + formData.class, 50, academicY + 20)
        .text("School Name: " + formData.schoolName, 50, academicY + 35)
        .text("Section: " + (formData.section || "N/A"), 50, academicY + 50)
        .text("Roll Number: " + (formData.rollNumber || "N/A"), 50, academicY + 65)
        .text("City: " + (formData.city || "N/A"), 50, academicY + 80)
        .text("Percentage/Grade: " + (formData.percentage || "N/A"), 50, academicY + 95)
        .text("Center: " + (formData.center ? formData.center.charAt(0).toUpperCase() + formData.center.slice(1) : "N/A"), 50, academicY + 110);

      // Right side academic info
      doc
        .rect(305, academicY + 25, 250, 130)
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

      // Fee Summary with brand colors
      const feeY = academicBoxY + academicBoxHeight + 30;

      doc.strokeColor(primaryColor)
        .lineWidth(2)
        .rect(40, feeY, 515, 70)
        .stroke();

      doc.fillColor(primaryColor)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("TEST DETAILS & FEE", 50, feeY + 10);

      doc.fillColor("#333333")
        .fontSize(11)
        .font("Helvetica")
        .text("Olympiad Aptitude Test Registration", 50, feeY + 30);

      doc.fillColor(primaryColor)
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("₹300", 480, feeY + 28, { align: "right" });

      doc.fillColor(secondaryColor)
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("Registration Fee:", 50, feeY + 50);

      // Total with brand colors
      const totalY = feeY + 80;

      doc.fillColor(primaryColor)
        .lineWidth(2)
        .rect(40, totalY, 515, 50)
        .stroke();

      doc.fillColor(secondaryColor)
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Total Amount", 50, totalY + 12);

      doc.fillColor(primaryColor)
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("₹300", 480, totalY + 8, { align: "right" });

      // Payment Instructions with better styling
      const instructionsY = totalY + 60;

      doc.strokeColor(primaryColor)
        .lineWidth(2)
        .moveTo(40, instructionsY)
        .lineTo(555, instructionsY)
        .stroke();

      doc.fillColor(primaryColor)
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("PAYMENT INSTRUCTIONS", 40, instructionsY + 15);

      doc.fillColor("#333333")
        .fontSize(10)
        .font("Helvetica")
        .text(
          "1. Scan PayTM QR code to complete payment of ₹300",
          40,
          instructionsY + 35
        )
        .text(
          "2. Save your PayTM payment screenshot",
          40,
          instructionsY + 55
        )
        .text(
          "3. Send screenshot along with this invoice number to: Suman Kumar (WhatsApp: +91 8447412646)",
          40,
          instructionsY + 75
        )
        .text(
          "4. Your application will be verified upon receipt of payment",
          40,
          instructionsY + 95
        );

      // Add payment URL section
      doc.fillColor(accentColor)
        .rect(40, instructionsY + 120, 515, 40)
        .stroke();
      
      doc.fillColor(primaryColor)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("💳 PAY ONLINE (INSTANT VERIFICATION)", 50, instructionsY + 135);
      
      doc.fillColor("#333333")
        .fontSize(10)
        .font("Helvetica")
        .text("Visit: https://your-domain.com/payment", 50, instructionsY + 155);
      
      doc.fillColor("#666666")
        .fontSize(9)
        .font("Helvetica")
        .text("Click the link above for instant payment verification", 50, instructionsY + 170);

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
