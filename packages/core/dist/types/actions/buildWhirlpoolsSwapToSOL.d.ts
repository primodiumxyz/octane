import BN from 'bn.js';
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { SwapQuote } from '@orca-so/whirlpools-sdk';
import { Percentage } from '@orca-so/common-sdk';
import type { Cache } from 'cache-manager';
export type FeeOptions = {
    amount: number;
    sourceAccount: PublicKey;
    destinationAccount: PublicKey;
};
/**
 * Builds an unsigned transaction that performs a swap to SOL and optionally sends a token fee to Octane
 *
 * @param connection
 * @param feePayer
 * @param user
 * @param sourceMint
 * @param amount
 * @param slippingTolerance
 * @param cache
 * @param sameMintTimeout A required interval for transactions with same source mint and user, ms
 * @param feeOptions?
 *
 * @return Transaction
 */
export declare function buildWhirlpoolsSwapToSOL(connection: Connection, feePayer: Keypair, user: PublicKey, sourceMint: PublicKey, amount: BN, slippingTolerance: Percentage, cache: Cache, sameMintTimeout?: number, feeOptions?: FeeOptions): Promise<{
    transaction: Transaction;
    quote: SwapQuote;
    messageToken: string;
}>;
