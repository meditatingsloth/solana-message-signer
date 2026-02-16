# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Solana Message Signer & Verifier — a client-side SPA for signing messages with Solana wallets and verifying Ed25519 signatures. No blockchain transactions; all cryptography runs in the browser using tweetnacl. Deployed to Cloudflare Pages at https://solana-message-signer.pages.dev/.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — TypeScript check + production build (`tsc -b && vite build`)
- `npm run preview` — Preview production build locally

No test framework is configured.

## Architecture

**Entry flow:** `index.html` → `src/main.tsx` → `src/polyfills.ts` (Buffer/global shims) → `src/App.tsx`

**App.tsx** sets up the Solana wallet context stack (`ConnectionProvider` → `WalletProvider` → `WalletModalProvider`) with Phantom, Solflare, and Torus adapters on mainnet-beta.

**Two core components:**
- `src/components/MessageSigner.tsx` — Connects wallet, encodes message via `TextEncoder`, calls `wallet.signMessage()`, displays base58-encoded signature
- `src/components/SignatureVerifier.tsx` — Takes message + wallet address + base58 signature, verifies using `nacl.sign.detached.verify()`

**Crypto flow:** Messages are always encoded with `TextEncoder` (UTF-8 → Uint8Array). Signatures use base58 encoding via the `bs58` library. Verification uses tweetnacl's Ed25519 detached verify.

**UI layer:** shadcn/ui components in `src/components/ui/` with Tailwind CSS. The `cn()` utility in `src/lib/utils.ts` merges class names via clsx + tailwind-merge.

## Key Configuration

- **Path alias:** `@/` maps to `./src/` (configured in both `vite.config.ts` and `tsconfig.json`)
- **Polyfills:** Vite resolves `stream` → stream-browserify and `buffer` → buffer/ for browser compatibility with Solana web3.js
- **Tailwind theme:** Custom brand palette — `brand-dark` (#211951), `brand-primary` (#836FFF), `brand-accent` (#15F5BA), `brand-light` (#F0F3FF). Dark mode via class strategy.
- **Environment:** `VITE_SITE_URL` controls OG meta tag URLs (see `.env.example`)
- **Security headers:** Configured in `_headers` for Cloudflare Pages (X-Frame-Options: DENY, strict permissions policy)

## ctx.md Index Navigation

This project uses ctx.md files as a semantic index for AI-navigable codebase understanding.

### Context Files

| File | Covers |
|---|---|
| `project.ctx.md` | Project overview, architecture, wallet context stack, build config |
| `src/components/components.ctx.md` | Domain components, crypto logic, UI patterns, dependencies |

### Using qmd for Search

The ctx.md files are indexed in qmd under the `sign-message` collection:

```bash
qmd search "wallet signing"  -c sign-message    # Fast keyword search
qmd vsearch "how does verification work" -c sign-message  # Semantic search
qmd query "error handling" -c sign-message       # Hybrid search with reranking
```

Read ctx.md files before diving into source. After modifying code, update the relevant ctx.md and re-index: `qmd update && qmd embed`
