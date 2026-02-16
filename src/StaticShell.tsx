/**
 * StaticShell — Pre-rendered HTML shell for SEO crawlers.
 *
 * This component mirrors the visual layout of App.tsx but without any
 * wallet providers, browser APIs, or interactive behavior. It's rendered
 * to a string at build time and injected into dist/index.html so that
 * crawlers see real content without executing JavaScript.
 *
 * React uses createRoot (not hydrateRoot) at runtime, so the pre-rendered
 * HTML is fully replaced when the app boots — no hydration mismatch issues.
 */
import { FC } from "react";
import { faqData } from "./data/faq";

const StaticShell: FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
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

        {/* Tabs shell */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="inline-flex h-10 items-center justify-center rounded-md p-1 w-full grid grid-cols-2 bg-brand-dark/50 border border-brand-primary/20">
            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium bg-brand-primary text-white">
              Sign
            </div>
            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium text-brand-light/70">
              Verify
            </div>
          </div>

          {/* Sign card shell */}
          <div className="mt-2">
            <div className="rounded-xl border border-brand-primary/20 bg-brand-light/15 backdrop-blur-md shadow-lg">
              <div className="flex flex-col space-y-1.5 p-6">
                <h2 className="font-semibold leading-none tracking-tight text-brand-light text-3xl">
                  Sign Message
                </h2>
                <p className="text-sm text-brand-light/60">
                  Connect your wallet and sign any message
                </p>
              </div>
              <div className="p-6 pt-0 space-y-6">
                <div>
                  <button className="bg-brand-primary hover:bg-brand-primary/90 rounded-md h-10 px-4 py-2 text-white text-sm font-medium">
                    Select Wallet
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-light leading-none">
                    Message to Sign
                  </label>
                  <textarea
                    className="flex min-h-[60px] w-full rounded-md border border-brand-primary/30 bg-brand-dark/50 px-3 py-2 text-sm text-brand-light placeholder:text-brand-light/40 resize-none"
                    rows={4}
                    disabled
                    placeholder="Enter your message here..."
                  />
                </div>
                <button
                  className="w-full bg-brand-primary text-white shadow hover:bg-brand-primary/90 h-10 rounded-md px-8 text-sm font-medium inline-flex items-center justify-center"
                  disabled
                >
                  Sign Message
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <section className="max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-brand-light mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {faqData.map((item, index) => (
              <div
                key={index}
                className="border border-brand-primary/20 rounded-lg px-4 bg-brand-light/5"
              >
                <h3 className="py-4 text-sm font-medium text-brand-light">
                  {item.question}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
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
  );
};

export default StaticShell;
