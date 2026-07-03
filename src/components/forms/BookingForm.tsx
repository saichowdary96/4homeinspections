"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Field, Input, Select, Textarea } from "./FormControls";
import { Button } from "@/components/ui/Button";
import { services } from "@/data/services";

type Status = "idle" | "submitting" | "success" | "error";

export function BookingForm() {
  const [status, setStatus] = useState<Status>("idle");

 async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setStatus("submitting");

  const formData = new FormData(e.currentTarget);

  formData.append("_subject", "New Home Inspection Booking");

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
        <h3 className="text-xl font-bold text-brand-900">Request received!</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          Thank you for choosing us. Our team will confirm your inspection
          appointment within a few business hours. Keep an eye on your inbox and
          phone.
        </p>
        <Button
          className="mt-6"
          variant="outline"
          onClick={() => setStatus("idle")}
        >
          Submit another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name" required>
          <Input id="name" name="name" required placeholder="Jane Doe" autoComplete="name" />
        </Field>
        <Field label="Phone" htmlFor="phone" required>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+91 98765 43210"
            autoComplete="tel"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" required>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="info@example.com"
            autoComplete="email"
          />
        </Field>
        <Field label="Service" htmlFor="service" required>
          <Select id="service" name="service" required defaultValue="">
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
      </div>

      <Field label="Property address" htmlFor="address" required>
        <Input
          id="address"
          name="address"
          required
          placeholder="Flat No. 101, Kondapur, Hyderabad"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Preferred date" htmlFor="date">
          <Input id="date" name="date" type="date" />
        </Field>
        <Field label="Preferred time" htmlFor="time">
          <Select id="time" name="time" defaultValue="">
            <option value="" disabled>
              Select a time
            </option>
            <option>Morning (8am – 12pm)</option>
            <option>Afternoon (12pm – 4pm)</option>
            <option>Late afternoon (4pm – 7pm)</option>
          </Select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Approx. square footage" htmlFor="sqft" hint="Helps us quote accurately">
          <Input id="sqft" name="sqft" type="number" placeholder="2,000" min={0} />
        </Field>
        <Field label="Year built" htmlFor="year">
          <Input id="year" name="year" type="number" placeholder="2005" min={1800} max={2100} />
        </Field>
      </div>

      <Field label="Anything else we should know?" htmlFor="notes">
        <Textarea
          id="notes"
          name="notes"
          placeholder="Add-ons (radon, thermal imaging), access details, agent contact, etc."
        />
      </Field>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Something went wrong. Please try again or call us directly.
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
          </>
        ) : (
          "Request My Inspection"
        )}
      </Button>
      <p className="text-center text-xs text-slate-400">
        By submitting, you agree to be contacted about your inspection request.
        We respect your privacy and never share your information.
      </p>
    </form>
  );
}
