# HomeGuard Inspections — Premium Home Inspection Website

A modern, responsive, production-ready website for a home inspection business,
built with **Next.js 14**, **TypeScript**, **Tailwind CSS** and **Framer
Motion**. It is configured for **static export**, so it runs anywhere — from
your local machine to GoDaddy shared hosting — with no server required.

> Replace the placeholder brand "HomeGuard Inspections" and all sample content
> with your own. Almost everything is driven from a few simple data files (see
> [Customization](#-customization)).

---

## ✨ Features

- **Fully responsive** design (mobile, tablet, desktop) with a premium UI/UX
- **Smooth animations** via Framer Motion, with full `prefers-reduced-motion` support
- **Accessible**: semantic HTML, skip link, focus styles, keyboard-friendly nav, ARIA labels
- **SEO-ready**: per-page metadata, Open Graph, JSON-LD structured data (LocalBusiness + FAQ), auto-generated `sitemap.xml` and `robots.txt`
- **Complete page set**: Home, About, Services + detail pages, Inspector, Service Areas, Reviews, FAQ, Blog + posts, Booking, Pricing/Quote, Contact (with map), Privacy, Terms, custom 404
- **Reusable, modular components** and a centralized design system
- **Static export** → drop the `out/` folder onto any host

---

## 🧱 Tech Stack

| Concern        | Choice                              |
| -------------- | ----------------------------------- |
| Framework      | Next.js 14 (App Router)             |
| Language       | TypeScript                          |
| Styling        | Tailwind CSS (custom design tokens) |
| Animation      | Framer Motion                       |
| Icons          | lucide-react                        |
| Fonts          | Inter + Poppins (`next/font`)       |
| Deployment     | Static HTML export                  |

---

## 🚀 Local Development

**Prerequisites:** Node.js 18.18+ (Node 20+ recommended) and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open **http://localhost:3000** in your browser. Edits hot-reload automatically.

> **macOS note:** If you ever see `EMFILE: too many open files` watcher
> warnings, raise your shell's file-descriptor limit before running dev:
> ```bash
> ulimit -n 10240 && npm run dev
> ```
> These are non-fatal warnings (the site still runs); they only affect the
> file watcher used for hot-reload.

---

## 📦 Build & Preview the Static Site

```bash
# Build the optimized static export into the `out/` folder
npm run build

# Preview the exported static site locally
npm run serve:static
```

After `npm run build`, the entire website is generated as plain HTML/CSS/JS in
the **`out/`** directory — exactly what you upload to a static host.

---

## 🌐 Deploying to GoDaddy (or any shared host)

This site exports to static files, so deployment is just an upload:

1. Run `npm run build`. This creates the **`out/`** folder.
2. Log in to your GoDaddy hosting **cPanel** and open the **File Manager**
   (or connect via FTP/SFTP using an app like FileZilla).
3. Navigate to your web root — usually **`public_html`**.
4. Upload **everything inside `out/`** (not the folder itself) into
   `public_html`. Make sure the hidden **`.htaccess`** file is included — it
   enables the custom 404 page, gzip compression and caching.
5. Visit your domain. That's it — your site is live.

**Updating the site:** make your changes, run `npm run build` again, and
re-upload the contents of `out/`.

> **Tip:** A bundled `public/.htaccess` adds a custom 404, compression,
> caching, HTTPS-redirect (commented out until your SSL is active) and security
> headers. Uncomment the HTTPS block once your certificate is installed.

Other zero-config static hosts also work great: **Netlify**, **Vercel**,
**Cloudflare Pages**, **GitHub Pages**, or any **S3 + CloudFront** bucket.

---

## 🎨 Customization

Everything you'll commonly change lives in **`src/data/`**:

| File                     | What it controls                                        |
| ------------------------ | ------------------------------------------------------- |
| `src/data/site.ts`       | Business name, tagline, phone, email, address, hours, social links, stats, certifications, navigation |
| `src/data/services.ts`   | Your services (each one auto-generates a detail page)   |
| `src/data/testimonials.ts` | Customer reviews                                      |
| `src/data/faqs.ts`       | FAQ questions & answers                                 |
| `src/data/serviceAreas.ts` | Regions & cities you serve (multi-location ready)     |
| `src/data/blog.ts`       | Blog/resource posts (each auto-generates a post page)   |
| `src/data/process.ts`    | "How it works" steps and "Why choose us" benefits       |

**Branding & colors:** edit the `brand`, `accent` and `sage` color scales in
`tailwind.config.ts`. The logo is an inline SVG in `src/components/ui/Logo.tsx`
— swap it for your own image whenever you're ready.

**Your domain:** update `url` in `src/data/site.ts` before going live so SEO
metadata, the sitemap and structured data use the correct address.

---

## 🔌 Connecting the Forms (Booking / Contact / Quote)

The forms (`src/components/forms/`) currently simulate submission and log the
data to the browser console. Each has a clearly marked **`INTEGRATION POINT`**
comment. To make them live, POST the payload to one of:

- A no-code form service: **Formspree**, **Basin**, **Web3Forms** (easiest for shared hosting)
- Your own API endpoint or serverless function
- An email API (e.g. **Resend**, **SendGrid**)

Example:

```ts
await fetch("https://your-form-endpoint", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
```

---

## 📁 Project Structure

```
src/
├── app/                      # Pages (App Router) — each folder is a route
│   ├── layout.tsx            # Root layout: fonts, header, footer, SEO, JSON-LD
│   ├── page.tsx              # Home page
│   ├── about/ inspector/ services/ service-areas/
│   ├── testimonials/ faq/ blog/ book/ pricing/ contact/
│   ├── privacy/ terms/ not-found.tsx
│   ├── sitemap.ts robots.ts  # Auto-generated SEO files
│   └── globals.css
├── components/
│   ├── layout/               # Header, Footer, FloatingCta
│   ├── sections/             # Composable page sections (Hero, CTA, etc.)
│   ├── ui/                   # Reusable primitives (Button, Section, Card…)
│   └── forms/                # Booking, Contact, Quote forms
├── data/                     # ← EDIT THESE to customize content
└── lib/                      # Small helpers
public/
└── .htaccess                 # Apache config for static hosting
next.config.mjs               # Static export configuration
tailwind.config.ts            # Design system (colors, fonts, animations)
```

---

## 🔮 Future Enhancements

The architecture is intentionally ready to grow. To add server-powered
features, remove `output: "export"` from `next.config.mjs` and deploy to a
Node host (Vercel, a VPS, etc.). Suggested roadmap:

- **Online payments** — Stripe Checkout on the booking flow
- **Customer portal & login** — NextAuth.js + a database
- **Inspection report delivery** — secure per-client report pages
- **Admin dashboard** — manage bookings, reports and content
- **CMS integration** — Sanity / Contentful for blog & services (data files already isolate content)
- **Google Maps** — upgrade the contact map to the JS API with markers
- **Email notifications** — booking confirmations & reminders
- **Booking calendar** — real-time availability & scheduling
- **Analytics** — Google Analytics / Plausible
- **Live chat** — Intercom, Crisp or Tawk.to widget
- **Multi-location** — the service-areas data model already supports regions

---

## 📄 License

This codebase is provided for your business. Replace all placeholder content,
imagery and legal text (Privacy Policy & Terms) with your own — and have the
legal pages reviewed by a professional before publishing.
