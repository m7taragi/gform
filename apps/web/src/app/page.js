import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center p-8">
      <main className="max-w-3xl w-full flex flex-col items-center justify-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          GForm Form Platform
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl">
          Secure, compliant, and highly performant enterprise form engine.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold shadow-md hover:brightness-110 transition-all min-h-[48px]"
          >
            Go to Admin Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
