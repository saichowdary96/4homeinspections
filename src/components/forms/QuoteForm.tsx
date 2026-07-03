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

    if (status === "submitting") return;

    setStatus("submitting");

    const formData = new FormData(e.currentTarget);

    formData.append("_subject", "New Quote Request");
    formData.append("website", "4 Home Inspections");
    formData.append("form_type", "Quote Form");
    formData.append(
      "submitted_at",
      new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    );

    try {
      const response = await fetch(
        "https://formspree.io/f/mjgdryqk",
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Submission failed");
      }
            e.currentTarget.reset();
      setStatus("success");
    } catch (error) {
      console.error("Quote Form Error:", error);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-green-600 text-white">
          <CheckCircle2 className="h-7 w-7" />
        </div>

        <h3 className="text-2xl font-bold text-green-800">
          Quote Request Submitted Successfully!
        </h3>

        <p className="mt-3 text-slate-700">
          Thank you for choosing <strong>4 Home Inspections</strong>.
        </p>

        <p className="mt-2 text-slate-600">
          Our team will review your requirements and send you a detailed quotation shortly.
        </p>

        <div className="mt-6 space-y-2 text-sm text-slate-700">
          <p>📞 +91 81216 60345</p>
          <p>📧 info.4constructions@gmail.com</p>
        </div>

        <Button
          className="mt-8"
          variant="outline"
          onClick={() => setStatus("idle")}
        >
          Request Another Quote
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full Name" htmlFor="q-name" required>
          <Input
            id="q-name"
            name="name"
            required
            placeholder="Rohit Kumar"
            autoComplete="name"
          />
        </Field>

        <Field label="Mobile Number" htmlFor="q-phone" required>
          <Input
            id="q-phone"
            name="phone"
            type="tel"
            required
            placeholder="+91 98765 43210"
            autoComplete="tel"
          />
        </Field>
      </div>

      <Field label="Email Address" htmlFor="q-email" required>
        <Input
          id="q-email"
          name="email"
          type="email"
          required
          placeholder="info@example.com"
          autoComplete="email"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Inspection Service" htmlFor="q-service" required>
          <Select id="q-service" name="service" required defaultValue="">
            <option value="" disabled>
              Select Inspection Service
            </option>

            {services.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Approx. Built-up Area (Sq.ft)" htmlFor="q-sqft">
                    <Input
            id="q-sqft"
            name="sqft"
            type="number"
            placeholder="1500"
            min={0}
          />
        </Field>
      </div>

      <Field label="Property Address" htmlFor="q-address" required>
        <Input
          id="q-address"
          name="address"
          required
          placeholder="Flat No.101, Kondapur, Hyderabad"
        />
      </Field>

      <Field label="Additional Details" htmlFor="q-notes">
        <Textarea
          id="q-notes"
          name="notes"
          placeholder="Please mention your inspection requirements, builder details, preferred inspection date or any additional services required."
        />
      </Field>

      {status === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">
            Unable to submit your quotation request.
          </p>

          <p className="mt-1 text-sm text-red-600">
            Please try again later or contact us directly at
            <strong> +91 81216 60345</strong>.
          </p>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={status === "submitting"}
      >
                {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending Quote Request...
          </>
        ) : (
          "Get My Free Quote"
        )}
      </Button>

      <p className="text-center text-xs text-slate-500">
        By submitting this quotation request, you agree to be contacted by
        <strong> 4 Home Inspections</strong> regarding your enquiry.
        Your personal information is kept confidential and is never shared
        with third parties.
      </p>
    </form>
  );
}
