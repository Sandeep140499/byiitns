import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  const handleDownloadReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="border-4 border-green-200 rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 to-primary/5 dark:from-green-950/20 dark:to-primary/5 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-green-600 mb-2">✅ Payment Successful</CardTitle>
            <CardDescription className="text-base text-foreground/70">
              Thank you for registering for Olympiad Aptitude Test
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Receipt Card */}
            <div className="bg-white dark:bg-card border-2 border-primary/20 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-lg text-primary">📋 Registration Receipt</h3>

              <div className="space-y-3 text-foreground/80 font-medium">
                <div className="flex justify-between items-center py-2 border-b border-foreground/10">
                  <span>Test Name:</span>
                  <span className="font-semibold text-foreground">Olympiad Aptitude Test</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-foreground/10">
                  <span>Registration Fee:</span>
                  <span className="font-semibold text-foreground">₹300</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-foreground/10">
                  <span>Payment Status:</span>
                  <span className="font-semibold text-green-600">Completed</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Date:</span>
                  <span className="font-semibold text-foreground">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 space-y-3">
              <h3 className="font-bold text-lg text-blue-900 dark:text-blue-300">📌 Next Steps</h3>
              <ol className="space-y-2 text-blue-900 dark:text-blue-200 font-medium list-decimal list-inside">
                <li>Screenshot of payment confirmation has been recorded</li>
                <li>Our team will verify your payment within 24 hours</li>
                <li>You will receive a confirmation email once verified</li>
                <li>Test details will be sent to your registered email</li>
              </ol>
            </div>

            {/* Contact Support */}
            <div className="bg-accent/10 border-2 border-accent/20 rounded-2xl p-6 space-y-3">
              <h3 className="font-bold text-lg text-foreground">💬 Have Questions?</h3>
              <p className="text-foreground/70 font-medium">
                Contact us on WhatsApp for any queries regarding your registration
              </p>
              <a
                href="https://wa.me/918447412646"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                📱 WhatsApp: +91 8447412646
              </a>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={handleDownloadReceipt}
                className="w-full rounded-xl h-11 bg-primary hover:bg-primary/90 font-bold"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="w-full rounded-xl h-11 border-2 font-bold"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
