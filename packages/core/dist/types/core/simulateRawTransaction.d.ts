/// <reference types="node" />
/// <reference types="node" />
import { Connection, PublicKey, SimulatedTransactionResponse } from '@solana/web3.js';
export declare function simulateRawTransaction(connection: Connection, rawTransaction: Buffer, includeAccounts?: boolean | Array<PublicKey>): Promise<SimulatedTransactionResponse>;
