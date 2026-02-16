import { FC, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import nacl from "tweetnacl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const SignatureVerifier: FC = () => {
  const params = new URLSearchParams(window.location.search);
  const [message, setMessage] = useState(params.get("m") ?? "");
  const [signature, setSignature] = useState(params.get("s") ?? "");
  const [walletAddress, setWalletAddress] = useState(params.get("w") ?? "");
  const [verificationResult, setVerificationResult] = useState<boolean | null>(
    null
  );
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      setError("");
      setVerificationResult(null);

      // Validate inputs
      if (!message.trim()) {
        throw new Error("Please enter the original message");
      }
      if (!signature.trim()) {
        throw new Error("Please enter the signature");
      }
      if (!walletAddress.trim()) {
        throw new Error("Please enter the wallet address");
      }

      // Validate wallet address format
      let publicKey: PublicKey;
      try {
        publicKey = new PublicKey(walletAddress);
      } catch {
        throw new Error("Invalid wallet address format");
      }

      // Decode signature from base58
      let signatureBytes: Uint8Array;
      try {
        signatureBytes = bs58.decode(signature);
      } catch {
        throw new Error("Invalid signature format (must be base58)");
      }

      // Encode message
      const messageBytes = new TextEncoder().encode(message);

      // Verify signature using nacl
      const isValid = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKey.toBytes()
      );

      setVerificationResult(isValid);
    } catch (err) {
      console.error("Verification error:", err);
      setError(err instanceof Error ? err.message : "Verification failed");
      setVerificationResult(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const clearForm = () => {
    setMessage("");
    setSignature("");
    setWalletAddress("");
    setVerificationResult(null);
    setError("");
  };

  return (
    <Card className="h-full bg-brand-light/15">
      <CardHeader>
        <CardTitle className="text-3xl">Verify Signature</CardTitle>
        <CardDescription className="text-brand-light/60">
          Check if a signature is valid for a message
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Original Message</Label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter the original message..."
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label>Wallet Address</Label>
          <Input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter the signer's wallet address..."
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label>Signature (Base58)</Label>
          <Textarea
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Paste the signature here..."
            rows={3}
            className="resize-none font-mono text-xs"
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleVerify}
            disabled={
              isVerifying ||
              !message.trim() ||
              !signature.trim() ||
              !walletAddress.trim()
            }
            className="flex-1"
            size="lg"
            variant="secondary"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Signature"
            )}
          </Button>

          <Button onClick={clearForm} variant="outline" size="lg">
            Clear
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <p className="text-destructive font-semibold text-sm">Error</p>
            <p className="text-destructive/90 text-sm mt-1">{error}</p>
          </div>
        )}

        {verificationResult !== null && (
          <div
            className={`p-5 rounded-lg border ${
              verificationResult
                ? "bg-brand-accent/10 border-brand-accent/30"
                : "bg-destructive/10 border-destructive/30"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`mt-0.5 ${
                  verificationResult ? "text-brand-accent" : "text-destructive"
                }`}
              >
                {verificationResult ? (
                  <CheckCircle2 className="w-8 h-8" />
                ) : (
                  <XCircle className="w-8 h-8" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`font-bold text-lg mb-1 ${
                    verificationResult
                      ? "text-brand-accent"
                      : "text-destructive"
                  }`}
                >
                  {verificationResult
                    ? "Signature Valid!"
                    : "Signature Invalid"}
                </p>
                <p
                  className={`text-sm ${
                    verificationResult
                      ? "text-brand-accent/90"
                      : "text-destructive/90"
                  }`}
                >
                  {verificationResult
                    ? "The signature was created by the specified wallet address."
                    : "The signature does not match the message and wallet address."}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-lg">
          <p className="text-brand-light/70 text-xs">
            <strong className="text-brand-light">Note:</strong> To verify a
            signature, you need the original message, the wallet address that
            signed it, and the signature itself (in base58 format).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignatureVerifier;
