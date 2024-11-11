import { Keypair, Transaction } from '@solana/web3.js';
export declare function validateInstructions(transaction: Transaction, feePayer: Keypair): Promise<void>;
