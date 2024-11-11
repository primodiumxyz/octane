import { Transaction, Connection, Keypair } from '@solana/web3.js';
import type { Cache } from 'cache-manager';
import { TokenFee } from '../core';
/**
 * Sign transaction by fee payer if the first instruction is a transfer of token fee to given account
 *
 * @param connection           Connection to a Solana node
 * @param transaction          Transaction to sign
 * @param feePayer             Keypair for fee payer
 * @param maxSignatures        Maximum allowed signatures in the transaction including fee payer's
 * @param lamportsPerSignature Maximum fee payment in lamports
 * @param allowedTokens        List of tokens that can be used with token fee receiver accounts and fee details
 * @param cache                A cache to store duplicate transactions
 * @param sameSourceTimeout    An interval for transactions with same token fee source, ms
 *
 * @return {signature: string} Transaction signature by fee payer
 */
export declare function signWithTokenFee(connection: Connection, transaction: Transaction, feePayer: Keypair, maxSignatures: number, lamportsPerSignature: number, allowedTokens: TokenFee[], cache: Cache, sameSourceTimeout?: number): Promise<{
    signature: string;
}>;
