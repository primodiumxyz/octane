import { Connection, Transaction, Keypair } from '@solana/web3.js';
import { Cache } from 'cache-manager';
export declare function validateAccountInitializationInstructions(connection: Connection, originalTransaction: Transaction, feePayer: Keypair, cache: Cache): Promise<void>;
