# SEO Improvements Spec — Solana Message Signer & Verifier

**Date:** 2026-02-16
**Site:** https://solana-message-signer.pages.dev/
**Stack:** Vite + React SPA, Cloudflare Pages

---

## 1. Problem Statement

The site is a pure client-side SPA with minimal SEO. Search engines see an empty HTML shell until JS executes. There are no robots.txt, sitemap, structured data, canonical tags, or optimized heading hierarchy. The target audience is both developers (searching for Solana signing implementations) and end-users (verifying message authenticity). The niche is small with few competitors, making even modest SEO effort high-leverage.

---

## 2. Decisions Made

| Decision | Choice | Rationale |
|---|---|---|
| Domain | Stay on `pages.dev` | Low effort, acceptable for current scale |
| Verification links | Not indexable | Ephemeral sharing links, not public records |
| Rendering strategy | Static pre-render at build time | No infra change, simple plugin addition |
| Pre-render depth | Full UI shell | Crawlers see complete page structure |
| Content additions | Inline FAQ on main page | Consolidates authority on one URL |
| Rich results | Nice to have | Add JSON-LD if low effort |
| Social cards | Keep generic brand card | Current banner.jpg is sufficient |
| Canonical URL | Always root `/` | All query param variations point to root |
| Performance | Optimize aggressively | Lazy-load adapters, code-split, optimize CWV |
| Off-page SEO | Start from scratch | Include actionable recommendations |
| Keywords | Need research | Include keyword strategy |
| Timeline | Comprehensive pass | Ship everything in one sprint |

---

## 3. Technical Implementation

### 3.1 Pre-rendering (Critical)

**Goal:** Serve fully-rendered HTML at build time so crawlers see real content without JS execution.

- Add `vite-plugin-prerender` (or `vite-plugin-ssr-prerender`) to the Vite config
- Pre-render the root route `/` with the full UI shell (header, tabs, cards, FAQ)
- React hydrates on top of the pre-rendered HTML in the browser
- Pre-render only the **sign tab** as the default view (verify tab loads client-side)
- The pre-rendered HTML should include:
  - Full heading hierarchy (h1, h2s for sections)
  - FAQ content (visible without JS)
  - Structured data script tags
  - All meta tags

**Alternative if plugin is problematic:** Use `vite-ssg` or a custom post-build script that renders the React app to a static HTML string using `renderToString()` and replaces the `index.html` div content.

### 3.2 Meta Tags & Head Management

**Current state:** Static template injection via `vite-plugin-html`.
**Target:** Optimized, keyword-rich meta tags with canonical URL.

#### Title tag
```
Solana Message Signer & Verifier — Sign and Verify with Your Wallet
```
- Primary keyword: "Solana Message Signer"
- Secondary keyword: "Verify"
- Keep under 60 chars

#### Meta description
```
Free online tool to sign messages with your Solana wallet (Phantom, Solflare) and verify Ed25519 signatures. No transactions, no fees — pure cryptographic verification in your browser.
```
- Include wallet names (brand keywords people search)
- Emphasize "free", "no transactions" (differentiators)
- Keep under 155 chars

#### Canonical tag
```html
<link rel="canonical" href="https://solana-message-signer.pages.dev/" />
```
- Always points to root `/` regardless of query params
- Strip all `?tab=`, `?m=`, `?w=`, `?s=` variations

#### Additional meta tags
```html
<meta name="keywords" content="solana message signing, solana verify signature, ed25519 signature verification, phantom wallet sign message, solana wallet tool" />
<meta name="author" content="Solana Message Signer" />
<meta name="theme-color" content="#211951" />
```

### 3.3 Robots.txt

Create `public/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /?m=
Disallow: /?s=
Disallow: /?w=

Sitemap: https://solana-message-signer.pages.dev/sitemap.xml
```
- Allow root crawling
- Block verification link parameter patterns (ephemeral, not indexable)
- Reference sitemap

### 3.4 Sitemap

Create `public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.w3.org/2000/namespace/sitemap/0.9">
  <url>
    <loc>https://solana-message-signer.pages.dev/</loc>
    <lastmod>2026-02-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```
- Single-page app = single URL in sitemap
- Update `lastmod` on each deploy (can automate in build script)

### 3.5 Structured Data (JSON-LD)

Add to `index.html` `<head>`:

#### SoftwareApplication schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Solana Message Signer & Verifier",
  "description": "Sign messages with your Solana wallet and verify Ed25519 signatures in the browser",
  "url": "https://solana-message-signer.pages.dev/",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "browserRequirements": "Requires a Solana wallet extension (Phantom, Solflare, or Torus)"
}
```

#### FAQPage schema (pairs with inline FAQ section)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Solana message signing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Message signing uses your Solana wallet's private key to create a cryptographic signature proving you control a specific wallet address, without making any blockchain transaction."
      }
    },
    {
      "@type": "Question",
      "name": "Is this tool free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, completely free. No transactions are made and no fees are charged. All cryptography runs in your browser."
      }
    }
  ]
}
```
*Additional FAQ items detailed in Section 4.*

