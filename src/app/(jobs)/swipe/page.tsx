"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  MapPin,
  DollarSign,
  ThumbsUp,
  ThumbsDown,
  Briefcase,
  Loader2,
} from "lucide-react";
import {
  motion,
  type PanInfo,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useAuth } from "@/lib/contexts/auth-context";
import { useRouter } from "next/navigation";
import { listJobs } from "@/lib/actions/job.action";
import {
  likeJob,
  dislikeJob,
  getLikedJobs,
  getDislikedJobs,
  getUserSwipes,
} from "@/lib/actions/job-swipe.action";
import { Job, JobStatus } from "@/lib/domains/jobs.domain";
import { toast } from "sonner";

export default function JobSwipePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [displayJobs, setDisplayJobs] = useState<Job[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [swipeInProgress, setSwipeInProgress] = useState(false);
  const [likedJobIds, setLikedJobIds] = useState<string[]>([]);
  const [dislikedJobIds, setDislikedJobIds] = useState<string[]>([]);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const cardOpacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const likeOpacity = useTransform(x, [0, 100, 200], [0, 0.5, 1]);
  const dislikeOpacity = useTransform(x, [-200, -100, 0], [1, 0.5, 0]);

  const dragConstraintsRef = useRef(null);

  // Format salary for display
  const formatSalary = (min: number, max: number) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  };

  // Initialize user swipe data and fetch jobs
  const fetchJobsAndInitSwipes = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // First ensure the user has a swipe record
      await getUserSwipes(user.uid);

      // Then get user's liked and disliked jobs along with available jobs
      const [jobsResponse, likedResponse, dislikedResponse] = await Promise.all(
        [
          listJobs(100, JobStatus.OPEN),
          getLikedJobs(user.uid),
          getDislikedJobs(user.uid),
        ]
      );

      if (jobsResponse.error) {
        toast(jobsResponse.error);
        return;
      }

      // Store user preferences
      const likedIds = Object.values(likedResponse.jobIds);
      const dislikedIds = Object.values(dislikedResponse.jobIds);

      setLikedJobIds(likedIds);
      setDislikedJobIds(dislikedIds);

      // Filter out jobs the user has already interacted with
      const allJobIds = new Set([...likedIds, ...dislikedIds]);
      const filteredJobs = jobsResponse.jobs.filter(
        (job) => !allJobIds.has(job.id)
      );

      setDisplayJobs(filteredJobs);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error initializing job swipes:", error);
      toast("Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !user) {
      router.push("/login?redirect=" + encodeURIComponent("/swipe"));
      return;
    }

    if (user) {
      fetchJobsAndInitSwipes();
    }
  }, [user, authLoading, router, fetchJobsAndInitSwipes]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (swipeInProgress) return;

    if (info.offset.x > 100) {
      handleLike();
    } else if (info.offset.x < -100) {
      handleDislike();
    }
    x.set(0);
  };

  const handleLike = async () => {
    if (currentIndex >= displayJobs.length || swipeInProgress) return;

    const job = displayJobs[currentIndex];
    setSwipeInProgress(true);

    try {
      if (user) {
        const response = await likeJob(user.uid, job.id);
        if (!response.success) {
          toast(response.error || "Failed to save your preference");
        }
      }

      // Update local state
      setLikedJobIds((prev) => [...prev, job.id]);
      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error("Error liking job:", error);
      toast("Failed to save your preference");
    } finally {
      setSwipeInProgress(false);
    }
  };

  const handleDislike = async () => {
    if (currentIndex >= displayJobs.length || swipeInProgress) return;

    const job = displayJobs[currentIndex];
    setSwipeInProgress(true);

    try {
      if (user) {
        const response = await dislikeJob(user.uid, job.id);
        if (!response.success) {
          toast(response.error || "Failed to save your preference");
        }
      }

      // Update local state
      setDislikedJobIds((prev) => [...prev, job.id]);
      setCurrentIndex(currentIndex + 1);
    } catch (error) {
      console.error("Error disliking job:", error);
      toast("Failed to save your preference");
    } finally {
      setSwipeInProgress(false);
    }
  };

  const handleRefresh = () => {
    fetchJobsAndInitSwipes();
  };

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Job Swipe</h1>
        <div className="flex flex-col items-center justify-center h-[500px]">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Loading jobs...</p>
        </div>
      </div>
    );
  }

  // Empty state when no jobs are available
  if (displayJobs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Job Swipe</h1>
        <div className="flex flex-col items-center justify-center h-[500px] text-center">
          <h2 className="text-2xl font-bold mb-4">No more jobs to show!</h2>
          <p className="text-muted-foreground mb-6">
            You&apos;ve reviewed all available jobs.
          </p>
          <Button onClick={handleRefresh}>Refresh Jobs</Button>
        </div>
      </div>
    );
  }

  const currentJob = displayJobs[currentIndex];
  const isFinished = currentIndex >= displayJobs.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Job Swipe</h1>

      <div className="flex flex-col items-center justify-center">
        <div
          className="relative w-full max-w-md h-[500px] mx-auto"
          ref={dragConstraintsRef}
        >
          {isFinished ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h2 className="text-2xl font-bold mb-4">No more jobs to show!</h2>
              <p className="text-muted-foreground mb-6">
                You&apos;ve liked {likedJobIds.length} jobs and disliked{" "}
                {dislikedJobIds.length} jobs.
              </p>
              <Button onClick={handleRefresh}>Refresh Jobs</Button>
            </div>
          ) : (
            <motion.div
              className="absolute w-full h-full"
              drag="x"
              dragConstraints={dragConstraintsRef}
              onDragEnd={handleDragEnd}
              style={{ x, rotate, opacity: cardOpacity }}
              whileTap={{ cursor: "grabbing" }}
            >
              <Card className="w-full h-full overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <motion.div
                    className="bg-green-500 text-white text-2xl font-bold rounded-full p-6 rotate-12"
                    style={{ opacity: likeOpacity }}
                  >
                    LIKE
                  </motion.div>
                  <motion.div
                    className="bg-red-500 text-white text-2xl font-bold rounded-full p-6 -rotate-12"
                    style={{ opacity: dislikeOpacity }}
                  >
                    PASS
                  </motion.div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{currentJob.title}</CardTitle>
                  <div className="flex items-center text-muted-foreground">
                    <Building className="h-4 w-4 mr-1" />
                    <span>{currentJob.company_name}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 overflow-auto max-h-[300px]">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{currentJob.company_location}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>
                        {formatSalary(
                          currentJob.minimum_salary,
                          currentJob.maximum_salary
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{currentJob.type}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {currentJob.is_remote && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 hover:bg-green-200"
                      >
                        Remote
                      </Badge>
                    )}
                    {Object.values(currentJob.required_skills).map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-1">Description</h3>
                    <div className="text-sm max-h-[120px] overflow-auto pr-2">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: currentJob.description,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent pt-16 pb-4">
                  <div className="flex justify-between w-full">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full h-14 w-14 bg-white dark:bg-gray-800"
                      onClick={handleDislike}
                      disabled={swipeInProgress}
                    >
                      {swipeInProgress ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <ThumbsDown className="h-6 w-6 text-red-500" />
                      )}
                      <span className="sr-only">Dislike</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full h-14 w-14 bg-white dark:bg-gray-800"
                      onClick={handleLike}
                      disabled={swipeInProgress}
                    >
                      {swipeInProgress ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <ThumbsUp className="h-6 w-6 text-green-500" />
                      )}
                      <span className="sr-only">Like</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-2">
            Swipe right for jobs you like, left for those you don&apos;t
          </p>
          <p className="text-sm text-muted-foreground">
            {isFinished
              ? `You've viewed all available jobs`
              : `Showing job ${currentIndex + 1} of ${displayJobs.length}`}
          </p>
        </div>
      </div>
    </div>
  );
}
