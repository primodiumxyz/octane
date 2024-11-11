import { Keypair, Message, PublicKey } from '@solana/web3.js';
/**
 * MessageToken generates and validates signatures for transaction payloads. It should be used to prove
 * authenticity of generated transactions, when some transaction claimed to be generated by Octane is submitted
 * by an untrusted source.
 */
export declare class MessageToken {
    key: string;
    message: Message;
    keypair: Keypair;
    constructor(key: string, message: Message, keypair: Keypair);
    compile(): string;
    static isValid(key: string, message: Message, token: string, publicKey: PublicKey): boolean;
}