'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-outline-variant/30 bg-surface-container-lowest py-8 w-full z-10">
      <div className="max-w-[1440px] mx-auto px-margin-page flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body-md text-body-md text-on-surface-variant">© 2026 SmartCampus Energy AI. All rights reserved.</p>
        <div className="flex space-x-6">
          <Link href="/recommendations" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">
            Sustainability Report
          </Link>
          <Link href="/dashboard" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="/dashboard" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
