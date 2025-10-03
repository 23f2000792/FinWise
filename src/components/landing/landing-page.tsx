"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart, DollarSign, Goal, Shield } from "lucide-react";
import Link from "next/link";
import { Logo } from "../shared/logo";
import { UserNav } from "../shared/user-nav";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";

export function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {!loading &&
              (user ? (
                <UserNav />
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </>
              ))}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-20 text-center md:py-32 lg:py-40">
           <div
            className="absolute inset-0 -z-10 bg-grid-slate-200/[0.04] bg-[length:1rem_1rem] [mask-image:radial-gradient(ellipse_50%_60%_at_50%_40%,#000_10%,transparent_100%)]"
          ></div>
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Take Control of Your Finances with FinWise
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                The smart, simple, and secure way to manage your money, track
                expenses, and achieve your financial goals.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-muted py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Features Designed for You
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
                FinWise provides all the tools you need to build a better financial future.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <DollarSign className="h-8 w-8 text-primary" />
                    Expense Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Easily log and categorize your expenses to see where your money goes.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BarChart className="h-8 w-8 text-primary" />
                    Insightful Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Visualize your spending habits with easy-to-understand charts and graphs.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Goal className="h-8 w-8 text-primary" />
                    Financial Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Set and track your financial goals, from saving for a vacation to a down payment.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-primary" />
                    Bank-Level Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your financial data is encrypted and protected with the highest security standards.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Visualize Your Path to Financial Freedom
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Our interactive dashboard gives you a complete overview of your financial health at a glance. Track your progress, identify trends, and make smarter decisions with your money.
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Comprehensive Dashboard</h3>
                      <p className="text-muted-foreground text-sm">All your financial data in one place.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">AI-Powered Insights</h3>
                      <p className="text-muted-foreground text-sm">Get personalized tips to improve your spending.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border shadow-lg overflow-hidden">
                <Image 
                  src="https://picsum.photos/seed/finwise-dashboard/800/600"
                  width={800}
                  height={600}
                  alt="FinWise Dashboard"
                  data-ai-hint="app dashboard"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-muted py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
                Start for free and upgrade when you're ready. No hidden fees.
              </p>
            </div>
            <div className="mx-auto grid max-w-md gap-8 lg:max-w-4xl lg:grid-cols-2">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <p className="text-4xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-5 w-5 text-primary" /> Basic expense tracking</li>
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-5 w-5 text-primary" /> 1 financial goal</li>
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-5 w-5 text-primary" /> Monthly reports</li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/signup">Start for Free</Link>
                  </Button>
                </div>
              </Card>
              <Card className="flex flex-col border-primary">
                 <div className="p-1 text-center text-sm text-primary-foreground bg-primary rounded-t-lg">Most Popular</div>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <p className="text-4xl font-bold">$9<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-5 w-5 text-primary" /> Advanced expense tracking</li>
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-5 w-5 text-primary" /> Unlimited financial goals</li>
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-5 w-5 text-primary" /> AI-powered insights</li>
                    <li className="flex items-center gap-3"><CheckCircleIcon className="h-5 w-5 text-primary" /> Priority support</li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button className="w-full" asChild>
                    <Link href="/signup">Go Pro</Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
          <div className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} FinWise. All rights reserved.
          </div>
          <div className="flex gap-4">
             <Link
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>
             <Link
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}


function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
