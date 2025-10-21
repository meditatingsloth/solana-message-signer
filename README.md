# Solana Message Signer & Verifier

A simple tool that allows users to sign and verify messages using their Solana wallet. Built with React, TypeScript, and Solana Wallet Adapter.

## Features

- **Message Signing**: Connect your Solana wallet and sign any text message
- **Signature Verification**: Verify that a signature is valid for a given message and wallet address

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Solana wallet browser extension (Phantom, Solflare, etc.)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## How to Use

### Signing a Message

1. Click "Select Wallet" to connect your Solana wallet
2. Enter the message you want to sign in the text area
3. Click "Sign Message"
4. Approve the signature request in your wallet
5. Copy the signature and your wallet address to share

### Verifying a Signature

1. Enter the original message that was signed
2. Enter the wallet address that signed the message
3. Paste the signature (in base58 format)
4. Click "Verify Signature"
5. The app will show whether the signature is valid

## Technical Details

### How Message Signing Works

1. The message is encoded as a `Uint8Array` using `TextEncoder`
2. The wallet's `signMessage` function creates an Ed25519 signature
3. The signature is encoded in base58 format for easy sharing

### How Signature Verification Works

1. The message is encoded the same way as during signing
2. The signature is decoded from base58 to bytes
3. The `tweetnacl` library verifies the signature using Ed25519
4. Returns `true` if the signature matches the message and public key

### Security Considerations

- Signatures are created locally in the user's wallet
- No private keys are ever exposed to the application
- Verification happens entirely client-side
- Ed25519 signatures provide cryptographic proof of authenticity

## Use Cases

- **Authentication**: Ad-hoc proof of ownership of a Solana wallet
- **Message Integrity**: Verify messages haven't been tampered with
- **Off-chain Verification**: Authenticate without blockchain transactions

## License

MIT License - feel free to use this project however you'd like!

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
