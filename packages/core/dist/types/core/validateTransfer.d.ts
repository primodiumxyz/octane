import { DecodedTransferCheckedInstruction, DecodedTransferInstruction } from '@solana/spl-token';
import { Connection, Transaction } from '@solana/web3.js';
import { TokenFee } from './tokenFee';
export declare function validateTransfer(connection: Connection, transaction: Transaction, allowedTokens: TokenFee[]): Promise<DecodedTransferInstruction | DecodedTransferCheckedInstruction>;
