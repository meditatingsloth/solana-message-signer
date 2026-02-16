# Project Context

> **Path:** `.` (root)
> **Last indexed:** 2026-02-16

## Purpose

Client-side Solana message signing and Ed25519 signature verification SPA. No blockchain transactions — all cryptography runs in the browser. Users connect a Solana wallet to sign arbitrary text messages, then anyone can verify signatures offline using the message, wallet address, and signature.

Deployed to Cloudflare Pages: https://solana-message-signer.pages.dev/

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React + TypeScript | 18.3 / 5.7 |
| Build | Vite | 6.0 |
| Styling | Tailwind CSS + shadcn/ui | 3.4 / CVA 0.7 |
| Wallet | @solana/wallet-adapter-* | 0.9–0.19 |
| Crypto | tweetnacl (Ed25519), bs58 (encoding) | 1.0 / 6.0 |
| Icons | lucide-react | 0.546 |

## Directory Map

```
src/
├── main.tsx              # React entry point (imports polyfills first)
├── polyfills.ts          # Buffer + global shims for Solana web3.js in browser
├── App.tsx               # Wallet context stack + page layout
├── index.css             # Tailwind directives + CSS variables
├── components/
│   ├── MessageSigner.tsx     # Sign messages with connected wallet
│   ├── SignatureVerifier.tsx  # Verify signatures with nacl
│   ├── CopyButton.tsx        # Copy-to-clipboard with animation
│   └── ui/                   # shadcn/ui primitives (Button, Card, Input, Textarea, Label)
└── lib/
    └── utils.ts              # cn() — clsx + tailwind-merge
```

## Architecture

### Boot Sequence

`index.html` → `main.tsx` → `polyfills.ts` (Buffer/global shims) → `App.tsx`

Polyfills **must** load before any Solana imports. `main.tsx` imports `./polyfills` before `./App.tsx` to guarantee this order.

### Wallet Context Stack

`App.tsx` wraps the entire app in three nested providers:

```
ConnectionProvider (mainnet-beta RPC endpoint)
  └── WalletProvider (Phantom, Solflare, Torus adapters; autoConnect=true)
       └── WalletModalProvider (wallet selection UI)
            └── <page layout>
```

Components access wallet state via `useWallet()` hook from `@solana/wallet-adapter-react`.

### Cryptographic Flow

**Signing** (MessageSigner.tsx):
1. `new TextEncoder().encode(message)` → UTF-8 Uint8Array
2. `wallet.signMessage(encodedMessage)` → Ed25519 signature bytes (executed inside wallet extension — app never sees private keys)
3. `bs58.encode(signatureBytes)` → base58 string for display/sharing

**Verification** (SignatureVerifier.tsx):
1. `new PublicKey(walletAddress)` → validates address format
2. `bs58.decode(signature)` → signature bytes
3. `new TextEncoder().encode(message)` → same encoding as signing
4. `nacl.sign.detached.verify(messageBytes, signatureBytes, publicKey.toBytes())` → boolean

**Critical invariant:** Both paths use `TextEncoder` for message encoding. If this ever changes on one side, verification breaks.

### UI Pattern

Two-column grid layout: MessageSigner (left) + SignatureVerifier (right). Both use shadcn/ui Card as their root container. All UI primitives in `src/components/ui/` follow standard shadcn conventions with brand color overrides.

## Build & Dev

| Command | Action |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | `tsc && vite build` — type check then production bundle |
| `npm run preview` | Serve production build locally |

No test framework configured.

### Vite Configuration (vite.config.ts)

- **Path alias:** `@/` → `./src/`
- **Polyfill aliases:** `stream` → `stream-browserify`, `buffer` → `buffer/`
- **Global shim:** `global` defined as `globalThis` (required by Solana web3.js)
- **HTML injection:** `vite-plugin-html` injects `VITE_SITE_URL` env var into OG meta tags

### Tailwind Theme (tailwind.config.js)

Brand palette used throughout:
- `brand-dark` (#211951) — deep purple, backgrounds
- `brand-primary` (#836FFF) — purple, primary actions/buttons
- `brand-accent` (#15F5BA) — cyan, success states/highlights
- `brand-light` (#F0F3FF) — lavender, text/cards

Custom animations: `spin-in` (copy button check icon), `fade-out`.

## Deployment

- **Platform:** Cloudflare Pages
- **Security headers:** `_headers` file sets X-Frame-Options: DENY, nosniff, strict referrer policy, disabled geolocation/mic/camera
- **SPA routing:** `public/_redirects` handles client-side routing

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_SITE_URL` | OG meta tag base URL | `https://solana-message-signer.pages.dev` |

## Context Index

| File | Covers |
|---|---|
| [`project.ctx.md`](./project.ctx.md) | Project overview, architecture, build setup |
| [`src/components/components.ctx.md`](./src/components/components.ctx.md) | Domain components, crypto logic, UI patterns |

## Navigation Guide

- **Understanding the crypto flow:** Start with [`components.ctx.md`](./src/components/components.ctx.md), then read `MessageSigner.tsx` and `SignatureVerifier.tsx`
- **Wallet integration:** Read `App.tsx` for the provider stack, then `MessageSigner.tsx` for `useWallet()` usage
- **Styling/theming:** `tailwind.config.js` for brand colors, `src/index.css` for CSS variables, `src/components/ui/` for base components
- **Build/polyfill issues:** Check `vite.config.ts` for aliases and `polyfills.ts` for browser shims
