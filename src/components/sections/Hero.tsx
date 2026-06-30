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

      <div className="container-wide relative py-20 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-12">
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
              className="mt-6 text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl"
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
              <div className="rounded-3xl border border-white/10 bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-sage-100 text-sage-700">
                      <FileCheck2 className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-brand-900">
                        Inspection Report
                      </p>
                      <p className="text-xs text-slate-500">
                        1420 Maple Street
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-sage-700">
                    Ready
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    { label: "Roof & Exterior", status: "Good", good: true },
                    { label: "Electrical", status: "Good", good: true },
                    { label: "Plumbing", status: "1 minor item", good: false },
                    { label: "HVAC", status: "Good", good: true },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-brand-900">
                        {row.label}
                      </span>
                      <span
                        className={
                          row.good
                            ? "inline-flex items-center gap-1.5 text-xs font-semibold text-sage-600"
                            : "inline-flex items-center gap-1.5 text-xs font-semibold text-accent-600"
                        }
                      >
                        <span
                          className={
                            row.good
                              ? "h-2 w-2 rounded-full bg-sage-500"
                              : "h-2 w-2 rounded-full bg-accent-500"
                          }
                        />
                        {row.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-5 -top-14 hidden rounded-2xl bg-white p-4 shadow-card sm:block"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-100 text-accent-600">
                    <Clock3 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold leading-none text-brand-900">
                      24 hrs
                    </p>
                    <p className="text-xs text-slate-500">Report delivery</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-14 -right-5 hidden rounded-2xl bg-white p-4 shadow-card sm:block"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-700">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold leading-none text-brand-900">
                      Certified
                    </p>
                    <p className="text-xs text-slate-500">InterNACHI® &amp; ASHI</p>
                  </div>
                </div>
              </motion.div>
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
