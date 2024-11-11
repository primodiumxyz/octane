"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMainnetBetaCluster = void 0;
const MAINNET_BETA_GENESIS_HASH = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d';
function isMainnetBetaCluster(genesisHash) {
    return genesisHash === MAINNET_BETA_GENESIS_HASH;
}
exports.isMainnetBetaCluster = isMainnetBetaCluster;
