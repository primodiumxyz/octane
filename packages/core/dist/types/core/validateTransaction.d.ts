/// <reference types="node" />
/// <reference types="node" />
import { Connection, Transaction, TransactionSignature, Keypair } from '@solana/web3.js';
export declare function validateTransaction(connection: Connection, transaction: Transaction, feePayer: Keypair, maxSignatures: number, lamportsPerSignature: number): Promise<{
    signature: TransactionSignature;
    rawTransaction: Buffer;
}>;
