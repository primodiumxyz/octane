"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAccountInitializationInstructions = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const instructions_1 = require("./instructions");
async function validateAccountInitializationInstructions(connection, originalTransaction, feePayer, cache) {
    const transaction = web3_js_1.Transaction.from(originalTransaction.serialize({ requireAllSignatures: false }));
    // Transaction instructions should be: [fee transfer, account initialization]
    // The fee transfer is validated with validateTransfer in the action function.
    if (transaction.instructions.length != 2) {
        throw new Error('transaction should contain 2 instructions: fee payment, account init');
    }
    const [, instruction] = transaction.instructions;
    if (!instruction.programId.equals(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID)) {
        throw new Error('account instruction should call associated token program');
    }
    const [, , ownerMeta, mintMeta] = instruction.keys;
    const associatedToken = await (0, spl_token_1.getAssociatedTokenAddress)(mintMeta.pubkey, ownerMeta.pubkey);
    // Check if account isn't already created
    if (await connection.getAccountInfo(associatedToken, 'confirmed')) {
        throw new Error('account already exists');
    }
    const referenceInstruction = (0, spl_token_1.createAssociatedTokenAccountInstruction)(feePayer.publicKey, associatedToken, ownerMeta.pubkey, mintMeta.pubkey);
    if (!(0, instructions_1.areInstructionsEqual)(referenceInstruction, instruction)) {
        throw new Error('unable to match associated account instruction');
    }
    // Prevent trying to create same accounts too many times within a short timeframe (per one recent blockhash)
    const key = `account/${transaction.recentBlockhash}_${associatedToken.toString()}`;
    if (await cache.get(key))
        throw new Error('duplicate account within same recent blockhash');
    await cache.set(key, true);
}
exports.validateAccountInitializationInstructions = validateAccountInitializationInstructions;
