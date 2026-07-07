"use client";

import { MapPin, Rocket, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/site";

const currentCities = [
  {
    city: "Hyderabad",
    state: "Telangana",
  },
  {
    city: "Vijayawada",
    state: "Andhra Pradesh",
  },
  {
    city: "Visakhapatnam (Vizag)",
    state: "Andhra Pradesh",
  },
];

const upcomingCities = [
  {
    city: "Bengaluru",
    state: "Karnataka",
  },
  {
    city: "Chennai",
    state: "Tamil Nadu",
  },
];

export function ServiceAreasSection() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="container-wide">

        <Reveal className="mx-auto max-w-3xl text-center">

          <span className="inline-flex items-center rounded-full bg-accent-100 px-4 py-2 text-sm font-semibold text-accent-700">

            <MapPin className="mr-2 h-4 w-4" />

            SERVICE AREAS

          </span>

          <h2 className="mt-6 text-4xl font-extrabold text-brand-900">
                        Professional Home & Building Inspection
            Services Across South India
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            We currently provide professional home, apartment, villa and
            commercial building inspection services across major cities and
            are rapidly expanding our inspection network throughout South India.
          </p>

        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">

          <Reveal>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="rounded-full bg-green-100 p-3">

                  <MapPin className="h-6 w-6 text-green-600" />

                </div>

                <div>

                  <h3 className="text-2xl font-bold text-brand-900">
                    Currently Serving
                  </h3>

                  <p className="text-slate-500">
                    Book inspections in these cities today.
                  </p>

                </div>

              </div>

              <div className="mt-8 space-y-5">

                {currentCities.map((city) => (

                  <div
                    key={city.city}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5"
                  >
                                        <div>

                      <h4 className="text-lg font-semibold text-brand-900">
                        {city.city}
                      </h4>

                      <p className="text-sm text-slate-500">
                        {city.state}
                      </p>

                    </div>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      Available
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </Reveal>

          <Reveal delay={0.15}>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="rounded-full bg-orange-100 p-3">

                  <Rocket className="h-6 w-6 text-orange-600" />

                </div>

                <div>

                  <h3 className="text-2xl font-bold text-brand-900">
                    Expanding Soon
                  </h3>

                  <p className="text-slate-500">
                    Our next service locations.
                  </p>

                </div>

              </div>

              <div className="mt-8 space-y-5">

                {upcomingCities.map((city) => (
                        <div
                    key={city.city}
                    className="flex items-center justify-between rounded-2xl border border-orange-100 bg-orange-50 p-5"
                  >

                    <div>

                      <h4 className="text-lg font-semibold text-brand-900">
                        {city.city}
                      </h4>

                      <p className="text-sm text-slate-500">
                        {city.state}
                      </p>

                    </div>

                    <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                      Coming Soon
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </Reveal>

        </div>

        <Reveal delay={0.25}>

          <div className="mt-12 rounded-3xl bg-brand-900 p-10 text-center text-white">

            <h3 className="text-3xl font-bold">
              Need an inspection outside these cities?
            </h3>

            <p className="mx-auto mt-4 max-w-2xl text-brand-100">
              Our inspection network is expanding rapidly across South India.
              If your property is located outside our current service areas,
              contact us and we'll do our best to assist you.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Button href="/book" size="lg">
                Book Inspection
              </Button>

              <Button
                href={siteConfig.contact.phoneHref}
                size="lg"
                variant="white"
              >
                <Phone className="h-4 w-4" />
                {siteConfig.contact.phone}
              </Button>

            </div>

          </div>

        </Reveal>

      </div>

    </section>
  );
}
