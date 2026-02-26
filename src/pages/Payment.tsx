import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, CreditCard, Mail, CheckCircle2, AlertCircle, Loader2, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import paymentQR from "@/assets/paymentQR.jpeg";

interface PaymentFormData {
  name: string;
  email: string;
  phone: string;
  amount: string;
  paymentMethod: string;
}

export default function Payment() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [formData, setFormData] = useState<PaymentFormData>({
    name: "",
    email: "",
    phone: "",
    amount: "225",
    paymentMethod: "upi",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: value,
    }));
  };

  const sendPaymentLinkEmail = async () => {
    setIsLoading(true);
    try {
      // Call backend API to send payment link email
      const response = await fetch('http://localhost:5000/api/send-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          amount: formData.amount,
          paymentMethod: formData.paymentMethod,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsEmailSent(true);
        toast.success("Payment link sent to your email!");
      } else {
        toast.error(result.message || "Failed to send payment link. Please try again.");
      }
    } catch (error) {
      console.error('Error sending payment link:', error);
      toast.error("Failed to send payment link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentConfirmation = () => {
    setIsLoading(true);
    try {
      // Simulate payment processing
      setTimeout(() => {
        setPaymentComplete(true);
        setIsLoading(false);
        toast.success("Payment confirmed successfully!");
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      toast.error("Payment confirmation failed. Please try again.");
    }
  };

  const handleRedirectToHome = () => {
    navigate("/");
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="border-4 border-green-200 rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-green-600 mb-2">✅ Payment Successful</CardTitle>
              <CardDescription className="text-base text-foreground/70">
                Thank you for your payment!
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-white dark:bg-card border-2 border-primary/20 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-lg text-primary">📋 Payment Details</h3>
                <div className="space-y-3 text-foreground/80 font-medium">
                  <div className="flex justify-between items-center py-2 border-b border-foreground/10">
                    <span>Name:</span>
                    <span className="font-semibold text-foreground">{formData.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-foreground/10">
                    <span>Amount Paid:</span>
                    <span className="font-semibold text-foreground">₹{formData.amount}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-foreground/10">
                    <span>Payment Method:</span>
                    <span className="font-semibold text-foreground capitalize">{formData.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span>Date:</span>
                    <span className="font-semibold text-foreground">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button
                  onClick={handleRedirectToHome}
                  className="w-full rounded-xl h-11 bg-primary hover:bg-primary/90 font-bold"
                >
                  🏠 Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Payment Form */}
          <Card className="rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                Payment Information
              </CardTitle>
              <CardDescription>
                Enter your details to complete the payment
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  className="rounded-lg"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={formData.paymentMethod} onValueChange={handlePaymentMethodChange}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="netbanking">Net Banking</SelectItem>
                    <SelectItem value="wallet">Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={sendPaymentLinkEmail}
                  variant="outline"
                  disabled={isLoading || !formData.email}
                  className="flex-1 rounded-lg"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  Send Payment Link
                </Button>

                <Button
                  onClick={handlePaymentConfirmation}
                  disabled={isLoading || !formData.name || !formData.email}
                  className="flex-1 rounded-lg"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  Confirm Payment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Instructions */}
          <Card className="rounded-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Smartphone className="h-6 w-6" />
                Payment Instructions
              </CardTitle>
              <CardDescription>
                Follow these steps to complete your payment
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {formData.paymentMethod === "upi" && (
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">UPI Payment</h3>
                    <ol className="space-y-2 text-blue-900 dark:text-blue-200 text-sm list-decimal list-inside">
                      <li>Scan the QR code with your UPI app</li>
                      <li>Enter the amount: ₹{formData.amount}</li>
                      <li>Complete the payment</li>
                      <li>Click "Confirm Payment" button above</li>
                    </ol>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-xl border-2 border-foreground/20">
                      <img 
                        src={paymentQR} 
                        alt="Payment QR Code" 
                        className="w-48 h-48 object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === "card" && (
                <div className="bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800 rounded-xl p-4">
                  <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">Card Payment</h3>
                  <ol className="space-y-2 text-green-900 dark:text-green-200 text-sm list-decimal list-inside">
                    <li>Click "Send Payment Link" to receive payment link</li>
                    <li>Check your email for the payment link</li>
                    <li>Click the link to enter card details</li>
                    <li>Complete the payment on secure gateway</li>
                    <li>Return here and click "Confirm Payment"</li>
                  </ol>
                </div>
              )}

              {formData.paymentMethod === "netbanking" && (
                <div className="bg-purple-50 dark:bg-purple-950/30 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-4">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">Net Banking</h3>
                  <ol className="space-y-2 text-purple-900 dark:text-purple-200 text-sm list-decimal list-inside">
                    <li>Click "Send Payment Link" to receive payment link</li>
                    <li>Check your email for the payment link</li>
                    <li>Select your bank from the list</li>
                    <li>Login and authorize the payment</li>
                    <li>Return here and click "Confirm Payment"</li>
                  </ol>
                </div>
              )}

              {formData.paymentMethod === "wallet" && (
                <div className="bg-orange-50 dark:bg-orange-950/30 border-2 border-orange-200 dark:border-orange-800 rounded-xl p-4">
                  <h3 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">Wallet Payment</h3>
                  <ol className="space-y-2 text-orange-900 dark:text-orange-200 text-sm list-decimal list-inside">
                    <li>Click "Send Payment Link" to receive payment link</li>
                    <li>Check your email for the payment link</li>
                    <li>Select your wallet (Paytm, PhonePe, etc.)</li>
                    <li>Complete the payment</li>
                    <li>Return here and click "Confirm Payment"</li>
                  </ol>
                </div>
              )}

              {isEmailSent && (
                <div className="bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-green-900 dark:text-green-300">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-semibold">Payment link sent successfully!</span>
                  </div>
                  <p className="text-green-900 dark:text-green-200 text-sm mt-1">
                    Please check your email at {formData.email}
                  </p>
                </div>
              )}

              <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-semibold">Important Note</span>
                </div>
                <p className="text-amber-900 dark:text-amber-200 text-sm mt-1">
                  After completing the payment, don't forget to click the "Confirm Payment" button above to finalize your registration.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
