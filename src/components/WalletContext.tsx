import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import type { Adapter } from "@solana/wallet-adapter-base";

import "@solana/wallet-adapter-react-ui/styles.css";

interface WalletContextProps {
  children: ReactNode;
}

const WalletContext: FC<WalletContextProps> = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const [wallets, setWallets] = useState<Adapter[]>([]);

  useEffect(() => {
    import("@solana/wallet-adapter-wallets").then(
      ({ PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter }) => {
        setWallets([
          new PhantomWalletAdapter(),
          new SolflareWalletAdapter(),
          new TorusWalletAdapter(),
        ]);
      }
    );
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContext;
