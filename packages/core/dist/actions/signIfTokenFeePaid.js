"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signWithTokenFee = void 0;
const bs58_1 = __importDefault(require("bs58"));
const core_1 = require("../core");
/**
 * Sign transaction by fee payer if the first instruction is a transfer of token fee to given account
 *
 * @param connection           Connection to a Solana node
 * @param transaction          Transaction to sign
 * @param feePayer             Keypair for fee payer
 * @param maxSignatures        Maximum allowed signatures in the transaction including fee payer's
 * @param lamportsPerSignature Maximum fee payment in lamports
 * @param allowedTokens        List of tokens that can be used with token fee receiver accounts and fee details
 * @param cache                A cache to store duplicate transactions
 * @param sameSourceTimeout    An interval for transactions with same token fee source, ms
 *
 * @return {signature: string} Transaction signature by fee payer
 */
async function signWithTokenFee(connection, transaction, feePayer, maxSignatures, lamportsPerSignature, allowedTokens, cache, sameSourceTimeout = 5000) {
    // Prevent simple duplicate transactions using a hash of the message
    let key = `transaction/${bs58_1.default.encode((0, core_1.sha256)(transaction.serializeMessage()))}`;
    if (await cache.get(key))
        throw new Error('duplicate transaction');
    await cache.set(key, true);
    // Check that the transaction is basically valid, sign it, and serialize it, verifying the signatures
    const { signature, rawTransaction } = await (0, core_1.validateTransaction)(connection, transaction, feePayer, maxSignatures, lamportsPerSignature);
    await (0, core_1.validateInstructions)(transaction, feePayer);
    // Check that the transaction contains a valid transfer to Octane's token account
    const transfer = await (0, core_1.validateTransfer)(connection, transaction, allowedTokens);
    /*
       An attacker could make multiple signing requests before the transaction is confirmed. If the source token account
       has the minimum fee balance, validation and simulation of all these requests may succeed. All but the first
       confirmed transaction will fail because the account will be empty afterward. To prevent this race condition,
       simulation abuse, or similar attacks, we implement a simple lockout for the source token account
       for a few seconds after the transaction.
     */
    key = `transfer/lastSignature/${transfer.keys.source.pubkey.toBase58()}`;
    const lastSignature = await cache.get(key);
    if (lastSignature && Date.now() - lastSignature < sameSourceTimeout) {
        throw new Error('duplicate transfer');
    }
    await cache.set(key, Date.now());
    await (0, core_1.simulateRawTransaction)(connection, rawTransaction);
    return { signature: signature };
}
exports.signWithTokenFee = signWithTokenFee;
