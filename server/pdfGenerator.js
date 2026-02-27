import PDFDocument from "pdfkit";
import { Readable } from "stream";

// Center locations data
const centerLocations = {
  mehrauli: {
    name: "ByIITians MEHRAULI",
    address: "Mehrauli, New Delhi",
    mapUrl: "https://maps.app.goo.gl/Q9rWEneuXHkg47gy9?g_st=iw"
  },
  "vasant-kunj": {
    name: "ByIITians VASANT KUNJ", 
    address: "Vasant Kunj, New Delhi",
    mapUrl: "https://maps.app.goo.gl/6UV3E17ruEEFsg1q8?g_st=iw"
  },
  okhala: {
    name: "ByIITians OKHLA",
    address: "Okhla, New Delhi", 
    mapUrl: "https://maps.app.goo.gl/7H3kDanHGtpiCTjL9?g_st=iw"
  }
};

export function generateInvoicePDF(formData, serialNumber) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 50,
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
      const lightBlue = "#e3f2fd"; // Light blue for center section
      const goldColor = "#FFB300"; // Gold for premium elements

      // Get selected center information
      const selectedCenter = centerLocations[formData.center] || null;

      // Enhanced Header with professional branding
      doc.fillColor(primaryColor)
        .rect(0, 0, 612, 140)
        .fill();
      
      // Add decorative pattern
      for (let i = 0; i < 20; i++) {
        doc.fillColor("rgba(255, 255, 255, 0.1)")
          .circle(50 + i * 30, 20, 3)
          .fill();
      }
      
      // "By" in primary color (blue), "IITians" in white
      const byWidth = doc.widthOfString("By", { font: "Helvetica-Bold", fontSize: 42 });
      const iitiansWidth = doc.widthOfString("IITians", { font: "Helvetica-Bold", fontSize: 42 });
      const totalWidth = byWidth + iitiansWidth;
      const startX = (612 - totalWidth) / 2;
      
      doc.fillColor("#3b82f6") // Primary blue color
        .fontSize(42)
        .font("Helvetica-Bold")
        .text("By", startX, 60);
      
      doc.fillColor("#ffffff")
        .fontSize(42)
        .font("Helvetica-Bold")
        .text("IITians", startX + byWidth, 60)
        .fontSize(16)
        .font("Helvetica")
        .text("Always Build Concepts", { align: "center" })
        .fontSize(12)
        .fillColor("#ffebee")
        .text("Delhi | NEET | IIT | CBSE | NTSE | Foundation", { align: "center" });

      // Professional invoice badge with gold accent
      doc.fillColor(goldColor)
        .rect(200, 155, 212, 35)
        .fill();
      
      doc.fillColor(secondaryColor)
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("REGISTRATION INVOICE", 206, 177);

      // Enhanced invoice details with better layout
      doc.fillColor("#ffffff")
        .roundedRect(45, 205, 522, 80, 10)
        .fill();
      
      doc.strokeColor(primaryColor)
        .lineWidth(2)
        .roundedRect(45, 205, 522, 80, 10)
        .stroke();

      // Enhanced invoice details layout
      doc.fillColor(secondaryColor)
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("Invoice Details", 60, 220);
      
      doc.fillColor("#333333")
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Invoice No:", 60, 245)
        .fillColor(primaryColor)
        .fontSize(16)
        .font("Helvetica-Bold")
        .text(serialNumber, 160, 245);

      doc.fillColor(secondaryColor)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Date:", 60, 265)
        .fillColor("#333333")
        .fontSize(12)
        .font("Helvetica")
        .text(new Date().toLocaleDateString("en-IN"), 160, 265);

      doc.fillColor(secondaryColor)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Status:", 350, 245)
        .fillColor(goldColor)
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("PENDING PAYMENT", 430, 245);

      doc.fillColor(secondaryColor)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Amount:", 350, 265)
        .fillColor(primaryColor)
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("₹300", 430, 265);

      // Enhanced Student Information Section
      doc.fillColor(primaryColor)
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("STUDENT INFORMATION", 50, 305);

      const studentInfoY = 330;
      const infoBoxHeight = 120;

      // Enhanced student info boxes with gradient effect
      doc.fillColor(lightBlue)
        .roundedRect(50, studentInfoY, 245, infoBoxHeight, 8)
        .fill();
      
      doc.strokeColor(primaryColor)
        .lineWidth(2)
        .roundedRect(50, studentInfoY, 245, infoBoxHeight, 8)
        .stroke();

      doc.fillColor(secondaryColor)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Name:", 60, studentInfoY + 15)
        .fillColor("#333333")
        .fontSize(14)
        .font("Helvetica")
        .text(formData.name, 60, studentInfoY + 35);

      doc.fillColor(secondaryColor)
        .font("Helvetica-Bold")
        .text("Father's Name:", 60, studentInfoY + 55)
        .fillColor("#333333")
        .font("Helvetica")
        .text(formData.fatherName, 60, studentInfoY + 75);

      doc.fillColor(secondaryColor)
        .font("Helvetica-Bold")
        .text("Phone:", 60, studentInfoY + 95)
        .fillColor("#333333")
        .font("Helvetica")
        .text(formData.phoneNumber, 60, studentInfoY + 115);

      // Right side of student info
      doc.fillColor(lightBlue)
        .roundedRect(317, studentInfoY, 245, infoBoxHeight, 8)
        .fill();
      
      doc.strokeColor(primaryColor)
        .lineWidth(2)
        .roundedRect(317, studentInfoY, 245, infoBoxHeight, 8)
        .stroke();

      doc.fillColor(secondaryColor)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Email:", 327, studentInfoY + 15)
        .fillColor("#333333")
        .fontSize(11)
        .font("Helvetica")
        .text(formData.email, 327, studentInfoY + 35);

      doc.fillColor(secondaryColor)
        .font("Helvetica-Bold")
        .text("Class:", 327, studentInfoY + 55)
        .fillColor("#333333")
        .font("Helvetica")
        .text(formData.class, 327, studentInfoY + 75);

      doc.fillColor(secondaryColor)
        .font("Helvetica-Bold")
        .text("School:", 327, studentInfoY + 95)
        .fillColor("#333333")
        .font("Helvetica")
        .text(formData.schoolName, 327, studentInfoY + 115);

      // Enhanced Academic Information Section
      const academicY = studentInfoY + 140;

      doc.fillColor(primaryColor)
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("ACADEMIC INFORMATION", 50, academicY);

      doc.strokeColor(primaryColor)
        .lineWidth(2)
        .moveTo(50, academicY + 5)
        .lineTo(250, academicY + 5)
        .stroke();

      // Enhanced academic info box
      doc.fillColor(accentColor)
        .roundedRect(50, academicY + 20, 512, 100, 8)
        .fill();
      
      doc.strokeColor(primaryColor)
        .lineWidth(2)
        .roundedRect(50, academicY + 20, 512, 100, 8)
        .stroke();

      // Left column academic info
      doc.fillColor(secondaryColor)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Class:", 60, academicY + 40)
        .fillColor("#333333")
        .fontSize(12)
        .font("Helvetica")
        .text(formData.class, 120, academicY + 40);

      doc.fillColor(secondaryColor)
        .font("Helvetica-Bold")
        .text("Section:", 60, academicY + 60)
        .fillColor("#333333")
        .font("Helvetica")
        .text(formData.section || "N/A", 120, academicY + 60);

      doc.fillColor(secondaryColor)
        .font("Helvetica-Bold")
        .text("Roll Number:", 60, academicY + 80)
        .fillColor("#333333")
        .font("Helvetica")
        .text(formData.rollNumber || "N/A", 150, academicY + 80);

      doc.fillColor(secondaryColor)
        .font("Helvetica-Bold")
        .text("Center:", 60, academicY + 100)
        .fillColor("#333333")
        .font("Helvetica")
        .text(formData.center ? formData.center.charAt(0).toUpperCase() + formData.center.slice(1) : "N/A", 120, academicY + 100);

      // Right column academic info
      doc.fillColor(secondaryColor)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("School Name:", 320, academicY + 40)
        .fillColor("#333333")
        .font("Helvetica")
        .text(formData.schoolName, 420, academicY + 40);

      doc.fillColor(secondaryColor)
        .font("Helvetica-Bold")
        .text("City:", 320, academicY + 60)
        .fillColor("#333333")
        .font("Helvetica")
        .text(formData.city || "N/A", 370, academicY + 60);

      doc.fillColor(secondaryColor)
        .font("Helvetica-Bold")
        .text("Percentage:", 320, academicY + 80)
        .fillColor("#333333")
        .font("Helvetica")
        .text(formData.percentage || "N/A", 410, academicY + 80);

      doc.fillColor(secondaryColor)
        .font("Helvetica-Bold")
        .text("Grade:", 320, academicY + 100)
        .fillColor("#333333")
        .font("Helvetica")
        .text(formData.percentage || "N/A", 370, academicY + 100);

      // Enhanced Center Information Section
      if (selectedCenter) {
        const centerY = academicY + 130;

        doc.fillColor(lightBlue)
          .roundedRect(50, centerY, 512, 110, 8)
          .fill();
        
        doc.strokeColor(primaryColor)
          .lineWidth(2)
          .roundedRect(50, centerY, 512, 110, 8)
          .stroke();

        doc.fillColor(primaryColor)
          .fontSize(16)
          .font("Helvetica-Bold")
          .text("📍 YOUR CENTER LOCATION", 60, centerY + 15);

        doc.fillColor(secondaryColor)
          .fontSize(14)
          .font("Helvetica-Bold")
          .text(selectedCenter.name, 60, centerY + 35);

        doc.fillColor("#333333")
          .fontSize(12)
          .font("Helvetica")
          .text(selectedCenter.address, 60, centerY + 55);

        // Add URLs with proper formatting
        doc.fillColor("#1976D2")
          .fontSize(10)
          .font("Helvetica-Bold")
          .text("🗺️ Map URL:", 60, centerY + 75);
        
        doc.fillColor("#1976D2")
          .fontSize(9)
          .font("Helvetica")
          .text(selectedCenter.mapUrl, 120, centerY + 75);

        doc.fillColor("#1976D2")
          .fontSize(10)
          .font("Helvetica-Bold")
          .text("🧭 Navigation URL:", 60, centerY + 90);
        
        doc.fillColor("#1976D2")
          .fontSize(9)
          .font("Helvetica")
          .text(selectedCenter.navigationUrl, 150, centerY + 90);

        const feeY = centerY + 130;
      } else {
        const feeY = academicY + 130;
      }

      // Enhanced Fee Summary Section
      const feeY = academicY + 130;

      doc.fillColor(goldColor)
        .roundedRect(50, feeY, 512, 80, 8)
        .fill();
      
      doc.strokeColor(primaryColor)
        .lineWidth(2)
        .roundedRect(50, feeY, 512, 80, 8)
        .stroke();

      doc.fillColor(secondaryColor)
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("💰 PAYMENT DETAILS", 60, feeY + 15);

      doc.fillColor("#333333")
        .fontSize(14)
        .font("Helvetica")
        .text("Olympiad Aptitude Test Registration", 60, feeY + 35);

      doc.fillColor(primaryColor)
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("₹300", 460, feeY + 35, { align: "right" });

      doc.fillColor(secondaryColor)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Registration Fee:", 60, feeY + 60);

      // Enhanced Total Section
      const totalY = feeY + 100;

      doc.fillColor(primaryColor)
        .roundedRect(50, totalY, 512, 60, 8)
        .fill();
      
      doc.strokeColor(goldColor)
        .lineWidth(3)
        .roundedRect(50, totalY, 512, 60, 8)
        .stroke();

      doc.fillColor("#ffffff")
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("TOTAL AMOUNT", 60, totalY + 20);

      doc.fillColor(goldColor)
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("₹300", 460, totalY + 18, { align: "right" });

      // Enhanced Payment Instructions Section
      const instructionsY = totalY + 80;

      doc.fillColor(primaryColor)
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("💳 PAYMENT INSTRUCTIONS", 50, instructionsY);

      doc.strokeColor(primaryColor)
        .lineWidth(2)
        .moveTo(50, instructionsY + 5)
        .lineTo(300, instructionsY + 5)
        .stroke();

      // Enhanced payment instruction box
      doc.fillColor(accentColor)
        .roundedRect(50, instructionsY + 20, 512, 120, 8)
        .fill();
      
      doc.strokeColor(primaryColor)
        .lineWidth(2)
        .roundedRect(50, instructionsY + 20, 512, 120, 8)
        .stroke();

      doc.fillColor("#333333")
        .fontSize(12)
        .font("Helvetica")
        .text("1. Scan PayTM QR code to complete payment of ₹300", 60, instructionsY + 40)
        .text("2. Save your PayTM payment screenshot", 60, instructionsY + 60)
        .text("3. Send screenshot along with this invoice number to:", 60, instructionsY + 80)
        .text("   Suman Kumar (WhatsApp: +91 8447412646)", 60, instructionsY + 100)
        .text("4. Your application will be verified upon receipt of payment", 60, instructionsY + 120);

      // Enhanced online payment section
      doc.fillColor(lightBlue)
        .roundedRect(50, instructionsY + 150, 512, 50, 8)
        .fill();
      
      doc.strokeColor(primaryColor)
        .lineWidth(2)
        .roundedRect(50, instructionsY + 150, 512, 50, 8)
        .stroke();
      
      doc.fillColor(primaryColor)
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("🌐 PAY ONLINE (INSTANT VERIFICATION)", 60, instructionsY + 165);
      
      doc.fillColor("#333333")
        .fontSize(12)
        .font("Helvetica")
        .text("Visit: https://byiitians.com/payment", 60, instructionsY + 185);
      
      doc.fillColor("#666666")
        .fontSize(10)
        .font("Helvetica")
        .text("Click the link above for instant payment verification", 60, instructionsY + 205);

      // Enhanced Footer with professional branding
      doc.fillColor(primaryColor)
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("🎓 ", 306, instructionsY + 240, { align: "center" });
      
      // "By" in primary color (blue), "IITians" in red
      const footerByWidth = doc.widthOfString("By", { font: "Helvetica-Bold", fontSize: 12 });
      const footerIitiansWidth = doc.widthOfString("IITians - Always Build Concepts", { font: "Helvetica-Bold", fontSize: 12 });
      const footerTotalWidth = footerByWidth + footerIitiansWidth;
      const footerStartX = (612 - footerTotalWidth) / 2;
      
      doc.fillColor("#3b82f6") // Primary blue color
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("By", footerStartX, instructionsY + 240);
      
      doc.fillColor("#d32f2f") // Red color
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("IITians - Always Build Concepts", footerStartX + footerByWidth, instructionsY + 240);

      doc.fillColor("#666666")
        .fontSize(10)
        .font("Helvetica")
        .text("This is an official registration invoice. Please keep it for your records.", 306, instructionsY + 260, { align: "center" })
        .text(`Generated on ${new Date().toLocaleString("en-IN")}`, 306, instructionsY + 280, { align: "center" })
        .text("📞 Contact: +91 8447412646 | 🌐 www.byiitians.com", 306, instructionsY + 300, { align: "center" });

      // Add decorative footer line
      doc.strokeColor(primaryColor)
        .lineWidth(3)
        .moveTo(50, instructionsY + 320)
        .lineTo(562, instructionsY + 320)
        .stroke();

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
