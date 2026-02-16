export interface FAQItem {
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    question: "What is Solana message signing?",
    answer:
      "Message signing uses your Solana wallet's private key to create a cryptographic Ed25519 signature that proves you control a specific wallet address — without making any blockchain transaction or paying any fees.",
  },
  {
    question: "Which wallets are supported?",
    answer:
      "This tool supports Phantom, Solflare, and Torus wallets, as well as any wallet that implements the Solana wallet standard's signMessage method.",
  },
  {
    question: "Does this cost anything or make transactions?",
    answer:
      "No. Message signing is completely free and happens entirely in your browser. No on-chain transactions are created, no SOL is spent, and nothing is sent to the blockchain.",
  },
  {
    question: "How does signature verification work?",
    answer:
      "Verification uses the Ed25519 elliptic curve algorithm (via the tweetnacl library) to mathematically confirm that a signature was produced by the private key corresponding to the given wallet address. The original message, the wallet's public key, and the signature are all required.",
  },
  {
    question: "Is my private key safe?",
    answer:
      "Yes. Your private key never leaves your wallet extension. When you sign a message, the signing operation happens inside the wallet (Phantom, Solflare, etc.) — this tool only receives the resulting signature.",
  },
  {
    question: "Can I share a verification link?",
    answer:
      "Yes. After signing a message, a shareable verification link is generated that contains the message, your wallet address, and the signature. Anyone with the link can verify the signature without needing a wallet.",
  },
  {
    question: "What is the signature format?",
    answer:
      "Signatures are 64-byte Ed25519 detached signatures encoded in Base58 format. The message is encoded as UTF-8 bytes before signing. This is the standard format used by Solana wallets.",
  },
  {
    question: "Can I use this for authentication (Sign-In With Solana)?",
    answer:
      "Yes. Message signing is the foundation of Sign-In With Solana (SIWS) and wallet-based authentication. A server can issue a challenge message, the user signs it with their wallet, and the server verifies the signature to confirm wallet ownership.",
  },
  {
    question: "Does this work on mobile?",
    answer:
      "Yes, this tool works on mobile devices when accessed through a wallet's built-in browser (such as the Phantom or Solflare mobile app browser) that supports the signMessage method.",
  },
];
