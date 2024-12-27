import React, { useMemo } from "react";
import {
  Outlet,
  Route,
  Routes,
  BrowserRouter,
  Navigate,
} from "react-router-dom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import { 
  SolflareWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import Home from "./pages/Home";
import AuthLayouts from "./layout";
import WalletConnectModal from "./components/WalletConnectModal";
import "@solana/wallet-adapter-react-ui/styles.css";
import Message from "./components/Message";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);


  const wallets = useMemo(() => [
    new SolflareWalletAdapter(),
      new PhantomWalletAdapter(),
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <BrowserRouter>
          <Routes>
            {/* Private Routes */}
            <Route
              element={
                <PrivateRoute>
                  <AuthLayouts />
                  </PrivateRoute>
              }
            >
              <Route path="/chat" element={<Message />} />
            </Route>
            <Route path="/" element={<Navigate replace to="/home" />} />
              <Route path="/home" element={<Home />} />

            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </BrowserRouter>

        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "var(--color-grey-0)",
              color: "var(--color-grey-700)",
            },
          }}
        />
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
