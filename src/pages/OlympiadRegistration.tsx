import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import paymentQR from "@/assets/paymentQR.jpeg";
import { ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InvoiceDownloadButton } from "@/components/InvoiceComponent";

interface FormData {
  name: string;
  fatherName: string;
  phoneNumber: string;
  email: string;
  class: string;
  section: string;
  rollNumber: string;
  schoolName: string;
  city: string;
  gender: string;
  percentage: string;
}

export default function OlympiadRegistration() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serialNumber, setSerialNumber] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    fatherName: "",
    phoneNumber: "",
    email: "",
    class: "",
    section: "",
    rollNumber: "",
    schoolName: "",
    city: "",
    gender: "",
    percentage: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    // Developer note: when running the app locally make sure your serverless
    // functions are available (e.g. via `vercel dev` or a proxy). Otherwise
    // fetch("/api/register") will fail with network errors and submissions
    // appear to "fail". Check the browser console for network logs.
    if (
      !formData.name ||
      !formData.fatherName ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.class ||
      !formData.schoolName
    ) {
      toast.error("Please fill in all required fields");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ""))) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Call backend API to send emails
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Registration API returned non-OK status", response.status, errText);
        toast.error(
          `Registration failed (status ${response.status}). Check console for details.`
        );
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setSerialNumber(data.serialNumber);
        setIsSubmitted(true);
        toast.success("Registration successful! Confirmation emails sent.");
      } else {
        toast.error(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit registration. Please check your connection or backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
        {/* Full-Width Header */}
        <div className="w-full bg-gradient-to-b from-primary/10 to-transparent py-12 sm:py-16 md:py-20">
          <div className="text-center space-y-4">
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight px-4">
              <span className="text-primary">By</span>
              <span className="text-red">IITians</span>
            </h2>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary px-4">
              Olympiad Aptitude Test
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 w-full max-w-full sm:max-w-3xl lg:max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <Card className="border-4 border-primary/20 rounded-3xl overflow-hidden bg-gradient-to-br from-card to-primary/5 shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-primary mb-2">
                ✅ Registration Form Submitted
              </CardTitle>
              <CardDescription className="text-base">
                Complete your payment to finalize your Olympiad registration
              </CardDescription>
            </CardHeader>
            {/* Prize reminder */}
            <div className="flex justify-center gap-8 my-4">
              <div className="text-center">
                <img
                  src="https://via.placeholder.com/60x60?text=1st"
                  alt="1st Prize Laptop"
                  className="mx-auto h-16 w-16 object-contain animate-pulse"
                />
                                <p className="text-xs mt-1 font-semibold">🏆 Premium Laptop</p>
              </div>
              <div className="text-center">
                <img
                  src="https://via.placeholder.com/60x60?text=2nd"
                  alt="2nd Prize Tablet"
                  className="mx-auto h-16 w-16 object-contain animate-pulse"
                />
                                <p className="text-xs mt-1 font-semibold">🥈 Advanced Tablet</p>
              </div>
            </div>

            <CardContent className="space-y-8">
              {/* Serial Number Display */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800 rounded-2xl p-6 text-center">
                <p className="text-sm font-semibold text-green-900 dark:text-green-300 mb-2">Your Registration Serial Number</p>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400 font-mono tracking-wide">{serialNumber}</p>
                <p className="text-xs text-green-700 dark:text-green-400 mt-2">Save this number for future reference</p>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-6 rounded-2xl border-2 border-primary/20 shadow-md">
                  <img src={paymentQR} alt="Payment QR Code" className="w-64 h-64 object-contain" />
                </div>
                <p className="text-center font-semibold text-foreground">Scan to pay via PayTM</p>
              </div>

              {/* Important Instructions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3 bg-red/10 border-2 border-red/20 rounded-2xl p-4">
                  <AlertCircle className="h-6 w-6 text-red flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-red mb-2">⚠️ Important</h3>
                    <p className="text-foreground/90 font-medium">
                      Your application will be <span className="font-bold">REJECTED</span> without payment screenshot.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-4 sm:p-6 space-y-3">
                  <h3 className="font-bold text-lg text-blue-900 dark:text-blue-300">📱 Payment Instructions</h3>
                  <ol className="space-y-2 text-blue-900 dark:text-blue-200 font-medium">
                    <li className="flex items-start space-x-3">
                      <span className="font-bold">1️⃣</span>
                      <span>Scan the QR code above using your phone camera or PayTM app</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="font-bold">2️⃣</span>
                      <span>Complete the payment of ₹225</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="font-bold">3️⃣</span>
                      <span>Take a screenshot of the payment confirmation</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="font-bold">4️⃣</span>
                      <span>Send the screenshot along with your serial number and details to the contact below</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="font-bold">5️⃣</span>
                      <span>Once payment is verified you will receive a final confirmation email with your admit card and exam instructions</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800 rounded-2xl p-6 space-y-3">
                  <h3 className="font-bold text-lg text-green-900 dark:text-green-300">📋 Required Details to Send</h3>
                  <p className="text-green-900 dark:text-green-200 font-medium">
                    Send the payment screenshot along with:
                  </p>
                  <ul className="space-y-1 text-green-900 dark:text-green-200 font-medium list-disc list-inside">
                    <li>Your Name</li>
                    <li>Father's Name</li>
                    <li>Phone Number</li>
                    <li>Email ID</li>
                  </ul>
                </div>
              </div>

              {/* Contact Section */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20 rounded-2xl p-4 sm:p-6 space-y-3">
                <h3 className="font-bold text-xl text-primary">📞 Contact for Payment Verification</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-lg text-primary">Name:</span>
                    <span className="text-foreground font-semibold">Suman Kumar</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-lg text-primary">WhatsApp:</span>
                    <a
                      href="https://wa.me/918447412646"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 font-bold text-lg underline"
                    >
                      +91 8447412646
                    </a>
                  </div>
                </div>
              </div>

              {/* Submitted Details */}
              <div className="bg-accent/10 border-2 border-accent/20 rounded-2xl p-6 space-y-3">
                <h3 className="font-bold text-lg text-foreground">📝 Your Submitted Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-foreground/70 text-xs font-semibold">Name</p>
                    <p className="text-foreground font-medium">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-foreground/70 text-xs font-semibold">Father's Name</p>
                    <p className="text-foreground font-medium">{formData.fatherName}</p>
                  </div>
                  <div>
                    <p className="text-foreground/70 text-xs font-semibold">Phone Number</p>
                    <p className="text-foreground font-medium">{formData.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-foreground/70 text-xs font-semibold">Email</p>
                    <p className="text-foreground font-medium">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-foreground/70 text-xs font-semibold">Class</p>
                    <p className="text-foreground font-medium">{formData.class}</p>
                  </div>
                  <div>
                    <p className="text-foreground/70 text-xs font-semibold">School Name</p>
                    <p className="text-foreground font-medium">{formData.schoolName}</p>
                  </div>
                </div>
              </div>

              {/* Invoice Download Section */}
              <div className="bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800 rounded-2xl p-4 sm:p-6 space-y-4">
                <h3 className="font-bold text-lg text-green-900 dark:text-green-300">📄 Download Invoice</h3>
                <p className="text-green-900 dark:text-green-200 font-medium">
                  Your registration invoice has been generated and attached to your email. Download it below for your records.
                </p>
                <InvoiceDownloadButton formData={formData} serialNumber={serialNumber} />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => navigate("/payment")}
                  className="flex-1 rounded-xl h-11 bg-green-600 hover:bg-green-700 font-bold"
                >
                  💳 Complete Payment
                </Button>
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: "",
                      fatherName: "",
                      phoneNumber: "",
                      email: "",
                      class: "",
                      section: "",
                      rollNumber: "",
                      schoolName: "",
                      city: "",
                      gender: "",
                      percentage: "",
                    });
                  }}
                  variant="outline"
                  className="flex-1 border-2 rounded-xl h-11"
                >
                  Edit Form
                </Button>
                <Button onClick={() => navigate("/")} className="flex-1 rounded-xl h-11 bg-primary hover:bg-primary/90">
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Form Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Full-Width Header */}
      <div className="w-full bg-gradient-to-b from-primary/10 to-transparent py-12 sm:py-16 md:py-20">
        <div className="text-center space-y-4">
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight px-4">
            <span className="text-primary">By</span>
            <span className="text-red">IITians</span>
          </h2>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary px-4">
            Olympiad Aptitude Test
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 w-full max-w-full sm:max-w-3xl lg:max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="border-4 border-primary/20 rounded-3xl overflow-hidden bg-gradient-to-br from-card to-primary/5 shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardDescription className="text-base">
              Register for the Olympiad Aptitude Test - Fee ₹225
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Details Section */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-primary">👤 Student Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground font-semibold">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="border-2 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fatherName" className="text-foreground font-semibold">
                      Father's Name *
                    </Label>
                    <Input
                      id="fatherName"
                      name="fatherName"
                      placeholder="Enter father's name"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      className="border-2 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-foreground font-semibold">
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="10-digit number"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="border-2 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-semibold">
                      Email ID *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border-2 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-foreground font-semibold">
                      Gender
                    </Label>
                    <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                      <SelectTrigger className="border-2 rounded-xl">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="class" className="text-foreground font-semibold">
                      Class *
                    </Label>
                    <Select value={formData.class} onValueChange={(value) => handleSelectChange("class", value)}>
                      <SelectTrigger className="border-2 rounded-xl">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {[8, 9, 10, 11, 12].map((cls) => (
                          <SelectItem key={cls} value={cls.toString()}>
                            Class {cls}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Academic Details */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-primary">📚 Academic Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName" className="text-foreground font-semibold">
                      School Name *
                    </Label>
                    <Input
                      id="schoolName"
                      name="schoolName"
                      placeholder="Enter your school name"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      className="border-2 rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-foreground font-semibold">
                      City
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="border-2 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="section" className="text-foreground font-semibold">
                      Section
                    </Label>
                    <Input
                      id="section"
                      name="section"
                      placeholder="e.g., A, B, C"
                      value={formData.section}
                      onChange={handleInputChange}
                      className="border-2 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rollNumber" className="text-foreground font-semibold">
                      Roll Number
                    </Label>
                    <Input
                      id="rollNumber"
                      name="rollNumber"
                      placeholder="Enter roll number"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      className="border-2 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="percentage" className="text-foreground font-semibold">
                      Percentage / Grade
                    </Label>
                    <Input
                      id="percentage"
                      name="percentage"
                      placeholder="e.g., 85% or A+"
                      value={formData.percentage}
                      onChange={handleInputChange}
                      className="border-2 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Fee Information */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Registration Fee:</span>
                  <span className="text-2xl font-bold text-primary">₹225</span>
                </div>
                <p className="text-sm text-foreground/70">Payment required to complete your registration</p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl h-12 text-base font-bold bg-gradient-to-r from-primary to-red hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  "Register & Pay ₹225"
                )}
              </Button>

              <p className="text-xs text-center text-foreground/60">
                * indicates required fields. By submitting, you agree to our terms and conditions.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
