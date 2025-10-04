
"use client";

import { LandingPage } from "@/components/landing/landing-page";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";


export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
       <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }
  
  // If user is logged in, router.replace will be called, in the meantime,
  // we can show a loader, or we can show the landing page briefly.
  // To avoid layout shift and content flash, it's better to show a loader.
  if (user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
       <Loader2 className="h-12 w-12 animate-spin text-primary" />
     </div>
   )
  }

  return <LandingPage />;
}
