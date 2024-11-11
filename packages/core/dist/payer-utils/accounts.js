"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccounts = exports.buildCreateAccountListFromTokenFees = void 0;
const spl_token_1 = require("@solana/spl-token");
async function buildCreateAccountListFromTokenFees(connection, feePayer, tokenFees) {
    let createAccounts = [];
    for (const tokenFee of tokenFees) {
        const alreadyCreated = await connection.getAccountInfo(tokenFee.account);
        if (alreadyCreated) {
            continue;
        }
        const associatedWithFeePayer = tokenFee.account.equals(await (0, spl_token_1.getAssociatedTokenAddress)(tokenFee.mint, feePayer));
        if (!associatedWithFeePayer) {
            continue;
        }
        createAccounts.push({ mint: tokenFee.mint, address: tokenFee.account });
    }
    return createAccounts;
}
exports.buildCreateAccountListFromTokenFees = buildCreateAccountListFromTokenFees;
async function createAccounts(connection, feePayer, accounts) {
    let results = [];
    for (const account of accounts) {
        let error = null;
        try {
            await (0, spl_token_1.createAssociatedTokenAccount)(connection, feePayer, account.mint, feePayer.publicKey);
        }
        catch (e) {
            error = e;
        }
        results.push({ ...account, error });
    }
    return results;
}
exports.createAccounts = createAccounts;
