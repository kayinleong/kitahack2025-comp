"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Loader2, Check, AlertCircle } from "lucide-react";
import {
  analyzeResume,
  AnalysisResult,
} from "@/lib/actions/resume-analyzer.action";
import { toast } from "sonner";

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      setIsUploading(true);

      // Create FormData and append file
      const formData = new FormData();
      formData.append("resume", file);

      // Upload and start analysis
      setIsUploading(false);
      setIsAnalyzing(true);

      // Call server action to analyze resume
      const results = await analyzeResume(formData);

      setAnalysisResults(results);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast("There was an error analyzing your resume. Please try again.");
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalysisComplete(false);
    setAnalysisResults(null);
  };

  const getSectionScoreColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Resume PDF Analyzer</h1>

      {!analysisComplete ? (
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
              <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />

              {file ? (
                <div className="flex flex-col items-center">
                  <FileText className="h-16 w-16 text-primary mb-4" />
                  <p className="font-medium mb-1">{file.name}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button variant="outline" onClick={handleUploadClick}>
                    Choose a different file
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="font-medium mb-1">
                    Drag and drop your resume PDF
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  <Button variant="outline" onClick={handleUploadClick}>
                    Select PDF File
                  </Button>
                </div>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                Your resume will be analyzed by our AI to provide feedback on:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Content and formatting</li>
                <li>ATS compatibility</li>
                <li>Keyword optimization</li>
                <li>Strengths and areas for improvement</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleAnalyze}
              disabled={!file || isUploading || isAnalyzing}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                "Analyze Resume"
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Resume Analysis Results</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {analysisResults?.score}/100
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <p>{analysisResults?.summary}</p>
              </div>

              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="sections">Section Analysis</TabsTrigger>
                  <TabsTrigger value="keywords">Keyword Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      Strengths
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {analysisResults?.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                      Areas for Improvement
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {analysisResults?.improvements.map(
                        (improvement, index) => (
                          <li key={index}>{improvement}</li>
                        )
                      )}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="sections" className="space-y-4">
                  {analysisResults &&
                    Object.entries(analysisResults.sectionFeedback).map(
                      ([section, data]) => (
                        <div key={section} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold capitalize">
                              {section}
                            </h3>
                            <span
                              className={`font-bold ${getSectionScoreColor(
                                data.score
                              )}`}
                            >
                              {data.score}/100
                            </span>
                          </div>
                          <p className="text-sm">{data.feedback}</p>
                        </div>
                      )
                    )}
                </TabsContent>

                <TabsContent value="keywords" className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Keywords Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This section provides insights about keywords in your
                      resume based on the AI analysis.
                    </p>
                    <div className="p-4 bg-muted rounded-lg">
                      <p>
                        Based on your target role and industry, consider adding
                        more relevant keywords to improve ATS compatibility. See
                        your &quot;Areas for Improvement&quot; section for
                        specific guidance.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 w-full">
              <Button onClick={resetAnalysis} className="w-full">
                Analyze Another Resume
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
