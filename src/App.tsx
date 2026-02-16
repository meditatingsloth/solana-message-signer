import { FC, lazy, Suspense, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import WalletContext from "./components/WalletContext";
import MessageSigner from "./components/MessageSigner";
import FAQ from "./components/FAQ";

const SignatureVerifier = lazy(() => import("./components/SignatureVerifier"));

const getInitialTab = () => {
  if (typeof window === "undefined") return "sign";
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
        <Suspense
          fallback={
            <div className="h-96 flex items-center justify-center text-brand-light/50">
              Loading...
            </div>
          }
        >
          <SignatureVerifier />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
};

const App: FC = () => {
  return (
    <WalletContext>
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

          <FAQ />

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
    </WalletContext>
  );
};

export default App;
