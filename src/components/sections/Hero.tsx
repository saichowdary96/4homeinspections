"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Star,
  FileCheck2,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/site";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const quickPoints = [
  "Same-day digital reports",
  "Licensed & insured inspectors",
  "Free re-inspection consultations",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-950">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-950 to-brand-900" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:44px_44px] opacity-40" />
      <div className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-accent-500/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-brand-500/20 blur-3xl" />

  <div className="container-wide relative pt-4 pb-20 lg:pt-6 lg:pb-24">
        <div className="grid items-start gap-14 lg:grid-cols-12">
          {/* Copy */}
          <div className="lg:col-span-6">
            <motion.span
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-300 backdrop-blur"
            >
              <Star className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
             Professional Home & Building Inspections
            </motion.span>

            <motion.h1
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate="show"
             className="mt-2 text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl"
            >
            Know Your Property
<br />
<span className="text-gradient">Before You Buy</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="show"
              className="mt-6 max-w-xl text-lg leading-relaxed text-brand-100"
            >
              {siteConfig.name} delivers thorough, unbiased property inspections with detailed same-day reports, giving you complete confidence before buying, selling or taking possession of your property.
            </motion.p>

            <motion.ul
              variants={fadeUp}
              custom={3}
              initial="hidden"
              animate="show"
              className="mt-8 grid gap-3 sm:grid-cols-3"
            >
              {quickPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2 text-sm text-brand-100"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sage-400" />
                  {point}
                </li>
              ))}
            </motion.ul>

            <motion.div
              variants={fadeUp}
              custom={4}
              initial="hidden"
              animate="show"
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Button href="/book" size="lg">
                Book Your Inspection
              </Button>
              <Button href="/pricing" size="lg" variant="white">
                Get a Free Quote
              </Button>
            </motion.div>
          </div>

          {/* Visual */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Main report card */}
              <div className="rounded-[32px] overflow-hidden border border-slate-200 bg-white shadow-2xl">

  {/* Header */}

  <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6">

    <div className="flex items-center gap-4">

      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-orange-100">

        <FileCheck2 className="h-7 w-7 text-orange-500" />

      </div>

      <div>

        <h3 className="text-3xl font-bold text-slate-900">
          Inspection Report
        </h3>

        <p className="text-sm text-slate-500">
          Professional Property Inspection
        </p>

      </div>

    </div>

   <div className="flex items-center gap-3">

    <div className="rounded-xl bg-orange-50 px-4 py-2 shadow-md">
        <div className="flex items-center gap-2">
            <Clock3 className="h-5 w-5 text-orange-500" />
            <div>
                <p className="text-lg font-bold text-slate-900">
                    24 hrs
                </p>
                <p className="text-xs text-slate-500">
                    Report delivery
                </p>
            </div>
        </div>
    </div>

    <div className="rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-green-700">
        ✓ Report Ready
    </div>

</div>
    </div>
<div className="grid grid-cols-3 divide-x divide-slate-200">

  <div className="p-6">
    <p className="text-xs uppercase tracking-wide text-slate-500">
      Property
    </p>

    <h4 className="mt-2 text-lg font-bold text-slate-900">
      Apartment 1204
    </h4>

    <p className="text-sm text-slate-500">
      Hyderabad
    </p>
  </div>

  <div className="p-6">
    <p className="text-xs uppercase tracking-wide text-slate-500">
      Inspection Date
    </p>

    <h4 className="mt-2 text-lg font-bold text-slate-900">
      28 June 2026
    </h4>

    <p className="text-sm text-slate-500">
      10:30 AM
    </p>
  </div>

  <div className="p-6">
    <p className="text-xs uppercase tracking-wide text-slate-500">
      Inspector
    </p>

    <h4 className="mt-2 text-lg font-bold text-slate-900">
      Certified Engineer
    </h4>

    <p className="text-sm text-slate-500">
      License #HI-4587
    </p>
  </div>

</div>
<div className="grid grid-cols-2 gap-6 border-t border-slate-200 p-8">

  <div className="rounded-2xl border border-slate-200 p-6">

    <h4 className="text-xl font-bold text-slate-900">
      Inspection Summary
    </h4>

    <div className="mt-8 flex justify-center">
      <div className="flex h-44 w-44 items-center justify-center rounded-full border-[12px] border-green-500">

        <div className="text-center">
          <p className="text-5xl font-bold text-slate-900">
            96%
          </p>

          <p className="text-sm uppercase tracking-wide text-slate-500">
            Overall Score
          </p>
        </div>

      </div>
    </div>

    <div className="mt-8 rounded-xl bg-green-50 p-4 text-center">

      <p className="text-sm uppercase tracking-wide text-slate-500">
        Overall Condition
      </p>

      <p className="text-2xl font-bold text-green-700">
        Excellent
      </p>

    </div>

  </div>

  <div className="rounded-2xl border border-slate-200 p-6">

    <h4 className="text-xl font-bold text-slate-900">
      Inspection Checklist
    </h4>

    <div className="mt-6 space-y-5">

      <div className="flex justify-between"><span>Structure</span><span className="font-semibold text-green-600">Passed</span></div>

      <div className="flex justify-between"><span>Roof</span><span className="font-semibold text-green-600">Passed</span></div>

      <div className="flex justify-between"><span>Electrical</span><span className="font-semibold text-green-600">Passed</span></div>

      <div className="flex justify-between"><span>Plumbing</span><span className="font-semibold text-orange-500">Minor Issue</span></div>

      <div className="flex justify-between"><span>Bathrooms</span><span className="font-semibold text-green-600">Passed</span></div>

      <div className="flex justify-between"><span>Kitchen</span><span className="font-semibold text-green-600">Passed</span></div>

      <div className="flex justify-between"><span>Flooring</span><span className="font-semibold text-green-600">Passed</span></div>

      <div className="flex justify-between"><span>Doors & Windows</span><span className="font-semibold text-green-600">Passed</span></div>

    </div>

  </div>

</div>
<div className="border-t border-slate-200 bg-slate-50 px-8 py-5">
  <div className="flex items-center justify-between">

    <div>
      <h4 className="text-lg font-bold text-slate-900">
        Detailed Report with Photos & Recommendations
      </h4>

      <p className="text-sm text-slate-500">
        Available for download
      </p>
    </div>

    <button className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold hover:bg-white">
      View Sample Report
    </button>

  </div>
</div>
  </div>


              {/* Floating badges */}

              
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="relative">
        <svg
          className="block w-full"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="#ffffff"
            d="M0,48 C240,80 480,80 720,56 C960,32 1200,16 1440,40 L1440,80 L0,80 Z"
          />
        </svg>
      </div>
    </section>
  );
}
