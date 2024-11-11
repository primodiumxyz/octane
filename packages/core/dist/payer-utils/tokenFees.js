"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTokenFeeList = exports.createTokenFee = exports.getLamportsPerSignature = void 0;
const web3_js_1 = require("@solana/web3.js");
const core_1 = require("../core");
const spl_token_1 = require("@solana/spl-token");
async function getLamportsPerSignature(connection) {
    const transaction = new web3_js_1.Transaction();
    transaction.feePayer = web3_js_1.Keypair.generate().publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    const fee = await connection.getFeeForMessage(transaction.compileMessage());
    return fee?.value ?? 0;
}
exports.getLamportsPerSignature = getLamportsPerSignature;
function createTokenFee(mint, priceInfo, mintInfo, associatedAccount, params) {
    // convert params.costInLamports (price in SOL) to price in token
    const tokenPricePerSignature = priceInfo.price / web3_js_1.LAMPORTS_PER_SOL * params.costInLamports;
    // add desired margin
    // for example, price is 0.01, margin is 0.9, then (1 / (1 - margin)) = 10 and price after margin is 0.1.
    const tokenPriceAfterMargin = tokenPricePerSignature * (1 / (1 - params.margin));
    // convert to int per decimals setting of token
    const tokenPriceInDecimalNotation = Math.floor(tokenPriceAfterMargin * (10 ** mintInfo.decimals)) + 1;
    return new core_1.TokenFee(mint, associatedAccount, mintInfo.decimals, BigInt(tokenPriceInDecimalNotation));
}
exports.createTokenFee = createTokenFee;
function buildTokenFeeList(connection, feePayer, tokens, params) {
    return Promise.all(tokens.map(async (token) => createTokenFee(token.mint, token.priceInfo, await (0, spl_token_1.getMint)(connection, token.mint), await (0, spl_token_1.getAssociatedTokenAddress)(token.mint, feePayer), params)));
}
exports.buildTokenFeeList = buildTokenFeeList;
