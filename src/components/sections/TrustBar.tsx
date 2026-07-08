"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  FileCheck2,
  Building2,
  Home,
  Landmark,
  MapPin,
} from "lucide-react";

const trustItems = [
  {
    icon: Clock3,
    text: "Same-Day Reports",
  },
  {
    icon: CheckCircle2,
    text: "Certified Engineers",
  },
  {
    icon: FileCheck2,
    text: "Detailed Photo Reports",
  },
  {
    icon: Home,
    text: "Apartment Inspections",
  },
  {
    icon: Building2,
    text: "Villa Inspections",
  },
  {
    icon: Landmark,
    text: "Commercial Inspections",
  },
  {
    icon: MapPin,
    text: "Hyderabad • Vijayawada • Vizag",
  },
];

export function TrustBar() {
  return (
    <section className="overflow-hidden border-y border-slate-200 bg-white">
      <div className="container-wide py-4">
                <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Trusted Property Inspection Specialists
        </p>

        <div className="relative overflow-hidden">
          <motion.div
            className="flex w-max items-center gap-10"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 28,
              ease: "linear",
            }}
          >
            {[...trustItems, ...trustItems].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="flex items-center gap-3 whitespace-nowrap"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                    <Icon className="h-4 w-4 text-orange-500" />
                  </span>

                  <span className="text-sm font-semibold text-slate-700">
                    {item.text}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
