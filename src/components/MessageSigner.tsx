import { FC, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import bs58 from "bs58";
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
import { Loader2 } from "lucide-react";

const MessageSigner: FC = () => {
  const { publicKey, signMessage } = useWallet();
  const [message, setMessage] = useState("");
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

        {publicKey && (
          <div className="p-4 bg-brand-accent/10 border border-brand-accent/30 rounded-lg">
            <Label className="text-xs text-brand-accent mb-1 block">
              Connected Wallet
            </Label>
            <div className="flex items-center justify-between gap-2">
              <p className="text-brand-light font-mono text-sm break-all">
                {publicKey.toBase58()}
              </p>
              <CopyButton
                text={publicKey.toBase58()}
                size="icon"
                className="shrink-0"
              />
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

        {signature && (
          <div className="p-4 bg-brand-primary/10 border border-brand-primary/30 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-brand-primary">Signature</Label>
              <CopyButton text={signature} />
            </div>
            <p className="text-brand-light font-mono text-xs break-all bg-brand-dark/30 p-3 rounded">
              {signature}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessageSigner;
