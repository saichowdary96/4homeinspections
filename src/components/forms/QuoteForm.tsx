"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Field, Input, Select, Textarea } from "./FormControls";
import { Button } from "@/components/ui/Button";
import { services } from "@/data/services";

type Status = "idle" | "submitting" | "success" | "error";

export function QuoteForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setStatus("submitting");

  const formData = new FormData(e.currentTarget);

  formData.append("_subject", "New Home Inspection Quote Request");

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
        <h3 className="text-xl font-bold text-brand-900">Quote on the way!</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          We&rsquo;ll review your details and send a personalized, no-obligation
          quote shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="q-name" required>
          <Input id="q-name" name="name" required placeholder="Your name" autoComplete="name" />
        </Field>
        <Field label="Phone" htmlFor="q-phone" required>
          <Input id="q-phone" name="phone" type="tel" required placeholder="+91 98765 43210" autoComplete="tel" />
        </Field>
      </div>
      <Field label="Email" htmlFor="q-email" required>
        <Input id="q-email" name="email" type="email" required placeholder="you@email.com" autoComplete="email" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Service needed" htmlFor="q-service" required>
          <Select id="q-service" name="service" required defaultValue="">
            <option value="" disabled>
              Select a service
            </option>
            {services.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Square footage" htmlFor="q-sqft">
          <Input id="q-sqft" name="sqft" type="number" placeholder="2,000" min={0} />
        </Field>
      </div>
      <Field label="Property address" htmlFor="q-address">
        <Input id="q-address" name="address" placeholder="Flat/Villa No, Area, Hyderabad" />
      </Field>
      <Field label="Additional details" htmlFor="q-notes">
        <Textarea id="q-notes" name="notes" placeholder="Add-ons, timing, or anything else…" />
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
          "Get My Free Quote"
        )}
      </Button>
    </form>
  );
}
