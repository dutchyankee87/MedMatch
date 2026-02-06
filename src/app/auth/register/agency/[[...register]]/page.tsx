import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Users } from "lucide-react";

export default function RegisterAgencyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-lg">
              M
            </div>
            <span className="font-semibold text-2xl">MedMatch</span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-600">Uitzendbureau</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Registreer uw bureau</h1>
          <p className="text-gray-600 mt-2">
            Verbind uw kandidaten met zorginstellingen in heel Nederland
          </p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg",
            },
          }}
          unsafeMetadata={{
            role: "agency_user",
          }}
        />
        <p className="text-center text-sm text-gray-600 mt-6">
          Bent u een zorgorganisatie?{" "}
          <Link href="/register/organization" className="text-emerald-600 hover:underline font-medium">
            Registreer als organisatie
          </Link>
        </p>
      </div>
    </div>
  );
}
