import { PublicKey } from '@solana/web3.js';
type SerializableTokenFee = {
    mint: string;
    account: string;
    decimals: number;
    fee: number;
};
export declare class TokenFee {
    mint: PublicKey;
    account: PublicKey;
    decimals: number;
    fee: bigint;
    constructor(mint: PublicKey, account: PublicKey, decimals: number, fee: bigint);
    toSerializable(): SerializableTokenFee;
    static fromSerializable(serializableToken: SerializableTokenFee): TokenFee;
}
export {};
