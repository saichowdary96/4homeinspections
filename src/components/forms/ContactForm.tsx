"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Field, Input, Textarea } from "./FormControls";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

 async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setStatus("submitting");

  const formData = new FormData(e.currentTarget);

  formData.append("_subject", "New Home Inspection Contact Request");

  try {
    const response = await fetch("https://formspree.io/f/mjgdryqk", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      setStatus("success");
      e.currentTarget.reset();
    } else {
      setStatus("error");
    }
  } catch {
    setStatus("error");
  }
}

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-sage-200 bg-sage-50 p-8 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-sage-500 text-white">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-brand-900">Message sent!</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          Thanks for reaching out. We&rsquo;ll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="c-name" required>
          <Input id="c-name" name="name" required placeholder="Your name" autoComplete="name" />
        </Field>
        <Field label="Email" htmlFor="c-email" required>
          <Input id="c-email" name="email" type="email" required placeholder="you@email.com" autoComplete="email" />
        </Field>
      </div>
      <Field label="Phone" htmlFor="c-phone">
        <Input id="c-phone" name="phone" type="tel" placeholder="(555) 123-4567" autoComplete="tel" />
      </Field>
      <Field label="How can we help?" htmlFor="c-message" required>
        <Textarea id="c-message" name="message" required placeholder="Tell us a bit about what you need…" />
      </Field>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Something went wrong. Please try again or call us directly.
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
