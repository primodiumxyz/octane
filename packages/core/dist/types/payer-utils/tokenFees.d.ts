import { Connection, PublicKey } from '@solana/web3.js';
import { TokenFee } from '../core';
import { TokenPriceInfo } from './jupiter';
import { Mint } from '@solana/spl-token';
export type TokenWithPriceInfo = {
    mint: PublicKey;
    priceInfo: TokenPriceInfo;
};
export type PricingParams = {
    costInLamports: number;
    margin: number;
};
export declare function getLamportsPerSignature(connection: Connection): Promise<number>;
export declare function createTokenFee(mint: PublicKey, priceInfo: TokenPriceInfo, mintInfo: Mint, associatedAccount: PublicKey, params: PricingParams): TokenFee;
export declare function buildTokenFeeList(connection: Connection, feePayer: PublicKey, tokens: TokenWithPriceInfo[], params: PricingParams): Promise<TokenFee[]>;
