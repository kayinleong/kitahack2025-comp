import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Briefcase, Search, Zap } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Your Career Journey Starts Here
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              KL2PEN connects professionals with opportunities and provides
              AI-powered tools to advance your career.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/jobs">Find Jobs</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/swipe">Try Job Swipe</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <Image
              src="600x400.svg"
              width={600}
              height={400}
              alt="Professional networking"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Briefcase className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Job Management</CardTitle>
              <CardDescription>
                Search and apply for jobs. Track your applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Find your dream job with our comprehensive job search platform.
                Companies can post jobs and manage applications.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link
                  href="/jobs"
                  className="flex items-center justify-between"
                >
                  Explore Jobs <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Job Swipe</CardTitle>
              <CardDescription>
                Tinder-like job matching for quick applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Swipe right on jobs you like, left on those you don&apos;t. A
                fun and efficient way to find your next opportunity.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link
                  href="/swipe"
                  className="flex items-center justify-between"
                >
                  Start Swiping <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Search className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Career AI Toolkit</CardTitle>
              <CardDescription>
                AI-powered tools to boost your career.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Practice interviews with AI and get feedback on your resume to
                improve your chances of landing your dream job.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link
                  href="/ai-toolkit"
                  className="flex items-center justify-between"
                >
                  Try AI Tools <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
