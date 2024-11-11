"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenFee = void 0;
const web3_js_1 = require("@solana/web3.js");
class TokenFee {
    mint;
    account;
    decimals;
    fee;
    constructor(mint, account, decimals, fee) {
        this.mint = mint;
        this.account = account;
        this.decimals = decimals;
        this.fee = fee;
    }
    toSerializable() {
        return {
            mint: this.mint.toBase58(),
            account: this.account.toBase58(),
            decimals: this.decimals,
            fee: Number(this.fee)
        };
    }
    static fromSerializable(serializableToken) {
        return new TokenFee(new web3_js_1.PublicKey(serializableToken.mint), new web3_js_1.PublicKey(serializableToken.account), serializableToken.decimals, BigInt(serializableToken.fee));
    }
}
exports.TokenFee = TokenFee;
