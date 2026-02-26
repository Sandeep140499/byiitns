import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import html2pdf from "html2pdf.js";

interface InvoiceProps {
  formData: {
    name: string;
    fatherName: string;
    phoneNumber: string;
    email: string;
    class: string;
    section: string;
    rollNumber: string;
    schoolName: string;
    city: string;
    gender?: string;
    percentage: string;
    center?: string;
  };
  serialNumber: string;
}

export const InvoiceTemplate = React.forwardRef<
  HTMLDivElement,
  InvoiceProps
>(({ formData, serialNumber }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white text-black p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto print:p-4"
      style={{ pageBreakAfter: "always" }}
    >
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 border-b-2 border-gray-300 pb-3 sm:pb-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600">ByIITians</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Always Build Concepts</p>
        <p className="text-xs text-gray-500">Delhi | NEET | IIT | CBSE | NTSE | Foundation</p>
      </div>

      {/* Invoice Title */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">REGISTRATION INVOICE</h2>
        </div>
        <div className="text-xs sm:text-sm">
          <p className="font-bold">Invoice No:</p>
          <p className="text-base sm:text-lg font-mono font-bold text-red-600 break-all">{serialNumber}</p>
        </div>
        <div className="text-xs sm:text-sm text-right">
          <p className="font-bold">Date:</p>
          <p>{new Date().toLocaleDateString("en-IN")}</p>
          <p className="font-bold mt-1 sm:mt-2">Status:</p>
          <p className="text-red-600 font-bold text-xs sm:text-sm">PENDING VERIFICATION</p>
        </div>
      </div>

      {/* Student Information */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-bold mb-3 bg-gray-100 p-2">STUDENT INFORMATION</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <div className="border p-2 sm:p-3">
            <p className="text-xs font-bold text-gray-600">NAME</p>
            <p className="font-semibold text-sm sm:text-base">{formData.name}</p>
          </div>
          <div className="border p-2 sm:p-3">
            <p className="text-xs font-bold text-gray-600">PHONE NUMBER</p>
            <p className="font-semibold text-sm sm:text-base">{formData.phoneNumber}</p>
          </div>
          <div className="border p-2 sm:p-3">
            <p className="text-xs font-bold text-gray-600">FATHER'S NAME</p>
            <p className="font-semibold text-sm sm:text-base">{formData.fatherName}</p>
          </div>
          <div className="border p-2 sm:p-3">
            <p className="text-xs font-bold text-gray-600">EMAIL</p>
            <p className="font-semibold text-xs sm:text-sm break-all">{formData.email}</p>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-bold mb-3 bg-gray-100 p-2">ACADEMIC INFORMATION</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          <div className="border p-2 sm:p-3">
            <p className="text-xs font-bold text-gray-600">CLASS</p>
            <p className="font-semibold text-sm sm:text-base">{formData.class}</p>
          </div>
          <div className="border p-2 sm:p-3">
            <p className="text-xs font-bold text-gray-600">SECTION</p>
            <p className="font-semibold text-sm sm:text-base">{formData.section || "N/A"}</p>
          </div>
          <div className="border p-2 sm:p-3">
            <p className="text-xs font-bold text-gray-600">ROLL NUMBER</p>
            <p className="font-semibold text-sm sm:text-base">{formData.rollNumber || "N/A"}</p>
          </div>
          <div className="border p-2 sm:p-3">
            <p className="text-xs font-bold text-gray-600">GENDER</p>
            <p className="font-semibold text-sm sm:text-base">{formData.gender || "N/A"}</p>
          </div>
        </div>
        <div className="border p-2 sm:p-3 mt-2">
          <p className="text-xs font-bold text-gray-600">SCHOOL NAME</p>
          <p className="font-semibold text-sm sm:text-base">{formData.schoolName}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-2">
          <div className="border p-2 sm:p-3">
            <p className="text-xs font-bold text-gray-600">CITY</p>
            <p className="font-semibold text-sm">{formData.city || "N/A"}</p>
          </div>
          <div className="border p-2 sm:p-3">
            <p className="text-xs font-bold text-gray-600">PERCENTAGE / GRADE</p>
            <p className="font-semibold text-sm">{formData.percentage || "N/A"}</p>
          </div>
          <div className="border p-2 sm:p-3">
            <p className="text-xs font-bold text-gray-600">CENTER</p>
            <p className="font-semibold text-sm capitalize">{formData.center || "N/A"}</p>
          </div>
          <div className="border p-2 sm:p-3">
            <p className="text-xs font-bold text-gray-600">GENDER</p>
            <p className="font-semibold text-sm">{formData.gender || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Fee Summary */}
      <div className="mb-6 sm:mb-8 border-2 border-gray-300 p-3 sm:p-4">
        <div className="flex justify-between mb-3">
          <span className="font-bold text-sm sm:text-base">Test Details:</span>
          <span className="text-sm sm:text-base">Olympiad Aptitude Test Registration</span>
        </div>
        <div className="flex justify-between text-base sm:text-lg font-bold border-t-2 pt-3">
          <span>Total Amount</span>
          <span className="text-xl sm:text-2xl text-red-600">₹300</span>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="mb-6 sm:mb-8 bg-blue-50 p-3 sm:p-4 border-l-4 border-blue-500">
        <h3 className="font-bold mb-3 text-sm sm:text-base">PAYMENT INSTRUCTIONS</h3>
        <ol className="text-xs sm:text-sm space-y-2 list-decimal list-inside">
          <li>Scan PayTM QR code to complete payment of ₹300</li>
          <li>Save your PayTM payment screenshot</li>
          <li>
            Send screenshot along with this invoice number (<strong>{serialNumber}</strong>) to: Suman Kumar
          </li>
          <li>WhatsApp: +91 8447412646</li>
          <li>Your application will be verified upon receipt of payment</li>
          <li className="text-red-600 font-bold">OR visit: <a href="/payment" className="underline">Pay Online Instantly</a></li>
        </ol>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 border-t pt-4">
        <p>This is an official registration invoice. Please keep it for your records.</p>
        <p>Generated on {new Date().toLocaleString("en-IN")}</p>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = "InvoiceTemplate";

interface InvoiceDownloadProps {
  formData: any;
  serialNumber: string;
}

export const InvoiceDownloadButton = ({ formData, serialNumber }: InvoiceDownloadProps) => {
  const handleDownloadPDF = async () => {
    try {
      // Create a temporary container for the invoice
      const element = document.createElement("div");
      const root = document.createElement("div");

      root.innerHTML = `
        <div class="bg-white text-black p-8" style="font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #ccc; padding-bottom: 15px;">
            <h1 style="font-size: 32px; font-weight: bold; color: #d32f2f; margin: 0;">ByIITians</h1>
            <p style="font-size: 12px; color: #666; margin: 5px 0 0;">Always Build Concepts</p>
            <p style="font-size: 11px; color: #999;">Delhi | NEET | IIT | CBSE | NTSE | Foundation</p>
          </div>

          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 15px; margin-bottom: 30px;">
            <div>
              <h2 style="font-size: 24px; font-weight: bold; margin: 0;">REGISTRATION INVOICE</h2>
            </div>
            <div style="font-size: 13px;">
              <p style="font-weight: bold; margin: 0;">Invoice No:</p>
              <p style="font-size: 16px; font-weight: bold; color: #d32f2f; margin: 3px 0; font-family: monospace;">${serialNumber}</p>
            </div>
            <div style="font-size: 13px; text-align: right;">
              <p style="font-weight: bold; margin: 0;">Date:</p>
              <p style="margin: 3px 0;">${new Date().toLocaleDateString("en-IN")}</p>
              <p style="font-weight: bold; margin: 8px 0 0;">Status:</p>
              <p style="color: #d32f2f; font-weight: bold;">PENDING VERIFICATION</p>
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="font-size: 15px; font-weight: bold; margin: 0 0 12px; background: #f0f0f0; padding: 8px;">STUDENT INFORMATION</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div style="border: 1px solid #ddd; padding: 12px;">
                <p style="font-size: 11px; font-weight: bold; color: #999; margin: 0;">NAME</p>
                <p style="font-weight: 600; margin: 5px 0 0;">${formData.name}</p>
              </div>
              <div style="border: 1px solid #ddd; padding: 12px;">
                <p style="font-size: 11px; font-weight: bold; color: #999; margin: 0;">PHONE NUMBER</p>
                <p style="font-weight: 600; margin: 5px 0 0;">${formData.phoneNumber}</p>
              </div>
              <div style="border: 1px solid #ddd; padding: 12px;">
                <p style="font-size: 11px; font-weight: bold; color: #999; margin: 0;">FATHER'S NAME</p>
                <p style="font-weight: 600; margin: 5px 0 0;">${formData.fatherName}</p>
              </div>
              <div style="border: 1px solid #ddd; padding: 12px;">
                <p style="font-size: 11px; font-weight: bold; color: #999; margin: 0;">EMAIL</p>
                <p style="font-weight: 600; margin: 5px 0 0; word-break: break-all; font-size: 13px;">${formData.email}</p>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="font-size: 15px; font-weight: bold; margin: 0 0 12px; background: #f0f0f0; padding: 8px;">ACADEMIC INFORMATION</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div style="border: 1px solid #ddd; padding: 12px;">
                <p style="font-size: 11px; font-weight: bold; color: #999; margin: 0;">CLASS</p>
                <p style="font-weight: 600; margin: 5px 0 0;">${formData.class}</p>
              </div>
              <div style="border: 1px solid #ddd; padding: 12px;">
                <p style="font-size: 11px; font-weight: bold; color: #999; margin: 0;">SECTION</p>
                <p style="font-weight: 600; margin: 5px 0 0;">${formData.section || "N/A"}</p>
              </div>
              <div style="border: 1px solid #ddd; padding: 12px;">
                <p style="font-size: 11px; font-weight: bold; color: #999; margin: 0;">ROLL NUMBER</p>
                <p style="font-weight: 600; margin: 5px 0 0;">${formData.rollNumber || "N/A"}</p>
              </div>
              <div style="border: 1px solid #ddd; padding: 12px;">
                <p style="font-size: 11px; font-weight: bold; color: #999; margin: 0;">GENDER</p>
                <p style="font-weight: 600; margin: 5px 0 0;">${formData.gender || "N/A"}</p>
              </div>
            </div>
            <div style="border: 1px solid #ddd; padding: 12px; margin-top: 10px;">
              <p style="font-size: 11px; font-weight: bold; color: #999; margin: 0;">SCHOOL NAME</p>
              <p style="font-weight: 600; margin: 5px 0 0;">${formData.schoolName}</p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px;">
              <div style="border: 1px solid #ddd; padding: 12px;">
                <p style="font-size: 11px; font-weight: bold; color: #999; margin: 0;">CITY</p>
                <p style="font-weight: 600; margin: 5px 0 0;">${formData.city || "N/A"}</p>
              </div>
              <div style="border: 1px solid #ddd; padding: 12px;">
                <p style="font-size: 11px; font-weight: bold; color: #999; margin: 0;">PERCENTAGE / GRADE</p>
                <p style="font-weight: 600; margin: 5px 0 0;">${formData.percentage || "N/A"}</p>
              </div>
            </div>
          </div>

          <div style="border: 2px solid #999; padding: 15px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="font-weight: bold;">Test Details:</span>
              <span>Olympiad Aptitude Test Registration</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; border-top: 2px solid #999; padding-top: 10px;">
              <span>Total Amount</span>
              <span style="font-size: 20px; color: #d32f2f;">₹300</span>
            </div>
          </div>

          <div style="background: #e3f5ff; padding: 15px; border-left: 4px solid #2196F3; margin-bottom: 30px;">
            <h3 style="font-weight: bold; margin: 0 0 12px;">PAYMENT INSTRUCTIONS</h3>
            <ol style="font-size: 12px; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 6px;">Scan the PayTM QR code to complete the payment of ₹300</li>
              <li style="margin-bottom: 6px;">Save your PayTM payment screenshot</li>
              <li style="margin-bottom: 6px;">Send the screenshot along with this invoice number (<strong>${serialNumber}</strong>) to: Suman Kumar</li>
              <li style="margin-bottom: 6px;">WhatsApp: +91 8447412646</li>
              <li>Your application will be verified upon receipt of payment</li>
            </ol>
          </div>

          <div style="text-align: center; font-size: 11px; color: #999; border-top: 1px solid #ddd; padding-top: 15px;">
            <p style="margin: 0;">This is an official registration invoice. Please keep it for your records.</p>
            <p style="margin: 5px 0 0;">Generated on ${new Date().toLocaleString("en-IN")}</p>
          </div>
        </div>
      `;

      element.appendChild(root);

      const options = {
        margin: 5,
        filename: `ByIITians_Invoice_${serialNumber}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait" as const, unit: "mm", format: "a4" },
      };

      html2pdf().set(options).from(root).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <Button
        onClick={handleDownloadPDF}
        className="flex-1 rounded-xl h-10 sm:h-11 bg-primary hover:bg-primary/90 font-bold text-sm sm:text-base"
      >
        <Download className="mr-2 h-4 w-4" />
        Download Invoice PDF
      </Button>
      <Button
        onClick={() => window.print()}
        variant="outline"
        className="flex-1 rounded-xl h-10 sm:h-11 border-2 font-bold text-sm sm:text-base"
      >
        <Printer className="mr-2 h-4 w-4" />
        Print Invoice
      </Button>
    </div>
  );
};
