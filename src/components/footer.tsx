import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mic, FileText, ArrowRight, History, Sparkles } from "lucide-react";
import ResumeAnalysisHistory from "@/components/resume-analysis/resume-analysis-history";

export default function AIToolkitPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header with decorative elements */}
      <div className="relative mb-16 text-center md:text-left">
        <div className="absolute top-0 right-0 w-20 h-20 bg-pink-100 rounded-full opacity-60 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-200 rounded-full opacity-40 -z-10"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      </div>
    </div>
  );
}
