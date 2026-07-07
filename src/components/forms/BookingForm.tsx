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

    if (status === "submitting") return;

    setStatus("submitting");

    // Store form reference BEFORE await
    const form = e.currentTarget;

    const formData = new FormData(form);

    formData.append("_subject", "New Home Inspection Booking");
    formData.append("website", "4 Home Inspections");
    formData.append("form_type", "Booking Form");
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

      console.log("Status:", response.status);
      console.log("OK:", response.ok);
         if (!response.ok) {
  throw new Error("Submission failed");
}

// Reset the form safely
form.reset();

// Show success message
setStatus("success");
    } catch (error) {
      console.error("Booking Form Error:", error);
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
          Booking Request Submitted Successfully!
        </h3>

        <p className="mt-3 text-slate-700">
          Thank you for choosing <strong>4 Home Inspections</strong>.
        </p>

        <p className="mt-2 text-slate-600">
          Our team has received your booking request and will contact you shortly
          to confirm your inspection schedule.
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
          Book Another Inspection
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" htmlFor="name" required>
          <Input
            id="name"
            name="name"
            required
            placeholder="Rohit Kumar"
            autoComplete="name"
          />
        </Field>

        <Field label="Mobile Number" htmlFor="phone" required>
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
        <Field label="Email Address" htmlFor="email" required>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="info@example.com"
            autoComplete="email"
          />
        </Field>

        <Field label="Inspection Service" htmlFor="service" required>
          <Select
            id="service"
            name="service"
            required
            defaultValue=""
          >
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
      </div>

      <Field label="Property Address" htmlFor="address" required>
        <Input
          id="address"
          name="address"
          required
          placeholder="Flat No.101, Kondapur, Hyderabad"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Preferred Date" htmlFor="date">
          <Input
            id="date"
            name="date"
            type="date"
          />
        </Field>

        <Field label="Preferred Time" htmlFor="time">
          <Select
            id="time"
            name="time"
            defaultValue=""
          >
            <option value="" disabled>
              Select Preferred Time
            </option>

            <option>Morning (8:00 AM - 12:00 PM)</option>
            <option>Afternoon (12:00 PM - 4:00 PM)</option>
            <option>Evening (4:00 PM - 7:00 PM)</option>
          </Select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
                <Field
          label="Approx. Built-up Area (Sq.ft)"
          htmlFor="sqft"
          hint="Helps us estimate inspection duration"
        >
          <Input
            id="sqft"
            name="sqft"
            type="number"
            placeholder="1500"
            min={0}
          />
        </Field>

        <Field label="Year of Construction" htmlFor="year">
          <Input
            id="year"
            name="year"
            type="number"
            placeholder="2024"
            min={1900}
            max={2100}
          />
        </Field>
      </div>

      <Field label="Additional Information" htmlFor="notes">
        <Textarea
          id="notes"
          name="notes"
          placeholder="Please mention any specific concerns, builder details, access instructions or additional services required."
        />
      </Field>

      {status === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">
            Unable to submit your request.
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
            Submitting Your Request...
          </>
        ) : (
          "Book My Home Inspection"
        )}
      </Button>

      <p className="text-center text-xs text-slate-500">
        By submitting this form, you agree to be contacted by
        <strong> 4 Home Inspections</strong> regarding your enquiry.
        Your information will remain confidential and will never be shared
        with third parties.
      </p>
    </form>
  );
}
