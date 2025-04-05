"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Application,
  ApplicationStatus,
} from "@/lib/domains/applications.domain";
import { FileText, MoreVertical, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { updateApplicationStatus } from "@/lib/actions/application.action";

interface JobApplicationsListProps {
  status: string | ApplicationStatus;
  jobId: string;
  applications: Application[];
}

export default function JobApplicationsList({
  jobId,
  applications,
}: JobApplicationsListProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState<ApplicationStatus | null>(null);

  // Function to get color based on application status
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return "bg-blue-100 text-blue-800";
      case ApplicationStatus.INTERVIEW:
        return "bg-yellow-100 text-yellow-800";
      case ApplicationStatus.OFFER:
        return "bg-green-100 text-green-800";
      case ApplicationStatus.REJECTED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  // Function to handle status change
  const handleChangeStatus = async (
    application: Application,
    status: ApplicationStatus
  ) => {
    setIsUpdating(application.id);

    try {
      await updateApplicationStatus(application.id, status);
      // This is a client component - we'd need to refresh the data
      // For now we'll just alert the user
      alert(`Status updated to ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(null);
      setOpenDialog(false);
    }
  };

  // Function to confirm status change
  const confirmStatusChange = (
    application: Application,
    status: ApplicationStatus
  ) => {
    setSelectedApplication(application);
    setNewStatus(status);
    setOpenDialog(true);
  };

  if (applications.length === 0) {
    return (
      <div className="bg-muted rounded-md p-8 text-center">
        <p className="text-muted-foreground">No applications found.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      <User size={18} />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {application.user_id.substring(0, 10)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {application.phone_number}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{application.year_of_experience} years</TableCell>
              <TableCell>
                {application.created_at
                  ? formatDate(application.created_at)
                  : "Recently"}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={getStatusColor(application.status)}
                >
                  {application.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={application.resume_path} target="_blank">
                      <FileText className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={isUpdating === application.id}
                      >
                        {isUpdating === application.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <MoreVertical className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/company/jobs/${jobId}/applications/${application.id}`}
                        >
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={
                          application.status === ApplicationStatus.PENDING
                        }
                        onClick={() =>
                          confirmStatusChange(
                            application,
                            ApplicationStatus.PENDING
                          )
                        }
                      >
                        Mark as New
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={
                          application.status === ApplicationStatus.INTERVIEW
                        }
                        onClick={() =>
                          confirmStatusChange(
                            application,
                            ApplicationStatus.INTERVIEW
                          )
                        }
                      >
                        Move to Interview
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={
                          application.status === ApplicationStatus.OFFER
                        }
                        onClick={() =>
                          confirmStatusChange(
                            application,
                            ApplicationStatus.OFFER
                          )
                        }
                      >
                        Send Offer
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={
                          application.status === ApplicationStatus.REJECTED
                        }
                        onClick={() =>
                          confirmStatusChange(
                            application,
                            ApplicationStatus.REJECTED
                          )
                        }
                        className="text-red-600"
                      >
                        Reject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status of this application to{" "}
              <strong>{newStatus}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedApplication && newStatus) {
                  handleChangeStatus(selectedApplication, newStatus);
                }
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
