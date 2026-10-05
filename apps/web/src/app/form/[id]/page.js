import { notFound } from "next/navigation";
import { prisma } from "@gform/database";
import { FormView } from "@/components/FormView";

export async function generateMetadata({ params }) {
  const form = await prisma.form.findUnique({
    where: { id: params.id },
    select: { title: true },
  });

  if (!form) return { title: "Form Not Found" };
  return { title: `${form.title} | GForm` };
}

export default async function FormPage({ params }) {
  const { id } = params;

  // 1. Fetch Form & Questions from the Database
  const form = await prisma.form.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  // 2. Security & Validation Checks
  if (!form) {
    notFound();
  }

  if (!form.isActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Form Closed</h1>
        <p className="text-on-surface-variant max-w-md">
          This form is no longer active and is not accepting new responses.
        </p>
      </div>
    );
  }

  // 3. Render the interactive Client Component
  return (
    <main className="flex-1 w-full py-8 bg-surface-bright/30">
      <FormView form={form} />
    </main>
  );
}
