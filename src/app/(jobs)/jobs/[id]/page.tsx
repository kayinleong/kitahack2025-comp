/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Building,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Globe,
} from "lucide-react";
import ApplicationForm from "@/components/applications/application-form";
import { getJobById } from "@/lib/actions/job.action";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function JobDetailsPage({ params }: { params: any }) {
  // Fetch job data from the server using the job ID
  const { job, error } = await getJobById((await params).id);

  // If job not found or error occurred, show 404 page
  if (!job || error) {
    notFound();
  }

  // Helper function to format salary range
  const formatSalary = (min: number, max: number) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

    return `${formatter.format(min)} - ${formatter.format(max)}`;
  };

  // Calculate "posted X days ago" or similar text
  const getPostedTime = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  // Get skills as an array for displaying badges
  const skills = Object.values(job.required_skills);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/jobs"
        className="flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded overflow-hidden bg-muted flex items-center justify-center">
                    <Image
                      src="/80x80.svg"
                      width={80}
                      height={80}
                      alt={job.company_name}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{job.title}</h1>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <Building className="h-4 w-4 mr-1" />
                      <span>{job.company_name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-6 mt-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{job.company_location}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>
                    {formatSalary(job.minimum_salary, job.maximum_salary)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>
                    {job.created_at
                      ? getPostedTime(job.created_at)
                      : "Recently"}
                  </span>
                </div>
                {job.is_remote && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>Remote</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {skills.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Tabs defaultValue="description" className="overflow-x-auto">
                <TabsList className="mb-4">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                  <TabsTrigger value="company">Company</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="space-y-4">
                  <div
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  ></div>
                </TabsContent>

                <TabsContent value="requirements" className="space-y-4">
                  <div
                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                  ></div>
                </TabsContent>

                <TabsContent value="benefits" className="space-y-4">
                  <div dangerouslySetInnerHTML={{ __html: job.benefits }}></div>
                </TabsContent>

                <TabsContent value="company" className="space-y-4">
                  <p>
                    {job.company_name} is located in {job.company_location}.
                    {job.is_remote
                      ? " This position allows for remote work."
                      : ""}
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Apply for this position</CardTitle>
            </CardHeader>
            <CardContent>
              <ApplicationForm jobId={(await params).id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
