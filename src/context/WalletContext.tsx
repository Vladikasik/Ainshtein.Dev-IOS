import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as web3 from '@solana/web3.js';
import * as bip39 from 'bip39';
import * as SecureStore from 'expo-secure-store';
import { getWalletKeypair, getWalletBalance } from '../utils/wallet';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { Buffer } from 'buffer';
import * as ed25519 from 'ed25519-hd-key';
import WalletSelectionModal, { WalletOption } from '../components/WalletSelectionModal';

// A common BIP44 derivation path for Solana is m/44'/501'/0'/0'
// But Phantom seems to use a different derivation - we'll handle this properly
// by directly implementing the necessary derivation logic
const HARDENED_OFFSET = 0x80000000; // 2^31

// Wallet import type
export type WalletImportData = {
  type: 'seedPhrase' | 'privateKey';
  value: string;
  password?: string; // Optional password for seed phrases
};

// Updated context type with new wallet selection state
interface WalletContextType {
  keypair: web3.Keypair | null;
  publicKey: string | null;
  balance: number;
  loading: boolean;
  error: string | null;
  isWalletImported: boolean;
  refreshWallet: () => Promise<void>;
  importWallet: (data: WalletImportData) => Promise<void>;
  logout: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  keypair: null,
  publicKey: null,
  balance: 0,
  loading: false,
  error: null,
  isWalletImported: false,
  refreshWallet: async () => {},
  importWallet: async () => {},
  logout: async () => {},
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

// Key for storing wallet data in SecureStore
const WALLET_STORAGE_KEY = 'ainshtein_wallet_data';

// Derive a key from a seed using the given derivation path - using the exact same approach
// that worked in our tests
function derivePath(
  seed: Buffer,
  path: string = "m/44'/501'/0'/0'"
): Buffer {
  try {
    // Check if this is the exact path that worked in our tests
    console.log(`Deriving exact path ${path} from seed of length ${seed.length}`);
    
    // Convert seed buffer to hex string as required by ed25519-hd-key
    const seedHex = seed.toString('hex');
    
    // Use the library to derive the key directly - this is what worked in our tests
    console.log(`Using ed25519-hd-key to derive path ${path}`);
    const { key } = ed25519.derivePath(path, seedHex);
    
    // Return the key as a Buffer
    return Buffer.from(key);
  } catch (error) {
    console.error(`Error deriving path ${path}:`, error);
    throw error;
  }
}

// Generate multiple derivation paths used by various wallets
// Check specific indices: 0-9, 666, and 999
const getPossibleSolanaKeypairsFromSeed = (seedBuffer: Buffer): { keypair: web3.Keypair, path: string, index: number }[] => {
  // Base paths used by various wallets, ensuring all indices are hardened (with ')
  // Our target addresses were found at "m/44'/501'/0'/0'" and "m/44'/501'/1'/0'"
  const basePaths = [
    "m/44'/501'/{index}'/0'",   // This is the exact format that worked in our tests - CONFIRMED WORKING!
    "m/44'/501'/{index}'",      // Path without final component
    "m/501'/0'/{index}'",       // Alternate path with hardened index
    "m/501'/{index}'/0'",       // Another variation with hardened indices
  ];
  
  // Specific indices to check: 0-9, 666, 999
  const indicesToCheck = [...Array(10).keys(), 666, 999];
  console.log(`Generating keypairs for specific indices: ${indicesToCheck.join(', ')}`);
  
  const results: { keypair: web3.Keypair, path: string, index: number }[] = [];
  
  // First try direct seed to keypair (what we were doing before)
  try {
    const seed = seedBuffer.slice(0, 32);
    console.log('Adding direct keypair from seed slice');
    results.push({
      keypair: web3.Keypair.fromSeed(seed),
      path: "m/direct",
      index: 0
    });
  } catch (e) {
    console.error("Failed to derive direct keypair from seed", e);
  }
  
  // Try specific hardcoded paths that we know worked in our tests
  try {
    console.log("Trying EXACT confirmed path: m/44'/501'/0'/0'");
    const derivedKey0 = derivePath(seedBuffer, "m/44'/501'/0'/0'");
    const keypair0 = web3.Keypair.fromSeed(derivedKey0);
    console.log(`Result: ${keypair0.publicKey.toString()}`);
    results.push({
      keypair: keypair0,
      path: "m/44'/501'/0'/0'",
      index: 0
    });
  } catch (e) {
    console.error("Failed to derive keypair from exact path m/44'/501'/0'/0'", e);
  }
  
  try {
    console.log("Trying EXACT confirmed path: m/44'/501'/1'/0'");
    const derivedKey1 = derivePath(seedBuffer, "m/44'/501'/1'/0'");
    const keypair1 = web3.Keypair.fromSeed(derivedKey1);
    console.log(`Result: ${keypair1.publicKey.toString()}`);
    results.push({
      keypair: keypair1,
      path: "m/44'/501'/1'/0'",
      index: 1
    });
  } catch (e) {
    console.error("Failed to derive keypair from exact path m/44'/501'/1'/0'", e);
  }
  
  // Try each base path with specific indices
  for (const index of indicesToCheck) {
    for (const basePathTemplate of basePaths) {
      const path = basePathTemplate.replace('{index}', index.toString());
      try {
        console.log(`Attempting to derive keypair from path: ${path}`);
        const derivedKey = derivePath(seedBuffer, path);
        const keypair = web3.Keypair.fromSeed(derivedKey);
        console.log(`Successfully derived keypair with public key: ${keypair.publicKey.toString()}`);
        results.push({
          keypair,
          path,
          index
        });
      } catch (e) {
        console.warn(`Failed to derive keypair from path ${path}`, e);
      }
    }
  }
  
  console.log(`Total keypairs generated: ${results.length}`);
  return results;
};

// New function to scan wallet addresses and get their balances
async function scanWalletAddresses(
  seedBuffer: Buffer
): Promise<WalletOption[]> {
  console.log(`=== Scanning specific wallet indices (0-9, 666, 999) ===`);
  console.log(`Seed buffer length: ${seedBuffer.length}`);
  
  const walletOptions: WalletOption[] = [];
  
  // Try the specific paths we know work from our tests first
  try {
    console.log("*** Trying EXACT confirmed paths from our tests ***");
    
    // These paths were confirmed to work in our tests
    const confirmedPaths = [
      { path: "m/44'/501'/0'/0'", index: 0 },
      { path: "m/44'/501'/1'/0'", index: 1 }
    ];
    
    // Using the exact same derivation approach as in our tests
    for (const { path, index } of confirmedPaths) {
      try {
        console.log(`Deriving from confirmed path: ${path}`);
        
        // Exact same method as in our tests
        const derivedKey = ed25519.derivePath(path, seedBuffer.toString('hex')).key;
        const keypair = web3.Keypair.fromSeed(Buffer.from(derivedKey));
        console.log(`Derived public key: ${keypair.publicKey.toString()}`);
        
        // Add the path info directly to walletOptions so we can check its balance
        walletOptions.push({
          keypair,
          path,
          index,
          publicKey: keypair.publicKey.toString(),
          balance: 0 // Will be updated below
        });
      } catch (error) {
        console.error(`Error deriving from path ${path}:`, error);
      }
    }
  } catch (error) {
    console.error("Error using confirmed paths:", error);
  }
  
  // Generate other possible keypairs from seed
  console.log("Generating possible keypairs from seed...");
  const possibleWallets = getPossibleSolanaKeypairsFromSeed(seedBuffer);
  console.log(`Generated ${possibleWallets.length} possible keypairs`);
  
  // Add all the keypairs from getPossibleSolanaKeypairsFromSeed
  // but avoid duplicates by checking if we already have the public key
  for (const wallet of possibleWallets) {
    const publicKey = wallet.keypair.publicKey.toString();
    // Skip if we already have this public key in walletOptions
    if (!walletOptions.some(w => w.publicKey === publicKey)) {
      walletOptions.push({
        ...wallet,
        publicKey,
        balance: 0 // Will be updated below
      });
    }
  }
  
  // Get balance
  const connection = new web3.Connection(process.env.RPC_URL || 'https://api.devnet.solana.com', 'confirmed');
  console.log(`Connected to Solana at ${process.env.RPC_URL || 'https://api.devnet.solana.com'}`);
      
  // Get balances for all keypairs
  console.log("=== Checking balances for all keypairs ===");
  for (let i = 0; i < walletOptions.length; i++) {
    const wallet = walletOptions[i];
    try {
      console.log(`Checking public key: ${wallet.publicKey} from path: ${wallet.path}`);
      
      const balanceInLamports = await connection.getBalance(wallet.keypair.publicKey);
      const balance = balanceInLamports / web3.LAMPORTS_PER_SOL;
      console.log(`Found balance for ${wallet.publicKey}: ${balance} SOL`);
      
      // Update the balance
      walletOptions[i].balance = balance;
    } catch (error) {
      console.error(`Error checking address with path ${wallet.path}:`, error);
    }
  }
  
  // Filter to only keep wallets with a balance > 0
  const walletsWithBalance = walletOptions.filter(wallet => wallet.balance > 0);
  
  // Sort by balance (highest first)
  walletsWithBalance.sort((a, b) => b.balance - a.balance);
  console.log(`Found ${walletsWithBalance.length} wallet(s) with non-zero balance`);
  
  return walletsWithBalance;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [keypair, setKeypair] = useState<web3.Keypair | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isWalletImported, setIsWalletImported] = useState<boolean>(false);
  
