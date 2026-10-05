import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FormBuilder } from "@/components/FormBuilder";

export const metadata = {
  title: "Create Form | GForm",
};

export default async function FormBuilderPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  
  if (!sessionCookie || !sessionCookie.value) {
    redirect("/login");
  }

  return (
    <main className="flex-1 w-full py-8">
      <FormBuilder />
    </main>
  );
}