### 3.6 Heading Hierarchy

Restructure the page headings for semantic clarity:

```
h1: Solana Message Signer & Verifier
  h2: Sign a Message (tab/card title)
  h2: Verify a Signature (tab/card title)
  h2: Frequently Asked Questions
    h3: Individual question headings
```

- Current: h1 → h3 (skips h2). Fix by making card titles h2.
- The pre-rendered HTML should contain this full hierarchy.

### 3.7 Inline FAQ Section

Add an accordion FAQ below the sign/verify tool on the main page.

**Proposed questions (8-10):**

1. **What is Solana message signing?** — Explains Ed25519 signing without transactions
2. **Which wallets are supported?** — Phantom, Solflare, Torus + "any wallet implementing the Solana wallet standard"
3. **Does this cost anything or make transactions?** — No fees, no on-chain activity
4. **How does signature verification work?** — tweetnacl detached verify, Ed25519 curve
5. **Is my private key safe?** — Key never leaves the wallet extension; signing happens in the wallet
6. **Can I share a verification link?** — Yes, shareable links with message + signature + address
7. **What is the signature format?** — Base58-encoded Ed25519 detached signature
8. **Can I use this for authentication?** — Yes, common pattern for Sign-In With Solana (SIWS)
9. **Does this work on mobile?** — Works with mobile wallet browsers that support signMessage

Use shadcn/ui `Accordion` component. Each item should use `<h3>` for the question.

### 3.8 Open Graph Improvements

Update existing OG tags:

```html
<meta property="og:title" content="Solana Message Signer & Verifier" />
<meta property="og:description" content="Free tool to sign and verify messages with Solana wallets. No transactions, no fees." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://solana-message-signer.pages.dev/" />
<meta property="og:image" content="https://solana-message-signer.pages.dev/banner.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Solana Message Signer & Verifier tool" />
<meta property="og:site_name" content="Solana Message Signer" />
```

Add missing: `og:image:width`, `og:image:height`, `og:image:alt`, `og:site_name`.

---

## 4. Performance Optimization (Core Web Vitals)

### 4.1 Code Splitting & Lazy Loading

- **Lazy-load wallet adapters:** Move `PhantomWalletAdapter`, `SolflareWalletAdapter`, `TorusWalletAdapter` imports behind `React.lazy()` or dynamic `import()`. Only load when user interacts with wallet connect.
- **Code-split the verify tab:** `SignatureVerifier` can be lazy-loaded since it's not the default view.
- **Dynamic import for bs58 and tweetnacl:** These are only needed during sign/verify operations, not on initial load.

### 4.2 Image Optimization

- Convert `banner.jpg` to WebP/AVIF with fallback
- Add explicit `width` and `height` to the social preview image
- Inline the `solana-icon.svg` as a data URI in the HTML to eliminate a network request for the favicon
- Add `<link rel="preload">` for critical above-the-fold assets

### 4.3 Font Loading

- If using web fonts: add `font-display: swap` to prevent FOIT (Flash of Invisible Text)
- Preload the primary font file with `<link rel="preload" as="font" crossorigin>`
- Consider using system fonts for body text to eliminate font loading entirely

### 4.4 Resource Hints

```html
<link rel="dns-prefetch" href="https://api.mainnet-beta.solana.com" />
<link rel="preconnect" href="https://api.mainnet-beta.solana.com" crossorigin />
```

### 4.5 Build Optimization

- Ensure Vite is tree-shaking unused wallet adapter code
- Check bundle size with `npx vite-bundle-visualizer` and identify bloat
- Set aggressive cache headers for hashed assets in `_headers`

---

## 5. Keyword Strategy

### 5.1 Primary Keywords (target in title, h1, description)
- `solana message signing`
- `solana sign message`
- `solana verify signature`

### 5.2 Secondary Keywords (target in h2s, FAQ, body text)
- `ed25519 signature verification`
- `phantom wallet sign message`
- `solflare sign message`
- `solana wallet signature`
- `sign in with solana`

### 5.3 Long-tail Keywords (target in FAQ answers)
- `how to sign a message with phantom wallet`
- `verify solana wallet signature online`
- `solana message signing tool free`
- `ed25519 detached signature verify`
- `prove ownership of solana wallet`

### 5.4 Recommendations
- Include wallet brand names (Phantom, Solflare) in the FAQ — people search by wallet name
- Add "free" and "online" qualifiers in the description — high-intent modifiers
- The niche is small, so even basic optimization should yield rankings quickly
- Monitor Google Search Console after deployment for actual query data

