import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@gform/database";
import { ArrowLeft, Users, Calendar } from "lucide-react";

export async function generateMetadata({ params }) {
  const form = await prisma.form.findUnique({
    where: { id: params.id },
    select: { title: true },
  });

  if (!form) return { title: "Results Not Found" };
  return { title: `${form.title} Results | GForm` };
}

export default async function FormResultsPage({ params }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  
  if (!sessionCookie || !sessionCookie.value) {
    redirect("/login");
  }

  const { id } = params;

  // 1. Fetch Form, Questions, and all Submissions with their Responses
  const form = await prisma.form.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { sortOrder: "asc" },
      },
      submissions: {
        include: {
          responses: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!form) {
    notFound();
  }

  const totalSubmissions = form.submissions.length;

  // 2. Pre-process Responses for easy rendering per Question
  // We want to group responses by Question ID
  const aggregatedData = {};
  form.questions.forEach((q) => {
    aggregatedData[q.id] = {
      question: q,
      responses: [],
    };
  });

  form.submissions.forEach((submission) => {
    submission.responses.forEach((response) => {
      if (aggregatedData[response.questionId]) {
        aggregatedData[response.questionId].responses.push({
          value: response.value,
          submittedAt: submission.createdAt,
          submissionId: submission.id,
        });
      }
    });
  });

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8">
      <header className="mb-8 border-b border-outline-variant pb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{form.title} Results</h1>
            <div className="flex items-center gap-4 text-sm text-on-surface-variant">
              <span className="flex items-center gap-1">
                <Users size={16} /> {totalSubmissions} Responses
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} /> Created {new Date(form.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {totalSubmissions === 0 ? (
        <div className="bg-surface p-12 rounded-2xl border border-outline border-dashed text-center">
          <h2 className="text-xl font-semibold mb-2">No Responses Yet</h2>
          <p className="text-on-surface-variant">
            Share the public link to start collecting data.
          </p>
          <div className="mt-6">
            <Link
              href={`/form/${form.id}`}
              target="_blank"
              className="inline-flex items-center px-4 py-2 bg-primary text-on-primary rounded-lg font-bold hover:brightness-110"
            >
              Open Public Link
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {form.questions.map((question, index) => {
            const data = aggregatedData[question.id];
            const answerCount = data.responses.filter(r => r.value).length;

            return (
              <section key={question.id} className="bg-surface p-6 rounded-2xl border border-outline-variant shadow-sm">
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block">
                    Question {index + 1}
                  </span>
                  <h3 className="text-xl font-bold">{question.questionText}</h3>
                  <p className="text-sm text-on-surface-variant mt-1">
                    {answerCount} {answerCount === 1 ? "response" : "responses"}
                  </p>
                </div>

                {/* Render Visualization based on DataType */}
                <div className="bg-surface-bright rounded-xl border border-outline p-4 max-h-96 overflow-y-auto">
                  {question.dataType === "boolean" ? (
                    <BooleanVisualization responses={data.responses} />
                  ) : question.dataType === "number" ? (
                    <ListVisualization responses={data.responses} suffix="" />
                  ) : (
                    <ListVisualization responses={data.responses} />
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}

// Helper Components for Visualizations

function BooleanVisualization({ responses }) {
  const trueCount = responses.filter((r) => r.value === "true").length;
  const falseCount = responses.filter((r) => r.value === "false").length;
  const total = trueCount + falseCount;

  if (total === 0) return <div className="text-on-surface-variant text-sm italic">No data</div>;

  const truePercent = Math.round((trueCount / total) * 100);
  const falsePercent = Math.round((falseCount / total) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-outline-variant">
        <span className="font-semibold">Yes</span>
        <div className="flex items-center gap-4">
          <div className="w-48 h-3 bg-surface-variant rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${truePercent}%` }} />
          </div>
          <span className="w-12 text-right text-sm font-bold">{truePercent}%</span>
          <span className="w-12 text-right text-sm text-on-surface-variant">({trueCount})</span>
        </div>
      </div>
      <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-outline-variant">
        <span className="font-semibold">No</span>
        <div className="flex items-center gap-4">
          <div className="w-48 h-3 bg-surface-variant rounded-full overflow-hidden">
            <div className="h-full bg-error" style={{ width: `${falsePercent}%` }} />
          </div>
          <span className="w-12 text-right text-sm font-bold">{falsePercent}%</span>
          <span className="w-12 text-right text-sm text-on-surface-variant">({falseCount})</span>
        </div>
      </div>
    </div>
  );
}

function ListVisualization({ responses, suffix = "" }) {
  const validResponses = responses.filter((r) => r.value && r.value.trim() !== "");

  if (validResponses.length === 0) {
    return <div className="text-on-surface-variant text-sm italic p-2">No answers provided.</div>;
  }

  return (
    <ul className="space-y-2">
      {validResponses.map((r, i) => (
        <li key={i} className="p-3 bg-surface rounded-lg border border-outline-variant text-sm flex justify-between gap-4">
          <span className="font-medium break-words">
            {r.value} {suffix}
          </span>
          <span className="text-xs text-on-surface-variant whitespace-nowrap shrink-0">
            {new Date(r.submittedAt).toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
  );
}
