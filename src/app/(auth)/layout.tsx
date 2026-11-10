import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center space-x-2.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-accent shadow-md">
            <GraduationCap className="h-7 w-7" />
          </div>
        </Link>
        <h2 className="mt-3 text-2xl font-extrabold text-slate-900 tracking-tight">
          Laxmi Competition Classes
        </h2>
        <p className="text-xs font-semibold text-accent uppercase tracking-wider mt-0.5">
          Sangrampur • Directed by Vishal Sir
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-5 sm:px-8 shadow-sm border border-slate-200 rounded-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