---

## 6. Off-Page SEO Recommendations

### 6.1 Directory Listings
- Submit to **awesome-solana** GitHub lists
- List on **Solana ecosystem directories** (e.g., solana.com/ecosystem)
- Add to **Product Hunt** as a free developer tool
- Submit to **AlternativeTo** as an alternative to manual CLI verification

### 6.2 Community Presence
- Share on **Solana developer Discord** and **Reddit r/solana**
- Write a short **dev.to** or **Hashnode** post: "How to verify Solana message signatures in the browser"
- Mention in **Solana StackExchange** answers about message signing

### 6.3 GitHub SEO
- Add the live URL prominently in the GitHub repo description
- Add topic tags: `solana`, `message-signing`, `ed25519`, `wallet`, `verification`
- Keep the repo active (regular commits help GitHub discoverability)

### 6.4 Backlink Opportunities
- Reach out to Solana wallet documentation teams (Phantom, Solflare) for potential "community tools" links
- Create a simple embed/badge that other sites can use: "Verify this signature" link

---

## 7. Security Headers Update

Add to `_headers`:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.mainnet-beta.solana.com

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

- Change `Referrer-Policy` from `no-referrer` to `strict-origin-when-cross-origin` — allows analytics and referrer tracking while protecting path info
- Add `Cache-Control` for hashed assets (immutable caching for Vite's output)
- Add basic CSP

---

## 8. Implementation Checklist

### Phase 1: Foundation
- [ ] Add `robots.txt` to `public/`
- [ ] Add `sitemap.xml` to `public/`
- [ ] Add canonical `<link>` tag to `index.html`
- [ ] Optimize title tag and meta description with keywords
- [ ] Add missing OG tag attributes (width, height, alt, site_name)
- [ ] Add `theme-color` meta tag

### Phase 2: Structured Data & Content
- [ ] Add WebApplication JSON-LD schema to `index.html`
- [ ] Build inline FAQ accordion component with shadcn/ui
- [ ] Write 8-10 FAQ entries with keyword-optimized answers
- [ ] Add FAQPage JSON-LD schema
- [ ] Fix heading hierarchy (h1 → h2 → h3)

### Phase 3: Pre-rendering
- [ ] Install and configure pre-rendering plugin
- [ ] Verify pre-rendered HTML includes full UI shell, FAQ, and structured data
- [ ] Test that React hydration works correctly on top of pre-rendered HTML
- [ ] Validate pre-rendered output with Google's Rich Results Test

### Phase 4: Performance
- [ ] Lazy-load wallet adapters (dynamic import)
- [ ] Code-split SignatureVerifier component
- [ ] Dynamic import bs58 and tweetnacl
- [ ] Optimize images (WebP, dimensions, preload)
- [ ] Add resource hints (dns-prefetch, preconnect)
- [ ] Update `_headers` with cache-control for static assets
- [ ] Run Lighthouse audit and target 90+ on all categories
- [ ] Analyze bundle with vite-bundle-visualizer

### Phase 5: Final
- [ ] Update security headers (referrer-policy, CSP, caching)
- [ ] Submit sitemap to Google Search Console
- [ ] Verify with Google's URL Inspection tool
- [ ] Test OG tags with Twitter Card Validator and Facebook Sharing Debugger
- [ ] Update `project.ctx.md` and re-index with qmd

---

## 9. Verification

After implementation:
1. `npm run build` — ensure build succeeds
2. `npm run preview` — check pre-rendered HTML in view-source
3. Lighthouse audit — target 90+ SEO, 90+ Performance, 100 Accessibility
4. Google Rich Results Test — validate JSON-LD
5. `curl -s https://solana-message-signer.pages.dev/ | head -100` — verify pre-rendered HTML is served
6. Twitter Card Validator — verify OG tags render correctly
7. Google Search Console — submit sitemap, request indexing

---

## 10. Expected Impact

| Improvement | Expected SEO Impact |
|---|---|
| Pre-rendering | **High** — crawlers see real content instead of empty div |
| Title & description optimization | **High** — directly affects click-through rate from SERPs |
| robots.txt + sitemap | **Medium** — enables proper crawling and indexing |
| Structured data | **Medium** — enables rich results (FAQ accordion, app info) |
| FAQ content | **Medium** — captures informational long-tail queries |
| Heading hierarchy | **Low-Medium** — helps crawlers understand page structure |
| Performance optimization | **Medium** — Core Web Vitals are a ranking signal |
| Canonical URL | **Low** — prevents potential duplicate content issues |
| Off-page SEO | **High** (long-term) — backlinks are the strongest ranking signal |

Given the low competition in this niche, this comprehensive pass should achieve first-page rankings for primary keywords within 4-8 weeks.
