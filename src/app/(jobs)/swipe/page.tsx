"use client";

import { useState, useRef } from "react";
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
} from "lucide-react";
import {
  motion,
  type PanInfo,
  useMotionValue,
  useTransform,
} from "framer-motion";

// Mock job data for swiping
const SWIPE_JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary: "$90,000 - $120,000",
    type: "Full-time",
    description:
      "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces using React and Next.js.",
    tags: ["React", "Next.js", "TypeScript"],
    remote: true,
  },
  {
    id: 2,
    title: "UX Designer",
    company: "DesignHub",
    location: "Remote",
    salary: "$80,000 - $110,000",
    type: "Full-time",
    description:
      "Join our design team to create beautiful and functional user interfaces for our products and clients.",
    tags: ["Figma", "UI/UX", "Prototyping"],
    remote: true,
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "AI Solutions",
    location: "Boston, MA",
    salary: "$100,000 - $140,000",
    type: "Full-time",
    description:
      "Looking for a data scientist to help us build machine learning models and analyze large datasets.",
    tags: ["Python", "Machine Learning", "SQL"],
    remote: false,
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Austin, TX",
    salary: "$110,000 - $150,000",
    type: "Full-time",
    description:
      "Join our DevOps team to build and maintain our cloud infrastructure and CI/CD pipelines.",
    tags: ["AWS", "Docker", "Kubernetes"],
    remote: true,
  },
  {
    id: 5,
    title: "Product Manager",
    company: "InnovateCo",
    location: "New York, NY",
    salary: "$120,000 - $160,000",
    type: "Full-time",
    description:
      "We're looking for a product manager to lead our product development process and work with cross-functional teams.",
    tags: ["Product Strategy", "Agile", "User Research"],
    remote: false,
  },
];

export default function JobSwipePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedJobs, setLikedJobs] = useState<number[]>([]);
  const [dislikedJobs, setDislikedJobs] = useState<number[]>([]);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const cardOpacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const likeOpacity = useTransform(x, [0, 100, 200], [0, 0.5, 1]);
  const dislikeOpacity = useTransform(x, [-200, -100, 0], [1, 0.5, 0]);

  const dragConstraintsRef = useRef(null);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > 100) {
      handleLike();
    } else if (info.offset.x < -100) {
      handleDislike();
    }
    x.set(0);
  };

  const handleLike = () => {
    if (currentIndex < SWIPE_JOBS.length) {
      setLikedJobs([...likedJobs, SWIPE_JOBS[currentIndex].id]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDislike = () => {
    if (currentIndex < SWIPE_JOBS.length) {
      setDislikedJobs([...dislikedJobs, SWIPE_JOBS[currentIndex].id]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentJob = SWIPE_JOBS[currentIndex];
  const isFinished = currentIndex >= SWIPE_JOBS.length;

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
                You&apos;ve liked {likedJobs.length} jobs and disliked{" "}
                {dislikedJobs.length} jobs.
              </p>
              <Button onClick={() => setCurrentIndex(0)}>Start Over</Button>
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
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
                    <span>{currentJob.company}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{currentJob.location}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{currentJob.salary}</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{currentJob.type}</span>
                    </div>
                  </div>

                  <p>{currentJob.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {currentJob.remote && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                      >
                        Remote
                      </Badge>
                    )}
                    {currentJob.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent pt-16 pb-4">
                  <div className="flex justify-between w-full">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full h-14 w-14 bg-white dark:bg-gray-800"
                      onClick={handleDislike}
                    >
                      <ThumbsDown className="h-6 w-6 text-red-500" />
                      <span className="sr-only">Dislike</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full h-14 w-14 bg-white dark:bg-gray-800"
                      onClick={handleLike}
                    >
                      <ThumbsUp className="h-6 w-6 text-green-500" />
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
              : `Showing job ${currentIndex + 1} of ${SWIPE_JOBS.length}`}
          </p>
        </div>
      </div>
    </div>
  );
}
