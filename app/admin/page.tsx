import Image from "next/image";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { getAdminSession } from "@/lib/security/admin";
import { siteConfig } from "@/src/config/site";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (await getAdminSession()) redirect("/admin/dashboard");
  return <main className="flex min-h-screen items-center justify-center bg-stone-100 px-5 py-12">
    <section className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-7 shadow-xl shadow-stone-900/5 sm:p-10">
      <Image src={siteConfig.logoPath} alt="" width={52} height={52} priority />
      <p className="eyebrow mt-7">Restricted access</p><h1 className="mt-2 font-serif text-3xl font-semibold">Admin sign in</h1><p className="mt-3 leading-7 text-stone-500">Manage private customer feedback for {siteConfig.restaurantName}.</p>
      <AdminLoginForm />
    </section>
  </main>;
}
