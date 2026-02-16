# Components Context

> **Path:** `src/components/`
> **Last indexed:** 2026-02-16

## Purpose

Domain-specific React components implementing Solana message signing and signature verification. This directory contains all application logic — the crypto operations, wallet interaction, and user-facing forms.

## Key Files

| File | Role | Key Exports |
|---|---|---|
| `MessageSigner.tsx` | Sign messages with a connected Solana wallet | `MessageSigner` (default) |
| `SignatureVerifier.tsx` | Verify Ed25519 signatures offline | `SignatureVerifier` (default) |
| `CopyButton.tsx` | Copy-to-clipboard button with animated feedback | `CopyButton` (default) |
| `ui/button.tsx` | shadcn Button with CVA variants | `Button`, `buttonVariants` |
| `ui/card.tsx` | shadcn Card layout | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |
| `ui/input.tsx` | shadcn text Input | `Input` |
| `ui/textarea.tsx` | shadcn Textarea | `Textarea` |
| `ui/label.tsx` | shadcn Label | `Label` |

## Architecture & Patterns

### MessageSigner

- Uses `useWallet()` to get `publicKey` and `signMessage` from the wallet adapter context
- Renders `WalletMultiButton` (from `@solana/wallet-adapter-react-ui`) for wallet connection
- State: `message`, `signature` (base58 string), `isLoading`, `error`
- Signing flow: `TextEncoder.encode()` → `wallet.signMessage()` → `bs58.encode()` → display
- The wallet extension handles all private key operations — this component never touches keys

### SignatureVerifier

- **Does not require a wallet connection** — verification is purely mathematical
- Takes three inputs: original message, wallet address (base58), signature (base58)
- Uses `@solana/web3.js` `PublicKey` only for address validation and byte conversion
- Uses `tweetnacl` (`nacl.sign.detached.verify`) for Ed25519 verification
- State: `message`, `signature`, `walletAddress`, `verificationResult` (boolean | null), `isVerifying`, `error`
- Multi-step validation: checks empty inputs → validates address format (`new PublicKey()`) → decodes signature (`bs58.decode()`) → verifies

### CopyButton

- Reusable clipboard component with `text` prop
- Visual feedback: Copy icon → animated Check icon (spin-in animation) → resets after 2s
- Props: `text`, `variant` (default: ghost), `size` (default: sm), `className`

### UI Components (`ui/` subdirectory)

Standard shadcn/ui components with brand color integration. All use `cn()` utility from `@/lib/utils` for class merging. Button uses CVA for variant management. Card has backdrop blur and border styling. Input/Textarea share the same brand-themed focus ring pattern.

## Dependencies

- **Upstream (this dir depends on):**
  - `@solana/wallet-adapter-react` — wallet hooks (`useWallet`)
  - `@solana/wallet-adapter-react-ui` — `WalletMultiButton` component
  - `@solana/web3.js` — `PublicKey` class (used in SignatureVerifier only)
  - `tweetnacl` — Ed25519 signature verification
  - `bs58` — base58 encode/decode
  - `lucide-react` — icons (Copy, Check, Loader2, CheckCircle2, XCircle)
  - `@/lib/utils` — `cn()` class merging utility
- **Downstream (depends on this dir):**
  - `src/App.tsx` — imports MessageSigner and SignatureVerifier

## Gotchas & Conventions

- **Encoding consistency is critical:** Both MessageSigner and SignatureVerifier use `new TextEncoder().encode(message)` to convert strings to bytes. Any mismatch would break verification. This is the same encoding Phantom and other Solana wallets expect.
- **bs58 for all binary display:** Signatures and wallet addresses are displayed/input as base58 strings, matching Solana ecosystem conventions.
- **No global state:** Each component manages its own local state via `useState`. No Redux, Context, or shared state between signer and verifier — they're intentionally independent.
- **Wallet adapter CSS:** The `WalletMultiButton` in MessageSigner uses `!important` overrides (`!bg-brand-primary`) to match the brand theme, since the wallet adapter ships its own styles.
- **Error handling pattern:** Both domain components use try/catch with `setError()` for user-facing errors. Errors clear on the next attempt. Validation errors throw with descriptive messages before any crypto operations run.

## Related Context

- [`../../project.ctx.md`](../../project.ctx.md) — Project overview, wallet context stack, build configuration
