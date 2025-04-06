import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Search,
  Zap,
  ChevronDown,
  Heart,
  X,
  Menu,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans pt-16">
      {/* Note: The Header component should be added in your layout.tsx, not here */}
      {/* The pt-16 class above creates space for the fixed header */}

      <main className="flex-grow">
        {/* Hero Section with Pink Gradient Background */}
        <section className="relative bg-gradient-to-br from-pink-100 via-pink-300 to-pink-500 overflow-hidden">
          {/* Background wave effect */}
          <div className="absolute inset-0 opacity-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              className="absolute bottom-0"
            >
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
          <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-800 leading-none text-center md:text-left">
                  Your Career's
                  <br />
                  <span className="inline-block bg-gray-200 px-2 py-1">
                    Second
                  </span>
                  <span className="inline-block bg-pink-500 text-white px-2 py-1 ml-2">
                    Chance.
                  </span>
                </h1>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-800 mt-4 text-center md:text-left">
                  Job Matching.
                </h2>
                <p className="mt-6 text-lg text-slate-700 max-w-xl text-center md:text-left mx-auto md:mx-0">
                  Perfect for graduates and career changers. Find your path
                  forward
                  <span className="italic font-medium">
                    {" "}
                    objectively with artificial intelligence.
                  </span>
                </p>
                <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                  <Button
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8"
                  >
                    <Link href="/signup">Sign up for free</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white/80 backdrop-blur-sm rounded-full px-8"
                  >
                    <Link href="/learn-more">Learn more</Link>
                  </Button>
                </div>
              </div>

              {/* Phone Mockup with Job Swipe */}
              <div className="relative flex justify-center">
                <div className="relative w-[280px] h-[560px] bg-white rounded-[36px] shadow-2xl border-4 border-gray-800 overflow-hidden">
                  {/* Phone Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>

                  {/* Phone Screen Content */}
                  <div className="relative h-full w-full bg-gray-50 pt-8 overflow-hidden">
                    {/* App Header */}
                    <div className="px-4 py-2 flex items-center justify-between bg-white shadow-sm">
                      <div className="text-lg font-bold text-red-600">
                        KL2PEN
                      </div>
                      <div className="text-sm text-gray-500">Job Swipe</div>
                    </div>

                    {/* Job Card */}
                    <div className="relative mx-4 mt-4 bg-white rounded-xl shadow-lg border border-gray-200 h-[320px] overflow-hidden">
                      <div className="h-32 bg-pink-500"></div>
                      <div className="absolute top-24 left-4 w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-white overflow-hidden">
                        <Briefcase className="h-8 w-8 text-pink-500" />
                      </div>
                      <div className="pt-10 px-4">
                        <h3 className="font-bold text-lg">
                          Entry-Level Marketing
                        </h3>
                        <p className="text-gray-600 text-sm">
                          GrowthBrand Inc.
                        </p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs mr-2">
                            Graduate-Friendly
                          </span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            $40K-55K
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-gray-600">
                          Perfect for recent graduates looking to start their
                          marketing career...
                        </p>
                      </div>
                    </div>

                    {/* Swipe Buttons */}
                    <div className="absolute bottom-20 left-0 right-0 flex justify-center space-x-8">
                      <button className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200">
                        <X className="h-8 w-8 text-red-500" />
                      </button>
                      <button className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200">
                        <Heart className="h-8 w-8 text-green-500" />
                      </button>
                    </div>

                    {/* Swipe Indicators */}
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
                      <div className="w-8 h-32 bg-red-500/10 rounded-r-full flex items-center justify-end pr-1">
                        <X className="h-6 w-6 text-red-500" />
                      </div>
                    </div>
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
                      <div className="w-8 h-32 bg-green-500/10 rounded-l-full flex items-center justify-start pl-1">
                        <Heart className="h-6 w-6 text-green-500" />
                      </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-4">
                      <div className="flex flex-col items-center">
                        <Briefcase className="h-6 w-6 text-red-600" />
                        <span className="text-xs mt-1">Jobs</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Zap className="h-6 w-6 text-gray-400" />
                        <span className="text-xs mt-1">Swipe</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Search className="h-6 w-6 text-gray-400" />
                        <span className="text-xs mt-1">Search</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated Swipe Effect */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px]">
                  <div className="absolute top-0 left-0 w-full h-full animate-pulse opacity-0">
                    <svg
                      viewBox="0 0 200 200"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full"
                    >
                      <path
                        fill="rgba(255,255,255,0.1)"
                        d="M45.7,-76.2C58.9,-69.2,69.2,-55.7,76.4,-41.1C83.7,-26.4,87.9,-10.7,85.9,4.1C83.9,18.9,75.7,32.8,65.8,44.9C55.9,57,44.3,67.4,30.9,73.4C17.5,79.5,2.2,81.2,-12.4,78.5C-27,75.8,-40.9,68.7,-52.5,58.5C-64.1,48.3,-73.3,35,-78.1,20.1C-82.9,5.2,-83.2,-11.2,-77.8,-25.2C-72.3,-39.2,-61.1,-50.7,-48,-59.2C-34.9,-67.7,-19.9,-73.2,-2.9,-69.2C14.1,-65.2,32.5,-83.2,45.7,-76.2Z"
                        transform="translate(100 100)"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Pink Theme */}
        <section className="py-20 bg-pink-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-16 gap-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-sm font-medium mx-auto md:mx-0">
                FEATURES
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-pink-900 text-center md:text-left">
                What We Do
              </h2>
              <Button
                asChild
                className="bg-pink-600 hover:bg-pink-700 text-white rounded-full w-full md:w-auto"
              >
                <Link
                  href="/learn-more"
                  className="flex items-center justify-center"
                >
                  LEARN MORE <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* First Card - User Profile and Career Swipe */}
              <div className="bg-white rounded-lg p-8 shadow-lg border border-pink-100 flex flex-col h-full">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-pink-900">
                  User Profile and Career Swipe Module
                </h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  Create a comprehensive profile showcasing your skills,
                  education, and career goals. Our innovative swipe interface
                  lets you quickly explore job opportunities while our AI
                  algorithms learn your preferences to deliver increasingly
                  personalized matches.
                </p>
                <Link
                  href="/swipe"
                  className="text-pink-600 hover:text-pink-700 flex items-center font-medium mt-auto"
                >
                  START SWIPING <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              {/* Second Card - Internship and Job Management */}
              <div className="bg-white rounded-lg p-8 shadow-lg border border-pink-100 flex flex-col h-full">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-6">
                  <Briefcase className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-pink-900">
                  Internship and Job Management
                </h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  Browse thousands of curated opportunities from entry-level
                  positions to specialized roles. Apply with a single click,
                  track application statuses in real-time, and receive timely
                  notifications about interviews, feedback, and important
                  updates.
                </p>
                <Link
                  href="/jobs"
                  className="text-pink-600 hover:text-pink-700 flex items-center font-medium mt-auto"
                >
                  EXPLORE JOBS <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              {/* Third Card - Career AI Toolkit */}
              <div className="bg-white rounded-lg p-8 shadow-lg border border-pink-100 flex flex-col h-full">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-6">
                  <Search className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-pink-900">
                  Career AI Toolkit
                </h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  Leverage cutting-edge AI to enhance your job search. Get
                  personalized resume feedback with industry-specific
                  optimization tips, practice interviews with our AI that
                  simulates real hiring scenarios, and access 24/7 career
                  guidance through our specialized chatbot assistant.
                </p>
                <Link
                  href="/ai-toolkit"
                  className="text-pink-600 hover:text-pink-700 flex items-center font-medium mt-auto"
                >
                  TRY AI TOOLS <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Job Categories */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-center mb-8">
              Popular Categories for Graduates
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Entry-Level",
                "Graduate Schemes",
                "Internships",
                "Career Change",
                "No Experience",
                "Training Programs",
                "Apprenticeships",
                "Remote",
              ].map((category) => (
                <Link
                  key={category}
                  href={`/jobs/${category.toLowerCase().replace(" ", "-")}`}
                  className="bg-gray-100 border border-gray-200 hover:border-pink-500 text-slate-700 px-6 py-3 rounded-full shadow-sm transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section with World Map Background */}
        <section className="py-20 bg-gray-100 relative overflow-hidden">
          {/* World Map Background */}
          <div className="absolute inset-0 opacity-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 650"
              className="w-full h-full"
              fill="currentColor"
              stroke="none"
            >
              <path d="M94.5,262.7c1.8,0.3,3.5,0.8,5.3,1c7.2,0.4,14.5,1.8,21.7,1c6.5-0.8,12.5-3.7,19-4.8c12.2-2,24.4-1.8,36.3,1.6 c5.8,1.6,11.7,3.9,16.8,7c5.4,3.3,10.1,7.6,15.2,11.4c0.2,0.2,0.4,0.3,0.6,0.4c8.1,5.6,16.2,11.1,25.3,14.9 c9.7,4.1,19.9,6.3,29.5,10.6c5.9,2.7,11.4,6.2,17.2,9.4c2.4,1.3,4.7,2.9,7.1,4.2c11.1,6.2,22.8,10.8,35.4,12.5 c14.3,1.9,28.7,2.4,42.9,4.9c14.5,2.6,29.3,4.3,43.7,7.5c4.2,0.9,8.3,2.4,12.5,3.5c4.8,1.3,9.6,2.5,14.4,3.7c4,1,8,1.8,12,2.8 c4.5,1.1,9,2.3,13.5,3.3c3.4,0.8,6.8,1.3,10.2,2.1c3.4,0.8,6.8,1.6,10.1,2.7c3.1,1,6.2,2.2,9.2,3.3c2.4,0.9,4.6,2.1,7.1,2.8 c3.1,0.8,6.4,1.1,9.5,1.7c3.1,0.6,6.2,1.4,9.2,2.3c4.1,1.2,8.1,2.4,12.2,3.7c3.3,1,6.5,2.1,9.8,3.1c3.5,1.1,7,2.2,10.5,3.3 c2.3,0.7,4.6,1.3,6.9,2c3.4,1,6.8,1.9,10.2,2.9c4.7,1.4,9.4,2.7,14.1,4.2c3.8,1.2,7.6,2.5,11.3,3.9c2.7,1,5.4,2.2,8.1,3.2 c6.5,2.3,13,4.5,19.5,6.8c4.9,1.7,9.9,3.3,14.8,5.1c4.3,1.6,8.5,3.3,12.7,5c2.5,1,5,2.1,7.6,3c2.2,0.8,4.6,1.2,6.8,1.9 c4.7,1.4,9.3,2.9,14,4.4c4.7,1.5,9.4,3,14.1,4.5c3.6,1.2,7.2,2.4,10.8,3.6c3.4,1.1,6.8,2.2,10.1,3.4c4.9,1.8,9.7,3.6,14.6,5.4 c1.9,0.7,4,1.3,5.9,2.1c4.2,1.8,8.3,3.8,12.5,5.6c4.1,1.8,8.3,3.4,12.5,5.1c5.7,2.3,11.3,4.6,17,6.8c0.7,0.3,1.6,0.3,2.1,0.7 c5.5,5.4,12.2,7.3,19.5,7.6c6.9,0.3,13.7,1.1,20.5,2.1c11.5,1.8,22.9,3.9,34.4,5.9c4.9,0.9,9.9,1.7,14.9,2.5 c0.5,0.1,1.2,0.2,1.5,0.5c1.9,1.8,3.7,3.7,5.6,5.5c1.9,1.8,4.3,3.3,5.6,5.4c1.4,2.2,1.9,5.1,2.1,7.7c0.4,4,0.6,8,0.6,12 c0,6.5-3.6,10.4-10,11.2c-3.8,0.5-7.6,0.8-11.5,1.1c-3.7,0.2-7.4,0.1-11.1,0.5c-8.9,1-17.8,2.1-26.7,3.3 c-14.5,1.9-29,3.8-43.4,6c-6.2,1-12.2,2.9-18.4,4.2c-6.5,1.4-13.1,2.5-19.6,3.9c-3.3,0.7-6.6,1.8-9.9,2.6c-4.9,1-9.9,1.7-14.8,2.8 c-3.8,0.9-7.5,2.3-11.3,3.2c-7.3,1.8-14.7,3.4-22.1,5.1c-3.8,0.9-7.5,1.8-11.3,2.8c-0.8,0.2-1.5,0.9-2.2,1.4 c0.8,0.5,1.5,1.2,2.3,1.5c2.7,1,5.4,1.9,8.1,2.9c2.5,0.9,4.9,1.9,7.4,2.8c0.7,0.3,1.4,0.4,2.1,0.3c3.3-0.2,6.6-0.5,9.9-0.8 c7.4-0.7,14.7-1.5,22.1-2.2c12.5-1.1,25-2.2,37.4-3.3c5.8-0.5,11.7-1.1,17.5-1.6c3.5-0.3,7-0.7,10.5-1c1.3-0.1,2.7-0.1,3.9,0.2 c3.2,0.9,6.3,2,9.5,3.1c5.4,1.9,10.7,3.8,16.1,5.8c5.3,1.9,10.6,3.8,15.9,5.8c1.9,0.7,3.7,1.8,5.6,2.5c2.7,1,5.5,1.9,8.3,2.8 c3.1,1,6.2,1.8,9.3,2.9c3.2,1,6.4,2.2,9.6,3.3c3.5,1.2,7,2.5,10.5,3.7c2.4,0.9,4.8,1.7,7.2,2.6c0.5,0.2,1.1,0.3,1.5,0.5 c2.1,1.4,4.3,2.8,6.5,4.3c0.1,0,0.2,0.2,0.2,0.3c0.8,11.5,1.8,23.1,2.2,34.6c0.5,11.5,0.7,23.1,0.4,34.6c-0.3,9.7-1.3,19.3-2.1,29 c-0.1,1.1-0.7,2.1-1.1,3.2c-0.4,0-0.9,0-1.3,0c-2.1-1.7-4.3-3.3-6.2-5.2c-4.3-4.3-8.5-8.7-12.8-13c-1.5-1.5-3.2-2.8-4.8-4.1 c-4.3-3.5-8.5-7.1-13-10.3c-4.8-3.5-9.9-6.5-14.9-9.7c-2.1-1.3-4.2-2.5-6.3-3.8c-7.4-4.5-14.8-9-22.2-13.4 c-8.9-5.4-18-10.5-26.8-16c-4.7-2.9-9.1-6.5-13.5-9.9c-5.3-4.2-10.8-8.3-15.7-13c-5.8-5.5-11.5-11.4-16.3-17.8 c-3-4-4.6-8.9-7-13.3c-1.8-3.3-3.9-6.4-6.1-9.3c-2.7-3.7-5.6-7.3-8.5-10.9c-1-1.2-2.1-2.4-3.3-3.5c-1.7-1.5-3.5-3-5.3-4.4 c-2.7-2.2-5.4-4.3-8.2-6.5c-4.3-3.3-8.7-6.5-13-9.8c-1.5-1.1-2.8-2.3-4.2-3.4c-3.2-2.4-6.4-4.9-9.6-7.2c-5.8-4.1-11.7-8.2-17.5-12.3 c-2.2-1.5-4.2-3.2-6.4-4.7c-4.2-2.9-8.4-5.7-12.6-8.5c-2.3-1.5-4.5-3.1-6.8-4.6c-2.5-1.7-5.1-3.3-7.7-5c-1.7-1.1-3.4-2.2-5.1-3.2 c-3.8-2.3-7.6-4.6-11.5-6.9c-4.2-2.5-8.5-5-12.7-7.5c-4-2.3-8-4.6-12-6.8c-1.8-1-3.6-1.9-5.4-2.8c-2.5-1.2-5-2.4-7.6-3.5 c-5.8-2.5-11.6-4.9-17.4-7.4c-3.5-1.5-7-2.9-10.4-4.4c-5.4-2.3-10.9-4.6-16.3-6.9c-10.8-4.5-21.6-9-32.5-13.4 c-6.5-2.6-12.9-5.1-19.5-7.5c-3.9-1.4-8-2.4-12-3.7c-2.8-0.9-5.6-1.9-8.3-2.9c-3.6-1.3-7.2-2.7-10.7-4.1c-4-1.6-8-3.2-11.9-4.8 c-3.3-1.4-6.6-2.7-9.9-4.1c-2.6-1.1-5.2-2.2-7.8-3.3c-2.2-0.9-4.3-1.9-6.5-2.8c-3.6-1.5-7.2-3-10.8-4.5c-3.6-1.5-7.2-3-10.8-4.5 c-4.9-2-9.8-4-14.8-6.1c-3.4-1.4-6.8-2.9-10.1-4.3c-5.6-2.4-11.3-4.8-16.9-7.1c-5.3-2.2-10.6-4.4-15.9-6.5c-4.5-1.8-9-3.7-13.6-5.5 c-5.3-2.1-10.6-4.2-15.9-6.2c-4.3-1.6-8.6-3.1-12.9-4.7c-3.9-1.4-7.8-2.9-11.7-4.2c-5.1-1.8-10.2-3.5-15.3-5.2 c-5.6-1.9-11.2-3.7-16.9-5.5c-3-1-6.1-1.7-9.1-2.8c-3.5-1.2-6.9-2.6-10.3-3.9c-2.7-1-5.3-2.2-8-3.2c-3.1-1.1-6.3-2.1-9.5-3.1 c-3.1-1-6.2-1.8-9.3-2.8c-2.3-0.7-4.6-1.6-6.9-2.5c-3.4-1.3-6.8-2.6-10.1-3.9c-2.5-1-5-2-7.5-3.1c-1.8-0.8-3.6-1.7-5.4-2.6 c-1.7-0.9-3.2-2-4.9-2.9c-4.4-2.1-9-4-13.5-6.2c-3.2-1.5-6.2-3.4-9.2-5.1c-2.6-1.4-5.3-2.9-7.8-4.5c-0.7-0.5-1.2-1.3-1.8-1.9 c0.3-0.5,0.4-1.2,0.9-1.5c4.1-2.5,8.2-4.8,12.4-7.1c4.2-2.3,8.4-4.6,12.7-6.8c6.3-3.2,12.6-6.2,18.9-9.4c3.5-1.8,7-3.6,10.4-5.5 c4.2-2.4,8.3-4.9,12.5-7.3c3-1.7,6.1-3.4,9.1-5.1c4.3-2.5,8.5-5,12.8-7.5c1.3-0.7,2.7-1.4,4-2.1c2.3-1.1,4.6-2.2,6.8-3.4 c1.6-0.9,3.1-1.9,4.6-2.9c1.5-1,2.9-2.1,4.4-3.1c2.5-1.7,5-3.4,7.5-5.1c3.6-2.4,7.2-4.8,10.8-7.2c3.6-2.3,7.2-4.6,10.9-6.9 c2.5-1.6,5.1-3.1,7.6-4.7c2.6-1.7,5.1-3.4,7.7-5.1c3.7-2.4,7.4-4.8,11.1-7.3c3.4-2.3,6.7-4.6,10.1-6.9c3.3-2.2,6.6-4.5,9.9-6.7 c4.5-3,9-6,13.5-9c3.7-2.5,7.5-5,11.2-7.5c3.3-2.2,6.6-4.4,9.9-6.6c2.2-1.5,4.5-3,6.7-4.5c2.7-1.9,5.4-3.8,8.1-5.7 c2.2-1.5,4.4-3,6.6-4.5c2.6-1.8,5.3-3.6,7.9-5.4c1.2-0.8,2.4-1.7,3.5-2.6c0.3-0.3,0.5-0.7,0.8-1c0.3,0.2,0.6,0.3,0.8,0.5 c2.3,2.2,4.6,4.5,6.9,6.7c1.1,1.1,2.3,2,3.4,3c2.1,1.8,4.1,3.6,6.1,5.4c1.6,1.4,3.2,2.8,4.8,4.2c2.2,1.9,4.4,3.8,6.6,5.8 c1.4,1.2,2.7,2.6,4.1,3.8c1.9,1.7,3.8,3.3,5.7,4.9c1.5,1.2,3.1,2.4,4.6,3.6c1.9,1.5,3.8,3,5.7,4.5c2.4,1.9,4.9,3.7,7.3,5.6 c1.6,1.2,3.1,2.4,4.6,3.7c2,1.6,3.9,3.2,5.9,4.8c1.8,1.5,3.5,3,5.3,4.5c1.5,1.3,3.1,2.5,4.6,3.8c1.5,1.2,2.9,2.6,4.4,3.9 c1.5,1.3,3,2.6,4.5,3.9c1.4,1.2,2.9,2.3,4.3,3.5c1.9,1.6,3.8,3.3,5.7,4.9c0.9,0.7,1.9,1.4,2.8,2.1C92.4,260.6,93.4,261.7,94.5,262.7z" />
            </svg>
          </div>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-6">
                Ready to start your career journey?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                From finding your perfect job match to landing interviews,
                KL2PEN's AI-powered platform helps you navigate your career path
                with confidence and ease.
              </p>
              <div className="flex justify-center">
                <Button
                  asChild
                  className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-8 py-4 text-lg"
                >
                  <Link
                    href="/signup"
                    className="flex items-center justify-center"
                  >
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Modern Dark Style */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          {/* Top Footer Section */}
          <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <Link
                href="/"
                className="text-3xl font-extrabold tracking-tighter text-white inline-flex items-center"
              >
                KL2<span className="text-pink-500">PEN</span>
              </Link>
              <p className="mt-4 text-gray-400 max-w-xs">
                Your career's second chance. We connect graduates and career
                changers with opportunities using AI-powered matching.
              </p>
              <div className="mt-6 flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">For Graduates</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/jobs/graduate"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Graduate Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/internships"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Internships
                  </Link>
                </li>
                <li>
                  <Link
                    href="/graduate-schemes"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Graduate Schemes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/career-advice/graduates"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Career Advice
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resume-builder"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Resume Builder
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                For Career Changers
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/career-change"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Career Change Paths
                  </Link>
                </li>
                <li>
                  <Link
                    href="/skill-assessment"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Skill Assessment
                  </Link>
                </li>
                <li>
                  <Link
                    href="/training-programs"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Training Programs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/success-stories"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Success Stories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />
                  <span className="text-gray-400">
                    123 Job Street, Career City, 10001
                  </span>
                </li>
                <li className="flex items-start">
                  <Mail className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />
                  <a
                    href="mailto:info@kl2pen.com"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    info@kl2pen.com
                  </a>
                </li>
                <li className="flex items-start">
                  <Phone className="h-5 w-5 text-pink-500 mr-3 mt-0.5" />
                  <a
                    href="tel:+1234567890"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    +1 (234) 567-890
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="py-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} KL2PEN. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
