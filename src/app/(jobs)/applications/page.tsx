import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import ApplicationStatusCard from "@/components/application-status-card";

// Mock application data
const applications = [
  {
    id: 1,
    jobTitle: "Frontend Developer",
    company: "TechCorp",
    appliedDate: "2023-04-01",
    status: "interview",
    statusHistory: [
      { status: "applied", date: "2023-04-01", note: "Application submitted" },
      {
        status: "screening",
        date: "2023-04-03",
        note: "Resume screening in progress",
      },
      {
        status: "interview",
        date: "2023-04-10",
        note: "Interview scheduled for April 15th",
      },
    ],
  },
  {
    id: 2,
    jobTitle: "UX Designer",
    company: "DesignHub",
    appliedDate: "2023-03-15",
    status: "rejected",
    statusHistory: [
      { status: "applied", date: "2023-03-15", note: "Application submitted" },
      {
        status: "screening",
        date: "2023-03-18",
        note: "Resume screening in progress",
      },
      {
        status: "rejected",
        date: "2023-03-25",
        note: "Thank you for your interest, but we've decided to move forward with other candidates.",
      },
    ],
  },
  {
    id: 3,
    jobTitle: "Product Manager",
    company: "InnovateCo",
    appliedDate: "2023-03-28",
    status: "offer",
    statusHistory: [
      { status: "applied", date: "2023-03-28", note: "Application submitted" },
      {
        status: "screening",
        date: "2023-03-30",
        note: "Resume screening in progress",
      },
      {
        status: "interview",
        date: "2023-04-05",
        note: "First interview completed",
      },
      {
        status: "interview",
        date: "2023-04-12",
        note: "Second interview with team lead",
      },
      {
        status: "offer",
        date: "2023-04-18",
        note: "Offer letter sent. Please review and respond by April 25th.",
      },
    ],
  },
  {
    id: 4,
    jobTitle: "Data Analyst",
    company: "DataCorp",
    appliedDate: "2023-04-05",
    status: "applied",
    statusHistory: [
      { status: "applied", date: "2023-04-05", note: "Application submitted" },
    ],
  },
];

export default function ApplicationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Applications</h1>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Suspense fallback={<ApplicationsSkeleton />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((application) => (
                <ApplicationStatusCard
                  key={application.id}
                  application={application}
                />
              ))}
            </div>
          </Suspense>
        </TabsContent>

        <TabsContent value="active">
          <Suspense fallback={<ApplicationsSkeleton />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications
                .filter((app) =>
                  ["applied", "screening", "interview"].includes(app.status)
                )
                .map((application) => (
                  <ApplicationStatusCard
                    key={application.id}
                    application={application}
                  />
                ))}
            </div>
          </Suspense>
        </TabsContent>

        <TabsContent value="interviews">
          <Suspense fallback={<ApplicationsSkeleton />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications
                .filter((app) => app.status === "interview")
                .map((application) => (
                  <ApplicationStatusCard
                    key={application.id}
                    application={application}
                  />
                ))}
            </div>
          </Suspense>
        </TabsContent>

        <TabsContent value="offers">
          <Suspense fallback={<ApplicationsSkeleton />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications
                .filter((app) => app.status === "offer")
                .map((application) => (
                  <ApplicationStatusCard
                    key={application.id}
                    application={application}
                  />
                ))}
            </div>
          </Suspense>
        </TabsContent>

        <TabsContent value="rejected">
          <Suspense fallback={<ApplicationsSkeleton />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications
                .filter((app) => app.status === "rejected")
                .map((application) => (
                  <ApplicationStatusCard
                    key={application.id}
                    application={application}
                  />
                ))}
            </div>
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ApplicationsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
