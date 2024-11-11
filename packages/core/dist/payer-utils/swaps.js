"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeSwapByRoute = exports.loadSwapRoutesForTokenFees = void 0;
const spl_token_1 = require("@solana/spl-token");
const jupiter_1 = require("./jupiter");
async function loadSwapRoutesForTokenFees(connection, tokenFees, thresholdInLamports, slippage = 0.5) {
    let routes = [];
    for (const tokenFee of tokenFees) {
        const account = await (0, spl_token_1.getAccount)(connection, tokenFee.account);
        if (account.amount === 0n) {
            continue;
        }
        const route = (await (0, jupiter_1.getRoutes)(tokenFee.mint, spl_token_1.NATIVE_MINT, account.amount, slippage))[0];
        if (route.outAmount < thresholdInLamports) {
            continue;
        }
        routes.push(route);
    }
    return routes;
}
exports.loadSwapRoutesForTokenFees = loadSwapRoutesForTokenFees;
async function executeSwapByRoute(connection, feePayer, route) {
    const transactions = await (0, jupiter_1.getSwapTransactions)(feePayer.publicKey, route);
    let txids = [];
    for (const transaction of [transactions.setup, transactions.swap, transactions.cleanup]) {
        if (transaction === null) {
            continue;
        }
        const txid = await connection.sendTransaction(transaction, [feePayer], { skipPreflight: true });
        await connection.confirmTransaction(txid);
        txids.push(txid);
    }
    return txids;
}
exports.executeSwapByRoute = executeSwapByRoute;
