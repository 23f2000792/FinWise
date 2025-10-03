import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12">
       <Button asChild variant="ghost" className="mb-4">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
      <PageHeader
        title="Privacy Policy"
        description="Last updated: July 30, 2024"
      />
      <div className="prose prose-lg mt-8 dark:prose-invert">
        <p>
          Welcome to FinWise. We are committed to protecting your privacy. This
          Privacy Policy explains how your personal information is collected,
          used, and disclosed by FinWise.
        </p>
        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us. For example, we
          collect information when you create an account, participate in any
          interactive features of our services, fill out a form, or otherwise
          communicate with us. The types of information we may collect include
          your name, email address, and any other information you choose to
          provide.
        </p>
        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve
          our services, such as to authenticate users, process transactions, and
          personalize the user experience.
        </p>
        <h2>3. Information Sharing</h2>
        <p>
          We do not share your personal information with third parties except as
          described in this Privacy Policy. We may share personal information
          with vendors, consultants, and other service providers who need access
          to such information to carry out work on our behalf.
        </p>
        <h2>4. Security</h2>
        <p>
          We take reasonable measures to help protect information about you from
          loss, theft, misuse and unauthorized access, disclosure, alteration,
          and destruction.
        </p>
        <h2>5. Changes to This Policy</h2>
        <p>
          We may change this Privacy Policy from time to time. If we make
          changes, we will notify you by revising the date at the top of the
          policy and, in some cases, we may provide you with additional notice.
        </p>
      </div>
    </div>
  );
}
