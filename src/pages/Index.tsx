import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SectionCard } from "@/components/SectionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Settings, Trophy, Award, GraduationCap, PlayCircle, Users, Target, Star } from "lucide-react";
// prize images replaced by external URLs
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import firstPrize from "@/assets/prizes/1st.png";
import secondPrize from "@/assets/prizes/2nd.png";
import thirdPrize from "@/assets/prizes/3rd.png";

interface Section {
  id: string;
  title: string;
  description: string;
  icon: string;
  display_order: number;
}

const Index = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [showOlympiadPopup, setShowOlympiadPopup] = useState(false);

  // Check if registration is closed (after 26 March)
  const isRegistrationClosed = () => {
    const currentDate = new Date();
    const deadlineDate = new Date(currentDate.getFullYear(), 2, 26); // March 26
    return currentDate > deadlineDate;
  };

  useEffect(() => {
    fetchSections();
    checkAdminStatus();
    // Removed automatic popup - will trigger only on button/card click
    // Get the current website URL
    if (typeof window !== "undefined") {
      setWebsiteUrl(window.location.origin);
    }
  }, []);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from("sections")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      toast.error("Failed to load sections");
    } finally {
      setLoading(false);
    }
  };

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .single();

    setIsAdmin(!!data);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Olympiad registration promotional popup */}
      <Dialog open={showOlympiadPopup} onOpenChange={setShowOlympiadPopup}>
        <DialogContent className="w-[60vw] max-w-[95vw] sm:max-w-[60vw] md:max-w-[60vw] lg:max-w-[60vw] max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary mb-2">
              By<span className="text-red">IITians</span>
            </h2>
            <DialogTitle className="text-center text-xl font-bold">
              {isRegistrationClosed() ? "Registration Closed" : "Olympiad Registration Open!"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {isRegistrationClosed() ? 
                "Registration for the Olympiad Aptitude Test has closed. The deadline was 26 March." :
                "Join our Maths &amp; Science Olympiad for classes 7–11."
              }
            </DialogDescription>
            {!isRegistrationClosed() && (
              <div className="my-4">
                <p className="text-center text-xl sm:text-lg font-semibold text-red animate-pulse">
                  Registration fee ₹300
                </p>
                <p className="text-center text-sm sm:text-base font-medium text-amber-600 mt-2">
                  📅 Registration closes on 26 March
                </p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 my-4">
              <div className="text-center">
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-2 sm:p-4 rounded-xl border-2 border-yellow-300 shadow-lg">
                  <div className="relative">
                    <img
                      src={firstPrize}
                      alt="1st Prize Tablet"
                      className="mx-auto h-20 w-20 sm:h-32 sm:w-32 object-contain"
                    />
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs sm:text-sm font-bold rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                      1st
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm mt-1 sm:mt-2 font-semibold text-yellow-800">🏆 Tablet</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-2 sm:p-4 rounded-xl border-2 border-gray-300 shadow-lg">
                  <div className="relative">
                    <img
                      src={secondPrize}
                      alt="2nd Prize 27 inch LED Monitor"
                      className="mx-auto h-20 w-20 sm:h-32 sm:w-32 object-contain"
                    />
                    <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs sm:text-sm font-bold rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                      2nd
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm mt-1 sm:mt-2 font-semibold text-gray-800">🥈 27" LED Monitor</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-2 sm:p-4 rounded-xl border-2 border-orange-300 shadow-lg">
                  <div className="relative">
                    <img
                      src={thirdPrize}
                      alt="3rd Prize 22 inch LED Monitor"
                      className="mx-auto h-20 w-20 sm:h-32 sm:w-32 object-contain"
                    />
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs sm:text-sm font-bold rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                      3rd
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm mt-1 sm:mt-2 font-semibold text-orange-800">🥉 22" LED Monitor</p>
                </div>
              </div>
            </div>
            <DialogDescription className="text-center">
              {isRegistrationClosed() ? 
                "Thank you for your interest. Please contact us for future updates." :
                "Click below to register and secure your spot."
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center">
            {!isRegistrationClosed() ? (
              <Button
                asChild
                variant="destructive"
                className="rounded-full px-6 sm:px-8 py-2 sm:py-3 bg-red-600 hover:bg-red-700 text-white animate-[pulse_3s_infinite] transition-all duration-700 ease-in-out hover:animate-none"
              >
                <Link to="/olympiad-registration" onClick={() => setShowOlympiadPopup(false)}>
                  Register Now
                </Link>
              </Button>
            ) : (
              <Button
                onClick={() => setShowOlympiadPopup(false)}
                variant="outline"
                className="rounded-full px-6 sm:px-8 py-2 sm:py-3"
              >
                Close
              </Button>
            )}
          </DialogFooter>
          <DialogClose />
        </DialogContent>
      </Dialog>

      {/* Full-Width Header */}
      <div className="w-full bg-gradient-to-b from-primary/10 to-transparent py-12 sm:py-16 md:py-20">
        <div className="text-center space-y-6 px-4">
          <div className="mb-4">
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-tight">
              <span className="text-primary">By</span>
              <span className="text-red">IITians</span>
            </h2>
          </div>
          <div className="inline-block px-4 sm:px-6 py-2 bg-primary/10 rounded-full border-2 border-primary/20">
            <p className="text-sm sm:text-base md:text-lg font-semibold text-primary">
              For: IIT | NEET | CBSE | NTSE | Foundation | Class 8 to 12
            </p>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
            Always Build Concepts
          </h1>
          <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto font-medium">
            Access all your learning resources in one place. Select a category below to get started.
          </p>
          {isAdmin && (
            <Link to="/admin">
              <Button variant="outline" className="mt-4 border-2 border-accent hover:bg-accent hover:text-accent-foreground rounded-full px-6 py-2">
                <Settings className="mr-2 h-4 w-4" />
                Admin Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Content Grid Container */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 pb-12">
          {/* Olympiad Aptitude Test Registration Card - First */}
          <div onClick={() => !isRegistrationClosed() && setShowOlympiadPopup(true)} className="block group cursor-pointer">
            <Card className={`h-full transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02] border-4 border-primary/20 hover:border-primary rounded-3xl overflow-hidden bg-gradient-to-br from-card to-primary/5 ${isRegistrationClosed() ? 'opacity-60 cursor-not-allowed' : 'shadow-lg hover:shadow-2xl hover:shadow-primary/25'}`}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <GraduationCap className="h-10 w-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl font-bold text-primary group-hover:text-red transition-colors">
                  Olympiad Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <CardDescription className="text-base text-foreground/70 font-medium">
                  {isRegistrationClosed() ? 
                    "Registration Closed - Deadline was 26 March" : 
                    "Register for Olympiad Aptitude Test - Fee ₹300"
                  }
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* IIT/JEE & NEET Toppers Talks Card */}
          <div onClick={() => {/* TODO: Add video popup logic */}} className="block group cursor-pointer">
            <Card className="h-full transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02] border-4 border-primary/20 hover:border-primary rounded-3xl overflow-hidden bg-gradient-to-br from-card to-primary/5 shadow-lg hover:shadow-2xl hover:shadow-primary/25">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <PlayCircle className="h-10 w-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl font-bold text-primary group-hover:text-red transition-colors">
                  IIT/JEE & NEET Toppers Talks
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <CardDescription className="text-base text-foreground/70 font-medium">
                  📹 Video content coming soon - Learn from successful toppers' experiences
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {sections.map((section) => {
            // Comment out all cards except testSeries and Location & Centre
            const sectionTitle = section.title?.toLowerCase().trim();
            if (sectionTitle === "test series" || sectionTitle === "location & centre" || sectionTitle?.includes("location")) {
              return (
                <SectionCard
                  key={section.id}
                  id={section.id}
                  title={section.title}
                  description={section.description}
                  icon={section.icon}
                />
              );
            }
            // Commented out other cards
            // return (
            //   <SectionCard
            //     key={section.id}
            //     id={section.id}
            //     title={section.title}
            //     description={section.description}
            //     icon={section.icon}
            //   />
            // );
            return null;
          })}
          
          {/* New Information Brochure Card */}
          <SectionCard
            id="information-brochure"
            title="Information Brochure"
            description="View our information brochure"
            icon="FileText"
          />
        </div>

        <footer className="text-center text-sm text-foreground/60 mt-16 pb-8 space-y-4">
          <div className="inline-block bg-red/10 px-6 py-3 rounded-2xl border-2 border-red/20">
            <p className="text-red font-bold text-base">Contact us: 8447412646</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Our Centres</p>
            <p className="text-accent font-medium">Vasant Kunj • Mehrauli • Okhala</p>
          </div>
          <p className="text-xs pt-4 border-t border-primary/10">
            CORPORATE OFFICE: 41A/1, Kalu Sarai, New Delhi-110016
          </p>
          <div className="mt-6 flex flex-col items-center gap-4">
            {websiteUrl && (
              <div className="inline-block p-4 bg-white rounded-2xl border-4 border-primary/20 shadow-lg">
                <QRCodeSVG 
                  value={websiteUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
            )}
            <p className="text-primary font-medium">Scan QR code to access this dashboard anytime</p>
            {websiteUrl && (
              <p className="text-xs text-foreground/60 break-all max-w-xs">
                {websiteUrl}
              </p>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