  // State for wallet selection modal
  const [showWalletSelection, setShowWalletSelection] = useState<boolean>(false);
  const [walletOptions, setWalletOptions] = useState<WalletOption[]>([]);
  const [scanningWallets, setScanningWallets] = useState<boolean>(false);
  const [pendingImportData, setPendingImportData] = useState<WalletImportData | null>(null);

  // Check if wallet exists
  const checkWalletExists = async () => {
    try {
      const storedWallet = await SecureStore.getItemAsync(WALLET_STORAGE_KEY);
      return !!storedWallet;
    } catch (err) {
      console.error('Error checking wallet existence:', err);
      return false;
    }
  };

  // Import wallet from seed phrase or private key
  const importWallet = async (data: WalletImportData) => {
    try {
      setLoading(true);
      setError(null);

      if (data.type === 'seedPhrase') {
        if (!data.value.trim()) {
          throw new Error('Seed phrase cannot be empty');
        }
        
        console.log("Processing seed phrase import");
        // Store the import data for later use after wallet selection
        setPendingImportData(data);
        
        try {
          setScanningWallets(true);
          setShowWalletSelection(true);
          
          // Generate seed buffer from mnemonic, using password if provided
          console.log("Generating seed buffer from mnemonic");
          console.log("Mnemonic word count:", data.value.split(/\s+/).length);
          
          // IMPORTANT: Use mnemonicToSeedSync as that's what worked in our tests
          // Note that an empty passphrase worked in our tests
          console.log("Using mnemonicToSeedSync as in our tests");
          const seedBuffer = data.password && data.password.length > 0 
            ? bip39.mnemonicToSeedSync(data.value, data.password) 
            : bip39.mnemonicToSeedSync(data.value);  // This matches our tests
          
          console.log(`Seed buffer generated, length: ${seedBuffer.length} bytes`);
          // Log the first few bytes of the seed (for debugging, don't log the full seed in production)
          console.log(`Seed buffer starts with: ${seedBuffer.slice(0, 4).toString('hex')}...`);
          
          // Try deriving the exact addresses that worked in our tests first
          try {
            // Try the exact method that worked in our tests
            console.log("Trying to derive with the exact method from our tests...");
            const path0 = "m/44'/501'/0'/0'";
            const path1 = "m/44'/501'/1'/0'";
            
            // Same method as in our tests
            const derivedKey0 = ed25519.derivePath(path0, seedBuffer.toString('hex')).key;
            const keypair0 = web3.Keypair.fromSeed(Buffer.from(derivedKey0));
            console.log(`Address at ${path0}: ${keypair0.publicKey.toString()}`);
            
            const derivedKey1 = ed25519.derivePath(path1, seedBuffer.toString('hex')).key;
            const keypair1 = web3.Keypair.fromSeed(Buffer.from(derivedKey1));
            console.log(`Address at ${path1}: ${keypair1.publicKey.toString()}`);
            
            // Check if they match our target addresses
            const targetAddresses = [
              "Bsw8DaAn7tb7n4AuP1WWVDS4BjEW3EVKnDwobqx8WYFC",
              "B3GyLfJNL8mN4JNh6NNzCSKoYDGPh5cKsZ5sUd1bgCfB"
            ];
            
            console.log(`Target address match check:`);
            console.log(`${keypair0.publicKey.toString()} matches target? ${keypair0.publicKey.toString() === targetAddresses[0]}`);
            console.log(`${keypair1.publicKey.toString()} matches target? ${keypair1.publicKey.toString() === targetAddresses[1]}`);
          } catch (error) {
            console.error("Error in direct test derivation:", error);
          }
          
          // Scan for wallet addresses with balances
          const availableWallets = await scanWalletAddresses(seedBuffer);
          setWalletOptions(availableWallets);
          setScanningWallets(false);
          
          // If no wallets with balance found or only one, handle automatically
          if (availableWallets.length === 0) {
            // Just keep the modal open to show "No wallets found" message
            console.log("No wallets with balance found");
            return;
          } else if (availableWallets.length === 1) {
            // If only one wallet with balance, select it automatically
            console.log("Single wallet with balance found, selecting automatically");
            handleWalletSelected(availableWallets[0]);
          }
          // Otherwise, user will select from modal
          
        } catch (seedErr) {
          console.error('Error with seed derivation:', seedErr);
          setShowWalletSelection(false);
          setScanningWallets(false);
          throw new Error('Invalid seed phrase. Please check and try again.');
        }
        
      } else {
        // Import from private key - using Phantom's exported private key
        let newKeypair: web3.Keypair;
        
        try {
          // Base58 decode the private key - this is the format Phantom exports
          const secretKey = bs58.decode(data.value);
          newKeypair = web3.Keypair.fromSecretKey(secretKey);
          
          // Complete the import process with the keypair
          await completeImport(newKeypair, data.type, data.value);
          
        } catch (b58Err) {
          console.error('Error decoding as base58:', b58Err);
          
          // Fallback for hexadecimal format
          try {
            const privateKeyBytes = Buffer.from(data.value, 'hex');
            newKeypair = web3.Keypair.fromSecretKey(privateKeyBytes);
            
            // Complete the import process with the keypair
            await completeImport(newKeypair, data.type, bs58.encode(privateKeyBytes));
            
          } catch (hexErr) {
            console.error('Error creating keypair from hex:', hexErr);
            
            // Last attempt - try direct ASCII bytes
            try {
              const asciiBytes = Uint8Array.from(data.value.split('').map(c => c.charCodeAt(0)));
              newKeypair = web3.Keypair.fromSecretKey(asciiBytes);
              
              // Complete the import process with the keypair
              await completeImport(newKeypair, data.type, bs58.encode(asciiBytes));
              
            } catch (asciiErr) {
              console.error('Error with direct ASCII import:', asciiErr);
              throw new Error('Invalid private key format. Please provide a valid Solana private key.');
            }
          }
        }
      }
    } catch (err) {
      console.error('Error importing wallet:', err);
      setLoading(false);
      throw err;
    }
  };
  
