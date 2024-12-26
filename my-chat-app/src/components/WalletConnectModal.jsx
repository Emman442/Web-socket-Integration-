import { useWallet } from "@solana/wallet-adapter-react";
import {
    WalletModalProvider,
    WalletMultiButton,
  } from "@solana/wallet-adapter-react-ui";
  
  import "@solana/wallet-adapter-react-ui/styles.css";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
  
  export default function WalletConnectModal({ onClose }) {
    const { publicKey, connected, disconnect } = useWallet(); 
    const navigate = useNavigate()
    useEffect(() => {
        const sendWalletToBackend = async () => {
            if (connected && publicKey) {
                try {
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/connect-wallet`, { // Replace with your backend endpoint
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ publicKey: publicKey.toString() }), // Send public key as string
                    });

                    if (!response.ok) {
                        const errorData = await response.json()
                        throw new Error(`HTTP error! status: ${response.status} message: ${errorData.message}`);
                    }
                    const data = await response.json()
                    
                    onClose()
                    toast.success(data?.message)
                    navigate("/chat")
                } catch (error) {
                    console.error('Error sending wallet to backend:', error);
                    toast.error(error?.message)
                    disconnect()
                }
            }
        };

        sendWalletToBackend(); 
    }, [connected, publicKey, onClose, disconnect]);


    return (
      <div className="font-custom inset-0 bg-black bg-opacity-50 fixed flex items-center justify-center z-50">
        <div className="bg-[#1f2937] text-white rounded-lg shadow-lg pt-6 w-[30%] h-[160px] relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white text-3xl "
          >
            &times;
          </button>
          <h2 className="text-2xl font-semibold text-center mb-4">
            Connect Wallet
          </h2>
          <WalletModalProvider>
            <div className="flex flex-col items-center gap-3">
              <WalletMultiButton />
            </div>
          </WalletModalProvider>
        </div>
      </div>
    );
  }
  
// import React from 'react'
// export default function WalletConnectModal() {
//   return (
//     <div className="inset-0 bg-black bg-opacity-50 fixed flex items-center justify-center z-50">
//       <div className="bg-[#1f2937] text-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
//         <h2 className="text-2xl font-semibold text-center mb-6">Connect Wallet</h2>
//         <div className="space-y-4">
//           <button
//             onClick={() => onConnect('metamask')}
//             className="w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg text-lg font-medium hover:from-orange-600 hover:to-yellow-600 transition"
//           >
//             Connect with MetaMask
//           </button>
//           <button
//             onClick={() => onConnect('phantom')}
//             className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg text-lg font-medium hover:from-purple-600 hover:to-indigo-600 transition"
//           >
//             Connect with Phantom
//           </button>
//           {/* <button
//             onClick={onClose}
//             className="w-full py-3 bg-gray-700 rounded-lg text-lg font-medium hover:bg-gray-600 transition"
//           >
//             Close
//           </button> */}
//         </div>
//       </div>
//     </div>
//   )
// }
