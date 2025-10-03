import { cn } from "@/lib/utils";

export function Logo({ className, textClassName }: { className?: string, textClassName?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="rounded-lg bg-primary p-1.5 text-primary-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
      </div>
      <span className={cn("text-xl font-bold tracking-tight text-foreground", textClassName)}>
        FinWise
      </span>
    </div>
  );
}