  // Function to handle when a wallet is selected from the modal
  const handleWalletSelected = async (selectedWallet: WalletOption) => {
    try {
      setShowWalletSelection(false);
      
      if (!pendingImportData) {
        throw new Error('Missing seed phrase data');
      }
      
      // Get private key from the selected keypair
      const privateKeyBase58 = bs58.encode(selectedWallet.keypair.secretKey);
      
      // Complete the import with the selected keypair
      await completeImport(
        selectedWallet.keypair,
        pendingImportData.type,
        privateKeyBase58,
        pendingImportData.value,
        pendingImportData.password
      );
      
      // Clear pending data
      setPendingImportData(null);
      setWalletOptions([]);
      
    } catch (error) {
      console.error('Error selecting wallet:', error);
      setError('Failed to import selected wallet');
      setLoading(false);
    }
  };
  
  // Handle cancel wallet selection
  const handleCancelWalletSelection = () => {
    setShowWalletSelection(false);
    setPendingImportData(null);
    setWalletOptions([]);
    setLoading(false);
  };
  
  // Complete the wallet import process
  const completeImport = async (
    newKeypair: web3.Keypair,
    importMethod: 'seedPhrase' | 'privateKey',
    privateKey: string,
    seedPhrase?: string,
    seedPassword?: string
  ) => {
    // Log public key for debugging
    console.log('Wallet public key:', newKeypair.publicKey.toString());

    // Store wallet securely
    const walletData = {
      privateKey: privateKey, // Store private key in base58 format
      publicKey: newKeypair.publicKey.toString(),
      importMethod: importMethod,
      seedPhrase: seedPhrase,
      seedPassword: seedPassword,
      importedAt: new Date().toISOString(),
    };

    await SecureStore.setItemAsync(
      WALLET_STORAGE_KEY,
      JSON.stringify(walletData)
    );

    // Update state
    setKeypair(newKeypair);
    setPublicKey(newKeypair.publicKey.toString());
    setIsWalletImported(true);

    // Get balance
    const walletBalance = await getWalletBalance(newKeypair.publicKey);
    setBalance(walletBalance);
    setLoading(false);
  };

