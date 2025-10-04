"use client";

import { Logo } from "@/components/shared/logo";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace('/dashboard');
        }
    }, [user, loading, router]);

    if (loading || user) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:block">
        <Image
          src="https://picsum.photos/seed/finwise-auth/1200/1800"
          alt="FinWise App"
          width={1200}
          height={1800}
          className="h-full w-full object-cover"
          data-ai-hint="finance abstract"
        />
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
