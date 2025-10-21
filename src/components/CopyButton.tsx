import { FC, useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const CopyButton: FC<CopyButtonProps> = ({
  text,
  variant = "ghost",
  size = "sm",
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      // Reset after animation completes
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant={variant}
      size={size}
      className={cn("relative", className)}
    >
      <span
        className={cn(
          "transition-opacity duration-200",
          copied ? "opacity-0" : "opacity-100"
        )}
      >
        <Copy className="w-4 h-4" />
      </span>

      {copied && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Check className="w-4 h-4 text-brand-accent animate-spin-in" />
        </span>
      )}
    </Button>
  );
};

export default CopyButton;
