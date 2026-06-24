/**
 * Lightweight className combiner. Filters out falsy values and joins the
 * rest with spaces. Avoids extra dependencies for a simple use case.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Format an ISO date string into a friendly long-form date. */
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
