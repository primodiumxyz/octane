import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { SwapQuote, Whirlpool, WhirlpoolContext } from '@orca-so/whirlpools-sdk';
import { Percentage } from '@orca-so/common-sdk';
import BN from 'bn.js';
export declare const MESSAGE_TOKEN_KEY = "whirlpools-swap";
export declare function getWhirlpoolsContext(connection: Connection): WhirlpoolContext;
export declare function getABMints(sourceMint: PublicKey, targetMint: PublicKey): [PublicKey, PublicKey];
export declare function getPoolAndQuote(context: WhirlpoolContext, mintA: PublicKey, mintB: PublicKey, sourceMint: PublicKey, amount: BN, slippingTolerance: Percentage): Promise<[Whirlpool, SwapQuote]>;
export declare function getSwapInstructions(feePayer: PublicKey, user: PublicKey, context: WhirlpoolContext, whirlpool: Whirlpool, quote: SwapQuote, rentExemptBalance: number): Promise<TransactionInstruction[]>;
