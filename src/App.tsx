import { FC, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";

// Import default styles for wallet modal
import "@solana/wallet-adapter-react-ui/styles.css";
import MessageSigner from "./components/MessageSigner";
import SignatureVerifier from "./components/SignatureVerifier";

const App: FC = () => {
  // Use mainnet-beta for production, devnet for development
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-black">
            <div className="container mx-auto px-4 py-12">
              <header className="text-center mb-16">
                <div className="inline-block mb-6">
                  <div className="relative">
                    <h1 className="text-5xl md:text-6xl font-bold text-brand-light mb-4">
                      Solana Message Signer
                    </h1>
                  </div>
                </div>
                <p className="text-xl text-brand-light/80 max-w-2xl mx-auto">
                  Sign and verify messages using your Solana wallet
                </p>
              </header>

              <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto mb-16">
                <MessageSigner />
                <SignatureVerifier />
              </div>

              <footer className="mt-20 text-center">
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="flex items-center justify-center gap-2 text-brand-light/60">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent"></div>
                    <span className="text-sm">
                      Made by{" "}
                      <a
                        href="https://x.com/meditatingsloth"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-primary hover:underline"
                      >
                        @meditatingsloth
                      </a>{" "}
                      (Claude)
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent"></div>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