  // Load wallet from secure storage
  const loadStoredWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if we have a stored wallet
      const storedWalletData = await SecureStore.getItemAsync(WALLET_STORAGE_KEY);
      
      if (!storedWalletData) {
        setIsWalletImported(false);
        return null;
      }

      const walletData = JSON.parse(storedWalletData);
      
      let walletKeypair: web3.Keypair;
      
      // If we have a private key stored, use it (this is the source of truth)
      if (walletData.privateKey) {
        try {
          // Try to decode base58 format (our preferred storage format)
          const secretKey = bs58.decode(walletData.privateKey);
          walletKeypair = web3.Keypair.fromSecretKey(secretKey);
        } catch (err) {
          // Fall back to hex format for backward compatibility
          try {
            const privateKeyBytes = Buffer.from(walletData.privateKey, 'hex');
            walletKeypair = web3.Keypair.fromSecretKey(privateKeyBytes);
          } catch (hexErr) {
            console.error('Error loading wallet private key:', hexErr);
            setError('Failed to load wallet: Invalid key format');
            setIsWalletImported(false);
            return null;
          }
        }
      } else {
        // No private key found
        console.error('Missing private key in stored wallet data');
        setError('Failed to load wallet: Invalid storage format');
        setIsWalletImported(false);
        return null;
      }
      
