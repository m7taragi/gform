import Link from "next/link";
import { prisma } from "@gform/database";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PlusCircle, FileText, Users, Link as LinkIcon, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | GForm",
};

export default async function AdminDashboard() {
  // 1. Basic Auth Check
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  // For MVP, we'll allow access if there's any session.
  // In a real app, verify the JWT/Session in the DB and check role === 'admin'
  if (!sessionCookie || !sessionCookie.value) {
    redirect("/login");
  }

  // 2. Fetch Forms with aggregate submission count
  const forms = await prisma.form.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { submissions: true, questions: true },
      },
    },
  });

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-on-surface-variant">Manage your forms and analyze responses.</p>
        </div>
        <Link
          href="/admin/form-builder"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-xl shadow-md hover:brightness-110 transition-all min-h-[48px]"
        >
          <PlusCircle size={20} />
          Create Form
        </Link>
      </header>

      {forms.length === 0 ? (
        <div className="bg-surface p-12 rounded-2xl border border-outline border-dashed text-center">
          <FileText size={48} className="mx-auto text-on-surface-variant mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">No Forms Yet</h2>
          <p className="text-on-surface-variant">You haven't created any forms. Get started by clicking the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div key={form.id} className="bg-surface p-6 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold line-clamp-2">{form.title}</h2>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full whitespace-nowrap ${form.isActive ? 'bg-[#e6f4ea] text-[#137333] dark:bg-[#137333]/20 dark:text-[#81c995]' : 'bg-surface-variant text-on-surface-variant'}`}>
                    {form.isActive ? 'Active' : 'Closed'}
                  </span>
                </div>
                {form.description && (
                  <p className="text-sm text-on-surface-variant line-clamp-2 mb-4">{form.description}</p>
                )}
                
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                    <FileText size={16} />
                    <span>{form._count.questions} Questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                    <Users size={16} />
                    <span>{form._count.submissions} Responses</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-outline flex items-center justify-between gap-2">
                <Link
                  href={`/admin/form/${form.id}/results`}
                  className="flex-1 text-center py-2 text-sm font-semibold text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  View Results
                </Link>
                <Link
                  href={`/form/${form.id}`}
                  target="_blank"
                  className="flex items-center justify-center p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="Open public form link"
                >
                  <ExternalLink size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
