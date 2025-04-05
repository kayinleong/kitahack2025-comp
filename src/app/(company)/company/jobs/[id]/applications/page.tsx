import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Mail } from "lucide-react";
import JobApplicationsList from "@/components/job-applications-list";
import { getJobById } from "@/lib/actions/job.action";
import { getJobApplications } from "@/lib/actions/application.action";
import { ApplicationStatus } from "@/lib/domains/applications.domain";
import { notFound } from "next/navigation";

export default async function JobApplicationsPage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch job data
  const { job, error: jobError } = await getJobById((await params).id);

  // If job not found, show 404
  if (!job || jobError) {
    notFound();
  }

  // Fetch applications for this job
  const { applications, error: applicationsError } = await getJobApplications(
    (
      await params
    ).id
  );

  if (applicationsError) {
    console.error("Error fetching applications:", applicationsError);
  }

  // Count applications by status
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(
    (app) => app.status === ApplicationStatus.PENDING
  ).length;
  const interviewApplications = applications.filter(
    (app) => app.status === ApplicationStatus.INTERVIEW
  ).length;
  const offerApplications = applications.filter(
    (app) => app.status === ApplicationStatus.OFFER
  ).length;
  const rejectedApplications = applications.filter(
    (app) => app.status === ApplicationStatus.REJECTED
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/company/jobs"
        className="flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Job Listings
      </Link>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-muted-foreground">{job.title}</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Email All
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Application Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">{totalApplications}</p>
              <p className="text-sm text-muted-foreground">
                Total Applications
              </p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">{pendingApplications}</p>
              <p className="text-sm text-muted-foreground">New</p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">{interviewApplications}</p>
              <p className="text-sm text-muted-foreground">Interview</p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">{offerApplications}</p>
              <p className="text-sm text-muted-foreground">Offer</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({totalApplications})</TabsTrigger>
          <TabsTrigger value="pending">New ({pendingApplications})</TabsTrigger>
          <TabsTrigger value="interview">
            Interview ({interviewApplications})
          </TabsTrigger>
          <TabsTrigger value="offer">Offer ({offerApplications})</TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedApplications})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <JobApplicationsList
            status="all"
            jobId={params.id}
            applications={applications}
          />
        </TabsContent>

        <TabsContent value="pending">
          <JobApplicationsList
            status={ApplicationStatus.PENDING}
            jobId={params.id}
            applications={applications.filter(
              (app) => app.status === ApplicationStatus.PENDING
            )}
          />
        </TabsContent>

        <TabsContent value="interview">
          <JobApplicationsList
            status={ApplicationStatus.INTERVIEW}
            jobId={params.id}
            applications={applications.filter(
              (app) => app.status === ApplicationStatus.INTERVIEW
            )}
          />
        </TabsContent>

        <TabsContent value="offer">
          <JobApplicationsList
            status={ApplicationStatus.OFFER}
            jobId={params.id}
            applications={applications.filter(
              (app) => app.status === ApplicationStatus.OFFER
            )}
          />
        </TabsContent>

        <TabsContent value="rejected">
          <JobApplicationsList
            status={ApplicationStatus.REJECTED}
            jobId={params.id}
            applications={applications.filter(
              (app) => app.status === ApplicationStatus.REJECTED
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
