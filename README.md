# Login Page — Red & Black Minimal

A single-page, production-ready login experience built with **Next.js (App Router)**, **Tailwind CSS v4**, and strong UX/accessibility practices.

## Design

- **Theme**: Pure black background + vivid red accent (`#ef4444`)
- **Style**: Minimal / Swiss — high contrast, generous whitespace, geometric, no decorative noise
- **Typography**: Inter (system-friendly, excellent readability)
- **Responsive**: Mobile-first (375 → 768 → 1024 → 1440+). Works on Vercel web, mobile browsers, and is easy to adapt for Expo Web.

## UX Highlights (from UI/UX Pro Max guidelines)

- Visible labels (never placeholder-only)
- Password show/hide toggle with accessible label
- Inline field errors + error summary with focus management
- `aria-invalid`, `aria-describedby`, `role="alert"`
- Loading + success states with clear feedback
- Autocomplete attributes for password managers
- Paste allowed (WCAG accessible authentication)
- 44×44 px touch targets, 12 px inputs on mobile
- Focus rings only on `:focus-visible`
- `prefers-reduced-motion` respected
- Keyboard fully operable

## Quick start

```bash
cd login-page
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

```bash
npx vercel
# or connect the GitHub repo in the Vercel dashboard
```

## Demo credentials

- Any valid email + password (≥ 8 chars) → success
- `fail@example.com` + any password → shows error path

## Project structure

```
src/
  app/
    layout.tsx      # Root layout, Inter font, dark viewport
    page.tsx        # Login page shell
    globals.css     # Tailwind + design tokens
  components/
    LoginForm.tsx   # Full interactive form (client component)
```

## Extending for real auth

Replace the simulated `setTimeout` in `LoginForm.tsx` with a Server Action or call to your auth provider (NextAuth, Clerk, Supabase, etc.). Keep the client component as a leaf and prefer Server Actions for mutations.

## Expo / React Native note

This is a web (Next.js) project. For a true native Expo version you would re-implement the form with React Native components and the same design tokens. The current responsive layout already works excellently as a mobile web experience (Expo Web / Capacitor / PWA).
