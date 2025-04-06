"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, Briefcase, User, LogOut, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/contexts/auth-context";
import { getProfileById } from "@/lib/actions/profile.action";
import { toast } from "sonner";
import { Profile } from "@/lib/domains/profile.domain";

// Define navigation items based on user role
const publicNavigation = [
  { name: "Home", href: "/" },
  { name: "Jobs", href: "/jobs" },
  { name: "Job Swipe", href: "/swipe" },
  { name: "AI Toolkit", href: "/ai-toolkit" },
];

const guestNavigation = [
  ...publicNavigation,
  { name: "My Applications", href: "/applications" },
];

const companyNavigation = [
  { name: "Home", href: "/" },
  { name: "My Jobs", href: "/company/jobs" },
  { name: "Post Job", href: "/company/jobs/new" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const { user, isLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  // Function to fetch profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { profile: userProfile, error } = await getProfileById(userId);
      if (userProfile) {
        setProfile(userProfile);
      } else if (error) {
        console.error("Error fetching profile:", error);
      }
    } catch (error) {
      console.error("Exception fetching profile:", error);
    }
  };

  // Fetch user profile when user changes
  useEffect(() => {
    if (user) {
      fetchUserProfile(user.uid);
    } else {
      setProfile(null);
    }
  }, [user]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      toast("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast("Error logging out");
    }
  };

  // Determine which navigation items to show based on auth state and role
  const getNavigation = () => {
    if (!user) return publicNavigation;

    // Check user role from profile
    if (profile?.role === "COMPANY") {
      return companyNavigation;
    }

    // Default to guest navigation
    return guestNavigation;
  };

  const navigation = getNavigation();

  // Create user initials for avatar
  const getUserInitials = () => {
    if (profile?.name) {
      return profile.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return user?.email?.substring(0, 2).toUpperCase() || "U";
  };

  // Get display name
  const getDisplayName = () => {
    return profile?.name || "User";
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-3xl font-extrabold tracking-tighter text-red-600"
          >
            KL2<span className="text-pink-500">PEN</span>
          </Link>

          <nav className="hidden md:flex ml-10 space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-gray-600 hover:text-gray-900 font-medium ${
                  pathname === item.href ? "text-gray-900" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}

            {profile?.role === "COMPANY" && (
              <div className="relative group">
                <button className="flex items-center text-gray-600 hover:text-gray-900 font-medium">
                  Company <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md p-4 w-48 z-10">
                  <Link
                    href="/company/jobs"
                    className="block py-2 hover:text-primary"
                  >
                    My Jobs
                  </Link>
                  <Link
                    href="/company/jobs/new"
                    className="block py-2 hover:text-primary"
                  >
                    Post Job
                  </Link>
                </div>
              </div>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {!isLoading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.photoURL || ""}
                          alt={getDisplayName()}
                        />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {getDisplayName()}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                        {profile?.role === "COMPANY" && (
                          <p className="text-xs text-blue-500 font-medium mt-1">
                            Company Account
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    {profile?.role !== "COMPANY" && (
                      <DropdownMenuItem asChild>
                        <Link href="/applications">
                          <Briefcase className="mr-2 h-4 w-4" />
                          <span>My Applications</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    asChild
                    className="hidden md:inline-flex"
                  >
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-pink-600 hover:bg-pink-700 hidden md:inline-flex"
                  >
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block text-gray-600 hover:text-gray-900 font-medium py-2 ${
                  pathname === item.href ? "text-gray-900" : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {!isLoading && !user && (
              <div className="pt-4 border-t border-gray-200 mt-4 space-y-3">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button
                  asChild
                  className="w-full bg-pink-600 hover:bg-pink-700"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {!isLoading && user && (
              <div className="pt-4 border-t border-gray-200 mt-4 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.photoURL || ""}
                      alt={getDisplayName()}
                    />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{getDisplayName()}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>

                <Button asChild variant="outline" className="w-full">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>

                {profile?.role !== "COMPANY" && (
                  <Button asChild variant="outline" className="w-full">
                    <Link
                      href="/applications"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Briefcase className="mr-2 h-4 w-4" />
                      My Applications
                    </Link>
                  </Button>
                )}

                <Button
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
