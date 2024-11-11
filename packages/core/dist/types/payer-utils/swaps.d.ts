import { Connection, Keypair } from '@solana/web3.js';
import { TokenFee } from '../core';
import { Route } from './jupiter';
export declare function loadSwapRoutesForTokenFees(connection: Connection, tokenFees: TokenFee[], thresholdInLamports: number, slippage?: number): Promise<Route[]>;
export declare function executeSwapByRoute(connection: Connection, feePayer: Keypair, route: Route): Promise<string[]>;
