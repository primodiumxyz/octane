"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInstructions = void 0;
// Prevent draining by making sure that the fee payer isn't provided as writable or a signer to any instruction.
// Throws an error if transaction contain instructions that could potentially drain fee payer.
async function validateInstructions(transaction, feePayer) {
    for (const instruction of transaction.instructions) {
        for (const key of instruction.keys) {
            if ((key.isWritable || key.isSigner) && key.pubkey.equals(feePayer.publicKey))
                throw new Error('invalid account');
        }
    }
}
exports.validateInstructions = validateInstructions;
