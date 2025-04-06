"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import {
  Mic,
  MicOff,
  Loader2,
  Volume2,
  HelpCircle,
  Download,
} from "lucide-react";
import {
  generateInterviewQuestions,
  evaluateInterviewResponses,
  type InterviewFeedback,
  type InterviewQuestion,
  type InterviewSetup,
} from "@/lib/actions/mock-interview.action";
import { toast } from "sonner";
import { useSpeech } from "@/hooks/useSpeech";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useAuth } from "@/lib/contexts/auth-context";
import { getProfileById } from "@/lib/actions/profile.action";
import {
  generateMockInterviewPdf,
  MockInterviewPdfData,
} from "@/lib/utils/pdf-generator";

export default function MockInterviewPage() {
  const [step, setStep] = useState<"setup" | "interview" | "feedback">("setup");
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const { user } = useAuth();
  const [userName, setUserName] = useState<string>("");
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Speech synthesis
  const { isSupported, isSpeaking, speak, cancel } = useSpeech();

  // Speech recognition
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  } = useSpeechToText();

  // Setup form
  const setupForm = useForm<InterviewSetup>({
    defaultValues: {
      name: "",
      position: "",
      experience: "",
    },
  });

  // Stop speech when changing questions or steps
  useEffect(() => {
    if (isSpeaking) {
      cancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, step]);

  // Fetch user profile when component mounts
  useEffect(() => {
    async function fetchUserProfile() {
      if (user?.uid) {
        try {
          const { profile } = await getProfileById(user.uid);
          if (profile) {
            setUserName(profile.name || "");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    }

    fetchUserProfile();
  }, [user]);

  const readQuestion = () => {
    if (questions[currentQuestion]?.question) {
      speak(questions[currentQuestion].question);
    }
  };

  const startInterview = async (data: InterviewSetup) => {
    try {
      setIsProcessing(true);
      // Generate questions based on user details
      const generatedQuestions = await generateInterviewQuestions(data);

      setQuestions(generatedQuestions);
      setCurrentQuestion(0);
      setUserResponses([]);
      setStep("interview");
    } catch (error) {
      toast("Failed to generate interview questions. Please try again.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    if (isListening) {
      // Stop recording
      stopListening();
      setIsRecording(false);

      // Save transcript to responses
      setUserResponses([...userResponses, transcript]);

      // Move to next question or finish
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        finishInterview();
      }
    } else {
      // Stop any ongoing speech
      if (isSpeaking) {
        cancel();
      }

      // Start recording
      setIsRecording(true);
      startListening();
    }
  };

  const finishInterview = async () => {
    setIsProcessing(true);
    try {
      // Extract just the questions from the InterviewQuestion objects
      const questionTexts = questions.map((q) => q.question);

      const interviewFeedback = await evaluateInterviewResponses({
        ...setupForm.getValues(),
        questions: questionTexts,
        responses: userResponses.filter(Boolean),
      });

      setFeedback(interviewFeedback);
      setStep("feedback");
    } catch (error) {
      toast("Failed to evaluate your responses. Please try again.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const restartInterview = () => {
    setStep("setup");
    setCurrentQuestion(0);
    setUserResponses([]);
    setFeedback(null);
    setQuestions([]);
    setupForm.reset();
  };

  const exportToPdf = async () => {
    if (!feedback || !user) return;

    setIsExportingPdf(true);
    try {
      // Prepare data for PDF
      const pdfData: MockInterviewPdfData = {
        userInfo: {
          name: userName || user.displayName || "Anonymous User",
          email: user.email || "No email provided",
          userId: user.uid,
        },
        interviewData: {
          position: setupForm.getValues().position,
          experience: setupForm.getValues().experience,
          date: new Date(),
          overallScore: feedback.overallScore,
          strengths: feedback.strengths,
          improvements: feedback.improvements,
          responses: feedback.detailedFeedback.map((item, index) => ({
            question: item.question,
            response: userResponses[index] || "No response recorded",
            feedback: item.feedback,
          })),
        },
      };

      // Generate PDF
      const doc = generateMockInterviewPdf(pdfData);

      // Save the PDF
      const fileName = `mock-interview-results-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);

      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">AI Mock Interview</h1>

      {step === "setup" && (
        <Card>
          <CardHeader>
            <CardTitle>Interview Setup</CardTitle>
          </CardHeader>
          <Form {...setupForm}>
            <form onSubmit={setupForm.handleSubmit(startInterview)}>
              <CardContent className="space-y-4">
                <FormField
                  control={setupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={setupForm.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Frontend Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={setupForm.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0-1">0-1 years</SelectItem>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5-10">5-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  disabled={
                    !setupForm.formState.isValid ||
                    isProcessing ||
                    setupForm.formState.isSubmitting
                  }
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Preparing Interview...
                    </>
                  ) : (
                    "Start Interview"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}

      {step === "interview" && questions.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>
              Question {currentQuestion + 1} of {questions.length}
            </CardTitle>
            {isSupported && (
              <Button
                variant="ghost"
                size="icon"
                onClick={readQuestion}
                disabled={isSpeaking}
                title="Read question aloud"
              >
                <Volume2 className="h-5 w-5" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-md relative">
              <div className="flex items-start justify-between">
                <p className="font-medium pr-10">
                  {questions[currentQuestion].question}
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0"
                      >
                        <HelpCircle className="h-5 w-5 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{questions[currentQuestion].hint}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="border p-4 rounded-md">
              <div className="flex items-start justify-between mb-2">
                <Label>Hint:</Label>
              </div>
              <p className="text-sm text-muted-foreground italic">
                {questions[currentQuestion].hint}
              </p>
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
                  <p>{transcript || "Speak now..."}</p>
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
                disabled={!hasRecognitionSupport && !isRecording}
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

      {step === "feedback" && feedback && (
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Interview Feedback</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPdf}
              disabled={isExportingPdf || !user}
            >
              {isExportingPdf ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Export to PDF
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center mb-4">
              <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center">
                <span className="text-3xl font-bold">
                  {feedback.overallScore}/10
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Strengths</h3>
              <ul className="list-disc pl-5 space-y-1">
                {feedback.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Areas for Improvement
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {feedback.improvements.map((improvement, index) => (
                  <li key={index}>{improvement}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Detailed Response Analysis
              </h3>
              {feedback.detailedFeedback.map((item, index) => (
                <div key={index} className="mb-4 border rounded-md p-4">
                  <p className="font-medium mb-2">Q: {item.question}</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your Response:
                  </p>
                  <p className="text-sm mb-2">
                    {userResponses[index] || "No response recorded"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-1">
                    Feedback:
                  </p>
                  <p className="text-sm">{item.feedback}</p>
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
