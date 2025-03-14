import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as web3 from '@solana/web3.js';
import { getWalletKeypair, getWalletBalance } from '../utils/wallet';

interface WalletContextType {
  keypair: web3.Keypair | null;
  publicKey: string | null;
  balance: number;
  loading: boolean;
  error: string | null;
  refreshWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  keypair: null,
  publicKey: null,
  balance: 0,
  loading: false,
  error: null,
  refreshWallet: async () => {},
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [keypair, setKeypair] = useState<web3.Keypair | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get keypair from seed phrase
      const walletKeypair = await getWalletKeypair();
      setKeypair(walletKeypair);
      
      // Get public key
      const pubkey = walletKeypair.publicKey;
      setPublicKey(pubkey.toString());
      
      // Get balance
      const walletBalance = await getWalletBalance(pubkey);
      setBalance(walletBalance);
    } catch (err) {
      console.error('Error loading wallet:', err);
      setError('Failed to load wallet');
    } finally {
      setLoading(false);
    }
  };

  // Initial load of wallet
  useEffect(() => {
    loadWallet();
  }, []);

  // Function to refresh wallet data
  const refreshWallet = async () => {
    if (keypair) {
      try {
        const walletBalance = await getWalletBalance(keypair.publicKey);
        setBalance(walletBalance);
      } catch (err) {
        console.error('Error refreshing wallet:', err);
        setError('Failed to refresh wallet');
      }
    }
  };

  return (
    <WalletContext.Provider
      value={{
        keypair,
        publicKey,
        balance,
        loading,
        error,
        refreshWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}; 