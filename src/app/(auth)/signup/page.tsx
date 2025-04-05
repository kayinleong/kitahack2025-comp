import Link from "next/link";
import type { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SignupForm from "@/components/signup-form";

export const metadata: Metadata = {
  title: "Sign Up | KL2PEN",
  description: "Create a new KL2PEN account",
};

export default function SignupPage() {
  return (
    <div className="p-4 pt-10 lg:pt-0 container relative flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Briefcase className="h-6 w-6 mr-2" />
          <span>KL2PEN</span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &quot;I found my dream job through KL2PEN. The job swipe feature
              made it fun and easy to discover opportunities I wouldn&apos;t
              have found otherwise.&quot;
            </p>
            <footer className="text-sm">Alex Johnson</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your information to create a new account
            </p>
          </div>

          <SignupForm />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign in
            </Link>
          </p>

          <p className="px-8 text-center text-xs text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
