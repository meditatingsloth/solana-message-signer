import { FC, useMemo, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

const getInitialTab = () => {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab");
  if (tab === "sign" || tab === "verify") return tab;
  return params.has("s") ? "verify" : "sign";
};

const TabsSection: FC = () => {
  const [tab, setTab] = useState(getInitialTab);

  return (
    <Tabs value={tab} onValueChange={setTab} className="max-w-2xl mx-auto mb-16">
      <TabsList className="grid w-full grid-cols-2 bg-brand-dark/50 border border-brand-primary/20">
        <TabsTrigger
          value="sign"
          className="data-[state=active]:bg-brand-primary data-[state=active]:text-white text-brand-light/70"
        >
          Sign
        </TabsTrigger>
        <TabsTrigger
          value="verify"
          className="data-[state=active]:bg-brand-primary data-[state=active]:text-white text-brand-light/70"
        >
          Verify
        </TabsTrigger>
      </TabsList>
      <TabsContent value="sign">
        <MessageSigner />
      </TabsContent>
      <TabsContent value="verify">
        <SignatureVerifier />
      </TabsContent>
    </Tabs>
  );
};

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

              <TabsSection />

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
                      </a>
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
