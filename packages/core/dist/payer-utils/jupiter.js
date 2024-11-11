"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSwapTransactions = exports.getRoutes = exports.getTokenToNativePriceInfo = exports.getPopularTokens = void 0;
const axios_1 = __importDefault(require("axios"));
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
async function getPopularTokens(count, excludeNative = true) {
    const response = await axios_1.default.get('https://cache.jup.ag/top-tokens');
    const mints = response.data.map((mint) => new web3_js_1.PublicKey(mint));
    const filteredMints = excludeNative ? mints.filter(value => !value.equals(spl_token_1.NATIVE_MINT)) : mints;
    return filteredMints.slice(0, count);
}
exports.getPopularTokens = getPopularTokens;
async function getTokenToNativePriceInfo(mint) {
    const priceInfoResponse = (await axios_1.default.get('https://price.jup.ag/v1/price', { params: { id: 'SOL', vsToken: mint.toBase58() } })).data;
    return priceInfoResponse.data;
}
exports.getTokenToNativePriceInfo = getTokenToNativePriceInfo;
async function getRoutes(inputMint, outputMint, amount, slippage) {
    const params = {
        inputMint: inputMint.toBase58(),
        outputMint: outputMint.toBase58(),
        amount: amount,
        slippage: slippage,
    };
    const routesResponse = (await axios_1.default.get('https://quote-api.jup.ag/v1/quote', { params })).data;
    return routesResponse.data;
}
exports.getRoutes = getRoutes;
async function getSwapTransactions(wallet, route) {
    const decodeTransactionOrNull = (serialized) => (serialized !== null ? web3_js_1.Transaction.from(Buffer.from(serialized, 'base64')) : null);
    const response = (await axios_1.default.post('https://quote-api.jup.ag/v1/swap', {
        route,
        userPublicKey: wallet.toString(),
        wrapUnwrapSOL: true,
    }, {
        headers: { 'Content-Type': 'application/json' }
    })).data;
    return {
        setup: decodeTransactionOrNull(response.setupTransaction),
        swap: decodeTransactionOrNull(response.swapTransaction),
        cleanup: decodeTransactionOrNull(response.cleanupTransaction),
    };
}
exports.getSwapTransactions = getSwapTransactions;
