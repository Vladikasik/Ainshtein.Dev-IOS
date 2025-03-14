import * as web3 from '@solana/web3.js';
import * as bip39 from 'bip39';
import * as SecureStore from 'expo-secure-store';
import { Buffer } from 'buffer';

// This should be moved to environment variables in a production app
const RPC_URL = process.env.RPC_URL || 'https://api.devnet.solana.com';
const SEED_PHRASE = process.env.SEED_PHRASE || '';
const SEED_CODE = process.env.SEED_CODE || '1';

// Get connection to Solana network
export const getConnection = () => {
  console.log('Creating connection to Solana network:', RPC_URL);
  return new web3.Connection(RPC_URL, 'confirmed');
};

// Get wallet keypair from environment variables
export const getWalletKeypair = async () => {
  try {
    console.log('Initializing wallet...');
    
    if (!SEED_PHRASE) {
      console.error('No seed phrase found in environment variables');
      throw new Error('Seed phrase not found');
    }
    
    console.log('SEED_PHRASE exists, length:', SEED_PHRASE.length);
    console.log('SEED_CODE exists:', !!SEED_CODE);
    
    // Generate seed buffer directly from mnemonic
    console.log('Generating seed buffer from mnemonic...');
    const seedBuffer = await bip39.mnemonicToSeed(SEED_PHRASE, SEED_CODE);
    console.log('Seed buffer generated, length:', seedBuffer.length);
    
    // Derive keypair from seed buffer (first 32 bytes)
    console.log('Deriving keypair from seed buffer...');
    const keypair = web3.Keypair.fromSeed(seedBuffer.slice(0, 32));
    console.log('Keypair generated, public key:', keypair.publicKey.toString());
    
    return keypair;
  } catch (error) {
    console.error('Error getting wallet keypair:', error);
    throw error;
  }
};

// Get wallet balance
export const getWalletBalance = async (pubkey: web3.PublicKey) => {
  try {
    console.log('Getting balance for pubkey:', pubkey.toString());
    const connection = getConnection();
    console.log('Connection established, fetching balance...');
    const balance = await connection.getBalance(pubkey);
    console.log('Raw balance (lamports):', balance);
    return balance / web3.LAMPORTS_PER_SOL; // Convert lamports to SOL
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw error;
  }
};

// Create a token
export const createToken = async (
  keypair: web3.Keypair,
  tokenName: string,
  tokenSymbol: string,
  tokenDescription: string,
  tokenSupply: number
) => {
  // This is a simplified version - in a real app you would use the Token Program
  // to create a new token with metadata
  console.log(`Creating token: ${tokenName} (${tokenSymbol})`);
  console.log(`Description: ${tokenDescription}`);
  console.log(`Supply: ${tokenSupply}`);
  
  // This would be replaced with actual token creation code
  return {
    tokenName,
    tokenSymbol,
    tokenDescription,
    tokenSupply,
    createdAt: new Date().toISOString(),
  };
}; 