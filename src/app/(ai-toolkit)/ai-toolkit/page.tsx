import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mic, FileText, ArrowRight } from "lucide-react";

export default function AIToolkitPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Career AI Toolkit</h1>
      <p className="text-muted-foreground mb-8">
        Leverage AI to improve your job search and career prospects
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Mic className="h-5 w-5 mr-2 text-primary" />
              AI Mock Interview
            </CardTitle>
            <CardDescription>
              Practice your interview skills with our AI interviewer
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
              <img
                src="/placeholder.svg?height=300&width=500"
                alt="AI Interview"
                className="object-cover rounded-md"
              />
            </div>
            <p className="mb-4">
              Our AI interviewer will ask you relevant questions based on your
              desired job position and experience level. Speak your answers and
              get real-time feedback to improve your interview skills.
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-1 text-sm text-muted-foreground">
              <li>Personalized questions based on job position</li>
              <li>Speech-to-text analysis of your responses</li>
              <li>Detailed feedback on your answers</li>
              <li>Practice as many times as you want</li>
            </ul>
            <Button asChild className="w-full">
              <Link
                href="/ai-toolkit/mock-interview"
                className="flex items-center justify-between"
              >
                Start Mock Interview <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Resume PDF Commentor
            </CardTitle>
            <CardDescription>
              Get AI feedback on your resume to stand out
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
              <img
                src="/placeholder.svg?height=300&width=500"
                alt="Resume Analysis"
                className="object-cover rounded-md"
              />
            </div>
            <p className="mb-4">
              Upload your resume in PDF format and our AI will analyze it,
              providing detailed feedback on areas for improvement to help you
              land more interviews.
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-1 text-sm text-muted-foreground">
              <li>Detailed analysis of your resume structure</li>
              <li>Suggestions for improving content and formatting</li>
              <li>Industry-specific recommendations</li>
              <li>Keyword optimization for ATS systems</li>
            </ul>
            <Button asChild className="w-full">
              <Link
                href="/ai-toolkit/resume-analyzer"
                className="flex items-center justify-between"
              >
                Analyze My Resume <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
