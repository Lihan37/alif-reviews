"use client";

import { useActionState } from "react";
import { LoaderCircle, LockKeyhole } from "lucide-react";
import { adminLoginAction } from "@/app/actions/admin";

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(adminLoginAction, { ok: false, message: "" });
  return <form action={action} className="mt-8 space-y-5">
    <div><label className="label" htmlFor="phone">অ্যাডমিন ফোন নম্বর</label><input className="field" id="phone" name="phone" type="tel" autoComplete="username" required placeholder="+8801XXXXXXXXX" /></div>
    <div><label className="label" htmlFor="password">পাসওয়ার্ড বা পিন</label><input className="field" id="password" name="password" type="password" autoComplete="current-password" required /></div>
    {state.message && <div className="error-message" role="alert">{state.message}</div>}
    <button className="button-primary w-full" disabled={pending}>{pending ? <LoaderCircle className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />}{pending ? "লগইন হচ্ছে…" : "নিরাপদে লগইন করুন"}</button>
  </form>;
}
