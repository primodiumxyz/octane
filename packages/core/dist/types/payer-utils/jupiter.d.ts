import { PublicKey, Transaction } from '@solana/web3.js';
export type TokenPriceInfo = {
    id: string;
    mintSymbol: string;
    vsToken: string;
    vsTokenSymbol: string;
    price: number;
};
export type Route = {
    inAmount: number;
    outAmount: number;
    amount: number;
    otherAmountThreshold: number;
    outAmountWithSlippage: number;
    swapMode: string;
    priceImpactPct: number;
    marketInfos: RouteMarketInfo[];
};
export type RouteMarketInfo = {
    id: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: number;
    outAmount: number;
    lpFee: RouteFee;
    platformFee: RouteFee;
    notEnoughLiquidity: boolean;
    priceImpactPct: number;
    minInAmount?: number;
    minOutAmount?: number;
};
export type RouteFee = {
    amount: number;
    mint: string;
    pct: number;
};
export type SwapTransactions = {
    setup: Transaction | null;
    swap: Transaction | null;
    cleanup: Transaction | null;
};
export declare function getPopularTokens(count: number, excludeNative?: boolean): Promise<PublicKey[]>;
export declare function getTokenToNativePriceInfo(mint: PublicKey): Promise<TokenPriceInfo>;
export declare function getRoutes(inputMint: PublicKey, outputMint: PublicKey, amount: BigInt, slippage: number): Promise<Route[]>;
export declare function getSwapTransactions(wallet: PublicKey, route: Route): Promise<SwapTransactions>;
