import { Logo } from "@/components/shared/logo";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