      setKeypair(walletKeypair);
      setPublicKey(walletKeypair.publicKey.toString());
      setIsWalletImported(true);
      
      // Get balance
      const walletBalance = await getWalletBalance(walletKeypair.publicKey);
      setBalance(walletBalance);
      
      return walletKeypair;
    } catch (err) {
      console.error('Error loading stored wallet:', err);
      setError('Failed to load wallet');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Initial load of wallet
  useEffect(() => {
    loadStoredWallet();
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

  // Function to logout and reset wallet data
  const logout = async () => {
    try {
      setLoading(true);
      
      // Delete wallet data from secure storage
      await SecureStore.deleteItemAsync(WALLET_STORAGE_KEY);
      
      // Reset state
      setKeypair(null);
      setPublicKey(null);
      setBalance(0);
      setIsWalletImported(false);
      setError(null);
      
      console.log('Wallet data deleted successfully');
    } catch (err) {
      console.error('Error during logout:', err);
      setError('Failed to logout');
    } finally {
      setLoading(false);
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
        isWalletImported,
        refreshWallet,
        importWallet,
        logout,
      }}
    >
      {children}
      
      {/* Wallet Selection Modal */}
      <WalletSelectionModal
        visible={showWalletSelection}
        wallets={walletOptions}
        onSelect={handleWalletSelected}
        onCancel={handleCancelWalletSelection}
        loading={scanningWallets}
      />
    </WalletContext.Provider>
  );
}; 