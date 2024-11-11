"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateRawTransaction = void 0;
const web3_js_1 = require("@solana/web3.js");
// Simulate a signed, serialized transaction before broadcasting
async function simulateRawTransaction(connection, rawTransaction, includeAccounts) {
    /*
       Simulating a transaction directly can cause the `signatures` property to change.
       Possibly related:
       https://github.com/solana-labs/solana/issues/21722
       https://github.com/solana-labs/solana/pull/21724
       https://github.com/solana-labs/solana/issues/20743
       https://github.com/solana-labs/solana/issues/22021

       Clone it from the bytes instead, and make sure it's likely to succeed before paying for it.

       Within simulateTransaction there is a "transaction instanceof Transaction" check. Since connection is passed
       from outside the library, it uses parent application's version of web3.js. "instanceof" won't recognize a match.
       Instead, let's explicitly call for simulateTransaction within the dependency of the library.
     */
    const simulated = await web3_js_1.Connection.prototype.simulateTransaction.call(connection, web3_js_1.VersionedTransaction.deserialize(rawTransaction), includeAccounts ? {
        accounts: {
            encoding: 'base64',
            addresses: Array.isArray(includeAccounts) ? includeAccounts.map(pk => pk.toString()) : []
        }
    } : undefined);
    if (simulated.value.err)
        throw new Error('Simulation error');
    return simulated.value;
}
exports.simulateRawTransaction = simulateRawTransaction;
