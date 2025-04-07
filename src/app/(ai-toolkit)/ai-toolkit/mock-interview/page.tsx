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
  Check,
  AlertCircle,
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
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header with decorative elements */}
        <div className="relative mb-16 text-center">
          <div className="absolute top-0 right-0 w-20 h-20 bg-pink-100 rounded-full opacity-60 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-200 rounded-full opacity-40 -z-10"></div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-sm font-medium mb-4">
            INTERVIEW TOOL
            <Mic className="h-4 w-4 ml-2 text-pink-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800 mb-4">
            AI <span className="text-pink-600">Mock Interview</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Practice your interviewing skills with our AI-powered mock interview
            system
          </p>
        </div>

        {step === "setup" && (
          <Card className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100 mb-8">
            <CardHeader className="bg-white border-b border-gray-100">
              <CardTitle className="text-slate-800">Interview Setup</CardTitle>
            </CardHeader>
            <Form {...setupForm}>
              <form onSubmit={setupForm.handleSubmit(startInterview)}>
                <CardContent className="space-y-4 pt-6">
                  <FormField
                    control={setupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-800">
                          Your Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            {...field}
                            className="border-gray-200 focus:border-pink-500"
                          />
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
                        <FormLabel className="text-slate-800">
                          Job Position
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Frontend Developer"
                            {...field}
                            className="border-gray-200 focus:border-pink-500"
                          />
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
                        <FormLabel className="text-slate-800">
                          Years of Experience
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-200 focus:border-pink-500">
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

                  <div className="text-sm text-slate-600 bg-gray-50 p-4 rounded-xl mt-4">
                    <p className="font-medium text-slate-800 mb-2">
                      This AI mock interview will:
                    </p>
                    <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                      <li className="flex items-center text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-pink-500 mr-2"></div>
                        Ask job-relevant questions
                      </li>
                      <li className="flex items-center text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-pink-500 mr-2"></div>
                        Record your responses
                      </li>
                      <li className="flex items-center text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-pink-500 mr-2"></div>
                        Provide detailed feedback
                      </li>
                      <li className="flex items-center text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-pink-500 mr-2"></div>
                        Suggest improvements
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={
                      !setupForm.formState.isValid ||
                      isProcessing ||
                      setupForm.formState.isSubmitting
                    }
                    className="w-full bg-pink-600 hover:bg-pink-700 py-6 rounded-xl"
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
          <Card className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100 mb-8">
            <CardHeader className="flex flex-row justify-between items-center bg-white border-b border-gray-100">
              <CardTitle className="text-slate-800">
                Question {currentQuestion + 1} of {questions.length}
              </CardTitle>
              {isSupported && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={readQuestion}
                  disabled={isSpeaking}
                  title="Read question aloud"
                  className="text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                >
                  <Volume2 className="h-5 w-5" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="bg-pink-50 p-4 rounded-xl relative">
                <div className="flex items-start justify-between">
                  <p className="font-medium pr-10 text-slate-800">
                    {questions[currentQuestion].question}
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0 text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                        >
                          <HelpCircle className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{questions[currentQuestion].hint}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              <div className="border border-gray-100 bg-gray-50 p-4 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <Label className="text-slate-800 font-semibold">Hint:</Label>
                </div>
                <p className="text-sm text-slate-600 italic">
                  {questions[currentQuestion].hint}
                </p>
              </div>

              <div className="border border-gray-100 rounded-xl p-4 min-h-[150px] relative">
                {isRecording ? (
                  <>
                    <div className="absolute top-2 right-2 flex items-center">
                      <div className="h-3 w-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-sm text-slate-500">
                        Recording...
                      </span>
                    </div>
                    <p className="text-slate-800">
                      {transcript || "Speak now..."}
                    </p>
                  </>
                ) : (
                  <p className="text-slate-500">
                    {transcript
                      ? transcript
                      : "Press the microphone button to start recording your answer..."}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isProcessing ? (
                <Button disabled className="w-full bg-gray-400 py-6 rounded-xl">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing Responses...
                </Button>
              ) : (
                <Button
                  onClick={toggleRecording}
                  className={`w-full py-6 rounded-xl ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-pink-600 hover:bg-pink-700"
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
          <Card className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100 mb-8">
            <CardHeader className="flex flex-row justify-between items-center bg-white border-b border-gray-100">
              <CardTitle className="text-slate-800">
                Interview Feedback
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToPdf}
                disabled={isExportingPdf || !user}
                className="border-gray-200 text-pink-600 hover:bg-gray-50"
              >
                {isExportingPdf ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export to PDF
              </Button>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex justify-center mb-4">
                <div className="h-32 w-32 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center">
                  <span className="text-3xl font-bold text-pink-600">
                    {feedback.overallScore}/10
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center text-slate-800">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Strengths
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center text-slate-800">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                  Areas for Improvement
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  {feedback.improvements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-slate-800">
                  Detailed Response Analysis
                </h3>
                {feedback.detailedFeedback.map((item, index) => (
                  <div
                    key={index}
                    className="mb-4 border border-gray-100 rounded-xl p-4 bg-gray-50"
                  >
                    <p className="font-medium mb-2 text-slate-800">
                      Q: {item.question}
                    </p>
                    <p className="text-sm text-slate-500 mb-2">
                      Your Response:
                    </p>
                    <p className="text-sm mb-2 text-slate-700">
                      {userResponses[index] || "No response recorded"}
                    </p>
                    <p className="text-sm text-slate-500 mb-1">Feedback:</p>
                    <p className="text-sm text-slate-700">{item.feedback}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={restartInterview}
                className="w-full bg-pink-600 hover:bg-pink-700 rounded-xl py-6"
              >
                Start New Interview
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
