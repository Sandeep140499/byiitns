import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Video, PlayCircle, Users, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VideoData {
  title: string;
  url: string;
  type: string;
  description: string;
}

export default function ToppersTalk() {
  const navigate = useNavigate();
  const [currentVideo, setCurrentVideo] = useState<VideoData>({
    title: "Student Success Story",
    url: "/assets/toopervideos/WhatsApp Video 2026-02-26 at 5.25.43 PM.mp4",
    type: "student",
    description: "Hear directly from our successful students about their journey and achievements at ByIITians."
  });

  // Toppers videos data
  const toppersVideos: VideoData[] = [
    {
      title: "Student Success Story",
      url: "/assets/toopervideos/WhatsApp Video 2026-02-26 at 5.25.43 PM.mp4",
      type: "student",
      description: "Hear directly from our successful students about their journey and achievements at ByIITians."
    },
    {
      title: "Father's Testimonial", 
      url: "/assets/toopervideos/WhatsApp Video 2026-02-26 at 5.26.15 PM.mp4",
      type: "father",
      description: "Parents share their experience and satisfaction with their children's progress at ByIITians."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Full-Width Header */}
      <div className="w-full bg-gradient-to-b from-primary/10 to-transparent py-6 sm:py-12 md:py-16 lg:py-20">
        <div className="text-center space-y-3 sm:space-y-4 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight">
            <span className="text-primary">By</span>
            <span className="text-red">IITians</span>
          </h2>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary">
            IIT JEE & NEET
          </h1>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-red">
            TOPPERS TALK
          </h1>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 sm:py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Introduction Card */}
          <Card className="border-2 sm:border-4 border-primary/20 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-card to-primary/5 shadow-lg">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-red shadow-lg">
                <Video className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <CardTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary px-2">
                Success Stories from Our Toppers
              </CardTitle>
              <CardDescription className="text-sm sm:text-base md:text-lg px-2">
                Watch authentic testimonials from our successful students and their proud families
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base text-foreground/70">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span>Real Students</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base text-foreground/70">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                  <span>Proven Results</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base text-foreground/70">
                  <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red" />
                  <span>HD Videos</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Selection Tabs */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center px-2">
            {toppersVideos.map((video, index) => (
              <Button
                key={index}
                onClick={() => setCurrentVideo(video)}
                variant={currentVideo.url === video.url ? "default" : "outline"}
                className={`rounded-xl px-3 sm:px-4 md:px-6 py-2 sm:py-3 font-medium transition-all text-sm sm:text-base ${
                  currentVideo.url === video.url
                    ? 'bg-primary text-white shadow-lg'
                    : 'border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/10'
                }`}
              >
                <Video className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                {video.title}
              </Button>
            ))}
          </div>

          {/* Video Player Section */}
          <Card className="border-2 sm:border-4 border-primary/20 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-card to-primary/5 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              {/* Video Player */}
              <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl mb-4 sm:mb-6">
                <video
                  key={currentVideo.url}
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[40vh] sm:max-h-[50vh] md:max-h-[60vh]"
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Crect fill='%23d32f2f' width='800' height='450'/%3E%3Ctext fill='white' font-family='Arial' font-size='24' font-weight='bold' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EByIITians Toppers Talk%3C/text%3E%3C/svg%3E"
                >
                  <source src={currentVideo.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video Information */}
              <div className="text-center space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary px-2">
                  {currentVideo.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-foreground/70 max-w-2xl mx-auto px-2">
                  {currentVideo.description}
                </p>
                
                {/* Video Type Badge */}
                <div className="flex justify-center">
                  <span className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium ${
                    currentVideo.type === 'student' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-red/10 text-red'
                  }`}>
                    <Video className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {currentVideo.type === 'student' ? 'Student Testimonial' : 'Parent Testimonial'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Future Videos Section */}
          <Card className="border border-dashed border-primary/30 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-card to-primary/5">
            <CardContent className="p-4 sm:p-6 text-center">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-primary mb-2 sm:mb-3">
                More Success Stories Coming Soon!
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-foreground/70 px-2">
                We regularly update this section with new testimonials from our achieving students and their families.
              </p>
              <div className="mt-3 sm:mt-4 flex justify-center gap-1 sm:gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Video className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
