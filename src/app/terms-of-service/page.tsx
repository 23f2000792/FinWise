import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-3xl py-12">
        <Button asChild variant="ghost" className="mb-4">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
      <PageHeader
        title="Terms of Service"
        description="Last updated: July 30, 2024"
      />
      <div className="prose prose-lg mt-8 dark:prose-invert">
        <p>
          Please read these Terms of Service carefully before using the FinWise
          application.
        </p>
        <h2>1. Agreement to Terms</h2>
        <p>
          By using our Service, you agree to be bound by these Terms. If you
          disagree with any part of the terms, then you do not have permission
          to access the Service.
        </p>
        <h2>2. Accounts</h2>
        <p>
          When you create an account with us, you guarantee that you are above
          the age of 18, and that the information you provide us is accurate,
          complete, and current at all times.
        </p>
        <h2>3. Content</h2>
        <p>
          Our Service allows you to post, link, store, share and otherwise make
          available certain information, text, graphics, or other material. You
          are responsible for the Content that you post on or through the
          Service, including its legality, reliability, and appropriateness.
        </p>
        <h2>4. Termination</h2>
        <p>
          We may terminate or suspend your account and bar access to the Service
          immediately, without prior notice or liability, under our sole
          discretion, for any reason whatsoever and without limitation,
          including but not limited to a breach of the Terms.
        </p>
        <h2>5. Changes</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time. We will provide at least 30 days' notice
          prior to any new terms taking effect.
        </p>
      </div>
    </div>
  );
}
