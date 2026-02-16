import { FC, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CopyButton from "./CopyButton";
import { Loader2, Link as LinkIcon, AlertTriangle } from "lucide-react";

const params = typeof window !== "undefined"
  ? new URLSearchParams(window.location.search)
  : new URLSearchParams();

const MessageSigner: FC = () => {
  const { publicKey, signMessage } = useWallet();
  const [message, setMessage] = useState(params.get("m") ?? "");
  const intendedWallet = params.get("w");
  const [signature, setSignature] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignMessage = async () => {
    if (!publicKey || !signMessage) {
      setError("Please connect your wallet first");
      return;
    }

    if (!message.trim()) {
      setError("Please enter a message to sign");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSignature("");

      // Encode message as Uint8Array
      const encodedMessage = new TextEncoder().encode(message);

      // Request signature from wallet
      const signatureBytes = await signMessage(encodedMessage);

      // Encode signature as base58 string for display
      const bs58 = (await import("bs58")).default;
      const signatureBase58 = bs58.encode(signatureBytes);

      setSignature(signatureBase58);
    } catch (err) {
      console.error("Error signing message:", err);
      setError(err instanceof Error ? err.message : "Failed to sign message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full bg-brand-light/15">
      <CardHeader>
        <CardTitle className="text-3xl">Sign Message</CardTitle>
        <CardDescription className="text-brand-light/60">
          Connect your wallet and sign any message
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <WalletMultiButton className="!bg-brand-primary hover:!bg-brand-primary/90 !rounded-md !h-10" />
        </div>

        {intendedWallet && publicKey && publicKey.toBase58() !== intendedWallet && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-yellow-500 font-medium">Wallet mismatch</p>
              <p className="text-yellow-500/80 text-xs mt-0.5">
                Expected <span className="font-mono">{intendedWallet.slice(0, 4)}...{intendedWallet.slice(-4)}</span> but connected <span className="font-mono">{publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}</span>
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Message to Sign</Label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here..."
            rows={4}
            disabled={!publicKey}
            className="resize-none"
          />
        </div>

        <Button
          onClick={handleSignMessage}
          disabled={!publicKey || isLoading || !message.trim()}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing...
            </>
          ) : (
            "Sign Message"
          )}
        </Button>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {signature && publicKey && (
          <div className="p-4 bg-brand-accent/10 border border-brand-accent/30 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-brand-accent">Signature</Label>
              <CopyButton text={signature} />
            </div>
            <p className="text-brand-light font-mono text-xs break-all bg-brand-dark/30 p-3 rounded">
              {signature}
            </p>

            <div className="pt-2 border-t border-brand-accent/20">
              {(() => {
                const url = new URL(window.location.origin);
                url.searchParams.set("m", message);
                url.searchParams.set("w", publicKey.toBase58());
                url.searchParams.set("s", signature);
                const verifyUrl = url.toString();
                return (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm text-brand-accent flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5" />
                        Verification Link
                      </Label>
                      <CopyButton text={verifyUrl} />
                    </div>
                    <p className="text-brand-light font-mono text-xs break-all bg-brand-dark/30 p-3 rounded">
                      {verifyUrl}
                    </p>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessageSigner;
