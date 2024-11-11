import { Connection, Keypair, Transaction } from '@solana/web3.js';
import { TokenFee } from '../core';
import { Cache } from 'cache-manager';
/**
 * Sign transaction by fee payer if the first instruction is a transfer of a fee to given account and the second instruction
 * creates an associated token account with initialization fees by fee payer.
 *
 * @param connection           Connection to a Solana node
 * @param transaction          Transaction to sign
 * @param maxSignatures        Maximum allowed signatures in the transaction including fee payer's
 * @param lamportsPerSignature Maximum transaction fee payment in lamports
 * @param allowedTokens        List of tokens that can be used with token fee receiver accounts and fee details
 * @param feePayer             Keypair for fee payer
 * @param cache                A cache to store duplicate transactions
 * @param sameSourceTimeout    An interval for transactions with same token fee source, ms
 *
 * @return {signature: string} Transaction signature by fee payer
 */
export declare function createAccountIfTokenFeePaid(connection: Connection, transaction: Transaction, feePayer: Keypair, maxSignatures: number, lamportsPerSignature: number, allowedTokens: TokenFee[], cache: Cache, sameSourceTimeout?: number): Promise<{
    signature: string;
}>;
