import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
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
import { Settings, Trophy, Award, GraduationCap, PlayCircle, Users, Target, Star, MapPin, Navigation, Video } from "lucide-react";
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

  // Center locations with Google Maps URLs
  const centerLocations = [
    {
      name: "ByIITians MEHRAULI",
      address: "Mehrauli, New Delhi",
      mapUrl: "https://maps.app.goo.gl/Q9rWEneuXHkg47gy9?g_st=iw",
      navigationUrl: "https://maps.google.com/maps?q=ByIITians+MEHRAULI&nav=1"
    },
    {
      name: "ByIITians VASANT KUNJ", 
      address: "Vasant Kunj, New Delhi",
      mapUrl: "https://maps.app.goo.gl/6UV3E17ruEEFsg1q8?g_st=iw",
      navigationUrl: "https://maps.google.com/maps?q=ByIITians+VASANT+KUNJ&nav=1"
    },
    {
      name: "ByIITians OKHLA",
      address: "Okhla, New Delhi", 
      mapUrl: "https://maps.app.goo.gl/7H3kDanHGtpiCTjL9?g_st=iw",
      navigationUrl: "https://maps.google.com/maps?q=ByIITians+OKHLA&nav=1"
    }
  ];

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
      <div className="w-full bg-gradient-to-b from-primary/10 to-transparent py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="text-center space-y-4 sm:space-y-6 px-4">
          <div className="mb-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold tracking-tight">
              <span className="text-primary">By</span>
              <span className="text-red">IITians</span>
            </h2>
          </div>
          <div className="inline-block px-3 sm:px-4 md:px-6 py-2 bg-primary/10 rounded-full border-2 border-primary/20">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-primary">
              For: IIT | NEET | CBSE | NTSE | Foundation | Class 8 to 12
            </p>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary">
            Always Build Concepts
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-foreground/70 max-w-2xl mx-auto font-medium px-2">
            Access all your learning resources in one place. Select a category below to get started.
          </p>
          {isAdmin && (
            <Link to="/admin">
              <Button variant="outline" className="mt-4 border-2 border-accent hover:bg-accent hover:text-accent-foreground rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base">
                <Settings className="mr-2 h-4 w-4" />
                Admin Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Content Grid Container */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 pb-8 sm:pb-12">
          {/* Olympiad Aptitude Test Registration Card - First */}
          <div onClick={() => !isRegistrationClosed() && setShowOlympiadPopup(true)} className="block group cursor-pointer">
            <Card className={`h-full transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02] border-2 sm:border-4 border-primary/20 hover:border-primary rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-card to-primary/5 ${isRegistrationClosed() ? 'opacity-60 cursor-not-allowed' : 'shadow-lg hover:shadow-2xl hover:shadow-primary/25'}`}>
              <CardHeader className="text-center pb-2 sm:pb-4">
                <div className="mx-auto mb-2 sm:mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-primary group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-primary group-hover:text-red transition-colors px-2">
                  Olympiad Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-4 sm:pb-6">
                <CardDescription className="text-sm sm:text-base text-foreground/70 font-medium px-2">
                  {isRegistrationClosed() ? 
                    "Registration Closed - Deadline was 26 March" : 
                    "Register for Olympiad Aptitude Test - Fee ₹300"
                  }
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* IIT/JEE & NEET Toppers Talks Card */}
          <Link to="/toppers-talk" className="block group cursor-pointer">
            <Card className="h-full transition-all duration-300 hover:shadow-card-hover hover:scale-[1.02] border-2 sm:border-4 border-primary/20 hover:border-primary rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-card to-primary/5 shadow-lg hover:shadow-2xl hover:shadow-primary/25">
              <CardHeader className="text-center pb-2 sm:pb-4">
                <div className="mx-auto mb-2 sm:mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-primary group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <PlayCircle className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-primary group-hover:text-red transition-colors px-2">
                  IIT JEE & NEET
                </CardTitle>
                <CardTitle className="text-base sm:text-lg md:text-xl font-bold text-primary group-hover:text-red transition-colors px-2">
                  TOPPERS TALK
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-4 sm:pb-6">
                <CardDescription className="text-sm sm:text-base text-foreground/70 font-medium px-2">
                  🎥 Watch success stories from our toppers and their parents
                </CardDescription>
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-center gap-1 sm:gap-2 px-2">
                  <span className="inline-flex items-center justify-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    <Video className="h-3 w-3 mr-1" />
                    Student Story
                  </span>
                  <span className="inline-flex items-center justify-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-red/10 text-red">
                    <Video className="h-3 w-3 mr-1" />
                    Father's Testimonial
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>

          {sections.map((section) => {
            // Hide specific cards: study material, crash course, fee structure, doubt clearing
            const sectionTitle = section.title?.toLowerCase().trim();
            const hideCards = ['study material', 'crash course', 'fee structure', 'doubt clearing'];
            
            if (hideCards.some(hideCard => sectionTitle.includes(hideCard))) {
              return null;
            }
            
            return (
              <SectionCard
                key={section.id}
                id={section.id}
                title={section.title}
                description={section.description}
                icon={section.icon}
              />
            );
          })}
          
          {/* New Information Brochure Card */}
          <SectionCard
            id="information-brochure"
            title="Information Brochure"
            description="View our information brochure"
            icon="FileText"
          />
        </div>

        {/* Center Locations Section */}
        <div className="mt-12 sm:mt-16 mb-6 sm:mb-8">
          <div className="text-center mb-6 sm:mb-8 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-3 sm:mb-4">
              Our <span className="text-red">Centers</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-foreground/70 max-w-4xl mx-auto font-medium px-2">
              Visit our conveniently located centers across Delhi. Click to get directions and start navigation.
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-6xl w-full">
              {centerLocations.map((center, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-2 border-primary/20 hover:border-primary/40 rounded-2xl overflow-hidden bg-gradient-to-br from-card to-primary/5 h-full min-h-[250px] sm:min-h-[280px] md:min-h-[320px]">
                  <CardHeader className="text-center pb-3 sm:pb-4 flex flex-col justify-between h-full">
                    <div>
                      <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-red group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <MapPin className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                      </div>
                      <CardTitle className="text-sm sm:text-base lg:text-lg font-bold text-primary group-hover:text-red transition-colors px-2">
                        {center.name.split(' ')[1]}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm lg:text-base font-medium text-foreground/70 px-2">
                        {center.address}
                      </CardDescription>
                    </div>
                    <CardContent className="text-center space-y-2 sm:space-y-3 pb-4 sm:pb-6 p-0">
                      <div className="flex flex-col gap-2 justify-center px-2">
                        <a
                          href={center.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium text-xs sm:text-sm"
                        >
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="whitespace-nowrap">View Map</span>
                        </a>
                        <a
                          href={center.navigationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-red text-white rounded-xl hover:bg-red/90 transition-colors font-medium text-xs sm:text-sm"
                        >
                          <Navigation className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="whitespace-nowrap">Navigate</span>
                        </a>
                      </div>
                      <p className="text-xs text-foreground/60 px-2">
                        Click to navigate directly
                      </p>
                    </CardContent>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <footer className="text-center text-xs sm:text-sm text-foreground/60 mt-12 sm:mt-16 pb-6 sm:pb-8 space-y-3 sm:space-y-4 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="inline-block bg-red/10 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border-2 border-red/20">
            <p className="text-red font-bold text-sm sm:text-base">Contact us: 8447412646</p>
          </div>
          <div className="space-y-1 sm:space-y-2 px-4">
            <p className="font-semibold text-foreground text-sm sm:text-base">Our Centres</p>
            <p className="text-accent font-medium text-xs sm:text-sm">Vasant Kunj • Mehrauli • Okhala</p>
          </div>
          <p className="text-xs pt-2 sm:pt-4 border-t border-primary/10 px-4">
            CORPORATE OFFICE: 41A/1, Kalu Sarai, New Delhi-110016
          </p>
          <div className="mt-4 sm:mt-6 flex flex-col items-center gap-3 sm:gap-4 px-4">
            {websiteUrl && (
              <div className="inline-block p-3 sm:p-4 bg-white rounded-2xl border-2 sm:border-4 border-primary/20 shadow-lg">
                <QRCodeSVG 
                  value={websiteUrl}
                  size={150}
                  level="H"
                  includeMargin={true}
                />
              </div>
            )}
            <p className="text-primary font-medium text-xs sm:text-sm text-center px-2">Scan QR code to access this dashboard anytime</p>
            {websiteUrl && (
              <p className="text-xs text-foreground/60 break-all max-w-xs text-center px-2">
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
