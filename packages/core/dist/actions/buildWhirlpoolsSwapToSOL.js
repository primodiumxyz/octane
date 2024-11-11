"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWhirlpoolsSwapToSOL = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const core_1 = require("../core");
const swapProviders_1 = require("../swapProviders");
/**
 * Builds an unsigned transaction that performs a swap to SOL and optionally sends a token fee to Octane
 *
 * @param connection
 * @param feePayer
 * @param user
 * @param sourceMint
 * @param amount
 * @param slippingTolerance
 * @param cache
 * @param sameMintTimeout A required interval for transactions with same source mint and user, ms
 * @param feeOptions?
 *
 * @return Transaction
 */
async function buildWhirlpoolsSwapToSOL(connection, feePayer, user, sourceMint, amount, slippingTolerance, cache, sameMintTimeout = 3000, feeOptions) {
    // Connection's genesis hash is cached to prevent an extra RPC query to the node on each call.
    const genesisHashKey = `genesis/${connection.rpcEndpoint}`;
    let genesisHash = await cache.get(genesisHashKey);
    if (!genesisHash) {
        genesisHash = await connection.getGenesisHash();
        await cache.set(genesisHashKey, genesisHash);
    }
    if (!(0, core_1.isMainnetBetaCluster)(genesisHash)) {
        throw new Error('Whirlpools endpoint can only run attached to the mainnet-beta cluster');
    }
    if (amount.lte(new bn_js_1.default(0))) {
        throw new Error('Amount can\'t be zero or less');
    }
    if (feeOptions && feeOptions.amount < 0) {
        throw new Error('Fee can\'t be less than zero');
    }
    const key = `swap/${user.toString()}/${sourceMint.toString()}`;
    const lastSignature = await cache.get(key);
    if (lastSignature && Date.now() - lastSignature < sameMintTimeout) {
        throw new Error('Too many requests for same user and mint');
    }
    // cache.set() is in the end of the function
    const associatedSOLAddress = await (0, spl_token_1.getAssociatedTokenAddress)(spl_token_1.NATIVE_MINT, user);
    if ((await connection.getAccountInfo(associatedSOLAddress))) {
        throw new Error('Associated SOL account exists for user');
    }
    const context = swapProviders_1.whirlpools.getWhirlpoolsContext(connection);
    const [mintA, mintB] = swapProviders_1.whirlpools.getABMints(sourceMint, spl_token_1.NATIVE_MINT);
    const [whirlpool, quote] = await swapProviders_1.whirlpools.getPoolAndQuote(context, mintA, mintB, sourceMint, amount, slippingTolerance);
    const swapInstructions = await swapProviders_1.whirlpools.getSwapInstructions(feePayer.publicKey, user, context, whirlpool, quote, await (0, spl_token_1.getMinimumBalanceForRentExemptAccount)(connection));
    let feeTransferInstruction;
    if (feeOptions !== undefined) {
        feeTransferInstruction = (0, spl_token_1.createTransferInstruction)(feeOptions.sourceAccount, feeOptions.destinationAccount, user, feeOptions.amount);
    }
    const instructions = feeTransferInstruction ? [feeTransferInstruction, ...swapInstructions] : swapInstructions;
    const transaction = new web3_js_1.Transaction({
        feePayer: feePayer.publicKey,
        ...(await connection.getLatestBlockhash()),
    }).add(...instructions);
    await (0, core_1.simulateRawTransaction)(connection, transaction.serialize({ verifySignatures: false }));
    const messageToken = new core_1.MessageToken(swapProviders_1.whirlpools.MESSAGE_TOKEN_KEY, transaction.compileMessage(), feePayer).compile();
    // set last signature for mint and user
    await cache.set(key, Date.now());
    return { transaction, quote, messageToken };
}
exports.buildWhirlpoolsSwapToSOL = buildWhirlpoolsSwapToSOL;
