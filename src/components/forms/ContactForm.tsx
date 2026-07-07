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

    if (status === "submitting") return;

    setStatus("submitting");

   const form = e.currentTarget;
const formData = new FormData(form);

    formData.append("_subject", "New Contact Enquiry");
    formData.append("website", "4 Home Inspections");
    formData.append("form_type", "Contact Form");
    formData.append(
      "submitted_at",
      new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    );

    try {
      const response = await fetch(
        "https://formspree.io/f/maqgkanb",
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
           form.reset();
      setStatus("success");
    } catch (error) {
      console.error("Contact Form Error:", error);
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
          Message Sent Successfully!
        </h3>

        <p className="mt-3 text-slate-700">
          Thank you for contacting <strong>4 Home Inspections</strong>.
        </p>

        <p className="mt-2 text-slate-600">
          One of our team members will get back to you as soon as possible.
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
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full Name" htmlFor="c-name" required>
          <Input
            id="c-name"
            name="name"
            required
            placeholder="Rohit Kumar"
            autoComplete="name"
          />
        </Field>

        <Field label="Email Address" htmlFor="c-email" required>
          <Input
            id="c-email"
            name="email"
            type="email"
            required
            placeholder="info@example.com"
            autoComplete="email"
          />
        </Field>
      </div>

      <Field label="Mobile Number" htmlFor="c-phone" required>
        <Input
          id="c-phone"
          name="phone"
          type="tel"
          required
          placeholder="+91 98765 43210"
          autoComplete="tel"
        />
      </Field>

      <Field
        label="How can we help you?"
        htmlFor="c-message"
        required
      >
        <Textarea
          id="c-message"
          name="message"
          required
          placeholder="Please tell us about your inspection requirements, property details or any questions you have."
        />
      </Field>

      {status === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm font-medium text-red-700">
            Unable to send your message.
          </p>

          <p className="mt-1 text-sm text-red-600">
            Please try again in a few minutes or contact us directly at
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
            Sending Message...
          </>
        ) : (
          "Send Message"
        )}
      </Button>

      <p className="text-center text-xs text-slate-500">
        By submitting this form, you agree to be contacted by
        <strong> 4 Home Inspections</strong> regarding your enquiry.
        Your information is kept confidential and will never be shared with
        third parties.
      </p>
    </form>
  );
}
