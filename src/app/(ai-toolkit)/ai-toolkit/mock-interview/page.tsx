"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic, MicOff, Loader2 } from "lucide-react";

export default function MockInterviewPage() {
  const [step, setStep] = useState<"setup" | "interview" | "feedback">("setup");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [experience, setExperience] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock questions based on position
  const questions = [
    "Tell me about yourself and your experience in this field.",
    "Why are you interested in this position?",
    "Describe a challenging situation you faced at work and how you handled it.",
    "What are your greatest strengths and weaknesses?",
    "Where do you see yourself in 5 years?",
  ];

  // Mock feedback
  const mockFeedback = {
    strengths: [
      "Clear communication style",
      "Good examples from past experience",
      "Demonstrated problem-solving skills",
    ],
    improvements: [
      "Could provide more specific metrics and results",
      "Consider structuring answers using the STAR method",
      "Elaborate more on technical skills relevant to the position",
    ],
    overallScore: 8.2,
  };

  const startInterview = () => {
    if (!name || !position || !experience) return;
    setStep("interview");
    setCurrentQuestion(0);
    setUserResponses([]);
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      // In a real app, this would save the transcript
      setUserResponses([...userResponses, transcript]);
      setTranscript("");

      // Move to next question or finish
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setIsProcessing(true);
        // Simulate processing time
        setTimeout(() => {
          setIsProcessing(false);
          setStep("feedback");
        }, 3000);
      }
    } else {
      // Start recording
      setIsRecording(true);
      // In a real app, this would start speech recognition
      // For demo, we'll simulate with a timeout that adds text
      const demoText =
        "This is a simulated response for demonstration purposes. In a real implementation, this would be your actual spoken response transcribed using the Web Speech API.";
      setTranscript(demoText);
    }
  };

  const restartInterview = () => {
    setStep("setup");
    setCurrentQuestion(0);
    setUserResponses([]);
    setTranscript("");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">AI Mock Interview</h1>

      {step === "setup" && (
        <Card>
          <CardHeader>
            <CardTitle>Interview Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Job Position</Label>
              <Input
                id="position"
                placeholder="Frontend Developer"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger id="experience">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="1-3">1-3 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={startInterview}
              disabled={!name || !position || !experience}
              className="w-full"
            >
              Start Interview
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === "interview" && (
        <Card>
          <CardHeader>
            <CardTitle>
              Question {currentQuestion + 1} of {questions.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-md">
              <p className="font-medium">{questions[currentQuestion]}</p>
            </div>

            <div className="border rounded-md p-4 min-h-[150px] relative">
              {isRecording ? (
                <>
                  <div className="absolute top-2 right-2 flex items-center">
                    <div className="h-3 w-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">
                      Recording...
                    </span>
                  </div>
                  <p>{transcript}</p>
                </>
              ) : (
                <p className="text-muted-foreground">
                  {transcript
                    ? transcript
                    : "Press the microphone button to start recording your answer..."}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {isProcessing ? (
              <Button disabled className="w-full">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Responses...
              </Button>
            ) : (
              <Button
                onClick={toggleRecording}
                className={`w-full ${
                  isRecording ? "bg-red-500 hover:bg-red-600" : ""
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Start Recording
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      )}

      {step === "feedback" && (
        <Card>
          <CardHeader>
            <CardTitle>Interview Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center mb-4">
              <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center">
                <span className="text-3xl font-bold">
                  {mockFeedback.overallScore}/10
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Strengths</h3>
              <ul className="list-disc pl-5 space-y-1">
                {mockFeedback.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Areas for Improvement
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {mockFeedback.improvements.map((improvement, index) => (
                  <li key={index}>{improvement}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Detailed Response Analysis
              </h3>
              {questions.map((question, index) => (
                <div key={index} className="mb-4 border rounded-md p-4">
                  <p className="font-medium mb-2">Q: {question}</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your Response:
                  </p>
                  <p className="text-sm mb-2">
                    {userResponses[index] || "No response recorded"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-1">
                    Feedback:
                  </p>
                  <p className="text-sm">
                    {index === 0
                      ? "Good introduction, but could be more concise and focused on relevant experience."
                      : index === 1
                      ? "Strong answer showing genuine interest in the role. Consider researching more company-specific details."
                      : "Solid response with good examples. Try to quantify your impact more specifically."}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={restartInterview} className="w-full">
              Start New Interview
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
