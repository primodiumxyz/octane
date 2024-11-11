"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSwapInstructions = exports.getPoolAndQuote = exports.getABMints = exports.getWhirlpoolsContext = exports.MESSAGE_TOKEN_KEY = void 0;
const web3_js_1 = require("@solana/web3.js");
const whirlpools_sdk_1 = require("@orca-so/whirlpools-sdk");
const anchor_1 = require("@project-serum/anchor");
const common_sdk_1 = require("@orca-so/common-sdk");
const spl_token_1 = require("@solana/spl-token");
const WHIRLPOOL_PROGRAM_ID = new web3_js_1.PublicKey('whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc');
const WHIRLPOOL_CONFIG_KEY = new web3_js_1.PublicKey('2LecshUwdy9xi7meFgHtFJQNSKk4KdTrcpvaB56dP2NQ');
const WHIRLPOOL_TICK_SPACING = 64;
exports.MESSAGE_TOKEN_KEY = 'whirlpools-swap';
function getWhirlpoolsContext(connection) {
    // We use the context only for getting quotes and looking up instructions, so no need for real keypair
    const wallet = new anchor_1.Wallet(web3_js_1.Keypair.generate());
    return whirlpools_sdk_1.WhirlpoolContext.from(connection, wallet, WHIRLPOOL_PROGRAM_ID);
}
exports.getWhirlpoolsContext = getWhirlpoolsContext;
function getABMints(sourceMint, targetMint) {
    const [addressA, addressB] = whirlpools_sdk_1.PoolUtil.orderMints(sourceMint, targetMint);
    return [common_sdk_1.AddressUtil.toPubKey(addressA), common_sdk_1.AddressUtil.toPubKey(addressB)];
}
exports.getABMints = getABMints;
async function getPoolAndQuote(context, mintA, mintB, sourceMint, amount, slippingTolerance) {
    const client = (0, whirlpools_sdk_1.buildWhirlpoolClient)(context);
    const whirlpoolKey = whirlpools_sdk_1.PDAUtil.getWhirlpool(WHIRLPOOL_PROGRAM_ID, WHIRLPOOL_CONFIG_KEY, common_sdk_1.AddressUtil.toPubKey(mintA), common_sdk_1.AddressUtil.toPubKey(mintB), WHIRLPOOL_TICK_SPACING);
    const whirlpool = await client.getPool(whirlpoolKey.publicKey, true);
    const quote = await (0, whirlpools_sdk_1.swapQuoteByInputToken)(whirlpool, sourceMint, amount, slippingTolerance, WHIRLPOOL_PROGRAM_ID, context.fetcher, true);
    return [whirlpool, quote];
}
exports.getPoolAndQuote = getPoolAndQuote;
async function getSwapInstructions(feePayer, user, context, whirlpool, quote, rentExemptBalance) {
    const associatedSOLAddress = await (0, spl_token_1.getAssociatedTokenAddress)(spl_token_1.NATIVE_MINT, user);
    const setupInstructions = [
        (0, spl_token_1.createAssociatedTokenAccountInstruction)(feePayer, associatedSOLAddress, user, spl_token_1.NATIVE_MINT)
    ];
    const data = whirlpool.getData();
    const swapInstructions = whirlpools_sdk_1.WhirlpoolIx.swapIx(context.program, {
        ...quote,
        whirlpool: whirlpool.getAddress(),
        tokenAuthority: user,
        tokenOwnerAccountA: await (0, spl_token_1.getAssociatedTokenAddress)(data.tokenMintA, user),
        tokenVaultA: data.tokenVaultA,
        tokenOwnerAccountB: await (0, spl_token_1.getAssociatedTokenAddress)(data.tokenMintB, user),
        tokenVaultB: data.tokenVaultB,
        oracle: whirlpools_sdk_1.PDAUtil.getOracle(WHIRLPOOL_PROGRAM_ID, whirlpool.getAddress()).publicKey
    }).instructions;
    const cleanupInstructions = [
        (0, spl_token_1.createCloseAccountInstruction)(associatedSOLAddress, user, user),
        // createAssociatedTokenAccountInstruction transfers rent-exemption minimum from Octane to newly created token account.
        // when createCloseAccountInstruction sent the SOL output to user, it also included this rent-exemption minimum.
        web3_js_1.SystemProgram.transfer({
            fromPubkey: user,
            toPubkey: feePayer,
            lamports: rentExemptBalance,
        }),
    ];
    return [...setupInstructions, ...swapInstructions, ...cleanupInstructions];
}
exports.getSwapInstructions = getSwapInstructions;
